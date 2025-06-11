import React from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { AiOutlineFilePdf, AiOutlineFileWord } from "react-icons/ai";

// Helper functions
const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isPDF = (url) => /\.pdf$/i.test(url);
const isWordDoc = (url) => /\.(doc|docx)$/i.test(url);

const getGoogleDocsViewerUrl = (url) =>
  `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

const TaskAssets = ({ activities = 0, assets = [], subTasks = 0, links = [] }) => {
  const safeAssets = Array.isArray(assets) ? assets : [];
  const safeLinks = Array.isArray(links) ? links : [];

  return (
    <div className='flex flex-col gap-3'>
      {/* Stats Row */}
      <div className='flex items-center gap-3'>
        <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
          <BiMessageAltDetail />
          <span>{activities}</span>
        </div>
        <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
          <MdAttachFile />
          <span>{safeAssets.length + safeLinks.length}</span>
        </div>
        <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
          <FaList />
          <span>0/{subTasks}</span>
        </div>
      </div>

      {/* Asset Previews */}
      <div className='flex gap-2 flex-wrap mt-2'>
        {safeAssets.map((asset, index) => {
          const url = typeof asset === "string" ? asset : asset?.url;
          if (!url) return null;

          if (isImage(url)) {
            return (
              <img
                key={index}
                src={url}
                alt={`attachment-${index}`}
                className="w-16 h-16 object-cover rounded border"
              />
            );
          } else if (isPDF(url)) {
            return (
              <a
                key={index}
                href={getGoogleDocsViewerUrl(url)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-red-600 text-xs border p-1 rounded"
              >
                <AiOutlineFilePdf size={18} />
                PDF
              </a>
            );
          } else if (isWordDoc(url)) {
            return (
              <a
                key={index}
                href={getGoogleDocsViewerUrl(url)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 text-xs border p-1 rounded"
              >
                <AiOutlineFileWord size={18} />
                DOC
              </a>
            );
          } else {
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center gap-1 text-gray-600 text-xs border p-1 rounded"
              >
                <MdAttachFile />
                File
              </a>
            );
          }
        })}

        {safeLinks.map((linkObj, idx) => (
          <a
            key={`link-${idx}`}
            href={linkObj.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-xs truncate max-w-[6rem]"
            title={linkObj.url}
          >
            Link
          </a>
        ))}
      </div>
    </div>
  );
};

export default TaskAssets;
