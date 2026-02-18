# Documento Maestro Actualizado: Campus Labora Hub
## v2.0 — Febrero 2026

---

## 1. Visión General del Proyecto

**Campus Labora Hub** es una Plataforma de Gestión de Aprendizaje (LMS) de Academia Labora diseñada para centralizar clases grabadas, materiales de apoyo y sistema de entrega/revisión de tareas para los bootcamps de IA y No-Code.

**Objetivo:** Que cada estudiante acceda únicamente al contenido de su cohorte, vea clases embebidas desde Google Drive, descargue materiales y entregue tareas en formato flexible (texto, archivo o link).

**Estado actual:** Prototipo avanzado con UI completa, navegación funcional y datos mock. Pendiente la integración con backend real (Supabase).

---

## 2. Stack Tecnológico (Confirmado)

### Frontend Core (Ya implementado)
- **Framework:** React 18+
- **Build Tool:** Vite
- **Lenguaje:** TypeScript
- **Routing:** `react-router-dom` v6+
- **Estado/Data Fetching:** `@tanstack/react-query`

### UI/UX & Estilos (Ya implementado)
- **Framework CSS:** Tailwind CSS
- **Componentes:** `shadcn/ui` (basado en Radix UI)
- **Iconografía:** `lucide-react`
- **Animaciones:** `tailwindcss-animate`
- **Notificaciones:** `sonner` y `toaster`

### Backend & Servicios (Pendiente de integración)
- **Autenticación:** Supabase Auth (email/password)
- **Base de Datos:** PostgreSQL via Supabase
- **Almacenamiento de archivos:** Supabase Storage
- **Videos:** Google Drive embebido (iframe)
- **Deployment:** Vercel o similar

---

## 3. Identidad Visual y Marca

La plataforma sigue la estética de Academia Labora: tema oscuro, premium y moderno.

### Paleta de Colores
| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo principal | `#1A1A1A` | Background general |
| Fondo gradiente decorativo | `#8B0000` → `#9B1B6B` | Login, headers, hero sections |
| Acento primario | `#AAFF00` (verde lima) | Botones principales, highlights, indicadores activos, el "IA" del branding |
| Texto principal | `#FFFFFF` | Títulos y cuerpo |
| Texto secundario | `#A0A0A0` | Labels, descripciones |
| Superficie/cards | `#242424` con borde `#333333` | Cards, paneles, modales |
| Éxito/completado | `#00C9A7` (teal) | Progreso, checkmarks, badges de completado |
| Error/vencido | `#FF6B6B` | Alertas, fechas vencidas |
| Hover en cards | `#AAFF00` al 20-30% opacidad | Borde al hacer hover |

### Tipografía
- Fuente principal: "Plus Jakarta Sans" o "DM Sans" (Google Fonts)
- Títulos: bold/extrabold
- Cuerpo: regular
- El texto "IA" en branding siempre en `#AAFF00`
- El texto "NoCode" siempre en blanco bold

### Componentes de UI
- Cards: border-radius 12px, fondo `#242424`, borde `#333333`, sombra sutil
- Botones primarios: fondo `#AAFF00`, texto `#1A1A1A` (negro), bold, border-radius 8px
- Botones secundarios: borde `#AAFF00`, texto `#AAFF00`, fondo transparente
- Transiciones: 0.2s ease en hover
- Badges: default (gris), success (verde lima), warning (naranja), destructive (rojo), info (teal)

---

## 4. Roles de Usuario

### Estudiante
- **Acceso:** Login con email/password
- **Cohorte:** Cada estudiante pertenece a un solo cohorte y solo ve el contenido de ese cohorte
- **Objetivos:** Ver clases, descargar materiales, completar tareas, seguir su progreso

### Administrador
- **Acceso:** Login con email/password, redirige a `/admin`
- **Objetivos:** Crear cohortes, gestionar contenido (módulos, clases, materiales), crear y revisar tareas, gestionar estudiantes

---

## 5. Modelo de Datos

### Estado actual vs. esquema objetivo

