/**
 * MAIN INTERACTIVE SCRIPT
 * Diputada Juana Minerva Vázquez González - LXV Legislatura Sinaloa
 */

let currentInitiativeId = 1;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initStatsCounter();
    initInitiativesFilter();
    initInitiativeModal();
    initAgendaTabs();
    initAccessibility();
    initScrollSpyAndBackToTop();
    initSindicaturasExplorer();
    initFolioTracker();
    initPrintableInitiative();
    initLiveStreamModal();
    initMediaKitModal();
    initNewsCopyButtons();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawer = document.getElementById('mobile-drawer');
    const mobLinks = document.querySelectorAll('.mob-link');

    if (mobileBtn && drawer) {
        mobileBtn.addEventListener('click', () => {
            drawer.classList.add('open');
        });
    }

    if (closeDrawerBtn && drawer) {
        closeDrawerBtn.addEventListener('click', () => {
            drawer.classList.remove('open');
        });
    }

    mobLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (drawer) drawer.classList.remove('open');
        });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (drawer && drawer.classList.contains('open') && !drawer.contains(e.target) && !mobileBtn.contains(e.target)) {
            drawer.classList.remove('open');
        }
    });
}

/* ==========================================================================
   2. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1800; // ms
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toLocaleString('es-MX');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString('es-MX');
                }
            }, stepTime);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.hero-quick-stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

/* ==========================================================================
   3. INITIATIVES FILTER & LIVE SEARCH
   ========================================================================== */
function initInitiativesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('initiative-search');
    const cards = document.querySelectorAll('.initiative-card');

    function applyFilterAndSearch() {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        const searchTerm = (searchInput?.value || '').toLowerCase().trim();

        cards.forEach(card => {
            const categories = (card.getAttribute('data-category') || '').toLowerCase();
            const textContent = card.innerText.toLowerCase();

            const matchesCategory = activeFilter === 'all' || categories.includes(activeFilter);
            const matchesSearch = searchTerm === '' || textContent.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilterAndSearch();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilterAndSearch);
    }
}

/* ==========================================================================
   4. INITIATIVE MODAL VIEWER & PRINT PDF
   ========================================================================== */
const INITIATIVES_DATA = {
    1: {
        title: "Prohibición de Nepotismo Electoral y Regulación de Reelección Inmediata",
        legislatura: "LXV Legislatura • Dictamen Aprobado",
        date: "Octubre 2024",
        category: "Constitucional / Transparencia",
        content: `
            <p>Esta reforma a la Constitución Política del Estado de Sinaloa establece límites claros e inapelables para evitar que familiares en primer y segundo grado de consanguinidad o afinidad sucedan de manera inmediata a titulares de alcaldías, sindicaturas de procuración y diputaciones locales.</p>
            <p>Se busca desterrar las dinastías familiares en la administración pública y abrir las puertas al mérito ciudadano, jóvenes y liderazgos comunitarios de Sinaloa.</p>
        `,
        impact: "Cierra el paso al influyentismo y fortalece la democracia participativa con igualdad de oportunidades políticas en los 20 municipios de Sinaloa."
    },
    2: {
        title: "Garantía de Presupuestos con Perspectiva de Género e Igualdad Sustantiva",
        legislatura: "LXIV / LXV Legislatura • Decretada en Ley",
        date: "Diciembre 2024",
        category: "Finanzas Públicas & Género",
        content: `
            <p>Modificación estructural a la Ley de Presupuesto del Estado para etiquetar y blindar partidas destinadas al refugio de víctimas de violencia familiar, programas de autonomía económica para mujeres y acceso a créditos blandos.</p>
            <p>Establece la obligatoriedad de que todas las dependencias estatales reporten indicadores de impacto con perspectiva de género cada trimestre.</p>
        `,
        impact: "Mayor presupuesto seguro para refugios, centros de justicia para mujeres en el norte del estado y fondos productivos para jefas de familia en Ahome."
    },
    3: {
        title: "Ley de Fomento a la Economía Circular y Protección de Cuencas Hidrológicas",
        legislatura: "LXV Legislatura • En Comisión Dictaminadora",
        date: "Enero 2025",
        category: "Ecología y Sustentabilidad",
        content: `
            <p>Proyecto integral que moderniza la gestión de residuos industriales, agrícolas y urbanos en los valles de Ahome, Guasave y El Fuerte. Incluye incentivos fiscales locales para industrias verdes y medidas de saneamiento de la Bahía de Topolobampo.</p>
        `,
        impact: "Protección a mantos freáticos, reforestación de cuencas y disminución de tiraderos clandestinos en comunidades rurales."
    },
    4: {
        title: "Armonización Constitucional de Derechos de Comunidades y Pueblos Originarios",
        legislatura: "LXV Legislatura • Aprobada en Pleno",
        date: "Febrero 2025",
        category: "Derechos Humanos & Pueblos Indígenas",
        content: `
            <p>Garantiza el derecho a la consulta libre, previa, informada y culturalmente adecuada para las comunidades Mayo-Yoreme en todo tipo de proyecto de infraestructura y desarrollo que afecte sus territorios ancestrales.</p>
        `,
        impact: "Reconocimiento pleno de las autoridades tradicionales y asignación de presupuesto directo para preservación de lengua y tradiciones."
    },
    5: {
        title: "Ley de Voluntad Anticipada del Estado de Sinaloa",
        legislatura: "LXIV Legislatura • Decretada",
        date: "Noviembre 2023",
        category: "Salud & Bioética",
        content: `
            <p>Marco legal para que cualquier persona en pleno uso de sus facultades pueda decidir de manera anticipada los tratamientos médicos en caso de una enfermedad terminal o irreversible, asegurando cuidados paliativos dignos.</p>
        `,
        impact: "Tranquilidad, dignidad y certidumbre jurídica y emocional para pacientes y sus familias ante enfermedades terminales."
    },
    6: {
        title: "Protección y Rescate del Patrimonio Histórico de los Terrenos del Ingenio Azucarero",
        legislatura: "LXV Legislatura • Punto de Acuerdo Aprobado",
        date: "Marzo 2025",
        category: "Patrimonio & Cultura Ahome",
        content: `
            <p>Exhorto legislativo vinculante a las autoridades municipales y de desarrollo urbano para asegurar que los polígonos históricos del emblemático Ingenio Azucarero de Los Mochis se destinen a un gran parque cultural, histórico y recreativo.</p>
        `,
        impact: "Preservación de la memoria histórica e identidad de Los Mochis, evitando la especulación inmobiliaria en terrenos emblemáticos."
    }
};

