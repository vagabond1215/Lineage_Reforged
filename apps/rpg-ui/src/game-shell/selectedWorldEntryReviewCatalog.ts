// Editorial presentation transcribed from lineage-reforged-current-interactive-preview.html.
// Git blob da99a105a05710b93e2cc7f692ff94b391f43f19. IDs here never enter gameplay or Save data.

export const entryBuilds = [
  {
    id: 'broad',
    label: 'Broad',
    power: 0.85,
    desc: 'Wide shoulders and a substantial frame suggest leverage, load-bearing strength and a body made to meet resistance.',
    wPower: { STR: 4, CON: 3, VIT: 2 },
    wProwess: { DEX: 1, AGI: 1 }
  },
  {
    id: 'muscular',
    label: 'Muscular',
    power: 0.75,
    desc: 'Distinct muscle definition gives physical effort a direct, forceful quality without deciding where your mind is strongest.',
    wPower: { STR: 5, CON: 3, VIT: 2 },
    wProwess: { DEX: 2, AGI: 1 }
  },
  {
    id: 'stocky',
    label: 'Stocky',
    power: 0.7,
    desc: 'Dense and grounded in proportion, with strength close to the core and a frame that favors stability under strain.',
    wPower: { STR: 2, CON: 4, VIT: 3 },
    wProwess: { DEX: 1, AGI: 1 }
  },
  {
    id: 'compact',
    label: 'Compact',
    power: 0.55,
    desc: 'Close-built and proportionate, carrying strength economically without losing readiness or agility.',
    wPower: { STR: 1, CON: 3, VIT: 2 },
    wProwess: { DEX: 2, AGI: 3 }
  },
  {
    id: 'proportioned',
    label: 'Proportioned',
    power: 0.5,
    desc: 'Even physical proportions, with no pronounced advantage in either blunt strength or quick, controlled movement.',
    wPower: { STR: 2, CON: 2, VIT: 2 },
    wProwess: { DEX: 2, AGI: 2 }
  },
  {
    id: 'lean',
    label: 'Lean',
    power: 0.45,
    desc: 'A lighter frame with modest muscle and a natural ease of motion, suited to measured force and nimble movement.',
    wPower: { STR: 1, CON: 2, VIT: 2 },
    wProwess: { DEX: 3, AGI: 2 }
  },
  {
    id: 'slender',
    label: 'Slender',
    power: 0.35,
    desc: 'Narrow and lightly built, more at ease with deliberate precision than sustained heavy exertion.',
    wPower: { STR: 1, CON: 1, VIT: 1 },
    wProwess: { DEX: 4, AGI: 3 }
  },
  {
    id: 'wiry',
    label: 'Wiry',
    power: 0.3,
    desc: 'Spare weight and taut muscle promise controlled movement, tenacity and quick physical adjustment.',
    wPower: { STR: 1, CON: 1, VIT: 1 },
    wProwess: { DEX: 3, AGI: 4 }
  },
  {
    id: 'lithe',
    label: 'Lithe',
    power: 0.2,
    desc: 'Light and supple in shape, favoring balance, fine coordination and rapid changes of position over sheer bulk.',
    wPower: { STR: 1, CON: 1, VIT: 1 },
    wProwess: { DEX: 4, AGI: 5 }
  }
] as const;

