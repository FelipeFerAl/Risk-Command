export const M03 = {
    id: "M-03",
    title: "Presupuesto bajo presión",
    location: "Municipio intermedio, Colombia",

    initialState: {
        threat: 62,
        exposure: 72,
        vulnerability: 68,
        resources: 100,
        response: 38,
        time: 30,
        mobility: 76,
        publicPressure: 32,

        budget: {
            total: 1200,
            committed: 0,
            remaining: 1200,
            currency: "COP_MILLIONS",
        },

        population: {
            exposed: 1800,
            evacuated: 0,
            safe: 0,
        },

        infrastructure: {
            drainage: "VULNERABLE",
            school: "VULNERABLE",
            health: "VULNERABLE",
            roads: "OPEN",
        },

        operations: {
            assessment: false,
            monitoring: false,
            earlyWarning: false,
            drainage: false,
            infrastructure: false,
            relocation: false,
            emergencyReserve: false,
            response: false,
        },
    },

    initialSituation: {
        phase: "INITIAL",
        title: "Un presupuesto que no alcanza para todo",
        description:
            "El municipio debe intervenir una zona expuesta a inundación y fallas de infraestructura. Hay 1.200 millones COP disponibles, pero financiar una medida implica renunciar a otra o reducir la reserva para responder al evento.",
        alerts: [
            "1.800 personas viven dentro del área priorizada.",
            "El drenaje principal presenta capacidad insuficiente durante lluvias intensas.",
            "La escuela y el centro de salud requieren medidas de continuidad.",
            "La administración exige conservar una reserva para respuesta y contingencias.",
        ],
        objective:
            "Construir una cartera equilibrada de inversión que reduzca el riesgo, proteja a la población y conserve una reserva financiera operativa.",
    },

    scoring: {
        targets: {
            threat: 47,
            exposure: 28,
            vulnerability: 35,
            resources: 25,
            response: 85,
            protectedPopulation: 1200,
        },

        maxEfficientDecisions: 4,

        weights: {
            riskReduction: 0.30,
            populationProtection: 0.15,
            resourceManagement: 0.05,
            responseCapacity: 0.15,
            efficiency: 0.05,
            budgetManagement: 0.30,
        },

        budget: {
            idealRemainingMin: 35,
            idealRemainingMax: 50,
            overspendPenalty: 5,
            underinvestmentPenalty: 3,
        },
    },

    decisions: {
        INITIAL: [
            {
                id: "budgetAssessment",
                icon: "📊",
                label: "Realizar diagnóstico costo-riesgo",
                description:
                    "Invertir en información técnica para comparar exposición, vulnerabilidad, beneficios esperados y costos antes de comprometer la mayor parte del presupuesto.",
                budgetCost: 60,
                effects: {
                    threat: -4,
                    exposure: -3,
                    vulnerability: -4,
                    response: +8,
                    mobility: -2,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        assessment: true,
                        monitoring: true,
                    },
                },
                nextPhase: "PLANNING",
                consequence:
                    "El municipio reduce la incertidumbre y puede comparar inversiones por impacto, costo y riesgo residual.",
            },
            {
                id: "emergencyReserveFirst",
                icon: "🧯",
                label: "Blindar primero el fondo de emergencia",
                description:
                    "Separar recursos para responder a un evento antes de financiar medidas estructurales.",
                budgetCost: 180,
                effects: {
                    threat: 0,
                    exposure: -2,
                    vulnerability: -3,
                    response: +18,
                    publicPressure: -1,
                },
                stateChanges: {
                    operations: {
                        emergencyReserve: true,
                    },
                },
                nextPhase: "PLANNING",
                consequence:
                    "La capacidad de respuesta mejora, pero todavía falta invertir en reducir las condiciones que generan el riesgo.",
            },
            {
                id: "quickSpending",
                icon: "💸",
                label: "Ejecutar obras de alto costo de inmediato",
                description:
                    "Comprometer una intervención grande sin completar primero la comparación de alternativas.",
                budgetCost: 480,
                effects: {
                    threat: -10,
                    exposure: -10,
                    vulnerability: -12,
                    response: +4,
                    publicPressure: +8,
                },
                stateChanges: {
                    operations: {
                        infrastructure: true,
                    },
                    infrastructure: {
                        school: "PARTIAL",
                    },
                },
                nextPhase: "PLANNING",
                consequence:
                    "Se consigue una mejora rápida, pero una parte considerable del presupuesto queda comprometida sin haber evaluado toda la cartera de necesidades.",
            },
        ],

        PLANNING: [
            {
                id: "upgradeDrainage",
                icon: "🛠️",
                label: "Ampliar y mantener el drenaje crítico",
                description:
                    "Financiar la intervención con mayor efecto sobre la acumulación de agua y la amenaza local.",
                budgetCost: 180,
                effects: {
                    threat: -15,
                    exposure: -6,
                    vulnerability: -8,
                    response: +6,
                    mobility: -3,
                    publicPressure: +2,
                },
                stateChanges: {
                    infrastructure: {
                        drainage: "UPGRADED",
                    },
                    operations: {
                        drainage: true,
                    },
                },
                nextPhase: "PORTFOLIO",
                consequence:
                    "La infraestructura hidráulica mejora y disminuye la presión sobre los sectores bajos durante el evento.",
            },
            {
                id: "earlyWarning",
                icon: "📡",
                label: "Implementar alerta temprana",
                description:
                    "Instalar monitoreo, protocolos de comunicación y mecanismos de aviso para reducir exposición con información oportuna.",
                budgetCost: 120,
                effects: {
                    threat: -3,
                    exposure: -12,
                    vulnerability: -10,
                    response: +16,
                    mobility: -2,
                    publicPressure: -1,
                },
                stateChanges: {
                    operations: {
                        earlyWarning: true,
                        monitoring: true,
                    },
                },
                nextPhase: "PORTFOLIO",
                consequence:
                    "La alerta temprana aumenta el margen para evacuar y reduce la exposición sin consumir una gran parte del presupuesto.",
            },
            {
                id: "criticalInfrastructure",
                icon: "🏥",
                label: "Proteger infraestructura crítica",
                description:
                    "Priorizar continuidad de la escuela, centro de salud y accesos esenciales.",
                budgetCost: 240,
                effects: {
                    threat: -5,
                    exposure: -8,
                    vulnerability: -20,
                    response: +12,
                    mobility: -4,

                    publicPressure: +1,
                },
                stateChanges: {
                    infrastructure: {
                        school: "PROTECTED",
                        health: "PROTECTED",
                    },
                    operations: {
                        infrastructure: true,
                    },
                },
                nextPhase: "PORTFOLIO",
                consequence:
                    "Los servicios críticos quedan protegidos y la inversión reduce vulnerabilidad sin consumir toda la capacidad financiera.",
            },
            {
                id: "voluntaryRelocation",
                icon: "🏘️",
                label: "Financiar reubicación voluntaria prioritaria",
                description:
                    "Reducir exposición trasladando hogares ubicados en los puntos de mayor riesgo residual.",
                budgetCost: 300,
                effects: {
                    threat: -6,
                    exposure: -30,
                    vulnerability: -15,
                    response: +8,
                    mobility: -5,
                    publicPressure: +4,
                },
                stateChanges: {
                    population: {
                        evacuated: 700,
                        safe: 1200,
                        exposed: 600,
                    },
                    operations: {
                        relocation: true,
                    },
                },
                nextPhase: "PORTFOLIO",
                consequence:
                    "La exposición disminuye de manera significativa, pero la inversión es alta y reduce el margen para otras medidas.",
            },
        ],

        PORTFOLIO: [
            {
                id: "communityPreparedness",
                icon: "📢",
                label: "Completar preparación comunitaria",
                description:
                    "Destinar recursos a capacitación, rutas, simulacros y comunicación para convertir las inversiones físicas en capacidad operativa.",
                budgetCost: 120,
                effects: {
                    threat: -2,
                    exposure: -10,
                    vulnerability: -12,
                    response: +18,
                    mobility: -2,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        earlyWarning: true,
                        response: true,
                    },
                },
                nextPhase: "REVIEW",
                consequence:
                    "La comunidad queda mejor preparada para actuar y aprovechar las inversiones realizadas.",
            },
            {
                id: "emergencyResponseCapacity",
                icon: "🚑",
                label: "Fortalecer capacidad de respuesta",
                description:
                    "Reservar recursos para equipos, logística y atención durante las primeras horas del evento.",
                budgetCost: 180,
                effects: {
                    threat: -2,
                    exposure: -5,
                    vulnerability: -8,
                    response: +25,
                    mobility: -3,
                    publicPressure: +1,
                },
                stateChanges: {
                    operations: {
                        emergencyReserve: true,
                        response: true,
                    },
                },
                nextPhase: "REVIEW",
                consequence:
                    "La capacidad de respuesta aumenta y el municipio conserva una reserva explícita para contingencias.",
            },
            {
                id: "overinvestStructure",
                icon: "🏗️",
                label: "Ampliar nuevamente la inversión estructural",
                description:
                    "Comprometer una nueva obra antes de revisar cuánto presupuesto queda disponible para respuesta.",
                budgetCost: 240,
                effects: {
                    threat: -8,
                    exposure: -5,
                    vulnerability: -10,
                    response: -4,
                    mobility: -3,
                    publicPressure: +6,
                },
                stateChanges: {
                    operations: {
                        infrastructure: true,
                    },
                },
                nextPhase: "REVIEW",
                consequence:
                    "El riesgo físico disminuye, pero la reserva financiera y la capacidad de respuesta quedan bajo presión.",
            },
            {
                id: "holdBudget",
                icon: "💰",
                label: "Conservar el saldo para contingencias",
                description:
                    "No comprometer más recursos y pasar a evaluar el equilibrio alcanzado.",
                budgetCost: 0,
                effects: {
                    threat: 0,
                    exposure: 0,
                    vulnerability: 0,
                    response: +4,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        emergencyReserve: true,
                    },
                },
                nextPhase: "REVIEW",
                consequence:
                    "El municipio mantiene liquidez para contingencias y puede evaluar si el nivel de riesgo residual es aceptable.",
            },
        ],

        REVIEW: [
            {
                id: "activateEmergencyReserve",
                icon: "🛡️",
                label: "Activar reserva y cerrar el plan",
                description:
                    "Destinar la reserva a preparación operativa, dejando trazabilidad de los recursos y capacidad para responder al evento.",
                budgetCost: 60,
                effects: {
                    threat: -3,
                    exposure: -6,
                    vulnerability: -6,
                    response: +20,
                    mobility: -2,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        emergencyReserve: true,
                        response: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La cartera queda cerrada con una reserva operativa y una estrategia que combina reducción, preparación y respuesta.",
            },
            {
                id: "closeWithoutReserve",
                icon: "⚠️",
                label: "Cerrar sin fortalecer la reserva",
                description:
                    "Aceptar el nivel de riesgo residual y terminar la operación sin comprometer más recursos.",
                budgetCost: 0,
                effects: {
                    threat: 0,
                    exposure: 0,
                    vulnerability: 0,
                    response: -10,
                    publicPressure: +4,
                },
                stateChanges: {
                    operations: {
                        response: false,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La inversión física es importante, pero la capacidad financiera para responder a un nuevo evento queda limitada.",
            },
            {
                id: "reallocateLastFunds",
                icon: "🔄",
                label: "Reasignar el último tramo a respuesta",
                description:
                    "Utilizar el saldo disponible para reforzar logística y atención, aunque se reduzca el margen final.",
                budgetCost: 100,
                effects: {
                    threat: -2,
                    exposure: -5,
                    vulnerability: -5,
                    response: +24,
                    mobility: -2,
                    publicPressure: +2,
                },
                stateChanges: {
                    operations: {
                        emergencyReserve: true,
                        response: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La capacidad de respuesta mejora, pero el saldo final puede quedar por debajo de la reserva recomendada.",
            },
        ],
    },
};
