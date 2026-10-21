import type { SupabaseClient } from '@supabase/supabase-js';
import type { RetentionRepository } from './RetentionRepository';
import type { Snapshot, SkillState, EchoItem, EchoOutcome } from './types';
/** Integration blueprint only. Never instantiated by the demo; inject an authenticated client.
 * A production adapter must map snake_case rows, join class memberships, and use a transaction
 * with a row lock for the pure applyEcho update + echo_reviews insert. Do not ship this stub.
 */
export class SupabaseRetentionRepository implements RetentionRepository {
  constructor(private readonly client: SupabaseClient) {}
  async getClassSnapshot(classId: string): Promise<Snapshot> {
    const { error } = await this.client
      .from('skill_retention')
      .select('*, skills(*), students(*)')
      .eq('class_id', classId);
    if (error) throw error;
    throw new Error('Integration stub: map rows to Snapshot and load skill_prereqs + in_progress.');
  }
  async getStudentSkills(studentId: string): Promise<SkillState[]> {
    const { error } = await this.client
      .from('skill_retention')
      .select('*')
      .eq('student_id', studentId);
    if (error) throw error;
    throw new Error('Integration stub: map rows to SkillState with echo_reviews history.');
  }
  async getEchoItems(_skillId: string): Promise<EchoItem[]> {
    throw new Error('Integration stub: connect versioned, authored assessment content.');
  }
  async recordEcho(_outcome: EchoOutcome): Promise<SkillState> {
    throw new Error(
      'Integration stub: implement an authenticated transactional Echo RPC with server-side scoring.',
    );
  }
  async runSuggestedChecks(): Promise<number> {
    throw new Error('Scripted outcomes are demo-only.');
  }
  async reset(): Promise<void> {
    throw new Error('Reset is demo-only.');
  }
}
