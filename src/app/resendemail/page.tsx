"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resendConfirmEmail } from "@/lib/authSlice";
import type { AppDispatch } from "@/lib/store";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Form data submitted:", values);
        const result = await dispatch(resendConfirmEmail(values));
        if (result.meta.requestStatus === "fulfilled") {
          console.log("Email resent successfully");
          router.push("/confirmemail");
        } else {
          console.error("Failed to resend email:", result.payload);
          // optionally show error feedback to user here
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="backdrop-blur-lg bg-white/10 text-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Enter Email
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium text-white">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
