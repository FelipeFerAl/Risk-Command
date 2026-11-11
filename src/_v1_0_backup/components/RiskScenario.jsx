import React from "react";

export default function RiskScenario({
    scenarioState,
    scenarioPhase,
}) {
    const {
        threat = 0,
        exposure = 0,
        vulnerability = 0,
        resources = 0,
        response = 0,
    } = scenarioState || {};

    const evacuation =
        ["EVACUATION", "RESPONSE", "ALERT"].includes(scenarioPhase);

    const roadClosed =
        ["ROAD_CLOSED", "STABILIZATION", "MONITORING", "RESPONSE", "ALERT"]
            .includes(scenarioPhase);

    const stabilization =
        ["STABILIZATION", "MONITORING"].includes(scenarioPhase);

    const responseActive =
        ["RESPONSE", "ALERT"].includes(scenarioPhase);

    return (
        <section className="risk-scenario">

            <div className="risk-scenario-header">
                <div>
                    <div className="eyebrow">ESCENARIO OPERATIVO</div>
                    <h2>Sector Andino — Ladera Norte</h2>
                </div>

                <div className="scenario-phase">
                    FASE {scenarioPhase}
                </div>
            </div>

            <div className="risk-landscape">

                <div className="rain-cloud cloud-one">☁️</div>
                <div className="rain-cloud cloud-two">☁️</div>

                <div className="mountain mountain-back">
                    <div className="mountain-slope" />
                </div>

                <div className="mountain mountain-front">
                    <div className="landslide-zone">
                        <span>⚠</span>
                        <small>ÁREA INESTABLE</small>
                    </div>
                </div>

                <div className="house house-one">🏠</div>
                <div className="house house-two">🏠</div>
                <div className="house house-three">🏠</div>

                {evacuation && (
                    <div className="evacuation-zone">
                        <span>👥</span>
                        <small>EVACUACIÓN ACTIVA</small>
                    </div>
                )}

                <div className={`road ${roadClosed ? "closed" : ""}`}>
                    <span>CARRETERA PRINCIPAL</span>
                </div>

                {roadClosed && (
                    <div className="road-block">
                        🚧
                        <small>VÍA CERRADA</small>
                    </div>
                )}

                {stabilization && (
                    <div className="monitoring-unit">
                        📡
                        <small>MONITOREO</small>
                    </div>
                )}

                {responseActive && (
                    <div className="response-unit">
                        🚑
                        <small>RESPUESTA</small>
                    </div>
                )}

                <div className="scenario-alert">
                    <span>⚠</span>
                    AMENAZA {threat}%
                </div>
            </div>

            <div className="scenario-status">

                <div>
                    <span>EXPOSICIÓN</span>
                    <strong>{exposure}%</strong>
                </div>

                <div>
                    <span>VULNERABILIDAD</span>
                    <strong>{vulnerability}%</strong>
                </div>

                <div>
                    <span>RECURSOS</span>
                    <strong>{resources}%</strong>
                </div>

                <div>
                    <span>RESPUESTA</span>
                    <strong>{response}%</strong>
                </div>

            </div>

        </section>
    );
}