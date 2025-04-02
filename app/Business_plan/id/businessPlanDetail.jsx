'use client';
import { useState, useEffect } from 'react';

export default function BusinessPlanDetail({ id, userId }) {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await fetch(`/api/business-plans/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch plan');
        setPlanData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [id]);

  if (loading) return <div>Loading business plan...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {planData.businessName}
        </h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{planData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}