function initInitiativeModal() {
    const modal = document.getElementById('initiative-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const btnCloseFooter = document.getElementById('modal-btn-close');
    const readMoreBtns = document.querySelectorAll('.btn-read-more');

    const modalTitle = document.getElementById('modal-title');
    const modalBadges = document.getElementById('modal-badges');
    const modalMeta = document.getElementById('modal-meta');
    const modalContent = document.getElementById('modal-content');
    const modalImpact = document.getElementById('modal-impact');

    function openModal(id) {
        currentInitiativeId = parseInt(id, 10);
        const data = INITIATIVES_DATA[id];
        if (!data || !modal) return;

        modalTitle.textContent = data.title;
        modalBadges.innerHTML = `<span class="init-badge badge-aprobada">${data.legislatura}</span>`;
        modalMeta.innerHTML = `<span><i class="fa-regular fa-calendar"></i> ${data.date}</span> <span><i class="fa-solid fa-tag"></i> ${data.category}</span>`;
        modalContent.innerHTML = data.content;
        modalImpact.textContent = data.impact;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-init-id');
            openModal(id);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', closeModal);

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
}

function initPrintableInitiative() {
    const printBtn = document.getElementById('modal-btn-print');
    if (!printBtn) return;

    printBtn.addEventListener('click', () => {
        const data = INITIATIVES_DATA[currentInitiativeId] || INITIATIVES_DATA[1];
        if (!data) return;

        const sheetTitle = document.getElementById('print-sheet-title');
        const sheetDate = document.getElementById('print-sheet-date');
        const sheetStatus = document.getElementById('print-sheet-status');
        const sheetBody = document.getElementById('print-sheet-body');
        const sheetImpact = document.getElementById('print-sheet-impact');
        const sheetExp = document.getElementById('print-sheet-exp');

        if (sheetTitle) sheetTitle.textContent = data.title;
        if (sheetDate) sheetDate.textContent = data.date;
        if (sheetStatus) sheetStatus.textContent = data.legislatura.toUpperCase();
        if (sheetBody) sheetBody.innerHTML = data.content;
        if (sheetImpact) sheetImpact.textContent = data.impact;
        if (sheetExp) sheetExp.textContent = `EXP-LEG-LXV-2024-00${currentInitiativeId}8`;

        window.print();
    });
}

/* ==========================================================================
   5. AGENDA TABS
   ========================================================================== */
function initAgendaTabs() {
    const tabs = document.querySelectorAll('.agenda-tab');
    const eventItems = document.querySelectorAll('.agenda-event-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-target');

            eventItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (target === 'todas-actividades' || category === target) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   6. EXPLORADOR TERRITORIAL DE SINDICATURAS (DISTRITO 02 AHOME - 2.1)
   ========================================================================== */
const SINDICATURAS_DATA = {
    'mochis': {
        title: "Los Mochis — Distrito 02 Ahome",
        category: '<i class="fa-solid fa-crown"></i> Cabecera Distrital & Módulo Central',
        visitBadge: '<i class="fa-regular fa-calendar-check"></i> Presencia Permanente',
        desc: "Atención directa permanente a comités vecinales de más de 45 colonias de la zona urbana de Los Mochis. Diálogo constante con familias, comerciantes, maestros y jóvenes deportistas.",
        achievements: [
            "Canalización de solicitudes de rehabilitación de alumbrado y bacheo en colonias populares.",
            "Asesoría jurídica gratuita permanente en el Módulo de Enlace de Blvd. Rosales e Independencia.",
            "Defensa legislativa de los terrenos históricos del Ingenio Azucarero para uso cultural y cívico."
        ],
        people: "+14,200 personas atendidas",
        photo: "assets/img/territorio_ahome.jpg",
        caption: '<i class="fa-solid fa-camera"></i> Atención directa en audiencias vecinales de Los Mochis y sindicaturas.',
        formLocation: "Ahome - Los Mochis"
    },
    'topolobampo': {
        title: "Topolobampo — Puerto y Bahía de Ahome",
        category: '<i class="fa-solid fa-anchor"></i> Sector Pesquero y Portuario',
        visitBadge: '<i class="fa-regular fa-calendar-check"></i> 12 Recorridos Realizados',
        desc: "Respaldo directo a las cooperativas pesqueras ribereñas, trabajadores del puerto y familias de los barrios tradicionales del emblemático puerto de Topolobampo.",
        achievements: [
            "Gestión para rehabilitación de luminarias y servicios en el malecón y colonias altas.",
            "Iniciativa en el Congreso para fomento a la sustentabilidad y saneamiento de la Bahía.",
            "Canalización de apoyos en temporadas de veda y programas de salud preventiva para pescadores."
        ],
        people: "+2,100 familias beneficiadas",
        photo: "assets/img/ahome_territorio_comunidad_1791082074125.jpg",
        caption: '<i class="fa-solid fa-camera"></i> Diálogo con pescadores y líderes comunitarios en Topolobampo.',
        formLocation: "Ahome - Topolobampo"
    },
    'villa-ahome': {
        title: "Villa de Ahome — Raíz e Historia del Municipio",
        category: '<i class="fa-solid fa-landmark"></i> Pueblo Histórico y Agrícola',
        visitBadge: '<i class="fa-regular fa-calendar-check"></i> 16 Asambleas Informativas',
        desc: "Cercanía con ejidatarios, adultos mayores y comerciantes de la histórica Villa de Ahome, preservando sus tradiciones e impulsando el desarrollo social.",
        achievements: [
            "Apoyo en trámites de certeza patrimonial ejidal y regularización jurídica.",
            "Gestión de mantenimiento para espacios cívicos y centros de salud comunitarios.",
            "Asambleas ciudadanas periódicas para informar reformas de bienestar de la 4T."
        ],
        people: "+1,850 ciudadanas y ciudadanos",
        photo: "assets/img/territorio_ahome.jpg",
        caption: '<i class="fa-solid fa-camera"></i> Asamblea comunitaria y rendición de cuentas en Villa de Ahome.',
        formLocation: "Ahome - Villa de Ahome"
    },
    'higuera': {
        title: "Higuera de Zaragoza — Corazón Productivo",
        category: '<i class="fa-solid fa-wheat-awn"></i> Valle Agrícola y Ganadero',
        visitBadge: '<i class="fa-regular fa-calendar-check"></i> 14 Giras de Trabajo',
        desc: "Recorridos casa por casa en colonias y campos agrícolas de Higuera de Zaragoza, atendiendo problemáticas de agua potable, caminos y drenaje.",
        achievements: [
            "Gestión prioritaria de motoconformado y mantenimiento de caminos vecinales y sacacosechas.",
            "Entrega de apoyos escolares y material deportivo para secundarias y preparatorias.",
            "Enlace con dependencias para desazolve de canales y drenes pluviales antes de lluvias."
        ],
        people: "+1,620 personas apoyadas",
        photo: "assets/img/ahome_territorio_comunidad_1791082074125.jpg",
        caption: '<i class="fa-solid fa-camera"></i> Encuentro con familias productoras de Higuera de Zaragoza.',
        formLocation: "Ahome - Higuera de Zaragoza"
    },
    'san-miguel': {
        title: "San Miguel Zapotitlán — Identidad Yoreme-Mayo",
        category: '<i class="fa-solid fa-feather-pointed"></i> Pueblos Originarios y Tradiciones',
        visitBadge: '<i class="fa-regular fa-calendar-check"></i> 18 Encuentros Comunitarios',
        desc: "Compromiso indisoluble con las autoridades tradicionales indígenas Yoreme-Mayo, sus centros ceremoniales y el respeto a sus derechos colectivos reconocidos en la Constitución.",
        achievements: [
            "Aprobación de la reforma constitucional de consulta libre e informada a pueblos originarios.",
            "Gestión para preservación del centro ceremonial y festividades tradicionales de Semana Santa.",
            "Jornadas de atención médica gratuita y asesoría legal con traductores comunitarios."
        ],
        people: "+2,400 habitantes atendidos",
        photo: "assets/img/territorio_ahome.jpg",
        caption: '<i class="fa-solid fa-camera"></i> Convivencia y trabajo legislativo en San Miguel Zapotitlán.',
        formLocation: "Ahome - San Miguel Zapotitlán"
    },
    'el-guayabo': {
        title: "El Guayabo (Heriberto Valdez Romero)",
        category: '<i class="fa-solid fa-tractor"></i> Comunidades Ribereñas del Río Fuerte',
        visitBadge: '<i class="fa-regular fa-calendar-check"></i> 9 Jornadas en Campo',
        desc: "Atención directa a ejidos cercanos al Río Fuerte, respaldando a campesinos y gestionando obras de electrificación rural y servicios escolares.",
        achievements: [
            "Supervisión y gestión de obras de agua potable y ampliación de red eléctrica ejidal.",
            "Mesa de trabajo con módulos de riego para defensa del uso equitativo del agua.",
            "Canalización de techumbres y equipamiento básico para primarias rurales."
        ],
        people: "+980 personas beneficiadas",
        photo: "assets/img/diputada_trabajo.jpg",
        caption: '<i class="fa-solid fa-camera"></i> Recorrido ejidal en la sindicatura Heriberto Valdez Romero.',
        formLocation: "Ahome - Heriberto Valdez Romero"
    },
    'central': {
        title: "Ahome Central / Independencia",
        category: '<i class="fa-solid fa-users-rays"></i> Sindicatura Central y Ejidos Vecinos',
        visitBadge: '<i class="fa-regular fa-calendar-check"></i> 11 Recorridos Territoriales',
        desc: "Vínculo cercano con comunidades periurbanas y ejidos como Mochis, Plan de San Luis, México y Compuertas, llevando gestiones de servicios públicos indispensables.",
        achievements: [
            "Gestión para desazolve de drenajes sanitarios en ejidos con rezago histórico.",
            "Módulos itinerantes de salud, corte de cabello y atención jurídica gratuita.",
            "Organización de comités vecinales de vigilancia y bienestar social."
        ],
        people: "+1,450 beneficiarios directos",
        photo: "assets/img/territorio_ahome.jpg",
        caption: '<i class="fa-solid fa-camera"></i> Jornada de bienestar social en ejidos de la Sindicatura Central.',
        formLocation: "Ahome - Ahome Independencia"
    }
};

function selectSindicatura(key) {
    const data = SINDICATURAS_DATA[key];
    if (!data) return;

    // Update active pill
    document.querySelectorAll('.sindicatura-pill').forEach(pill => {
        if (pill.getAttribute('data-sind') === key) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });

    // Update map active pin
    document.querySelectorAll('.map-pin-group').forEach(pin => {
        if (pin.getAttribute('data-pin') === key) {
            pin.classList.add('active-pin');
        } else {
            pin.classList.remove('active-pin');
        }
    });

    // Update DOM elements
    const titleEl = document.getElementById('sind-title');
    const catTag = document.getElementById('sind-cat-tag');
    const visitBadge = document.getElementById('sind-visit-badge');
    const descEl = document.getElementById('sind-desc');
    const achieveList = document.getElementById('sind-achievements');
    const peopleEl = document.getElementById('sind-people');
    const photoEl = document.getElementById('sind-photo');
    const captionEl = document.getElementById('sind-photo-caption');
    const ctaBtn = document.getElementById('btn-request-in-sind');

    if (titleEl) titleEl.textContent = data.title;
    if (catTag) catTag.innerHTML = data.category;
    if (visitBadge) visitBadge.innerHTML = data.visitBadge;
    if (descEl) descEl.textContent = data.desc;
    if (peopleEl) peopleEl.innerHTML = `<i class="fa-solid fa-users"></i> ${data.people}`;
    if (photoEl) photoEl.src = data.photo;
    if (captionEl) captionEl.innerHTML = data.caption;
    if (ctaBtn) {
        ctaBtn.innerHTML = `<i class="fa-solid fa-hand-holding-hand"></i> Solicitar Gestión en ${key === 'mochis' ? 'Los Mochis' : data.title.split('—')[0].trim()}`;
        ctaBtn.onclick = () => preselectSindicaturaInForm(data.formLocation);
    }

    if (achieveList) {
        achieveList.innerHTML = data.achievements.map(a => `<li><i class="fa-solid fa-circle-check text-morena"></i> ${a}</li>`).join('');
    }
}

function preselectSindicaturaInForm(sindLocation) {
    const tabRegister = document.getElementById('tab-btn-register');
    if (tabRegister) tabRegister.click();

    const select = document.getElementById('municipio');
    if (select) {
        select.value = sindLocation;
    }

    const buzonSection = document.getElementById('buzon');
    if (buzonSection) {
        buzonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function initSindicaturasExplorer() {
    const pills = document.querySelectorAll('.sindicatura-pill');
    const pins = document.querySelectorAll('.map-pin-group');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const key = pill.getAttribute('data-sind');
            selectSindicatura(key);
        });
    });

    pins.forEach(pin => {
        pin.addEventListener('click', () => {
            const key = pin.getAttribute('data-pin');
            selectSindicatura(key);
        });
    });
}

/* ==========================================================================
   7. BUZÓN CIUDADANO & FOLIO TRACKER (PUNTO 1: RASTREADOR + WHATSAPP)
   ========================================================================== */
const FOLIOS_DATABASE = {
    'JMV-2026-8492': {
        folio: 'JMV-2026-8492',
        ciudadano: 'María Elena S.',
        colonia: 'Colonia Tabachines, Los Mochis',
        categoria: 'Servicios Públicos (Alumbrado y Drenaje)',
        fecha: '08 Octubre 2026',
        estatusClass: 'status-proceso',
        estatusText: 'En Gestión Institucional',
        currentStep: 3,
        dependencia: 'H. Ayuntamiento de Ahome (Obras Públicas)',
        oficioNum: 'OF-DIP-JMV/LXV/2026-0412',
        log: [
            { fecha: '08 Octubre 2026 - 10:14 hrs', desc: 'Gestión ciudadana recibida a través del portal oficial.' },
            { fecha: '09 Octubre 2026 - 12:30 hrs', desc: 'Validación técnica por el equipo de enlace legislativo del Distrito 02.' },
            { fecha: '11 Octubre 2026 - 09:45 hrs', desc: 'Oficio remitido a la Dirección General de Obras y Servicios Públicos de Ahome con solicitud de calendarización urgente.' }
        ]
    },
    'JMV-2026-7310': {
        folio: 'JMV-2026-7310',
        ciudadano: 'Roberto C.',
        colonia: 'Barrio Las Conchas, Topolobampo',
        categoria: 'Apoyo a Cooperativa Pesquera y Alumbrado',
        fecha: '24 Septiembre 2026',
        estatusClass: 'status-concluida',
        estatusText: 'Concluida con Éxito',
        currentStep: 4,
        dependencia: 'Secretaría de Pesca del Estado / Municipio de Ahome',
        oficioNum: 'OF-DIP-JMV/LXV/2026-0388',
        log: [
            { fecha: '24 Septiembre 2026', desc: 'Solicitud registrada en audiencia ciudadana de Topolobampo.' },
            { fecha: '26 Septiembre 2026', desc: 'Expediente turnado a mesa interinstitucional.' },
            { fecha: '29 Septiembre 2026', desc: 'Aprobación de sustitución de 18 luminarias y entrega de apoyos de red pesquera.' },
            { fecha: '04 Octubre 2026', desc: 'Gestión concluida y verificada por comité de vecinos.' }
        ]
    },
    'JMV-2026-9154': {
        folio: 'JMV-2026-9154',
        ciudadano: 'Carmen V.',
        colonia: 'San Miguel Zapotitlán',
        categoria: 'Asesoría Jurídica y Certeza Patrimonial',
        fecha: '10 Octubre 2026',
        estatusClass: 'status-revision',
        estatusText: 'En Análisis Jurídico',
        currentStep: 2,
        dependencia: 'Bufete Jurídico de Enlace Parlamentario',
        oficioNum: 'EXP-JUR-2026-092',
        log: [
            { fecha: '10 Octubre 2026 - 16:20 hrs', desc: 'Recepción de documentos en el módulo de Los Mochis.' },
            { fecha: '12 Octubre 2026 - 11:00 hrs', desc: 'Revisión por abogados especialistas en derecho agrario y civil.' }
        ]
    }
};

let lastCreatedFolio = null;

function renderFolioTracking(folioCode) {
    const output = document.getElementById('tracker-result-output');
    if (!output) return;

    const key = folioCode.toUpperCase().trim();
    const data = FOLIOS_DATABASE[key];

    if (!data) {
        output.innerHTML = `
            <div class="tracker-card text-center">
                <i class="fa-solid fa-triangle-exclamation text-warning" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
                <h4 style="color: var(--color-morena);">Folio no encontrado</h4>
                <p style="color: var(--text-secondary); margin-bottom: 16px;">No se encontró registro para el folio <strong>${folioCode}</strong>. Verifica el número o escríbenos directamente a la oficina de atención ciudadana.</p>
                <a href="https://wa.me/526688124500?text=Hola%20equipo%20de%20la%20Diputada%2C%20tengo%20duda%20con%20mi%20folio%20${encodeURIComponent(folioCode)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp-action">
                    <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp
                </a>
            </div>
        `;
        return;
    }

    const s1 = data.currentStep >= 1 ? 'completed' : '';
    const s2 = data.currentStep >= 2 ? (data.currentStep === 2 ? 'active' : 'completed') : '';
    const s3 = data.currentStep >= 3 ? (data.currentStep === 3 ? 'active' : 'completed') : '';
    const s4 = data.currentStep === 4 ? 'completed' : '';

    output.innerHTML = `
        <div class="tracker-card">
            <div class="tracker-card-head">
                <div>
                    <span class="tracker-folio-title"><i class="fa-solid fa-ticket"></i> ${data.folio}</span>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Fecha de Registro: ${data.fecha}</p>
                </div>
                <div>
                    <span class="tracker-status-tag ${data.estatusClass}"><i class="fa-solid fa-circle-dot"></i> ${data.estatusText}</span>
                </div>
            </div>

            <!-- Stepper -->
            <div class="tracker-stepper">
                <div class="tracker-step-item ${s1}">
                    <div class="step-node">${data.currentStep > 1 ? '<i class="fa-solid fa-check"></i>' : '1'}</div>
                    <div class="step-label">1. Recibida en Módulo</div>
                    <div class="step-connector"></div>
                </div>
                <div class="tracker-step-item ${s2}">
                    <div class="step-node">${data.currentStep > 2 ? '<i class="fa-solid fa-check"></i>' : '2'}</div>
                    <div class="step-label">2. Revisión Jurídica / Técnica</div>
                    <div class="step-connector"></div>
                </div>
                <div class="tracker-step-item ${s3}">
                    <div class="step-node">${data.currentStep > 3 ? '<i class="fa-solid fa-check"></i>' : '3'}</div>
                    <div class="step-label">3. Turnada a Dependencia</div>
                    <div class="step-connector"></div>
                </div>
                <div class="tracker-step-item ${s4}">
                    <div class="step-node">${data.currentStep === 4 ? '<i class="fa-solid fa-check"></i>' : '4'}</div>
                    <div class="step-label">4. Resolución y Conclusión</div>
                </div>
            </div>

            <!-- Meta details -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin: 18px 0; font-size: 0.875rem;">
                <div><strong>Solicitante:</strong> <br><span style="color: var(--text-secondary);">${data.ciudadano}</span></div>
                <div><strong>Ubicación:</strong> <br><span style="color: var(--text-secondary);">${data.colonia}</span></div>
                <div><strong>Tipo de Asunto:</strong> <br><span style="color: var(--text-secondary);">${data.categoria}</span></div>
                <div><strong>Oficio de Turno:</strong> <br><span style="color: var(--color-morena); font-family: monospace;">${data.oficioNum}</span></div>
            </div>

            <!-- Log Entries -->
            <div class="tracker-log-box">
                <h5><i class="fa-solid fa-clock-rotate-left text-gold"></i> Bitácora Oficial de Avance:</h5>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
                    ${data.log.map(item => `
                        <li style="font-size: 0.8125rem; line-height: 1.4;">
                            <strong style="color: var(--color-morena-dark);">${item.fecha}:</strong> ${item.desc}
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- Contact action -->
            <div style="margin-top: 20px; text-align: center;">
                <a href="https://wa.me/526688124500?text=Hola%20equipo%20de%20la%20Diputada%20Juana%20Minerva%2C%20solicito%20informaci%C3%B3n%20actualizada%20del%20folio%20${data.folio}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp-action">
                    <i class="fa-brands fa-whatsapp"></i> Preguntar a un Asesor por WhatsApp
                </a>
            </div>
        </div>
    `;
}

function initFolioTracker() {
    const tabRegister = document.getElementById('tab-btn-register');
    const tabTrack = document.getElementById('tab-btn-track');
    const panelRegister = document.getElementById('panel-register');
    const panelTrack = document.getElementById('panel-track');

    const searchInput = document.getElementById('tracker-folio-input');
    const searchBtn = document.getElementById('btn-search-folio-action');
    const examplePills = document.querySelectorAll('.example-folio-pill');
    const trackNewFolioBtn = document.getElementById('btn-track-new-folio');

    if (tabRegister && tabTrack && panelRegister && panelTrack) {
        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabTrack.classList.remove('active');
            panelRegister.style.display = 'block';
            panelTrack.style.display = 'none';
        });

        tabTrack.addEventListener('click', () => {
            tabTrack.classList.add('active');
            tabRegister.classList.remove('active');
            panelRegister.style.display = 'none';
            panelTrack.style.display = 'block';

            // Auto search last created or default if empty
            if (searchInput && !searchInput.value) {
                if (lastCreatedFolio) {
                    searchInput.value = lastCreatedFolio;
                    renderFolioTracking(lastCreatedFolio);
                } else {
                    searchInput.value = 'JMV-2026-8492';
                    renderFolioTracking('JMV-2026-8492');
                }
            }
        });
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) renderFolioTracking(query);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) renderFolioTracking(query);
            }
        });
    }

    examplePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const folio = pill.getAttribute('data-folio');
            if (searchInput) searchInput.value = folio;
            renderFolioTracking(folio);
        });
    });

    if (trackNewFolioBtn) {
        trackNewFolioBtn.addEventListener('click', () => {
            if (tabTrack) tabTrack.click();
            if (searchInput && lastCreatedFolio) {
                searchInput.value = lastCreatedFolio;
                renderFolioTracking(lastCreatedFolio);
            }
        });
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('citizen-form');
    const successBox = document.getElementById('form-success-message');
    const ticketElement = document.getElementById('ticket-number');
    const submitBtn = document.getElementById('btn-submit-form');
    const waSendBtn = document.getElementById('btn-whatsapp-send-folio');

    const nombre = document.getElementById('nombre')?.value.trim() || 'Ciudadano';
    const tel = document.getElementById('telefono')?.value.trim() || '';
    const municipio = document.getElementById('municipio')?.value.trim() || 'Ahome';
    const tipo = document.getElementById('tipo-gestion')?.value.trim() || 'Gestión';
    const mensaje = document.getElementById('mensaje')?.value.trim() || '';

    if (!form || !successBox) return false;

    // Button loading state
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Registrando en sistema oficial...';
    submitBtn.disabled = true;

    setTimeout(() => {
        // Generate pseudo random official folio
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const currentYear = new Date().getFullYear();
        const folio = `JMV-${currentYear}-${randomNum}`;
        lastCreatedFolio = folio;

        // Save in FOLIOS_DATABASE dynamically so user can track it immediately
        const currentDateStr = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
        FOLIOS_DATABASE[folio] = {
            folio: folio,
            ciudadano: nombre,
            colonia: municipio,
            categoria: tipo,
            fecha: currentDateStr,
            estatusClass: 'status-revision',
            estatusText: 'Recibida en Sistema',
            currentStep: 1,
            dependencia: 'Oficina de Enlace Legislativo Distrito 02',
            oficioNum: `FOL-WEB-${currentYear}-${randomNum}`,
            log: [
                { fecha: `${currentDateStr} - En línea`, desc: `Gestión registrada por ${nombre}. En proceso de asignación a asesor.` }
            ]
        };

        if (ticketElement) {
            ticketElement.textContent = folio;
        }

        // WhatsApp direct action link pre-filled
        if (waSendBtn) {
            const waText = `Hola equipo de la Diputada Juana Minerva Vázquez. Acabo de registrar mi gestión en la plataforma con el Folio Oficial: *${folio}*.\n\n*Nombre:* ${nombre}\n*Tel:* ${tel}\n*Sindicatura:* ${municipio}\n*Asunto:* ${tipo}\n*Descripción:* ${mensaje}\n\nQuedo al pendiente de su confirmación. ¡Muchas gracias!`;
            waSendBtn.href = `https://wa.me/526688124500?text=${encodeURIComponent(waText)}`;
        }

        form.style.display = 'none';
        successBox.style.display = 'block';

        showToast(`¡Gestión registrada con folio ${folio}!`, "fa-circle-check");

        // Scroll to success box smoothly
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 750);

    return false;
}

