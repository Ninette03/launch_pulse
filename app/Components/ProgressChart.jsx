"use client";
import React from "react";

function MainComponent({ stats = {}, categoryProgress = [], loading = false }) {
  if (loading) {
    return (
      <div className="font-roboto text-gray-600 text-center p-4">
        Loading progress data...
      </div>
    );
  }

  const completionPercentage = Math.round(
    (stats.completed_lessons / stats.total_lessons) * 100 || 0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-[200px] h-[200px]">
          <svg className="transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="3"
              strokeDasharray={`${completionPercentage}, 100`}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl font-bold text-gray-800 font-roboto">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-500 font-roboto">Complete</div>
          </div>
        </div>

        <div className="text-center md:text-left space-y-2">
          <div className="font-roboto text-gray-600">
            Total Lessons: {stats.total_lessons || 0}
          </div>
          <div className="font-roboto text-green-600">
            Completed: {stats.completed_lessons || 0}
          </div>
          <div className="font-roboto text-blue-600">
            In Progress: {stats.in_progress_lessons || 0}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {categoryProgress.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="font-roboto text-gray-700">
                {category.category}
              </div>
              <div className="font-roboto text-gray-600">
                {category.completed}/{category.total}
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (category.completed / category.total) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryComponent() {
  const mockStats = {
    total_lessons: 20,
    completed_lessons: 12,
    in_progress_lessons: 3,
  };

  const mockCategories = [
    {
      category: "Business Fundamentals",
      completed: 5,
      total: 8,
    },
    {
      category: "Marketing",
      completed: 3,
      total: 6,
    },
    {
      category: "Finance",
      completed: 4,
      total: 6,
    },
  ];

  const emptyStats = {
    total_lessons: 0,
    completed_lessons: 0,
    in_progress_lessons: 0,
  };

  return (
    <div className="space-y-8 p-4 bg-gray-50">
      <div>
        <h2 className="text-xl font-roboto mb-4">Loading State</h2>
        <MainComponent loading={true} />
      </div>

      <div>
        <h2 className="text-xl font-roboto mb-4">With Data</h2>
        <MainComponent stats={mockStats} categoryProgress={mockCategories} />
      </div>

      <div>
        <h2 className="text-xl font-roboto mb-4">Empty State</h2>
        <MainComponent stats={emptyStats} categoryProgress={[]} />
      </div>
    </div>
  );
}

export default MainComponent;