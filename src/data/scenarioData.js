// ============================================================
// RISK COMMAND
// Motor de simulación de escenarios
// ============================================================

export const scenarioData = {
    "M-01": {
        title: "Movimiento en masa",
        location: "Cordillera Andina, Colombia",

        initialState: {
            threat: 78,
            exposure: 72,
            vulnerability: 65,
            resources: 60,
            response: 35,
            time: 18,
            mobility: 80,
            publicPressure: 25,
        },

        initialSituation: {
            phase: "INITIAL",

            title: "Alerta en la ladera",

            description:
                "Las lluvias acumuladas han aumentado la inestabilidad de una ladera ubicada sobre una zona residencial y una vía estratégica.",

            alerts: [
                "Se detectaron nuevas grietas en la parte superior de la ladera.",
                "34 viviendas se encuentran dentro del área potencialmente afectada.",
                "La carretera continúa operativa y concentra tráfico local.",
            ],

            objective:
                "Reducir el riesgo para la población sin comprometer innecesariamente la movilidad y los recursos disponibles.",
        },

        decisions: {
            INITIAL: [
                {
                    id: "evacuate",
                    icon: "🚨",
                    label: "Evacuar viviendas expuestas",
                    description:
                        "Reducir inmediatamente la población ubicada en la zona de posible afectación.",

                    effects: {
                        exposure: -34,
                        vulnerability: -21,
                        resources: -12,
                        response: +18,
                        mobility: -10,
                        publicPressure: +5,
                    },

                    nextPhase: "EVACUATION",

                    consequence:
                        "La evacuación disminuye considerablemente la exposición, pero consume recursos y genera presión social por la interrupción de actividades.",
                },

                {
                    id: "closeRoad",
                    icon: "🚧",
                    label: "Cerrar preventivamente la vía",
                    description:
                        "Interrumpir el tránsito para reducir la exposición y facilitar las operaciones de emergencia.",

                    effects: {
                        exposure: -18,
                        vulnerability: -5,
                        resources: -8,
                        response: +12,
                        mobility: -35,
                        publicPressure: +8,
                    },

                    nextPhase: "ROAD_CLOSED",

                    consequence:
                        "El cierre reduce la exposición en la zona crítica y facilita la respuesta, pero afecta significativamente la movilidad.",
                },

                {
                    id: "stabilize",
                    icon: "⛰️",
                    label: "Destinar recursos a estabilización",
                    description:
                        "Priorizar acciones de reducción para disminuir la amenaza sobre la ladera.",

                    effects: {
                        threat: -25,
                        vulnerability: -8,
                        resources: -25,
                        response: +8,
                        mobility: 0,
                        publicPressure: -3,
                    },

                    controls: {
                        stabilizationActive: true,
                    },

                    nextPhase: "STABILIZATION",

                    consequence:
                        "La intervención disminuye la amenaza, pero consume una parte importante de los recursos disponibles.",
                },

                {
                    id: "monitor",
                    icon: "👁️",
                    label: "Mantener operación y monitorear",
                    description:
                        "Continuar las actividades mientras se intensifica el monitoreo de la ladera.",

                    effects: {
                        threat: +8,
                        exposure: +5,
                        vulnerability: +3,
                        resources: +5,
                        response: -5,
                        mobility: +10,
                        publicPressure: -4,
                    },

                    controls: {
                        monitoringActive: true,
                    },

                    nextPhase: "MONITORING",

                    consequence:
                        "La operación continúa con normalidad, pero la amenaza aumenta y la población permanece expuesta.",
                },
            ],

            EVACUATION: [
                {
                    id: "closeAfterEvacuation",
                    icon: "🚧",
                    label: "Cerrar la vía después de evacuar",
                    description:
                        "Concentrar los recursos restantes en asegurar completamente el sector.",

                    effects: {
                        exposure: -10,
                        vulnerability: -5,
                        resources: -10,
                        response: +15,
                        mobility: -30,
                        publicPressure: +4,
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La zona queda mucho más controlada y los equipos de respuesta pueden operar con menor exposición.",
                },

                {
                    id: "continueMonitoring",
                    icon: "📡",
                    label: "Mantener monitoreo intensivo",
                    description:
                        "Conservar la vía abierta mientras se vigila la evolución de la ladera.",

                    effects: {
                        threat: +5,
                        exposure: +5,
                        vulnerability: 0,
                        resources: +3,
                        response: +5,
                        mobility: +5,
                        publicPressure: -2,
                    },

                    controls: {
                        monitoringActive: true,
                    },

                    nextPhase: "MONITORING",

                    consequence:
                        "La población evacuada permanece protegida, pero la amenaza continúa evolucionando.",
                },
            ],

            ROAD_CLOSED: [
                {
                    id: "deployTeams",
                    icon: "🚑",
                    label: "Desplegar equipos de emergencia",
                    description:
                        "Utilizar los recursos disponibles para preparar una respuesta especializada.",

                    effects: {
                        threat: -5,
                        exposure: -8,
                        vulnerability: -12,
                        resources: -18,
                        response: +25,
                        mobility: 0,
                        publicPressure: +2,
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La capacidad de respuesta aumenta y el sector queda mejor preparado ante una posible falla de la ladera.",
                },

                {
                    id: "reopenRoad",
                    icon: "🛣️",
                    label: "Reabrir parcialmente la vía",
                    description:
                        "Permitir tránsito controlado para reducir el impacto sobre la movilidad.",

                    effects: {
                        exposure: +15,
                        vulnerability: +5,
                        resources: +3,
                        response: -8,
                        mobility: +25,
                        publicPressure: -8,
                    },

                    controls: {
                        roadClosed: false,
                    },

                    nextPhase: "MONITORING",

                    consequence:
                        "La movilidad mejora, pero parte de la población vuelve a quedar expuesta al peligro.",
                },
            ],

            STABILIZATION: [
                {
                    id: "evacuateAfterStabilization",
                    icon: "🚨",
                    label: "Evacuar preventivamente",
                    description:
                        "Complementar la estabilización física con reducción de exposición.",

                    effects: {
                        exposure: -25,
                        vulnerability: -18,
                        resources: -12,
                        response: +15,
                        mobility: -8,
                        publicPressure: +4,
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La amenaza ha disminuido gracias a la intervención y la evacuación reduce aún más las posibles consecuencias.",
                },

                {
                    id: "keepOperations",
                    icon: "🏠",
                    label: "Mantener las viviendas ocupadas",
                    description:
                        "Confiar en la estabilización mientras continúa la operación normal.",

                    effects: {
                        threat: 0,
                        exposure: +5,
                        vulnerability: +5,
                        resources: +5,
                        response: -3,
                        mobility: +8,
                        publicPressure: -5,
                    },

                    nextPhase: "MONITORING",

                    consequence:
                        "La intervención física reduce la amenaza, pero mantener a la población en el área conserva una exposición significativa.",
                },
            ],

            MONITORING: [
                {
                    id: "activateEvacuation",
                    icon: "🚨",
                    label: "Activar evacuación inmediata",
                    description:
                        "Responder al aumento de la amenaza reduciendo rápidamente la exposición.",

                    effects: {
                        exposure: -30,
                        vulnerability: -20,
                        resources: -15,
                        response: +20,
                        mobility: -15,
                        publicPressure: +8,
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La evacuación reduce el número de personas expuestas y permite concentrar la respuesta en el área crítica.",
                },

                {
                    id: "keepMonitoring",
                    icon: "📡",
                    label: "Continuar monitoreando",
                    description:
                        "Esperar nueva información antes de comprometer más recursos.",

                    effects: {
                        threat: +10,
                        exposure: +8,
                        vulnerability: +5,
                        resources: +5,
                        response: -8,
                        mobility: +5,
                        publicPressure: -2,
                    },

                    controls: {
                        monitoringActive: true,
                    },

                    nextPhase: "ALERT",

                    consequence:
                        "El tiempo ganado permite conservar recursos, pero el riesgo continúa aumentando.",
                },
            ],

            RESPONSE: [
                {
                    id: "consolidate",
                    icon: "🛡️",
                    label: "Consolidar zona segura",
                    description:
                        "Establecer un perímetro y preparar el sector para recuperación.",

                    effects: {
                        threat: -8,
                        exposure: -10,
                        vulnerability: -12,
                        resources: -12,
                        response: +20,
                        mobility: -5,
                        publicPressure: -2,
                    },

                    controls: {
                        safeZoneActive: true,
                    },

                    nextPhase: "OUTCOME",

                    consequence:
                        "El área queda bajo control operativo y la situación entra en una fase de recuperación.",
                },

                {
                    id: "restoreMobility",
                    icon: "🛣️",
                    label: "Priorizar recuperación de la movilidad",
                    description:
                        "Destinar recursos a recuperar parcialmente la conexión vial.",

                    effects: {
                        threat: +5,
                        exposure: +10,
                        vulnerability: +5,
                        resources: -10,
                        response: -5,
                        mobility: +25,
                        publicPressure: -10,
                    },

                    nextPhase: "OUTCOME",

                    consequence:
                        "La movilidad mejora rápidamente, pero se mantiene un nivel de exposición residual.",
                },
            ],

            ALERT: [
                {
                    id: "emergencyEvacuation",
                    icon: "🚨",
                    label: "Ordenar evacuación de emergencia",
                    description:
                        "Priorizar la protección de la población ante el incremento de la amenaza.",

                    effects: {
                        exposure: -38,
                        vulnerability: -25,
                        resources: -20,
                        response: +15,
                        mobility: -20,
                        publicPressure: +12,
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La evacuación de emergencia reduce fuertemente la exposición y permite iniciar una respuesta organizada.",
                },

                {
                    id: "emergencyStabilization",
                    icon: "⛰️",
                    label: "Ejecutar intervención de emergencia",
                    description:
                        "Utilizar recursos críticos para intentar controlar la amenaza.",

                    effects: {
                        threat: -20,
                        exposure: +5,
                        vulnerability: -5,
                        resources: -30,
                        response: +10,
                        mobility: -5,
                        publicPressure: +5,
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La amenaza disminuye, aunque la intervención consume una cantidad considerable de recursos.",
                },
            ],
        },
    },
};


// ============================================================
// Compatibilidad temporal con el código anterior
// ============================================================

export const initialScenarioState =
    scenarioData["M-01"].initialState;

export const scenarioDecisions = {
    "M-01": scenarioData["M-01"].decisions.INITIAL,
};