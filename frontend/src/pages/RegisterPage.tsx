import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import type { AuthRole } from '../types/auth.types';

export const RegisterPage = () => {
  const [role, setRole] = useState<AuthRole>('user');

  return (
    <AuthLayout>
      <AuthCard title="Create Account">
        <form onSubmit={(e) => e.preventDefault()}>
          <FormInput label="Username" type="text" placeholder="john_doe" />
          <PasswordInput label="Password" placeholder="Create a strong password" />

          <button className="w-full mt-2 py-3 bg-[#FDE047] border-[3px] border-black rounded-xl text-2xl text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-hand">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-black font-hand text-xl">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Log in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};