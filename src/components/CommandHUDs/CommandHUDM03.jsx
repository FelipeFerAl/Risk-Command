import {
    AlertTriangle,
    WalletCards,
    ShieldCheck,
    Activity,
    Users,
    PiggyBank,
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

function getBudgetStatus(remainingPct) {
    if (remainingPct < 20) return { label: "RESERVA CRÍTICA", className: "critical" };
    if (remainingPct <= 35) return { label: "RESERVA ÓPTIMA", className: "stable" };
    if (remainingPct <= 50) return { label: "SUBINVERSIÓN", className: "moderate" };
    return { label: "BAJA EJECUCIÓN", className: "high" };
}

export default function CommandHUDM03({ scenarioState = {}, scenarioPhase = "INITIAL" }) {
    const budget = scenarioState.budget || {};
    const total = budget.total || 1200;
    const remaining = budget.remaining ?? total;
    const committed = budget.committed ?? Math.max(0, total - remaining);
    const remainingPct = Math.round((remaining / total) * 100);
    const status = getBudgetStatus(remainingPct);

    const metrics = [
        ["Riesgo", "threat", AlertTriangle],
        ["Vulnerabilidad", "vulnerability", ShieldCheck],
        ["Respuesta", "response", Activity],
        ["Población expuesta", "exposure", Users],
    ];

    return (
        <section className="command-hud m03-hud">
            <div className="command-hud-header">
                <div className="command-identity">
                    <div className="command-code">M-03</div>
                    <div>
                        <div className="eyebrow">CENTRO DE COMANDO</div>
                        <h2>Presupuesto bajo presión</h2>
                        <p>Gestión financiera para la reducción del riesgo</p>
                    </div>
                </div>

                <div className="command-status-group">
                    <div className={`command-threat ${status.className}`}>
                        <span className="command-status-dot" />
                        {status.label}
                    </div>
                    <div className="command-phase">
                        FASE · {PHASE_LABELS[scenarioPhase] || scenarioPhase}
                    </div>
                </div>
            </div>

            <div className="m03-budget-panel">
                <div className="m03-budget-main">
                    <div className="m03-budget-label">
                        <WalletCards size={15} /> PRESUPUESTO MUNICIPAL
                    </div>
                    <strong>{money(remaining)}</strong>
                    <span>disponibles de {money(total)}</span>
                </div>

                <div className="m03-budget-bar">
                    <div className="m03-budget-track">
                        <span style={{ width: `${Math.max(0, Math.min(100, (committed / total) * 100))}%` }} />
                    </div>
                    <div className="m03-budget-legend">
                        <span>Comprometido <b>{money(committed)}</b></span>
                        <span>Saldo <b>{remainingPct}%</b></span>
                    </div>
                </div>

                <div className="m03-reserve-card">
                    <PiggyBank size={18} />
                    <div>
                        <small>RESERVA FINANCIERA</small>
                        <strong>{remainingPct}%</strong>
                    </div>
                </div>
            </div>

            <div className="command-metrics">
                {metrics.map(([label, key, Icon]) => {
                    const value = Math.max(0, Math.min(100, Math.round(scenarioState[key] ?? 0)));
                    return (
                        <div className="command-metric" key={key}>
                            <div className="command-metric-top">
                                <span><Icon size={14} />{label}</span>
                                <strong>{value}%</strong>
                            </div>
                            <div className="command-metric-track">
                                <span style={{ width: `${value}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
