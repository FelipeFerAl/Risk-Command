export default function MissionReward({ xp, bestScore }) {
    const hasScore = bestScore != null;

    let status = "SIN MARCA";

    if (hasScore && bestScore >= 100) {
        status = "MISIÓN PERFECTA";
    } else if (hasScore && bestScore >= 67) {
        status = "MISIÓN SUPERADA";
    } else if (hasScore) {
        status = "RESULTADO REGISTRADO";
    }

    return (
        <div className="mission-reward">
            <div className="mission-reward__header">
                RECOMPENSA DE MISIÓN
            </div>

            <div className="mission-reward__content">
                <div className="mission-reward__item">
                    <span className="mission-reward__icon">✦</span>

                    <div>
                        <span className="mission-reward__label">EXPERIENCIA</span>
                        <strong>+{xp} XP</strong>
                    </div>
                </div>

                <div className="mission-reward__item">
                    <span className="mission-reward__icon">🎯</span>

                    <div>
                        <span className="mission-reward__label">MEJOR MARCA</span>
                        <strong>
                            {hasScore ? `${bestScore}/100` : "—"}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="mission-reward__status">
                {status}
            </div>
        </div>
    );
}