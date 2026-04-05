# Backend Integration Guide: Login & User Management

This document outlines the required API updates and standardization steps for the **accounts** module to ensure seamless integration with the Frontend.

## 1. User Management Stats Update
**Endpoint**: `/api/accounts/users/stats/` (GET)

The Frontend dashboard requires an **unassigned** user count to display pending operational statuses.

**Current Response**:
```json
{
    "total": 100,
    "active": 80,
    "inactive": 20,
    "roles": { "coordinator": 40, "field_officer": 60 }
}
```

**Required Update**: Include `unassigned` key.
- **Logic**: Users with `assignment='unassigned'` (or 'standby').
```json
{
    "total": 100,
    "active": 80,
    "inactive": 20,
    "unassigned": 15, 
    "roles": { ... }
}
```

## 2. New Metadata Endpoint (Optimization)
**Suggested Endpoint**: `/api/accounts/users/metadata/` (GET)

Currently, the Frontend fetches the *entire* user list just to extract unique Organizations and Regions for the filter dropdowns. This is not scalable.

**Required Payload**:
```json
{
    "organizations": ["Org A", "Org B", ...],
    "regions": ["North", "South", ...],
    "roles": [
        {"value": "admin", "label": "Admin"},
        {"value": "coordinator", "label": "Coordinator"},
        {"value": "field_officer", "label": "Field Officer"}
    ]
}
```

## 3. Password Reset Flow (New Implementation)
The Frontend currently uses **Mock Functions** for the password recovery flow. The following endpoints are required in the `accounts` app:

1. **Request Reset**: `/api/accounts/password-reset/` (POST)
   - Input: `{ "email": "..." }`
   - Action: Send Email/OTP.
2. **Verify OTP**: `/api/accounts/password-reset/verify/` (POST)
   - Input: `{ "email": "...", "otp": "..." }`
   - Action: Validate tokens/OTP.
3. **Password Update**: `/api/accounts/password-reset/confirm/` (POST)
   - Input: `{ "email": "...", "password": "..." }`
   - Action: Hash and save new password.

## 4. API Standardization
- **Logout**: Ensure the `/api/accounts/logout/` view correctly blacklists the provided Refresh Token. 
- **Field Consistency**: While `AdminUserSerializer` currently handles both camelCase and snake_case in `create()`, please ensure **PATCH** (update) operations also support this, or clearly define snake_case as the mandatory standard for all input fields.

---
**Status**: Frontend is ready to integrate these once endpoints are live.
