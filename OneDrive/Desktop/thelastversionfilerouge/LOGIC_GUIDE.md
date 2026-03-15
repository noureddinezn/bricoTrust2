# 🎯 BricoTrust - Simple Logic Guide for Beginners

This document explains how BricoTrust works in simple, easy-to-understand language.

---

## 🏗️ How the Project is Structured

### Users (3 Types)

1. **Client** - A person looking for an artisan to do work
   - Can search for artisans
   - Can request services
   - Can rate artisans after work is done

2. **Artisan** - A skilled worker (electrician, plumber, etc)
   - Has a profile showing their skills
   - Receives service requests from clients
   - Can add photos of their work
   - Gets rated by clients

3. **Admin** - Manager of the platform
   - Approves new artisans
   - Bans artisans who get too many complaints
   - Manages services and content

---

## 🔐 Authentication (Login/Register)

### Step-by-Step: What Happens When Someone Registers

```
1. User fills the registration form
   ↓
2. Form sends data to server
   ↓
3. Server checks if data is valid:
   - Email format is correct? ✓
   - Email doesn't already exist? ✓
   - Password is at least 8 characters? ✓
   ↓
4. If it's an ARTISAN they register as:
   - Create a User account
   - Create an Artisan profile
   - Set artisan status to "pending" (waiting for approval)
   ↓
5. If it's a CLIENT they register as:
   - Create a User account only
   - No additional approval needed
   ↓
6. Log them in
   ↓
7. Redirect to dashboard
```

### What Happens When Someone Logs In

```
1. User enters email and password
   ↓
2. Server checks database:
   - Does this email exist? 
   - Is the password correct?
   ↓
3. If WRONG:
   - Show error message
   - Let them try again
   ↓
4. If CORRECT:
   - Log them in
   - Start a session
   - If they're ADMIN → send to admin dashboard
   - If they're CLIENT/ARTISAN → send to regular dashboard
```

---

## 👨‍💼 Artisan System

### 3-Step Approval Process

```
STEP 1: ARTISAN REGISTERS
   ├─ Fills profile with: name, city, district, experience
   └─ Status = "pending" ⏳

STEP 2: ADMIN REVIEWS
   ├─ Admin goes to admin dashboard
   ├─ Sees list of pending artisans
   └─ Clicks "Approve" or "Reject"

STEP 3: ARTISAN IS APPROVED
   ├─ Status = "approved" ✅
   ├─ Now appears in search results
   ├─ Can add portfolio photos
   └─ Clients can book them
```

### How Artisan Profiles Work

**Only Approved Artisans Can:**
- Appear in search results
- Receive service requests
- Add portfolio photos
- Get rated by clients

**Unapproved Artisans:**
- Can't be seen by clients
- Can't receive requests
- Must wait for admin approval

---

## 🔍 Search System (Finding Artisans)

### How Clients Find Artisans

```
CLIENT SEARCHES:
   ├─ Choose Category (e.g., "Electrician")
   ├─ Choose City (e.g., "Casablanca")
   ├─ Choose District (e.g., "Medina")
   └─ Click SEARCH

SERVER DOES:
   ├─ Get ALL approved artisans
   ├─ Filter by selected category
   ├─ Filter by selected city
   ├─ Filter by selected district
   ├─ Sort by rating (best first)
   └─ Show results (9 per page)
```

**Important:** Only APPROVED artisans show up in search results

---

## 📞 Service Requests (How Work Gets Done)

### 6-Step Service Request Process

```
STEP 1: CLIENT REQUESTS SERVICE
   ├─ Client visits approved artisan profile
   ├─ Clicks "Request Service"
   ├─ Chooses what service they need
   ├─ Writes description of work
   └─ Clicks "Send Request"
   
STEP 2: SERVICE REQUEST IS CREATED
   ├─ Request is saved to database
   ├─ Status = "pending" (waiting for artisan response)
   └─ Artisan gets a notification

STEP 3: ARTISAN ACCEPTS OR REJECTS
   ├─ Artisan sees the request in their dashboard
   ├─ Clicks "Accept" or "Reject"
   └─ If accepted:
       └─ Status changes to "accepted"

STEP 4: WORK IS COMPLETED
   ├─ Artisan does the work
   ├─ Client confirms work is done
   └─ Status changes to "completed"

STEP 5: CLIENT RATES THE ARTISAN
   ├─ Client can now leave a review
   ├─ Gives 1-5 star rating
   ├─ Writes optional comment
   └─ Clicks "Submit Review"

STEP 6: ARTISAN'S RATING IS UPDATED
   ├─ Server calculates average of all reviews
   ├─ Updates artisan's average rating
   └─ Artisan moves up/down in leaderboard
```