Los datos actualmente están en `mockData.ts` con interfaces TypeScript simplificadas. A continuación se define el **esquema completo objetivo** para Supabase, indicando qué campos ya existen en el prototipo y cuáles deben agregarse.

### 5.1 Tabla: `profiles` (extiende auth.users)

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK, FK → auth.users) | ✅ | |
| full_name | TEXT NOT NULL | ✅ como `name` | |
| email | TEXT NOT NULL | ✅ | |
| initials | TEXT | ✅ | Agregado por Cursor, útil para avatars |
| avatar_url | TEXT | ❌ Agregar | Para fotos de perfil en Storage |
| role | TEXT DEFAULT 'student' | ✅ | Valores: 'student', 'admin' |
| cohort_id | UUID (FK → cohorts) | ❌ Agregar | Relación estudiante ↔ cohorte |
| created_at | TIMESTAMPTZ DEFAULT now() | ❌ Agregar | |
| updated_at | TIMESTAMPTZ DEFAULT now() | ❌ Agregar | |

### 5.2 Tabla: `cohorts`

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK) | ✅ | |
| name | TEXT NOT NULL | ✅ | Ej: "Cohorte 15 — IA y No Code" |
| slug | TEXT UNIQUE | ❌ Agregar | URL amigable: "cohorte-15" |
| description | TEXT | ❌ Agregar | |
| start_date | DATE | ✅ como `startDate` | |
| end_date | DATE | ✅ como `endDate` | |
| max_students | INTEGER | ✅ como `students` | Capacidad máxima (cupos) |
| is_active | BOOLEAN DEFAULT true | ✅ como `status` | |
| created_at | TIMESTAMPTZ DEFAULT now() | ❌ Agregar | |

### 5.3 Tabla: `modules`

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK) | ✅ | |
| cohort_id | UUID (FK → cohorts) NOT NULL | ❌ Agregar | Relación módulo ↔ cohorte |
| title | TEXT NOT NULL | ✅ | |
| description | TEXT | ❌ Agregar | |
| order_index | INTEGER NOT NULL | ❌ Agregar | Para drag & drop de reordenamiento |
| is_published | BOOLEAN DEFAULT false | ✅ como `published` | |
| created_at | TIMESTAMPTZ DEFAULT now() | ❌ Agregar | |

### 5.4 Tabla: `lessons`

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK) | ✅ | |
| module_id | UUID (FK → modules) NOT NULL | ✅ como `moduleId` | |
| title | TEXT NOT NULL | ✅ | |
| description | TEXT | ❌ Agregar | Resumen/descripción de la clase |
| video_url | TEXT | ❌ Agregar | URL embed de Google Drive |
| order_index | INTEGER NOT NULL | ❌ Agregar | Orden dentro del módulo |
| duration_minutes | INTEGER | ✅ como `duration` | |
| status | TEXT | ✅ | Valores: 'locked', 'available', 'completed' (mejora de Cursor, mantener) |
| is_published | BOOLEAN DEFAULT false | ❌ Agregar | |
| created_at | TIMESTAMPTZ DEFAULT now() | ❌ Agregar | |

**Nota:** El campo `status` con 3 valores (locked/available/completed) fue una mejora de Cursor sobre el diseño original que solo tenía completed (bool). Mantener esta mejora ya que es mejor UX. En la DB, el estado "completed" se calculará desde `lesson_progress` y "locked/available" desde la lógica de publicación y orden.

### 5.5 Tabla: `lesson_materials`

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK) | ✅ | |
| lesson_id | UUID (FK → lessons) NOT NULL | ❌ Agregar | Relación material ↔ clase |
| title | TEXT NOT NULL | ✅ | |
| type | TEXT | ✅ | Valores: 'pdf', 'link', 'doc', 'other' |
| file_url | TEXT NOT NULL | ✅ como `url` | URL en Storage o link externo |
| created_at | TIMESTAMPTZ DEFAULT now() | ❌ Agregar | |

