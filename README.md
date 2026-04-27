# 🚀 SocialMediaApp — REST API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-338?style=for-the-badge&logo=letsencrypt&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-000000?style=for-the-badge&logo=helmet&logoColor=white)

A full-featured social media backend built with **Node.js**, **TypeScript**, **Express**, **MongoDB**, and **Socket.IO**. Supports authentication, posts, comments, friends, real-time chat, GraphQL, and AWS S3 file storage.

[![Postman Docs](https://img.shields.io/badge/API_Documentation-Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://documenter.getpostman.com/view/45502181/2sB3HqHdvc)

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO |
| Auth | JWT (Access + Refresh Tokens) |
| File Storage | AWS S3 (single + multipart upload) |
| Query Layer | GraphQL (graphql-http) |
| Validation | Zod |
| Email | Nodemailer (Gmail) |
| OAuth | Google OAuth2 (ID Token) |
| Rate Limiting | express-rate-limit |
| Security | Helmet, CORS |

---

## 🗂️ Project Structure

```
src/
├── app.controller.ts          # App bootstrap, middleware setup
├── index.ts                   # Entry point
├── common/
│   ├── enum/                  # Enums (Role, Gender, Status, etc.)
│   └── interface/             # TypeScript interfaces
├── dataBase/
│   ├── model/                 # Mongoose models
│   └── Repository/            # Generic + specialized repositories
├── middlewares/
│   ├── authentication.ts      # JWT auth middleware
│   ├── authorization.ts       # Role-based access control
│   ├── checkOwnership.ts      # Resource ownership guard
│   ├── multer.cloud.ts        # File upload (memory/disk)
│   ├── validation.ts          # Zod schema validation
│   └── GlobalError.ts         # Global error handler
├── modules/
│   ├── users/                 # Auth, profile, friends, 2FA
│   ├── posts/                 # CRUD, likes, visibility
│   ├── comments/              # Nested comments (post & reply)
│   ├── chat/                  # REST + Socket.IO chat
│   ├── gateway/               # Socket.IO gateway & connection map
│   └── graphQl/               # GraphQL schema
├── service/
│   ├── sendEmail.ts           # Nodemailer transporter
│   └── EmailTemplate.ts       # HTML email template
└── utils/
    ├── Aws/                   # S3 upload, delete, signed URLs
    ├── event/                 # EventEmitter listeners
    ├── security/              # Hash, JWT sign/verify
    └── generalRules.ts        # Shared Zod rules
```

---

## ⚙️ Environment Variables

Create a `config/.env` file with the following:

```env
# App
PORT=5000

# Database
DB_URI=mongodb://...

# JWT Signatures
SIGNATURE_USER_TOKEN=
SIGNATURE_ADMIN_TOKEN=
REFRESH_SIGNATURE_USER_TOKEN=
REFRESH_SIGNATURE_ADMIN_TOKEN=

# Token Prefixes
BEARER_USER=
BEARER_ADMIN=

# Bcrypt
SALT_ROUND=10

# Email
EMAIL=
PASSWORD=

# Google OAuth
WEB_CLIENT_ID=

# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY_ID=
AWS_BUCKET=
AWS_APPLICATION=
S3_BASE_URL=

# Social Links (Email Template)
facebookLink=
instegram=
twitterLink=
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build
npm run build

# Run production
npm start
```

---

## 🔐 Authentication

All protected routes require an `Authorization` header:

```
Authorization: <BEARER_PREFIX> <JWT_TOKEN>
```

Two token types are supported:
- **Access Token** — short-lived (10 minutes), used for API requests
- **Refresh Token** — long-lived (1 year), used to generate new access tokens

Token invalidation is handled via a `RevokeToken` collection in MongoDB.

---

## 📡 API Endpoints

### 👤 Users — `/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signUp` | ❌ | Register a new user |
| PATCH | `/confirmEmail` | ❌ | Confirm email via OTP |
| POST | `/signIn` | ❌ | Login with email/password |
| POST | `/loginWithGmail` | ❌ | Login with Google ID token |
| GET | `/Profile` | ✅ | Get current user profile |
| GET | `/RefreshToken` | ✅ Refresh | Get new access + refresh tokens |
| POST | `/logout` | ✅ | Logout from current or all devices |
| PATCH | `/ForgetPassword` | ❌ | Send OTP to email |
| PATCH | `/resetPassword` | ❌ | Reset password using OTP |
| PATCH | `/updatePassword` | ✅ | Change password |
| PATCH | `/updateProfile` | ✅ | Update name / age |
| PATCH | `/updateEmail` | ✅ | Request email change (sends OTP) |
| PATCH | `/updateEmailConfirm` | ✅ | Confirm email change with OTP |
| PATCH | `/TwoFAEnable` | ✅ | Send 2FA OTP to email |
| PATCH | `/TwoFAEnableConfirm` | ✅ | Verify and enable 2FA |
| PATCH | `/TwoFADisable` | ✅ | Confirm login with 2FA OTP |
| POST | `/uploadImage` | ✅ | Get pre-signed S3 URL for profile image |
| DELETE | `/FreezeAccount` | ✅ | Soft-delete own account (or any if admin) |
| DELETE | `/unFreezeAccount/:userId` | ✅ Admin | Restore a frozen account |
| GET | `/adminDashboard` | ✅ Admin | Get all users and posts |
| PATCH | `/updateRole/:userId` | ✅ Admin | Update a user's role |
| POST | `/sendAddFriend/:userId` | ✅ | Send a friend request |
| PATCH | `/acceptORRejectAddFriend/:friendRequestId` | ✅ | Accept or reject a friend request |

---

### 📝 Posts — `/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create a post (text + images) |
| GET | `/` | ❌ | Get all posts (with comments) |
| PATCH | `/:PostId?action=like\|dislike` | ✅ | Like or dislike a post |
| PATCH | `/update/:PostId` | ✅ | Update a post |

**Post Visibility:** `public` / `private` / `friends`

---

### 💬 Comments — `/posts/:postId/comments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Comment on a post |
| POST | `/:commentId/reply` | ✅ | Reply to a comment |

---

### 💬 Chat — `/users/:userId/chats`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get all chats for user |
| GET | `/private/:receiverId` | ✅ | Get or initialize private chat |
| POST | `/groups` | ✅ | Create a group chat |
| GET | `/groups/:groupId` | ✅ | Get group chat + messages |
| POST | `/:chatId/seen` | ✅ | Mark all messages as seen |

---

### 🔷 GraphQL — `/graphql`

Endpoint supports queries and mutations over HTTP via `graphql-http`.

**Available Queries:**
```graphql
query {
  getOneUser(id: "...") { _id FName LName email gender }
  getUsers { _id FName LName email gender }
}
```

---

## 🔌 WebSocket Events (Socket.IO)

### Authentication
Pass the JWT token in the handshake:
```js
const socket = io(SERVER_URL, {
  auth: { authorization: `<BEARER_PREFIX> <ACCESS_TOKEN>` }
});
```

### Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `chat:join` | Client → Server | `{ chatId }` | Join a chat room |
| `message:send` | Client → Server | `{ chatId?, sendTo?, content, attachments[] }` | Send a message |
| `message:new` | Server → Client | `{ chatId, message }` | New message broadcast |
| `message:seen` | Client ↔ Server | `{ chatId }` | Mark messages as seen |
| `chat:updated` | Server → Client | `{ chatId, lastMessage }` | Chat list update |
| `online_user` | Server → All | `userId` | User came online |
| `offline_user` | Server → All | `userId` | User went offline |

**Private chat:** Send `sendTo` instead of `chatId` — the server creates the chat if it doesn't exist.

---

## 🗄️ Data Models

### User
- Roles: `user`, `admin`, `superAdmin`
- Providers: `system`, `google`
- Features: soft delete, email change, 2FA, friend list

### Post
- Visibility: `public`, `private`, `friends`
- Comments: allow / deny
- Soft delete with restore support

### Comment
- Polymorphic: can reference a `Post` or another `Comment` (reply)
- Soft delete with restore support

### Chat
- Supports private and group chats
- Tracks `lastMessage` and `roomId`

### Message
- Belongs to a `Chat`
- Tracks `seenBy` array

### Friend Request
- States: `pending`, `accepted`, `rejected`
- Auto-cleanup on rejection

---

## 🛡️ Security Features

- **Rate Limiting:** 50 requests per 5 minutes per IP
- **Helmet:** Secure HTTP headers
- **Token Revocation:** Blacklist via MongoDB TTL collection
- **Credential Invalidation:** `changeCredentials` timestamp invalidates all old tokens on logout-all or password change
- **Ownership Guard:** Users can only access their own resources (admins bypass)
- **Role-Based Access:** `user`, `admin`, `superAdmin` hierarchy
- **OTP Hashing:** All OTPs are bcrypt-hashed before storage

---

## 📁 File Upload

Two strategies are supported via `StorageType`:

| Strategy | Description |
|---|---|
| `cloud` | File stored in memory, uploaded directly to S3 |
| `disk` | File stored on disk (tmpdir), streamed to S3 |

Large files use S3 multipart upload (`@aws-sdk/lib-storage`).

Profile image uploads use **pre-signed S3 URLs** — the client uploads directly to S3, and an EventEmitter job verifies the upload and cleans up the old image.

---

## 📧 Email Events

All emails are sent asynchronously via Node.js `EventEmitter`:

| Event | Trigger |
|---|---|
| `confirmEmail` | After signup |
| `ForgetPassword` | Password reset request |
| `updateEmail` | Email change request |
| `TwoFAEnable` | 2FA setup |
| `UploadProfileImage` | Verifies S3 upload after pre-signed URL upload |

---

## 📐 Repository Pattern

All database access goes through a generic `dbRepository<T>` base class:

```
dbRepository<T>
├── create()
├── findOne()
├── find()
├── paginate()
├── findById()
├── updateOne()
├── findOneAndUpdate()
├── findByIdAndUpdate()
└── deleteOne()
```

Specialized repositories extend this base and add domain-specific methods (e.g., `messageRepository.getChatMessages()`).

---

## 📄 License

MIT
