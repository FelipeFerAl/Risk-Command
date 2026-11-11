export default function DecisionFeedback({ decision }) {
    if (!decision) return null;

    const effects = Object.entries(decision.effects || {});
    const labels = {
        threat: "Amenaza",
        exposure: "Exposición",
        vulnerability: "Vulnerabilidad",
        resources: "Recursos",
        response: "Respuesta",
        mobility: "Movilidad",
        publicPressure: "Presión pública",
    };

    return (
        <section className="scenario-feedback decision-feedback">
            <div className="feedback-header">
                <div>
                    <div className="eyebrow">DECISIÓN EJECUTADA</div>
                    <h3>{decision.decisionLabel}</h3>
                </div>
            </div>

            <div className="feedback-message">
                <p>{decision.consequence}</p>
            </div>

            {effects.length > 0 && (
                <div className="feedback-effects-grid">
                    {effects.map(([key, value]) => (
                        <div className={`feedback-effect ${value > 0 ? "positive" : value < 0 ? "negative" : "neutral"}`} key={key}>
                            <div className="feedback-effect-top">
                                <span>{labels[key] || key}</span>
                                <strong className="feedback-effect-delta">
                                    {value > 0 ? "+" : ""}{value}
                                </strong>
                            </div>
                            <div className="feedback-effect-values">
                                <span>{decision.stateBefore?.[key] ?? 0}%</span>
                                <strong>→</strong>
                                <span>{decision.stateAfter?.[key] ?? 0}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
