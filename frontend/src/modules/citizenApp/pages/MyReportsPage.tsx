import React, { useState, useEffect } from 'react';
import { ReportCard, type Report } from '../components/ReportCard';

export const MyReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please log in to view your reports.');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/reports', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reports from server.');
        }

        const data = await response.json();

        // Based on your backend getMyReports controller, it returns { success, count, reports }
        if (data.success && Array.isArray(data.reports)) {
          setReports(data.reports);
        } else if (Array.isArray(data)) {
          // Fallback just in case the backend returns a direct array
          setReports(data);
        } else {
          setReports([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 py-8 font-hand">
      <h1 className="text-4xl font-bold text-black mb-2">My Reports</h1>
      <p className="text-xl text-gray-700 mb-8 border-b-2 border-black pb-4">
        Track the status of the damage you've reported.
      </p>

      {/* State Handlers */}
      {isLoading && (
        <div className="text-xl font-bold text-black text-center py-8 sketch bg-gray-100">
          Loading your reports...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border-[3px] border-black bg-red-100 p-3 text-red-700 font-bold text-lg">
          {error}
        </div>
      )}

      {!isLoading && !error && reports.length === 0 && (
        <div className="text-xl font-bold text-gray-600 text-center py-8 sketch bg-gray-50 border-dashed">
          No reports found. Help your community by reporting a pothole!
        </div>
      )}

      {/* Reports Feed */}
      <div className="flex flex-col gap-4">
        {!isLoading && !error && reports.map((report) => (
          <ReportCard key={report.id || report._id} report={report} />
        ))}
      </div>
    </div>
  );
};