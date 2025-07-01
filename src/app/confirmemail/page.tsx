"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { confirmEmail } from "@/lib/authSlice";
import { useRouter } from "next/navigation";

export default function Page() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { loading, error, emailConfirmed } = useSelector((state: State) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      otp: Yup.string().required("OTP is required"),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(confirmEmail(values)).unwrap();
      if (result) {
        router.push("/login"); // ✅ Redirect to login if confirmed
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="backdrop-blur-lg bg-white/10 text-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Confirm Your Email</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-lg font-medium text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-1">OTP</label>
            <input
              type="text"
              name="otp"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.otp}
            />
            {formik.touched.otp && formik.errors.otp && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.otp}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {loading ? "Confirming..." : "Confirm Email"}
          </button>

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