function resetCitizenForm() {
    const form = document.getElementById('citizen-form');
    const successBox = document.getElementById('form-success-message');
    const submitBtn = document.getElementById('btn-submit-form');

    if (form && successBox) {
        form.reset();
        form.style.display = 'block';
        successBox.style.display = 'none';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Gestión y Generar Folio';
            submitBtn.disabled = false;
        }
    }
}

/* ==========================================================================
   8. ACCESSIBILITY CONTROLS & CONTRAST TOGGLE
   ========================================================================== */
function initAccessibility() {
    const btnInc = document.getElementById('btn-font-inc');
    const btnDec = document.getElementById('btn-font-dec');
    const btnContrast = document.getElementById('btn-contrast-toggle');
    const html = document.documentElement;

    let currentFontSize = 16;

    if (btnInc) {
        btnInc.addEventListener('click', () => {
            if (currentFontSize < 20) {
                currentFontSize += 1;
                html.style.setProperty('--base-font-size', `${currentFontSize}px`);
                showToast(`Tamaño de letra: ${currentFontSize}px`, "fa-font");
            }
        });
    }

    if (btnDec) {
        btnDec.addEventListener('click', () => {
            if (currentFontSize > 14) {
                currentFontSize -= 1;
                html.style.setProperty('--base-font-size', `${currentFontSize}px`);
                showToast(`Tamaño de letra: ${currentFontSize}px`, "fa-font");
            }
        });
    }

    // Load saved contrast theme
    const savedTheme = localStorage.getItem('site-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'contrast' ? 'light' : 'contrast';
            html.setAttribute('data-theme', next);
            localStorage.setItem('site-theme', next);
            showToast(next === 'contrast' ? "Modo Alto Contraste Activado" : "Modo Estándar Activado", "fa-circle-half-stroke");
        });
    }
}

