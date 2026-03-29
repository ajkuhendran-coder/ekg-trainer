// ============================================================================
// casesContent.ts - Klinische Fallszenarien fuer EKG-basiertes Training
// Alle Inhalte in deutscher medizinischer Fachsprache
// Medikamentendosierungen nach ERC 2021 / ESC Leitlinien
// ============================================================================

export type CaseCategory = 'praeoperativ' | 'intraoperativ' | 'postoperativ' | 'notfall';

export interface CaseQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  category: CaseCategory;
  difficulty: 1 | 2 | 3;
  scenario: string;
  patientInfo: {
    age: number;
    gender: 'M' | 'W';
    weight: number;
    height: number;
    vorerkrankungen: string[];
    medikamente: string[];
    allergie: string[];
  };
  vitalparameter: {
    hf: string;
    rr: string;
    spo2: string;
    temperatur?: string;
    etco2?: string;
  };
  ekgPattern: string;
  questions: CaseQuestion[];
  zusammenfassung: string;
  leitlinienReferenz?: string;
}

// ============================================================================
// KLINISCHE FAELLE
// ============================================================================

export const CLINICAL_CASES: ClinicalCase[] = [

  // ==========================================================================
  // PRAEOPERATIV (4 Faelle)
  // ==========================================================================

  // --- Fall 1: Vorhofflimmern vor Hueft-TEP ---
  {
    id: 'prae-01-vhf-hueft-tep',
    title: 'Vorhofflimmern vor H\u00fcft-TEP',
    category: 'praeoperativ',
    difficulty: 1,
    scenario: `<p>Eine 78-j\u00e4hrige Patientin stellt sich zur Pr\u00e4medikationsvisite vor geplanter H\u00fcft-TEP rechts bei Coxarthrose vor. Sie berichtet \u00fcber gelegentliches Herzstolpern seit mehreren Jahren. Die Patientin ist kardiopulmonal belastbar (2 Stockwerke Treppensteigen ohne Dyspnoe).</p>
<p>Im Ruhe-EKG zeigt sich eine absolute Arrhythmie bei Vorhofflimmern mit einer Kammerfrequenz von 82/min. Die Patientin steht seit 3 Jahren unter oraler Antikoagulation mit Phenprocoumon (Marcumar\u00ae). Der aktuelle INR betr\u00e4gt 2,4. Der CHA\u2082DS\u2082-VASc-Score liegt bei 5 Punkten (Alter, Geschlecht, arterielle Hypertonie, Diabetes mellitus).</p>
<p>Die Echokardiographie zeigt eine gute linksventrikul\u00e4re Funktion (EF 60%), einen vergr\u00f6\u00dferten linken Vorhof (48 mm) und keine relevanten Klappenvitien.</p>`,
    patientInfo: {
      age: 78,
      gender: 'W',
      weight: 72,
      height: 165,
      vorerkrankungen: [
        'Vorhofflimmern (permanent, seit 5 Jahren)',
        'Arterielle Hypertonie',
        'Diabetes mellitus Typ 2',
        'Coxarthrose rechts',
      ],
      medikamente: [
        'Phenprocoumon (Marcumar) nach INR',
        'Metoprolol 47,5 mg 1-0-0',
        'Ramipril 5 mg 1-0-0',
        'Metformin 1000 mg 1-0-1',
      ],
      allergie: ['Penicillin (Exanthem)'],
    },
    vitalparameter: {
      hf: '82/min (arrhythmisch)',
      rr: '138/78 mmHg',
      spo2: '96%',
      temperatur: '36,4 \u00b0C',
    },
    ekgPattern: 'afib',
    questions: [
      {
        question: 'Welche EKG-Diagnose liegt bei dieser Patientin vor?',
        options: [
          'Sinusrhythmus mit ventrikul\u00e4ren Extrasystolen',
          'Vorhofflimmern mit normofrequenter \u00dcberleitung',
          'Vorhofflattern mit 2:1-\u00dcberleitung',
          'Multifokale atriale Tachykardie',
        ],
        correctIndex: 1,
        explanation:
          'Das EKG zeigt eine absolute Arrhythmie ohne erkennbare P-Wellen mit unregelm\u00e4\u00dfigen RR-Intervallen. Die Kammerfrequenz liegt mit 82/min im normofrequenten Bereich (60\u2013100/min). Dies entspricht einem Vorhofflimmern mit normofrequenter \u00dcberleitung unter der bestehenden Betablocker-Therapie.',
      },
      {
        question:
          'Wie sollte das perioperative Bridging der Antikoagulation bei dieser Patientin erfolgen?',
        options: [
          'Marcumar 5 Tage pr\u00e4operativ absetzen, kein Bridging notwendig',
          'Marcumar 5 Tage pr\u00e4operativ absetzen, Bridging mit NMH in therapeutischer Dosis bei hohem Thromboembolierisiko',
          'Marcumar bis zum OP-Tag weitergeben und Vitamin K am OP-Morgen',
          'Direkt auf Heparin-Perfusor umstellen, Marcumar sofort absetzen',
        ],
        correctIndex: 1,
        explanation:
          'Bei einem CHA\u2082DS\u2082-VASc-Score von 5 besteht ein hohes Thromboembolierisiko. Phenprocoumon sollte 5\u20137 Tage pr\u00e4operativ pausiert werden. Ein Bridging mit niedermolekularem Heparin (z. B. Enoxaparin 1 mg/kg KG 2\u00d7 t\u00e4glich s.c.) in therapeutischer Dosis ist indiziert. Die letzte therapeutische Dosis erfolgt 24 h pr\u00e4operativ (ESC-Leitlinie Vorhofflimmern 2020).',
      },
      {
        question:
          'Welche Aussage zur an\u00e4sthesiologischen OP-Freigabe ist korrekt?',
        options: [
          'Die OP-Freigabe kann erteilt werden, da VHF und Frequenzkontrolle ad\u00e4quat sind',
          'Keine OP-Freigabe wegen des Vorhofflimmerns \u2013 erst Kardioversion notwendig',
          'OP-Freigabe nur nach transösophagealer Echokardiographie zum Thrombenausschluss',
          'OP-Freigabe erst nach Ablationstherapie des Vorhofflimmerns',
        ],
        correctIndex: 0,
        explanation:
          'Bei permanentem Vorhofflimmern mit ad\u00e4quater Frequenzkontrolle (Ziel <110/min laut ESC), erhaltener LV-Funktion und bestehender Antikoagulation kann die OP-Freigabe f\u00fcr den elektiven Eingriff erteilt werden. Eine Kardioversion ist bei permanentem VHF nicht sinnvoll. Wichtig ist das korrekte perioperative Antikoagulationsmanagement.',
      },
      {
        question:
          'Welches Ziel der Herzfrequenzkontrolle gilt bei permanentem Vorhofflimmern nach ESC-Leitlinie?',
        options: [
          'Ruhefrequenz <60/min',
          'Ruhefrequenz <80/min',
          'Ruhefrequenz <110/min',
          'Ruhefrequenz <130/min',
        ],
        correctIndex: 2,
        explanation:
          'Nach der ESC-Leitlinie 2020 zum Management von Vorhofflimmern wird initial eine Ruhefrequenz <110/min empfohlen (leniente Frequenzkontrolle). Nur bei persistierenden Symptomen trotz Frequenzkontrolle sollte eine strengere Kontrolle (<80/min) angestrebt werden.',
      },
    ],
    zusammenfassung:
      'Permanentes Vorhofflimmern mit ad\u00e4quater Frequenzkontrolle ist keine Kontraindikation f\u00fcr elektive Eingriffe. Entscheidend sind das korrekte perioperative Bridging der Antikoagulation anhand des CHA\u2082DS\u2082-VASc-Scores und die Sicherstellung einer Ruhefrequenz <110/min.',
    leitlinienReferenz: 'ESC Guidelines Atrial Fibrillation 2020, ESC/ESA Guidelines Non-cardiac Surgery 2022',
  },

  // --- Fall 2: AV-Block bei Knie-Arthroskopie ---
  {
    id: 'prae-02-avb-knie',
    title: 'AV-Block bei Knie-Arthroskopie',
    category: 'praeoperativ',
    difficulty: 2,
    scenario: `<p>Ein 65-j\u00e4hriger Patient wird zur Pr\u00e4medikation vor geplanter Knie-Arthroskopie (Meniskusnaht) vorgestellt. In der Anamnese berichtet er \u00fcber zwei synkopale Episoden in den letzten 6 Monaten, jeweils ohne Prodromi, mit kurzer Bewusstlosigkeit und spontaner Erholung.</p>
<p>Das Ruhe-EKG zeigt einen Sinusrhythmus mit einer Frequenz von 52/min. Die PR-Zeit ist mit 280 ms deutlich verl\u00e4ngert. Intermittierend fehlen QRS-Komplexe nach P-Wellen, wobei die PR-Intervalle vor dem Ausfall konstant sind. Die QRS-Komplexe sind mit 140 ms verbreitert.</p>
<p>In der Zusammenschau ergibt sich das Bild eines AV-Blocks II. Grades Typ Mobitz (Typ 2) mit intermittierender 2:1-\u00dcberleitung. Der Patient hat bisher keinen Herzschrittmacher und ist bislang kardiologisch nicht angebunden.</p>`,
    patientInfo: {
      age: 65,
      gender: 'M',
      weight: 85,
      height: 178,
      vorerkrankungen: [
        'Arterielle Hypertonie',
        'Synkopen (2x in 6 Monaten)',
        'Innenmeniskusriss rechtes Knie',
      ],
      medikamente: [
        'Amlodipin 5 mg 1-0-0',
        'ASS 100 mg 1-0-0',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '52/min (regelm\u00e4\u00dfig, intermittierend Pausen)',
      rr: '125/72 mmHg',
      spo2: '97%',
    },
    ekgPattern: 'av_block_2_type2',
    questions: [
      {
        question:
          'Welche EKG-Diagnose liegt vor und wie unterscheiden Sie den AV-Block II\u00b0 Typ 1 (Wenckebach) vom Typ 2 (Mobitz)?',
        options: [
          'Typ 1: konstante PR-Zeiten mit pl\u00f6tzlichem Ausfall; Typ 2: zunehmende PR-Verl\u00e4ngerung',
          'Typ 1: zunehmende PR-Verl\u00e4ngerung bis zum Ausfall; Typ 2: konstante PR-Zeiten mit pl\u00f6tzlichem Ausfall',
          'Typ 1: breite QRS-Komplexe; Typ 2: schmale QRS-Komplexe',
          'Typ 1: hohe Kammerfrequenz; Typ 2: niedrige Kammerfrequenz',
        ],
        correctIndex: 1,
        explanation:
          'Beim AV-Block II\u00b0 Typ 1 (Wenckebach) verl\u00e4ngert sich das PR-Intervall progressiv bis eine \u00dcberleitung ausf\u00e4llt. Beim Typ 2 (Mobitz) sind die PR-Intervalle konstant, und es kommt pl\u00f6tzlich zum Ausfall einer \u00dcberleitung. Typ 2 ist h\u00e4ufig mit breiten QRS-Komplexen assoziiert (infranodaler Block) und hat ein h\u00f6heres Risiko f\u00fcr einen kompletten AV-Block.',
      },
      {
        question:
          'Besteht bei diesem Patienten eine Schrittmacher-Indikation?',
        options: [
          'Nein, ein AV-Block II\u00b0 ist immer benigne und bedarf keiner Therapie',
          'Ja, ein AV-Block II\u00b0 Typ 2 mit Synkopen ist eine Klasse-I-Indikation f\u00fcr einen Schrittmacher',
          'Nur wenn zus\u00e4tzlich eine Herzinsuffizienz vorliegt',
          'Nur bei Kammerfrequenz unter 30/min',
        ],
        correctIndex: 1,
        explanation:
          'Ein AV-Block II\u00b0 Typ Mobitz (Typ 2) mit symptomatischer Bradykardie (hier: Synkopen) stellt eine Klasse-I-Indikation f\u00fcr eine Schrittmacherimplantation dar (ESC-Leitlinie Bradykardie/Schrittmacher 2021). Der infranodal gelegene Block hat ein hohes Progressionsrisiko zum totalen AV-Block.',
      },
      {
        question:
          'Wie ist das an\u00e4sthesiologische Procedere f\u00fcr den geplanten Eingriff?',
        options: [
          'OP-Freigabe erteilen und OP in Spinalanaesthesie durchf\u00fchren',
          'Elektive OP verschieben, erst kardiologische Abkl\u00e4rung und Schrittmacher-Evaluation',
          'OP in Allgemeinan\u00e4sthesie mit externem transkutanem Schrittmacher in Bereitschaft',
          'OP-Freigabe nur mit Atropin-Dauerinfusion intraoperativ',
        ],
        correctIndex: 1,
        explanation:
          'Bei einem symptomatischen AV-Block II\u00b0 Typ 2 mit Synkopen und Schrittmacher-Indikation sollte der elektive Eingriff verschoben werden. Die kardiologische Abkl\u00e4rung und ggf. Schrittmacherimplantation haben Priorit\u00e4t. Eine Spinalanaesthesie w\u00e4re zudem kontraindiziert, da sympatholytische Effekte die Bradykardie verst\u00e4rken k\u00f6nnten.',
      },
    ],
    zusammenfassung:
      'Der AV-Block II\u00b0 Typ 2 (Mobitz) mit Synkopen stellt eine Klasse-I-Schrittmacher-Indikation dar. Elektive Eingriffe m\u00fcssen bis zur kardiologischen Abkl\u00e4rung und Schrittmacherversorgung verschoben werden. Eine Spinalanaesthesie ist bei symptomatischer Bradykardie zu vermeiden.',
    leitlinienReferenz: 'ESC Guidelines Cardiac Pacing 2021',
  },

  // --- Fall 3: Langes QT vor Cholezystektomie ---
  {
    id: 'prae-03-lqts-chole',
    title: 'Langes QT vor Cholezystektomie',
    category: 'praeoperativ',
    difficulty: 2,
    scenario: `<p>Eine 34-j\u00e4hrige Patientin wird zur laparoskopischen Cholezystektomie bei symptomatischer Cholezystolithiasis vorgestellt. In der Familienanamnese ist ein pl\u00f6tzlicher Herztod des Bruders mit 22 Jahren bekannt. Die Patientin ist genetisch gesicherte Tr\u00e4gerin eines Long-QT-Syndroms Typ 1 (KCNQ1-Mutation).</p>
<p>Das Ruhe-EKG zeigt einen Sinusrhythmus mit 72/min, eine QTc-Zeit von 510 ms (Bazett-Formel) und eine breitbasige T-Welle. Es bestehen keine Rhythmusst\u00f6rungen in Ruhe. Ein implantierbarer Kardioverter-Defibrillator (ICD) wurde vor 2 Jahren implantiert. Bisher keine ICD-Therapieabgabe.</p>
<p>Die Patientin nimmt regelm\u00e4\u00dfig Nadolol 40 mg t\u00e4glich ein. Die linkventrikul\u00e4re Funktion ist normal.</p>`,
    patientInfo: {
      age: 34,
      gender: 'W',
      weight: 62,
      height: 168,
      vorerkrankungen: [
        'Kongenitales Long-QT-Syndrom Typ 1 (LQTS1)',
        'ICD-Tr\u00e4gerin (seit 2 Jahren)',
        'Symptomatische Cholezystolithiasis',
      ],
      medikamente: [
        'Nadolol 40 mg 1-0-0',
        'Magnesium 400 mg 1-0-0',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '72/min',
      rr: '118/68 mmHg',
      spo2: '99%',
    },
    ekgPattern: 'long_qt',
    questions: [
      {
        question:
          'Ab welchem QTc-Wert gilt die QT-Zeit als sicher pathologisch verl\u00e4ngert?',
        options: [
          'QTc >400 ms',
          'QTc >440 ms bei M\u00e4nnern, >460 ms bei Frauen',
          'QTc >500 ms',
          'QTc >600 ms',
        ],
        correctIndex: 1,
        explanation:
          'Eine QTc-Zeit >440 ms bei M\u00e4nnern und >460 ms bei Frauen gilt als verl\u00e4ngert. Ab QTc >500 ms besteht ein deutlich erh\u00f6htes Risiko f\u00fcr Torsade-de-Pointes-Tachykardien. Die Patientin hat mit 510 ms ein hohes Risiko und ben\u00f6tigt eine besonders sorgf\u00e4ltige an\u00e4sthesiologische Planung.',
      },
      {
        question:
          'Welche Medikamente m\u00fcssen bei LQTS perioperativ strikt vermieden werden?',
        options: [
          'Propofol und Remifentanil',
          'Sevofluran, Ondansetron, Droperidol und Sugammadex',
          'Ondansetron, Droperidol, Haloperidol und Sevofluran',
          'Rocuronium, Fentanyl und Midazolam',
        ],
        correctIndex: 2,
        explanation:
          'Bei LQTS m\u00fcssen alle QT-verl\u00e4ngernden Medikamente vermieden werden. Dazu z\u00e4hlen: Ondansetron (5-HT3-Antagonist), Droperidol, Haloperidol (Neuroleptika), Sevofluran (in hohen Konzentrationen), sowie bestimmte Antibiotika (Makrolide, Fluorchinolone). Propofol, Remifentanil, Rocuronium und Desfluran gelten als sicher. Sugammadex ist bei LQTS nicht kontraindiziert.',
      },
      {
        question:
          'Welche besonderen Ma\u00dfnahmen sind bei der Narkosef\u00fchrung dieser Patientin zu beachten?',
        options: [
          'Standard-Allgemeinan\u00e4sthesie ohne besondere Vorkehrungen',
          'Betablocker perioperativ pausieren, um Bradykardie zu vermeiden',
          'ICD pr\u00e4operativ durch Kardiotechniker umprogrammieren, Betablocker fortf\u00fchren, Magnesium-Spiegel optimieren, Defibrillator-Pads anlegen',
          'Nur Spinalanaesthesie m\u00f6glich, Allgemeinan\u00e4sthesie ist kontraindiziert',
        ],
        correctIndex: 2,
        explanation:
          'Der ICD muss pr\u00e4operativ umprogrammiert werden (Deaktivierung der Tachykardie-Detektion wegen Elektrokauter-Interferenz), daher externe Defibrillator-Pads obligat. Betablocker m\u00fcssen perioperativ fortgef\u00fchrt werden (Schutzeffekt bei LQTS1). Magnesium-Spiegel sollte im hochnormalen Bereich gehalten werden (>0,9 mmol/l). Hypothermie, Hypokali\u00e4mie und ad\u00e4quate Analgesie sind essenziell.',
      },
    ],
    zusammenfassung:
      'Bei kongenitalem LQTS ist die perioperative Vermeidung QT-verl\u00e4ngernder Medikamente essenziell. Der Betablocker muss fortgef\u00fchrt, der ICD perioperativ umprogrammiert und externe Defibrillation bereitgestellt werden. Elektrolyte (Kalium, Magnesium) m\u00fcssen im hochnormalen Bereich gehalten werden.',
    leitlinienReferenz: 'ESC Guidelines Ventricular Arrhythmias 2022, HRS/EHRA Expert Consensus on LQTS',
  },

  // --- Fall 4: STEMI-Befund in der Praemedikation ---
  {
    id: 'prae-04-stemi-praemed',
    title: 'STEMI-Befund in der Pr\u00e4medikation',
    category: 'praeoperativ',
    difficulty: 3,
    scenario: `<p>Ein 72-j\u00e4hriger Patient wird am Vortag einer geplanten transurethralen Prostataresektion (TUR-P) zur Pr\u00e4medikation vorgestellt. Der Patient berichtet \u00fcber seit dem Morgen bestehende retrosternale Dr\u00fcckgef\u00fchle mit Ausstrahlung in den linken Arm, die er auf Muskelkater zur\u00fcckf\u00fchrt.</p>
<p>Das Ruhe-EKG zeigt ST-Streckenhebungen \u00fcber 2 mm in den Ableitungen V1\u2013V4 mit reziproken ST-Senkungen in II, III und aVF. Troponin I ist mit 2,8 ng/ml (Normwert <0,04 ng/ml) hochpositiv. Der Patient ist h\u00e4modynamisch stabil, klagt aber \u00fcber anhaltende Brustschmerzen (NRS 6/10).</p>
<p>Vorangegangene EKGs (Vor-OP vor 3 Monaten) zeigten unauff\u00e4llige ST-Strecken.</p>`,
    patientInfo: {
      age: 72,
      gender: 'M',
      weight: 88,
      height: 175,
      vorerkrankungen: [
        'Koronare Herzkrankheit (Z.n. Stent-Implantation LAD vor 5 Jahren)',
        'Arterielle Hypertonie',
        'Hyperlipid\u00e4mie',
        'Benigne Prostatahyperplasie',
        'Diabetes mellitus Typ 2',
      ],
      medikamente: [
        'ASS 100 mg 1-0-0',
        'Atorvastatin 40 mg 0-0-1',
        'Metoprolol 47,5 mg 1-0-0',
        'Ramipril 5 mg 1-0-0',
        'Tamsulosin 0,4 mg 0-0-1',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '92/min',
      rr: '148/88 mmHg',
      spo2: '95%',
    },
    ekgPattern: 'stemi_anterior',
    questions: [
      {
        question: 'Welche EKG-Diagnose liegt vor?',
        options: [
          'Perikarditis mit diffusen ST-Hebungen',
          'Akuter anteriorer STEMI (Vorderwandinfarkt)',
          'Brugada-Syndrom Typ 1',
          'Linksventrikul\u00e4re Hypertrophie mit Strain-Muster',
        ],
        correctIndex: 1,
        explanation:
          'Konvexbogige ST-Hebungen \u22652 mm in V1\u2013V4 mit reziproken ST-Senkungen in den inferioren Ableitungen und hochpositivem Troponin sind diagnostisch f\u00fcr einen akuten anterioren STEMI. Das Verteilungsmuster deutet auf einen Verschluss der LAD (Ramus interventricularis anterior) hin. Perikarditis zeigt konkave ST-Hebungen ohne reziproke Senkungen.',
      },
      {
        question:
          'Welche Sofortma\u00dfnahme hat in dieser Situation h\u00f6chste Priorit\u00e4t?',
        options: [
          'OP absagen und Patienten auf Normalstation mit Telemetrie \u00fcberwachen',
          'OP absagen, kardiologisches Konsil mit Indikation zur notfallm\u00e4\u00dfigen Herzkatheteruntersuchung (PCI innerhalb 120 min)',
          'OP verschieben auf morgen und Troponin-Kontrolle in 6 Stunden',
          'OP wie geplant durchf\u00fchren und postoperativ kardiologisches Konsil',
        ],
        correctIndex: 1,
        explanation:
          'Bei STEMI ist die notfallm\u00e4\u00dfige perkutane Koronarintervention (PCI) die Therapie der Wahl. Die Door-to-Balloon-Zeit soll <90 min (max. 120 min) betragen (ESC STEMI-Leitlinie 2023). Der elektive Eingriff muss sofort abgesagt und die Herzkatheter-Bereitschaft alarmiert werden. Jede Verz\u00f6gerung erh\u00f6ht die Mortalit\u00e4t.',
      },
      {
        question:
          'Welche medikament\u00f6se Akuttherapie ist bei STEMI indiziert, bis der Katheter-Platz verf\u00fcgbar ist?',
        options: [
          'Heparin 5000 IE i.v., ASS 250\u2013500 mg i.v., Ticagrelor 180 mg p.o. (Loading), Morphin bei Schmerzen, Sauerstoff nur bei SpO2 <90%',
          'Nur Nitroglycerin-Spray und abwarten',
          'Thrombolyse mit Alteplase sofort beginnen',
          'Betablocker-Bolus i.v. und Magnesium 2 g i.v.',
        ],
        correctIndex: 0,
        explanation:
          'Die Akuttherapie bei STEMI umfasst: unfraktioniertes Heparin (UFH) 5000 IE i.v. als Bolus, ASS 250\u2013500 mg i.v. (Loading), P2Y12-Inhibitor (Ticagrelor 180 mg oder Prasugrel 60 mg p.o. Loading) und Morphin bei Schmerzen (ESC STEMI 2023). Sauerstoff nur bei SpO2 <90%. Nitroglycerin kann bei Hypertonie/Schmerzen erg\u00e4nzt werden. Thrombolyse nur, wenn PCI nicht innerhalb von 120 min verf\u00fcgbar.',
      },
      {
        question:
          'Wann darf die urspr\u00fcnglich geplante TUR-P fr\u00fchestens durchgef\u00fchrt werden?',
        options: [
          'Nach 2 Wochen unter dualer Thrombozytenaggregationshemmung (DAPT)',
          'Fr\u00fchestens nach 6 Monaten nach STEMI mit Stentimplantation',
          'Fr\u00fchestens nach 3 Monaten, aber Abw\u00e4gung OP-Dringlichkeit gegen Blutungsrisiko unter DAPT',
          'Sofort nach erfolgreicher PCI am n\u00e4chsten Tag',
        ],
        correctIndex: 2,
        explanation:
          'Nach akutem Koronarsyndrom mit Stentimplantation sollten elektive nicht-kardiale Eingriffe idealerweise 6 Monate verschoben werden. Bei dringlichen Eingriffen kann nach individueller Risiko-Nutzen-Abw\u00e4gung ein Eingriff fr\u00fchestens nach 3 Monaten unter fortgef\u00fchrter DAPT oder mit Bridging-Strategie erw\u00e4gt werden (ESC/ESA Leitlinie nicht-kardiale Chirurgie 2022).',
      },
    ],
    zusammenfassung:
      'Ein in der Pr\u00e4medikation entdeckter STEMI erfordert die sofortige Absage des elektiven Eingriffs und die notfallm\u00e4\u00dfige Herzkatheteruntersuchung. Die Door-to-Balloon-Zeit soll <120 min betragen. Elektive Eingriffe sollten nach Stentimplantation idealerweise 6 Monate verschoben werden.',
    leitlinienReferenz: 'ESC Guidelines STEMI 2023, ESC/ESA Guidelines Non-cardiac Surgery 2022',
  },

  // ==========================================================================
  // INTRAOPERATIV (4 Faelle)
  // ==========================================================================

  // --- Fall 5: Bradykardie nach Neostigmin ---
  {
    id: 'intra-05-bradykardie-neostigmin',
    title: 'Bradykardie nach Neostigmin',
    category: 'intraoperativ',
    difficulty: 1,
    scenario: `<p>Ein 55-j\u00e4hriger Patient wird nach einer unkomplizierten laparoskopischen Leistenbruch-OP (Dauer 75 min) unter Allgemeinan\u00e4sthesie ausgeleitet. Relaxometrie (TOF) zeigt ein TOF-Ratio von 0,7. Zur Antagonisierung der Restrelaxierung wird Neostigmin 2,5 mg i.v. zusammen mit Atropin 0,5 mg i.v. verabreicht.</p>
<p>Etwa 3 Minuten nach der Neostigmin-Gabe f\u00e4llt die Herzfrequenz auf dem Monitor abrupt von 75/min auf 35/min ab. Der Blutdruck sinkt auf 82/50 mmHg. Der Patient ist noch intubiert und beatmet, das EKG zeigt eine Sinusbradykardie ohne AV-Block. Die Pupillen sind eng (Miosis).</p>
<p>Der Monitor zeigt eine regul\u00e4re, aber deutlich verlangsamte Herzaktion. Die SpO\u2082 betr\u00e4gt 99% unter Beatmung.</p>`,
    patientInfo: {
      age: 55,
      gender: 'M',
      weight: 80,
      height: 176,
      vorerkrankungen: [
        'Leistenhernie links',
        'Leichte arterielle Hypertonie',
      ],
      medikamente: [
        'Candesartan 8 mg 1-0-0',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '35/min',
      rr: '82/50 mmHg',
      spo2: '99%',
      etco2: '38 mmHg',
    },
    ekgPattern: 'sinus_bradycardia',
    questions: [
      {
        question:
          'Was ist die wahrscheinlichste Ursache der akuten Bradykardie?',
        options: [
          'Akuter Myokardinfarkt',
          '\u00dcberschie\u00dfende cholinerge Wirkung von Neostigmin (Acetylcholinesterase-Hemmung) bei zu niedriger Atropin-Dosis',
          'Spinaler Schock durch Periduralkatheter',
          'Maligne Hyperthermie',
        ],
        correctIndex: 1,
        explanation:
          'Neostigmin hemmt die Acetylcholinesterase, was zu einer \u00fcberschie\u00dfenden parasympathischen (cholinergen) Stimulation f\u00fchrt. Muskarinische Effekte umfassen Bradykardie, Miosis, Bronchospasmus und Hypersalivation. Die standardm\u00e4\u00dfige Atropin-Dosis (0,5 mg auf 2,5 mg Neostigmin) kann gelegentlich unzureichend sein, insbesondere wenn der Vagotonus des Patienten erh\u00f6ht ist.',
      },
      {
        question:
          'Welche Therapie ist sofort indiziert?',
        options: [
          'Adrenalin 1 mg i.v. als Reanimationsdosis',
          'Atropin 0,5\u20131,0 mg i.v., bei Bedarf Wiederholung bis max. 3 mg Gesamtdosis',
          'Orciprenalin 0,25 mg i.v.',
          'Sofortige transkutane Schrittmacherstimulation',
        ],
        correctIndex: 1,
        explanation:
          'Atropin 0,5 mg i.v. ist die Erstlinientherapie bei symptomatischer Bradykardie (ERC 2021). Die Dosis kann alle 3\u20135 Minuten wiederholt werden, maximale Gesamtdosis 3 mg. Bei der Neostigmin-induzierten Bradykardie wird der muskarinische Effekt durch Atropin kompetitiv antagonisiert. Erst bei Therapieversagen kommen Alternativen wie Adrenalin-Perfusor (2\u201310 \u03bcg/min) oder transkutanes Pacing in Betracht.',
      },
      {
        question:
          'Welche Alternative zu Neostigmin h\u00e4tte das Risiko einer Bradykardie vermieden?',
        options: [
          'Pyridostigmin statt Neostigmin',
          'Edrophonium statt Neostigmin',
          'Sugammadex (bei Rocuronium/Vecuronium-Relaxierung)',
          'H\u00f6here Neostigmin-Dosis mit gleicher Atropin-Menge',
        ],
        correctIndex: 2,
        explanation:
          'Sugammadex bindet Rocuronium bzw. Vecuronium direkt und hat keinen Einfluss auf den Parasympathikus. Daher treten keine cholinergen Nebenwirkungen (Bradykardie, Bronchospasmus, Hypersalivation) auf. Dosis: 2 mg/kg KG bei TOF \u22652 Reize, 4 mg/kg bei PTC \u22651\u20132 Reizen, 16 mg/kg bei sofortiger Aufhebung (Notfall).',
      },
    ],
    zusammenfassung:
      'Neostigmin kann trotz Atropin-Begleitgabe eine \u00fcberschie\u00dfende cholinerge Bradykardie ausl\u00f6sen. Atropin 0,5 mg i.v. (Wiederholung m\u00f6glich, max. 3 mg) ist die Erstlinientherapie. Sugammadex stellt eine cholinerge Nebenwirkungs-freie Alternative bei Rocuronium-/Vecuronium-Relaxierung dar.',
    leitlinienReferenz: 'ERC Guidelines 2021 (Bradykardie-Algorithmus)',
  },

  // --- Fall 6: VHF mit schneller Ueberleitung intraoperativ ---
  {
    id: 'intra-06-vhf-schnell',
    title: 'VHF mit schneller \u00dcberleitung',
    category: 'intraoperativ',
    difficulty: 2,
    scenario: `<p>Eine 68-j\u00e4hrige Patientin wird unter Allgemeinan\u00e4sthesie (Propofol/Remifentanil-TIVA) f\u00fcr eine Hemikolektomie rechts bei Kolonkarzinom operiert. Die OP-Dauer betr\u00e4gt bisher 90 Minuten, der bisherige Verlauf war unkompliziert.</p>
<p>Pl\u00f6tzlich zeigt der Monitor eine unregelm\u00e4\u00dfige Tachykardie mit einer Frequenz von 156/min. Die schmalkomplexigen QRS-Komplexe zeigen unregelm\u00e4\u00dfige RR-Intervalle, P-Wellen sind nicht abgrenzbar. Der Blutdruck f\u00e4llt von 120/70 auf 88/52 mmHg.</p>
<p>Die Narkosetiefe ist ad\u00e4quat (BIS 45), die Temperatur betr\u00e4gt 35,8\u00b0C, das Kalium liegt bei 3,2 mmol/l (Norm 3,5\u20135,0). Der gesch\u00e4tzte Blutverlust betr\u00e4gt bisher 400 ml.</p>`,
    patientInfo: {
      age: 68,
      gender: 'W',
      weight: 75,
      height: 167,
      vorerkrankungen: [
        'Kolonkarzinom (Hemikolektomie geplant)',
        'Arterielle Hypertonie',
        'COPD GOLD II',
        'Kein bekanntes Vorhofflimmern in der Vorgeschichte',
      ],
      medikamente: [
        'Bisoprolol 2,5 mg 1-0-0',
        'Lisinopril 10 mg 1-0-0',
        'Tiotropium 18 \u03bcg 1-0-0 inhalativ',
      ],
      allergie: ['Kontrastmittel (Jod)'],
    },
    vitalparameter: {
      hf: '156/min (arrhythmisch)',
      rr: '88/52 mmHg',
      spo2: '94%',
      etco2: '32 mmHg',
      temperatur: '35,8 \u00b0C',
    },
    ekgPattern: 'afib',
    questions: [
      {
        question:
          'Welche Rhythmusst\u00f6rung liegt am wahrscheinlichsten vor?',
        options: [
          'Sinustachykardie',
          'Vorhofflattern mit variabler \u00dcberleitung',
          'Tachyarrhythmia absoluta bei neu aufgetretenem Vorhofflimmern',
          'AV-Knoten-Reentry-Tachykardie (AVNRT)',
        ],
        correctIndex: 2,
        explanation:
          'Unregelm\u00e4\u00dfige schmalkomplexige Tachykardie ohne erkennbare P-Wellen mit unregelm\u00e4\u00dfigen RR-Intervallen ist typisch f\u00fcr Vorhofflimmern. Die Frequenz >100/min klassifiziert dies als Tachyarrhythmia absoluta. AVNRT ist regelm\u00e4\u00dfig, Vorhofflattern h\u00e4tte S\u00e4gezahn-Flatterwellen. Die Hypokali\u00e4mie (3,2 mmol/l) ist ein bekannter Trigger.',
      },
      {
        question:
          'Welche medikament\u00f6se Therapie ist bei intraoperativem VHF mit h\u00e4modynamischer Instabilit\u00e4t Mittel der Wahl?',
        options: [
          'Verapamil 5 mg i.v. langsam',
          'Amiodaron 300 mg i.v. \u00fcber 20\u201360 min, gefolgt von 900 mg \u00fcber 24 h',
          'Adenosin 6 mg i.v. als Bolus',
          'Flecainid 2 mg/kg i.v. \u00fcber 10 min',
        ],
        correctIndex: 1,
        explanation:
          'Amiodaron ist bei intraoperativem VHF mit h\u00e4modynamischer Kompromittierung das Medikament der Wahl, da es sowohl frequenz- als auch rhythmuskontrollierend wirkt und eine geringe negativ-inotrope Wirkung hat. Dosis: 300 mg i.v. \u00fcber 20\u201360 min (Loading), dann 900 mg \u00fcber 24 h. Verapamil ist bei Hypotension kontraindiziert (negativ inotrop). Bei schwerer h\u00e4modynamischer Instabilit\u00e4t: elektrische Kardioversion (biphasisch 120\u2013200 J).',
      },
      {
        question:
          'Welche Begleitma\u00dfnahme ist bei diesem Kaliumwert dringend erforderlich?',
        options: [
          'Keine, Kalium 3,2 mmol/l ist im Normbereich',
          'Orale Kaliumsubstitution postoperativ',
          'Intravenöse Kaliumsubstitution auf Zielwert >4,0 mmol/l (z. B. 20\u201340 mmol KCl \u00fcber Perfusor)',
          'Kalziumgluconat als Kardioprotektivum',
        ],
        correctIndex: 2,
        explanation:
          'Hypokali\u00e4mie (<3,5 mmol/l) ist ein h\u00e4ufiger Trigger f\u00fcr Vorhofflimmern und erh\u00f6ht die Arrhythmieneigung. Perioperativ sollte der Kaliumspiegel bei Rhythmusst\u00f6rungen z\u00fcgig auf >4,0 mmol/l angehoben werden (max. 20 mmol/h \u00fcber zentralen Zugang mit Monitoring). Auch der Magnesiumspiegel sollte kontrolliert und ggf. substituiert werden (Ziel >0,9 mmol/l).',
      },
    ],
    zusammenfassung:
      'Intraoperatives Vorhofflimmern ist h\u00e4ufig durch Elektrolytst\u00f6rungen (Hypokali\u00e4mie), Hypothermie oder chirurgischen Stress getriggert. Amiodaron 300 mg i.v. ist das Medikament der Wahl bei h\u00e4modynamischer Instabilit\u00e4t. Kalium- und Magnesiumsubstitution sind essenzielle Begleitma\u00dfnahmen.',
    leitlinienReferenz: 'ESC Guidelines Atrial Fibrillation 2020, ERC Guidelines 2021',
  },

  // --- Fall 7: Ventrikulaere Tachykardie unter Narkose ---
  {
    id: 'intra-07-vt-narkose',
    title: 'Ventrikul\u00e4re Tachykardie unter Narkose',
    category: 'intraoperativ',
    difficulty: 3,
    scenario: `<p>Ein 60-j\u00e4hriger Patient wird unter Allgemeinan\u00e4sthesie f\u00fcr eine elektive koronare Bypass-Operation (CABG) vorbereitet. Nach Median-Sternotomie und vor Anschluss an die Herz-Lungen-Maschine zeigt der Monitor pl\u00f6tzlich eine regelm\u00e4\u00dfige Breitkomplextachykardie mit einer Frequenz von 185/min. Die QRS-Komplexe sind auf 160 ms verbreitert.</p>
<p>Der arterielle Mitteldruck f\u00e4llt auf 52 mmHg. Das EKG zeigt eine monomorphe ventrikul\u00e4re Tachykardie mit AV-Dissoziation: P-Wellen sind vereinzelt erkennbar, stehen aber in keinem festen Verh\u00e4ltnis zu den QRS-Komplexen. Capture-Beats oder Fusionsschl\u00e4ge sind nicht sicher abgrenzbar.</p>
<p>Der Patient hat eine bekannte isch\u00e4mische Kardiomyopathie mit einer EF von 35% und einen Z.n. Vorderwandinfarkt vor 2 Jahren.</p>`,
    patientInfo: {
      age: 60,
      gender: 'M',
      weight: 92,
      height: 180,
      vorerkrankungen: [
        'Koronare 3-Gef\u00e4\u00df-Erkrankung',
        'Z.n. Vorderwandinfarkt (vor 2 Jahren)',
        'Isch\u00e4mische Kardiomyopathie (EF 35%)',
        'Arterielle Hypertonie',
        'Diabetes mellitus Typ 2',
      ],
      medikamente: [
        'ASS 100 mg 1-0-0',
        'Clopidogrel 75 mg 1-0-0',
        'Bisoprolol 5 mg 1-0-0',
        'Ramipril 5 mg 1-0-0',
        'Atorvastatin 80 mg 0-0-1',
        'Metformin 1000 mg 1-0-1',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '185/min (regelm\u00e4\u00dfig)',
      rr: '72/38 mmHg (arteriell invasiv)',
      spo2: '91%',
      etco2: '28 mmHg',
    },
    ekgPattern: 'vt',
    questions: [
      {
        question:
          'Welches EKG-Kriterium spricht am st\u00e4rksten f\u00fcr eine ventrikul\u00e4re Tachykardie (VT) und gegen eine supraventrikul\u00e4re Tachykardie (SVT) mit Aberration?',
        options: [
          'Schmale QRS-Komplexe <120 ms',
          'AV-Dissoziation mit unabh\u00e4ngigen P-Wellen',
          'Regelm\u00e4\u00dfiger Rhythmus',
          'Frequenz >150/min',
        ],
        correctIndex: 1,
        explanation:
          'AV-Dissoziation ist das spezifischste Kriterium f\u00fcr eine VT (nahezu 100% Spezifit\u00e4t). Wenn P-Wellen unabh\u00e4ngig von QRS-Komplexen auftreten, beweist dies, dass der Rhythmus nicht vom AV-Knoten abh\u00e4ngig ist. Weitere VT-Kriterien nach Brugada-Algorithmus: RS-Intervall >100 ms, konkordante Brustwandableitungen, fehlende RS-Komplexe in Brustwandableitungen.',
      },
      {
        question:
          'Welche medikament\u00f6se Therapie ist bei h\u00e4modynamisch wirksamer monomorpher VT unter Narkose indiziert?',
        options: [
          'Adenosin 6 mg i.v. schnell als Bolus',
          'Amiodaron 300 mg i.v. \u00fcber 20\u201360 min; bei pulsloser VT: 300 mg als Bolus',
          'Verapamil 5 mg i.v. langsam',
          'Lidocain 100 mg i.v. als einzige Therapieoption',
        ],
        correctIndex: 1,
        explanation:
          'Amiodaron ist das Antiarrhythmikum der Wahl bei VT. Bei h\u00e4modynamisch tolerierter VT: 300 mg i.v. \u00fcber 20\u201360 min, gefolgt von 900 mg/24 h. Bei pulsloser VT: 300 mg i.v. als Bolus (ERC 2021). Verapamil ist bei VT kontraindiziert (kann zum Kreislaufkollaps f\u00fchren). Adenosin kann diagnostisch eingesetzt werden, terminiert aber keine VT.',
      },
      {
        question:
          'Wann ist eine sofortige elektrische Kardioversion/Defibrillation bei VT indiziert?',
        options: [
          'Nur bei pulsloser VT/Kammerflimmern',
          'Bei h\u00e4modynamisch instabiler VT (RR <90 mmHg systolisch, Bewusstseinstr\u00fcbung, Lungenodem) oder pulsloser VT',
          'Erst nach Versagen von drei Antiarrhythmika',
          'Elektrische Kardioversion ist bei VT generell kontraindiziert',
        ],
        correctIndex: 1,
        explanation:
          'Bei h\u00e4modynamisch instabiler VT (Hypotension, Bewusstseinstr\u00fcbung, Brustschmerz, Herzinsuffizienz) ist die synchronisierte Kardioversion indiziert (biphasisch 120\u2013150 J). Bei pulsloser VT wird unsynchronisiert defibrilliert (biphasisch 150\u2013200 J) gem\u00e4\u00df ALS-Algorithmus. Intraoperativ ist bei diesem Patienten mit MAP 52 mmHg die sofortige Kardioversion indiziert.',
      },
    ],
    zusammenfassung:
      'Eine Breitkomplextachykardie bei struktureller Herzerkrankung ist bis zum Beweis des Gegenteils eine ventrikul\u00e4re Tachykardie. AV-Dissoziation ist das spezifischste Diagnosekriterium. Amiodaron 300 mg i.v. ist das Medikament der Wahl; bei h\u00e4modynamischer Instabilit\u00e4t sofortige synchronisierte Kardioversion.',
    leitlinienReferenz: 'ERC Guidelines 2021, ESC Guidelines Ventricular Arrhythmias 2022',
  },

  // --- Fall 8: Hyperkaliämie nach Succinylcholin ---
  {
    id: 'intra-08-hyperk-succi',
    title: 'Hyperkali\u00e4mie nach Succinylcholin',
    category: 'intraoperativ',
    difficulty: 2,
    scenario: `<p>Ein 45-j\u00e4hriger Patient mit ausgedehnten Verbrennungen (40% KOF, 3. Tag nach Trauma) wird f\u00fcr ein Verbrennungsdebridement in den OP gebracht. Aufgrund der erwarteten schwierigen Atemwegssicherung wird eine Rapid Sequence Induction (RSI) mit Propofol und Succinylcholin (1,5 mg/kg) durchgef\u00fchrt.</p>
<p>Etwa 5 Minuten nach Succinylcholin-Gabe zeigt der Monitor progressive EKG-Ver\u00e4nderungen: zun\u00e4chst zeltf\u00f6rmig spitze, hohe T-Wellen, dann Verbreiterung des QRS-Komplexes auf 180 ms. Die Herzfrequenz sinkt auf 45/min. Der Blutdruck f\u00e4llt auf 68/40 mmHg.</p>
<p>Eine sofortige Blutgasanalyse zeigt ein Kalium von 7,8 mmol/l (Normbereich 3,5\u20135,0 mmol/l). Der pr\u00e4operative Kaliumwert lag bei 5,1 mmol/l.</p>`,
    patientInfo: {
      age: 45,
      gender: 'M',
      weight: 85,
      height: 180,
      vorerkrankungen: [
        'Schwere Verbrennungen 40% KOF (3. Tag)',
        'Inhalationstrauma',
        'Akute Nierenfunktionseinschr\u00e4nkung (Krea 1,8 mg/dl)',
      ],
      medikamente: [
        'Sufentanil-Perfusor',
        'Kristalloide Volumentherapie',
        'Meropenem 1 g alle 8 h i.v.',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '45/min (Bradykardie)',
      rr: '68/40 mmHg',
      spo2: '93%',
      etco2: '42 mmHg',
    },
    ekgPattern: 'hyperkalemia',
    questions: [
      {
        question:
          'Welche EKG-Ver\u00e4nderungen sind typisch f\u00fcr eine schwere Hyperkali\u00e4mie?',
        options: [
          'ST-Hebungen und pathologische Q-Zacken',
          'Spitze hohe T-Wellen, QRS-Verbreiterung, Verlust der P-Welle, Sinuswellen-Muster',
          'Delta-Wellen und kurze PQ-Zeit',
          'Tiefe S-Zacke in I, Q-Zacke in III, negative T-Welle in III (SI-QIII-Typ)',
        ],
        correctIndex: 1,
        explanation:
          'Die EKG-Ver\u00e4nderungen bei Hyperkali\u00e4mie folgen einer progredienten Sequenz: Ab ca. 6,0 mmol/l spitze, hohe T-Wellen. Ab ca. 7,0 mmol/l Verbreiterung des QRS-Komplexes und Abflachung der P-Welle. Ab ca. 8,0 mmol/l Verlust der P-Welle, Sinuswellen-Muster (Verschmelzung von QRS und T-Welle). Ohne Therapie droht Kammerflimmern oder Asystolie.',
      },
      {
        question:
          'Welche Soforttherapie hat bei akuter symptomatischer Hyperkali\u00e4mie mit EKG-Ver\u00e4nderungen h\u00f6chste Priorit\u00e4t?',
        options: [
          'Natriumbikarbonat 50 mmol i.v.',
          'Insulin 10 IE + Glukose 25 g i.v., dann Salbutamol-Inhalation',
          'Kalziumgluconat 10% 30 ml (3 Ampullen) i.v. \u00fcber 5\u201310 min zur Kardioprotektion, dann Insulin/Glukose',
          'Sofortige H\u00e4modialyse',
        ],
        correctIndex: 2,
        explanation:
          'Kalziumgluconat 10% (30 ml = ca. 6,8 mmol Kalzium) i.v. \u00fcber 5\u201310 min ist die erste Ma\u00dfnahme, da es die Kardiomyozyten sofort gegen die Hyperkali\u00e4mie-Wirkung stabilisiert (Membranstabilisierung), ohne den Kaliumspiegel zu senken. Wirkeintritt: 1\u20133 min. Dann: Insulin 10 IE + Glukose 50 ml 40% i.v. (verschiebt K+ intrazellul\u00e4r, Wirkeintritt 15\u201330 min), Salbutamol 10\u201320 mg vern. (senkt K+ um 0,5\u20131,0 mmol/l). Elimination durch H\u00e4modialyse oder Resonium.',
      },
      {
        question:
          'Warum ist Succinylcholin bei Verbrennungspatienten ab 24\u201372 h nach Trauma kontraindiziert?',
        options: [
          'Erh\u00f6htes Risiko f\u00fcr maligne Hyperthermie',
          'Massive Kaliumfreisetzung durch Upregulation extrajunktionaler Acetylcholinrezeptoren an denerviertem Muskelgewebe',
          'Verl\u00e4ngerte Wirkdauer durch Pseudocholinesterase-Mangel',
          'Allergische Kreuzreaktion mit Verbrennungstoxinen',
        ],
        correctIndex: 1,
        explanation:
          'Ab 24\u201372 h nach Verbrennungen (und bis zu 1 Jahr danach) kommt es zur Upregulation extrajunktionaler (nikotinischer) Acetylcholinrezeptoren vom fetalen Typ auf der gesamten Muskelfaser. Succinylcholin depolarisiert diese Rezeptoren und f\u00fchrt zu massiver Kaliumfreisetzung aus der Muskelzelle. Gleiche Kontraindikation besteht bei Denervierungszust\u00e4nden, Immobilit\u00e4t >72 h und Sepsis mit Myopathie.',
      },
    ],
    zusammenfassung:
      'Succinylcholin ist bei Verbrennungspatienten ab 24\u201372 h nach Trauma wegen der Gefahr der letalen Hyperkali\u00e4mie kontraindiziert. Bei Hyperkali\u00e4mie mit EKG-Ver\u00e4nderungen ist Kalziumgluconat 10% i.v. die erste Sofortma\u00dfnahme zur Kardioprotektion, gefolgt von Insulin/Glukose zur Kaliumsenkung.',
    leitlinienReferenz: 'ERC Guidelines 2021 (Elektrolytst\u00f6rungen), Miller\u2019s Anesthesia',
  },

  // ==========================================================================
  // POSTOPERATIV (4 Faelle)
  // ==========================================================================

  // --- Fall 9: Tachykardie im Aufwachraum ---
  {
    id: 'post-09-tachy-awr',
    title: 'Tachykardie im Aufwachraum',
    category: 'postoperativ',
    difficulty: 1,
    scenario: `<p>Eine 50-j\u00e4hrige Patientin wird nach totaler Thyreoidektomie bei Morbus Basedow in den Aufwachraum (AWR) \u00fcbernommen. Die OP verlief komplikationslos, die Extubation erfolgte problemlos. Thyreostatische Vorbehandlung mit Thiamazol \u00fcber 4 Wochen.</p>
<p>Im AWR f\u00e4llt eine persistierende Sinustachykardie von 130/min auf. Die Patientin ist unruhig, schwitzt stark und klagt \u00fcber Angstgef\u00fchle. Die K\u00f6rpertemperatur betr\u00e4gt 38,6\u00b0C. Der Blutdruck liegt bei 165/95 mmHg. Die Wunddr\u00e4nage zeigt bisher 20 ml serös-blutiges Sekret.</p>
<p>Das EKG zeigt eine regelm\u00e4\u00dfige Sinustachykardie mit normalen P-Wellen, normaler PQ-Zeit und schmalen QRS-Komplexen.</p>`,
    patientInfo: {
      age: 50,
      gender: 'W',
      weight: 65,
      height: 162,
      vorerkrankungen: [
        'Morbus Basedow (Hyperthyreose)',
        'Struma multinodosa',
        'Leichte arterielle Hypertonie',
      ],
      medikamente: [
        'Thiamazol 20 mg 1-1-1 (pr\u00e4operativ)',
        'Metoprolol 47,5 mg 1-0-0',
        'Kaliumiodid (Plummerung, 10 Tage pr\u00e4operativ)',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '130/min (sinusal, regelm\u00e4\u00dfig)',
      rr: '165/95 mmHg',
      spo2: '97%',
      temperatur: '38,6 \u00b0C',
    },
    ekgPattern: 'sinus_tachycardia',
    questions: [
      {
        question:
          'Welche Differentialdiagnosen der Sinustachykardie im AWR m\u00fcssen bei dieser Patientin bedacht werden?',
        options: [
          'Nur postoperativer Schmerz',
          'Thyreotoxische Krise, Nachblutung mit Volumenmangel, postoperativer Schmerz, Shivering',
          'Nur maligne Hyperthermie',
          'Lungenembolie als einzige relevante Differentialdiagnose',
        ],
        correctIndex: 1,
        explanation:
          'Nach Thyreoidektomie bei Morbus Basedow muss bei Tachykardie, Hyperthermie, Unruhe und Hypertonie an eine thyreotoxische Krise (Burch-Wartofsky-Score errechnen) gedacht werden. Weitere Differentialdiagnosen: Nachblutung mit Volumenmangel (Halsdr\u00e4nage kontrollieren!), postoperativer Schmerz, Shivering, unzureichende Betablocker-Wirkung. Die Kombination Tachykardie + Fieber + Unruhe ist bis zum Beweis des Gegenteils eine thyreotoxische Krise.',
      },
      {
        question:
          'Welche medikament\u00f6se Stufentherapie ist bei Verdacht auf thyreotoxische Krise indiziert?',
        options: [
          'Nur Paracetamol 1 g i.v. und Volumen',
          'Esmolol i.v. (Bolus 0,5 mg/kg, dann Perfusor 50\u2013200 \u00b5g/kg/min), Thiamazol 40\u201380 mg i.v., Hydrocortison 200 mg i.v., K\u00fchlung',
          'Amiodaron 300 mg i.v.',
          'Noradrenalin-Perfusor und Magnesium',
        ],
        correctIndex: 1,
        explanation:
          'Die Therapie der thyreotoxischen Krise umfasst: 1) Betablocker: Esmolol i.v. (kurze HWZ, gut steuerbar) oder Propranolol. 2) Thyreostatikum: Thiamazol 40\u201380 mg i.v. (hemmt Hormonsynthese). 3) Glukokortikoide: Hydrocortison 200\u2013300 mg i.v. (hemmt T4\u2192T3-Konversion, Nebenniereninsuffizienz-Prophylaxe). 4) K\u00fchlung (kein ASS, da Veränderung der Proteinbindung). 5) Volumentherapie und Intensivstation.',
      },
      {
        question:
          'Was ist eine gef\u00fcrchtete chirurgische Komplikation nach Thyreoidektomie, die ebenfalls Tachykardie verursachen kann?',
        options: [
          'Rekurrensparese',
          'Nachblutung mit Halsh\u00e4matom und drohender Atemwegsobstruktion',
          'Wundinfektion',
          'Hypokalz\u00e4mie durch Parathormonmangel',
        ],
        correctIndex: 1,
        explanation:
          'Eine Nachblutung nach Thyreoidektomie kann ein Halsh\u00e4matom mit Kompression von Trachea und Halsvenen verursachen. Dies f\u00fchrt zu Tachykardie (Volumenmangel, Stress), Dyspnoe und kann einen lebensbedrohlichen Atemwegsnotfall darstellen. Die Wunddr\u00e4nage und die Halsschwellung m\u00fcssen engmaschig kontrolliert werden. Bei Halsh\u00e4matom: sofortige Wunder\u00f6ffnung (Notfall!).',
      },
    ],
    zusammenfassung:
      'Postoperative Sinustachykardie nach Thyreoidektomie erfordert die rasche Differentialdiagnose zwischen thyreotoxischer Krise, Nachblutung und Schmerz. Bei Verdacht auf thyreotoxische Krise: Esmolol i.v., Thiamazol i.v. und Hydrocortison i.v. Nachblutung mit Halsh\u00e4matom ist ein chirurgischer Notfall.',
    leitlinienReferenz: 'ATA Guidelines Thyroid Storm, S2k-Leitlinie Operative Therapie benigner Schilddr\u00fcsenerkrankungen',
  },

  // --- Fall 10: Neuer Rechtsschenkelblock post-OP ---
  {
    id: 'post-10-rsb-le',
    title: 'Neuer Rechtsschenkelblock post-OP',
    category: 'postoperativ',
    difficulty: 2,
    scenario: `<p>Ein 70-j\u00e4hriger Patient befindet sich am 2. postoperativen Tag nach H\u00fcft-TEP. Er klagt \u00fcber pl\u00f6tzlich aufgetretene Dyspnoe und ein Druckgef\u00fchl in der Brust. Die Mobilisation war am Vortag erstmals erfolgt.</p>
<p>Das EKG zeigt im Vergleich zum pr\u00e4operativen Befund einen neu aufgetretenen Rechtsschenkelblock (RSB): Der QRS-Komplex ist auf 140 ms verbreitert, es zeigt sich ein rSR'-Muster in V1 und ein breites S in I und V6. Zus\u00e4tzlich finden sich ein SI-QIII-Typ und negative T-Wellen in V1\u2013V3. Die Herzfrequenz betr\u00e4gt 112/min.</p>
<p>Das pr\u00e4operative EKG zeigte schmale QRS-Komplexe ohne Schenkelblock.</p>`,
    patientInfo: {
      age: 70,
      gender: 'M',
      weight: 95,
      height: 178,
      vorerkrankungen: [
        'Coxarthrose (Z.n. H\u00fcft-TEP 2 Tage zuvor)',
        'Adipositas (BMI 30)',
        'Arterielle Hypertonie',
        'Z.n. tiefer Beinvenenthrombose vor 10 Jahren',
      ],
      medikamente: [
        'Enoxaparin 40 mg s.c. 1x t\u00e4glich (Thromboseprophylaxe)',
        'Bisoprolol 5 mg 1-0-0',
        'Amlodipin 5 mg 1-0-0',
        'Piritramid bei Bedarf',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '112/min',
      rr: '105/65 mmHg',
      spo2: '88%',
    },
    ekgPattern: 'rbbb',
    questions: [
      {
        question:
          'Welche Diagnose muss bei einem neu aufgetretenen Rechtsschenkelblock mit Dyspnoe nach orthop\u00e4dischem Eingriff prim\u00e4r ausgeschlossen werden?',
        options: [
          'Akuter Myokardinfarkt',
          'Lungenembolie',
          'Pneumothorax',
          'COPD-Exazerbation',
        ],
        correctIndex: 1,
        explanation:
          'Ein neu aufgetretener RSB in Kombination mit Tachykardie, Dyspnoe und Hypoxie nach orthop\u00e4dischem Eingriff und TVT-Anamnese ist hochverd\u00e4chtig auf eine Lungenembolie. Typische EKG-Zeichen der Rechtsherzbelastung: SI-QIII-TIII-Typ, neuer RSB, Sinustachykardie, T-Negativierungen rechtspr\u00e4kordial. Der Wells-Score ist hier hoch (Operation, TVT-Anamnese, Tachykardie, Immobilit\u00e4t).',
      },
      {
        question:
          'Welche diagnostischen Schritte sind in dieser Situation vorrangig?',
        options: [
          'D-Dimere bestimmen und bei negativem Ergebnis Lungenembolie ausschlie\u00dfen',
          'CT-Angiographie des Thorax als Goldstandard, parallel: Troponin, BNP, BGA, Echokardiographie',
          'Abdomen-Sonographie und R\u00f6ntgen-Thorax',
          'Koronarangiographie zum Ausschluss eines Myokardinfarkts',
        ],
        correctIndex: 1,
        explanation:
          'Bei hoher klinischer Wahrscheinlichkeit (Wells-Score >6) sind D-Dimere nicht aussagekr\u00e4ftig und d\u00fcrfen die Diagnostik nicht verz\u00f6gern. Die CT-Angiographie ist der Goldstandard. Parallel: Troponin und BNP (Risikostratifizierung), BGA (Hypox\u00e4mie, Hypokapnie), Echokardiographie (Rechtsherzbelastung, McConnell-Zeichen). Bei h\u00e4modynamischer Instabilit\u00e4t: bettseitige Echokardiographie und empirische Lyse.',
      },
      {
        question:
          'Welche Antikoagulation ist bei best\u00e4tigter Lungenembolie indiziert?',
        options: [
          'ASS 500 mg i.v. und Clopidogrel 300 mg p.o.',
          'Therapeutische Antikoagulation: UFH-Bolus 80 IE/kg i.v., dann Perfusor 18 IE/kg/h (Ziel-aPTT 60\u201380 s) oder DOAK nach Stabilisierung',
          'Nur Thromboseprophylaxe-Dosis beibehalten',
          'Vitamin-K-Antagonist sofort beginnen, kein Heparin notwendig',
        ],
        correctIndex: 1,
        explanation:
          'Bei akuter Lungenembolie ist die sofortige therapeutische Antikoagulation indiziert. UFH i.v. ist bevorzugt, da steuerbar (wichtig postoperativ!): Bolus 80 IE/kg, dann Perfusor 18 IE/kg/h, Ziel-aPTT 1,5\u20132,5-fach (ca. 60\u201380 s). Bei massiver LE mit h\u00e4modynamischer Instabilit\u00e4t: Systemische Thrombolyse (Alteplase 10 mg Bolus + 90 mg \u00fcber 2 h) trotz erh\u00f6htem Blutungsrisiko postoperativ (ESC Lungenembolie-Leitlinie 2019).',
      },
    ],
    zusammenfassung:
      'Ein neu aufgetretener Rechtsschenkelblock mit Tachykardie und Dyspnoe postoperativ ist hochverd\u00e4chtig auf eine Lungenembolie. CT-Angiographie ist der Goldstandard. Sofortige therapeutische Antikoagulation mit UFH i.v. ist indiziert. Bei h\u00e4modynamischer Instabilit\u00e4t muss eine systemische Thrombolyse erw\u00e4gt werden.',
    leitlinienReferenz: 'ESC Guidelines Pulmonary Embolism 2019',
  },

  // --- Fall 11: ST-Hebung im AWR ---
  {
    id: 'post-11-stemi-awr',
    title: 'ST-Hebung im AWR',
    category: 'postoperativ',
    difficulty: 3,
    scenario: `<p>Eine 64-j\u00e4hrige Patientin befindet sich 2 Stunden nach gro\u00dfer Bauch-OP (offene Sigmaresektion bei Divertikulitis, OP-Dauer 4 h) im Aufwachraum. Sie war bis vor 30 Minuten stabil. Jetzt klagt sie \u00fcber starke Brustschmerzen (NRS 8/10) mit Ausstrahlung in den Kiefer und \u00dcbelkeit.</p>
<p>Das Monitor-EKG zeigt ST-Streckenhebungen \u00fcber 2 mm in II, III und aVF mit reziproken ST-Senkungen in I und aVL. Die Herzfrequenz betr\u00e4gt 58/min (Sinusbradykardie). Es zeigt sich intermittierend ein AV-Block I\u00b0 (PQ 240 ms).</p>
<p>Ein pr\u00e4operatives EKG war bis auf eine flache T-Negativierung in III unauff\u00e4llig.</p>`,
    patientInfo: {
      age: 64,
      gender: 'W',
      weight: 78,
      height: 168,
      vorerkrankungen: [
        'Arterielle Hypertonie',
        'Diabetes mellitus Typ 2',
        'Hyperlipid\u00e4mie',
        'Adipositas (BMI 28)',
        'Komplizierte Sigmadivertikulitis',
      ],
      medikamente: [
        'Metformin 1000 mg 1-0-1',
        'Amlodipin 5 mg 1-0-0',
        'Simvastatin 20 mg 0-0-1',
        'Piritramid-PCA postoperativ',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '58/min (sinusal, AV-Block I\u00b0)',
      rr: '95/60 mmHg',
      spo2: '94%',
      temperatur: '36,2 \u00b0C',
    },
    ekgPattern: 'stemi_inferior',
    questions: [
      {
        question:
          'Welche EKG-Diagnose liegt vor und welches Koronargef\u00e4\u00df ist am wahrscheinlichsten betroffen?',
        options: [
          'Anteriorer STEMI \u2013 LAD-Verschluss',
          'Inferiorer STEMI \u2013 RCA-Verschluss (rechte Koronararterie)',
          'Lateraler STEMI \u2013 RCX-Verschluss',
          'Perikarditis mit diffusen ST-Hebungen',
        ],
        correctIndex: 1,
        explanation:
          'ST-Hebungen in II, III, aVF mit reziproken Senkungen in I und aVL sind typisch f\u00fcr einen inferioren STEMI. Die RCA versorgt in 85% der F\u00e4lle den inferioren Anteil. Die begleitende Sinusbradykardie und der AV-Block I\u00b0 sind typisch f\u00fcr einen RCA-Verschluss, da die RCA den Sinusknoten (60%) und den AV-Knoten (90%) versorgt. Zus\u00e4tzlich: Rechtsventrikul\u00e4ren Infarkt durch V3R/V4R ausschlie\u00dfen!',
      },
      {
        question:
          'Welches Labor muss sofort abgenommen werden und was ist der erwartete Befund?',
        options: [
          'CRP und Leukozyten \u2013 Entz\u00fcndungszeichen bei Perikarditis',
          'Hochsensitives Troponin (hs-TnI oder hs-TnT) \u2013 erwartet signifikant erh\u00f6ht; zus\u00e4tzlich CK, CK-MB, Kreatinin, Elektrolyte, Gerinnung',
          'Nur D-Dimere zum Ausschluss einer Lungenembolie',
          'TSH und fT3/fT4 zum Ausschluss einer thyreotoxischen Krise',
        ],
        correctIndex: 1,
        explanation:
          'Hochsensitives Troponin ist der Biomarker der Wahl bei V.a. akuten Myokardinfarkt. Bei STEMI mit typischen EKG-Ver\u00e4nderungen und Klinik darf die Reperfusionstherapie jedoch nicht auf den Troponin-Wert warten! Zus\u00e4tzlich: CK, CK-MB (Infarktgr\u00f6\u00dfe), Kreatinin (Kontrastmittel-PCI), Elektrolyte, Gerinnung (Antikoagulation), Blutbild, BGA.',
      },
      {
        question:
          'Welche initiale Therapie ist in dieser postoperativen Situation indiziert?',
        options: [
          'Notfallm\u00e4\u00dfige PCI innerhalb 120 min, ASS 250\u2013500 mg i.v., Heparin 5000 IE i.v.; P2Y12-Inhibitor nach R\u00fccksprache mit Chirurgen wegen Blutungsrisiko',
          'Nur konservative Therapie mit Heparin und Bettruhe wegen des OP-Risikos',
          'Systemische Thrombolyse mit Alteplase',
          'Abwarten und Troponin-Kontrolle in 3 Stunden',
        ],
        correctIndex: 0,
        explanation:
          'Auch postoperativ bleibt die notfallm\u00e4\u00dfige PCI die Therapie der Wahl bei STEMI (ESC STEMI 2023). ASS 250\u2013500 mg i.v. und Heparin 5000 IE i.v. werden gegeben. Die Gabe eines P2Y12-Inhibitors muss individuell gegen das chirurgische Blutungsrisiko abgewogen werden (interdisziplin\u00e4re Entscheidung). Systemische Thrombolyse ist in der fr\u00fchen postoperativen Phase (innerhalb 7 Tage nach gro\u00dfer OP) kontraindiziert!',
      },
    ],
    zusammenfassung:
      'Ein postoperativer STEMI ist ein Notfall und erfordert die emergente PCI. ST-Hebungen in II, III, aVF zeigen einen inferioren Infarkt (meist RCA). Sinusbradykardie und AV-Block I\u00b0 sind typische Begleitbefunde. Systemische Thrombolyse ist postoperativ kontraindiziert; die prim\u00e4re PCI ist der einzige Reperfusionsweg.',
    leitlinienReferenz: 'ESC Guidelines STEMI 2023',
  },

  // --- Fall 12: WPW mit schneller Ueberleitung ---
  {
    id: 'post-12-wpw-tachykardie',
    title: 'WPW mit schneller \u00dcberleitung',
    category: 'postoperativ',
    difficulty: 3,
    scenario: `<p>Ein 28-j\u00e4hriger Patient befindet sich im AWR nach unkomplizierter laparoskopischer Appendektomie. Er hat eine bekannte WPW-Diagnose (asymptomatisch, keine bisherige Ablation). Der pr\u00e4operative Befund zeigte Delta-Wellen und eine kurze PQ-Zeit von 100 ms.</p>
<p>Pl\u00f6tzlich klagt der Patient \u00fcber Herzrasen und Schwindel. Der Monitor zeigt eine unregelm\u00e4\u00dfige Breitkomplextachykardie mit einer Frequenz von 220\u2013280/min. Die QRS-Komplexe sind breit (>140 ms) und morphologisch variabel. Einzelne schmale QRS-Komplexe sind eingestreut.</p>
<p>Der Blutdruck ist mit 78/45 mmHg deutlich erniedrigt. Der Patient ist blass, kaltschwei\u00dfig und benommen, aber ansprechbar.</p>`,
    patientInfo: {
      age: 28,
      gender: 'M',
      weight: 75,
      height: 182,
      vorerkrankungen: [
        'WPW-Syndrom (bekannt seit 5 Jahren, asymptomatisch)',
        'Akute Appendizitis (Z.n. laparoskopischer Appendektomie)',
      ],
      medikamente: [],
      allergie: ['Latex'],
    },
    vitalparameter: {
      hf: '220\u2013280/min (unregelm\u00e4\u00dfig)',
      rr: '78/45 mmHg',
      spo2: '92%',
    },
    ekgPattern: 'wpw',
    questions: [
      {
        question:
          'Welche Rhythmusst\u00f6rung liegt bei diesem WPW-Patienten am wahrscheinlichsten vor?',
        options: [
          'Orthodrome AV-Reentry-Tachykardie (regelm\u00e4\u00dfig, schmal)',
          'Vorhofflimmern mit antegrader \u00dcberleitung \u00fcber die akzessorische Bahn (FBI-Tachykardie: Fast, Broad, Irregular)',
          'Ventrikul\u00e4re Tachykardie',
          'Vorhofflattern mit 1:1-\u00dcberleitung',
        ],
        correctIndex: 1,
        explanation:
          'Eine unregelm\u00e4\u00dfige Breitkomplextachykardie bei bekanntem WPW ist typisch f\u00fcr Vorhofflimmern mit antegrader \u00dcberleitung \u00fcber die akzessorische Bahn (pr\u00e4-excitiertes VHF). Die Merkregel FBI: Fast, Broad, Irregular. Die variierenden QRS-Morphologien entstehen durch unterschiedliche Anteile der \u00dcberleitung \u00fcber die akzessorische Bahn vs. AV-Knoten. Dies ist lebensgef\u00e4hrlich, da es in Kammerflimmern degenerieren kann.',
      },
      {
        question:
          'Welche Medikamente sind bei WPW mit Vorhofflimmern strikt kontraindiziert?',
        options: [
          'Amiodaron und Lidocain',
          'AV-Knoten-blockierende Medikamente: Adenosin, Verapamil, Digoxin \u2013 sie beschleunigen die \u00dcberleitung \u00fcber die akzessorische Bahn',
          'Magnesium und Kalziumgluconat',
          'Noradrenalin und Adrenalin',
        ],
        correctIndex: 1,
        explanation:
          'Adenosin, Verapamil, Diltiazem, Digoxin und Betablocker verlangsamen die Leitung im AV-Knoten, nicht jedoch in der akzessorischen Bahn. Dadurch wird die \u00dcberleitung \u00fcber die Bahn beg\u00fcnstigt, die Kammerfrequenz steigt unkontrolliert und Kammerflimmern kann ausgel\u00f6st werden. Diese Medikamente sind bei pr\u00e4-excitiertem Vorhofflimmern absolut kontraindiziert.',
      },
      {
        question:
          'Welche Therapie ist bei h\u00e4modynamisch instabilem WPW mit Vorhofflimmern indiziert?',
        options: [
          'Verapamil 5 mg i.v. langsam',
          'Sofortige synchronisierte Kardioversion (biphasisch 120\u2013200 J); medikament\u00f6s: Ajmalin 1 mg/kg i.v. langsam oder Procainamid',
          'Adenosin 6 mg i.v. schnell',
          'Amiodaron 300 mg i.v. als Bolus',
        ],
        correctIndex: 1,
        explanation:
          'Bei h\u00e4modynamischer Instabilit\u00e4t ist die sofortige synchronisierte Kardioversion (biphasisch 120\u2013200 J) die Therapie der Wahl. Medikament\u00f6s ist Ajmalin (1 mg/kg i.v. \u00fcber 5 min, max. 50 mg) in Deutschland das Mittel der Wahl, alternativ Procainamid \u2013 beide verlangsamen die Leitung in der akzessorischen Bahn. Amiodaron kann bei WPW-VHF eingesetzt werden, verlangsamt aber auch den AV-Knoten und wird kontrovers diskutiert. Die definitive Therapie ist die Katheterablation.',
      },
    ],
    zusammenfassung:
      'Vorhofflimmern bei WPW-Syndrom mit antegrader \u00dcberleitung \u00fcber die akzessorische Bahn (FBI: Fast, Broad, Irregular) ist lebensgef\u00e4hrlich. AV-Knoten-blockierende Medikamente (Adenosin, Verapamil, Digoxin) sind strikt kontraindiziert. Sofortige Kardioversion bei Instabilit\u00e4t; medikament\u00f6s Ajmalin oder Procainamid.',
    leitlinienReferenz: 'ESC Guidelines SVT 2019, ERC Guidelines 2021',
  },

  // ==========================================================================
  // NOTFALL / ACLS (4 Faelle)
  // ==========================================================================

  // --- Fall 13: Kammerflimmern im OP ---
  {
    id: 'notfall-13-vfib-op',
    title: 'Kammerflimmern im OP',
    category: 'notfall',
    difficulty: 1,
    scenario: `<p>Ein 58-j\u00e4hriger Patient wird unter Allgemeinan\u00e4sthesie f\u00fcr eine laparoskopische Cholezystektomie operiert. Er hat eine bekannte koronare Herzkrankheit mit Z.n. Stent-Implantation vor 3 Jahren. Die Narkose verl\u00e4uft bisher unauff\u00e4llig.</p>
<p>W\u00e4hrend der chirurgischen Pr\u00e4paration zeigt der Monitor pl\u00f6tzlich ein chaotisches, hochfrequentes Flimmermuster ohne erkennbare QRS-Komplexe oder P-Wellen. Die Pulsoxymetrie-Kurve zeigt keine Pulsation mehr, der arterielle Blutdruck ist nicht messbar, der etCO\u2082 f\u00e4llt abrupt auf 12 mmHg ab.</p>
<p>Die Beatmung funktioniert, der Tubus liegt korrekt. Die letzte BGA vor 20 Minuten war unauff\u00e4llig.</p>`,
    patientInfo: {
      age: 58,
      gender: 'M',
      weight: 90,
      height: 176,
      vorerkrankungen: [
        'KHK (Z.n. Stent LAD vor 3 Jahren)',
        'Arterielle Hypertonie',
        'Hyperlipid\u00e4mie',
        'Symptomatische Cholezystolithiasis',
      ],
      medikamente: [
        'ASS 100 mg 1-0-0',
        'Bisoprolol 5 mg 1-0-0',
        'Atorvastatin 40 mg 0-0-1',
        'Ramipril 5 mg 1-0-0',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: 'Kein Puls tastbar (VF am Monitor)',
      rr: 'Nicht messbar',
      spo2: 'Kein Signal',
      etco2: '12 mmHg (abrupt gefallen)',
    },
    ekgPattern: 'vfib',
    questions: [
      {
        question:
          'Welche Sofortma\u00dfnahme hat bei Kammerflimmern im OP die h\u00f6chste Priorit\u00e4t?',
        options: [
          'Adrenalin 1 mg i.v. sofort',
          'Sofortige Defibrillation, biphasisch 150\u2013200 J (keine Verz\u00f6gerung durch Medikamentengabe)',
          'Thoraxkompressionen f\u00fcr 2 Minuten vor dem ersten Schock',
          'Amiodaron 300 mg i.v. vor der Defibrillation',
        ],
        correctIndex: 1,
        explanation:
          'Bei beobachtetem Kammerflimmern (monitored VF) im OP ist die sofortige Defibrillation die wichtigste Ma\u00dfnahme. Jede Sekunde Verz\u00f6gerung reduziert die Erfolgsrate. Biphasisch: 150\u2013200 J (ger\u00e4tespezifisch). Der Defibrillator sollte im OP immer griffbereit sein. Thoraxkompressionen beginnen sofort nach dem Schock, w\u00e4hrend 2-Minuten-CPR-Zyklus. Der OP-Tisch bietet eine harte Unterlage (ERC 2021).',
      },
      {
        question:
          'Wann wird Adrenalin im ALS-Algorithmus bei Kammerflimmern erstmals gegeben?',
        options: [
          'Sofort vor dem ersten Schock',
          'Nach dem 1. erfolglosen Schock',
          'Nach dem 3. erfolglosen Schock (zusammen mit Amiodaron 300 mg i.v.)',
          'Erst nach 10 Minuten Reanimation',
        ],
        correctIndex: 2,
        explanation:
          'Im ERC-ALS-Algorithmus 2021 wird bei schockbarem Rhythmus (VF/pVT) Adrenalin 1 mg i.v. erstmals nach dem 3. erfolglosen Schock gegeben, dann alle 3\u20135 Minuten. Gleichzeitig wird Amiodaron 300 mg i.v. als Bolus verabreicht. Nach dem 5. Schock kann Amiodaron 150 mg i.v. wiederholt werden. Adrenalin wird vor dem ersten Schock nicht gegeben, da die Defibrillation Priorit\u00e4t hat.',
      },
      {
        question:
          'Welche Energiestufe wird bei der biphasischen Defibrillation empfohlen und wie wird der CPR-Zyklus organisiert?',
        options: [
          'Monophasisch 360 J, dann 5 Minuten CPR',
          'Biphasisch 150\u2013200 J (1. Schock), dann sofort 2 Minuten CPR (30:2 oder kontinuierlich bei gesichertem Atemweg), Rhythmuskontrolle alle 2 Minuten',
          'Biphasisch 50 J, Steigerung um 50 J pro Schock',
          'Biphasisch 360 J, dann 30 Sekunden Pause zur Rhythmusanalyse',
        ],
        correctIndex: 1,
        explanation:
          'Biphasische Defibrillation: 150\u2013200 J (ger\u00e4tespezifisch, bei Unsicherheit: h\u00f6chste verf\u00fcgbare Energie). Nach jedem Schock sofort 2 Minuten CPR ohne Rhythmuskontrolle (bei gesichertem Atemweg: kontinuierliche Thoraxkompressionen 100\u2013120/min). Rhythmusanalyse alle 2 Minuten. Qualit\u00e4t der CPR: Drucktiefe 5\u20136 cm, vollst\u00e4ndige Entlastung, minimale Unterbrechungen (ERC 2021).',
      },
    ],
    zusammenfassung:
      'Kammerflimmern im OP erfordert die sofortige Defibrillation (biphasisch 150\u2013200 J). Adrenalin 1 mg i.v. und Amiodaron 300 mg i.v. werden erst nach dem 3. erfolglosen Schock gegeben. CPR-Qualit\u00e4t (Drucktiefe, Frequenz, minimale Unterbrechungen) ist entscheidend f\u00fcr das Outcome.',
    leitlinienReferenz: 'ERC Guidelines 2021 (ALS-Algorithmus)',
  },

  // --- Fall 14: PEA - Reversible Ursachen ---
  {
    id: 'notfall-14-pea-sectio',
    title: 'PEA \u2013 Reversible Ursachen',
    category: 'notfall',
    difficulty: 2,
    scenario: `<p>Eine 40-j\u00e4hrige Patientin wird per Notsectio (Sectio caesarea) wegen pathologischem CTG entbunden. Die OP erfolgt in Allgemeinan\u00e4sthesie. Das Kind wird problemlos entwickelt. W\u00e4hrend der Uterusnaht kommt es zu einer starken Blutung aus dem Plazentabett (Uterusatonie). Der gesch\u00e4tzte Blutverlust betr\u00e4gt 2500 ml innerhalb von 15 Minuten.</p>
<p>Trotz Volumentherapie (2000 ml Kristalloide, Transfusion l\u00e4uft) f\u00e4llt die Patientin pl\u00f6tzlich in einen Kreislaufstillstand. Der Monitor zeigt eine pulslose elektrische Aktivit\u00e4t (PEA): Es sind regelm\u00e4\u00dfige, schmalkomplexige QRS-Komplexe mit einer Frequenz von 110/min sichtbar, aber kein Puls tastbar und kein arterieller Blutdruck messbar.</p>
<p>Die letzte BGA zeigt: Hb 5,2 g/dl, pH 7,12, Laktat 8,4 mmol/l, Kalium 4,8 mmol/l.</p>`,
    patientInfo: {
      age: 40,
      gender: 'W',
      weight: 85,
      height: 170,
      vorerkrankungen: [
        'Gestationsdiabetes',
        'Pl\u00e4zenta praevia marginalis',
        'III-Gravida, II-Para',
      ],
      medikamente: [
        'Insulin (Gestationsdiabetes)',
        'Eisen-Substitution',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '110/min (PEA \u2013 Puls nicht tastbar)',
      rr: 'Nicht messbar',
      spo2: 'Kein zuverl\u00e4ssiges Signal',
      etco2: '15 mmHg',
    },
    ekgPattern: 'pea',
    questions: [
      {
        question:
          'Welche der 4H und 4T sind die wahrscheinlichsten reversiblen Ursachen f\u00fcr die PEA bei dieser Patientin?',
        options: [
          'Hypothermie und Herzbeuteltamponade',
          'Hypovolämie (h\u00e4morrhagischer Schock) und Hypox\u00e4mie',
          'Hyper-/Hypokali\u00e4mie und Thrombose (Lungenembolie)',
          'Spannungspneumothorax und Intoxikation',
        ],
        correctIndex: 1,
        explanation:
          'Die 4H sind: Hypoxie, Hypovolämie, Hyper-/Hypokali\u00e4mie, Hypothermie. Die 4T sind: Thrombose (koronar/pulmonal), Tamponade, Toxine, Spannungspneumothorax. Bei dieser Patientin ist die Hypovolämie durch den massiven Blutverlust (2500 ml, Hb 5,2 g/dl) die wahrscheinlichste Ursache. Zus\u00e4tzlich besteht eine Hypox\u00e4mie durch den h\u00e4morrhagischen Schock (metabolische Azidose, Laktat 8,4). Fruchtwasserembolie sollte differentialdiagnostisch erw\u00e4gt werden.',
      },
      {
        question:
          'Wie wird Adrenalin bei PEA im ALS-Algorithmus dosiert?',
        options: [
          'Adrenalin 0,1 mg i.v. alle 10 Minuten',
          'Adrenalin 1 mg i.v. sofort und alle 3\u20135 Minuten (bei nicht-schockbarem Rhythmus: so fr\u00fch wie m\u00f6glich)',
          'Adrenalin 1 mg i.v. erst nach 3 CPR-Zyklen',
          'Kein Adrenalin bei PEA, nur bei Asystolie',
        ],
        correctIndex: 1,
        explanation:
          'Bei PEA (nicht-schockbarer Rhythmus) wird Adrenalin 1 mg i.v. so fr\u00fch wie m\u00f6glich gegeben und alle 3\u20135 Minuten wiederholt. Im Gegensatz zu VF/pVT (Adrenalin erst nach 3. Schock) wird bei PEA/Asystolie Adrenalin im ersten CPR-Zyklus verabreicht (ERC 2021). Gleichzeitig m\u00fcssen die reversiblen Ursachen identifiziert und behandelt werden.',
      },
      {
        question:
          'Welche spezifische Therapie ist bei h\u00e4morrhagischer PEA vorrangig?',
        options: [
          'Defibrillation mit 200 J',
          'Massive Transfusion (Erythrozytenkonzentrate, FFP, Thrombozytenkonzentrate im Verh\u00e4ltnis 1:1:1), chirurgische Blutstillung, Tranexams\u00e4ure 1 g i.v.',
          'Nur Kristalloide und Vasopressoren',
          'Amiodaron 300 mg i.v. als Bolus',
        ],
        correctIndex: 1,
        explanation:
          'Bei PEA durch Hypovolämie/Blutung ist die kausale Therapie entscheidend: 1) Chirurgische Blutstillung (ggf. Hysterektomie als Ultima Ratio). 2) Massive Transfusion: EK:FFP:TK im Verh\u00e4ltnis 1:1:1 (Damage Control Resuscitation). 3) Tranexams\u00e4ure 1 g i.v. \u00fcber 10 min (WOMAN-Trial: Mortalit\u00e4tsreduktion bei postpartaler Blutung). 4) Fibrinogen-Substitution bei <1,5 g/l. Defibrillation ist bei PEA nicht indiziert. Der Kreislaufstillstand sistiert erst mit Volumenersatz und Blutstillung.',
      },
    ],
    zusammenfassung:
      'PEA bei peripartaler Blutung ist meist durch Hypovolämie verursacht. Adrenalin 1 mg i.v. wird sofort und alle 3\u20135 min gegeben. Die kausale Therapie umfasst: chirurgische Blutstillung, massive Transfusion (EK:FFP:TK 1:1:1), Tranexams\u00e4ure 1 g i.v. Defibrillation ist bei PEA nicht indiziert.',
    leitlinienReferenz: 'ERC Guidelines 2021 (ALS, Kreislaufstillstand unter besonderen Umst\u00e4nden), AWMF S2k-Leitlinie Peripartale Blutungen',
  },

  // --- Fall 15: Torsade de Pointes ---
  {
    id: 'notfall-15-torsade',
    title: 'Torsade de Pointes',
    category: 'notfall',
    difficulty: 3,
    scenario: `<p>Eine 67-j\u00e4hrige Patientin liegt auf der Intensivstation nach Sigmaresektion (3. post-OP-Tag). Sie erh\u00e4lt Amiodaron i.v. wegen postoperativem Vorhofflimmern und Ondansetron 4 mg i.v. wegen \u00dcbelkeit. Zus\u00e4tzlich l\u00e4uft eine Ciprofloxacin-Infusion.</p>
<p>Im Monitor-EKG zeigt sich zun\u00e4chst eine QTc-Verl\u00e4ngerung auf 580 ms. Dann kommt es zu einer polymorphen ventrikul\u00e4ren Tachykardie mit typischer spindelf\u00f6rmiger ("Torsade") Morphologie: Die QRS-Amplitude schwankt rhythmisch um die isoelektrische Linie, die Frequenz liegt bei 200\u2013250/min.</p>
<p>Die Episode dauert ca. 15 Sekunden, die Patientin wird kurz synkopal, dann terminiert die Tachykardie spontan. Kurz darauf tritt eine erneute Episode auf. Magnesium liegt bei 0,6 mmol/l (Norm 0,7\u20131,0), Kalium bei 3,1 mmol/l.</p>`,
    patientInfo: {
      age: 67,
      gender: 'W',
      weight: 68,
      height: 164,
      vorerkrankungen: [
        'Sigmakarzinom (Z.n. Sigmaresektion)',
        'Postoperatives Vorhofflimmern',
        'Arterielle Hypertonie',
        'Chronische Niereninsuffizienz Stadium 3 (GFR 42 ml/min)',
      ],
      medikamente: [
        'Amiodaron 900 mg/24 h Perfusor i.v.',
        'Ondansetron 4 mg i.v. bei Bedarf',
        'Ciprofloxacin 400 mg i.v. alle 12 h',
        'Pantoprazol 40 mg i.v. 1-0-0',
        'Enoxaparin 40 mg s.c. 1-0-0',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: '200\u2013250/min (w\u00e4hrend Torsade), 88/min (zwischen Episoden)',
      rr: '70/40 mmHg (w\u00e4hrend Torsade)',
      spo2: '85% (w\u00e4hrend Torsade)',
    },
    ekgPattern: 'torsade',
    questions: [
      {
        question:
          'Woran erkennt man eine Torsade de Pointes im Vergleich zu einer monomorphen ventrikul\u00e4ren Tachykardie?',
        options: [
          'Torsade hat schmale QRS-Komplexe',
          'Torsade zeigt eine typische spindelf\u00f6rmige Modulation der QRS-Amplitude um die isoelektrische Linie ("Spitzenumkehr"), tritt auf dem Boden einer verl\u00e4ngerten QT-Zeit auf',
          'Torsade hat eine niedrige Frequenz (<100/min)',
          'Torsade zeigt regelm\u00e4\u00dfige, gleichf\u00f6rmige QRS-Komplexe',
        ],
        correctIndex: 1,
        explanation:
          'Torsade de Pointes (TdP) ist eine polymorphe ventrikul\u00e4re Tachykardie auf dem Boden einer verl\u00e4ngerten QT-Zeit. Typisch ist die spindelf\u00f6rmige Modulation der QRS-Amplitude ("Spitzenumkehr" \u2013 die QRS-Achse dreht sich um die isoelektrische Linie). Im Gegensatz zur monomorphen VT (gleichf\u00f6rmige QRS) zeigt TdP wechselnde QRS-Morphologien. Die Frequenz liegt typischerweise bei 150\u2013300/min.',
      },
      {
        question:
          'Welches Medikament ist bei Torsade de Pointes die Therapie der 1. Wahl?',
        options: [
          'Amiodaron 300 mg i.v. als Bolus',
          'Magnesiumsulfat 2 g i.v. \u00fcber 10 min (unabh\u00e4ngig vom Magnesiumspiegel)',
          'Lidocain 100 mg i.v. als Bolus',
          'Verapamil 5 mg i.v. langsam',
        ],
        correctIndex: 1,
        explanation:
          'Magnesiumsulfat 2 g (= 8 mmol) i.v. \u00fcber 10 Minuten ist die Erstlinientherapie bei Torsade de Pointes, unabh\u00e4ngig vom aktuellen Magnesiumspiegel. Magnesium stabilisiert die Myokardzellmembran und verk\u00fcrzt die Repolarisation. Bei Therapieversagen: Wiederholung m\u00f6glich. Amiodaron ist kontraindiziert, da es selbst QT-verl\u00e4ngernd wirkt! Bei pulsloser TdP: sofortige Defibrillation (unsynchronisiert, wie bei VF).',
      },
      {
        question:
          'Welche zus\u00e4tzlichen Ma\u00dfnahmen sind bei rezidivierender Torsade de Pointes indiziert?',
        options: [
          'Amiodaron-Dosis erh\u00f6hen',
          'Alle QT-verl\u00e4ngernden Medikamente absetzen, Kalium auf >4,5 mmol/l anheben, ggf. Isoproterenol (Orciprenalin) oder \u00fcberstimulierendes (Overdrive-) Pacing auf 100/min',
          'Betablocker-Bolus und Hypothermie',
          'Kardioversion mit niedrigen Energien (10 J synchronisiert)',
        ],
        correctIndex: 1,
        explanation:
          'Ma\u00dfnahmen bei rezidivierender TdP: 1) Alle QT-verl\u00e4ngernden Medikamente sofort absetzen (hier: Amiodaron, Ondansetron, Ciprofloxacin!). 2) Kalium auf >4,5 mmol/l anheben. 3) Magnesium auf >1,0 mmol/l. 4) Frequenzerh\u00f6hung zur QT-Verk\u00fcrzung: Isoproterenol/Orciprenalin-Perfusor oder tempor\u00e4res Overdrive-Pacing (Frequenz 100/min). Eine h\u00f6here Herzfrequenz verk\u00fcrzt die QT-Zeit und unterdr\u00fcckt die fr\u00fchzeitigen Nachdepolarisationen, die TdP ausl\u00f6sen.',
      },
    ],
    zusammenfassung:
      'Torsade de Pointes ist eine polymorphe VT auf dem Boden einer QT-Verl\u00e4ngerung (oft iatrogen). Magnesiumsulfat 2 g i.v. ist die Erstlinientherapie. Alle QT-verl\u00e4ngernden Medikamente m\u00fcssen abgesetzt werden. Bei Rezidiv: Kaliumoptimierung, Overdrive-Pacing oder Isoproterenol zur Frequenzerh\u00f6hung.',
    leitlinienReferenz: 'ERC Guidelines 2021, ESC Guidelines Ventricular Arrhythmias 2022, AHA ACLS 2020',
  },

  // --- Fall 16: Asystolie und reversible Ursachen ---
  {
    id: 'notfall-16-asystolie-dialyse',
    title: 'Asystolie und reversible Ursachen',
    category: 'notfall',
    difficulty: 2,
    scenario: `<p>Ein 75-j\u00e4hriger Dialysepatient wird nach Verlegung von der Dialysestation auf die Normalstation bewusstlos aufgefunden. Die letzte Dialyse war vor 3 Tagen (Dialyse ausgefallen wegen Shunt-Thrombose). Der Patient hat seit 2 Tagen keine Nahrung mehr zu sich genommen und \u00fcber Schw\u00e4che und Parästhesien geklagt.</p>
<p>Bei Eintreffen des Reanimationsteams zeigt der Monitor eine Asystolie: eine flache Linie ohne erkennbare elektrische Aktivit\u00e4t. Kein Puls tastbar, keine Spontanatmung. Die CPR wird sofort begonnen.</p>
<p>Eine am Vortag abgenommene Blutgasanalyse zeigte: Kalium 7,2 mmol/l, Kreatinin 9,8 mg/dl, pH 7,18, HCO3\u207b 14 mmol/l.</p>`,
    patientInfo: {
      age: 75,
      gender: 'M',
      weight: 78,
      height: 172,
      vorerkrankungen: [
        'Terminale Niereninsuffizienz (Dialysepflicht seit 4 Jahren)',
        'Diabetes mellitus Typ 2',
        'Arterielle Hypertonie',
        'Dialyse-Shunt-Thrombose (OP geplant)',
        'KHK (Z.n. Bypass-OP vor 8 Jahren)',
      ],
      medikamente: [
        'Insulin Glargin 20 IE s.c. abends',
        'Amlodipin 10 mg 1-0-0',
        'Kalziumacetat (Phosphatbinder) 3x2 Tbl.',
        'Epo-Injektionen (Darbepoetin) alle 2 Wochen',
      ],
      allergie: [],
    },
    vitalparameter: {
      hf: 'Keine elektrische Aktivit\u00e4t (Asystolie)',
      rr: 'Nicht messbar',
      spo2: 'Kein Signal',
    },
    ekgPattern: 'asystole',
    questions: [
      {
        question:
          'Warum darf bei Asystolie keine Defibrillation durchgef\u00fchrt werden?',
        options: [
          'Defibrillation ist bei jeder Rhythmusst\u00f6rung m\u00f6glich',
          'Asystolie ist ein nicht-schockbarer Rhythmus \u2013 Defibrillation terminiert nur organisierte elektrische Aktivit\u00e4t (VF/pVT), bei fehlender Aktivit\u00e4t ist ein Schock wirkungslos und verz\u00f6gert die CPR',
          'Die Defibrillationsenergie ist zu niedrig f\u00fcr Asystolie',
          'Defibrillation ist nur bei Asystolie >10 Minuten kontraindiziert',
        ],
        correctIndex: 1,
        explanation:
          'Defibrillation wirkt, indem sie die gesamte Myokardaktivit\u00e4t kurzzeitig unterdr\u00fcckt, damit der nat\u00fcrliche Schrittmacher (Sinusknoten) die Kontrolle \u00fcbernehmen kann. Bei Asystolie fehlt jede elektrische Aktivit\u00e4t \u2013 es gibt nichts zu "resetten". Ein Schock bei Asystolie ist wirkungslos, sch\u00e4digt das Myokard und verz\u00f6gert Thoraxkompressionen (ERC 2021). Wichtig: Feines VF ausschlie\u00dfen (Ableitungswechsel, Amplitude, Artefakte pr\u00fcfen).',
      },
      {
        question:
          'Welche reversible Ursache ist bei diesem Dialyse-Patienten am wahrscheinlichsten und wie wird sie behandelt?',
        options: [
          'Spannungspneumothorax \u2013 Thoraxdrainage',
          'Hyperkali\u00e4mie \u2013 Kalziumgluconat 10% 30 ml i.v. schnell, Natriumbikarbonat 50 mmol i.v., Insulin/Glukose i.v.',
          'Hypothermie \u2013 Wiedererwärmung',
          'Lungenembolie \u2013 systemische Lyse',
        ],
        correctIndex: 1,
        explanation:
          'Die ausgefallene Dialyse bei terminaler Niereninsuffizienz f\u00fchrt zur lebensbedrohlichen Hyperkali\u00e4mie (K+ 7,2 mmol/l bereits am Vortag, aktuell wahrscheinlich h\u00f6her). Die metabolische Azidose verst\u00e4rkt die Kaliumtoxizit\u00e4t. Therapie unter Reanimation: 1) Kalziumgluconat 10% 30 ml (oder Kalziumchlorid 10% 10 ml) i.v. schnell (Kardioprotektion). 2) Natriumbikarbonat 50 mmol i.v. (Azidose-Korrektur, Kaliumshift). 3) Insulin 10 IE + Glukose 50 ml 40% i.v. 4) Notfall-H\u00e4modialyse, sobald ROSC erreicht.',
      },
      {
        question:
          'Wie ist die Adrenalin-Gabe bei Asystolie nach ERC 2021 korrekt?',
        options: [
          'Adrenalin 1 mg i.v. nach dem 3. CPR-Zyklus, dann alle 5 Minuten',
          'Adrenalin 1 mg i.v. so fr\u00fch wie m\u00f6glich (im 1. CPR-Zyklus), dann alle 3\u20135 Minuten',
          'Adrenalin 3 mg i.v. als Einmalgabe',
          'Kein Adrenalin bei Asystolie, nur Atropin 3 mg i.v.',
        ],
        correctIndex: 1,
        explanation:
          'Bei nicht-schockbarem Rhythmus (Asystolie, PEA) wird Adrenalin 1 mg i.v. so fr\u00fch wie m\u00f6glich im 1. CPR-Zyklus gegeben und dann alle 3\u20135 Minuten wiederholt (ERC 2021). Im Gegensatz dazu wird bei VF/pVT Adrenalin erst nach dem 3. Schock gegeben. Atropin wird bei Asystolie seit 2010 nicht mehr empfohlen. Der Zugangsweg ist i.v. oder intraoss\u00e4r (i.o.).',
      },
      {
        question:
          'Welche Kalziumpr\u00e4parate k\u00f6nnen unter Reanimation bei Hyperkali\u00e4mie eingesetzt werden und was ist zu beachten?',
        options: [
          'Nur Kalziumgluconat, Kalziumchlorid ist zu gef\u00e4hrlich',
          'Kalziumgluconat 10% 30 ml i.v. oder Kalziumchlorid 10% 10 ml i.v. \u2013 Kalziumchlorid liefert 3x mehr ionisiertes Kalzium, darf nicht mit Natriumbikarbonat \u00fcber denselben Zugang laufen',
          'Kalzium ist bei Reanimation generell kontraindiziert',
          'Kalziumgluconat nur oral als Tablette',
        ],
        correctIndex: 1,
        explanation:
          'Kalziumgluconat 10% (30 ml = ca. 6,8 mmol Ca\u00b2\u207a) oder Kalziumchlorid 10% (10 ml = ca. 6,8 mmol Ca\u00b2\u207a) k\u00f6nnen unter CPR eingesetzt werden. Kalziumchlorid liefert ca. 3x mehr ionisiertes Kalzium pro Ampulle und wird bei Kreislaufstillstand bevorzugt. WICHTIG: Kalzium und Natriumbikarbonat f\u00e4llen bei Kontakt aus (Kalziumkarbonat) \u2013 niemals \u00fcber denselben Zugang ohne Sp\u00fclung! Separate Lumen oder Zugangssp\u00fclung mit NaCl.',
      },
    ],
    zusammenfassung:
      'Asystolie ist ein nicht-schockbarer Rhythmus. Adrenalin 1 mg i.v. wird sofort im 1. CPR-Zyklus gegeben. Bei Dialyse-Patienten ist Hyperkali\u00e4mie die h\u00e4ufigste reversible Ursache. Kalziumgluconat/Kalziumchlorid i.v. ist die Sofortma\u00dfnahme. Kalzium und Natriumbikarbonat d\u00fcrfen nie gemeinsam \u00fcber einen Zugang laufen.',
    leitlinienReferenz: 'ERC Guidelines 2021 (ALS-Algorithmus, Elektrolytst\u00f6rungen)',
  },
];

// ============================================================================
// FALLKATEGORIEN
// ============================================================================

export const CASE_CATEGORIES: {
  id: CaseCategory;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: 'praeoperativ',
    label: 'Pr\u00e4operativ',
    icon: '\uD83C\uDFE5',
    description: 'EKG-Befundung vor der Operation',
  },
  {
    id: 'intraoperativ',
    label: 'Intraoperativ',
    icon: '\u2695\uFE0F',
    description: 'Rhythmusst\u00f6rungen w\u00e4hrend der Narkose',
  },
  {
    id: 'postoperativ',
    label: 'Postoperativ',
    icon: '\uD83D\uDECF\uFE0F',
    description: 'Monitoring im Aufwachraum',
  },
  {
    id: 'notfall',
    label: 'Notfall / ACLS',
    icon: '\uD83D\uDEA8',
    description: 'Reanimation und Notfallszenarien',
  },
];
