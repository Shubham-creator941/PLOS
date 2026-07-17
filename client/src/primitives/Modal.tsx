import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/50 p-4 backdrop-blur-sm">
 <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface-elevated p-6 shadow-xl">
 <div className="mb-4 flex items-center justify-between">
 <h2 className="text-title">{title}</h2>
 <button
 onClick={onClose}
 className="rounded-full p-1 text-text-muted hover:bg-surface-hover "
 >
 <X className="h-5 w-5" />
 </button>
 </div>
 <div className="text-text-secondary ">
 {children}
 </div>
 </div>
 </div>
 );
};
