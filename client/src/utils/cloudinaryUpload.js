export const uploadToCloudinary = async (file) => {
    const cloudName = "dqcyv2vm7"; // Replace with your Cloudinary cloud name
    const uploadPreset = "MERN Task App"; // Replace with your upload preset
    const folder = "Todo";
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
  
    // Use 'auto' so Cloudinary detects image vs raw automatically
    const fileType = file.type;
    const resourceType = fileType.startsWith("image/") ? "image" : "raw";
  
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    if (!res.ok) throw new Error("Upload failed");
  
    const data = await res.json();
    return data.secure_url;
  };
  