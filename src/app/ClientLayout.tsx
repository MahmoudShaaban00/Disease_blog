// app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./_component/navbar/page";
import React, { useEffect } from "react";

const hiddenRoutes = [
  "/login",
  "/register",
  "/changepassword",
  "/resendemail",
  "/confirmemail",
];



export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = !hiddenRoutes.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
