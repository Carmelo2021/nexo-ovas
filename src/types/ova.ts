export type NodeType = 'markdown' | 'media' | 'code' | 'quiz' | 'activity';

export type ResearchStatus = 'to_research' | 'draft' | 'verified' | 'in_ova';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GraphRegion {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: 'indigo' | 'emerald' | 'amber' | 'slate';
  linkedOvaId?: string;
}

export interface GraphNode {
  id: string;
  title: string;
  type: NodeType;
  researchStatus: ResearchStatus;
  x: number;
  y: number;
  regionId?: string;
  content: string;
  blocks?: LessonBlock[];
  mediaUrl?: string;
  mediaKind?: 'video' | 'article' | 'repository' | 'simulation';
  mediaComment?: string;
  codeLanguage?: string;
  quizQuestions?: QuizQuestion[];
  dueDate?: string;
  evidenceType?: 'Conocimiento' | 'Desempeño' | 'Producto';
  linkedOvaId?: string;
  linkedLessonId?: string;
  tags: string[];
  updatedAt: string;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
}

export interface LessonActivity {
  id: string;
  title: string;
  evidenceCode: string; // e.g. GA4-220501095-AA2-EV01
  evidenceType: 'Conocimiento' | 'Desempeño' | 'Producto';
  instructions: string;
  dueDate: string; // YYYY-MM-DD
  deliverableFormat: string;
}

export type LessonBlockType =
  | 'heading'
  | 'text'
  | 'link'
  | 'video'
  | 'code'
  | 'callout'
  | 'diagram'
  | 'interactive'
  | 'quote'
  | 'exercise';

export type DiagramKind =
  | 'var_let_const'
  | 'data_types'
  | 'if_else_flow'
  | 'loops_flow'
  | 'try_catch_flow';

export type InteractiveKind =
  | 'array_lab'
  | 'array_functional'
  | 'object_lab';

export type ExerciseDifficulty = 'Básico' | 'Intermedio' | 'Avanzado';

export type ExerciseCategory = 'corto' | 'desarrollo';

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  title?: string; // Section title, link label, video title, filename, book title, or exercise title
  content: string; // Paragraph markdown, code source, book quote, or exercise problem statement
  url?: string; // Target URL for 'link' or 'video'
  relevanceComment?: string; // Hover preview commentary, book pedagogical reflection, or exercise hint
  domainOrSource?: string; // e.g. 'MDN Web Docs', 'YouTube · Canal SENA', 'RFC 9110'
  videoTimestamp?: string; // e.g. '04:10 - 12:30' or '18 min'
  codeLanguage?: string; // e.g. 'typescript', 'sql', 'bash', 'json', 'python', 'cisco'
  calloutTone?: 'info' | 'tip' | 'warning';
  diagramKind?: DiagramKind;
  interactiveKind?: InteractiveKind;
  quoteAuthor?: string; // Author, edition, and publisher for 'quote' blocks
  exerciseDifficulty?: ExerciseDifficulty; // Difficulty badge for 'exercise' blocks
  exerciseCategory?: ExerciseCategory; // 'corto' (5 short proposed exercises) | 'desarrollo' (10 similar exercises to develop)
  exerciseTopic?: string; // Specific sub-topic tested in this separate 'exercise' block
  exerciseStarterCode?: string; // Interactive starter code snippet for the learner to edit and execute in-place
  exerciseSolution?: string; // Step-by-step solved code & explanation for 'exercise' blocks
  sourceNodeId?: string; // Optional reference to a GraphNode for bidirectional Canvas <-> OVA sync
  hiddenFromPublic?: boolean; // When true, hidden from the public learner view (visible only in Instructor Editor)
  collapsedInEditor?: boolean; // When true, collapsed in the Instructor OVA Editor for compact organization
}

export type LessonMacroSectionId =
  | 'blocks'
  | 'linked_nodes'
  | 'activity'
  | 'quiz';

