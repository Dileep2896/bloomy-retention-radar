import { useQuery } from '@tanstack/react-query';
import { useRepository } from '../data/RepositoryProvider';
export function useStudentSkills(id: string) {
  const repo = useRepository();
  return useQuery({ queryKey: ['student', id], queryFn: () => repo.getStudentSkills(id) });
}
