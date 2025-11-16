# 🗳️ Voting and Feedback System

A full-stack web application that allows users to vote and give feedback on various topics. Built with a **NestJS** backend and (soon) a modern frontend framework like **React** or **Next.js**.

---

## 📁 Project Structure
## 🚀 Features

- ✅ User Registration & Login
- ✅ Secure Voting Mechanism
- ✅ Feedback Submission
- 📊 Admin Dashboard 
- 📩 Email Notifications (planned)
- 📱 Responsive Design 

---

## 🛠️ Tech Stack

### Backend
- [NestJS](https://nestjs.com/)
- TypeScript
- REST API
- PostgreSQL

### Frontend (Planned)
- React (or Next.js)
- Tailwind CSS
- Axios


## 🧩 Project Breakdown (MVP)

### 👤 User Roles

#### 1. Admin
- Creates polls/voting topics
- Views results and manages feedback

#### 2. User (General Public)
- Views and votes in available polls
- Submits feedback anonymously or with name

---

## 🛠️ Core Features (Phase 1 - MVP)

### ✅ Authentication
- Signup/Login with email
- (Future) Optional Citizen ID / Student ID-based login
- Role-based access (admin, user)

### 🗳️ Voting System
- Displays a list of active polls (title + description)
- Users can vote **only once per poll**
- Secure vote storage

### 💬 Feedback Module
- Users can submit feedback (with or without identity)
- Admin can view and optionally reply to feedback

### 📊 Results View
- Poll results shown via percentage bars or pie charts
- Results visible:
  - Only after poll closes (for users)
  - Anytime for admins


