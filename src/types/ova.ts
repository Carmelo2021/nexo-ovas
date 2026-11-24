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
  | 'interactive';

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

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  title?: string; // Section title, link label, video title, filename, or callout title
  content: string; // Paragraph markdown, code source, or summary description
  url?: string; // Target URL for 'link' or 'video'
  relevanceComment?: string; // Hover preview commentary explaining content or relevance
  domainOrSource?: string; // e.g. 'MDN Web Docs', 'YouTube · Canal SENA', 'RFC 9110'
  videoTimestamp?: string; // e.g. '04:10 - 12:30' or '18 min'
  codeLanguage?: string; // e.g. 'typescript', 'sql', 'bash', 'json', 'python', 'cisco'
  calloutTone?: 'info' | 'tip' | 'warning';
  diagramKind?: DiagramKind;
  interactiveKind?: InteractiveKind;
  sourceNodeId?: string; // Optional reference to a GraphNode for bidirectional Canvas <-> OVA sync
}

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
