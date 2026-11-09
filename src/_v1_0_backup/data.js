export const initialMissions = [
  {
    id: "M-01", module: "Amenazas naturales", title: "Alerta en San Miguel",
    type: "Inspección", level: "Inicial", duration: "12 min", xp: 250,
    description: "Lluvias persistentes, grietas en una ladera y aumento del caudal de un río ponen en alerta a una comunidad.",
    situation: "Durante las últimas 48 horas se han registrado lluvias intensas. Habitantes reportan grietas nuevas en el terreno y caída de pequeños fragmentos de roca. Varias viviendas están ubicadas en la parte baja de la ladera.",
    question: "¿Cuál es la amenaza que debe investigarse prioritariamente?",
    options: ["Sequía prolongada", "Movimiento en masa (deslizamiento)", "Incendio forestal", "Actividad sísmica"],
    answer: 1,
    explanation: "La lluvia acumulada, las grietas y la caída de material son indicios compatibles con un movimiento en masa. La situación requiere evaluación técnica y comunicación con las autoridades competentes.",
    secondQuestion: "¿Qué grupo requiere atención prioritaria al planear una posible evacuación?",
    secondOptions: ["Personas con movilidad reducida y quienes necesitan asistencia", "Únicamente los comerciantes", "Solo las viviendas desocupadas", "Los vehículos particulares"],
    secondAnswer: 0,
    secondExplanation: "La preparación debe considerar las necesidades de apoyo, movilidad y acceso a información de todas las personas, especialmente quienes pueden enfrentar barreras durante una evacuación."
  },
  {
    id: "M-02", module: "Vulnerabilidad y exposición", title: "El barrio junto al río",
    type: "Análisis", level: "Inicial", duration: "10 min", xp: 200,
    description: "Identifica los elementos expuestos y las condiciones que aumentan sus posibles daños.",
    situation: "Un barrio tiene viviendas, una escuela y un centro de salud en una planicie cercana al río. Algunas casas tienen materiales precarios y la única vía de acceso cruza un puente bajo.",
    question: "¿Cuál de estos elementos describe principalmente la exposición?",
    options: ["La fragilidad de las paredes", "La ubicación de viviendas y servicios en la zona inundable", "La falta de simulacros", "La ausencia de radios"],
    answer: 1,
    explanation: "La exposición se refiere a la presencia de personas, infraestructura, bienes o servicios en lugares que podrían verse afectados por una amenaza.",
    secondQuestion: "¿Cuál es un ejemplo claro de vulnerabilidad física?",
    secondOptions: ["Viviendas con estructura poco resistente", "El caudal del río", "La distancia entre dos municipios", "La intensidad de la lluvia"],
    secondAnswer: 0,
    secondExplanation: "La vulnerabilidad expresa condiciones que hacen más susceptibles a los elementos expuestos. Una estructura frágil puede incrementar los daños."
  },
  {
    id: "M-03", module: "Prevención y reducción", title: "Preparar antes de la lluvia",
    type: "Toma de decisiones", level: "Intermedio", duration: "15 min", xp: 300,
    description: "Selecciona acciones preventivas y de reducción del riesgo antes de la temporada de lluvias.",
    situation: "Un municipio ha identificado puntos recurrentes de inundación. El presupuesto es limitado y la temporada de lluvias comenzará en seis semanas.",
    question: "¿Qué combinación representa una medida no estructural de reducción del riesgo?",
    options: ["Construir un muro de contención", "Actualizar mapas de amenaza, reglamentar usos del suelo y capacitar a la comunidad", "Ampliar un puente", "Elevar físicamente una carretera"],
    answer: 1,
    explanation: "La planificación, la regulación del uso del suelo, la educación y la preparación son medidas no estructurales. Las obras físicas son medidas estructurales.",
    secondQuestion: "¿Qué criterio debería orientar la priorización de las acciones?",
    secondOptions: ["Elegir la acción más llamativa", "Priorizar según el análisis del riesgo, la población afectada y la eficacia esperada", "Dividir el presupuesto en partes iguales sin analizar", "Esperar a que ocurra una emergencia"],
    secondAnswer: 1,
    secondExplanation: "La priorización debe basarse en evidencia, reducción esperada del riesgo, factibilidad y protección de personas y servicios esenciales."
  },
  {
    id: "M-04", module: "Preparación y respuesta", title: "Evacuación coordinada",
    type: "Simulación", level: "Intermedio", duration: "18 min", xp: 350,
    description: "Organiza una respuesta inicial, considera rutas y verifica los recursos necesarios.",
    situation: "Una alerta oficial advierte de una posible inundación rápida. Hay un punto de encuentro definido, pero la ruta habitual pasa cerca del cauce.",
    question: "¿Cuál debe ser el primer criterio para elegir una ruta de evacuación?",
    options: ["Que sea la ruta más corta, sin más verificaciones", "Que esté fuera de la zona de peligro y sea segura y accesible", "Que pase por la zona comercial", "Que permita llevar todos los objetos personales"],
    answer: 1,
    explanation: "La ruta debe conducir a un lugar seguro y considerar condiciones actuales, accesibilidad, señalización y orientación de las autoridades.",
    secondQuestion: "¿Qué recurso ayuda a verificar que las personas llegaron al punto de encuentro?",
    secondOptions: ["Un listado de verificación o censo de evacuados", "Una publicación sin confirmar en redes", "Un mapa turístico", "Una estimación visual desde lejos"],
    secondAnswer: 0,
    secondExplanation: "Los listados y procedimientos de conteo ayudan a identificar personas evacuadas y a reportar posibles ausencias a los equipos responsables."
  },
  {
    id: "M-05", module: "Comunicación de emergencias", title: "Mensaje bajo presión",
    type: "Comunicación", level: "Intermedio", duration: "12 min", xp: 250,
    description: "Elabora y selecciona mensajes claros, oportunos y accionables para la comunidad.",
    situation: "Circula un rumor de ruptura de una represa. La autoridad aún está verificando la información. La comunidad comienza a compartir mensajes alarmistas.",
    question: "¿Cuál es la mejor respuesta comunicativa inicial?",
    options: ["Reenviar el rumor para que todos estén atentos", "Publicar información confirmada, indicar qué se está verificando y señalar canales oficiales", "Guardar silencio indefinidamente", "Afirmar que no existe ningún peligro sin evidencia"],
    answer: 1,
    explanation: "La comunicación de riesgo debe ser oportuna, transparente y basada en información verificada. Debe distinguir hechos confirmados de información en verificación.",
    secondQuestion: "¿Qué característica debe tener una instrucción de emergencia?",
    secondOptions: ["Ser ambigua para evitar compromisos", "Indicar claramente quién debe actuar, qué hacer y dónde obtener información", "Usar tecnicismos sin explicación", "Contradecir las instrucciones oficiales"],
    secondAnswer: 1,
    secondExplanation: "Un mensaje útil es claro, específico, accesible y coherente con los protocolos y autoridades responsables."
  },
  {
    id: "M-06", module: "Gestión integral", title: "Consejo municipal en sesión",
    type: "Desafío final", level: "Avanzado", duration: "20 min", xp: 500,
    description: "Integra amenaza, exposición, vulnerabilidad, prevención, preparación y comunicación.",
    situation: "Un municipio andino debe revisar su estrategia frente a lluvias extremas. Hay barrios expuestos, infraestructura crítica y capacidades comunitarias desiguales.",
    question: "¿Qué enfoque ofrece una gestión integral del riesgo?",
    options: ["Actuar únicamente después del desastre", "Combinar conocimiento del riesgo, reducción, preparación, respuesta y recuperación", "Concentrarse solo en comprar equipos", "Delegar toda la responsabilidad a los habitantes"],
    answer: 1,
    explanation: "La gestión integral combina conocimiento y reducción del riesgo con preparación, respuesta y recuperación, articulando actores y capacidades.",
    secondQuestion: "¿Qué evidencia permite mejorar el plan después de un simulacro?",
    secondOptions: ["Solo el número de asistentes", "La evaluación de tiempos, dificultades, cobertura, comunicaciones y acciones de mejora", "Una fotografía del evento", "La cantidad de publicaciones en redes"],
    secondAnswer: 1,
    secondExplanation: "La evaluación posterior debe identificar fortalezas, brechas y acciones correctivas verificables."
  }
];

