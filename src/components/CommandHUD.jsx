import {
    AlertTriangle,
    Users,
    ShieldCheck,
    Activity,
    Package,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "ESCENARIO INICIAL",
    EVACUATION: "EVACUACIÓN EN CURSO",
    ROAD_CLOSED: "VÍA CERRADA",
    STABILIZATION: "ESTABILIZACIÓN",
    MONITORING: "MONITOREO ACTIVO",
    RESPONSE: "RESPUESTA OPERATIVA",
    ALERT: "ALERTA MÁXIMA",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

function getThreatLevel(threat = 0) {
    if (threat >= 72) {
        return {
            label: "AMENAZA CRÍTICA",
            className: "critical",
        };
    }

    if (threat >= 55) {
        return {
            label: "AMENAZA ALTA",
            className: "high",
        };
    }

    if (threat >= 35) {
        return {
            label: "AMENAZA MODERADA",
            className: "moderate",
        };
    }

    return {
        label: "AMENAZA CONTROLADA",
        className: "stable",
    };
}

const metrics = [
    ["Amenaza", "threat", AlertTriangle],
    ["Exposición", "exposure", Users],
    ["Vulnerabilidad", "vulnerability", ShieldCheck],
    ["Respuesta", "response", Activity],
    ["Recursos", "resources", Package],
];

export default function CommandHUD({
    scenarioState = {},
    scenarioPhase = "INITIAL",
}) {
    const threatLevel = getThreatLevel(scenarioState.threat);

    return (
        <section className="command-hud">

            <div className="command-hud-header">

                <div className="command-identity">

                    <div className="command-code">
                        M-01
                    </div>

                    <div>
                        <div className="eyebrow">CENTRO DE COMANDO</div>

                        <h2>
                            Ladera Norte
                        </h2>

                        <p>
                            Movimiento en masa · operación territorial
                        </p>
                    </div>

                </div>

                <div className="command-status-group">

                    <div className={`command-threat ${threatLevel.className}`}>
                        <span className="command-status-dot" />
                        {threatLevel.label}
                    </div>

                    <div className="command-phase">
                        FASE · {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                    </div>

                </div>

            </div>

            <div className="command-metrics">

                {metrics.map(([label, key, Icon]) => {

                    const value = Math.max(
                        0,
                        Math.min(100, Math.round(scenarioState[key] ?? 0))
                    );

                    return (
                        <div className="command-metric" key={key}>

                            <div className="command-metric-top">

                                <span>
                                    <Icon size={14} />
                                    {label}
                                </span>

                                <strong>
                                    {value}%
                                </strong>

                            </div>

                            <div className="command-metric-track">
                                <span
                                    style={{
                                        width: `${value}%`,
                                    }}
                                />
                            </div>

                        </div>
                    );
                })}

            </div>

        </section>
    );
}