export interface Lesson {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  summary: string;
  contentMarkdown: string;
  blocks?: LessonBlock[];
  mediaUrl?: string;
  mediaTitle?: string;
  mediaComment?: string;
  linkedNodeIds: string[];
  quiz: QuizQuestion[];
  activity?: LessonActivity;
  hiddenFromPublic?: boolean; // Hide entire lesson from public learner view
  sectionOrder?: LessonMacroSectionId[]; // Custom top-to-bottom order of macro sections in the lesson
  hiddenSections?: LessonMacroSectionId[]; // Macro sections hidden from public learner view
}

export interface OVA {
  id: string;
  code: string;
  title: string;
  fichaCode: string;
  programName: string;
  competence: string;
  learningOutcome: string; // RAP (Resultado de Aprendizaje)
  status: 'published' | 'draft';
  description: string;
  estimatedHours: number;
  updatedAt: string;
  lessons: Lesson[];
}

export type SubmissionStatus = 'pending' | 'submitted' | 'late';

export interface EvidenceSubmission {
  lessonId: string;
  activityId: string;
  status: SubmissionStatus;
  submittedAt?: string;
  deliveryLinkOrNote?: string;
  instructorFeedback?: string;
  score?: number; // 0-100
}

export interface LearnerOvaProgress {
  ovaId: string;
  completedLessonIds: string[];
  quizScores: Record<string, number>; // lessonId -> percentage 0-100
  submissions: Record<string, EvidenceSubmission>; // lessonId -> submission
  lastAccessedAt: string;
}

export interface Learner {
  id: string;
  documentNumber: string;
  name: string;
  email: string;
  phone: string;
  fichaCode: string;
  programName: string;
  progressByOva: Record<string, LearnerOvaProgress>;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  channel: 'whatsapp' | 'email';
  urgency: 'upcoming' | 'due_today' | 'overdue';
  subject: string;
  bodyTemplate: string;
}

export interface SentReminderLog {
  id: string;
  learnerId: string;
  learnerName: string;
  fichaCode: string;
  ovaTitle: string;
  activityTitle: string;
  channel: 'whatsapp' | 'email';
  sentAt: string;
  messagePreview: string;
}

export interface InstructorCredentials {
  username: string;
  password: string;
  instructorName: string;
  centerName: string;
  regionalName: string;
  email: string;
}

export type KarpathyClusterType = 'index' | 'raw' | 'wiki' | 'labs' | 'practice';

export type BrainLayerIconKind =
  | 'index_hub'
  | 'raw_vault'
  | 'wiki_node'
  | 'lab_model'
  | 'lint_check';

export type BrainMaterialIconKind =
  | 'core'
  | 'book'
  | 'code'
  | 'exercise'
  | 'video'
  | 'diagram'
  | 'interactive'
  | 'concept'
  | 'link';

export type PortSide = 'top' | 'right' | 'bottom' | 'left';

export interface KarpathyBrainNode {
  id: string;
  ovaId: string;
  lessonId?: string;
  blockId?: string;
  title: string;
  cluster: KarpathyClusterType;
  layerIcon: BrainLayerIconKind; // Icon 1: Clasificación de capa Karpathy
  materialIcon: BrainMaterialIconKind; // Icon 2: Clasificación de tipo de material
  x: number;
  y: number;
  width?: number;
  height?: number;
  expanded?: boolean;
  noteContent?: string;
  zDepth: number; // Factor de profundidad 3D (0.75 a 1.25)
  floatPhase?: number; // Desfase de microanimación 3D
}

export interface KarpathyBrainEdge {
  id: string;
  ovaId: string;
  sourceId: string;
  targetId: string;
  cluster: KarpathyClusterType;
  label?: string;
  sourcePort?: PortSide;
  targetPort?: PortSide;
}

export interface KarpathyOrbitalZone {
  id: string;
  ovaId: string;
  cluster: Exclude<KarpathyClusterType, 'index'>;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  radius: number;
}

