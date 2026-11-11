import React from 'react';
import type { InputProps } from '../types/auth.types';

export const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-black ml-1 font-hand text-xl">{label}</label>
        <input
          ref={ref}
          className={`px-4 py-3 bg-white border-[3px] border-black rounded-xl text-black placeholder-slate-400 outline-none transition-transform focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-hand text-xl ${className}`}
          {...props}
        />
        {error && <span className="text-red-500 ml-1 text-lg font-hand">{error}</span>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';