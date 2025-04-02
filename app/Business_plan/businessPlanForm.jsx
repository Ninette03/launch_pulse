'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function BusinessPlanForm() {
  const { isLoaded, isSignedIn } = useUser();
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

  const sectors = [
    "Agriculture", "Technology", "Manufacturing", "Retail", 
    "Services", "Tourism", "Education", "Healthcare", 
    "Construction", "Transportation"
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
      errors.targetMarket = "Target market description must be at least 50 characters";
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
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/submit-business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit business plan");

      setSuccess("Business plan submitted successfully!");
      setTimeout(() => window.location.href = "/dashboard", 2000);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit business plan");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-roboto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      
    </div>
  );
}