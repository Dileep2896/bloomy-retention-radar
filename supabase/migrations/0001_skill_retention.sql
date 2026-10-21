-- Integration schema blueprint; not used by the offline demo.
-- In a host learning platform, classes/students/memberships already exist. The first two tables
-- below only document the foreign-key targets for this standalone concept.
create table public.classes (id uuid primary key, teacher_id uuid not null references auth.users(id), name text not null);
create table public.students (id uuid primary key, class_id uuid not null references public.classes(id), name text not null);
create table public.skills (id text primary key, name text not null, ccss_code text not null, domain text not null check(domain in ('LIT','INFO','VOCAB','GRAM','MECH','WRIT')), domain_weight real not null default 1);
create table public.skill_prereqs (skill_id text references public.skills(id), prerequisite_id text references public.skills(id), primary key(skill_id, prerequisite_id), check(skill_id <> prerequisite_id));
create table public.skill_retention (
 student_id uuid references public.students(id), skill_id text references public.skills(id), class_id uuid not null references public.classes(id),
 mastery_score real not null check(mastery_score between .9 and 1), mastered_at timestamptz not null,
 stability_days double precision not null check(stability_days > 0 and stability_days <= 180), last_reviewed_at timestamptz not null,
 reviews integer not null default 0 check(reviews >= 0), status text not null default 'mastered' check(status in ('mastered','relearn')),
 next_review_at timestamptz, primary key(student_id,skill_id)
);
create table public.echo_reviews (
 id uuid primary key default gen_random_uuid(), student_id uuid not null, skill_id text not null,
 reviewed_at timestamptz not null, correct integer not null check(correct between 0 and 3),
 before_r double precision not null check(before_r > 0 and before_r <= 1), stability_before double precision not null, stability_after double precision not null,
 foreign key(student_id,skill_id) references public.skill_retention(student_id,skill_id)
);
create table public.in_progress (student_id uuid references public.students(id), skill_id text references public.skills(id), stage text check(stage in ('Lesson','Practice')), primary key(student_id,skill_id));
create index retention_due_idx on public.skill_retention(class_id,next_review_at) where status = 'mastered';
-- RLS is enabled with no client write policies: default deny until integrated.
-- Add teacher/student membership SELECT policies for every table. Teacher ownership
-- must be checked through students.class_id, not a client-supplied class identifier.
-- Never expose answer keys or permit client-written correct counts in production.
-- Use a server-authorized, idempotent RPC that scores authored answers and locks
-- skill_retention FOR UPDATE before writing retention and immutable echo_reviews.
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.skills enable row level security;
alter table public.skill_prereqs enable row level security;
alter table public.skill_retention enable row level security;
alter table public.echo_reviews enable row level security;
alter table public.in_progress enable row level security;
create policy teacher_reads_retention on public.skill_retention for select to authenticated using (
 exists(select 1 from public.students s join public.classes c on c.id=s.class_id where s.id=student_id and c.teacher_id=auth.uid())
);
-- The illustrative policy above also requires matching SELECT policies on classes
-- and students. Default deny is intentional in this blueprint.
