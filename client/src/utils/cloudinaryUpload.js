export const uploadToCloudinary = async (file) => {
    const cloudName = "dqcyv2vm7"; // 🔁 Replace with yours
    const uploadPreset = "MERN Task App"; // Your unsigned preset
    const folder = "Todo"; // Optional: matches your preset folder
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Upload failed");
  
    const data = await res.json();
    return data.secure_url; // The uploaded file URL
  };
  