export const entryAptitudes = [
  {
    id: 'fully_physical',
    label: 'Brawn-Driven',
    physical: 10,
    mind: 0,
    desc: 'You are drawn to exertion, movement and doing rather than abstract study. All ten generated points favor bodily ability, but learning remains possible.',
    mindWeights: { INT: 1, WIS: 1, SPT: 1 }
  },
  {
    id: 'hands_on',
    label: 'Action-Oriented',
    physical: 7,
    mind: 3,
    desc: 'Your natural strengths lean toward physical action and immediate practical response, rather than prolonged contemplation. You can still reason and learn.',
    mindWeights: { INT: 1, WIS: 1, SPT: 1 }
  },
  {
    id: 'instinctive',
    label: 'Instinctive',
    physical: 6,
    mind: 4,
    desc: 'You read the moment through practiced attention and immediate bodily response, responding to shifting circumstances before analysis catches up.',
    mindWeights: { INT: 1, WIS: 4, SPT: 2 }
  },
  {
    id: 'versatile',
    label: 'Versatile',
    physical: 5,
    mind: 5,
    desc: 'Body and mind begin in balance; neither physical capability nor inward understanding takes the lead.',
    mindWeights: { INT: 1, WIS: 1, SPT: 1 }
  },
  {
    id: 'inventive',
    label: 'Inventive',
    physical: 4,
    mind: 6,
    desc: 'Unfamiliar problems invite imaginative connections and new approaches. That talent is distinct from learned crafts or formal schooling.',
    mindWeights: { INT: 4, WIS: 1, SPT: 2 }
  },
  {
    id: 'analytical',
    label: 'Analytical',
    physical: 3,
    mind: 7,
    desc: 'Reasoning, patterns and unfamiliar problems make intuitive sense to you, independently of any formal education.',
    mindWeights: { INT: 5, WIS: 2, SPT: 1 }
  },
  {
    id: 'perceptive',
    label: 'Perceptive',
    physical: 3,
    mind: 7,
    desc: 'Subtle details, changing circumstances and practical judgment come naturally before practiced expertise.',
    mindWeights: { INT: 2, WIS: 5, SPT: 1 }
  },
  {
    id: 'strong_willed',
    label: 'Strong-Willed',
    physical: 3,
    mind: 7,
    desc: 'Inner resolve and concentration carry particular strength, though they do not amount to learned magic or spells.',
    mindWeights: { INT: 1, WIS: 2, SPT: 5 }
  },
  {
    id: 'fully_mind',
    label: 'Savant',
    physical: 0,
    mind: 10,
    desc: 'An unusual natural gift for thought, perception and inward resolve draws you toward ideas rather than physical exertion. No schooling or spellcraft is implied.',
    mindWeights: { INT: 1, WIS: 1, SPT: 1 }
  }
] as const;

