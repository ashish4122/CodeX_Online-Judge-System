CodeX-Online Judge System
A web-based coding platform where users can solve problems, submit code, and receive verdicts like Accepted, Wrong Answer, TLE, etc. Code is executed securely using isolated Docker containers.

🚀 Features
👤 Users
Register & Login

Browse and solve coding problems

Submit code in C++, Java, or Python

View verdicts


🧱 Tech Stack
Frontend: React.js, Axios, React Router

Backend: Node.js, Express.js

Database: MongoDB

Code Execution: Docker sandbox

Deployment: AWS

Architecture Overview

[React Frontend] ⇄ [Express Backend] ⇄ [MongoDB]
                             ⇣
                 [Docker Execution Engine]

🔧 Backend API Summary
Auth: /register, /login, /logout

Problems: GET /problems, GET /problems/:id, POST /admin/problem

Submissions: POST /submit, GET /submissions/:userId, GET /submission/:id

🔄 Data Flow
User selects a problem → frontend fetches details

User writes & submits code → sent to backend

Backend runs code in Docker & checks output

Verdict stored in DB → shown to user

