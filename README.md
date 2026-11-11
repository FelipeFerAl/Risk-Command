# RISK COMMAND --- Gamificador de Gestión del Riesgo

> **Versión de referencia:** 1.2.1 / interfaz y flujo de misión v1.3\
> **Tipo de proyecto:** aplicación web académica interactiva\
> **Stack principal:** React 18 + Vite + JavaScript + Supabase\
> **Propósito:** entrenamiento y evaluación mediante escenarios
> simulados de Gestión del Riesgo.

------------------------------------------------------------------------

## 1. Descripción general

**RISK COMMAND** es un gamificador académico diseñado para convertir
conceptos de Gestión del Riesgo en una experiencia de toma de
decisiones.

El estudiante asume el papel de responsable de una operación y debe
analizar una situación, seleccionar acciones, observar sus consecuencias
y llevar el escenario hacia una condición operacionalmente segura.

La aplicación combina:

-   autenticación de estudiantes;
-   perfil individual;
-   experiencia acumulada (**XP**);
-   rangos de progreso;
-   seis misiones interactivas;
-   mapas operacionales específicos por misión;
-   HUD de operación;
-   decisiones con consecuencias sobre el estado del escenario;
-   evaluación automática;
-   puntuación de 0 a 100;
-   desglose del puntaje;
-   recompensas de XP;
-   historial de intentos;
-   mejores puntajes por misión;
-   tabla de clasificación;
-   persistencia local como modo de respaldo;
-   persistencia centralizada mediante Supabase.

Los escenarios son **simulados y académicos**. Los datos numéricos no
representan mediciones oficiales ni deben utilizarse como información
para tomar decisiones reales de emergencia.

------------------------------------------------------------------------

# 2. Objetivos pedagógicos

El gamificador busca que el estudiante no se limite a memorizar
conceptos, sino que practique criterios de decisión relacionados con:

-   amenaza;
-   exposición;
-   vulnerabilidad;
-   reducción del riesgo;
-   protección de población;
-   capacidad de respuesta;
-   continuidad de servicios;
-   gestión de recursos;
-   presupuesto;
-   coordinación;
-   comunicación;
-   evacuación;
-   resiliencia;
-   gobernanza;
-   recuperación;
-   toma de decisiones bajo incertidumbre.

Un principio central del diseño es que **no toda acción aparentemente
urgente es necesariamente la mejor acción**. Las decisiones modifican el
estado del escenario y pueden generar consecuencias positivas o
negativas.

------------------------------------------------------------------------

# 3. Misiones disponibles

  --------------------------------------------------------------------------------
  ID           Misión                 Dificultad        XP máximo Enfoque
                                                                  principal
  ------------ ---------------- ---------------- ---------------- ----------------
  M-01         Movimiento en              Básico              220 Amenaza,
               masa                                               exposición,
                                                                  vulnerabilidad e
                                                                  incertidumbre

  M-02         Inundación y               Básico              240 Exposición,
               vulnerabilidad                                     vulnerabilidad y
                                                                  capacidad

  M-03         Reducción del            Avanzado              280 Reducción,
               riesgo y                                           presupuesto y
               presupuesto                                        riesgo residual

  M-04         Continuidad y            Avanzado              300 Continuidad,
               respuesta                                          evacuación,
                                                                  logística y
                                                                  coordinación

  M-05         Crisis en                 Experto              360 Multiamenaza,
               cascada                                            continuidad,
                                                                  resiliencia y
                                                                  evacuación

  M-06         Punto de quiebre          Experto              380 Multiamenaza,
                                                                  gobernanza,
                                                                  preparación y
                                                                  recuperación
  --------------------------------------------------------------------------------

La progresión está planteada para que el estudiante pase de escenarios
centrados en variables individuales a situaciones donde las decisiones
están acopladas y una falla puede desencadenar otras.

------------------------------------------------------------------------

# 4. Arquitectura general

``` text
                         ┌───────────────────────┐
                         │       RISK COMMAND    │
                         │      React + Vite     │
                         └───────────┬───────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
          Modo local                              Modo Supabase
                 │                                       │
          localStorage                         Supabase REST/Auth
                 │                                       │
                 │                    ┌──────────────────┼─────────────────┐
                 │                    │                  │                 │
                 │               Auth / usuarios      PostgreSQL         RPC
                 │                    │                  │                 │
                 │                    │              perfiles/            │
                 │                    │              misiones/             │
                 │                    │              intentos              │
                 │                    │                                    │
                 └────────────────────┴────────────────────────────────────┘
                                      │
                              Motor de escenarios
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
          scenarioEngine       scoringEngine       scenarioEvaluator
                 │                    │                    │
          estado + decisiones      score 0–100       resultado operativo
                 │                    │                    │
                 └────────────────────┴────────────────────┘
                                      │
                              Interfaz de misión
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
             Command HUD        Operational Map      Decision Center
                 │                    │                    │
                 └────────────────────┴────────────────────┘
```

