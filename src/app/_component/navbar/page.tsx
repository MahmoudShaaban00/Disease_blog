"use client";

import React, { useState } from "react";
import { FaBlog, FaUser, FaInfoCircle } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi"; // Added menu icons
import { useDispatch } from "react-redux";
import { logout } from "@/lib/loginSlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");

    dispatch(logout());
    router.push("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-white">
          <FaBlog size={28} />
          <span className="text-lg font-bold">Blog</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-300">
          <li className="flex items-center space-x-1 hover:text-white">
            <AiFillHome />
            <a href="/home">Home</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-white">
            <MdCreate />
            <a href="/createPost">CreatePost</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-white">
            <FaInfoCircle />
            <a href="/about">About</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-white">
            <FaUser />
            <a href="/profile">Profile</a>
          </li>
        </ul>

        {/* Logout button - always visible */}
        <div className="hidden md:flex items-center justify-center">
          <button
            onClick={handleLogout}
            className="px-4 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-700 mt-2 rounded-lg p-4 space-y-4 text-gray-300">
          <ul className="flex flex-col space-y-3">
            <li className="flex items-center space-x-2 hover:text-white">
              <AiFillHome />
              <a href="/home" onClick={() => setMenuOpen(false)}>
                Home
              </a>
            </li>
            <li className="flex items-center space-x-2 hover:text-white">
              <MdCreate />
              <a href="/createPost" onClick={() => setMenuOpen(false)}>
                CreatePost
              </a>
            </li>
            <li className="flex items-center space-x-2 hover:text-white">
              <FaInfoCircle />
              <a href="/about" onClick={() => setMenuOpen(false)}>
                About
              </a>
            </li>
            <li className="flex items-center space-x-2 hover:text-white">
              <FaUser />
              <a href="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
