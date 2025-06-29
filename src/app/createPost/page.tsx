"use client";
import React from 'react';
import { createPost } from '@/lib/postsSlice';
import { useDispatch } from 'react-redux';

export default function CreatePost() {
  const dispatch = useDispatch<any>();

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const Content = form.Content.value;
    const Image = form.Image.files[0];
    const UserId = localStorage.getItem('userId');

    const formdata = new FormData();
    formdata.append('Content', Content);
    if (Image) formdata.append('Image', Image);
    if (UserId) formdata.append('UserId', UserId);

    dispatch(createPost(formdata));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-8 bg-white/100 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 transition-all duration-300">

        {/* Introductory Text */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 drop-shadow">
            Share Your Thoughts 💭
          </h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            This is your space to inspire, connect, or simply express yourself.
            Share what's on your mind and let your voice be heard. You can even upload an image to bring your story to life!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handlesubmit} className="space-y-6">
          {/* Textarea */}
          <div>
            <label htmlFor="Content" className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
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

          {/* File Input */}
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

          {/* Submit Button */}
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
