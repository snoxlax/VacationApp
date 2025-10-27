## Objective

Develop a web application for managing vacation requests. The application should include two user interfaces:

1. **Requester Interface**: For employees to request vacations.
2. **Validator Interface**: For managers to review and approve/reject vacation requests.

The project must use **React.js** for the frontend, **Node.js** for the backend, and a **relational database** = PostgreSQL

---

## Deliverables

1. A working application deployed locally with clear instructions for setup.
2. Well-documented code and a brief explanation of your approach.
3. Basic test cases (unit tests or integration tests).

---

## Requirements

### Requester Interface

1. A form to submit vacation requests with the following fields:
   - **Start Date** (required)
   - **End Date** (required)
   - **Reason** (optional)
2. Display a list of the user's submitted requests with their statuses (Pending, Approved, or Rejected).

### Validator Interface

1. A dashboard displaying all submitted vacation requests.
2. Ability to filter requests by status (Pending, Approved, Rejected).
3. Buttons to **Approve** or **Reject** a request.
4. A comment field for providing feedback on rejected requests.

### Backend API (Node.js)

1. Endpoints for:
   - Submitting a vacation request.
   - Retrieving vacation requests (by requester or all for the validator).
   - Approving/rejecting a request with optional comments.
2. Input validation and error handling.
3. Use of RESTful principles.

### Database

- Tables for:
  1. **Users**: (id, name, role: Requester/Validator)
  2. **Vacation Requests**: (id, user_id, start_date, end_date, reason, status, comments, created_at)

---

## Additional Notes

- Use **React Router** for navigation between requester and validator interfaces.
- Use **Axios** for API calls.
- Use **Prisma** for database interaction.
- Ensure the UI is responsive and user-friendly.

---

## Evaluation Criteria

1. Code Quality:
   - Clean, modular, and well-documented code.
   - Use of modern JavaScript/ES6+ features.
2. Functionality:
   - Meets the requirements and handles edge cases.
3. Database Design:
   - Proper schema with efficient queries.
4. Creativity:
   - Any extra features or enhancements added.
5. Presentation:
   - Easy-to-follow setup instructions and a clear explanation of the implementation.

---

## **Instructions for the Candidate**

- Add a **README file** explaining:
  - How to install and run the project.
  - Technical choices made.
  - Any known limitations.
