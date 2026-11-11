import {
    Activity,
    AlertTriangle,
    Radio,
    ShieldCheck,
    Users,
    Clock3,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "DIAGNÓSTICO",
    ASSESSMENT: "CONTROL DEL CORREDOR",
    COORDINATION: "COORDINACIÓN",
    PROTECTION: "CONTINUIDAD",
    EVACUATION: "EVACUACIÓN",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

function metricTone(value, inverse = false) {
    if (inverse) {
        if (value <= 35) return "stable";
        if (value <= 65) return "moderate";
        return "critical";
    }
    if (value >= 75) return "stable";
    if (value >= 45) return "moderate";
    return "critical";
}

export default function CommandHUDM04({ scenarioState = {}, scenarioPhase = "INITIAL" }) {
    const population = scenarioState.population || {};
    const infrastructure = scenarioState.infrastructure || {};
    const operations = scenarioState.operations || {};

    const metrics = [
        ["Amenaza", "threat", AlertTriangle, true],
        ["Exposición", "exposure", Users, true],
        ["Vulnerabilidad", "vulnerability", ShieldCheck, true],
        ["Respuesta", "response", Activity, false],
    ];

    const protectedPopulation = Math.max(
        population.safe || 0,
        population.evacuated || 0
    );

    const operationStatus = [
        ["Ruta alterna", operations.alternateRoute],
        ["Radio", operations.radioNetwork],
        ["Salud", operations.healthContinuity],
        ["Refugio", operations.shelter],
    ];

    return (
        <section className="command-hud m04-hud">
            <div className="command-hud-header">
                <div className="command-identity">
                    <div className="command-code">M-04</div>
                    <div>
                        <div className="eyebrow">CENTRO DE COMANDO · AVANZADO</div>
                        <h2>Continuidad bajo presión</h2>
                        <p>Coordinar movilidad, servicios esenciales y evacuación bajo restricciones.</p>
                    </div>
                </div>

                <div className="command-status-group">
                    <div className="command-threat stable">
                        <span className="command-status-dot" />
                        OPERACIÓN ACTIVA
                    </div>
                    <div className="command-phase">
                        FASE · {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                    </div>
                </div>
            </div>

            <div className="m04-overview">
                <div className="m04-time-card">
                    <Clock3 size={17} />
                    <div>
                        <small>VENTANA OPERATIVA</small>
                        <strong>{scenarioState.time ?? 24} h</strong>
                    </div>
                </div>

                <div className="m04-population-card">
                    <Users size={17} />
                    <div>
                        <small>POBLACIÓN PROTEGIDA</small>
                        <strong>{protectedPopulation.toLocaleString("es-CO")}</strong>
                    </div>
                </div>

                <div className="m04-network-card">
                    <Radio size={17} />
                    <div>
                        <small>COMUNICACIÓN</small>
                        <strong>{operations.radioNetwork ? "RED ACTIVA" : "INTERMITENTE"}</strong>
                    </div>
                </div>

                <div className="m04-health-card">
                    <ShieldCheck size={17} />
                    <div>
                        <small>CENTRO DE SALUD</small>
                        <strong>{infrastructure.healthCenter === "PROTECTED" ? "PROTEGIDO" : "OPERATIVO"}</strong>
                    </div>
                </div>
            </div>

            <div className="command-metrics">
                {metrics.map(([label, key, Icon, inverse]) => {
                    const value = Math.max(0, Math.min(100, Math.round(scenarioState[key] ?? 0)));
                    const tone = metricTone(value, inverse);

                    return (
                        <div className={`command-metric m04-metric ${tone}`} key={key}>
                            <div className="command-metric-top">
                                <span><Icon size={14} />{label}</span>
                                <strong>{value}%</strong>
                            </div>
                            <div className="command-metric-track">
                                <span style={{ width: `${value}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="m04-readiness">
                <div className="m04-readiness-title">CAPACIDADES CRÍTICAS</div>
                <div className="m04-readiness-list">
                    {operationStatus.map(([label, active]) => (
                        <span className={active ? "active" : ""} key={label}>
                            <i /> {label}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
