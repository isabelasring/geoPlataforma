(function() {
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
    var tagMap = { iot: 0, 'mapas-ruido': 1, webgis: 2, descontaminacion: 3, geoespacial: 4 };
    var tags = document.querySelectorAll('.proyectos-tag');
    var idx = tagMap[servicio] !== undefined ? tagMap[servicio] : 0;
    tags.forEach(function(t, i) { t.classList.toggle('active', i === idx); });

    var amvaCard = document.querySelector('.proyecto-card-amva-usb');
    var emptyMsg = document.getElementById('ciudades-empty-message');
    var carouselTrack = document.getElementById('ciudades-carousel-track');
    function toggleCiudadesCards() {
        var activeTag = document.querySelector('.proyectos-tag.active');
        var s = activeTag ? (activeTag.getAttribute('data-servicio') || '').trim() : '';
        var showAmva = s === 'iot' || s === 'webgis';
        var hasAnyProject = showAmva;
        if (amvaCard) amvaCard.style.display = showAmva ? 'block' : 'none';
        if (emptyMsg) emptyMsg.style.display = hasAnyProject ? 'none' : 'flex';
        if (carouselTrack) carouselTrack.style.display = hasAnyProject ? 'flex' : 'none';
    }
    toggleCiudadesCards();

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
                        toggleCiudadesCards();
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
            toggleCiudadesCards();
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

    function buildPanelCarousel(proyectoId, titulo) {
        if (!panelCarouselTrack) return;
        panelCarouselTrack.innerHTML = '';
        panelCarouselImages = [];
        var images = [];
        var base = '';
        if (proyectoId === 'amva-usb' && typeof AMVA_USB_IMAGES !== 'undefined' && AMVA_USB_IMAGES.length) {
            images = AMVA_USB_IMAGES;
            base = '../proyectos/ciudades/AMVA-USB/';
        }
        if (images.length === 0) return;
        panelCarouselImages = images.map(function(f) { return base + f; });
        var wrap = panelCarouselTrack.closest('.proyecto-panel-carousel-wrap');
        if (wrap) wrap.classList.toggle('multiple', panelCarouselImages.length > 1);
        panelCarouselImages.forEach(function(src, i) {
            var slide = document.createElement('div');
            slide.className = 'proyecto-panel-carousel-slide' + (i === 0 ? ' active' : '');
            var img = document.createElement('img');
            img.src = src;
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
        if (panel) { panel.setAttribute('aria-hidden', 'false'); }
        if (backdrop) { backdrop.setAttribute('aria-hidden', 'false'); }
    }
    function closeProyectoPanel() {
        if (page) page.classList.remove('proyecto-panel-open');
        document.body.classList.remove('proyecto-panel-open');
        if (panel) { panel.setAttribute('aria-hidden', 'true'); }
        if (backdrop) { backdrop.setAttribute('aria-hidden', 'true'); }
    }

    document.querySelectorAll('.proyecto-card').forEach(function(card) {
        var linkWrap = card.querySelector('.proyecto-card-link-wrap');
        if (!linkWrap) return;
        linkWrap.addEventListener('click', function(e) {
            e.preventDefault();
            var proyectoId = card.getAttribute('data-proyecto') || '';
            var titulo = card.getAttribute('data-proyecto-titulo') || '';
            var desc = card.getAttribute('data-proyecto-desc-long') || card.getAttribute('data-proyecto-desc') || '';
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

    /* Abrir panel al llegar desde inicio con ?proyecto=amva-usb */
    var openParams = new URLSearchParams(window.location.search);
    var openProyectoId = openParams.get('proyecto');
    if (openProyectoId === 'amva-usb' && amvaCard) {
        var tagIoT = document.querySelector('.proyectos-tag[data-servicio="iot"]');
        if (tagIoT) { tags.forEach(function(t) { t.classList.remove('active'); }); tagIoT.classList.add('active'); }
        toggleCiudadesCards();
        setTimeout(function() {
            var titulo = amvaCard.getAttribute('data-proyecto-titulo') || '';
            var desc = amvaCard.getAttribute('data-proyecto-desc-long') || amvaCard.getAttribute('data-proyecto-desc') || '';
            var categoria = amvaCard.getAttribute('data-proyecto-categoria') || '';
            var ano = amvaCard.getAttribute('data-proyecto-ano') || '';
            var cliente = amvaCard.getAttribute('data-proyecto-cliente') || '';
            buildPanelCarousel('amva-usb', titulo);
            if (panelTitle) panelTitle.textContent = titulo;
            if (panelCategoria) panelCategoria.textContent = categoria;
            if (panelAno) panelAno.textContent = ano;
            if (panelCliente) panelCliente.textContent = cliente;
            if (panelDesc) panelDesc.textContent = desc;
            openProyectoPanel();
        }, 100);
    }
})();
