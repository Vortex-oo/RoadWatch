import React from 'react';
import { ReportCard, type Report } from '../components/ReportCard';

// Dummy data to populate the feed until API is ready
const mockReports: Report[] = [
  { id: '1', date: 'Oct 24, 2026', location: 'Station Road, Khardaha', status: 'repaired', imageUrl: '' },
  { id: '2', date: 'Nov 02, 2026', location: 'Main Street Crossing', status: 'in_progress', imageUrl: '' },
  { id: '3', date: 'Nov 10, 2026', location: 'School Lane', status: 'reported', imageUrl: '' },
];

export const MyReportsPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 py-8 font-hand">
      <h1 className="text-4xl font-bold text-black mb-2">My Reports</h1>
      <p className="text-xl text-gray-700 mb-8 border-b-2 border-black pb-4">
        Track the status of the damage you've reported.
      </p>

      <div className="flex flex-col gap-2">
        {mockReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
};