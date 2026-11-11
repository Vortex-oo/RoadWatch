import React, { useState } from 'react';
import { FormInput } from './FormInput';
import type { InputProps } from '../features/auth/types/auth.types';

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative">
        <FormInput 
          {...props} 
          type={show ? 'text' : 'password'} 
          ref={ref} 
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-10 text-slate-500 hover:text-black transition-colors font-hand text-lg"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';