import { useState } from "react";

// ── DONNÉES PESÉE CRU vs CUIT ──
const PESEES = [
  { aliment: "Poulet (blanc)", cru: "200g", cuit: "150g", note: "Perd ~25% à la cuisson" },
  { aliment: "Poulet (cuisse)", cru: "200g", cuit: "155g", note: "Perd ~22%" },
  { aliment: "Riz blanc", cru: "75g", cuit: "225g", note: "Triple à la cuisson ×3" },
  { aliment: "Lentilles", cru: "60g", cuit: "150g", note: "Double + à la cuisson ×2.5" },
  { aliment: "Pois chiches (secs)", cru: "60g", cuit: "150g", note: "Double à la cuisson" },
  { aliment: "Pomme de terre", cru: "200g", cuit: "170g", note: "Perd ~15%" },
  { aliment: "Poisson blanc", cru: "200g", cuit: "160g", note: "Perd ~20%" },
  { aliment: "Œufs entiers", cru: "3 œufs (150g)", cuit: "≈ même poids", note: "Peser cru = peser cuit" },
  { aliment: "Flocons → riz", cru: "75g riz CRU", cuit: "225g riz CUIT", note: "Toujours peser CRU = plus précis" },
];

const REGLE = [
  { emoji: "🥩", r: "Viandes & poissons", c: "TOUJOURS peser CRU, avant cuisson" },
  { emoji: "🍚", r: "Riz, pâtes, légumineuses", c: "Peser CRU de préférence (plus précis)" },
  { emoji: "🥚", r: "Œufs", c: "Compter en unités (1 œuf ≈ 60-65g)" },
  { emoji: "🥦", r: "Légumes", c: "Peser comme tu veux, les calories sont minimes" },
];