### 5.6 Tabla: `assignments`

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK) | ✅ | |
| cohort_id | UUID (FK → cohorts) NOT NULL | ❌ Agregar | Relación tarea ↔ cohorte |
| module_id | UUID (FK → modules) | ✅ como `moduleId` | Opcional |
| title | TEXT NOT NULL | ✅ | |
| description | TEXT | ❌ Agregar | Instrucciones detalladas de la tarea |
| due_date | TIMESTAMPTZ | ✅ como `deadline` | |
| is_published | BOOLEAN DEFAULT false | ❌ Agregar | Toggle de publicación |
| created_at | TIMESTAMPTZ DEFAULT now() | ❌ Agregar | |

### 5.7 Tabla: `submissions`

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK) | ❌ Agregar | |
| assignment_id | UUID (FK → assignments) NOT NULL | ❌ Agregar | Implícito en el prototipo |
| student_id | UUID (FK → profiles) NOT NULL | ✅ como `studentId` | |
| content_text | TEXT | ❌ Agregar | Respuesta en texto libre |
| file_url | TEXT | ❌ Agregar | Archivo en Supabase Storage |
| link_url | TEXT | ✅ como `content` | Link externo (GitHub, Lovable, etc.) |
| status | TEXT DEFAULT 'submitted' | ✅ | Valores: 'submitted', 'reviewed', 'revision_requested' |
| grade | TEXT | ❌ Agregar | Calificación opcional |
| admin_feedback | TEXT | ✅ como `feedback` | |
| submitted_at | TIMESTAMPTZ | ✅ como `submittedDate` | |
| reviewed_at | TIMESTAMPTZ | ❌ Agregar | |

### 5.8 Tabla: `lesson_progress` (NUEVA — No existe en prototipo)

| Campo | Tipo | En prototipo | Notas |
|-------|------|:---:|-------|
| id | UUID (PK) | ❌ Crear | |
| student_id | UUID (FK → profiles) NOT NULL | ❌ Crear | |
| lesson_id | UUID (FK → lessons) NOT NULL | ❌ Crear | |
| completed | BOOLEAN DEFAULT false | Integrado en Lesson | Separar a tabla propia |
| completed_at | TIMESTAMPTZ | ❌ Crear | |
| UNIQUE(student_id, lesson_id) | | ❌ Crear | Evitar duplicados |

**Nota importante:** Actualmente el campo `completed` vive dentro de la entidad Lesson en el prototipo. Al migrar a Supabase, este dato DEBE separarse a su propia tabla `lesson_progress` porque el progreso es POR ESTUDIANTE, no global. Una clase no está "completada" universalmente — cada estudiante tiene su propio progreso.

---

## 6. Seguridad: Row Level Security (RLS)

Al integrar Supabase, habilitar RLS en TODAS las tablas con estas políticas:

### Funciones Helper (crear en Supabase SQL)
```sql
CREATE OR REPLACE FUNCTION get_user_cohort_id() RETURNS UUID AS $$
  SELECT cohort_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT (role = 'admin') FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;
```

### Políticas por Tabla

| Tabla | Operación | Regla para Estudiante | Regla para Admin |
|-------|-----------|----------------------|-----------------|
| profiles | SELECT | id = auth.uid() | Todos |
| profiles | UPDATE | Solo el propio | Todos |
| cohorts | SELECT | id = get_user_cohort_id() | Todos |
| cohorts | INSERT/UPDATE/DELETE | — | Solo admin |
| modules | SELECT | cohort_id = get_user_cohort_id() AND is_published = true | Todos |
| modules | INSERT/UPDATE/DELETE | — | Solo admin |
| lessons | SELECT | Módulo pertenece a su cohorte AND is_published = true | Todos |
| lessons | INSERT/UPDATE/DELETE | — | Solo admin |
| lesson_materials | SELECT | Clase accesible para el usuario | Todos |
| lesson_materials | INSERT/UPDATE/DELETE | — | Solo admin |
| assignments | SELECT | cohort_id = get_user_cohort_id() AND is_published = true | Todos |
| assignments | INSERT/UPDATE/DELETE | — | Solo admin |
| submissions | SELECT | student_id = auth.uid() | Todos |
| submissions | INSERT | student_id = auth.uid() | — |
| submissions | UPDATE | — | Solo admin (para feedback) |
| lesson_progress | SELECT/INSERT/UPDATE | student_id = auth.uid() | Todos |

