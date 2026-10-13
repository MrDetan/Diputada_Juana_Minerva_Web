# Portal Oficial | Dip. Juana Minerva Vázquez González
### LXV Legislatura H. Congreso del Estado de Sinaloa — Distrito 02 Ahome

Plataforma digital institucional y sistema de atención ciudadana para la representación legislativa del Distrito 02 de Ahome (Los Mochis, Topolobampo, Villa de Ahome, Higuera de Zaragoza, San Miguel Zapotitlán, El Guayabo y Sindicatura Central).

---

## 🏛️ Características Principales

- **Gestión Ciudadana y Rastreador de Folios (CRM Digital):** Formulario con generación instantánea de folio único, integración directa con WhatsApp oficial y rastreador en vivo con bitácora de turno a dependencias.
- **Explorador Territorial Interactivo (Distrito 02 Ahome):** Mapa vectorial SVG interactivo de las 7 sindicaturas de Ahome, detallando compromisos, fotos en territorio y personas atendidas.
- **Congreso de Sinaloa EN VIVO:** Transmisión oficial en directo del canal [@congresosinaloatv](https://www.youtube.com/@congresosinaloatv) y sesiones del Pleno.
- **Ficha Técnica Imprimible en PDF:** Exportación directa de proyectos de decreto de iniciativas con membrete institucional del Congreso de Sinaloa (`@media print`).
- **Sala de Prensa & Media Kit Oficial:** Descarga de recursos gráficos oficiales en alta resolución (fotos 300 DPI y logos) y botón de copia con un clic para periodistas.
- **Accesibilidad y PWA:** Controles de tamaño tipográfico (A+ / A-), modo alto contraste y soporte PWA mediante `manifest.json`.

---

## 🚀 Despliegue en GitHub Pages

Este repositorio está preparado para funcionar de forma nativa en **GitHub Pages**:

1. Ve a la pestaña **Settings** (Configuración) de tu repositorio en GitHub.
2. En el menú lateral izquierdo, haz clic en **Pages**.
3. En **Build and deployment > Source**:
   - Selecciona **GitHub Actions** (se ejecutará automáticamente el flujo incluido en `.github/workflows/deploy-pages.yml`).
   - O bien, selecciona **Deploy from a branch** eligiendo la rama `main` y la carpeta `/ (root)`.
4. El sitio estará disponible públicamente en:
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`

---

## 💻 Ejecución Local

Para levantar el servidor web localmente en cualquier momento:

```powershell
python -m http.server 8000
```

Abre en tu navegador:
`http://localhost:8000`

---

## 📂 Estructura del Proyecto

```text
├── .github/workflows/deploy-pages.yml  # Flujo automatizado de despliegue en Pages
├── assets/img/                        # Recursos visuales institucionales
├── css/styles.css                     # Sistema de diseño, tokens y temas
├── js/main.js                         # Lógica interactiva y simulador CRM
├── 404.html                           # Redirección amigable 404
├── index.html                         # Página principal estructurada
├── manifest.json                      # Configuración Web App PWA
├── .nojekyll                          # Compatibilidad GitHub Pages
└── README.md                          # Documentación del proyecto
```

© 2026 Oficina Parlamentaria de la Dip. Juana Minerva Vázquez González.
