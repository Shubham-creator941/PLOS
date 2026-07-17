import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import {
  AppErrorBoundary,
  QueryProvider,
  ThemeProvider,
  EventBusProvider,
  AuthProvider,
  NotificationProvider,
  CommandPaletteProvider
} from '@/providers';

import { useGlobalShortcuts } from '@/hooks';
import { OfflineBanner } from '@/widgets/Global/OfflineBanner';

function AppContent() {
  useGlobalShortcuts();
  return (
    <>
      <OfflineBanner />
      <RouterProvider router={router} />
    </>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <EventBusProvider>
            <AuthProvider>
              <NotificationProvider>
                <CommandPaletteProvider>
                  <AppContent />
                </CommandPaletteProvider>
              </NotificationProvider>
            </AuthProvider>
          </EventBusProvider>
        </ThemeProvider>
      </QueryProvider>
    </AppErrorBoundary>
  );
}

export default App;
