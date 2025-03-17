"use client";
import React from "react";
import { useState } from "react";

function MainComponent() {
  const [ideas, setIdeas] = useState([
    { id: 1, name: "Eco-Friendly Food Delivery", score: 85, progress: 70 },
    { id: 2, name: "Virtual Fitness Platform", score: 92, progress: 40 },
    { id: 3, name: "Smart Home App", score: 78, progress: 25 },
  ]);

  const [discussions] = useState([
    { id: 1, title: "Marketing Strategies for Startups", replies: 23 },
    { id: 2, title: "Funding Options for Small Business", replies: 15 },
    { id: 3, title: "Tech Stack Recommendations", replies: 31 },
  ]);

  const [resources] = useState([
    { id: 1, title: "Business Model Canvas Guide", type: "PDF" },
    { id: 2, title: "Market Research Fundamentals", type: "Video" },
    { id: 3, title: "Financial Planning Basics", type: "Course" },
  ]);

  const [goals] = useState([
    { id: 1, title: "Complete Market Analysis", done: true },
    { id: 2, title: "Create MVP", done: false },
    { id: 3, title: "Secure Initial Funding", done: false },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-roboto text-gray-800">
            Dashboard
          </h1>
          <a
            href="/Evaluation"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-roboto"
          >
            Start New Evaluation
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold font-roboto mb-4 text-gray-800">
              Your Business Ideas
            </h2>
            <div className="space-y-4">
              {ideas.map((idea) => (
                <div key={idea.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-roboto text-gray-700">
                      {idea.name}
                    </span>
                    <span className="font-roboto text-blue-600 font-bold">
                      {idea.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: `${idea.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold font-roboto mb-4 text-gray-800">
              Recent Discussions
            </h2>
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <a
                    href="/forum"
                    className="text-gray-700 hover:text-blue-600 font-roboto"
                  >
                    {discussion.title}
                  </a>
                  <span className="text-sm text-gray-500 font-roboto">
                    {discussion.replies} replies
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold font-roboto mb-4 text-gray-800">
              Learning Resources
            </h2>
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center border-b pb-4"
                >
                  <i
                    className={`fas fa-${
                      resource.type === "PDF"
                        ? "file-pdf"
                        : resource.type === "Video"
                        ? "video"
                        : "book"
                    } text-blue-600 mr-3`}
                  ></i>
                  <span className="font-roboto text-gray-700">
                    {resource.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-bold font-roboto mb-4 text-gray-800">
              Goals Tracking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center bg-gray-50 p-4 rounded-lg"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      goal.done
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {goal.done && (
                      <i className="fas fa-check text-white text-sm"></i>
                    )}
                  </div>
                  <span
                    className={`font-roboto ${
                      goal.done ? "text-green-500" : "text-gray-700"
                    }`}
                  >
                    {goal.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;