export const modules = [
  { name: "Amenazas naturales", icon: "🌋", color: "orange", description: "Reconoce fenómenos que pueden causar daños." },
  { name: "Vulnerabilidad y exposición", icon: "🏘️", color: "blue", description: "Analiza personas, bienes y condiciones expuestas." },
  { name: "Prevención y reducción", icon: "🛡️", color: "green", description: "Propón acciones para evitar y reducir riesgos." },
  { name: "Preparación y respuesta", icon: "🚨", color: "red", description: "Organiza recursos, evacuación y respuesta." },
  { name: "Comunicación de emergencias", icon: "📡", color: "purple", description: "Comunica información confiable y accionable." },
  { name: "Gestión integral", icon: "🏆", color: "gold", description: "Integra todo lo aprendido en un desafío final." }
];

export const initialStudents = [
  { id: 1, name: "Valentina Gómez", xp: 1250, completed: 4, reputation: 92 },
  { id: 2, name: "Andrés Ramírez", xp: 980, completed: 3, reputation: 88 },
  { id: 3, name: "Camila Torres", xp: 850, completed: 3, reputation: 95 },
  { id: 4, name: "Santiago López", xp: 620, completed: 2, reputation: 81 },
  { id: 5, name: "Tú", xp: 0, completed: 0, reputation: 100 }
];
