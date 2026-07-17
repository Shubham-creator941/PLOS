import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../primitives/Card';
import { Input } from '../../primitives/Input';
import { Button } from '../../primitives/Button';
import { Link, useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
 const navigate = useNavigate();

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 navigate('/dashboard');
 };

 return (
 <Card>
 <CardHeader>
 <CardTitle className="text-2xl text-center">Login</CardTitle>
 </CardHeader>
 <CardContent>
 <form onSubmit={handleSubmit} className="space-y-4">
 <Input label="Email" type="email" placeholder="you@example.com" required />
 <Input label="Password" type="password" placeholder="••••••••" required />
 <Button type="submit" className="w-full">Sign In</Button>
 </form>
 <p className="mt-4 text-center text-sm text-text-muted ">
 Don't have an account? <Link to="#" className="text-primary-600 hover:underline ">Sign up</Link>
 </p>
 </CardContent>
 </Card>
 );
};
