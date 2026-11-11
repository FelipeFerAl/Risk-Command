const clamp = (value) => Math.max(0, Math.min(100, value));
function clone(value) { return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value)); }
function applyNumericEffects(state, effects = {}) {
    const next = { ...state };
    for (const [key, delta] of Object.entries(effects)) {
        if (typeof delta !== "number") continue;
        next[key] = clamp((Number(next[key]) || 0) + delta);
    }
    return next;
}
function applyNestedChanges(state, changes = {}) {
    const next = clone(state);
    for (const [section, values] of Object.entries(changes)) {
        if (!values || typeof values !== "object") continue;
        if (!next[section] || typeof next[section] !== "object") next[section] = {};
        for (const [key, value] of Object.entries(values)) next[section][key] = value;
    }
    return next;
}
export function createInitialScenarioState(scenario) { return clone(scenario.initialState); }
export function getAvailableDecisions(scenario, phase, state) {
    return (scenario?.decisions?.[phase] || []).filter((decision) => {
        const hasBudget =
            typeof decision.budgetCost !== "number" ||
            !state?.budget ||
            Number(state.budget.remaining ?? 0) >= decision.budgetCost;

        const customAvailability =
            typeof decision.isAvailable === "function"
                ? decision.isAvailable(state)
                : true;

        return hasBudget && customAvailability;
    });
}
export function applyDecision(state, decision) {
    if (!decision) return { state: clone(state), phase: null, decision: null, changes: {} };
    const stateBefore = clone(state);
    let nextState = applyNumericEffects(state, decision.effects);
    nextState = applyNestedChanges(nextState, decision.stateChanges);

    // Presupuesto opcional: mantiene M01/M02 intactas y permite que
    // escenarios financieros como M03 trabajen con costos explícitos.
    if (typeof decision.budgetCost === "number" && nextState.budget) {
        const total = Number(nextState.budget.total) || 0;
        const previousRemaining = Number(nextState.budget.remaining ?? total) || 0;
        const cost = Math.max(0, decision.budgetCost);
        const remaining = Math.max(0, previousRemaining - cost);
        const committed = Math.min(
            total,
            Math.max(0, (Number(nextState.budget.committed) || 0) + cost)
        );

        nextState.budget = {
            ...nextState.budget,
            committed,
            remaining,
            lastCost: cost,
        };

        // resources sigue siendo el indicador normalizado que consume
        // scoringEngine para los escenarios actuales.
        if (total > 0) {
            nextState.resources = clamp((remaining / total) * 100);
        }
    }
    if (decision.controls) {
        const operations = {}, infrastructure = {};
        if ("monitoringActive" in decision.controls) operations.monitoring = decision.controls.monitoringActive;
        if ("evacuationActive" in decision.controls) operations.evacuation = decision.controls.evacuationActive;
        if ("responseActive" in decision.controls) operations.response = decision.controls.responseActive;
        if ("safeZoneActive" in decision.controls) operations.safeZone = decision.controls.safeZoneActive;
        if ("stabilizationActive" in decision.controls) operations.stabilization = decision.controls.stabilizationActive;
        if ("roadClosed" in decision.controls) infrastructure.road = decision.controls.roadClosed ? "CLOSED" : "OPEN";
        nextState = applyNestedChanges(nextState, { operations, infrastructure });
    }
    return {
        state: nextState,
        phase: decision.nextPhase || null,
        decision,
        stateBefore,
        stateAfter: clone(nextState),
        changes: { effects: decision.effects || {}, stateChanges: decision.stateChanges || {} },
    };
}
export function buildDecisionRecord({ result, phaseBefore }) {
    return {
        decisionId: result.decision.id,
        decisionLabel: result.decision.label,
        timestamp: Date.now(),
        phaseBefore,
        phaseAfter: result.phase || phaseBefore,
        stateBefore: result.stateBefore,
        stateAfter: result.stateAfter,
        effects: result.decision.effects || {},
        stateChanges: result.decision.stateChanges || {},
        consequence: result.decision.consequence || "",
    };
}
