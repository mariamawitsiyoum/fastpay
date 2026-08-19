# FastPay Backend API Documentation

**Modules covered:** KYC Document Verification, Transaction Receipts
**Base URL (local development):** `http://localhost:8080`

---

## ⚠️ Known limitations

- No authentication yet — `user_id` / `reviewed_by` must be sent manually for now.
- KYC files are stored on local disk, not cloud storage yet.
- Admin review endpoint is not yet role-protected.
- No signup endpoint yet — users must already exist in the database.
- Receipt emails go to a hardcoded test address, not the real customer.

---

## Health Check

Confirms the server is running.

**`GET /health`**

**Response — `200 OK`**
```json
{
  "message": "success"
}
```

---

## KYC Endpoints

### 1. Upload KYC Document

Customer uploads an ID document. Creates a KYC record with `status: "pending"`.

**`POST /kyc/upload`**

**Body:** `multipart/form-data`

| Field | Type | Required | Notes |
|---|---|---|---|
| `user_id` | text | Yes | Must be an existing user's ID |
| `document_type` | text | No | Defaults to `"passport"` if omitted |
| `id_front` | file | Yes | The ID image/PDF file |

**Response — `201 Created`**
```json
{
  "kyc_id": 2,
  "message": "KYC document uploaded, pending review",
  "status": "pending"
}
```

**Response — `400 Bad Request`** (missing user_id or file)
```json
{ "error": "user_id is required" }
```
```json
{ "error": "id_front file is required" }
```

**Response — `500 Internal Server Error`**
```json
{ "error": "failed to save KYC record" }
```
> Common cause: `user_id` does not correspond to an existing user (foreign key violation).

---

### 2. Get Pending KYC Submissions

Returns all KYC records currently awaiting review. Intended for an admin's review queue.

**`GET /kyc/pending`**

**Response — `200 OK`**
```json
{
  "count": 1,
  "data": [
    {
      "ID": 2,
      "CreatedAt": "2026-08-19T09:53:28.718638+03:00",
      "UpdatedAt": "2026-08-19T09:53:28.718638+03:00",
      "DeletedAt": null,
      "UserID": 1,
      "User": {
        "ID": 0,
        "CreatedAt": "0001-01-01T00:00:00Z",
        "UpdatedAt": "0001-01-01T00:00:00Z",
        "DeletedAt": null,
        "Name": "",
        "Email": "",
        "Password": "",
        "Role": ""
      },
      "DocumentType": "passport",
      "IdBack": "",
      "IdFront": "uploads\\kyc\\kyc_1_1787122408.jpg",
      "Status": "pending",
      "ReviewedAt": null,
      "ReviewedBy": 0,
      "Notes": ""
    }
  ]
}
```

> Note: the nested `"User"` object is currently always empty (all zero values). The related user is not yet being loaded ("preloaded") from the database. Do not rely on this field until that's added.

---

### 3. Review (Approve/Reject) a KYC Submission

Admin approves or rejects a specific pending KYC record.

**`PATCH /kyc/:id/review`**

**URL parameter:** `id` — the KYC record's ID (not the user's ID)

**Body:** `application/json`

| Field | Type | Required | Notes |
|---|---|---|---|
| `decision` | string | Yes | Must be exactly `"verified"` or `"rejected"` |
| `notes` | string | No | Free-text reviewer notes |
| `reviewed_by` | number | Yes | ID of the admin reviewing (temporary — see limitations above) |

**Request example**
```json
{
  "decision": "verified",
  "notes": "Looks good",
  "reviewed_by": 1
}
```

**Response — `200 OK`**
```json
{
  "kyc_id": 2,
  "message": "KYC record updated",
  "status": "verified"
}
```

**Response — `400 Bad Request`** (invalid `decision` value, or missing required field)
```json
{ "error": "Key: 'ReviewKYCRequest.Decision' Error:Field validation for 'Decision' failed on the 'oneof' tag" }
```

**Response — `404 Not Found`**
```json
{ "error": "KYC record not found" }
```

**Response — `409 Conflict`** (already reviewed)
```json
{ "error": "this KYC record has already been reviewed" }
```

---

## Receipt Endpoints

### 4. Generate Transaction Receipt

Generates a PDF receipt (with an embedded QR code) for a completed transaction, saves a receipt record, and emails the receipt details to the customer.

**`POST /receipts/:reference/generate`**

**URL parameter:** `reference` — the transaction's unique reference string (e.g. `TXN-TEST-001`)

**Body:** none

**Response — `201 Created`**
```json
{
  "message": "receipt generated and emailed",
  "pdf_url": "uploads/receipts/receipt_TXN-TEST-001.pdf",
  "qr_url": "uploads/qrcodes/qr_TXN-TEST-001.png",
  "receipt_id": 4
}
```

**Response — `201 Created`** (receipt generated, but the email failed to send — the receipt itself is still saved successfully)
```json
{
  "message": "receipt generated, but email failed to send",
  "receipt_id": 4,
  "pdf_url": "uploads/receipts/receipt_TXN-TEST-001.pdf",
  "qr_url": "uploads/qrcodes/qr_TXN-TEST-001.png",
  "email_error": "..."
}
```

**Response — `404 Not Found`**
```json
{ "error": "transaction not found" }
```

> Note: the email is currently sent to a hardcoded test address, not the real customer's email — this depends on the auth/signup module being finished so the real customer's email can be looked up.

---

## Quick Reference Table

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Confirm server is running |
| POST | `/kyc/upload` | Customer uploads ID document |
| GET | `/kyc/pending` | Admin views pending KYC queue |
| PATCH | `/kyc/:id/review` | Admin approves/rejects a KYC submission |
| POST | `/receipts/:reference/generate` | Generate + email a transaction receipt |
