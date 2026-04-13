(function () {
        var selectors = [
            '.feature-card', '.pricing-card', '.ideal-card', '.cw-split-card',
            '.timeline-item', '.faq-item', '.comparison-row:not(.header)',
            '.ecom-platform-card'
        ];
        var dirs = ['srv-from-left', 'srv-from-top', '', 'srv-from-right', 'srv-from-bottom', 'srv-from-left'];
        var elements = Array.from(document.querySelectorAll(selectors.join(',')));
        if (!elements.length) return;
        var parentMap = new Map();
        elements.forEach(function (el) {
            var p = el.parentElement;
            if (!parentMap.has(p)) parentMap.set(p, []);
            parentMap.get(p).push(el);
        });
        var gi = 0;
        parentMap.forEach(function (siblings) {
            var dir = dirs[gi % dirs.length]; gi++;
            siblings.forEach(function (el, i) {
                el.classList.add('srv-reveal');
                if (dir) el.classList.add(dir);
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