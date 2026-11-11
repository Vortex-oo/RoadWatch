import React from 'react';

interface DuplicateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onSubmitNew: () => void;
  onCancel: () => void;
}

// A centered overlay that intercepts the submission if a duplicate is found
export const DuplicateModal = ({ isOpen, onConfirm, onSubmitNew, onCancel }: DuplicateModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="sketch p-6 max-w-sm w-full bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
        
        <h3 className="text-2xl font-bold text-black border-b-2 border-black pb-2">Wait, is this the same pothole?</h3>
        
        <p className="text-lg text-gray-700">
          Someone else reported road damage 15 meters from here. If this is the same damage, confirming it helps us prioritize repairs!
        </p>

        {/* Mock Thumbnail of existing report */}
        <div className="w-full h-32 sketch bg-gray-200 flex items-center justify-center mb-2">
          <span className="text-gray-500">Existing Photo</span>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <button 
            onClick={onConfirm}
            className="sketch w-full py-3 bg-[#a5d8ff] text-black text-xl font-bold hover:bg-blue-300"
          >
            Yes, confirm this one
          </button>
          
          <button 
            onClick={onSubmitNew}
            className="sketch w-full py-3 bg-white text-black text-xl font-bold hover:bg-gray-100"
          >
            No, submit as new
          </button>
          
          <button 
            onClick={onCancel}
            className="text-gray-500 underline text-lg mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};