---

## 7. Almacenamiento de Archivos (Supabase Storage)

### Buckets a Crear

| Bucket | Contenido | Acceso Estudiante | Acceso Admin |
|--------|-----------|-------------------|-------------|
| `materials` | PDFs, documentos de clases | Lectura (si pertenece al cohorte) | Lectura + Escritura |
| `submissions` | Archivos entregados por estudiantes | Lectura/escritura (solo los propios) | Lectura de todos |
| `avatars` | Fotos de perfil | Lectura pública, escritura del propio | Lectura + Escritura |

### Límites Recomendados
- Archivos de tarea (submissions): máximo 10MB
- Materiales de clase: máximo 50MB
- Avatares: máximo 2MB

---

## 8. Estructura del Proyecto (Actual)

```text
/src
├── components/
│   ├── layouts/        # AdminLayout, StudentLayout
│   └── ui/             # Primitivas shadcn (Button, Card, Input...)
├── contexts/           # AuthContext (mock → migrar a Supabase Auth)
├── data/               # mockData.ts (→ reemplazar con queries a Supabase)
├── pages/
│   ├── admin/          # Vistas del administrador
│   ├── student/        # Vistas del estudiante
│   ├── Login.tsx
│   └── NotFound.tsx
├── lib/                # Utilidades (utils.ts)
└── App.tsx             # Configuración de rutas
```

### Estructura sugerida al integrar Supabase

```text
/src
├── components/
│   ├── layouts/
│   └── ui/
├── contexts/
│   └── AuthContext.tsx      # ← Migrar a Supabase Auth real
├── lib/
│   ├── supabase.ts          # ← NUEVO: Cliente Supabase
│   └── utils.ts
├── hooks/                   # ← NUEVO: Custom hooks para queries
│   ├── useModules.ts
│   ├── useLessons.ts
│   ├── useAssignments.ts
│   ├── useSubmissions.ts
│   └── useProgress.ts
├── services/                # ← NUEVO: Funciones de API
│   ├── auth.service.ts
│   ├── cohorts.service.ts
│   ├── modules.service.ts
│   ├── lessons.service.ts
│   ├── assignments.service.ts
│   ├── submissions.service.ts
│   └── storage.service.ts
├── types/                   # ← NUEVO: Tipos TypeScript centralizados
│   └── database.types.ts    # Generado por Supabase CLI
├── pages/
│   ├── admin/
│   ├── student/
│   ├── Login.tsx
│   └── NotFound.tsx
└── App.tsx
```

---

## 9. Funcionalidades — Estado Actual y Pendientes

### 9.1 Vistas del Estudiante

#### Login (`/login`) — ✅ Implementado (mock)
- Formulario email + password
- Branding Campus Labora con gradiente rojo/magenta
- Toggle para cambiar entre rol estudiante/admin (solo prototipo)
- **Pendiente:** Conectar a Supabase Auth real, eliminar toggle de roles, implementar "Olvidé mi contraseña"

#### Dashboard (`/dashboard`) — ✅ Implementado
- Saludo personalizado con nombre del estudiante
- Nombre del cohorte actual
- Barra de progreso general (clases completadas / total)
- Lista de módulos como cards/acordeones con progreso por módulo
- Sección de tareas pendientes con indicadores de urgencia
- **Pendiente:** Datos reales desde Supabase, filtrar por cohorte del estudiante via RLS

#### Vista de Módulo (`/modules/:id`) — ✅ Implementado
- Título y descripción del módulo
- Lista de clases con estados: Bloqueado (candado), Disponible (play), Completado (checkmark)
- Materiales del módulo
- Tareas vinculadas al módulo
- **Pendiente:** Datos reales, lógica de bloqueo basada en orden y publicación

