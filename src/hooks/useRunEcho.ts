import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRepository } from '../data/RepositoryProvider';
import type { EchoOutcome } from '../data/types';
import { CLASS_ID } from '../seed/students';
export function useRunEcho() {
  const repo = useRepository();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (outcome: EchoOutcome) => repo.recordEcho(outcome),
    onSuccess: async (_, outcome) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['radar', CLASS_ID] }),
        client.invalidateQueries({ queryKey: ['student', outcome.studentId] }),
      ]);
    },
  });
}
export function useDemoAction(action: 'run' | 'reset') {
  const repo = useRepository();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () => (action === 'run' ? repo.runSuggestedChecks() : repo.reset()),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['radar'] }),
        client.invalidateQueries({ queryKey: ['student'] }),
      ]);
    },
  });
}
