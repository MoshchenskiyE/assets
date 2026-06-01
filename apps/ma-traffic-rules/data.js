/*
 * Massachusetts Driving — gamified course data (Duolingo-style).
 *
 * Educational summary of Massachusetts driving law, drawn from the
 * Massachusetts Driver's Manual (RMV), M.G.L. Chapters 85/89/90, and 720 CMR.
 * Not legal advice — verify at https://www.mass.gov/rmv.
 *
 * Structure:
 *   UNITS[] -> { title, subtitle, color, lessons[] }
 *   lesson  -> { id, title, icon, rule (reference card), questions[] }
 *   question-> { q, options[], answer (index), explain }
 */

const UNITS = [
  {
    title: "Unit 1 · Rules of the Road",
    subtitle: "Speed, signals & who goes first",
    color: "green",
    lessons: [
      {
        id: "speed",
        title: "Speed Limits",
        icon: "🚦",
        rule: {
          heading: "Default speed limits",
          points: [
            "20 mph in a school zone or safety zone.",
            "30 mph in a thickly settled or business district.",
            "40 mph outside thickly settled areas.",
            "65 mph max on interstates where posted.",
            "Fines double in work zones and school zones.",
          ],
          ref: "M.G.L. c. 90 §17, §18",
        },
        questions: [
          {
            q: "What is the default speed limit in a thickly settled or business district?",
            options: ["20 mph", "30 mph", "40 mph", "50 mph"],
            answer: 1,
            explain: "30 mph is the statutory limit there unless a sign says otherwise.",
          },
          {
            q: "In a school zone, fines for speeding are…",
            options: ["Waived", "The same", "Doubled", "Tripled"],
            answer: 2,
            explain: "Fines are doubled in school zones and work zones.",
          },
          {
            q: "On most Massachusetts interstates, the maximum posted speed is…",
            options: ["55 mph", "60 mph", "65 mph", "70 mph"],
            answer: 2,
            explain: "65 mph is the maximum on most interstates where posted.",
          },
          {
            q: "Even below the limit, the law says you must drive at a speed that is…",
            options: [
              "As fast as traffic",
              "Reasonable and proper for conditions",
              "Exactly the limit",
              "Your choice",
            ],
            answer: 1,
            explain: "You must always drive at a reasonable and proper speed for conditions.",
          },
        ],
      },
      {
        id: "signals",
        title: "Traffic Signals",
        icon: "🚥",
        rule: {
          heading: "Signals & turning on red",
          points: [
            "Right on red allowed after a full stop, unless posted otherwise.",
            "Left on red only from a one-way onto another one-way street.",
            "Flashing red = stop, then go (like a stop sign).",
            "Flashing yellow = slow down, proceed with caution.",
            "Solid yellow = stop if you safely can; red is next.",
          ],
          ref: "M.G.L. c. 89 §8; 720 CMR 9.06",
        },
        questions: [
          {
            q: "A right turn on red is allowed when…",
            options: [
              "Never",
              "After a complete stop, unless a sign prohibits it",
              "Only after 9 p.m.",
              "Without stopping if clear",
            ],
            answer: 1,
            explain: "Stop fully first, yield, then turn — unless a 'No Turn on Red' sign is posted.",
          },
          {
            q: "A flashing red light means…",
            options: [
              "Go faster",
              "Stop, then proceed when safe",
              "Yield only",
              "Signal is broken, ignore it",
            ],
            answer: 1,
            explain: "Treat a flashing red exactly like a stop sign.",
          },
          {
            q: "A left turn on red is permitted only…",
            options: [
              "From a one-way street onto another one-way street, after stopping",
              "On any divided road",
              "When no police are present",
              "It is never allowed",
            ],
            answer: 0,
            explain: "One-way to one-way only, after a complete stop.",
          },
          {
            q: "A flashing yellow light means…",
            options: ["Stop", "Slow down and proceed with caution", "Speed up", "U-turn only"],
            answer: 1,
            explain: "Flashing yellow = caution; slow down and watch for cross traffic.",
          },
        ],
      },
      {
        id: "rightofway",
        title: "Right of Way",
        icon: "🔀",
        rule: {
          heading: "Who goes first",
          points: [
            "4-way stop: first to arrive goes first; tie → driver on the right.",
            "Rotary: vehicles already in the circle have the right of way.",
            "Always yield to pedestrians in a crosswalk.",
            "Turning left: yield to oncoming traffic.",
            "Yield to emergency vehicles — pull right and stop.",
          ],
          ref: "M.G.L. c. 89 §8, §11",
        },
        questions: [
          {
            q: "At a rotary (roundabout), who has the right of way?",
            options: [
              "Vehicles entering",
              "Vehicles already in the rotary",
              "The bigger vehicle",
              "Whoever honks",
            ],
            answer: 1,
            explain: "Yield before entering — traffic already circulating goes first.",
          },
          {
            q: "Two cars reach a 4-way stop at the same time. Who goes first?",
            options: [
              "The faster car",
              "The car on the left",
              "The car on the right",
              "The bigger car",
            ],
            answer: 2,
            explain: "On a tie, the driver on the right has the right of way.",
          },
          {
            q: "When you hear a siren and see emergency lights, you should…",
            options: [
              "Speed up to clear the road",
              "Stop where you are",
              "Pull to the right and stop",
              "Turn left immediately",
            ],
            answer: 2,
            explain: "Pull over to the right and stop until the emergency vehicle passes.",
          },
        ],
      },
    ],
  },
  {
    title: "Unit 2 · Safety First",
    subtitle: "Belts, phones & school buses",
    color: "blue",
    lessons: [
      {
        id: "handsfree",
        title: "Hands-Free Law",
        icon: "📱",
        rule: {
          heading: "Hands-Free Law (since 2020)",
          points: [
            "You may not hold a phone or device while driving.",
            "Only a single tap/swipe to activate hands-free mode.",
            "Texting is banned for all drivers.",
            "Drivers under 18: no devices at all, even hands-free.",
            "Fines: $100 / $250 / $500+ with a surcharge.",
          ],
          ref: "M.G.L. c. 90 §13B",
        },
        questions: [
          {
            q: "Under the Hands-Free Law, when may you touch your phone?",
            options: [
              "Anytime if not texting",
              "A single tap or swipe to activate hands-free mode",
              "Only at red lights",
              "Never, at all",
            ],
            answer: 1,
            explain: "One tap/swipe to start hands-free mode. Holding the device is illegal.",
          },
          {
            q: "Drivers under 18 may use an electronic device…",
            options: [
              "Hands-free only",
              "For navigation only",
              "Not at all, even hands-free",
              "Anytime",
            ],
            answer: 2,
            explain: "Junior operators may not use any device, even hands-free.",
          },
          {
            q: "The fine for a first hands-free offense is…",
            options: ["$25", "$100", "$250", "$500"],
            answer: 1,
            explain: "$100 for the first offense, rising to $250 and $500+ after that.",
          },
        ],
      },
      {
        id: "seatbelts",
        title: "Belts & Car Seats",
        icon: "🔒",
        rule: {
          heading: "Seat belts & child restraints",
          points: [
            "Every driver and passenger must buckle up.",
            "Car seat/booster required until age 8 OR taller than 4'9\".",
            "Child restraint law is a primary offense.",
            "Adult belt law is a secondary offense ($25 fine).",
          ],
          ref: "M.G.L. c. 90 §7AA, §13A",
        },
        questions: [
          {
            q: "A child must use a car seat or booster until…",
            options: [
              "Age 5 or 3'6\"",
              "Age 6 or 4'0\"",
              "Age 8 or 4'9\"",
              "Age 12",
            ],
            answer: 2,
            explain: "Until age 8 OR taller than 4 feet 9 inches.",
          },
          {
            q: "Who must wear a seat belt in the car?",
            options: [
              "Only the driver",
              "Only front-seat riders",
              "Every driver and passenger",
              "Only on highways",
            ],
            answer: 2,
            explain: "All occupants must be properly restrained.",
          },
        ],
      },
      {
        id: "schoolbus",
        title: "School Buses",
        icon: "🚌",
        rule: {
          heading: "Stopping for school buses",
          points: [
            "Red flashing lights + stop sign out → STOP, both directions.",
            "Divided highway with a median: opposite side need not stop.",
            "Stay stopped until the lights stop and the sign folds in.",
            "First-offense fine: $250.",
          ],
          ref: "M.G.L. c. 90 §14",
        },
        questions: [
          {
            q: "A school bus ahead flashes red lights and extends its stop sign. You must…",
            options: [
              "Pass carefully on the left",
              "Stop and wait",
              "Slow to 20 mph",
              "Honk and continue",
            ],
            answer: 1,
            explain: "Stop and remain stopped until the lights stop flashing and the sign folds in.",
          },
          {
            q: "On a divided highway with a median, traffic on the OPPOSITE side of a stopped bus…",
            options: [
              "Must also stop",
              "Does not need to stop",
              "Must reverse",
              "Must use hazards",
            ],
            answer: 1,
            explain: "A physical median separates the directions, so the opposite side may proceed.",
          },
          {
            q: "The fine for illegally passing a stopped school bus (first offense) is…",
            options: ["$50", "$100", "$250", "$500"],
            answer: 2,
            explain: "$250 for a first offense, with escalating penalties after that.",
          },
        ],
      },
    ],
  },
  {
    title: "Unit 3 · Sharing the Road",
    subtitle: "Bikes, walkers & passing",
    color: "purple",
    lessons: [
      {
        id: "bikesped",
        title: "Bikes & Walkers",
        icon: "🚲",
        rule: {
          heading: "Bicycles & pedestrians",
          points: [
            "Cyclists may use the full lane; leave a safe passing distance.",
            "You may cross a double yellow to pass a cyclist when safe.",
            "Stop for pedestrians in any marked crosswalk.",
            "Don't pass a car stopped for a pedestrian at a crosswalk.",
            "Always yield to anyone using a white cane or guide dog.",
          ],
          ref: "M.G.L. c. 89 §2, §11; c. 90 §14",
        },
        questions: [
          {
            q: "A pedestrian is in a marked crosswalk ahead. You must…",
            options: ["Honk", "Stop and yield", "Speed up", "Edge around them"],
            answer: 1,
            explain: "Stop for pedestrians in any marked crosswalk — it's the law.",
          },
          {
            q: "A car ahead has stopped at a crosswalk. You should…",
            options: [
              "Pass it quickly",
              "Not pass — a pedestrian may be crossing",
              "Honk to move it",
              "Pass on the right",
            ],
            answer: 1,
            explain: "Never pass a vehicle stopped for a pedestrian at a crosswalk.",
          },
          {
            q: "To pass a cyclist on a two-lane road, you may…",
            options: [
              "Never cross the center line",
              "Cross a double yellow line when it is safe and clear",
              "Force them onto the shoulder",
              "Pass within inches",
            ],
            answer: 1,
            explain: "You may cross a double yellow to pass a cyclist with a safe distance when clear.",
          },
        ],
      },
      {
        id: "moveover",
        title: "Move Over Law",
        icon: "🚨",
        rule: {
          heading: "Move Over Law",
          points: [
            "Approaching a stopped vehicle with flashing lights → move over a lane.",
            "Can't move over safely? Slow to a safe speed.",
            "Covers police, fire, ambulance, tow trucks & maintenance.",
          ],
          ref: "M.G.L. c. 89 §7C",
        },
        questions: [
          {
            q: "Approaching a stopped tow truck with flashing lights, you should…",
            options: [
              "Maintain speed",
              "Move over a lane if safe, or slow down",
              "Stop completely",
              "Flash your lights back",
            ],
            answer: 1,
            explain: "Move over one lane if safe; otherwise slow to a safe speed.",
          },
          {
            q: "The Move Over Law protects…",
            options: [
              "Only police cars",
              "Only ambulances",
              "Police, fire, ambulance, tow trucks & maintenance vehicles",
              "Only highway crews",
            ],
            answer: 2,
            explain: "It covers any stationary emergency, recovery, or maintenance vehicle with lights on.",
          },
        ],
      },
      {
        id: "passing",
        title: "Passing",
        icon: "↔️",
        rule: {
          heading: "Passing & lane discipline",
          points: [
            "Pass on the left; keep right except to pass.",
            "Don't cross a solid line on your side to pass.",
            "Signal before changing lanes or passing.",
            "Re-enter only when you can see the car in your mirror.",
            "Never speed up beyond the limit to pass.",
          ],
          ref: "M.G.L. c. 89 §2, §4, §4B",
        },
        questions: [
          {
            q: "On a multi-lane highway you should…",
            options: [
              "Stay in the left lane",
              "Keep right except to pass",
              "Use any lane equally",
              "Drive on the shoulder",
            ],
            answer: 1,
            explain: "Keep right except when passing.",
          },
          {
            q: "It is safe to return to your lane after passing when…",
            options: [
              "Immediately after pulling out",
              "You can see the passed vehicle in your rear-view mirror",
              "You reach 70 mph",
              "The other driver waves",
            ],
            answer: 1,
            explain: "Re-enter only once the passed vehicle is visible in your mirror.",
          },
          {
            q: "To pass another car you may…",
            options: [
              "Exceed the speed limit briefly",
              "Cross a solid line on your side",
              "Never exceed the speed limit",
              "Tailgate first",
            ],
            answer: 2,
            explain: "You must never exceed the speed limit, even to pass.",
          },
        ],
      },
    ],
  },
  {
    title: "Unit 4 · Serious Stuff",
    subtitle: "OUI, teens, winter & parking",
    color: "gold",
    lessons: [
      {
        id: "oui",
        title: "OUI / Drunk Driving",
        icon: "🍺",
        rule: {
          heading: "OUI — Operating Under the Influence",
          points: [
            "Illegal at 0.08% BAC (0.04% commercial, 0.02% under 21).",
            "Implied Consent: refusing a test = 180-day suspension (1st offense).",
            "First offense: up to 2.5 yrs jail, $500–$5,000, 1-yr suspension.",
            "Melanie's Law: priors sharply increase penalties.",
            "OUI also covers drugs, including marijuana.",
          ],
          ref: "M.G.L. c. 90 §24, §24D",
        },
        questions: [
          {
            q: "The legal BAC limit for drivers 21+ is…",
            options: ["0.05%", "0.08%", "0.10%", "0.02%"],
            answer: 1,
            explain: "0.08% for drivers 21+, 0.02% if under 21.",
          },
          {
            q: "Refusing a breath test on a first offense leads to…",
            options: [
              "A warning",
              "A 180-day license suspension",
              "A $50 fine",
              "Nothing",
            ],
            answer: 1,
            explain: "Implied Consent: refusal = automatic 180-day suspension on a first offense.",
          },
          {
            q: "OUI in Massachusetts applies to…",
            options: [
              "Only alcohol",
              "Only hard drugs",
              "Alcohol, marijuana and other drugs",
              "Only repeat offenders",
            ],
            answer: 2,
            explain: "OUI covers alcohol, marijuana, prescription and other drugs.",
          },
          {
            q: "The under-21 BAC limit is…",
            options: ["0.08%", "0.05%", "0.02%", "0.00%"],
            answer: 2,
            explain: "0.02% for drivers under 21 — essentially zero tolerance.",
          },
        ],
      },
      {
        id: "junior",
        title: "Junior Operators",
        icon: "🔰",
        rule: {
          heading: "Junior Operator License (under 18)",
          points: [
            "First 6 months: no passengers under 18 (except family) unless a 21+ driver is present.",
            "No driving 12:30 a.m.–5:00 a.m. without a parent/guardian.",
            "No mobile devices at all, even hands-free.",
            "Permit holders need a 21+ licensed driver up front.",
          ],
          ref: "M.G.L. c. 90 §8, §8B",
        },
        questions: [
          {
            q: "For the first 6 months, a junior operator generally may not…",
            options: [
              "Drive at all",
              "Carry passengers under 18 (except family) alone",
              "Use the highway",
              "Drive in the rain",
            ],
            answer: 1,
            explain: "No under-18 passengers (except immediate family) without a qualified 21+ driver.",
          },
          {
            q: "Junior operators may not drive between…",
            options: [
              "10 p.m. and 6 a.m.",
              "12:30 a.m. and 5:00 a.m. (without a parent/guardian)",
              "Midnight and 4 a.m.",
              "9 p.m. and 5 a.m.",
            ],
            answer: 1,
            explain: "The night restriction runs 12:30 a.m.–5:00 a.m. unless a parent/guardian is along.",
          },
        ],
      },
      {
        id: "winter",
        title: "Winter Driving",
        icon: "❄️",
        rule: {
          heading: "Winter & adverse weather",
          points: [
            "Clear ALL snow/ice — windows, mirrors, lights AND roof.",
            "'Wipers On, Lights On' — if wipers run, headlights must too.",
            "Increase following distance on snow and ice.",
            "Bridges and overpasses freeze first.",
            "Black ice is worst at dawn, dusk and shaded spots.",
          ],
          ref: "M.G.L. c. 85 §15; c. 90 §17",
        },
        questions: [
          {
            q: "Under the 'Wipers On' rule, when your wipers run you must also turn on…",
            options: ["Hazards", "Headlights", "Fog lights", "Nothing"],
            answer: 1,
            explain: "If weather needs your wipers, your headlights must be on too.",
          },
          {
            q: "Before driving after a snowstorm you should clear snow from…",
            options: [
              "Just the windshield",
              "Windows and mirrors only",
              "Windows, mirrors, lights AND the roof",
              "Only the wipers",
            ],
            answer: 2,
            explain: "Clear everything — flying snow/ice from your roof can get you cited.",
          },
          {
            q: "Black ice is most likely at…",
            options: [
              "Midday in sun",
              "Dawn, dusk and shaded roads",
              "Only on highways",
              "Only during snowfall",
            ],
            answer: 1,
            explain: "Black ice forms at dawn, dusk, and on shaded or bridge surfaces.",
          },
        ],
      },
      {
        id: "parking",
        title: "Parking",
        icon: "🅿️",
        rule: {
          heading: "Where you may NOT park",
          points: [
            "Within 10 ft of a fire hydrant.",
            "Within 20 ft of an intersection or stop sign.",
            "On a crosswalk, sidewalk or bike lane.",
            "Blocking a driveway; double parking.",
            "In a disabled space without a valid placard/plate.",
          ],
          ref: "M.G.L. c. 90 §18",
        },
        questions: [
          {
            q: "How far from a fire hydrant must you park?",
            options: ["5 feet", "10 feet", "15 feet", "25 feet"],
            answer: 1,
            explain: "At least 10 feet from a fire hydrant.",
          },
          {
            q: "You must not park within how many feet of an intersection?",
            options: ["5 feet", "10 feet", "20 feet", "40 feet"],
            answer: 2,
            explain: "Keep at least 20 feet from an intersection or stop sign.",
          },
          {
            q: "Parking in a disabled space without a valid placard…",
            options: [
              "Is fine if brief",
              "Is allowed after 6 p.m.",
              "Is illegal and heavily fined",
              "Is a warning only",
            ],
            answer: 2,
            explain: "It's illegal and carries fines starting around $100–$300.",
          },
        ],
      },
    ],
  },
];

