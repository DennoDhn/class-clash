// Shared descriptions and gameplay values. No browser dependencies.
export const PILOTS=[
 {id:'mint',name:'Mint Pilot',color:'#9dff70',price:0,ability:'Schutzblase',effect:'shield',duration:0,cooldown:28,passive:'Startet mit 25 % Spezialenergie.',desc:'Aktiviere einen Schild, der den nächsten Treffer abfängt. Ideal, um neue Abschnitte kennenzulernen.'},
 {id:'coral',name:'Solar Rush',color:'#ff906e',price:80,ability:'Sonnenboost',effect:'boost',duration:3,cooldown:30,passive:'Boosts halten 1 Sekunde länger.',desc:'Rase kurzzeitig schneller und unverwundbar durch Hindernisse. Die Steuerung bleibt in deiner Hand.'},
 {id:'ice',name:'Glacier',color:'#85dcff',price:140,ability:'Zeitlupe',effect:'slow',duration:7,cooldown:32,passive:'Zeitlupe hält 2 Sekunden länger.',desc:'Bremse die Strecke auf 65 % Tempo. Dein Jetpack reagiert normal – mehr Zeit für präzise Manöver.'},
 {id:'pink',name:'Pink Nova',color:'#ffa5e9',price:220,ability:'Supermagnet',effect:'magnet',duration:10,cooldown:30,passive:'Magnetreichweite +45 Pixel.',desc:'Ziehe Kristalle und Versorgungskapseln aus der Umgebung an. Schatzringe musst du selbst treffen.'},
 {id:'gold',name:'Gold Wing',color:'#ffd16b',price:350,ability:'Goldrausch',effect:'double',duration:10,cooldown:38,passive:'Jedes 10. Tor bringt 2 zusätzliche Münzen.',desc:'Verdopple während der Fähigkeit Münzen aus Kristallen und Ringen. Auftragsbelohnungen bleiben unverändert.'},
 {id:'lilac',name:'Ultra Violet',color:'#bba4ff',price:500,ability:'Phasensprung',effect:'phase',duration:4,cooldown:34,passive:'Spezialenergie lädt 10 % schneller.',desc:'Werde für kurze Zeit unverwundbar, ohne das Streckentempo zu ändern. Perfekt für schwierige Passagen.'}
];
export const EQUIPMENT=[
 {id:'helm-standard',type:'helmet',name:'Original',price:0,desc:'Leichter Standardhelm. Keine Zusatzwirkung.'},
 {id:'helm-comet',type:'helmet',name:'Comet',price:45,desc:'Deine Spezialfähigkeit lädt 15 % schneller.'},
 {id:'helm-cat',type:'helmet',name:'Lynx',price:110,desc:'Magnete erreichen Kristalle und Kapseln 30 Pixel weiter.'},
 {id:'helm-crown',type:'helmet',name:'Sky King',price:280,desc:'Jedes 5. passierte Tor bringt 1 zusätzliche Münze.'},
 {id:'pack-classic',type:'pack',name:'Classic',price:0,desc:'Direkter, ausgewogener Schub. Keine Zusatzwirkung.'},
 {id:'pack-twin',type:'pack',name:'Twin Boost',price:65,desc:'Jeder Boost hält 1 Sekunde länger.'},
 {id:'pack-wing',type:'pack',name:'Sky Wing',price:180,desc:'Beim Loslassen sinkst du sanfter: 12 % weniger Fallbeschleunigung.'},
 {id:'trail-spark',type:'trail',name:'Funken',price:0,desc:'Warme Funken hinter deinem Jetpack. Rein optisch.'},
 {id:'trail-ice',type:'trail',name:'Eiskristalle',price:55,desc:'Ein kühles, weißblaues Leuchtband. Rein optisch.'},
 {id:'trail-rainbow',type:'trail',name:'Prisma',price:160,desc:'Vier leuchtende Farben folgen deinem Flug. Rein optisch.'}
];
export const SUPPLIES=[
 {id:'life',name:'Rettungskern',icon:'♥',price:25,limit:9,carry:1,desc:'Ein Zusatzleben pro Flug: rettet dich automatisch bei einem tödlichen Treffer und setzt dich sicher zurück.'},
 {id:'boost',name:'Boostzelle',icon:'»',price:12,limit:20,carry:2,desc:'3 Sekunden mehr Tempo und Unverwundbarkeit. Im Flug mit B oder dem Boostknopf aktivieren.'},
 {id:'magnet',name:'Magnetkapsel',icon:'◎',price:15,limit:20,carry:1,desc:'12 Sekunden lang Kristalle und Versorgungskapseln anziehen. Im Flug mit M oder dem Magnetknopf aktivieren.'}
];
export const ZONES=[
 {name:'Skyline Valley',tag:'Freier Himmel',hint:'Finde deinen Rhythmus zwischen den Wolkentürmen.',color:'#c2ecd7'},
 {name:'Goldgärten',tag:'Ringe & Schätze',hint:'Goldene Ringe bringen Extra-Münzen. Triff ihre Mitte.',color:'#ffe0a0'},
 {name:'Neonwerft',tag:'Warnfelder',hint:'Gestrichelt heißt inaktiv. Die mittlere Passage bleibt frei.',color:'#e3b4ef'},
 {name:'Drohnenpass',tag:'Patrouillen',hint:'Drohnen sichern die Ränder. Fliege durch ihre freie Mitte.',color:'#b3d9ff'},
 {name:'Aurora-Inseln',tag:'Erholung & Vorräte',hint:'Breitere Passagen und Versorgung für den nächsten Sektor.',color:'#a7f1e6'}
];
export const getPilot=id=>PILOTS.find(p=>p.id===id)||PILOTS[0];
