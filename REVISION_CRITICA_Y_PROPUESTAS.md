# Auditoría Crítica Integral y Propuestas de Evolución — NexoOVA Studio

> **Fecha de revisión:** Noviembre 2026  
> **Alcance:** Revisión completa de código fuente (`src/`), arquitectura de datos (`types/ova.ts`, `initialData.ts`), experiencia de autoría bidireccional (`KnowledgeGraphCanvas.tsx` ↔ `OvaBuilderView.tsx` ↔ `NotionLessonBlocks.tsx`), portada minimalista (`MinimalLandingPage.tsx`) y portal de estudio (`PublicLearnerPortal.tsx`).  
> **Enfoque dual:**  
> 1. **Ojo Crítico de Programador / Arquitecto de Software** (Calidad de código, rendimiento, seguridad, escalabilidad y mantenibilidad).  
> 2. **Ojo Crítico de Usuario Muy Joven que Está Aprendiendo** (UX/UI generacional, retención de atención, interactividad móvil, gamificación y pedagogía activa).

---

## Parte 1: Con Ojo Crítico de Programador (Auditoría Técnica y de Arquitectura)

### 1.1. Gestión de Estado, Serialización en `localStorage` y Cuellos de Botella de Renderizado
* **Diagnóstico en código (`src/App.tsx`, líneas 76–190):**
  * Todo el árbol de estado de la aplicación (`nodes`, `edges`, `regions`, `ovas`, `learners`, `sentLogs`) vive en el componente raíz `App.tsx` y se persiste en `localStorage` mediante efectos (`useEffect`) que ejecutan `JSON.stringify(...)` en **cada cambio de estado sin *debounce***.
  * **Impacto real:**
    1. Cuando el instructor arrastra un nodo en el lienzo (`KnowledgeGraphCanvas.tsx`, `handlePointerMove`), `onUpdateNodes` actualiza el estado global en cada píxel de movimiento del puntero (60–120 veces por segundo), provocando que `App.tsx` re-renderice y serialice todo el arreglo de nodos en `localStorage` sincrónicamente en el hilo principal.
    2. Cuando el instructor escribe rápido en un bloque de texto o código dentro de `NotionLessonBlocks.tsx`, cada pulsación de tecla dispara la reconstrucción de `contentMarkdown`, la sincronización bidireccional nodo ↔ lección y dos escrituras completas de `JSON.stringify` (`NODES` y `OVAS`).
* **Recomendaciones y Propuesta Técnica:**
  1. **Separar estado transitorio de interacción del estado persistido:** Durante el `pointermove` en el lienzo 2D, mantener las coordenadas `(x, y)` del nodo arrastrado en un estado local ligero o `useRef` + transformación CSS (`translate3d`), y hacer *commit* al estado global (`onUpdateNodes`) únicamente en `onPointerUp`.
  2. **Implementar *Debounce* en la persistencia (300ms–500ms) o migrar a IndexedDB / Store modular:** Extraer el estado de `App.tsx` a un store con **Zustand** (con *slices* independientes para Grafo, OVAs y Aprendices) y persistir de forma asíncrona con `idb-keyval` (IndexedDB) para no bloquear el *main thread* ni chocar con el límite de ~5 MB de `localStorage`.

---

### 1.2. Seguridad: Sanitización en Exportadores HTML y Autenticación en Cliente
* **Diagnóstico en código (`src/components/OvaBuilderView.tsx`, líneas 237–288 y `src/components/PrintableStudyGuideModal.tsx`, líneas 55–120):**
  * Las funciones `handleExportLmsHtmlPackage` y `handleDownloadPrintableDocument` construyen documentos HTML interpolando directamente cadenas como `${selectedOva.title}` y `${l.contentMarkdown.replace(/\n/g, '<br/>')}` sin escapar entidades HTML (`<`, `>`, `&`, `"`).
  * **Impacto real:**
    * Como ahora los OVAs incluyen **segmentos de código fuente** (`HTML/CSS`, `TypeScript` con genéricos como `Array<string>`, o etiquetas `<script>`), al exportar a HTML para LMS o Guía Imprimible el navegador interpretará esas etiquetas como DOM real (rompiendo la maquetación del código o introduciendo vulnerabilidades de **Stored/Exported XSS**).
  * Asimismo, en `src/data/initialData.ts` (líneas 12–19) y `src/components/InstructorLoginModal.tsx`, las credenciales docentes (`instructor.sena` / `sena2026`) están expuestas en el bundle del cliente y la sesión se valida con un booleano en `localStorage`.
