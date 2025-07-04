"use client";

import React, { useState } from "react";
import { createPost } from "@/lib/postsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";

export default function CreatePost() {
  const dispatch = useDispatch<AppDispatch>();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const Content = form.Content.value.trim();

    if (Content.length > 1000) {
      setErrorMessage("Post content should be less than 1000 characters.");
      setSuccessMessage("");
      return;
    } else {
      setErrorMessage("");
    }

    const Image = form.Image.files[0];
    const UserId = localStorage.getItem("userId");

    const formdata = new FormData();
    formdata.append("Content", Content);
    if (Image) formdata.append("Image", Image);
    if (UserId) formdata.append("UserId", UserId);

    try {
      await dispatch(createPost(formdata)).unwrap();

      setSuccessMessage("Post created successfully!");
      setErrorMessage("");
      form.reset();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: unknown) {
      console.error("Create post error:", error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "Failed to create post. Please try again.";
      setSuccessMessage("");
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-8 bg-white/100 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 transition-all duration-300">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 drop-shadow">
            Share Your Thoughts 💭
          </h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            This is your space to inspire, connect, or simply express yourself.
            Share what&apos;s on your mind and let your voice be heard. You can even upload an image to bring your story to life!
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center font-semibold">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-center font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlesubmit} className="space-y-6">
          <div>
            <label htmlFor="Content" className="block text-sm font-medium text-gray-700 mb-2">
              What&apos;s on your mind?
            </label>
            <textarea
              name="Content"
              id="Content"
              rows={5}
              placeholder="Share your thoughts..."
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="Image" className="block text-sm font-medium text-gray-700 mb-2">
              Upload an Image (optional)
            </label>
            <input
              type="file"
              name="Image"
              id="Image"
              accept="image/*"
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-indigo-600 file:text-white
                         hover:file:bg-indigo-700 transition"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