#### Vista de Clase (`/lessons/:id`) — ✅ Implementado (parcial)
- Placeholder de video (contenedor con ícono play)
- Título y duración
- Materiales adjuntos
- **Pendiente:**
  - Reemplazar placeholder con iframe real de Google Drive: `<iframe src="https://drive.google.com/file/d/{FILE_ID}/preview" width="100%" height="480" allow="autoplay" allowfullscreen></iframe>` dentro de un contenedor responsive 16:9
  - Botón "Marcar como completada" que escriba en `lesson_progress`
  - Navegación "← Clase anterior / Siguiente clase →"
  - Descripción de la clase
  - Breadcrumbs: "Dashboard > Semana 2 > Navegación y routing"

#### Tareas (`/assignments`) — ✅ Implementado
- Lista de tareas con estado y fecha límite
- Filtros por estado
- **Pendiente:** Datos reales filtrados por cohorte

#### Detalle de Tarea (`/assignments/:id`) — ✅ Implementado (parcial)
- Título, instrucciones, fecha límite
- Formulario de entrega con texto y link
- Vista de feedback cuando está revisada
- **Pendiente:**
  - Agregar tab de **upload de archivo** (Supabase Storage bucket `submissions`): zona drag & drop, aceptar PDF, DOC, DOCX, PNG, JPG, ZIP, máximo 10MB
  - Validar que al menos uno de los 3 campos (texto, archivo, link) esté completo antes de enviar
  - Guardar entrega real en tabla `submissions`

#### Perfil (`/profile`) — ✅ Implementado
- Datos del estudiante y estadísticas
- **Pendiente:** Foto de perfil (upload a bucket `avatars`), datos reales

### 9.2 Panel de Administrador

#### Dashboard Admin (`/admin`) — ✅ Implementado
- Métricas: estudiantes activos, cohortes, entregas sin revisar, progreso promedio
- Entregas recientes
- **Pendiente:** Datos reales agregados desde Supabase

#### Gestión de Cohortes (`/admin/cohorts`) — ✅ Implementado
- Lista de cohortes con estado
- Formulario de creación (nombre, fechas, cupos)
- **Pendiente:**
  - CRUD real en tabla `cohorts`
  - Función "Duplicar cohorte": copiar módulos, clases y tareas de un cohorte existente a uno nuevo (sin estudiantes ni entregas)
  - Activar/desactivar cohortes

#### Gestión de Contenido (`/admin/cohorts/:id/content`) — ✅ Implementado (parcial)
- Módulos y clases organizados
- Toggle publicar/despublicar
- **Pendiente:**
  - CRUD real en tablas `modules`, `lessons`, `lesson_materials`
  - **Drag & drop** para reordenar módulos y clases (actualizar `order_index`)
  - Modal de crear/editar clase con campos: título, descripción, URL del video de Google Drive, duración en minutos
  - Sección de materiales dentro de cada clase: subir PDF a Storage o pegar link externo

#### Gestión de Tareas y Revisión (`/admin/assignments`) — ✅ Implementado
- Lista de tareas por cohorte
- Panel de revisión de entregas con feedback
- **Pendiente:**
  - CRUD real en tabla `assignments`
  - Actualización real de `submissions` (status, admin_feedback, grade, reviewed_at)
  - Crear tarea con campos: título, descripción/instrucciones, cohorte, módulo (opcional), fecha límite, toggle publicado

#### Gestión de Estudiantes (`/admin/students`) — ✅ Implementado
- Lista de estudiantes con progreso y tareas
- Perfil detallado del estudiante
- **Pendiente:**
  - Datos reales desde Supabase
  - **Crear estudiante:** Usar Supabase Admin API o Edge Function para crear usuario en auth.users + registro en profiles con cohorte asignado + generar password temporal y mostrarlo para que el admin lo comparta
  - Reasignar estudiante a otro cohorte (actualizar `profiles.cohort_id`)

---

## 10. Estrategia de Video Embebido (Google Drive)

### Formato de URL
Los videos están en Google Drive. Para embeber, transformar la URL:
- **URL de compartir:** `https://drive.google.com/file/d/{FILE_ID}/view`
- **URL embed:** `https://drive.google.com/file/d/{FILE_ID}/preview`

### Implementación en el Componente de Clase
```tsx
<div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
  <iframe
    src={`https://drive.google.com/file/d/${fileId}/preview`}
    className="absolute top-0 left-0 w-full h-full rounded-lg"
    allow="autoplay"
    allowFullScreen
  />
