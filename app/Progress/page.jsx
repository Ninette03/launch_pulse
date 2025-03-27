"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/progress/lessons", {
          method: "POST",
          body: JSON.stringify({ user }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch progress statistics");
        }

        const data = await response.json();
        setStats(data);
        setLastActivity(data.recentActivity[0]);
      } catch (err) {
        console.error(err);
        setError("Could not load your progress data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-roboto">Loading your progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-red-600 text-center">
            <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
            <p className="font-roboto">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = stats
    ? Math.round(
        (stats.stats.completed_lessons / stats.stats.total_lessons) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold font-roboto mb-6">
                Learning Progress
              </h1>
              <ProgressChart
                loading={loading}
                stats={stats?.stats}
                categoryProgress={stats?.categoryProgress}
                error={error}
              />
            </div>

            {completionPercentage >= 25 && (
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <i className="fas fa-trophy text-yellow-500 text-3xl mr-4"></i>
                  <div>
                    <h2 className="text-xl font-bold font-roboto">
                      Congratulations!
                    </h2>
                    <p className="text-gray-600">
                      You've completed {completionPercentage}% of your learning
                      journey!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold font-roboto mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {lastActivity && (
                  <a
                    href={`/lesson/${lastActivity.id}`}
                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <i className="fas fa-play-circle text-blue-600 mr-3"></i>
                    <span className="font-roboto">Continue Last Lesson</span>
                  </a>
                )}
                <a
                  href="/business-plan/view"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-file-alt text-gray-600 mr-3"></i>
                  <span className="font-roboto">View Business Plan</span>
                </a>
                <a
                  href="/api/download-pdf"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-download text-gray-600 mr-3"></i>
                  <span className="font-roboto">Download Progress Report</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold font-roboto mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {stats?.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="font-roboto text-gray-800">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.last_accessed).toLocaleDateString()}
                      </p>
                    </div>
                    {activity.completed && (
                      <span className="bg-green-100 text-green-600 text-sm py-1 px-3 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold font-roboto mb-4">
                Activity Calendar
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded ${
                      Math.random() > 0.5
                        ? "bg-blue-100"
                        : Math.random() > 0.7
                        ? "bg-blue-300"
                        : "bg-gray-100"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;