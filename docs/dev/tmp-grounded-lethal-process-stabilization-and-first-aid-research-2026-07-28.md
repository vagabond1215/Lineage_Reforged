# Temporary Advisory Artifact For Grounded Lethal Process, Stabilization, And First-Aid Research

**Intended repository path:** `docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`  
**Run identity:** `GPT-DR.health.lethal-process-stabilization`  
**Run date:** `2026-07-28`  
**Fixed repository baseline requested:** `3eda0921ae0d11b940bfb9649f69b42aab52ee9d`

## Scope, Method, And Non-Authority

This artifact is temporary, advisory evidence for later design consumption. It is not repository canon, not a medical protocol, not implementation authority, and not player-facing medical advice. It is bounded to grounded game-design research about lethal-process categories, stabilization versus definitive care, transport and reassessment, and observer-safe qualitative urgency. No repository write, commit, or push was performed.

Methodologically, this artifact prioritizes professional guidelines, public-health/government sources, specialty-society guidance, and evidence syntheses. It deliberately extracts only conceptual distinctions suitable for coarse game abstraction, while excluding stepwise emergency instructions, medication dosing, decision trees for real-world use, exact deterioration timers, exact probabilities, and balance-ready values. Where sources are stronger for a narrow domain than for a broad one, the artifact treats that as a limitation rather than overgeneralizing. ([S01], [S03], [S04], [S21], [S24], [S27])

Repository-awareness in this artifact is constrained by the run instructions supplied in the prompt. The baseline commit and required repository-reading list were treated as binding design context requests, but the repository file contents themselves were not retrievable through the accessible tool context during this run. Accordingly, any repository-specific constraints referenced below are limited to the user-supplied instructions in this request, not to independently verified file text.

For each domain below, three layers are separated explicitly: **source evidence** describes what the cited materials support; **researcher inference** draws cautious synthesis across sources; **candidate abstraction** proposes non-canonical coarse models that later repository decisions may retain, simplify, or reject.

## Source Ledger

| ID | Title | Issuing body or authoring body | Date | Source type | Direct URL | Domain supported | Evidence-quality or limitation note |
|---|---|---:|---|---|---|---|---|
| S01 | European Resuscitation Council Guidelines 2025 First Aid | European Resuscitation Council | 2025 | Professional guideline | `https://pubmed.ncbi.nlm.nih.gov/41117568/` | Cross-domain first-aid scope; bleeding; drowning; hypothermia; hyperthermia | Strong current professional guideline; PubMed abstract and linked guideline context are more useful for scope than for operational detail. |
| S02 | First Aid Guidelines | Resuscitation Council UK | 2025 | Professional guideline webpage | `https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/first-aid-guidelines` | Bleeding; choking; drowning; hypothermia; heat stroke | High-value current guidance for lay/prehospital conceptual distinctions; not definitive in-hospital care. |
| S03 | Burns | World Health Organization | 2023 | WHO fact sheet | `https://www.who.int/news-room/fact-sheets/detail/burns` | Burn mechanisms; public-health framing | Authoritative and broad, but intentionally non-procedural and not granular on acute specialty care. |
| S04 | Drowning | World Health Organization | 2026 | WHO fact sheet | `https://www.who.int/news-room/fact-sheets/detail/drowning` | Drowning definition; outcome framing | Authoritative current definition and public-health framing; limited on bedside differentiation. |
| S05 | Debunking Dry or Delayed Secondary Drowning | American Red Cross | 2024 | Professional/public education resource | `https://www.redcross.org/take-a-class/resources/articles/dry-or-delayed-secondary-drowning` | Drowning recurrence/worsening after rescue | Useful for observer-safe framing and myth rejection; lay-facing rather than academic synthesis. |
| S06 | Bleeding, Life-Threatening External | American Red Cross | current crawl | Professional/public education resource | `https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-external` | External hemorrhage; field stabilization | Good practical categorization of visible danger signs; lay-oriented and not hospital-definitive. |
| S07 | Bleeding, Life-Threatening Internal | American Red Cross | current crawl | Professional/public education resource | `https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-internal` | Internal bleeding signs; delay and occult progression | Useful for visible/reportable signs and delayed presentation; lay-facing. |
| S08 | Shock | American Red Cross | current crawl | Professional/public education resource | `https://www.redcross.org/take-a-class/resources/learn-first-aid/shock` | Shock signs; qualitative urgency | Good for observer-safe signs of deterioration; by design nonspecific as to cause. |
| S09 | Bleeding | MedlinePlus | 2025 | Government-backed patient encyclopedia | `https://medlineplus.gov/ency/article/000045.htm` | Bleeding and shock signs | Reliable broad overview; not a trauma guideline. |
| S10 | Adult & Child Choking | American Red Cross | current crawl | Professional/public education resource | `https://www.redcross.org/take-a-class/resources/learn-first-aid/adult-child-choking` | Choking signs and progression | Strong for observer-safe signs; includes stepwise advice that this artifact does not import. |
| S11 | Choking, Adult or Child Over 1 Year | MedlinePlus | 2026 | Government-backed patient encyclopedia | `https://medlineplus.gov/ency/article/000049.htm` | Choking signs; partial versus severe obstruction cues | Reliable sign list; not intended as game abstraction guidance. |
| S12 | Blockage of Upper Airway | MedlinePlus | 2025 | Government-backed patient encyclopedia | `https://medlineplus.gov/ency/article/000067.htm` | General airway obstruction signs | Useful for nonspecific airway-danger cues across causes. |
| S13 | America’s Poison Centers | America’s Poison Centers | current crawl | Professional/public poison center resource | `https://poisoncenters.org/` | Poison heterogeneity; expert consultation infrastructure | Strong institutional signal that poisoning management is knowledge- and surveillance-dependent; not a treatment monograph. |
| S14 | Antidotes and Rescue Therapies | Wang and Kazzi; HHS Public Access / CDC-affiliated authorship context | 2012 | Review/editorial overview | `https://stacks.cdc.gov/view/cdc/33888/cdc_33888_DS1.pdf` | Antidote availability and limits | Useful high-level framing that antidotes are selective and availability-dependent; older and not a general poisoning guideline. |
| S15 | Hydrogen Cyanide Medical Management Guidelines | ATSDR / CDC Toxic Substance Portal | current crawl | Government toxicology management guideline | `https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=1141&toxid=249` | Poisoning with specific antidote; severe respiratory/circulatory collapse | Authoritative but agent-specific; useful as one example only. |
| S16 | Ethylene Glycol Medical Management Guidelines | ATSDR / CDC Toxic Substance Portal | current crawl | Government toxicology management guideline | `https://wwwn.cdc.gov/Tsp/MMG/MMGDetails.aspx?mmgid=82&toxid=21` | Poisoning with supportive care plus antidote/elimination | Authoritative but agent-specific; useful to show that some poisonings require more than antidote alone. |
| S17 | Calcium Hypochlorite or Sodium Hypochlorite Medical Management Guidelines | ATSDR / CDC Toxic Substance Portal | current crawl | Government toxicology management guideline | `https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=927&toxid=192` | Poisoning without specific antidote; corrosive/supportive care framing | Authoritative but agent-specific; useful to demonstrate antidote absence. |
| S18 | Lead Medical Management Guidelines | ATSDR / CDC Toxic Substance Portal | current crawl | Government toxicology management guideline | `https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=1203&toxid=22` | Poisoning without antidote; source-removal model | Strong government source; acute and chronic contexts mixed. |
| S19 | Arsine Medical Management Guidelines | ATSDR / CDC Toxic Substance Portal | current crawl | Government toxicology management guideline | `https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=1199&toxid=278` | Delayed poisoning effects; no antidote; observation need | Strong for delayed/worsening concept; agent-specific industrial example. |
| S20 | Parathion Medical Management Guidelines | ATSDR / CDC Toxic Substance Portal | current crawl | Government toxicology management guideline | `https://wwwn.cdc.gov/TSp/MMG/MMGDetails.aspx?mmgid=1140&toxid=246` | Cholinergic-type poisoning signs and escalation | Strong for syndrome pattern; agent-specific pesticide context. |
| S21 | Heat-Related Illnesses | CDC NIOSH | 2026 | Government occupational-health guidance | `https://www.cdc.gov/niosh/heat-stress/about/illnesses.html` | Heat illness; heat stroke signs | Strong current public-health guidance; oriented to workers. |
| S22 | About Heat and Your Health | CDC Heat Health | 2026 | Government public-health guidance | `https://www.cdc.gov/heat-health/about/index.html` | Milder heat illness signs | Broad and current; not specialty consensus. |
| S23 | ACSM Expert Consensus Statement on Exertional Heat Illness | American College of Sports Medicine | 2023 | Specialty consensus statement | `https://pubmed.ncbi.nlm.nih.gov/37036463/` | Exertional heat stroke severity; recovery variability | Strong specialty consensus; athlete-focused and not all heat illness is exertional. |
| S24 | Preventing Hypothermia | CDC Winter Weather | 2024 | Government public-health guidance | `https://www.cdc.gov/winter-weather/prevention/index.html` | Hypothermia signs; wet/cool condition risk | Strong basic public-health source; not specialist wilderness guidance. |
| S25 | Preventing Frostbite | CDC Winter Weather | 2024 | Government public-health guidance | `https://www.cdc.gov/winter-weather/prevention/preventing-frostbite.html` | Frostbite signs and permanence | Strong for visible cues and risk; limited on staging nuance. |
| S26 | Burn First Aid | American Burn Association | current crawl | Specialty-society patient guidance | `https://www.ameriburn.org/patients/burn-first-aid` | Minor versus serious burns; specialized care boundary | Useful specialty overview; patient-facing and non-exhaustive. |
| S27 | Burn Patient Referral Guidelines | American Burn Association | current crawl | Specialty referral guidance | `https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral` | Burn transfer/consultation; inhalation, chemical, electrical distinctions | Strong specialty referral source; intended for clinicians, not self-assessment. |
| S28 | Understanding a Burn Injury | American Burn Association | current crawl | Specialty-society patient guidance | `https://www.ameriburn.org/patients/understanding-a-burn-injury` | Burn mechanisms, depth, inhalation, grafting | Useful for depth/location/mechanism distinctions; patient-facing. |
| S29 | Thermal Burns | American Burn Association | current crawl | Specialty-society patient guidance | `https://www.ameriburn.org/patients/common-types-of-burns/thermal-burns` | Burn recovery burden; surgery/rehab/scar care | Useful for recovery implications; patient-facing and not exhaustive. |
| S30 | Healthy Eating After Burn Injury | American Burn Association | current crawl | Specialty-society patient guidance | `https://www.ameriburn.org/patients/common-conditions-for-burn-survivors/healthy-eating` | Burn systemic support needs | Useful to show prolonged support burden of major burns; patient-facing. |
| S31 | Burns | MedlinePlus | 2024 | Government-backed patient encyclopedia | `https://medlineplus.gov/burns.html` | Burn causes, inhalation injury, fluids/nutrition/infection | Reliable broad synthesis; not a specialty transfer guideline. |

