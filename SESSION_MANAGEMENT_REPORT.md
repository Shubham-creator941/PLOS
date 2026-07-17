# Session Management Report

- Sessions are strictly managed by `AuthProvider`.
- JWT logic mocked using localStorage `auth_expires_at`.
- Expiry interval checks every minute and automatically calls `logout()`.