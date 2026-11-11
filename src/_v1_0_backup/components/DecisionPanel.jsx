function DecisionPanel({ decisions = [], onDecision, disabled = false }) {
    return (
        <section className="decision-panel">
            <div className="decision-panel-header">
                <div>
                    <span className="decision-kicker">CENTRO DE DECISIÓN</span>
                    <h3>¿Qué acción tomará el comandante?</h3>
                </div>

                <span className="decision-status">
                    {disabled ? "DECISIÓN EJECUTADA" : "DECISIÓN PENDIENTE"}
                </span>
            </div>

            <div className="decision-options">
                {decisions.map((decision) => (
                    <button
                        key={decision.id}
                        type="button"
                        className="decision-option"
                        disabled={disabled}
                        onClick={() => onDecision(decision)}
                    >
                        <div className="decision-option-icon">
                            {decision.icon || "⚠️"}
                        </div>

                        <div className="decision-option-content">
                            <strong>{decision.label}</strong>

                            {decision.description && (
                                <span>{decision.description}</span>
                            )}
                        </div>

                        <div className="decision-option-arrow">
                            →
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default DecisionPanel;