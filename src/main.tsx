import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { App } from './App';
import { RepositoryProvider } from './data/RepositoryProvider';
import { MemoryRetentionRepository } from './data/memoryRepo';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './index.css';
const client = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});
const repo = new MemoryRetentionRepository();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RepositoryProvider repository={repo}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </BrowserRouter>
      </RepositoryProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