/* ===================================================================
   ROAD SIGNS — rendered as vector shapes (see renderSign in app.js)
   shape: octagon | triangle | rect | circle | diamond | pentagon
   =================================================================== */
const SIGNS = [
  { id: "stop", name: "Stop", cat: "Regulatory", shape: "octagon", color: "#e3262e", fg: "#fff", text: "STOP",
    meaning: "Come to a COMPLETE stop. Yield to traffic and pedestrians, then proceed when safe." },
  { id: "yield", name: "Yield", cat: "Regulatory", shape: "triangle", color: "#e3262e", fg: "#fff", text: "YIELD",
    meaning: "Slow down and give the right of way to traffic and pedestrians ahead." },
  { id: "speed", name: "Speed Limit", cat: "Regulatory", shape: "rect", color: "#fff", fg: "#222", text: "SPEED\nLIMIT\n30",
    meaning: "Maximum legal speed in ideal conditions. Drive slower in poor weather or traffic." },
  { id: "donotenter", name: "Do Not Enter", cat: "Regulatory", shape: "circle", color: "#e3262e", fg: "#fff", glyph: "bar",
    meaning: "Do not enter — wrong way. Used at one-way streets and freeway off-ramps." },
  { id: "wrongway", name: "Wrong Way", cat: "Regulatory", shape: "rect", color: "#e3262e", fg: "#fff", text: "WRONG\nWAY",
    meaning: "You are travelling against traffic. Turn around immediately and exit safely." },
  { id: "oneway", name: "One Way", cat: "Regulatory", shape: "rect", color: "#222", fg: "#fff", glyph: "arrow",
    meaning: "Traffic flows only in the direction of the arrow." },
  { id: "nouturn", name: "No U-Turn", cat: "Regulatory", shape: "rect", color: "#fff", fg: "#222", glyph: "nouturn",
    meaning: "U-turns are prohibited at this location." },
  { id: "railroad", name: "Railroad Crossing", cat: "Warning", shape: "circle", color: "#f6c700", fg: "#222", glyph: "rxr",
    meaning: "Railroad tracks ahead. Slow down, look and listen, be prepared to stop." },
  { id: "pedestrian", name: "Pedestrian Crossing", cat: "Warning", shape: "diamond", color: "#f6c700", fg: "#222", glyph: "🚶",
    meaning: "Watch for people crossing. Be ready to stop and yield to pedestrians." },
  { id: "school", name: "School Zone", cat: "Warning", shape: "pentagon", color: "#8cd600", fg: "#222", glyph: "🚸",
    meaning: "School area — children present. Slow down and obey reduced limits and crossing guards." },
  { id: "signal", name: "Signal Ahead", cat: "Warning", shape: "diamond", color: "#f6c700", fg: "#222", glyph: "🚦",
    meaning: "A traffic signal is ahead. Slow down and be prepared to stop." },
  { id: "slippery", name: "Slippery When Wet", cat: "Warning", shape: "diamond", color: "#f6c700", fg: "#222", glyph: "🌧️",
    meaning: "Road may be slick in rain/snow. Reduce speed and avoid hard braking." },
  { id: "workzone", name: "Work Zone", cat: "Warning", shape: "diamond", color: "#ff7a18", fg: "#fff", glyph: "🚧",
    meaning: "Road work ahead. Slow down, fines double, watch for workers and equipment." },
  { id: "merge", name: "Merge", cat: "Warning", shape: "diamond", color: "#f6c700", fg: "#222", glyph: "merge",
    meaning: "Traffic merges ahead. Adjust speed and position to let vehicles blend safely." },
  { id: "hospital", name: "Hospital", cat: "Guide", shape: "rect", color: "#1456a0", fg: "#fff", text: "H",
    meaning: "Directs you to a nearby hospital or medical services." },
  { id: "parking", name: "No Parking", cat: "Regulatory", shape: "rect", color: "#fff", fg: "#e3262e", glyph: "noparking",
    meaning: "Parking is prohibited in this zone." },
];

