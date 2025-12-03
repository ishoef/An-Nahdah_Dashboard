# An-Nahdah Academy Admin + Instructor Dashboard
## Production-Ready Specification

**Version:** 1.0  
**Last Updated:** 2025-11-28  
**Status:** Ready for Implementation

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Roles & Authentication](#roles--authentication)
4. [Database Schema](#database-schema)
5. [API Specification](#api-specification)
6. [Admin Features](#admin-features)
7. [Instructor Features](#instructor-features)
8. [Email System](#email-system)
9. [Notification System](#notification-system)
10. [Frontend Architecture](#frontend-architecture)
11. [Security & Compliance](#security--compliance)
12. [Scalability & Performance](#scalability--performance)
13. [Deployment Guide](#deployment-guide)
14. [Environment Setup](#environment-setup)

---

## Overview

An-Nahdah Academy is a comprehensive learning management system with distinct user roles and feature sets for administrators, instructors, and students. The system emphasizes:

- **Multi-role RBAC** with JWT-based authentication
- **Complete student lifecycle management** with activity tracking
- **Instructor salary & payout management** with audit trails
- **Email & notification systems** for engagement
- **Production-grade security** with consent management, encryption, and audit logs
- **Analytics & reporting** with real-time dashboards
- **Scalability** via caching, CDN, and pre-aggregated metrics

### Key Principles
- **Privacy-First:** Explicit consent for sensitive data; field-level encryption
- **Audit-Ready:** All admin actions logged immutably
- **Performance:** Server-side pagination, Redis caching, indexed queries
- **Security:** HTTPS, secure cookies, rate limiting, role-based access control
- **Developer-Friendly:** Clear contracts, migration paths, test scenarios

---

## Architecture

### Tech Stack (Recommended)
**Backend:**
- Next.js 16 (API Routes) OR Express + Node.js
- MongoDB (primary) or PostgreSQL (alternative)
- Redis (caching, sessions, job queue)
- Bull or Agenda (job scheduling)
- SendGrid or Mailgun (email)
- Firebase Cloud Messaging (push notifications)

**Frontend:**
- Next.js 16 (App Router) OR React 19 + Vite
- Tailwind CSS v4
- shadcn/ui components
- TanStack Query / React Query
- TanStack Table (data tables)
- Recharts (charting)
- react-hook-form + zod (validation)

**Infrastructure:**
- Vercel or Netlify (frontend)
- Render, Railway, or AWS ECS (backend)
- AWS S3 or Vercel Blob (file storage)
- AWS CloudFront or Cloudflare (CDN)
- MongoDB Atlas or Neon/Supabase (database)

### High-Level System Flow

\`\`\`
User (Student/Instructor/Admin)
    ↓
Next.js/Express App (RBAC Middleware)
    ↓
Auth Service (JWT + Refresh Tokens)
    ├→ Database (MongoDB/SQL)
    ├→ Redis (Sessions, Cache, Job Queue)
    └→ Third-Party Services
        ├→ Stripe (Payments)
        ├→ SendGrid (Email)
        ├→ Firebase (Push Notifications)
        ├→ S3/Blob (File Storage)
        └→ Analytics Services
\`\`\`

---

## Roles & Authentication

### Role Hierarchy

\`\`\`
ADMIN
  ├─ Full system access
  ├─ Manage all users (students, instructors)
  ├─ Approve/suspend/ban instructors
  ├─ Create courses, manage content
  ├─ Send global announcements & emails
  ├─ View analytics & reports
  ├─ Manage payouts
  └─ Access audit logs

INSTRUCTOR
  ├─ Create & manage own courses
  ├─ View enrolled students & their progress
  ├─ Upload teaching resources
  ├─ View payout history & income
  ├─ Respond to reviews
  ├─ Receive notifications (enrollments, payouts, announcements)
  └─ Access performance metrics per course

STUDENT
  ├─ Browse & enroll in courses
  ├─ Track personal learning progress
  ├─ Upload assignments / take quizzes
  ├─ Submit course reviews
  ├─ Receive notifications (new courses, announcements)
  └─ View profile & payment history
\`\`\`

### Authentication Flow

#### Option 1: JWT-Based (Recommended for Control)

**Implementation:**
\`\`\`
User Login (email + password)
    ↓
Verify credentials against passwordHash
    ↓
Sign JWT with { userId, role, email } payload
    ↓
Return { accessToken (15 min), refreshToken (7 days) }
    ↓
Client stores accessToken in memory, refreshToken in httpOnly cookie
    ↓
All requests include Authorization: Bearer {accessToken}
    ↓
Middleware verifies token; refresh if near expiry
\`\`\`

**Tokens:**
- **Access Token (JWT):** 15 minutes
- **Refresh Token (Secure HttpOnly Cookie):** 7 days
- **2FA Token (optional, for admins):** 5 minutes

**Payload Structure:**
\`\`\`json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "role": "admin|instructor|student",
    "email": "user@academy.edu",
    "name": "User Name",
    "verificationStatus": "verified|pending|unverified",
    "hasActivated2FA": true
  }
}
\`\`\`

#### Option 2: Firebase Authentication (Third-Party)

**Firebase Benefits:**
- Managed auth infrastructure
- No password hash storage
- Built-in account recovery
- Session management
- Support for OAuth providers

**Integration Points:**
\`\`\`
1. Use firebase/auth client library
2. Create custom claims for role in Firebase rules
3. Exchange Firebase ID token for custom backend JWT with role
4. Store role in database for RBAC enforcement
\`\`\`

**Recommended Hybrid Approach:**
- Use Firebase for credential management (email/password, OAuth)
- Store `firebaseUid` in database linked to user role
- Issue backend JWT with role claims for API access
- Use Firebase Admin SDK on backend to verify tokens

### RBAC Middleware

**Implementation (Express):**
\`\`\`javascript
// middleware/auth.js
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      required: roles,
      current: req.user.role
    });
  }
  
  next();
};

// Usage
app.get('/api/admin/students', verifyToken, requireRole('admin'), getStudents);
\`\`\`

**Implementation (Next.js Route Handler):**
\`\`\`typescript
// app/api/admin/students/route.ts
import { verifyAuth } from '@/lib/auth';
import { requireRole } from '@/lib/rbac';

export async function GET(req: Request) {
  const authResult = await verifyAuth(req);
  if (!authResult.ok) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!requireRole(['admin'])(authResult.user)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Handler logic
}
\`\`\`

### 2FA (Two-Factor Authentication)

**For Admins (Optional but Recommended):**

1. **Setup Flow:**
   - Admin enables 2FA in settings
   - Generate QR code (TOTP) using `speakeasy` library
   - User scans with authenticator app
   - Verify 6-digit code before activating
   - Store recovery codes (8 backup codes, hashed)

2. **Login Flow:**
   - Email + password verified
   - If 2FA enabled, return `requiresOTP: true`
   - User provides 6-digit code from authenticator
   - Verify against current TOTP
   - Issue tokens only after OTP verified

3. **Database Field:**
   \`\`\`json
   {
     "twoFAEnabled": true,
     "twoFASecret": "encrypted_secret",
     "twoFABackupCodes": ["hashed_code_1", "hashed_code_2", ...],
     "twoFAVerifiedAt": "2025-01-15T10:30:00Z"
   }
   \`\`\`

---

## Database Schema

### MongoDB Schema (Recommended)

All MongoDB documents include `_id` (ObjectId), `createdAt`, `updatedAt` (timestamps).

#### Users Collection

\`\`\`json
{
  "_id": ObjectId,
  "role": "student|instructor|admin",
  
  // Basic info
  "name": String,
  "email": String,        // unique, indexed
  "phone": String,
  "profileImageUrl": String,
  "bio": String,
  
  // Authentication
  "passwordHash": String,
  "firebaseUid": String,  // if using Firebase
  "refreshTokens": [
    { "token": String, "expiresAt": Date }
  ],
  "lastLoginAt": Date,
  
  // Admin & Security
  "twoFAEnabled": Boolean,
  "twoFASecret": String,  // encrypted
  "twoFABackupCodes": [String],
  "twoFAVerifiedAt": Date,
  
  // Instructor-specific
  "sector": String,       // category/subject area
  "credentials": [
    {
      "title": String,
      "issuer": String,
      "year": Number,
      "documentUrl": String
    }
  ],
  "verificationStatus": "unverified|pending|verified|rejected",
  "rejectionReason": String,
  
  // Student & Instructor fields
  "gender": String,       // optional
  "maritalStatus": String,    // only if consent.sensitiveData === true
  "childrenCount": Number,    // only if consent.sensitiveData === true
  
  // Consent & Privacy
  "consent": {
    "personalData": Boolean,
    "sensitiveData": Boolean,
    "marketing": Boolean,
    "consentedAt": Date,
    "consentVersion": String
  },
  
  // Instructor-specific fields
  "salaryTerms": {
    "baseAmount": Number,
    "currency": String,     // e.g., "USD", "EGP"
    "commissionRate": Number,   // 0-1, e.g., 0.15 for 15%
    "paymentMethod": "bank|mobile_money|stripe|cash",
    "bankDetails": {
      "accountName": String,
      "accountNumber": String,  // encrypted
      "routingNumber": String,  // encrypted
      "bankName": String
    },
    "mobileMoneyDetails": {
      "provider": String,   // "vodafone_cash", "orange_money", etc.
      "phoneNumber": String  // encrypted
    }
  },
  "totalEarnings": Number,
  "unpaidAmount": Number,
  
  // Status & metadata
  "status": "active|suspended|banned",
  "suspensionReason": String,
  "suspensionEndDate": Date,
  "bannedAt": Date,
  "bannedReason": String,
  
  "joinedAt": Date,
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.users.createIndex({ email: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ verificationStatus: 1 });
db.users.createIndex({ status: 1 });
db.users.createIndex({ joinedAt: -1 });
db.users.createIndex({ lastLoginAt: -1 });
db.users.createIndex({ sector: 1 });  // for instructor filtering
\`\`\`

#### Courses Collection

\`\`\`json
{
  "_id": ObjectId,
  "title": String,
  "slug": String,         // unique, indexed
  "description": String,
  "category": String,
  "tags": [String],
  
  // Pricing
  "price": Number,
  "currency": String,
  "instructorIds": [ObjectId],    // ref to users
  
  // Content
  "lessons": [
    {
      "id": String,       // UUID or lesson index
      "title": String,
      "durationSeconds": Number,
      "videoUrl": String,
      "resourceUrl": String,
      "position": Number
    }
  ],
  "totalDurationSeconds": Number,
  
  // Media
  "thumbnailUrl": String,
  "mediaReferences": [String],
  
  // Publishing
  "published": Boolean,
  "publishedAt": Date,
  "archivedAt": Date,
  
  // Stats (computed)
  "ratingAvg": Number,
  "ratingCount": Number,
  "totalEnrollments": Number,
  
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.courses.createIndex({ slug: 1 });
db.courses.createIndex({ instructorIds: 1 });
db.courses.createIndex({ published: 1 });
db.courses.createIndex({ category: 1 });
db.courses.createIndex({ createdAt: -1 });
\`\`\`

#### Enrollments Collection

\`\`\`json
{
  "_id": ObjectId,
  "courseId": ObjectId,       // ref to courses
  "studentId": ObjectId,      // ref to users (role=student)
  
  // Purchase info
  "purchasedAt": Date,
  "pricePaid": Number,
  "paymentMethod": "stripe|bank|mobile_money|cash",
  "orderId": String,          // unique ref
  "transactionId": String,    // from payment provider
  
  // Progress
  "progressPercent": Number,  // 0-100
  "lastActiveAt": Date,
  "activeTimeSeconds": Number,    // cumulative
  "completedAt": Date,
  
  // Status
  "status": "active|completed|refunded",
  
  // Enrollment metadata
  "enrolledAt": Date,
  "lastModule": String,       // last accessed lesson id
  
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.enrollments.createIndex({ courseId: 1, studentId: 1 }, { unique: true });
db.enrollments.createIndex({ studentId: 1 });
db.enrollments.createIndex({ courseId: 1 });
db.enrollments.createIndex({ purchasedAt: -1 });
db.enrollments.createIndex({ status: 1 });
\`\`\`

#### Activities Collection

Track user actions for analytics and timelines.

\`\`\`json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "type": "login|logout|video_watch|quiz_attempt|assignment_submit|course_enroll|review_submit|message_send",
  
  // Metadata varies by type
  "meta": {
    "courseId": ObjectId,
    "lessonId": String,
    "ip": String,
    "userAgent": String,
    "duration": Number,         // for video watches
    "score": Number,            // for quizzes
    "device": String            // "mobile|tablet|desktop"
  },
  
  "timestamp": Date,
  "createdAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.activities.createIndex({ userId: 1, timestamp: -1 });
db.activities.createIndex({ type: 1, timestamp: -1 });
db.activities.createIndex({ timestamp: -1 });
// TTL index to auto-delete old activity logs after 2 years
db.activities.createIndex({ timestamp: 1 }, { expireAfterSeconds: 63072000 });
\`\`\`

#### Reviews Collection

\`\`\`json
{
  "_id": ObjectId,
  "courseId": ObjectId,
  "studentId": ObjectId,
  "instructorId": ObjectId,
  
  "rating": Number,           // 1-5
  "comment": String,
  
  // Instructor response
  "instructorResponse": String,
  "respondedAt": Date,
  
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.reviews.createIndex({ courseId: 1, studentId: 1 }, { unique: true });
db.reviews.createIndex({ instructorId: 1 });
db.reviews.createIndex({ courseId: 1, rating: 1 });
\`\`\`

#### Payouts Collection

Salary & commission tracking for instructors.

\`\`\`json
{
  "_id": ObjectId,
  "instructorId": ObjectId,   // ref to users
  
  // Period
  "periodStart": Date,
  "periodEnd": Date,
  
  // Amounts (in smallest currency unit)
  "baseAmount": Number,       // e.g., 5000 (cents) = $50 USD
  "commissions": Number,      // from course sales
  "deductions": Number,       // refunds, penalties
  "taxes": Number,
  "netAmount": Number,        // base + commissions - deductions - taxes
  
  "currency": String,         // "USD", "EGP", "SAR"
  
  // Payment info
  "status": "pending|approved|paid|rejected",
  "paidAt": Date,
  "paymentMethod": "bank|mobile_money|stripe|cash",
  "paymentReference": String, // e.g., transfer ID
  "notes": String,
  
  // Audit
  "approvedBy": ObjectId,     // admin user id
  "approvedAt": Date,
  "rejectionReason": String,
  
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.payouts.createIndex({ instructorId: 1, periodStart: -1 });
db.payouts.createIndex({ status: 1 });
db.payouts.createIndex({ periodEnd: -1 });
\`\`\`

#### Notifications Collection

\`\`\`json
{
  "_id": ObjectId,
  
  // Recipients
  "toRole": "student|instructor|admin|all",
  "toUserId": ObjectId,   // null for role-based
  
  // Content
  "title": String,
  "body": String,
  "category": "announcement|enrollment|salary|system|review",
  
  // Additional data
  "data": {
    "courseId": ObjectId,
    "instructorId": ObjectId,
    "payoutId": ObjectId,
    "actionUrl": String,
    "customFields": {}
  },
  
  // Read tracking
  "readBy": [
    {
      "userId": ObjectId,
      "readAt": Date
    }
  ],
  
  // Push notification
  "pushSent": Boolean,
  "pushDeviceTokens": [String],
  
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.notifications.createIndex({ toRole: 1, createdAt: -1 });
db.notifications.createIndex({ toUserId: 1, createdAt: -1 });
db.notifications.createIndex({ "readBy.userId": 1 });
\`\`\`

#### Email Templates Collection

\`\`\`json
{
  "_id": ObjectId,
  "name": String,
  "subject": String,
  "htmlBody": String,
  "textBody": String,
  
  // Variables in template, e.g., {{student_name}}, {{course_title}}
  "variables": [String],
  "category": "announcement|promotional|transactional|enrollment",
  
  "createdBy": ObjectId,  // admin user id
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.email_templates.createIndex({ name: 1 });
db.email_templates.createIndex({ category: 1 });
\`\`\`

#### Email Logs Collection

\`\`\`json
{
  "_id": ObjectId,
  "campaignId": ObjectId,     // ref to campaigns (if applicable)
  "templateId": ObjectId,
  "toEmail": String,
  "toUserId": ObjectId,       // if known
  
  // Status from provider
  "status": "pending|sent|delivered|opened|clicked|bounced|complained|failed",
  "providerId": String,       // from SendGrid/Mailgun
  "providerStatus": String,   // provider-specific status
  
  // Timestamps
  "sentAt": Date,
  "deliveredAt": Date,
  "openedAt": Date,
  "clickedAt": Date,
  
  "bounceReason": String,     // if bounced
  "complaintReason": String,
  
  // Raw webhook event
  "rawEvent": Object,
  
  "createdAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.email_logs.createIndex({ toEmail: 1 });
db.email_logs.createIndex({ status: 1, createdAt: -1 });
db.email_logs.createIndex({ campaignId: 1 });
db.email_logs.createIndex({ createdAt: -1 });
// TTL: auto-delete logs older than 90 days
db.email_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
\`\`\`

#### Audit Logs Collection (Immutable)

\`\`\`json
{
  "_id": ObjectId,
  "actorUserId": ObjectId,    // admin who performed action
  "action": String,           // "CREATE_INSTRUCTOR", "APPROVE_PAYOUT", "BAN_USER"
  
  "target": {
    "type": String,           // "user", "course", "payout"
    "id": ObjectId
  },
  
  // Context
  "meta": {
    "before": Object,         // original state
    "after": Object,          // new state
    "reason": String,         // why (e.g., ban reason)
    "ip": String,
    "userAgent": String
  },
  
  "timestamp": Date,
  "createdAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.audit_logs.createIndex({ actorUserId: 1, timestamp: -1 });
db.audit_logs.createIndex({ "target.id": 1 });
db.audit_logs.createIndex({ action: 1, timestamp: -1 });
db.audit_logs.createIndex({ timestamp: -1 });
\`\`\`

#### Device Tokens Collection

For FCM push notifications.

\`\`\`json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "token": String,            // FCM device token
  "platform": "web|ios|android",
  "expiresAt": Date,
  
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

**Indexes:**
\`\`\`javascript
db.device_tokens.createIndex({ userId: 1 });
db.device_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
\`\`\`

### PostgreSQL Schema (Alternative)

If using PostgreSQL, here are the key tables:

\`\`\`sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  profile_image_url TEXT,
  bio TEXT,
  
  -- Authentication
  password_hash VARCHAR(255),
  firebase_uid VARCHAR(255),
  
  -- Admin/Security
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret VARCHAR(255),
  two_fa_verified_at TIMESTAMP,
  
  -- Instructor fields
  sector VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'unverified',
  rejection_reason TEXT,
  
  -- Optional fields (only if consent)
  gender VARCHAR(50),
  marital_status VARCHAR(50),
  children_count INTEGER,
  
  -- Consent
  consent_personal_data BOOLEAN DEFAULT FALSE,
  consent_sensitive_data BOOLEAN DEFAULT FALSE,
  consent_marketing BOOLEAN DEFAULT FALSE,
  consented_at TIMESTAMP,
  
  -- Instructor salary
  salary_base_amount DECIMAL(15,2),
  salary_currency VARCHAR(3),
  salary_commission_rate DECIMAL(5,4),
  salary_payment_method VARCHAR(50),
  
  total_earnings DECIMAL(15,2) DEFAULT 0,
  unpaid_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active',
  suspension_reason TEXT,
  suspension_end_date TIMESTAMP,
  banned_at TIMESTAMP,
  
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_verification_status ON users(verification_status);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_sector ON users(sector);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(255),
  price DECIMAL(15,2),
  currency VARCHAR(3),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  archived_at TIMESTAMP,
  
  thumbnail_url TEXT,
  
  total_duration_seconds INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  total_enrollments INTEGER DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_published ON courses(published);
CREATE INDEX idx_courses_category ON courses(category);

-- Course Instructors (junction table)
CREATE TABLE course_instructors (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, instructor_id)
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
  student_id UUID NOT NULL REFERENCES users(id),
  
  purchased_at TIMESTAMP,
  price_paid DECIMAL(15,2),
  payment_method VARCHAR(50),
  order_id VARCHAR(255),
  transaction_id VARCHAR(255),
  
  progress_percent DECIMAL(5,2) DEFAULT 0,
  active_time_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  last_active_at TIMESTAMP,
  last_module VARCHAR(255),
  
  status VARCHAR(50) DEFAULT 'active',
  
  enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(course_id, student_id)
);

CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_purchased_at ON enrollments(purchased_at DESC);

-- Activities
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  
  course_id UUID REFERENCES courses(id),
  lesson_id VARCHAR(255),
  ip VARCHAR(45),
  user_agent TEXT,
  duration INTEGER,
  score DECIMAL(5,2),
  device VARCHAR(50),
  
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_user_timestamp ON activities(user_id, timestamp DESC);
CREATE INDEX idx_activities_type_timestamp ON activities(type, timestamp DESC);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
  student_id UUID NOT NULL REFERENCES users(id),
  instructor_id UUID NOT NULL REFERENCES users(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  instructor_response TEXT,
  responded_at TIMESTAMP,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(course_id, student_id)
);

CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_reviews_instructor_id ON reviews(instructor_id);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES users(id),
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  base_amount DECIMAL(15,2),
  commissions DECIMAL(15,2) DEFAULT 0,
  deductions DECIMAL(15,2) DEFAULT 0,
  taxes DECIMAL(15,2) DEFAULT 0,
  net_amount DECIMAL(15,2),
  
  currency VARCHAR(3),
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  notes TEXT,
  
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_instructor_period ON payouts(instructor_id, period_start DESC);
CREATE INDEX idx_payouts_status ON payouts(status);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_role VARCHAR(50),
  to_user_id UUID REFERENCES users(id),
  
  title VARCHAR(255),
  body TEXT,
  category VARCHAR(50),
  data JSONB,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_to_role_created ON notifications(to_role, created_at DESC);
CREATE INDEX idx_notifications_to_user_created ON notifications(to_user_id, created_at DESC);

-- Notification Reads
CREATE TABLE notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  user_id UUID NOT NULL REFERENCES users(id),
  read_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(notification_id, user_id)
);

-- Email Templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  html_body TEXT,
  text_body TEXT,
  variables TEXT[],
  category VARCHAR(50),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Email Logs
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID,
  template_id UUID REFERENCES email_templates(id),
  to_email VARCHAR(255),
  to_user_id UUID REFERENCES users(id),
  
  status VARCHAR(50),
  provider_id VARCHAR(255),
  provider_status VARCHAR(255),
  
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  
  bounce_reason TEXT,
  complaint_reason TEXT,
  raw_event JSONB,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_logs_email_status ON email_logs(to_email, status);
CREATE INDEX idx_email_logs_status_created ON email_logs(status, created_at DESC);
CREATE INDEX idx_email_logs_campaign_id ON email_logs(campaign_id);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  
  target_type VARCHAR(50),
  target_id UUID,
  
  meta JSONB,
  ip VARCHAR(45),
  user_agent TEXT,
  
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_timestamp ON audit_logs(actor_user_id, timestamp DESC);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_action_timestamp ON audit_logs(action, timestamp DESC);

-- Device Tokens (FCM)
CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  platform VARCHAR(50),
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);
\`\`\`

---

## API Specification

### Authentication Endpoints

#### POST /api/auth/register
Register a new user (student or instructor).

**Request:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@academy.edu",
  "password": "SecurePass123!",
  "phone": "+201012345678",
  "role": "student|instructor",
  
  // If instructor
  "sector": "Technology",
  "bio": "Experienced instructor...",
  
  // Consent
  "consentPersonalData": true,
  "consentSensitiveData": false,
  "consentMarketing": true
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "ok": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "role": "student",
    "email": "jane@academy.edu",
    "name": "Jane Doe"
  },
  "message": "Registration successful. Please verify your email."
}
\`\`\`

**Error Responses:**
- `400`: Email already exists, weak password, missing fields
- `422`: Validation error (invalid email format, phone, etc.)

**Acceptance Criteria:**
- ✓ Email uniqueness enforced
- ✓ Password hashed with bcrypt (cost factor 12)
- ✓ Confirmation email sent
- ✓ Consent flags stored
- ✓ Account inactive until email verified (if required)

---

#### POST /api/auth/login
Authenticate and receive tokens.

**Request:**
\`\`\`json
{
  "email": "jane@academy.edu",
  "password": "SecurePass123!",
  "twoFACode": "123456"  // optional, if 2FA enabled
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "role": "instructor",
    "email": "jane@academy.edu",
    "name": "Jane Doe",
    "verificationStatus": "verified",
    "hasActivated2FA": false
  }
}
\`\`\`

**Response (202) - 2FA Required:**
\`\`\`json
{
  "ok": false,
  "requiresOTP": true,
  "message": "OTP required. Check your authenticator app."
}
\`\`\`

**Error Responses:**
- `401`: Invalid credentials
- `423`: Account suspended or banned
- `429`: Too many login attempts (rate limited)

**Acceptance Criteria:**
- ✓ Refresh token stored in httpOnly cookie (secure, sameSite: Strict)
- ✓ Access token in response body
- ✓ Rate limiting (5 attempts/15 min per IP)
- ✓ Log failed attempts
- ✓ Account lockout after 5 failed attempts (optional)

---

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
\`\`\`
POST /api/auth/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900  // seconds
}
\`\`\`

**Error Responses:**
- `401`: Invalid or expired refresh token
- `401`: Refresh token revoked (user logged out)

**Acceptance Criteria:**
- ✓ Validate refresh token signature and expiry
- ✓ Issue new access token
- ✓ Optionally rotate refresh token

---

#### POST /api/auth/logout
Logout and revoke tokens.

**Request:**
\`\`\`
POST /api/auth/logout
Authorization: Bearer {accessToken}
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "message": "Logged out successfully"
}
\`\`\`

**Actions:**
- ✓ Remove refresh token from database
- ✓ Clear httpOnly cookie
- ✓ Log audit event

---

### Admin Endpoints

#### GET /api/admin/summary
Fetch dashboard metrics.

**Query Parameters:**
\`\`\`
?from=2025-01-01&to=2025-01-31&groupBy=day
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": {
    "totalStudents": 1250,
    "newStudentsDaily": [
      { "date": "2025-01-01", "count": 15 },
      { "date": "2025-01-02", "count": 22 }
    ],
    "newStudentsWeekly": [...],
    "newStudentsMonthly": [...],
    
    "totalRevenue": 125000,
    "revenueDaily": [...],
    "revenueMonthly": [...],
    
    "activeStudentsDaily": [
      { "date": "2025-01-01", "count": 450 }
    ],
    "activeSessions": 125,
    "avgSessionDuration": 2400,  // seconds
    
    "completionRate": 0.68,
    "retentionRate": 0.82,
    "churnRate": 0.18,
    
    "topCourses": [
      {
        "courseId": "507f1f77bcf86cd799439012",
        "title": "Advanced React",
        "enrollments": 320,
        "revenue": 48000
      }
    ]
  }
}
\`\`\`

**Middleware:** `verifyToken`, `requireRole(['admin'])`

**Backend Logic:**
- Query pre-aggregated data from Redis cache
- If cache miss, compute from activities/enrollments and cache for 1 hour
- Use database indexes on timestamp and status fields

---

#### GET /api/admin/students
List all students with pagination and filters.

**Query Parameters:**
\`\`\`
?page=1&limit=20&q=john&sortBy=joinedAt&order=desc
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@academy.edu",
      "phone": "+201012345678",
      "joinedAt": "2025-01-15T10:30:00Z",
      "lastLoginAt": "2025-01-28T14:20:00Z",
      "status": "active",
      "totalCourses": 3,
      "totalSpent": 15000,
      "profileImageUrl": "https://..."
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "pages": 63
  }
}
\`\`\`

**Acceptance Criteria:**
- ✓ Server-side pagination (limit max 100)
- ✓ Search by name, email, phone
- ✓ Filter by status, joinedAt range
- ✓ Sort by any field
- ✓ Sensitive fields (maritalStatus, childrenCount) excluded unless consent flag set

---

#### GET /api/admin/students/:id
Fetch detailed student profile and activity.

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@academy.edu",
    "phone": "+201012345678",
    "profileImageUrl": "https://...",
    "joinedAt": "2025-01-15T10:30:00Z",
    "lastLoginAt": "2025-01-28T14:20:00Z",
    "status": "active",
    
    "consent": {
      "personalData": true,
      "sensitiveData": false,
      "marketing": true,
      "consentedAt": "2025-01-15T10:30:00Z"
    },
    
    "enrollments": [
      {
        "courseId": "507f1f77bcf86cd799439012",
        "courseTitle": "Advanced React",
        "enrolledAt": "2025-01-20T09:00:00Z",
        "purchasedAt": "2025-01-20T09:00:00Z",
        "pricePaid": 5000,
        "progressPercent": 65,
        "lastActiveAt": "2025-01-28T10:00:00Z",
        "status": "active"
      }
    ],
    
    "activityTimeline": [
      {
        "type": "login",
        "timestamp": "2025-01-28T14:20:00Z",
        "meta": { "ip": "192.168.1.1", "device": "desktop" }
      },
      {
        "type": "video_watch",
        "timestamp": "2025-01-28T14:00:00Z",
        "meta": { "courseId": "...", "duration": 1800 }
      }
    ],
    
    "stats": {
      "totalActiveTime": 14400,  // seconds
      "totalCourses": 3,
      "completedCourses": 1,
      "totalSpent": 15000
    }
  }
}
\`\`\`

**Acceptance Criteria:**
- ✓ Return activity paginated (last 50 events)
- ✓ Exclude sensitive fields unless explicitly requested with admin verification
- ✓ Cache student profile for 5 minutes

---

#### GET /api/admin/instructors
List instructors with filters.

**Query Parameters:**
\`\`\`
?page=1&limit=20&q=ahmed&sector=Technology&status=active&verificationStatus=verified
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439020",
      "name": "Ahmed Hassan",
      "email": "ahmed@academy.edu",
      "phone": "+201012345678",
      "sector": "Technology",
      "joinedAt": "2025-01-01T09:00:00Z",
      "status": "active",
      "verificationStatus": "verified",
      "courseCount": 5,
      "totalStudents": 450,
      "totalEarnings": 125000,
      "profileImageUrl": "https://...",
      "avgRating": 4.8,
      "ratingCount": 120
    }
  ],
  "pagination": { "total": 85, "page": 1, "limit": 20, "pages": 5 }
}
\`\`\`

---

#### POST /api/admin/instructors
Create new instructor.

**Request:**
\`\`\`json
{
  "name": "Ahmed Hassan",
  "email": "ahmed@academy.edu",
  "phone": "+201012345678",
  "sector": "Technology",
  "bio": "Experienced instructor...",
  "gender": "male",
  
  "credentials": [
    {
      "title": "BS Computer Science",
      "issuer": "Cairo University",
      "year": 2015,
      "documentUrl": "https://s3.../credential-1.pdf"
    }
  ],
  
  "salaryTerms": {
    "baseAmount": 5000,
    "currency": "EGP",
    "commissionRate": 0.15,
    "paymentMethod": "bank",
    "bankDetails": {
      "accountName": "Ahmed Hassan",
      "accountNumber": "1234567890",
      "routingNumber": "000000000",
      "bankName": "National Bank"
    }
  },
  
  "consentPersonalData": true,
  "consentSensitiveData": true
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "ok": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "name": "Ahmed Hassan",
    "email": "ahmed@academy.edu",
    "verificationStatus": "pending",
    "status": "active"
  },
  "message": "Instructor created. Activation email sent."
}
\`\`\`

**Actions:**
- ✓ Send activation email with set-password link (token valid 48 hours)
- ✓ Create audit log
- ✓ Send in-app notification to instructor
- ✓ Encrypt sensitive fields (bank details, etc.)

---

#### PUT /api/admin/instructors/:id
Update instructor details.

**Request:**
\`\`\`json
{
  "name": "Ahmed Hassan",
  "sector": "Technology",
  "bio": "...",
  "verificationStatus": "verified",
  "status": "active"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": { "id": "...", "name": "..." }
}
\`\`\`

**Acceptance Criteria:**
- ✓ Log all changes in audit trail
- ✓ Notify instructor of status changes (verification, suspension)

---

#### POST /api/admin/instructors/:id/suspend
Suspend or ban instructor.

**Request:**
\`\`\`json
{
  "reason": "Inappropriate content in course reviews",
  "suspensionDays": 30,
  "action": "suspend|ban"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "message": "Instructor suspended for 30 days"
}
\`\`\`

**Actions:**
- ✓ Audit log with reason
- ✓ Notify instructor (email + in-app)
- ✓ Unpublish courses if banned
- ✓ If suspend, auto-reactivate after period

---

#### GET /api/admin/courses
List courses with analytics.

**Query Parameters:**
\`\`\`
?page=1&limit=20&published=true&category=Technology
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Advanced React",
      "slug": "advanced-react",
      "category": "Technology",
      "price": 5000,
      "instructorIds": ["..."],
      "instructorNames": ["Ahmed Hassan", "Fatima Ali"],
      "published": true,
      "publishedAt": "2025-01-10T09:00:00Z",
      "totalDurationSeconds": 14400,
      
      "stats": {
        "totalEnrollments": 320,
        "completionRate": 0.68,
        "avgProgress": 0.56,
        "avgRating": 4.7,
        "ratingCount": 120,
        "revenue": 1600000  // total price * enrollments (approx)
      }
    }
  ],
  "pagination": { "total": 85, "page": 1, "limit": 20, "pages": 5 }
}
\`\`\`

---

#### POST /api/admin/courses
Create new course.

**Request:**
\`\`\`json
{
  "title": "Advanced React",
  "description": "Master React hooks, context, and performance...",
  "category": "Technology",
  "tags": ["react", "frontend", "javascript"],
  "price": 5000,
  "currency": "EGP",
  "instructorIds": ["507f1f77bcf86cd799439020"],
  
  "lessons": [
    {
      "title": "Getting Started",
      "durationSeconds": 1800,
      "videoUrl": "https://...",
      "position": 1
    }
  ],
  
  "thumbnailUrl": "https://...",
  "published": false
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "ok": true,
  "data": { "id": "507f1f77bcf86cd799439012", "slug": "advanced-react" }
}
\`\`\`

---

#### GET /api/admin/reports/revenue
Revenue report with grouping.

**Query Parameters:**
\`\`\`
?from=2025-01-01&to=2025-01-31&groupBy=day
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": {
    "period": { "from": "2025-01-01", "to": "2025-01-31" },
    "totalRevenue": 1234567,
    "revenue": [
      { "date": "2025-01-01", "amount": 45000, "transactionCount": 12 },
      { "date": "2025-01-02", "amount": 52000, "transactionCount": 15 }
    ],
    "byPaymentMethod": {
      "stripe": 600000,
      "bank": 350000,
      "mobile_money": 284567
    },
    "byCourse": [
      { "courseTitle": "Advanced React", "revenue": 320000 },
      { "courseTitle": "Vue Mastery", "revenue": 280000 }
    ]
  }
}
\`\`\`

---

#### GET /api/admin/exports/enrollments
Export enrollments as CSV.

**Query Parameters:**
\`\`\`
?from=2025-01-01&to=2025-01-31&format=csv
\`\`\`

**Response:**
\`\`\`
Content-Type: text/csv
Content-Disposition: attachment; filename="enrollments_2025-01-01_2025-01-31.csv"

enrollmentId,studentName,studentEmail,courseTitle,purchasedAt,pricePaid,progressPercent,status
507f1f77bcf86cd799439011,John Doe,john@academy.edu,Advanced React,2025-01-20,5000,65,active
...
\`\`\`

---

#### POST /api/admin/email/send
Send email announcement.

**Request:**
\`\`\`json
{
  "templateId": "507f1f77bcf86cd799439030",
  "subject": "New Course Available",
  "htmlBody": "<h1>{{announcement_title}}</h1><p>{{announcement_body}}</p>",
  "textBody": "{{announcement_title}}\n\n{{announcement_body}}",
  
  "recipients": {
    "type": "all|course|category|custom",
    "courseIds": ["507f1f77bcf86cd799439012"],
    "categories": ["Technology"],
    "customEmails": ["user1@test.com", "user2@test.com"]
  },
  
  "variables": {
    "announcement_title": "React 19 Course Launch",
    "announcement_body": "We're excited to announce..."
  },
  
  "sendAt": "2025-02-01T10:00:00Z",  // optional, for scheduling
  "trackingEnabled": true
}
\`\`\`

**Response (202):**
\`\`\`json
{
  "ok": true,
  "campaignId": "507f1f77bcf86cd799439040",
  "recipientCount": 450,
  "message": "Email campaign queued for sending"
}
\`\`\`

**Acceptance Criteria:**
- ✓ Support immediate & scheduled sends
- ✓ Validate all recipient emails
- ✓ Deduplicate emails
- ✓ Respect unsubscribe flags
- ✓ Rate limit SendGrid (max 30K/min)
- ✓ Log campaign in email_logs collection

---

### Instructor Endpoints

#### GET /api/instructor/dashboard
Fetch instructor dashboard metrics.

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": {
    "totalIncome": 125000,
    "unpaidAmount": 35000,
    "courseCount": 5,
    "totalStudents": 450,
    "avgRating": 4.7,
    
    "recentSalaries": [
      {
        "periodStart": "2025-01-01",
        "periodEnd": "2025-01-31",
        "baseAmount": 5000,
        "commissions": 25000,
        "netAmount": 30000,
        "status": "paid",
        "paidAt": "2025-02-05T14:30:00Z"
      }
    ],
    
    "recentNotifications": [
      {
        "id": "...",
        "title": "New enrollment in Advanced React",
        "body": "John Doe enrolled in your course",
        "createdAt": "2025-01-28T14:20:00Z",
        "readAt": null
      }
    ],
    
    "courses": [
      {
        "id": "507f1f77bcf86cd799439012",
        "title": "Advanced React",
        "revenue": 32000,
        "enrollments": 32,
        "completionRate": 0.68,
        "avgProgress": 0.56,
        "avgRating": 4.8,
        "ratingCount": 45
      }
    ]
  }
}
\`\`\`

---

#### GET /api/instructor/courses
List instructor's courses.

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Advanced React",
      "published": true,
      "price": 5000,
      "enrollmentCount": 32,
      "completionRate": 0.68,
      "avgRating": 4.8,
      "totalRevenue": 160000,
      "lastPublishedAt": "2025-01-10T09:00:00Z"
    }
  ]
}
\`\`\`

---

#### GET /api/instructor/courses/:courseId/students
List students enrolled in a specific course.

**Query Parameters:**
\`\`\`
?page=1&limit=20&sortBy=enrolledAt&order=desc
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@academy.edu",
      "enrolledAt": "2025-01-20T09:00:00Z",
      "progressPercent": 65,
      "lastActiveAt": "2025-01-28T10:00:00Z",
      "activeTimeSeconds": 7200,
      "lastModule": "lesson-3"
    }
  ],
  "pagination": { "total": 32, "page": 1, "limit": 20, "pages": 2 }
}
\`\`\`

---

#### GET /api/instructor/payouts
Fetch instructor's payout history.

**Query Parameters:**
\`\`\`
?page=1&limit=20&from=2025-01-01&to=2025-01-31&status=paid
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439040",
      "periodStart": "2025-01-01",
      "periodEnd": "2025-01-31",
      "baseAmount": 5000,
      "commissions": 25000,
      "deductions": 500,
      "taxes": 3000,
      "netAmount": 26500,
      "currency": "EGP",
      "status": "paid",
      "paidAt": "2025-02-05T14:30:00Z",
      "paymentMethod": "bank",
      "notes": "Monthly payout for January"
    }
  ],
  "pagination": { "total": 12, "page": 1, "limit": 20, "pages": 1 }
}
\`\`\`

---

#### POST /api/instructor/resources
Upload teaching resources (presigned URL flow).

**Request (Step 1): Get Presigned URL**
\`\`\`json
{
  "fileName": "React-Advanced-Guide.pdf",
  "mimeType": "application/pdf",
  "size": 2097152  // 2MB
}
\`\`\`

**Response:**
\`\`\`json
{
  "ok": true,
  "uploadUrl": "https://s3.amazonaws.com/bucket/uploads/123456?signature=...",
  "fileKey": "uploads/instructors/507f1f77bcf86cd799439020/React-Advanced-Guide.pdf",
  "expiresIn": 3600  // seconds
}
\`\`\`

**Request (Step 2): Upload via Presigned URL**
\`\`\`
PUT https://s3.amazonaws.com/bucket/uploads/123456?signature=...
Content-Type: application/pdf

[binary file data]
\`\`\`

**Request (Step 3): Confirm Upload**
\`\`\`json
POST /api/instructor/resources/confirm
{
  "fileKey": "uploads/instructors/507f1f77bcf86cd799439020/React-Advanced-Guide.pdf",
  "courseId": "507f1f77bcf86cd799439012",
  "title": "Advanced React Guide",
  "description": "Complete guide to React hooks..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "ok": true,
  "resource": {
    "id": "507f1f77bcf86cd799439050",
    "title": "Advanced React Guide",
    "url": "https://academy.com/resources/507f1f77bcf86cd799439050",
    "uploadedAt": "2025-01-28T14:30:00Z"
  }
}
\`\`\`

---

### Notification Endpoints

#### GET /api/notifications
Fetch user notifications.

**Query Parameters:**
\`\`\`
?page=1&limit=20&unreadOnly=false
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439060",
      "title": "New enrollment",
      "body": "John Doe enrolled in Advanced React",
      "category": "enrollment",
      "data": {
        "courseId": "507f1f77bcf86cd799439012",
        "studentId": "507f1f77bcf86cd799439011"
      },
      "createdAt": "2025-01-28T14:20:00Z",
      "readAt": null
    }
  ],
  "unreadCount": 5,
  "pagination": { "total": 42, "page": 1, "limit": 20, "pages": 3 }
}
\`\`\`

---

#### POST /api/notifications/:id/read
Mark notification as read.

**Response (200):**
\`\`\`json
{
  "ok": true,
  "readAt": "2025-01-28T14:30:00Z"
}
\`\`\`

---

#### POST /api/notifications/register-device
Register device for push notifications.

**Request:**
\`\`\`json
{
  "token": "d-Zjd1234_5xyz",  // Firebase Cloud Messaging token
  "platform": "web|ios|android"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "ok": true,
  "message": "Device registered for push notifications"
}
\`\`\`

---

### Email Template Endpoints

#### GET /api/email/templates
List email templates.

**Response (200):**
\`\`\`json
{
  "ok": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439030",
      "name": "Course Enrollment Confirmation",
      "subject": "Welcome to {{course_name}}",
      "category": "transactional",
      "variables": ["course_name", "student_name", "course_url"],
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

---

#### POST /api/email/templates
Create new template.

**Request:**
\`\`\`json
{
  "name": "Course Enrollment Confirmation",
  "subject": "Welcome to {{course_name}}!",
  "htmlBody": "<h1>Hello {{student_name}}</h1><p>You're now enrolled in {{course_name}}...</p>",
  "textBody": "Hello {{student_name}}...",
  "category": "transactional",
  "variables": ["course_name", "student_name", "course_url"]
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "ok": true,
  "data": { "id": "507f1f77bcf86cd799439030" }
}
\`\`\`

---

#### POST /api/email/templates/:id/preview
Preview template with sample data.

**Request:**
\`\`\`json
{
  "variables": {
    "course_name": "Advanced React",
    "student_name": "John Doe",
    "course_url": "https://academy.com/courses/advanced-react"
  }
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true,
  "subject": "Welcome to Advanced React!",
  "htmlRendered": "<h1>Hello John Doe</h1><p>You're now enrolled in Advanced React...</p>"
}
\`\`\`

---

### Webhook Endpoints

#### POST /api/webhooks/email
Handle SendGrid/Mailgun email events.

**Request (SendGrid):**
\`\`\`json
[
  {
    "email": "john@academy.edu",
    "timestamp": 1428968800,
    "smtpid": "<14c5d75ce93.xxxxxx.filter@sendgrid.net>",
    "event": "processed",
    "send_at": 1428968800
  },
  {
    "email": "john@academy.edu",
    "timestamp": 1428968801,
    "event": "delivered"
  },
  {
    "email": "john@academy.edu",
    "timestamp": 1428968802,
    "event": "open"
  }
]
\`\`\`

**Processing:**
\`\`\`javascript
// Update email_logs collection
for (const event of events) {
  const log = await db.email_logs.findOne({ toEmail: event.email });
  
  if (event.event === 'delivered') {
    log.status = 'delivered';
    log.deliveredAt = new Date(event.timestamp * 1000);
  } else if (event.event === 'open') {
    log.status = 'opened';
    log.openedAt = new Date(event.timestamp * 1000);
  } else if (event.event === 'click') {
    log.clickedAt = new Date(event.timestamp * 1000);
  } else if (event.event === 'bounce') {
    log.status = 'bounced';
    log.bounceReason = event.reason;
  }
  
  await log.save();
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true
}
\`\`\`

---

#### POST /api/webhooks/payment
Handle Stripe payment events.

**Request (Stripe):**
\`\`\`json
{
  "id": "evt_1234567890abcdef",
  "object": "event",
  "type": "charge.succeeded",
  "data": {
    "object": {
      "id": "ch_1234567890abcdef",
      "object": "charge",
      "amount": 500000,  // cents
      "currency": "egp",
      "status": "succeeded",
      "receipt_email": "john@academy.edu",
      "metadata": {
        "courseId": "507f1f77bcf86cd799439012",
        "studentId": "507f1f77bcf86cd799439011"
      }
    }
  }
}
\`\`\`

**Processing:**
\`\`\`javascript
if (event.type === 'charge.succeeded') {
  const { courseId, studentId } = event.data.object.metadata;
  
  // Create enrollment
  const enrollment = await db.enrollments.create({
    courseId,
    studentId,
    purchasedAt: new Date(),
    pricePaid: event.data.object.amount / 100,
    paymentMethod: 'stripe',
    transactionId: event.data.object.id,
    status: 'active'
  });
  
  // Notify student
  await notificationService.send({
    toUserId: studentId,
    title: 'Enrollment Confirmed',
    body: 'You are now enrolled in the course'
  });
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "ok": true
}
\`\`\`

---

## Admin Features

### Student Management

**Dashboard Metrics:**
- Total students (count)
- New students daily/weekly/monthly (aggregated)
- Active students (logged in last 7 days)
- Retention rate (students active this month / last month)
- Churn rate (students inactive for 30+ days / total active students)

**Student Profile Fields:**
- Name, email, phone
- Profile image URL
- Joined date, last login date
- Status (active, suspended, banned)
- Enrollment list with progress
- Activity timeline (paginated)
- Total active time (sum of session durations)
- Total amount spent

**Acceptance Criteria:**
- ✓ Search by name, email, phone
- ✓ Filter by status, joinDate range, courses enrolled
- ✓ Export student list (CSV) with selected columns
- ✓ Bulk actions (send message, suspend, export)
- ✓ Consent flags respected in display
- ✓ Sensitive data (maritalStatus, childrenCount) hidden by default

---

### Instructor Management

**Instructor List:**
- Name, email, phone, sector
- Verification status (unverified, pending, verified, rejected)
- Status (active, suspended, banned)
- Courses taught (count)
- Total students taught
- Average rating
- Total earnings

**Instructor Creation Workflow:**
1. Admin fills form (name, email, phone, sector, credentials, salary terms)
2. Upload credentials documents via presigned S3 URL
3. Set initial salary base & commission rate
4. Send activation email with set-password link (48-hour expiry)
5. Instructor sets password and activates account
6. Send in-app notification to confirm onboarding

**Instructor Profile:**
- Credentials array (title, issuer, year, documentUrl)
- Verification status with rejection reason if rejected
- Salary terms (base, commission rate, payment method, bank details)
- Courses taught with individual stats (enrollments, revenue, avg rating)
- Total earnings, unpaid amount
- Activity timeline (last 50 actions)

**Admin Actions:**
- Verify instructor (change verificationStatus to "verified")
- Reject with reason (change to "rejected", store reason)
- Suspend for X days (set suspensionEndDate, store reason, unpublish active courses)
- Ban permanently (set status to "banned", store reason, unpublish all courses, refund all active enrollments)
- Edit salary terms (base, commission rate, payment method)
- Export instructor report (PDF with courses, students, earnings, reviews)

**Acceptance Criteria:**
- ✓ Instructor onboarding email sent with activation link
- ✓ Salary tier support (different base/commission for each instructor)
- ✓ Verification status tied to course publishing permissions
- ✓ Audit trail for all status changes
- ✓ Bank details encrypted at rest
- ✓ Suspension auto-reactivation after period expires
- ✓ Ban prevents all future logins

---

### Course Management

**Course Listing:**
- Title, slug, category, price, instructor names
- Publishing status (draft, published, archived)
- Enrollment count, completion rate, avg rating
- Revenue (price × enrollments, approx)
- Created/updated dates

**Course Operations:**
- Create new course (title, description, category, price, instructors)
- Upload thumbnail (presigned S3 URL)
- Add lessons (title, duration, videoUrl, resourceUrl)
- Publish (set published = true, publishedAt = now)
- Unpublish (set published = false)
- Archive (set archivedAt = now, prevent new enrollments)
- Edit course details (title, description, price, category)
- Delete course (soft delete via archive, or hard delete if no enrollments)

**Course Analytics:**
- Total enrollments
- Completion rate (completed / total)
- Average progress (mean of progressPercent across enrollments)
- Average rating (from reviews)
- Revenue (sum of pricePaid for all enrollments)
- Enrollment over time (daily/weekly chart)
- Student list (with progress, last active, status)
- Reviews and ratings

**Acceptance Criteria:**
- ✓ Slug auto-generated from title, unique indexed
- ✓ Lessons ordered by position
- ✓ Publish/unpublish audit logged
- ✓ Archived courses hidden from student view (but data preserved)
- ✓ Course deletion cascades to enrollments (set status = refunded)
- ✓ Category-based filtering for analytics
- ✓ Revenue computed real-time or cached for 1 hour

---

### Admin Dashboard (Analytics)

**Metrics Cards:**
- Total students (count)
- Total revenue (sum of all pricePaid)
- Monthly revenue (sum for current month)
- New students today/week/month
- Active students today (logged in last 24 hours)
- Active sessions (current concurrent users)
- Average session duration
- Completion rate (completed / total enrollments)
- Retention rate (active this month / last month)
- Churn rate

**Time-Range Picker:**
- Preset: last 7 days, last 30 days, last 3 months, last year
- Custom date range selector
- Grouping: day, week, month

**Charts:**
- Line chart: revenue over time
- Line chart: new students over time
- Line chart: active users over time
- Bar chart: enrollments by course (top 10)
- Doughnut chart: course category distribution
- Stacked bar chart: instructor payouts vs commissions
- Heatmap: login activity by day/hour

**Performance:**
- Pre-aggregate heavy queries (cron job)
- Store aggregates in Redis (1-hour TTL)
- Use database indexes on timestamp and status fields
- Pagination for large result sets
- Server-side filtering before charting

**Acceptance Criteria:**
- ✓ Dashboard loads in < 2 seconds
- ✓ All metrics auto-refresh (30-second polling)
- ✓ Drill-down capability (click bar to see students for that course)
- ✓ Export aggregates as CSV/PDF
- ✓ Responsive design (mobile-friendly)

---

## Instructor Features

### Instructor Dashboard

**Overview Section:**
- Total income (sum of all paid payouts)
- Unpaid amount (sum of pending payouts)
- Number of courses taught
- Total students across all courses
- Average course rating (weighted by enrollments)

**Per-Course Panels:**
- Course title with thumbnail
- Revenue for the course (sum of enrollments × price)
- Enrollments (count)
- Completion rate
- Average progress
- Average rating
- Student list (paginated):
  - Student name, email
  - Enrolled date
  - Current progress %
  - Last active date
  - Status (active, completed, refunded)

**Recent Activity:**
- New enrollments (name, course, date)
- Course reviews (rating, comment, date)
- Admin announcements
- Salary updates

**Notifications:**
- Unread badge on notification icon
- Notification center (list, mark as read, clear)
- Settings to toggle notifications (email, push, by category)

**Acceptance Criteria:**
- ✓ Dashboard data cached for 5 minutes
- ✓ Real-time enrollment notifications (within 5 seconds)
- ✓ Student list sortable by name, progress, lastActive
- ✓ Responsive design (tablet/mobile friendly)
- ✓ Export student list (CSV) with progress and earnings projection

---

### Salary & Payout Management

**Payout Structure:**
- Base amount (fixed monthly salary)
- Commissions (15% of course revenue by default, configurable per instructor)
- Deductions (refunds, penalties)
- Taxes (configurable per country/instructor)
- Net amount = base + commissions - deductions - taxes

**Payout Flow:**
1. Admin creates payout record for period (e.g., 2025-01-01 to 2025-01-31)
2. Compute commissions: sum(enrollments.pricePaid) × commissionRate for courses taught
3. Deductions calculated (refunds processed during period)
4. Taxes calculated (configurable formula or percentage)
5. Status: pending (admin review)
6. Admin approves or rejects (rejection reason stored)
7. If approved, status: approved, wait for payment
8. Admin marks as paid (status: paid, paidAt = now, paymentReference stored)
9. Instructor receives notification (email + in-app)

**Payout Methods:**
- Bank transfer (account name, number, routing number, encrypted)
- Mobile money (provider, phone number, encrypted)
- Stripe (token, no details stored)
- Cash (reference number, notes)

**Instructor View:**
- Payout history (table with period, base, commissions, taxes, net, status, paid date)
- Filter by status, period, payment method
- Export as CSV
- Manual adjustment form (for manual bonuses/penalties, admin approval required)

**Admin View:**
- Payout ledger (all instructors, all periods)
- Bulk approval/rejection
- Bulk pay (mark multiple as paid)
- Add manual adjustments (bonus, penalty, refund)
- Export PDF report (instructor, period, breakdown, signature line)
- Stacked chart: instructor payouts vs commissions

**Acceptance Criteria:**
- ✓ Payout calculations double-checked (no rounding errors)
- ✓ Bank details encrypted with AES-256
- ✓ Audit trail for all payout status changes
- ✓ Monthly payout emails to instructors (pending, approved, paid)
- ✓ Comma-separated values export for accounting integration
- ✓ Support multi-currency (USD, EGP, SAR, etc.)

---

### Instructor Course Management

**Upload & Manage Content:**
- Edit course details (title, description, price, category)
- Add/edit/reorder lessons
- Upload lesson videos (presigned S3 URL)
- Attach resources (PDFs, documents) per lesson
- Publish lesson (make visible to enrolled students)
- Archive lesson (hide from new enrollments, but visible to existing)

**Student Progress Tracking:**
- Student list per course
- Individual student progress (% complete)
- Last module viewed
- Last active date
- Active time spent
- Quiz scores (if applicable)
- Assignment submissions (if applicable)

**Reviews & Feedback:**
- List of course reviews (rating, student name, comment, date)
- Ability to respond to review (optional, instructor response displayed)
- Filter reviews by rating (5-star, 4-star, etc.)
- Mark review as helpful/spam (admin action)
- Delete review (if inappropriate, with reason)

**Acceptance Criteria:**
- ✓ Video upload via presigned S3 URL (no backend storage)
- ✓ Lesson reordering via drag-drop
- ✓ Publish/unpublish per lesson
- ✓ Resource download tracking (log downloads)
- ✓ Student email notification on new resource upload
- ✓ Review response email notification to student

---

## Email System

### Email Capabilities

**Admin Email Sending:**
1. Global announcement (all students)
2. Targeted announcement:
   - Students in specific courses
   - Students in specific categories
   - Custom email list
3. Instructor-targeted emails
4. Course-specific resource emails (with attachment links)
5. Promotional emails (limited to consented users)
6. Lead-based emailing (CSV import with dedup & validation)

**Scheduling:**
- Send immediately
- Schedule for specific date/time (timezone support)
- Recurring (daily/weekly/monthly, optional)

**Rate Limiting:**
- Max 30,000/minute to SendGrid
- Queue-based sending (Bull/Agenda)
- Backoff & retry on transient failures (3 retries with exponential backoff)

**Acceptance Criteria:**
- ✓ Respect unsubscribe preferences (marketing, push, etc.)
- ✓ Deduplicate recipient list
- ✓ Validate email addresses before sending
- ✓ Track delivery status (sent, delivered, opened, clicked, bounced)
- ✓ Provide send confirmation (recipient count, queued for sending)

---

### Email Template System

**Template Manager:**
- Create, edit, delete templates
- WYSIWYG HTML editor (e.g., Quill, TinyMCE)
- Plain-text fallback (auto-generated from HTML)
- Variable/merge tag support:
  - {{student_name}}, {{student_email}}
  - {{course_name}}, {{course_url}}
  - {{instructor_name}}
  - {{announcement_title}}, {{announcement_body}}
  - {{custom_field_X}}
  - {{unsubscribe_link}}
- Preview with sample data
- Test send to admin email
- Categorize (announcement, promotional, transactional)

**A/B Testing (Optional):**
- Create variant A and B
- Send sample to split (50/50)
- Track open/click rates for each variant
- Report winning variant after period
- Promote winner as default template

**Acceptance Criteria:**
- ✓ Template variables validated (warn if undefined)
- ✓ Unsubscribe link always included (for marketing)
- ✓ Template preview renders correctly
- ✓ Spam score checked (optional, using SparkPost API)
- ✓ Templates versioned (save history for audit)

---

### Email Provider Integration

**SendGrid Integration:**

1. **Setup:**
   - API key stored in environment variable: `SENDGRID_API_KEY`
   - Sender email: `SENDGRID_FROM_EMAIL`
   - Webhook endpoint: `POST /api/webhooks/email`

2. **Sending:**
\`\`\`javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'recipient@example.com',
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: 'Hello from Nahdah Academy',
  html: '<strong>Welcome!</strong>',
  text: 'Welcome!',
  trackingSettings: {
    clickTracking: { enabled: true },
    openTracking: { enabled: true }
  },
  customArgs: {
    campaignId: '507f1f77bcf86cd799439040'
  }
};

await sgMail.send(msg);
\`\`\`

3. **Webhook Handling:**
   - Enable event notifications: processed, dropped, delivered, deferred, bounce, click, open, unsubscribe
   - Webhook URL: https://academy.com/api/webhooks/email
   - Store events in email_logs collection
   - Retry failed webhooks up to 3 times

**Mailgun Integration (Alternative):**

1. **Setup:**
   - API key: `MAILGUN_API_KEY`
   - Domain: `MAILGUN_DOMAIN`
   - Webhook endpoint: `POST /api/webhooks/email`

2. **Sending:**
\`\`\`javascript
const mailgun = require('mailgun.js');
const FormData = require('form-data');

const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

const mg = client.messages;

await mg.create(process.env.MAILGUN_DOMAIN, {
  from: 'Nahdah Academy <noreply@academy.com>',
  to: 'recipient@example.com',
  subject: 'Hello from Nahdah Academy',
  html: '<strong>Welcome!</strong>',
  'o:tracking': 'yes',
  'o:tracking-clicks': 'yes',
  'o:tracking-opens': 'yes',
  'v:campaign-id': '507f1f77bcf86cd799439040'
});
\`\`\`

**Email Logs Model:**
\`\`\`json
{
  "_id": ObjectId,
  "campaignId": "507f1f77bcf86cd799439040",
  "templateId": "507f1f77bcf86cd799439030",
  "toEmail": "john@academy.edu",
  "toUserId": "507f1f77bcf86cd799439011",
  
  "status": "sent|delivered|opened|clicked|bounced|complained|failed",
  "providerId": "abc123def456",  // SendGrid message ID or Mailgun ID
  "providerStatus": "sent",
  
  "sentAt": "2025-01-28T14:30:00Z",
  "deliveredAt": "2025-01-28T14:31:00Z",
  "openedAt": "2025-01-28T14:35:00Z",
  "clickedAt": "2025-01-28T14:36:00Z",
  
  "bounceReason": "Permanent | Temporary",
  "complaintReason": "abuse | fraud",
  
  "rawEvent": { /* full webhook payload */ },
  
  "createdAt": "2025-01-28T14:30:00Z"
}
\`\`\`

**Webhook Processing:**
\`\`\`javascript
// app/api/webhooks/email/route.ts or routes/webhooks/email.js
export async function POST(req: Request) {
  const events = await req.json();
  
  for (const event of events) {
    const log = await db.email_logs.findOne({
      toEmail: event.email,
      providerId: event.smtpid || event['message-id']
    });
    
    if (!log) continue;
    
    switch (event.event) {
      case 'processed':
      case 'sent':
        log.status = 'sent';
        log.sentAt = new Date(event.timestamp * 1000);
        break;
      case 'delivered':
        log.status = 'delivered';
        log.deliveredAt = new Date(event.timestamp * 1000);
        break;
      case 'open':
        log.status = 'opened';
        log.openedAt = new Date(event.timestamp * 1000);
        break;
      case 'click':
        log.clickedAt = new Date(event.timestamp * 1000);
        break;
      case 'bounce':
        log.status = 'bounced';
        log.bounceReason = event.reason;
        // Mark user as unsubscribed if hard bounce
        if (event.type === 'permanent') {
          await db.users.updateOne(
            { email: event.email },
            { 'consent.marketing': false }
          );
        }
        break;
      case 'complaint':
        log.status = 'complained';
        log.complaintReason = event.complaint;
        // Unsubscribe user
        await db.users.updateOne(
          { email: event.email },
          { 'consent.marketing': false }
        );
        break;
    }
    
    log.rawEvent = event;
    await log.save();
  }
  
  return Response.json({ ok: true });
}
\`\`\`

---

### Email Logs & Metrics

**Metrics per Campaign:**
- Recipients count (total emails sent)
- Delivered count (status = delivered)
- Opened count (status = opened)
- Click count (status = clicked)
- Bounces count (hard + soft)
- Complaints count

**Searchable Logs:**
- By email address
- By campaign ID
- By template ID
- By status (sent, delivered, opened, bounced, etc.)
- By date range
- By user ID (if known)

**Export:**
- CSV export (email, status, deliveredAt, openedAt, clickedAt)
- PDF report (summary stats, chart, detailed table)

**Acceptance Criteria:**
- ✓ Log all email events from provider
- ✓ Retry webhook processing on transient failure (3x with backoff)
- ✓ Metrics available in real-time (updated within 1 minute of event)
- ✓ Bounce/complaint handling (auto-unsubscribe)
- ✓ Export with all fields (recipient, status, timestamps, events)

---

## Notification System

### In-App Notifications

**Notification Model:**
\`\`\`json
{
  "id": "507f1f77bcf86cd799439060",
  "toRole": "student|instructor|admin|all",
  "toUserId": "507f1f77bcf86cd799439011",  // null if role-based
  
  "title": "New Course Available",
  "body": "A new course in JavaScript has been published",
  "category": "announcement|enrollment|salary|system|review",
  
  "data": {
    "courseId": "507f1f77bcf86cd799439012",
    "instructorId": "507f1f77bcf86cd799439020",
    "payoutId": "507f1f77bcf86cd799439040",
    "actionUrl": "/instructor/courses/507f1f77bcf86cd799439012",
    "customFields": {}
  },
  
  "readBy": [
    { "userId": "507f1f77bcf86cd799439011", "readAt": "2025-01-28T14:30:00Z" }
  ],
  
  "createdAt": "2025-01-28T14:20:00Z"
}
\`\`\`

**Notification Events:**
- New course published (announce to all students in category)
- Admin announcement (sent via email + in-app)
- Student enrollment (notify instructor)
- Course review submitted (notify instructor)
- Salary paid (notify instructor)
- Admin message (to specific user)
- Course suspension/deletion (notify enrolled students)

**Notification UI:**
- Notification center (icon in topbar with unread badge)
- List view (title, body, icon, time, read/unread)
- Mark as read (single or all)
- Clear all (delete from view)
- Click to navigate (actionUrl)
- Notification settings (category preferences)

**Acceptance Criteria:**
- ✓ Notification created immediately upon triggering event
- ✓ Unread count displayed in badge (cached, refresh on new notification)
- ✓ Mark as read stored in readBy array with timestamp
- ✓ Notifications paginated (20 per page)
- ✓ Notifications older than 90 days auto-deleted
- ✓ Category-based filtering in notification center

---

### Push Notifications (FCM)

**Setup:**
- Firebase project with FCM enabled
- Server API key stored in `FIREBASE_API_KEY`
- Send notifications via Firebase Admin SDK

**Device Token Registration:**
\`\`\`json
POST /api/notifications/register-device
{
  "token": "d-Zjd1234_5xyz",  // FCM device token
  "platform": "web|ios|android"
}
\`\`\`

**Sending Push Notifications:**
\`\`\`javascript
const admin = require('firebase-admin');
const db = admin.firestore();

async function sendPushNotification(userId, title, body, data) {
  const tokens = await db.collection('device_tokens')
    .where('userId', '==', userId)
    .where('expiresAt', '>', new Date())
    .get();
  
  const registrationTokens = tokens.docs.map(doc => doc.data().token);
  
  if (registrationTokens.length === 0) return;
  
  const message = {
    notification: { title, body },
    data,
    tokens: registrationTokens
  };
  
  const response = await admin.messaging().sendMulticast(message);
  
  // Handle failed tokens (remove from database)
  if (response.failureCount > 0) {
    const failedTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(registrationTokens[idx]);
      }
    });
    
    for (const token of failedTokens) {
      await db.collection('device_tokens').doc(token).delete();
    }
  }
}
\`\`\`

**Push Notification Triggers:**
- New enrollment in instructor's course
- Course review submitted
- Salary payout approved/paid
- Admin announcement (to students/instructors)
- Course published (to students following instructor)

**Notification Settings:**
\`\`\`json
{
  "userId": "507f1f77bcf86cd799439011",
  "emailNotifications": {
    "announcements": true,
    "enrollments": true,
    "reviews": true,
    "salaryUpdates": true
  },
  "pushNotifications": {
    "announcements": true,
    "enrollments": true,
    "reviews": false,
    "salaryUpdates": true
  }
}
\`\`\`

**Acceptance Criteria:**
- ✓ Device tokens stored with expiry date
- ✓ Expired tokens auto-removed
- ✓ Failed sends removed from database (no retry of deleted tokens)
- ✓ User can toggle notifications per category
- ✓ Push sent within 30 seconds of event
- ✓ Log all push send attempts (success/failure)

---

## Frontend Architecture

### Page Structure (Next.js App Router)

\`\`\`
/an-nahdah
├── /app
│   ├── /admin
│   │   ├── layout.tsx                 # Admin layout (sidebar, topbar)
│   │   ├── page.tsx                   # /admin (redirect to overview)
│   │   ├── /overview
│   │   │   └── page.tsx               # Analytics dashboard
│   │   ├── /students
│   │   │   ├── page.tsx               # Students list
│   │   │   └── /[id]
│   │   │       └── page.tsx           # Student profile
│   │   ├── /instructors
│   │   │   ├── page.tsx               # Instructors list
│   │   │   └── /[id]
│   │   │       └── page.tsx           # Instructor profile & edit
│   │   ├── /courses
│   │   │   ├── page.tsx               # Courses list
│   │   │   └── /[id]
│   │   │       └── page.tsx           # Course details & edit
│   │   ├── /salaries
│   │   │   ├── page.tsx               # Payouts ledger
│   │   │   └── /[id]
│   │   │       └── page.tsx           # Payout details & edit
│   │   ├── /email
│   │   │   ├── page.tsx               # Email composer
│   │   │   ├── /templates
│   │   │   │   ├── page.tsx           # Template manager
│   │   │   │   └── /[id]
│   │   │   │       └── page.tsx       # Template editor
│   │   │   └── /logs
│   │   │       └── page.tsx           # Email delivery logs
│   │   ├── /reports
│   │   │   └── page.tsx               # Reports & exports
│   │   └── /audit-logs
│   │       └── page.tsx               # Audit log viewer
│   ├── /instructor
│   │   ├── layout.tsx                 # Instructor layout
│   │   ├── page.tsx                   # /instructor (redirect to dashboard)
│   │   ├── /dashboard
│   │   │   └── page.tsx               # Instructor overview
│   │   ├── /courses
│   │   │   ├── page.tsx               # My courses
│   │   │   └── /[id]
│   │   │       ├── page.tsx           # Course details
│   │   │       ├── /students
│   │   │       │   └── page.tsx       # Students in course
│   │   │       ├── /reviews
│   │   │       │   └── page.tsx       # Course reviews
│   │   │       └── /manage
│   │   │           └── page.tsx       # Manage content
│   │   ├── /payouts
│   │   │   └── page.tsx               # Payout history
│   │   ├── /resources
│   │   │   └── page.tsx               # Uploaded resources
│   │   └── /notifications
│   │       └── page.tsx               # Notifications center
│   ├── /auth
│   │   ├── /login
│   │   │   └── page.tsx               # Login form
│   │   ├── /register
│   │   │   └── page.tsx               # Registration form
│   │   ├── /reset-password
│   │   │   └── page.tsx               # Password reset
│   │   └── /verify-email
│   │       └── page.tsx               # Email verification
│   ├── /profile
│   │   └── page.tsx                   # User profile & settings
│   ├── layout.tsx                     # Root layout
│   ├── globals.css                    # Tailwind + design tokens
│   └── page.tsx                       # Home page (redirect based on role)
│   ├── /api
│   │   ├── /auth
│   │   │   ├── /register
│   │   │   │   └── route.ts
│   │   │   ├── /login
│   │   │   │   └── route.ts
│   │   │   ├── /refresh
│   │   │   │   └── route.ts
│   │   │   └── /logout
│   │   │       └── route.ts
│   │   ├── /admin
│   │   │   ├── /summary
│   │   │   │   └── route.ts
│   │   │   ├── /students
│   │   │   │   └── route.ts
│   │   │   ├── /instructors
│   │   │   │   └── route.ts
│   │   │   ├── /courses
│   │   │   │   └── route.ts
│   │   │   ├── /payouts
│   │   │   │   └── route.ts
│   │   │   ├── /email
│   │   │   │   └── route.ts
│   │   │   └── /exports
│   │   │       └── route.ts
│   │   ├── /instructor
│   │   │   ├── /dashboard
│   │   │   │   └── route.ts
│   │   │   ├── /courses
│   │   │   │   └── route.ts
│   │   │   └── /payouts
│   │   │       └── route.ts
│   │   ├── /notifications
│   │   │   ├── /route.ts
│   │   │   ├── /register-device
│   │   │   │   └── route.ts
│   │   │   └── /[id]
│   │   │       └── route.ts
│   │   ├── /email
│   │   │   ├── /templates
│   │   │   │   └── route.ts
│   │   │   └── /logs
│   │   │       └── route.ts
│   │   ├── /uploads
│   │   │   ├── /presign
│   │   │   │   └── route.ts
│   │   │   └── /confirm
│   │   │       └── route.ts
│   │   └── /webhooks
│   │       ├── /email
│   │       │   └── route.ts
│   │       └── /payment
│   │           └── route.ts
│   ├── /components
│   │   ├── /admin
│   │   │   ├── admin-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── metric-card.tsx
│   │   │   ├── student-list.tsx
│   │   │   ├── student-profile-modal.tsx
│   │   │   ├── instructor-list.tsx
│   │   │   ├── instructor-form-modal.tsx
│   │   │   ├── course-list.tsx
│   │   │   ├── course-form-modal.tsx
│   │   │   ├── payout-ledger.tsx
│   │   │   ├── email-composer.tsx
│   │   │   ├── email-template-editor.tsx
│   │   │   └── analytics-dashboard.tsx
│   │   ├── /instructor
│   │   │   ├── instructor-layout.tsx
│   │   │   ├── dashboard-overview.tsx
│   │   │   ├── course-panel.tsx
│   │   │   ├── student-list.tsx
│   │   │   ├── payout-history.tsx
│   │   │   └── resource-upload.tsx
│   │   ├── /common
│   │   │   ├── navbar.tsx
│   │   │   ├── notification-center.tsx
│   │   │   ├── notification-badge.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── form-input.tsx
│   │   │   ├── file-upload.tsx
│   │   │   ├── date-range-picker.tsx
│   │   │   └── chart-components.tsx
│   │   └── /auth
│   │       ├── login-form.tsx
│   │       ├── register-form.tsx
│   │       └── password-reset-form.tsx
│   ├── /lib
│   │   ├── auth.ts                    # Auth utilities
│   │   ├── api-client.ts              # Axios instance
│   │   ├── rbac.ts                    # Role-based access control
│   │   ├── constants.ts               # App constants
│   │   └── utils.ts                   # General utilities
│   ├── /hooks
│   │   ├── use-auth.ts                # Auth context hook
│   │   ├── use-notifications.ts       # Notifications hook (SWR)
│   │   ├── use-dashboard.ts           # Dashboard data hook
│   │   └── use-form.ts                # Form state hook
│   ├── /services
│   │   ├── auth-service.ts
│   │   ├── user-service.ts
│   │   ├── course-service.ts
│   │   ├── email-service.ts
│   │   ├── notification-service.ts
│   │   └── upload-service.ts
│   └── /styles
│       └── theme.css                  # Design tokens & theme
├── /public
│   ├── /icons
│   ├── /images
│   └── favicon.ico
├── .env.local                         # Local environment variables
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── package.json
\`\`\`

---

### Component Hierarchy

**Admin Dashboard:**
\`\`\`
AdminLayout
├── Sidebar
│   └── Nav links (Overview, Students, Instructors, Courses, Salaries, Email, Audit Logs)
├── TopBar
│   ├── Search
│   ├── NotificationBadge
│   └── UserMenu
└── MainContent
    ├── AdminOverview (/admin/overview)
    │   ├── MetricCard (Total Students)
    │   ├── MetricCard (Total Revenue)
    │   ├── MetricCard (Active Users)
    │   ├── LineChart (Revenue over time)
    │   ├── BarChart (Enrollments by course)
    │   ├── DoughnutChart (Category distribution)
    │   └── DateRangePicker (Time range selection)
    ├── StudentsPage (/admin/students)
    │   ├── DataTable
    │   │   ├── Columns: Name, Email, Phone, Joined, LastLogin, Status
    │   │   └── Actions: View, Edit, Suspend, Ban
    │   ├── SearchBox
    │   ├── FilterBar (Status, Date Range)
    │   └── StudentProfileModal (onclick row)
    ├── InstructorsPage (/admin/instructors)
    │   ├── DataTable
    │   │   ├── Columns: Name, Email, Sector, Status, Verification, Courses
    │   │   └── Actions: View, Edit, Verify, Suspend, Ban
    │   ├── "Add Instructor" Button → InstructorFormModal
    │   └── InstructorProfileModal
    ├── CoursesPage (/admin/courses)
    │   ├── CourseGrid (Course cards)
    │   ├── "Create Course" Button → CourseFormModal
    │   └── CourseDetailsModal
    ├── SalariesPage (/admin/salaries)
    │   ├── PayoutLedger (DataTable)
    │   │   ├── Columns: Instructor, Period, Base, Commission, Net, Status, Actions
    │   │   └── Actions: View, Approve, Reject, Mark Paid, Export
    │   └── PayoutDetailsModal
    └── EmailPage (/admin/email)
        ├── EmailComposer
        │   ├── RecipientSelector (All, Course, Category, Custom)
        │   ├── TemplateSelector
        │   ├── HTMLEditor (WYSIWYG)
        │   ├── VariablePanel (Insert merge tags)
        │   ├── PreviewButton
        │   └── SendButton
        ├── TemplateManager
        │   ├── TemplateList (DataTable)
        │   └── TemplateEditorModal
        └── EmailLogsViewer (searchable, filterable)
\`\`\`

**Instructor Dashboard:**
\`\`\`
InstructorLayout
├── Sidebar (vertical nav)
├── TopBar
│   ├── NotificationBadge
│   └── UserMenu
└── MainContent
    ├── DashboardPage (/instructor/dashboard)
    │   ├── OverviewCards
    │   │   ├── Total Income
    │   │   ├── Unpaid Amount
    │   │   ├── Course Count
    │   │   └── Avg Rating
    │   ├── CoursePanels (grid)
    │   │   └── CoursePanel (per course)
    │   │       ├── Thumbnail
    │   │       ├── Revenue, Enrollments, Completion Rate
    │   │       ├── StudentList (paginated)
    │   │       └── Action buttons (View, Manage, Resources)
    │   ├── RecentActivity (timeline)
    │   └── NotificationsPanel (recent 5)
    ├── CoursesPage (/instructor/courses)
    │   ├── CourseList (DataTable)
    │   │   ├── Columns: Title, Published, Enrollments, Revenue, Rating
    │   │   └── Actions: Edit, Manage, Delete
    │   ├── "Create Course" Button → CourseFormModal
    │   └── CourseDetailsModal
    ├── PayoutsPage (/instructor/payouts)
    │   ├── PayoutHistoryTable (DataTable)
    │   │   ├── Columns: Period, Base, Commission, Deductions, Net, Status, Paid Date
    │   │   └── Filter by Status, Period
    │   ├── ExportButton (CSV)
    │   └── ManualAdjustmentForm
    └── NotificationsPage (/instructor/notifications)
        ├── NotificationCenter
        │   ├── NotificationList (paginated)
        │   ├── Filters (Category, Read status)
        │   └── "Mark all as read" & "Clear all" buttons
\`\`\`

---

### Key Components (Detailed)

#### DataTable Component
\`\`\`typescript
// components/common/data-table.tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  onRowClick?: (row: T) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  pagination,
  onPageChange
}: DataTableProps<T>) {
  // Uses TanStack Table (React Table) for server-side pagination
  // Supports sorting, filtering, column visibility
}
\`\`\`

**Acceptance Criteria:**
- ✓ Server-side pagination (50, 100, 200 rows per page)
- ✓ Sortable columns (click header to sort)
- ✓ Filterable columns (search, dropdown)
- ✓ Responsive (horizontal scroll on mobile)
- ✓ Loading state (skeleton or spinner)
- ✓ Empty state (message when no data)

#### EmailTemplateEditor Component
\`\`\`typescript
// components/admin/email-template-editor.tsx
export function EmailTemplateEditor({ template, onSave }: {
  template?: EmailTemplate;
  onSave: (template: EmailTemplate) => Promise<void>;
}) {
  // Rich text editor (Quill or TinyMCE)
  // Variable insertion panel
  // Preview pane
  // Save button
  // Test send button (to admin email)
}
\`\`\`

#### PresignedUpload Component
\`\`\`typescript
// components/common/presigned-upload.tsx
export function PresignedUpload({ onComplete }: {
  onComplete: (fileKey: string, url: string) => void;
}) {
  // 1. Request presigned URL from backend
  // 2. Show file input
  // 3. Upload to S3 directly using presigned URL
  // 4. Confirm upload completion
  // 5. Call onComplete with file key & URL
}
\`\`\`

#### NotificationCenter Component
\`\`\`typescript
// components/common/notification-center.tsx
export function NotificationCenter() {
  // Dropdown from notification icon
  // List notifications (paginated)
  // Mark as read/unread
  // Delete notification
  // Badge shows unread count
  // Settings link (notification preferences)
}
\`\`\`

---

### Authentication Flow (Frontend)

\`\`\`typescript
// lib/auth.ts
export const authService = {
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',  // Include cookies
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // Store access token in memory
      localStorage.setItem('accessToken', data.accessToken);
      // Refresh token stored in httpOnly cookie (automatic)
      return { ok: true, user: data.user };
    }
    
    if (data.requiresOTP) {
      // Show OTP prompt
      return { ok: false, requiresOTP: true };
    }
    
    return { ok: false, error: data.error };
  },
  
  async logout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    localStorage.removeItem('accessToken');
    return res.ok;
  },
  
  async refreshToken() {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    }
    
    // Redirect to login if refresh fails
    window.location.href = '/auth/login';
  }
};

// hooks/use-auth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verify token on mount
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Optional: verify token is valid by calling a protected endpoint
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, []);
  
  return { user, loading, logout: authService.logout };
}
\`\`\`

---

### API Client Setup

\`\`\`typescript
// lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true  // Include cookies
});

// Request interceptor: add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: refresh token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await authService.refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(error.config);
      } catch (err) {
        // Redirect to login
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
\`\`\`

---

## Security & Compliance

### Authentication Security

**Password Requirements:**
- Minimum 12 characters
- Must include uppercase, lowercase, number, special character
- Cannot be in common password list
- Cannot be previously used password (store last 5 hashes)

**Password Hashing:**
- Use bcrypt with cost factor 12
- Never store plaintext passwords

**Token Security:**
- Access token: JWT, 15-minute expiry
- Refresh token: httpOnly, secure, sameSite: Strict cookie, 7-day expiry
- Refresh token: rotate on each use (optional but recommended)
- Token payload includes: userId, role, email, iat (issued at), exp (expiry)

**2FA for Admins:**
- TOTP (Time-based One-Time Password) using Google Authenticator
- Recovery codes (8 codes, hashed with bcrypt, store count only)
- 5-minute expiry for OTP verification

**Rate Limiting:**
- Login endpoint: 5 attempts per 15 minutes per IP
- API endpoints: 100 requests per minute per user
- Email sending: 30,000 per minute globally (SendGrid limit)
- Implement via Redis or in-memory store

---

### Consent & Privacy

**Consent Management:**
- Explicit checkbox for sensitive data collection
- "I consent to collection of marital status, children count" (separate checkbox)
- Consent version tracked (YYYY-MM-DD format)
- Display consent terms before signup

**Data Minimization:**
- Only store maritalStatus, childrenCount if consent.sensitiveData === true
- Other fields always stored if provided
- Consent stored with timestamp and version

**Sensitive Fields:**
- Bank account details (encrypted with AES-256, key in environment)
- Mobile money phone numbers (encrypted)
- Payment method details (never store card details, use Stripe tokens)
- Social security numbers or IDs (if collected, highly restricted)

**Data Deletion:**
- User can request account deletion (GDPR)
- Soft delete: mark account as deleted, preserve data for 90 days
- Hard delete after 90 days (data unrecoverable)
- Log deletion request and action in audit logs

**Data Export:**
- User can export personal data in JSON format
- Includes: profile, enrollments, activity, payment history, messages
- Download link valid for 24 hours

---

### Encryption & Secrets

**At-Rest Encryption:**
- Sensitive fields encrypted with AES-256
- Encryption key stored in environment variable `ENCRYPTION_KEY`
- Use `crypto` module (Node.js) or `NaCl.js` (browser-side sensitive data)

**In-Transit Encryption:**
- All API endpoints use HTTPS
- Certificate pinning (optional, for mobile apps)
- TLS 1.2 minimum

**Secrets Management:**
- Use .env.local (local development, not committed)
- Use environment variables in production (Vercel, AWS, Heroku)
- Rotate secrets every 90 days
- Use HashiCorp Vault or AWS Secrets Manager for larger deployments

**API Keys:**
- SendGrid API key (prod vs test key)
- Firebase API key & service account JSON
- Stripe keys (publishable & secret)
- S3 access keys (use IAM role if on AWS)
- All keys rotated quarterly

---

### Audit Logging

**Audit Log Fields:**
\`\`\`json
{
  "id": "507f1f77bcf86cd799439070",
  "actorUserId": "507f1f77bcf86cd799439020",
  "action": "VERIFY_INSTRUCTOR|APPROVE_PAYOUT|SUSPEND_USER|BAN_USER|CREATE_COURSE|DELETE_COURSE",
  "target": {
    "type": "user|course|payout|enrollment",
    "id": "507f1f77bcf86cd799439011"
  },
  "meta": {
    "before": { /* state before */ },
    "after": { /* state after */ },
    "reason": "Inappropriate content",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "timestamp": "2025-01-28T14:30:00Z"
}
\`\`\`

**Immutability:**
- Audit logs are immutable (no update/delete operations)
- Use database constraints or separate archive table
- Regular backups to cold storage

**Retention:**
- Keep audit logs for 2 years minimum
- Archive to S3 after 1 year (for compliance)
- Delete after legal hold period (7+ years recommended)

**Access Control:**
- Only admins can view audit logs
- Cannot access own audit logs without another admin approval
- All access to audit logs is logged

**Acceptance Criteria:**
- ✓ All admin actions logged
- ✓ No gaps in audit trail
- ✓ Tamper-evident (hash chain or blockchain optional)
- ✓ Export audit trail (CSV/PDF) for compliance
- ✓ Real-time alerts for suspicious actions (optional)

---

### Role-Based Access Control (RBAC)

**Route Protection (Backend):**
\`\`\`javascript
// middleware/rbac.js
const routePermissions = {
  '/api/admin/*': ['admin'],
  '/api/instructor/*': ['instructor', 'admin'],
  '/api/students/*': ['student', 'instructor', 'admin']
};

const checkPermission = (route, userRole) => {
  // Match route against patterns and check role
  const allowedRoles = routePermissions[route];
  return allowedRoles.includes(userRole);
};
\`\`\`

**Page Protection (Frontend):**
\`\`\`typescript
// components/protected-route.tsx
export function ProtectedRoute({ children, requiredRoles }: {
  children: React.ReactNode;
  requiredRoles: string[];
}) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user || !requiredRoles.includes(user.role)) {
    return <Redirect to="/auth/login" />;
  }
  
  return children;
}
\`\`\`

**Acceptance Criteria:**
- ✓ Route permission enforced before processing request
- ✓ 403 Forbidden returned for insufficient permissions
- ✓ Admin cannot view student enrollments of another admin
- ✓ Instructor cannot modify salary records
- ✓ Student cannot access admin or instructor features
- ✓ All API responses filtered by permission (no data leaks)

---

## Scalability & Performance

### Caching Strategy

**Redis Cache:**
- Cache keys: `user:{userId}`, `course:{courseId}`, `enrollment:{enrollmentId}`
- TTL: 5 minutes for user data, 1 hour for course analytics
- Invalidate on update (delete key)
- Pre-aggregate metrics (aggregation jobs)

**Database Indexes:**
\`\`\`javascript
// Critical indexes for performance
db.users.createIndex({ email: 1 });
db.courses.createIndex({ slug: 1 });
db.enrollments.createIndex({ courseId: 1, studentId: 1 });
db.enrollments.createIndex({ studentId: 1 });
db.activities.createIndex({ userId: 1, timestamp: -1 });
db.activities.createIndex({ timestamp: 1 }, { expireAfterSeconds: 63072000 });
db.email_logs.createIndex({ toEmail: 1 });
db.email_logs.createIndex({ status: 1, createdAt: -1 });
db.audit_logs.createIndex({ actorUserId: 1, timestamp: -1 });
db.payouts.createIndex({ instructorId: 1, periodStart: -1 });
\`\`\`

**Query Optimization:**
- Use projections to select only needed fields
- Limit result sets (server-side pagination)
- Use explain() to analyze query performance
- Archive old data (activities > 2 years moved to separate collection)

---

### Pre-Aggregation & Job Scheduling

**Bull / Agenda Jobs:**

1. **Daily Aggregation (runs at 01:00 UTC):**
   \`\`\`javascript
   // jobs/daily-aggregation.js
   async function dailyAggregation() {
     // Compute newStudentsDaily, activeStudentsDaily, revenueDaily
     // Store in Redis aggregations:{date}
     // TTL: 30 days
   }
   \`\`\`

2. **Weekly Metrics (runs Monday 01:00 UTC):**
   \`\`\`javascript
   async function weeklyMetrics() {
     // Compute newStudentsWeekly, engagementMetrics
     // Store in Redis
   }
   \`\`\`

3. **Email Campaign Sender (runs every 1 minute):**
   \`\`\`javascript
   async function sendEmailCampaigns() {
     // Find campaigns with sendAt <= now
     // Batch send via SendGrid (30K/min limit)
     // Update email_logs with sentAt
   }
   \`\`\`

4. **Cleanup Jobs (runs daily at 02:00 UTC):**
   \`\`\`javascript
   async function cleanupExpiredTokens() {
     // Delete device_tokens with expiresAt < now
     // Archive activities > 2 years old
     // Delete email_logs > 90 days old
   }
   \`\`\`

5. **Monthly Payout Calculation (runs last day of month 23:00 UTC):**
   \`\`\`javascript
   async function monthlyPayoutCalculation() {
     // For each instructor:
     // - Compute base amount
     // - Sum enrollments.pricePaid × commissionRate
     // - Subtract deductions (refunds)
     // - Calculate taxes
     // - Create payout record with status: pending
     // - Notify instructor (in-app + email)
   }
   \`\`\`

---

### CDN & File Delivery

**Static Assets (CloudFront / Cloudflare):**
- Serve JavaScript, CSS, images with 1-year cache (versioned)
- Cache headers: `Cache-Control: public, max-age=31536000`

**Video Hosting (Vimeo / Cloudflare Stream):**
- Stream lessons via CDN (not S3 direct)
- Analytics: track video views, seek patterns
- Adaptive bitrate (HLS/DASH)
- Content protection (token-based auth)

**File Downloads (Signed URLs):**
\`\`\`javascript
// Signed S3 URL for resource download (valid 15 minutes)
const url = s3.getSignedUrl('getObject', {
  Bucket: process.env.AWS_BUCKET,
  Key: fileKey,
  Expires: 900  // 15 minutes
});
\`\`\`

---

### Load Balancing & Horizontal Scaling

**Architecture:**
\`\`\`
Load Balancer (Nginx / HAProxy)
├── App Server 1 (Node.js)
├── App Server 2 (Node.js)
└── App Server 3 (Node.js)
    ↓
Redis (caching, sessions, job queue)
    ↓
Database (MongoDB Atlas / Neon)
    ↓
Storage (S3)
    ↓
Email Service (SendGrid)
\`\`\`

**Session Sharing:**
- Store sessions in Redis (not in-memory)
- Session key: `session:{sessionId}`
- TTL: 7 days (for refresh token expiry)

**Job Queue:**
- Use Redis-backed Bull for job scheduling
- Max workers: 5-10 (configurable per job type)
- Failed job retry: exponential backoff (1s, 2s, 4s, 8s, 16s)

---

## Deployment Guide

### Environment Variables

**Required (Local Development):**
\`\`\`bash
# Database
DATABASE_URL=mongodb://localhost:27017/nahdah

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Encryption
ENCRYPTION_KEY=your-256-bit-key-base64-encoded

# Firebase (if using Firebase Auth)
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
FIREBASE_PROJECT_ID=xxx

# SendGrid / Mailgun
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@academy.com

# S3 / Blob Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_BUCKET=nahdah-academy

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# FCM
FIREBASE_MESSAGING_SENDER_ID=xxx
FIREBASE_APP_ID=xxx
\`\`\`

**Required (Production):**
\`\`\`bash
# All of above, plus:
NODE_ENV=production

# Vercel (if hosting on Vercel)
VERCEL_ENV=production

# Email
SENDGRID_API_KEY=SG.xxx (prod key)

# Database (Production Instance)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/nahdah

# Redis (Upstash / Redis Cloud)
REDIS_URL=redis://user:pass@host:port
\`\`\`

---

### Deployment Steps

**1. Pre-Deployment Checklist:**
- [ ] All environment variables set
- [ ] Database backups configured
- [ ] SSL certificate installed
- [ ] Rate limiting configured
- [ ] Logging setup (e.g., Sentry)
- [ ] Monitoring alerts configured
- [ ] Security headers (CSP, X-Frame-Options, etc.)

**2. Database Migration:**
\`\`\`bash
# Run migrations before deployment
npm run migrate

# Or for MongoDB, run scripts/setup-database.js
node scripts/setup-database.js
\`\`\`

**3. Frontend Deployment (Vercel / Netlify):**
\`\`\`bash
# Build
npm run build

# Deploy (Vercel CLI)
vercel deploy --prod

# Or push to Git → auto-deploy
git push origin main
\`\`\`

**4. Backend Deployment (Render / Railway / AWS ECS):**

**Option A: Render.com**
\`\`\`bash
# Connect GitHub repo to Render
# Set environment variables in Render dashboard
# Deploy button → auto-deploys on push to main
\`\`\`

**Option B: Docker (AWS ECS / Kubernetes):**
\`\`\`dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
# Build & push to ECR
docker build -t nahdah-api:latest .
docker tag nahdah-api:latest 123456.dkr.ecr.us-east-1.amazonaws.com/nahdah-api:latest
docker push 123456.dkr.ecr.us-east-1.amazonaws.com/nahdah-api:latest

# Deploy to ECS (using Terraform or AWS Console)
\`\`\`

**5. Health Checks:**
\`\`\`javascript
// app/api/health/route.ts
export async function GET() {
  const dbHealth = await checkDatabase();
  const redisHealth = await checkRedis();
  
  if (dbHealth.ok && redisHealth.ok) {
    return Response.json({ ok: true, db: dbHealth, redis: redisHealth });
  }
  
  return Response.json({ ok: false }, { status: 503 });
}
\`\`\`

---

### Monitoring & Logging

**Log Aggregation (Sentry / LogRocket):**
\`\`\`javascript
// app/page.tsx or server entry
import * as Sentry from "@sentry/next";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});
\`\`\`

**Application Performance Monitoring (APM):**
- Track API endpoint response times
- Monitor database query performance
- Alert on errors / exceptions
- Track user behavior funnels

**Alerts:**
- API response time > 2 seconds
- Error rate > 1%
- Database connection pool exhausted
- Redis cache miss rate > 20%

---

## Environment Setup

### Local Development

**1. Clone Repository:**
\`\`\`bash
git clone https://github.com/your-org/nahdah-academy.git
cd nahdah-academy
\`\`\`

**2. Install Dependencies:**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

**3. Setup Database (MongoDB Local):**
\`\`\`bash
# Download & start MongoDB
mongod --dbpath ./data

# In another terminal, seed database
npm run seed
\`\`\`

**4. Setup Redis (Local):**
\`\`\`bash
# Download & start Redis
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
\`\`\`

**5. Create .env.local:**
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with local values
\`\`\`

**6. Start Development Server:**
\`\`\`bash
npm run dev
# Open http://localhost:3000
\`\`\`

**7. Seed Sample Data:**
\`\`\`bash
npm run seed
# Creates test users: admin@test.com, instructor@test.com, student@test.com
# All passwords: TestPass123!
\`\`\`

---

## Test Scenarios & Acceptance Criteria

### Core Flow: Admin Creates Instructor

**Scenario:** Admin creates new instructor with salary terms, uploads credentials.

**Steps:**
1. Admin navigates to /admin/instructors
2. Clicks "Add Instructor" button
3. Fills form: name, email, phone, sector, bio, credentials
4. Uploads credential document (PDF) via presigned S3 URL
5. Sets salary base (5000 EGP) & commission rate (15%)
6. Selects payment method (bank)
7. Enters bank details (encrypted)
8. Clicks "Create Instructor"

**Expected Outcomes:**
- ✓ Instructor record created in database
- ✓ Activation email sent with set-password link (48-hour expiry)
- ✓ Instructor receives in-app notification
- ✓ Audit log entry created (actor: admin, action: CREATE_INSTRUCTOR)
- ✓ Admin sees success message: "Instructor created. Activation email sent."
- ✓ Instructor can reset password & login
- ✓ Dashboard shows new instructor with status "active", verificationStatus "unverified"

---

### Core Flow: Student Enrolls & Progresses in Course

**Scenario:** Student enrolls in course via Stripe payment, accesses lessons, completes course.

**Steps:**
1. Student navigates to /courses
2. Browses courses, finds "Advanced React"
3. Clicks course, sees price (5000 EGP)
4. Clicks "Enroll" button → Stripe checkout
5. Completes payment
6. Enrollment created, student redirected to course dashboard
7. Student views lessons, watches videos
8. Student completes quiz, submits assignment
9. Student marks course as completed
10. Student leaves rating & review

**Expected Outcomes:**
- ✓ Enrollment record created with status "active"
- ✓ Payment transaction recorded (paymentMethod: stripe, transactionId: ...)
- ✓ Activity log entries created (login, video_watch, quiz_attempt)
- ✓ progressPercent updated as student completes lessons
- ✓ completedAt set when all lessons finished
- ✓ Review record created with rating & comment
- ✓ Instructor receives notification: "New review on Advanced React"
- ✓ Course avgRating updated
- ✓ Admin dashboard shows enrollment in analytics

---

### Core Flow: Instructor Payout Approval & Payment

**Scenario:** Admin approves instructor payout, marks as paid, instructor notified.

**Steps:**
1. End of month (Jan 31) arrives
2. Cron job runs: monthly payout calculation
3. Payout record created: base 5000, commissions 12000, net 17000, status "pending"
4. Instructor receives email: "Payout pending approval"
5. Admin navigates to /admin/salaries
6. Sees payout record for instructor (Ahmed Hassan)
7. Reviews breakdown: base 5000, commissions 12000, deductions 500, taxes 2000, net 9500
8. Clicks "Approve" button
9. Status changes to "approved"
10. Admin clicks "Mark as Paid"
11. Enters payment reference (bank transfer ID)
12. Clicks "Confirm Payment"

**Expected Outcomes:**
- ✓ Payout status: pending → approved → paid
- ✓ paidAt timestamp recorded
- ✓ paymentReference stored (encrypted if sensitive)
- ✓ Audit log entries created for each status change
- ✓ Instructor receives email: "Your payout of 9500 EGP has been paid"
- ✓ Instructor receives in-app notification
- ✓ Instructor dashboard shows payout in history with status "paid"
- ✓ Admin dashboard shows payout in ledger & charts

---

### Core Flow: Admin Sends Email Campaign

**Scenario:** Admin sends announcement to all students in Technology category.

**Steps:**
1. Admin navigates to /admin/email
2. Clicks "New Campaign"
3. Selects template: "Course Announcement"
4. Recipient type: "Category" → selects "Technology"
5. Fills variables: announcement_title, announcement_body
6. Clicks "Preview" → sees rendered email
7. Clicks "Send Now"
8. System validates recipients (dedup, check consent)
9. Queues emails in Bull job queue
10. Emails sent via SendGrid (rate limited)

**Expected Outcomes:**
- ✓ Campaign record created
- ✓ Email logs created for each recipient (status: pending)
- ✓ Emails queued in Bull (max 30K/min)
- ✓ SendGrid webhooks update email_logs (sent, delivered, opened, clicked)
- ✓ Admin sees campaign summary: "450 recipients, 445 delivered, 120 opened"
- ✓ Bounce/complaint handling: hard bounces unsubscribe user
- ✓ Export campaign report (CSV) with metrics

---

### Core Flow: Webhook Handling (Email Delivery)

**Scenario:** SendGrid sends delivery webhook, system updates email logs.

**Steps:**
1. Email sent to john@academy.edu via SendGrid
2. SendGrid processes email (processed event)
3. Email delivered to inbox (delivered event)
4. User opens email (open event)
5. User clicks link (click event)
6. SendGrid sends webhook to /api/webhooks/email
7. System receives webhook payload
8. Updates email_logs record with status & timestamps

**Expected Outcomes:**
- ✓ Webhook received and processed within 1 second
- ✓ email_logs.status updated: pending → sent → delivered → opened
- ✓ Timestamps recorded accurately
- ✓ Bounce/complaint events trigger unsubscribe
- ✓ Failed webhook retried up to 3 times with exponential backoff
- ✓ Webhook signature verified (SendGrid auth header)

---

### Core Flow: Webhook Handling (Stripe Payment)

**Scenario:** Student completes Stripe payment, webhook creates enrollment.

**Steps:**
1. Student completes Stripe checkout
2. Stripe processes charge (charge.succeeded event)
3. Stripe sends webhook to /api/webhooks/payment
4. System receives webhook with courseId, studentId, amount
5. Creates enrollment record
6. Sends confirmation email to student
7. Sends notification to instructor

**Expected Outcomes:**
- ✓ Webhook received and processed within 2 seconds
- ✓ Enrollment created with status "active"
- ✓ pricePaid, paymentMethod, transactionId recorded
- ✓ Student receives confirmation email
- ✓ Instructor receives notification: "New enrollment in Advanced React"
- ✓ Activity log entry created (type: course_enroll)
- ✓ Admin dashboard shows enrollment in analytics
- ✓ Webhook signature verified (Stripe signature header)

---

### Core Flow: 2FA Setup & Login (Admin)

**Scenario:** Admin enables 2FA, then logs in with OTP.

**Steps:**
1. Admin navigates to /profile/security
2. Clicks "Enable Two-Factor Authentication"
3. System generates TOTP secret
4. QR code displayed (for Google Authenticator)
5. Admin scans QR code with authenticator app
6. Admin enters 6-digit code from app
7. System verifies code (TOTP validation)
8. 8 recovery codes displayed (download/print)
9. Admin confirms 2FA enabled
10. Admin logs out
11. Admin logs in again with email & password
12. System prompts for OTP
13. Admin enters 6-digit code from authenticator
14. Login successful

**Expected Outcomes:**
- ✓ TOTP secret stored encrypted in database
- ✓ Recovery codes hashed with bcrypt
- ✓ 2FA verified timestamp recorded
- ✓ Login flow requires OTP if 2FA enabled
- ✓ OTP valid for 30 seconds (TOTP standard)
- ✓ Recovery codes can be used as backup (one-time use)
- ✓ Audit log entry: "2FA_ENABLED"

---

### Core Flow: Instructor Suspension & Auto-Reactivation

**Scenario:** Admin suspends instructor for 30 days, auto-reactivates after period.

**Steps:**
1. Admin navigates to /admin/instructors
2. Finds instructor (Ahmed Hassan)
3. Clicks "Suspend" button
4. Enters reason: "Inappropriate course content"
5. Selects duration: 30 days
6. Clicks "Confirm Suspension"
7. System sets suspensionEndDate = now + 30 days
8. Courses unpublished (published = false)
9. Instructor receives email: "Your account has been suspended"
10. Instructor receives in-app notification
11. Instructor cannot login (status check in auth middleware)
12. After 30 days, cron job runs
13. Suspension period expired, status reset to "active"
14. Instructor receives email: "Your account has been reactivated"

**Expected Outcomes:**
- ✓ Suspension reason stored in audit log
- ✓ Courses unpublished (students cannot enroll)
- ✓ Existing enrollments remain active (students can continue)
- ✓ Instructor cannot login during suspension
- ✓ Cron job auto-reactivates after period
- ✓ Courses remain unpublished (manual republish required)
- ✓ Audit log entries for suspension & reactivation

---

## Design Decisions & Assumptions

### 1. Database Choice: MongoDB vs PostgreSQL

**Decision:** MongoDB (primary), PostgreSQL (alternative)

**Rationale:**
- **MongoDB:** Flexible schema for evolving requirements, horizontal scaling, document-based (natural fit for nested data like credentials, enrollments)
- **PostgreSQL:** ACID transactions, relational integrity, better for complex joins (payout calculations)

**Migration Path:** Provided SQL schemas above; migration scripts can be generated using tools like Mongoose to Sequelize converters.

---

### 2. Authentication: JWT vs Firebase

**Decision:** JWT (primary), Firebase (alternative)

**Rationale:**
- **JWT:** Full control over token lifecycle, custom claims, no vendor lock-in, simpler for self-hosted deployments
- **Firebase:** Managed infrastructure, built-in OAuth, account recovery, but adds dependency

**Hybrid Approach:** Use Firebase for credential management (email/password, OAuth), issue backend JWT with role claims for API access.

---

### 3. Email Provider: SendGrid vs Mailgun

**Decision:** SendGrid (primary), Mailgun (alternative)

**Rationale:**
- **SendGrid:** Higher deliverability, better templates, larger free tier, webhook reliability
- **Mailgun:** Lower cost, better for high-volume, simpler API

**Implementation:** Both providers supported; switch via environment variable.

---

### 4. File Storage: S3 vs Vercel Blob

**Decision:** AWS S3 (primary), Vercel Blob (alternative)

**Rationale:**
- **S3:** Industry standard, CDN integration, cost-effective, presigned URLs for secure uploads
- **Vercel Blob:** Simpler setup, integrated with Vercel, but less flexible

**Implementation:** Presigned URL flow works with both; switch via environment variable.

---

### 5. Job Scheduling: Bull vs Agenda

**Decision:** Bull (primary), Agenda (alternative)

**Rationale:**
- **Bull:** Redis-backed, high performance, excellent for distributed systems
- **Agenda:** MongoDB-backed, simpler setup, but slower for high-volume

**Implementation:** Both support same job types; switch via configuration.

---

### 6. Payout Calculation Timing

**Decision:** Monthly, calculated on last day of month at 23:00 UTC

**Rationale:**
- Aligns with accounting cycles
- Allows time for refund processing
- Predictable for instructors

**Alternative:** Weekly or bi-weekly (configurable per instructor).

---

### 7. Consent Model

**Decision:** Explicit opt-in for sensitive data (maritalStatus, childrenCount)

**Rationale:**
- GDPR/CCPA compliance
- Privacy-first approach
- Separate checkbox for sensitive vs personal data

**Implementation:** Consent stored with version & timestamp; can be revoked anytime.

---

### 8. Sensitive Field Encryption

**Decision:** AES-256 encryption for bank details, mobile money numbers

**Rationale:**
- PCI compliance (no card storage)
- Regulatory requirement (financial data)
- Encryption key rotated quarterly

**Implementation:** Use Node.js `crypto` module; key stored in environment variable.

---

### 9. Audit Log Immutability

**Decision:** Immutable audit logs (no update/delete)

**Rationale:**
- Compliance requirement (SOX, HIPAA)
- Tamper-evident
- Legal defensibility

**Implementation:** Database constraints or separate archive table; regular backups to cold storage.

---

### 10. Rate Limiting Strategy

**Decision:** Redis-backed rate limiting with token bucket algorithm

**Rationale:**
- Distributed (works across multiple servers)
- Flexible (per-user, per-IP, per-endpoint)
- Efficient (O(1) operations)

**Implementation:** Use `redis-rate-limit` or custom implementation.

---

## Migration Guides

### MongoDB → PostgreSQL

**Steps:**
1. Export MongoDB collections to JSON
2. Transform JSON to SQL INSERT statements
3. Run migrations on PostgreSQL
4. Update connection string in environment
5. Update ORM (Mongoose → Sequelize or Prisma)
6. Test all queries
7. Cutover (dual-write for safety)

**Tools:**
- `mongoexport` → JSON
- Custom Node.js script → SQL
- Prisma migrations for schema

---

### JWT → Firebase Auth

**Steps:**
1. Create Firebase project
2. Enable email/password authentication
3. Update login endpoint to use Firebase SDK
4. Exchange Firebase ID token for backend JWT (with role claims)
5. Update middleware to verify Firebase token
6. Migrate existing users to Firebase (batch import)
7. Update frontend to use Firebase SDK
8. Test all auth flows

**Tools:**
- Firebase Admin SDK
- Firebase CLI
- Custom migration script

---

## Conclusion

This specification provides a complete, production-ready blueprint for the An-Nahdah Academy Admin + Instructor Dashboard. Every component, API endpoint, database schema, and security control is documented with acceptance criteria and implementation guidance.

**Key Deliverables:**
- ✓ Complete database schemas (MongoDB & PostgreSQL)
- ✓ 50+ API endpoints with request/response examples
- ✓ Frontend architecture with component hierarchy
- ✓ Email & notification systems (SendGrid, FCM)
- ✓ Security controls (RBAC, encryption, audit logs)
- ✓ Scalability patterns (caching, pre-aggregation, CDN)
- ✓ Deployment guide with environment setup
- ✓ Test scenarios & acceptance criteria
- ✓ Migration paths (DB, Auth)

**Next Steps for Development:**
1. Set up local development environment (MongoDB, Redis)
2. Implement authentication (JWT or Firebase)
3. Build database models & migrations
4. Implement API routes (start with auth, then admin features)
5. Build frontend pages & components
6. Integrate email & notification systems
7. Add job scheduling (payouts, aggregations)
8. Deploy to staging environment
9. Run test scenarios
10. Deploy to production

**Estimated Timeline:**
- Phase 1 (Auth, Core APIs): 2-3 weeks
- Phase 2 (Admin Features): 3-4 weeks
- Phase 3 (Instructor Features, Email): 2-3 weeks
- Phase 4 (Frontend, Testing): 3-4 weeks
- **Total: 10-14 weeks** (with 2-3 developers)

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-28  
**Status:** Ready for Implementation  
**Maintainer:** Development Team