export const entryConditions = {
  negative: [
    {
      id: 'sickly',
      name: 'Sickly',
      line: 'Greater vulnerability to genuine illness and slower recovery.',
      text: 'Illness may take a heavier toll, and recovery may demand more time or care. Being sickly does not mean beginning with a disease.',
      stats: 'Potentially no primary-attribute change. Disease and recovery vulnerability only if owned.',
      dependency: 'TM-11 · Health, disease and recovery',
      conflicts: 'Review overlap with Quick Healer; never invent a persistent illness.'
    },
    {
      id: 'frail',
      name: 'Frail',
      line: 'Harder physical injury and impact recovery.',
      text: 'A genuine blow or injury may have more lasting consequences. Frame size alone does not make a character frail.',
      stats: 'Possible VIT disadvantage; amount not approved.',
      dependency: 'TM-11 · Injury and recovery',
      conflicts: 'Distinct from Sickly: injury burden, not illness susceptibility.'
    },
    {
      id: 'easily_winded',
      name: 'Easily Winded',
      line: 'Higher cost for prolonged physical exertion.',
      text: 'A long climb, sustained labor or drawn-out escape drains stamina more quickly when the action truly consumes it.',
      stats: 'Possible CON disadvantage; amount not approved.',
      dependency: 'TM-08 · Exertion and energy use',
      conflicts: 'Do not duplicate regular CON/Stamina penalties.'
    },
    {
      id: 'clumsy',
      name: 'Clumsy',
      line: 'Less reliable precision in delicate tasks.',
      text: 'Fine toolwork, delicate repairs or sensitive handling demand extra care when the game actually tests them.',
      stats: 'Possible DEX disadvantage; amount not approved.',
      dependency: 'TM-15 · Craft and tool precision',
      conflicts: 'Review conflict with Deft; distinct from ordinary Clumsy skill rank.'
    },
    {
      id: 'unobservant',
      name: 'Unobservant',
      line: 'Reduced chance to notice supported subtle cues.',
      text: 'Quiet warnings and small changes slip past more easily, but the game never erases information already learned.',
      stats: 'Possible WIS disadvantage; amount not approved.',
      dependency: 'TM-16 · Field perception and awareness',
      conflicts: 'Review conflict with Keen-Eyed; no invented secret information.'
    },
    {
      id: 'slow_study',
      name: 'Slow Study',
      line: 'Complex study requires more genuine learning effort.',
      text: 'Abstract lessons and difficult techniques take longer to master through eligible study, independent of innate Intelligence.',
      stats: 'Possible INT effect or no starting-stat change.',
      dependency: 'TM-17 · Study and knowledge progression',
      conflicts: 'Review conflict with Quick Study; no deleting earned knowledge.'
    },
    {
      id: 'underpowered',
      name: 'Underpowered',
      line: 'Harder heavy-force efforts and load handling.',
      text: 'Lifting heavy burdens, forcing an obstacle or applying raw leverage requires more effort than usual.',
      stats: 'Possible STR disadvantage; amount not approved.',
      dependency: 'TM-03 · Physical force and equipment',
      conflicts: 'Review conflict with Mighty; distinguish from Weak Grip.'
    },
    {
      id: 'weak_grip',
      name: 'Weak Grip',
      line: 'Unreliable holds and equipment retention.',
      text: 'Maintaining a grasp while climbing, grappling or holding equipment becomes less certain under true pressure.',
      stats: 'Possible STR and DEX disadvantages; magnitudes not approved.',
      dependency: 'TM-03 · Holds, grip and disarming',
      conflicts: 'Not a generic STR loss; distinct from Underpowered.'
    },
    {
      id: 'stumbling',
      name: 'Stumbling',
      line: 'Slower recovery from footing errors.',
      text: 'A sudden shove, loose stone or unstable surface leaves you less certain of your footing.',
      stats: 'Possible AGI disadvantage; amount not approved.',
      dependency: 'TM-02 · Footing, balance and recovery',
      conflicts: 'Review conflict with Surefooted; avoid inventing terrain hazards.'
    },
    {
      id: 'faltering',
      name: 'Faltering',
      line: 'Concentration is easier to interrupt.',
      text: 'Maintaining difficult channeling under genuine pressure becomes less reliable, without forbidding magic outright.',
      stats: 'Possible SPT disadvantage; amount not approved.',
      dependency: 'TM-06 · Channel stability and interruption',
      conflicts: 'Review conflict with Attuned; no unsupported universal spell penalty.'
    },
    {
      id: 'mana_hungry',
      name: 'Mana-Hungry',
      line: 'Higher cost for eligible magical workings.',
      text: 'Sustained or complex magical practice consumes more of your reserve when the spell system charges a real cost.',
      stats: 'Possible SPT relation or persistent-only cost.',
      dependency: 'TM-06 · Spell MP cost',
      conflicts: 'Review overlap with Wellspring and cost-reduction boons.'
    },
    {
      id: 'awkward',
      name: 'Awkward',
      line: 'Harder first impressions and rapport.',
      text: 'New acquaintances are slower to settle into conversation, without limiting what you may say or whom you may befriend.',
      stats: 'Possible CHA disadvantage or no starting-stat change.',
      dependency: 'TM-05 · Social rapport checks',
      conflicts: 'Not physical appearance; review overlap with Silver-Tongued.'
    },
    {
      id: 'hard_gainer',
      name: 'Hard Gainer',
      line: 'Reduced return from meaningful strength training.',
      text: 'Physical strength takes more sustained, properly recovered effort to develop; trivial repeated actions still give no gain.',
      stats: 'Could have no starting-stat change.',
      dependency: 'TM-09 / TM-10 · Stat growth and recovery',
      conflicts: 'Review conflict with Hard Worker; do not suppress all progression.'
    },
    {
      id: 'gullible',
      name: 'Gullible',
      line: 'More vulnerable to real deception contests.',
      text: 'Misleading offers can be harder to judge when a legitimate social contest occurs. The player still chooses their response.',
      stats: 'May have no primary-attribute change.',
      dependency: 'TM-05 · Social judgment contests',
      conflicts: 'No forced dialogue, scripted purchase or player-agency loss.'
    }
  ],
  positive: [
    {
      id: 'quick_healer',
      name: 'Quick Healer',
      line: 'Improved recovery after verified injury.',
      text: 'Given actual rest and care, injuries settle more readily. This is not immunity to harm or free instant healing.',
      stats: 'Possible VIT relation or recovery-only benefit.',
      dependency: 'TM-07 / TM-11 · Recovery',
      conflicts: 'Review stacking with lineage regeneration and Sickly.'
    },
    {
      id: 'surefooted',
      name: 'Surefooted',
      line: 'More reliable footing and recovery.',
      text: 'You hold your position on uncertain ground and recover cleanly from supported slips or shoves.',
      stats: 'Possible AGI relation or persistent-only footing.',
      dependency: 'TM-02 · Movement and balance',
      conflicts: 'Review conflict with Stumbling; no passive guaranteed dodge.'
    },
    {
      id: 'keen_eyed',
      name: 'Keen-Eyed',
      line: 'Better recognition of genuine field clues.',
      text: 'The faint track or small warning catches your attention sooner, if the surrounding world actually contains it.',
      stats: 'Possible WIS relation; magnitude not approved.',
      dependency: 'TM-16 · Awareness and field cues',
      conflicts: 'Review overlap with lineage Keen Senses and Unobservant.'
    },
    {
      id: 'vigorous',
      name: 'Vigorous',
      line: 'Improved stamina economy and recovery.',
      text: 'After real exertion, you regain your readiness more steadily within the limits of rest, energy and recovery.',
      stats: 'Possible CON relation or resource-only benefit.',
      dependency: 'TM-07 · Stamina recovery',
      conflicts: 'Review lineage stamina traits and Easily Winded.'
    },
    {
      id: 'composed',
      name: 'Composed',
      line: 'Steadier response to real pressure.',
      text: 'Unexpected strain is less likely to upset your focus when an actual morale or pressure test is made.',
      stats: 'No starting-stat change required.',
      dependency: 'TM-05 · Morale and pressure',
      conflicts: 'Cannot force calm dialogue or override player choice.'
    },
    {
      id: 'mighty',
      name: 'Mighty',
      line: 'Outstanding physical force when validated.',
      text: 'You have exceptional force for lifting, pushing and power-based maneuvers, if the approved starting build can afford it.',
      stats: 'Possible STR benefit with an individually approved cost.',
      dependency: 'TM-03 · Force and attribute purchase',
      conflicts: 'Review conflict with Underpowered; no free attributes.'
    },
    {
      id: 'deft',
      name: 'Deft',
      line: 'Finer control with legitimate tools and handling.',
      text: 'Delicate work and fine manipulation come more naturally when accuracy and quality genuinely matter.',
      stats: 'Possible DEX benefit; amount and price not approved.',
      dependency: 'TM-15 · Crafting and precision',
      conflicts: 'Review conflict with Clumsy; avoid double-counting DEX.'
    },
    {
      id: 'fleetfooted',
      name: 'Fleetfooted',
      line: 'Better movement and repositioning efficiency.',
      text: 'You cross changing ground or reposition more easily during movements the game truly resolves.',
      stats: 'Possible AGI benefit or movement-only effect.',
      dependency: 'TM-02 · Movement economy',
      conflicts: 'Distinct from Surefooted footing stability.'
    },
    {
      id: 'softstep',
      name: 'Softstep',
      line: 'Reduced legitimate movement noise.',
      text: 'Your footsteps carry less sound during supported stealth movement, without granting invisibility.',
      stats: 'May have no starting-stat change.',
      dependency: 'TM-04 · Movement noise and stealth',
      conflicts: 'Audit duplicate effects against Halfling Quiet Step.'
    },
    {
      id: 'silver_tongued',
      name: 'Silver-Tongued',
      line: 'Stronger eligible negotiation and persuasion.',
      text: 'You express arguments with unusual clarity when a real social contest exists, but no one must agree with you.',
      stats: 'Possible CHA benefit or contest-only advantage.',
      dependency: 'TM-05 · Social negotiation',
      conflicts: 'Review conflict with Awkward/Unconvincing; no guaranteed loyalty.'
    },
    {
      id: 'attuned',
      name: 'Attuned',
      line: 'More stable supernatural channeling.',
      text: 'Resonance and concentration hold more firmly under genuine magical pressure, without adding learned spells.',
      stats: 'Possible SPT benefit; amount and price not approved.',
      dependency: 'TM-06 · Spell channel stability',
      conflicts: 'Review conflict with Faltering; no free spell unlocks.'
    },
    {
      id: 'wellspring',
      name: 'Wellspring',
      line: 'Modest bounded mana regeneration.',
      text: 'Your magical reserve returns more steadily through genuine magical recovery, not from nowhere.',
      stats: 'May have no starting-stat change.',
      dependency: 'TM-07 · MP regeneration',
      conflicts: 'Audit stacking with Elf Arcane Attunement and Mana-Hungry.'
    },
    {
      id: 'quick_study',
      name: 'Quick Study',
      line: 'Faster genuine complex-study progression.',
      text: 'Unfamiliar technical lessons are absorbed more efficiently when an actual study process awards progress.',
      stats: 'Possible INT relation or progression-only effect.',
      dependency: 'TM-17 · Study and knowledge',
      conflicts: 'Review conflict with Slow Study; no instant knowledge.'
    },
    {
      id: 'hard_worker',
      name: 'Hard Worker',
      line: 'Better conversion of meaningful training effort.',
      text: 'Consistent work yields a little more from legitimate strength-training load, subject to fatigue, food and recovery.',
      stats: 'May have no starting-stat change.',
      dependency: 'TM-09 / TM-10 · Stat training',
      conflicts: 'Review conflict with Hard Gainer; no trivial-action grind.'
    }
  ]
} as const;

