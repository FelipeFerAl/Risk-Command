import {
    Droplets,
    School,
    HeartPulse,
    Radio,
    Users,
    ShieldCheck,
    Truck,
    Route,
    Megaphone,
    Waves,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "CONDICIONES INICIALES",
    PLANNING: "PLANIFICACIÓN",
    PROTECTION: "PROTECCIÓN",
    EVACUATION: "EVACUACIÓN",
    RESPONSE: "RESPUESTA OPERATIVA",
    ALERT: "ALERTA MÁXIMA",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

function waterLevel(threat) {
    if (threat >= 75) return "high";
    if (threat >= 55) return "medium";
    return "low";
}

export default function OperationalMapM02({
    scenarioState = {},
    scenarioPhase = "INITIAL",
}) {
    const operations = scenarioState.operations || {};
    const infrastructure = scenarioState.infrastructure || {};
    const population = scenarioState.population || {};

    const threat = Math.round(scenarioState.threat || 0);
    const exposure = Math.round(scenarioState.exposure || 0);
    const level = waterLevel(threat);

    const roadClosed = infrastructure.road === "CLOSED";
    const schoolProtected =
        operations.schoolProtected || infrastructure.school === "PROTECTED";
    const healthProtected =
        operations.healthProtected || infrastructure.health === "PROTECTED";

    const waterWidth = Math.max(32, Math.min(92, 32 + threat * 0.62));

    return (
        <section className="op-map op-map-m02">
            <header className="op-map-header">
                <div>
                    <div className="op-eyebrow">MAPA OPERATIVO · M-02</div>
                    <h2>Cuenca Urbana · Sector de servicios críticos</h2>
                    <p>
                        La superficie inundable y los puntos de operación cambian con tus decisiones.
                    </p>
                </div>

                <div className="op-phase">
                    <span />
                    {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                </div>
            </header>

            <div className="op-map-canvas m02-map-canvas">
                <div className="m02-grid" />

                <div className={`m02-river ${level}`}>
                    <div className="m02-river-flow">
                        <Waves size={20} />
                        <Waves size={20} />
                        <Waves size={20} />
                    </div>
                    <span>QUEBRADA PRINCIPAL</span>
                </div>

                <div
                    className="m02-flood-zone"
                    style={{
                        width: `${waterWidth}%`,
                        opacity: Math.max(0.2, exposure / 100),
                    }}
                >
                    <Droplets size={15} />
                    ZONA INUNDABLE · {exposure}%
                </div>

                <div className="m02-road">
                    <div className={`m02-road-main ${roadClosed ? "closed" : ""}`}>
                        <Route size={15} />
                        CORREDOR PRINCIPAL
                    </div>
                    <div className="m02-road-alt">
                        RUTA ALTERNA
                    </div>
                </div>

                <div className="m02-neighborhood">
                    <div className="m02-neighborhood-label">SECTOR RESIDENCIAL</div>
                    <div className="m02-houses">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div className="m02-house" key={i}>
                                <span />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`m02-critical school ${schoolProtected ? "protected" : ""}`}>
                    <School size={20} />
                    <div>
                        <strong>ESCUELA</strong>
                        <small>420 estudiantes</small>
                    </div>
                    {schoolProtected && <ShieldCheck size={15} />}
                </div>

                <div className={`m02-critical health ${healthProtected ? "protected" : ""}`}>
                    <HeartPulse size={20} />
                    <div>
                        <strong>CENTRO DE SALUD</strong>
                        <small>Servicio continuo</small>
                    </div>
                    {healthProtected && <ShieldCheck size={15} />}
                </div>

                {operations.monitoring && (
                    <div className="m02-monitoring">
                        <Radio size={17} />
                        <div>
                            <strong>MONITOREO</strong>
                            <small>Nivel de agua actualizado</small>
                        </div>
                        <i />
                        <i />
                        <i />
                    </div>
                )}

                {operations.drainage && (
                    <div className="m02-drainage">
                        <span>🛠️</span>
                        <div>
                            <strong>DRENAJE ACTIVO</strong>
                            <small>Puntos críticos intervenidos</small>
                        </div>
                    </div>
                )}

                {operations.communityAlert && (
                    <div className="m02-alert">
                        <Megaphone size={16} />
                        ALERTA COMUNITARIA ACTIVA
                    </div>
                )}

                {operations.evacuation && (
                    <div className="m02-evacuation">
                        <Users size={18} />
                        <div>
                            <strong>{population.evacuated || 0} PERSONAS EVACUADAS</strong>
                            <small>Flujo hacia puntos seguros</small>
                        </div>
                        <div className="m02-evacuation-arrow">→→→</div>
                    </div>
                )}

                {operations.shelter && (
                    <div className="m02-shelter">
                        <ShieldCheck size={19} />
                        <div>
                            <strong>REFUGIO ACTIVO</strong>
                            <small>{population.safe || 0} personas protegidas</small>
                        </div>
                    </div>
                )}

                {operations.response && (
                    <div className="m02-response">
                        <Truck size={19} />
                        <strong>RESPUESTA</strong>
                    </div>
                )}

                <div className={`m02-threat ${level}`}>
                    <span />
                    NIVEL DE AGUA · {threat}%
                </div>

                <div className="m02-compass">
                    <strong>N</strong>
                    <span />
                </div>

                <div className="m02-scale">
                    <span />
                    500 m
                </div>
            </div>

            <footer className="op-map-footer">
                <div>
                    <span>AMENAZA</span>
                    <strong>Inundación urbana con evolución dinámica</strong>
                </div>
                <div>
                    <span>ELEMENTOS CRÍTICOS</span>
                    <strong>310 viviendas · escuela · centro de salud</strong>
                </div>
                <div>
                    <span>OPERACIÓN</span>
                    <strong>{PHASE_LABELS[scenarioPhase] || scenarioPhase}</strong>
                </div>
            </footer>
        </section>
    );
}
