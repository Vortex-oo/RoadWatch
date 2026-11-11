import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[24px_24px] flex flex-col items-center justify-center p-4 font-hand selection:bg-yellow-200 text-xl">
      
      <div className="mb-8 text-center">
        <h1 
          className="text-5xl md:text-6xl tracking-tight mb-3 font-hand"
          style={{ color: '#000000' }}
        >
          RoadWatch
        </h1>
        <p className="text-xl text-slate-700 bg-white border-2 border-black rounded-full px-4 py-1.5 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-hand">
          Report. Verify. Repair.
        </p>
      </div>

      {children}
    </div>
  );
};