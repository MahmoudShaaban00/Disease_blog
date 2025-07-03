"use client";

import { usePathname } from "next/navigation";
import Navbar from "./_component/navbar/page";
import ProtectedRoute from "./_component/ProtectedRouted/ProtectedRouted"; // تأكد المسار صحيح
import React from "react";

const publicRoutes = [
  "/login",
  "/register",
  "/changepassword",
  "/resendemail",
  "/confirmemail",
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPublic = publicRoutes.includes(pathname);
  const showNavbar = !isPublic;

  return (
    <>
      {showNavbar && <Navbar />}

      {isPublic ? (
        children
      ) : (
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      )}
    </>
  );
}