* **Recomendaciones y Propuesta Técnica:**
  1. **Función `escapeHtml()` obligatoria en exportadores:** Escapar todos los campos de texto y renderizar los bloques `LessonBlock[]` en el exportador HTML usando etiquetas `<pre><code>` con entidades escapadas (`&lt;`, `&gt;`).
  2. **Aprovechar el backend Express ya instalado en `package.json`:** El proyecto ya incluye `"express": "^4.21.2"` y `"dotenv": "^17.2.3"` en `package.json`, pero no los utiliza. Se recomienda levantar una API ligera (`/api/auth`, `/api/ovas`, `/api/graph`, `/api/submissions`) para validar sesiones con JWT real y persistir entregas de aprendices en una base de datos compartida en lugar del navegador local de cada equipo.

---

### 1.3. Geometría del Lienzo en Grafo yPosicionamiento de Popovers Flotantes (`HoverPreviewTrigger`)
* **Diagnóstico en código (`src/components/KnowledgeGraphCanvas.tsx` y `src/components/NotionLessonBlocks.tsx`):**
  1. **Altura fija en cálculo de aristas SVG (`NODE_HEIGHT = 156`):** Las curvas de Bézier de las conexiones entre nodos calculan el centro vertical asumiendo siempre `156px` de alto, pero las tarjetas que incluyen píldoras de enlaces, videos y código tienen una altura dinámica mayor (~190–210px).
  2. **Recorte de Popovers por `overflow-hidden`:** `HoverPreviewTrigger` renderiza la tarjeta flotante con posicionamiento absoluto (`bottom-full mb-2 left-0`). Cuando un enlace o video está en la parte superior del contenedor del lienzo o dentro de un acordeón con `overflow-hidden`, la parte superior del popover puede recortarse si está muy cerca del borde superior.
  3. **Zoom y Navegación del Lienzo:** El lienzo tiene botones `+` / `-`, pero carece de zoom con rueda del ratón (`onWheel` centrado en el cursor), atajos de teclado (`Supr` para borrar nodo, `Ctrl+Z` para deshacer) y ajuste automático de encuadre (*Fit to Screen*).
* **Recomendaciones y Propuesta Técnica:**
  1. **Renderizar el popover de previsualización mediante `createPortal(..., document.body)`** calculando `getBoundingClientRect()` del enlace o video al hacer hover, invirtiendo automáticamente la dirección (*flip* hacia abajo si `rect.top < 260px`).
  2. **Medición real de nodos con `ResizeObserver`** o anclaje de puertos de entrada/salida (arriba/abajo/izquierda/derecha) para que las flechas SVG conecten con precisión milimétrica.
  3. **Historial Undo/Redo en el Lienzo y en el Editor de Bloques:** Implementar un *command stack* (`past`, `present`, `future`) para deshacer borrados accidentales de nodos o bloques con `Ctrl/Cmd + Z`.

---

### 1.4. Fechas Hardcodeadas y Funcionalidad Incompleta de Calificación Docente
* **Diagnóstico en código:**
  * En múltiples archivos (`App.tsx`, `LearnerProgressAndReminders.tsx` línea 100, `MinimalLandingPage.tsx` línea 124, `PublicLearnerPortal.tsx` línea 172) la fecha de referencia está fija en `'2026-11-09'`.
  * En `src/types/ova.ts` (líneas 92–100), la interfaz `EvidenceSubmission` define `instructorFeedback?: string` y `score?: number`, pero en `LearnerProgressAndReminders.tsx` el instructor solo puede **ver** el enlace entregado por el aprendiz; no tiene un formulario o modal para **asignar la calificación (0–100) ni escribir retroalimentación pedagógica**.
* **Recomendaciones y Propuesta Técnica:**
  1. Centralizar el manejo de fechas en un helper `getCurrentAcademicDate()` (con opción de fecha real del sistema o fecha simulada para demos).
  2. Agregar en `LearnerProgressAndReminders.tsx` un ** Cajón de Calificación Rápida (*Grading Drawer*)** donde el instructor abra la entrega del aprendiz, asigne puntaje (`0–100`), redacte feedback y cambie el estado entre `Aprobado` / `Plan de Mejoramiento`.

---

### 1.5. Optimización del Bundle y Deprecaciones de Vite 8
* **Diagnóstico en compilación (`npm run build`):**
  * El bundle JS único alcanza **~621 kB** (superando el umbral de advertencia de 500 kB de Vite).
  * `vite.config.ts` usa `__dirname`, lo que emite una advertencia en el cargador nativo de Vite 8.
* **Recomendaciones y Propuesta Técnica:**
  1. Reemplazar `__dirname` por `import.meta.dirname` en `vite.config.ts`.
  2. Aplicar **Code Splitting con `React.lazy` y `<Suspense>`** para cargar bajo demanda `KnowledgeGraphCanvas`, `OvaBuilderView`, `LearnerProgressAndReminders` y `PrintableStudyGuideModal`.

