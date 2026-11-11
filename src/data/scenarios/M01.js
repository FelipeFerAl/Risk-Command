export const M01 = {
        id: "M-01",
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

            population: {
                exposed: 168,
                evacuated: 0,
                safe: 0,
            },

            infrastructure: {
                road: "OPEN",
            },

            operations: {
                monitoring: false,
                evacuation: false,
                stabilization: false,
                response: false,
                safeZone: false,
                communityalert: false,
            },
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

        scoring: {
            targets: {
                threat: 35,
                exposure: 30,
                vulnerability: 25,
                resources: 25,
                response: 85,
                protectedPopulation: 120,
            },

            weights: {
                riskReduction: 0.35,
                populationProtection: 0.25,
                resourceManagement: 0.15,
                responseCapacity: 0.15,
                efficiency: 0.10,
            },
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
                        exposure: -32,
                        vulnerability: -22,
                        resources: -10,
                        response: +20,
                        mobility: -12,
                        publicPressure: +6,
                    },

                    stateChanges: {
                        population: {
                            evacuated: 120,
                            exposed: 48,
                        },

                        operations: {
                            evacuation: true,
                        },
                    },

                    nextPhase: "EVACUATION",

                    consequence:
                        "La exposición disminuye de forma importante. Sin embargo, la amenaza sobre la ladera permanece activa y será necesario decidir cómo controlar su evolución."
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

                    stateChanges: {
                        infrastructure: {
                            road: "CLOSED",
                        },
                    },

                    nextPhase: "ROAD_CLOSED",

                    consequence:
                        "El cierre reduce la exposición inmediata, pero consume capacidad operativa y afecta considerablemente la movilidad."
                },

                {
                    id: "preventiveStabilization",

                    icon: "⛰️",

                    label: "Ejecutar estabilización preventiva",

                    description:
                        "Destinar recursos inicialmente disponibles a reducir la amenaza antes de que la situación evolucione.",

                    effects: {
                        threat: -40,
                        exposure: -4,
                        vulnerability: -12,
                        resources: -12,
                        response: +15,
                        mobility: 0,
                        publicPressure: -2,
                    },

                    stateChanges: {
                        operations: {
                            stabilization: true,
                            monitoring: true,
                        },
                    },

                    nextPhase: "STABILIZATION",

                    consequence:
                        "La intervención preventiva reduce la inestabilidad de la ladera y proporciona tiempo adicional para organizar medidas de protección."
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

                    stateChanges: {
                        operations: {
                            monitoring: true,
                        },
                    },

                    nextPhase: "MONITORING",

                    consequence:
                        "La operación continúa, pero los indicadores de riesgo empiezan a deteriorarse."
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

                    stateChanges: {
                        population: { safe: 120 },
                        infrastructure: { road: "CLOSED" },
                        operations: { response: true },
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

                    stateChanges: {
                        operations: {
                            monitoring: true,
                        },
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

                    stateChanges: {
                        operations: { response: true },
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La capacidad de respuesta aumenta y el sector queda mejor preparado ante una posible falla de la ladera.",
                },

                {
                    id: "reopenRoad",
                    stateChanges: {
                        infrastructure: { road: "OPEN" },
                    },
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

                    stateChanges: {
                        infrastructure: {
                            road: "OPEN",
                        },
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
                        "Complementar la reducción de la amenaza con una reducción controlada de la exposición.",

                    effects: {
                        threat: -8,
                        exposure: -28,
                        vulnerability: -20,
                        resources: -10,
                        response: +20,
                        mobility: -10,
                        publicPressure: +4,
                    },

                    stateChanges: {
                        population: {
                            evacuated: 150,
                            exposed: 18,
                        },

                        operations: {
                            evacuation: true,
                            response: true,
                        },
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La amenaza se encuentra considerablemente reducida y la mayoría de la población ha sido retirada de la zona de riesgo."
                },

                {
                    id: "keepOperations",

                    icon: "🏠",

                    label: "Mantener las viviendas ocupadas",

                    description:
                        "Confiar en la estabilización mientras continúa la operación normal.",

                    effects: {
                        threat: +2,
                        exposure: +8,
                        vulnerability: +5,
                        resources: +5,
                        response: -5,
                        mobility: +8,
                        publicPressure: -5,
                    },

                    nextPhase: "MONITORING",

                    consequence:
                        "La amenaza física disminuyó inicialmente, pero mantener a la población en el área conserva una exposición significativa."
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

                    stateChanges: {
                        population: { evacuated: 120, exposed: 48 },
                        operations: { evacuation: true, response: true },
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

                    stateChanges: {
                        operations: {
                            monitoring: true,
                        },
                    },

                    nextPhase: "ALERT",

                    consequence:
                        "Los sensores registran un incremento de movimiento en la ladera. La ventana de prevención comienza a cerrarse."
                },
            ],

            RESPONSE: [
                {
                    id: "consolidate",

                    icon: "🛡️",

                    label: "Consolidar zona segura",

                    description:
                        "Establecer un perímetro de seguridad, mantener equipos de respuesta y preparar la transición hacia la recuperación.",

                    effects: {
                        threat: -8,
                        exposure: -10,
                        vulnerability: -10,
                        resources: -8,
                        response: +25,
                        mobility: -5,
                        publicPressure: -3,
                    },

                    stateChanges: {
                        population: {
                            safe: 150,
                        },

                        operations: {
                            safeZone: true,
                            response: true,
                        },
                    },

                    nextPhase: "OUTCOME",

                    consequence:
                        "El perímetro de seguridad queda establecido. La población está protegida y la situación entra en una fase de recuperación controlada."
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

                    stateChanges: {
                        infrastructure: {
                            road: "OPEN",
                        },
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

                    stateChanges: {
                        population: { evacuated: 150, exposed: 18, safe: 150 },
                        operations: { evacuation: true, response: true },
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

                    stateChanges: {
                        operations: { stabilization: true, response: true },
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La amenaza disminuye, aunque la intervención consume una cantidad considerable de recursos.",
                },

                {
                    id: "activateCommunityAlert",

                    icon: "📢",

                    label: "Activar alerta comunitaria",

                    description:
                        "Informar a la población, preparar rutas de evacuación y establecer puntos de encuentro mientras se mantiene la vigilancia.",

                    effects: {
                        threat: 0,
                        exposure: -12,
                        vulnerability: -15,
                        resources: -5,
                        response: +18,
                        mobility: -5,
                        publicPressure: +3,
                    },

                    stateChanges: {
                        operations: {
                            response: true,
                            monitoring: true,
                            communityalert: true,
                        },
                    },

                    nextPhase: "RESPONSE",

                    consequence:
                        "La comunidad conoce las rutas de evacuación y los equipos quedan preparados para actuar ante una nueva señal de inestabilidad."
                },
            ],
        },
};