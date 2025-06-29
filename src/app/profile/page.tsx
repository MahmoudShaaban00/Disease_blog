"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, updateProfile } from "@/lib/profileSlice";
import { useRouter } from 'next/navigation';

export default function UsersPage() {

  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { users, loading, error } = useSelector((state: any) => state.profile);
  const [isToggled, setIsToggled] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setIsToggled(true);
  };

  
  const closeModal = () => {
    setIsToggled(false);
    setSelectedUser(null);
  };

  //update profile
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const ImageFile = form.ImageFile.files?.[0];
    const Name = form.Name.value;
    const Address = form.Address.value;

    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("Address", Address);
    if (ImageFile) formData.append("ImageFile", ImageFile);

    // Debug output
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    dispatch(updateProfile(formData));
    closeModal();
  };

//handleroute
  const handleroute = () => {
    router.push("/changepassword");
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden py-12 px-6">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-white opacity-10 rounded-full filter blur-3xl" />

      {/* Header */}
      <h1 className="text-white text-4xl font-bold text-center drop-shadow mb-10">All Patients</h1>

      {/* Loading & Error States */}
      {loading && (
        <p className="text-center text-white font-semibold text-xl">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-200">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto z-10 relative">
        {!loading &&
          users.map((user: any) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition transform hover:scale-105"
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow"
              />
              <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.address}</p>
              <span className="mt-2 inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {user.userType}
              </span>
              
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => openModal(user)}
              >
                Edit Profile
              </button>
            <button
                className="mt-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow hover:bg-amber-400 transition"
                onClick={handleroute}
              >
                Change Password
              </button>
            </div>
          ))}
      </div>

      {/* Modal for Update */}
      {isToggled && selectedUser && (
        <div className="fixed inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Update Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="Name"
                  placeholder="Enter name"
                  className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="Address"
                  placeholder="Enter address"
                  className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  name="ImageFile"
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