---

## Parte 2: Con Ojo Crítico de un Usuario Muy Joven que Está Aprendiendo (UX Generacional y Pedagogía Activa)

> **Perfil del usuario evaluador:** Aprendiz joven (16–22 años), nativo digital, acostumbrado a experiencias inmediatas, visuales y táctiles (TikTok, Discord, Duolingo, VS Code, Notion, GitHub Copilot), que estudia tanto en el computador del laboratorio como en su **teléfono móvil** mientras viaja en transporte público.

### 2.1. "Veo el código fuente, pero quiero ejecutarlo y experimentar ahí mismo" (Code Playground Interactivo)
* **Lo que siente el aprendiz joven hoy:**
  * *"Me encanta que el código tenga colores, números de línea y botón de copiar, pero si estoy leyendo cómo funciona un endpoint Express o una consulta SQL `CREATE TABLE` en mi celular o navegador, no quiero solo mirarlo de forma pasiva: quiero darle a un botón **▶ Ejecutar**, cambiar un valor, ver qué error sale si envío un código de ficha de 5 dígitos en vez de 7 y entenderlo jugando."*
* **Propuesta de Implementación:**
  1. **Simulador de Peticiones REST In-Situ ("Mini-Postman / Try It"):** Debajo de los bloques de código backend (`TypeScript/Express` u `OpenAPI`), añadir un pequeño panel interactivo donde el aprendiz pueda modificar un JSON de prueba (`{ "fichaCode": "2874512" }`), pulsar **«Probar Petición POST»** y ver la respuesta simulada (`201 Created` o `422 Unprocessable Content`).
  2. **Motor SQL en el Navegador (`sql.js` / WebAssembly):** En los bloques de código `SQL`, permitir ejecutar las sentencias `CREATE TABLE` y `SELECT` directamente dentro de la lección y mostrar la tabla resultante en vivo.
  3. **Retos de Código con Huecos (*Fill-in-the-Blank Code Blocks*):** Un nuevo tipo de bloque `/reto-codigo` donde el instructor oculte 1 o 2 expresiones clave (ej. el código de estado `___` o la cláusula `REFERENCES ___`) para que el aprendiz las complete antes de desbloquear el siguiente bloque.

---

### 2.2. El Problema del "Hover" en Pantallas Táctiles (Móviles y Tablets)
* **Lo que siente el aprendiz joven hoy:**
  * *"En el computador de escritorio pasar el mouse por encima del enlace o del video para ver el comentario del profe funciona brutal. Pero cuando abro el OVA desde mi celular, **no existe el cursor (hover)**: si toco el enlace con el dedo, me saca inmediatamente a otra pestaña antes de que pueda leer el comentario sobre por qué es importante o en qué minuto ver el video."*
* **Propuesta de Implementación (Crítica para Móvil):**
  * **Comportamiento Adaptativo *Tap-to-Preview* en Móviles:** Detectar dispositivos táctiles (o agregar un botón compacto `💬 Ver nota del profe` al lado de cada enlace/video inline). En móvil, el primer toque despliega un *Bottom Sheet* suave con la miniatura del video, el minuto clave y el comentario del instructor, y dentro del *Bottom Sheet* ofrece los botones **«Reproducir aquí»** o **«Ir al sitio externo ↗»**.

---

### 2.3. Tutor IA Contextual Integrado en Cada Bloque (Aprovechando `@google/genai`)
* **Lo que siente el aprendiz joven hoy:**
  * *"A veces leo términos como 'idempotencia', 'dependencia transitiva en 3FN' o 'factor de costo Argon2id' y me quedo bloqueado. Si no entiendo un párrafo o una línea de código a las 10:00 p.m., tengo que salirme de la plataforma a buscar en otro lado."*
* **Hallazgo clave en el repositorio:**
  * ¡La librería oficial **`@google/genai` (`^2.4.0`) ya está instalada en `package.json`** y `GEMINI_API_KEY` ya figura en `.env.example`, pero actualmente no se usa en ningún componente!
* **Propuesta de Implementación:**
  * **Botón «✨ Explicar de otra forma / Preguntar al Tutor IA» en cada bloque:**
    * **En bloques de texto/conceptos:** Opción *"Explícamelo con una analogía sencilla de la vida real"* o *"Dame un resumen en 3 puntos clave"*.
    * **En bloques de código fuente:** Opción *"Explícame este código línea por línea"* o *"¿Qué pasa si quito la línea X?"*.
    * **En la entrega de evidencias:** Un **"Pre-Validador IA de Evidencias"** donde el aprendiz pegue su fragmento de SQL o esquema OpenAPI antes de enviarlo y el asistente le diga si cumple los criterios de la guía SENA (`GA7-...`).

