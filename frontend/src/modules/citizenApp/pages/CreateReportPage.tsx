import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { DuplicateModal } from '../components/DuplicateModal';
import { createReport } from '../../../api/reportsApi';

interface ReportPayload {
    description: string;
    photo: File | string;
    latitude: number;
    longitude: number;
    severity: 'low' | 'medium' | 'high';
}

const initialForm: ReportPayload = {
    description: '',
    photo: '',
    latitude: 0,
    longitude: 0,
    severity: 'medium',
};

export const CreateReportPage = () => {
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [form, setForm] = useState<ReportPayload>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInitialSubmit = async (payload: ReportPayload) => {
        if (!payload.latitude || !payload.longitude) {
            setError('Location is required. Please allow GPS or tap the map.');
            return;
        }

        // We block submission if the photo is still a string (empty)
        if (!payload.photo || typeof payload.photo === 'string') {
            setError('A photo of the damage is required.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            await createReport({
                description: payload.description,
                photo: payload.photo as File, // Now safely guaranteed to be a File
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

            {error && <p className="mb-4 rounded border-[3px] border-black bg-red-100 p-3 text-red-700 font-bold">{error}</p>}

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
                <div className="mt-4 text-center text-xl font-bold text-black">Submitting report...</div>
            )}
        </div>
    );
};