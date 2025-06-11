import React from "react";
import { Dialog } from "@headlessui/react";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages, BiLink } from "react-icons/bi";
import { toast } from "sonner";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UsersSelect";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
  const userId = useSelector((state) => state.auth.user._id);

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: task?.team || [],
    stage: task?.stage?.toUpperCase() || LISTS[0],
    priority: task?.priority?.toUpperCase() || PRIORIRY[2],
    assets: task?.assets || [],
    links: task?.links || [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(defaultValues.stage);
  const [team, setTeam] = useState(defaultValues.team);
  const [priority, setPriority] = useState(defaultValues.priority);
  const [assets, setAssets] = useState([]);
  const [uploadedFileURLs, setUploadedFileURLs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [links, setLinks] = useState(defaultValues.links);
  const [uploadMode, setUploadMode] = useState("assets");
const uploadFile = async (file) => {
  try {
    const url = await uploadToCloudinary(file);
    return url;
  } catch (err) {
    console.error("Cloudinary upload error", err);
    throw err;
  }
};


  const handleSelect = (e) => {
    setAssets(Array.from(e.target.files));
  };

  const composeAttachmentActivity = (allAssetsURLs, allLinks) => {
    const attachments = [
      ...allAssetsURLs.map((url) => ({ url, type: "file" })),
      ...allLinks.map((linkObj) => ({ url: linkObj.url, type: "link" })),
    ];
    if (attachments.length === 0) return null;
    const lines = attachments.map(
      (att, idx) => `Attachment ${idx + 1} (${att.type}): ${att.url}`
    );
    return `Added attachments:\n${lines.join("\n")}`;
  };

  const handleOnSubmit = async (data) => {
    setUploading(true);
    let newUploadedURLs = [];

    try {
      for (const file of assets) {
        const url = await uploadFile(file);
        newUploadedURLs.push(url);
      }
    } catch (error) {
      toast.error("Error uploading files");
      setUploading(false);
      return;
    }

    const existingAssets = task?.assets || [];
    const allAssetsURLs = [...existingAssets, ...newUploadedURLs];
    const allLinks = [...links];

    const attachmentActivity = composeAttachmentActivity(allAssetsURLs, allLinks);

    const newData = {
      ...data,
      assets: allAssetsURLs,
      links: allLinks,
      team,
      stage,
      priority,
      activities: attachmentActivity
        ? [
            ...(task?.activities || []),
            {
              type: "attachment",
              activity: attachmentActivity,
              by: userId,
              date: new Date().toISOString(),
            },
          ]
        : task?.activities || [],
    };

    try {
      const mutation = task?._id ? updateTask : createTask;
      const payload = task?._id ? { ...newData, _id: task._id } : newData;
      const res = await mutation(payload).unwrap();
      toast.success(res.message);
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Submit failed");
    }

    setUploading(false);
  };

  const existingAssetsCount = task?.assets?.length || 0;
  const newAssetsCount = assets.length;
  const linksCount = links.length;
  const totalAttachments = existingAssetsCount + newAssetsCount + linksCount;

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="p-4 max-w-md mx-auto text-sm">
        <div className="relative">
          <Dialog.Title className="text-sm font-semibold text-gray-800 mb-2">
            {task ? "Update Task" : "Add Task"}
          </Dialog.Title>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>

        <div className="space-y-4">
          <Textbox
            placeholder="Task title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full"
            register={register("title", { required: "Title is required!" })}
            error={errors.title?.message}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className="flex gap-2">
            <SelectList label="Stage" lists={LISTS} selected={stage} setSelected={setStage} />
            <SelectList label="Priority" lists={PRIORIRY} selected={priority} setSelected={setPriority} />
          </div>

          <Textbox
            placeholder="Date"
            type="date"
            name="date"
            label="Task Date"
            className="w-full"
            register={register("date", { required: "Date is required!" })}
            error={errors.date?.message}
          />

          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => setUploadMode("assets")}
                className={`p-1.5 rounded-full text-base ${uploadMode === "assets" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                title="Upload File"
              >
                <BiImages />
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("links")}
                className={`p-1.5 rounded-full text-base ${uploadMode === "links" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                title="Add Link"
              >
                <BiLink />
              </button>
              <span className="text-xs ml-auto font-medium">Attachments: {totalAttachments}</span>
            </div>

            {uploadMode === "assets" ? (
              <>
                <label htmlFor="imgUpload" className="flex items-center gap-1 cursor-pointer text-blue-600 hover:underline text-sm">
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={handleSelect}
                    accept=".jpg, .png, "
                    multiple
                  />
                  <BiImages /> <span>Select Files</span>
                </label>

                {assets.length > 0 && (
                  <ul className="list-decimal list-inside mt-1 text-xs text-gray-700">
                    {assets.map((file, idx) => (
                      <li key={idx} className="truncate">
                        {`Attachment ${existingAssetsCount + idx + 1}: ${file.name}`}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="Enter link"
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (linkInput.trim()) {
                        setLinks([...links, { url: linkInput.trim() }]);
                        setLinkInput("");
                      }
                    }}
                    className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 text-xs"
                  >
                    Add
                  </button>
                </div>

                {links.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                    {links.map((link, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <a href={link.url} target="_blank" rel="noreferrer" className="underline truncate w-5/6">
                          {link.url}
                        </a>
                        <button
                          type="button"
                          onClick={() => setLinks(links.filter((_, i) => i !== idx))}
                          className="text-red-500 text-xs ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {uploading ? (
          <div className="py-3">
            <Loading />
          </div>
        ) : (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Submit"
              type="submit"
              className="bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            />
            <Button
              label="Cancel"
              type="button"
              onClick={() => setOpen(false)}
              className="bg-white px-3 py-1.5 text-xs font-medium text-gray-900 border"
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
