create extension if not exists pgcrypto;

create table public.workspaces (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null default 'VICE CLIPS',
 created_at timestamptz not null default now()
);
create table public.channels (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 name text not null, slug text not null, platform text not null default 'internal', description text,
 active boolean not null default true, created_at timestamptz not null default now(), unique(workspace_id,slug)
);
create table public.content_sources (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 platform text not null check(platform in ('twitch','youtube','kick','upload')), external_id text,
 display_name text not null, source_url text, status text not null default 'pending', created_at timestamptz not null default now()
);
create table public.source_permissions (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 source_id uuid not null references public.content_sources(id) on delete cascade, permission_type text not null,
 evidence_url text, allowed_operations text[] not null default '{}', verified boolean not null default false,
 granted_at timestamptz, expires_at timestamptz, created_at timestamptz not null default now()
);
create table public.streams (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 source_id uuid not null references public.content_sources(id), external_id text, title text, source_asset_key text,
 started_at timestamptz, ended_at timestamptz, status text not null default 'discovered',
 metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.transcripts (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 stream_id uuid not null references public.streams(id) on delete cascade, language text,
 segments jsonb not null default '[]', provider text, created_at timestamptz not null default now()
);
create table public.detected_moments (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 stream_id uuid not null references public.streams(id) on delete cascade, start_seconds numeric not null,
 end_seconds numeric not null, score numeric not null default 0 check(score between 0 and 100),
 category text, explanation text, status text not null default 'detected', created_at timestamptz not null default now(),
 check(end_seconds > start_seconds)
);
create table public.clips (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 channel_id uuid references public.channels(id) on delete set null, stream_id uuid references public.streams(id) on delete set null,
 moment_id uuid references public.detected_moments(id) on delete set null, title text, description text,
 status text not null default 'queued', source_asset_key text, output_asset_key text, duration_seconds numeric,
 aspect_ratio text not null default '9:16', metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.render_jobs (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 clip_id uuid not null references public.clips(id) on delete cascade, status text not null default 'queued',
 template_id text, settings jsonb not null default '{}', attempts integer not null default 0,
 error_message text, started_at timestamptz, finished_at timestamptz, created_at timestamptz not null default now()
);
create table public.agent_runs (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 agent_name text not null, task_type text not null, status text not null default 'queued',
 input jsonb not null default '{}', output jsonb not null default '{}', error_message text,
 created_at timestamptz not null default now(), finished_at timestamptz
);
create table public.publications (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 clip_id uuid not null references public.clips(id) on delete cascade, platform text not null,
 external_post_id text, scheduled_at timestamptz, published_at timestamptz, status text not null default 'draft',
 post_url text, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.analytics_snapshots (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 publication_id uuid not null references public.publications(id) on delete cascade, views bigint not null default 0,
 likes bigint not null default 0, comments bigint not null default 0, shares bigint not null default 0,
 captured_at timestamptz not null default now()
);

create index streams_source_started_idx on public.streams(source_id,started_at desc);
create index moments_stream_score_idx on public.detected_moments(stream_id,score desc);
create index clips_workspace_status_idx on public.clips(workspace_id,status,created_at desc);
create index render_jobs_status_idx on public.render_jobs(status,created_at);
create index publications_schedule_idx on public.publications(status,scheduled_at);

create or replace function public.owns_workspace(target_workspace uuid)
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.workspaces where id=target_workspace and owner_id=auth.uid());
$$;

alter table public.workspaces enable row level security;
create policy workspace_owner_select on public.workspaces for select to authenticated using(owner_id=auth.uid());
create policy workspace_owner_insert on public.workspaces for insert to authenticated with check(owner_id=auth.uid());
create policy workspace_owner_update on public.workspaces for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());
create policy workspace_owner_delete on public.workspaces for delete to authenticated using(owner_id=auth.uid());

do $$ declare t text; begin
 foreach t in array array['channels','content_sources','source_permissions','streams','transcripts','detected_moments','clips','render_jobs','agent_runs','publications','analytics_snapshots'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('create policy workspace_owner_all on public.%I for all to authenticated using(public.owns_workspace(workspace_id)) with check(public.owns_workspace(workspace_id))',t);
 end loop;
end $$;
