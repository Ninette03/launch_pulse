"use client";
import React from "react";

function MainComponent({ businessPlanId, className }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-business-plan-pdf", {
        method: "POST",
        body: JSON.stringify({ businessPlanId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const { content, filename, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const blob = new Blob([content], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "business-plan.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Could not generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="text-red-600 text-sm mb-2 font-roboto">{error}</div>
      )}
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`inline-block px-6 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#1a252f] transition-colors font-roboto disabled:opacity-50 disabled:cursor-not-allowed ${
          className || ""
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <i className="fas fa-circle-notch fa-spin"></i>
            Generating PDF...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <i className="fas fa-file-pdf"></i>
            Download PDF
          </span>
        )}
      </button>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-4 font-roboto">Default State</h3>
        <MainComponent businessPlanId="123" />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 font-roboto">
          With Custom Class
        </h3>
        <MainComponent
          businessPlanId="123"
          className="bg-blue-600 hover:bg-blue-700"
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 font-roboto">Loading State</h3>
        <MainComponent businessPlanId="123" loading={true} />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 font-roboto">Error State</h3>
        <div className="max-w-xs">
          <MainComponent businessPlanId="invalid-id" />
        </div>
      </div>
    </div>
  );
}

export default MainComponent;