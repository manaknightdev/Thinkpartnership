# Environment Configuration Guide

This project supports automatic switching between local development and production environments.

## How It Works

The application automatically detects the environment and uses the appropriate API base URL:

- **Development**: `http://localhost:5172` (local backend)
- **Production**: `https://baas.mytechpassport.com` (deployed backend)

## Available Scripts

### Development (Local Backend)
```bash
npm run dev          # Start dev server with local backend
npm run dev:local    # Same as above (explicit)
```

### Development (Production Backend)
```bash
npm run dev:prod     # Start dev server but use production backend
```

### Building
```bash
npm run build        # Build for production (uses production backend)
npm run build:dev    # Build for development (uses local backend)
npm run build:prod   # Build for production (explicit)
```

### Preview Built App
```bash
npm run preview      # Preview production build
npm run preview:dev  # Preview development build
npm run preview:prod # Preview production build (explicit)
```

## Environment Files

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env.local` - Local overrides (not tracked in git)
- `.env.local.example` - Example of local environment file

## Custom Configuration

If you need to override the API URL locally, create a `.env.local` file:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000  # Custom local backend port
```

## Debugging Environment

To see which environment is being used, check the browser console when the app loads. The environment configuration will be logged.

## Deployment

- **Netlify**: Automatically uses production environment
- **Local Development**: Automatically uses development environment
- **Manual Override**: Use `.env.local` file for custom settings