---

### 2.4. Micro-Progreso, Dopamina Visual y Bloques Desplegables (Evitar el "Muro de Texto")
* **Lo que siente el aprendiz joven hoy:**
  * *"Cuando entro a una lección y veo todo el contenido abierto de arriba a abajo, se siente largo. Prefiero ir desbloqueando o marcando paso por paso, con feedback visual rápido que me motive a terminar."*
* **Propuesta de Implementación:**
  1. **Checkboxes por Bloque y Barra de Lectura Activa:** Permitir que el aprendiz marque como "Entendido ✓" cada bloque de código o video a medida que baja por la lección, llenando una barra de progreso fluida con microanimación de celebración al llegar al 100%.
  2. **Nuevo Bloque `/acordeon` (Toggle Block estilo Notion) para Pistas y Soluciones:** Permitir al instructor plantear una pregunta o reto rápido en mitad de la lección y ocultar la respuesta o pista dentro de un bloque desplegable (*"👀 Ver pista antes de mirar la solución"*).
  3. **Sistema de Rachas (*Streaks*) e Insignias por Competencia:** Mostrar en el perfil del aprendiz insignias desbloqueables al superar cuestionarios al 100% y entregar evidencias antes de la fecha límite (*"⚡ Entrega Anticipada"*, *"🛡️ Guardián JWT"*, *"🗄️ Arquitecto 3FN"*).

---

### 2.5. Fricción de Identificación y Falta de Colaboración / Comunidad de Ficha
* **Lo que siente el aprendiz joven hoy:**
  * *"En la vista pública cualquiera puede cambiar el selector desplegable de arriba y elegir a otro compañero de la ficha o registrar una entrega a su nombre por error. Además, si tengo una duda sobre la Evidencia GA7, no veo si mis compañeros de ficha tuvieron la misma duda."*
* **Propuesta de Implementación:**
  1. **Modo Identificación con PIN Ligero o Código de Aprendiz:** Mantener el catálogo de OVAs 100% libre y público sin contraseña, pero solicitar confirmación rápida (ej. los últimos 4 dígitos del documento o fecha de nacimiento) únicamente al momento de **enviar o sobrescribir el enlace de una evidencia**, evitando que un aprendiz sobrescriba por accidente la entrega de otro compañero en el selector público.
  2. **Reacciones Rápidas y Dudas Frecuentes por Bloque ("¿Te quedó claro este bloque?"):** Añadir al final de cada lección o bloque complejo reacciones rápidas (`🔥 Clarísimo`, `🤔 Tengo duda en el código`, `🎬 El video ayudó mucho`) que además le sirvan de termómetro en tiempo real al instructor en su Lienzo en Grafo para saber qué nodos del mapa conceptual necesitan mejor explicación.

---

## Parte 3: Matriz Priorizada de Evolución (Roadmap Sugerido)

| Prioridad | Iniciativa | Perfil Beneficiado | Complejidad | Impacto |
| :---: | :--- | :--- | :---: | :---: |
| **P0 (Inmediato)** | **Escapado HTML en exportadores + Portal para Popovers Hover + Soporte Tap-to-Preview en móvil** | Programador & Aprendiz Joven | Baja | **Muy Alto** (Seguridad XSS y usabilidad móvil) |
| **P0 (Inmediato)** | **Debounce en `localStorage` + Estado local durante drag en `KnowledgeGraphCanvas`** | Programador / Instructor | Baja | **Alto** (60 FPS estables en grafos grandes) |
| **P1 (Corto Plazo)** | **Integrar `@google/genai` como Tutor IA por bloque ("Explícame este código / analogía")** | Aprendiz Joven | Media | **Muy Alto** (Diferenciador pedagógico clave) |
| **P1 (Corto Plazo)** | **Cajón de Calificación y Feedback Docente en `LearnerProgressAndReminders`** | Instructor & Aprendiz | Baja | **Alto** (Cierra el ciclo de evaluación SENA) |
| **P2 (Mediano Plazo)** | **Bloques Interactivos `/reto-codigo`, `/acordeon` (Toggle Notion) y Simulador REST/SQL in-situ** | Aprendiz Joven | Media-Alta | **Muy Alto** (Aprendizaje activo *learning-by-doing*) |
| **P2 (Mediano Plazo)** | **Persistencia real con Backend Express + Base de Datos y Code Splitting (`React.lazy`)** | Programador / Institución | Media | **Alto** (Sincronización multi-dispositivo real) |
