# Route Protection Report

- Unauthenticated users are redirected to `/login`.
- Authenticated users hitting `/login` or `/` are redirected to `/dashboard` or intended destination.
- Intended destination is preserved using React Router `state={{ from: location }}`.