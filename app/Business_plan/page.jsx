"use client";
import { useState, React } from "react";
import { useUser } from '@clerk/clerk-react';

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    sector: "",
    targetMarket: "",
    revenueModel: "",
    competitors: "",
    strengths: "",
    weaknesses: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/auth?callbackUrl=/business-plan";
    }
  }, [user, userLoading]);

  const sectors = [
    "Agriculture",
    "Technology",
    "Manufacturing",
    "Retail",
    "Services",
    "Tourism",
    "Education",
    "Healthcare",
    "Construction",
    "Transportation",
  ];

  const validateForm = () => {
    const errors = {};
    if (formData.businessName.length < 3) {
      errors.businessName = "Business name must be at least 3 characters";
    }
    if (formData.description.length < 50) {
      errors.description = "Description must be at least 50 characters";
    }
    if (!formData.sector) {
      errors.sector = "Please select a sector";
    }
    if (formData.targetMarket.length < 50) {
      errors.targetMarket =
        "Target market description must be at least 50 characters";
    }
    if (formData.revenueModel.length < 50) {
      errors.revenueModel = "Revenue model must be at least 50 characters";
    }
    if (formData.competitors.length < 30) {
      errors.competitors = "Competitors section must be at least 30 characters";
    }
    if (formData.strengths.length < 30) {
      errors.strengths = "Strengths section must be at least 30 characters";
    }
    if (formData.weaknesses.length < 30) {
      errors.weaknesses = "Weaknesses section must be at least 30 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/submit-business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit business plan");
      }

      setSuccess("Business plan submitted successfully!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit business plan");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-roboto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-roboto">
          Submit Your Business Plan
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto ${
                validationErrors.businessName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.businessName && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.businessName}
              </p>
            )}
          </div>

          <div>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto ${
                validationErrors.sector ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Sector</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
            {validationErrors.sector && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.sector}
              </p>
            )}
          </div>

          {[
            "description",
            "targetMarket",
            "revenueModel",
            "competitors",
            "strengths",
            "weaknesses",
          ].map((field) => (
            <div key={field}>
              <textarea
                name={field}
                placeholder={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1")
                }
                value={formData[field]}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto ${
                  validationErrors[field] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors[field] && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors[field]}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Business Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MainComponent;