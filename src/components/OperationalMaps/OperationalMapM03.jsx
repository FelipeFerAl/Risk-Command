import {
    Droplets,
    School,
    HeartPulse,
    Radio,
    Construction,
    Users,
    ShieldCheck,
    WalletCards,
    Route,
    Truck,
} from "lucide-react";

const PHASE_LABELS = {
    INITIAL: "DIAGNÓSTICO",
    PLANNING: "PRIORIZACIÓN",
    PORTFOLIO: "CARTERA DE INVERSIÓN",
    REVIEW: "REVISIÓN PRESUPUESTAL",
    OUTCOME: "CIERRE DE OPERACIÓN",
};

function money(value = 0) {
    return `$${Math.round(value).toLocaleString("es-CO")} M`;
}

export default function OperationalMapM03({
    scenarioState = {},
    scenarioPhase = "INITIAL",
}) {
    const operations = scenarioState.operations || {};
    const infrastructure = scenarioState.infrastructure || {};
    const population = scenarioState.population || {};
    const budget = scenarioState.budget || {};

    const threat = Math.round(scenarioState.threat || 0);
    const exposure = Math.round(scenarioState.exposure || 0);

    const floodWidth = Math.max(
        42,
        Math.min(48, 42 + threat * 0.10)
    );

    const schoolProtected =
        infrastructure.school === "PROTECTED";

    const healthProtected =
        infrastructure.health === "PROTECTED";

    const drainageUpgraded =
        infrastructure.drainage === "UPGRADED";

    return (
        <section className="op-map op-map-m03">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="op-map-header">
                <div>
                    <div className="op-eyebrow">
                        MAPA PRESUPUESTAL · M-03
                    </div>

                    <h2>
                        Municipio · cartera territorial de intervención
                    </h2>

                    <p>
                        Las inversiones modifican el territorio,
                        el riesgo residual y la capacidad financiera.
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

            <div className="op-map-canvas m03-map-canvas">

                <div className="m03-grid" />


                {/* ================= ZONA INUNDABLE ================= */}

                <div
                    className="m03-flood-zone"
                    style={{
                        width: `${floodWidth}%`,
                        opacity: Math.max(0.22, exposure / 100),
                    }}
                >
                    <Droplets size={18} />

                    <span>
                        CUENCA / ZONA INUNDABLE · {exposure}%
                    </span>
                </div>


                {/* ================= RÍO / CANAL ================= */}

                <div className="m03-water-channel">
                    <div className="m03-water-wave">≈</div>
                    <div className="m03-water-wave">≈</div>
                    <div className="m03-water-wave">≈</div>
                </div>


                {/* ================= RESIDENCIAL ================= */}

                <div className="m03-neighborhood">

                    <div className="m03-neighborhood-title">
                        SECTOR RESIDENCIAL
                    </div>

                    <div className="m03-houses">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                className="m03-house"
                                key={i}
                            >
                                <span />
                            </div>
                        ))}
                    </div>

                    {operations.relocation && (
                        <div className="m03-local-status">
                            <Users size={13} />
                            700 personas reubicadas
                        </div>
                    )}

                </div>


                {/* ================= INFRAESTRUCTURA CRÍTICA ================= */}

                <div className="m03-critical-zone">

                    <div
                        className={`m03-critical ${schoolProtected ? "protected" : ""
                            }`}
                    >
                        <School size={19} />

                        <div>
                            <strong>ESCUELA</strong>
                            <small>420 estudiantes</small>
                        </div>

                        {schoolProtected && (
                            <ShieldCheck size={14} />
                        )}
                    </div>


                    <div
                        className={`m03-critical ${healthProtected ? "protected" : ""
                            }`}
                    >
                        <HeartPulse size={19} />

                        <div>
                            <strong>CENTRO DE SALUD</strong>
                            <small>Servicio esencial</small>
                        </div>

                        {healthProtected && (
                            <ShieldCheck size={14} />
                        )}
                    </div>

                </div>


                {/* ================= DRENAJE ================= */}

                <div
                    className={`m03-drainage ${drainageUpgraded ? "active" : ""
                        }`}
                >
                    <Construction size={17} />

                    <div>
                        <strong>
                            {drainageUpgraded
                                ? "DRENAJE AMPLIADO"
                                : "DRENAJE"}
                        </strong>

                        <small>
                            {drainageUpgraded
                                ? "Capacidad mejorada"
                                : "Capacidad insuficiente"}
                        </small>
                    </div>
                </div>


                {/* ================= ALERTA TEMPRANA ================= */}

                {operations.earlyWarning && (
                    <div className="m03-operation-slot m03-warning">
                        <Radio size={15} />

                        <div>
                            <strong>ALERTA TEMPRANA</strong>
                            <small>
                                Monitoreo y comunicación activa
                            </small>
                        </div>

                        <div className="m03-signal">
                            <i />
                            <i />
                            <i />
                        </div>
                    </div>
                )}


                {/* ================= VÍAS ================= */}

                <div className="m03-road main">
                    <Route size={14} />
                    CORREDOR PRINCIPAL
                </div>

                <div className="m03-road alt">
                    RUTA ALTERNA
                </div>


                {/* ================= PRESUPUESTO ================= */}

                <div className="m03-budget-marker">

                    <WalletCards size={16} />

                    <div>
                        <small>
                            INVERSIÓN COMPROMETIDA
                        </small>

                        <strong>
                            {money(budget.committed || 0)}
                        </strong>
                    </div>

                </div>


                {/* ================= RESPUESTA ================= */}

                {operations.response && (
                    <div className="m03-response">

                        <Truck size={16} />

                        <div>
                            <strong>
                                CAPACIDAD DE RESPUESTA
                            </strong>

                            <small>
                                Recursos disponibles
                            </small>
                        </div>

                    </div>
                )}


                {/* ================= RESERVA ================= */}

                {operations.emergencyReserve && (
                    <div className="m03-reserve">

                        <ShieldCheck size={15} />

                        <span>
                            RESERVA OPERATIVA
                        </span>

                    </div>
                )}

                {/* ================= POBLACIÓN ================= */}

                <div className="m03-population">

                    <Users size={14} />

                    <strong>
                        {population.safe || 0}
                    </strong>

                    <span>
                        personas protegidas
                    </span>

                </div>


                {/* ================= NIVEL DE AMENAZA ================= */}

                <div className="m03-threat">

                    <span />

                    NIVEL DE AMENAZA · {threat}%

                </div>


                {/* ================= BRÚJULA ================= */}

                <div className="m03-compass">

                    <strong>N</strong>
                    <span />

                </div>


                {/* ================= ESCALA ================= */}

                <div className="m03-scale">

                    <span />
                    500 m

                </div>

            </div>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="op-map-footer">

                <div>
                    <span>PRESUPUESTO</span>

                    <strong>
                        {money(
                            budget.remaining ??
                            budget.total ??
                            1200
                        )} disponibles
                    </strong>
                </div>


                <div>
                    <span>RIESGO RESIDUAL</span>

                    <strong>
                        {threat}% amenaza · {exposure}% exposición
                    </strong>
                </div>


                <div>
                    <span>OPERACIÓN</span>

                    <strong>
                        {PHASE_LABELS[scenarioPhase] ||
                            scenarioPhase}
                    </strong>
                </div>

            </footer>

        </section>
    );
}