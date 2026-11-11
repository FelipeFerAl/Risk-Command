import {
    Mountain,
    Waves,
    Zap,
    Droplets,
    HeartPulse,
    Radio,
    Route,
    Users,
    ShieldCheck,
    Home,
    Ambulance,
    MapPinned,
    Siren,
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

function stateClass(active, extra = "") {
    return `${active ? "active" : ""} ${extra}`.trim();
}

export default function OperationalMapM05({ scenarioState = {}, scenarioPhase = "INITIAL" }) {
    const operations = scenarioState.operations || {};
    const infrastructure = scenarioState.infrastructure || {};
    const population = scenarioState.population || {};
    const exposed = Math.round(scenarioState.exposure || 0);
    const protectedPeople = Math.max(population.evacuated || 0, population.safe || 0);

    return (
        <section className="op-map op-map-m05">
            <header className="op-map-header">
                <div>
                    <div className="op-eyebrow">MAPA MULTIAMENAZA · M-05</div>
                    <h2>Corredor metropolitano · redes críticas</h2>
                    <p>La infraestructura está conectada: una falla puede desencadenar otra.</p>
                </div>
                <div className="op-phase"><span />{PHASE_LABELS[scenarioPhase] || scenarioPhase}</div>
            </header>

            <div className="op-map-canvas m05-map-canvas">
                <div className="m05-grid" />

                <div className={`m05-slope-zone ${stateClass(infrastructure.slope === "CONTROLLED")}`}>
                    <div className="m05-zone-label"><Mountain size={17} /> LADERA INESTABLE</div>
                    <div className="m05-contours"><i /><i /><i /><i /></div>
                    <span className="m05-zone-state">{infrastructure.slope === "CONTROLLED" ? "CONTROLADA" : "ACTIVA"}</span>
                </div>

                <div className={`m05-river-zone ${stateClass(infrastructure.river === "MONITORED")}`}>
                    <Waves size={18} />
                    <span>RÍO · {infrastructure.river === "MONITORED" ? "MONITOREADO" : "ASCENSO"}</span>
                </div>

                <div className={`m05-road main ${stateClass(operations.alternateRoute)}`}>
                    <Route size={15} /> CORREDOR PRINCIPAL
                </div>
                <div className={`m05-road alternate ${stateClass(operations.alternateRoute)}`}>
                    <Route size={14} /> RUTA DE CONTINGENCIA
                </div>

                <div className="m05-residential">
                    <div className="m05-residential-title">SECTOR RESIDENCIAL</div>
                    <div className="m05-houses">
                        {Array.from({ length: 16 }).map((_, i) => <div className="m05-house" key={i} />)}
                    </div>
                    <div className="m05-exposure-tag"><Users size={14} /> {exposed}% exposición</div>
                </div>

                <div className={`m05-critical substation ${stateClass(infrastructure.substation === "PROTECTED")}`}>
                    <Zap size={22} />
                    <div><strong>SUBESTACIÓN</strong><small>{infrastructure.substation === "PROTECTED" ? "Protegida" : "En riesgo"}</small></div>
                    {infrastructure.substation === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m05-critical water ${stateClass(infrastructure.waterPlant === "PROTECTED")}`}>
                    <Droplets size={22} />
                    <div><strong>PLANTA DE AGUA</strong><small>{infrastructure.waterPlant === "PROTECTED" ? "Protegida" : "En riesgo"}</small></div>
                    {infrastructure.waterPlant === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m05-critical hospital ${stateClass(infrastructure.hospital === "PROTECTED")}`}>
                    <HeartPulse size={22} />
                    <div><strong>HOSPITAL</strong><small>{infrastructure.hospital === "PROTECTED" ? "Continuidad garantizada" : "Operativo"}</small></div>
                    {infrastructure.hospital === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m05-comms ${stateClass(operations.communicationRedundancy)}`}>
                    <Radio size={17} />
                    <div><strong>RED DE RADIO</strong><small>{operations.communicationRedundancy ? "Canal redundante activo" : "Canal frágil"}</small></div>
                    {operations.communicationRedundancy && <span className="m05-signal"><i /><i /><i /></span>}
                </div>

                <div className={`m05-shelter ${stateClass(infrastructure.shelter === "OPERATIONAL")}`}>
                    <Home size={19} />
                    <div><strong>REFUGIO</strong><small>{infrastructure.shelter === "OPERATIONAL" ? "Recepción operativa" : "Preparado"}</small></div>
                </div>

                {operations.hazardControl && (
                    <div className="m05-control-zone"><Siren size={15} /> ZONA CRÍTICA BAJO CONTROL</div>
                )}

                {operations.alternateRoute && (
                    <div className="m05-route-status"><Route size={15} /> ACCESO DE CONTINGENCIA DISPONIBLE</div>
                )}

                {operations.evacuation && (
                    <div className="m05-evacuation-flow">
                        <Ambulance size={18} />
                        <strong>EVACUACIÓN ACTIVA</strong>
                        <span>{protectedPeople.toLocaleString("es-CO")} protegidas</span>
                    </div>
                )}

                <div className="m05-population">
                    <Users size={15} />
                    <strong>{protectedPeople.toLocaleString("es-CO")}</strong>
                    <span>personas protegidas</span>
                </div>

                <div className="m05-compass"><strong>N</strong><span /></div>
                <div className="m05-map-note"><MapPinned size={14} /> Corredores y redes se actualizan con cada decisión.</div>
            </div>

            <footer className="op-map-footer">
                <div><span>RIESGO</span><strong>{Math.round(scenarioState.threat || 0)}% amenaza · {exposed}% exposición</strong></div>
                <div><span>REDES CRÍTICAS</span><strong>{[
                    infrastructure.substation === "PROTECTED",
                    infrastructure.waterPlant === "PROTECTED",
                    infrastructure.hospital === "PROTECTED",
                ].filter(Boolean).length}/3 protegidas</strong></div>
                <div><span>POBLACIÓN</span><strong>{protectedPeople.toLocaleString("es-CO")} protegidas</strong></div>
            </footer>
        </section>
    );
}
