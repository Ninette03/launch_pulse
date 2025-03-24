"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/auth?callbackUrl=/lessons";
      return;
    }

    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/progress/lessons", {
          method: "POST",
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setLessons(data.lessons || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your lessons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLessons();
    }
  }, [user, userLoading]);

  const handleMarkComplete = async (lessonId, completed) => {
    try {
      const response = await fetch("/api/progress/lessons", {
        method: "POST",
        body: JSON.stringify({ lessonId, completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lesson progress");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setLessons(
        lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed } : lesson
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update lesson progress. Please try again.");
    }
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const completionPercentage =
    lessons.length > 0
      ? Math.round((completedLessons / lessons.length) * 100)
      : 0;

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-roboto">Loading your lessons...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold font-roboto text-gray-800 mb-4">
            My Learning Journey
          </h1>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-roboto text-gray-600">
                Overall Progress
              </span>
              <span className="font-roboto text-blue-600 font-bold">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold font-roboto text-gray-800 mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryLessons
                  .sort((a, b) => a.order_number - b.order_number)
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white border rounded-lg shadow-sm p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold font-roboto text-gray-800">
                          {lesson.title}
                        </h3>
                        <button
                          onClick={() =>
                            handleMarkComplete(lesson.id, !lesson.completed)
                          }
                          className={`rounded-full p-2 transition-colors ${
                            lesson.completed
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      </div>
                      <p className="text-gray-600 mb-4 font-roboto">
                        {lesson.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {lesson.duration}
                        </span>
                        <span>
                          <i className="fas fa-signal mr-1"></i>
                          {lesson.difficulty}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-history mr-1"></i>
                        Last accessed:{" "}
                        {lesson.last_accessed
                          ? new Date(lesson.last_accessed).toLocaleDateString()
                          : "Never"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;