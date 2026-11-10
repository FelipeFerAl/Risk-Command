import {
  Activity,
  AlertTriangle,
  CloudRain,
  Droplets,
  Home,
  Radio,
  Route,
  ShieldCheck,
  Siren,
  Target,
  Users,
  Waves,
  Mountain,
  Gauge,
  Megaphone,
  WalletCards,
  HeartPulse,
  Network
} from "lucide-react";

const SCENES = {
  "M-01": {
    type: "landslide",
    label: "Ladera andina",
    sublabel: "Movimiento en masa",
    metrics: [
      ["Estabilidad", "stability", ShieldCheck],
      ["Exposición", "exposure", Users],
      ["Capacidad", "capacity", Activity]
    ]
  },
  "M-02": {
    type: "flood",
    label: "Cuenca urbana",
    sublabel: "Inundación y vulnerabilidad",
    metrics: [
      ["Nivel de agua", "water", Waves],
      ["Vulnerabilidad", "exposure", Home],
      ["Capacidad", "capacity", ShieldCheck]
    ]
  },
  "M-03": {
    type: "budget",
    label: "Centro de decisiones",
    sublabel: "Reducción y presupuesto",
    metrics: [
      ["Inversión", "investment", WalletCards],
      ["Reducción", "capacity", ShieldCheck],
      ["Riesgo residual", "exposure", AlertTriangle]
    ]
  },
  "M-04": {
    type: "response",
    label: "Corredor logístico",
    sublabel: "Continuidad y respuesta",
    metrics: [
      ["Acceso", "route", Route],
      ["Continuidad", "capacity", HeartPulse],
      ["Coordinación", "coordination", Network]
    ]
  },
  "M-05": {
    type: "communication",
    label: "Red de información",
    sublabel: "Comunicación del riesgo",
    metrics: [
      ["Señal", "signal", Radio],
      ["Rumor", "exposure", Megaphone],
      ["Cobertura", "capacity", Users]
    ]
  },
  "M-06": {
    type: "command",
    label: "Sala de coordinación",
    sublabel: "Gestión integral multiamenaza",
    metrics: [
      ["Integración", "coordination", Network],
      ["Riesgo residual", "exposure", AlertTriangle],
      ["Capacidad", "capacity", Gauge]
    ]
  }
};

function getScenarioState(mission, answers) {
  const questions = mission.questions || [];
  const answered = questions.filter((q) => answers[q.id] !== undefined);
  const correct = answered.filter((q) => answers[q.id] === q.answer).length;
  const incorrect = answered.length - correct;
  const control = correct - incorrect;
  const progress = questions.length ? Math.round((answered.length / questions.length) * 100) : 0;
  const risk = Math.max(0, Math.min(100, 55 + incorrect * 18 - correct * 14));
  const capacity = Math.max(0, Math.min(100, 45 + correct * 20 - incorrect * 15));
  const exposure = Math.max(0, Math.min(100, 55 + incorrect * 15 - correct * 9));
  return { answered, correct, incorrect, control, progress, risk, capacity, exposure };
}

function stateLabel(state) {
  if (state.answered.length === 0) return "Escenario inicial";
  if (state.control >= 2) return "Control fortalecido";
  if (state.control >= 0) return "Operación en tensión";
  return "Riesgo en aumento";
}

function barValue(key, state) {
  if (key === "stability") return Math.max(8, 100 - state.risk);
  if (key === "water") return Math.min(96, state.risk);
  if (key === "exposure") return state.exposure;
  if (key === "capacity" || key === "investment" || key === "signal" || key === "coordination") return state.capacity;
  if (key === "route") return Math.max(10, state.capacity);
  return state.capacity;
}

