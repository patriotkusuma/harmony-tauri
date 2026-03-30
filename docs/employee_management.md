# Employee Management & RFID Login Documentation

This document describes the implementation of the Employee Management system and the enhanced RFID-based login flow, following the clean architecture principles.

## 1. Employee Management (V2)

The Employee Management module allows administrators and owners to manage employees, their user accounts, and their assignments to specific outlets.

### Endpoints

Base URL: `/api/v2/pegawais`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all employees. Supports `page`, `limit`, and `search` query params. |
| `POST` | `/` | Create a new employee, user account, and outlet assignments. |
| `GET` | `/:id` | Get details of a specific employee, including assigned outlets and RFID code. |
| `PUT` | `/:id` | Update employee details, user role, status, or outlet assignments. |
| `DELETE` | `/:id` | Delete an employee and their associated user account. |

### Data Structures

#### Create/Update Request
```json
{
  "nama": "John Doe",
  "email": "john.doe@example.com",
  "password": "secretpassword",
  "role": "pegawai",
  "alamat": "Jl. Merdeka No. 123",
  "telpon": "08123456789",
  "no_wa": "628123456789",
  "gaji": 5000000,
  "status": "active",
  "tanggal_masuk": "2024-01-01",
  "outlet_ids": ["outlet-uuid-1", "outlet-uuid-2"]
}
```

---

## 2. RFID Login Flow

The login flow has been enhanced to automatically handle outlet activation based on the user's role and assignments.

### Endpoint
`POST /api/auth/login/rfid`

**Request Body:**
```json
{
  "rfid_code": "RF123456"
}
```

### Logic Details
When a user logs in via RFID:
1.  **Validation**: The system checks if the RFID is of type `operator` and assigned to a valid user.
2.  **Token Generation**: A JWT token is generated and stored in Redis.
3.  **Outlet Activation**:
    *   **Pegawai**: The system automatically activates the first outlet linked to their employee profile.
    *   **Owner/Admin**: If no active session exists, the system defaults to the most recently created outlet in the system.
4.  **Response**: Returns the JWT token, User profile, and the `selected_outlet` data.

### Sample Response
```json
{
  "token": "eyJhbG...",
  "user": { ... },
  "selected_outlet": {
    "id": "outlet-uuid",
    "nama_outlet": "Harmony Central"
  }
}
```

---

## 3. Architecture Details

### File Structure
- **Domain**: `internal/domains/pegawai/` (Entity & Interface)
- **Use Case**: `internal/usecase/pegawai/` & `internal/usecase/user/login_by_rfid.go`
- **Infrastructure**: `internal/infrastructure/persistance/gorm/pegawai_repository.go`
- **Handler**: `internal/interface/http/handler/pegawai_handler.go`
- **Router**: `internal/interface/http/router_clean.go`

### Database Interaction
The system uses GORM with **manual transactions** in the repository layer to ensure that when a `Pegawai` is created, the corresponding `User` and `PegawaiOnOutlet` records are also created or roll back correctly on failure.
