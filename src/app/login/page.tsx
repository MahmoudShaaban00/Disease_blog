"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "@/lib/loginSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { loading, error, user } = useSelector((state: any) => state.login);

  useEffect(() => {
    if (user) router.push("/home");
  }, [user, router]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 chars, include upper, lower, number & special char"
      )
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => dispatch(loginUser(values)),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="backdrop-blur-lg bg-white/10 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full p-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-red-300 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full p-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {formik.errors.password && formik.touched.password && (
            <p className="text-red-300 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded font-semibold ${
            loading
              ? "bg-white/30 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } transition`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-300 text-sm mt-4 text-center">{error}</p>}

        <div className="mt-6 flex items-center justify-between space-y-2 text-sm">
          <button
            type="button"
            onClick={() => router.push("/resendemail")}
            className="text-white hover:underline"
          >
            Resend Email
          </button>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-white hover:underline"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
