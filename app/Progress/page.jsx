"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function ProgressChart({ loading, stats, categoryProgress, error }) {
  // Implement your chart component here
  return <div>Progress Chart</div>;
}

export default function ProgressPage() {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    if (!userLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/progress/lessons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch progress statistics");
        }

        const data = await response.json();
        setStats(data);
        if (data.recentActivity?.length > 0) {
          setLastActivity(data.recentActivity[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load your progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userLoaded, isSignedIn, user, router]);

  if (!userLoaded || loading) {
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

        </div>
      </div>
    </div>
  );
}