## Cross-Process Comparison

| Domain | Initiating hazard | Independently meaningful process | Qualitative progression and reassessment need | Stabilization concept | Definitive-care distinction | Recurrence or worsening concern | Transport or environment concern | Observer-safe evidence | Major uncertainty |
|---|---|---|---|---|---|---|---|---|---|
| Hemorrhage and shock | Cutting, penetrating, crushing, blunt trauma, vessel injury | External blood loss, occult internal bleeding, and downstream circulatory failure are meaningfully distinct. ([S06], [S07], [S08]) | Visible bleeding can continue despite temporary control, and internal bleeding may be delayed or initially occult. Shock signs are progressive but nonspecific. ([S07], [S09], [S08]) | Suppress ongoing blood loss when possible; preserve warmth and support urgent transfer. ([S06], [S01], [S02]) | Field control does not equal source control or resolution of internal bleeding. ([S07], [S09]) | Rebleeding, missed internal injury, or worsening shock after apparent control. ([S07], [S09]) | Movement and delay matter especially when bleeding is hidden or the patient is getting colder. ([S07], [S01], [S02]) | Heavy visible bleeding, enlarging bruising or swelling, pallor, clammy skin, weak rapid pulse, confusion, shortness of breath. ([S06], [S08], [S09]) | No single visible sign proves hemorrhage source or severity. |
| Airway compromise and drowning | Foreign body, swelling, smoke, fluid submersion, other upper-airway blockage | Choking or obstruction differs from post-submersion respiratory injury and from nonspecific breathing distress. ([S10], [S11], [S12], [S04]) | Breathing ability, voice, color, and mental status can change quickly; some rescued drowning casualties may worsen after rescue, but asymptomatic return to normal should not be treated as a hidden delayed-death process. ([S10], [S12], [S05]) | Restore air movement and oxygenation; remove from water and prevent cooling. ([S01], [S02], [S05]) | Definitive care is resolution of obstruction or management of respiratory injury beyond scene care. ([S11], [S05]) | Persistent cough, confusion, breathing difficulty, or renewed respiratory distress after non-fatal drowning; obstruction may recur if not fully cleared. ([S05], [S11]) | Water, cold exposure, and limited airway equipment or skill materially matter. ([S01], [S02], [S24]) | Inability to speak or cry, weak or absent cough, high-pitched or absent sounds, throat clutching, panic, blue or pale color, confusion. ([S10], [S11], [S12]) | “Water in the lungs” and pulmonary injury extent are not directly visible. |
| Poisoning and antidote limits | Ingested, inhaled, skin, or injected toxin | Diverse syndrome families matter more than a single poison bucket: secretory or paralyzing, corrosive, sedating, convulsant or agitated, oxygen-blocking, and delayed organ-injury patterns. This is an inference from the heterogeneity documented across poison-center and ATSDR materials. ([S13], [S16], [S17], [S15], [S19], [S20]) | Some toxins crash early; others declare themselves later; some worsen despite early apparent stability. ([S19], [S16]) | Stop exposure, support breathing and circulation, and use source-specific supportive measures when possible. Some cases have specific antidotes; many do not. ([S14], [S16], [S17], [S18], [S15], [S19]) | Definitive care may require a specific antidote, elimination support, organ support, or prolonged monitoring; in many poisonings, there is no simple reversal. ([S16], [S17], [S18], [S15], [S19]) | Delayed symptom onset, recurrent symptoms, progressive organ injury, or failure of an antidote to fully solve the problem. ([S16], [S15], [S19]) | Contamination risk, rescuer protection, consultation access, and diagnostic uncertainty all matter. ([S17], [S19], [S13]) | Vomiting, weakness, altered mental status, excessive secretions, breathing difficulty, odor reports, seizures, unusual pupils, color change. ([S20], [S15], [S16]) | Toxin identity and dose usually remain hidden without context, equipment, or expertise. |
| Cold exposure and heat illness | Cold air, wetness, immersion, wind; or ambient heat, radiant heat, exertion | Systemic hypothermia, local freezing injury, non-stroke heat illness, and heat-stroke-like hot altered patient are distinct enough for coarse abstraction. ([S24], [S25], [S21], [S22], [S23]) | Mental status, coordination, sweating pattern, skin findings, and local tissue changes require repeated checks. ([S24], [S25], [S21], [S22]) | Remove from the environment; dry, insulate, and warm for cold; cool and shade for heat. ([S01], [S02], [S24], [S21]) | Definitive care differs because heat stroke can involve organ injury, and cold injury can involve tissue loss or severe systemic instability. ([S23], [S25]) | Hypothermia can deepen; frostbite can demarcate later; heat stroke recovery is variable and can leave organ injury. ([S24], [S25], [S23]) | Exposure duration, wet clothing, cold ground, exertion, and shelter access materially matter. ([S24], [S01], [S02], [S22]) | Shivering or clumsiness, confusion, cold numb waxy areas, heavy sweating, weakness, dizziness, hot altered state, seizures, collapse. ([S24], [S25], [S21], [S22]) | Exact thermal stage is often hidden without measurement or professional evaluation. |
| Burns | Flame, scald, contact heat, chemical, electricity, radiation, friction, smoke | Burn depth, surface area, location, inhalation, and mechanism each change seriousness. ([S03], [S27], [S28], [S31]) | Initial appearance can understate seriousness, especially with inhalation, deep burns, and electrical injuries. ([S27], [S28]) | Cooling, covering, pain support, and protection from further damage are stabilizing, not restorative. ([S26], [S29]) | Definitive care may require wound management, grafting, infection prevention, nutrition support, rehab, and burn-center resources. ([S28], [S29], [S30], [S31]) | Infection, fluid problems, airway issues after smoke exposure, pain, scarring, and delayed symptoms after some electrical injuries. ([S27], [S28], [S31]) | Referral infrastructure, burn-center access, and equipment or staffing matter. ([S27]) | Red, blistered, white, charred, leathery, swollen, or numb tissue; facial burns, singed hairs, trouble breathing after smoke exposure. ([S27], [S28], [S31]) | Depth and inhalation severity are not fully knowable from superficial appearance alone. |
| Immediate stabilization versus definitive care | Any of the above | Stabilization is a category of temporary harm reduction or physiologic support; definitive care resolves the cause or repairs the relevant damage when possible. This distinction recurs across all domains. ([S01], [S02], [S05], [S16], [S27]) | Apparent improvement does not prove cure. ([S07], [S05], [S19]) | “Now safer than before” is the core meaning; not “restored.” | Definitive care may be unavailable, delayed, incomplete, or impossible. ([S17], [S18], [S27]) | Many apparently stabilized states can deteriorate again. ([S07], [S05], [S19]) | Provider skill, antidote availability, burn center access, and airway equipment matter. ([S13], [S17], [S27]) | Improved bleeding control, better breathing, cooler or warmer skin, calmer mentation. | How much improvement is durable cannot be directly known from scene-level cues alone. |
| Transport risk, monitoring, and reassessment | Movement, delay, weather, contamination, terrain, provider scarcity | Reassessment is a process of checking whether the hidden state is improving, unchanged, or worsening under new conditions. This is distinct from initial triage. | Delayed bleeding, delayed tox effects, evolving burns, breathing relapse, and heat or cold progression make single-check assessment unreliable. ([S07], [S19], [S05], [S23], [S27]) | Ongoing support during movement rather than a one-time cure. | Definitive care may require destination choice, specialty access, or sustained observation. ([S27], [S13], [S19]) | Symptom return, new mental-status change, or failure to improve after aid. ([S05], [S19], [S08]) | Terrain, weather, shelter, contamination, escort skill, and destination capability. ([S24], [S17], [S27]) | “Now more confused,” “breathing harder,” “bleeding through dressing,” “still very hot,” “hands turning waxy.” | How often to reassess in exact time units should not be imported. |
| Observer-safe urgency cues | Any visible or reported sign | Cue presentation should describe observed evidence, not hidden diagnosis. | Qualitative worsening cues are defensible; raw lethal timers and certainty claims are not. | Narrate evidence categories rather than outcomes. | Definitive diagnosis and prognosis stay hidden. | Misleading certainty can produce false mechanics and unsafe realism. | Access to tools and expertise changes what can be known. | Directly visible, patient-reported, helper-reported, capability-dependent, hidden, or misleading categories are all distinguishable. | Mapping visible signs to a single hidden state is often weak or unsafe. |

