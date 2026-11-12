import {
    Activity,
    Ambulance,
    Hospital,
    Radio,
    Route,
    ShieldCheck,
    Users,
    Waves,
    Warehouse,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "DIAGNÓSTICO",
    ASSESSMENT: "CONTROL DEL CORREDOR",
    COORDINATION: "COORDINACIÓN",
    PROTECTION: "CONTINUIDAD",
    EVACUATION: "EVACUACIÓN",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

export default function OperationalMapM04({
    scenarioState = {},
    scenarioPhase = "INITIAL",
}) {
    const operations = scenarioState.operations || {};
    const infrastructure = scenarioState.infrastructure || {};
    const population = scenarioState.population || {};

    const bridgeClosed =
        infrastructure.bridge === "CLOSED";

    const bridgeControlled =
        infrastructure.bridge === "CONTROLLED";

    const alternateActive =
        infrastructure.alternateRoute === "OPERATIONAL";

    const healthProtected =
        infrastructure.healthCenter === "PROTECTED";

    const shelterActive =
        infrastructure.shelter === "OPERATIONAL";

    const safe = Math.max(
        population.safe || 0,
        population.evacuated || 0
    );

    const exposed = Math.max(
        0,
        population.exposed ?? 950
    );

    const threat = Math.round(
        scenarioState.threat ?? 0
    );

    return (
        <section className="op-map op-map-m04">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="op-map-header">

                <div>
                    <div className="op-eyebrow">
                        MAPA OPERACIONAL · M-04
                    </div>

                    <h2>
                        Corredor regional · continuidad de servicios
                    </h2>

                    <p>
                        La infraestructura y las rutas cambian
                        según la secuencia de decisiones.
                    </p>
                </div>

                <div className="op-phase">
                    <span />
                    {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                </div>

            </header>


            {/* =====================================================
                MAPA
            ===================================================== */}

            <div className="op-map-canvas m04-map-canvas">

                <div className="m04-grid" />


                {/* ================= AMENAZA ================= */}

                <div className="m04-threat">

                    <span />

                    NIVEL DE AMENAZA · {threat}%

                </div>


                {/* ================= ZONA AFECTADA ================= */}

                <div className="m04-impact-zone">

                    <div className="m04-impact-pulse" />

                    <span>
                        ZONA DE AFECTACIÓN
                    </span>

                </div>


                {/* ================= COMUNIDADES ================= */}

                <div className="m04-community">

                    <div className="m04-location-title">

                        <Users size={14} />

                        SECTORES RURALES

                    </div>

                    <div className="m04-houses">

                        {Array.from({
                            length: 15
                        }).map((_, index) => (

                            <span
                                key={index}
                                className={
                                    safe > 0 &&
                                        index < 10
                                        ? "evacuated"
                                        : ""
                                }
                            />

                        ))}

                    </div>

                    <div className="m04-community-count">

                        <strong>
                            {exposed.toLocaleString("es-CO")}
                        </strong>

                        <span>
                            personas aún expuestas
                        </span>

                    </div>

                </div>


                {/* ================= SALUD ================= */}

                <div
                    className={`m04-critical m04-health ${healthProtected
                            ? "protected"
                            : ""
                        }`}
                >

                    <Hospital size={21} />

                    <div>

                        <strong>
                            CENTRO DE SALUD
                        </strong>

                        <small>
                            {healthProtected
                                ? "CONTINUIDAD PROTEGIDA"
                                : "SERVICIO ESENCIAL"}
                        </small>

                    </div>

                    {healthProtected && (
                        <ShieldCheck size={15} />
                    )}

                </div>


                {/* ================= REFUGIO ================= */}

                <div
                    className={`m04-critical m04-shelter ${shelterActive
                            ? "active"
                            : ""
                        }`}
                >

                    <Warehouse size={19} />

                    <div>

                        <strong>
                            REFUGIO
                        </strong>

                        <small>
                            {shelterActive
                                ? `${safe.toLocaleString("es-CO")} personas recibidas`
                                : "RECEPCIÓN PREPARADA"}
                        </small>

                    </div>

                    {shelterActive && (
                        <ShieldCheck size={15} />
                    )}

                </div>


                {/* ================= CORREDOR ================= */}

                <div
                    className={`m04-main-road ${bridgeClosed
                            ? "blocked"
                            : bridgeControlled
                                ? "controlled"
                                : ""
                        }`}
                >

                    <Route size={15} />

                    <span>
                        CORREDOR PRINCIPAL
                    </span>

                </div>


                {/* ================= PUENTE ================= */}

                <div
                    className={`m04-bridge ${bridgeClosed
                            ? "closed"
                            : bridgeControlled
                                ? "controlled"
                                : ""
                        }`}
                >

                    <Waves size={17} />

                    <div>

                        <strong>
                            PUENTE NORTE
                        </strong>

                        <small>
                            {bridgeClosed
                                ? "CERRADO · ACCESO CONTROLADO"
                                : bridgeControlled
                                    ? "TRÁNSITO CONTROLADO"
                                    : "ACCESO RESTRINGIDO"}
                        </small>

                    </div>

                    {bridgeClosed && (
                        <ShieldCheck size={15} />
                    )}

                </div>


                {/* ================= RUTA ALTERNA ================= */}

                <div
                    className={`m04-alt-route ${alternateActive
                            ? "active"
                            : ""
                        }`}
                >

                    <Route size={14} />

                    <div>

                        <strong>
                            RUTA ALTERNA
                        </strong>

                        <small>
                            {alternateActive
                                ? "OPERATIVA · CONTROLADA"
                                : "CAPACIDAD LIMITADA"}
                        </small>

                    </div>

                </div>


                {/* ================= RADIO ================= */}

                {operations.radioNetwork && (

                    <div className="m04-radio">

                        <Radio size={16} />

                        <div>

                            <strong>
                                RED DE RADIO
                            </strong>

                            <small>
                                COMUNICACIÓN REDUNDANTE ACTIVA
                            </small>

                        </div>

                        <i />
                        <i />
                        <i />

                    </div>

                )}


                {/* ================= TRANSPORTE ================= */}

                {operations.assistedTransport && (

                    <div className="m04-ambulance">

                        <Ambulance size={17} />

                        <div>

                            <strong>
                                TRANSPORTE ASISTIDO
                            </strong>

                            <small>
                                23 personas priorizadas
                            </small>

                        </div>

                    </div>

                )}


                {/* ================= RESPUESTA ================= */}

                {operations.response && (

                    <div className="m04-response">

                        <Activity size={15} />

                        EQUIPOS DE RESPUESTA DESPLEGADOS

                    </div>

                )}


                {/* ================= COORDINACIÓN ================= */}

                <div className="m04-admin">

                    <Radio size={14} />

                    CENTRO DE COORDINACIÓN

                </div>


                {/* ================= POBLACIÓN ================= */}

                <div className="m04-population-marker">

                    <Users size={14} />

                    <strong>
                        {safe.toLocaleString("es-CO")}
                    </strong>

                    <span>
                        protegidas
                    </span>

                </div>


                {/* ================= BRÚJULA ================= */}

                <div className="m04-compass">

                    <strong>
                        N
                    </strong>

                    <span />

                </div>


                {/* ================= ESCALA ================= */}

                <div className="m04-scale">

                    <span />

                    500 m

                </div>

            </div>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="op-map-footer">

                <div>

                    <span>
                        POBLACIÓN
                    </span>

                    <strong>
                        {safe.toLocaleString("es-CO")} protegidas
                    </strong>

                </div>

                <div>

                    <span>
                        RIESGO RESIDUAL
                    </span>

                    <strong>
                        {Math.round(
                            scenarioState.threat ?? 0
                        )}% amenaza ·{" "}
                        {Math.round(
                            scenarioState.exposure ?? 0
                        )}% exposición
                    </strong>

                </div>

                <div>

                    <span>
                        OPERACIÓN
                    </span>

                    <strong>
                        {PHASE_LABELS[scenarioPhase] ||
                            scenarioPhase}
                    </strong>

                </div>

            </footer>

        </section>
    );
}