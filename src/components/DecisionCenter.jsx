import { ChevronRight, ShieldAlert } from "lucide-react";

export default function DecisionCenter({
    decisions = [],
    onDecision,
    disabled = false,
}) {
    return (
        <section className="decision-center">

            <div className="decision-center-header">

                <div>
                    <div className="eyebrow">CENTRO DE DECISIONES</div>
                    <h3>¿Qué acción tomará el comandante?</h3>
                    <p>
                        Selecciona una intervención. La situación cambiará según la
                        decisión tomada.
                    </p>
                </div>

                <div className="decision-command-icon">
                    <ShieldAlert size={22} />
                </div>

            </div>

            <div className="decision-options">

                {decisions.map((decision) => (
                    <button
                        type="button"
                        key={decision.id}
                        className="decision-option"
                        onClick={() => onDecision(decision)}
                        disabled={disabled}
                    >

                        <div className="decision-option-icon">
                            {decision.icon || "⚡"}
                        </div>

                        <div className="decision-option-content">

                            <strong>{decision.label}</strong>

                            <span>{decision.description}</span>

                        </div>

                        <ChevronRight
                            className="decision-option-arrow"
                            size={22}
                        />

                    </button>
                ))}

                {decisions.length === 0 && (
                    <div className="decision-empty">
                        No hay decisiones disponibles para esta fase.
                    </div>
                )}

            </div>

        </section>
    );
}