## Domain Findings

### Hemorrhage And Shock

**Source evidence.** External life-threatening bleeding is recognizable by visible heavy flow, including continuous or spurting blood, while internal bleeding may instead present through blood from natural openings, swollen or rigid tender areas, bruising to the abdomen, chest, or skull, or only through signs of shock. Shock itself is described as progressive failure of oxygen-rich circulation, with signs such as rapid weak heartbeat, rapid breathing, pale gray cool or moist skin, confusion, restlessness, excessive thirst, dizziness, shortness of breath, and weakness. Not all internal bleeding is obvious immediately; apparently lesser trauma can still declare itself later. ([S06], [S08], [S07], [S09])

**Researcher inference.** For game abstraction, three distinct layers are robust: **visible external blood loss**, **suspected occult internal bleeding**, and **downstream shock-like decompensation**. The third should not be treated as synonymous with hemorrhage, because the signs are urgent but not source-specific. Conversely, “bleeding has been compressed or dressed” should not be treated as equivalent to “the injuring process is over,” especially where the source may be internal or where the patient already shows shock-like signs. ([S08], [S07], [S09])

**Candidate abstraction.**  
`retain`: separate **external hemorrhage**, **suspected internal bleeding**, and **shock-like circulatory crisis**.  
`retain_coarsely`: allow field care to **temporarily suppress visible external blood loss** and provide **supportive warmth and urgent movement to care**, but do not let that imply source resolution.  
`reject`: a single universal bleed-out timer, or a rule that visible blood quantity alone proves hidden severity.

