export function evaluateScenario({ score, finalState, phase, decisionHistory }) {
    const exposure = finalState.exposure ?? 100;
    const threat = finalState.threat ?? 100;
    const protectedPopulation = Math.max(finalState.population?.evacuated || 0, finalState.population?.safe || 0);
    if (phase === "OUTCOME" && score >= 80) return { level: "EXCELLENT", title: "Operación controlada", description: "La estrategia logró reducir el riesgo y proteger a la población manteniendo una capacidad operativa razonable." };
    if (score >= 67 || (exposure < 35 && threat < 55 && protectedPopulation > 0)) return { level: "SUCCESS", title: "Operación aprobada", description: "La situación fue llevada a una condición de riesgo significativamente menor, aunque todavía quedan aspectos por mejorar." };
    if (decisionHistory.length >= 3 || phase === "OUTCOME") return { level: "PARTIAL", title: "Operación en revisión", description: "Se tomaron acciones relevantes, pero la estrategia dejó exposición o capacidad operativa sin resolver." };
    return { level: "FAILURE", title: "Operación no controlada", description: "La estrategia no consiguió llevar el escenario a una condición suficientemente segura." };
}
export function isScenarioComplete({ phase }) { return phase === "OUTCOME"; }
