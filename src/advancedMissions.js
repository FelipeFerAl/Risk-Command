export const advancedMissionPack = [
  {
    id: "M-01",
    title: "Movimiento en masa",
    subtitle: "Cordillera Andina — escenario académico simulado",
    region: "Colombia",
    difficulty: "Básico",
    maxXP: 220,
    icon: "⛰️",
    tags: ["Amenaza", "Exposición", "Vulnerabilidad", "Incertidumbre"],
    briefing: [
      "En las últimas 72 horas se registran 186 mm de lluvia acumulada.",
      "La ladera presenta una pendiente aproximada de 34°.",
      "Se identifican 42 viviendas y 168 personas potencialmente expuestas.",
      "Hay grietas recientes y evidencias de filtración en el terreno."
    ],
    mission: "Determina una estrategia prudente de gestión del riesgo sin asumir que los datos disponibles demuestran por sí solos una falla inminente.",
  },
  {
    id: "M-02",
    title: "Inundación y vulnerabilidad",
    subtitle: "Cuenca urbana — escenario académico simulado",
    region: "Colombia",
    difficulty: "Básico",
    maxXP: 240,
    icon: "🌊",
    tags: ["Exposición", "Vulnerabilidad", "Capacidad"],
    briefing: [
      "La zona de estudio tiene 1.240 personas y 310 viviendas de un piso.",
      "El 27% de las viviendas presenta materiales considerados precarios para el escenario.",
      "Una institución educativa atiende a 420 estudiantes.",
      "Un centro de salud presta atención continua."
    ],
    mission: "Prioriza acciones que permitan disminuir consecuencias potenciales y fortalecer la capacidad de preparación y respuesta.",
  },
  {
    id: "M-03",
    title: "Reducción del riesgo y presupuesto",
    subtitle: "Municipio intermedio — escenario académico simulado",
    region: "Colombia",
    difficulty: "Avanzado",
    maxXP: 280,
    icon: "💰",
    tags: ["Reducción", "Presupuesto", "Medidas", "Riesgo residual"],
    briefing: [
      "Presupuesto anual disponible: 1.200 millones COP.",
      "Mantenimiento de drenajes: 180 millones COP.",
      "Sistema de alerta y comunicación: 260 millones COP.",
      "Programa de reubicación voluntaria: 620 millones COP.",
      "Estudios y cartografía: 140 millones COP."
    ],
    mission: "Construye una cartera de intervención justificando cómo equilibrar reducción del riesgo, conocimiento, preparación y recursos limitados.",
  },
  {
    id: "M-04",
    title: "Continuidad y respuesta",
    subtitle: "Corredor logístico — escenario académico simulado",
    region: "Escenario internacional",
    difficulty: "Avanzado",
    maxXP: 300,
    icon: "🚑",
    tags: ["Continuidad", "Evacuación", "Logística", "Coordinación"],
    briefing: [
      "Un puente constituye el principal acceso a una comunidad.",
      "La ruta alterna aumenta el recorrido en 18 km y tiene capacidad limitada.",
      "Un centro local de salud debe mantener servicios esenciales.",
      "Hay 23 personas que requieren transporte asistido.",
      "La telefonía es intermitente; existe una red de radio comunitaria."
    ],
    mission: "Diseña una secuencia de decisiones que mantenga servicios esenciales y permita una evacuación segura bajo restricciones logísticas.",
  },
{
    id: "M-05",
    title: "Crisis en cascada",
    subtitle: "Corredor metropolitano y cuenca baja — escenario académico simulado",
    region: "Colombia",
    difficulty: "Experto",
    maxXP: 360,
    icon: "⚡",
    tags: ["Multiamenaza", "Continuidad", "Resiliencia", "Evacuación"],
    briefing: [
        "Una ladera inestable y el ascenso del río amenazan simultáneamente el corredor.",
        "La misma zona concentra una subestación y una planta de tratamiento de agua.",
        "El hospital continúa operativo, pero depende de energía, agua y acceso.",
        "1.200 personas están potencialmente expuestas y 46 requieren transporte asistido.",
        "La comunicación principal es frágil y debe existir redundancia antes de una evacuación masiva."
    ],
    mission: "Controla una crisis multiamenaza evitando que una falla desencadene otra, protege las redes críticas y ejecuta una evacuación priorizada.",
    questions: []
},
  {
    id: "M-06",
    title: "Punto de quiebre",
    subtitle: "Decisiones estratégicas bajo incertidumbre",
    difficulty: "Experto",
    maxXP: 380,
    icon: "🧭",
    tags: ["Multiamenaza", "Gobernanza", "Preparación", "Recuperación"],
    briefing: [
      "El territorio enfrenta escenarios de inundación, incendio forestal y sismo.",
      "Los servicios críticos incluyen hospital, agua y energía.",
      "Los planes institucionales presentan información desactualizada.",
      "Existen seis organizaciones comunitarias activas.",
      "El presupuesto anual de gestión del riesgo es de 2.000 millones COP."
    ],
    mission: "Propón una estrategia integrada que conecte conocimiento del riesgo, gobernanza, reducción, preparación y recuperación.",
    questions: [
      {
        id: "q1", prompt: "¿Qué caracteriza mejor la gestión integral del riesgo?",
        options: [
          "Responder únicamente cuando ocurre una emergencia.",
          "Articular conocimiento, reducción, preparación, respuesta, recuperación y coordinación entre actores.",
          "Comprar equipos sin actualizar planes.",
          "Delegar toda la responsabilidad a la comunidad."
        ],
        answer: 1,
        explanation: "La gestión integral conecta las diferentes etapas y actores, evitando trabajar cada amenaza como un problema aislado."
      },
      {
        id: "q2", prompt: "¿Qué indicador institucional sería más significativo?",
        options: [
          "Cantidad de documentos archivados.",
          "Porcentaje de planes actualizados, ejercicios realizados, acciones correctivas cerradas y tiempos de respuesta verificados.",
          "Número de correos enviados.",
          "Cantidad de reuniones sin seguimiento."
        ],
        answer: 1,
        explanation: "La capacidad institucional debe medirse por preparación verificable y mejora continua."
      },
      {
        id: "q3", prompt: "Después de un simulacro, ¿cuál es la mejor práctica?",
        options: [
          "Cerrar el proceso porque el simulacro terminó.",
          "Documentar hallazgos, asignar responsables, corregir brechas y repetir la verificación.",
          "Guardar el informe sin acciones.",
          "Cambiar todo el plan sin analizar evidencias."
        ],
        answer: 1,
        explanation: "El ciclo de mejora convierte el ejercicio en aprendizaje institucional."
      }
    ]
  }
];
