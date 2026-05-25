# NASTEA - Premium Matcha & Wellness E-commerce

A full-featured e-commerce web application for premium matcha and wellness products.

## Project Info

This is a Vite + React + TypeScript project with Supabase backend integration.

## How to Edit This Code

### Using Your Preferred IDE

Clone the repo and work locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd scoop-shop-replica-project

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

The server will start on `http://localhost:8080` with auto-reloading.

### Edit Files in GitHub

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right
- Make your changes and commit

### Using GitHub Codespaces

- Go to your repository main page
- Click the "Code" button (green button)
- Select "Codespaces" tab
- Click "New codespace" to launch
- Edit files and commit your changes

## Technology Stack

This project is built with:

- **Vite** - Fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn-ui** - Component library
- **Supabase** - Backend & Authentication
- **React Query** - Data fetching
- **React Router** - Navigation
- **Razorpay** - Payment processing

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (port 8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Project Structure

- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/contexts/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/integrations/supabase/` - Supabase configuration
- `supabase/functions/` - Edge functions
- `supabase/migrations/` - Database migrations

## Deployment

Build the project and deploy the `dist/` directory to your hosting:

```bash
npm run build
```

## Features

- Product catalog and shopping cart
- User authentication
- Checkout with Razorpay payment
- Admin dashboard
- Order management
- Recipe and journal content
- Blog functionality
- PWA support

## Learn More

For more information about the project structure and development workflow, see `CLAUDE.md`.
