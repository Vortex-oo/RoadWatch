import React from 'react';

export const AuthCard = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="w-full max-w-md bg-white border-[3px] border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10">
      {/* The inline style forces the title color to stay pure black */}
      <h2 
        className="text-3xl font-bold mb-6 tracking-wide"
        style={{ color: '#000000' }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
};