### Airway Compromise And Drowning

**Source evidence.** Severe choking and upper-airway blockage are associated with inability to speak, cry, or effectively cough; difficulty breathing; noisy high-pitched or absent sounds; agitation, panic, confusion, cyanosis, and possible loss of consciousness. Drowning is defined by WHO as the process of respiratory impairment from submersion or immersion in liquid. Resuscitation guidance frames drowning care around restoration of breathing and oxygenation rather than around a separate “water in lungs” rule. The Red Cross notes that so-called “secondary” or “delayed” drowning has no accepted medical definition, even though some rescued patients with cough, confusion, or breathing difficulty may worsen after rescue and resuscitation; by contrast, a person who exits the water and remains completely normal with no symptoms did not drown. ([S10], [S11], [S12], [S05], [S04], [S01], [S02])

**Researcher inference.** A robust coarse split exists between **airway obstruction** and **post-submersion respiratory injury**. Both can present with visible breathing distress, color change, panic, confusion, or collapse, but their initiating hazards differ enough to merit separate process families. The evidence also strongly supports rejecting a trope in which a fully asymptomatic rescued swimmer later dies from a hidden “secondary drowning” clock. ([S05], [S04], [S10], [S12])

**Candidate abstraction.**  
`retain`: **choking or obstructed airway**, **drowning or post-submersion respiratory compromise**, and **general breathing distress** as separate categories.  
`retain_coarsely`: stabilization means restoring airflow or oxygenation and preventing further cooling after water rescue, not guaranteeing normal lung function or full recovery.  
`reject`: a hidden “water in lungs” certainty mechanic based only on submersion, or a late unavoidable death event after an asymptomatic post-rescue return to normal.

### Poisoning And The Limits Of Antidotes

**Source evidence.** Poison centers exist because poisoning is heterogeneous and depends on exposure type, agent, pattern, and available expertise. Antidote use depends on clinical indication and product availability. ATSDR examples show sharply different patterns: some poisonings have specific antidote pathways and still require supportive care or hospitalization; others have no specific antidote and are managed supportively; some have delayed toxicity; and some declare themselves through recognizable syndrome patterns such as excessive secretions, pinpoint pupils, weakness, breathing difficulty, seizures, paralysis, coma, metabolic acidosis, renal failure, or cardiovascular collapse. ([S13], [S14], [S16], [S17], [S18], [S15], [S19], [S20])

**Researcher inference.** Poisoning is not one process. For grounded abstraction, the evidence supports a coarse **syndrome-family** approach over an **agent-by-agent** catalog at first pass. Families that appear defensible include: **secretory or cholinergic-type respiratory compromise**, **corrosive tissue injury**, **sedating or CNS-depressant poisoning**, **convulsant or agitated poisoning**, **oxygen-utilization or blood-gas catastrophe**, and **delayed organ-failure poisoning**. The evidence also supports that **specific antidotes are exceptional and context-bound**, not a default answer to “poisoned.” ([S16], [S17], [S15], [S19], [S20], [S14])

**Candidate abstraction.**  
`retain`: poisoning categories based on **dominant physiologic threat**, not on a single poison meter.  
`optional_contextual`: some poison families may support a **rare specific-countermeasure capability**, but many should resolve only through supportive care, source removal, elimination support, or time.  
`reject`: a universal antidote, a visible-signs-only certainty diagnosis, or a single poison mechanic that ignores delayed effects and syndrome diversity.

### Cold Exposure And Heat Illness

**Source evidence.** CDC guidance states that hypothermia occurs when the body loses heat faster than it produces it; it can happen not only in severe cold but also in cool conditions when the person is wet or immersed. Low temperature impairs thinking and movement, making self-rescue less likely. Frostbite is a freezing injury characterized by loss of feeling and color, often with firm or waxy skin, and can permanently damage tissue. Heat illness ranges from cramps, heavy sweating, dizziness, headache, nausea, and weakness to heat stroke, which CDC characterizes by altered mental status, loss of consciousness, seizures, hot skin, and extreme urgency. ACSM describes exertional heat stroke as a true medical emergency with risk of organ injury and variable recovery. RCUK guidance conceptually separates prevention of hypothermia, hypothermia care, drowning prevention of further cooling, and suspected heat stroke cooling. ([S21], [S22], [S25], [S24], [S23], [S01], [S02])

**Researcher inference.** This domain is not a single “temperature damage” category. Coarse but meaningful distinctions are: **systemic cold collapse**, **local freezing injury**, **heat-exhaustion-like overheating without central collapse**, and **heat-stroke-like overheated altered patient**. Mental-status change is a particularly useful cross-domain urgency cue here, but still not diagnosis-proof. Frostbite also demonstrates that **local tissue injury can coexist with or differ from systemic temperature failure**. ([S25], [S24], [S21], [S23])

**Candidate abstraction.**  
`retain`: **hypothermia-like systemic cold**, **frostbite-like local freezing injury**, **heat-illness-like overheating**, and **heat-stroke-like hot altered crisis**.  
`retain_coarsely`: environmental removal, drying, insulation, and cooling are process-directed stabilization categories.  
`reject`: a single scalar “temperature distress” model that erases the difference between local tissue freezing and systemic collapse, or between heat exhaustion-like states and heat-stroke-like collapse.

### Burns

