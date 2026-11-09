const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const headers = (token) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json"
});

function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ".");
}

function internalEmail(name, lastName) {
  return `${normalizeName(name)}.${normalizeName(lastName)}@riskcommand.local`;
}

async function request(path, options={}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: { ...headers(options.token), ...(options.headers || {}) }
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    throw new Error(data?.msg || data?.message || data?.error_description || data?.details || "Error de conexión con la base de datos.");
  }
  return data;
}

export async function signUp({ name, lastName, password }) {
  const email = internalEmail(name, lastName);
  const data = await request("/auth/v1/signup", {
    method:"POST",
    body:JSON.stringify({
      email,
      password,
      data: { full_name:`${name} ${lastName}` }
    })
  });
  if (!data?.access_token) return null;
  await saveProfile(data.access_token, { full_name:`${name} ${lastName}` });
  return data;
}

export async function signIn(name, lastName, password) {
  const email = internalEmail(name, lastName);
  return request("/auth/v1/token?grant_type=password", {
    method:"POST",
    body:JSON.stringify({ email, password })
  });
}

export async function signOut(token) {
  try { await request("/auth/v1/logout", { method:"POST", token }); } catch {}
}

export async function getProfile(token) {
  const user = await request("/auth/v1/user", { token });
  const profiles = await request(
    `/rest/v1/profiles?select=id,full_name,xp,completed,best_scores,attempts&id=eq.${user.id}`,
    { token }
  );
  return profiles?.[0] || null;
}

export async function saveProfile(token, profile) {
  const user = await request("/auth/v1/user", { token });
  const body = {
    id:user.id,
    full_name:profile.full_name,
    xp:0,
    completed:[],
    best_scores:{},
    attempts:0
  };
  return request("/rest/v1/profiles", {
    method:"POST",
    token,
    headers:{"Prefer":"resolution=merge-duplicates,return=representation"},
    body:JSON.stringify(body)
  });
}

export async function getLeaderboard() {
  return request("/rest/v1/rpc/get_leaderboard", {
    method:"POST",
    body:"{}",
    token:SUPABASE_ANON_KEY
  });
}

export async function recordMissionAttempt(token, missionId, score, correct, total) {
  const rows = await request("/rest/v1/rpc/record_mission_attempt", {
    method:"POST",
    token,
    body:JSON.stringify({
      p_mission_id:missionId,
      p_score:score,
      p_correct:correct,
      p_total:total
    })
  });
  return Array.isArray(rows) ? rows[0] : rows;
}
