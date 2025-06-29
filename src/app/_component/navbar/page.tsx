"use client";
import React from 'react';
import { FaBlog, FaUser, FaInfoCircle } from 'react-icons/fa'; // Added FaInfoCircle
import { MdCreate } from 'react-icons/md';
import { AiFillHome } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { FiLogOut } from "react-icons/fi";


export default function Navbar() {

  let router = useRouter()

  const handleLogout = () =>{
       localStorage.removeItem('token')
       localStorage.removeItem('userId')
       localStorage.removeItem('userType')

       router.push('/login')

  }
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 text-white">
            <FaBlog size={28} />
            <span className="text-lg font-bold">Blog</span>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-6 text-gray-300">
            <li className="flex items-center space-x-1 hover:text-white">
              <AiFillHome />
              <a href="/">Home</a>
            </li>
            <li className="flex items-center space-x-1 hover:text-white">
              <MdCreate />
              <a href="/createPost">CreatePost</a>
            </li>
            <li className="flex items-center space-x-1 hover:text-white">
              <FaInfoCircle />   {/* Icon for About */}
              <a href="/about">About</a>
            </li>
            <li className="flex items-center space-x-1 hover:text-white">
              <FaUser />
              <a href="/profile">Profile</a>
            </li>
          </ul>
      <div className="flex items-center justify-center">
  <button
    onClick={handleLogout}
    className="px-4 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
  >
    <FiLogOut size={18} />
    Logout
  </button>
</div>

        </div>
      </nav>
    </div>
  );
}
