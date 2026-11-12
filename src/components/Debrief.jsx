import ScorePanel from "./ScorePanel";

export default function Debrief({ result, onContinue, onRanking }) {
    if (!result) return null;

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="brand">
                    PLAN <span>& PREVENT</span>
                    <small>v1.3 • Debrief</small>
                </div>
                <button className="ghost" onClick={onContinue}>← Misiones</button>
            </header>

            <main className="result-screen">
                <section className="result-card card">
                    <div className="eyebrow">DEBRIEF DE OPERACIÓN</div>
                    <h1>{result.outcome.title}</h1>
                    <div className="score">
                        {result.score}<small>/100</small>
                    </div>
                    <p>{result.outcome.description}</p>

                    <ScorePanel score={result.breakdown} />

                    <div className="earned">+{result.earned} XP</div>

                    <div className="debrief">
                        <h3>Lectura de la operación</h3>
                        <p>
                            Tomaste {result.decisionCount} decisión{result.decisionCount === 1 ? "" : "es"}.
                            La evaluación considera tanto el estado final como la trayectoria del riesgo durante la operación.
                        </p>
                    </div>

                    <div className="result-actions">
                        <button className="primary" onClick={onContinue}>CONTINUAR</button>
                        <button className="ghost" onClick={onRanking}>VER CLASIFICACIÓN</button>
                    </div>
                </section>
            </main>
        </div>
    );
}