/* ==========================================================================
   9. SCROLLSPY & BACK TO TOP BUTTON
   ========================================================================== */
function initScrollSpyAndBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Scrollspy
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   10. LIVE STREAM MODAL (CONGRESO DE SINALOA EN VIVO)
   ========================================================================== */
function initLiveStreamModal() {
    const modal = document.getElementById('live-stream-modal');
    const closeBtn = document.getElementById('live-modal-close-btn');
    const triggers = [
        document.getElementById('btn-header-live'),
        document.getElementById('btn-mobile-live'),
        document.getElementById('floating-live-btn')
    ];

    function openLive() {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLive() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    triggers.forEach(btn => {
        if (btn) btn.addEventListener('click', openLive);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLive);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeLive();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeLive();
        }
    });
}

/* ==========================================================================
   11. MEDIA KIT OFICIAL & BOLETINES COPY
   ========================================================================== */
function initMediaKitModal() {
    const modal = document.getElementById('mediakit-modal');
    const openBtn = document.getElementById('btn-open-mediakit');
    const closeBtn = document.getElementById('mediakit-close-btn');
    const btnFooterClose = document.getElementById('mediakit-btn-close');
    const btnCopySemblanza = document.getElementById('btn-copy-semblanza');

    function openMediaKit() {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMediaKit() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openMediaKit);
    if (closeBtn) closeBtn.addEventListener('click', closeMediaKit);
    if (btnFooterClose) btnFooterClose.addEventListener('click', closeMediaKit);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeMediaKit();
        });
    }

    if (btnCopySemblanza) {
        btnCopySemblanza.addEventListener('click', () => {
            const semblanzaText = `SÍNTESIS CURRICULAR OFICIAL
DIP. JUANA MINERVA VÁZQUEZ GONZÁLEZ
LXV LEGISLATURA DEL H. CONGRESO DEL ESTADO DE SINALOA

Abogada, académica y servidora pública representante del Distrito 02 de Ahome por el Grupo Parlamentario de Morena. Actualmente se desempeña como Presidenta de la Comisión de Puntos Constitucionales y Gobernación del H. Congreso del Estado de Sinaloa, así como Presidenta del Consejo Estatal de Morena Sinaloa.

Con más de dos décadas de trayectoria docente en la Facultad de Derecho y Ciencias Políticas de la Universidad Autónoma de Sinaloa (Campus Los Mochis), ha impulsado reformas de vanguardia en no nepotismo electoral, no reelección, presupuestos etiquetados con perspectiva de género, Ley de Voluntad Anticipada y derechos de los pueblos originarios.`;
            navigator.clipboard.writeText(semblanzaText).then(() => {
                showToast("¡Semblanza oficial copiada al portapapeles!", "fa-circle-check");
            }).catch(() => {
                showToast("Semblanza lista para copiar.", "fa-circle-check");
            });
        });
    }
}

