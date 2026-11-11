import { useEffect, useMemo, useState } from "react";
import { advancedMissionPack } from "./advancedMissions";
import MissionReward from "./components/MissionReward";
import { scenarios, M01 } from "./data/scenarios";
import CommandHUDM01 from "./components/CommandHUDs/CommandHUDM01";
import CommandHUDM02 from "./components/CommandHUDs/CommandHUDM02";
import CommandHUDM03 from "./components/CommandHUDs/CommandHUDM03";
import CommandHUDM04 from "./components/CommandHUDs/CommandHUDM04";
import CommandHUDM05 from "./components/CommandHUDs/CommandHUDM05";
import CommandHUDM06 from "./components/CommandHUDs/CommandHUDM06";
import OperationalMapM01 from "./components/OperationalMaps/OperationalMapM01";
import OperationalMapM02 from "./components/OperationalMaps/OperationalMapM02";
import OperationalMapM03 from "./components/OperationalMaps/OperationalMapM03";
import OperationalMapM04 from "./components/OperationalMaps/OperationalMapM04";
import OperationalMapM05 from "./components/OperationalMaps/OperationalMapM05";
import OperationalMapM06 from "./components/OperationalMaps/OperationalMapM06";
import { createInitialScenarioState, applyDecision, buildDecisionRecord, getAvailableDecisions } from "./engine/scenarioEngine";
import { calculateScore, calculateMissionXP } from "./engine/scoringEngine";
import { evaluateScenario } from "./engine/scenarioEvaluator";
import DecisionCenter from "./components/DecisionCenter";
import DecisionFeedback from "./components/DecisionFeedback";
import Debrief from "./components/Debrief";
import MissionBriefing from "./components/ScenarioBriefing";

import {
    isSupabaseConfigured,
    signIn,
    signOut,
    signUp,
    getProfile,
    saveProfile,
    getLeaderboard,
    getMissionAttempts,
    recordMissionAttempt
} from "./lib/supabaseApi";
import "./styles.css";

const RANKS = [
    { min: 0, name: "Cadete de Riesgo", icon: "🪖" },
    { min: 250, name: "Analista de Campo", icon: "🔎" },
    { min: 600, name: "Oficial de Prevención", icon: "🛡️" },
    { min: 1000, name: "Comandante de Riesgo", icon: "🎖️" },
    { min: 1500, name: "Estratega Nacional", icon: "🧭" }
];

const MISSION_COMPONENTS = {
    "M-01": {
        CommandHUD: CommandHUDM01,
        OperationalMap: OperationalMapM01,
    },
    "M-02": {
        CommandHUD: CommandHUDM02,
        OperationalMap: OperationalMapM02,
    },
    "M-03": {
        CommandHUD: CommandHUDM03,
        OperationalMap: OperationalMapM03,
    },
    "M-04": {
        CommandHUD: CommandHUDM04,
        OperationalMap: OperationalMapM04,
    },
    "M-05": {
        CommandHUD: CommandHUDM05,
        OperationalMap: OperationalMapM05,
    },
    "M-06": {
        CommandHUD: CommandHUDM06,
        OperationalMap: OperationalMapM06,
    },
};

const LOCAL_KEY = "risk-command-v1.2-local";
const SESSION_KEY = "risk-command-v1.2-session";
const emptyLocal = { profile: null, xp: 0, completed: [], bestScores: {}, attempts: 0, missionStats: {} };

function rankFor(xp) {
    return [...RANKS].reverse().find((r) => xp >= r.min) || RANKS[0];
}

function loadLocal() {
    try { return { ...emptyLocal, ...(JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}) }; }
    catch { return emptyLocal; }
}

function localLeaderboard(current) {
    try {
        const all = JSON.parse(localStorage.getItem("risk-command-v1.2-local-users") || "[]");
        return [...all, current].filter(Boolean).reduce((acc, item) => {
            const key = item.id || item.full_name;
            const found = acc.find((x) => (x.id || x.full_name) === key);
            if (found) Object.assign(found, item);
            else acc.push({ ...item });
            return acc;
        }, []).sort((a, b) => (b.xp || 0) - (a.xp || 0));
    } catch { return current ? [current] : []; }
}