------------------------------------------------------------------------

# 5. Estructura del proyecto

``` text
risk-command/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
│
├── supabase/
│   └── schema.sql
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── advancedMissions.js
    ├── styles.css
    │
    ├── components/
    │   ├── CommandHUDs/
    │   │   ├── CommandHUDM01.jsx
    │   │   ├── CommandHUDM02.jsx
    │   │   ├── CommandHUDM03.jsx
    │   │   ├── CommandHUDM04.jsx
    │   │   ├── CommandHUDM05.jsx
    │   │   └── CommandHUDM06.jsx
    │   │
    │   ├── OperationalMaps/
    │   │   ├── OperationalMapM01.jsx
    │   │   ├── OperationalMapM02.jsx
    │   │   ├── OperationalMapM03.jsx
    │   │   ├── OperationalMapM04.jsx
    │   │   ├── OperationalMapM05.jsx
    │   │   └── OperationalMapM06.jsx
    │   │
    │   ├── Debrief.jsx
    │   ├── DecisionCenter.jsx
    │   ├── DecisionFeedback.jsx
    │   ├── DecisionPanel.jsx
    │   ├── MissionReward.jsx
    │   ├── MissionScene.jsx
    │   ├── RiskScenario.jsx
    │   ├── ScenarioBriefing.jsx
    │   ├── ScenarioFeedback.jsx
    │   └── ScorePanel.jsx
    │
    ├── data/
    │   └── scenarios/
    │       ├── index.js
    │       ├── M01.js
    │       ├── M02.js
    │       ├── M03.js
    │       ├── M04.js
    │       ├── M05.js
    │       └── M06.js
    │
    ├── engine/
    │   ├── scenarioEngine.js
    │   ├── scenarioEvaluator.js
    │   └── scoringEngine.js
    │
    └── lib/
        └── supabaseApi.js
```

------------------------------------------------------------------------

# 6. Responsabilidad de cada capa

## 6.1 `App.jsx`

Es el orquestador principal de la aplicación.

Gestiona:

-   autenticación;
-   sesión;
-   perfil;
-   dashboard;
-   selección de misión;
-   estado actual del escenario;
-   historial de decisiones;
-   finalización de misión;
-   cálculo del resultado;
-   actualización de XP;
-   leaderboard;
-   persistencia local o Supabase.

También selecciona dinámicamente el HUD y el mapa correspondientes a
cada misión.

------------------------------------------------------------------------

## 6.2 Datos de las misiones

Los escenarios se encuentran en:

``` text
src/data/scenarios/
```

Cada misión define, entre otros elementos:

-   identificación;
-   título;
-   situación inicial;
-   estado inicial;
-   fases;
-   decisiones disponibles;
-   efectos;
-   cambios de estado;
-   consecuencias;
-   objetivos de puntuación;
-   pesos de las categorías;
-   condiciones de presupuesto cuando corresponda.

La carga centralizada se realiza desde:

``` text
src/data/scenarios/index.js
```

------------------------------------------------------------------------

# 7. Motor de escenarios

El archivo:

``` text
src/engine/scenarioEngine.js
```

implementa la lógica común de simulación.

### Funciones principales

### `createInitialScenarioState()`

Crea una copia independiente del estado inicial de la misión.

### `getAvailableDecisions()`

Determina qué decisiones pueden mostrarse en una fase determinada.

También considera:

-   restricciones presupuestarias;
-   condiciones personalizadas de disponibilidad;
-   fase actual.

### `applyDecision()`

Aplica una decisión al escenario.

Puede modificar:

-   amenaza;
-   exposición;
-   vulnerabilidad;
-   recursos;
-   capacidad de respuesta;
-   movilidad;
-   presión pública;
-   población;
-   presupuesto;
-   operaciones;
-   infraestructura;
-   otros estados definidos por cada misión.

### `buildDecisionRecord()`

Construye un registro de la decisión incluyendo:

