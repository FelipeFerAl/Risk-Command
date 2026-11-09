export const advancedMissionPack = [
  {
    id: "M-01",
    title: "Movimiento en masa",
    subtitle: "Cordillera Andina — escenario académico simulado",
    region: "Colombia",
    difficulty: "Avanzado",
    xp: 220,
    icon: "⛰️",
    tags: ["Amenaza", "Exposición", "Vulnerabilidad", "Incertidumbre"],
    briefing: [
      "En las últimas 72 horas se registran 186 mm de lluvia acumulada.",
      "La ladera presenta una pendiente aproximada de 34°.",
      "Se identifican 42 viviendas y 168 personas potencialmente expuestas.",
      "Hay grietas recientes y evidencias de filtración en el terreno."
    ],
    mission: "Determina una estrategia prudente de gestión del riesgo sin asumir que los datos disponibles demuestran por sí solos una falla inminente.",
    questions: [
      {
        id: "q1", prompt: "¿Cuál es la interpretación técnica más prudente?",
        options: [
          "La falla es inminente y debe evacuarse toda la zona inmediatamente.",
          "La evidencia justifica evaluación especializada y medidas preventivas, pero no demuestra por sí sola una falla inminente.",
          "La lluvia no es relevante mientras las viviendas sigan en pie.",
          "La pendiente permite concluir que no existe riesgo."
        ],
        answer: 1,
        explanation: "La decisión debe reconocer señales de peligro y, al mismo tiempo, la incertidumbre. La caracterización del riesgo requiere integrar amenaza, exposición y vulnerabilidad."
      },
      {
        id: "q2", prompt: "En este caso, ¿qué representa principalmente la exposición?",
        options: [
          "La resistencia de los materiales de las viviendas.",
          "Las 42 viviendas y las 168 personas ubicadas dentro del área potencialmente afectada.",
          "La cantidad de lluvia acumulada.",
          "La existencia de grietas y filtraciones."
        ],
        answer: 1,
        explanation: "La exposición se refiere a personas, bienes, infraestructura u otros elementos ubicados en áreas donde pueden verse afectados."
      },
      {
        id: "q3", prompt: "¿Qué acción sería menos apropiada como primera respuesta técnica?",
        options: [
          "Solicitar inspección especializada y verificar señales de movimiento.",
          "Delimitar zonas de precaución y preparar comunicación a la comunidad.",
          "Enviar personal no especializado a excavar o modificar la ladera sin evaluación.",
          "Actualizar la información sobre viviendas y personas expuestas."
        ],
        answer: 2,
        explanation: "Intervenir físicamente una ladera sin evaluación puede aumentar el peligro. La primera respuesta debe reducir incertidumbre y exposición sin crear nuevas condiciones de riesgo."
      }
    ]
  },
  {
    id: "M-02",
    title: "Inundación y vulnerabilidad",
    subtitle: "Cuenca urbana — escenario académico simulado",
    region: "Colombia",
    difficulty: "Avanzado",
    xp: 240,
    icon: "🌊",
    tags: ["Exposición", "Vulnerabilidad", "Capacidad"],
    briefing: [
      "La zona de estudio tiene 1.240 personas y 310 viviendas de un piso.",
      "El 27% de las viviendas presenta materiales considerados precarios para el escenario.",
      "Una institución educativa atiende a 420 estudiantes.",
      "Un centro de salud presta atención continua."
    ],
    mission: "Prioriza acciones que permitan disminuir consecuencias potenciales y fortalecer la capacidad de preparación y respuesta.",
    questions: [
      {
        id: "q1", prompt: "¿Qué afirmación distingue mejor exposición de vulnerabilidad?",
        options: [
          "Exposición y vulnerabilidad son sinónimos.",
          "Exposición identifica qué está ubicado en el área de peligro; vulnerabilidad describe condiciones que pueden aumentar el daño.",
          "Vulnerabilidad solo depende de la altura de la inundación.",
          "Exposición solo incluye personas, nunca infraestructura."
        ],
        answer: 1,
        explanation: "Separar ambos conceptos ayuda a elegir medidas: reducir exposición, disminuir vulnerabilidad y fortalecer capacidades son líneas de acción distintas."
      },
      {
        id: "q2", prompt: "¿Qué prioridad tiene mayor sentido para una estrategia inicial?",
        options: [
          "Instalar señalización decorativa sin actualizar rutas.",
          "Combinar identificación de zonas expuestas, rutas seguras, protección de servicios críticos y preparación comunitaria.",
          "Esperar a que ocurra una inundación para definir responsables.",
          "Concentrar toda la estrategia en una sola vivienda."
        ],
        answer: 1,
        explanation: "Una gestión integral combina conocimiento del riesgo, reducción, preparación y coordinación."
      },
      {
        id: "q3", prompt: "¿Qué dato adicional sería especialmente útil para afinar la priorización?",
        options: [
          "Color de las fachadas.",
          "Mapas de inundación, cotas, población vulnerable y ubicación de servicios críticos.",
          "Marca de los teléfonos celulares.",
          "Preferencias musicales de los habitantes."
        ],
        answer: 1,
        explanation: "La decisión mejora cuando se integran amenaza, exposición, vulnerabilidad y capacidades con información espacial."
      }
    ]
  },
  {
    id: "M-03",
    title: "Reducción del riesgo y presupuesto",
    subtitle: "Municipio intermedio — escenario académico simulado",
    region: "Colombia",
    difficulty: "Experto",
    xp: 280,
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
    questions: [
      {
        id: "q1", prompt: "¿Cuál debería ser un criterio central para decidir la inversión?",
        options: [
          "Elegir siempre la medida de mayor costo.",
          "Comparar reducción esperada del riesgo, población beneficiada, factibilidad, tiempo de implementación y riesgo residual.",
          "Invertir únicamente en comunicación.",
          "Usar el presupuesto completo sin importar el resultado."
        ],
        answer: 1,
        explanation: "La gestión del riesgo requiere priorización basada en evidencia, impacto, factibilidad y riesgo residual."
      },
      {
        id: "q2", prompt: "¿Cuál sería un indicador de resultado más útil?",
        options: [
          "Número de reuniones realizadas, sin más contexto.",
          "Reducción estimada de personas expuestas o mejora verificable de tiempos de alerta y evacuación.",
          "Cantidad de documentos impresos.",
          "Número de computadores comprados."
        ],
        answer: 1,
        explanation: "Los indicadores deben conectar recursos con cambios observables en las condiciones de riesgo o en la capacidad de respuesta."
      },
      {
        id: "q3", prompt: "Después de implementar medidas, ¿qué significa riesgo residual?",
        options: [
          "Que el riesgo desaparece por completo.",
          "El riesgo que permanece después de las medidas implementadas.",
          "El presupuesto que no se gastó.",
          "La amenaza que deja de existir."
        ],
        answer: 1,
        explanation: "La reducción del riesgo no implica necesariamente eliminarlo; por eso la preparación y la respuesta siguen siendo necesarias."
      }
    ]
  },
  {
    id: "M-04",
    title: "Continuidad y respuesta",
    subtitle: "Corredor logístico — escenario académico simulado",
    region: "Escenario internacional",
    difficulty: "Experto",
    xp: 300,
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
    questions: [
      {
        id: "q1", prompt: "Antes de dirigir a toda la población por la ruta alterna, ¿qué debe verificarse?",
        options: [
          "Solo el tiempo estimado de viaje.",
          "Estado, capacidad, restricciones, puntos de control y condiciones dinámicas de la ruta.",
          "Que todos tengan vehículo propio.",
          "Que la ruta sea la más corta en el mapa."
        ],
        answer: 1,
        explanation: "Una ruta operativa debe evaluarse por seguridad, capacidad y condiciones reales, no solo por distancia."
      },
      {
        id: "q2", prompt: "¿Qué enfoque favorece la continuidad del servicio de salud?",
        options: [
          "Evacuar al personal sin establecer reemplazos.",
          "Definir prioridades, personal mínimo, suministros, comunicación y alternativa de atención.",
          "Suspender toda comunicación para evitar rumores.",
          "Trasladar pacientes sin clasificación."
        ],
        answer: 1,
        explanation: "La continuidad exige anticipar funciones críticas, recursos y alternativas."
      },
      {
        id: "q3", prompt: "¿Qué grupo requiere una planificación diferenciada?",
        options: [
          "Solo las personas con vehículo.",
          "Personas con movilidad, comunicación o necesidades de asistencia particulares.",
          "Solo los líderes institucionales.",
          "Ningún grupo."
        ],
        answer: 1,
        explanation: "La evacuación inclusiva debe considerar barreras de movilidad, comunicación, acceso a información y apoyos requeridos."
      }
    ]
  },
  {
    id: "M-05",
    title: "Comunicación del riesgo",
    subtitle: "Red de información — escenario académico simulado",
    region: "Escenario internacional",
    difficulty: "Avanzado",
    xp: 260,
    icon: "📡",
    tags: ["Comunicación", "Incertidumbre", "Desinformación", "Accesibilidad"],
    briefing: [
      "Circula un audio viral sin fuente verificable.",
      "Dos sensores entregan lecturas diferentes.",
      "Las autoridades disponen de web, radio y mensajería.",
      "Existe población con barreras de idioma y brecha digital.",
      "La próxima actualización técnica está prevista en 30 minutos."
    ],
    mission: "Redacta una estrategia de comunicación que preserve la confianza sin ocultar incertidumbre ni amplificar información no verificada.",
    questions: [
      {
        id: "q1", prompt: "¿Cómo comunicar la discrepancia entre sensores?",
        options: [
          "Ocultarla para evitar preguntas.",
          "Explicar que existe incertidumbre, indicar qué se conoce, qué no se conoce y cuándo habrá actualización.",
          "Elegir el dato más alto sin revisión.",
          "Compartir ambos valores sin contexto."
        ],
        answer: 1,
        explanation: "Comunicar incertidumbre de forma transparente ayuda a mantener confianza y permite tomar decisiones informadas."
      },
      {
        id: "q2", prompt: "¿Qué acción ayuda a reducir el impacto del audio no verificado?",
        options: [
          "Reenviarlo para advertir a todos.",
          "Contrastar, emitir información oficial clara y ofrecer un canal para verificar rumores.",
          "Ignorarlo siempre.",
          "Eliminar cualquier comentario ciudadano."
        ],
        answer: 1,
        explanation: "La respuesta debe reducir la circulación de información falsa sin romper los canales de participación."
      },
      {
        id: "q3", prompt: "¿Qué principio es clave para una población con brecha digital o barreras de idioma?",
        options: [
          "Usar exclusivamente una aplicación móvil.",
          "Combinar canales y formatos accesibles, incluyendo medios comunitarios y lenguaje comprensible.",
          "Publicar únicamente documentos técnicos.",
          "Esperar a que la población traduzca la información."
        ],
        answer: 1,
        explanation: "La accesibilidad es parte de una comunicación efectiva del riesgo."
      }
    ]
  },
  {
    id: "M-06",
    title: "Gestión integral y riesgo multiamenaza",
    subtitle: "Consejo territorial — escenario académico simulado",
    region: "Escenario internacional",
    difficulty: "Experto",
    xp: 340,
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
