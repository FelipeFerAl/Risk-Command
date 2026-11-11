import {
    AlertTriangle,
    Users,
    ShieldCheck,
    Activity,
    Radio,
    Clock3,
    Zap,
    Droplets,
    Route,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "LECTURA TERRITORIAL",
    ASSESSMENT: "DIAGNÓSTICO",
    INFRASTRUCTURE: "PROTECCIÓN DE REDES",
    CONTINUITY: "CONTINUIDAD",
    EVACUATION: "EVACUACIÓN",
    RESERVE: "RESERVA OPERATIVA",
    SECOND_CONTINGENCY: "SEGUNDA CONTINGENCIA",
    RECOVERY: "RECUPERACIÓN",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

function statusFor(value, lowerIsBetter = true) {
    if (lowerIsBetter) {
        if (value <= 25) return "stable";
        if (value <= 55) return "moderate";
        return "critical";
    }
    if (value >= 90) return "stable";
    if (value >= 65) return "moderate";
    return "critical";
}

export default function CommandHUDM06({ scenarioState = {}, scenarioPhase = "INITIAL" }) {
    const population = scenarioState.population || {};
    const infrastructure = scenarioState.infrastructureState || {};
    const operations = scenarioState.operations || {};

    const protectedPeople = Math.max(
        Number(population.evacuated || 0),
        Number(population.safe || 0)
    );

    const criticalNetworks = [
        infrastructure.power === "PROTECTED",
        infrastructure.water === "PROTECTED",
        infrastructure.hospital === "PROTECTED",
    ].filter(Boolean).length;

    const metrics = [
        ["AMENAZA", Math.round(scenarioState.threat ?? 0), "threat", AlertTriangle],
        ["EXPOSICIÓN", Math.round(scenarioState.exposure ?? 0), "exposure", Users],
        ["VULNERABILIDAD", Math.round(scenarioState.vulnerability ?? 0), "vulnerability", ShieldCheck],
        ["RESPUESTA", Math.round(scenarioState.response ?? 0), "response", Activity],
    ];

    return (
        <section className="command-hud command-hud-m06">
            <div className="command-header">
                <div className="command-identity">
                    <div className="command-code">M-06</div>
                    <div>
                        <div className="eyebrow">CENTRO DE COMANDO · NIVEL EXPERTO</div>
                        <h2>Punto de quiebre</h2>
                        <p>Dirige la respuesta antes de que una falla desencadene otra.</p>
                    </div>
                </div>

                <div className="command-status-group">
                    <div className={`command-threat ${statusFor(scenarioState.threat ?? 0)}`}>
                        <span className="command-status-dot" />
                        {(scenarioState.threat ?? 0) <= 25
                            ? "RIESGO CONTROLADO"
                            : (scenarioState.threat ?? 0) <= 55
                                ? "RIESGO EN DESCENSO"
                                : "RIESGO CRÍTICO"}
                    </div>
                    <div className="command-phase">
                        FASE · {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                    </div>
                </div>
            </div>

            <div className="m06-situation-strip">
                <div className="m06-situation-item">
                    <span><Radio size={15} /> COMUNICACIONES</span>
                    <strong>{infrastructure.communications || "SATURADAS"}</strong>
                </div>
                <div className="m06-situation-item">
                    <span><ShieldCheck size={15} /> REDES CRÍTICAS</span>
                    <strong>{criticalNetworks}/3 protegidas</strong>
                </div>
                <div className="m06-situation-item">
                    <span><Users size={15} /> POBLACIÓN</span>
                    <strong>{protectedPeople.toLocaleString("es-CO")} protegidas</strong>
                </div>
                <div className="m06-situation-item">
                    <span><Clock3 size={15} /> MARGEN</span>
                    <strong>{Math.max(0, Math.round(scenarioState.time ?? 0))} h</strong>
                </div>
            </div>

            <div className="m06-network-strip">
                <div className={operations.powerProtected ? "is-active" : ""}>
                    <Zap size={14} /> Energía
                </div>
                <div className={operations.waterProtected ? "is-active" : ""}>
                    <Droplets size={14} /> Agua
                </div>
                <div className={operations.hospitalContinuity ? "is-active" : ""}>
                    <Activity size={14} /> Salud
                </div>
                <div className={operations.alternateRoute ? "is-active" : ""}>
                    <Route size={14} /> Movilidad
                </div>
                <div className={operations.reserve ? "is-active reserve" : ""}>
                    <ShieldCheck size={14} /> Reserva
                </div>
            </div>

            <div className="command-metrics">
                {metrics.map(([label, value, key, Icon]) => (
                    <div className="command-metric" key={key}>
                        <div className="command-metric-top">
                            <span><Icon size={14} />{label}</span>
                            <strong>{value}%</strong>
                        </div>
                        <div className="command-metric-track">
                            <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="m06-population-line">
                <span>Protegidas</span>
                <strong>{protectedPeople.toLocaleString("es-CO")} / 1.000 objetivo</strong>
                <div className="m06-population-track">
                    <span style={{ width: `${Math.max(0, Math.min(100, (protectedPeople / 1000) * 100))}%` }} />
                </div>
                <span>{Math.max(0, Number(population.exposed || 0)).toLocaleString("es-CO")} aún expuestas</span>
            </div>
        </section>
    );
}
