// frontend/src/components/MultiStepProfile.jsx

import React, { useEffect, useState, useRef } from "react"; // <-- Import useRef
import axios from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationCombobox } from "@/components/ui/LocationCombobox"; 
import { OccupationCombobox } from "@/components/ui/OccupationCombobox";
import { Loader2 } from "lucide-react"; // <-- For loading spinner

// A working default avatar
const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

// --- Step 1 Component (NOW INCLUDES FILE UPLOAD) ---
const Step1_Basics = ({ data, setData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null); // Ref to hidden file input

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Get Cloudinary credentials from .env
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      
      if (result.secure_url) {
        // Set the new image URL in our form data
        setData({ ...data, profilePic: result.secure_url });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      
      {/* --- NEW PROFILE PIC UPLOADER --- */}
      <label className="block text-sm">Profile Picture</label>
      <div className="flex items-center gap-4">
        <img
          src={data.profilePic || defaultAvatar}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-border"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current.click()} // Trigger hidden input
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isUploading ? "Uploading..." : "Change Picture"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" // Hide the default ugly input
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>
      {/* --- END OF UPLOADER --- */}

      <label className="block text-sm pt-4">Full name</label>
      <Input value={data.name || ""} onChange={(e) => setData({ ...data, name: e.target.value })} />
      
      <label className="block text-sm mt-2">Phone Number</label>
      <Input 
        type="tel" 
        placeholder="e.g. 9876543210"
        value={data.phone || ""} 
        onChange={(e) => setData({ ...data, phone: e.target.value })} 
      />

      <label className="block text-sm mt-2">Age</label>
      <Input type="number" value={data.age || ""} onChange={(e) => setData({ ...data, age: e.target.value })} />
      <label className="block text-sm mt-2">Gender</label>
      <select 
        value={data.gender || ""} 
        onChange={(e) => setData({ ...data, gender: e.target.value })} 
        className="w-full p-2 border rounded bg-transparent"
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

// --- Step 2 Component (No changes) ---
const Step2_Lifestyle = ({ data, setData }) => {
  const toggleTag = (tag) => {
    const set = new Set(data.lifestyle || []);
    if (set.has(tag)) set.delete(tag);
    else set.add(tag);
    setData({ ...data, lifestyle: Array.from(set) });
  };
  const tags = ["Non-smoker", "Pet-friendly", "Vegetarian", "Night Owl", "Early Bird", "Clean", "Social"];
  return (
    <div className="space-y-3">
      <label className="block text-sm">Lifestyle (choose multiple)</label>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => {
          const active = (data.lifestyle || []).includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`px-3 py-1 rounded-full border ${active ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-accent"}`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <label className="block text-sm mt-3">Short bio</label>
      <textarea 
        value={data.bio || ""} 
        onChange={(e) => setData({ ...data, bio: e.target.value })} 
        className="w-full p-2 border rounded bg-transparent"
        maxLength={200} 
      />
    </div>
  );
};

// --- Step 3 Component (No changes) ---
const Step3_BudgetLocation = ({ data, setData }) => (
  <div className="space-y-3">
    <label className="block text-sm">Location (city / area)</label>
    <LocationCombobox
      value={data.location || ""}
      onChange={(value) => {
        setData({ ...data, location: value });
      }}
    />
    <label className="block text-sm mt-2">Monthly budget (INR)</label>
    <Input type="number" value={data.budget || ""} onChange={(e) => setData({ ...data, budget: e.target.value })} />
    <label className="block text-sm mt-2">Occupation</label>
    <OccupationCombobox
      value={data.occupation || ""}
      onChange={(value) => {
        setData({ ...data, occupation: value });
      }}
    />
  </div>
);

// --- Step 4 Component (No changes) ---
const Step4_Preview = ({ data }) => (
  <div className="space-y-3">
    <h3 className="font-semibold">Preview</h3>
    {/* Added image preview */}
    <img src={data.profilePic || defaultAvatar} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
    <p><strong>Name:</strong> {data.name}</p>
    <p><strong>Phone:</strong> {data.phone}</p>
    <p><strong>Age:</strong> {data.age}</p>
    <p><strong>Gender:</strong> {data.gender}</p>
    <p><strong>Location:</strong> {data.location}</p>
    <p><strong>Budget:</strong> {data.budget}</p>
    <p><strong>Occupation:</strong> {data.occupation}</p>
    <p><strong>Lifestyle:</strong> {(data.lifestyle || []).join(", ")}</p>
    <p><strong>Bio:</strong> {data.bio}</p>
  </div>
);

// --- Main Profile Component ---
export default function MultiStepProfile({ initialData = {}, onSaved = () => {} }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "", 
    age: initialData?.age || "",
    gender: initialData?.gender || "",
    location: initialData?.location || "",
    budget: initialData?.budget || "",
    occupation: initialData?.occupation || "",
    lifestyle: initialData?.lifestyle || [],
    bio: initialData?.bio || "",
    profilePic: initialData?.profilePic || "",
  });

  useEffect(() => {
    // When initialData changes (e.g., after login), update the form data
    setData({
      name: initialData?.name || "",
      phone: initialData?.phone || "", 
      age: initialData?.age || "",
      gender: initialData?.gender || "",
      location: initialData?.location || "",
      budget: initialData?.budget || "",
      occupation: initialData?.occupation || "",
      lifestyle: initialData?.lifestyle || [],
      bio: initialData?.bio || "",
      profilePic: initialData?.profilePic || "",
    });
  }, [initialData]);

  const steps = [
    { id: 0, title: "Basics", component: <Step1_Basics data={data} setData={setData} /> },
    { id: 1, title: "Lifestyle", component: <Step2_Lifestyle data={data} setData={setData} /> },
    { id: 2, title: "Preferences", component: <Step3_BudgetLocation data={data} setData={setData} /> },
    { id: 3, title: "Preview", component: <Step4_Preview data={data} /> },
  ];

  const saveProfile = async () => {
    try {
      // The payload now includes the profilePic URL
      const payload = {
        name: data.name,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        location: data.location,
        budget: Number(data.budget) || 0,
        occupation: data.occupation,
        lifestyle: data.lifestyle,
        bio: data.bio,
        profilePic: data.profilePic, // This is now the Cloudinary URL
      };
      const response = await axios.put("/user/update", payload);
      alert("Profile saved");
      onSaved(response.data.user); // Pass the updated user back
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save profile");
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Step {step + 1} / {steps.length}: {steps[step].title}</h2>
          <div className="text-sm text-muted-foreground">{step === steps.length - 1 ? "Ready to save" : "Fill details"}</div>
        </div>
        <div className="w-full bg-border rounded-full h-2 mt-3 overflow-hidden">
          <div className="h-2 bg-primary" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="mb-6">
        {steps[step].component}
      </div>

      <div className="flex justify-between">
        <div>
          {step > 0 && <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>Back</Button>}
        </div>

        <div className="flex gap-2">
          {step < steps.length - 1 && (
            <Button onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}>
              Next
            </Button>
          )}
          {step === steps.length - 1 && (
            <Button onClick={saveProfile} className="bg-[#5b5dda] hover:bg-[#4a4ab5]">Save Profile</Button>
          )}
        </div>
      </div>
    </div>
  );
}