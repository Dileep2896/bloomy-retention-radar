import { createContext, useContext, type ReactNode } from 'react';
import type { RetentionRepository } from './RetentionRepository';
const Context = createContext<RetentionRepository | null>(null);
export function RepositoryProvider({
  repository,
  children,
}: {
  repository: RetentionRepository;
  children: ReactNode;
}) {
  return <Context.Provider value={repository}>{children}</Context.Provider>;
}
export function useRepository() {
  const repo = useContext(Context);
  if (!repo) throw new Error('RetentionRepository provider missing');
  return repo;
}
