create table if not exists public.rate_limit_counters (
  bucket_key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0
);

grant all on public.rate_limit_counters to service_role;

alter table public.rate_limit_counters enable row level security;

-- No client policies: this table is only ever touched by the server via
-- the service-role client through check_rate_limit(). RLS is enabled so
-- anon/authenticated clients cannot read or write it directly.

create or replace function public.check_rate_limit(
  p_key text, p_max integer, p_window_seconds integer
) returns boolean
language plpgsql security definer
set search_path = public
as $$
declare v_count integer;
begin
  insert into public.rate_limit_counters (bucket_key, window_start, count)
  values (p_key, now(), 1)
  on conflict (bucket_key) do update
    set count = case
          when public.rate_limit_counters.window_start < now() - make_interval(secs => p_window_seconds)
          then 1
          else public.rate_limit_counters.count + 1
        end,
        window_start = case
          when public.rate_limit_counters.window_start < now() - make_interval(secs => p_window_seconds)
          then now()
          else public.rate_limit_counters.window_start
        end
  returning count into v_count;
  return v_count <= p_max;
end;
$$;

grant execute on function public.check_rate_limit(text, integer, integer) to service_role;