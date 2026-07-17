import React from 'react';
import { Card, CardContent } from '../primitives/Card';

interface StatCardProps {
 title: string;
 value: string | number;
 icon?: React.ReactNode;
 trend?: {
 value: number;
 isPositive: boolean;
 };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
 return (
 <Card className="hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover bg-surface hover:bg-surface-hover">
 <CardContent className="p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-label text-text-muted">{title}</p>
 <p className="mt-2 text-h2">{value}</p>
 </div>
 {icon && (
 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 ">
 {icon}
 </div>
 )}
 </div>
 {trend && (
 <div className="mt-4 flex items-center text-sm">
 <span
 className={`font-medium ${
 trend.isPositive ? 'text-accent-600 ' : 'text-danger-600 '
 }`}
 >
 {trend.isPositive ? '+' : '-'}
 {trend.value}%
 </span>
 <span className="ml-2 text-text-muted ">vs last month</span>
 </div>
 )}
 </CardContent>
 </Card>
 );
};
