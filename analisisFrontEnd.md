# Análisis Especializado de Frontend: UI/UX, Contenido Adaptativo, Accesibilidad y Correcciones — NexoOVA Studio

> **Documento:** `analisisFrontEnd.md`  
> **Proyecto:** NexoOVA Studio (SENA)  
> **Objetivo:** Evaluar a fondo la interfaz de usuario (UI), la experiencia de usuario (UX), el comportamiento de **contenido adaptativo** (tanto a nivel *multidispositivo/responsivo* como a nivel *pedagógico según el perfil y desempeño del aprendiz*), la accesibilidad (WCAG 2.1) y el rendimiento visual, entregando **observaciones, correcciones de código concretas y recomendaciones accionables**.

---

## 1. Análisis de UI/UX: Sistema Visual, Arquitectura de Información y Flujos

### 1.1. Coherencia del Sistema de Diseño (Design Tokens & Identidad Visual)
* **Observación:**
  * Actualmente coexisten **tres lenguajes visuales distintos** dentro de la misma aplicación:
    1. **Portada Temporal ([MinimalLandingPage.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/MinimalLandingPage.tsx)):** Estética editorial cálida (*Swiss-Grid*), fondo papel `#f6f5f0`, bordes `stone-300`, acentos terracota (`#d94e34`) y verde bosque (`#1c5d43`).
    2. **Lienzo en Grafo ([KnowledgeGraphCanvas.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/KnowledgeGraphCanvas.tsx)):** Estética nocturna tipo Obsidian (`#0b1120`) con acentos `indigo-500`, `emerald-400` y `rose-400`.
    3. **Portal de Aprendiz y Constructor OVA ([PublicLearnerPortal.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/PublicLearnerPortal.tsx), [OvaBuilderView.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/OvaBuilderView.tsx)):** Estética SaaS institucional fría (`bg-slate-50`, tarjetas blancas `border-slate-200`, botones primarios `bg-indigo-600`).
  * El salto visual entre la nueva **Portada Minimalista** (cálida y editorial) y el **Portal del Aprendiz** (frío `slate/indigo`) se percibe abrupto al hacer clic en *«Entrar al OVA»*.
* **Corrección y Recomendación:**
  * Definir **Tokens Semánticos de Superficie y Acento** en [src/index.css](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/index.css) para armonizar la lectura pública con la estética cálida y descansada para la vista de la portada, reservando el contraste frío/oscuro para las herramientas técnicas de autoría (Lienzo en Grafo y Bloques de Código IDE):
  ```css
  :root {
    --surface-canvas: #f6f5f0;       /* Papel cálido de lectura libre de fatiga visual */
    --surface-card: #ffffff;
    --border-hairline: #d6d3cd;
    --accent-brand: #d94e34;         /* Terracota editorial */
    --accent-sena: #1c5d43;          /* Verde bosque institucional */
    --accent-technical: #4f46e5;     /* Índigo para enlaces técnicos y grafo */
  }
  ```

---

### 1.2. Sobrecarga Vertical en Cabeceras y Brecha en Navegación Móvil
* **Observación en [src/App.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/App.tsx#L493-L865):**
  1. Se apilan **hasta 3 barras horizontales** antes del contenido principal:
     * Barra superior (`header`, ~58px).
     * Barra de contexto SENA + selector de modo (`bg-slate-100/80`, ~48px–76px cuando hace `flex-wrap`).
     * Barra de navegación móvil (`md:hidden`, ~46px).
     * En una pantalla móvil de `667px` de alto, estas tres barras consumen casi **25% de la altura útil** antes de ver el título de la lección.
  2. **Bug de navegación en móvil (`src/App.tsx`, líneas 758–865):** La barra de navegación móvil (`md:hidden`) tiene botones para `Catálogo de OVAs`, `Mis Evidencias` y `Mi Progreso`, pero **no incluye el botón `Portada`**, ni tampoco actualiza `setShowLandingPage(false)` al pulsar sus botones cuando el usuario está viendo la portada desde un celular.
* **Corrección Exacta para `src/App.tsx` (Navegación Móvil):**
  * Incluir el botón `Portada` y asegurar que cada botón móvil desactive `showLandingPage`:
  ```tsx
  <button
    type="button"
    onClick={() => setShowLandingPage(true)}
    className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
      showLandingPage ? 'bg-stone-900 text-white' : 'text-slate-600 bg-slate-100'
    }`}
  >
    Portada
  </button>
  <button
    type="button"
    onClick={() => {
      setShowLandingPage(false);
      setPublicSection('catalog');
    }}
    className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
      !showLandingPage && publicSection === 'catalog'
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 bg-slate-100'
    }`}
  >
    Catálogo de OVAs
  </button>
  ```