/* Extra questions to enrich the Exam Simulator pool (incl. sign recognition). */
const EXTRA_QUESTIONS = [
  { q: "A red octagonal sign means…", options: ["Yield", "Stop", "Caution", "Do not enter"], answer: 1,
    explain: "An octagon is always a STOP sign — come to a complete stop." },
  { q: "An upside-down triangle sign means…", options: ["Stop", "Merge", "Yield", "Dead end"], answer: 2,
    explain: "An inverted triangle is a YIELD sign — give the right of way." },
  { q: "A yellow diamond-shaped sign is a…", options: ["Regulatory sign", "Warning sign", "Guide sign", "Service sign"], answer: 1,
    explain: "Yellow diamonds are WARNING signs alerting you to road conditions ahead." },
  { q: "A round yellow sign with an 'X' and 'RR' warns of…", options: ["A rest area", "A railroad crossing", "A roundabout", "A runaway ramp"], answer: 1,
    explain: "It warns of a railroad crossing — slow down, look and listen." },
  { q: "A red circle with a white horizontal bar means…", options: ["One way", "Do not enter", "No passing", "Road closed to trucks"], answer: 1,
    explain: "It is a DO NOT ENTER sign — you're heading the wrong way." },
  { q: "Orange signs and cones indicate…", options: ["A school zone", "A work/construction zone", "A scenic route", "A bike lane"], answer: 1,
    explain: "Orange means a construction or work zone — slow down, fines double." },
  { q: "A blue sign generally provides…", options: ["Warnings", "Motorist services and guidance", "Speed limits", "Prohibitions"], answer: 1,
    explain: "Blue signs give motorist services/guidance (hospitals, rest areas, food)." },
  { q: "When approaching a yellow 'Signal Ahead' sign you should…", options: ["Speed up", "Slow down and be ready to stop", "Turn around", "Ignore it"], answer: 1,
    explain: "A signal is ahead — slow down and prepare to stop." },
  { q: "Solid double yellow lines in the center of the road mean…", options: ["Passing allowed both ways", "No passing in either direction", "One-way street", "Parking lane"], answer: 1,
    explain: "Double solid yellow lines mean passing is prohibited in both directions." },
  { q: "A flashing yellow arrow on a left-turn signal means…", options: ["Protected turn", "Turn is prohibited", "Turn allowed after yielding to oncoming traffic", "Stop"], answer: 2,
    explain: "Flashing yellow arrow: you may turn left after yielding to oncoming traffic and pedestrians." },
  { q: "What should you do at a green light with pedestrians in the crosswalk?", options: ["Proceed, you have priority", "Yield to the pedestrians", "Honk", "Reverse"], answer: 1,
    explain: "Even on green, you must yield to pedestrians already in the crosswalk." },
  { q: "The safe following distance in good conditions is at least…", options: ["1 second", "2 seconds", "3 seconds", "Half a second"], answer: 2,
    explain: "Use the 3-second rule; increase it in rain, snow, or fog." },
  { q: "If your vehicle starts to skid, you should…", options: ["Brake hard", "Steer in the direction you want the front to go", "Accelerate", "Close your eyes"], answer: 1,
    explain: "Ease off the gas and steer gently where you want the front of the car to go." },
  { q: "When may you drive in a bicycle lane?", options: ["Anytime to pass", "Only briefly when turning, after yielding to cyclists", "Never under any condition", "During rush hour"], answer: 1,
    explain: "You may only enter a bike lane briefly to make a turn, yielding to cyclists." },
  { q: "Headlights must be on…", options: ["Only at night", "From 30 min after sunset to 30 min before sunrise, and whenever wipers are on", "Only in tunnels", "Only on highways"], answer: 1,
    explain: "Lights on at night and whenever weather requires your wipers ('Wipers On, Lights On')." },
  { q: "A steady yellow traffic light means…", options: ["Speed up to beat the red", "Stop if you can do so safely; red is next", "Go", "Yield only"], answer: 1,
    explain: "Steady yellow warns the light is about to turn red — stop if you safely can." },
];

if (typeof module !== "undefined") {
  module.exports = { UNITS, SIGNS, EXTRA_QUESTIONS };
}