export default function MissionScene({ mission, answers }) {
  const config = SCENES[mission.id] || SCENES["M-06"];
  const state = getScenarioState(mission, answers);
  const severity = state.risk >= 72 ? "critical" : state.risk >= 55 ? "alert" : "stable";

  return (
    <section className={`mission-scene ${config.type} ${severity}`} aria-label={`Escenario visual de ${mission.title}`}>
      <div className="scene-head">
        <div>
          <div className="eyebrow">SIMULACIÓN VISUAL</div>
          <h2>{config.label}</h2>
          <p>{config.sublabel} · el entorno responde a tus decisiones.</p>
        </div>
        <div className={`scene-status ${severity}`}>
          <span className="status-dot" />
          {stateLabel(state)}
        </div>
      </div>

      <div className="scene-canvas">
        <div className="scene-grid" />
        <div className="scene-hud hud-left">
          <span>DECISIONES</span>
          <strong>{state.answered.length}/{mission.questions.length}</strong>
        </div>
        <div className="scene-hud hud-right">
          <span>CONTROL</span>
          <strong>{Math.max(0, 50 + state.control * 16)}%</strong>
        </div>

        {config.type === "landslide" && (
          <>
            <CloudRain className="scene-rain" size={82} />
            <Mountain className="scene-mountain" size={190} />
            <Home className="scene-house house-a" size={44} />
            <Home className="scene-house house-b" size={36} />
            <div className="scene-road" />
            <div className="scene-crack crack-a" />
            <div className="scene-crack crack-b" />
            <div className="scene-alert-marker"><Siren size={18} /> {severity === "critical" ? "ZONA CRÍTICA" : "MONITOREO"}</div>
          </>
        )}

        {config.type === "flood" && (
          <>
            <div className="flood-water" style={{ height: `${Math.max(18, state.risk * 0.65)}%` }} />
            <Waves className="scene-waves" size={150} />
            <Home className="scene-house house-a" size={46} />
            <Home className="scene-house house-b" size={38} />
            <div className="scene-school">🏫</div>
            <div className="scene-health">🏥</div>
            <div className="scene-alert-marker"><Droplets size={18} /> NIVEL {state.risk >= 72 ? "ALTO" : state.risk >= 55 ? "DE ALERTA" : "CONTROLADO"}</div>
          </>
        )}

        {config.type === "budget" && (
          <>
            <div className="command-table"><WalletCards size={42} /><span>FONDO MUNICIPAL</span><strong>{Math.max(20, 100 - state.risk)}%</strong></div>
            <div className="budget-stack">
              <span style={{ height: `${Math.max(18, state.capacity * 0.72)}%` }}><b>REDUCCIÓN</b></span>
              <span style={{ height: `${Math.max(12, state.exposure * 0.45)}%` }}><b>RESIDUAL</b></span>
              <span style={{ height: `${Math.max(14, state.capacity * 0.55)}%` }}><b>PREPARACIÓN</b></span>
            </div>
            <div className="scene-alert-marker"><Target size={18} /> PRIORIZACIÓN {state.control >= 1 ? "ACTIVA" : "PENDIENTE"}</div>
          </>
        )}

        {config.type === "response" && (
          <>
            <div className="bridge"><span>PUENTE</span></div>
            <div className="route route-main" />
            <div className={`route route-alt ${state.capacity > 60 ? "open" : "restricted"}`} />
            <div className="response-unit">🚑</div>
            <div className="response-unit unit-b">🚒</div>
            <div className="scene-alert-marker"><Route size={18} /> RUTA {state.capacity > 60 ? "OPERATIVA" : "RESTRINGIDA"}</div>
          </>
        )}

        {config.type === "communication" && (
          <>
            <div className="radio-tower"><Radio size={58} /><i /><i /><i /></div>
            <div className="signal-ring ring-a" />
            <div className="signal-ring ring-b" />
            <div className="message-card message-one">✓ Información verificada</div>
            <div className="message-card message-two">! Rumor en circulación</div>
            <div className="scene-alert-marker"><Radio size={18} /> SEÑAL {state.capacity > 60 ? "ESTABLE" : "INTERMITENTE"}</div>
          </>
        )}

        {config.type === "command" && (
          <>
            <div className="command-network"><Network size={92} /><span className="node node-a" /><span className="node node-b" /><span className="node node-c" /><span className="node node-d" /></div>
            <div className="command-card card-a">🏛️ Municipio</div>
            <div className="command-card card-b">🚑 Respuesta</div>
            <div className="command-card card-c">📡 Comunidad</div>
            <div className="command-card card-d">🏥 Servicios</div>
            <div className="scene-alert-marker"><Network size={18} /> COORDINACIÓN {state.capacity > 60 ? "ARTICULADA" : "FRAGMENTADA"}</div>
          </>
        )}
      </div>

      <div className="scene-progress"><span style={{ width: `${state.progress}%` }} /></div>
      <div className="scene-metrics">
        {config.metrics.map(([label, key, Icon]) => {
          const value = Math.round(barValue(key, state));
          return (
            <div className="scene-metric" key={label}>
              <div className="scene-metric-label"><span><Icon size={15} /> {label}</span><strong>{value}%</strong></div>
              <div className="metric-track"><span style={{ width: `${value}%` }} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
