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

function stateClass(active, extra = "") {
    return `${active ? "active" : ""} ${extra}`.trim();
}

export default function OperationalMapM06({ scenarioState = {}, scenarioPhase = "INITIAL" }) {
    const operations = scenarioState.operations || {};
    const infrastructure = scenarioState.infrastructureState || {};
    const population = scenarioState.population || {};
    const protectedPeople = Math.max(Number(population.evacuated || 0), Number(population.safe || 0));
    const exposed = Math.round(scenarioState.exposure || 0);

    return (
        <section className="op-map op-map-m06">
            <header className="op-map-header">
                <div>
                    <div className="op-eyebrow">MAPA TERRITORIAL · M-06</div>
                    <h2>Punto de quiebre · sistemas interdependientes</h2>
                    <p>Una decisión estratégica puede proteger una red y comprometer otra.</p>
                </div>
                <div className="op-phase"><span />{PHASE_LABELS[scenarioPhase] || scenarioPhase}</div>
            </header>

            <div className="op-map-canvas m06-map-canvas">
                <div className="m06-grid" />

                <div className={`m06-slope ${stateClass(infrastructure.slope === "CONTROLLED")}`}>
                    <div className="m06-zone-label"><Mountain size={17} /> LADERA</div>
                    <div className="m06-contours"><i /><i /><i /><i /></div>
                    <span>{infrastructure.slope === "CONTROLLED" ? "CONTROLADA" : "INESTABLE"}</span>
                </div>

                <div className={`m06-river ${stateClass(infrastructure.river === "MONITORED")}`}>
                    <Waves size={18} /> RÍO · {infrastructure.river === "MONITORED" ? "MONITOREADO" : "NIVEL ALTO"}
                </div>

                <div className={`m06-road main ${stateClass(infrastructure.corridor === "SECURED" || infrastructure.corridor === "RECOVERING")}`}>
                    <Route size={15} /> CORREDOR PRINCIPAL
                </div>
                <div className={`m06-road alternate ${stateClass(operations.alternateRoute)}`}>
                    <Route size={14} /> RUTA DE CONTINGENCIA
                </div>

                <div className="m06-sector sector-a">
                    <div className="m06-sector-title">SECTOR A</div>
                    <div className="m06-houses">{Array.from({ length: 9 }).map((_, i) => <div className="m06-house" key={i} />)}</div>
                    <span>400 personas</span>
                </div>

                <div className="m06-sector sector-b">
                    <div className="m06-sector-title">SECTOR B</div>
                    <div className="m06-houses">{Array.from({ length: 9 }).map((_, i) => <div className="m06-house" key={i} />)}</div>
                    <span>500 personas</span>
                </div>

                <div className="m06-sector sector-c">
                    <div className="m06-sector-title">SECTOR C</div>
                    <div className="m06-houses">{Array.from({ length: 7 }).map((_, i) => <div className="m06-house" key={i} />)}</div>
                    <span>350 personas</span>
                </div>

                <div className={`m06-critical power ${stateClass(infrastructure.power === "PROTECTED")}`}>
                    <Zap size={21} />
                    <div><strong>SUBESTACIÓN</strong><small>{infrastructure.power === "PROTECTED" ? "Protegida" : "Vulnerable"}</small></div>
                    {infrastructure.power === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m06-critical water ${stateClass(infrastructure.water === "PROTECTED")}`}>
                    <Droplets size={21} />
                    <div><strong>PLANTA DE AGUA</strong><small>{infrastructure.water === "PROTECTED" ? "Protegida" : "Vulnerable"}</small></div>
                    {infrastructure.water === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m06-critical hospital ${stateClass(infrastructure.hospital === "PROTECTED")}`}>
                    <HeartPulse size={21} />
                    <div><strong>HOSPITAL</strong><small>{infrastructure.hospital === "PROTECTED" ? "Continuidad garantizada" : "Operativo"}</small></div>
                    {infrastructure.hospital === "PROTECTED" && <ShieldCheck size={15} />}
                </div>

                <div className={`m06-comms ${stateClass(operations.communicationsProtected)}`}>
                    <Radio size={17} />
                    <div><strong>COMUNICACIONES</strong><small>{operations.communicationsProtected ? "Canal redundante" : "Saturadas"}</small></div>
                    {operations.communicationsProtected && <span className="m06-signal"><i /><i /><i /></span>}
                </div>

                <div className={`m06-shelter ${stateClass(infrastructure.shelter === "OPERATIONAL")}`}>
                    <Home size={18} />
                    <div><strong>REFUGIO</strong><small>{infrastructure.shelter === "OPERATIONAL" ? "Recepción operativa" : "Capacidad limitada"}</small></div>
                </div>

                {operations.assessment && (
                    <div className="m06-assessment"><MapPinned size={14} /> DIAGNÓSTICO INTEGRADO ACTIVO</div>
                )}

                {operations.alternateRoute && (
                    <div className="m06-route-status"><Route size={14} /> CORREDOR DE CONTINGENCIA DISPONIBLE</div>
                )}

                {operations.contingencyResponse && (
                    <div className="m06-contingency"><Siren size={15} /> SEGUNDA CONTINGENCIA ABSORBIDA</div>
                )}

                {operations.evacuation && (
                    <div className="m06-evacuation-flow">
                        <Ambulance size={18} />
                        <strong>EVACUACIÓN ACTIVA</strong>
                        <span>{protectedPeople.toLocaleString("es-CO")} protegidas</span>
                    </div>
                )}

                <div className={`m06-population ${protectedPeople > 0 ? "active" : ""}`}>
                    <Users size={15} />
                    <strong>{protectedPeople.toLocaleString("es-CO")}</strong>
                    <span>personas protegidas</span>
                </div>

                <div className="m06-chain-note">
                    <strong>CADENA CRÍTICA</strong>
                    <span>Energía → Agua → Salud → Movilidad</span>
                </div>

                <div className="m06-compass"><strong>N</strong><span /></div>
                <div className="m06-map-note"><MapPinned size={14} /> El estado de las redes cambia con cada decisión.</div>
            </div>

            <footer className="op-map-footer">
                <div><span>RIESGO</span><strong>{Math.round(scenarioState.threat || 0)}% amenaza · {exposed}% exposición</strong></div>
                <div><span>REDES</span><strong>{[
                    infrastructure.power === "PROTECTED",
                    infrastructure.water === "PROTECTED",
                    infrastructure.hospital === "PROTECTED",
                ].filter(Boolean).length}/3 protegidas</strong></div>
                <div><span>POBLACIÓN</span><strong>{protectedPeople.toLocaleString("es-CO")} protegidas</strong></div>
            </footer>
        </section>
    );
}
