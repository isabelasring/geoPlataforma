(function() {
    var INDUSTRIA_IMAGES_BASE = '../../img:video/proyectos/industria/';
    // Proyectos: tags se deslizan y texto izquierda aparece al entrar en vista
    var page = document.querySelector('.proyectos-page');
    if (page) {
        var animated = false;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    page.classList.add('proyectos-animated');
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });
        observer.observe(page);
    }

    var params = new URLSearchParams(window.location.search);
    var servicio = params.get('servicio') || 'iot';
    var tagMap = {
        iot: 0, 'control-ruido': 1, 'clasificacion-fuentes': 2, 'modelacion-ruido': 3,
        'holografia-acustica': 4, 'medicion-vibraciones': 5, 'modelacion-vibraciones': 6,
        'modelacion-ruido-subacuatico': 7, 'medicion-ruido-subacuatico': 8,
        geoespacial: 9, fotogrametria: 10
    };
    var tags = document.querySelectorAll('.proyectos-tag');
    var idx = tagMap[servicio] !== undefined ? tagMap[servicio] : 0;
    tags.forEach(function(t, i) { t.classList.toggle('active', i === idx); });

    function toggleIndustryCards() {
        var activeTag = document.querySelector('.proyectos-tag.active');
        var s = activeTag ? (activeTag.getAttribute('data-servicio') || '').trim() : '';
        var isControlRuido = s === 'control-ruido';
        var isClasificacionFuentes = s === 'clasificacion-fuentes';
        var isModelacionRuido = s === 'modelacion-ruido';
        var isFotogrametria = s === 'fotogrametria';
        var isMedicionVibraciones = s === 'medicion-vibraciones';
        var isHolografiaAcustica = s === 'holografia-acustica';
        var isModelacionRuidoSubacuatico = s === 'modelacion-ruido-subacuatico';
        var isMedicionRuidoSubacuatico = s === 'medicion-ruido-subacuatico';
        var showArclad = isControlRuido || isClasificacionFuentes || isModelacionRuido || isFotogrametria;
        var showPepsico = isControlRuido || isClasificacionFuentes || isModelacionRuido || isFotogrametria;
        var showSpia = isModelacionRuidoSubacuatico || isMedicionRuidoSubacuatico;
        var showColcafe = isControlRuido || isHolografiaAcustica || isMedicionVibraciones;
        var refineria = document.querySelector('.proyecto-card-refineria');
        var vivaMagdalena = document.querySelector('.proyecto-card-viva-magdalena');
        var arclad = document.querySelector('.proyecto-card-arclad');
        var segovia = document.querySelector('.proyecto-card-segovia');
        var ccrPalagua = document.querySelector('.proyecto-card-ccr-palagua');
        var colcafe = document.querySelector('.proyecto-card-colcafe');
        var cerrejon = document.querySelector('.proyecto-card-cerrejon');
        var minerosBic = document.querySelector('.proyecto-card-mineros-bic');
        var pepsico = document.querySelector('.proyecto-card-pepsico');
        var spia = document.querySelector('.proyecto-card-spia');
        var emptyMsg = document.getElementById('proyectos-empty-message');
        var carouselTrack = document.getElementById('industria-carousel-track');
        var hasAnyProject = isControlRuido || showArclad || isMedicionVibraciones || isFotogrametria || showColcafe || isHolografiaAcustica || showPepsico || showSpia;
        if (refineria) refineria.style.display = isControlRuido ? 'block' : 'none';
        if (vivaMagdalena) vivaMagdalena.style.display = isControlRuido ? 'block' : 'none';
        if (arclad) arclad.style.display = showArclad ? 'block' : 'none';
        if (segovia) segovia.style.display = isMedicionVibraciones ? 'block' : 'none';
        if (ccrPalagua) ccrPalagua.style.display = isFotogrametria ? 'block' : 'none';
        if (colcafe) colcafe.style.display = showColcafe ? 'block' : 'none';
        if (cerrejon) cerrejon.style.display = isHolografiaAcustica ? 'block' : 'none';
        if (minerosBic) minerosBic.style.display = isHolografiaAcustica ? 'block' : 'none';
        if (pepsico) pepsico.style.display = showPepsico ? 'block' : 'none';
        if (spia) spia.style.display = showSpia ? 'block' : 'none';
        if (emptyMsg) emptyMsg.style.display = hasAnyProject ? 'none' : 'flex';
        if (carouselTrack) carouselTrack.style.display = hasAnyProject ? 'flex' : 'none';
    }
    toggleIndustryCards();

    /* Asignar imagen de cada tarjeta desde los arrays en data/*.js y base ../../img:video/proyectos/industria/ */
    var arrByName = {
        REFINERIA_CARTAGENA_IMAGES: typeof REFINERIA_CARTAGENA_IMAGES !== 'undefined' ? REFINERIA_CARTAGENA_IMAGES : [],
        VIVA_MAGDALENA_IMAGES: typeof VIVA_MAGDALENA_IMAGES !== 'undefined' ? VIVA_MAGDALENA_IMAGES : [],
        ARCLAD_IMAGES: typeof ARCLAD_IMAGES !== 'undefined' ? ARCLAD_IMAGES : [],
        SEGOVIA_IMAGES: typeof SEGOVIA_IMAGES !== 'undefined' ? SEGOVIA_IMAGES : [],
        CCR_PALAGUA_IMAGES: typeof CCR_PALAGUA_IMAGES !== 'undefined' ? CCR_PALAGUA_IMAGES : [],
        COLCAFE_IMAGES: typeof COLCAFE_IMAGES !== 'undefined' ? COLCAFE_IMAGES : [],
        CERREJON_IMAGES: typeof CERREJON_IMAGES !== 'undefined' ? CERREJON_IMAGES : [],
        MINEROS_BIC_IMAGES: typeof MINEROS_BIC_IMAGES !== 'undefined' ? MINEROS_BIC_IMAGES : [],
        PEPSICO_IMAGES: typeof PEPSICO_IMAGES !== 'undefined' ? PEPSICO_IMAGES : [],
        SPIA_IMAGES: typeof SPIA_IMAGES !== 'undefined' ? SPIA_IMAGES : []
    };
    document.querySelectorAll('.proyecto-card[data-carpeta]').forEach(function(card) {
        var imgDiv = card.querySelector('.proyecto-card-img[data-img-from]');
        if (!imgDiv) return;
        var varName = imgDiv.getAttribute('data-img-from');
        var carpeta = card.getAttribute('data-carpeta');
        var arr = arrByName[varName];
        if (arr && arr.length && carpeta) {
            var first = arr[0];
            var url = INDUSTRIA_IMAGES_BASE + carpeta + '/' + encodeURIComponent(first);
            imgDiv.style.backgroundImage = "url('" + url + "')";
        }
    });

    // Renderizar tags en el dropdown móvil
    function renderMobileTags() {
        var mobileContainer = document.getElementById('proyectos-tags-mobile');
        if (!mobileContainer) return;
        mobileContainer.innerHTML = '';
        tags.forEach(function(tag) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'proyectos-tag';
            btn.setAttribute('data-servicio', tag.getAttribute('data-servicio'));
            btn.setAttribute('role', 'tab');
            btn.textContent = tag.textContent;
            if (tag.classList.contains('active')) {
                btn.classList.add('active');
            }
            mobileContainer.appendChild(btn);
        });
    }

    // Toggle del dropdown móvil
    (function() {
        var toggle = document.getElementById('proyectos-filters-toggle');
        var dropdown = document.getElementById('proyectos-filters-dropdown');
        var page = document.querySelector('.proyectos-page');
        
        if (toggle && dropdown) {
            toggle.addEventListener('click', function() {
                var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                dropdown.setAttribute('aria-hidden', isExpanded);
                // Agregar/quitar clase para ajustar el contenido
                if (page) {
                    if (!isExpanded) {
                        page.classList.add('dropdown-open');
                    } else {
                        page.classList.remove('dropdown-open');
                    }
                }
            });
            
            // Cerrar dropdown al hacer clic en un tag y evitar scroll
            dropdown.addEventListener('click', function(e) {
                if (e.target.classList.contains('proyectos-tag')) {
                    e.preventDefault();
                    var servicio = e.target.getAttribute('data-servicio');
                    if (servicio) {
                        var url = new URL(window.location.href);
                        url.searchParams.set('servicio', servicio);
                        window.history.replaceState({}, '', url);
                        // Actualizar tags activos
                        tags.forEach(function(t) { t.classList.remove('active'); });
                        var clickedTag = Array.from(tags).find(function(t) { return t.getAttribute('data-servicio') === servicio; });
                        if (clickedTag) clickedTag.classList.add('active');
                        toggleIndustryCards();
                        // Actualizar tags móviles
                        renderMobileTags();
                    }
                    toggle.setAttribute('aria-expanded', 'false');
                    dropdown.setAttribute('aria-hidden', 'true');
                    // Quitar clase cuando se cierra
                    if (page) {
                        page.classList.remove('dropdown-open');
                    }
                }
            });
        }
        
        renderMobileTags();
    })();

    tags.forEach(function(btn) {
        btn.addEventListener('click', function() {
            tags.forEach(function(t) { t.classList.remove('active'); });
            btn.classList.add('active');
            var s = btn.getAttribute('data-servicio');
            var url = new URL(window.location.href);
            url.searchParams.set('servicio', s);
            window.history.replaceState({}, '', url);
            toggleIndustryCards();
            // Actualizar tags móviles
            var mobileContainer = document.getElementById('proyectos-tags-mobile');
            if (mobileContainer) {
                var mobileTags = mobileContainer.querySelectorAll('.proyectos-tag');
                mobileTags.forEach(function(t) { t.classList.remove('active'); });
                var activeMobile = Array.from(mobileTags).find(function(t) { return t.getAttribute('data-servicio') === s; });
                if (activeMobile) activeMobile.classList.add('active');
            }
        });
    });

    var track = document.querySelector('.carousel-track');
    var prev = document.querySelector('.carousel-prev');
    var next = document.querySelector('.carousel-next');
    var cardWidth = 320; // Ancho fijo de las cards
    var gap = 20; // Gap entre cards

    function go(delta) {
        if (!track) return;
        var scrollAmount = (cardWidth + gap) * delta;
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function() { go(-1); });
    if (next) next.addEventListener('click', function() { go(1); });

    /* Panel de detalle: abrir al hacer clic en una card; izquierda = carrusel de imágenes del proyecto */
    var page = document.querySelector('.proyectos-page');
    var panel = document.getElementById('proyecto-panel');
    var backdrop = document.getElementById('proyecto-panel-backdrop');
    var closeBtn = document.getElementById('proyecto-panel-close');
    var panelCarouselTrack = document.getElementById('proyecto-panel-carousel-track');
    var panelCarouselPrev = document.getElementById('proyecto-panel-carousel-prev');
    var panelCarouselNext = document.getElementById('proyecto-panel-carousel-next');
    var panelTitle = document.getElementById('proyecto-panel-title');
    var panelCategoria = document.getElementById('proyecto-panel-categoria');
    var panelAno = document.getElementById('proyecto-panel-ano');
    var panelCliente = document.getElementById('proyecto-panel-cliente');
    var panelDesc = document.getElementById('proyecto-panel-desc');

    var panelCarouselIndex = 0;
    var panelCarouselImages = [];

    function getIndustryImagesAndBase(proyectoId) {
        var images = [];
        var folder = '';
        if (proyectoId === 'refineria-cartagena' && typeof REFINERIA_CARTAGENA_IMAGES !== 'undefined' && REFINERIA_CARTAGENA_IMAGES.length) {
            images = REFINERIA_CARTAGENA_IMAGES;
            folder = 'refineriaCartagena';
        } else if (proyectoId === 'viva-magdalena' && typeof VIVA_MAGDALENA_IMAGES !== 'undefined' && VIVA_MAGDALENA_IMAGES.length) {
            images = VIVA_MAGDALENA_IMAGES;
            folder = 'vivaMagdalena';
        } else if (proyectoId === 'arclad' && typeof ARCLAD_IMAGES !== 'undefined' && ARCLAD_IMAGES.length) {
            images = ARCLAD_IMAGES;
            folder = 'ARCLAD';
        } else if (proyectoId === 'segovia' && typeof SEGOVIA_IMAGES !== 'undefined' && SEGOVIA_IMAGES.length) {
            images = SEGOVIA_IMAGES;
            folder = 'segovia';
        } else if (proyectoId === 'ccr-palagua' && typeof CCR_PALAGUA_IMAGES !== 'undefined' && CCR_PALAGUA_IMAGES.length) {
            images = CCR_PALAGUA_IMAGES;
            folder = 'ccrPalagua';
        } else if (proyectoId === 'colcafe' && typeof COLCAFE_IMAGES !== 'undefined' && COLCAFE_IMAGES.length) {
            images = COLCAFE_IMAGES;
            folder = 'colcafe';
        } else if (proyectoId === 'cerrejon' && typeof CERREJON_IMAGES !== 'undefined' && CERREJON_IMAGES.length) {
            images = CERREJON_IMAGES;
            folder = 'cerrejon';
        } else if (proyectoId === 'mineros-bic' && typeof MINEROS_BIC_IMAGES !== 'undefined' && MINEROS_BIC_IMAGES.length) {
            images = MINEROS_BIC_IMAGES;
            folder = 'minerosBic';
        } else if (proyectoId === 'pepsico' && typeof PEPSICO_IMAGES !== 'undefined' && PEPSICO_IMAGES.length) {
            images = PEPSICO_IMAGES;
            folder = 'pepsico';
        } else if (proyectoId === 'spia' && typeof SPIA_IMAGES !== 'undefined' && SPIA_IMAGES.length) {
            images = SPIA_IMAGES;
            folder = 'spia';
        }
        var base = folder ? (INDUSTRIA_IMAGES_BASE + folder + '/') : '';
        return { images: images, base: base };
    }

    function buildPanelCarousel(proyectoId, titulo) {
        if (!panelCarouselTrack) return;
        panelCarouselTrack.innerHTML = '';
        panelCarouselImages = [];
        var data = getIndustryImagesAndBase(proyectoId);
        var images = data.images;
        var base = data.base;
        if (images.length === 0) return;
        panelCarouselImages = images.map(function(f) { return base + encodeURIComponent(f); });
        var wrap = panelCarouselTrack.closest('.proyecto-panel-carousel-wrap');
        if (wrap) wrap.classList.toggle('multiple', panelCarouselImages.length > 1);
        images.forEach(function(f, i) {
            var slide = document.createElement('div');
            slide.className = 'proyecto-panel-carousel-slide' + (i === 0 ? ' active' : '');
            var img = document.createElement('img');
            img.src = base + encodeURIComponent(f);
            img.alt = titulo + ' - Imagen ' + (i + 1);
            img.className = 'proyecto-panel-img';
            slide.appendChild(img);
            panelCarouselTrack.appendChild(slide);
        });
        panelCarouselIndex = 0;
    }

    function goPanelCarousel(delta) {
        if (panelCarouselImages.length <= 1) return;
        var slides = panelCarouselTrack ? panelCarouselTrack.querySelectorAll('.proyecto-panel-carousel-slide') : [];
        if (slides.length === 0) return;
        slides[panelCarouselIndex].classList.remove('active');
        panelCarouselIndex = (panelCarouselIndex + delta + slides.length) % slides.length;
        slides[panelCarouselIndex].classList.add('active');
    }

    function openProyectoPanel() {
        if (page) page.classList.add('proyecto-panel-open');
        document.body.classList.add('proyecto-panel-open');
        if (panel) panel.setAttribute('aria-hidden', 'false');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    }
    function closeProyectoPanel() {
        if (page) page.classList.remove('proyecto-panel-open');
        document.body.classList.remove('proyecto-panel-open');
        if (panel) panel.setAttribute('aria-hidden', 'true');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.proyecto-card').forEach(function(card) {
        var linkWrap = card.querySelector('.proyecto-card-link-wrap');
        if (!linkWrap) return;
        linkWrap.addEventListener('click', function(e) {
            e.preventDefault();
            var proyectoId = card.getAttribute('data-proyecto') || '';
            var titulo = card.getAttribute('data-proyecto-titulo') || '';
            var desc = card.getAttribute('data-proyecto-desc') || '';
            var categoria = card.getAttribute('data-proyecto-categoria') || '';
            var ano = card.getAttribute('data-proyecto-ano') || '';
            var cliente = card.getAttribute('data-proyecto-cliente') || '';
            buildPanelCarousel(proyectoId, titulo);
            if (panelTitle) panelTitle.textContent = titulo;
            if (panelCategoria) panelCategoria.textContent = categoria;
            if (panelAno) panelAno.textContent = ano;
            if (panelCliente) panelCliente.textContent = cliente;
            if (panelDesc) panelDesc.textContent = desc;
            openProyectoPanel();
        });
        linkWrap.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); linkWrap.click(); }
        });
    });

    if (panelCarouselPrev) panelCarouselPrev.addEventListener('click', function() { goPanelCarousel(-1); });
    if (panelCarouselNext) panelCarouselNext.addEventListener('click', function() { goPanelCarousel(1); });
    if (closeBtn) closeBtn.addEventListener('click', closeProyectoPanel);
    if (backdrop) backdrop.addEventListener('click', closeProyectoPanel);

    /* Abrir panel al llegar desde inicio con ?proyecto=xxx */
    var openParams = new URLSearchParams(window.location.search);
    var openProyectoId = openParams.get('proyecto');
    var proyectoToServicio = {
        'refineria-cartagena': 'control-ruido', 'viva-magdalena': 'control-ruido', 'arclad': 'control-ruido',
        'segovia': 'medicion-vibraciones', 'ccr-palagua': 'fotogrametria', 'colcafe': 'control-ruido',
        'cerrejon': 'holografia-acustica', 'mineros-bic': 'holografia-acustica', 'pepsico': 'control-ruido',
        'spia': 'modelacion-ruido-subacuatico'
    };
    if (openProyectoId && proyectoToServicio[openProyectoId] !== undefined) {
        var servicioToOpen = proyectoToServicio[openProyectoId];
        var tagIndex = tagMap[servicioToOpen];
        if (tagIndex !== undefined) {
            tags.forEach(function(t, i) { t.classList.toggle('active', i === tagIndex); });
            var url = new URL(window.location.href);
            url.searchParams.set('servicio', servicioToOpen);
            window.history.replaceState({}, '', url);
        }
        toggleIndustryCards();
        setTimeout(function() {
            var card = document.querySelector('.proyecto-card[data-proyecto="' + openProyectoId + '"]');
            if (card) {
                var titulo = card.getAttribute('data-proyecto-titulo') || '';
                var desc = card.getAttribute('data-proyecto-desc') || '';
                var categoria = card.getAttribute('data-proyecto-categoria') || '';
                var ano = card.getAttribute('data-proyecto-ano') || '';
                var cliente = card.getAttribute('data-proyecto-cliente') || '';
                buildPanelCarousel(openProyectoId, titulo);
                if (panelTitle) panelTitle.textContent = titulo;
                if (panelCategoria) panelCategoria.textContent = categoria;
                if (panelAno) panelAno.textContent = ano;
                if (panelCliente) panelCliente.textContent = cliente;
                if (panelDesc) panelDesc.textContent = desc;
                openProyectoPanel();
            }
        }, 150);
    }
})();