</div>
```

### Consideraciones
- Los videos deben estar configurados como "Cualquier persona con el link puede ver" en Google Drive
- Para cohortes grandes (+30 estudiantes simultáneos), considerar migrar a YouTube Unlisted
- Google Drive no permite evitar la descarga directa del video (limitación de la plataforma)

---

## 11. Trigger de Supabase (Auth → Profiles)

Al crear un nuevo usuario en auth.users, automáticamente crear su perfil:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, initials)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', 'U'), 1) ||
          LEFT(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), ' ', 2), 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 12. Plan de Implementación — Próximas Fases

### Fase 1: Integración Supabase Core (Prioridad Alta)
1. Crear proyecto en Supabase y configurar variables de entorno
2. Instalar `@supabase/supabase-js` y crear cliente en `lib/supabase.ts`
3. Crear las 8 tablas con el esquema completo definido en la sección 5
4. Implementar las funciones helper de RLS y todas las políticas de la sección 6
5. Crear el trigger de auth → profiles (sección 11)
6. Migrar `AuthContext.tsx` de mock a Supabase Auth real (login, logout, sesión, roles)
7. Eliminar el toggle de cambio de rol del prototipo
8. Implementar "Olvidé mi contraseña" con Supabase Auth

### Fase 2: Migrar Datos Mock a Queries Reales (Prioridad Alta)
1. Crear carpeta `services/` con funciones de API para cada tabla
2. Crear carpeta `hooks/` con custom hooks usando React Query
3. Reemplazar importaciones de `mockData.ts` por hooks en cada página
4. Cargar datos de seed (Cohorte 15 con sus módulos, clases y tareas) directamente en Supabase
5. Generar tipos TypeScript con `supabase gen types typescript`

### Fase 3: Funcionalidades Pendientes de UI (Prioridad Media)
1. **Video embed real:** Reemplazar placeholder con iframe de Google Drive responsive
2. **Upload de archivos en tareas:** Tab de archivo con drag & drop → Supabase Storage bucket `submissions`
3. **Navegación entre clases:** Botones "← Anterior / Siguiente →" basados en order_index
4. **Drag & drop en admin:** Para reordenar módulos y clases (actualizar order_index)
5. **Breadcrumbs** en vistas internas de estudiante
6. **Botón "Marcar como completada"** conectado a tabla `lesson_progress`
7. **Crear estudiante desde admin:** Edge Function o Admin API para crear usuario + perfil + password temporal

### Fase 4: Polish y Mejoras (Prioridad Baja)
1. Skeleton loaders durante carga de datos
2. Bottom navigation bar en mobile
3. Función "Duplicar cohorte" conectada a la DB
4. Foto de perfil con upload a bucket `avatars`
5. Fechas en formato español: "15 de febrero, 2026" y relativas: "Hace 2 días"
6. Estados vacíos con mensajes amigables e íconos

---

## 13. Mejoras Futuras (Post-MVP)

| Mejora | Descripción | Complejidad |
|--------|-------------|:-----------:|
| Certificados automáticos | Generar certificado PDF al completar el bootcamp | Media |
| Notificaciones email | Emails automáticos para nuevas tareas, feedback, recordatorios | Media |
| Chat/Foro por cohorte | Espacio de comunicación entre estudiantes | Alta |
| Migración a YouTube | Mover videos a YouTube Unlisted para mejor rendimiento | Baja |
| Analytics avanzados | Métricas detalladas de engagement y completamiento | Media |
| Acceso a cohortes pasados | Permitir acceso de archivo a cohortes anteriores | Baja |
| Integración con pagos | Auto-registro al pagar via MercadoPago/Stripe | Alta |
| App móvil (PWA) | Convertir a Progressive Web App para experiencia móvil nativa | Media |
| IA Tutor | Chatbot con Claude para soporte académico 24/7 | Alta |

---

*Campus Labora Hub — Academia Labora — IA NoCode*
*Documento Maestro v2.0 — Febrero 2026*