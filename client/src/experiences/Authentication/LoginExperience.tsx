import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/primitives';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login processing
    setTimeout(() => {
      login('mock-jwt-token-12345', { id: 'usr-1', name: 'Demo User', email: 'demo@example.com' });
      
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }, 800);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" required disabled={loading} />
          <Input label="Password" type="password" placeholder="••••••••" required disabled={loading} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
 <p className="mt-4 text-center text-sm text-text-muted ">
 Don't have an account? <Link to="#" className="text-primary-600 hover:underline ">Sign up</Link>
 </p>
 </CardContent>
 </Card>
 );
};
