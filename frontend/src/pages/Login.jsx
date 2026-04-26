import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from '@/components';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch {
      // error is in Redux state via authError
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-surface px-6 sm:px-16 lg:px-[15%]">
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-primary-500 hover:text-primary-600 transition-colors">
          <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center text-white font-bold text-[15px]">
            B
          </div>
          <span className="text-[18px] font-bold tracking-tight">PayBud</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-[24px] font-semibold text-text-primary tracking-tight mb-2">
            Sign in to your account
          </h1>
          <p className="text-[14px] text-text-secondary">
            Welcome back! Please enter your details.
          </p>
        </div>

        {authError && (
          <Alert type="error" className="mb-6 border-danger-200">
            {authError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            error={errors.email}
            className="rounded-md h-10 shadow-sm"
          />
          
          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              className="rounded-md h-10 shadow-sm"
            />
          </div>

          <Button type="submit" fullWidth loading={loading} className="h-10 text-[14px]">
            Sign in
          </Button>
        </form>

        <p className="text-[13.5px] text-text-secondary mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
