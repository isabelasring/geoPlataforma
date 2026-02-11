(function() {
    'use strict';

    // Dropdowns navbar: clic en "Servicios" o "Proyectos" para abrir/cerrar (desktop y hamburguesa, todas las páginas)
    document.addEventListener('click', function(e) {
        var toggle = e.target.closest('.nav-dropdown-toggle');
        if (toggle) {
            e.preventDefault();
            e.stopPropagation();
            var parent = toggle.closest('.nav-dropdown');
            if (!parent) return;
            var isOpen = parent.classList.contains('open');
            document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
            if (!isOpen) parent.classList.add('open');
            toggle.setAttribute('aria-expanded', !isOpen);
            return;
        }
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
            document.querySelectorAll('.nav-dropdown-toggle').forEach(function(b) { b.setAttribute('aria-expanded', 'false'); });
        }
    }, true);

    // Menú hamburguesa (móvil): abrir/cerrar y desplegables hacia abajo
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('nav-hamburger');
    var navLinks = document.getElementById('nav-links');
    if (!navbar || !hamburger) return;

    function isMobile() { return window.innerWidth <= 992; }

    function closeMobileMenu() {
        navbar.classList.remove('nav-mobile-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menú');
        document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
        document.querySelectorAll('.nav-dropdown-item-with-panel').forEach(function(d) { d.classList.remove('sub-open'); });
    }

    hamburger.addEventListener('click', function() {
        if (!isMobile()) return;
        var isOpen = navbar.classList.contains('nav-mobile-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            navbar.classList.add('nav-mobile-open');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Cerrar menú');
        }
    });

    // Desplegar/plegar subopciones (Ciudades / Industria) al tocar en el menú móvil
    if (navLinks) {
        navLinks.addEventListener('click', function(e) {
            if (!isMobile()) return;
            var itemWithPanel = e.target.closest('.nav-dropdown-item-with-panel');
            var link = e.target.closest('a');
            var insidePanel = e.target.closest('.nav-services-panel');
            // Clic en "Ciudades" o "Industria" (el <a> que es hijo directo del li): desplegar subopciones
            if (link && itemWithPanel && !insidePanel && link.parentNode === itemWithPanel) {
                e.preventDefault();
                e.stopPropagation();
                itemWithPanel.classList.toggle('sub-open');
                return;
            }
            if (link && insidePanel) {
                closeMobileMenu();
                return;
            }
            if (link && !e.target.closest('.nav-dropdown-toggle')) {
                closeMobileMenu();
            }
        }, true);
    }

    document.addEventListener('click', function(e) {
        if (!isMobile()) return;
        var link = e.target.closest('a');
        if (link && e.target.closest('.nav-links') && !e.target.closest('.nav-dropdown-toggle')) {
            closeMobileMenu();
        }
    }, false);

    window.addEventListener('resize', function() {
        if (!isMobile()) closeMobileMenu();
    });
})();
