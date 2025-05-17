# [Keeper - Password Manager](https://keeper-password-mgr.vercel.app/)

A secure and user-friendly password manager built with React and TypeScript. Store, manage, and generate strong passwords for all your online accounts.

## Features

- 🔐 Secure password storage with encryption
- 👤 User authentication and account management
- 🔑 Password generation with customizable options
- 📱 Responsive design for all devices
- 🔄 Real-time password updates
- 🔍 Search and filter passwords
- 📋 Copy passwords to clipboard
- 🎨 Modern UI 

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router
- **Notifications**: Sonner
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd whisper-key-safe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=your_api_url_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
├── config.ts      # Configuration and environment variables
└── App.tsx        # Root component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Security Features

- Client-side password encryption
- Secure token-based authentication
- Protected routes
- Password strength validation
- Secure password generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the amazing frontend library
