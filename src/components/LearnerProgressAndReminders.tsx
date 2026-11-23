import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Send,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  Learner,
  OVA,
  ReminderTemplate,
  SentReminderLog,
} from '../types/ova';

interface LearnerProgressAndRemindersProps {
  activeSubTab: 'learners' | 'reminders';
  learners: Learner[];
  ovas: OVA[];
  templates: ReminderTemplate[];
  sentLogs: SentReminderLog[];
  onUpdateLearners: React.Dispatch<React.SetStateAction<Learner[]>>;
  onAddSentLog: (log: SentReminderLog) => void;
  onPreviewAsLearner: (learnerId: string) => void;
}

export const LearnerProgressAndReminders: React.FC<
  LearnerProgressAndRemindersProps
> = ({
  activeSubTab,
  learners,
  ovas,
  templates,
  sentLogs,
  onUpdateLearners,
  onAddSentLog,
  onPreviewAsLearner,
}) => {
  const [fichaFilter, setFichaFilter] = useState<string>('all');
  const [searchLearner, setSearchLearner] = useState<string>('');
  const [selectedOvaId, setSelectedOvaId] = useState<string>(ovas[0]?.id ?? '');

  // New learner modal/inline form state
  const [showAddLearner, setShowAddLearner] = useState<boolean>(false);
  const [newDoc, setNewDoc] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('57300');
  const [newFicha, setNewFicha] = useState<string>('2874512');

  // Reminder Composer state
  const [selectedLearnerForReminder, setSelectedLearnerForReminder] =
    useState<string>(learners[1]?.id ?? learners[0]?.id ?? '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates[0]?.id ?? ''
  );
  const [selectedActivityLessonId, setSelectedActivityLessonId] =
    useState<string>('les-101');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const uniqueFichas = useMemo(() => {
    const set = new Set<string>();
    learners.forEach((l) => set.add(l.fichaCode));
    ovas.forEach((o) => set.add(o.fichaCode));
    return Array.from(set);
  }, [learners, ovas]);

  const currentOva = ovas.find((o) => o.id === selectedOvaId) ?? ovas[0];

  const filteredLearners = learners.filter((l) => {
    const matchesFicha = fichaFilter === 'all' || l.fichaCode === fichaFilter;
    const matchesSearch =
      searchLearner.trim() === '' ||
      l.name.toLowerCase().includes(searchLearner.toLowerCase()) ||
      l.documentNumber.includes(searchLearner.trim());
    return matchesFicha && matchesSearch;
  });

  const calculateLearnerOvaCompletion = (learner: Learner, ova: OVA) => {
    if (!ova || ova.lessons.length === 0) return 0;
    const prog = learner.progressByOva[ova.id];
    if (!prog) return 0;
    const done = ova.lessons.filter((l) =>
      prog.completedLessonIds.includes(l.id)
    ).length;
    return Math.round((done / ova.lessons.length) * 100);
  };

  // Compute all upcoming & overdue activity alerts across all learners
  const deadlineAlerts = useMemo(() => {
    const today = '2026-11-09';
    const items: Array<{
      learner: Learner;
      ova: OVA;
      lessonId: string;
      lessonTitle: string;
      evidenceCode: string;
      activityTitle: string;
      dueDate: string;
      urgency: 'overdue' | 'due_soon';
      progressPct: number;
    }> = [];

    learners.forEach((learner) => {
      const fichaOvas = ovas.filter((o) => o.fichaCode === learner.fichaCode);
      fichaOvas.forEach((ova) => {
        const prog = learner.progressByOva[ova.id];
        ova.lessons.forEach((lesson) => {
          if (!lesson.activity) return;
          const sub = prog?.submissions?.[lesson.activity.id] ?? prog?.submissions?.[lesson.id];
          if (sub?.status === 'submitted') return;

          const isOverdue = lesson.activity.dueDate < today || sub?.status === 'late';
          items.push({
            learner,
            ova,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            evidenceCode: lesson.activity.evidenceCode,
            activityTitle: lesson.activity.title,
            dueDate: lesson.activity.dueDate,
            urgency: isOverdue ? 'overdue' : 'due_soon',
            progressPct: calculateLearnerOvaCompletion(learner, ova),
          });
        });
      });
    });

    return items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [learners, ovas]);

  const handleCreateLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDoc.trim()) return;
    const matchedOva = ovas.find((o) => o.fichaCode === newFicha);
    const created: Learner = {
      id: `apr-${Date.now()}`,
      documentNumber: newDoc.trim(),
      name: newName.trim(),
      email:
        newEmail.trim() ||
        `${newName.toLowerCase().split(' ')[0]}@soy.sena.edu.co`,
      phone: newPhone.trim() || '573000000000',
      fichaCode: newFicha,
      programName:
        matchedOva?.programName ??
        'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      progressByOva: {},
    };
    onUpdateLearners((prev) => [created, ...prev]);
    setNewDoc('');
    setNewName('');
    setNewEmail('');
    setShowAddLearner(false);
  };

  // Reminder dynamic interpolation
  const reminderTargetLearner =
    learners.find((l) => l.id === selectedLearnerForReminder) ?? learners[0];
  const reminderTemplate =
    templates.find((t) => t.id === selectedTemplateId) ?? templates[0];

  const learnerAssignedOvas = ovas.filter(
    (o) => o.fichaCode === reminderTargetLearner?.fichaCode
  );
  const activeReminderOva = learnerAssignedOvas[0] ?? ovas[0];
  const lessonsWithActivities =
    activeReminderOva?.lessons.filter((l) => Boolean(l.activity)) ?? [];
  const activeReminderLesson =
    lessonsWithActivities.find((l) => l.id === selectedActivityLessonId) ??
    lessonsWithActivities[0] ??
    activeReminderOva?.lessons[0];

  const interpolatedReminder = useMemo(() => {
    if (!reminderTargetLearner || !reminderTemplate || !activeReminderOva) {
      return { subject: '', body: '' };
    }
    const pct = calculateLearnerOvaCompletion(
      reminderTargetLearner,
      activeReminderOva
    );
    const evName = activeReminderLesson?.activity
      ? `${activeReminderLesson.activity.evidenceCode} · ${activeReminderLesson.activity.title}`
      : activeReminderLesson?.title ?? 'Evidencia del RAP';
    const due = activeReminderLesson?.activity?.dueDate ?? '2026-11-12';

    const replaceVars = (str: string) =>
      str
        .replace(/\{\{aprendiz\}\}/g, reminderTargetLearner.name)
        .replace(/\{\{ficha\}\}/g, reminderTargetLearner.fichaCode)
        .replace(/\{\{ova\}\}/g, activeReminderOva.title)
        .replace(/\{\{evidencia\}\}/g, evName)
        .replace(/\{\{fecha_limite\}\}/g, due)
        .replace(/\{\{progreso\}\}/g, String(pct));

    return {
      subject: replaceVars(reminderTemplate.subject),
      body: replaceVars(reminderTemplate.bodyTemplate),
    };
  }, [
    reminderTargetLearner,
    reminderTemplate,
    activeReminderOva,
    activeReminderLesson,
    learners,
  ]);

  const handleCopyReminder = () => {
    navigator.clipboard?.writeText(interpolatedReminder.body);
    if (reminderTargetLearner && activeReminderOva) {
      onAddSentLog({
        id: `log-${Date.now()}`,
        learnerId: reminderTargetLearner.id,
        learnerName: reminderTargetLearner.name,
        fichaCode: reminderTargetLearner.fichaCode,
        ovaTitle: activeReminderOva.title,
        activityTitle:
          activeReminderLesson?.activity?.title ?? 'Evidencia SENA',
        channel: reminderTemplate.channel,
        sentAt: '2026-11-09 08:45',
        messagePreview: `${interpolatedReminder.body.slice(0, 110)}...`,
      });
    }
    setCopyFeedback(
      'Mensaje copiado al portapapeles y registrado en el historial de envíos.'
    );
    setTimeout(() => setCopyFeedback(null), 3500);
  };

  if (activeSubTab === 'reminders') {
    return (
      <div className="space-y-6">
        {/* Summary KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500">
              Evidencias Vencidas / Plan de Mejoramiento
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono tabular-nums text-red-600">
                {deadlineAlerts.filter((a) => a.urgency === 'overdue').length}
              </span>
              <span className="text-xs text-red-700 font-medium">
                ▲ Requiere recordatorio urgente
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500">
              Entregas Próximas (Próximos 5 días)
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">
                {deadlineAlerts.filter((a) => a.urgency === 'due_soon').length}
              </span>
              <span className="text-xs text-amber-700 font-medium">
                ● En plazo de envío
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500">
              Recordatorios Despachados por el Instructor
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                {sentLogs.length}
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                WhatsApp y Correo Institucional
              </span>
            </div>
          </div>
        </div>

        {/* Main 12-Col Split: Alerts Queue + Dynamic Notification Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Active Deadline Alerts Table */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Alertas de Fechas Límite y Evidencias Pendientes por Aprendiz
                </h3>
                <p className="text-xs text-slate-500">
                  Haz clic en &ldquo;Preparar Recordatorio&rdquo; para cargar los
                  datos del aprendiz en la plantilla de envío.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {deadlineAlerts.map((alert, idx) => (
                <div
                  key={`${alert.learner.id}-${alert.lessonId}-${idx}`}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`font-semibold ${
                          alert.urgency === 'overdue'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {alert.urgency === 'overdue'
                          ? '▲ VENCIDA'
                          : '● PRÓXIMA A VENCER'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-600">
                        Fecha límite: {alert.dueDate}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-indigo-700">
                        Ficha {alert.learner.fichaCode}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      {alert.learner.name}{' '}
                      <span className="font-normal text-xs text-slate-500 font-mono">
                        (CC {alert.learner.documentNumber})
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-mono font-medium">
                        {alert.evidenceCode}
                      </span>{' '}
                      — {alert.activityTitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono tabular-nums font-semibold text-slate-800">
                        {alert.progressPct}% OVA
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Avance actual
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLearnerForReminder(alert.learner.id);
                        setSelectedActivityLessonId(alert.lessonId);
                        setSelectedTemplateId(
                          alert.urgency === 'overdue'
                            ? 'tpl-wa-overdue'
                            : 'tpl-wa-upcoming'
                        );
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Preparar Recordatorio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Cols: WhatsApp & Email Notification Generator */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs text-slate-500">
                Despacho Directo a Aprendices
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Generador de Plantillas WhatsApp y Correo SENA
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Aprendiz Destinatario
                </label>
                <select
                  value={selectedLearnerForReminder}
                  onChange={(e) =>
                    setSelectedLearnerForReminder(e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {learners.map((l) => (
                    <option key={l.id} value={l.id}>
                      Ficha {l.fichaCode} · {l.name} ({l.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Evidencia / Actividad a Recordar
                </label>
                <select
                  value={activeReminderLesson?.id ?? ''}
                  onChange={(e) => setSelectedActivityLessonId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {lessonsWithActivities.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.activity?.evidenceCode} · {l.activity?.title} (Vence:{' '}
                      {l.activity?.dueDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Plantilla de Comunicación
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      [{tpl.channel === 'whatsapp' ? 'WhatsApp' : 'Correo'}]{' '}
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interpolated Message Preview */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                Asunto: {interpolatedReminder.subject}
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3 border border-slate-200 rounded">
                {interpolatedReminder.body}
              </div>
            </div>

            {copyFeedback && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{copyFeedback}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyReminder}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <Copy className="w-3.5 h-3.5" />
                Copiar y Registrar Envío
              </button>

              {reminderTargetLearner && (
                <>
                  <a
                    href={`https://wa.me/${reminderTargetLearner.phone}?text=${encodeURIComponent(
                      interpolatedReminder.body
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCopyReminder}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Abrir WhatsApp
                  </a>

                  <a
                    href={`mailto:${
                      reminderTargetLearner.email
                    }?subject=${encodeURIComponent(
                      interpolatedReminder.subject
                    )}&body=${encodeURIComponent(interpolatedReminder.body)}`}
                    onClick={handleCopyReminder}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Correo
                  </a>
                </>
              )}
            </div>

            {/* Sent Reminders Log */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">
                Historial Reciente de Recordatorios Enviados ({sentLogs.length})
              </h4>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {sentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {log.learnerName} · Ficha {log.fichaCode}
                      </span>
                      <span className="font-mono">{log.sentAt}</span>
                    </div>
                    <p className="text-slate-600 mt-1 line-clamp-1">
                      {log.messagePreview}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default subTab: 'learners' (Individual Student Progress Matrix by Ficha)
  return (
    <div className="space-y-6">
      {/* Top Filter & Enrollment Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
            <span>Seguimiento Pedagógico Individual</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {filteredLearners.length} aprendices en vista
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Matriz de Progreso por Ficha de Caracterización y Evidencias SENA
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Interactive Ficha Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setFichaFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                fichaFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas las Fichas
            </button>
            {uniqueFichas.map((ficha) => (
              <button
                key={ficha}
                type="button"
                onClick={() => setFichaFilter(ficha)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap ${
                  fichaFilter === ficha
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ficha {ficha}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchLearner}
              onChange={(e) => setSearchLearner(e.target.value)}
              placeholder="Buscar aprendiz o documento..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 w-52"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddLearner((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            Vincular Aprendiz
          </button>
        </div>
      </div>

      {/* Optional Add Learner Form */}
      {showAddLearner && (
        <form
          onSubmit={handleCreateLearner}
          className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Documento (CC / TI)
            </label>
            <input
              type="text"
              required
              value={newDoc}
              onChange={(e) => setNewDoc(e.target.value)}
              placeholder="1032..."
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre Completo del Aprendiz
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombres y Apellidos"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ficha SENA
            </label>
            <input
              type="text"
              required
              value={newFicha}
              onChange={(e) => setNewFicha(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo @soy.sena.edu.co
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="aprendiz@soy.sena.edu.co"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      {/* OVA Filter Selector for Detailed Lesson Breakdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3.5">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">
            Inspeccionando Progreso del OVA:
          </span>
          <select
            value={selectedOvaId}
            onChange={(e) => setSelectedOvaId(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
          >
            {ovas.map((o) => (
              <option key={o.id} value={o.id}>
                Ficha {o.fichaCode} · {o.title} ({o.lessons.length} lecciones)
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Competencia: <span className="text-slate-800">{currentOva?.competence}</span>
        </div>
      </div>

      {/* High-Density Learner Progress Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600">
                <th className="py-3 px-4">Aprendiz / Documento</th>
                <th className="py-3 px-4">Ficha SENA</th>
                <th className="py-3 px-4 text-right">Avance OVA</th>
                <th className="py-3 px-4">Lecciones y Autoevaluaciones</th>
                <th className="py-3 px-4">Estado de Evidencias RAP</th>
                <th className="py-3 px-4 text-right">Último Acceso</th>
                <th className="py-3 px-4 text-right">Acción Docente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredLearners.map((learner) => {
                const prog = currentOva
                  ? learner.progressByOva[currentOva.id]
                  : undefined;
                const pct = currentOva
                  ? calculateLearnerOvaCompletion(learner, currentOva)
                  : 0;

                return (
                  <tr
                    key={learner.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {learner.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        CC {learner.documentNumber} · {learner.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      {learner.fichaCode}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono tabular-nums font-bold text-slate-900">
                        {pct}%
                      </div>
                      <div className="w-24 ml-auto h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full ${
                            pct === 100
                              ? 'bg-emerald-600'
                              : pct >= 50
                              ? 'bg-indigo-600'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {currentOva?.lessons.map((lesson) => {
                          const isDone =
                            prog?.completedLessonIds.includes(lesson.id) ??
                            false;
                          const quizScore = prog?.quizScores?.[lesson.id];
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-1.5 text-[11px]"
                            >
                              <span
                                className={
                                  isDone
                                    ? 'text-emerald-700 font-semibold'
                                    : 'text-slate-400'
                                }
                              >
                                {isDone ? '✓' : '○'} L0{lesson.order}
                              </span>
                              <span className="text-slate-700 truncate max-w-[180px]">
                                {lesson.title}
                              </span>
                              {quizScore !== undefined && (
                                <span className="font-mono text-indigo-600">
                                  · Quiz {quizScore}%
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        {currentOva?.lessons
                          .filter((l) => Boolean(l.activity))
                          .map((l) => {
                            const sub = prog?.submissions?.[l.id];
                            const status = sub?.status ?? 'pending';
                            return (
                              <div key={l.id} className="text-[11px]">
                                <span className="font-mono text-slate-700">
                                  {l.activity?.evidenceCode}:
                                </span>{' '}
                                {status === 'submitted' ? (
                                  <span className="text-emerald-700 font-semibold">
                                    ✓ Entregada ({sub?.submittedAt})
                                  </span>
                                ) : status === 'late' ? (
                                  <span className="text-red-600 font-semibold">
                                    ▲ Vencida ({l.activity?.dueDate})
                                  </span>
                                ) : (
                                  <span className="text-amber-700 font-medium">
                                    ● Pendiente (Vence {l.activity?.dueDate})
                                  </span>
                                )}
                                {sub?.deliveryLinkOrNote && (
                                  <div>
                                    <a
                                      href={sub.deliveryLinkOrNote}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                                    >
                                      Ver entrega enviada{' '}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                      {prog?.lastAccessedAt ?? 'Sin ingreso'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onPreviewAsLearner(learner.id)}
                        className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Ver Portal Aprendiz
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
