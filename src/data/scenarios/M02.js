export const M02 = {
    id: "M-02",
    title: "Inundación y vulnerabilidad",
    location: "Cuenca urbana, Colombia",

    initialState: {
        threat: 68,
        exposure: 82,
        vulnerability: 74,
        resources: 70,
        response: 32,
        time: 22,
        mobility: 72,
        publicPressure: 28,

        population: {
            exposed: 1240,
            evacuated: 0,
            safe: 0,
        },

        infrastructure: {
            road: "OPEN",
            school: "OPEN",
            health: "OPEN",
        },

        operations: {
            monitoring: false,
            evacuation: false,
            response: false,
            drainage: false,
            communityAlert: false,
            shelter: false,
            schoolProtected: false,
            healthProtected: false,
        },
    },

    initialSituation: {
        phase: "INITIAL",
        title: "El agua empieza a ganar terreno",
        description:
            "Una lluvia intensa ha elevado el nivel de la quebrada y el agua comienza a ocupar sectores bajos de la cuenca urbana. La prioridad es reducir exposición, proteger servicios críticos y conservar capacidad de respuesta.",
        alerts: [
            "310 viviendas están ubicadas en el área potencialmente inundable.",
            "Una institución educativa atiende a 420 estudiantes.",
            "El centro de salud mantiene atención continua y no puede quedar aislado.",
            "El 27% de las viviendas presenta condiciones constructivas vulnerables.",
        ],
        objective:
            "Reducir la exposición y vulnerabilidad frente a la inundación, proteger los servicios críticos y mantener recursos suficientes para responder a la evolución del evento.",
    },

    scoring: {
        targets: {
            threat: 35,
            exposure: 30,
            vulnerability: 25,
            resources: 40,
            response: 85,
            protectedPopulation: 1000,
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
                id: "floodAssessment",
                icon: "🌧️",
                label: "Activar evaluación hidrometeorológica",
                description:
                    "Combinar monitoreo del nivel de agua, identificación de zonas bajas y actualización de la población expuesta antes de comprometer recursos mayores.",
                effects: {
                    threat: -10,
                    exposure: -8,
                    vulnerability: -10,
                    resources: -8,
                    response: +18,
                    mobility: -4,
                    publicPressure: +2,
                },
                stateChanges: {
                    operations: {
                        monitoring: true,
                    },
                },
                nextPhase: "PLANNING",
                consequence:
                    "La evaluación mejora el conocimiento de la evolución del agua y permite orientar la siguiente intervención hacia las zonas con mayor exposición.",
            },
            {
                id: "evacuateLowAreas",
                icon: "🚨",
                label: "Evacuar sectores bajos",
                description:
                    "Retirar de inmediato a la población ubicada en los puntos con mayor probabilidad de inundación.",
                effects: {
                    threat: -4,
                    exposure: -28,
                    vulnerability: -18,
                    resources: -15,
                    response: +20,
                    mobility: -14,
                    publicPressure: +8,
                },
                stateChanges: {
                    population: {
                        evacuated: 650,
                        exposed: 590,
                    },
                    operations: {
                        evacuation: true,
                        response: true,
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "La exposición disminuye rápidamente, pero todavía es necesario proteger los servicios críticos y organizar refugios para evitar que la evacuación se convierta en una nueva vulnerabilidad.",
            },
            {
                id: "protectCriticalServices",
                icon: "🏥",
                label: "Proteger servicios críticos",
                description:
                    "Priorizar escuela y centro de salud mediante barreras, rutas alternativas y preparación operativa.",
                effects: {
                    threat: -5,
                    exposure: -10,
                    vulnerability: -20,
                    resources: -12,
                    response: +15,
                    mobility: -6,
                    publicPressure: +3,
                },
                stateChanges: {
                    infrastructure: {
                        school: "PROTECTED",
                        health: "PROTECTED",
                    },
                    operations: {
                        schoolProtected: true,
                        healthProtected: true,
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "Los servicios críticos quedan mejor preparados, pero la población general continúa expuesta y la evolución hidrológica todavía exige seguimiento.",
            },
            {
                id: "waitForMoreData",
                icon: "📡",
                label: "Esperar nueva información",
                description:
                    "Mantener la operación normal y posponer medidas de protección hasta contar con otra lectura.",
                effects: {
                    threat: +8,
                    exposure: +6,
                    vulnerability: +4,
                    resources: +4,
                    response: -5,
                    mobility: +6,
                    publicPressure: -3,
                },
                stateChanges: {
                    operations: {
                        monitoring: true,
                    },
                },
                nextPhase: "ALERT",
                consequence:
                    "La demora conserva recursos y movilidad, pero el nivel del agua continúa aumentando y reduce el margen para actuar de forma preventiva.",
            },
        ],

        PLANNING: [
            {
                id: "activateIntegratedPlan",
                icon: "🧭",
                label: "Activar plan integral de protección",
                description:
                    "Coordinar alerta, evacuación prioritaria y protección de servicios críticos con una sola secuencia operativa.",
                effects: {
                    threat: -11,
                    exposure: -22,
                    vulnerability: -20,
                    resources: -10,
                    response: +20,
                    mobility: -6,
                    publicPressure: +4,
                },
                stateChanges: {
                    population: {
                        safe: 800,
                        exposed: 440,
                    },
                    infrastructure: {
                        school: "PROTECTED",
                        health: "PROTECTED",
                    },
                    operations: {
                        monitoring: true,
                        communityAlert: true,
                        evacuation: true,
                        shelter: true,
                        response: true,
                        schoolProtected: true,
                        healthProtected: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "La estrategia integra conocimiento, comunicación y protección de población y servicios críticos, dejando la operación lista para consolidar una zona segura.",
            },
            {
                id: "activateCommunityAlert",
                icon: "📢",
                label: "Activar alerta comunitaria",
                description:
                    "Comunicar rutas, puntos seguros y criterios de evacuación mediante canales oficiales y comunitarios.",
                effects: {
                    threat: -5,
                    exposure: -18,
                    vulnerability: -15,
                    resources: -8,
                    response: +20,
                    mobility: -5,
                    publicPressure: +4,
                },
                stateChanges: {
                    operations: {
                        communityAlert: true,
                        monitoring: true,
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "La población recibe instrucciones claras y se reduce la exposición potencial antes de que el agua alcance los sectores más bajos.",
            },
            {
                id: "clearDrainage",
                icon: "🛠️",
                label: "Despejar drenajes prioritarios",
                description:
                    "Destinar cuadrillas a puntos de drenaje obstruidos para disminuir la acumulación de agua.",
                effects: {
                    threat: -12,
                    exposure: -10,
                    vulnerability: -10,
                    resources: -10,
                    response: +15,
                    mobility: -2,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        drainage: true,
                        monitoring: true,
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "La capacidad de drenaje mejora en puntos críticos y se reduce parte de la acumulación superficial.",
            },
            {
                id: "continueAssessment",
                icon: "🔎",
                label: "Continuar caracterizando la amenaza",
                description:
                    "Invertir tiempo en obtener información adicional antes de desplegar medidas de mayor costo.",
                effects: {
                    threat: +5,
                    exposure: +5,
                    vulnerability: +3,
                    resources: +2,
                    response: +3,
                    mobility: +4,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        monitoring: true,
                    },
                },
                nextPhase: "ALERT",
                consequence:
                    "La información mejora, pero el aumento del agua empieza a superar el beneficio de seguir esperando.",
            },
        ],

        PROTECTION: [
            {
                id: "protectPopulation",
                icon: "🛡️",
                label: "Evacuar población prioritaria y abrir refugios",
                description:
                    "Combinar evacuación de sectores vulnerables con refugios seguros y rutas de acceso controladas.",
                effects: {
                    threat: -15,
                    exposure: -22,
                    vulnerability: -20,
                    resources: -10,
                    response: +22,
                    mobility: -8,
                    publicPressure: +5,
                },
                stateChanges: {
                    population: {
                        evacuated: 700,
                        safe: 650,
                        exposed: 540,
                    },
                    operations: {
                        evacuation: true,
                        shelter: true,
                        response: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "Los sectores prioritarios quedan protegidos y los refugios permiten sostener la evacuación sin perder capacidad de coordinación.",
            },
            {
                id: "secureCriticalServices",
                icon: "🏫",
                label: "Asegurar escuela y centro de salud",
                description:
                    "Proteger accesos, suministros y continuidad de los dos servicios esenciales.",
                effects: {
                    threat: -8,
                    exposure: -18,
                    vulnerability: -20,
                    resources: -8,
                    response: +22,
                    mobility: -4,
                    publicPressure: +1,
                },
                stateChanges: {
                    infrastructure: {
                        school: "PROTECTED",
                        health: "PROTECTED",
                    },
                    operations: {
                        schoolProtected: true,
                        healthProtected: true,
                        response: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "Los servicios críticos quedan protegidos y se mejora la continuidad, pero todavía existe una población considerable en el área inundable.",
            },
            {
                id: "prepareRoutes",
                icon: "🗺️",
                label: "Organizar rutas y puntos de encuentro",
                description:
                    "Preparar desplazamientos seguros y reducir barreras de acceso para personas con necesidades particulares.",
                effects: {
                    threat: -5,
                    exposure: -20,
                    vulnerability: -15,
                    resources: -6,
                    response: +18,
                    mobility: -5,
                    publicPressure: +2,
                },
                stateChanges: {
                    operations: {
                        communityAlert: true,
                        response: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "Las rutas quedan organizadas y la comunidad puede reaccionar con mayor rapidez ante una nueva subida del agua.",
            },
        ],

        EVACUATION: [
            {
                id: "openShelters",
                icon: "🏠",
                label: "Consolidar refugios temporales",
                description:
                    "Organizar alojamiento, atención básica y registro de las personas evacuadas.",
                effects: {
                    threat: -5,
                    exposure: -12,
                    vulnerability: -15,
                    resources: -10,
                    response: +22,
                    mobility: -6,
                    publicPressure: -3,
                },
                stateChanges: {
                    population: {
                        safe: 1000,
                        exposed: 240,
                    },
                    operations: {
                        shelter: true,
                        response: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "La evacuación deja de ser únicamente un desplazamiento y se convierte en una operación organizada de protección.",
            },
            {
                id: "closeFloodRoad",
                icon: "🚧",
                label: "Cerrar corredor inundable",
                description:
                    "Impedir el tránsito por el tramo que puede quedar cubierto por el agua y proteger a los equipos.",
                effects: {
                    threat: -7,
                    exposure: -10,
                    vulnerability: -12,
                    resources: -12,
                    response: +20,
                    mobility: -28,
                    publicPressure: +2,
                },
                stateChanges: {
                    infrastructure: {
                        road: "CLOSED",
                    },
                    operations: {
                        response: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "El cierre reduce el riesgo de incidentes sobre la vía, aunque aumenta la presión sobre las rutas alternativas.",
            },
        ],

        RESPONSE: [
            {
                id: "secureFloodZone",
                icon: "🛡️",
                label: "Consolidar zona segura",
                description:
                    "Mantener perímetros, refugios y equipos de respuesta mientras el nivel del agua comienza a estabilizarse.",
                effects: {
                    threat: -12,
                    exposure: -22,
                    vulnerability: -20,
                    resources: -7,
                    response: +25,
                    mobility: -5,
                    publicPressure: -5,
                },
                stateChanges: {
                    population: {
                        safe: 1100,
                        exposed: 140,
                    },
                    operations: {
                        response: true,
                        shelter: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La zona queda bajo control operativo, los servicios esenciales continúan funcionando y la mayor parte de la población se encuentra protegida.",
            },
            {
                id: "restoreMobility",
                icon: "🛣️",
                label: "Priorizar recuperación de movilidad",
                description:
                    "Reabrir parcialmente corredores para disminuir el impacto económico y social.",
                effects: {
                    threat: +4,
                    exposure: +10,
                    vulnerability: +5,
                    resources: -8,
                    response: -5,
                    mobility: +24,
                    publicPressure: -10,
                },
                stateChanges: {
                    infrastructure: {
                        road: "OPEN",
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La movilidad mejora, pero queda una exposición residual importante mientras persista el evento.",
            },
        ],

        ALERT: [
            {
                id: "emergencyEvacuation",
                icon: "🚨",
                label: "Ordenar evacuación de emergencia",
                description:
                    "Priorizar la vida y retirar rápidamente a la población de las zonas que ya presentan ingreso de agua.",
                effects: {
                    threat: -10,
                    exposure: -38,
                    vulnerability: -28,
                    resources: -20,
                    response: +18,
                    mobility: -18,
                    publicPressure: +10,
                },
                stateChanges: {
                    population: {
                        evacuated: 900,
                        safe: 900,
                        exposed: 340,
                    },
                    operations: {
                        evacuation: true,
                        response: true,
                        shelter: true,
                        communityAlert: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "La evacuación de emergencia reduce fuertemente la exposición y permite concentrar la respuesta en los sectores todavía comprometidos.",
            },
            {
                id: "emergencyDrainage",
                icon: "🌊",
                label: "Desplegar drenaje de emergencia",
                description:
                    "Utilizar recursos críticos para acelerar la evacuación del agua en puntos estratégicos.",
                effects: {
                    threat: -18,
                    exposure: -12,
                    vulnerability: -10,
                    resources: -25,
                    response: +12,
                    mobility: -8,
                    publicPressure: +4,
                },
                stateChanges: {
                    operations: {
                        drainage: true,
                        response: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "La intervención disminuye el nivel del agua en puntos críticos, aunque consume una parte importante de la reserva operativa.",
            },
            {
                id: "communityWarning",
                icon: "📢",
                label: "Fortalecer alerta comunitaria",
                description:
                    "Ampliar la comunicación y preparar a la población para una evacuación si el agua continúa aumentando.",
                effects: {
                    threat: -2,
                    exposure: -15,
                    vulnerability: -16,
                    resources: -6,
                    response: +18,
                    mobility: -5,
                    publicPressure: +5,
                },
                stateChanges: {
                    operations: {
                        communityAlert: true,
                        monitoring: true,
                        response: true,
                    },
                },
                nextPhase: "RESPONSE",
                consequence:
                    "La comunidad recibe instrucciones claras y queda preparada para actuar, aunque la amenaza hidrológica todavía requiere seguimiento.",
            },
        ],
    },
};
