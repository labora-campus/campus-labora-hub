export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  initials: string;
}

export interface Lesson {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
  moduleId: number;
}

export interface Material {
  id: number;
  title: string;
  type: "pdf" | "link" | "doc";
  url: string;
}

export interface Module {
  id: number;
  title: string;
  published: boolean;
  lessons: Lesson[];
  materials: Material[];
}

export interface Assignment {
  id: number;
  title: string;
  moduleId: number;
  moduleName: string;
  deadline: string;
  status: "pending" | "submitted" | "reviewed" | "needs_review";
  feedback?: string;
  submittedDate?: string;
  submissionContent?: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  initials: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  students: number;
  status: "active" | "inactive";
}

export interface Submission {
  studentId: string;
  studentName: string;
  studentInitials: string;
  submittedDate: string;
  status: "reviewed" | "needs_review" | "not_submitted";
  feedback?: string;
  content?: string;
}

export const studentUser: User = {
  id: "s1",
  name: "María González",
  email: "maria@ejemplo.com",
  role: "student",
  initials: "MG",
};

export const adminUser: User = {
  id: "a1",
  name: "Brandon",
  email: "brandon@labora.ai",
  role: "admin",
  initials: "B",
};

export const modules: Module[] = [
  {
    id: 1,
    title: "Semana 1: Fundamentos de IA y Setup",
    published: true,
    lessons: [
      { id: 1, title: "Introducción a Claude como Tech Lead", duration: 45, completed: true, moduleId: 1 },
      { id: 2, title: "Setup de GitHub y flujo de trabajo", duration: 35, completed: true, moduleId: 1 },
      { id: 3, title: "Tu primera app con React", duration: 60, completed: true, moduleId: 1 },
    ],
    materials: [
      { id: 1, title: "Guía de Prompts para Claude", type: "pdf", url: "#" },
      { id: 2, title: "Documentación oficial de Claude", type: "link", url: "https://docs.anthropic.com" },
      { id: 3, title: "Checklist de setup", type: "pdf", url: "#" },
    ],
  },
  {
    id: 2,
    title: "Semana 2: Prototipado Ágil",
    published: true,
    lessons: [
      { id: 4, title: "Componentes y diseño responsive", duration: 50, completed: true, moduleId: 2 },
      { id: 5, title: "Navegación y routing", duration: 40, completed: true, moduleId: 2 },
      { id: 6, title: "Formularios e interactividad", duration: 55, completed: false, moduleId: 2 },
    ],
    materials: [],
  },
  {
    id: 3,
    title: "Semana 3: Backend con Supabase",
    published: true,
    lessons: [
      { id: 7, title: "Configurar Supabase: Auth y DB", duration: 50, completed: false, moduleId: 3 },
      { id: 8, title: "CRUD y Row Level Security", duration: 45, completed: false, moduleId: 3 },
      { id: 9, title: "Storage y archivos", duration: 40, completed: false, moduleId: 3 },
    ],
    materials: [],
  },
  {
    id: 4,
    title: "Semana 4: Deployment y Proyecto Final",
    published: false,
    lessons: [
      { id: 10, title: "Deploy a producción", duration: 35, completed: false, moduleId: 4 },
      { id: 11, title: "Proyecto final: presentación", duration: 60, completed: false, moduleId: 4 },
    ],
    materials: [],
  },
];

export const assignments: Assignment[] = [
  {
    id: 1,
    title: "Crear tu primera landing page",
    moduleId: 2,
    moduleName: "Semana 2: Prototipado Ágil",
    deadline: "2026-02-24",
    status: "reviewed",
    feedback: "¡Excelente trabajo! La landing se ve profesional.",
    submittedDate: "2026-02-20",
    submissionContent: "https://mi-landing.vercel.app",
  },
  {
    id: 2,
    title: "Integrar Supabase Auth en tu app",
    moduleId: 3,
    moduleName: "Semana 3: Backend con Supabase",
    deadline: "2026-03-03",
    status: "pending",
  },
  {
    id: 3,
    title: "Proyecto Final: App completa",
    moduleId: 4,
    moduleName: "Semana 4: Deployment y Proyecto Final",
    deadline: "2026-03-16",
    status: "pending",
  },
];

