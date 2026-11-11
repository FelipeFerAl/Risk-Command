import {
    CheckCircle2,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Minus,
    ChevronRight,
} from "lucide-react";

const EFFECT_LABELS = {
    threat: "Amenaza",
    exposure: "Exposición",
    vulnerability: "Vulnerabilidad",
    resources: "Recursos",
    response: "Respuesta",
    mobility: "Movilidad",
    publicPressure: "Presión pública",
    time: "Tiempo",
};

const EFFECT_ORDER = [
    "threat",
    "exposure",
    "vulnerability",
    "resources",
    "response",
    "mobility",
    "publicPressure",
    "time",
];

function formatValue(key, value) {
    if (key === "time") return `${value} h`;
    return `${value}%`;
}

function EffectIcon({ delta }) {
    if (delta > 0) {
        return <ArrowUp size={14} />;
    }

    if (delta < 0) {
        return <ArrowDown size={14} />;
    }

    return <Minus size={14} />;
}

export default function ScenarioFeedback({
    decision,
    previousState,
    nextState,
    onContinue,
}) {
    if (!decision) return null;

    const effects = decision.effects || {};

    const visibleEffects = EFFECT_ORDER
        .filter((key) => effects[key] !== undefined && effects[key] !== 0)
        .map((key) => ({
            key,
            label: EFFECT_LABELS[key] || key,
            delta: effects[key],
            before: previousState?.[key] ?? 0,
            after: nextState?.[key] ?? 0,
        }));

    return (
        <section className="scenario-feedback">

            <div className="feedback-header">

                <div className="feedback-success">
                    <CheckCircle2 size={20} />
                </div>

                <div>
                    <div className="eyebrow">DECISIÓN EJECUTADA</div>
                    <h3>{decision.label}</h3>
                </div>

            </div>

            <div className="feedback-message">
                <AlertTriangle size={18} />
                <p>
                    {decision.consequence ||
                        "La operación ha generado cambios en las condiciones del escenario."}
                </p>
            </div>

            {visibleEffects.length > 0 && (
                <div className="feedback-effects">

                    <div className="feedback-effects-title">
                        CAMBIOS EN EL ESCENARIO
                    </div>

                    <div className="feedback-effects-grid">

                        {visibleEffects.map((effect) => {
                            const positive = effect.delta > 0;
                            const negative = effect.delta < 0;

                            return (
                                <div
                                    className={`feedback-effect ${positive
                                            ? "positive"
                                            : negative
                                                ? "negative"
                                                : "neutral"
                                        }`}
                                    key={effect.key}
                                >
                                    <div className="feedback-effect-top">
                                        <span>{effect.label}</span>

                                        <span className="feedback-effect-delta">
                                            <EffectIcon delta={effect.delta} />
                                            {effect.delta > 0 ? "+" : ""}
                                            {formatValue(effect.key, effect.delta)}
                                        </span>
                                    </div>

                                    <div className="feedback-effect-values">
                                        <strong>{formatValue(effect.key, effect.before)}</strong>

                                        <span>→</span>

                                        <strong>{formatValue(effect.key, effect.after)}</strong>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                </div>
            )}

            <div className="feedback-footer">

                <div>
                    <span>PRÓXIMA FASE</span>
                    <strong>{decision.nextPhase || "OPERACIÓN"}</strong>
                </div>

                <button
                    type="button"
                    className="feedback-continue"
                    onClick={onContinue}
                >
                    CONTINUAR OPERACIÓN
                    <ChevronRight size={18} />
                </button>

            </div>

        </section>
    );
}