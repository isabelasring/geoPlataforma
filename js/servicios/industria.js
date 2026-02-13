// Tarjetas de servicios: bajan del cielo al entrar en vista
(function() {
    var view = document.querySelector('.section-view');
    if (!view) return;
    var animated = false;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !animated) {
                animated = true;
                view.classList.add('section-cards-animated');
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });
    observer.observe(view);
})();

var sectionContent = document.querySelector('.section-content');
var firstCardId = 'servicio-iot';
var serviciosIndustria = [
    { id: 'servicio-iot', label: 'IoT' },
    { id: 'servicio-control-ruido', label: 'Control de ruido' },
    { id: 'servicio-clasificacion-fuentes', label: 'Clasificación de fuentes' },
    { id: 'servicio-modelacion-ruido', label: 'Modelación de ruido' },
    { id: 'servicio-holografia-acustica', label: 'Holografía acústica' },
    { id: 'servicio-medicion-vibraciones', label: 'Medición de vibraciones' },
    { id: 'servicio-modelacion-vibraciones', label: 'Modelación de vibraciones' },
    { id: 'servicio-modelacion-ruido-subacuatico', label: 'Modelación de ruido subacuático' },
    { id: 'servicio-medicion-ruido-subacuatico', label: 'Medición de ruido subacuático' },
    { id: 'servicio-geoespacial', label: 'Analítica geoespacial' },
    { id: 'servicio-fotogrametria', label: 'Fotogrametría' }
];

function renderServicesBar() {
    var bar = document.getElementById('section-services-bar');
    if (!bar) return;
    bar.innerHTML = '';
    serviciosIndustria.forEach(function(s) {
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.className = 'section-service-pill';
        a.textContent = s.label;
        bar.appendChild(a);
    });
}

function setActivePanelFromHash() {
    var hash = window.location.hash;
    var id = hash ? hash.slice(1) : firstCardId;
    if (!hash) window.location.replace('industria.html#' + firstCardId);
    document.querySelectorAll('.section-content .section-card').forEach(function(c) { c.classList.remove('active-panel'); });
    var card = document.getElementById(id);
    if (card && card.classList.contains('section-card')) {
        card.classList.add('active-panel');
    }
    document.querySelectorAll('.section-service-pill').forEach(function(p) {
        var href = p.getAttribute('href') || '';
        p.classList.toggle('active', href === '#' + id);
        p.setAttribute('aria-current', href === '#' + id ? 'page' : null);
    });
}

renderServicesBar();
setActivePanelFromHash();
window.addEventListener('hashchange', setActivePanelFromHash);

// Carrusel interno por card
document.querySelectorAll('.section-card').forEach(function(card) {
    var track = card.querySelector('.section-card-carousel-track');
    var slides = card.querySelectorAll('.section-card-carousel-slide');
    var prevBtn = card.querySelector('.section-card-carousel-prev');
    var nextBtn = card.querySelector('.section-card-carousel-next');
    if (!track || !slides.length) return;
    var n = slides.length;
    track.style.width = (n * 100) + '%';
    slides.forEach(function(s) { s.style.flex = '0 0 ' + (100 / n) + '%'; });
    var idx = 0;
    function updateCarousel() {
        track.style.transform = 'translateX(-' + (idx * (100 / n)) + '%)';
    }
    prevBtn && prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        idx = idx <= 0 ? n - 1 : idx - 1;
        updateCarousel();
    });
    nextBtn && nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        idx = idx >= n - 1 ? 0 : idx + 1;
        updateCarousel();
    });
});