export const entryScenarios = [
  {
    id: 'core.room_paid',
    name: 'The Room Paid For',
    pool: 'ordinary',
    blurb: 'A quiet room, a settled bill, and an unexpected parcel.',
    a: 'Examine the parcel',
    b: 'Ask the keeper',
    intro: 'Morning filters through the shutters of a room you did not reserve. The keeper says someone paid for one night and left a parcel in your name. You have no reason yet to trust the kindness, but no urgent reason to flee either.'
  },
  {
    id: 'core.last_bed',
    name: "Shelter's Last Bed",
    pool: 'ordinary',
    blurb: 'One final night of shelter before the road resumes.',
    a: 'Inspect the donated bundle',
    b: 'Ask where to go',
    intro: 'The shelter is waking before first light. Your blanket is folded, and the caretaker has a few words before the next traveler needs this bed. A bundle rests on the bench, set aside but not yet yours.'
  },
  {
    id: 'core.journeys_end',
    name: "Journey's End",
    pool: 'ordinary',
    blurb: 'You arrive among strangers with the road behind you.',
    a: 'Survey the town approach',
    b: 'Ask about the cart route',
    intro: 'The road breaks toward a settlement whose roofs catch the pale morning. Your last ride has gone on without you. There is a gate, a public way and enough time to choose your next question.'
  },
  {
    id: 'core.roadside_kindness',
    name: 'Roadside Kindness',
    pool: 'ordinary',
    blurb: 'A small act of help at the edge of a long road.',
    a: 'Request directions',
    b: 'Observe the road',
    intro: 'At the roadside a traveler pauses to check whether you need directions. The offer is modest, and so is your certainty about what lies beyond the next bend.'
  },
  {
    id: 'core.broken_wagon',
    name: 'The Broken Wagon',
    pool: 'wilderness',
    blurb: 'The road has vanished beneath a broken journey.',
    a: 'Inspect the wreck',
    b: 'Study wagon ruts',
    intro: 'A wagon frame leans at an impossible angle. The track thins toward broken ground. No settlement is near enough to see, and the wilderness is not yet verified for playable admission.'
  },
  {
    id: 'core.washed_ashore',
    name: 'Washed Ashore',
    pool: 'wilderness',
    blurb: 'Tide, wreckage and an unfamiliar shore.',
    a: 'Examine the shoreline',
    b: 'Study the inland rise',
    intro: 'Water recedes from unfamiliar sand and a damaged hull. The world beyond the strand is unknown. This remains a narrative draft, not an authorized survival start.'
  },
  {
    id: 'core.abandoned_camp',
    name: 'The Abandoned Camp',
    pool: 'wilderness',
    blurb: 'Signs of people, but no one to answer.',
    a: 'Inspect the camp',
    b: 'Survey nearby trails',
    intro: 'An empty fire ring lies beneath weathered canvas. Without owner evidence, the camp and its supplies cannot be treated as available game objects.'
  },
  {
    id: 'core.lost_trail',
    name: 'The Lost Trail',
    pool: 'wilderness',
    blurb: 'A path unravels beneath distant weather.',
    a: 'Look for a trail sign',
    b: 'Orient by land',
    intro: 'You stand where a narrow trail disappears into scrub and stone. The map, the exit and the supported survival systems are all unresolved.'
  }
] as const;