---

## ⭐ Rating System

### How Ratings Work

#### Client Reviews Artisan After Completion

```
CLIENT LEAVES REVIEW:
   ├─ Gives rating: 1-5 stars
   ├─ Writes optional comment
   └─ Clicks Submit

SERVER UPDATES ARTISAN:
   ├─ Add review to database
   ├─ Calculate average of ALL reviews
   ├─ Example:
   │  - Review 1: 5 stars
   │  - Review 2: 4 stars
   │  - Review 3: 5 stars
   │  - Average = (5+4+5)/3 = 4.67 stars
   └─ Update artisan's average_rating = 4.67
```

#### Leaderboard (Top Artisans)

The leaderboard shows the BEST artisans ranked by:
1. **Training Rating** (highest first)
2. **Completed Jobs** (if tied on rating)

```
LEADERBOARD LOGIC:
┌─────────┬─────────────────────┬─────────────────┐
│ Rank    │ Artisan             │ Rating          │
├─────────┼─────────────────────┼─────────────────┤
│ #1      │ Ahmed (Electrician) │ 4.9 ⭐⭐⭐⭐⭐ │
│ #2      │ Fatima (Plumber)    │ 4.8 ⭐⭐⭐⭐ │
│ #3      │ Karim (Painter)     │ 4.7 ⭐⭐⭐⭐ │
└─────────┴─────────────────────┴─────────────────┘
```

---

## ⚠️ Report System (Handling Bad Artisans)

### What Happens When a Client Reports an Artisan

```
STEP 1: CLIENT REPORTS ARTISAN
   ├─ Client clicks "Report"
   ├─ Selects reason (rude, unqualified, etc.)
   ├─ Writes description
   └─ Clicks "Submit Report"

STEP 2: REPORT IS CREATED
   ├─ Report saved to database
   ├─ Status = "pending"
   └─ Admin gets notified

STEP 3: ADMIN REVIEWS REPORT
   ├─ Admin sees all pending reports
   ├─ Reads reason and description
   ├─ Investigates if needed
   └─ Clicks "Resolve"

STEP 4: ARTISAN MAY BE BANNED
   ├─ If many complaints → Admin bans artisan
   ├─ Artisan status = "banned"
   └─ Artisan disappears from search results
```

**Important:** A banned artisan can appeal to admin to be unbanned

---

## 📊 Admin Dashboard (Manager View)

### What Admin Can See and Do

```
ADMIN DASHBOARD SHOWS:
├─ Total number of users
├─ Total number of artisans
├─ How many artisans are pending approval
├─ How many are approved
├─ How many are banned
└─ How many reports are pending

ADMIN ACTIONS:
├─ Approve new artisans
├─ Ban artisans who get too many reports
├─ Manage services (add/edit/delete)
├─ View and resolve reports
├─ View all users
└─ View leaderboard
```

---

## 📁 File Organization

### Where Each Part of the Code Lives

```
Src/
├── app/
│   ├── Http/
│   │   ├── Controllers/          ← Contains business logic
│   │   │   ├── AuthController.php        (Login/Register)
│   │   │   ├── ArtisanController.php     (Artisan profiles)
│   │   │   ├── ReviewController.php      (Reviews & ratings)
│   │   │   ├── AdminController.php       (Admin functions)
│   │   │   └── ... (other controllers)
│   │   │
│   │   └── Middleware/           ← Security checks
│   │       ├── EnsureArtisanApproved.php (Check if approved)
│   │       └── RoleMiddleware.php        (Check user role)
│   │
│   ├── Models/                   ← Database connections
│   │   ├── User.php              (User data)
│   │   ├── Artisan.php           (Artisan data)
│   │   ├── Review.php            (Reviews data)
│   │   ├── ServiceRequest.php    (Service requests)
│   │   └── ... (other models)
│   │
│   └── Exceptions/               ← Error handling
│       ├── Handler.php           (Main error handler)
│       ├── ArtisanNotApprovedException.php
│       └── ... (other errors)
│
├── database/
│   └── migrations/               ← Database setup
│       ├── create_users_table.php
│       ├── create_artisans_table.php
│       └── ... (other tables)
│
├── routes/
│   └── web.php                   ← All URLs (routes)
│       ├── GET /register
│       ├── POST /register
│       ├── GET /login
│       ├── POST /login
│       ├── GET /artisans
│       ├── GET /leaderboard
│       └── ... (other routes)
│
└── resources/
    └── views/                    ← HTML templates
        ├── auth/
        ├── artisans/
        ├── reviews/
        └── ... (other pages)
```

