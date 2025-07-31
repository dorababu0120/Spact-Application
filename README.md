# Spact – Fullstack Todo Task Management Application (MERN)

## Overview
**Spact** is a web application designed to streamline task management for teams and individuals. Built using the MERN stack (MongoDB, Express.js, React, and Node.js), it offers a user-friendly interface for efficient task assignment, tracking, and collaboration. The platform supports both company-level tasks and personal task management, making it ideal for modern work environments.

## Why/Problem?
In today’s fast-paced workplaces, managing tasks across teams and individuals can quickly become chaotic. Traditional systems like spreadsheets or messaging apps are not scalable and lack structure. **Spact** solves this by offering a centralized system where all users—admins and regular employees—can manage their tasks clearly and effectively.

## Background
With increasing adoption of remote and hybrid work, tools like **Spact** are essential. It offers an organized interface built on modern web technologies to help teams collaborate better and stay on top of their work. Its MERN-based architecture ensures scalability, while Redux Toolkit, Headless UI, and Tailwind CSS enhance performance and user experience.

---

## Admin Features
1. **User Management:**
   - Create admin accounts.
   - Add and manage team members.
   - Disable or activate user accounts.

2. **Task Assignment:**
   - Assign tasks to individual or multiple users.
   - Attach links, documents, or images (via Cloudinary).
   - Set priority levels: High, Medium, Normal, Low.
   - Set task status: Todo, In Progress, Completed.
   - Choose task deadlines and metadata.

3. **Task Management:**
   - View tasks in both **board view** and **list view**.
   - Update task details.
   - Add and manage sub-tasks.
   - Move tasks to trash or delete permanently.

4. **Personal Task Section:**
   - Admins can also manage their own **personal tasks**, separate from team tasks.

---

## User Features
1. **Task Interaction:**
   - View tasks assigned by the admin.
   - Change task status to In Progress or Completed.
   - Use the **Leave Task** option to opt out of a task assigned by the admin.

2. **Personal Task Section:**
   - Users can manage their own personal task list.

3. **Task Views & Tracking:**
   - View tasks in list or board formats for better visibility.

---

## General Features
1. **Authentication and Authorization:**
   - Secure login using JWT.
   - Role-based access control.

2. **Profile Management:**
   - Users can update personal information and preferences.

3. **Password Management:**
   - Secure password change functionality.

4. **Dashboard:**
   - Overview of task statuses: Todo, In Progress, Completed.
   - Priority chart for visual analytics.
   - List of current tasks and team members.

---

## Technologies Used

### Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Headless UI
- React Router
- Axios
- Chart.js / Recharts

### Backend
- Node.js with Express.js
- JWT for authentication
- Bcrypt for password encryption
- Mongoose for MongoDB integration

### Other Tools
- Firebase (for optional auth)
- Cloudinary (to upload images & PDFs)
- Postman (for API testing)

---

## Setup Instructions

### Server Setup

#### Environment Variables (`.env`)

First, create the environment variables file `.env` in the server folder. The `.env` file contains the following environment variables:

- MONGODB_URI = `your MongoDB URL`
- JWT_SECRET = `any secret key - must be secured`
- PORT = `8800` or any port number
- NODE_ENV = `development`


&nbsp;

## Set Up MongoDB:

1. Setting up MongoDB involves a few steps:
    - Visit MongoDB Atlas Website
        - Go to the MongoDB Atlas website: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).

    - Create an Account
    - Log in to your MongoDB Atlas account.
    - Create a New Cluster
    - Choose a Cloud Provider and Region
    - Configure Cluster Settings
    - Create Cluster
    - Wait for Cluster to Deploy
    - Create Database User
    - Set Up IP Whitelist
    - Connect to Cluster
    - Configure Your Application
    - Test the Connection

2. Create a new database and configure the `.env` file with the MongoDB connection URL. 

## Steps to run server

1. Open the project in any editor of choice.
2. Navigate into the server directory `cd server`.
3. Run `npm i` or `npm install` to install the packages.
4. Run `npm start` to start the server.

If configured correctly, you should see a message indicating that the server is running successfully and `Database Connected`.

&nbsp;

# Client Side Setup

## Environment variables
First, create the environment variables file `.env` in the client folder. The `.env` file contains the following environment variables:

- VITE_APP_BASE_URL = `http://localhost:8800` #Note: Change the port 8800 to your port number.
- VITE_APP_FIREBASE_API_KEY = `Firebase api key`

## Steps to run client

1. Navigate into the client directory `cd client`.
2. Run `npm i` or `npm install` to install the packages.
3. Run `npm start` to run the app on `http://localhost:3000`.
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
&nbsp;


