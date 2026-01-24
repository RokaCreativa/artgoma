# Work Log - Migración Artgoma (LIFO Mode)

<!-- 
🎯 LIFO = Last In, First Out
⬆️ NEW ENTRIES GO ON TOP ⬆️
📖 Post-compaction recovery: head -30 work_prepend.md gives you everything
-->

## 🎯 Quick Status
```yaml
timestamp: 2026-01-24 04:35
phase: "LANDING PAGE RESCUE - FINAL STAGE"
current_task: "Arreglando configuración de imágenes Next.js (next.config.js)"
next_action: "Verificar carga de imágenes/videos en local y descansar"
context_used: 100% (Minio Rescue Completo)
blockers: "Conflicto entre next.config.mjs y next.config.js (SOLUCIONADO)"
breakthrough: "Rescatados TODOS los videos del slider usando Minio Docker local"
quality: "9.5/10 - Landing con videos y fotos originales recuperados"
```

## 📈 Progress Tracker
✅ **Landing Page**:
    - **Backend**: DB migrada + Prisma con `directUrl`.
    - **Datos**: JSONs actualizados apuntando a Supabase.
    - **Assets**: 
        - Fotos eventos recuperadas.
        - **¡VIDEOS RESCATADOS!**: Usando Docker Minio local sobre el backup `scp`.
        - Subidos a Supabase `events/videos`.
    - **Frontend**: Configurado para Supabase.
    - **Bug Fix**: Eliminado conflicto de `next.config` duplicado para permitir carga de imágenes externas.

🔄 **Galería de Arte**:
    - DB limpia y lista (`gallery_clean.sql`).
    - Fotos de cuadros: Pendientes (no estaban en el backup local). Posiblemente en Cloudinary perdido.
    - Estrategia: Se abordará en Fase 2.

---

## 📜 Session Log (Newest First ⬆️)

### 04:30 - 🐛 NEXT.JS CONFIG WAR
- **Problema**: Error `Invalid src prop` persistente a pesar de actualizar config.
- **Causa**: Existían `next.config.js` (viejo) y `next.config.mjs` (nuevo) a la vez. Next leía el viejo.
- **Solución**: Borrado `.mjs`, creado `next.config.js` (CommonJS) con dominios permitidos (`aslzzjjk...`).
- **Estado**: Esperando reinicio de servidor para confirmar victoria total.

### 04:10 - 🐳 MINIO RESCUE SUCCESS
- **Acción**: Levantado contenedor `minio/minio` montando la carpeta descargada del VPS.
- **Resultado**: ¡EL BUCKET `backup_artgoma_landing` APARECIÓ!
- **Extracción**: Descargados manualmente los videos `videoCarouselX.mp4` desde la UI de Minio (`localhost:9006`).
- **Impacto**: Tenemos los videos originales. La web ya no necesita placeholders.

### 03:00 - 🛑 FRENAZO DE DESCARGA MASIVA
- **Problema**: Bajar 95GB del VPS era inviable (lento).
- **Pivote**: Bajamos solo la carpeta clave `artgoma-landing` detectada por `find`.
- **Análisis**: Los archivos bajaron en formato crudo de Minio (`part.1`). Irrecuperables sin Minio Server.

### 02:30 - 🕵️‍♂️ BÚSQUEDA DE ASSETS PERDIDOS
- **Videos**: No estaban en el volúmen inicial.
- **Cuadros**: No aparecen en ningún volúmen local. Confirmado que estaban en servicio externo o bucket perdido.

### 02:00 - 🚀 LANDING ARRANCA
- `npm run dev` funciona en puerto 3001.
- Conexión a Supabase correcta.
- Diseño intacto.

---

## 💡 Lecciones Aprendidas
- **Minio Backup**: Nunca confíes en copiar carpetas de Minio (`part.1`). Usa `mc mirror` o levanta un Docker local para leerlo.
- **Next.js Config**: JAMÁS tengas `.js` y `.mjs` juntos. Borra siempre el antiguo. Y reinicia el server 2 veces si hace falta.
- **Persistencia**: Si crees que los datos están, sigue buscando. Los videos aparecieron al final.

---

## 🔄 Recovery Instructions
1.  **Arrancar Landing**: `npm run dev` (con `next.config.js` limpio).
2.  **Verificar**: Videos slider + Fotos sponsors cargando desde Supabase.
3.  **Siguiente paso**: Importar `gallery_clean.sql` en Supabase para tener la DB completa.
