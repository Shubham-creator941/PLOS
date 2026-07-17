

export const ProgressRing = ({ value, size = 120, strokeWidth = 8, label }: { value: number, size?: number, strokeWidth?: number, label?: string }) => {
 const radius = (size - strokeWidth) / 2;
 const circumference = radius * 2 * Math.PI;
 const offset = circumference - (value / 100) * circumference;

 return (
 <div className="relative flex flex-col items-center justify-center">
 <svg width={size} height={size} className="transform -rotate-90">
 {/* Background Track */}
 <circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 stroke="currentColor"
 strokeWidth={strokeWidth}
 fill="transparent"
 className="text-surface-active"
 />
 {/* Progress Track */}
 <circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 stroke="currentColor"
 strokeWidth={strokeWidth}
 fill="transparent"
 strokeDasharray={circumference}
 strokeDashoffset={offset}
 strokeLinecap="round"
 className="text-primary transition-all duration-1000 ease-in-out"
 />
 </svg>
 <div className="absolute flex flex-col items-center justify-center">
 <span className="text-2xl font-bold text-text-primary">{Math.round(value)}%</span>
 </div>
 {label && <span className="mt-4 text-sm font-medium text-text-secondary">{label}</span>}
 </div>
 );
};
