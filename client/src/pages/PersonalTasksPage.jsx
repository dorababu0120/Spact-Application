import React, { useState, useEffect } from "react";
import PersonalTaskList from "../components/PersonalTaskList";
import CreateTaskModal from "../components/CreateTaskModal";

const PersonalTasksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">My Personal Task Manager</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Create Personal Task
        </button>
      </div>

      <PersonalTaskList />
      {isModalOpen && (
        <CreateTaskModal closeModal={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default PersonalTasksPage;
