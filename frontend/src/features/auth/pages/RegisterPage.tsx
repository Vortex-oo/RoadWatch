import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import { RoleSelector } from '../components/RoleSelector';
import type { AuthRole } from '../types/auth.types';

export const RegisterPage = () => {
  const [role, setRole] = useState<AuthRole>('user');

  return (
    <AuthLayout>
      <AuthCard title="Create Account">
        <RoleSelector role={role} setRole={setRole} />
        
        <form onSubmit={(e) => e.preventDefault()}>
          <FormInput label="Full Name" type="text" placeholder="John Doe" />
          <FormInput label="Email address" type="email" placeholder="you@example.com" />
          <PasswordInput label="Password" placeholder="Create a strong password" />
          
          {role === 'verifier' && (
            <div className="bg-[#93C5FD] border-[3px] border-black rounded-lg p-3 mb-4 text-sm font-bold text-black">
              Note: Verifier accounts require approval from a municipality admin.
            </div>
          )}

          <button className="w-full mt-2 py-3 bg-[#FDE047] border-[3px] border-black rounded-xl font-bold text-lg text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Register
          </button>
        </form>

        <p className="mt-6 text-center font-bold text-black">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline decoration-2">
            Log in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};