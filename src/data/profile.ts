import type { Profile } from './types'

/**
 * SINGLE SOURCE OF TRUTH.
 *
 * Every fact here is traceable to Ayomide's CV, his GitHub repositories, or the
 * repository READMEs and commit history. Nothing is inferred, rounded up, or
 * invented — where a metric does not exist in the source material, no metric is
 * stated. Update this file and both the website and all four CVs follow.
 *
 * Sources:
 *   - Ayomide_Abilewa_CV.docx
 *   - github.com/ayomide-abilewa/aniwe (README + source tree)
 *   - github.com/ayomide-abilewa/Smart-Attendance-System (README + source tree)
 */
export const profile: Profile = {
  identity: {
    name: 'Ayomide Abilewa',
    title: 'Electronic and Electrical Engineering student, focused on embedded systems and instrumentation',
    location: 'Lekki, Lagos, Nigeria',
    email: 'abilewaayomide@gmail.com',
    // On /contact and in every generated CV document.
    phone: '09066021641',
    links: {
      github: {
        label: 'GitHub',
        href: 'https://github.com/ayomide-abilewa',
        cvText: 'github.com/ayomide-abilewa',
      },
      linkedin: {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/ayomide-abilewa-443aa9313/',
        cvText: 'linkedin.com/in/ayomide-abilewa-443aa9313',
      },
      site: {
        label: 'Portfolio',
        href: 'https://ayomide-abilewa.github.io',
        cvText: 'ayomide-abilewa.github.io',
      },
    },
  },

  /**
   * One summary per CV variant. Written to sound like a person, not a template:
   * no "passionate", no "leveraging", no "at the intersection of".
   *
   * All four are written in the implied first person — the CV convention. No "I",
   * because a CV summary does not need it, and no "he", because writing about
   * yourself in the third person on your own document reads as a press release.
   *
   * None of them opens by naming the degree, and that is the rule worth keeping.
   * `identity.title` prints "Electronic and Electrical Engineering student" two
   * lines above, and in three of the four variants the education entry states the
   * degree and the institution immediately below — so a summary beginning
   * "Electronic and electrical engineering student at Obafemi Awolowo University"
   * put one fact on the page three times inside six lines. That is what two
   * correct fields concatenated look like, and it happened in the most valuable
   * space on the document. Each of these opens instead on what its reader cannot
   * get from the header: the design habit, the research question, the teaching,
   * the range.
   *
   * Punctuation matters as much as vocabulary here. A pair of em dashes bracketing
   * an aside can make the summaries feel overly formal, so these
   * use the ordinary marks a person reaches for: colons, commas, full stops. The
   * sentences are also deliberately uneven in length, because real writing is.
   */
  summaries: {
    technical:
      'Builds embedded and computer-vision systems, with a habit of designing for the conditions that break them: poor lighting, no network, unreliable input. Currently rotating through the electrical and instrumentation team at Chevron Nigeria, working with the control loops and signal standards behind the same measurement problems at industrial scale.',
    research:
      'Most of the work so far has gone into measurement and detection under non-ideal conditions. Recent projects: a two-stage cascaded detector that fuses RGB and edge-enhanced models for pipe anomaly identification, a multi-sensor multispectral acquisition node, and control-systems practice on Quanser robotics hardware using MATLAB and Simulink.',
    scholarship:
      'Has taught electronics since 2023, alongside the degree rather than after it. Leads SPAW 3.0, a six-session embedded systems and entrepreneurship curriculum for secondary school students, and instructs a practical electronics workshop for students with no prior background. Currently interning on Chevron Nigeria’s electrical and instrumentation team.',
    general:
      'Works across embedded systems, instrumentation and computer vision. Has built sensing and detection systems from microcontroller nodes up to full-stack applications, and has taught electronics to secondary school students since 2023. Currently interning on Chevron Nigeria’s electrical and instrumentation team.',
  },

  education: [
    {
      institution: 'Obafemi Awolowo University',
      shortName: 'OAU',
      degree: 'B.Sc.',
      field: 'Electronic and Electrical Engineering',
      location: 'Ile-Ife, Osun State, Nigeria',
      start: '2021',
      end: '2027',
      expected: true,
      coursework: [
        'Control Systems',
        'Measurement and Instrumentation',
        'Digital Electronics',
        'Signal Processing',
        'Power Systems',
        'Microprocessors and Embedded Systems',
        'Electronic Circuit Design',
      ],
      bullets: [],
    },
  ],

  experience: [
    {
      id: 'chevron',
      role: 'Facilities Engineering Management Intern (SIWES)',
      organisation: 'Chevron Nigeria Limited',
      location: 'Lagos, Nigeria',
      start: 'Mar 2026',
      end: 'Present',
      current: true,
      summary:
        'Rotating across the Electrical and Instrumentation team, working on oil and gas field instrumentation and electrical systems.',
      bullets: [
        {
          text: 'Rotating through the Electrical and Instrumentation (E&I) team on field instrumentation and electrical systems.',
          emphasis: ['technical', 'research', 'scholarship', 'general'],
        },
        {
          text: 'Read P&IDs before fieldwork; traced control loop configurations, I/P converters and 3–15 PSI pneumatic signalling.',
          emphasis: ['technical', 'research', 'general'],
        },
        {
          text: 'On the electrical side: single line diagrams, ESP systems, power transmission, circuit breaker specification.',
          emphasis: ['technical', 'general'],
        },
        {
          text: 'Hazardous area classification, arc flash awareness, bonding and grounding.',
          emphasis: ['technical', 'scholarship', 'general'],
        },
        {
          text: 'Chevron compliance training via Workday: Operational Excellence, Cyber Security, Data Privacy, Business Conduct and Ethics.',
          emphasis: ['scholarship', 'general'],
        },
        {
          text: 'A weekly SIWES logbook of field observations and system walkthroughs.',
          emphasis: ['scholarship'],
        },
      ],
      skills: [
        'P&ID interpretation',
        'PID control loops',
        'I/P converters',
        '4–20 mA and 3–15 PSI standards',
        'SLD interpretation',
        'Hazardous area classification',
        'Arc flash safety',
      ],
      rank: { engineering: 1, research: 3, scholarship: 2, everything: 1 },
    },
    {
      id: 'quanser',
      role: 'Research and Development Intern (SIWES)',
      organisation: 'ACE Quanser Robotics Lab, Obafemi Awolowo University',
      location: 'Ile-Ife, Nigeria',
      start: '2024',
      end: '2024',
      current: false,
      summary:
        'Operated three Quanser research platforms using MATLAB and Simulink: a quadrotor UAV, an autonomous ground vehicle and a 6-DOF manipulator.',
      bullets: [
        {
          text: 'Operated three Quanser platforms in MATLAB and Simulink: the QDrone quadrotor, the QCar ground vehicle, the QArm 6-DOF manipulator.',
          emphasis: ['technical', 'research', 'scholarship', 'general'],
        },
        {
          text: 'PID control and sensor feedback tuned on live hardware, not in simulation.',
          emphasis: ['technical', 'research', 'general'],
        },
        {
          text: 'Gave the lab orientation talk on the Quanser Aero 2: architecture, control principles, safety.',
          emphasis: ['research', 'scholarship', 'general'],
        },
      ],
      skills: ['MATLAB', 'Simulink', 'PID control', 'Sensor feedback', 'Real-time systems'],
      rank: { engineering: 3, research: 1, scholarship: 3, everything: 2 },
    },
    {
      id: 'astar',
      role: 'Embedded Systems and EEE Tutor',
      organisation: 'Astar Tutorials',
      location: 'Ile-Ife, Nigeria',
      start: '2023',
      end: 'Present',
      current: true,
      summary:
        'Teaches circuit analysis, digital logic and microcontroller programming, designing the tutorial sessions from scratch.',
      bullets: [
        {
          text: 'Teach circuit analysis, digital logic and microcontroller programming to engineering undergraduates.',
          emphasis: ['technical', 'scholarship', 'general'],
        },
        {
          text: 'Sessions are sequenced so the theory arrives just before a student needs it to make a circuit work.',
          emphasis: ['scholarship', 'general'],
        },
      ],
      skills: ['Circuit analysis', 'Digital logic', 'Microcontroller programming', 'Teaching'],
      rank: { engineering: 4, research: 4, scholarship: 1, everything: 3 },
    },
  ],

  projects: [
    // ------------------------------------------------------------------
    // ANIWE — the strongest documented engineering artifact. Engineering path only,
    // per Ayomide's instruction.
    // ------------------------------------------------------------------
    {
      slug: 'aniwe',
      name: 'aniwe',
      tagline:
        'A convention costume-rating booth with AI hosts that stay in character, keep their scoring honest, and degrade in three tiers so the demo never dies on venue wifi.',
      period: 'Aug 2026',
      status: 'shipped',
      repo: 'https://github.com/ayomide-abilewa/aniwe',
      technologies: [
        'Python',
        'Streamlit',
        'OpenRouter',
        'Vision-language models',
        'ElevenLabs',
        'Piper',
        'faster-whisper',
        'Web Audio API',
        'Ollama',
      ],
      domains: ['Computer vision', 'Applied AI', 'Audio', 'Systems reliability'],
      problem:
        'A costume-rating booth at a convention has to work in the worst possible conditions for software: shared wifi that may be blocked entirely, a hall too loud for voice activity detection, a queue of people who will not wait, and a laptop that gets set up five minutes before doors open. It also has to be entertaining enough that people queue at all.',
      why:
        'Built as a booth experience rather than a demo. That framing forced every design decision to answer a specific way the evening could go wrong, which is a more interesting engineering constraint than accuracy alone.',
      approach: [
        'Ten original hosts with distinct voices, among them a tsundere rival and a Nigerian hype-man mixing Pidgin with anime slang. Each is paired with a per-session mood and quirk, giving roughly five hundred behavioural combinations.',
        'A vision-language model scores a photo across seven criteria out of ten, which collapse into a single score out of one hundred and a rank letter from S down to D.',
        'Scoring is deliberately held constant across hosts: personality changes the delivery, never the number.',
        'Text-to-speech degrades through three tiers, and speech-to-text runs locally so a blocked network only costs quality, never function.',
        'A 214-test offline suite runs in about one and a half seconds with no network, no model downloads, no camera and state redirected to a temp directory.',
      ],
      architecture: {
        caption:
          'Photo in, spoken verdict out. Every external dependency has a local fallback beneath it.',
        cols: 4,
        rows: 4,
        nodes: [
          { id: 'cam', label: 'Photo capture', kind: 'sensor', detail: 'Streamlit', col: 0, row: 1 },
          { id: 'mic', label: 'Push-to-talk', kind: 'sensor', detail: 'st.audio_input', col: 0, row: 3 },
          { id: 'vision', label: 'Vision scoring', kind: 'model', detail: 'OpenRouter VLM', col: 1, row: 1 },
          { id: 'persona', label: 'Persona + mood', kind: 'compute', detail: 'personas.py', col: 1, row: 0 },
          { id: 'stt', label: 'Local STT', kind: 'model', detail: 'faster-whisper base int8', col: 1, row: 3 },
          { id: 'prompt', label: 'Prompt assembly', kind: 'compute', detail: 'prompt.py', col: 2, row: 0 },
          { id: 'score', label: 'Score normalise', kind: 'compute', detail: '7 × /10 → /100 + rank', col: 2, row: 1 },
          { id: 'state', label: 'Anti-repeat state', kind: 'storage', detail: '.aniwe_state.json', col: 2, row: 2 },
          { id: 'tts', label: 'TTS chain', kind: 'service', detail: 'ElevenLabs → Piper → browser', col: 3, row: 1 },
          { id: 'sfx', label: 'Synthesised SFX', kind: 'output', detail: 'Web Audio, no files', col: 3, row: 2 },
          { id: 'audio', label: 'Spoken verdict', kind: 'output', col: 3, row: 3 },
        ],
        edges: [
          { from: 'cam', to: 'vision', kind: 'data' },
          { from: 'persona', to: 'prompt', kind: 'control' },
          { from: 'vision', to: 'score', kind: 'data' },
          { from: 'prompt', to: 'vision', kind: 'control' },
          { from: 'state', to: 'persona', label: 'rotate', kind: 'control' },
          { from: 'score', to: 'tts', kind: 'data' },
          { from: 'mic', to: 'stt', kind: 'data' },
          { from: 'stt', to: 'prompt', kind: 'data' },
          { from: 'tts', to: 'audio', kind: 'signal' },
          { from: 'sfx', to: 'audio', kind: 'signal' },
        ],
      },
      challenges: [
        'All seven scores read aloud ran over a minute, which is far too long with a queue waiting.',
        'Convention halls are loud enough that voice activity detection false-triggers constantly.',
        'The venue ISP blocked files.pythonhosted.org, so a normal pip install could not complete on site.',
        'Models occasionally return half-written JSON, which would crash scoring at the worst moment.',
        'Model reason text ran long and broke the pacing of the spoken verdict.',
      ],
      decisions: [
        {
          choice: 'Trim the spoken verdict to a headline plus the best and worst category.',
          because: 'Reading all seven scores took over a minute and lost the queue.',
        },
        {
          choice: 'Keep scores identical across all ten hosts; only the delivery changes.',
          because: 'A booth that rates the same costume 60 and then 85 stops being believable.',
        },
        {
          choice: 'Push-to-talk with local faster-whisper rather than always-on voice detection.',
          because: 'Convention hall noise false-triggers VAD, and local inference survives a blocked network.',
        },
        {
          choice: 'Three-tier TTS: ElevenLabs, then offline Piper, then browser speech.',
          because: 'The bottom tier cannot fail, so the booth always has a voice.',
        },
        {
          choice: 'Synthesise every sound effect with the Web Audio API instead of shipping audio files.',
          because: 'No asset licensing, nothing to download, and it works with wifi switched off.',
        },
        {
          choice: 'Cap reason length twice — once in the prompt, once as a hard ceiling in code.',
          because: 'Prompt instructions are a request; the code ceiling is a guarantee.',
        },
        {
          choice: 'Treat local Ollama as an emergency brake, not a demo mode.',
          because: 'At 30–90 seconds per photo it keeps the booth alive but is not an experience anyone should queue for.',
        },
      ],
      results: [
        '214 offline tests run in roughly 1.5 seconds, so the suite is usable on the venue laptop minutes before doors open.',
        'Tests cover JSON repair for truncated model output, reason trimming, persona rotation, rank boundaries and the network fallback chain with the HTTP layer faked.',
        'Roughly 1.5k prompt and 500 completion tokens per rating — under a cent per visitor.',
        'Per-host voices fall back to a house voice automatically, once, and remember the failure for the rest of the session.',
      ],
      learned: [
        'Designing each feature against a specific failure mode produces a system you can actually trust in the field, and it makes the code easier to explain.',
        'A fast offline test suite is a deployment feature, not just a development one — it is what makes it safe to change something under time pressure.',
        'Constraining a model twice, in the prompt and again in code, is the only way to make output length a guarantee.',
      ],
      rank: { engineering: 1, everything: 1 },
      framing: {
        engineering:
          'The clearest example of how I work: every feature in this repository exists because of a specific way the evening could have gone wrong.',
        everything:
          'A convention booth that had to survive blocked wifi, a loud hall and a five-minute setup window.',
      },
      bullets: [
        {
          text: 'Shipped a convention costume-rating booth in Python and Streamlit: ten hosts, per-session mood and quirk variation, vision-language scoring over seven criteria.',
          emphasis: ['technical', 'general'],
        },
        {
          text: 'Text-to-speech falls through three tiers (ElevenLabs, offline Piper, browser speech) and speech-to-text runs locally, so a blocked network costs quality and nothing else.',
          emphasis: ['technical', 'general'],
        },
        {
          text: '214 offline tests, 1.5 seconds, no network or camera required — truncated-JSON repair, persona rotation, rank boundaries, the whole fallback chain.',
          emphasis: ['technical'],
        },
      ],
    },

    // ------------------------------------------------------------------
    // SMART ATTENDANCE — the cross-path anchor. Appears everywhere.
    // ------------------------------------------------------------------
    {
      slug: 'smart-attendance-system',
      name: 'AI-Powered Smart Attendance System',
      tagline:
        'Face-recognition attendance for real lecture halls — detection, embedding and cosine matching behind a full-stack application built for lecturers, not for a benchmark.',
      period: 'Feb–Mar 2026',
      status: 'complete',
      statusNote: 'Defended at a final-year group project review; invited to develop an extended production version.',
      repo: 'https://github.com/ayomide-abilewa/Smart-Attendance-System',
      technologies: [
        'Python',
        'OpenCV',
        'YuNet',
        'SFace',
        'Flask',
        'SQLAlchemy',
        'PostgreSQL',
        'React',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
      ],
      domains: ['Computer vision', 'Full-stack', 'Applied AI'],
      team: 'Group project',
      problem:
        'Manual attendance in large lecture halls is slow, easy to falsify, and produces records nobody can audit later. A recognition system that only works on clean frontal portraits does not solve it, because a real classroom gives you uneven lighting, off-axis faces and students moving through frame.',
      why:
        'Built as a system a lecturer could actually run for a course: enrolment, sessions, cooldown windows, exportable records — not just a recognition script.',
      approach: [
        'YuNet for face detection and SFace for embedding generation, with cosine similarity matching against enrolled students.',
        'A Flask REST API over SQLAlchemy handling authentication, course creation and enrolment, face setup, session management and attendance capture.',
        'A React, TypeScript and Tailwind frontend with separate student and lecturer flows.',
        'Attendance taken either from an uploaded image or from live capture, with a configurable cooldown so one student cannot be counted repeatedly in a session.',
        'CSV and PDF export so the record leaves the system in a form an institution already accepts.',
      ],
      architecture: {
        caption:
          'Two capture routes into one recognition path, with the matching threshold and cooldown configurable per deployment.',
        cols: 4,
        rows: 3,
        nodes: [
          { id: 'live', label: 'Live capture', kind: 'sensor', detail: 'Camera', col: 0, row: 0 },
          { id: 'upload', label: 'Image upload', kind: 'sensor', detail: 'Lecturer client', col: 0, row: 2 },
          { id: 'ui', label: 'React client', kind: 'ui', detail: 'TypeScript, Vite, Tailwind', col: 1, row: 1 },
          { id: 'api', label: 'Flask REST API', kind: 'service', detail: 'SQLAlchemy', col: 2, row: 1 },
          { id: 'detect', label: 'Face detection', kind: 'model', detail: 'YuNet', col: 2, row: 0 },
          { id: 'embed', label: 'Embedding', kind: 'model', detail: 'SFace', col: 3, row: 0 },
          { id: 'match', label: 'Cosine match', kind: 'compute', detail: 'vs enrolled set', col: 3, row: 1 },
          { id: 'db', label: 'PostgreSQL', kind: 'storage', detail: 'Students, courses, sessions', col: 2, row: 2 },
          { id: 'export', label: 'CSV / PDF export', kind: 'output', col: 3, row: 2 },
        ],
        edges: [
          { from: 'live', to: 'ui', kind: 'data' },
          { from: 'upload', to: 'ui', kind: 'data' },
          { from: 'ui', to: 'api', kind: 'data' },
          { from: 'api', to: 'detect', kind: 'data' },
          { from: 'detect', to: 'embed', kind: 'data' },
          { from: 'embed', to: 'match', kind: 'data' },
          { from: 'match', to: 'db', kind: 'data' },
          { from: 'api', to: 'db', kind: 'data' },
          { from: 'db', to: 'export', kind: 'data' },
        ],
      },
      challenges: [
        'Classroom lighting and off-axis faces are far less forgiving than the clean portraits recognition models are usually demonstrated on.',
        'A single student passing the camera twice should not produce two attendance records.',
        'Lecturers and students need genuinely different interfaces over the same data.',
      ],
      decisions: [
        {
          choice: 'YuNet and SFace through OpenCV rather than a heavier deep-learning stack.',
          because: 'They run acceptably without dedicated GPU hardware, which is what the deployment environment actually has.',
        },
        {
          choice: 'Cosine similarity against stored embeddings rather than retraining a classifier per class.',
          because: 'Enrolling a new student becomes adding one embedding, not retraining a model.',
        },
        {
          choice: 'A configurable cooldown window rather than a single-shot capture.',
          because: 'Students move through frame repeatedly; the record has to stay one row per student per session.',
        },
        {
          choice: 'Liveness checks behind environment flags.',
          because: 'The requirement differs by institution, so it had to be switchable without a code change.',
        },
      ],
      results: [
        'End-to-end system covering student and lecturer authentication, course creation and enrolment, face setup, session management and attendance capture.',
        'Attendance records export to CSV and PDF.',
        'Defended at a final-year group project review and invited to develop an extended production version.',
      ],
      learned: [
        'The recognition model was the smaller half of the problem; enrolment, session state and exportable records were what made it usable.',
        'Configuration flags for institution-specific requirements are worth building early, because the requirement always varies.',
      ],
      rank: { engineering: 2, research: 3, scholarship: 2, everything: 2 },
      framing: {
        engineering:
          'A complete system rather than a model demo: detection, embedding, matching, session state and export, front to back.',
        research:
          'A recognition pipeline evaluated in an operating classroom rather than on curated frontal portraits.',
        scholarship:
          'Built to remove a daily friction from lecture halls, and taken far enough that the reviewers asked for a production version.',
      },
      bullets: [
        {
          text: 'Owned the vision pipeline and the Flask REST API: YuNet detection, SFace recognition, cosine-similarity matching.',
          emphasis: ['technical', 'research', 'general'],
        },
        {
          text: 'Built the React and TypeScript frontend over a PostgreSQL schema for students, courses, enrolment, sessions and attendance.',
          emphasis: ['technical', 'general'],
        },
        {
          text: 'Tested against real lecture-hall lighting and off-axis faces, not curated frontal shots.',
          emphasis: ['research'],
        },
        {
          text: 'Defended it at the final-year project review; invited afterwards to build a production version.',
          emphasis: ['technical', 'research', 'scholarship', 'general'],
        },
        {
          text: 'CSV and PDF export, because the records have to reach the systems a department already runs on.',
          emphasis: ['scholarship'],
        },
      ],
    },

    // ------------------------------------------------------------------
    // PIPE ANOMALY — leads the research path.
    // ------------------------------------------------------------------
    {
      slug: 'pipe-anomaly-detection',
      name: 'Live Video Pipe Anomaly Detection',
      tagline:
        'A two-stage cascaded detector that runs RGB and edge-enhanced models in parallel and fuses their boxes, so precision holds up across lighting and surface conditions.',
      period: '2026–Present',
      status: 'in-progress',
      statusNote: 'In progress. No public repository yet.',
      technologies: ['Python', 'YOLOv8', 'YOLOv11', 'Weighted Boxes Fusion', 'OpenCV'],
      domains: ['Computer vision', 'Industrial inspection', 'Applied AI'],
      problem:
        'Pipe inspection footage varies enormously: lighting changes along the run, surfaces are wet, corroded or coated, and a single detector tuned for one of those conditions loses precision on the others.',
      why:
        'Targeting industrial inspection, where a missed anomaly and a false alarm both carry real cost, so precision across conditions matters more than a headline accuracy figure on a clean set.',
      approach: [
        'A two-stage cascaded detection architecture for real-time pipe anomaly identification.',
        'A parallel ensemble of two models, one reading RGB frames and one reading edge-enhanced frames, so the two see different evidence for the same defect.',
        'Weighted Boxes Fusion to merge the two sets of detections into one, rather than picking a winner.',
      ],
      architecture: {
        caption:
          'The same frame reaches two detectors through different preprocessing; Weighted Boxes Fusion reconciles their boxes.',
        cols: 4,
        rows: 3,
        nodes: [
          { id: 'video', label: 'Live video', kind: 'sensor', detail: 'Inspection feed', col: 0, row: 1 },
          { id: 'rgb', label: 'RGB frame', kind: 'compute', col: 1, row: 0 },
          { id: 'edge', label: 'Edge enhancement', kind: 'compute', detail: 'OpenCV', col: 1, row: 2 },
          { id: 'det1', label: 'Detector A', kind: 'model', detail: 'YOLO on RGB', col: 2, row: 0 },
          { id: 'det2', label: 'Detector B', kind: 'model', detail: 'YOLO on edge', col: 2, row: 2 },
          { id: 'wbf', label: 'Weighted Boxes Fusion', kind: 'compute', detail: 'box reconciliation', col: 3, row: 1 },
          { id: 'out', label: 'Anomaly detections', kind: 'output', col: 3, row: 0 },
        ],
        edges: [
          { from: 'video', to: 'rgb', kind: 'data' },
          { from: 'video', to: 'edge', kind: 'data' },
          { from: 'rgb', to: 'det1', kind: 'data' },
          { from: 'edge', to: 'det2', kind: 'data' },
          { from: 'det1', to: 'wbf', kind: 'data' },
          { from: 'det2', to: 'wbf', kind: 'data' },
          { from: 'wbf', to: 'out', kind: 'data' },
        ],
      },
      challenges: [
        'Lighting and surface condition vary within a single inspection run, not just between runs.',
        'Two detectors on the same frame disagree, and the disagreement has to be resolved without simply discarding one of them.',
        'The pipeline has to stay real-time while running two models per frame.',
      ],
      decisions: [
        {
          choice: 'An ensemble over RGB and edge-enhanced inputs rather than one model with heavier augmentation.',
          because: 'Edge-enhanced input surfaces geometry that colour information alone loses on wet or coated surfaces.',
        },
        {
          choice: 'Weighted Boxes Fusion rather than non-maximum suppression across the two model outputs.',
          because: 'WBF combines overlapping boxes into a consensus rather than discarding all but the highest-confidence one.',
        },
        {
          choice: 'A two-stage cascade rather than a single detection pass.',
          because: 'It allows a cheap first stage to bound the work the more expensive stage has to do.',
        },
      ],
      results: [
        'Ensemble and fusion architecture in place, aimed at improving precision across varied lighting and surface conditions.',
      ],
      learned: [
        'Giving two models genuinely different views of the same input is a more useful kind of ensemble than running the same view twice.',
      ],
      rank: { engineering: 3, research: 1, everything: 3 },
      framing: {
        engineering:
          'Two detectors, two preprocessing paths, one fused output — built for footage that will not cooperate.',
        research:
          'The clearest statement of what I am investigating: how to hold detection precision steady when the imaging conditions will not.',
      },
      bullets: [
        {
          text: 'Building a two-stage cascaded detector for real-time pipe anomaly identification in industrial inspection.',
          emphasis: ['technical', 'research', 'general'],
        },
        {
          text: 'Two YOLO models run in parallel, one on RGB and one on edge-enhanced input, merged with Weighted Boxes Fusion to hold precision across lighting and surface conditions.',
          emphasis: ['technical', 'research', 'general'],
        },
      ],
    },

    // ------------------------------------------------------------------
    // MULTISPECTRAL — instrumentation credential.
    // ------------------------------------------------------------------
    {
      slug: 'multispectral-hydroponics',
      name: 'Multispectral Acquisition Device for Hydroponics',
      tagline:
        'A multi-sensor ESP32 node measuring light intensity and colour spectrum for hydroponic growing, streaming live to a cloud dashboard.',
      period: '2025',
      status: 'complete',
      technologies: ['ESP32', 'GY-2561', 'GY-31', 'I2C', 'Blynk IoT Cloud', 'C++'],
      domains: ['Embedded systems', 'Instrumentation', 'Sensing', 'IoT'],
      problem:
        'Hydroponic growing depends on light that is both bright enough and the right colour, but those are two different measurements, and a grower needs them continuously rather than as a spot check.',
      why:
        'Light is the input variable a grower can actually control. Measuring intensity and spectrum together makes it a controllable variable instead of a guess.',
      approach: [
        'A multi-sensor node built on the ESP32, combining a GY-2561 light intensity sensor and a GY-31 colour sensor.',
        'Multiple I2C sensors on a single ESP32 bus, with bus arbitration handled so the devices do not contend.',
        'Sensor calibration so the readings mean something in absolute terms rather than as raw counts.',
        'Live streaming to a Blynk IoT Cloud dashboard for continuous monitoring.',
      ],
      architecture: {
        caption:
          'Two sensors sharing one I2C bus on a single ESP32, streaming to a cloud dashboard over wifi.',
        cols: 4,
        rows: 3,
        nodes: [
          { id: 'lux', label: 'Light intensity', kind: 'sensor', detail: 'GY-2561', col: 0, row: 0 },
          { id: 'colour', label: 'Colour spectrum', kind: 'sensor', detail: 'GY-31', col: 0, row: 2 },
          { id: 'i2c', label: 'I2C bus', kind: 'compute', detail: 'shared, arbitrated', col: 1, row: 1 },
          { id: 'mcu', label: 'ESP32', kind: 'compute', detail: 'acquisition + calibration', col: 2, row: 1 },
          { id: 'wifi', label: 'Wi-Fi uplink', kind: 'service', col: 3, row: 0 },
          { id: 'blynk', label: 'Blynk IoT Cloud', kind: 'service', detail: 'live dashboard', col: 3, row: 1 },
          { id: 'grower', label: 'Grower dashboard', kind: 'ui', col: 3, row: 2 },
        ],
        edges: [
          { from: 'lux', to: 'i2c', kind: 'signal' },
          { from: 'colour', to: 'i2c', kind: 'signal' },
          { from: 'i2c', to: 'mcu', kind: 'data' },
          { from: 'mcu', to: 'wifi', kind: 'data' },
          { from: 'wifi', to: 'blynk', kind: 'data' },
          { from: 'blynk', to: 'grower', kind: 'data' },
        ],
      },
      challenges: [
        'Running multiple I2C sensors on one ESP32 required handling bus arbitration between the devices.',
        'Raw sensor counts are not measurements; the sensors needed calibration before the readings were usable.',
      ],
      decisions: [
        {
          choice: 'Two dedicated sensors, one for intensity and one for colour, rather than inferring both from a single reading.',
          because: 'Intensity and spectral composition are separate quantities, and inferring one from the other loses the information a grower needs.',
        },
        {
          choice: 'Share a single I2C bus and arbitrate rather than adding a second interface.',
          because: 'It keeps the node small and the wiring simple, at the cost of handling contention in firmware.',
        },
      ],
      results: [
        'Working multi-sensor node measuring light intensity and colour spectrum with live streaming to a Blynk dashboard.',
      ],
      learned: [
        'Calibration is the step that turns a sensor reading into a measurement, and it is the step that is easiest to skip.',
        'Bus arbitration is where multi-sensor nodes usually break, so it is worth designing for before adding the second device.',
      ],
      rank: { engineering: 4, research: 2, scholarship: 3, everything: 4 },
      framing: {
        engineering: 'Two sensors, one bus, calibrated readings, live telemetry — instrumentation from the pins up.',
        research:
          'Direct instrumentation work: separating intensity from spectral composition and calibrating both so the data is interpretable.',
        scholarship:
          'Applied to food growing — the kind of measurement problem that decides whether a crop works.',
      },
      bullets: [
        {
          text: 'Built an ESP32 acquisition node measuring light intensity and colour spectrum with the GY-2561 and GY-31, streaming live to a Blynk dashboard.',
          emphasis: ['technical', 'research', 'general'],
        },
        {
          text: 'Two I2C sensors on one bus, with arbitration and calibration handled so the readings mean something in absolute terms.',
          emphasis: ['technical', 'research', 'general'],
        },
        {
          text: 'Light is the one input a hydroponic grower controls, so it is measured continuously rather than spot-checked.',
          emphasis: ['scholarship'],
        },
      ],
    },

    // ------------------------------------------------------------------
    // FAN — first closed loop. Also the first team he led.
    // ------------------------------------------------------------------
    {
      slug: 'temperature-controlled-fan',
      name: 'Smart Temperature-Controlled Fan',
      tagline:
        'A closed-loop fan controller driving PWM from live thermistor feedback — and the first project I led rather than joined.',
      period: '2024',
      status: 'complete',
      technologies: ['Arduino', 'C++', 'PWM', 'NTC thermistor'],
      domains: ['Embedded systems', 'Control systems'],
      team: 'Led the team',
      problem:
        'A fan that is either on or off is either too loud or too late. Matching fan speed to actual temperature needs a control loop, not a switch.',
      why:
        'The simplest complete closed loop I could build: measure, compare, actuate, and watch the measurement respond to the actuation.',
      approach: [
        'An NTC thermistor providing real-time temperature feedback.',
        'PWM output setting fan speed continuously rather than switching it.',
        'A closed loop, so the fan speed follows the temperature it is affecting.',
      ],
      architecture: {
        caption:
          'A complete feedback loop: the actuator changes the quantity the sensor is measuring.',
        cols: 4,
        rows: 2,
        nodes: [
          { id: 'therm', label: 'NTC thermistor', kind: 'sensor', detail: 'temperature', col: 0, row: 0 },
          { id: 'adc', label: 'ADC read', kind: 'compute', detail: 'Arduino', col: 1, row: 0 },
          { id: 'ctrl', label: 'Control law', kind: 'compute', detail: 'speed from error', col: 2, row: 0 },
          { id: 'pwm', label: 'PWM drive', kind: 'compute', col: 3, row: 0 },
          { id: 'fan', label: 'Fan', kind: 'actuator', col: 3, row: 1 },
          { id: 'air', label: 'Air temperature', kind: 'output', detail: 'the measured quantity', col: 1, row: 1 },
        ],
        edges: [
          { from: 'therm', to: 'adc', kind: 'signal' },
          { from: 'adc', to: 'ctrl', kind: 'data' },
          { from: 'ctrl', to: 'pwm', kind: 'control' },
          { from: 'pwm', to: 'fan', kind: 'power' },
          { from: 'fan', to: 'air', kind: 'signal' },
          { from: 'air', to: 'therm', label: 'feedback', kind: 'signal' },
        ],
      },
      challenges: [
        'Thermistor response is non-linear, so raw readings do not map directly to a useful speed.',
        'Coordinating a team on a first hardware build, where everyone is learning the tools at the same time.',
      ],
      decisions: [
        {
          choice: 'Continuous PWM control instead of threshold on/off switching.',
          because: 'Switching gives you noise and overshoot; proportional speed gives you a usable response.',
        },
      ],
      results: [
        'Working closed-loop fan speed controller responding continuously to measured temperature.',
      ],
      learned: [
        'The loop is the interesting part: once the actuator affects what the sensor reads, tuning stops being guesswork and becomes control.',
      ],
      rank: { engineering: 5, research: 4, scholarship: 4, everything: 5 },
      framing: {
        engineering: 'The smallest complete control loop — sensor, control law, actuator, feedback.',
        research: 'A first-principles closed loop, later formalised on Quanser hardware.',
        scholarship: 'The first time I led a build team rather than joining one.',
      },
      bullets: [
        {
          text: 'Led the team building a closed-loop fan speed controller on Arduino, driving PWM from live NTC thermistor feedback.',
          emphasis: ['technical', 'general'],
        },
        {
          text: 'First time leading a team through a hardware build rather than joining one.',
          emphasis: ['scholarship'],
        },
        {
          text: 'Continuous proportional actuation instead of threshold switching, which overshoots.',
          emphasis: ['research'],
        },
      ],
    },

    // ------------------------------------------------------------------
    // FIRE ALARM — detection to notification.
    // ------------------------------------------------------------------
    {
      slug: 'fire-alarm-system',
      name: 'Smart Fire Alarm System',
      tagline:
        'Flame and smoke detection that raises a local alarm and sends an SMS, so the alert reaches someone who is not in the building.',
      period: '2023',
      status: 'complete',
      technologies: ['Arduino', 'C++', 'GSM module', 'Flame sensor', 'Smoke sensor'],
      domains: ['Embedded systems', 'Sensing', 'Safety systems'],
      problem:
        'A local alarm only helps someone already within earshot. If the building is empty, the alarm has nobody to warn.',
      why:
        'Detection is only half of a safety system; the other half is making sure the alert reaches a person who can act on it.',
      approach: [
        'Flame and smoke sensors monitored for a detection event.',
        'A local audible alarm for anyone present.',
        'A GSM module sending an SMS notification so the alert leaves the building.',
      ],
      architecture: {
        caption: 'One detection event, two independent notification paths — local and remote.',
        cols: 4,
        rows: 3,
        nodes: [
          { id: 'flame', label: 'Flame sensor', kind: 'sensor', col: 0, row: 0 },
          { id: 'smoke', label: 'Smoke sensor', kind: 'sensor', col: 0, row: 2 },
          { id: 'mcu', label: 'Arduino', kind: 'compute', detail: 'detection logic', col: 1, row: 1 },
          { id: 'buzz', label: 'Local alarm', kind: 'actuator', detail: 'audible', col: 2, row: 0 },
          { id: 'gsm', label: 'GSM module', kind: 'service', col: 2, row: 2 },
          { id: 'sms', label: 'SMS notification', kind: 'output', detail: 'off-site', col: 3, row: 2 },
        ],
        edges: [
          { from: 'flame', to: 'mcu', kind: 'signal' },
          { from: 'smoke', to: 'mcu', kind: 'signal' },
          { from: 'mcu', to: 'buzz', kind: 'control' },
          { from: 'mcu', to: 'gsm', kind: 'control' },
          { from: 'gsm', to: 'sms', kind: 'data' },
        ],
      },
      challenges: [
        'Two different sensing modalities have to agree on what counts as an event without either becoming a source of false alarms.',
      ],
      decisions: [
        {
          choice: 'Two notification paths, a local alarm and an SMS, rather than one.',
          because: 'Each covers the case the other misses: someone present, and nobody present.',
        },
      ],
      results: ['Working alarm raising a local alert and sending an SMS on flame or smoke detection.'],
      learned: [
        'A detector without a notification path that suits the situation is not yet a safety system.',
      ],
      rank: { engineering: 6, everything: 6 },
      framing: {
        engineering: 'Two sensing modalities, two notification paths, one event.',
      },
      bullets: [
        {
          text: 'An Arduino fire alarm with flame and smoke sensing, a local siren, and SMS alerting over GSM.',
          emphasis: ['technical', 'general'],
        },
      ],
    },
  ],

  skills: [
    {
      label: 'Programming',
      items: ['Python', 'C/C++', 'MATLAB', 'JavaScript', 'Verilog/HDL', 'Bash'],
      emphasis: ['technical', 'research', 'scholarship', 'general'],
    },
    {
      label: 'Embedded and Hardware',
      items: [
        'Arduino',
        'ESP32',
        'STM32',
        'Raspberry Pi',
        'FPGA',
        'I2C / SPI / UART',
        'Sensor integration',
      ],
      emphasis: ['technical', 'research', 'general'],
    },
    {
      label: 'AI and Machine Learning',
      items: [
        'YOLOv8/v11',
        'OpenCV',
        'TensorFlow (fundamentals)',
        'PyTorch (fundamentals)',
        'Weighted Boxes Fusion',
      ],
      emphasis: ['technical', 'research', 'general'],
    },
    {
      label: 'Instrumentation and Control',
      items: [
        'P&ID interpretation',
        'PID control loops',
        'Pneumatic systems',
        'I/P converters',
        '4–20 mA and 3–15 PSI standards',
      ],
      emphasis: ['technical', 'research', 'general'],
    },
    {
      label: 'Electrical Systems',
      items: [
        'SLD interpretation',
        'Circuit breaker sizing',
        'ESP systems',
        'Power transmission',
        'Arc flash safety',
        'Hazardous area classification',
      ],
      emphasis: ['technical', 'general'],
    },
    {
      label: 'Tools',
      items: [
        'VS Code',
        'Git/GitHub',
        'MATLAB/Simulink',
        'KiCad',
        'Flask',
        'React/TypeScript',
        'PostgreSQL',
        'Blynk IoT',
      ],
      emphasis: ['technical', 'research', 'general'],
    },
  ],

  leadership: [
    {
      id: 'spaw',
      role: 'SPAW Project Lead and Syllabus Team Lead',
      organisation: 'IEEE OAU Student Branch',
      location: 'Ile-Ife, Nigeria',
      start: '2024',
      end: 'Present',
      current: true,
      summary:
        'Leads SPAW 3.0, a six-session embedded systems and entrepreneurship curriculum for secondary school students.',
      bullets: [
        {
          text: 'Lead SPAW 3.0, a six-session embedded systems and entrepreneurship curriculum for secondary school students.',
          emphasis: ['technical', 'research', 'scholarship', 'general'],
        },
        {
          text: 'Design all lesson plans, tutor guides and laboratory exercises for the programme.',
          emphasis: ['scholarship', 'general'],
        },
        {
          text: 'Coordinate volunteer tutors across the six sessions.',
          emphasis: ['scholarship'],
        },
        {
          text: 'Session packs go out as PDFs with circuit diagrams, code and a troubleshooting section.',
          emphasis: ['scholarship', 'general'],
        },
      ],
      rank: { scholarship: 1, engineering: 2, research: 2, everything: 1 },
    },
    {
      id: 'zth',
      role: 'Core Instructor',
      organisation: 'Circuit Zero to Hero (ZTH)',
      location: 'Ile-Ife, Nigeria',
      start: '2023',
      end: 'Present',
      current: true,
      summary:
        'Runs practical circuit design and electronics workshops for students with no prior background.',
      bullets: [
        {
          text: 'Run practical electronics workshops for students who have never built a circuit.',
          emphasis: ['scholarship', 'general'],
        },
      ],
      rank: { scholarship: 2, everything: 2 },
    },
    {
      id: 'eeess',
      role: 'Editorial Team Member',
      organisation: 'EEE Students Society (EEESS), OAU',
      start: '2023',
      end: 'Present',
      current: true,
      summary: 'Contributes to departmental editorial output.',
      bullets: [
        {
          text: 'Contribute to editorial output for the Electronic and Electrical Engineering Students Society.',
          emphasis: ['scholarship', 'general'],
        },
      ],
      rank: { scholarship: 3, everything: 3 },
    },
    {
      id: 'social',
      role: 'Content Strategist',
      organisation: 'EEE Department Social Media Committee (TikTok / Instagram), OAU',
      start: '2024',
      end: 'Present',
      current: true,
      summary: 'Plans content for the department’s social channels.',
      bullets: [
        {
          text: 'Plan and produce content for the department’s TikTok and Instagram channels.',
          emphasis: ['scholarship'],
        },
      ],
      rank: { scholarship: 4, everything: 4 },
    },
    {
      id: 'cowrywise',
      role: 'Campus Ambassador',
      organisation: 'Cowrywise',
      start: '2023',
      end: 'Present',
      current: true,
      summary: 'Advocates financial literacy on campus.',
      bullets: [
        {
          text: 'Advocate financial literacy on campus as a Cowrywise campus ambassador.',
          emphasis: ['scholarship', 'general'],
        },
      ],
      rank: { scholarship: 5, everything: 5 },
    },
  ],

  certifications: [
    {
      name: 'Operational Excellence Training',
      issuer: 'Chevron',
      year: '2026',
      emphasis: ['technical', 'scholarship', 'general'],
    },
    {
      name: 'Cyber Security and Data Privacy Awareness',
      issuer: 'Chevron',
      year: '2026',
      emphasis: ['technical', 'scholarship', 'general'],
    },
    {
      name: 'Business Conduct, Ethics and Conflict of Interest',
      issuer: 'Chevron',
      year: '2026',
      emphasis: ['scholarship', 'general'],
    },
    {
      name: 'FPGA Design and HDL/Verilog Workshop (SWEP)',
      issuer: 'Faculty of Engineering, Obafemi Awolowo University',
      year: '2024',
      emphasis: ['technical', 'research', 'general'],
    },
    {
      name: 'Robotics Lab Orientation and Operations',
      issuer: 'ACE Quanser Lab, Obafemi Awolowo University',
      year: '2024',
      emphasis: ['technical', 'research', 'scholarship', 'general'],
    },
  ],

  /**
   * Research interests, each tied to work already done. `evidence` holds project
   * slugs and experience ids so the research path can draw the link explicitly
   * rather than asserting an interest with nothing behind it.
   */
  researchInterests: [
    {
      id: 'degraded-sensing',
      label: 'Detection under degraded conditions',
      description:
        'How to keep detection precision steady when lighting, surface condition and viewing angle vary within a single run, instead of tuning for one condition and losing the others.',
      evidence: ['pipe-anomaly-detection', 'smart-attendance-system'],
    },
    {
      id: 'measurement',
      label: 'Measurement and calibration',
      description:
        'Turning raw sensor output into a measurement that means something: calibration, separating quantities that are easy to conflate, and the signal standards industry already relies on.',
      evidence: ['multispectral-hydroponics', 'chevron'],
    },
    {
      id: 'control',
      label: 'Feedback and control',
      description:
        'Closed-loop behaviour on real hardware, from a thermistor-driven PWM loop to PID control on Quanser platforms, where the actuator changes the quantity being measured.',
      evidence: ['temperature-controlled-fan', 'quanser', 'chevron'],
    },
    {
      id: 'embedded-vision',
      label: 'Embedded and real-time vision',
      description:
        'Running vision pipelines within real constraints: modest hardware, live video, and the requirement that the system respond now rather than after a batch job.',
      evidence: ['pipe-anomaly-detection', 'smart-attendance-system', 'aniwe'],
    },
    {
      id: 'graceful-degradation',
      label: 'Systems that degrade rather than fail',
      description:
        'Designing explicit fallback behaviour so losing a network, a model or a sensor costs quality instead of function.',
      evidence: ['aniwe', 'fire-alarm-system'],
    },
  ],

  timeline: [
    { year: '2021', label: 'Started at OAU', detail: 'B.Sc. Electronic and Electrical Engineering, Obafemi Awolowo University.', kind: 'education' },
    { year: '2023', label: 'Started teaching', detail: 'Tutor at Astar Tutorials and core instructor on Circuit Zero to Hero, teaching students with no prior background.', kind: 'service' },
    { year: '2023', label: 'Smart Fire Alarm System', detail: 'Flame and smoke detection with local alarm and SMS notification.', kind: 'project' },
    { year: '2024', label: 'Quanser robotics lab', detail: 'R&D intern operating QDrone, QCar and QArm with MATLAB and Simulink; PID control on live hardware.', kind: 'work' },
    { year: '2024', label: 'FPGA and Verilog workshop', detail: 'SWEP workshop, OAU Faculty of Engineering.', kind: 'education' },
    { year: '2024', label: 'Led my first build team', detail: 'Smart temperature-controlled fan — a closed loop driving PWM from thermistor feedback.', kind: 'project' },
    { year: '2024', label: 'SPAW project lead, IEEE OAU', detail: 'Leads a six-session embedded systems and entrepreneurship curriculum for secondary school students.', kind: 'service' },
    { year: '2025', label: 'Multispectral acquisition node', detail: 'ESP32 node measuring light intensity and colour spectrum for hydroponics, streaming live telemetry.', kind: 'project' },
    { year: '2026', label: 'Smart Attendance System', detail: 'Face-recognition attendance for real lecture halls; invited to build a production version.', kind: 'project' },
    { year: '2026', label: 'Chevron Nigeria, E&I team', detail: 'Facilities engineering management intern across electrical and instrumentation — P&IDs, control loops, pneumatic standards, hazardous area classification.', kind: 'work' },
    { year: '2026', label: 'Pipe anomaly detection', detail: 'Two-stage cascaded detector fusing RGB and edge-enhanced models for industrial inspection. In progress.', kind: 'project' },
    { year: '2027', label: 'Expected graduation', detail: 'B.Sc. Electronic and Electrical Engineering, OAU.', kind: 'education' },
  ],
}

export default profile
