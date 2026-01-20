'use client';

import { useMemo, useRef, createContext, useContext } from 'react';
import {
  RoomAudioRenderer,
  SessionProvider,
  StartAudio,
  useSession,
} from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { getSandboxTokenSource, getLocalTokenSource } from '@/lib/utils';
import type { UseCase } from '@/lib/use-cases';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

// Context to share the use case ref with child components
interface UseCaseContextValue {
  useCaseRef: React.MutableRefObject<UseCase | null>;
  setUseCase: (useCase: UseCase) => void;
}

const UseCaseContext = createContext<UseCaseContextValue | null>(null);

export function useUseCaseContext() {
  const context = useContext(UseCaseContext);
  if (!context) {
    throw new Error('useUseCaseContext must be used within App');
  }
  return context;
}

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  return null;
}

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  // Ref to store the selected use case - accessible by the token source
  const useCaseRef = useRef<UseCase | null>(null);

  const setUseCase = (useCase: UseCase) => {
    useCaseRef.current = useCase;
  };

  const tokenSource = useMemo(() => {
    return typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string'
      ? getSandboxTokenSource(appConfig, useCaseRef)
      : getLocalTokenSource(useCaseRef);
  }, [appConfig]);

  const session = useSession(
    tokenSource,
    appConfig.agentName ? { agentName: appConfig.agentName } : undefined
  );

  return (
    <UseCaseContext.Provider value={{ useCaseRef, setUseCase }}>
      <SessionProvider session={session}>
        <AppSetup />
        <main className="grid h-svh grid-cols-1 place-content-center">
          <ViewController appConfig={appConfig} />
        </main>
        <StartAudio label="Start Audio" />
        <RoomAudioRenderer />
        <Toaster />
      </SessionProvider>
    </UseCaseContext.Provider>
  );
}
