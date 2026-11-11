import {
    AlertTriangle,
    Crosshair,
    Target,
    Clock3,
    Radio,
} from "lucide-react";

export default function ScenarioBriefing({
    scenarioState,
    scenarioPhase,
    lastDecision,
}) {
    const state = scenarioState || {};

    const phaseContent = {
        INITIAL: {
            title: "Alerta en la ladera",
            description:
                "Las lluvias acumuladas han incrementado la inestabilidad de la ladera ubicada sobre una zona residencial y una vía estratégica.",
            bullets: [
                "Se detectan nuevas grietas en la parte superior de la ladera.",
                "Varias viviendas se encuentran dentro del área potencialmente afectada.",
                "La carretera continúa operativa y concentra tráfico local.",
            ],
            objective:
                "Reducir el riesgo para la población sin comprometer innecesariamente la movilidad y los recursos disponibles.",
        },

        EVACUATION: {
            title: "Evacuación en curso",
            description:
                "La población expuesta está siendo movilizada mientras aumenta la presión operativa sobre los recursos disponibles.",
            bullets: [
                "La exposición poblacional comienza a disminuir.",
                "Se requiere coordinación para evitar desorganización durante la evacuación.",
                "La amenaza de movimiento en masa continúa presente.",
            ],
            objective:
                "Proteger a la población manteniendo capacidad suficiente para responder ante una evolución desfavorable.",
        },

        ROAD_CLOSED: {
            title: "Vía comprometida",
            description:
                "La carretera ha sido cerrada preventivamente debido al incremento de la amenaza sobre el corredor.",
            bullets: [
                "El tránsito queda restringido.",
                "La exposición asociada a la movilidad disminuye.",
                "La conectividad territorial empieza a verse afectada.",
            ],
            objective:
                "Controlar la exposición sin perder capacidad de respuesta y acceso a la zona.",
        },

        STABILIZATION: {
            title: "Estabilización prioritaria",
            description:
                "Los recursos operativos comienzan a concentrarse en reducir las condiciones que favorecen la inestabilidad.",
            bullets: [
                "Se requiere monitoreo permanente de la ladera.",
                "La capacidad disponible comienza a redistribuirse.",
                "Las condiciones pueden cambiar rápidamente ante nuevas lluvias.",
            ],
            objective:
                "Reducir la amenaza y mantener vigilancia suficiente para detectar cambios críticos.",
        },

        MONITORING: {
            title: "Monitoreo activo",
            description:
                "La zona permanece bajo vigilancia mientras se recopila información para orientar las siguientes decisiones.",
            bullets: [
                "Los sensores y equipos de monitoreo permanecen activos.",
                "La amenaza todavía requiere seguimiento.",
                "La información disponible permite ajustar la respuesta.",
            ],
            objective:
                "Mantener control de la situación y anticipar una posible escalada del escenario.",
        },

        RESPONSE: {
            title: "Respuesta operativa",
            description:
                "Los equipos de respuesta han sido activados y comienzan a operar sobre el territorio.",
            bullets: [
                "La capacidad de respuesta está siendo utilizada.",
                "La población requiere coordinación permanente.",
                "La evolución de la amenaza determinará las siguientes acciones.",
            ],
            objective:
                "Coordinar recursos y población para mantener el riesgo bajo control.",
        },

        ALERT: {
            title: "Alerta máxima",
            description:
                "La combinación de amenaza, exposición y capacidad disponible exige una respuesta inmediata y coordinada.",
            bullets: [
                "La situación presenta condiciones críticas.",
                "Los recursos disponibles deben priorizarse cuidadosamente.",
                "Una nueva decisión puede modificar significativamente el escenario.",
            ],
            objective:
                "Evitar una escalada del riesgo y proteger la población priorizando las acciones críticas.",
        },
    };

    const content = phaseContent[scenarioPhase] || phaseContent.INITIAL;

    return (
        <section className="scenario-briefing">

            <div className="scenario-briefing-main">

                <div className="scenario-briefing-title">
                    <div className="scenario-icon">
                        <AlertTriangle size={20} />
                    </div>

                    <div>
                        <div className="eyebrow">SITUACIÓN ACTUAL</div>
                        <h3>{content.title}</h3>
                    </div>
                </div>

                <p className="scenario-description">
                    {lastDecision?.consequence || content.description}
                </p>

                <div className="scenario-bullets">
                    {content.bullets.map((bullet, index) => (
                        <div className="scenario-bullet" key={index}>
                            <span />
                            <p>{bullet}</p>
                        </div>
                    ))}
                </div>

            </div>

            <div className="scenario-objective">

                <div className="objective-header">
                    <Target size={18} />
                    <span>OBJETIVO OPERATIVO</span>
                </div>

                <p>{content.objective}</p>

            </div>

            <div className="scenario-mini-status">

                <div>
                    <Clock3 size={16} />
                    <span>TIEMPO</span>
                    <strong>{state.time ?? 0} h</strong>
                </div>

                <div>
                    <Crosshair size={16} />
                    <span>MOVILIDAD</span>
                    <strong>{state.mobility ?? 0}%</strong>
                </div>

                <div>
                    <Radio size={16} />
                    <span>PRESIÓN PÚBLICA</span>
                    <strong>{state.publicPressure ?? 0}%</strong>
                </div>

            </div>

        </section>
    );
}