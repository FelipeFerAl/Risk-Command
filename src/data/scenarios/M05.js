export const M05 = {
    id: "M-05",
    title: "Crisis en cascada",
    location: "Corredor metropolitano y cuenca baja, Colombia",

    initialState: {
        threat: 82,
        exposure: 86,
        vulnerability: 72,
        resources: 88,
        response: 35,
        time: 18,

        population: {
            exposed: 1200,
            evacuated: 0,
            safe: 0,
            assisted: 46,
        },

        infrastructure: {
            slope: "UNSTABLE",
            river: "RISING",
            substation: "AT_RISK",
            waterPlant: "AT_RISK",
            hospital: "OPERATIONAL",
            shelter: "READY",
            communications: "FRAGILE",
        },

        operations: {
            assessment: false,
            hazardControl: false,
            lifelineProtection: false,
            communicationRedundancy: false,
            alternateRoute: false,
            hospitalContinuity: false,
            waterContinuity: false,
            shelter: false,
            evacuation: false,
            assistedTransport: false,
            reserve: false,
            response: false,
        },
    },

    initialSituation: {
        phase: "INITIAL",
        title: "Una amenaza activa está afectando varias redes a la vez",
        description:
            "Lluvias intensas han provocado inestabilidad en una ladera y un ascenso rápido del nivel del río. La misma zona concentra una subestación eléctrica, una planta de tratamiento de agua y un corredor que conecta un hospital con sectores residenciales.",
        alerts: [
            "1.200 personas se encuentran potencialmente expuestas a una combinación de inundación, movimientos de terreno y pérdida de servicios.",
            "46 personas requieren transporte asistido para una evacuación segura.",
            "La subestación y la planta de agua presentan riesgo de interrupción si la emergencia escala.",
            "El hospital continúa operativo, pero su autonomía depende de la protección de servicios críticos y de una ruta de acceso funcional.",
        ],
        objective:
            "Controla la cascada de amenazas, protege las redes críticas, conserva capacidad de respuesta y ejecuta una evacuación priorizada sin provocar deterioro durante la operación.",
    },

    scoring: {
        targets: {
            threat: 30,
            exposure: 25,
            vulnerability: 25,
            resources: 35,
            response: 90,
            protectedPopulation: 1000,
        },

        maxEfficientDecisions: 7,

        weights: {
            riskReduction: 0.30,
            populationProtection: 0.25,
            resourceManagement: 0.10,
            responseCapacity: 0.20,
            efficiency: 0.15,
        },
    },

    decisions: {
        INITIAL: [
            {
                id: "multiHazardAssessment",
                icon: "🛰️",
                label: "Integrar diagnóstico multiamenaza",
                description:
                    "Cruzar información de la ladera, nivel del río, subestación, planta de agua, hospital, población expuesta y rutas antes de comprometer los recursos de respuesta.",
                effects: {
                    threat: -7,
                    exposure: -5,
                    vulnerability: -4,
                    resources: -4,
                    response: +10,
                },
                stateChanges: {
                    operations: {
                        assessment: true,
                    },
                },
                nextPhase: "ASSESSMENT",
                consequence:
                    "La situación deja de tratarse como dos emergencias independientes. La evaluación integrada identifica cómo una falla puede desencadenar otra y permite priorizar las redes críticas.",
            },
            {
                id: "immediateEvacuation",
                icon: "🚨",
                label: "Evacuar inmediatamente sin integrar información",
                description:
                    "Iniciar una evacuación masiva antes de verificar rutas, servicios críticos y capacidad de recepción.",
                effects: {
                    threat: -4,
                    exposure: -18,
                    vulnerability: -8,
                    resources: -18,
                    response: +6,
                },
                stateChanges: {
                    population: {
                        evacuated: 620,
                        safe: 620,
                    },
                    operations: {
                        evacuation: true,
                        response: true,
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "La exposición disminuye, pero la operación consume recursos y moviliza población sin haber asegurado la continuidad de las redes críticas.",
            },
            {
                id: "protectHospitalOnly",
                icon: "🏥",
                label: "Concentrar recursos solo en el hospital",
                description:
                    "Proteger el servicio sanitario sin analizar las dependencias de energía, agua, comunicaciones y acceso.",
                effects: {
                    threat: -3,
                    exposure: -4,
                    vulnerability: -10,
                    resources: -8,
                    response: +8,
                },
                stateChanges: {
                    operations: {
                        hospitalContinuity: true,
                    },
                    infrastructure: {
                        hospital: "PROTECTED",
                    },
                },
                nextPhase: "ASSESSMENT",
                consequence:
                    "El hospital mejora su condición, pero continúa expuesto a fallas de infraestructura que podrían comprometer su operación.",
            },
        ],

        ASSESSMENT: [
            {
                id: "stabilizeCriticalHazards",
                icon: "🛑",
                label: "Estabilizar los dos puntos de peligro prioritarios",
                description:
                    "Controlar el acceso a la zona de ladera y proteger el tramo inundable del corredor para evitar que la emergencia evolucione mientras se organiza la respuesta.",
                isAvailable: (state) => state.operations?.assessment === true,
                effects: {
                    threat: -12,
                    exposure: -10,
                    vulnerability: -8,
                    resources: -10,
                    response: +12,
                },
                stateChanges: {
                    operations: {
                        hazardControl: true,
                    },
                    infrastructure: {
                        slope: "CONTROLLED",
                        river: "MONITORED",
                    },
                },
                nextPhase: "STABILIZATION",
                consequence:
                    "Los dos focos de peligro quedan bajo control operativo. Se reduce la posibilidad de que una falla localizada provoque una segunda emergencia.",
            },
            {
                id: "stabilizeSlopeOnly",
                icon: "⛰️",
                label: "Controlar únicamente la ladera",
                description:
                    "Cerrar el sector inestable y mantener el resto de la infraestructura sin intervención prioritaria.",
                isAvailable: (state) => state.operations?.assessment === true,
                effects: {
                    threat: -9,
                    exposure: -6,
                    vulnerability: -6,
                    resources: -6,
                    response: +8,
                },
                stateChanges: {
                    operations: {
                        hazardControl: true,
                    },
                    infrastructure: {
                        slope: "CONTROLLED",
                    },
                },
                nextPhase: "STABILIZATION",
                consequence:
                    "La ladera queda controlada, pero la presión sobre el corredor y las redes críticas permanece.",
            },
        ],

        STABILIZATION: [
            {
                id: "buildRedundancy",
                icon: "📡",
                label: "Crear redundancia de comunicaciones y movilidad",
                description:
                    "Activar radio, establecer puntos de coordinación y habilitar una ruta de contingencia para mantener el acceso a servicios esenciales.",
                isAvailable: (state) => state.operations?.hazardControl === true,
                effects: {
                    threat: -10,
                    exposure: -12,
                    vulnerability: -8,
                    resources: -10,
                    response: +10,
                },
                stateChanges: {
                    operations: {
                        communicationRedundancy: true,
                        alternateRoute: true,
                    },
                    infrastructure: {
                        communications: "REDUNDANT",
                    },
                },
                nextPhase: "COORDINATION",
                consequence:
                    "La operación deja de depender de un único canal de comunicación y de un único acceso. La respuesta gana resiliencia ante una falla adicional.",
            },
            {
                id: "deployOnlyVehicles",
                icon: "🚒",
                label: "Desplegar vehículos sin asegurar comunicaciones",
                description:
                    "Aumentar presencia operativa en campo sin establecer primero un canal redundante de coordinación.",
                isAvailable: (state) => state.operations?.hazardControl === true,
                effects: {
                    threat: -5,
                    exposure: -7,
                    vulnerability: -4,
                    resources: -9,
                    response: +9,
                },
                stateChanges: {
                    operations: {
                        response: true,
                    },
                },
                nextPhase: "COORDINATION",
                consequence:
                    "La presencia de equipos mejora la capacidad inmediata, pero una falla de comunicaciones puede fragmentar la operación.",
            },
        ],

        COORDINATION: [
            {
                id: "protectLifelines",
                icon: "⚡",
                label: "Proteger agua, energía y continuidad hospitalaria",
                description:
                    "Asegurar la subestación, mantener la planta de agua y garantizar la continuidad del hospital utilizando la ruta y las comunicaciones redundantes.",
                isAvailable: (state) =>
                    state.operations?.communicationRedundancy === true &&
                    state.operations?.alternateRoute === true,
                effects: {
                    threat: -8,
                    exposure: -10,
                    vulnerability: -10,
                    resources: -10,
                    response: +10,
                },
                stateChanges: {
                    operations: {
                        lifelineProtection: true,
                        hospitalContinuity: true,
                        waterContinuity: true,
                    },
                    infrastructure: {
                        substation: "PROTECTED",
                        waterPlant: "PROTECTED",
                        hospital: "PROTECTED",
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "Las redes críticas quedan protegidas y el hospital conserva continuidad. La respuesta ya no depende de una sola infraestructura.",
            },
            {
                id: "protectEnergyOnly",
                icon: "🔌",
                label: "Priorizar únicamente la energía",
                description:
                    "Concentrar recursos en la subestación sin resolver simultáneamente el abastecimiento de agua y la continuidad hospitalaria.",
                isAvailable: (state) => state.operations?.communicationRedundancy === true,
                effects: {
                    threat: -6,
                    exposure: -7,
                    vulnerability: -6,
                    resources: -7,
                    response: +8,
                },
                stateChanges: {
                    operations: {
                        lifelineProtection: true,
                    },
                    infrastructure: {
                        substation: "PROTECTED",
                    },
                },
                nextPhase: "PROTECTION",
                consequence:
                    "La continuidad eléctrica mejora, pero la planta de agua y el hospital conservan dependencias críticas sin resolver.",
            },
        ],

        PROTECTION: [
            {
                id: "secureEvacuationSystem",
                icon: "🏠",
                label: "Preparar refugio y sistema de evacuación priorizada",
                description:
                    "Preparar recepción, transporte asistido, corredores seguros y comunicación de prioridades antes de movilizar a la población.",
                isAvailable: (state) =>
                    state.operations?.lifelineProtection === true &&
                    state.operations?.hospitalContinuity === true &&
                    state.operations?.waterContinuity === true,
                effects: {
                    threat: -10,
                    exposure: -16,
                    vulnerability: -10,
                    resources: -12,
                    response: +9,
                },
                stateChanges: {
                    operations: {
                        shelter: true,
                    },
                    infrastructure: {
                        shelter: "OPERATIONAL",
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "La recepción y la evacuación quedan organizadas antes del desplazamiento masivo. Se reduce el riesgo de trasladar población hacia un segundo punto de peligro.",
            },
            {
                id: "openShelterWithoutRoute",
                icon: "🏠",
                label: "Abrir refugio sin asegurar la ruta",
                description:
                    "Preparar el punto de recepción, pero movilizar a la población sin consolidar los corredores de acceso.",
                effects: {
                    threat: -4,
                    exposure: -8,
                    vulnerability: -7,
                    resources: -6,
                    response: +6,
                },
                stateChanges: {
                    operations: {
                        shelter: true,
                    },
                    infrastructure: {
                        shelter: "OPERATIONAL",
                    },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "Existe un punto de recepción, pero la movilidad sigue condicionada por la infraestructura amenazada.",
            },
        ],

        EVACUATION: [
            {
                id: "prioritizedEvacuation",
                icon: "🚑",
                label: "Ejecutar evacuación priorizada y transporte asistido",
                description:
                    "Evacuar primero a las personas con mayor vulnerabilidad, incluyendo las 46 que requieren transporte asistido, y consolidar la población en el refugio operativo.",
                isAvailable: (state) =>
                    state.operations?.shelter === true &&
                    state.operations?.lifelineProtection === true &&
                    state.operations?.alternateRoute === true,
                effects: {
                    threat: -10,
                    exposure: -16,
                    vulnerability: -10,
                    resources: -12,
                    response: +9,
                },
                stateChanges: {
                    population: {
                        evacuated: 1000,
                        safe: 1000,
                        exposed: 200,
                    },
                    operations: {
                        evacuation: true,
                        assistedTransport: true,
                        response: true,
                    },
                },
                nextPhase: "CONSOLIDATION",
                consequence:
                    "La evacuación priorizada protege a la población con mayor necesidad de asistencia y mantiene libres los recursos esenciales para consolidar la respuesta.",
            },
            {
                id: "generalEvacuation",
                icon: "👥",
                label: "Ejecutar evacuación general",
                description:
                    "Movilizar rápidamente a una gran cantidad de población sin diferenciar completamente las necesidades de transporte asistido.",
                isAvailable: (state) => state.operations?.shelter === true,
                effects: {
                    threat: -7,
                    exposure: -14,
                    vulnerability: -6,
                    resources: -18,
                    response: +6,
                },
                stateChanges: {
                    population: {
                        evacuated: 900,
                        safe: 900,
                        exposed: 300,
                    },
                    operations: {
                        evacuation: true,
                        response: true,
                    },
                },
                nextPhase: "CONSOLIDATION",
                consequence:
                    "La exposición baja de manera importante, pero el consumo de recursos aumenta y algunas necesidades diferenciadas quedan pendientes.",
            },
        ],

        CONSOLIDATION: [
            {
                id: "consolidateReserve",
                icon: "🛡️",
                label: "Consolidar reserva y cerrar la operación",
                description:
                    "Reubicar los equipos, conservar una reserva mínima y confirmar que las redes críticas continúan operativas antes de cerrar la intervención.",
                isAvailable: (state) =>
                    state.operations?.evacuation === true &&
                    state.operations?.assistedTransport === true,
                effects: {
                    threat: -6,
                    exposure: -9,
                    vulnerability: -8,
                    resources: +5,
                    response: +8,
                },
                stateChanges: {
                    operations: {
                        reserve: true,
                        response: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La operación termina con las redes críticas protegidas, la población prioritaria evacuada y una reserva suficiente para responder a una nueva escalada.",
            },
            {
                id: "continueWithoutReserve",
                icon: "⚠️",
                label: "Mantener despliegue máximo sin reserva",
                description:
                    "Mantener todos los recursos desplegados para intentar reducir todavía más la exposición inmediata.",
                effects: {
                    threat: -8,
                    exposure: -8,
                    vulnerability: -5,
                    resources: -18,
                    response: +4,
                },
                stateChanges: {
                    operations: {
                        response: true,
                    },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La situación inmediata mejora ligeramente, pero la operación termina con una reserva demasiado baja para una nueva contingencia.",
            },
        ],
    },
};