export const students: StudentData[] = [
  { id: "s1", name: "María González", email: "maria@ejemplo.com", initials: "MG", progress: 45, completedLessons: 5, totalLessons: 11, assignmentsSubmitted: 1, totalAssignments: 3 },
  { id: "s2", name: "Carlos Ruiz", email: "carlos@ejemplo.com", initials: "CR", progress: 36, completedLessons: 4, totalLessons: 11, assignmentsSubmitted: 1, totalAssignments: 3 },
  { id: "s3", name: "Ana Torres", email: "ana@ejemplo.com", initials: "AT", progress: 27, completedLessons: 3, totalLessons: 11, assignmentsSubmitted: 0, totalAssignments: 3 },
  { id: "s4", name: "Pedro Silva", email: "pedro@ejemplo.com", initials: "PS", progress: 54, completedLessons: 6, totalLessons: 11, assignmentsSubmitted: 1, totalAssignments: 3 },
  { id: "s5", name: "Laura Mendez", email: "laura@ejemplo.com", initials: "LM", progress: 45, completedLessons: 5, totalLessons: 11, assignmentsSubmitted: 1, totalAssignments: 3 },
  { id: "s6", name: "Diego Vargas", email: "diego@ejemplo.com", initials: "DV", progress: 18, completedLessons: 2, totalLessons: 11, assignmentsSubmitted: 0, totalAssignments: 3 },
  { id: "s7", name: "Sofía Herrera", email: "sofia@ejemplo.com", initials: "SH", progress: 63, completedLessons: 7, totalLessons: 11, assignmentsSubmitted: 2, totalAssignments: 3 },
  { id: "s8", name: "Mateo López", email: "mateo@ejemplo.com", initials: "ML", progress: 36, completedLessons: 4, totalLessons: 11, assignmentsSubmitted: 1, totalAssignments: 3 },
];

export const cohorts: Cohort[] = [
  { id: "c15", name: "Cohorte 15 — IA y No Code", startDate: "2026-02-10", endDate: "2026-03-16", students: 8, status: "active" },
  { id: "c14", name: "Cohorte 14 — IA y Contenido", startDate: "2025-12-01", endDate: "2026-01-15", students: 12, status: "inactive" },
];

export const submissionsForTask1: Submission[] = [
  { studentId: "s1", studentName: "María González", studentInitials: "MG", submittedDate: "2026-02-20", status: "reviewed", feedback: "¡Excelente trabajo!", content: "https://mi-landing.vercel.app" },
  { studentId: "s2", studentName: "Carlos Ruiz", studentInitials: "CR", submittedDate: "2026-02-21", status: "reviewed", feedback: "Buen diseño, mejorar los textos", content: "https://carlos-landing.vercel.app" },
  { studentId: "s4", studentName: "Pedro Silva", studentInitials: "PS", submittedDate: "2026-02-22", status: "needs_review", content: "https://pedro-landing.vercel.app" },
  { studentId: "s7", studentName: "Sofía Herrera", studentInitials: "SH", submittedDate: "2026-02-19", status: "reviewed", feedback: "Perfecta, la mejor del grupo", content: "https://sofia-landing.vercel.app" },
];

export function formatDateEs(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

export function daysUntil(dateStr: string): number {
  const now = new Date("2026-02-17");
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDeadlineColor(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < 0) return "text-destructive";
  if (days <= 3) return "text-warning";
  return "text-success";
}

export function getDeadlineText(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < 0) return `Venció hace ${Math.abs(days)} días`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  return `En ${days} días`;
}

export function getLessonById(id: number): Lesson | undefined {
  for (const m of modules) {
    const l = m.lessons.find((l) => l.id === id);
    if (l) return l;
  }
  return undefined;
}

export function getModuleForLesson(lessonId: number): Module | undefined {
  return modules.find((m) => m.lessons.some((l) => l.id === lessonId));
}
