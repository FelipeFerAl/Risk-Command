import {
    AlertTriangle,
    Users,
    ShieldCheck,
    Activity,
    Radio,
    Clock3,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "LECTURA INTEGRADA",
    ASSESSMENT: "DIAGNÓSTICO",
    STABILIZATION: "ESTABILIZACIÓN",
    COORDINATION: "COORDINACIÓN",
    PROTECTION: "PROTECCIÓN",
    EVACUATION: "EVACUACIÓN",
    CONSOLIDATION: "CONSOLIDACIÓN",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

function statusFor(value, lowerIsBetter = true) {
    if (lowerIsBetter) {
        if (value <= 30) return "stable";
        if (value <= 55) return "moderate";
        return "critical";
    }
    if (value >= 90) return "stable";
    if (value >= 65) return "moderate";
    return "critical";
}

export default function CommandHUDM05({ scenarioState = {}, scenarioPhase = "INITIAL" }) {
    const population = scenarioState.population || {};
    const infrastructure = scenarioState.infrastructure || {};
    const protectedPeople = Math.max(population.evacuated || 0, population.safe || 0);
    const exposed = Math.max(0, population.exposed || 0);
    const response = Math.round(scenarioState.response || 0);
    const threat = Math.round(scenarioState.threat || 0);
    const exposure = Math.round(scenarioState.exposure || 0);
    const vulnerability = Math.round(scenarioState.vulnerability || 0);

    const metrics = [
        ["Amenaza", threat, "threat", AlertTriangle],
        ["Exposición", exposure, "exposure", Users],
        ["Vulnerabilidad", vulnerability, "vulnerability", ShieldCheck],
        ["Respuesta", response, "response", Activity],
    ];

    const lifelineCount = [
        infrastructure.substation === "PROTECTED",
        infrastructure.waterPlant === "PROTECTED",
        infrastructure.hospital === "PROTECTED",
    ].filter(Boolean).length;

    return (
        <section className="command-hud m05-hud">
            <div className="command-hud-header">
                <div className="command-identity">
                    <div className="command-code">M-05</div>
                    <div>
                        <div className="eyebrow">CENTRO DE COMANDO · MULTIAMENAZA</div>
                        <h2>Crisis en cascada</h2>
                        <p>La prioridad es evitar que una falla desencadene otra.</p>
                    </div>
                </div>

                <div className="command-status-group">
                    <div className={`command-threat ${statusFor(threat)}`}>
                        <span className="command-status-dot" />
                        {threat <= 30 ? "RIESGO CONTROLADO" : threat <= 55 ? "RIESGO EN DESCENSO" : "RIESGO ELEVADO"}
                    </div>
                    <div className="command-phase">
                        FASE · {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                    </div>
                </div>
            </div>

            <div className="m05-situation-strip">
                <div className="m05-situation-item">
                    <span><Radio size={15} /> COMUNICACIONES</span>
                    <strong>{infrastructure.communications || "FRAGILE"}</strong>
                </div>
                <div className="m05-situation-item">
                    <span><ShieldCheck size={15} /> REDES CRÍTICAS</span>
                    <strong>{lifelineCount}/3 protegidas</strong>
                </div>
                <div className="m05-situation-item">
                    <span><Users size={15} /> POBLACIÓN</span>
                    <strong>{protectedPeople.toLocaleString("es-CO")} protegidas</strong>
                </div>
                <div className="m05-situation-item">
                    <span><Clock3 size={15} /> MARGEN OPERATIVO</span>
                    <strong>{Math.max(0, Math.round(scenarioState.time ?? 0))} h</strong>
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

            <div className="m05-population-line">
                <span>Protegidas</span>
                <strong>{protectedPeople.toLocaleString("es-CO")} / 1.000 objetivo</strong>
                <div className="m05-population-track">
                    <span style={{ width: `${Math.max(0, Math.min(100, (protectedPeople / 1000) * 100))}%` }} />
                </div>
                <span>{exposed.toLocaleString("es-CO")} aún expuestas</span>
            </div>
        </section>
    );
}