-   decisión seleccionada;
-   fase anterior;
-   fase posterior;
-   estado antes;
-   estado después;
-   efectos;
-   cambios;
-   consecuencia;
-   timestamp.

Esto permite conservar la trayectoria de la operación y utilizarla
durante el cálculo de la puntuación.

------------------------------------------------------------------------

# 8. Sistema de puntuación

El archivo principal es:

``` text
src/engine/scoringEngine.js
```

La puntuación final se normaliza a:

``` text
0 – 100
```

La arquitectura de scoring contempla cinco dimensiones generales:

``` text
Reducción del riesgo
Protección de la población
Gestión de recursos
Capacidad de respuesta
Eficiencia operativa
```

M-03 incorpora además:

``` text
Gestión presupuestaria
```

La puntuación de una misión se calcula utilizando objetivos y pesos
definidos dentro de cada escenario.

De forma conceptual:

``` text
Score =
    Risk Reduction
  + Population Protection
  + Resource Management
  + Response Capacity
  + Efficiency
  + Budget Management (cuando aplica)
```

Los pesos no tienen que ser iguales. Cada misión puede definir su propia
distribución para reflejar el aprendizaje esperado.

------------------------------------------------------------------------

# 9. Eficiencia y trayectoria

El sistema no evalúa únicamente el estado final.

También puede considerar:

-   número de decisiones;
-   deterioro durante la operación;
-   riesgo máximo alcanzado;
-   recursos restantes;
-   población protegida;
-   capacidad de respuesta;
-   evolución del escenario.

Esto permite distinguir entre:

``` text
Una operación que termina bien después de una trayectoria razonable
```

y

``` text
Una operación que termina aceptablemente después de haber generado
deterioros innecesarios.
```

------------------------------------------------------------------------

# 10. Evaluación del escenario

`scenarioEvaluator.js` convierte el resultado numérico y el estado final
en una interpretación operacional.

Los estados generales son:

``` text
EXCELLENT
SUCCESS
PARTIAL
FAILURE
```

Esto permite que la aplicación muestre algo más significativo que un
número.

Ejemplo conceptual:

``` text
100/100
↓
Operación controlada
↓
Estrategia altamente consistente
```

o:

``` text
65/100
↓
Operación en revisión
↓
Se tomaron acciones relevantes,
pero quedaron riesgos o capacidades sin resolver.
```

------------------------------------------------------------------------

# 11. Sistema de XP

Cada misión posee un `maxXP`.

Actualmente:

``` text
M-01 → 220 XP
M-02 → 240 XP
M-03 → 280 XP
M-04 → 300 XP
M-05 → 360 XP
M-06 → 380 XP
```

El XP objetivo se relaciona con la puntuación:

``` text
XP objetivo = maxXP × score / 100
```

Además, el sistema considera el mejor resultado anterior.

Por ello, repetir una misión no debería entregar nuevamente toda la
recompensa si el estudiante no mejora su desempeño.

Conceptualmente:

``` text
Primera partida:
60/100 → XP correspondiente

Nueva partida:
75/100 → solamente se entrega la mejora

Nueva partida:
75/100 → 0 XP adicional

Nueva partida:
90/100 → se entrega la nueva mejora
```

Esto incentiva la **mejora del desempeño**, no simplemente repetir
misiones para acumular XP.

------------------------------------------------------------------------

# 12. Rangos del estudiante

Los rangos se calculan automáticamente a partir del XP acumulado.

    XP mínimo Rango
  ----------- -----------------------
            0 Cadete de Riesgo
          250 Analista de Campo
          600 Oficial de Prevención
         1000 Comandante de Riesgo
         1500 Estratega Nacional

El rango se determina en el cliente mediante la función `rankFor()`.

------------------------------------------------------------------------

# 13. Interfaz de misión

Cada misión posee una representación visual propia.

## Command HUD

Los archivos:

``` text
CommandHUDM01.jsx
...
CommandHUDM06.jsx
```

muestran información operacional específica de cada escenario.

## Operational Map

Los archivos:

``` text
OperationalMapM01.jsx
...
OperationalMapM06.jsx
```

representan gráficamente los elementos relevantes del escenario.

Esto permite que la misma arquitectura de simulación tenga una
presentación visual diferente para cada misión.

## Decision Center

El estudiante interactúa mediante decisiones contextuales.

La decisión:

``` text
acción → cambio de estado → consecuencia
```

es el ciclo fundamental de la experiencia.

