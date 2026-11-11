import React from 'react';
import { StatusBadge } from './StatusBadge';

export interface Report {
  id: string;
  date: string;
  location: string;
  status: 'reported' | 'verified' | 'in_progress' | 'repaired' | 'rejected';
  imageUrl: string;
}

// A horizontal card for the My Reports feed
export const ReportCard = ({ report }: { report: Report }) => {
  return (
    <div className="sketch flex flex-row p-4 mb-4 items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Thumbnail Image Placeholder */}
      <div className="w-20 h-20 sketch bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
        {report.imageUrl ? (
          <img src={report.imageUrl} alt="Pothole" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">No Photo</span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1">
        <span className="text-sm text-gray-500 font-bold">{report.date}</span>
        <span className="text-xl text-black font-bold mb-1">{report.location}</span>
        <div>
          <StatusBadge status={report.status} />
        </div>
      </div>
    </div>
  );
};