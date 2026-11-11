import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthCard title="Login">
        <form onSubmit={(e) => e.preventDefault()}>
          <FormInput label="Email address" type="email" placeholder="you@example.com" />
          <PasswordInput label="Password" placeholder="Enter password" />
          
          <div className="flex justify-between items-center mb-6 mt-2 text-black font-hand text-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 border-[3px] border-black rounded bg-white accent-[#FDE047]" />
              Remember me
            </label>
            {/* Removed Tailwind underlines so your custom wavy underline from index.css shows up! */}
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
              Forgot password?
            </Link>
          </div>

          <button className="w-full py-3 bg-[#FDE047] border-[3px] border-black rounded-xl text-2xl text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-hand">
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-black font-hand text-xl">
          New to RoadWatch?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Create account
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};