**Source evidence.** WHO and MedlinePlus identify burns from heat, chemicals, electricity, radiation, friction, and inhalation. Burn seriousness depends not only on size but also on depth, location, inhalation involvement, and mechanism. ABA referral guidance treats full-thickness burns, larger partial-thickness burns, deep burns of the face, hands, feet, genitalia, perineum, or joints, inhalation injury, chemical injuries, and many electrical injuries as burn-center problems rather than routine minor wounds. ABA materials also describe that deeper burns may be white, charred, leathery, or numb; may require grafting; and that larger burns raise nutritional needs and prolonged rehabilitation burden. ([S03], [S27], [S28], [S29], [S30], [S31])

**Researcher inference.** Burns are robustly distinct from laceration-style injury because **surface destruction**, **barrier loss**, **fluid and metabolic burden**, **infection vulnerability**, **smoke or inhalation complications**, and **mechanism-specific hidden damage** all matter. The evidence strongly supports that “burn severity” should not be reduced to a single visible redness scale. Electrical and inhalation mechanisms especially justify hidden seriousness beyond surface appearance. ([S27], [S28], [S31])

**Candidate abstraction.**  
`retain`: distinguish **minor superficial burn**, **serious burn**, **chemical burn**, **electrical burn**, and **burn with inhalation concern**.  
`retain_coarsely`: stabilization can cool, cover, and protect, but definitive care may require specialized wound care, fluid and nutrition support, infection prevention, rehab, and grafts.  
`reject`: determining all burn seriousness from one visible art state, or treating every burn as either “healed by dressing” or “instantly fatal.”

### Immediate Stabilization Versus Definitive Care

**Source evidence.** The cited first-aid and referral materials consistently distinguish pre-medical or immediate care from specialist or hospital care. RCUK frames first aid as immediate actions before full medical treatment. ABA referral guidance explicitly says its transfer guidance is not definitive care guidance. Poisoning materials show that some cases need specific antidotes, elimination support, hospitalization, or observation beyond scene care, and some have no specific antidote at all. The Red Cross drowning article explains that the treatment target is breathing and oxygenation, not a mythic “secondary drowning” mechanism, but it still leaves room for persistent symptoms to require medical evaluation. ([S01], [S02], [S27], [S16], [S17], [S18], [S15], [S19], [S05])

**Researcher inference.** Across these domains, **stabilization** is best understood as **temporary suppression of ongoing harm**, **support of failing physiology**, or **reduction of further exposure**. It does **not** imply consciousness, mobility, full recovery, tissue restoration, finished bleeding, cleared toxin burden, healed lungs, or survival. Narrow exceptions exist: a simple choking episode can sometimes be fully resolved if the blockage is relieved and the person returns to normal, and a truly minor superficial burn may heal with limited local care. Those exceptions are real but should remain exceptions, not the default semantics of stabilization. ([S11], [S05], [S26], [S29])

**Candidate abstraction.**  
`retain`: a strict semantic boundary where **stabilized** means **safer for now**, not **cured** or **restored**.  
`retain_coarsely`: **definitive care** is a separate category meaning causal treatment, specialist repair, organ support, or prolonged monitored recovery when the domain requires it.  
`reject`: any rule where “first aid succeeded” automatically grants normal function, anatomical restoration, or immunity to later worsening.

### Transport Risk, Monitoring, And Reassessment

**Source evidence.** Internal bleeding may be occult and become apparent later. Some poisonings have delayed toxicity and observation needs. Red Cross materials note that internal bleeding signs may not show up until later after injury. Burn referral guidance emphasizes that transfer decisions depend partly on infrastructure, resources, and relationships, and that some electrical injuries merit later screening for delayed symptoms. Drowning survivors with ongoing cough, confusion, or breathing difficulty warrant evaluation. Heat stroke recovery is variable. RCUK first-aid guidance explicitly includes continued checking to determine whether additional care is needed. ([S06], [S07], [S05], [S19], [S23], [S27], [S01], [S02])

**Researcher inference.** Transport is not just moving the same state from one map tile to another. It changes exposure, delay, certainty, and available interventions. Reassessment is therefore intrinsic to grounded abstraction, because what mattered at discovery may not match what matters after motion, waiting, worsening weather, delayed symptoms, or failed response to aid. This is especially robust for occult bleeding, airway or respiratory compromise, poisoning, severe heat illness, and serious burns. ([S07], [S05], [S19], [S23], [S27])

**Candidate abstraction.**  
`retain`: reassessment triggers tied to **movement**, **delay**, **environmental change**, **new symptoms**, or **lack of expected improvement**.  
`optional_contextual`: contextual modifiers for **escort skill**, **shelter**, **specialty destination availability**, **contamination risk**, or **monitoring equipment**.  
`reject`: a one-time scene assessment that remains permanently accurate without later checks.

### Observer-Safe Urgency Cues

**Source evidence.** Across the sources, reliable urgency cues include heavy visible bleeding; signs of shock; inability to speak, cry, or effectively cough; high-pitched or absent breathing sounds; blue or pale coloration; confusion; agitation; unresponsiveness; cough or breathing difficulty after drowning; heavy sweating, weakness, dizziness, or nausea in heat illness; confusion, seizures, or hot skin in heat stroke; clumsiness and impaired thinking in hypothermia; numb waxy discolored extremities in frostbite; and burn features such as blistering, charred or leathery appearance, numb deep burns, facial or airway-exposure clues, or trouble breathing after smoke exposure. But many sources also show that these signs do not uniquely identify a hidden diagnosis. ([S10], [S12], [S06], [S08], [S05], [S21], [S22], [S25], [S24], [S27], [S28])

**Researcher inference.** Observer-safe presentation should say what the observer can perceive or what the patient reports, not what the hidden physiology “must be.” The evidence strongly supports qualitative cues like **“can’t speak through the obstruction,” “breathing is getting noisier,” “skin is pale and clammy,” “still confused after rescue,” “hot and not acting right,” “hands are numb and waxy,”** or **“the burn looks deep or involves the face.”** It does not support certainty statements like **“internal hemorrhage confirmed,” “lungs are filling,” “this poison is reversible,”** or **“the patient will die unless cured in N minutes.”** ([S10], [S08], [S05], [S21], [S24], [S27])

**Candidate abstraction.**  
`retain`: a cue taxonomy based on visibility and reportability.  
`reject`: a UI that converts one sign into one diagnosis, or exposes hidden stages, exact timers, or future outcomes.

## Stabilization, Definitive Care, And Restoration Boundary

