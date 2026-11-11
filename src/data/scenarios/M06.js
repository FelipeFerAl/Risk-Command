export const M06 = {
    id: "M-06",
    title: "Punto de quiebre",
    subtitle: "Decisiones estratégicas bajo incertidumbre",
    location: "Municipio Andino · corredor territorial, Colombia",
    difficulty: "Experto",
    maxXP: 380,

    initialState: {
        threat: 86,
        exposure: 91,
        vulnerability: 76,
        resources: 78,
        response: 31,
        time: 14,
        communications: 42,
        mobility: 38,
        infrastructure: 54,

        population: {
            exposed: 1250,
            evacuated: 0,
            safe: 0,
            assisted: 58,
        },

        infrastructureState: {
            slope: "UNSTABLE",
            river: "HIGH",
            corridor: "RESTRICTED",
            power: "VULNERABLE",
            water: "VULNERABLE",
            hospital: "OPERATIONAL",
            shelter: "LIMITED",
            communications: "SATURATED",
        },

        operations: {
            assessment: false,
            powerProtected: false,
            communicationsProtected: false,
            waterProtected: false,
            hospitalContinuity: false,
            alternateRoute: false,
            shelter: false,
            evacuation: false,
            assistedTransport: false,
            reserve: false,
            contingencyResponse: false,
            recovery: false,
        },
    },

    initialSituation: {
        phase: "INITIAL",
        title: "El territorio está cerca de su límite operativo",
        description:
            "Lluvias prolongadas han combinado inestabilidad de ladera, aumento del nivel del río, interrupciones eléctricas y presión sobre el sistema de agua. El corredor principal está restringido y las comunicaciones se encuentran saturadas.",
        alerts: [
            "1.250 personas están potencialmente expuestas a una combinación de amenazas y pérdida de servicios.",
            "58 personas requieren transporte asistido para una evacuación segura.",
            "La subestación, la planta de agua y el hospital forman una cadena de dependencias críticas.",
            "La capacidad de respuesta es limitada: una segunda contingencia podría superar los recursos disponibles.",
        ],
        objective:
            "Mantén la continuidad territorial, protege a la población, conserva una reserva operativa y responde a una segunda contingencia sin permitir que la crisis se convierta en un efecto dominó.",
    },

    scoring: {
        targets: {
            threat: 25,
            exposure: 20,
            vulnerability: 25,
            resources: 35,
            response: 90,
            protectedPopulation: 1000,
        },
        maxEfficientDecisions: 8,
        weights: {
            riskReduction: 0.20,
            populationProtection: 0.20,
            resourceManagement: 0.15,
            responseCapacity: 0.20,
            efficiency: 0.25,
        },
    },

    decisions: {
        INITIAL: [
            {
                id: "integratedTerritorialAssessment",
                icon: "🛰️",
                label: "Integrar evaluación territorial",
                description:
                    "Cruzar información de ladera, río, energía, agua, hospital, movilidad, comunicaciones y población antes de comprometer la respuesta.",
                effects: { threat: -6, exposure: -5, vulnerability: -4, resources: -3, response: +10 },
                stateChanges: { operations: { assessment: true } },
                nextPhase: "ASSESSMENT",
                consequence:
                    "La emergencia deja de analizarse como incidentes separados. Se identifica la cadena de dependencias que puede llevar al territorio al punto de quiebre.",
            },
            {
                id: "immediateMassEvacuation",
                icon: "🚨",
                label: "Evacuar masivamente de inmediato",
                description:
                    "Priorizar velocidad de evacuación sin completar el diagnóstico de las redes críticas.",
                effects: { threat: -4, exposure: -18, vulnerability: -6, resources: -18, response: +5 },
                stateChanges: {
                    population: { evacuated: 700, safe: 700 },
                    operations: { evacuation: true },
                },
                nextPhase: "ASSESSMENT",
                consequence:
                    "La exposición cae rápidamente, pero la operación consume recursos antes de asegurar agua, energía, comunicaciones y rutas de continuidad.",
            },
            {
                id: "protectHospitalFirst",
                icon: "🏥",
                label: "Concentrar recursos en el hospital",
                description:
                    "Blindar el servicio sanitario como primera prioridad sin resolver todavía sus dependencias territoriales.",
                effects: { threat: -3, exposure: -4, vulnerability: -10, resources: -9, response: +8 },
                stateChanges: {
                    operations: { hospitalContinuity: true },
                    infrastructureState: { hospital: "PROTECTED" },
                },
                nextPhase: "ASSESSMENT",
                consequence:
                    "El hospital mejora su condición, pero la continuidad sigue dependiendo de energía, agua, comunicaciones y acceso.",
            },
        ],

        ASSESSMENT: [
            {
                id: "protectEnergyAndCommunications",
                icon: "⚡",
                label: "Proteger energía y comunicaciones",
                description:
                    "Asegurar la subestación y establecer un canal redundante antes de que la saturación de comunicaciones fragmente la respuesta.",
                isAvailable: () => true,
                effects: { threat: -10, exposure: -10, vulnerability: -7, resources: -8, response: +12 },
                stateChanges: {
                    operations: { powerProtected: true, communicationsProtected: true },
                    infrastructureState: { power: "PROTECTED", communications: "REDUNDANT" },
                },
                nextPhase: "INFRASTRUCTURE",
                consequence:
                    "La operación recupera coordinación y la subestación queda protegida. El hospital y el sistema de agua conservan una base energética más estable.",
            },
            {
                id: "deployFieldTeamsWithoutRedundancy",
                icon: "🚒",
                label: "Desplegar equipos sin crear redundancia",
                description:
                    "Aumentar presencia en campo manteniendo la dependencia del canal principal.",
                isAvailable: () => true,
                effects: { threat: -6, exposure: -6, vulnerability: -5, resources: -8, response: +10 },
                stateChanges: { operations: { powerProtected: true } },
                nextPhase: "INFRASTRUCTURE",
                consequence:
                    "La presencia operativa aumenta, pero la coordinación sigue siendo vulnerable a una interrupción de comunicaciones.",
            },
        ],

        INFRASTRUCTURE: [
            {
                id: "protectWaterAndHealth",
                icon: "💧",
                label: "Proteger agua y continuidad hospitalaria",
                description:
                    "Asegurar la planta de agua y consolidar la continuidad del hospital aprovechando la protección energética y las comunicaciones redundantes.",
                isAvailable: () => true,
                effects: { threat: -9, exposure: -10, vulnerability: -12, resources: -9, response: +12 },
                stateChanges: {
                    operations: { waterProtected: true, hospitalContinuity: true },
                    infrastructureState: { water: "PROTECTED", hospital: "PROTECTED" },
                },
                nextPhase: "CONTINUITY",
                consequence:
                    "Agua y salud quedan protegidos como servicios interdependientes. El territorio conserva las funciones mínimas necesarias para evacuar sin crear una segunda emergencia.",
            },
            {
                id: "protectWaterOnly",
                icon: "💧",
                label: "Priorizar únicamente el abastecimiento de agua",
                description:
                    "Concentrar recursos en la planta de agua sin completar la continuidad hospitalaria.",
                isAvailable: () => true,
                effects: { threat: -6, exposure: -7, vulnerability: -7, resources: -7, response: +8 },
                stateChanges: {
                    operations: { waterProtected: true },
                    infrastructureState: { water: "PROTECTED" },
                },
                nextPhase: "CONTINUITY",
                consequence:
                    "El abastecimiento mejora, pero el hospital conserva dependencias críticas pendientes.",
            },
        ],

        CONTINUITY: [
            {
                id: "establishContingencyRoute",
                icon: "🛣️",
                label: "Habilitar ruta de contingencia",
                description:
                    "Crear un corredor alterno para ambulancias, equipos de respuesta y evacuación antes de que el puente principal pierda capacidad.",
                isAvailable: () => true,
                effects: { threat: -8, exposure: -12, vulnerability: -8, resources: -8, response: +10 },
                stateChanges: {
                    operations: { alternateRoute: true },
                    infrastructureState: { corridor: "CONTINGENCY" },
                },
                nextPhase: "EVACUATION",
                consequence:
                    "El territorio deja de depender del corredor principal. La evacuación y la continuidad de servicios cuentan ahora con una vía de respaldo."
            },
            {
                id: "maintainMainCorridor",
                icon: "🚧",
                label: "Mantener el corredor principal operativo",
                description:
                    "Conservar la vía principal abierta con controles, asumiendo el riesgo de una nueva interrupción.",
                isAvailable: () => true,
                effects: { threat: -4, exposure: -7, vulnerability: -5, resources: -7, response: +7 },
                stateChanges: { infrastructureState: { corridor: "CONTROLLED" } },
                nextPhase: "EVACUATION",
                consequence:
                    "La movilidad inmediata se conserva, pero el sistema continúa dependiendo de un único corredor vulnerable.",
            },
        ],

        EVACUATION: [
            {
                id: "priorityEvacuation",
                icon: "🚑",
                label: "Ejecutar evacuación priorizada y asistida",
                description:
                    "Evacuar primero a las personas más vulnerables, incluyendo las 58 que requieren transporte asistido, utilizando el corredor de contingencia.",
                isAvailable: () => true,
                effects: { threat: -10, exposure: -20, vulnerability: -12, resources: -12, response: +10 },
                stateChanges: {
                    population: { evacuated: 1050, safe: 1050, exposed: 200 },
                    operations: { evacuation: true, assistedTransport: true },
                    infrastructureState: { shelter: "OPERATIONAL" },
                },
                nextPhase: "RESERVE",
                consequence:
                    "La población prioritaria llega a zonas seguras y el sistema de transporte asistido funciona sin bloquear los servicios esenciales. Si el corredor alterno no fue preparado, la evacuación se ejecuta con mayor presión operativa y el riesgo residual permanece.",
            },
            {
                id: "generalEvacuation",
                icon: "👥",
                label: "Ejecutar evacuación general",
                description:
                    "Movilizar una gran cantidad de personas rápidamente, reduciendo la diferenciación por vulnerabilidad.",
                isAvailable: () => true,
                effects: { threat: -7, exposure: -16, vulnerability: -7, resources: -18, response: +7 },
                stateChanges: {
                    population: { evacuated: 900, safe: 900, exposed: 350 },
                    operations: { evacuation: true },
                    infrastructureState: { shelter: "OPERATIONAL" },
                },
                nextPhase: "RESERVE",
                consequence:
                    "La exposición baja considerablemente, pero el consumo de recursos aumenta y algunas necesidades de asistencia quedan pendientes.",
            },
        ],

        RESERVE: [
            {
                id: "preserveOperationalReserve",
                icon: "🛡️",
                label: "Conservar reserva operativa",
                description:
                    "Reducir el despliegue innecesario y reservar capacidad para una segunda contingencia, sin abandonar la protección alcanzada.",
                isAvailable: () => true,
                effects: { threat: -4, exposure: -4, vulnerability: -3, resources: +4, response: +5 },
                stateChanges: { operations: { reserve: true } },
                nextPhase: "SECOND_CONTINGENCY",
                consequence:
                    "La respuesta no se queda sin margen. Una reserva queda disponible para absorber una nueva afectación sin desmontar la operación principal.",
            },
            {
                id: "spendReserveNow",
                icon: "⚠️",
                label: "Consumir la reserva para reducir el riesgo inmediato",
                description:
                    "Usar equipos y recursos adicionales para intentar disminuir todavía más la exposición actual.",
                isAvailable: () => true,
                effects: { threat: -8, exposure: -7, vulnerability: -4, resources: -16, response: +8 },
                stateChanges: { operations: { reserve: false } },
                nextPhase: "SECOND_CONTINGENCY",
                consequence:
                    "La situación inmediata mejora, pero la capacidad disponible para responder a una nueva contingencia se reduce drásticamente.",
            },
        ],

        SECOND_CONTINGENCY: [
            {
                id: "respondWithReserve",
                icon: "🚨",
                label: "Responder a la segunda contingencia con la reserva",
                description:
                    "Un nuevo punto del corredor occidental pierde estabilidad. Desplegar la reserva sin desmontar las medidas de continuidad ya establecidas.",
                isAvailable: () => true,
                effects: { threat: -6, exposure: -6, vulnerability: -5, resources: -8, response: +8 },
                stateChanges: {
                    operations: { contingencyResponse: true },
                    infrastructureState: { corridor: "SECURED" },
                },
                nextPhase: "RECOVERY",
                consequence:
                    "La segunda contingencia es absorbida sin romper la arquitectura de respuesta. El sistema conserva capacidad para pasar de emergencia a recuperación.",
            },
            {
                id: "reallocateCoreTeams",
                icon: "🔄",
                label: "Redistribuir los equipos principales",
                description:
                    "Mover los equipos ya desplegados hacia la nueva afectación y aceptar una reducción de cobertura en los sectores protegidos.",
                isAvailable: () => true,
                effects: { threat: -5, exposure: -5, vulnerability: -3, resources: -14, response: +6 },
                stateChanges: { operations: { contingencyResponse: true } },
                nextPhase: "RECOVERY",
                consequence:
                    "La nueva afectación recibe respuesta, pero la redistribución deja menos margen en los sectores inicialmente protegidos.",
            },
        ],

        RECOVERY: [
            {
                id: "consolidateRecovery",
                icon: "🏁",
                label: "Consolidar recuperación y cerrar la operación",
                description:
                    "Verificar redes críticas, mantener la población protegida, conservar la reserva residual y transferir el territorio hacia una recuperación controlada.",
                isAvailable: (state) => state.operations?.contingencyResponse === true,
                effects: { threat: -8, exposure: -4, vulnerability: -3, resources: +3, response: +4 },
                stateChanges: {
                    operations: { recovery: true },
                    infrastructureState: { corridor: "RECOVERING", communications: "STABLE" },
                },
                nextPhase: "OUTCOME",
                consequence:
                    "La emergencia termina con continuidad territorial, población protegida y capacidad residual para iniciar la recuperación sin quedar operativamente expuestos.",
            },
            {
                id: "remainInEmergencyMode",
                icon: "🛡️",
                label: "Mantener el despliegue de emergencia",
                description:
                    "No cerrar todavía la operación y mantener los equipos en máxima alerta.",
                isAvailable: (state) => state.operations?.contingencyResponse === true,
                effects: { threat: -6, exposure: -3, vulnerability: -2, resources: -10, response: +5 },
                stateChanges: { operations: { recovery: false } },
                nextPhase: "OUTCOME",
                consequence:
                    "La amenaza inmediata permanece contenida, pero el consumo de recursos aumenta y la transición hacia recuperación queda retrasada.",
            },
        ],
    },
};

export default M06;
