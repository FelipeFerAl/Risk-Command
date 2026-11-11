const clamp = (value) => Math.max(0, Math.min(100, value));

function average(values) {
    return values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : 0;
}

/*
 * Puntaje para variables donde MENOR es mejor.
 *
 * initial = condición inicial
 * final   = condición alcanzada
 * target  = valor considerado excelente
 *
 * Si final <= target → 100
 * Si final >= initial → 0
 * Entre ambos → interpolación lineal
 */
function lowerIsBetter(initial, final, target) {
    if (final <= target) return 100;
    if (final >= initial) return 0;

    const denominator = initial - target;

    if (denominator <= 0) return 100;

    return clamp(
        ((initial - final) / denominator) * 100
    );
}

/*
 * Puntaje para variables donde MAYOR es mejor.
 */
function higherIsBetter(final, target) {
    if (final >= target) return 100;
    if (final <= 0) return 0;

    return clamp((final / target) * 100);
}

/*
 * Calcula deterioro durante la toma de decisiones.
 *
 * A diferencia del puntaje final, aquí nos interesa saber
 * si en algún momento la situación empeoró respecto al inicio.
 */
function calculateDeterioration(initialState, decisionHistory) {
    const peakRisk = decisionHistory.reduce(
        (peak, record) => ({
            threat: Math.max(
                peak.threat,
                record.stateAfter?.threat ?? peak.threat
            ),

            exposure: Math.max(
                peak.exposure,
                record.stateAfter?.exposure ?? peak.exposure
            ),

            vulnerability: Math.max(
                peak.vulnerability,
                record.stateAfter?.vulnerability ?? peak.vulnerability
            ),
        }),
        {
            threat: initialState.threat,
            exposure: initialState.exposure,
            vulnerability: initialState.vulnerability,
        }
    );

    const deterioration = average([
        Math.max(
            0,
            peakRisk.threat - initialState.threat
        ),

        Math.max(
            0,
            peakRisk.exposure - initialState.exposure
        ),

        Math.max(
            0,
            peakRisk.vulnerability - initialState.vulnerability
        ),
    ]);

    return {
        peakRisk,
        deterioration: Math.round(deterioration),
    };
}

/*
 * Calcula el desempeño global de la misión.
 *
 * scenario.scoring permite que cada escenario tenga
 * sus propios objetivos y pesos.
 */