---

## 🔄 Data Flow Examples

### Example 1: A Client Books an Artisan

```
┌─────────────────────────────────────────────────────────┐
│ CLIENT'S BROWSER                                        │
│ Clicks "Request Service" button                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ HTTP POST REQUEST
┌─────────────────────────────────────────────────────────┐
│ LARAVEL SERVER                                          │
│ ServiceRequestController.php receives request           │
│                                                         │
│ 1. Check if client is logged in ✓                      │
│ 2. Validate form data ✓                                │
│ 3. Check if artisan is approved ✓                      │
│ 4. Create service request in database                  │
│ 5. Send success message                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ HTTP RESPONSE
┌─────────────────────────────────────────────────────────┐
│ CLIENT'S BROWSER                                        │
│ Shows "Service request sent successfully!"              │
└─────────────────────────────────────────────────────────┘
```

### Example 2: A Client Rates an Artisan

```
┌──────────────────────────────────────────────────┐
│ CLIENT SUBMITS REVIEW (5 stars + comment)        │
└─────────────────────┬──────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│ SERVER VALIDATES:                                │
│ ✓ Client owns this service request              │
│ ✓ Work is completed                             │
│ ✓ No review exists yet                          │
│ ✓ Rating is 1-5 stars                           │
└─────────────────────┬──────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│ SAVE review to database                          │
│ - service_request_id: 123                        │
│ - client_id: 45                                  │
│ - rating: 5                                      │
│ - comment: "Great work!"                         │
└─────────────────────┬──────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│ CALCULATE NEW AVERAGE:                           │
│ All reviews for this artisan:                    │
│ - Review 1: 4 stars                              │
│ - Review 2: 5 stars  ← NEW                       │
│ - Review 3: 3 stars                              │
│                                                  │
│ Average = (4+5+3)/3 = 4.0 stars                 │
└─────────────────────┬──────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│ UPDATE artisan:                                  │
│ average_rating = 4.0                             │
│                                                  │
│ Artisan position in leaderboard CHANGES          │
└──────────────────────────────────────────────────┘
```

---

## 🛡️ Security

### What Protects BricoTrust

```
1. AUTHENTICATION
   └─ Login required for personal actions
      ✓ Can't view your dashboard without logging in
      ✓ Can't submit review as someone else

2. AUTHORIZATION
   └─ Role checking (Client vs Artisan vs Admin)
      ✓ Client can't approve artisans (admin only)
      ✓ Artisan can't see other artisans' requests
      ✓ Client can't edit artisan profile

3. VALIDATION
   └─ Form data is checked
      ✓ Email must look like email
      ✓ Rating must be 1-5
      ✓ Password must be at least 8 characters

4. DATABASE PROTECTION
   └─ Prevents SQL injection
      ✓ Laravel queries are safe by default
      ✓ No direct database access from views

5. PASSWORD HASHING
   └─ Passwords not stored as plain text
      ✓ Even admin can't see passwords
      ✓ Uses bcrypt encryption
```

---

## 🚀 Quick Reference

### Key Files to Understand

| File | Purpose |
|------|---------|
| `AuthController.php` | Register, login, logout |
| `ArtisanController.php` | View artisans, search, leaderboard |
| `ReviewController.php` | Submit and view reviews |
| `AdminController.php` | Approve artisans, manage content |
| `ServiceRequestController.php` | Create and manage service requests |
| `routes/web.php` | All URLs (what page is at what link) |
| `app/Models/` | How data is stored and connected |

### Common Actions and Their Files

| Action | Goes Through |
|--------|-------------|
| User registers | `AuthController.register()` |
| User logs in | `AuthController.login()` |
| Client searches artisans | `ArtisanController.index()` |
| Client rates artisan | `ReviewController.store()` |
| Admin approves artisan | `AdminController.approveArtisan()` |
| Artisan edits profile | `ArtisanController.update()` |

---

## ✅ Summary

BricoTrust is built on these simple concepts:

1. **Users** - Three types (Client, Artisan, Admin)
2. **Authentication** - Login system to identify users
3. **Authorization** - Different permissions for different user types
4. **Search** - Find artisans by category, city, district
5. **Service Requests** - Clients book artisans
6. **Ratings** - Clients rate completed work
7. **Leaderboard** - Top artisans ranked by rating
8. **Admin Controls** - Approve/reject artisans, handle reports
9. **Reports** - Report bad artisans

Everything else is just variations on these core concepts!

---

**Made with ❤️ for beginners**
