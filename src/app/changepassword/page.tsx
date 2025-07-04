"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "@/lib/profileSlice";
import { useRouter } from "next/navigation";
import { State } from "@/interface/state";
import { AppDispatch } from "@/lib/store";

export default function ChangePassword() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, message } = useSelector((state: State) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();

      // If successful
      setOldPassword("");
      setNewPassword("");
      router.push("/login");
    } catch (err) {
      // If error is returned, do nothing — error state is already handled in Redux
      console.error("Password change failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Change Password</h1>
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/10 text-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <div>
          <label htmlFor="oldPassword" className="block mb-1 font-semibold">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block mb-1 font-semibold">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-amber-500 text-white py-2 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-400"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && <p className="text-green-600 font-semibold mt-4">{message}</p>}
        {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
      </form>
    </div>
  );
}
