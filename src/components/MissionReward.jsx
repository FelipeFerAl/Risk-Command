export default function MissionReward({
    maxXP,
    bestScore,
    lastXp,
    totalXp = 0,
    attempts = 0,
    improvedLast = false
}) {
    const hasScore = bestScore != null;
    const hasPlayed = attempts > 0 || lastXp != null;

    let status = "SIN MARCA";

    if (hasPlayed && improvedLast) {
        status = "NUEVO MEJOR PUNTAJE";
    } else if (hasScore && bestScore >= 100) {
        status = "MISIÓN PERFECTA";
    } else if (hasScore && bestScore >= 67) {
        status = "MISIÓN SUPERADA";
    } else if (hasScore) {
        status = "MEJOR PUNTAJE CONSERVADO";
    }

    return (
        <div className="mission-reward">
            <div className="mission-reward__header">
                RECOMPENSA DE MISIÓN
            </div>

            <div className="mission-reward__main">
                <div className="mission-reward__base">
                    <span className="mission-reward__icon">⚡</span>

                    <div>
                        <span className="mission-reward__label">
                            EXPERIENCIA DADA
                        </span>

                        <strong>+{maxXP} XP</strong>
                    </div>
                </div>

                <div className="mission-reward__score">
                    <span className="mission-reward__label">
                        MEJOR PUNTAJE
                    </span>

                    <strong>
                        {hasScore ? bestScore : "—"}
                        {hasScore && <small>/100</small>}
                    </strong>
                </div>
            </div>

            {hasPlayed ? (
                <div className="mission-reward__history">
                    <div>
                        <span>ÚLTIMA PARTIDA</span>
                        <strong>+{lastXp || 0} XP</strong>
                    </div>

                    <div>
                        <span>ACUMULADA</span>
                        <strong>{totalXp} XP</strong>
                    </div>

                    <div>
                        <span>INTENTOS</span>
                        <strong>{attempts}</strong>
                    </div>
                </div>
            ) : (
                <div className="mission-reward__pending">
                    AÚN NO JUGADA
                </div>
            )}

            {hasScore && (
                <div
                    className={`mission-reward__status ${improvedLast ? "is-improved" : ""
                        }`}
                >
                    {status}
                </div>
            )}
        </div>
    );
}