The evidence strongly supports a design boundary in which **stabilization is not restoration**. In hemorrhage, scene care can suppress visible external blood loss and support shock response, but it does not prove that internal bleeding is absent or that the bleeding source is resolved. In airway compromise, temporary relief of obstruction or improvement in breathing does not prove that aspiration, swelling, or post-submersion respiratory injury has resolved. In poisoning, even specific antidote-capable cases often still require supportive care, observation, hospitalization, or removal of the agent’s downstream burden; many poisonings lack a specific antidote altogether. In cold and heat illness, environmental correction may temporarily improve the patient while tissue injury or organ injury risk remains. In burns, cooling and covering protect tissue, but deeper burns, inhalation injuries, and larger burns often require specialist wound care, grafting, nutrition support, infection prevention, and rehabilitation. ([S07], [S09], [S05], [S16], [S17], [S18], [S15], [S19], [S23], [S27], [S28], [S29], [S30], [S31])

Accordingly, later repository decisions should not let **stabilized** imply **conscious**, **mobile**, **safe to travel alone**, **fully healed**, **anatomically restored**, **permanently out of danger**, or **surviving**. It also should not imply the restoration concepts already excluded by the prompt boundary, such as anatomical reconstitution, resurrection, or guaranteed function. The most defensible semantics are narrower: stabilized means the ongoing threat may have been reduced, temporarily contained, or physiologically buffered. ([S01], [S02], [S27], [S16], [S19])

Domain-specific exceptions do exist, but they are limited. A simple choking event may be completely resolved when the obstruction is removed and the person returns to normal speech and breathing; an actually minor superficial burn may heal with limited local care. However, those cases are exceptions at the low-severity end, not grounds for generalizing stabilization into definitive recovery. ([S11], [S26], [S29])

## Transport, Monitoring, And Reassessment

Movement, delay, environment, provider access, and intervention response all matter because several of the relevant processes are **dynamic and partially hidden**. Internal bleeding may emerge after the fact. Some poisonings declare themselves late or evolve despite early apparent stability. Drowning survivors may still need evaluation if symptoms persist or recur after rescue. Severe heat illness may have variable recovery and organ injury burden. Cold exposure can continue during transport if insulation and shelter are poor. Serious burns may require transfer decisions shaped by available infrastructure rather than by injury appearance alone. ([S07], [S19], [S05], [S23], [S24], [S27])

For game abstraction, the robust finding is not that transport has one universal penalty. Rather, it is that **transport can force reassessment** because information and physiology both change while the patient is being moved. Delay can reveal hidden severity. Weather or water exposure can deepen cold injury. Heat and exertion can continue to worsen heat illness. Contamination concerns can limit who can safely help in poisoning settings. Burn-center distance or lack of specialty support can change what “adequate care” even means. ([S17], [S19], [S24], [S27])

The most defensible coarse abstraction is therefore a qualitative one: reassessment should be triggered by **story-relevant change** such as new bleeding through dressings, renewed cough or confusion after submersion, new weakness or agitation after toxic exposure, worsening clumsiness in cold, failure to cool in heat, or new breathing difficulty after burn or smoke exposure. Exact clock values, exact chances, and exact hidden-stage scripts remain unsupported and should stay out of the model at this stage. ([S06], [S05], [S20], [S24], [S21], [S27])

## Observer-Safe Urgency

The following cue classes are defensible for observer-safe presentation.

| Cue class | Defensible examples | Use boundary |
|---|---|---|
| Directly visible | Heavy visible bleeding; blood continuing through dressings; pale, gray, cool, or clammy skin; throat clutching; inability to speak or cry; noisy or absent breathing; blue color; heavy sweating; obvious weakness; red blistered or charred burn; numb waxy fingers or toes. ([S10], [S06], [S08], [S21], [S25], [S28]) | Safe to show as present observations. Do not claim a single hidden cause from them alone. |
| Patient-reported | Trouble breathing, chest or abdominal pain, dizziness, weakness, nausea, thirst, feeling very cold, numbness, worsening pain after burn. ([S09], [S12], [S22], [S24], [S28]) | Safe to show as reports; still not diagnosis-proof. |
| Helper- or provider-reported | “Bleeding seems controlled for now,” “still confused after water rescue,” “possible smoke exposure,” “may have taken a toxin,” “signs of shock,” “needs poison-center or burn-center advice.” ([S05], [S08], [S13], [S27]) | Safe as qualified judgments tied to the observer’s role and capability. |
| Equipment- or capability-dependent | Precise poison identification, temperature-based heat diagnosis, specialist burn referral decisions, toxicology observation, advanced airway or contamination judgment. ([S23], [S13], [S27], [S17]) | Should stay hidden unless the world state includes the relevant equipment or expertise. |
| Hidden or diagnosis-dependent | Exact internal bleeding source, exact toxin identity or dose, exact airway lesion, exact inhalation depth, exact organ-injury burden, future survival. | Should remain hidden. The sources repeatedly show that visible signs do not uniquely determine these. ([S07], [S19], [S27], [S05]) |
| Unsafe or misleading as certainty | “Dry drowning,” “one antidote fixes poisoning,” “a calm patient is cured,” “one sign proves internal hemorrhage,” “they have exactly X time left,” “this burn is only superficial because it looks small.” ([S05], [S14], [S07], [S27]) | Should be excluded from player-facing certainty and from deterministic crisis UI. |

The central presentation rule that best fits the evidence is: **show cues, not diagnoses; show trend, not timer; show uncertainty, not hidden certainty.**

## Game-Abstraction Candidate Ledger