------------------------------------------------------------------------

# 14. Flujo de una misión

``` text
Seleccionar misión
       ↓
Cargar escenario
       ↓
Crear estado inicial
       ↓
Mostrar briefing
       ↓
Mostrar mapa + HUD
       ↓
Mostrar decisiones disponibles
       ↓
Estudiante selecciona decisión
       ↓
Aplicar efectos
       ↓
Registrar decisión
       ↓
Actualizar fase
       ↓
Mostrar consecuencia
       ↓
¿Escenario terminado?
       │
       ├── NO → continuar
       │
       └── SÍ
             ↓
       Calcular score
             ↓
       Evaluar resultado
             ↓
       Calcular XP
             ↓
       Guardar intento
             ↓
       Mostrar recompensa
             ↓
       Actualizar progreso
```

------------------------------------------------------------------------

# 15. Persistencia

RISK COMMAND tiene dos modos.

## Modo A --- Supabase

Se activa cuando existen:

``` env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

La información principal se almacena remotamente.

Esto permite que el estudiante conserve su progreso al:

-   cerrar sesión;
-   cambiar de navegador;
-   cambiar de computador;
-   acceder desde otra red.

## Modo B --- Local

Si las variables de Supabase no están configuradas, la aplicación
utiliza `localStorage`.

Se utilizan claves internas para conservar:

-   perfil;
-   XP;
-   misiones completadas;
-   mejores puntajes;
-   número de intentos;
-   estadísticas de misión;
-   usuarios locales del navegador.

El modo local es útil para:

-   desarrollo;
-   demostraciones;
-   pruebas de interfaz;
-   pruebas de escenarios sin backend.

**No debe considerarse una base de datos multiusuario.**

------------------------------------------------------------------------

# 16. Configuración de Supabase

## 16.1 Crear proyecto

Crear un proyecto en Supabase y acceder al:

``` text
SQL Editor
```

Ejecutar:

``` text
supabase/schema.sql
```

------------------------------------------------------------------------

## 16.2 Estructura de datos

El esquema contempla tres entidades principales:

``` text
profiles
missions
mission_attempts
```

### `profiles`

Representa al estudiante.

Campos principales:

``` text
id
full_name
xp
completed
best_scores
attempts
created_at
```

### `missions`

Catálogo de misiones.

Campos:

``` text
id
title
max_xp
active
```

### `mission_attempts`

Registro histórico de intentos.

Campos principales:

``` text
id
user_id
mission_id
score
xp_earned
cumulative_xp
improved
created_at
```

------------------------------------------------------------------------

# 17. Autenticación

RISK COMMAND utiliza Supabase Authentication.

Para simplificar la experiencia del estudiante, la interfaz únicamente
solicita:

``` text
Nombre
Apellido
Contraseña
```

La aplicación genera internamente un identificador de correo con la
forma:

``` text
nombre.apellido@riskcommand.local
```

El estudiante no necesita escribir ni recordar este correo.

> **Importante:** el nombre + apellido funciona como identificador
> lógico de acceso. Para despliegues institucionales de gran escala
> sería recomendable incorporar un identificador único, como código
> estudiantil o correo institucional.

------------------------------------------------------------------------

# 18. Row Level Security

El esquema activa RLS en las tablas principales.

El principio utilizado es:

``` text
El estudiante puede consultar/modificar sus propios datos,
pero no debe poder modificar directamente los datos de otros estudiantes.
```

Por ejemplo, `profiles` utiliza:

``` sql
using (id = auth.uid())
```

y `mission_attempts`:

``` sql
using (user_id = auth.uid())
```

Las operaciones sensibles de XP y clasificación se realizan mediante
funciones RPC controladas.

------------------------------------------------------------------------

# 19. Variables de entorno

Crear un archivo:

``` text
.env
```

con:

``` env
VITE_SUPABASE_URL=TU_URL_DE_SUPABASE
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICABLE_DE_SUPABASE
```

No colocar una clave:

``` text
service_role
```

en variables `VITE_*`.

Las variables `VITE_*` se incorporan al frontend durante el build y, por
tanto, no deben utilizarse para almacenar secretos del servidor.

------------------------------------------------------------------------

# 20. Instalación

Requisitos recomendados:

-   Node.js LTS;
-   npm;
-   proyecto Supabase si se desea persistencia remota.

Instalar dependencias:

``` bash
npm install
```

Ejecutar en desarrollo:

``` bash
npm run dev
```

Construir para producción:

``` bash
npm run build
```

Previsualizar el build:

``` bash
npm run preview
```

------------------------------------------------------------------------

# 21. Ejecución local

Con Supabase:

``` text
1. Crear .env
2. Configurar VITE_SUPABASE_URL
3. Configurar VITE_SUPABASE_ANON_KEY
4. Ejecutar schema.sql
5. npm install
6. npm run dev
```

Sin Supabase:

``` text
1. No configurar las variables VITE_SUPABASE_*
2. npm install
3. npm run dev
```

La aplicación detectará automáticamente el modo local.

------------------------------------------------------------------------

# 22. Publicación en Internet

RISK COMMAND es un frontend Vite y puede publicarse en servicios como:

-   Vercel;
-   Netlify;
-   GitHub Pages con configuración adecuada;
-   cualquier hosting estático compatible.

Proceso general:

``` text
Supabase
   ↓
