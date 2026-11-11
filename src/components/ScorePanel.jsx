const labels = {
    riskReduction: "Reducción del riesgo",
    populationProtection: "Protección de población",
    resourceManagement: "Gestión de recursos",
    responseCapacity: "Capacidad de respuesta",
    efficiency: "Eficiencia operacional",
};

export default function ScorePanel({ score }) {
    if (!score) return null;

    return (
        <div className="score-panel">
            {Object.entries(score.categories).map(([key, value]) => (
                <div className="score-panel__row" key={key}>
                    <div className="score-panel__label">
                        <span>{labels[key] || key}</span>
                        <strong>{value}</strong>
                    </div>
                    <div className="score-panel__track">
                        <span style={{ width: `${value}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
