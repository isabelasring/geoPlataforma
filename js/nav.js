(function() {
    'use strict';

    // Dropdowns navbar: clic para abrir/cerrar
    document.querySelectorAll('.nav-dropdown-toggle').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var parent = this.closest('.nav-dropdown');
            var isOpen = parent.classList.contains('open');
            document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
            if (!isOpen) parent.classList.add('open');
            btn.setAttribute('aria-expanded', !isOpen);
        });
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
            document.querySelectorAll('.nav-dropdown-toggle').forEach(function(b) { b.setAttribute('aria-expanded', 'false'); });
        }
    });

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

    document.addEventListener('click', function(e) {
        if (!isMobile()) return;
        var itemWithPanel = e.target.closest('.nav-dropdown-item-with-panel');
        var link = e.target.closest('a');
        if (link && itemWithPanel && !e.target.closest('.nav-services-panel')) {
            e.preventDefault();
            itemWithPanel.classList.toggle('sub-open');
            return;
        }
        if (link && e.target.closest('.nav-services-panel')) {
            closeMobileMenu();
            return;
        }
        if (link && e.target.closest('.nav-links') && !e.target.closest('.nav-dropdown-toggle')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (!isMobile()) closeMobileMenu();
    });
})();
