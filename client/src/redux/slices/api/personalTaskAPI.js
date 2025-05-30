import axios from "axios";

const API = axios.create({
    baseURL: "/api/personal-tasks", // ✅ works with Vite proxy
    withCredentials: true,
  });

// Get all tasks
export const getTasks = () => API.get("/");

// Create a new task
export const createTask = (taskData) => API.post("/", taskData);

// Delete (trash) a task
export const deleteTask = (taskId) => API.delete(`/${taskId}`);
