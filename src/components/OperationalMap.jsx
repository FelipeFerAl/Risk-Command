import {
    Radio,
    Truck,
    Users,
    TriangleAlert,
    ShieldCheck,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "CONDICIONES INICIALES",
    EVACUATION: "EVACUACIÓN",
    ROAD_CLOSED: "VÍA CERRADA",
    STABILIZATION: "ESTABILIZACIÓN",
    MONITORING: "MONITOREO",
    RESPONSE: "RESPUESTA OPERATIVA",
    ALERT: "ALERTA MÁXIMA",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

export default function OperationalMap({
    scenarioState = {},
    scenarioPhase = "INITIAL",
}) {
    const operations = scenarioState.operations || {};
    const infrastructure = scenarioState.infrastructure || {};
    const roadClosed = infrastructure.road === "CLOSED";
    const monitoringActive = Boolean(operations.monitoring);
    const evacuationActive = Boolean(operations.evacuation);
    const responseActive = Boolean(operations.response);
    const safeZoneActive = Boolean(operations.safeZone);
    const stabilizationActive = Boolean(operations.stabilization);
    const communityAlertActive = Boolean(operations.communityAlert);

    const threat = Math.round(scenarioState.threat || 0);
    const exposure = Math.round(scenarioState.exposure || 0);
    const population = scenarioState.population || {};

    const critical = threat >= 72;

    return (
        <section className="op-map">

            {/* CABECERA */}

            <header className="op-map-header">

                <div>
                    <div className="op-eyebrow">
                        MAPA OPERATIVO
                    </div>

                    <h2>
                        Ladera Norte · Sector residencial
                    </h2>

                    <p>
                        Representación territorial del escenario de riesgo.
                    </p>
                </div>

                <div className="op-phase">
                    <span />
                    {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                </div>

            </header>

            {/* MAPA */}

            <div className="op-map-canvas">

                {/* CUADRÍCULA */}

                <div className="op-grid" />

                {/* CURVAS DE NIVEL */}

                <svg
                    className="op-contours"
                    viewBox="0 0 1200 520"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path d="M0 345 C170 285 280 340 430 270 C560 210 680 285 810 230 C940 175 1060 225 1200 165" />
                    <path d="M0 390 C170 330 285 385 440 315 C570 255 690 330 825 275 C950 220 1080 270 1200 210" />
                    <path d="M0 435 C170 375 300 430 455 360 C590 300 705 375 840 320 C965 265 1090 315 1200 255" />
                </svg>

                {/* LLUVIA */}

                <div className="op-rain op-rain-a">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                </div>

                <div className="op-rain op-rain-b">
                    <i />
                    <i />
                    <i />
                </div>

                {/* LADERA */}

                <div className="op-slope">

                    <div className="op-slope-body" />

                    <div
                        className={`op-hazard ${critical ? "critical" : ""
                            }`}
                    >
                        <div className="op-hazard-pulse" />

                        <TriangleAlert size={19} />

                        <strong>
                            ZONA INESTABLE
                        </strong>

                        <small>
                            Ladera activa
                        </small>
                    </div>

                </div>

                {/* SENSOR DE MONITOREO */}

                {monitoringActive && (
                    <div className="op-monitoring">

                        <div className="op-marker-line" />

                        <div className="op-unit-icon">
                            <Radio size={18} />
                        </div>

                        <strong>
                            MONITOREO
                        </strong>

                        <small>
                            Sensor de ladera activo
                        </small>

                        <div className="op-signal signal-one" />
                        <div className="op-signal signal-two" />
                        <div className="op-signal signal-three" />

                    </div>
                )}

                {stabilizationActive && (
                    <div className="op-stabilization">

                        <div className="op-stabilization-icon">
                            🧱
                        </div>

                        <strong>
                            ESTABILIZACIÓN
                        </strong>

                        <small>
                            Equipo técnico desplegado
                        </small>

                    </div>
                )}

                {/* SECTOR RESIDENCIAL */}

                <div className="op-residential">

                    <div className="op-zone-label">
                        SECTOR RESIDENCIAL
                    </div>

                    <div className="op-houses">

                        <div className="op-house">
                            <span />
                        </div>

                        <div className="op-house">
                            <span />
                        </div>

                        <div className="op-house">
                            <span />
                        </div>

                    </div>

                </div>

                {/* ÁREA DE EXPOSICIÓN */}

                <div
                    className="op-exposure"
                    style={{
                        width: `${Math.max(110, 140 + exposure * 2.1)}px`,
                        height: `${Math.max(70, 70 + exposure * 0.8)}px`,
                        opacity: Math.max(0.25, exposure / 100),
                    }}
                >
                    ÁREA DE EXPOSICIÓN · {exposure}%
                </div>

                {/* CARRETERA */}

                <div
                    className={`op-road ${roadClosed ? "closed" : ""
                        }`}
                >

                    <span>
                        CORREDOR PRINCIPAL
                    </span>

                </div>

                {/* CIERRE DE VÍA */}

                {roadClosed && (
                    <div className="op-road-closure">

                        <div className="op-barrier">
                            <i />
                            <i />
                            <i />
                        </div>

                        <strong>
                            VÍA CERRADA
                        </strong>

                    </div>
                )}

                {/* EVACUACIÓN */}

                {evacuationActive && (
                    <div className="op-evacuation">

                        <div className="op-evacuation-source">
                            <Users size={18} />
                            <small>{population.evacuated || 0} evacuadas</small>
                        </div>

                        <div className="op-evacuation-line">
                            ─────────→
                        </div>

                        <div className="op-evacuation-destination">
                            <ShieldCheck size={15} />
                            DESTINO
                        </div>

                    </div>
                )}

                {safeZoneActive && (
                    <div className="op-safe-zone-active">

                        <div className="op-safe-zone-icon">
                            <ShieldCheck size={18} />
                        </div>

                        <div>
                            <strong>
                                ZONA SEGURA
                            </strong>

                            <small>
                                {population.safe || 0} personas protegidas
                            </small>
                        </div>

                    </div>
                )}

                {communityAlertActive && (
                    <div className="op-community-alert">
                        <strong>ALERTA COMUNITARIA</strong>
                        <small>Rutas y puntos de encuentro activos</small>
                    </div>
                )}

                {/* BASE DE RESPUESTA */}

                <div className="op-response-base">

                    <div className="op-base-label">
                        BASE OPERATIVA
                    </div>

                    <div className="op-base-area">

                        <div className="op-base-building">
                            <span />
                            <span />
                            <span />
                        </div>

                        {responseActive && (
                            <div className="op-response-unit">

                                <Truck size={19} />

                                <strong>
                                    RESPUESTA
                                </strong>

                            </div>
                        )}

                    </div>

                </div>

                {/* INDICADOR DE AMENAZA */}

                <div
                    className={`op-threat ${critical ? "critical" : ""
                        }`}
                >
                    <span />
                    AMENAZA {threat}%
                </div>

                {/* BRÚJULA */}

                <div className="op-compass">
                    <strong>N</strong>
                    <span />
                </div>

                {/* ESCALA */}

                <div className="op-scale">
                    <span />
                    500 m
                </div>

            </div>

            {/* LEYENDA */}

            <footer className="op-map-footer">

                <div>
                    <span>TERRENO</span>
                    <strong>
                        Ladera con inestabilidad elevada
                    </strong>
                </div>

                <div>
                    <span>EXPOSICIÓN</span>
                    <strong>
                        Sector residencial + corredor vial
                    </strong>
                </div>

                <div>
                    <span>OPERACIÓN</span>
                    <strong>
                        {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                    </strong>
                </div>

            </footer>

        </section>
    );
}