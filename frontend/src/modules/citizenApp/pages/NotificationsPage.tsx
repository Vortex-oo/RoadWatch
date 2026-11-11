import React from 'react';

// Mock data for alerts
const alerts = [
  { id: 1, text: "Good news! The pothole you reported on Station Road has been repaired.", time: "2 hours ago", type: "success" },
  { id: 2, text: "Your report on School Lane has been verified and added to the repair queue.", time: "Yesterday", type: "info" },
];

export const NotificationsPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 py-8 font-hand">
      <h1 className="text-4xl font-bold text-black mb-8 border-b-2 border-black pb-4">Notifications</h1>

      <div className="flex flex-col gap-6">
        {alerts.map((alert, index) => (
          <div 
            key={alert.id} 
            // Styled like a physical sticky note
            className={`sketch p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] ${
              index % 2 === 0 ? '-rotate-1 bg-[#fff9db]' : 'rotate-1 bg-[#e9ecef]'
            }`}
          >
            <p className="text-2xl text-black leading-tight mb-3">"{alert.text}"</p>
            <span className="text-sm text-gray-500 font-bold block text-right">{alert.time}</span>
          </div>
        ))}

        {alerts.length === 0 && (
          <p className="text-2xl text-gray-500 text-center mt-10">You're all caught up!</p>
        )}
      </div>
    </div>
  );
};