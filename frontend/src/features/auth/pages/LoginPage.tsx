import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed.');
      }

      localStorage.setItem('token', data.token);
      navigate('/map');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Login">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Username"
            type="text"
            placeholder="john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="mb-4 text-red-600 text-lg font-hand">{error}</p>
          )}

          <div className="flex justify-between items-center mb-6 mt-2 text-black font-hand text-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 border-[3px] border-black rounded bg-white accent-[#FDE047]" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#FDE047] border-[3px] border-black rounded-xl text-2xl text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-hand disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
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