import { SupabaseClient } from '@supabase/supabase-js';

interface TableDefinition {
  name: string;
  sql: string;
}

const tableDefinitions: TableDefinition[] = [
  {
    name: 'users',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );
    `
  },
  {
    name: 'chats',
    sql: `
      CREATE TABLE IF NOT EXISTS chats (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );
    `
  },
  {
    name: 'messages',
    sql: `
      CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        sender VARCHAR(50) NOT NULL CHECK (sender IN ('user', 'assistant')),
        text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );
    `
  }
];

export async function initializeDatabase(supabase: SupabaseClient) {
  try {
    for (const table of tableDefinitions) {
      const { error: checkError } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);

      if (checkError && checkError.code === '42P01') { // 42P01 é o código de erro para "table does not exist"
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: table.sql
        });

        if (createError) {
          console.error(`Error creating table ${table.name}:`, createError);
          throw createError;
        }
        console.log(`Table ${table.name} created successfully`);
      }
    }

    // Cria a função RPC para executar SQL se ela não existir
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$;
      `
    });

    if (functionError && !functionError.message.includes('already exists')) {
      console.error('Error creating exec_sql function:', functionError);
      throw functionError;
    }

    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 