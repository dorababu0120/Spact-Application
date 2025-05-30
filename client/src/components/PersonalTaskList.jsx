import React, { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask } from "../redux/slices/api/personalTaskAPI";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const PersonalTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    priority: "Low",
    notes: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data.tasks);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(form);
      setForm({ title: "", date: "", priority: "Low", notes: "" });
      setShowCreateModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  const confirmDelete = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTask(taskToDelete);
      setShowDeleteModal(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Personal Task Manager</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <IoMdAdd />
          Create Personal Task
        </button>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="border rounded-xl p-4 shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600">Due: {task.date?.slice(0, 10)}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Priority:</span> {task.priority}
                </p>
                {task.notes && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Notes:</span> {task.notes}
                  </p>
                )}
              </div>
              <button
                onClick={() => confirmDelete(task._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800"
            >
              <RxCross2 />
            </button>
            <h3 className="text-xl font-semibold mb-4">Create Personal Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Task Name"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTaskList;
