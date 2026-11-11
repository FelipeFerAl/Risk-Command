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
    MapPinned,
    Landmark,
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

export default function OperationalMapM03({ scenarioState = {}, scenarioPhase = "INITIAL" }) {
    const operations = scenarioState.operations || {};
    const infrastructure = scenarioState.infrastructure || {};
    const population = scenarioState.population || {};
    const budget = scenarioState.budget || {};

    const threat = Math.round(scenarioState.threat || 0);
    const exposure = Math.round(scenarioState.exposure || 0);
    const waterWidth = Math.max(42,Math.min(62, 42 + threat * 0.20));
    const committedPct = budget.total ? (budget.committed / budget.total) * 100 : 0;

    return (
        <section className="op-map op-map-m03">
            <header className="op-map-header">
                <div>
                    <div className="op-eyebrow">MAPA PRESUPUESTAL · M-03</div>
                    <h2>Municipio · cartera territorial de intervención</h2>
                    <p>Las inversiones modifican el territorio, el riesgo residual y la capacidad financiera.</p>
                </div>
                <div className="op-phase"><span />{PHASE_LABELS[scenarioPhase] || scenarioPhase}</div>
            </header>

            <div className="op-map-canvas m03-map-canvas">
                <div className="m03-grid" />

                <div className="m03-river" style={{ width: `${waterWidth}%` }}>
                    <Droplets size={18} />
                    <span>CUENCA / ZONA INUNDABLE · {threat}%</span>
                </div>

                <div className="m03-road main"><Route size={15} /> CORREDOR PRINCIPAL</div>
                <div className="m03-road alt">RUTA ALTERNA</div>

                <div className="m03-neighborhood">
                    <div className="m03-neighborhood-title">SECTOR RESIDENCIAL</div>
                    <div className="m03-houses">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div className="m03-house" key={i}><span /></div>
                        ))}
                    </div>
                    {operations.relocation && (
                        <div className="m03-relocation"><Users size={15} /> 700 personas reubicadas</div>
                    )}
                </div>

                <div className={`m03-critical school ${infrastructure.school === "PROTECTED" ? "protected" : ""}`}>
                    <School size={21} />
                    <div><strong>ESCUELA</strong><small>420 estudiantes</small></div>
                    {infrastructure.school === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m03-critical health ${infrastructure.health === "PROTECTED" ? "protected" : ""}`}>
                    <HeartPulse size={21} />
                    <div><strong>CENTRO DE SALUD</strong><small>Servicio esencial</small></div>
                    {infrastructure.health === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m03-drainage ${operations.drainage ? "active" : ""}`}>
                    <Construction size={18} />
                    <div><strong>DRENAJE</strong><small>{infrastructure.drainage === "UPGRADED" ? "Capacidad ampliada" : "Capacidad insuficiente"}</small></div>
                </div>

                {operations.earlyWarning && (
                    <div className="m03-warning">
                        <Radio size={17} />
                        <div><strong>ALERTA TEMPRANA</strong><small>Monitoreo + comunicación activa</small></div>
                        <i /><i /><i />
                    </div>
                )}

                {operations.emergencyReserve && (
                    <div className="m03-response">
                        <ShieldCheck size={17} /> RESERVA OPERATIVA ACTIVADA
                    </div>
                )}

                {operations.response && (
                    <div className="m03-response-units">
                        🚑 🚒 <span>CAPACIDAD DE RESPUESTA</span>
                    </div>
                )}

                <div className="m03-budget-marker">
                    <WalletCards size={16} />
                    <div><small>INVERSIÓN COMPROMETIDA</small><strong>{money(budget.committed || 0)}</strong></div>
                </div>

                <div className="m03-exposure">
                    <MapPinned size={16} /> EXPOSICIÓN TERRITORIAL · {exposure}%
                </div>

                <div className="m03-population">
                    <Users size={15} />
                    <strong>{population.safe || 0}</strong>
                    <span>personas protegidas</span>
                </div>

                <div className="m03-landmark"><Landmark size={16} /> ADMINISTRACIÓN MUNICIPAL</div>

                <div className="m03-compass"><strong>N</strong><span /></div>
            </div>

            <footer className="op-map-footer">
                <div><span>PRESUPUESTO</span><strong>{money(budget.remaining ?? budget.total ?? 1200)} disponibles</strong></div>
                <div><span>RIESGO RESIDUAL</span><strong>{threat}% amenaza · {exposure}% exposición</strong></div>
                <div><span>OPERACIÓN</span><strong>{PHASE_LABELS[scenarioPhase] || scenarioPhase}</strong></div>
            </footer>
        </section>
    );
}
