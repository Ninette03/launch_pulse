"use client";
import { useState, React } from "react";
import { useRouter } from 'next/navigation';

function MainComponent() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    sector: "",
    location: "",
    employees: "",
    revenue: "",
    marketStrategy: "",
    competitors: "",
    challenges: "",
  });
  const [loading, setLoading] = useState(false);
  const [evaluationId, setEvaluationId] = useState(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  const [scores, setScores] = useState({
    market: 0,
    feasibility: 0,
    innovation: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);

  const steps = [
    "Business Information",
    "Market Analysis",
    "Competition",
    "Financial Overview",
  ];

  const marketInsights = {
    agriculture:
      "Rwanda's agricultural sector employs 70% of the population with growing export potential.",
    technology:
      "Rwanda is positioning itself as East Africa's technology hub with 4G coverage at 96%.",
    tourism:
      "Tourism contributes 10% to Rwanda's GDP with luxury eco-tourism growing rapidly.",
    manufacturing:
      "Manufacturing sector growing at 7% annually with government incentives available.",
  };
  const [showResultsModal, setShowResultsModal] = useState(false);


  const loadEvaluation = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/evaluation/list?evaluationId=${id}`);
      if (!response.ok) {
        throw new Error("Failed to load evaluation");
      }
      const { scores, ...evaluation } = await response.json();
      
      setFormData(evaluation);
      setEvaluationId(evaluation.id);
      setScores(scores || { // Fallback if scores not provided
        market_score: 0,
        feasibility: 0,
        innovation: 0
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load evaluation");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const newTimeout = setTimeout(() => {
      saveDraft();
    }, 2000);

    setAutoSaveTimeout(newTimeout);
  };

  const saveDraft = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const draftData = {
        ...formData,
        id: evaluationId,
        draft: true,
      };
  
      const endpoint = evaluationId
        ? "/api/evaluation/update"
        : "/api/evaluation/create";
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft");
      }
  
      // Handle CREATE response (returns evaluationId)
      if (!evaluationId && data.evaluationId) {
        setEvaluationId(data.evaluationId);
      }
      // Handle UPDATE response (returns full evaluation object)
      else if (evaluationId && data.evaluation) {
        setScores({
          market: data.evaluation.market_score || 0,
          feasibility: data.evaluation.feasibility_score || 0,
          innovation: data.evaluation.innovation_score || 0,
        });
      }
  
      setFeedback("Draft saved successfully");
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const submitEvaluation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/evaluation/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: evaluationId,  // Using 'id' to match database
          draft: false
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed");
      setEvaluationId(data.id);
      setScores(data.scores || { market: 0, feasibility: 0, innovation: 0 });
      setFeedback(data.feedback || "Evaluation submitted successfully");

      // Brief delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
    
      // Use Next.js router for client-side navigation
      router.push(`/evaluation/get/${data.id}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-roboto">
          Business Evaluation Tool
        </h1>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((stepName, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index === step ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                    index === step ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-sm">{stepName}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">Loading...</div>
          </div>
        )}

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {step === 0 && (
            <div className="space-y-4">
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
              <select
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Sector</option>
                <option value="agriculture">Agriculture</option>
                <option value="technology">Technology</option>
                <option value="tourism">Tourism</option>
                <option value="manufacturing">Manufacturing</option>
              </select>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Market Insight:</h3>
                <p>
                  {marketInsights[formData.sector] ||
                    "Please select a sector to view market insights"}
                </p>
              </div>
              <textarea
                name="marketStrategy"
                placeholder="Describe your market strategy"
                value={formData.marketStrategy}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg h-32"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <textarea
                name="competitors"
                placeholder="List your main competitors"
                value={formData.competitors}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg h-32"
              />
              <textarea
                name="challenges"
                placeholder="What are your main challenges?"
                value={formData.challenges}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg h-32"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <input
                type="number"
                name="employees"
                placeholder="Number of Employees"
                value={formData.employees}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
              <select
                name="revenue"
                value={formData.revenue}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Annual Revenue Range</option>
                <option value="0-50000">0 - 50,000 RWF</option>
                <option value="50000-200000">50,000 - 200,000 RWF</option>
                <option value="200000-1000000">200,000 - 1,000,000 RWF</option>
                <option value="1000000+">1,000,000+ RWF</option>
              </select>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0 || loading}
              className={`px-6 py-2 rounded-lg ${
                step === 0 || loading
                  ? "bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Save Draft
            </button>
            {step === 3 ? (
              <button
                type="button"
                onClick={submitEvaluation}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Evaluation
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(Math.min(3, step + 1))}
                disabled={step === 3 || loading}
                className={`px-6 py-2 rounded-lg ${
                  step === 3 || loading
                    ? "bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Evaluation Scores</h2>
            <div className="flex space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Market: </span>
                <span className="font-bold text-blue-600">
                  {scores.market}/30
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Feasibility: </span>
                <span className="font-bold text-blue-600">
                  {scores.feasibility}/30
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Innovation: </span>
                <span className="font-bold text-blue-600">
                  {scores.innovation}/40
                </span>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mt-4">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;