"use client";

import { useState } from "react";
import { Activity, Anchor, AudioWaveform, Bot, Clapperboard, RadioTower, Radar, ChartNoAxesCombined, Settings2, Waves, Zap } from "lucide-react";

const buildings = [
  { id: "harbor", name: "Puerto", agent: "Fuentes y streams", icon: Anchor, status: "Conectores" },
  { id: "hunter", name: "Radar HQ", agent: "HUNTER · Descubrimiento", icon: Radar, status: "En espera" },
  { id: "moment", name: "Moment Lab", agent: "MOMENT · Detección", icon: AudioWaveform, status: "En espera" },
  { id: "editor", name: "Editing Studio", agent: "EDITOR · Producción", icon: Clapperboard, status: "En espera" },
  { id: "command", name: "AI Command", agent: "ATLAS · Orquestación", icon: Bot, status: "Operativo" },
  { id: "broadcast", name: "Broadcast Tower", agent: "PUBLISHER · Distribución", icon: RadioTower, status: "Conectar cuenta" },
  { id: "analytics", name: "Observatorio", agent: "ANALYST · Rendimiento", icon: ChartNoAxesCombined, status: "Sin datos" },
];

export default function IslandHome() {
  const [selected, setSelected] = useState("command");
  const active = buildings.find((b) => b.id === selected) ?? buildings[0];
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">V</div><div><b>VICE CLIPS</b><small>CONTENT OPERATIONS</small></div></div>
        <div className="side-label">ISLA PRINCIPAL</div>
        <button className="nav-active"><Waves size={17}/> VICE ISLAND</button>
        <div className="side-label">OPERACIONES</div>
        {buildings.map((b) => <button key={b.id} className="nav-item" onClick={() => setSelected(b.id)}><b.icon size={16}/>{b.name}</button>)}
        <div className="sidebar-bottom"><Settings2 size={16}/> Configuración <span className="online-dot"/></div>
      </aside>
      <section className="main-area">
        <header className="topbar"><div><span className="eyebrow">CENTRO DE OPERACIONES</span><h1>VICE ISLAND</h1></div><div className="top-status"><span className="online-dot"/> SISTEMA EN LÍNEA <span className="avatar">VC</span></div></header>
        <section className="stats-grid">
          {[["Streams conectados","0","Sin fuentes"],["Momentos detectados","0","Esperando contenido"],["Clips renderizados","0","Sin trabajos"],["Publicaciones","0","Sin canales conectados"]].map(([label,value,note]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}
        </section>
        <section className="island-layout">
          <div className="island-card">
            <div className="island-heading"><div><span className="eyebrow">MAPA INTERACTIVO</span><h2>Tu centro de producción</h2></div><span className="map-chip"><Activity size={13}/> 7 DEPARTAMENTOS</span></div>
            <div className="island-scene" role="group" aria-label="Mapa interactivo de VICE Island">
              <div className="ocean-glow"/><div className="island-shadow"/><div className="island-land"><div className="land-inner"/><div className="river"/>
                {buildings.map((b, i) => { const Icon = b.icon; return <button key={b.id} className={`building building-${i} ${selected === b.id ? "building-selected" : ""}`} onClick={() => setSelected(b.id)} aria-label={`Abrir ${b.name}`}><span className="building-icon"><Icon size={20}/></span><span className="building-label">{b.name}</span><span className="building-light"/></button>; })}
                <div className="palm palm-one">♣</div><div className="palm palm-two">♣</div><div className="dock">⚓ <small>VICE HARBOR</small></div>
              </div>
              <div className="map-coordinates">VICE ARCHIPELAGO · SECTOR 01</div>
            </div>
            <div className="map-legend"><span><i className="legend-dot active-dot"/> Sistema activo</span><span><i className="legend-dot idle-dot"/> En espera</span><span><i className="legend-dot selected-dot"/> Seleccionado</span></div>
          </div>
          <aside className="building-panel"><span className="eyebrow">DEPARTAMENTO SELECCIONADO</span><div className="selected-icon">{(() => { const Icon = active.icon; return <Icon size={25}/>; })()}</div><h2>{active.name}</h2><p>{active.agent}</p><div className="panel-divider"/><div className="panel-row"><span>Estado</span><b>{active.status}</b></div><div className="panel-row"><span>Agente</span><b>{active.id === "command" ? "ATLAS" : active.id.toUpperCase()}</b></div><button className="open-module" onClick={() => alert(`${active.name}: módulo en construcción. La isla interactiva ya está conectada.`)}>Abrir departamento <span>↗</span></button><div className="panel-hint"><Zap size={15}/> Selecciona otro edificio en el mapa para explorar la isla.</div></aside>
        </section>
        <footer>VICE CLIPS © 2026 <span>BUILDING THE NEXT CLIP EMPIRE</span></footer>
      </section>
    </main>
  );
}
