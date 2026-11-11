import React, { useState } from "react";
import { ChevronDown, Info, Target } from "lucide-react";

export default function MissionBriefing({ mission }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!mission) return null;

    const briefing = Array.isArray(mission.briefing)
        ? mission.briefing
        : [];

    return (
        <section className={`mission-briefing ${isOpen ? "open" : ""}`}>

            <button
                type="button"
                className="mission-briefing-toggle"
                onClick={() => setIsOpen((value) => !value)}
                aria-expanded={isOpen}
            >

                <div className="mission-briefing-toggle-left">

                    <div className="mission-briefing-icon">
                        <Info size={17} />
                    </div>

                    <div>
                        <div className="eyebrow">
                            INFORMACIÓN DE OPERACIÓN
                        </div>

                        <strong>
                            Resumen de la misión
                        </strong>
                    </div>

                </div>

                <ChevronDown
                    size={19}
                    className="mission-briefing-chevron"
                />

            </button>

            <div className="mission-briefing-content">

                {briefing.length > 0 && (
                    <div className="mission-briefing-section">

                        <div className="mission-briefing-section-title">
                            <Info size={15} />
                            <span>CONTEXTO</span>
                        </div>

                        <ul>
                            {briefing.map((item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            ))}
                        </ul>

                    </div>
                )}

                {mission.mission && (
                    <div className="mission-briefing-objective">

                        <div className="mission-briefing-section-title">
                            <Target size={15} />
                            <span>OBJETIVO DE LA OPERACIÓN</span>
                        </div>

                        <p>
                            {mission.mission}
                        </p>

                    </div>
                )}

            </div>

        </section>
    );
}