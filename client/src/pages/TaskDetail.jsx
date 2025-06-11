import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Tabs } from "../components";
import { TaskColor } from "../components/tasks";
import {
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector } from "react-redux";
import axios from "axios";

// Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Are you sure you want to leave this task?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
  leave: (
    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
      <MdTaskAlt size={24} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
  "Leave",
];

const ActivityCard = ({ item }) => (
  <div className="flex space-x-4">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-10 h-10 flex items-center justify-center">
        {TASKTYPEICON[item?.type]}
      </div>
      <div className="h-full flex items-center">
        <div className="w-0.5 bg-gray-300 h-full"></div>
      </div>
    </div>
    <div className="flex flex-col gap-y-1 mb-8">
      <p className="font-semibold">{item?.by?.name}</p>
      <div className="text-gray-500 space-x-2">
        <span className="capitalize">{item?.type}</span>
        <span className="text-sm">{moment(item?.date).fromNow()}</span>
      </div>
      <div className="text-gray-700">{item?.activity}</div>
    </div>
  </div>
);

const Activities = ({ activity = [], id, refetch }) => {
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter activity details");
      return;
    }

    try {
      const data = {
        type: selected.toLowerCase(),
        activity: text.trim(),
      };

      const res = await postActivity({ id, data }).unwrap();
      toast.success(res?.message || "Activity added successfully");
      setText("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to add activity");
    }
  };

  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>
        <div className="w-full space-y-0">
          {activity.map((item) => (
            <ActivityCard key={item.id || item._id} item={item} />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Add Activity</h4>
        <div className="w-full flex flex-wrap gap-5">
          {act_types.map((item) => (
            <label key={item} className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                name="activityType"
                className="w-4 h-4"
                checked={selected === item}
                onChange={() => setSelected(item)}
              />
              <span>{item}</span>
            </label>
          ))}

          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type activity details..."
            className="bg-white w-full mt-6 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"
          />

          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type="button"
              label="Submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("assets");
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const user = useSelector((state) => state.auth.user);
  const [selectedTab, setSelectedTab] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false); // <-- Added modal state

  const task = data?.task;

  const isTeamMember = task?.team?.some((m) => m._id === user?._id);
  const isAdmin = user?.role === "admin";
  const canLeaveTask =
    isTeamMember &&
    !isAdmin &&
    (task?.stage === "todo" || task?.stage === "assigned");

  const handleLeaveTask = async () => {
    try {
      const res = await axios.put(`/api/tasks/leave/${id}`);
      toast.success("Successfully left the task!"); // <-- Toast message
      navigate("/tasks");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to leave task");
    }
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-10 text-center text-red-500 font-semibold">
        Task not found!
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 font-bold">{task.title}</h1>

      <Tabs tabs={TABS} setSelected={setSelectedTab}>
        {selectedTab === 0 ? (
          <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="flex items-center gap-5">
                <div
                  className={clsx(
                    "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                    PRIOTITYSTYELS[task.priority],
                    bgColor[task.priority]
                  )}
                >
                  <span className="text-lg">{ICONS[task.priority]}</span>
                  <span className="uppercase">{task.priority} Priority</span>
                </div>

                <div className="flex items-center gap-2">
                  <TaskColor className={TASK_TYPE[task.stage]} />
                  <span className="text-black uppercase">{task.stage}</span>
                </div>
              </div>

              <p className="text-gray-500">
                Created At: {new Date(task.date).toDateString()}
              </p>

              <div className="flex items-center gap-8 p-4 border-y border-gray-200">
              <div className="space-x-2">
  <span className="font-semibold">Attachments:</span>
  <span>
    {`Files: ${task.assets?.length || 0}, Links: ${task.links?.length || 0}`}
  </span>
</div>

                <span className="text-gray-400">|</span>
                <div className="space-x-2">
                  <span className="font-semibold">Sub-Task :</span>
                  <span>{task.subTasks?.length || 0}</span>
                </div>
              </div>

              <div className="space-y-4 py-6">
                <p className="text-gray-500 font-semibold text-sm">TASK TEAM</p>
                <div className="space-y-3">
                  {task.team?.map((m) => (
                    <div
                      key={m._id}
                      className="flex gap-4 py-2 items-center border-t border-gray-200"
                    >
                      <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600">
                        <span className="text-center">{getInitials(m.name)}</span>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{m.name}</p>
                        <span className="text-gray-500">{m.title}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {canLeaveTask && (
                  <Button
                    label="Leave Task"
                    onClick={() => setShowConfirm(true)} // <-- Trigger confirmation modal
                    className="bg-red-500 text-white rounded mt-4"
                  />
                )}
              </div>

              <div className="space-y-4 py-6">
                <p className="text-gray-500 font-semibold text-sm">SUB-TASKS</p>
                <div className="space-y-8">
                  {task.subTasks?.map((el) => (
                    <div key={el._id} className="flex gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-200">
                        <MdTaskAlt className="text-violet-600" size={26} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex gap-2 items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(el.date).toDateString()}
                          </span>
                          <span className="px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold">
                            {el.tag}
                          </span>
                        </div>
                        <p className="text-gray-700">{el.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

           <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">ASSETS</p>
                <select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="assets">Assets</option>
                  <option value="links">Links</option>
                </select>
              </div>

              {viewType === "assets" && (
  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    {task.assets?.map((el, i) => {
      const isPDF = el.toLowerCase().endsWith(".pdf");

      return isPDF ? (
        <a
          key={i}
          href={el}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded hover:shadow transition bg-white"
        >
          <div className="w-16 h-20 flex items-center justify-center bg-red-100 rounded">
            <span className="text-red-600 font-bold">PDF</span>
          </div>
          <p className="mt-2 text-sm text-blue-600 underline text-center break-words">
            Open PDF
          </p>
        </a>
      ) : (
        <img
          key={i}
          src={el}
          alt={`asset-${i}`}
          className="w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-700 md:hover:scale-125 hover:z-50"
        />
      );
    })}
  </div>
)}


              {viewType === "links" && (
                <div className="space-y-2">
                  {task.links?.length > 0 ? (
                    task.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 underline hover:text-blue-800"
                      >
                        {link.name || link.url}
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500">No links available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <Activities activity={task.activities || []} refetch={refetch} id={id} />
        )}
      </Tabs>

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLeaveTask}
      />
    </div>
  );
};
export default TaskDetail;