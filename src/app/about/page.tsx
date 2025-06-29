"use client";
import React from "react";

export default function DiseaseBlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-teal-900 mb-4">
            Health & Disease Awareness Blog
          </h1>
          <p className="text-lg text-gray-900">
            Educating and empowering you with knowledge about common and rare diseases, prevention, and health tips.
          </p>
        </header>

        {/* Featured Article */}
        <section className="mb-12 bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-teal-700 mb-4">🦠 Featured: Understanding Diabetes</h2>
          <p className="text-gray-600 mb-2">
            Diabetes is a chronic condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. This article explores the causes, symptoms, and treatment options for both Type 1 and Type 2 diabetes.
          </p>
          
        </section>

        {/* Articles Grid */}
        <section>
          <h3 className="text-2xl font-semibold text-teal-800 mb-6">🩺 Recent Topics</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Heart Disease",
                summary: "Learn about cardiovascular disease and how to protect your heart.",
              },
              {
                title: "Cancer Prevention",
                summary: "Explore early detection and lifestyle choices that lower your risk.",
              },
              {
                title: "Mental Health",
                summary: "Understand anxiety, depression, and the importance of emotional wellbeing.",
              },
              {
                title: "COVID-19 Updates",
                summary: "Latest research and safety recommendations around COVID-19.",
              },
              {
                title: "Childhood Illnesses",
                summary: "Recognizing and managing common illnesses in children.",
              },
              {
                title: "Nutrition & Immunity",
                summary: "How diet can strengthen your immune system.",
              },
            ].map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
              >
                <h4 className="text-lg font-bold text-teal-700 mb-2">{post.title}</h4>
                <p className="text-gray-600 text-sm">{post.summary}</p>
                <button className="mt-3 text-teal-600 hover:underline text-sm">Read more</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
