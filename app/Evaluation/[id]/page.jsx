"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EvaluationPage({ params }) {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      const res = await fetch(`/api/evaluation/get?id=${params.id}`);
      const result = await res.json();
      
      // Transform API data to match your frontend expectations
      setData({
        ...result,
        scores: {
          market: result.market_score,
          feasibility: result.feasibility_score,
          innovation: result.innovation_score
        }
      });
    };
    
    fetchEvaluation();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading evaluation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Evaluation Results: {evaluation.businessName}
        </h1>
        
        {/* Scores Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Market</h3>
            <p className="text-3xl font-bold text-blue-600">
              {evaluation.scores.market}/30
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Feasibility</h3>
            <p className="text-3xl font-bold text-green-600">
              {evaluation.scores.feasibility}/30
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Innovation</h3>
            <p className="text-3xl font-bold text-purple-600">
              {evaluation.scores.innovation}/40
            </p>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">AI Feedback</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {evaluation.feedback}
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-4">
          <h3 className="font-semibold">Business Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Sector</p>
              <p>{evaluation.sector}</p>
            </div>
            <div>
              <p className="text-gray-600">Employees</p>
              <p>{evaluation.employees}</p>
            </div>
            <div>
              <p className="text-gray-600">Revenue</p>
              <p>{evaluation.revenue}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => router.push('/Dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Print Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}