function initNewsCopyButtons() {
    const copyBtns = document.querySelectorAll('.btn-copy-news');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.news-article-card');
            const title = card?.querySelector('.article-title')?.textContent.trim() || '';
            const snippet = card?.querySelector('.article-snippet')?.textContent.trim() || '';
            const meta = card?.querySelector('.article-meta')?.textContent.replace(/\s+/g, ' ').trim() || '';

            const formattedText = `📢 *BOLETÍN DE PRENSA | DIP. JUANA MINERVA VÁZQUEZ*
🏛️ *LXV Legislatura H. Congreso del Estado de Sinaloa*

*${title}*

📅 ${meta}
${snippet}

📲 Enlace oficial y más detalles: https://www.congresosinaloa.gob.mx/`;

            navigator.clipboard.writeText(formattedText).then(() => {
                showToast("¡Boletín copiado para WhatsApp y prensa!", "fa-copy");
            }).catch(() => {
                showToast("Texto preparado en portapapeles.", "fa-copy");
            });
        });
    });
}

/* ==========================================================================
   12. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, icon = "fa-circle-check") {
    const toast = document.getElementById('toast-notification');
    const msgEl = document.getElementById('toast-message');
    const iconEl = document.getElementById('toast-icon');

    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    if (iconEl) {
        iconEl.className = `fa-solid ${icon} toast-icon`;
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3600);
}