| Proposed abstraction | Classification | Source support | Uncertainty | Likely owner or consumer | Reason |
|---|---|---|---|---|---|
| Separate **external hemorrhage**, **suspected internal bleeding**, and **shock-like deterioration** | `retain` | Red Cross bleeding and shock; MedlinePlus bleeding. ([S06], [S08], [S07], [S09]) | Moderate: exact thresholds remain hidden. | Lethal-process catalog; observer-safe package | Strong support that these are clinically and observationally distinct enough for coarse play abstraction. |
| Separate **choking or obstruction** from **post-submersion respiratory compromise** | `retain` | WHO drowning; Red Cross choking and drowning; MedlinePlus choking and airway blockage. ([S10], [S11], [S12], [S05], [S04]) | Low-to-moderate | Lethal-process catalog; observer-safe package | Different hazards, different cues, different recurrence patterns. |
| Model poisoning by a small set of **syndrome families** rather than by a single poison meter | `retain_coarsely` | ATSDR toxin examples; poison-center infrastructure; antidote review. ([S13], [S14], [S16], [S17], [S15], [S19], [S20]) | Moderate-to-high: the exact syndrome set needs later scoping. | First lethal-process definition/catalog plan | Strong evidence against one poison bucket; more research needed for the right family count. |
| Treat **specific antidote capability** as rare, contextual, and source-dependent rather than universal | `retain` | HHS antidote review; ATSDR examples with and without antidotes. ([S14], [S16], [S17], [S18], [S15], [S19]) | Low | Care-capability and stabilization contract/package | Strongly supported. |
| Distinguish **systemic hypothermia**, **local frostbite**, **non-stroke heat illness**, and **heat-stroke-like hot altered crisis** | `retain` | CDC cold and heat resources; ACSM consensus; RCUK. ([S21], [S22], [S25], [S24], [S23], [S01], [S02]) | Low-to-moderate | Lethal-process catalog | Strong support for at least these coarse subfamilies. |
| Distinguish **minor superficial burn**, **serious burn**, **chemical burn**, **electrical burn**, and **burn with inhalation concern** | `retain` | WHO burns; ABA referral and patient pages; MedlinePlus burns. ([S03], [S27], [S28], [S29], [S31]) | Moderate: exact thresholds should stay hidden. | Lethal-process catalog; care-capability package | Mechanism and location materially matter beyond simple size. |
| Treat **stabilized** as “safer for now” rather than “cured” | `retain` | Cross-domain first-aid, poison, drowning, burn referral sources. ([S01], [S02], [S05], [S16], [S19], [S27]) | Low | Integration decision; care-capability package | Among the strongest cross-domain conclusions. |
| Make **definitive care** a separate state or capability from **stabilization** | `retain` | Same cross-domain support as above; especially poison and burn referral materials. ([S16], [S17], [S18], [S27], [S31]) | Low | Integration decision; care-capability package | Strongly supported. |
| Add **reassessment triggers** after movement, delay, weather change, return of symptoms, or failed improvement | `retain_coarsely` | Internal bleeding delay; drowning symptom recurrence; delayed toxin effects; heat and cold progression; RCUK continued checking. ([S07], [S05], [S19], [S23], [S24], [S01], [S02]) | Low-to-moderate | Care-capability package; observer-safe package | Strongly supported qualitatively, but not with exact intervals. |
| Present urgency through **observer-safe cues**, not certainty diagnoses | `retain` | Cross-domain sign lists and uncertainty limits. ([S10], [S08], [S21], [S24], [S27], [S05]) | Low | Observer-safe crisis assessment/presentation package | Strongly supported. |
| Expose a universal **critical meter**, **bleed-out timer**, or **omnibus lethal roll** | `reject` | Cross-domain evidence shows source-specific processes, delayed presentations, and nonspecific signs. ([S07], [S19], [S23], [S27]) | Low | Integration decision | The research does not support one omnibus mechanic without distorting major distinctions. |
| Use “dry drowning” or “secondary drowning” as a hidden delayed-death mechanic after asymptomatic recovery | `reject` | Red Cross drowning clarification. ([S05]) | Low | Lethal-process catalog; observer-safe package | Specifically contradicted by modern framing. |
| Infer exact hidden diagnosis from one visible sign | `reject` | Bleeding, airway, poison, burn, and temperature sources all show overlap and nonspecificity. ([S12], [S08], [S20], [S27]) | Low | Observer-safe package | Unsafe and weakly supported. |
| Provide a medieval-fantasy poison catalog with robust syndrome families and countermeasure mapping | `research_gap` | Existing sources support the concept, but not the exact content taxonomy for this setting. ([S13], [S14], [S16], [S17], [S15], [S19], [S20]) | High | First lethal-process definition/catalog plan | Needs separate design research to choose the smallest defensible poison family set. |
| Determine whether localized burn evolution, inhalation decline, and delayed toxic effects should be abstracted as explicit recurrence events or only as reassessment hooks | `research_gap` | Delayed effects are supported, but abstraction shape is a design choice not answered by evidence alone. ([S19], [S05], [S27]) | High | Integration decision; care-capability package | Later authority must decide mechanic form. |

## Cautions And Explicit Non-Decisions

This research does **not** justify importing any real-world exact bleed-out window, drowning countdown, toxicity curve, frostbite clock, rewarming timer, heat-stroke timer, or burn-survival timer. The sources support process diversity and delayed evolution, not one exact playable timetable across settings. ([S07], [S05], [S19], [S23], [S27])

This research does **not** justify a claim that one visible sign proves one hidden diagnosis. Pale clammy skin and confusion can accompany shock from different causes; breathing distress can arise from obstruction, drowning injury, smoke inhalation, poisoning, or heat illness; and superficial burn appearance can hide deeper or inhalational severity. ([S08], [S12], [S27], [S31])

This research does **not** answer what exact medieval-fantasy poison families, ingredients, antidote analogues, or folklore beliefs belong in repository canon. It supports only the higher-order conclusion that poison categories should be syndrome-aware, antidotes selective, and uncertainty explicit. ([S13], [S14], [S16], [S17])

This research does **not** settle pediatric versus adult granularity, athletic versus non-athletic heat illness edge cases, wilderness versus urban transport assumptions, or region-specific system-capability assumptions. Several sources are lay-facing, U.S.- or U.K.-specific, or occupational or athletic in emphasis, even when their core distinctions are widely applicable. ([S21], [S23], [S01], [S02], [S27])

This research does **not** establish gameplay balance values, exact modulator weights for weather or delay, exact specialty-care capability packages, exact reassessment cadence, or exact resurrection, restoration, or aftereffects semantics. Those remain repository decisions, not evidence outputs.

A process limitation also remains: the prompt required reading specific repository files at the stated baseline commit, but those file contents were not retrievable through the accessible tool context during this run. Therefore, this artifact should be consumed as external evidence plus user-supplied repository constraints, not as a verified repository-text synthesis.

## Named Consumers And Retention

The named consumers for this artifact are exactly:

1. unversioned `Lethal Process And Stabilization Research Integration Decision`;
2. the first lethal-process definition/catalog plan;
3. the first care-capability and stabilization contract/package;
4. the first observer-safe crisis assessment/presentation package.

This artifact must remain until every named consumer records consumption and a durable authority retains the conclusions and source identity it still needs.

## Bounded Answers

**Which process families appear distinct enough for later repository integration?**  
The strongest candidates are: **external hemorrhage**, **occult or internal bleeding**, **shock-like circulatory failure**, **choking or airway obstruction**, **post-submersion respiratory compromise**, **poisoning syndrome families rather than one poison bucket**, **systemic hypothermia**, **local freezing injury or frostbite**, **non-stroke heat illness**, **heat-stroke-like hot altered crisis**, and **serious burn families distinguished at minimum by depth or seriousness plus chemical, electrical, and inhalation variants**. Burns, poisons, and airway compromise especially need more than one coarse bucket. ([S06], [S07], [S08], [S10], [S04], [S16], [S17], [S19], [S20], [S25], [S24], [S21], [S27], [S28])

