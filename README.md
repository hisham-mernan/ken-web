# Ken

Ken is an online booking system for locally built huts. The application provides users with a seamless experience to view, book, and manage hut reservations, as well as handle related services and transactions.

## Overview

Ken focuses on making traditional hut booking accessible and efficient. Users can explore available huts, schedule events, make purchases tied to their bookings, and monitor their transactions with built-in analytics.

## Project Goals

1. Display and book available huts during open hours
2. Create events that occur outside the huts
3. Sell products or services following hut bookings
4. Provide transaction management and insights through analytics

## Tech Stack

- **Framework**: React.js
- **Styling**: Tailwind CSS, Sass
- **UI Components**: PrimeReact, React Slick
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **State Management**: React Hooks
- **Notifications**: React Toastify
- **Map Integration**: React Leaflet
- **Internationalization**: i18next, react-i18next, i18next-http-backend, i18next-browser-languagedetector
- **HTTP Client**: Axios
- **Cookies Management**: js-cookie

## Folder Structure

```plaintext
ken/
├── public/
├── src/
│   ├── assets/               # Static resources: images, icons, fonts, and styles
│   ├── components/
│   │   ├── layout/           # Layout-related components
│   │   └── shared/           # Shared components reused across pages
│   ├── context/              # Global context providers for state management
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Application views/pages
│   ├── services/             # Axios instance and API URLs
│   ├── utils/                # Helper functions and common utilities
│   └── App.jsx
├── .env
└── README.md
```

## Documentation

- Architecture documents and decisions: [`docs/architecture/`](docs/architecture/)
- Feature and module design documents: [`docs/design/`](docs/design/)

## Project Setup

### Environment Variables

Before running the project, make sure to configure the following environment variables:

```env
VITE_REACT_APP_BASE_URL=""          # Base URL for API requests
VITE_REACT_FILE_SIZE="30"           # Maximum file size allowed for uploads (in MB)
VITE_REACT_APP_KEN_EMAIL            #ken email to contact with them
```

### Setup

1- Clone the repository:

```bash
git clone <repository_url>
```

2- Navigate to the project directory:

```bash
cd <project_directory>

```

3-Install dependencies:

```bash
npm install

```

4- Start the development server:

```bash
npm run dev

```
