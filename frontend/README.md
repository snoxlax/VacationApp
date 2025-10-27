## Vacation Requests Frontend

React application for managing vacation requests with separate dashboards for Requesters and Validators.

### Tech Stack

- React 19
- React Router v7
- Vite
- Axios
- Context API
- CSS

### Setup

1. Install dependencies:

```powershell
npm install
```

2. Start development server:

```powershell
npm run dev
```

App runs on `http://localhost:5173`

### Features

#### Requester Dashboard

- Submit vacation requests
- View personal request history
- Filter by status (Pending, Approved, Rejected)
- View rejection comments

#### Validator Dashboard

- View all vacation requests
- Search requests by user name (with debounce)
- Filter by status
- Approve or reject requests with comments

### Architecture

- Component-based architecture with reusable components
- Context API for authentication state management
- Custom hooks (`useAuth`, `useDebounce`)
- Service layer for API calls
- Client-side validation before backend requests

### Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── context/       # React Context providers
├── hooks/         # Custom hooks
├── services/      # API calls
└── utils/         # Utility functions
```

### Build

```powershell
npm run build
```
