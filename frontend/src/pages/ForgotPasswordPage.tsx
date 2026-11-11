import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import type { ForgotPasswordState } from '../types/auth.types';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState<ForgotPasswordState>('request');

  return (
    <AuthLayout>
      <AuthCard title={step === 'reset' ? 'New Password' : 'Reset Password'}>
        
        {step === 'request' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('sent'); }}>
            <p className="mb-6 text-slate-600 font-hand text-xl">
              Enter your email and we'll send you a secure link to reset your password.
            </p>
            <FormInput label="Email address" type="email" placeholder="you@example.com" />
            <button className="w-full py-3 mt-2 bg-[#FDE047] border-[3px] border-black rounded-xl text-2xl text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-hand">
              Send Link
            </button>
          </form>
        )}

        {step === 'sent' && (
          <div className="text-center font-hand">
            <div className="inline-block p-4 mb-4 bg-[#86EFAC] border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="mb-4 text-2xl text-black">Check your inbox!</p>
            <p className="mb-6 text-slate-600 text-xl">We sent a recovery link. Click it to set a new password.</p>
            
            <button onClick={() => setStep('reset')} className="text-lg text-slate-400 hover:text-black font-hand">
              (Dev: Jump to Reset Step)
            </button>
          </div>
        )}

        {step === 'reset' && (
          <form onSubmit={(e) => { e.preventDefault(); alert('Password updated!'); }}>
            <PasswordInput label="New Password" placeholder="Must be at least 8 characters" />
            <PasswordInput label="Confirm Password" placeholder="Must match new password" />
            <button className="w-full py-3 mt-4 bg-[#86EFAC] border-[3px] border-black rounded-xl text-2xl text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-hand">
              Update Password
            </button>
          </form>
        )}

        <div className="mt-6 text-center border-t-[3px] border-black pt-6 font-hand">
          <Link to="/login" className="text-black text-xl hover:bg-slate-200 px-4 py-2 border-[3px] border-transparent hover:border-black rounded-lg transition-all no-underline">
            ← Back to Login
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};