crear proyecto + ejecutar schema.sql
   ↓
obtener URL + clave publicable
   ↓
configurar variables de entorno del hosting
   ↓
npm run build
   ↓
publicar dist/
```

No es necesario abrir puertos del router ni mantener el computador de
desarrollo encendido después de publicar la aplicación.

------------------------------------------------------------------------

# 23. Seguridad

Buenas prácticas importantes:

### No publicar:

``` text
SUPABASE_SERVICE_ROLE_KEY
```

### Sí puede utilizarse en el frontend:

``` text
VITE_SUPABASE_ANON_KEY
```

siempre que RLS y las políticas de acceso estén correctamente
configuradas.

También se recomienda:

-   no subir `.env` con secretos privados al repositorio;
-   utilizar `.env.example`;
-   revisar las políticas RLS antes de un despliegue institucional;
-   validar cualquier modificación de XP en backend;
-   evitar confiar exclusivamente en valores calculados en el navegador.

------------------------------------------------------------------------

# 24. Compatibilidad del esquema Supabase

> **Nota importante para esta versión del repositorio:** el archivo
> `supabase/schema.sql` y la llamada actual de `src/lib/supabaseApi.js`
> deben mantenerse sincronizados.

La aplicación actual invoca:

``` text
record_mission_attempt(
    p_mission_id,
    p_score
)
```

Mientras que el SQL incluido en el archivo de referencia conserva una
firma heredada del modelo anterior:

``` text
record_mission_attempt(
    p_mission_id,
    p_score,
    p_correct,
    p_total
)
```

Además, esa función heredada referencia campos `correct` y `total` que
no forman parte de la tabla `mission_attempts` actual.

### Consecuencia

El **modo local funciona de manera independiente**, pero antes de
utilizar Supabase como backend de producción se debe ejecutar una
migración del RPC para que su firma y lógica correspondan al modelo
actual de misiones por decisiones.

La regla de diseño recomendada es:

``` text
score final del escenario
        ↓
RPC de Supabase
        ↓
calcular XP incremental
        ↓
actualizar profile
        ↓
registrar mission_attempt
```

No se recomienda mantener dos modelos de XP simultáneos.

------------------------------------------------------------------------

# 25. Recomendación para la versión de producción

Para una versión institucional estable, el RPC debería recibir como
mínimo:

``` text
mission_id
score
```

y calcular en servidor:

``` text
mejor puntaje anterior
XP máximo de la misión
XP correspondiente al nuevo score
XP incremental
nuevo XP acumulado
```

El servidor debería ser la fuente de verdad para el XP.

El navegador puede calcular una estimación para mostrar la interfaz,
pero el valor persistido debe proceder del backend.

------------------------------------------------------------------------

# 26. Personalización de una misión

Para crear o modificar una misión, el archivo principal se encuentra en:

``` text
src/data/scenarios/Mxx.js
```

Una misión debe definir, como mínimo:

``` js
{
    id: "M-XX",
    title: "Título",
    maxXP: 300,

    initialSituation: {
        ...
    },

    scoring: {
        targets: {
            ...
        },

        weights: {
            ...
        }
    },

    decisions: {
        INITIAL: [
            ...
        ]
    }
}
```

Una decisión puede incluir:

``` js
{
    id: "decisionId",
    icon: "🚨",
    label: "Acción",
    description: "Descripción",

    effects: {
        threat: -10,
        exposure: -5,
        resources: -8,
        response: +15
    },

    stateChanges: {
        operations: {
            ...
        }
    },

    nextPhase: "NEXT_PHASE",

    consequence: "Consecuencia operacional."
}
```

------------------------------------------------------------------------

# 27. Agregar una nueva misión

El flujo recomendado es:

``` text
1. Crear M07.js
2. Definir estado inicial
3. Definir fases
4. Definir decisiones
5. Definir scoring
6. Registrar M07 en scenarios/index.js
7. Registrar M07 en advancedMissions.js
8. Crear CommandHUDM07.jsx
9. Crear OperationalMapM07.jsx
10. Registrar ambos componentes en App.jsx
11. Añadir M07 a Supabase missions
12. Probar todas las rutas de decisión
13. Validar score y XP
```

La misión debe probarse con:

-   ruta óptima;
-   rutas subóptimas;
-   decisiones prematuras;
-   decisiones tardías;
-   repetición de intentos;
-   agotamiento de recursos;
-   condiciones de finalización.

------------------------------------------------------------------------

# 28. Buenas prácticas para desarrollar escenarios

Una misión nueva debería evitar una única respuesta obvia.

Idealmente:

``` text
Información
    ↓