// ── PROGRAMME ENTRAÎNEMENT ADAPTÉ SCOLIOSE ──
const PROGRAMME = {
  "🌞 DIMANCHE — PUSH (Épaules + Pecs haut + Triceps)": {
    color: "#f59e0b",
    intro: "Focus épaules larges → silhouette en V. Éviter les mouvements qui compriment la colonne.",
    exos: [
      { n: "Développé haltères assis (dos droit)", s: "4×10", repos: "90s", prio: true, note: "⚠️ Dos collé au dossier, pas de barre (asymétrie scoliose)" },
      { n: "Élévations latérales câble ou haltères", s: "4×15", repos: "60s", prio: true, note: "🔑 N°1 pour épaules larges — mouvement symétrique" },
      { n: "Élévations frontales haltères (1 bras)", s: "3×12/côté", repos: "60s", note: "Unila­téral = corrige l'asymétrie" },
      { n: "Développé incliné haltères (30°)", s: "4×10", repos: "90s", note: "Haut des pecs uniquement — pas de décliné" },
      { n: "Écarté câble croisé haut→bas", s: "3×15", repos: "60s", note: "Isole pec sans compression" },
      { n: "Dips entre bancs (poids du corps)", s: "3×12", repos: "60s", note: "Triceps + pec bas" },
      { n: "Face pull élastique / câble", s: "4×20", repos: "45s", prio: true, note: "✅ POSTURE — faire à chaque séance push" },
    ]
  },
  "🌙 MARDI — PULL (Dos large + Biceps + Posture)": {
    color: "#3b82f6",
    intro: "Priorité absolue : largeur du dos = V-shape. Exercices symétriques pour scoliose.",
    exos: [
      { n: "Tirage vertical prise large (câble/machine)", s: "4×10", repos: "90s", prio: true, note: "🔑 Remplace tractions au début — contrôle symétrie" },
      { n: "Rowing machine ou Smith (contrôlé)", s: "4×10", repos: "90s", note: "Dos plat, colonne neutre — pas de Yates row" },
      { n: "Rowing haltère unilatéral", s: "4×10/côté", repos: "60s", prio: true, note: "✅ Corrige asymétrie scoliose côté faible en 1er" },
      { n: "Pull-over haltère couché", s: "3×12", repos: "60s", note: "Grand dorsal sans compression lombaire" },
      { n: "Tirage horizontal câble (prise neutre)", s: "3×15", repos: "60s", note: "Rhomboïdes + posture épaules" },
      { n: "Curl haltères alterné", s: "3×12", repos: "60s", note: "" },
      { n: "Curl marteau", s: "3×12", repos: "60s", note: "Brachial + avant-bras + volume bras" },
      { n: "Rétraction scapulaire isométrique", s: "4×10 (hold 5s)", repos: "45s", note: "✅ POSTURE — pincer omoplates 5 secondes" },
    ]
  },
  "🔥 JEUDI — LEGS SCULPTURE + CORE (Anti-BBL)": {
    color: "#10b981",
    intro: "🎯 Objectif : AFFINER & SCULPTER les jambes, pas les gonfler. Poids légers, hautes répétitions, cardio intégré. Zéro presse lourde, zéro hack squat.",
    exos: [
      { n: "Fentes marchées haltères LÉGERS (high rep)", s: "4×20/jambe", repos: "60s", prio: true, note: "🔑 Sculpte sans gonfler — poids léger, brûlure maximale" },
      { n: "Step-up banc haltères (unilatéral)", s: "4×15/jambe", repos: "60s", note: "Défini les cuisses + équilibre musculaire jambe/jambe" },
      { n: "Leg curl couché machine (léger, lent)", s: "4×20", repos: "60s", note: "Ischio-jambiers — partie postérieure cuisses = affinement" },
      { n: "Hip thrust LÉGER haltère (fessiers hauts)", s: "3×20", repos: "60s", prio: true, note: "Léger = tonifie sans volumiser. Lordose corrigée ✅" },
      { n: "Abduction machine ou élastique debout", s: "4×25", repos: "45s", note: "Fessier moyen = galbe latéral sans BBL effect" },
      { n: "Mollets debout unilatéral (machine)", s: "3×20/jambe", repos: "45s", note: "Proportions jambes complètes" },
      { n: "Élévations latérales haltères", s: "3×15", repos: "45s", prio: true, note: "🔑 BONUS épaules même en séance jambes — rattraper le haut" },
      { n: "Planche frontale", s: "4×40s", repos: "45s", note: "✅ Anti-hyperlordose — creuser le ventre" },
      { n: "Gainage latéral ALTERNÉ (côté/côté)", s: "3×30s/côté", repos: "45s", note: "🔑 SCOLIOSE — renforce côté concave" },
      { n: "Dead bug lent", s: "3×8/côté", repos: "45s", note: "Core profond, stabilisateurs colonne" },
    ]
  },
  "⚡ VENDREDI — UPPER COMPLET (Volume + Finition)": {
    color: "#a855f7",
    intro: "Séance volume — répétitions plus hautes, moins de charges. Finir la semaine fort.",
    exos: [
      { n: "Arnold press haltères assis", s: "4×12", repos: "75s", prio: true, note: "🔑 Épaules 3 chefs = volume maximal" },
      { n: "Élévations latérales drop-set", s: "3×15→12→10", repos: "60s", note: "Brûler les épaules en fin de semaine" },
      { n: "Tractions australiennes (inclinées)", s: "4×12", repos: "75s", note: "Dos + biceps — moins de charge axiale que tractions verticales" },
      { n: "Rowing haltère unilatéral (léger, high rep)", s: "3×15/côté", repos: "60s", note: "Côté scoliose en PREMIER" },
      { n: "Développé incliné haltères (haut pec)", s: "3×12", repos: "75s", note: "" },
      { n: "Extension triceps câble ou haltère", s: "3×15", repos: "45s", note: "" },
      { n: "Curl concentré", s: "3×12", repos: "45s", note: "Pic biceps" },
      { n: "Rotation externe épaule élastique", s: "3×15/côté", repos: "30s", note: "✅ Coiffe rotateurs — épaules saines long terme" },
    ]
  }
};

// ── CARDIO ──
const CARDIO = [
  {
    type: "LISS (Marche rapide / vélo léger)",
    intensite: "Faible — 60-65% FC max",
    quand: "Matin à jeun OU après séance",
    duree: "30–45 min",
    freq: "3×/semaine (Lun, Mer, Sam)",
    objectif: "Brûler le gras sans cataboliser le muscle",
    color: "#10b981",
    jours: ["Lun", "Mer", "Sam"]
  },
  {
    type: "HIIT (Sprint / vélo intensif)",
    intensite: "Haute — 85-90% FC max",
    quand: "Après séance de salle (pas à jeun)",
    duree: "15–20 min (8 rounds : 30s sprint / 90s récup)",
    freq: "1×/semaine max (Vendredi après séance)",
    objectif: "Boost métabolique, préserver muscle",
    color: "#ef4444",
    jours: ["Ven"]
  }
];

