import { useQuery } from '@tanstack/react-query';
import { useRepository } from '../data/RepositoryProvider';
import { CLASS_ID } from '../seed/students';
export function useRadar() {
  const repo = useRepository();
  return useQuery({
    queryKey: ['radar', CLASS_ID],
    queryFn: () => repo.getClassSnapshot(CLASS_ID),
  });
}
