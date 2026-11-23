export type NodeType = 'markdown' | 'media' | 'quiz' | 'activity';

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
  mediaUrl?: string;
  mediaKind?: 'video' | 'article' | 'repository' | 'simulation';
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

export interface Lesson {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  summary: string;
  contentMarkdown: string;
  mediaUrl?: string;
  mediaTitle?: string;
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
