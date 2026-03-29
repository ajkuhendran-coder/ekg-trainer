export interface LessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  keyPoints: string[];
  ekgPattern?: string;
  quiz: LessonQuiz[];
}

export interface Level {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export const LEARNING_LEVELS: Level[] = [
  // ═══════════════════════════════════════════════════════════════
  // LEVEL 1: EKG-Grundlagen
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'level_1',
    title: 'EKG-Grundlagen',
    description:
      'Erlernen Sie die fundamentalen Konzepte der Elektrokardiographie: vom Reizleitungssystem über die 12 Ableitungen bis zur systematischen EKG-Auswertung.',
    icon: '📐',
    lessons: [
      // ── Lesson 1.1 ──
      {
        id: 'l1_01',
        title: 'Das Reizleitungssystem',
        subtitle: 'Vom Sinusknoten bis zu den Purkinje-Fasern',
        content: `
<h3>Der Sinusknoten - der Taktgeber des Herzens</h3>
<p>Das Herz besitzt ein spezialisiertes Erregungsleitungssystem, das die koordinierte Kontraktion von Vorhöfen und Ventrikeln gewährleistet. Der <strong>Sinusknoten</strong> (Keith-Flack-Knoten) liegt im rechten Vorhof nahe der Einmündung der Vena cava superior und fungiert als primärer Schrittmacher mit einer Eigenfrequenz von <strong>60–100/min</strong>.</p>

<h3>Der AV-Knoten - die Verzögerungsstation</h3>
<p>Vom Sinusknoten breitet sich die Erregung über die Vorhofmuskulatur und die internodalen Trakte (Bachmann-, Wenckebach- und Thorel-Bündel) zum <strong>Atrioventrikularknoten</strong> (AV-Knoten, Aschoff-Tawara-Knoten) aus. Dieser liegt im Koch-Dreieck am Boden des rechten Vorhofs. Seine wichtigste Funktion ist die <strong>Verzögerung der Erregungsüberleitung</strong> (ca. 0,1 s), die eine sequenzielle Kontraktion von Vorhöfen und Kammern ermöglicht. Die Eigenfrequenz des AV-Knotens beträgt <strong>40–60/min</strong>.</p>

<h3>His-Bündel, Tawara-Schenkel und Purkinje-Fasern</h3>
<p>Das <strong>His-Bündel</strong> leitet die Erregung vom AV-Knoten durch das Septum membranaceum. Es teilt sich in den <strong>rechten Tawara-Schenkel</strong> und den <strong>linken Tawara-Schenkel</strong> (mit anteriorem und posteriorem Faszikel). Die terminalen <strong>Purkinje-Fasern</strong> verteilen die Erregung mit hoher Geschwindigkeit (2–4 m/s) über das gesamte Ventrikelmyokard und ermöglichen eine nahezu simultane Depolarisation beider Kammern. Die Eigenfrequenz dieses tertiären Schrittmachers liegt bei <strong>20–40/min</strong>.</p>

<h3>Klinische Relevanz für die Anästhesie</h3>
<p>Volatile Anästhetika, Opioide und Propofol können die Erregungsleitung beeinflussen. Besonders die <em>AV-Überleitung</em> reagiert empfindlich auf vagale Stimulation und Medikamente wie Remifentanil oder Dexmedetomidin.</p>`,
        keyPoints: [
          'Sinusknoten: primärer Schrittmacher, 60–100/min',
          'AV-Knoten: Erregungsverzögerung ca. 0,1 s, Eigenfrequenz 40–60/min',
          'His-Bündel teilt sich in rechten und linken Tawara-Schenkel',
          'Purkinje-Fasern: schnellste Leitungsgeschwindigkeit (2–4 m/s)',
          'Tertiäres Schrittmacherzentrum: 20–40/min (Kammer-Eigenrhythmus)',
        ],
        quiz: [
          {
            question:
              'Welche Eigenfrequenz besitzt der Sinusknoten als primärer Schrittmacher?',
            options: ['20–40/min', '40–60/min', '60–100/min', '100–150/min'],
            correctIndex: 2,
            explanation:
              'Der Sinusknoten hat eine Eigenfrequenz von 60–100/min und ist damit der schnellste und somit dominierende Schrittmacher des Herzens.',
          },
          {
            question:
              'Welche Hauptfunktion hat der AV-Knoten im Reizleitungssystem?',
            options: [
              'Beschleunigung der Erregungsleitung',
              'Verzögerung der Erregungsüberleitung zwischen Vorhöfen und Kammern',
              'Generierung der höchsten Schrittmacherfrequenz',
              'Verteilung der Erregung über die Purkinje-Fasern',
            ],
            correctIndex: 1,
            explanation:
              'Der AV-Knoten verzögert die Erregungsüberleitung um ca. 0,1 Sekunden, damit die Vorhöfe ihre Kontraktion vor der Kammerkontraktion abschließen können.',
          },
          {
            question:
              'In welche Strukturen teilt sich das His-Bündel auf?',
            options: [
              'Bachmann-Bündel und Wenckebach-Bündel',
              'Rechten und linken Tawara-Schenkel',
              'Anteriores und posteriores Purkinje-Netz',
              'Oberen und unteren AV-Knoten',
            ],
            correctIndex: 1,
            explanation:
              'Das His-Bündel teilt sich in den rechten Tawara-Schenkel und den linken Tawara-Schenkel (der sich weiter in ein anteriores und posteriores Faszikel aufteilt).',
          },
        ],
      },

      // ── Lesson 1.2 ──
      {
        id: 'l1_02',
        title: 'Die 12 Ableitungen',
        subtitle: 'Einthoven, Goldberger und Wilson',
        content: `
<h3>Bipolare Extremitätenableitungen nach Einthoven</h3>
<p>Die drei bipolaren Extremitätenableitungen <strong>I, II und III</strong> registrieren die Potenzialdifferenz zwischen jeweils zwei Extremitätenelektroden. Sie bilden das <strong>Einthoven-Dreieck</strong>:</p>
<ul>
  <li><strong>Ableitung I:</strong> rechter Arm (−) → linker Arm (+) – blickt auf die <em>laterale</em> Wand</li>
  <li><strong>Ableitung II:</strong> rechter Arm (−) → linkes Bein (+) – blickt auf die <em>inferiore</em> Wand</li>
  <li><strong>Ableitung III:</strong> linker Arm (−) → linkes Bein (+) – blickt auf die <em>inferiore</em> Wand</li>
</ul>
<p>Es gilt das <strong>Einthoven-Gesetz:</strong> Ableitung II = Ableitung I + Ableitung III.</p>

<h3>Unipolare Extremitätenableitungen nach Goldberger</h3>
<p>Die Goldberger-Ableitungen <strong>aVR, aVL und aVF</strong> sind augmentierte (verstärkte) unipolare Ableitungen:</p>
<ul>
  <li><strong>aVR:</strong> rechter Arm – blickt auf den <em>rechten Vorhof</em> und die <em>Herzbasis</em></li>
  <li><strong>aVL:</strong> linker Arm – blickt auf die <em>hohe Lateralwand</em></li>
  <li><strong>aVF:</strong> linkes Bein – blickt auf die <em>inferiore</em> Wand</li>
</ul>

<h3>Unipolare Brustwandableitungen nach Wilson</h3>
<p>Die sechs Brustwandableitungen <strong>V1–V6</strong> sind in einer horizontalen Ebene um den Thorax angeordnet:</p>
<ul>
  <li><strong>V1/V2:</strong> septale Ableitungen – blicken auf das <em>Septum</em></li>
  <li><strong>V3/V4:</strong> anteriore Ableitungen – blicken auf die <em>Vorderwand</em></li>
  <li><strong>V5/V6:</strong> laterale Ableitungen – blicken auf die <em>Seitenwand</em></li>
</ul>
<p>Der physiologische R-Zacken-Progress (R/S-Umschlag) findet normalerweise in <strong>V3 oder V4</strong> statt.</p>

<h3>Zuordnung zu Koronarversorgungsgebieten</h3>
<p>Für den Anästhesisten ist die Zuordnung der Ableitungen zu Koronargebieten essenziell: <strong>V1–V4</strong> (LAD-Versorgungsgebiet), <strong>II, III, aVF</strong> (RCA), <strong>I, aVL, V5, V6</strong> (LCx).</p>`,
        keyPoints: [
          'Einthoven (I, II, III): bipolare Extremitätenableitungen, bilden das Einthoven-Dreieck',
          'Goldberger (aVR, aVL, aVF): augmentierte unipolare Extremitätenableitungen',
          'Wilson (V1–V6): unipolare Brustwandableitungen in der Horizontalebene',
          'R/S-Umschlag physiologisch in V3/V4 (R-Zacken-Progression)',
          'Zuordnung: V1–V4 → LAD, II/III/aVF → RCA, I/aVL/V5/V6 → LCx',
        ],
        quiz: [
          {
            question:
              'Welche Ableitungen blicken auf die inferiore Herzwand?',
            options: [
              'V1, V2, V3',
              'I, aVL, V6',
              'II, III, aVF',
              'aVR, V1, V2',
            ],
            correctIndex: 2,
            explanation:
              'Die Ableitungen II, III und aVF bilden die inferioren Ableitungen und sind dem Versorgungsgebiet der rechten Koronararterie (RCA) zugeordnet.',
          },
          {
            question:
              'In welcher Brustwandableitung findet normalerweise der R/S-Umschlag statt?',
            options: ['V1 oder V2', 'V3 oder V4', 'V5 oder V6', 'V6'],
            correctIndex: 1,
            explanation:
              'Der R/S-Umschlag (Transitionszone) liegt physiologisch in V3 oder V4, wo die R-Zacke erstmals größer als die S-Zacke wird.',
          },
          {
            question: 'Was besagt das Einthoven-Gesetz?',
            options: [
              'aVR + aVL + aVF = 0',
              'Ableitung II = Ableitung I + Ableitung III',
              'V1 + V6 = Ableitung II',
              'Ableitung I = Ableitung II + Ableitung III',
            ],
            correctIndex: 1,
            explanation:
              'Das Einthoven-Gesetz besagt, dass die Amplitude der Ableitung II gleich der Summe der Amplituden von Ableitung I und III ist (Kirchhoff-Regel).',
          },
        ],
      },

      // ── Lesson 1.3 ──
      {
        id: 'l1_03',
        title: 'Systematische EKG-Auswertung',
        subtitle: 'Der standardisierte Befundungsalgorithmus',
        ekgPattern: 'normal_sinus',
        content: `
<h3>Die Checkliste der EKG-Befundung</h3>
<p>Eine systematische Herangehensweise verhindert, dass pathologische Befunde übersehen werden. Verwenden Sie stets folgendes Schema:</p>

<h3>1. Kalibrierung und Papiergeschwindigkeit</h3>
<p>Standardmäßig: <strong>25 mm/s Papiergeschwindigkeit</strong> und <strong>10 mm/mV Amplitude</strong>. Prüfen Sie den Eichzacken (1 mV = 10 mm).</p>

<h3>2. Herzfrequenz</h3>
<p>Bestimmung über die <strong>300er-Regel</strong> (300 / Anzahl großer Kästchen zwischen zwei R-Zacken) oder die <strong>Zählmethode</strong> (Anzahl QRS-Komplexe in 30 großen Kästchen × 10).</p>

<h3>3. Rhythmus</h3>
<p>Regelmäßig oder unregelmäßig? Sinusrhythmus-Kriterien: <strong>P-Welle positiv in II</strong>, jeder P-Welle folgt ein QRS, <strong>konstante PQ-Zeit</strong>.</p>

<h3>4. Lagetyp</h3>
<p>Bestimmung der elektrischen Herzachse über den Cabrera-Kreis anhand der Extremitätenableitungen (Details in Lektion 1.5).</p>

<h3>5. P-Welle</h3>
<p>Form, Dauer (&lt;0,11 s), Amplitude (&lt;0,25 mV). Hinweise auf <strong>P-mitrale</strong> (doppelgipflig → linksatriale Hypertrophie) oder <strong>P-pulmonale</strong> (spitz, hoch → rechtsatriale Hypertrophie).</p>

<h3>6. PQ-Zeit</h3>
<p>Normal: <strong>0,12–0,20 s</strong>. Verlängert bei AV-Block, verkürzt bei Präexzitation (WPW).</p>

<h3>7. QRS-Komplex</h3>
<p>Dauer normal <strong>&lt;0,12 s</strong>. Morphologie, pathologische Q-Zacken, R-Verlust. Verbreiterung bei Schenkelblöcken oder ventrikulären Rhythmen.</p>

<h3>8. ST-Strecke und T-Welle</h3>
<p>ST-Hebung oder -Senkung? T-Wellen-Inversion? Immer im Kontext der klinischen Situation beurteilen (Ischämie, Perikarditis, Elektrolytstörung).</p>

<h3>9. QT-Zeit</h3>
<p>Frequenzkorrigiert (QTc): Normal <strong>&lt;440 ms</strong> (Männer) / <strong>&lt;460 ms</strong> (Frauen). Verlängerung erhöht das Risiko für Torsade de Pointes.</p>`,
        keyPoints: [
          'Systematik: Frequenz → Rhythmus → Lagetyp → P → PQ → QRS → ST → T → QT',
          'Sinusrhythmus: P positiv in II, jede P-Welle mit QRS, PQ konstant 0,12–0,20 s',
          'QRS normal < 0,12 s; Verbreiterung bei Schenkelblock oder ventrikulärer Erregung',
          'QTc < 440 ms (Männer) / < 460 ms (Frauen)',
          'Eichzacken prüfen: 10 mm = 1 mV bei 25 mm/s',
        ],
        quiz: [
          {
            question:
              'Welche PQ-Zeit gilt als normal?',
            options: [
              '0,08–0,10 s',
              '0,12–0,20 s',
              '0,22–0,30 s',
              '0,30–0,40 s',
            ],
            correctIndex: 1,
            explanation:
              'Die normale PQ-Zeit beträgt 0,12–0,20 s. Eine Verlängerung spricht für einen AV-Block I°, eine Verkürzung für eine Präexzitation (z. B. WPW-Syndrom).',
          },
          {
            question:
              'Welches Kriterium gehört NICHT zu den Sinusrhythmus-Kriterien?',
            options: [
              'P-Welle positiv in Ableitung II',
              'Jeder P-Welle folgt ein QRS-Komplex',
              'QRS-Breite > 0,12 s',
              'Konstante PQ-Zeit',
            ],
            correctIndex: 2,
            explanation:
              'Ein QRS > 0,12 s ist kein Sinusrhythmus-Kriterium, sondern spricht für einen Schenkelblock oder eine ventrikuläre Erregungsausbreitung.',
          },
          {
            question:
              'Ab welchem QTc-Wert spricht man bei Männern von einer QT-Verlängerung?',
            options: ['> 380 ms', '> 420 ms', '> 440 ms', '> 500 ms'],
            correctIndex: 2,
            explanation:
              'Bei Männern gilt ein QTc > 440 ms als verlängert (bei Frauen > 460 ms). Ab einem QTc > 500 ms besteht ein deutlich erhöhtes Risiko für Torsade de Pointes.',
          },
        ],
      },

      // ── Lesson 1.4 ──
      {
        id: 'l1_04',
        title: 'Herzfrequenz und Rhythmus',
        subtitle: 'Frequenzbestimmung und Rhythmusanalyse',
        content: `
<h3>Methoden zur Herzfrequenzbestimmung</h3>
<p>Die korrekte Bestimmung der Herzfrequenz ist der erste Schritt jeder EKG-Analyse. Bei einer Standardpapiergeschwindigkeit von 25 mm/s entspricht ein großes Kästchen (5 mm) <strong>0,2 Sekunden</strong> und ein kleines Kästchen (1 mm) <strong>0,04 Sekunden</strong>.</p>

<h3>Die 300er-Regel (bei regelmäßigem Rhythmus)</h3>
<p>Teilen Sie <strong>300 durch die Anzahl großer Kästchen</strong> zwischen zwei aufeinanderfolgenden R-Zacken:</p>
<ul>
  <li>1 großes Kästchen = 300/min</li>
  <li>2 große Kästchen = 150/min</li>
  <li>3 große Kästchen = 100/min</li>
  <li>4 große Kästchen = 75/min</li>
  <li>5 große Kästchen = 60/min</li>
  <li>6 große Kästchen = 50/min</li>
</ul>

<h3>Die Zählmethode (bei unregelmäßigem Rhythmus)</h3>
<p>Zählen Sie die <strong>QRS-Komplexe innerhalb von 30 großen Kästchen</strong> (= 6 Sekunden) und multiplizieren Sie mit 10. Diese Methode liefert eine Durchschnittsfrequenz und ist besonders bei Vorhofflimmern hilfreich.</p>

<h3>Bradykardie und Tachykardie</h3>
<p>Eine <strong>Sinusbradykardie</strong> liegt bei einer Herzfrequenz &lt;60/min vor und kann bei trainierten Sportlern physiologisch sein. Anästhesiologisch relevant sind vagale Bradykardien bei Laryngoskopie, Rückenmarksnaher Anästhesie oder Augenchirurgie. Eine <strong>Sinustachykardie</strong> (&gt;100/min) ist häufig Ausdruck von Schmerz, Hypovolämie, Fieber, Anämie oder Stress und tritt perioperativ sehr häufig auf.</p>

<h3>Rhythmusbeurteilung</h3>
<p>Prüfen Sie: Ist der Abstand zwischen den R-Zacken <strong>regelmäßig oder unregelmäßig</strong>? Ist die Unregelmäßigkeit <em>regelmäßig unregelmäßig</em> (z. B. AV-Block II° Typ Wenckebach) oder <em>absolut arrhythmisch</em> (z. B. Vorhofflimmern)? Besteht eine Assoziation zwischen P-Wellen und QRS-Komplexen?</p>`,
        keyPoints: [
          '300er-Regel: 300 / große Kästchen zwischen R-R = Herzfrequenz',
          'Zählmethode: QRS in 6 Sekunden (30 große Kästchen) × 10',
          'Sinusbradykardie: < 60/min; Sinustachykardie: > 100/min',
          'Absolut arrhythmisch = Vorhofflimmern bis zum Beweis des Gegenteils',
          'Perioperative Tachykardie: Schmerz, Hypovolämie, Fieber, Anämie ausschließen',
        ],
        ekgPattern: 'sinus_bradycardia',
        quiz: [
          {
            question:
              'Bei regelmäßigem Rhythmus liegen zwischen zwei R-Zacken 4 große Kästchen. Wie hoch ist die Herzfrequenz?',
            options: ['50/min', '60/min', '75/min', '100/min'],
            correctIndex: 2,
            explanation:
              '300 ÷ 4 = 75/min. Die 300er-Regel teilt 300 durch die Anzahl der großen Kästchen zwischen zwei R-Zacken.',
          },
          {
            question:
              'Welche Methode eignet sich am besten zur Herzfrequenzbestimmung bei Vorhofflimmern?',
            options: [
              '300er-Regel',
              'Zählmethode (QRS in 6 Sekunden × 10)',
              'Einzelmessung eines RR-Intervalls',
              '1500er-Regel mit kleinen Kästchen',
            ],
            correctIndex: 1,
            explanation:
              'Bei unregelmäßigem Rhythmus wie Vorhofflimmern ist die Zählmethode am besten geeignet, da sie einen Durchschnittswert über mehrere Zyklen liefert.',
          },
          {
            question:
              'Welche Ursache ist die häufigste für perioperative Sinustachykardie?',
            options: [
              'Pulmonalembolie',
              'Hyperkaliämie',
              'Schmerz oder Hypovolämie',
              'Digitalisintoxikation',
            ],
            correctIndex: 2,
            explanation:
              'Perioperative Sinustachykardie ist am häufigsten durch Schmerz, Hypovolämie, Anämie oder Stress bedingt. Diese Ursachen sollten zuerst ausgeschlossen werden.',
          },
        ],
      },

      // ── Lesson 1.5 ──
      {
        id: 'l1_05',
        title: 'Lagetyp-Bestimmung',
        subtitle: 'Cabrera-Kreis und elektrische Herzachse',
        content: `
<h3>Die elektrische Herzachse</h3>
<p>Der Lagetyp beschreibt die Richtung des <strong>Hauptvektors der Ventrikeldepolarisation</strong> in der Frontalebene. Er wird in Grad angegeben und mithilfe des <strong>Cabrera-Kreises</strong> bestimmt. Die Kenntnis des Lagetyps kann auf Hypertrophie, Schenkelblöcke oder eine veränderte Herzposition hinweisen.</p>

<h3>Die Lagetypen im Überblick</h3>
<ul>
  <li><strong>Indifferenztyp (0° bis +60°):</strong> Normalbefund beim Erwachsenen. QRS positiv in I und II.</li>
  <li><strong>Steiltyp (+60° bis +90°):</strong> Normvariante bei jungen, schlanken Patienten. QRS positiv in II und III, in I isoelektrisch oder gering positiv.</li>
  <li><strong>Linkstyp (−30° bis 0°):</strong> Häufig bei Adipositas, Schwangerschaft, linksventrikulärer Hypertrophie.</li>
  <li><strong>Überdrehter Linkstyp (&lt; −30°):</strong> Pathologisch! Typisch für <em>linksanterioren Hemiblock</em> (LAH). QRS negativ in II und III.</li>
  <li><strong>Rechtstyp (+90° bis +120°):</strong> Rechtsherzhypertrophie, Lungenembolie, oder Normvariante bei Kindern.</li>
  <li><strong>Überdrehter Rechtstyp (&gt; +120°):</strong> Pathologisch! Linksposteriorer Hemiblock, schwere Rechtsbelastung.</li>
</ul>

<h3>Praktische Bestimmung</h3>
<p>Schnellmethode: Betrachten Sie die <strong>Nettamplitude des QRS-Komplexes in den Ableitungen I und aVF</strong>:</p>
<ul>
  <li><strong>I positiv + aVF positiv:</strong> normale Achse (Indifferenz- oder Steiltyp)</li>
  <li><strong>I positiv + aVF negativ:</strong> Linkstyp (prüfen Sie II → negativ = überdrehter Linkstyp)</li>
  <li><strong>I negativ + aVF positiv:</strong> Rechtstyp</li>
  <li><strong>I negativ + aVF negativ:</strong> überdrehter Rechtstyp (oder Extremtyp)</li>
</ul>

<h3>Anästhesierelevanz</h3>
<p>Ein akut aufgetretener <em>Rechtstyp</em> perioperativ kann auf eine <strong>Lungenembolie</strong> hinweisen. Ein überdrehter Linkstyp bei Schenkelblock deutet auf ein <strong>bifaszikuläres Blockbild</strong> hin, das bei zusätzlichem AV-Block eine Schrittmacherindikation darstellen kann.</p>`,
        keyPoints: [
          'Indifferenztyp (0° bis +60°): Normalbefund bei Erwachsenen',
          'Überdrehter Linkstyp (< −30°): pathologisch, typisch für linksanterioren Hemiblock',
          'Schnellmethode: QRS in Ableitung I und aVF beurteilen',
          'Akuter Rechtstyp perioperativ: an Lungenembolie denken!',
          'Überdrehter Rechtstyp: selten, hinweisend auf linksposterioren Hemiblock',
        ],
        quiz: [
          {
            question:
              'Welcher Lagetyp liegt vor, wenn QRS in Ableitung I positiv und in aVF negativ ist und in II ebenfalls negativ?',
            options: [
              'Indifferenztyp',
              'Linkstyp',
              'Überdrehter Linkstyp',
              'Rechtstyp',
            ],
            correctIndex: 2,
            explanation:
              'I positiv + aVF negativ deutet auf einen Linkstyp hin. Ist zusätzlich II negativ, handelt es sich um einen überdrehten Linkstyp (< −30°).',
          },
          {
            question:
              'Welcher Lagetyp ist typisch für den linksanterioren Hemiblock (LAH)?',
            options: [
              'Steiltyp',
              'Indifferenztyp',
              'Überdrehter Linkstyp',
              'Rechtstyp',
            ],
            correctIndex: 2,
            explanation:
              'Der linksanteriore Hemiblock (LAH) verursacht typischerweise einen überdrehten Linkstyp mit einer Achse < −30°.',
          },
          {
            question:
              'Was kann ein akut perioperativ aufgetretener Rechtstyp bedeuten?',
            options: [
              'Digitalisintoxikation',
              'Lungenembolie',
              'Hypokaliämie',
              'Perikarditis',
            ],
            correctIndex: 1,
            explanation:
              'Ein akut aufgetretener Rechtstyp perioperativ ist ein Warnsignal für eine Lungenembolie und sollte unverzüglich abgeklärt werden.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 2: Rhythmusstörungen
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'level_2',
    title: 'Rhythmusstörungen',
    description:
      'Erkennung und Differenzierung der wichtigsten supraventrikulären und ventrikulären Arrhythmien sowie Erregungsleitungsstörungen.',
    icon: '⚡',
    lessons: [
      // ── Lesson 2.1 ──
      {
        id: 'l2_01',
        title: 'Vorhofflimmern und Vorhofflattern',
        subtitle: 'Die häufigsten supraventrikulären Arrhythmien',
        ekgPattern: 'afib',
        content: `
<h3>Vorhofflimmern (VHF)</h3>
<p><strong>Vorhofflimmern</strong> ist die häufigste anhaltende Herzrhythmusstörung mit einer Prävalenz von ca. 1–2 % in der Allgemeinbevölkerung. Pathophysiologisch liegt eine <strong>unkoordinierte, chaotische Vorhoferregung</strong> mit Frequenzen von 350–600/min zugrunde, die durch multiple kreisende Erregungen (Reentry) und ektope Foci (häufig aus den Pulmonalvenen) entsteht.</p>

<h3>EKG-Merkmale des Vorhofflimmerns</h3>
<ul>
  <li><strong>Absolut arrhythmische RR-Intervalle</strong> (pathognomonisch)</li>
  <li><strong>Keine erkennbaren P-Wellen</strong> – stattdessen unregelmäßige Flimmerwellen (Fibrillationswellen)</li>
  <li>Schmale QRS-Komplexe (bei intakter intraventrikulärer Erregungsleitung)</li>
  <li>Kammerfrequenz abhängig von der AV-Überleitung (normo-, tachy- oder bradykard)</li>
</ul>

<h3>Vorhofflattern</h3>
<p>Beim <strong>Vorhofflattern</strong> liegt eine einzelne kreisende Erregung im rechten Vorhof (typisch: um den Trikuspidalring) mit einer Vorhoffrequenz von ca. <strong>300/min</strong> vor. Das typische EKG-Merkmal ist das <strong>Sägezahnmuster</strong> der Flatterwellen, am besten sichtbar in den <strong>Ableitungen II, III, aVF und V1</strong>.</p>
<p>Häufig besteht eine <strong>2:1-Überleitung</strong> mit einer resultierenden Kammerfrequenz von ca. 150/min. Bei einer regelmäßigen Schmalkomlex-Tachykardie um 150/min sollte immer an Vorhofflattern mit 2:1-Überleitung gedacht werden!</p>

<h3>Anästhesierelevanz</h3>
<p>Perioperativ sind VHF und Vorhofflattern häufig. Relevante Aspekte: <strong>Antikoagulation</strong> (Thromboembolierisiko, CHA₂DS₂-VASc-Score), <strong>Frequenzkontrolle</strong> (Betablocker, Kalziumantagonisten, Amiodaron) und <strong>hämodynamische Instabilität</strong> (elektrische Kardioversion). Bei Notfallnarkosen an mögliche Antikoagulation denken!</p>`,
        keyPoints: [
          'Vorhofflimmern: absolut arrhythmisch, keine P-Wellen, Flimmerwellen',
          'Vorhofflattern: Sägezahnmuster, Vorhoffrequenz ~300/min, oft 2:1-Überleitung',
          'Tachykardie ~150/min + regelmäßig = Vorhofflattern 2:1 ausschließen!',
          'Antikoagulation bei VHF beachten (CHA₂DS₂-VASc-Score)',
          'Perioperativ häufigste Arrhythmie: Vorhofflimmern',
        ],
        quiz: [
          {
            question:
              'Was ist das pathognomonische EKG-Zeichen des Vorhofflimmerns?',
            options: [
              'Sägezahnförmige Flatterwellen',
              'Absolut arrhythmische RR-Intervalle ohne P-Wellen',
              'Regelmäßige Schmalkomplextachykardie mit 150/min',
              'Breite QRS-Komplexe mit wechselnder Morphologie',
            ],
            correctIndex: 1,
            explanation:
              'Vorhofflimmern ist durch absolut arrhythmische (unregelmäßige) RR-Intervalle und fehlende organisierte P-Wellen charakterisiert.',
          },
          {
            question:
              'Welche Kammerfrequenz ist typisch für Vorhofflattern mit 2:1-Überleitung?',
            options: ['75/min', '100/min', '150/min', '300/min'],
            correctIndex: 2,
            explanation:
              'Die Vorhoffrequenz beim Flattern beträgt ca. 300/min. Bei 2:1-Überleitung wird jede zweite Flatterwelle übergeleitet, was eine Kammerfrequenz von ca. 150/min ergibt.',
          },
          {
            question:
              'Welcher Score wird zur Beurteilung des Thromboembolierisikos bei Vorhofflimmern verwendet?',
            options: [
              'APACHE-II-Score',
              'CHA₂DS₂-VASc-Score',
              'SOFA-Score',
              'Wells-Score',
            ],
            correctIndex: 1,
            explanation:
              'Der CHA₂DS₂-VASc-Score bewertet das Schlaganfallrisiko bei Vorhofflimmern und hilft bei der Entscheidung zur oralen Antikoagulation.',
          },
        ],
      },

      // ── Lesson 2.2 ──
      {
        id: 'l2_02',
        title: 'Supraventrikuläre Tachykardien',
        subtitle: 'AVNRT, AVRT und ektope atriale Tachykardie',
        ekgPattern: 'svt',
        content: `
<h3>Übersicht</h3>
<p><strong>Supraventrikuläre Tachykardien (SVT)</strong> sind Tachykardien mit Ursprung oberhalb der His-Bündel-Bifurkation. Sie präsentieren sich typischerweise als <strong>regelmäßige Schmalkomplextachykardien</strong> mit einer Frequenz von 150–250/min. Die häufigsten Formen sind die AVNRT und die AVRT.</p>

<h3>AV-Knoten-Reentry-Tachykardie (AVNRT)</h3>
<p>Die <strong>AVNRT</strong> ist die häufigste paroxysmale SVT (ca. 60 %). Pathophysiologisch liegt ein <em>duales AV-Knoten-Leitungssystem</em> mit einer langsamen (slow) und einer schnellen (fast) Leitungsbahn zugrunde. Bei der typischen (slow-fast) AVNRT kreist die Erregung anterograd über die langsame und retrograd über die schnelle Bahn. Im EKG sind <strong>keine oder pseudo-r'-Zacken in V1</strong> und <strong>pseudo-S in II/III/aVF</strong> zu sehen, da Vorhof- und Kammererregung nahezu gleichzeitig stattfinden.</p>

<h3>AV-Reentry-Tachykardie (AVRT)</h3>
<p>Die <strong>AVRT</strong> nutzt eine <em>akzessorische Leitungsbahn</em> (z. B. Kent-Bündel bei WPW-Syndrom). Bei der orthodromen AVRT leitet der AV-Knoten anterograd und die akzessorische Bahn retrograd, was eine <strong>Schmalkomplextachykardie</strong> ergibt. P-Wellen können nach dem QRS als separate Deflexion sichtbar sein (RP-Intervall &gt; 70 ms).</p>

<h3>Ektope atriale Tachykardie</h3>
<p>Entsteht durch einen <strong>autonomen Fokus im Vorhof</strong>. P-Wellen-Morphologie unterscheidet sich vom Sinusrhythmus. Typisch: Warm-up- und Cool-down-Phänomen (allmählicher Frequenzanstieg und -abfall).</p>

<h3>Therapie und Anästhesierelevanz</h3>
<p>Akuttherapie: <strong>Vagusmanöver</strong> (Valsalva, Karotismassage), <strong>Adenosin</strong> (6–12–18 mg schnell i.v.). Adenosin unterbricht den AV-Knoten-abhängigen Reentry-Kreis und ist gleichzeitig diagnostisch wertvoll. Alternativ: Verapamil oder Betablocker. Bei hämodynamischer Instabilität: <strong>synchronisierte Kardioversion</strong>.</p>`,
        keyPoints: [
          'AVNRT: häufigste paroxysmale SVT, duales AV-Knoten-Leitungssystem',
          'AVRT: akzessorische Leitungsbahn (z. B. WPW), orthodrom = Schmalkomplex',
          'Adenosin 6–12–18 mg i.v.: Akuttherapie und diagnostisches Werkzeug',
          'Ektope atriale Tachykardie: Warm-up/Cool-down-Phänomen',
          'Hämodynamisch instabil: sofortige synchronisierte Kardioversion',
        ],
        quiz: [
          {
            question:
              'Welche SVT ist die häufigste paroxysmale supraventrikuläre Tachykardie?',
            options: [
              'Orthodrome AVRT',
              'AVNRT',
              'Ektope atriale Tachykardie',
              'Sinusknoten-Reentry-Tachykardie',
            ],
            correctIndex: 1,
            explanation:
              'Die AVNRT macht ca. 60 % aller paroxysmalen SVT aus und ist damit die häufigste Form.',
          },
          {
            question:
              'Welches Medikament wird als Erstlinientherapie bei hämodynamisch stabiler SVT eingesetzt?',
            options: ['Amiodaron', 'Adenosin', 'Atropin', 'Lidocain'],
            correctIndex: 1,
            explanation:
              'Adenosin (6–12–18 mg schnell i.v.) ist die Erstlinientherapie bei hämodynamisch stabiler SVT nach erfolglosen Vagusmanövern.',
          },
          {
            question:
              'Was ist das typische EKG-Merkmal der ektopen atrialen Tachykardie?',
            options: [
              'Absolut arrhythmische RR-Intervalle',
              'Warm-up- und Cool-down-Phänomen',
              'Pseudo-r\' in V1',
              'Delta-Wellen',
            ],
            correctIndex: 1,
            explanation:
              'Die ektope atriale Tachykardie zeigt typischerweise ein Warm-up- und Cool-down-Phänomen mit allmählichem Frequenzanstieg zu Beginn und -abfall am Ende der Episode.',
          },
        ],
      },

      // ── Lesson 2.3 ──
      {
        id: 'l2_03',
        title: 'Ventrikuläre Rhythmusstörungen',
        subtitle: 'VT, Kammerflimmern und Torsade de Pointes',
        ekgPattern: 'vt',
        content: `
<h3>Ventrikuläre Tachykardie (VT)</h3>
<p>Eine <strong>ventrikuläre Tachykardie</strong> ist definiert als mindestens drei aufeinanderfolgende ventrikuläre Schläge mit einer Frequenz &gt;100/min. Sie entsteht durch Reentry-Kreise, gesteigerte Automatie oder getriggerte Aktivität im Ventrikelmyokard.</p>
<ul>
  <li><strong>Monomorphe VT:</strong> gleichförmige QRS-Morphologie, häufig bei struktureller Herzerkrankung (Infarktnarbe). Breite QRS-Komplexe (&gt;0,12 s), AV-Dissoziation, Capture Beats und Fusion Beats sind diagnostische Kriterien.</li>
  <li><strong>Polymorphe VT:</strong> wechselnde QRS-Morphologie und -Achse, häufig bei akuter Ischämie oder Elektrolytstörungen.</li>
</ul>

<h3>Kammerflimmern (VF)</h3>
<p><strong>Kammerflimmern</strong> ist ein lebensbedrohlicher Rhythmus mit unkoordinierter ventrikulärer Depolarisation und vollständigem Verlust der Pumpfunktion. Im EKG zeigen sich <strong>chaotische, unregelmäßige Undulationen</strong> ohne erkennbare QRS-Komplexe. Sofortige <strong>Defibrillation</strong> (nicht synchronisierte Schockabgabe) ist die einzige effektive Therapie.</p>

<h3>Torsade de Pointes</h3>
<p><strong>Torsade de Pointes</strong> ist eine Sonderform der polymorphen VT bei verlängertem QT-Intervall. Charakteristisch ist die <strong>spindelförmige Morphologie</strong> mit scheinbarer Rotation der QRS-Achse um die Grundlinie ("Spitzenumkehrtachykardie"). Auslöser sind QT-verlängernde Medikamente, Hypokaliämie, Hypomagnesiämie und bradykarde Rhythmen. Therapie: <strong>Magnesium i.v.</strong> (2 g über 10 min), temporärer Schrittmacher zur Frequenzanhebung, Ursache beseitigen.</p>

<h3>Differenzialdiagnose: Breite QRS-Tachykardie</h3>
<p>Eine Breitkomplextachykardie ist bis zum Beweis des Gegenteils als VT zu behandeln! Differenzialdiagnosen umfassen SVT mit aberranter Leitung (Schenkelblock) und antidrome AVRT. Die <strong>Brugada-Kriterien</strong> helfen bei der Unterscheidung.</p>`,
        keyPoints: [
          'Breitkomplextachykardie = VT bis zum Beweis des Gegenteils',
          'Monomorphe VT: gleichförmig, AV-Dissoziation, Capture/Fusion Beats',
          'Kammerflimmern: chaotisch, sofortige Defibrillation (unsynchronisiert)',
          'Torsade de Pointes: spindelförmig, Therapie mit Magnesium i.v.',
          'Brugada-Kriterien zur Differenzierung VT vs. SVT mit Aberranz',
        ],
        quiz: [
          {
            question:
              'Wie ist eine ventrikuläre Tachykardie definiert?',
            options: [
              'Mindestens 2 ventrikuläre Schläge > 60/min',
              'Mindestens 3 ventrikuläre Schläge > 100/min',
              'Mindestens 5 ventrikuläre Schläge > 120/min',
              'Jede Breitkomplextachykardie > 150/min',
            ],
            correctIndex: 1,
            explanation:
              'Eine VT ist definiert als mindestens 3 aufeinanderfolgende Schläge ventrikulären Ursprungs mit einer Frequenz > 100/min.',
          },
          {
            question:
              'Was ist die Akuttherapie bei Torsade de Pointes?',
            options: [
              'Amiodaron i.v.',
              'Adenosin i.v.',
              'Magnesium i.v.',
              'Lidocain i.v.',
            ],
            correctIndex: 2,
            explanation:
              'Die Akuttherapie der Torsade de Pointes ist Magnesium i.v. (2 g über 10 Minuten). Amiodaron ist kontraindiziert, da es die QT-Zeit weiter verlängert.',
          },
          {
            question:
              'Welche Therapie ist bei Kammerflimmern indiziert?',
            options: [
              'Synchronisierte Kardioversion',
              'Unsynchronisierte Defibrillation',
              'Adenosin-Gabe',
              'Vagusmanöver',
            ],
            correctIndex: 1,
            explanation:
              'Bei Kammerflimmern ist die sofortige unsynchronisierte Defibrillation indiziert. Eine Synchronisation ist nicht möglich, da keine definierbaren QRS-Komplexe vorhanden sind.',
          },
        ],
      },

      // ── Lesson 2.4 ──
      {
        id: 'l2_04',
        title: 'AV-Blockierungen',
        subtitle: 'Grad I bis III mit klinischer Bedeutung',
        ekgPattern: 'av_block_1',
        content: `
<h3>AV-Block I°</h3>
<p>Der <strong>AV-Block I°</strong> ist definiert als eine <strong>PQ-Verlängerung &gt; 0,20 s</strong> bei erhaltener 1:1-Überleitung. Jede P-Welle wird übergeleitet, aber mit konstanter Verzögerung. Isoliert ist er häufig ein Zufallsbefund ohne klinische Relevanz, kann aber bei vagalem Tonus, Betablockern, Kalziumantagonisten oder Digitalis auftreten.</p>

<h3>AV-Block II° Typ Wenckebach (Mobitz I)</h3>
<p>Periodische Zunahme der PQ-Zeit bis zum <strong>Ausfall einer QRS-Überleitung</strong> (Wenckebach-Periodik). Die PQ-Intervalle werden progressiv länger, bis eine P-Welle nicht mehr übergeleitet wird. Der Blockierungsort liegt meist <strong>im AV-Knoten</strong>. Häufig ein gutartiger Befund, der bei hohem Vagotonus (Schlaf, trainierte Sportler) vorkommen kann. Anästhesiologisch relevant bei symptomatischer Bradykardie.</p>

<h3>AV-Block II° Typ Mobitz (Mobitz II)</h3>
<p>Plötzlicher Ausfall der QRS-Überleitung <strong>ohne vorherige PQ-Verlängerung</strong>. Der Blockierungsort liegt meist <strong>infranodal</strong> (His-Bündel oder Tawara-Schenkel). Dieser Typ ist klinisch <em>gefährlicher</em> als Wenckebach, da er in einen AV-Block III° übergehen kann. Eine <strong>Schrittmacherindikation</strong> sollte evaluiert werden.</p>

<h3>AV-Block III° (totaler AV-Block)</h3>
<p>Vollständige Unterbrechung der AV-Überleitung: <strong>Keine Assoziation zwischen P-Wellen und QRS-Komplexen</strong> (AV-Dissoziation). Vorhöfe und Kammern schlagen unabhängig voneinander. Die Kammerfrequenz hängt vom Ersatzrhythmus ab: junktional (schmaler QRS, 40–60/min) oder ventrikulär (breiter QRS, 20–40/min). Ein ventrikulärer Ersatzrhythmus ist <strong>hämodynamisch instabil</strong> und kann in Asystolie übergehen.</p>

<h3>Anästhesie-Management</h3>
<p>Bei AV-Block III° und symptomatischem AV-Block II° Typ Mobitz ist ein <strong>temporärer Schrittmacher</strong> vor elektiven Eingriffen erforderlich. Atropin kann bei nodalem Block wirksam sein, ist bei infranodaler Blockierung jedoch ineffektiv. <strong>Adrenalin</strong> und <strong>Isoprenalin</strong> sind als Bridging-Maßnahmen verfügbar.</p>`,
        keyPoints: [
          'AV-Block I°: PQ > 0,20 s, jede P wird übergeleitet, meist harmlos',
          'Wenckebach (II° Typ I): progressive PQ-Verlängerung bis Ausfall, meist nodal, oft benigne',
          'Mobitz (II° Typ II): plötzlicher Ausfall ohne PQ-Verlängerung, infranodal, gefährlich',
          'AV-Block III°: keine Assoziation P↔QRS, Schrittmacher erforderlich',
          'Atropin nur bei nodalem Block wirksam, nicht bei infranodalem Block',
        ],
        quiz: [
          {
            question:
              'Welcher AV-Block zeigt eine progressive PQ-Verlängerung bis zum Ausfall einer Überleitung?',
            options: [
              'AV-Block I°',
              'AV-Block II° Typ Wenckebach',
              'AV-Block II° Typ Mobitz',
              'AV-Block III°',
            ],
            correctIndex: 1,
            explanation:
              'Der AV-Block II° Typ Wenckebach (Mobitz I) ist durch eine progressive Verlängerung des PQ-Intervalls bis zum Ausfall einer QRS-Überleitung gekennzeichnet.',
          },
          {
            question:
              'Warum ist der AV-Block II° Typ Mobitz gefährlicher als der Typ Wenckebach?',
            options: [
              'Er tritt nur bei Vorhofflimmern auf',
              'Er liegt infranodal und kann in einen AV-Block III° übergehen',
              'Er verursacht immer Tachykardien',
              'Er reagiert gut auf Atropin',
            ],
            correctIndex: 1,
            explanation:
              'Der Mobitz-Typ liegt infranodal, kann unvorhersehbar in einen kompletten AV-Block III° übergehen und reagiert nicht auf Atropin.',
          },
          {
            question:
              'Was ist das Kennzeichen eines AV-Blocks III°?',
            options: [
              'PQ-Zeit > 0,20 s',
              'Progressive PQ-Verlängerung',
              'Vollständige AV-Dissoziation ohne Korrelation zwischen P und QRS',
              '2:1-Überleitung',
            ],
            correctIndex: 2,
            explanation:
              'Beim AV-Block III° (totaler AV-Block) besteht eine vollständige AV-Dissoziation. P-Wellen und QRS-Komplexe sind komplett unabhängig voneinander.',
          },
        ],
      },

      // ── Lesson 2.5 ──
      {
        id: 'l2_05',
        title: 'Schenkelblockbilder',
        subtitle: 'Linksschenkelblock und Rechtsschenkelblock',
        ekgPattern: 'lbbb',
        content: `
<h3>Grundlagen</h3>
<p>Bei einem <strong>Schenkelblock</strong> ist die Erregungsleitung in einem der Tawara-Schenkel verzögert oder unterbrochen. Die betroffene Kammer wird verspätet über das Myokard depolarisiert, was zu einer <strong>QRS-Verbreiterung ≥ 0,12 s</strong> führt. Bei einer QRS-Dauer von 0,10–0,12 s spricht man von einem <em>inkompletten</em> Block.</p>

<h3>Rechtsschenkelblock (RSB)</h3>
<p>Beim RSB wird die rechte Kammer verspätet erregt. Typische Merkmale:</p>
<ul>
  <li><strong>V1:</strong> rSR'-Konfiguration (<em>"M-förmig"</em> oder "Hasenohren")</li>
  <li><strong>V6 und I:</strong> breite, plumpe S-Zacke</li>
  <li>QRS ≥ 0,12 s</li>
</ul>
<p>Ein RSB kann physiologisch (1 % der Normalbevölkerung), aber auch Zeichen einer Rechtsbelastung, Lungenembolie oder koronaren Herzerkrankung sein.</p>

<h3>Linksschenkelblock (LSB)</h3>
<p>Beim LSB wird die linke Kammer verspätet erregt. Typische Merkmale:</p>
<ul>
  <li><strong>V1:</strong> tiefe, breite QS- oder rS-Konfiguration</li>
  <li><strong>V6 und I:</strong> breiter, gekerbter R-Zacke (<em>"M-förmig"</em>) ohne Q und ohne S</li>
  <li>QRS ≥ 0,12 s</li>
  <li>Diskordante ST-Strecken/T-Wellen (gegenüber QRS-Hauptvektor gerichtet)</li>
</ul>
<p>Ein LSB ist <strong>fast immer pathologisch</strong> und häufig mit linksventrikulärer Hypertrophie, Kardiomyopathie oder koronarer Herzerkrankung assoziiert.</p>

<h3>Die William-Morrow-Regel</h3>
<p>Eselsbrücke zur Unterscheidung: <strong>WiLLiaM MaRRoW</strong>:</p>
<ul>
  <li><strong>WiLLiaM</strong> = LSB: V1 zeigt W-Form (QS), V6 zeigt M-Form (breites R)</li>
  <li><strong>MaRRoW</strong> = RSB: V1 zeigt M-Form (rSR'), V6 zeigt W-Form (qRS mit breitem S)</li>
</ul>

<h3>Klinische Relevanz</h3>
<p>Ein <strong>neu aufgetretener LSB</strong> gilt als STEMI-Äquivalent und erfordert eine notfallmäßige Herzkatheteruntersuchung. Die ST-Strecken-Beurteilung ist bei Schenkelblöcken erschwert; die <strong>Sgarbossa-Kriterien</strong> helfen bei der Erkennung eines Infarkts bei LSB.</p>`,
        keyPoints: [
          'WiLLiaM MaRRoW: LSB = V1 W-Form, V6 M-Form; RSB = V1 M-Form, V6 W-Form',
          'Schenkelblock: QRS ≥ 0,12 s (inkomplett: 0,10–0,12 s)',
          'LSB fast immer pathologisch, neu aufgetretener LSB = STEMI-Äquivalent',
          'RSB kann physiologisch sein (1 % der Normalbevölkerung)',
          'Sgarbossa-Kriterien: Infarktdiagnostik bei LSB',
        ],
        quiz: [
          {
            question:
              'Welche QRS-Morphologie zeigt sich in V1 bei einem Rechtsschenkelblock?',
            options: [
              'Tiefe QS-Konfiguration',
              'rSR\'-Konfiguration (M-förmig)',
              'Breite, gekerbte R-Zacke',
              'Delta-Welle mit breitem QRS',
            ],
            correctIndex: 1,
            explanation:
              'Der RSB zeigt in V1 eine typische rSR\'-Konfiguration ("M-förmig" oder "Hasenohren"), da die rechte Kammer verspätet erregt wird.',
          },
          {
            question:
              'Was bedeutet ein neu aufgetretener Linksschenkelblock klinisch?',
            options: [
              'Ein harmloser Zufallsbefund',
              'Ein STEMI-Äquivalent mit Indikation zur Herzkatheteruntersuchung',
              'Ein Zeichen für Lungenembolie',
              'Ein typisches Zeichen für Hyperkaliämie',
            ],
            correctIndex: 1,
            explanation:
              'Ein neu aufgetretener LSB gilt als STEMI-Äquivalent und erfordert eine notfallmäßige Herzkatheteruntersuchung zur Infarktdiagnostik.',
          },
          {
            question: 'Was besagt die William-Morrow-Regel?',
            options: [
              'WiLLiaM = RSB (W in V1, M in V6)',
              'WiLLiaM = LSB (W in V1, M in V6), MaRRoW = RSB (M in V1, W in V6)',
              'MaRRoW = LSB (M in V1, W in V6)',
              'William und Morrow sind die Erfinder der Schenkelblockklassifikation',
            ],
            correctIndex: 1,
            explanation:
              'WiLLiaM = LSB: V1 zeigt W-Form (QS/rS), V6 zeigt M-Form (breites R). MaRRoW = RSB: V1 zeigt M-Form (rSR\'), V6 zeigt W-Form (breites S).',
          },
        ],
      },

      // ── Lesson 2.6 ──
      {
        id: 'l2_06',
        title: 'WPW-Syndrom und Präexzitation',
        subtitle: 'Delta-Welle und anästhesiologische Konsequenzen',
        ekgPattern: 'wpw',
        content: `
<h3>Das Wolff-Parkinson-White-Syndrom</h3>
<p>Das <strong>WPW-Syndrom</strong> ist die klinisch bedeutsamste Form der ventrikulären Präexzitation. Es beruht auf einer <strong>akzessorischen Leitungsbahn</strong> (Kent-Bündel), die Vorhof und Kammer unter Umgehung des AV-Knotens verbindet. Die Prävalenz beträgt ca. 0,1–0,3 % in der Allgemeinbevölkerung.</p>

<h3>EKG-Merkmale</h3>
<ul>
  <li><strong>Kurze PQ-Zeit (&lt; 0,12 s):</strong> Die Erregung erreicht die Kammer über die akzessorische Bahn schneller als über den AV-Knoten.</li>
  <li><strong>Delta-Welle:</strong> träge Anfangskomponente des QRS-Komplexes durch langsame myokardiale Erregungsausbreitung am Insertionspunkt der akzessorischen Bahn.</li>
  <li><strong>Verbreiterter QRS-Komplex:</strong> Fusionskomplex aus normaler und präexzitierter Erregung (&gt; 0,11 s).</li>
  <li>Sekundäre Repolarisationsstörungen (ST-T-Veränderungen)</li>
</ul>

<h3>Tachyarrhythmien beim WPW-Syndrom</h3>
<p>Patienten mit WPW haben ein erhöhtes Risiko für:</p>
<ul>
  <li><strong>Orthodrome AVRT:</strong> Anterograde Leitung über AV-Knoten, retrograde Leitung über akzessorische Bahn → Schmalkomplextachykardie (häufigste SVT bei WPW).</li>
  <li><strong>Antidrome AVRT:</strong> Anterograde Leitung über akzessorische Bahn → Breitkomplextachykardie (selten).</li>
  <li><strong>Vorhofflimmern mit Präexzitation:</strong> Lebensbedrohlich! Schnelle Überleitung über die akzessorische Bahn kann in Kammerflimmern degenerieren.</li>
</ul>

<h3>Anästhesierelevanz</h3>
<p><strong>AV-Knoten-blockierende Substanzen (Adenosin, Verapamil, Digoxin, Betablocker) sind bei Vorhofflimmern mit Präexzitation kontraindiziert</strong>, da sie die Überleitung über die akzessorische Bahn begünstigen und Kammerflimmern auslösen können. Therapie der Wahl bei hämodynamischer Instabilität: <strong>elektrische Kardioversion</strong>. Medikamentös: <strong>Ajmalin</strong> oder <strong>Flecainid</strong>. Volatile Anästhetika haben keinen relevanten Einfluss auf akzessorische Bahnen, aber sympathomimetische Stimulation sollte vermieden werden.</p>`,
        keyPoints: [
          'WPW-Trias: kurze PQ-Zeit (< 0,12 s), Delta-Welle, breites QRS',
          'Vorhofflimmern + WPW: lebensbedrohlich! AV-Blocker kontraindiziert!',
          'AV-Blocker (Adenosin, Verapamil, Digoxin) bei WPW + VHF vermeiden',
          'Therapie bei WPW + VHF: Ajmalin, Flecainid oder Kardioversion',
          'Orthodrome AVRT: Schmalkomplex (häufigste Tachykardie bei WPW)',
        ],
        quiz: [
          {
            question:
              'Welche EKG-Trias ist typisch für das WPW-Syndrom?',
            options: [
              'Verlängerte PQ-Zeit, schmales QRS, hohe T-Wellen',
              'Kurze PQ-Zeit, Delta-Welle, breiter QRS-Komplex',
              'Sägezahnmuster, absolut arrhythmisch, schmales QRS',
              'ST-Hebung, tiefes Q, T-Inversion',
            ],
            correctIndex: 1,
            explanation:
              'Das WPW-Syndrom zeigt die klassische Trias: kurze PQ-Zeit (< 0,12 s), Delta-Welle und verbreiterter QRS-Komplex.',
          },
          {
            question:
              'Warum sind AV-Knoten-Blocker bei Vorhofflimmern mit WPW kontraindiziert?',
            options: [
              'Sie verursachen eine Sinusbradykardie',
              'Sie begünstigen die Überleitung über die akzessorische Bahn und können Kammerflimmern auslösen',
              'Sie verlängern die QT-Zeit',
              'Sie verstärken die Delta-Welle ohne klinische Konsequenz',
            ],
            correctIndex: 1,
            explanation:
              'AV-Blocker hemmen die Leitung über den AV-Knoten, sodass die gesamte Erregung über die akzessorische Bahn geleitet wird. Dies kann bei Vorhofflimmern zu extrem schneller Kammerfrequenz und Kammerflimmern führen.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 3: Spezielle Pathologien
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'level_3',
    title: 'Spezielle Pathologien',
    description:
      'Vertiefen Sie Ihr Wissen über anästhesierelevante EKG-Pathologien: Myokardinfarkt, Elektrolytstörungen, QT-Syndrom, Lungenembolie, Perikarditis und Medikamenteneffekte.',
    icon: '🔬',
    lessons: [
      // ── Lesson 3.1 ──
      {
        id: 'l3_01',
        title: 'Myokardinfarkt (STEMI/NSTEMI)',
        subtitle: 'ST-Hebung, Spiegelbild und Koronarzuordnung',
        ekgPattern: 'stemi_anterior',
        content: `
<h3>STEMI - ST-Hebungs-Myokardinfarkt</h3>
<p>Der <strong>STEMI</strong> ist durch eine akute, vollständige Koronararterienokklusion mit transmuraler Ischämie gekennzeichnet. Das Leitkriterium im EKG ist die <strong>ST-Hebung</strong> in mindestens zwei zusammenhängenden Ableitungen:</p>
<ul>
  <li>≥ 0,1 mV (1 mm) in Extremitätenableitungen</li>
  <li>≥ 0,2 mV (2 mm) in Brustwandableitungen (V1–V3: ≥ 0,25 mV bei Männern &lt; 40 Jahre)</li>
</ul>

<h3>Zuordnung zu Koronararterien</h3>
<ul>
  <li><strong>Anteriorer STEMI (V1–V4):</strong> LAD (Ramus interventricularis anterior). Häufig mit <em>spiegelbildlicher ST-Senkung in III und aVF</em>. Größtes Infarktareal, höchste Mortalität.</li>
  <li><strong>Inferiorer STEMI (II, III, aVF):</strong> meist RCA (rechte Koronararterie). Spiegelbildliche Senkung in I und aVL. Rechtsventrikuläre Beteiligung prüfen (V3R, V4R)!</li>
  <li><strong>Lateraler STEMI (I, aVL, V5, V6):</strong> LCx (Ramus circumflexus).</li>
  <li><strong>Posteriorer STEMI:</strong> Hohe R-Zacke und ST-Senkung in V1–V3 (spiegelbildlich). Bestätigung durch V7–V9.</li>
</ul>

<h3>NSTEMI</h3>
<p>Beim <strong>NSTEMI</strong> liegt eine subtotale Okklusion oder distale Embolisation vor. EKG-Zeichen: <strong>ST-Senkung</strong>, <strong>T-Wellen-Inversion</strong> oder unspezifische Veränderungen. Die Diagnose wird über die <strong>Troponin-Erhöhung</strong> gestellt.</p>

<h3>Infarkt-Stadien</h3>
<p>Akutstadium: ST-Hebung → Zwischenstadium: T-Negativierung, Q-Bildung → Chronisches Stadium: persistierende Q-Zacken mit normalisierten ST-Strecken.</p>

<h3>Anästhesierelevanz</h3>
<p>Perioperativer Myokardinfarkt (Typ-2-Infarkt) entsteht durch Sauerstoffangebot-Nachfrage-Mismatch. Die kontinuierliche <strong>ST-Strecken-Überwachung</strong> (besonders Ableitung II und V5) ist intraoperativ essenziell. Ein akuter STEMI erfordert die sofortige <strong>perkutane Koronarintervention (PCI)</strong>.</p>`,
        keyPoints: [
          'Anteriorer STEMI (V1–V4) = LAD, höchste Mortalität',
          'Inferiorer STEMI (II, III, aVF) = RCA, an RV-Beteiligung denken (V3R/V4R)',
          'Spiegelbildliche ST-Senkung unterstützt die Infarktdiagnose',
          'NSTEMI: ST-Senkung/T-Inversion + Troponin-Erhöhung',
          'Intraoperativ: ST-Monitoring in Ableitung II und V5',
        ],
        quiz: [
          {
            question:
              'In welchen Ableitungen zeigt ein anteriorer STEMI ST-Hebungen?',
            options: [
              'II, III, aVF',
              'V1–V4',
              'I, aVL, V5, V6',
              'aVR und V1',
            ],
            correctIndex: 1,
            explanation:
              'Der anteriore STEMI zeigt ST-Hebungen in V1–V4, dem Versorgungsgebiet der LAD (Ramus interventricularis anterior).',
          },
          {
            question:
              'Welche Koronararterie ist beim inferioren STEMI am häufigsten betroffen?',
            options: [
              'LAD',
              'Ramus circumflexus (LCx)',
              'Rechte Koronararterie (RCA)',
              'Ramus diagonalis',
            ],
            correctIndex: 2,
            explanation:
              'Der inferiore STEMI (Ableitungen II, III, aVF) wird in ca. 80 % der Fälle durch einen Verschluss der rechten Koronararterie (RCA) verursacht.',
          },
          {
            question:
              'Was zeigt eine hohe R-Zacke mit ST-Senkung in V1–V3?',
            options: [
              'Anteriorer STEMI',
              'Posteriorer STEMI (spiegelbildliche Veränderungen)',
              'Rechtsschenkelblock',
              'WPW-Syndrom',
            ],
            correctIndex: 1,
            explanation:
              'Hohe R-Zacken und ST-Senkung in V1–V3 sind die spiegelbildlichen Veränderungen eines posterioren STEMI. Zur Bestätigung können posteriore Ableitungen V7–V9 abgeleitet werden.',
          },
        ],
      },

      // ── Lesson 3.2 ──
      {
        id: 'l3_02',
        title: 'Elektrolytstörungen',
        subtitle: 'Hyper- und Hypokaliämie im EKG',
        ekgPattern: 'hyperkalemia',
        content: `
<h3>Hyperkaliämie</h3>
<p>Die <strong>Hyperkaliämie</strong> ist eine der gefährlichsten Elektrolytstörungen in der Anästhesiologie, da sie zu letalen Herzrhythmusstörungen führen kann. Die EKG-Veränderungen korrelieren grob mit dem Serumkaliumspiegel:</p>
<ul>
  <li><strong>5,5–6,5 mmol/l:</strong> <em>Spitze, zeltförmige T-Wellen</em> (frühestes Zeichen), besonders in V2–V4</li>
  <li><strong>6,5–7,5 mmol/l:</strong> Abflachung der P-Welle, PQ-Verlängerung, <em>QRS-Verbreiterung</em></li>
  <li><strong>7,5–8,0 mmol/l:</strong> P-Wellen verschwinden, QRS wird breiter (<em>Sinuswellen-Konfiguration</em>)</li>
  <li><strong>&gt; 8,0 mmol/l:</strong> Kammerflimmern, Asystolie</li>
</ul>
<p>Akuttherapie: <strong>Kalziumgluconat 10 %</strong> (10 ml i.v. über 2–3 min) als Membranstabilisator, <strong>Insulin + Glukose</strong> (Kaliumshift nach intrazellulär), Salbutamol-Inhalation, Natriumbicarbonat bei Azidose.</p>

<h3>Hypokaliämie</h3>
<p>Die <strong>Hypokaliämie</strong> (&lt; 3,5 mmol/l) verursacht charakteristische EKG-Veränderungen:</p>
<ul>
  <li><strong>U-Wellen:</strong> zusätzliche positive Welle nach der T-Welle, besonders in V2–V3</li>
  <li><strong>Abflachung der T-Wellen</strong></li>
  <li><strong>ST-Strecken-Senkung</strong></li>
  <li>Bei schwerer Hypokaliämie: QT-Verlängerung, Arrhythmien</li>
</ul>
<p>Die Hypokaliämie <strong>verstärkt die Wirkung von Digitalis</strong> und erhöht das Risiko für Digitalistoxizität. Zudem kann sie die Wirkung von nicht-depolarisierenden Muskelrelaxanzien verstärken und die Wirkung von Sugammadex verzögern.</p>

<h3>Perioperative Relevanz</h3>
<p>Ursachen perioperativer Kaliumstörungen: Massentransfusion (Hyperkaliämie durch Kaliumfreisetzung aus Erythrozyten), Succinylcholin bei Verbrennungspatienten (Hyperkaliämie), Diuretikatherapie (Hypokaliämie), Hyperventilation (Hypokaliämie durch respiratorische Alkalose mit intrazellulärem Kaliumshift). Vor elektiven Eingriffen sollte das Kalium im Normbereich <strong>(3,5–5,0 mmol/l)</strong> liegen.</p>`,
        keyPoints: [
          'Hyperkaliämie-Frühzeichen: spitze, zeltförmige T-Wellen',
          'Hyperkaliämie-Progression: QRS-Verbreiterung → Sinuswellen → Kammerflimmern/Asystolie',
          'Akuttherapie Hyperkaliämie: Kalziumgluconat, Insulin/Glukose, Salbutamol',
          'Hypokaliämie: U-Wellen, flache T-Wellen, ST-Senkung',
          'Hypokaliämie verstärkt Digitaliswirkung und erhöht Arrhythmierisiko',
        ],
        quiz: [
          {
            question:
              'Was ist das früheste EKG-Zeichen einer Hyperkaliämie?',
            options: [
              'QRS-Verbreiterung',
              'Spitze, zeltförmige T-Wellen',
              'U-Wellen',
              'P-Wellen-Verlust',
            ],
            correctIndex: 1,
            explanation:
              'Spitze, zeltförmige T-Wellen sind das früheste EKG-Zeichen der Hyperkaliämie und treten bereits bei Kaliumwerten von 5,5–6,5 mmol/l auf.',
          },
          {
            question:
              'Welches Medikament wirkt als Membranstabilisator bei schwerer Hyperkaliämie?',
            options: [
              'Natriumbicarbonat',
              'Insulin',
              'Kalziumgluconat',
              'Salbutamol',
            ],
            correctIndex: 2,
            explanation:
              'Kalziumgluconat 10 % (10 ml i.v.) stabilisiert die Kardiomyozyten-Membran und schützt vor Arrhythmien, senkt aber nicht den Kaliumspiegel.',
          },
          {
            question:
              'Welches EKG-Zeichen ist typisch für eine Hypokaliämie?',
            options: [
              'Spitze T-Wellen',
              'QRS-Verbreiterung',
              'U-Wellen nach der T-Welle',
              'Delta-Wellen',
            ],
            correctIndex: 2,
            explanation:
              'U-Wellen (zusätzliche positive Welle nach der T-Welle) sind ein charakteristisches Zeichen der Hypokaliämie, besonders sichtbar in V2–V3.',
          },
        ],
      },

      // ── Lesson 3.3 ──
      {
        id: 'l3_03',
        title: 'Langes QT-Syndrom',
        subtitle: 'QTc-Berechnung, Ursachen und Torsade-Risiko',
        ekgPattern: 'long_qt',
        content: `
<h3>Definition und QTc-Berechnung</h3>
<p>Das <strong>QT-Intervall</strong> repräsentiert die gesamte ventrikuläre De- und Repolarisation. Da es frequenzabhängig ist, muss die <strong>frequenzkorrigierte QTc</strong> berechnet werden. Die <strong>Bazett-Formel</strong> ist die gebräuchlichste: <em>QTc = QT / √RR</em> (RR in Sekunden). Normwerte: <strong>&lt; 440 ms</strong> (Männer), <strong>&lt; 460 ms</strong> (Frauen). Ab einem QTc &gt; 500 ms besteht ein <strong>hohes Risiko für Torsade de Pointes</strong>.</p>

<h3>Kongenitales Long-QT-Syndrom</h3>
<p>Genetisch bedingte Ionenkanalerkrankungen (Kanalopathien):</p>
<ul>
  <li><strong>LQT1 (KCNQ1):</strong> häufigste Form, Trigger: körperliche Belastung, Schwimmen</li>
  <li><strong>LQT2 (KCNH2/HERG):</strong> Trigger: emotionaler Stress, akustische Reize</li>
  <li><strong>LQT3 (SCN5A):</strong> Trigger: Ruhe, Schlaf; spricht auf Mexiletin an</li>
</ul>

<h3>Erworbenes Long-QT-Syndrom</h3>
<p>Häufige anästhesierelevante Ursachen:</p>
<ul>
  <li><strong>Medikamente:</strong> Amiodaron, Sotalol, Haloperidol, Droperidol, Ondansetron (dosisabhängig), Makrolid-Antibiotika, Fluconazol, Methadon, Sevofluran (minimal)</li>
  <li><strong>Elektrolytstörungen:</strong> Hypokaliämie, Hypomagnesämie, Hypokalzämie</li>
  <li><strong>Andere:</strong> Hypothermie, Hypothyreose, Bradykardie, ZNS-Pathologien</li>
</ul>

<h3>Anästhesiologische Implikationen</h3>
<p>Präoperativ: QTc-Screening, Medikamentenanamnese, Elektrolyte normalisieren. Intraoperativ: <strong>QT-verlängernde Medikamente vermeiden</strong>, Elektrolyte engmaschig kontrollieren, Sympathikusaktivierung vermeiden (tiefe Narkose, ausreichende Analgesie). Propofol und Fentanyl gelten als <strong>QT-neutral</strong>. Bei Torsade de Pointes: <strong>Magnesiumsulfat 2 g i.v.</strong> und Frequenzsteigerung (Overdrive-Pacing oder Isoprenalin).</p>`,
        keyPoints: [
          'Bazett-Formel: QTc = QT / √RR; QTc > 500 ms = hohes Torsade-Risiko',
          'Häufige QT-Verlängerer: Amiodaron, Haloperidol, Droperidol, Ondansetron',
          'Propofol und Fentanyl sind QT-neutral und sicher bei Long-QT',
          'Elektrolyte normalisieren: Kalium, Magnesium, Kalzium',
          'Torsade-Therapie: Magnesium i.v. + Frequenzsteigerung',
        ],
        quiz: [
          {
            question: 'Wie lautet die Bazett-Formel zur QTc-Berechnung?',
            options: [
              'QTc = QT × RR',
              'QTc = QT / √RR',
              'QTc = QT + RR',
              'QTc = QT × √RR',
            ],
            correctIndex: 1,
            explanation:
              'Die Bazett-Formel lautet QTc = QT / √RR (mit RR in Sekunden). Sie ist die gebräuchlichste Methode zur Frequenzkorrektur des QT-Intervalls.',
          },
          {
            question:
              'Welches Anästhetikum gilt als QT-neutral und ist bei Long-QT-Patienten sicher?',
            options: ['Sevofluran', 'Propofol', 'Haloperidol', 'Droperidol'],
            correctIndex: 1,
            explanation:
              'Propofol und Fentanyl gelten als QT-neutral und sind bei Patienten mit Long-QT-Syndrom sichere Anästhetika. Haloperidol und Droperidol verlängern die QT-Zeit.',
          },
          {
            question:
              'Ab welchem QTc-Wert besteht ein hohes Risiko für Torsade de Pointes?',
            options: ['> 400 ms', '> 440 ms', '> 500 ms', '> 600 ms'],
            correctIndex: 2,
            explanation:
              'Ab einem QTc > 500 ms besteht ein signifikant erhöhtes Risiko für Torsade de Pointes. Bereits > 440 ms (Männer) / > 460 ms (Frauen) gilt als verlängert.',
          },
        ],
      },

      // ── Lesson 3.4 ──
      {
        id: 'l3_04',
        title: 'Lungenembolie und Rechtsbelastung',
        subtitle: 'S1Q3T3 und Zeichen der akuten Rechtsherzbelastung',
        ekgPattern: 'pe',
        content: `
<h3>EKG bei Lungenembolie</h3>
<p>Die <strong>akute Lungenembolie (LE)</strong> kann vielfältige EKG-Veränderungen hervorrufen, die durch die plötzliche Druckbelastung des rechten Ventrikels entstehen. Das EKG hat eine <strong>geringe Sensitivität</strong> für die LE-Diagnose (nur ca. 20–30 % zeigen das klassische Muster), ist aber ein wichtiges Screeninginstrument.</p>

<h3>Klassische EKG-Zeichen</h3>
<ul>
  <li><strong>S1Q3T3-Muster:</strong> S-Zacke in I, Q-Zacke in III, T-Inversion in III – das bekannteste, aber nicht häufigste Zeichen</li>
  <li><strong>Sinustachykardie:</strong> häufigstes EKG-Zeichen bei LE</li>
  <li><strong>Rechtsschenkelblock</strong> (komplett oder inkomplett, neu aufgetreten)</li>
  <li><strong>P-pulmonale:</strong> spitze, hohe P-Wellen in II (&gt; 0,25 mV) als Zeichen der rechtsatrialen Belastung</li>
  <li><strong>Rechtstyp</strong> oder überdrehter Rechtstyp (Achsendrehung nach rechts)</li>
  <li><strong>T-Negativierung in V1–V4:</strong> Zeichen der rechtsventrikulären Belastung (Strain-Muster)</li>
  <li><strong>ST-Hebung in aVR:</strong> Zeichen der globalen subendokardialen Ischämie</li>
</ul>

<h3>Differenzialdiagnostische Abgrenzung</h3>
<p>Die EKG-Veränderungen bei LE können einen <strong>akuten Myokardinfarkt imitieren</strong> (ST-Hebung, T-Inversion, Q-Zacken). Entscheidend ist der klinische Kontext: plötzliche Dyspnoe, Thoraxschmerz, Tachykardie, Hypoxie und Hypotension bei Risikopatienten (Immobilisation, postoperativ, Thrombophilie) sollten an eine LE denken lassen.</p>

<h3>Perioperative Bedeutung</h3>
<p>Die perioperative LE ist eine der häufigsten vermeidbaren Todesursachen. Bei Verdacht: <strong>CT-Angiographie</strong> (Goldstandard), Echokardiographie (RV-Dilatation), D-Dimere (hoher negativer Vorhersagewert). Akuttherapie: <strong>Heparin-Bolus</strong>, hämodynamische Stabilisierung, bei massiver LE: <strong>systemische Thrombolyse</strong> oder kathetergestützte Therapie.</p>`,
        keyPoints: [
          'Sinustachykardie ist das häufigste EKG-Zeichen bei Lungenembolie',
          'S1Q3T3: S in I, Q in III, T-Inversion in III (klassisch, aber selten komplett)',
          'Neu aufgetretener Rechtsschenkelblock + Tachykardie: an LE denken!',
          'T-Negativierung V1–V4: rechtsventrikuläres Strain-Muster',
          'EKG-Sensitivität bei LE gering; klinischer Kontext entscheidend',
        ],
        quiz: [
          {
            question:
              'Was ist das häufigste EKG-Zeichen bei einer akuten Lungenembolie?',
            options: [
              'S1Q3T3-Muster',
              'Sinustachykardie',
              'Kompletter Rechtsschenkelblock',
              'ST-Hebung in V1–V4',
            ],
            correctIndex: 1,
            explanation:
              'Die Sinustachykardie ist das häufigste EKG-Zeichen bei Lungenembolie. Das S1Q3T3-Muster ist zwar bekannt, aber nur in einer Minderheit der Fälle vollständig ausgeprägt.',
          },
          {
            question: 'Wofür steht das S1Q3T3-Muster?',
            options: [
              'S-Zacke in I, Q-Zacke in III, T-Inversion in III',
              'ST-Hebung in I, Q-Zacke in III, T-Welle in III',
              'S-Zacke in V1, Q-Zacke in V3, T-Inversion in V3',
              'S-Hebung in I, Q-Senkung in III, Tachykardie',
            ],
            correctIndex: 0,
            explanation:
              'S1Q3T3 beschreibt eine tiefe S-Zacke in Ableitung I, eine Q-Zacke in Ableitung III und eine T-Wellen-Inversion in Ableitung III.',
          },
          {
            question:
              'Was zeigt ein P-pulmonale im EKG an?',
            options: [
              'Linksatriale Hypertrophie',
              'Rechtsatriale Belastung',
              'Ventrikuläre Hypertrophie',
              'AV-Blockierung',
            ],
            correctIndex: 1,
            explanation:
              'Ein P-pulmonale (spitze, hohe P-Wellen > 0,25 mV in Ableitung II) ist ein Zeichen der rechtsatrialen Belastung, wie sie bei Lungenembolie oder pulmonaler Hypertonie auftreten kann.',
          },
        ],
      },

      // ── Lesson 3.5 ──
      {
        id: 'l3_05',
        title: 'Perikarditis',
        subtitle: 'Diffuse ST-Hebung und Abgrenzung zum STEMI',
        ekgPattern: 'pericarditis',
        content: `
<h3>EKG bei akuter Perikarditis</h3>
<p>Die <strong>akute Perikarditis</strong> verursacht charakteristische EKG-Veränderungen, die durch die Entzündung des epikardialen Myokards entstehen. Die Perikarditis durchläuft typischerweise vier EKG-Stadien, wobei das erste Stadium diagnostisch am wichtigsten ist.</p>

<h3>Die vier EKG-Stadien</h3>
<ul>
  <li><strong>Stadium I (Stunden bis Tage):</strong> Diffuse, konkave ST-Hebung in fast allen Ableitungen, <strong>PR-Senkung</strong> (frühestes Zeichen!), spiegelbildliche Veränderungen <em>nur in aVR</em> (ST-Senkung, PR-Hebung) und gelegentlich V1.</li>
  <li><strong>Stadium II (Tage):</strong> Normalisierung der ST-Strecke, Abflachung der T-Wellen.</li>
  <li><strong>Stadium III (Wochen):</strong> Diffuse T-Wellen-Inversionen bei normaler ST-Strecke.</li>
  <li><strong>Stadium IV (Wochen bis Monate):</strong> Normalisierung des EKGs.</li>
</ul>

<h3>Unterscheidung Perikarditis vs. STEMI</h3>
<p>Die Differenzierung ist klinisch äußerst wichtig:</p>
<ul>
  <li><strong>Perikarditis:</strong> diffuse, <em>konkave</em> (sattelförmige) ST-Hebung, PR-Senkung, <strong>keine spiegelbildlichen ST-Senkungen</strong> (außer aVR/V1), keine pathologischen Q-Zacken, keine Zuordnung zu einem Koronargebiet.</li>
  <li><strong>STEMI:</strong> lokalisierte, <em>konvexe</em> ST-Hebung in einem Koronarversorgungsgebiet, <strong>spiegelbildliche ST-Senkung</strong> in gegenüberliegenden Ableitungen, pathologische Q-Zacken-Entwicklung.</li>
</ul>
<p>Ein hilfreiches Kriterium: Die <strong>ST-Hebung/T-Wellen-Amplitude-Ratio &gt; 0,25</strong> in Ableitung V6 spricht für eine Perikarditis.</p>

<h3>Anästhesierelevanz</h3>
<p>Bei Perikarditis mit <strong>Perikarderguss</strong> besteht die Gefahr einer <strong>Perikardtamponade</strong>: Tachykardie, niedrige QRS-Amplitude, <em>elektrischer Alternans</em> (alternierende QRS-Amplitude). Die Narkoseeinleitung bei Tamponade erfordert besondere Vorsicht (Vermeidung von Sympathikolyse, Ketamin als Einleitungsmittel erwägen).</p>`,
        keyPoints: [
          'Perikarditis: diffuse konkave ST-Hebung + PR-Senkung (frühestes Zeichen)',
          'Spiegelbildliche Veränderungen NUR in aVR (und ggf. V1)',
          'STEMI: lokalisierte konvexe ST-Hebung + spiegelbildliche Senkung + Q-Zacken',
          'Elektrischer Alternans: Hinweis auf Perikarderguss/Tamponade',
          'Perikardtamponade: Ketamin als Einleitungsmittel erwägen',
        ],
        quiz: [
          {
            question:
              'Was ist das früheste EKG-Zeichen einer akuten Perikarditis?',
            options: [
              'ST-Hebung in V1–V4',
              'PR-Senkung',
              'T-Wellen-Inversion',
              'Pathologische Q-Zacken',
            ],
            correctIndex: 1,
            explanation:
              'Die PR-Senkung (PR-Strecken-Depression) ist das früheste EKG-Zeichen der akuten Perikarditis und entsteht durch die Entzündung des atrialen Epikards.',
          },
          {
            question:
              'Wie unterscheidet sich die ST-Hebung bei Perikarditis von der bei STEMI?',
            options: [
              'Perikarditis: konvex, lokalisiert; STEMI: konkav, diffus',
              'Perikarditis: diffus, konkav; STEMI: lokalisiert, konvex',
              'Kein Unterschied in der ST-Morphologie',
              'Perikarditis zeigt immer spiegelbildliche ST-Senkungen',
            ],
            correctIndex: 1,
            explanation:
              'Perikarditis zeigt eine diffuse, konkave (sattelförmige) ST-Hebung ohne koronare Zuordnung. STEMI zeigt eine lokalisierte, konvexe ST-Hebung in einem Koronarversorgungsgebiet mit spiegelbildlichen Senkungen.',
          },
          {
            question:
              'Was deutet ein elektrischer Alternans im EKG an?',
            options: [
              'Vorhofflimmern',
              'Perikarderguss mit drohender Tamponade',
              'Hyperkaliämie',
              'Digitalisintoxikation',
            ],
            correctIndex: 1,
            explanation:
              'Elektrischer Alternans (alternierende QRS-Amplitude) ist ein klassisches Zeichen eines hämodynamisch relevanten Perikardergusses und deutet auf eine drohende Perikardtamponade hin.',
          },
        ],
      },

      // ── Lesson 3.6 ──
      {
        id: 'l3_06',
        title: 'Medikamenteneffekte im EKG',
        subtitle: 'Digitalis, Betablocker, Amiodaron und Kalziumkanalblocker',
        ekgPattern: 'digitalis',
        content: `
<h3>Digitalis (Digoxin/Digitoxin)</h3>
<p><strong>Digitalis</strong> verursacht charakteristische EKG-Veränderungen durch Erhöhung des Vagotonus und direkte Wirkung auf Kardiomyozyten:</p>
<ul>
  <li><strong>Muldenförmige ST-Senkung</strong> (Digitalis-Effekt, "Badewannen-Zeichen") – kein Zeichen einer Toxizität, sondern therapeutischer Effekt</li>
  <li>T-Wellen-Abflachung oder -Inversion</li>
  <li>PQ-Verlängerung (verstärkter Vagotonus am AV-Knoten)</li>
  <li>Verkürztes QT-Intervall</li>
</ul>
<p>Bei <strong>Digitalistoxizität</strong> treten Arrhythmien auf: ventrikuläre Extrasystolen, bigeminale Rhythmen, junktionale Tachykardie, AV-Blockierungen, bidirektionale VT. Hypokaliämie verstärkt die Toxizität! Therapie: <strong>Digitalis-Antikörper (Fab-Fragmente)</strong>, Kalium normalisieren, temporärer Schrittmacher bei Bradykardie.</p>

<h3>Betablocker</h3>
<p><strong>Betablocker</strong> senken die Herzfrequenz (Sinusbradykardie), verlängern die PQ-Zeit und können AV-Blockierungen verursachen. Die Wirkung auf das EKG ist dosisabhängig. Im perioperativen Setting ist die Betablocker-Dauertherapie fortzuführen, um Rebound-Tachykardien und Ischämien zu vermeiden.</p>

<h3>Amiodaron</h3>
<p><strong>Amiodaron</strong> ist ein Klasse-III-Antiarrhythmikum mit breitem Wirkmechanismus (blockiert Na+-, K+-, Ca²+- Kanäle und Beta-Rezeptoren):</p>
<ul>
  <li><strong>QT-Verlängerung</strong> (dosisabhängig, aber geringeres Torsade-Risiko als bei anderen Klasse-III-Antiarrhythmika)</li>
  <li>Sinusbradykardie, PQ-Verlängerung</li>
  <li>Breitere T-Wellen, U-Wellen</li>
  <li>Bei Langzeittherapie: Schilddrüsenfunktionsstörungen beachten</li>
</ul>

<h3>Kalziumkanalblocker (Verapamil, Diltiazem)</h3>
<p><strong>Verapamil und Diltiazem</strong> (Nicht-Dihydropyridin-Typ) wirken am AV-Knoten und verursachen:</p>
<ul>
  <li>Sinusbradykardie</li>
  <li>PQ-Verlängerung bis zum AV-Block</li>
  <li>Frequenzsenkung bei Vorhofflimmern/Vorhofflattern</li>
</ul>
<p>Cave: Die Kombination mit Betablockern kann zu <strong>schwerer Bradykardie und AV-Blockierung</strong> führen. Nifedipin (Dihydropyridin) hat keinen relevanten Effekt auf das Reizleitungssystem.</p>

<h3>Zusammenfassung für die Anästhesie</h3>
<p>Präoperativ sollte die EKG-Interpretation immer unter Berücksichtigung der <strong>Dauermedikation</strong> erfolgen. Muldenförmige ST-Senkungen bei Digitalis-Patienten sind kein Ischämiezeichen, Bradykardie unter Betablockern kein Grund zur Panik, und eine QT-Verlängerung unter Amiodaron erfordert Aufmerksamkeit bei der Wahl weiterer Medikamente.</p>`,
        keyPoints: [
          'Digitalis-Effekt: muldenförmige ST-Senkung ("Badewannen-Zeichen"), kein Toxizitätszeichen',
          'Digitalistoxizität: Arrhythmien (VES, Bigeminus, AV-Block), Therapie mit Fab-Fragmenten',
          'Amiodaron: QT-Verlängerung, aber relativ geringes Torsade-Risiko',
          'Verapamil + Betablocker: Gefahr schwerer Bradykardie/AV-Block',
          'Betablocker-Dauertherapie perioperativ fortsetzen (Rebound-Gefahr)',
        ],
        quiz: [
          {
            question:
              'Was beschreibt der typische "Digitalis-Effekt" im EKG?',
            options: [
              'Spitze T-Wellen in V2–V4',
              'Muldenförmige ST-Senkung',
              'ST-Hebung in allen Ableitungen',
              'Delta-Wellen',
            ],
            correctIndex: 1,
            explanation:
              'Der typische Digitalis-Effekt zeigt sich als muldenförmige ST-Senkung ("Badewannen-Zeichen"). Dies ist ein therapeutischer Effekt und kein Zeichen einer Toxizität.',
          },
          {
            question:
              'Welche Elektrolytstörung verstärkt die Digitalistoxizität?',
            options: [
              'Hyperkaliämie',
              'Hypernatriämie',
              'Hypokaliämie',
              'Hypermagnesämie',
            ],
            correctIndex: 2,
            explanation:
              'Hypokaliämie verstärkt die Digitaliswirkung erheblich, da Kalium und Digitalis um die gleiche Bindungsstelle an der Na+/K+-ATPase konkurrieren. Bei niedrigem Kalium ist die Digitalis-Bindung stärker.',
          },
          {
            question:
              'Warum sollte die perioperative Betablocker-Dauertherapie fortgesetzt werden?',
            options: [
              'Betablocker verbessern die Narkosetiefe',
              'Abruptes Absetzen kann zu Rebound-Tachykardie und Ischämie führen',
              'Betablocker verhindern Übelkeit postoperativ',
              'Betablocker senken das Infektionsrisiko',
            ],
            correctIndex: 1,
            explanation:
              'Das abrupte Absetzen von Betablockern kann zu einer Rebound-Tachykardie mit konsekutiver myokardialer Ischämie führen (Beta-Rezeptor-Upregulation). Die Dauertherapie wird daher perioperativ fortgesetzt.',
          },
        ],
      },
    ],
  },
];