function saveLocalUser(state) {
    const profile = state.profile;
    if (!profile) return;
    const users = JSON.parse(localStorage.getItem("risk-command-v1.2-local-users") || "[]");
    const key = profile.id;
    const next = { ...profile, xp: state.xp, best_scores: state.bestScores, attempts: state.attempts, mission_stats: state.missionStats };
    const index = users.findIndex((u) => u.id === key);
    if (index >= 0) users[index] = next; else users.push(next);
    localStorage.setItem("risk-command-v1.2-local-users", JSON.stringify(users));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

function buildMissionStats(rows = []) {
    return rows.reduce((acc, row) => {
        const id = row.mission_id;
        if (!id) return acc;

        const current = acc[id] || {
            attempts: 0,
            totalXp: 0,
            lastXp: 0,
            lastScore: null,
            bestScore: null,
            improvedLast: false,
            lastPlayedAt: null,
        };

        current.attempts += 1;

        if (current.lastPlayedAt === null) {
            current.lastXp = Number(row.xp_earned || 0);
            current.lastScore =
                row.score == null ? null : Number(row.score);

            current.improvedLast =
                Boolean(row.improved);

            current.lastPlayedAt =
                row.created_at || null;
        }

        current.bestScore = Math.max(
            current.bestScore ?? -1,
            Number(row.score ?? -1)
        );

        current.totalXp = Math.max(
            current.totalXp,
            Number(row.cumulative_xp || 0)
        );

        acc[id] = current;
        return acc;
    }, {});
}

function App() {
    const [localState, setLocalState] = useState(loadLocal);
    const [profile, setProfile] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [authMode, setAuthMode] = useState("login");
    const [authForm, setAuthForm] = useState({ name: "", lastName: "", password: "" });
    const [authError, setAuthError] = useState("");
    const [busy, setBusy] = useState(false);
    const [view, setView] = useState("dashboard");
    const [selectedMission, setSelectedMission] = useState(null);
    const [result, setResult] = useState(null);
    const [decisionHistory, setDecisionHistory] = useState([]);
    const [filter, setFilter] = useState("Todas");
    const [loadingProfile, setLoadingProfile] = useState(isSupabaseConfigured);
    const [scenarioState, setScenarioState] = useState(() => createInitialScenarioState(M01));
    const [scenarioInitialState, setScenarioInitialState] = useState(() => createInitialScenarioState(M01));
    const [scenarioPhase, setScenarioPhase] = useState("INITIAL");
    const [lastDecision, setLastDecision] = useState(null);

    const xp = isSupabaseConfigured ? (profile?.xp || 0) : localState.xp;
    const completed = isSupabaseConfigured ? (profile?.completed || []) : localState.completed;
    const bestScores = isSupabaseConfigured ? (profile?.best_scores || {}) : localState.bestScores;
    const attempts = isSupabaseConfigured ? (profile?.attempts || 0) : localState.attempts;
    const missionStats = localState.missionStats || {};
    const rank = rankFor(xp);
    const nextRank = RANKS.find((r) => r.min > xp);
    const progress = nextRank ? Math.min(100, ((xp - rank.min) / (nextRank.min - rank.min)) * 100) : 100;
    const filtered = useMemo(
        () => filter === "Todas" ? advancedMissionPack : advancedMissionPack.filter((m) => m.difficulty === filter),
        [filter]
    );

    useEffect(() => {
        if (!isSupabaseConfigured) {
            if (localState.profile) {
                setProfile(localState.profile);
                setLeaderboard(localLeaderboard({ ...localState.profile, xp: localState.xp }));
            }
            setLoadingProfile(false);
            return;
        }
        const token = localStorage.getItem(SESSION_KEY);
        if (!token) { setLoadingProfile(false); return; }
        Promise.all([getProfile(token), getMissionAttempts(token)])
            .then(([p, attemptsRows]) => {
                if (!p) {
                    localStorage.removeItem(SESSION_KEY);
                    return;
                }
                setProfile(p);
                setLocalState((current) => ({ ...current, missionStats: buildMissionStats(attemptsRows || []) }));
            })
            .catch(() => localStorage.removeItem(SESSION_KEY))
            .finally(() => setLoadingProfile(false));
    }, []);

    useEffect(() => {
        if (profile) {
            if (isSupabaseConfigured) getLeaderboard().then(setLeaderboard).catch(() => { });
            else setLeaderboard(localLeaderboard({ ...profile, xp }));
        }
    }, [profile, xp]);

    const updateAuth = (key, value) => setAuthForm((f) => ({ ...f, [key]: value }));

    const handleScenarioDecision = (decision) => {
        if (!decision) return;

        setScenarioState((current) => {
            const result = applyDecision(current, decision);
            const record = buildDecisionRecord({ result, phaseBefore: scenarioPhase });
            setDecisionHistory((history) => [...history, record]);
            setScenarioPhase(result.phase || scenarioPhase);
            setLastDecision({ ...record, consequence: decision.consequence || "" });
            return result.state;
        });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setBusy(true); setAuthError("");
        try {
            if (isSupabaseConfigured) {
                if (authMode === "login") {
                    const session = await signIn(
                        authForm.name.trim(),
                        authForm.lastName.trim(),
                        authForm.password
                    );

                    localStorage.setItem(SESSION_KEY, session.access_token);

                    const p = await getProfile(session.access_token);
                    const attemptsRows = await getMissionAttempts(session.access_token);

                    setProfile(p);

                    setLocalState((current) => ({
                        ...current,
                        missionStats: buildMissionStats(attemptsRows || [])
                    }));
                } else {
                    const session = await signUp({
                        name: authForm.name.trim(),
                        lastName: authForm.lastName.trim(),
                        password: authForm.password
                    });
                    if (session?.access_token) {
                        localStorage.setItem(SESSION_KEY, session.access_token);
                        const p = await getProfile(session.access_token);
                        setProfile(p);
                    } else {
                        setAuthMode("login");
                        setAuthError("Registro creado. Si la confirmación de correo está activa en Supabase, verifica tu correo y luego inicia sesión.");
                    }
                }
            } else {
                if (authMode === "login") {
                    const users = JSON.parse(localStorage.getItem("risk-command-v1.2-local-users") || "[]");
                    const fullName = `${authForm.name.trim()} ${authForm.lastName.trim()}`.trim().toLowerCase();
                    const user = users.find((u) => (u.full_name || "").toLowerCase() === fullName && u.local_password === authForm.password);
                    if (!user) throw new Error("Nombre, apellido o contraseña incorrectos.");
                    const state = {
                        profile: user, xp: user.xp || 0, completed: user.completed || [],
                        bestScores: user.best_scores || {}, attempts: user.attempts || 0, missionStats: user.mission_stats || {}
                    };
                    setLocalState(state); setProfile(user);
                    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
                } else {
                    if (!authForm.name || !authForm.lastName || !authForm.password) {
                        throw new Error("Completa nombre, apellido y contraseña.");
                    }
                    const users = JSON.parse(localStorage.getItem("risk-command-v1.2-local-users") || "[]");
                    const user = {
                        id: crypto.randomUUID(), full_name: `${authForm.name.trim()} ${authForm.lastName.trim()}`,
                        xp: 0, completed: [], best_scores: {}, attempts: 0, mission_stats: {}, local_password: authForm.password
                    };
                    users.push(user); localStorage.setItem("risk-command-v1.2-local-users", JSON.stringify(users));
                    const state = { profile: user, xp: 0, completed: [], bestScores: {}, attempts: 0, missionStats: {} };
                    setLocalState(state); setProfile(user); localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
                }
            }
        } catch (err) { setAuthError(err.message || "No fue posible completar la operación."); }
        finally { setBusy(false); }
    };

    const handleLogout = async () => {
        if (isSupabaseConfigured) await signOut(localStorage.getItem(SESSION_KEY));
        localStorage.removeItem(SESSION_KEY);
        setProfile(null); setView("dashboard"); setSelectedMission(null);
    };

    const startMission = (mission) => {
        setSelectedMission(mission);
        setResult(null);

        const scenario = scenarios[mission.id] || M01;
        const initial = createInitialScenarioState(scenario);

        setScenarioInitialState(initial);
        setScenarioState(initial);
        setScenarioPhase(scenario.initialSituation?.phase || "INITIAL");
        setDecisionHistory([]);
        setLastDecision(null);
        setView("mission");
    };

    const finishMission = async () => {
        if (!selectedMission) return;

        const currentScenario =
            scenarios[selectedMission.id];

        const scoreResult = calculateScore({
            initialState: scenarioInitialState,
            finalState: scenarioState,
            decisionHistory,
            scenario: currentScenario,
        });

        const score = scoreResult.total;
        const outcome = evaluateScenario({
            score,
            finalState: scenarioState,
            phase: scenarioPhase,
            decisionHistory,
        });

        setBusy(true);
        try {
            const previousBest = bestScores[selectedMission.id] ?? -1;

            const xpResult = calculateMissionXP({
                maxXP: selectedMission.maxXP ?? selectedMission.max_xp ?? selectedMission.xp ?? 0,
                score,
                previousBestScore: previousBest < 0 ? 0 : previousBest,
            });

            const earnedLocal = xpResult.earned;
            const improved = xpResult.improved;

            let earned = earnedLocal;
            let improvedResult = improved;

            if (isSupabaseConfigured) {
                const token = localStorage.getItem(SESSION_KEY);
                // Compatibility bridge: the current database RPC still expects
                // correct/total from the old quiz model. We encode the score as
                // a percentage until the scenario_attempts schema is migrated.
                const operation = await recordMissionAttempt(
                    token,
                    selectedMission.id,
                    score
                );
                earned = operation.awarded || operation.xp_earned || earnedLocal;
                improvedResult = operation.improved ?? improved;
                const refreshedAttempts = await getMissionAttempts(token);
                setLocalState((current) => ({ ...current, missionStats: buildMissionStats(refreshedAttempts || []) }));
                const p = await getProfile(token);
                setProfile(p);
                const board = await getLeaderboard();
                setLeaderboard(board);
            } else {
                const previousStats = localState.missionStats?.[selectedMission.id] || {
                    attempts: 0,
                    totalXp: 0,
                    lastXp: 0,
                    lastScore: null,
                    bestScore: previousBest,
                    improvedLast: false,
                    lastPlayedAt: null,
                };
                const next = {
                    ...localState,
                    xp: localState.xp + earnedLocal,
                    completed: localState.completed.includes(selectedMission.id)
                        ? localState.completed
                        : [...localState.completed, selectedMission.id],
                    bestScores: {
                        ...localState.bestScores,
                        [selectedMission.id]: Math.max(previousBest, score),
                    },
                    attempts: localState.attempts + 1,
                    missionStats: {
                        ...localState.missionStats,
                        [selectedMission.id]: {
                            ...previousStats,
                            attempts: previousStats.attempts + 1,
                            totalXp: previousStats.totalXp + earnedLocal,
                            lastXp: earnedLocal,
                            lastScore: score,
                            bestScore: Math.max(previousStats.bestScore ?? -1, score),
                            improvedLast: improved,
                            lastPlayedAt: new Date().toISOString(),
                        },
                    },
                };
                setLocalState(next);
                saveLocalUser(next);
                setProfile(next.profile);
                setLeaderboard(localLeaderboard({ ...next.profile, xp: next.xp }));
            }

            setResult({
                score,
                breakdown: scoreResult,
                outcome,
                earned,
                improved: improvedResult,
                decisionCount: decisionHistory.length,
            });
            setView("result");
        } catch (err) {
            setAuthError(err.message || "No fue posible guardar el intento.");
        } finally {
            setBusy(false);
        }
    };

    if (loadingProfile) return <div className="auth-shell"><div className="auth-card card"><div className="eyebrow">RISK COMMAND v1.3</div><h1>Conectando...</h1><p>Verificando tu sesión de estudiante.</p></div></div>;

    if (!profile) {
        return (
            <div className="auth-shell">
                <div className="auth-card card">
                    <div className="brand">RISK <span>COMMAND</span><small>v1.3 • Student Operations</small></div>
                    <div className="eyebrow">CENTRO DE IDENTIFICACIÓN</div>
                    <h1>{authMode === "login" ? "Ingresa a tu operación" : "Registra tu identidad"}</h1>
                    <p className="auth-copy">{isSupabaseConfigured ? "Tus misiones y XP se guardarán en la base de datos central." : "Modo local activo. Puedes probar el sistema mientras configuras Supabase."}</p>
                    <form onSubmit={handleAuth}>
                        <div className="form-grid">
                            <label>Nombre<input value={authForm.name} onChange={e => updateAuth("name", e.target.value)} required /></label>
                            <label>Apellido<input value={authForm.lastName} onChange={e => updateAuth("lastName", e.target.value)} required /></label>
                        </div>
                        <label>Contraseña<input type="password" value={authForm.password} onChange={e => updateAuth("password", e.target.value)} required /></label>
                        {authError && <div className="error-box">{authError}</div>}
                        <button className="primary wide" disabled={busy}>{busy ? "Procesando..." : authMode === "login" ? "ENTRAR AL CENTRO DE MANDO" : "CREAR REGISTRO"}</button>
                    </form>
                    <button className="link-button" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}>
                        {authMode === "login" ? "¿Nuevo estudiante? Crear registro" : "Ya tengo una cuenta"}
                    </button>
                    <div className="mode-note">{isSupabaseConfigured ? "● BASE DE DATOS CENTRAL ACTIVA" : "● MODO LOCAL DE PRUEBA"}</div>
                </div>
            </div>
        );
    }

    if (view === "mission" && selectedMission) {
        const missionComponents = MISSION_COMPONENTS[selectedMission.id];

        const isSimulation = Boolean(missionComponents);

        const CommandHUD = missionComponents?.CommandHUD;
        const OperationalMap = missionComponents?.OperationalMap;

        return (
            <div className="app-shell">

                <header className="topbar">
                    <div className="brand">
                        RISK <span>COMMAND</span>
                        <small>v1.3 • Student Operations</small>
                    </div>

                    <button
                        className="ghost"
                        onClick={() => setView("missions")}
                    >
                        ← Volver a misiones
                    </button>
                </header>

                <main className="mission-screen">

                    <section className="mission-hero">

                        <div className="mission-icon">
                            {selectedMission.icon}
                        </div>

                        <div>
                            <div className="eyebrow">
                                {selectedMission.region} • {selectedMission.difficulty}
                            </div>

                            <h1>
                                {selectedMission.title}
                            </h1>

                            <p>
                                {selectedMission.subtitle}
                            </p>
                        </div>

                        <MissionReward
                            maxXP={selectedMission.maxXP}
                            bestScore={bestScores[selectedMission.id]}
                        />

                    </section>

                    <MissionBriefing mission={selectedMission} />

                    {isSimulation ? (
                        <>
                            <CommandHUD
                                scenarioState={scenarioState}
                                scenarioPhase={scenarioPhase}
                            />

                            <div className="mission-operation-grid">

                                <div className="mission-map-column">
                                    <OperationalMap
                                        scenarioState={scenarioState}
                                        scenarioPhase={scenarioPhase}
                                    />
                                </div>

                                <div className="mission-decision-column">
                                    <DecisionCenter
                                        decisions={getAvailableDecisions(
                                            scenarios[selectedMission.id] || M01,
                                            scenarioPhase,
                                            scenarioState
                                        )}
                                        onDecision={handleScenarioDecision}
                                        disabled={false}
                                    />
                                </div>

                            </div>

                            {lastDecision && (
                                <DecisionFeedback decision={lastDecision} />
                            )}

                            <div className="mission-actions">
                                {scenarioPhase === "OUTCOME" ? (
                                    <button
                                        className="primary"
                                        onClick={finishMission}
                                        disabled={busy}
                                    >
                                        {busy ? "EVALUANDO..." : "FINALIZAR Y EVALUAR OPERACIÓN"}
                                    </button>
                                ) : (
                                    <button
                                        className="ghost"
                                        onClick={() => setView("missions")}
                                    >
                                        SALIR DE LA SIMULACIÓN
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <section className="simulation-coming-soon card">

                            <div className="eyebrow">
                                SIMULACIÓN EN DESARROLLO
                            </div>

                            <h2>
                                Este escenario será migrado al nuevo sistema operativo.
                            </h2>

                            <p>
                                Las misiones restantes dejarán de utilizar
                                cuestionarios y serán transformadas progresivamente
                                en escenarios interactivos.
                            </p>

                        </section>
                    )}

                </main>
            </div>
        );
    }

    if (view === "result" && result) {
        return (
            <Debrief
                result={result}
                onContinue={() => setView("missions")}
                onRanking={() => setView("ranking")}
            />
        );
    }

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="brand">RISK <span>COMMAND</span><small>v1.3 • Student Operations</small></div>
                <nav>
                    <button className={view === "dashboard" ? "nav-active" : ""} onClick={() => setView("dashboard")}>Centro</button>
                    <button className={view === "missions" ? "nav-active" : ""} onClick={() => setView("missions")}>Misiones</button>
                    <button className={view === "ranking" ? "nav-active" : ""} onClick={() => setView("ranking")}>🏆 Clasificación</button>
                    <button className="ghost" onClick={handleLogout}>Salir</button>
                </nav>
            </header>

            {view === "dashboard" && <main className="main">
                <section className="command-banner"><div><div className="eyebrow">CENTRO DE MANDO • ESTUDIANTE</div><h1>Gestiona el riesgo.<br /><span className="accent">Decide bajo presión.</span></h1><p>Completa escenarios avanzados, acumula XP y escala posiciones en la clasificación de estudiantes.</p><button className="primary" onClick={() => setView("missions")}>INICIAR OPERACIÓN</button></div><div className="radar">RISK<br />COMMAND</div></section>
                <section className="dashboard-grid">
                    <div className="card profile-card"><div className="profile-head"><div className="rank-icon">{rank.icon}</div><div><div className="eyebrow">ESTUDIANTE</div><h2>{profile.full_name}</h2></div></div><div className="xp-total">{xp}<small> XP</small></div><div className="progress"><span style={{ width: `${progress}%` }} /></div><p>{nextRank ? `${nextRank.min - xp} XP para ${nextRank.name}` : "Rango máximo alcanzado."}</p></div>
                    <div className="card stat-card"><span>RANGO</span><strong>{rank.icon} {rank.name}</strong><span>MISIONES COMPLETADAS</span><strong>{completed.length}</strong></div>
                    <div className="card stat-card"><span>INTENTOS</span><strong>{attempts}</strong><span>POSICIÓN</span><strong>#{Math.max(1, leaderboard.findIndex(x => x.id === profile.id) + 1 || 1)}</strong></div>
                </section>
                <section className="card quick-ranking"><div className="section-title">🏆 TOP 5 — CLASIFICACIÓN</div>{leaderboard.slice(0, 5).map((s, i) => <div className="rank-row" key={s.id}><b>#{i + 1}</b><span>{s.full_name}{s.id === profile.id ? " (Tú)" : ""}</span><strong>{s.xp || 0} XP</strong></div>)}{leaderboard.length === 0 && <p className="muted">Aún no hay registros en la clasificación.</p>}<button className="ghost" onClick={() => setView("ranking")}>Ver clasificación completa →</button></section>
            </main>}

            {view === "missions" && <main className="main"><div className="page-title"><div><div className="eyebrow">OPERACIONES DISPONIBLES</div><h1>Misiones</h1><p>Escenarios académicos simulados de gestión del riesgo.</p></div><div className="filters">{["Todas", "Avanzado", "Experto"].map(f => <button key={f} className={filter === f ? "filter active" : "filter"} onClick={() => setFilter(f)}>{f}</button>)}</div></div><div className="mission-grid">{filtered.map(m => <article className="mission-card " key={m.id}><div className="mission-top"><span className="mission-mini">{m.icon}</span><span className="difficulty">{m.difficulty}</span></div><h2>{m.title}</h2><p>{m.subtitle}</p><div className="tags">{m.tags.map(t => <span key={t}>{t}</span>)}
            </div><MissionReward
                    maxXP={m.maxXP}
                    bestScore={bestScores[m.id]}
                    lastXp={missionStats[m.id]?.lastXp}
                    totalXp={missionStats[m.id]?.totalXp || 0}
                    attempts={missionStats[m.id]?.attempts || 0}
                    improvedLast={missionStats[m.id]?.improvedLast || false}
                /><button className="primary wide" onClick={() => startMission(m)}>{completed.includes(m.id) ? "REPETIR MISIÓN" : "INICIAR MISIÓN"}</button></article>)}</div></main>}

            {view === "ranking" && <main className="main"><div className="page-title"><div><div className="eyebrow">COMPETENCIA ACADÉMICA</div><h1>Tabla de clasificación</h1><p>Ranking general de estudiantes ordenado por XP acumulado.</p></div></div><section className="card leaderboard">{leaderboard.map((s, i) => <div className={"leader-row " + (s.id === profile.id ? "me" : "")} key={s.id}><div className="place">{i + 1}</div><div className="leader-avatar">{rankFor(s.xp || 0).icon}</div><div className="leader-name"><strong>{s.full_name}</strong><span>{rankFor(s.xp || 0).name}</span></div><strong className="leader-xp">{s.xp || 0} XP</strong></div>)}{leaderboard.length === 0 && <p className="muted">No hay estudiantes registrados todavía.</p>}</section></main>}
        </div>
    );
}

export default App;
