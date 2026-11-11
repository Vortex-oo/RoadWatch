import React from 'react';

interface StatusBadgeProps {
  status: 'reported' | 'verified' | 'in_progress' | 'repaired' | 'rejected';
}

// Simple helper to pick the right color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'reported': return 'bg-red-200';
    case 'verified': return 'bg-[#ffec99]'; // hand-yellow
    case 'in_progress': return 'bg-orange-200';
    case 'repaired': return 'bg-[#b2f2bb]'; // hand-green
    default: return 'bg-gray-200';
  }
};

const getStatusText = (status: string) => {
  return status.replace('_', ' ').toUpperCase();
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`sketch px-3 py-1 text-sm font-bold text-black ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};