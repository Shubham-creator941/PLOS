import React from 'react';
import { WifiOff } from 'lucide-react';
import { useNetworkState } from '@/hooks';

export const OfflineBanner: React.FC = () => {
  const { isOffline } = useNetworkState();

  if (!isOffline) return null;

  return (
    <div className="bg-warning-500 text-white px-4 py-2 text-sm flex items-center justify-center gap-2 animate-[slide-down_0.3s_ease-out] z-[100] relative">
      <WifiOff className="h-4 w-4" />
      <span>You are currently offline. Changes will be saved locally and synced when you reconnect.</span>
    </div>
  );
};
