import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/primitives';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation } from '@/hooks/queries/useAuthQueries';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: doLogin, isPending } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    doLogin({ email, password }, {
      onSuccess: () => {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      },
      onError: (error) => {
        alert(error.message || 'Login failed');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="email" label="Email" type="email" placeholder="you@example.com" required disabled={isPending} />
          <Input name="password" label="Password" type="password" placeholder="••••••••" required disabled={isPending} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
 <p className="mt-4 text-center text-sm text-text-muted ">
 Don't have an account? <Link to="#" className="text-primary-600 hover:underline ">Sign up</Link>
 </p>
 </CardContent>
 </Card>
 );
};
