"use client";
import { useState, React } from "react";
import DownloadPdf from "../../Components/DownloadPDF";

function MainComponent() {
  const [businessPlan, setBusinessPlan] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const planId = params.get("id");

  useEffect(() => {
    const fetchBusinessPlan = async () => {
      try {
        const response = await fetch(`/api/business-plan/${planId}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch business plan: ${response.statusText}`
          );
        }
        const data = await response.json();
        setBusinessPlan(data);

        const analysisResponse = await fetch("/api/business-plan/analyze", {
          method: "POST",
          body: JSON.stringify({ planId }),
        });
        if (!analysisResponse.ok) {
          throw new Error(
            `Failed to analyze business plan: ${analysisResponse.statusText}`
          );
        }
        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchBusinessPlan();
    } else {
      setError("No business plan ID provided");
      setLoading(false);
    }
  }, [planId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-roboto">
          <i className="fas fa-circle-notch fa-spin mr-2"></i>
          Loading business plan...
        </div>
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

  if (!businessPlan) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <p className="font-roboto text-gray-600">Business plan not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-roboto">
            {businessPlan.businessName}
          </h1>
          <div className="flex space-x-4">
            <a
              href={`/business-plan?id=${planId}`}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto"
            >
              <i className="fas fa-edit mr-2"></i>
              Edit Plan
            </a>
            <DownloadPdf businessPlanId={planId} />
          </div>
        </div>

        {analysis && (
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4 font-roboto">
              Business Viability Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-roboto text-gray-600 mb-2">
                  Market Potential
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.marketScore}/100
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-roboto text-gray-600 mb-2">
                  Financial Viability
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.financialScore}/100
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-roboto text-gray-600 mb-2">
                  Overall Score
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.overallScore}/100
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 font-roboto">
              Business Overview
            </h2>
            <p className="text-gray-600 font-roboto">
              {businessPlan.description}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 font-roboto">
              Market Analysis
            </h2>
            <p className="text-gray-600 font-roboto">
              {businessPlan.marketStrategy}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 font-roboto">Competition</h2>
            <p className="text-gray-600 font-roboto">
              {businessPlan.competitors}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 font-roboto">
              Financial Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-roboto text-gray-600 mb-2">
                  Number of Employees
                </h3>
                <div className="font-bold">{businessPlan.employees}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-roboto text-gray-600 mb-2">
                  Revenue Range
                </h3>
                <div className="font-bold">{businessPlan.revenue}</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 font-roboto">Challenges</h2>
            <p className="text-gray-600 font-roboto">
              {businessPlan.challenges}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;