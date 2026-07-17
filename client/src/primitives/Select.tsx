import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
 label?: string;
 error?: string;
 options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
 ({ className = '', label, error, options, ...props }, ref) => {
 const id = props.id || props.name;

 return (
 <div className="w-full flex flex-col gap-1.5">
 {label && (
 <label htmlFor={id} className="text-label text-text-secondary ">
 {label}
 </label>
 )}
 <select
 ref={ref}
 id={id}
 className={`flex h-10 w-full rounded-md border bg-surface-secondary px-3 py-2 text-body text-text-primary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
 error
 ? 'border-danger focus:border-danger focus:ring-danger/50'
 : 'border-border focus:border-primary focus:ring-primary/50'
 } ${className}`}
 {...props}
 >
 {options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 {error && <p className="text-caption text-danger">{error}</p>}
 </div>
 );
 }
);

Select.displayName = 'Select';