**Which stabilization versus definitive-care distinctions are strongly supported?**  
Very strongly: stabilization reduces immediate harm or supports failing physiology; definitive care resolves the cause or repairs the damage when possible. External bleeding control is not internal source control. Relief of breathing distress is not proof of normal lungs. Supportive toxin care is often not curative and may need antidote, organ support, or observation. Burn cooling and covering are not the same as grafting, airway management, infection prevention, nutrition support, or rehab. Stabilization therefore does not imply consciousness, mobility, restoration, survival, or anatomical repair. ([S07], [S05], [S16], [S17], [S18], [S19], [S27], [S28], [S31])

**Which recurrence, transport, and reassessment concerns are robust enough for qualitative abstraction?**  
The most robust are: hidden internal bleeding declaring itself later; symptom persistence or return after non-fatal drowning; delayed toxic effects; worsening cold or heat injury during delay or movement; and burn seriousness that depends on destination capability, smoke exposure, electrical mechanism, or delayed follow-up needs. Reassessment after movement, delay, environmental change, or failed improvement is strongly supported. Exact numeric cadences are not. ([S07], [S05], [S19], [S24], [S23], [S27])

**Which observer-safe signs are defensible, and which diagnoses or mechanics must remain hidden?**  
Defensible cues include heavy visible bleeding, pallor or clamminess, weak rapid pulse, inability to speak or cough, noisy or absent breathing sounds, panic or confusion, persistent cough after submersion, hot altered presentation, shivering or clumsiness in cold, numb waxy extremities, blistering or charred burns, facial burn or smoke-exposure clues, and worsening weakness or secretions after suspected poisoning. Hidden elements should include exact bleeding source, exact toxin identity or dose, exact inhalation severity, exact organ injury, exact hidden process stage, exact survival odds, and exact time-to-collapse or time-to-death. ([S10], [S06], [S08], [S20], [S21], [S25], [S27], [S05])

**Which proposed abstractions should be rejected or researched further?**  
Reject: a universal critical meter, a universal bleed timer, a universal poison meter, certainty diagnosis from one sign, and any “dry drowning” hidden delayed-death mechanic after asymptomatic recovery. Research further: the exact poison syndrome catalog for the setting; how many burn subfamilies are worth separate mechanics; whether delayed worsening should appear as explicit event types or only as reassessment hooks; and how world capability packages should expose or hide diagnostic certainty. ([S05], [S14], [S19], [S27])

**What exact repository decisions remain before any executable or balance-bearing catalog?**  
Before any executable or balance-bearing catalog, the repository still needs decisions on:  
the canonical lethal-process family set;  
the semantic contract for stabilization versus definitive care;  
the care-capability package structure and which capabilities are scene-level versus destination-level;  
the observer-safe cue grammar and what remains hidden;  
the reassessment-trigger contract for delay, movement, environment, and failed response;  
the poison taxonomy scope and antidote rarity model;  
the burn-family granularity and transfer-capability semantics;  
and the durable authority that will retain conclusions and source identity from this temporary artifact. Those are design-authority questions, not questions this evidence artifact can decide.

**No repository write, commit, or push was performed.**

## Durable Source References

[S01]: https://pubmed.ncbi.nlm.nih.gov/41117568/ "European Resuscitation Council Guidelines 2025 First Aid"
[S02]: https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/first-aid-guidelines "First Aid Guidelines"
[S03]: https://www.who.int/news-room/fact-sheets/detail/burns "Burns"
[S04]: https://www.who.int/news-room/fact-sheets/detail/drowning "Drowning"
[S05]: https://www.redcross.org/take-a-class/resources/articles/dry-or-delayed-secondary-drowning "Debunking Dry or Delayed Secondary Drowning"
[S06]: https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-external "Bleeding, Life-Threatening External"
[S07]: https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-internal "Bleeding, Life-Threatening Internal"
[S08]: https://www.redcross.org/take-a-class/resources/learn-first-aid/shock "Shock"
[S09]: https://medlineplus.gov/ency/article/000045.htm "Bleeding"
[S10]: https://www.redcross.org/take-a-class/resources/learn-first-aid/adult-child-choking "Adult & Child Choking"
[S11]: https://medlineplus.gov/ency/article/000049.htm "Choking, Adult or Child Over 1 Year"
[S12]: https://medlineplus.gov/ency/article/000067.htm "Blockage of Upper Airway"
[S13]: https://poisoncenters.org/ "America’s Poison Centers"
[S14]: https://stacks.cdc.gov/view/cdc/33888/cdc_33888_DS1.pdf "Antidotes and Rescue Therapies"
[S15]: https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=1141&toxid=249 "Hydrogen Cyanide Medical Management Guidelines"
[S16]: https://wwwn.cdc.gov/Tsp/MMG/MMGDetails.aspx?mmgid=82&toxid=21 "Ethylene Glycol Medical Management Guidelines"
[S17]: https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=927&toxid=192 "Calcium Hypochlorite or Sodium Hypochlorite Medical Management Guidelines"
[S18]: https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=1203&toxid=22 "Lead Medical Management Guidelines"
[S19]: https://wwwn.cdc.gov/tsp/MMG/MMGDetails.aspx?mmgid=1199&toxid=278 "Arsine Medical Management Guidelines"
[S20]: https://wwwn.cdc.gov/TSp/MMG/MMGDetails.aspx?mmgid=1140&toxid=246 "Parathion Medical Management Guidelines"
[S21]: https://www.cdc.gov/niosh/heat-stress/about/illnesses.html "Heat-Related Illnesses"
[S22]: https://www.cdc.gov/heat-health/about/index.html "About Heat and Your Health"
[S23]: https://pubmed.ncbi.nlm.nih.gov/37036463/ "ACSM Expert Consensus Statement on Exertional Heat Illness"
[S24]: https://www.cdc.gov/winter-weather/prevention/index.html "Preventing Hypothermia"
[S25]: https://www.cdc.gov/winter-weather/prevention/preventing-frostbite.html "Preventing Frostbite"
[S26]: https://www.ameriburn.org/patients/burn-first-aid "Burn First Aid"
[S27]: https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral "Burn Patient Referral Guidelines"
[S28]: https://www.ameriburn.org/patients/understanding-a-burn-injury "Understanding a Burn Injury"
[S29]: https://www.ameriburn.org/patients/common-types-of-burns/thermal-burns "Thermal Burns"
[S30]: https://www.ameriburn.org/patients/common-conditions-for-burn-survivors/healthy-eating "Healthy Eating After Burn Injury"
[S31]: https://medlineplus.gov/burns.html "Burns"
