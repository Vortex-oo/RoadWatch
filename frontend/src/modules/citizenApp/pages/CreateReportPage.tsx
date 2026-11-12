import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { DuplicateModal } from '../components/DuplicateModal';
import { createReport } from '../../../api/reportsApi';

const initialForm = {
  description: '',
  photo: '',
  latitude: 0,
  longitude: 0,
  severity: 'medium' as 'low' | 'medium' | 'high',
};

export const CreateReportPage = () => {
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInitialSubmit = async (payload: typeof initialForm) => {
    if (!payload.latitude || !payload.longitude) {
      setError('Location is required. Please allow GPS or tap the map.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await createReport({
        description: payload.description,
        photo: payload.photo,
        latitude: payload.latitude,
        longitude: payload.longitude,
        severity: payload.severity,
      });

      setShowDuplicateModal(false);
      alert('New report submitted successfully.');
      navigate('/my-reports');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmMerge = () => {
    setShowDuplicateModal(false);
    alert('Report confirmed! Thanks for adding to the priority.');
    navigate('/my-reports');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8 font-hand">
      <h1 className="text-4xl font-bold text-black mb-2">Report Damage</h1>
      <p className="text-xl text-gray-700 mb-8 border-b-2 border-black pb-4">
        Take a photo, share the location, and track the repair.
      </p>

      {error && <p className="mb-4 rounded border border-red-400 bg-red-50 p-3 text-red-700">{error}</p>}

      <ReportForm onSubmit={handleInitialSubmit} value={form} onChange={setForm} />

      <DuplicateModal
        isOpen={showDuplicateModal}
        onConfirm={handleConfirmMerge}
        onSubmitNew={() => {
          setShowDuplicateModal(false);
          alert('New report submitted successfully.');
          navigate('/my-reports');
        }}
        onCancel={() => setShowDuplicateModal(false)}
      />

      {isSubmitting && (
        <div className="mt-4 text-center text-lg font-bold">Submitting report...</div>
      )}
    </div>
  );
};