const SEMAINE_TYPE = [
  { jour: "Dim", type: "PUSH", icon: "💪", color: "#f59e0b" },
  { jour: "Lun", type: "CARDIO LISS", icon: "🚶", color: "#10b981" },
  { jour: "Mar", type: "PULL", icon: "🔵", color: "#3b82f6" },
  { jour: "Mer", type: "CARDIO LISS", icon: "🚶", color: "#10b981" },
  { jour: "Jeu", type: "LEGS SCULPT", icon: "🔪", color: "#10b981" },
  { jour: "Ven", type: "UPPER + HIIT", icon: "⚡", color: "#a855f7" },
  { jour: "Sam", type: "CARDIO LISS", icon: "🚶", color: "#10b981" },
];

const POSTURE_ROUTINE = [
  { moment: "🌅 MATIN (10 min)", exos: [
    "Chin tuck debout : 3×15 (menton rentré horizontalement, pas vers le bas)",
    "Cat-cow au sol : 10 respirations lentes",
    "Rotation thoracique assis : 10/côté",
    "Étirement pectoral à la porte : 2×30s",
    "Gainage latéral 20s/côté (scoliose priority)"
  ]},
  { moment: "🌙 SOIR (5 min)", exos: [
    "Chin tuck couché : 2×15",
    "Dead bug lent : 5/côté",
    "Étirement pigeon ou figure 4 : 30s/côté",
    "Respiration diaphragmatique : 10 cycles"
  ]}
];

// ── COU ──
const COU_PROG = [
  { exo: "Chin tuck isométrique (mur derrière tête)", s: "3×10 (hold 5s)", note: "Base — renforce fléchisseurs profonds" },
  { exo: "Flexion cervicale avec résistance main", s: "3×15", note: "Main sur front, résister doucemnt" },
  { exo: "Extension cervicale résistance main", s: "3×15", note: "Main derrière tête" },
  { exo: "Inclinaison latérale résistance", s: "3×12/côté", note: "SCM + scalènes" },
  { exo: "Shrug haltères (trapèze supérieur)", s: "3×15", note: "Cou + trapèzes = look plus épais" },
  { exo: "Face pull haute (câble au niveau yeux)", s: "4×20", note: "Posture + cou indirect" },
];

