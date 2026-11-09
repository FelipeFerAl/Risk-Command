import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, Award, Bell, BookOpen, Check, ChevronRight, CircleHelp, ClipboardList,
  Clock3, Compass, Crown, Flame, GraduationCap, House, LogOut, Medal, Menu,
  MessageSquare, Plus, Radar, Shield, ShieldAlert, Sparkles, Star, Target, Trophy,
  Users, X, Zap
} from "lucide-react";
import { initialMissions, initialStudents, modules } from "./data";

const STORAGE_KEY = "risk-command-v1";
const rankFor = xp => xp >= 5000 ? "Director de operaciones" : xp >= 3000 ? "Especialista en riesgos" : xp >= 1500 ? "Coordinador de emergencias" : xp >= 500 ? "Analista de riesgos" : "Aspirante";
const rankLevel = xp => xp >= 5000 ? 5 : xp >= 3000 ? 4 : xp >= 1500 ? 3 : xp >= 500 ? 2 : 1;
const rankTarget = xp => [500, 1500, 3000, 5000, 5000][rankLevel(xp)-1];
const loadState = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
};

function App() {
  const saved = loadState();
  const [role, setRole] = useState(saved.role || "student");
  const [studentName, setStudentName] = useState(saved.studentName || "Estudiante");
  const [courseCode, setCourseCode] = useState(saved.courseCode || "RIESGO-2026");
  const [xp, setXp] = useState(saved.xp || 0);
  const [reputation, setReputation] = useState(saved.reputation ?? 100);
  const [completed, setCompleted] = useState(saved.completed || []);
  const [missions, setMissions] = useState(saved.missions || initialMissions);
  const [activeMission, setActiveMission] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [joinCode, setJoinCode] = useState(saved.courseCode || "");
  const [studentList, setStudentList] = useState(saved.studentList || initialStudents);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ role, studentName, courseCode, xp, reputation, completed, missions, studentList }));
  }, [role, studentName, courseCode, xp, reputation, completed, missions, studentList]);

  const sortedStudents = useMemo(() => {
    const mine = { id: 99, name: studentName, xp, completed: completed.length, reputation, isMe: true };
    return [...studentList.filter(s => s.name !== "Tú" && s.name !== studentName), mine].sort((a,b) => b.xp-a.xp);
  }, [studentList, studentName, xp, completed, reputation]);

  const notify = message => { setNotice(message); window.setTimeout(() => setNotice(""), 3200); };
  const finishMission = (mission, score) => {
    if (completed.includes(mission.id)) { notify("Ya completaste esta misión. Puedes revisar tu resultado."); setActiveMission(null); return; }
    const earned = Math.round(mission.xp * score / 100);
    setXp(v => v + earned);
    setReputation(v => Math.min(100, Math.max(0, v + (score >= 75 ? 2 : -3))));
    setCompleted(v => [...v, mission.id]);
    setStudentList(v => [...v.filter(s => s.name !== studentName), { id: 99, name: studentName, xp: xp + earned, completed: completed.length + 1, reputation }]);
    setActiveMission(null);
    notify(`Misión completada: +${earned} XP`);
    setPage("missions");
  };

  const resetDemo = () => {
    if (!window.confirm("¿Restablecer el progreso de demostración de este navegador?")) return;
    setXp(0); setReputation(100); setCompleted([]); setStudentName("Estudiante"); setRole("student");
    localStorage.removeItem(STORAGE_KEY); notify("Progreso de demostración restablecido.");
  };

  const nav = [
    { id:"dashboard", label:"Centro de mando", icon:House },
    { id:"missions", label:"Misiones", icon:Compass },
    { id:"modules", label:"Módulos", icon:BookOpen },
    { id:"ranking", label:"Clasificación", icon:Trophy },
    { id:"profile", label:"Mi perfil", icon:Medal }
  ];
  if (role === "teacher") nav.splice(2, 0, { id:"classroom", label:"Mi clase", icon:Users });

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><ShieldAlert size={23}/></div><div><b>RISK<span>COMMAND</span></b><small>SIMULADOR DE RIESGOS</small></div><button className="mobile-close" onClick={()=>setSidebarOpen(false)}><X/></button></div>
      <div className="course-chip"><span className="pulse-dot"/><div><small>CURSO ACTIVO</small><b>Gestión del Riesgo</b></div></div>
      <div className="nav-caption">OPERACIONES</div>
      <nav>{nav.map(item => <button key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>{setPage(item.id);setActiveMission(null);setSidebarOpen(false)}}><item.icon size={18}/><span>{item.label}</span>{item.id==="missions"&&<em>{missions.length-completed.length}</em>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="rank-mini"><div className="rank-icon"><Shield size={19}/></div><div><small>RANGO ACTUAL</small><b>{rankFor(xp)}</b><div className="mini-progress"><i style={{width:`${Math.min(100,(xp/(rankTarget(xp)||1))*100)}%`}}/></div></div></div>
        <button className="nav-item" onClick={()=>setRole(role==="student"?"teacher":"student")}><GraduationCap size={18}/><span>Cambiar a {role==="student"?"docente":"estudiante"}</span></button>
        <button className="nav-item" onClick={resetDemo}><LogOut size={18}/><span>Reiniciar demo</span></button>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={()=>setSidebarOpen(true)}><Menu/></button>
        <div className="breadcrumb">RISK COMMAND <ChevronRight size={14}/> <b>{nav.find(n=>n.id===page)?.label || "Misión"}</b></div>
        <div className="top-actions"><div className="top-course"><span className="pulse-dot"/> {courseCode}</div><button className="icon-btn" title="Notificaciones" onClick={()=>notify("No tienes nuevas notificaciones.")}><Bell size={18}/></button><div className="user-pill"><div className="avatar">{(role==="teacher"?"D":studentName.charAt(0)).toUpperCase()}</div><div><b>{role==="teacher"?"Docente":studentName}</b><small>{role==="teacher"?"Administrador del curso":rankFor(xp)}</small></div></div></div>
      </header>

      <div className="content">
        {page==="dashboard" && (role==="student" ? <StudentDashboard name={studentName} setName={setStudentName} xp={xp} reputation={reputation} completed={completed} missions={missions} setPage={setPage} openMission={setActiveMission}/> : <TeacherDashboard students={sortedStudents} missions={missions} completed={completed} setPage={setPage}/>)}
        {page==="missions" && <MissionList missions={missions} completed={completed} openMission={setActiveMission}/>}
        {page==="modules" && <ModuleList missions={missions} completed={completed} openMission={setActiveMission}/>}
        {page==="ranking" && <Ranking students={sortedStudents}/>}
        {page==="profile" && <Profile name={studentName} setName={setStudentName} xp={xp} reputation={reputation} completed={completed} missions={missions}/>}
        {page==="classroom" && <Classroom students={sortedStudents} missions={missions} newTitle={newTitle} setNewTitle={setNewTitle} newDescription={newDescription} setNewDescription={setNewDescription} addMission={()=>{if(!newTitle.trim())return notify("Escribe el nombre de la misión.");const m={id:`M-${Date.now()}`,module:"Gestión integral",title:newTitle,description:newDescription||"Misión creada por el docente.",type:"Actividad docente",level:"Personalizada",duration:"A definir",xp:200,situation:"El docente debe completar el escenario y las preguntas desde el editor avanzado, disponible en la siguiente fase.",question:"¿Qué acción debería priorizarse?",options:["Analizar el contexto y la información disponible","Actuar sin evaluar","Ignorar la amenaza","Difundir información no verificada"],answer:0,explanation:"La evaluación debe basarse en información confiable y análisis del contexto.",secondQuestion:"¿Qué debe hacerse después?",secondOptions:["Verificar resultados y comunicar decisiones","No registrar nada","Finalizar sin evaluación","Esperar sin plan"],secondAnswer:0,secondExplanation:"La verificación y comunicación permiten dar seguimiento a las decisiones."};setMissions(v=>[m,...v]);setNewTitle("");setNewDescription("");notify("Misión añadida al catálogo de este navegador.");}}/>}
      </div>
      <footer className="footer"><span>RISK COMMAND <i>v1.0 DEMO</i></span><span>Simulación educativa · No sustituye protocolos oficiales de emergencia</span></footer>
    </main>

    {activeMission && <MissionModal mission={activeMission} alreadyCompleted={completed.includes(activeMission.id)} onClose={()=>setActiveMission(null)} onFinish={finishMission}/>}
    {notice && <div className="toast"><Check size={17}/>{notice}</div>}
  </div>;
}

function PageHeading({eyebrow,title,subtitle,action}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}
function StatCard({icon:Icon,label,value,foot,tone="blue"}) {
  return <div className={`stat-card tone-${tone}`}><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={19}/></div></div><strong>{value}</strong><small>{foot}</small></div>;
}
function StudentDashboard({name,setName,xp,reputation,completed,missions,setPage,openMission}) {
  const next = missions.find(m=>!completed.includes(m.id));
  const percent = Math.round(completed.length/missions.length*100);
  return <>
    <section className="welcome-banner"><div className="welcome-copy"><div className="eyebrow light">CENTRO DE OPERACIONES <span className="live-tag">● EN LÍNEA</span></div><h1>¡Bienvenido, {name}!</h1><p>Tu próxima misión puede marcar la diferencia. ¿Estás listo para proteger a la comunidad?</p><button className="btn btn-white" onClick={()=>next?openMission(next):setPage("missions")}>{next?"Continuar misión":"Revisar misiones"} <ChevronRight size={17}/></button></div><div className="welcome-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="globe">🌎</div><div className="floating f1">⚠️</div><div className="floating f2">🛡️</div><div className="floating f3">📡</div></div></section>
    <div className="stats-grid"><StatCard icon={Zap} label="Experiencia total" value={xp.toLocaleString("es-CO")} foot="XP acumulados" tone="purple"/><StatCard icon={Target} label="Misiones completadas" value={`${completed.length}/${missions.length}`} foot="Objetivos alcanzados" tone="green"/><StatCard icon={Shield} label="Reputación" value={`${reputation}/100`} foot="Confianza operativa" tone="orange"/><StatCard icon={Award} label="Rango actual" value={rankFor(xp)} foot={`Nivel ${rankLevel(xp)} de 5`} tone="blue"/></div>
    <div className="dashboard-grid">
      <section className="panel progress-panel"><div className="panel-heading"><div><div className="eyebrow">TU RENDIMIENTO</div><h2>Progreso de campaña</h2></div><span className="soft-badge">{percent}% completado</span></div><div className="campaign-progress"><div className="campaign-track"><i style={{width:`${percent}%`}}/></div><div className="progress-labels"><span>{completed.length} misiones superadas</span><span>{missions.length-completed.length} pendientes</span></div></div><div className="module-mini-list">{modules.slice(0,4).map((m,i)=><div className="module-mini" key={m.name}><span className="module-emoji">{m.icon}</span><div><b>{m.name}</b><small>{i===0?"Reconocimiento":i===1?"Análisis":"Entrenamiento"}</small></div><span className="module-status">{completed.some(id=>missions.find(x=>x.id===id)?.module===m.name)?"En progreso":"Disponible"}</span></div>)}</div><button className="text-button" onClick={()=>setPage("modules")}>Ver todos los módulos <ChevronRight size={15}/></button></section>
      <section className="panel next-panel"><div className="panel-heading"><div><div className="eyebrow">SIGUIENTE DESAFÍO</div><h2>{next?"Misión recomendada":"¡Campaña completada!"}</h2></div><div className="next-icon">🚩</div></div>{next?<><div className="mission-cover"><span>🚨</span><small>{next.module}</small></div><h3>{next.title}</h3><p>{next.description}</p><div className="mission-meta"><span><Clock3 size={14}/>{next.duration}</span><span><Zap size={14}/>Hasta {next.xp} XP</span></div><button className="btn btn-primary full" onClick={()=>openMission(next)}>Iniciar misión <ChevronRight size={17}/></button></>:<p>Has completado todas las misiones disponibles en esta versión.</p>}</section>
    </div>
    <div className="section-title"><div><div className="eyebrow">TU RUTA DE FORMACIÓN</div><h2>Explora los módulos</h2></div><button className="text-button" onClick={()=>setPage("modules")}>Ver mapa completo <ChevronRight size={15}/></button></div>
    <div className="module-cards">{modules.slice(0,3).map((m,i)=><div className={`module-card ${m.color}`} key={m.name}><div className="module-card-top"><span>{m.icon}</span><small>ETAPA 0{i+1}</small></div><h3>{m.name}</h3><p>{m.description}</p><div className="module-card-bottom"><span>{missions.filter(x=>x.module===m.name).length} misión(es)</span><button onClick={()=>setPage("modules")}>Explorar <ChevronRight size={14}/></button></div></div>)}</div>
  </>;
}
function MissionList({missions,completed,openMission}) {
  return <><PageHeading eyebrow="CENTRO DE ENTRENAMIENTO" title="Misiones disponibles" subtitle="Completa desafíos, toma decisiones y demuestra tus habilidades."/><div className="filter-row"><span className="soft-badge">{missions.length} misiones</span><span className="soft-badge success">{completed.length} completadas</span><span className="soft-badge warning">{missions.length-completed.length} pendientes</span></div><div className="mission-grid">{missions.map((m,i)=><MissionCard key={m.id} mission={m} index={i} done={completed.includes(m.id)} onClick={()=>openMission(m)}/>)}</div></>;
}
function MissionCard({mission,index,done,onClick}) {
  const emojis=["🌧️","🌊","🛡️","🚨","📡","🏆"];
  return <div className={`mission-card ${done?"done":""}`}><div className="mission-card-art"><span>{emojis[index%emojis.length]}</span><small>{mission.id}</small>{done&&<b className="done-stamp"><Check size={13}/> COMPLETADA</b>}</div><div className="mission-card-body"><div className="card-kicker">{mission.module}</div><h3>{mission.title}</h3><p>{mission.description}</p><div className="mission-meta"><span><Clock3 size={14}/>{mission.duration}</span><span><Zap size={14}/>{mission.xp} XP</span></div><button className={`btn ${done?"btn-muted":"btn-outline"} full`} onClick={onClick}>{done?"Revisar misión":"Iniciar misión"} <ChevronRight size={16}/></button></div></div>;
}
function ModuleList({missions,completed,openMission}) {
  return <><PageHeading eyebrow="MAPA DE CAMPAÑA" title="Módulos de formación" subtitle="Seis etapas para convertirte en especialista en gestión del riesgo."/><div className="module-list">{modules.map((m,i)=>{const related=missions.filter(x=>x.module===m.name);const done=related.filter(x=>completed.includes(x.id)).length;return <div className="module-row" key={m.name}><div className={`module-large-icon ${m.color}`}>{m.icon}</div><div className="module-info"><div className="card-kicker">ETAPA 0{i+1}</div><h3>{m.name}</h3><p>{m.description}</p><div className="module-progress"><span style={{width:`${related.length?done/related.length*100:0}%`}}/></div><small>{done} de {related.length} misiones completadas</small>{related.map(mis=><button className="inline-mission" key={mis.id} onClick={()=>openMission(mis)}>{mis.title}<ChevronRight size={14}/></button>)}</div><div className="module-lock">{done===related.length&&related.length>0?<Check color="#20a879"/>:<span>{related.length} <small>misiones</small></span>}</div></div>})}</div></>;
}
function Ranking({students}) {
  return <><PageHeading eyebrow="COMPETENCIA DE LA CLASE" title="Clasificación operativa" subtitle="El conocimiento, la estrategia y el trabajo constante construyen tu reputación."/><div className="ranking-hero"><Trophy size={34}/><div><b>OPERACIÓN: CONOCIMIENTO</b><p>Tabla de posiciones del curso · Demo local</p></div><span>🏅</span></div><div className="panel ranking-panel"><div className="ranking-head"><span>POSICIÓN / PARTICIPANTE</span><span>RANGO</span><span>EXPERIENCIA</span></div>{students.map((s,i)=><div className={`ranking-row ${s.isMe?"me":""}`} key={s.id}><div className="rank-position">{i===0?<Crown size={19} color="#e4a52b"/>:i===1?<Medal size={19} color="#9aa7b7"/>:i===2?<Medal size={19} color="#b77a4d"/>:`0${i+1}`}</div><div className="rank-person"><div className="avatar">{s.name.charAt(0)}</div><div><b>{s.name} {s.isMe&&<small>TÚ</small>}</b><span>{s.completed} misiones completadas</span></div></div><div className="rank-title">{rankFor(s.xp)}</div><b className="rank-xp">{s.xp.toLocaleString("es-CO")} XP</b></div>)}</div><p className="muted-note">Los participantes de ejemplo son datos ficticios. En esta demo, los datos se guardan únicamente en este navegador.</p></>;
}
function Profile({name,setName,xp,reputation,completed,missions}) {
  return <><PageHeading eyebrow="IDENTIDAD DEL OPERADOR" title="Mi perfil" subtitle="Consulta tu trayectoria y personaliza tu identidad de juego."/><div className="profile-layout"><div className="panel profile-card"><div className="profile-avatar">🧭</div><h2>{name}</h2><span className="soft-badge">{rankFor(xp)}</span><label className="field-label">Nombre visible</label><input value={name} onChange={e=>setName(e.target.value)} maxLength={32}/><div className="profile-stats"><div><b>{xp}</b><small>XP</small></div><div><b>{completed.length}</b><small>Misiones</small></div><div><b>{reputation}</b><small>Reputación</small></div></div></div><div className="panel profile-achievements"><div className="eyebrow">COLECCIÓN</div><h2>Insignias y logros</h2><div className="achievement-grid"><Achievement icon="🧩" title="Primer paso" desc="Completa tu primera misión" unlocked={completed.length>=1}/><Achievement icon="🌱" title="En formación" desc="Acumula 500 XP" unlocked={xp>=500}/><Achievement icon="🛡️" title="Protector" desc="Mantén reputación alta" unlocked={reputation>=95&&completed.length>0}/><Achievement icon="🏅" title="Veterano" desc="Completa 5 misiones" unlocked={completed.length>=5}/></div><div className="eyebrow achievement-foot">{completed.length} de {missions.length} misiones realizadas</div></div></div></>;
}
function Achievement({icon,title,desc,unlocked}) { return <div className={`achievement ${unlocked?"unlocked":""}`}><span>{unlocked?icon:"🔒"}</span><div><b>{title}</b><small>{desc}</small></div>{unlocked&&<Check size={16} color="#20a879"/>}</div>; }
function TeacherDashboard({students,missions,completed,setPage}) {
  const totalDone=students.reduce((a,s)=>a+s.completed,0);
  return <><section className="welcome-banner teacher-banner"><div className="welcome-copy"><div className="eyebrow light">PANEL DE INSTRUCTOR</div><h1>Centro de control docente</h1><p>Administra la campaña, acompaña a tus estudiantes y revisa el avance del grupo.</p><button className="btn btn-white" onClick={()=>setPage("classroom")}>Gestionar mi clase <ChevronRight size={17}/></button></div><div className="welcome-art"><div className="globe">🎓</div><div className="floating f1">📊</div><div className="floating f2">🧑‍🚒</div></div></section><div className="stats-grid"><StatCard icon={Users} label="Estudiantes demo" value={students.length} foot="Participantes de ejemplo" tone="blue"/><StatCard icon={BookOpen} label="Misiones publicadas" value={missions.length} foot="En el catálogo" tone="purple"/><StatCard icon={Check} label="Misiones completadas" value={totalDone} foot="Suma de registros demo" tone="green"/><StatCard icon={Activity} label="Promedio de reputación" value={`${Math.round(students.reduce((a,s)=>a+s.reputation,0)/students.length)}%`} foot="Indicador del grupo" tone="orange"/></div><div className="dashboard-grid"><div className="panel"><div className="panel-heading"><div><div className="eyebrow">PARTICIPANTES</div><h2>Actividad reciente</h2></div><button className="text-button" onClick={()=>setPage("classroom")}>Ver clase <ChevronRight size={14}/></button></div>{students.slice(0,4).map(s=><div className="student-line" key={s.id}><div className="avatar">{s.name[0]}</div><div><b>{s.name}</b><small>{s.completed} misiones · {rankFor(s.xp)}</small></div><strong>{s.xp} XP</strong></div>)}</div><div className="panel"><div className="eyebrow">GESTIÓN RÁPIDA</div><h2>Herramientas docentes</h2><button className="tool-row" onClick={()=>setPage("classroom")}><Plus/><span><b>Crear misión</b><small>Añade un nuevo desafío</small></span><ChevronRight/></button><button className="tool-row" onClick={()=>setPage("ranking")}><Trophy/><span><b>Ver clasificación</b><small>Consulta el desempeño</small></span><ChevronRight/></button><button className="tool-row" onClick={()=>setPage("missions")}><ClipboardList/><span><b>Revisar misiones</b><small>Consulta el catálogo</small></span><ChevronRight/></button></div></div></>;
}
function Classroom({students,missions,newTitle,setNewTitle,newDescription,setNewDescription,addMission}) {
  return <><PageHeading eyebrow="ADMINISTRACIÓN ACADÉMICA" title="Mi clase" subtitle="Gestiona el catálogo y revisa la información de los participantes." action={<span className="soft-badge success">Curso demo activo</span>}/><div className="class-code panel"><div><div className="eyebrow">CÓDIGO DE INVITACIÓN</div><h2>RIESGO-2026</h2><p>Comparte este código con tus estudiantes para identificar el curso en la demo.</p></div><button className="btn btn-outline" onClick={()=>navigator.clipboard?.writeText("RIESGO-2026")}>Copiar código</button></div><div className="panel create-panel"><div className="eyebrow">EDITOR RÁPIDO</div><h2>Publicar una misión</h2><p>Esta versión crea una misión de demostración con preguntas base. El editor académico completo será una mejora posterior.</p><div className="form-grid"><label className="field-label">Nombre de la misión<input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Ej. Riesgo en la escuela"/></label><label className="field-label">Descripción<textarea value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="Describe brevemente el desafío..."/></label></div><button className="btn btn-primary" onClick={addMission}><Plus size={17}/> Añadir misión</button></div><div className="panel"><div className="panel-heading"><div><div className="eyebrow">LISTADO DEL CURSO</div><h2>Participantes ({students.length})</h2></div></div>{students.map(s=><div className="student-line" key={s.id}><div className="avatar">{s.name[0]}</div><div><b>{s.name}</b><small>{rankFor(s.xp)}</small></div><strong>{s.xp} XP</strong></div>)}</div><div className="panel"><div className="eyebrow">CONTENIDO</div><h2>Misiones del catálogo ({missions.length})</h2>{missions.map(m=><div className="student-line" key={m.id}><div className="mission-mini-icon">🚩</div><div><b>{m.title}</b><small>{m.module}</small></div><strong>{m.xp} XP</strong></div>)}</div></>;
}
function MissionModal({mission,alreadyCompleted,onClose,onFinish}) {
  const [answers,setAnswers]=useState({});
  const [step,setStep]=useState(0);
  const [submitted,setSubmitted]=useState(false);
  const [reflection,setReflection]=useState("");
  const questions=[{q:mission.question,options:mission.options,answer:mission.answer,explanation:mission.explanation},{q:mission.secondQuestion,options:mission.secondOptions,answer:mission.secondAnswer,explanation:mission.secondExplanation}];
  const current=questions[step];
  const correct=questions.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0);
  const score=Math.round(correct/questions.length*100);
  const choose=v=>setAnswers(a=>({...a,[step]:v}));
  const next=()=>{if(answers[step]===undefined)return;if(step===0)setStep(1);else setSubmitted(true);};
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="mission-modal"><div className="modal-top"><div><div className="eyebrow">OPERACIÓN {mission.id}</div><h2>{mission.title}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div><div className="modal-scroll"><div className="scenario-banner"><span>🌦️</span><div><small>INFORME DE SITUACIÓN</small><p>{mission.situation}</p></div></div><div className="mission-progress-top"><span>DESAFÍO {submitted?2:step+1} DE 2</span><div><i style={{width:submitted?"100%":`${(step+1)*50}%`}}/></div></div>{!submitted?<><h3 className="question-title">{current.q}</h3><div className="answer-options">{current.options.map((o,i)=><button key={i} className={`answer-option ${answers[step]===i?"selected":""}`} onClick={()=>choose(i)}><span className="option-letter">{String.fromCharCode(65+i)}</span>{o}{answers[step]===i&&<Check size={17}/>}</button>)}</div><div className="modal-actions"><span className="muted-note">Selecciona la alternativa más adecuada.</span><button className="btn btn-primary" disabled={answers[step]===undefined} onClick={next}>{step===0?"Siguiente desafío":"Evaluar misión"} <ChevronRight size={16}/></button></div></>:<div className="results-view"><div className="result-medal">{score>=75?"🏆":"🧭"}</div><div className="eyebrow">INFORME DE MISIÓN</div><h2>{score>=75?"¡Buen trabajo, operador!":"Misión finalizada"}</h2><div className="score-number">{score}<small>/100</small></div><p>Respuestas correctas: {correct} de 2</p>{questions.map((q,i)=><div className="feedback-item" key={i}><b>{i+1}. {q.q}</b><span className={answers[i]===q.answer?"feedback-correct":"feedback-wrong"}>{answers[i]===q.answer?"✓ Correcto":"✕ Revisa esta respuesta"}</span><p>{q.explanation}</p></div>)}<label className="field-label">Reflexión opcional<textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="¿Qué aprendiste de esta situación?"/></label><button className="btn btn-primary full" onClick={()=>onFinish(mission,score)} disabled={alreadyCompleted}>{alreadyCompleted?"Misión ya registrada":`Reclamar ${Math.round(mission.xp*score/100)} XP y finalizar`}</button>{alreadyCompleted&&<p className="muted-note">Esta misión ya fue completada. No se otorgarán puntos adicionales.</p>}</div>}</div></div></div>;
}
export default App;
