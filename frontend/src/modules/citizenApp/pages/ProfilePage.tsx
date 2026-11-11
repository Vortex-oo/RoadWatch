import React from 'react';
import { useNavigate } from 'react-router-dom';

// Designed specifically to look like the Login/Auth card structure
export const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 font-hand">
      <div className="sketch w-full max-w-md p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <h2 className="text-4xl font-bold mb-6 text-black">Settings</h2>
        
        <div className="flex flex-col gap-5 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-xl text-black font-bold">Full Name</label>
            <input 
              type="text" 
              defaultValue="Arunava Mukherjee"
              className="sketch px-4 py-3 text-xl outline-none focus:-translate-y-1 transition-transform" 
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xl text-black font-bold">Email Address</label>
            <input 
              type="email" 
              defaultValue="arunava@example.com"
              className="sketch px-4 py-3 text-xl outline-none focus:-translate-y-1 transition-transform bg-gray-100 text-gray-500 cursor-not-allowed" 
              readOnly
            />
          </div>
        </div>

        <button className="sketch w-full py-3 mb-6 bg-[#ffec99] text-2xl font-bold text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
          Save Changes
        </button>

        <div className="border-t-2 border-black pt-6 flex flex-col items-center gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="text-xl text-gray-600 underline hover:text-black"
          >
            Sign Out
          </button>
          
          {/* Stretch Goal: Delete Account */}
          <button className="sketch px-6 py-2 mt-4 bg-red-100 text-red-600 border-red-600 font-bold hover:bg-red-200">
            Delete Account Data
          </button>
        </div>

      </div>
    </div>
  );
};