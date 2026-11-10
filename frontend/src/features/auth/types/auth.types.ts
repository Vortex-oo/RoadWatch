import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export type AuthRole = 'user' | 'verifier';
export type ForgotPasswordState = 'request' | 'sent' | 'reset';