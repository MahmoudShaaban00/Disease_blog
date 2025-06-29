"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/lib/authSlice";

const RegisterSchema = Yup.object().shape({
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Password: Yup.string()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must be 8+ chars, include upper, lower, number & special char"
    )
    .required("Password is required"),
  FullName: Yup.string().required("Full Name is required"),
  Address: Yup.string().required("Address is required"),
  UserType: Yup.string().required("User Type is required"),
  Image: Yup.mixed().nullable(),
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state: any) => state.auth);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="backdrop-blur-lg bg-white/10 text-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

        <Formik
          initialValues={{
            Email: "",
            Password: "",
            FullName: "",
            Address: "",
            UserType: "",
            Image: null,
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            formData.append("Email", values.Email);
            formData.append("Password", values.Password);
            formData.append("FullName", values.FullName);
            formData.append("Address", values.Address);
            formData.append("UserType", values.UserType);
            if (values.Image) {
              formData.append("Image", values.Image);
            }

            dispatch(registerUser(formData))
              .unwrap()
              .then(() => {
                setSubmitting(false);
                resetForm();
                setImagePreview(null);
              })
              .catch(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="Email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <ErrorMessage name="Email" component="div" className="text-red-300 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="Password"
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <ErrorMessage name="Password" component="div" className="text-red-300 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="FullName"
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <ErrorMessage name="FullName" component="div" className="text-red-300 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="Address"
                  type="text"
                  placeholder="Address"
                  className="w-full p-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <ErrorMessage name="Address" component="div" className="text-red-300 text-sm mt-1" />
              </div>

              <div>
                <Field
                  as="select"
                  name="UserType"
                  className="w-full p-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select User Type</option>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </Field>
                <ErrorMessage name="UserType" component="div" className="text-red-300 text-sm mt-1" />
              </div>

              <div>
                <input
                  name="Image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.currentTarget.files && e.currentTarget.files[0]) {
                      setFieldValue("Image", e.currentTarget.files[0]);
                      setImagePreview(URL.createObjectURL(e.currentTarget.files[0]));
                    }
                  }}
                  className="w-full text-white"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-contain rounded" />
                )}
                <ErrorMessage name="Image" component="div" className="text-red-300 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={`w-full py-2 rounded font-semibold ${
                  loading || isSubmitting
                    ? "bg-white/30 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition`}
              >
                {loading || isSubmitting ? "Registering..." : "Register"}
              </button>

              {error && <p className="text-red-300 mt-2 text-center font-semibold">{error}</p>}
              {user && (
                <p className="text-green-300 mt-2 text-center font-semibold">
                  Registration successful!
                </p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
