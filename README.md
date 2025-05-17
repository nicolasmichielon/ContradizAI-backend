# ContradizAI Backend

A Node.js backend service built with TypeScript and Supabase.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd contradizai-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Build the project:
```bash
npm run build
```

## Development

To start the development server with hot-reload:
```bash
npm run dev
```

The server will start on http://localhost:3000 (or the port specified in your .env file).

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript project
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
src/
├── index.ts           # Application entry point
├── types/            # TypeScript type definitions
├── routes/           # API routes
├── controllers/      # Route controllers
├── services/         # Business logic
├── middleware/       # Custom middleware
└── utils/           # Utility functions
```

## API Documentation

The API documentation will be available at `/api-docs` when running in development mode.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT 