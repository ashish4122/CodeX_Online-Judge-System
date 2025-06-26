# 💻 CodeX - Online Judge System

A **web-based coding platform** where users can solve programming problems, submit code, and receive verdicts like `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, etc.  
Code is executed **securely in isolated Docker containers** to ensure accurate and safe evaluations.

---

## 🚀 Features

### 👤 User Features
- Register & Login
- Browse and solve coding problems
- Submit code in **C++, Java, or Python**
- View verdicts for each submission (`Accepted`, `WA`, `TLE`, etc.)

---

## 🧱 Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | React.js, Axios, React Router |
| Backend   | Node.js, Express.js    |
| Database  | MongoDB                |
| Execution | Docker (Sandbox)       |
| Hosting   | AWS (EC2/S3/Nginx)     |

---

## 🏗️ Architecture Overview

![image](https://github.com/user-attachments/assets/7abc273b-4423-4b5f-abff-e8cb2c1a2ea2)



---

## 🔧 Backend API Summary

### 🔐 Authentication
- `POST /signup` – Register a new user  
- `POST /login` – Login with credentials  

### 📚 Problems
- `GET /problems` – List all problems  
- `GET /problems/:id` – Get problem details  

### 📝 Submissions
- `POST /submit` – Submit solution code  
---

## 🔄 Data Flow

1. **User selects a problem** → frontend fetches problem details  
2. **User writes & submits code** → code sent to backend  
3. **Backend runs code** inside Docker with time/memory limits  
4. **Output is compared** to expected results  
5. **Verdict stored** in MongoDB → returned to user in UI

