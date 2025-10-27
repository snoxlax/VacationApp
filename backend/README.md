## Vacation Requests Backend

REST API for managing vacation requests with role-based access control (Requester/Validator).

### Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT authentication

### Setup

1. Install dependencies:

```powershell
npm install
```

2. Create `.env` file:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=dev-secret-key-change-in-production-123456789
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://postgres:123123@localhost:5432/vacationdb
CORS_ORIGIN=http://localhost:5173
```

3. Run database migrations:

```powershell
npx prisma generate
npx prisma migrate dev
```

4. Start the server:

```powershell
npm run dev
```

Server runs on `http://localhost:5000`

### API Endpoints

Base URL: `http://localhost:5000/api`

#### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user

#### Requests (Requester)

- `POST /requests` - Submit vacation request
- `GET /requests/my-requests` - Get my requests

#### Requests (Validator)

- `GET /requests/all-requests` - Get all requests
- `PUT /requests/:id/approve` - Approve request
- `PUT /requests/:id/reject` - Reject request

### Testing

```powershell
npm test
```

### Architecture

- Routes → Controllers → Models → Database
- JWT authentication middleware
- Role-based authorization
- Input validation
- Rate limiting