export default function AnisV2() {
  const [tab, setTab] = useState("plan");
  const [checks, setChecks] = useState({});
  const [expanded, setExpanded] = useState(null);

  const toggle = k => setChecks(p => ({ ...p, [k]: !p[k] }));
  const expand = k => setExpanded(p => p === k ? null : k);

  const tabs = [
    { id: "plan", label: "📅 Planning" },
    { id: "training", label: "💪 Programme" },
    { id: "cardio", label: "🏃 Cardio" },
    { id: "posture", label: "🧘 Posture & Cou" },
    { id: "pesee", label: "⚖️ Pesée" },
  ];

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={S.tag}>PROGRAMME PERSONNALISÉ V2</div>
          <div style={S.title}>ANIS <span style={{color:"#f59e0b"}}>2025</span></div>
          <div style={S.sub}>83kg · 183cm · 21ans · Scoliose prise en compte ✅</div>
        </div>
        <div style={S.badge}>
          <div style={{fontSize:".6rem",color:"#6b7280",letterSpacing:".15em"}}>OBJECTIF</div>
          <div style={{fontFamily:"'Bebas Neue',serif",color:"#f59e0b",fontSize:"1rem",marginTop:".2rem"}}>20 SEM.</div>
          <div style={{fontSize:".72rem",color:"#10b981"}}>83kg SEC 🔥</div>
        </div>
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{...S.tab, ...(tab===t.id ? S.tabOn : {})}}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={S.body}>

        {/* ── PLANNING ── */}
        {tab === "plan" && (
          <div>
            <div style={S.card}>
              <div style={S.cardTitle}>📋 Ta semaine type complète</div>
              <div style={{fontSize:".8rem",color:"#6b7280",marginTop:".3rem"}}>4 séances salle + 3 cardio = 7 jours actifs</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:".4rem",marginBottom:".8rem"}}>
              {SEMAINE_TYPE.map((j,i) => (
                <div key={i} style={{background:j.color+"18",border:`1px solid ${j.color}44`,borderRadius:"6px",padding:".5rem .2rem",textAlign:"center"}}>
                  <div style={{fontSize:".65rem",color:j.color,fontFamily:"'Bebas Neue',serif",letterSpacing:".05em"}}>{j.jour}</div>
                  <div style={{fontSize:"1.1rem",margin:".2rem 0"}}>{j.icon}</div>
                  <div style={{fontSize:".58rem",color:"#9ca3af",lineHeight:1.3}}>{j.type}</div>
                </div>
              ))}
            </div>

            {/* ANALYSE PHYSIQUE */}
            <div style={{...S.card,borderColor:"#f59e0b44",background:"#f59e0b0a"}}>
              <div style={{...S.cardTitle,color:"#f59e0b"}}>🔍 Mon analyse de tes photos</div>
              <div style={{display:"grid",gap:".6rem",marginTop:".8rem"}}>
                {[
                  {label:"Posture de face",val:"Épaules étroites, pecs absents, ventre bas gonflé",icon:"🔴"},
                  {label:"Posture de côté",val:"Forward head clair, épaules enroulées, lordose visible",icon:"🔴"},
                  {label:"Dos",val:"Plat, pas d'épaisseur, légère asymétrie scoliose visible",icon:"🟠"},
                  {label:"Radio",val:"Angle Cobb ~9° zone thoracique — scoliose légère, GÉRABLE",icon:"🟡"},
                  {label:"Vrai profil",val:"Pas obèse — ~15-17% MG mais zéro masse musculaire visible",icon:"✅"},
                  {label:"Équilibre",val:"Manque de stabilité = core profond très faible → priorité",icon:"🔴"},
                ].map((item,i) => (
                  <div key={i} style={{display:"flex",gap:".8rem",alignItems:"flex-start",padding:".6rem 0",borderBottom:"1px solid #111827"}}>
                    <div style={{fontSize:"1rem",flexShrink:0}}>{item.icon}</div>
                    <div>
                      <div style={{fontSize:".72rem",color:"#6b7280",letterSpacing:".1em",textTransform:"uppercase"}}>{item.label}</div>
                      <div style={{fontSize:".85rem",color:"#e5e7eb",marginTop:".2rem"}}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIMELINE */}
            <div style={S.card}>
              <div style={S.cardTitle}>⏱ Quand voir les résultats ?</div>
              <div style={{display:"grid",gap:".8rem",marginTop:".8rem"}}>
                {[
                  {t:"Semaines 1–4",r:"Posture qui s'améliore, jambes qui s'affinent (moins de rétention), épaules qui s'ouvrent.",c:"#3b82f6"},
                  {t:"Semaines 5–8",r:"Épaules visiblement plus larges, cuisses plus sculptées, ventre moins gonflé. Effet BBL qui disparaît.",c:"#f59e0b"},
                  {t:"Semaines 9–14",r:"V-shape qui commence. Jambes proportionnées au haut. Taille affinée. Ratio épaules/hanches équilibré.",c:"#f59e0b"},
                  {t:"Semaines 15–20",r:"Physique symétrique et esthétique. Abdos visibles. Silhouette athlétique complète 🔥",c:"#10b981"},
                ].map((e,i) => (
                  <div key={i} style={{display:"flex",gap:".8rem"}}>
                    <div style={{width:"3px",background:e.c,borderRadius:"2px",flexShrink:0,minHeight:"50px"}} />
                    <div>
                      <div style={{fontFamily:"'Bebas Neue',serif",color:e.c,fontSize:"1rem"}}>{e.t}</div>
                      <div style={{fontSize:".82rem",color:"#9ca3af",lineHeight:1.6,marginTop:".2rem"}}>{e.r}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROGRAMME ── */}
        {tab === "training" && (
          <div>
            <div style={{...S.card,borderColor:"#ef444444",background:"#ef44440a"}}>
              <div style={{...S.cardTitle,color:"#ef4444"}}>⚠️ Règles absolues — Scoliose</div>
              <div style={{display:"grid",gap:".5rem",marginTop:".7rem"}}>
                {[
                  "❌ JAMAIS squat barre avec charge lourde (compression axiale)",
                  "❌ JAMAIS soulevé de terre conventionnel lourd",
                  "❌ JAMAIS good morning avec barre",
                  "❌ JAMAIS presse à jambes lourde / hack squat (gonfle les cuisses)",
                  "✅ Toujours haltères > barre (correction asymétrie)",
                  "✅ Commencer le côté faible en PREMIER (exercices unila.)",
                  "✅ Legs = poids léger + hautes répétitions (sculpter pas gonfler)",
                  "✅ S'arrêter si douleur dans le dos — pas de douleur articulaire",
                ].map((r,i) => (
                  <div key={i} style={{fontSize:".82rem",color: r.startsWith("❌") ? "#ef4444" : "#10b981",lineHeight:1.5}}>{r}</div>
                ))}
              </div>
            </div>

            {Object.entries(PROGRAMME).map(([jour, data], ji) => (
              <div key={ji} style={{...S.card,borderColor:data.color+"44"}}>
                <div onClick={() => expand(jour)} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"1.15rem",color:data.color}}>{jour}</div>
                    <div style={{fontSize:".75rem",color:"#6b7280",marginTop:".2rem"}}>{data.intro}</div>
                  </div>
                  <div style={{color:data.color,fontSize:"1.2rem",flexShrink:0,marginLeft:"1rem"}}>{expanded===jour ? "▲" : "▼"}</div>
                </div>

                {expanded === jour && (
                  <div style={{marginTop:"1rem",overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:".8rem"}}>
                      <thead>
                        <tr style={{borderBottom:`1px solid ${data.color}33`}}>
                          {["Exercice","Séries","Repos",""].map(h => (
                            <th key={h} style={{textAlign:"left",padding:".4rem .3rem",color:"#6b7280",fontWeight:400,fontSize:".65rem",letterSpacing:".1em"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.exos.map((e,ei) => {
                          const key = `${ji}-${ei}`;
                          return (
                            <tr key={ei} style={{borderBottom:"1px solid #0f172a",background: checks[key] ? "rgba(16,185,129,0.06)" : e.prio ? `${data.color}08` : "transparent"}}>
                              <td style={{padding:".55rem .3rem",verticalAlign:"top"}}>
                                <div style={{color: checks[key] ? "#4b5563" : "#e5e7eb", textDecoration: checks[key] ? "line-through" : "none", lineHeight:1.4}}>
                                  {e.prio && <span style={{color:data.color,marginRight:".3rem"}}>★</span>}{e.n}
                                </div>
                                {e.note && <div style={{fontSize:".68rem",color:"#6b7280",marginTop:".2rem",lineHeight:1.4}}>{e.note}</div>}
                              </td>
                              <td style={{padding:".55rem .3rem",color:data.color,fontFamily:"'Bebas Neue',serif",whiteSpace:"nowrap",verticalAlign:"top"}}>{e.s}</td>
                              <td style={{padding:".55rem .3rem",color:"#6b7280",fontSize:".75rem",whiteSpace:"nowrap",verticalAlign:"top"}}>{e.repos}</td>
                              <td style={{padding:".55rem .3rem",verticalAlign:"top"}}>
                                <div onClick={() => toggle(key)} style={{...S.checkbox,borderColor: checks[key]?"#10b981":"#374151",background: checks[key]?"#10b981":"transparent",cursor:"pointer",margin:0}}>
                                  {checks[key] && <span style={{color:"#fff",fontSize:".65rem"}}>✓</span>}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── CARDIO ── */}
        {tab === "cardio" && (
          <div>
            <div style={S.card}>
              <div style={S.cardTitle}>🏃 Plan cardio — Skinny fat</div>
              <div style={{fontSize:".83rem",color:"#9ca3af",marginTop:".4rem",lineHeight:1.7}}>
                Pour toi (skinny fat) : priorité au <strong style={{color:"#10b981"}}>LISS</strong> = brûle le gras sans perdre le muscle. Le HIIT 1x/semaine seulement pour booster le métabolisme.
              </div>
            </div>

            {CARDIO.map((c,i) => (
              <div key={i} style={{...S.card,borderColor:c.color+"44",background:c.color+"08"}}>
                <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"1.3rem",color:c.color}}>{c.type}</div>
                <div style={{display:"grid",gap:".5rem",marginTop:".8rem"}}>
                  {[
                    ["🎯 Objectif", c.objectif],
                    ["⚡ Intensité", c.intensite],
                    ["⏱ Durée", c.duree],
                    ["📅 Fréquence", c.freq],
                    ["🕐 Quand", c.quand],
                  ].map(([label,val],j) => (
                    <div key={j} style={{display:"flex",gap:".8rem",alignItems:"flex-start",padding:".5rem 0",borderBottom:"1px solid #0f172a"}}>
                      <div style={{fontSize:".72rem",color:"#6b7280",minWidth:"80px",flexShrink:0}}>{label}</div>
                      <div style={{fontSize:".85rem",color:"#e5e7eb"}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* PROTOCOLE LISS */}
            <div style={S.card}>
              <div style={S.cardTitle}>🚶 Protocole LISS (Marche rapide)</div>
              <div style={{display:"grid",gap:".5rem",marginTop:".8rem"}}>
                {[
                  "Vitesse : 5.5–6.5 km/h (tu transpires légèrement)",
                  "Légère inclinaison tapis (+2%) si tapis de course",
                  "OU vélo niveau 4–5 en résistance légère",
                  "OU marche dehors rythmée 30–45 min",
                  "Écoute musique/podcast — pas besoin de souffrir",
                  "FC cible : 120–130 bpm (tu peux parler normalement)",
                ].map((r,i) => (
                  <div key={i} style={{display:"flex",gap:".8rem",padding:".5rem 0",borderBottom:"1px solid #0f172a",fontSize:".83rem",color:"#d1d5db"}}>
                    <span style={{color:"#10b981",flexShrink:0}}>→</span>{r}
                  </div>
                ))}
              </div>
            </div>

            {/* PROTOCOLE HIIT */}
            <div style={S.card}>
              <div style={S.cardTitle}>⚡ Protocole HIIT (Vendredi après séance)</div>
              <div style={{display:"grid",gap:".4rem",marginTop:".8rem"}}>
                {[
                  {p:"0–2 min","action":"Échauffement léger",c:"#6b7280"},
                  {p:"Sprint 30s","action":"90-95% FC max — tout donner",c:"#ef4444"},
                  {p:"Récup 90s","action":"Marche lente ou arrêt complet",c:"#10b981"},
                  {p:"× 8 rounds","action":"= 16 min total (sans échauffement)",c:"#f59e0b"},
                  {p:"2–3 min","action":"Récupération finale, marche",c:"#6b7280"},
                ].map((r,i) => (
                  <div key={i} style={{display:"flex",gap:".8rem",alignItems:"center",padding:".5rem 0",borderBottom:"1px solid #0f172a"}}>
                    <div style={{fontFamily:"'Bebas Neue',serif",color:r.c,minWidth:"70px",fontSize:".85rem"}}>{r.p}</div>
                    <div style={{fontSize:".83rem",color:"#d1d5db"}}>{r.action}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:"1rem",padding:".8rem",background:"#ef444410",border:"1px solid #ef444430",borderRadius:"4px",fontSize:".78rem",color:"#ef4444"}}>
                ⚠️ Max 1× par semaine. Si tu es trop fatigué, remplace par LISS 20 min. Ne jamais faire HIIT à jeun.
              </div>
            </div>
          </div>
        )}

        {/* ── POSTURE & COU ── */}
        {tab === "posture" && (
          <div>
            {/* COU */}
            <div style={{...S.card,borderColor:"#f59e0b44"}}>
              <div style={{...S.cardTitle,color:"#f59e0b"}}>💪 Programme COU (faible → épais)</div>
              <div style={{fontSize:".82rem",color:"#9ca3af",marginTop:".3rem",lineHeight:1.6}}>À faire 2–3× par semaine. Les trapèzes + SCM donneront l'impression d'un cou plus épais et plus fort.</div>
              <div style={{overflowX:"auto",marginTop:"1rem"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:".8rem"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #1f2937"}}>
                      {["Exercice","Séries","Note"].map(h => (
                        <th key={h} style={{textAlign:"left",padding:".4rem .3rem",color:"#6b7280",fontWeight:400,fontSize:".65rem"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COU_PROG.map((e,i) => (
                      <tr key={i} style={{borderBottom:"1px solid #0f172a"}}>
                        <td style={{padding:".6rem .3rem",color:"#e5e7eb",lineHeight:1.4}}>{e.exo}</td>
                        <td style={{padding:".6rem .3rem",color:"#f59e0b",fontFamily:"'Bebas Neue',serif",whiteSpace:"nowrap"}}>{e.s}</td>
                        <td style={{padding:".6rem .3rem",color:"#6b7280",fontSize:".75rem",lineHeight:1.4}}>{e.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROUTINE POSTURE */}
            {POSTURE_ROUTINE.map((r,i) => (
              <div key={i} style={S.card}>
                <div style={S.cardTitle}>{r.moment}</div>
                <div style={{display:"grid",gap:".4rem",marginTop:".8rem"}}>
                  {r.exos.map((ex,j) => {
                    const k = `post-${i}-${j}`;
                    return (
                      <div key={j} onClick={() => toggle(k)} style={{...S.checkRow,background: checks[k] ? "rgba(16,185,129,0.08)" : "transparent"}}>
                        <div style={{...S.checkbox,borderColor: checks[k]?"#10b981":"#374151",background: checks[k]?"#10b981":"transparent"}}>
                          {checks[k] && <span style={{color:"#fff",fontSize:".65rem"}}>✓</span>}
                        </div>
                        <span style={{fontSize:".83rem",color: checks[k]?"#4b5563":"#d1d5db",textDecoration: checks[k]?"line-through":"none",lineHeight:1.5}}>{ex}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* FORWARD HEAD */}
            <div style={{...S.card,borderColor:"#3b82f644"}}>
              <div style={{...S.cardTitle,color:"#3b82f6"}}>🪢 Forward Head — Le fix</div>
              <div style={{display:"grid",gap:".6rem",marginTop:".8rem"}}>
                {[
                  {t:"Le problème",c:"Ta tête est projetée ~3-5cm en avant. Pour chaque cm, ça rajoute ~5kg de tension sur la colonne cervicale."},
                  {t:"Exercice clé",c:"Chin tuck : rentre le menton horizontalement (comme si tu voulais faire un double menton). Tiens 5s. 15 répétitions, 3x par jour."},
                  {t:"Erreur commune",c:"Baisser la tête vers le bas — ça ne corrige pas. Le mouvement est HORIZONTAL, pas vertical."},
                  {t:"Habitude quotidienne",c:"Vérifier tes oreilles au-dessus des épaules quand tu marches. Utilise ton reflet dans les vitres comme feedback."},
                ].map((item,i) => (
                  <div key={i} style={{padding:".6rem 0",borderBottom:"1px solid #0f172a"}}>
                    <div style={{fontSize:".68rem",color:"#3b82f6",letterSpacing:".1em",textTransform:"uppercase",marginBottom:".3rem"}}>{item.t}</div>
                    <div style={{fontSize:".83rem",color:"#d1d5db",lineHeight:1.7}}>{item.c}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PESÉE ── */}
        {tab === "pesee" && (
          <div>
            <div style={{...S.card,borderColor:"#10b98144",background:"#10b98108"}}>
              <div style={{...S.cardTitle,color:"#10b981"}}>⚖️ Règle d'or : Cru ou Cuit ?</div>
              <div style={{display:"grid",gap:".6rem",marginTop:".8rem"}}>
                {REGLE.map((r,i) => (
                  <div key={i} style={{display:"flex",gap:".8rem",alignItems:"flex-start",padding:".6rem 0",borderBottom:"1px solid #0f172a"}}>
                    <div style={{fontSize:"1.2rem",flexShrink:0}}>{r.emoji}</div>
                    <div>
                      <div style={{fontSize:".82rem",fontWeight:600,color:"#e5e7eb"}}>{r.r}</div>
                      <div style={{fontSize:".78rem",color:"#10b981",marginTop:".2rem"}}>{r.c}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:"1rem",padding:".8rem",background:"#f59e0b10",border:"1px solid #f59e0b30",borderRadius:"4px",fontSize:".78rem",color:"#f59e0b",lineHeight:1.6}}>
                💡 <strong>La règle la plus simple :</strong> Pèse toujours CRU. Les applis (MyFitnessPal, Cronometer) utilisent les valeurs crues par défaut. Tu évites toute confusion.
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardTitle}>📊 Tableau cru → cuit</div>
              <div style={{overflowX:"auto",marginTop:".8rem"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:".82rem"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #1f2937"}}>
                      {["Aliment","Peser CRU","Équiv. CUIT","Info"].map(h => (
                        <th key={h} style={{textAlign:"left",padding:".5rem .4rem",color:"#6b7280",fontWeight:400,fontSize:".65rem",letterSpacing:".08em"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PESEES.map((p,i) => (
                      <tr key={i} style={{borderBottom:"1px solid #0f172a",background: i%2===0?"transparent":"#0f172a44"}}>
                        <td style={{padding:".6rem .4rem",color:"#e5e7eb",fontWeight:500}}>{p.aliment}</td>
                        <td style={{padding:".6rem .4rem",color:"#f59e0b"}}>{p.cru}</td>
                        <td style={{padding:".6rem .4rem",color:"#10b981"}}>{p.cuit}</td>
                        <td style={{padding:".6rem .4rem",color:"#6b7280",fontSize:".72rem"}}>{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EXEMPLE JOURNÉE */}
            <div style={S.card}>
              <div style={S.cardTitle}>🍽️ Exemple : comment peser ta journée</div>
              <div style={{display:"grid",gap:".5rem",marginTop:".8rem"}}>
                {[
                  {meal:"Déjeuner",items:[{a:"Poulet",c:"Peser CRU avant cuisson → 200g cru",prot:"46g"},
                    {a:"Riz",c:"Peser CRU → 75g secs dans casserole",prot:"5g + gluc 55g"},
                    {a:"Lentilles",c:"Peser CRU → 60g secs",prot:"14g"},
                  ]},
                  {meal:"Dîner",items:[{a:"Poisson",c:"Peser CRU avant cuisson → 200g",prot:"40g"},
                    {a:"Pomme de terre",c:"Peser CRU → 200g (avant vapeur)",prot:"gluc 30g"},
                  ]}
                ].map((meal,mi) => (
                  <div key={mi} style={{marginBottom:".5rem"}}>
                    <div style={{fontFamily:"'Bebas Neue',serif",color:"#f59e0b",fontSize:"1rem",marginBottom:".4rem"}}>{meal.meal}</div>
                    {meal.items.map((item,ii) => (
                      <div key={ii} style={{display:"flex",justifyContent:"space-between",padding:".4rem 0",borderBottom:"1px solid #111827",fontSize:".8rem"}}>
                        <div>
                          <span style={{color:"#e5e7eb",fontWeight:500}}>{item.a}</span>
                          <div style={{fontSize:".72rem",color:"#6b7280",marginTop:".1rem"}}>{item.c}</div>
                        </div>
                        <div style={{color:"#10b981",fontSize:".75rem",textAlign:"right",flexShrink:0,marginLeft:".5rem"}}>{item.prot}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const S = {
  root: { background:"#030712", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", color:"#f9fafb", maxWidth:"480px", margin:"0 auto" },
  header: { background:"linear-gradient(135deg,#0f172a,#111827)", padding:"1.3rem 1.2rem 1rem", borderBottom:"1px solid #1f2937", display:"flex", justifyContent:"space-between", alignItems:"flex-start" },
  tag: { fontSize:".58rem", letterSpacing:".25em", color:"#6b7280", marginBottom:".3rem", textTransform:"uppercase" },
  title: { fontFamily:"'Bebas Neue',serif", fontSize:"2rem", letterSpacing:".05em", lineHeight:1 },
  sub: { fontSize:".7rem", color:"#6b7280", marginTop:".3rem" },
  badge: { textAlign:"right", flexShrink:0, marginLeft:"1rem", background:"#1f2937", padding:".6rem .8rem", borderRadius:"6px", border:"1px solid #374151" },
  tabs: { display:"flex", overflowX:"auto", background:"#0f172a", borderBottom:"1px solid #1f2937" },
  tab: { flex:"0 0 auto", padding:".75rem .85rem", background:"transparent", border:"none", color:"#6b7280", fontSize:".7rem", cursor:"pointer", borderBottom:"2px solid transparent", whiteSpace:"nowrap", letterSpacing:".03em" },
  tabOn: { color:"#f59e0b", borderBottomColor:"#f59e0b", background:"rgba(245,158,11,0.05)" },
  body: { padding:".9rem" },
  card: { background:"#0f172a", border:"1px solid #1f2937", borderRadius:"8px", padding:"1.1rem", marginBottom:".75rem" },
  cardTitle: { fontFamily:"'Bebas Neue',serif", fontSize:"1.05rem", letterSpacing:".04em", color:"#e5e7eb" },
  checkbox: { width:"18px", height:"18px", border:"1.5px solid", borderRadius:"3px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" },
  checkRow: { display:"flex", alignItems:"flex-start", gap:".7rem", padding:".5rem .4rem", borderRadius:"5px", cursor:"pointer", marginBottom:".15rem" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
  button { font-family: 'DM Sans', sans-serif; }
`;
