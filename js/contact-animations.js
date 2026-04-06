(function () {
        var selectors = [
            '.contact-trust-badge',
            '.contact-form-card',
            '.info-item',
            '.faq-item'
        ];
        var dirs = ['srv-from-bottom', 'srv-from-left', 'srv-from-right', 'srv-from-bottom'];
        var elements = Array.from(document.querySelectorAll(selectors.join(',')));
        if (!elements.length) return;
        var parentMap = new Map();
        elements.forEach(function (el) {
            var p = el.parentElement;
            if (!parentMap.has(p)) parentMap.set(p, []);
            parentMap.get(p).push(el);
        });
        var gi = 0;
        parentMap.forEach(function (siblings, parent) {
            var selector = selectors.find(function (s) { return parent.querySelector(s); });
            var dir = dirs[selectors.indexOf(selector) % dirs.length] || dirs[gi % dirs.length];
            gi++;
            siblings.forEach(function (el, i) {
                el.classList.add('srv-reveal');
                el.classList.add(dir);
                el.dataset.srvDelay = i * 120;
            });
        });
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                setTimeout(function () { el.classList.add('srv-visible'); }, parseInt(el.dataset.srvDelay) || 0);
                obs.unobserve(el);
            });
        }, { threshold: 0.12 });
        elements.forEach(function (el) { obs.observe(el); });
    })();