---

### 1.3. Flujo de Lectura Lineal y Falta de Paginación Inferior en Lecciones
* **Observación en [src/components/PublicLearnerPortal.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/PublicLearnerPortal.tsx#L663-L940):**
  * Cuando el aprendiz termina de leer una lección larga (con bloques de texto, enlaces, videos, código fuente, cuestionario y entrega de evidencia), al llegar al final de la página **no existe un botón de «Siguiente Lección →» ni «← Lección Anterior»**. El usuario se ve obligado a hacer *scroll* hasta arriba del todo para buscar la barra lateral izquierda y cambiar de lección.
* **Corrección Recomendada:**
  * Agregar un bloque de **Navegación Secuencial de Lecciones (*Pagination Footer*)** justo debajo de la sección de evidencia/autoevaluación:
  ```tsx
  {/* Navegación Secuencial al Final de la Lección */}
  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
    {prevLesson ? (
      <button onClick={() => handleSelectLesson(prevLesson.id)} className="text-xs font-semibold text-slate-700 hover:text-indigo-600">
        ← Lección 0{prevLesson.order}: {prevLesson.title}
      </button>
    ) : <div />}
    {nextLesson && (
      <button onClick={() => handleSelectLesson(nextLesson.id)} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
        Siguiente: Lección 0{nextLesson.order} →
      </button>
    )}
  </div>
  ```

---

### 1.4. Ergonomía Espacial en el Lienzo en Grafo (`KnowledgeGraphCanvas.tsx`)
* **Observación en [src/components/KnowledgeGraphCanvas.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/KnowledgeGraphCanvas.tsx#L492-L1275):**
  * El contenedor principal usa `flex-col lg:flex-row h-[calc(100vh-8.5rem)] min-h-[680px]`.
  * En pantallas `< 1024px` (`flex-col`), el lienzo y el inspector lateral (`aside` con `h-full`) compiten por la misma altura fija, dejando el lienzo reducido a una franja estrecha.
  * En pantallas de escritorio (`lg`), el inspector lateral fijo de `480px–540px` es excelente para editar bloques estilo Notion, pero cuando el instructor solo quiere organizar y conectar nodos en el mapa mental, ese panel ocupa ~40% del ancho de la pantalla sin opción de ocultarse.
* **Corrección Recomendada:**
  * Agregar un botón **«Ocultar / Mostrar Inspector (`[ ]`)»** en la esquina superior derecha del lienzo para permitir un **Modo Lienzo a Pantalla Completa (100% ancho)** cuando se organiza el grafo, desplegando el inspector automáticamente al hacer doble clic o seleccionar *"Editar Bloques"* en un nodo.

---

## 2. Análisis de Contenido Adaptativo (Dispositivo, Contexto y Pedagogía)

El análisis de **contenido adaptativo** en una plataforma educativa moderna como NexoOVA Studio abarca **dos dimensiones complementarias**:
1. **Adaptabilidad al Dispositivo y Entorno Físico** (*Responsive, Touch & Viewport Adaptation*).
2. **Adaptabilidad Pedagógica y Cognitiva** (*Adaptive Learning Content* según el nivel, ritmo y resultados del aprendiz).

---

### 2.1. Dimensión 1: Adaptabilidad al Dispositivo, Puntero Táctil y Viewport

#### A. Desbordamiento Horizontal (*Viewport Collision*) en Previsualizaciones Hover
* **Observación Crítica en [src/components/NotionLessonBlocks.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/NotionLessonBlocks.tsx#L337-L343):**
  * El contenedor de la tarjeta flotante de previsualización de enlaces y videos tiene:
    ```tsx
    className="absolute left-0 bottom-full mb-2 w-80 sm:w-96 z-50"
    ```
  * **¿Qué ocurre en la práctica?**
    * Cuando `HoverPreviewTrigger` se usa en modo `inline` dentro de un párrafo (por ejemplo, `[RFC 9110: Semántica HTTP]` ubicado cerca del margen derecho del bloque de texto), el `span` padre está a la derecha de la pantalla. Al posicionar el hijo con `left-0 w-96` (`384px` hacia la derecha a partir del inicio del enlace), **la tarjeta flotante se sale del borde derecho de la ventana** o queda cortada en pantallas pequeñas.
* **Corrección Recomendada:**
  1. En pantallas móviles (`< 640px`), renderizar la previsualización como un **Bottom Sheet fijo centrado en la pantalla**:
     ```tsx
     className="fixed inset-x-4 bottom-4 sm:absolute sm:inset-x-auto sm:left-0 sm:bottom-full sm:mb-2 sm:w-96 z-50"
     ```
  2. En escritorio, detectar si el enlace está en la mitad derecha de la columna (`getBoundingClientRect().left > window.innerWidth / 2`) para alternar dinámicamente entre `sm:left-0` y `sm:right-0`.

#### B. Interacción con Enlaces y Videos en Dispositivos Táctiles (*Touch vs. Hover*)
* **Observación Crítica en [src/components/NotionLessonBlocks.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/NotionLessonBlocks.tsx#L219-L246):**
  * En los enlaces `inline`, el elemento disparador es directamente una etiqueta `<a href={url} target="_blank">`.
  * En dispositivos con ratón (`pointer: fine`), el usuario pasa el cursor (`onMouseEnter`), lee el comentario del instructor sobre la relevancia del enlace/video y luego decide si hace clic.
  * En smartphones y tablets (`hover: none, pointer: coarse`), **no existe el paso previo de hover**: al tocar la píldora del enlace, el navegador abre inmediatamente la pestaña externa, impidiendo que el aprendiz lea el comentario pedagógico o vea el minuto sugerido del video.
* **Corrección Exacta Propuesta (*Progressive Touch Disclosure*):**
  * Interceptar el primer toque en dispositivos táctiles cuando la previsualización aún no está abierta (`!isOpen`):
  ```tsx
  onClick={(e) => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice && !isOpen) {
      e.preventDefault(); // El 1er toque muestra el comentario de relevancia del instructor
      setIsOpen(true);
    }
  }}
  ```
  * Así, en móvil el **primer toque** despliega la tarjeta con la explicación del instructor y la miniatura, y el **segundo toque** (o el botón dentro de la tarjeta) abre el recurso externo.

#### C. Gestos Táctiles en el Lienzo 2D (`KnowledgeGraphCanvas.tsx`)
* **Observación en [src/components/KnowledgeGraphCanvas.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/KnowledgeGraphCanvas.tsx#L685-L702):**
  * El área interactiva del grafo (`ref={containerRef}`) escucha `onPointerDown`, `onPointerMove` y `onPointerUp`, pero carece de la clase CSS `touch-none` (`touch-action: none`).
  * En tablets o pantallas táctiles, al arrastrar un nodo con el dedo el navegador interpreta el gesto como *scroll* vertical de la página, cancelando el evento `pointermove`.
* **Corrección Exacta:**
  * Añadir `touch-none` al contenedor del lienzo en la línea 699:
    ```tsx
    className={`flex-1 relative overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing ...`}
    ```

#### D. Adaptabilidad de Bloques de Código Fuente en Pantallas Pequeñas
* **Observación en [src/components/NotionLessonBlocks.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/NotionLessonBlocks.tsx#L533-L550):**
  * `CodeSegmentBlockView` usa una tabla con `whitespace-pre` y `overflow-x-auto`. En pantallas móviles de `375px`, las líneas de código de más de 45 caracteres requieren desplazamiento horizontal constante.
* **Recomendación:**
  * Añadir un botón toggle **`Ajustar texto (Wrap)`** junto al botón `Copiar código` en la cabecera del IDE para alternar entre `whitespace-pre` y `whitespace-pre-wrap break-words` según la preferencia del aprendiz en móvil.

---

### 2.2. Dimensión 2: Contenido Pedagógico Adaptativo (*Adaptive Learning*)

Gracias a que ahora el contenido de cada lección está modelado como un arreglo estructurado de bloques (`LessonBlock[]`: `heading`, `text`, `link`, `video`, `code`, `callout`), la plataforma tiene la base ideal para implementar **Contenido Adaptativo Inteligente**:

#### A. Modos de Densidad Cognitiva Adaptables por el Aprendiz
* **Observación:**
  * No todos los aprendices estudian igual en cada momento:
    * En su primera lectura necesitan el **desarrollo conceptual completo** (`Texto + Callouts + Enlaces + Videos + Código`).
    * Cuando están codificando la evidencia para entregarla, necesitan ir directo a los **ejemplos de código fuente y enlaces técnicos**.
    * Antes de presentar el cuestionario, prefieren un **modo síntesis o audiovisual**.
* **Propuesta de Implementación (*Selector de Modo de Estudio en la Cabecera de la Lección*):**
  * Añadir en `PublicLearnerPortal.tsx` un selector adaptativo de vista de bloques:
    1. **`Lectura Completa (100%)`:** Muestra todos los bloques de la lección.
    2. **`Modo Práctico / Código y Laboratorio`:** Filtra o destaca en primer plano los bloques `type === 'code'`, `type === 'callout'` y la actividad RAP, colapsando la teoría larga.
    3. **`Modo Audiovisual y Referencias`:** Destaca los bloques `type === 'video'` y `type === 'link'` con sus comentarios de relevancia desplegados por defecto.

#### B. Corrección de Regla Pedagógica en Autoevaluaciones y *Remediation Adaptativo*
* **Observación Crítica en [src/App.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/App.tsx#L393-L428) (`handleSubmitQuizScore`):**
  * Actualmente, cuando un aprendiz pulsa *«Calificar Autoevaluación»*, la función `handleSubmitQuizScore` ejecuta:
    ```ts
    const nextCompleted = Array.from(
      new Set([...currentProg.completedLessonIds, lessonId])
    );
    ```
  * **Problema pedagógico:** ¡Marca la lección como **Completada (`✓`)** incluso si el aprendiz obtuvo **`0%` o `50%`** en el cuestionario! (En el modelo de evaluación del SENA, un Resultado de Aprendizaje requiere mínimo **70%–80%** para considerarse aprobado).
* **Corrección y Propuesta de Contenido Adaptativo Basado en Resultados:**
  1. **Umbral mínimo de aprobación (`scorePct >= 70`):** Solo agregar `lessonId` a `completedLessonIds` si `scorePct >= 70`.
  2. **Bloques de Refuerzo Adaptativo (*Adaptive Remediation*):** Si el aprendiz obtiene `< 70%`, desplegar automáticamente en la parte superior del cuestionario una tarjeta de **Refuerzo Personalizado** que liste específicamente los bloques de `video`, `enlace` o `código` de esa lección que debe repasar antes de reintentar.

#### C. Adaptación Contextual según Proximidad de Fecha Límite (*Urgency-Driven UI*)
* **Propuesta:**
  * Si el aprendiz activo aún tiene la evidencia de la lección en estado `pending` o `late` y faltan $\le 3$ días para `dueDate`:
    * Mostrar al inicio de la lección un **Banner Adaptativo de Entrega Rápida** con un botón *«Saltar directo a los requisitos de la Evidencia»* y resaltar automáticamente los bloques de código o enlaces cuyo comentario de relevancia mencione el código de la evidencia (`GA7-...` / `GA4-...`).

---

## 3. Auditoría de Accesibilidad (WCAG 2.1), Impresión PDF y Micro-Detalles

### 3.1. Bug Crítico de Impresión Multi-Página en `PrintableStudyGuideModal.tsx`
* **Observación en [src/components/PrintableStudyGuideModal.tsx](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/components/PrintableStudyGuideModal.tsx#L129-L130) y [src/index.css](file:///home/carmelo/Escritorio/nexo-ova/nexo-ovas-1/src/index.css#L39-L53):**
  * El contenedor del modal imprimible usa:
    ```tsx
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs overflow-y-auto p-4 sm:p-8 flex justify-center">
    ```
  * Cuando el usuario hace clic en **«Imprimir / Guardar PDF»** (`window.print()`), los motores de impresión de Chrome, Edge y Firefox **no paginan contenedores con `position: fixed` y `overflow-y: auto`**: cortan el PDF en la primera página visible y omiten el resto de las lecciones, mientras que el contenido del `<main>` detrás del modal sí tiene `.no-print` (`display: none !important`).
* **Corrección Exacta en `src/index.css`:**
  * Agregar en `@media print` una regla para liberar el contenedor del modal de su `position: fixed` y `overflow`:
  ```css
  @media print {
    body {
      background: #ffffff !important;
      color: #0f172a !important;
    }
    .no-print {
      display: none !important;
    }
    /* Desbloquear paginación completa A4/Carta del modal de Guía de Estudio */
    .fixed.inset-0 {
      position: static !important;
      overflow: visible !important;
      background: transparent !important;
      padding: 0 !important;
      display: block !important;
    }
  }
  ```

---

### 3.2. Accesibilidad por Teclado y Lectores de Pantalla (A11y)
* **Observaciones puntuales:**
  1. **Cierre con tecla `Escape`:** Ni `InstructorLoginModal.tsx`, ni `PrintableStudyGuideModal.tsx`, ni `HoverPreviewTrigger` en `NotionLessonBlocks.tsx` escuchan `onKeyDown` para cerrar con la tecla `Escape`.
  2. **Contraste de Texto Auxiliar:** En varios componentes se usa `text-slate-400` (`#94a3b8`) sobre fondo blanco o `bg-slate-50` (`#f8fafc`). La relación de contraste es de **2.5:1**, por debajo del mínimo de **4.5:1** exigido por WCAG 2.1 AA para texto pequeño (`10px–12px`).
  3. **Respeto a `prefers-reduced-motion`:** Las animaciones continuas (`.animate-pulse-ring` en la portada minimalista y `animate-pulse` en el punto de sincronización) deben desactivarse si el usuario tiene activada la reducción de movimiento en su sistema operativo.
* **Corrección Recomendada:**
  * Reemplazar `text-slate-400` por `text-slate-500` (`#64748b`, contraste 4.6:1 sobre blanco) en textos informativos sobre fondos claros, y añadir en `src/index.css`:
    ```css
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    ```

---

## 4. Resumen Ejecutivo de Correcciones Priorizadas

| # | Componente / Archivo | Tipo | Problema Detectado | Solución Concreta |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `src/components/NotionLessonBlocks.tsx` | **Adaptativo / Móvil** | El popover de hover (`w-80 sm:w-96 left-0`) puede salirse por el borde derecho en enlaces inline y en pantallas táctiles el toque navega sin mostrar el comentario. | En móvil (`< 640px`), mostrar como *Bottom Sheet* fijo (`fixed inset-x-4 bottom-4`) e interceptar el 1er toque en `hover: none` para previsualizar antes de abrir la URL. |
| **2** | `src/index.css` & `PrintableStudyGuideModal.tsx` | **Bug UI / Impresión** | `window.print()` recorta la guía de estudio en la 1ª página porque el modal tiene `fixed inset-0 overflow-y-auto`. | En `@media print`, forzar `position: static !important; overflow: visible !important;` sobre el contenedor del modal. |
| **3** | `src/App.tsx` | **UX Móvil** | La barra móvil (`md:hidden`) no tiene botón para volver a la `Portada` ni cierra `showLandingPage` al pulsar sus pestañas. | Añadir el botón `Portada` en la barra móvil y llamar a `setShowLandingPage(false)` en las demás pestañas. |
| **4** | `src/App.tsx` (`handleSubmitQuizScore`) | **Contenido Adaptativo** | Marca la lección como completada (`✓`) aunque el aprendiz obtenga `< 70%` en el cuestionario. | Exigir `scorePct >= 70` para marcar completada y mostrar bloques de refuerzo adaptativo cuando haya respuestas fallidas. |
| **5** | `src/components/KnowledgeGraphCanvas.tsx` | **Adaptativo Táctil** | Falta `touch-none` en el lienzo del grafo y opción de colapsar el inspector lateral de `540px`. | Añadir `touch-none` al contenedor del grafo y un botón para ocultar/desplegar el panel inspector. |
| **6** | `src/components/PublicLearnerPortal.tsx` | **Flujo UX** | No hay botones de *«← Lección Anterior / Siguiente Lección →»* al terminar de leer una lección ni filtro adaptativo por modo de estudio (*Todo / Solo Código / Solo Videos*). | Añadir barra de paginación al pie de la lección y filtro rápido de bloques en la cabecera. |
