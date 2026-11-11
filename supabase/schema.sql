-- RISK COMMAND v1.2.1
-- Registro simplificado: nombre, apellido y contraseña.
-- El correo interno utilizado por Supabase Auth se genera automáticamente
-- y no se muestra al estudiante.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  xp integer not null default 0 check (xp >= 0),
  completed text[] not null default '{}',
  best_scores jsonb not null default '{}'::jsonb,
  attempts integer not null default 0 check (attempts >= 0),
  created_at timestamptz not null default now()
);

-- Si se ejecuta sobre una base ya creada con v1.2:
alter table public.profiles drop column if exists student_code;
alter table public.profiles drop column if exists group_name;

create table if not exists public.missions (
  id text primary key,
  title text not null,
  max_xp integer not null check (max_xp > 0),
  active boolean not null default true
);

insert into public.missions (id, title, max_xp) values
  ('M-01', 'Misión M-01', 220),
  ('M-02', 'Misión M-02', 240),
  ('M-03', 'Misión M-03', 280),
  ('M-04', 'Misión M-04', 300),
  ('M-05', 'Misión M-05', 360),
  ('M-06', 'Misión M-06', 380)
on conflict (id) do update set xp=excluded.xp, active=true;

create table if not exists public.mission_attempts (
    id bigint generated always as identity primary key,
    user_id uuid not null
        references public.profiles(id)
        on delete cascade,
    mission_id text not null
        references public.missions(id),
    score integer not null
        check (score between 0 and 100),
    xp_earned integer not null
        default 0
        check (xp_earned >= 0),
    cumulative_xp integer not null
        default 0
        check (cumulative_xp >= 0),
    improved boolean not null
        default true,
    created_at timestamptz not null
        default now()
);

alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.mission_attempts enable row level security;

drop policy if exists "students read own profile" on public.profiles;
create policy "students read own profile" on public.profiles
for select to authenticated using (id = auth.uid());

drop policy if exists "students create own profile" on public.profiles;
create policy "students create own profile" on public.profiles
for insert to authenticated with check (id = auth.uid());

drop policy if exists "students update own profile" on public.profiles;
create policy "students update own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "students read missions" on public.missions;
create policy "students read missions" on public.missions
for select to authenticated using (active = true);

drop policy if exists "students read own attempts" on public.mission_attempts;
create policy "students read own attempts" on public.mission_attempts
for select to authenticated using (user_id = auth.uid());

create or replace function public.record_mission_attempt(
  p_mission_id text,
  p_score integer,
  p_correct integer,
  p_total integer
)
returns table (
  xp_earned integer,
  improved boolean,
  new_xp integer,
  new_best integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  base_xp integer;
  previous_best integer;
  awarded integer;
  base_earned integer;
  bonus integer;
  was_improved boolean;
  current_xp integer;
begin
  if uid is null then raise exception 'No hay sesión de estudiante.'; end if;
  if p_score < 0 or p_score > 100 or p_total <= 0 or p_correct < 0 or p_correct > p_total then
    raise exception 'Datos de intento inválidos.';
  end if;

  select xp into base_xp
  from public.missions
  where id = p_mission_id and active = true;

  if base_xp is null then raise exception 'Misión no encontrada.'; end if;

  select coalesce((best_scores ->> p_mission_id)::integer, -1), xp
    into previous_best, current_xp
    from public.profiles
    where id = uid
    for update;

  if previous_best < 0 then
    was_improved := true;
  else
    was_improved := p_score > previous_best;
  end if;

  base_earned := round(base_xp * (0.45 + (p_correct::numeric / p_total::numeric) * 0.55));
  bonus := case when p_score = 100 then 80 when p_score >= 67 then 35 else 0 end;
  awarded := base_earned + bonus;

  if not was_improved then
    awarded := round(awarded * 0.35);
  end if;

  update public.profiles
  set xp = xp + awarded,
      attempts = attempts + 1,
      completed = case
        when p_mission_id = any(completed) then completed
        else array_append(completed, p_mission_id)
      end,
      best_scores = jsonb_set(
        best_scores,
        array[p_mission_id],
        to_jsonb(greatest(coalesce((best_scores ->> p_mission_id)::integer, -1), p_score)),
        true
      )
  where id = uid
  returning xp into current_xp;

  insert into public.mission_attempts(user_id, mission_id, score, correct, total, xp_earned, improved)
  values (uid, p_mission_id, p_score, p_correct, p_total, awarded, was_improved);

  return query select awarded, was_improved, current_xp,
    greatest(previous_best, p_score);
end;
$$;

create or replace function public.get_leaderboard()
returns table (
  id uuid,
  full_name text,
  xp integer
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.full_name, p.xp
  from public.profiles p
  order by p.xp desc, p.full_name asc;
$$;

revoke all on function public.record_mission_attempt(text, integer, integer, integer) from public;
grant execute on function public.record_mission_attempt(text, integer, integer, integer) to authenticated;
grant execute on function public.get_leaderboard() to anon, authenticated;

-- IMPORTANTE:
-- En Supabase > Authentication > Providers > Email:
-- desactiva "Confirm email" para que el estudiante pueda entrar
-- inmediatamente después del registro.
--
-- El sistema genera internamente un correo como:
-- nombre.apellido@riskcommand.local
-- El estudiante nunca lo introduce ni lo ve.
