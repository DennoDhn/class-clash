// Shared descriptions and gameplay values. No browser dependencies.
export const PILOTS=[
 {id:'mint',name:'Mint Pilot',color:'#9dff70',price:0,ability:'Schutzblase',effect:'shield',duration:0,cooldown:28,passive:'Startet mit 25 % Spezialenergie.',desc:'Aktiviere einen Schild, der den nächsten Treffer abfängt. Ideal, um neue Abschnitte kennenzulernen.'},
 {id:'coral',name:'Solar Rush',color:'#ff906e',price:80,ability:'Sonnenboost',effect:'boost',duration:3,cooldown:30,passive:'Boosts halten 1 Sekunde länger.',desc:'Rase kurzzeitig schneller und unverwundbar durch Hindernisse. Die Steuerung bleibt in deiner Hand.'},
 {id:'ice',name:'Glacier',color:'#85dcff',price:140,ability:'Zeitlupe',effect:'slow',duration:7,cooldown:32,passive:'Zeitlupe hält 2 Sekunden länger.',desc:'Bremse die Strecke auf 65 % Tempo. Dein Jetpack reagiert normal – mehr Zeit für präzise Manöver.'},
 {id:'pink',name:'Pink Nova',color:'#ffa5e9',price:220,ability:'Supermagnet',effect:'magnet',duration:10,cooldown:30,passive:'Magnetreichweite +45 Pixel.',desc:'Ziehe Kristalle und Versorgungskapseln aus der Umgebung an. Schatzringe musst du selbst treffen.'},
 {id:'gold',name:'Gold Wing',color:'#ffd16b',price:350,ability:'Goldrausch',effect:'double',duration:10,cooldown:38,passive:'Jedes 10. Tor bringt 2 zusätzliche Münzen.',desc:'Verdopple während der Fähigkeit Münzen aus Kristallen und Ringen. Auftragsbelohnungen bleiben unverändert.'},
 {id:'lilac',name:'Ultra Violet',color:'#bba4ff',price:500,ability:'Phasensprung',effect:'phase',duration:4,cooldown:34,passive:'Spezialenergie lädt 10 % schneller.',desc:'Werde für kurze Zeit unverwundbar, ohne das Streckentempo zu ändern. Perfekt für schwierige Passagen.'},
 {id:'duck',name:'Captain Quack',model:'duck',category:'Tierisch',rarity:'Ungewöhnlich',color:'#ffd55f',price:120,ability:'Quietschschild',effect:'shield',duration:0,cooldown:26,startEnergy:50,passive:'Startet mit 50 % Spezialenergie.',desc:'Eine Badeente auf Abwegen. Dein Quietschschild fängt einen Treffer ab – ganz ohne Schwimmflügel.'},
 {id:'drone',name:'VECTOR-9',model:'drone',category:'Hightech',rarity:'Selten',color:'#63e4e4',price:280,ability:'Bergungsprotokoll',effect:'magnet',duration:8,cooldown:24,magnetBonus:25,passive:'Magnetreichweite +25 Pixel.',desc:'Autonome Bergungsdrohne mit vier Rotoren und Scannerauge. Aktiviert 8 Sekunden Sammelmagnet.'},
 {id:'toast',name:'Toast Commander',model:'toast',category:'Quatsch',rarity:'Ungewöhnlich',color:'#e8ae6f',price:360,ability:'Knusperantrieb',effect:'boost',duration:3,cooldown:30,extraTimers:{double:5},boostBonus:1,passive:'Jeder Boost hält 1 Sekunde länger.',desc:'Ein fliegender Toast mit Butterantrieb. 4 Sekunden geschützter Boost plus 5 Sekunden doppelte Sammelmünzen.'},
 {id:'cat',name:'Ninja Miez',model:'cat',category:'Tierisch',rarity:'Selten',color:'#8d82bc',price:550,ability:'Samtpfoten',effect:'phase',duration:3,cooldown:25,startEnergy:35,passive:'Startet mit 35 % Spezialenergie.',desc:'Eine maskierte Katze auf einem schwebenden Brett. Gleitet 3 Sekunden unverwundbar durch Hindernisse.'},
 {id:'ufo',name:'UFO 404',model:'ufo',category:'Hightech',rarity:'Episch',color:'#88efb1',price:850,ability:'Traktorstrahl',effect:'magnet',duration:10,cooldown:34,extraTimers:{phase:2},magnetBonus:40,passive:'Magnetreichweite +40 Pixel.',desc:'Außerirdische Abholung: 10 Sekunden Magnet und beim Aktivieren 2 Sekunden Phasenschutz. Pilot grinst inklusive.'},
 {id:'toilet',name:'Klo-Kopter',model:'toilet',category:'Quatsch',rarity:'Episch',color:'#b7e2ed',price:1200,ability:'Turbo-Spülung',effect:'boost',duration:3,cooldown:35,extraTimers:{magnet:8},boostBonus:1,passive:'Jeder Boost hält 1 Sekunde länger.',desc:'Peinlich schnell. Eine fliegende Toilette mit Rotor und Papierrolle: 4 Sekunden geschützter Boost und 8 Sekunden Sog-Magnet.'},
 {id:'pig',name:'Sparschwein Deluxe',model:'pig',category:'Quatsch',rarity:'Episch',color:'#f4a9ba',price:1700,ability:'Kassensturz',effect:'double',duration:12,cooldown:38,extraTimers:{magnet:5},gateBonusEvery:10,gateBonusAmount:3,passive:'Jedes 10. Tor bringt 3 zusätzliche Münzen.',desc:'Das Sparschwein fliegt Business Class. 12 Sekunden doppelte Sammelmünzen, dazu 5 Sekunden Magnet.'},
 {id:'rocket',name:'APEX Interceptor',model:'rocket',category:'Hightech',rarity:'Profi',color:'#e0e7ee',price:2400,ability:'Nachbrenner',effect:'boost',duration:5,cooldown:32,extraTimers:{magnet:6},boostBonus:2,passive:'Jeder Boost hält 2 Sekunden länger.',desc:'Ein präziser Abfangjäger mit Doppeltriebwerk. 5 Sekunden geschützter Hochgeschwindigkeitsflug und 6 Sekunden Sammelmagnet.'},
 {id:'jelly',name:'Nebula Qualle',model:'jelly',category:'Tierisch',rarity:'Legendär',color:'#bfa2ff',price:3200,ability:'Zeitblase',effect:'slow',duration:8,cooldown:36,extraTimers:{phase:3},chargeRate:1.1,passive:'Spezialenergie lädt 10 % schneller.',desc:'Biolumineszente Tentakel und eine kleine Raumzeitstörung: 8 Sekunden Zeitlupe, die ersten 3 Sekunden unverwundbar.'},
 {id:'dragon',name:'Auric Drache',model:'dragon',category:'Prestige',rarity:'Legendär',color:'#f1bd57',price:5000,ability:'Goldenes Inferno',effect:'boost',duration:4,cooldown:42,extraTimers:{double:10},boostBonus:1,gateBonusEvery:10,gateBonusAmount:2,passive:'Boosts +1 Sekunde. Jedes 10. Tor: +2 Münzen.',desc:'Ein goldener Flügeldrache. Entfesselt 4 Sekunden geschützten Boost und 10 Sekunden doppelte Sammelmünzen.'},
 {id:'void',name:'Singularität X',model:'void',category:'Prestige',rarity:'Mythisch',color:'#ab8aff',price:9000,ability:'Ereignishorizont',effect:'phase',duration:5,cooldown:44,extraTimers:{magnet:12},magnetBonus:70,passive:'Magnetreichweite +70 Pixel.',desc:'Ein schwebendes schwarzes Loch mit leuchtendem Akkretionsring. 5 Sekunden Phasenschutz und 12 Sekunden gewaltiger Sammelsog.'},
 {id:'ark',name:'SOVEREIGN ARCHE',model:'ark',category:'Prestige',rarity:'Unikat',color:'#f6dc8c',price:18000,ability:'Imperiales Protokoll',effect:'phase',duration:6,cooldown:55,extraTimers:{double:12,magnet:12},innateRescue:1,passive:'Ein eigener Rettungskern pro neuem Endlosflug – zusätzlich zu deinem Vorrat.',desc:'Eine fliegende Festung aus Gold und dunklem Titan. 6 Sekunden Phasenschutz plus 12 Sekunden Magnet und doppelte Sammelmünzen. Das teuerste Sammlerstück im Hangar.'}

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
