export const M04 = {
    id: "M-04",
    title: "Continuidad bajo presión",
    location: "Corredor logístico regional, Colombia",

    initialState: {
        threat: 74,
        exposure: 78,
        vulnerability: 61,
        resources: 82,
        response: 42,
        time: 24,
        mobility: 68,
        publicPressure: 38,

        population: {
            exposed: 950,
            evacuated: 0,
            safe: 0,
            assisted: 23,
        },

        infrastructure: {
            bridge: "RESTRICTED",
            alternateRoute: "LIMITED",
            healthCenter: "OPERATIONAL",
            shelter: "READY",
        },

        operations: {
            assessment: false,
            bridgeControl: false,
            alternateRoute: false,
            radioNetwork: false,
            healthContinuity: false,
            shelter: false,
            evacuation: false,
            assistedTransport: false,
            response: false,
            reserve: false,
        },
    },

    initialSituation: {
        phase: "INITIAL",
        title: "El corredor no puede detenerse",
        description:
            "Lluvias intensas han comprometido un puente que conecta la zona urbana con tres sectores rurales. El corredor principal presenta deterioro, la ruta alterna tiene capacidad limitada y el centro de salud debe mantener servicios esenciales mientras se protege a la población.",
        alerts: [
            "950 personas se encuentran potencialmente expuestas al aislamiento o a una evacuación desordenada.",
            "23 personas requieren transporte asistido y no pueden depender de una evacuación convencional.",
            "El centro de salud debe conservar una capacidad mínima de operación.",
            "La telefonía móvil es intermitente, pero existe una red de radio comunitaria.",
        ],
        objective:
            "Mantener la continuidad de los servicios esenciales, reducir la exposición y proteger a la población sin agotar la capacidad de respuesta.",
    },

    /*
     * Ruta de 100/100 validada con el scoringEngine actual:
     *
     * 1. Realizar diagnóstico del corredor
     * 2. Restringir el puente y controlar el acceso
     * 3. Habilitar ruta alterna + red de radio
     * 4. Proteger continuidad del centro de salud y refugio
     * 5. Ejecutar evacuación priorizada con transporte asistido
     *
     * Resultado final esperado:
     * threat = 30
     * exposure = 22
     * vulnerability = 23
     * resources = 37
     * response = 92
     * protectedPopulation = 850
     * decisionCount = 5
     * deterioration = 0
     *
     * Todos los componentes del scoring alcanzan 100.
     */
    scoring: {
        targets: {
            threat: 30,
            exposure: 25,
            vulnerability: 25,
            resources: 35,
            response: 90,
            protectedPopulation: 800,
        },

        maxEfficientDecisions: 5,

        weights: {
            riskReduction: 0.30,
            populationProtection: 0.25,
            resourceManagement: 0.15,
            responseCapacity: 0.20,
            efficiency: 0.10,
        },
    },

    decisions: {
        INITIAL: [
            {
                id: "corridorAssessment",
                icon: "📡",
                label: "Realizar diagnóstico del corredor",
                description:
                    "Verificar estado del puente, capacidad de la ruta alterna, puntos de control y necesidades de la población antes de comprometer la operación.",
                effects: {
                    threat: -6,
                    exposure: -4,
                    vulnerability: -3,
                    resources: -5,
                    response: +10,
                    mobility: -2,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        assessment: true,
                    },
                },
                nextPhase: "ASSESSMENT",
                consequence:
                    "La evaluación reduce la incertidumbre y permite organizar la intervención sin asumir que una sola medida resolverá el problema.",
            },
            {
                id: "immediateBridgeRestriction",
                icon: "🚧",
                label: "Restringir inmediatamente el puente",
                description:
                    "Reducir el tránsito sobre el tramo comprometido antes de completar el diagnóstico.",
                effects: {
                    threat: -10,
                    exposure: -10,
                    vulnerability: -5,
                    resources: -7,
                    response: +8,
                    mobility: -18,
                    publicPressure: +4,
                },
                stateChanges: {
                    operations: {
                        bridgeControl: true,
                    },
                    infrastructure: {
                        bridge: "CLOSED",
                    },
                },
                nextPhase: "COORDINATION",
                consequence:
                    "El riesgo inmediato sobre el puente disminuye, pero la pérdida de movilidad obliga a resolver rápidamente la continuidad del corredor.",
            },
            {
                id: "prematureEvacuation",
                icon: "🚨",
                label: "Ordenar evacuación inmediata",
                description:
                    "Evacuar antes de verificar las rutas y la capacidad de recepción.",
                effects: {
                    threat: -6,
                    exposure: -24,
                    vulnerability: -12,
                    resources: -16,
                    response: +10,
                    mobility: -20,
                    publicPressure: +10,
                },
                stateChanges: {
                    population: {
                        evacuated: 650,
                        safe: 650,
                    },
                    operations: {
                        evacuation: true,
                        response: true,
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "La exposición disminuye rápidamente, pero la evacuación se inicia sin haber asegurado completamente la continuidad del corredor ni el transporte asistido.",
            },
        ],

        ASSESSMENT: [
            {
                id: "secureBridgeAfterAssessment",
                icon: "🛑",
                label: "Restringir el puente y controlar accesos",
                description:
                    "Con la información técnica disponible, limitar el tránsito y proteger el punto crítico mientras se organiza una alternativa.",
                isAvailable: (state) => state.operations?.assessment === true,
                effects: {
                    threat: -10,
                    exposure: -12,
                    vulnerability: -5,
                    resources: -8,
                    response: +8,
                    mobility: -16,
                    publicPressure: +3,
                },
                stateChanges: {
                    operations: {
                        bridgeControl: true,
                    },
                    infrastructure: {
                        bridge: "CLOSED",
                    },
                },
                nextPhase: "COORDINATION",
                consequence:
                    "El puente queda bajo control operativo. La decisión reduce la exposición al punto crítico, pero exige habilitar una ruta alternativa y una comunicación redundante.",
            },
            {
                id: "controlledBridge",
                icon: "🚗",
                label: "Mantener tránsito restringido",
                description:
                    "Permitir circulación limitada mientras se continúa evaluando el deterioro.",
                effects: {
                    threat: +4,
                    exposure: +5,
                    vulnerability: +2,
                    resources: -2,
                    response: +4,
                    mobility: +5,
                    publicPressure: -3,
                },
                stateChanges: {
                    operations: {
                        bridgeControl: true,
                    },
                    infrastructure: {
                        bridge: "CONTROLLED",
                    },
                },
                nextPhase: "COORDINATION",
                consequence:
                    "La movilidad se conserva parcialmente, pero aumenta la exposición al punto crítico y se reduce el margen para una evacuación segura.",
            },
        ],

        COORDINATION: [
            {
                id: "activateAlternateNetwork",
                icon: "🛣️",
                label: "Habilitar ruta alterna y red de radio",
                description:
                    "Organizar la ruta alternativa, puntos de control y comunicación por radio para mantener la coordinación cuando falle la telefonía.",
                isAvailable: (state) => state.operations?.bridgeControl === true,
                effects: {
                    threat: -8,
                    exposure: -10,
                    vulnerability: -8,
                    resources: -10,
                    response: +12,
                    mobility: +6,
                    publicPressure: -4,
                },
                stateChanges: {
                    operations: {
                        alternateRoute: true,
                        radioNetwork: true,
                    },
                    infrastructure: {
                        alternateRoute: "OPERATIONAL",
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "La ruta alterna queda operativa y la red de radio crea un canal de coordinación redundante. Ahora es posible proteger servicios esenciales antes de evacuar.",
            },
            {
                id: "healthFirst",
                icon: "🏥",
                label: "Priorizar únicamente el centro de salud",
                description:
                    "Concentrar recursos en la continuidad sanitaria antes de resolver la totalidad de la movilidad.",
                effects: {
                    threat: -5,
                    exposure: -6,
                    vulnerability: -12,
                    resources: -9,
                    response: +12,
                    publicPressure: +2,
                },
                stateChanges: {
                    operations: {
                        healthContinuity: true,
                    },
                    infrastructure: {
                        healthCenter: "PROTECTED",
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "El servicio sanitario queda mejor protegido, pero la operación todavía depende de una movilidad que no ha sido completamente resuelta.",
            },
            {
                id: "logisticsOnly",
                icon: "📦",
                label: "Mover recursos sin reorganizar el corredor",
                description:
                    "Desplegar suministros y vehículos manteniendo la infraestructura vial en su estado actual.",
                effects: {
                    threat: -2,
                    exposure: -5,
                    vulnerability: -5,
                    resources: -8,
                    response: +10,
                    mobility: -4,
                },
                stateChanges: {
                    operations: {
                        response: true,
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "Los equipos cuentan con algunos recursos adicionales, pero la falta de una ruta y comunicación robustas limita la coordinación.",
            },
        ],

        PROTECTION: [
            {
                id: "protectContinuity",
                icon: "🏥",
                label: "Proteger salud y preparar refugio",
                description:
                    "Garantizar el funcionamiento mínimo del centro de salud y preparar un punto de recepción para la población evacuada.",
                isAvailable: (state) =>
                    state.operations?.alternateRoute === true &&
                    state.operations?.radioNetwork === true,
                effects: {
                    threat: -8,
                    exposure: -10,
                    vulnerability: -10,
                    resources: -10,
                    response: +8,
                    mobility: -3,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        healthContinuity: true,
                        shelter: true,
                    },
                    infrastructure: {
                        healthCenter: "PROTECTED",
                        shelter: "OPERATIONAL",
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "El centro de salud conserva funciones esenciales y el refugio queda preparado. La operación ya dispone de ruta, comunicación y recepción.",
            },
            {
                id: "protectHealthOnly",
                icon: "🩺",
                label: "Proteger solo el servicio de salud",
                description:
                    "Concentrar la siguiente intervención en el servicio esencial sin preparar todavía la recepción de evacuados.",
                effects: {
                    threat: -6,
                    exposure: -6,
                    vulnerability: -10,
                    resources: -7,
                    response: +7,
                    publicPressure: +1,
                },
                stateChanges: {
                    operations: {
                        healthContinuity: true,
                    },
                    infrastructure: {
                        healthCenter: "PROTECTED",
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "El servicio sanitario mejora su continuidad, pero la capacidad de recepción de la población todavía es limitada.",
            },
            {
                id: "holdReserve",
                icon: "🧯",
                label: "Conservar reserva operativa",
                description:
                    "Reducir el gasto inmediato y mantener capacidad para una eventual escalada.",
                effects: {
                    threat: -2,
                    exposure: -4,
                    vulnerability: -4,
                    resources: +2,
                    response: +6,
                    publicPressure: -2,
                },
                stateChanges: {
                    operations: {
                        reserve: true,
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "La reserva aumenta, pero se mantiene una exposición significativa y la operación pierde capacidad preventiva.",
            },
        ],

        EVACUATION: [
            {
                id: "prioritizedEvacuation",
                icon: "🚑",
                label: "Ejecutar evacuación priorizada",
                description:
                    "Evacuar primero a las personas más vulnerables, incluyendo las 23 que requieren transporte asistido, y consolidar la población en el refugio preparado.",
                isAvailable: (state) =>
                    state.operations?.alternateRoute === true &&
                    state.operations?.radioNetwork === true &&
                    state.operations?.healthContinuity === true &&
                    state.operations?.shelter === true,
                effects: {
                    threat: -12,
                    exposure: -20,
                    vulnerability: -12,
                    resources: -12,
                    response: +12,
                    mobility: -8,
                    publicPressure: -5,
                },
                stateChanges: {
                    population: {
                        evacuated: 850,
                        safe: 850,
                        exposed: 100,
                    },
                    operations: {
                        evacuation: true,
                        assistedTransport: true,
                        response: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La evacuación priorizada protege a la población con mayor necesidad de asistencia, mantiene la continuidad sanitaria y deja una reserva operativa suficiente para la evolución del escenario.",
            },
            {
                id: "generalEvacuation",
                icon: "👥",
                label: "Ejecutar evacuación general",
                description:
                    "Movilizar rápidamente a la mayor cantidad posible de población utilizando la ruta alterna disponible.",
                effects: {
                    threat: -8,
                    exposure: -18,
                    vulnerability: -8,
                    resources: -16,
                    response: +8,
                    mobility: -14,
                    publicPressure: -7,
                },
                stateChanges: {
                    population: {
                        evacuated: 760,
                        safe: 760,
                        exposed: 190,
                    },
                    operations: {
                        evacuation: true,
                        response: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La exposición se reduce de forma importante, aunque la operación consume más recursos y no prioriza completamente las necesidades de asistencia diferenciada.",
            },
            {
                id: "delayEvacuation",
                icon: "⏳",
                label: "Esperar confirmación adicional",
                description:
                    "Posponer la evacuación para obtener una nueva lectura sobre el estado del puente.",
                effects: {
                    threat: +8,
                    exposure: +8,
                    vulnerability: +5,
                    resources: +2,
                    response: -8,
                    mobility: +4,
                    publicPressure: +6,
                },
                stateChanges: {
                    operations: {
                        response: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La espera conserva algunos recursos, pero el margen de seguridad se reduce y aumenta la exposición antes de cerrar la operación.",
            },
        ],
    },
};
