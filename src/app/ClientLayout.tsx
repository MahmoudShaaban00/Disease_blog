"use client";

import { usePathname } from "next/navigation";
import Navbar from "./_component/navbar/page";
import React from "react";
import ProtectedRoute from "@/app/_component/ProtectedRouted/ProtectedRouted"; // ✅ Make sure path is correct

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

      {/* ✅ Wrap in ProtectedRoute if route is private */}
      {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
    </>
  );
}