incertidumbre
    ↓
varias decisiones plausibles
    ↓
consecuencias diferentes
    ↓
evaluación de trayectoria
    ↓
resultado
```

El objetivo pedagógico no es castigar al estudiante por no elegir una
palabra específica, sino evaluar la calidad de su estrategia.

------------------------------------------------------------------------

# 29. Pruebas recomendadas

Antes de considerar una misión terminada:

### Prueba de finalización

Comprobar que todas las rutas razonables puedan:

``` text
llegar a OUTCOME
```

cuando corresponda.

### Prueba de puntuación

Verificar:

``` text
0 ≤ score ≤ 100
```

y que la ruta óptima alcance la puntuación máxima definida.

### Prueba de repetición

Comprobar:

``` text
score menor → XP parcial
score igual → XP incremental 0
score mayor → XP incremental positivo
score 100 → XP máximo acumulado
```

### Prueba de persistencia

Cerrar y volver a abrir la aplicación y verificar:

-   perfil;
-   XP;
-   mejores puntajes;
-   intentos;
-   clasificación.

### Prueba visual

Verificar que:

-   eventos no se solapen;
-   el mapa sea legible;
-   los estados correspondan al escenario;
-   HUD y mapa representen la misma situación;
-   no existan rutas visualmente desconectadas de la lógica.

------------------------------------------------------------------------

# 30. Estado del proyecto

La versión incluida representa una **base funcional avanzada del
gamificador**, con seis escenarios y una arquitectura preparada para
continuar creciendo.

La evolución natural del sistema puede incluir:

``` text
v1.x
│
├── más misiones
├── refinamiento de scoring
├── más eventos dinámicos
└── mejoras visuales
        ↓
v2.x
│
├── equipos
├── competencias
├── roles
├── sesiones de clase
└── eventos compartidos
        ↓
v3.x
│
├── simulación multiactor
├── eventos en tiempo real
├── panel docente
├── analítica académica
└── escenarios adaptativos
```

------------------------------------------------------------------------

# 31. Consideraciones académicas

RISK COMMAND debe entenderse como un **simulador educativo**.

Las decisiones y puntuaciones representan un modelo simplificado del
proceso de gestión del riesgo y no sustituyen:

-   estudios técnicos;
-   análisis de amenaza;
-   evaluación de vulnerabilidad;
-   protocolos oficiales;
-   sistemas de alerta;
-   planes de emergencia;
-   decisiones de autoridades competentes.

Los escenarios están diseñados para enseñar relaciones entre variables y
consecuencias, no para representar fielmente un territorio real.

------------------------------------------------------------------------

# 32. Créditos y propósito

**RISK COMMAND** fue desarrollado como un proyecto académico de
gamificación aplicado a la **Gestión del Riesgo**, integrando conceptos
de simulación, desarrollo web, persistencia de datos, diseño de
interfaces y evaluación basada en decisiones.

El proyecto busca transformar una temática tradicionalmente documental
en una experiencia:

``` text
INTERACTIVA
     ↓
DECISIONAL
     ↓
VISUAL
     ↓
EVALUABLE
     ↓
REPETIBLE
```

------------------------------------------------------------------------

## Licencia

Si el proyecto va a ser publicado o distribuido fuera del contexto
académico, se recomienda definir explícitamente una licencia antes de
subir el repositorio a un servicio público.