export function calculateScore({
    initialState,
    finalState,
    decisionHistory = [],
    scenario = {},
}) {
    /*
     * Objetivos específicos del escenario.
     *
     * Estos valores pueden declararse dentro de M01.js.
     */
    const targets = scenario.scoring?.targets || {
        threat: 35,
        exposure: 30,
        vulnerability: 25,
        resources: 25,
        response: 85,
        protectedPopulation: 120,
    };

    const weights = scenario.scoring?.weights || {
        riskReduction: 0.35,
        populationProtection: 0.25,
        resourceManagement: 0.10,
        responseCapacity: 0.20,
        efficiency: 0.10,
    };

    /*
     * -------------------------------------------------
     * 1. REDUCCIÓN DEL RIESGO
     * -------------------------------------------------
     */

    const threatScore = lowerIsBetter(
        initialState.threat,
        finalState.threat,
        targets.threat
    );

    const exposureScore = lowerIsBetter(
        initialState.exposure,
        finalState.exposure,
        targets.exposure
    );

    const vulnerabilityScore = lowerIsBetter(
        initialState.vulnerability,
        finalState.vulnerability,
        targets.vulnerability
    );

    const riskScore = Math.round(
        threatScore * 0.35 +
        exposureScore * 0.40 +
        vulnerabilityScore * 0.25
    );

    /*
     * -------------------------------------------------
     * 2. PROTECCIÓN DE LA POBLACIÓN
     * -------------------------------------------------
     */

    const initialExposed =
        initialState.population?.exposed || 0;

    const evacuated =
        finalState.population?.evacuated || 0;

    const safe =
        finalState.population?.safe || 0;

    const protectedPopulation = Math.min(
        initialExposed,
        Math.max(evacuated, safe)
    );

    const populationScore = Math.round(
        higherIsBetter(
            protectedPopulation,
            targets.protectedPopulation
        )
    );

    /*
     * -------------------------------------------------
     * 3. GESTIÓN DE RECURSOS
     * -------------------------------------------------
     *
     * Aquí NO premiamos simplemente gastar menos.
     *
     * Una operación de riesgo necesita utilizar recursos.
     * Lo importante es conservar una reserva operativa.
     */

    const resourcesRemaining =
        Math.max(0, finalState.resources || 0);

    const resourceScore = Math.round(
        higherIsBetter(
            resourcesRemaining,
            targets.resources
        )
    );

    /*
     * -------------------------------------------------
     * 4. CAPACIDAD DE RESPUESTA
     * -------------------------------------------------
     */

    const responseScore = Math.round(
        higherIsBetter(
            finalState.response || 0,
            targets.response
        )
    );

    /*
     * -------------------------------------------------
     * 5. EFICIENCIA OPERATIVA
     * -------------------------------------------------
     *
     * Tres decisiones o menos → máxima eficiencia.
     *
     * A partir de ahí empiezan las penalizaciones.
     */

    const decisionCount = decisionHistory.length;

    const { peakRisk, deterioration } =
        calculateDeterioration(
            initialState,
            decisionHistory
        );

    let efficiencyScore = 100;

    if (decisionCount > 3) {
        efficiencyScore -=
            (decisionCount - 3) * 10;
    }

    /*
     * Penalización moderada si la situación empeoró
     * durante la operación.
     */
    efficiencyScore -= deterioration * 1.5;

    efficiencyScore = Math.round(
        clamp(efficiencyScore)
    );

    /*
     * -------------------------------------------------
     * 6. PUNTAJE FINAL
     * -------------------------------------------------
     */

    const total = Math.round(
        riskScore * weights.riskReduction +
        populationScore * weights.populationProtection +
        resourceScore * weights.resourceManagement +
        responseScore * weights.responseCapacity +
        efficiencyScore * weights.efficiency
    );

    return {
        total: clamp(total),

        categories: {
            riskReduction: riskScore,
            populationProtection: populationScore,
            resourceManagement: resourceScore,
            responseCapacity: responseScore,
            efficiency: efficiencyScore,
        },

        details: {
            threat: Math.round(threatScore),
            exposure: Math.round(exposureScore),
            vulnerability: Math.round(vulnerabilityScore),
            protectedPopulation,
            resourcesRemaining,
            response: responseScore,
            decisionCount,
        },

        trajectory: {
            peakRisk,
            deterioration,
        },
    };
}

/*
 * XP objetivo de una misión.
 *
 * El XP máximo se alcanza únicamente al obtener 100/100.
 */
export function calculateTargetMissionXP({
    maxXP = 0,
    score = 0,
}) {
    return Math.round(
        maxXP * clamp(score) / 100
    );
}

/*
 * XP incremental respecto al mejor resultado anterior.
 *
 * Ejemplo con maxXP = 220:
 *
 * 60 → 132 XP
 * 75 → +33 XP
 * 75 → +0 XP
 * 90 → +33 XP
 * 100 → +22 XP
 *
 * Total máximo = 220 XP.
 */
export function calculateMissionXP({
    maxXP = 0,
    score = 0,
    previousBestScore = 0,
}) {
    const previousTargetXP =
        calculateTargetMissionXP({
            maxXP,
            score: previousBestScore,
        });

    const currentTargetXP =
        calculateTargetMissionXP({
            maxXP,
            score,
        });

    const earned = Math.max(
        0,
        currentTargetXP - previousTargetXP
    );

    return {
        earned,
        missionXP: currentTargetXP,
        maxXP,
        improved: score > previousBestScore,
    };
}