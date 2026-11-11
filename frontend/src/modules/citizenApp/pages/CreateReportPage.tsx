import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { DuplicateModal } from '../components/DuplicateModal';

export const CreateReportPage = () => {
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const navigate = useNavigate();

  // Triggered by the form submit button
  const handleInitialSubmit = () => {
    // Simulate a backend check that finds a duplicate nearby
    setShowDuplicateModal(true);
  };

  // If user says "Yes, it's the same"
  const handleConfirmMerge = () => {
    setShowDuplicateModal(false);
    alert("Report confirmed! Thanks for adding to the priority.");
    navigate('/my-reports');
  };

  // If user says "No, this is a new pothole"
  const handleSubmitNew = () => {
    setShowDuplicateModal(false);
    alert("New report submitted successfully.");
    navigate('/my-reports');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8 font-hand">
      <h1 className="text-4xl font-bold text-black mb-2">Report Damage</h1>
      <p className="text-xl text-gray-700 mb-8 border-b-2 border-black pb-4">
        Take a photo, share the location, and track the repair.
      </p>

      <ReportForm onSubmit={handleInitialSubmit} />

      <DuplicateModal 
        isOpen={showDuplicateModal}
        onConfirm={handleConfirmMerge}
        onSubmitNew={handleSubmitNew}
        onCancel={() => setShowDuplicateModal(false)}
      />
    </div>
  );
};