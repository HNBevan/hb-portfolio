// Accessibility Warning Modal
(function() {
    const modal = document.getElementById('accessModal');
    if (!modal) return;

    // Apply reduced motion if previously chosen
    if (localStorage.getItem('hb-reduced-motion') === 'true') {
        document.body.classList.add('reduced-motion');
    }

    // Only show if not already dismissed
    if (localStorage.getItem('hb-access-warned')) {
        return;
    }

    // Reveal the modal now that we know it should show
    modal.classList.remove('hidden');

    // Continue button
    document.getElementById('accessContinue').addEventListener('click', function() {
        localStorage.setItem('hb-access-warned', 'true');
        modal.classList.add('hidden');
        setTimeout(() => modal.remove(), 400);
    });

    // Reduce motion button
    document.getElementById('accessReduceMotion').addEventListener('click', function() {
        localStorage.setItem('hb-access-warned', 'true');
        localStorage.setItem('hb-reduced-motion', 'true');
        document.body.classList.add('reduced-motion');
        pauseAllVideos();
        (window._hbStopFns || []).forEach(fn => fn());
        modal.classList.add('hidden');
        setTimeout(() => modal.remove(), 400);
    });
})();

function pauseAllVideos() {
    document.querySelectorAll('video').forEach(v => v.pause());
}

function resumeAllVideos() {
    document.querySelectorAll('video').forEach(v => v.play().catch(() => {}));
}

// Apply video pause if reduced motion was previously set
if (localStorage.getItem('hb-reduced-motion') === 'true') {
    window.addEventListener('load', pauseAllVideos);
}

// Accessibility reset button in footer
(function() {
    const resetBtn = document.getElementById('accessReset');
    if (!resetBtn) return;
    resetBtn.addEventListener('click', function() {
        localStorage.removeItem('hb-access-warned');
        localStorage.removeItem('hb-reduced-motion');
        document.body.classList.remove('reduced-motion');
        resumeAllVideos();
        location.reload();
    });
})();

// Hero video play/pause toggle
(function() {
    const video = document.querySelector('.hero-video');
    const btn = document.getElementById('heroVideoToggle');
    if (!video || !btn) return;

    video.playbackRate = 0.75;

    const iconPause = btn.querySelector('.icon-pause');
    const iconPlay  = btn.querySelector('.icon-play');

    btn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            iconPause.style.display = '';
            iconPlay.style.display  = 'none';
            btn.setAttribute('aria-label', 'Pause video');
        } else {
            video.pause();
            iconPause.style.display = 'none';
            iconPlay.style.display  = '';
            btn.setAttribute('aria-label', 'Play video');
        }
    });
})();

// Auto-wrap first word of card h3s in a span for pink/white styling
(function() {
    const selectors = [
        '.feature-card h3',
        '.process-step h3',
        '.timeline-content h3',
        '.pricing-card h3',
        '.info-item h3',
        '.advanced-card h3',
        '.service-card h3',
        '.ideal-card h3',
        '.cw-split-card h3'
    ].join(', ');
    document.querySelectorAll(selectors).forEach(function(h3) {
        if (h3.querySelector('span')) return;
        const text = h3.textContent.trim();
        const i = text.indexOf(' ');
        if (i > -1) {
            h3.innerHTML = '<span>' + text.slice(0, i) + '</span>' + text.slice(i);
        } else {
            h3.innerHTML = '<span>' + text + '</span>';
        }
    });
})();

// Hide navbar on scroll down, show on scroll up + glass effect on scroll
(function() {
    let lastY = 0;
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        const currentY = window.scrollY;

        // Glass effect: kick in after 60px
        if (currentY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentY > lastY && currentY > 120) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastY = currentY;
    }, { passive: true });
})();

// Typewriter Effect for Section Headings
function typeWriterHeading(element) {
    const text = element.getAttribute('data-text');
    element.textContent = '';
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 80);
        }
    }

    type();
}

// Intersection Observer for Typewriter Headings
const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
            entry.target.classList.add('typed');
            typeWriterHeading(entry.target);
        }
    });
}, {
    threshold: 0.5
});

// Observe all typewriter headings
document.addEventListener('DOMContentLoaded', function() {
    const typewriterHeadings = document.querySelectorAll('.typewriter-heading');
    typewriterHeadings.forEach(heading => {
        typewriterObserver.observe(heading);
    });
});

// ── H1 letter bounce-in (all pages) ──
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('h1').forEach(function (h1) {
        // Features hero uses wave with wider stagger; all others use drop-in
        const isWave   = !!h1.closest('.features-hero');
        const stagger  = isWave ? 150 : 48;
        let delay      = isWave ? 0   : 100;

        Array.from(h1.childNodes).forEach(function (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const chars = node.textContent.split('');
                const frag  = document.createDocumentFragment();
                chars.forEach(function (ch) {
                    const s = document.createElement('span');
                    s.className = 'h1-letter';
                    s.textContent = ch;
                    if (ch === ' ') { s.style.display = 'inline-block'; s.style.width = '0.35em'; }
                    s.style.animationDelay = delay + 'ms';
                    delay += stagger;
                    frag.appendChild(s);
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (!isWave) delay += 40; // pause before coloured word on drop-in only
                const text = node.textContent;
                node.textContent = '';
                text.split('').forEach(function (ch) {
                    const s = document.createElement('span');
                    s.className = 'h1-letter';
                    s.textContent = ch;
                    s.style.animationDelay = delay + 'ms';
                    delay += stagger;
                    node.appendChild(s);
                });
            }
        });
    });
});

// Services Dropdown — click toggle on all screen sizes
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = this.closest('.nav-dropdown');
        const isOpen = dropdown.classList.contains('open');
        // Close all other open dropdowns
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
        if (!isOpen) dropdown.classList.add('open');
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
});

// Close dropdown when pressing Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
});

// Burger Menu
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
    burgerMenu.classList.add('active');
    burgerMenu.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    burgerMenu.classList.remove('active');
    burgerMenu.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Also close any open dropdowns
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
}

if (burgerMenu && navLinks) {
    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.contains('active') ? closeMenu() : openMenu();
    });
}

// Close on overlay click
if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
});

// Close when clicking a non-dropdown nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (!this.classList.contains('dropdown-toggle')) closeMenu();
    });
});

// Enhanced Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementBottom = reveal.getBoundingClientRect().bottom;
        const elementVisible = 150; // Trigger point
        
        // Show when element enters viewport from bottom or top
        if (elementTop < windowHeight - elementVisible && elementBottom > elementVisible) {
            reveal.classList.add('active');
        } else {
            // Hide when element is completely out of view
            reveal.classList.remove('active');
        }
    });
}

// Intersection Observer for better performance with bi-directional support
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            // Remove active class when element goes out of view
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

// Observe all reveal elements
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        observer.observe(el);
    });
});

// Fallback scroll listener for older browsers
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            revealOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    revealOnScroll();
});

// Also run after a short delay to catch any missed elements
setTimeout(revealOnScroll, 500);

// Projects Slider - Drag to Scroll Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.projects-slider');
    const wrapper = document.querySelector('.projects-slider-wrapper');

    if (!slider || !wrapper) return;

    // Arrow buttons (sit outside the overflow wrapper)
    const outer    = document.querySelector('.projects-slider-outer');
    const leftBtn  = outer ? outer.querySelector('.slider-arrow-left')  : null;
    const rightBtn = outer ? outer.querySelector('.slider-arrow-right') : null;

    // Measure the exact pixel distance for one loop cycle (offsetLeft of the first duplicate card)
    const items = slider.querySelectorAll('.project-item');
    const halfCount = Math.floor(items.length / 2);

    function setSlideEnd() {
        const dist = items[halfCount].offsetLeft;
        slider.style.setProperty('--slide-end', `-${dist}px`);
        slider._slideEnd = dist;
    }
    setSlideEnd();
    window.addEventListener('resize', setSlideEnd);

    // Capture duration from CSS before any animation is killed
    let cssDuration = parseFloat(window.getComputedStyle(slider).animationDuration) || 40;

    function resumeFromPosition() {
        if (isDown) return;
        const pos = getCurrentTranslate();
        const totalDist = slider._slideEnd || (slider.offsetWidth * 0.5);
        // Normalise: pos is negative, so flip sign then mod
        const cyclePos = ((-pos) % totalDist + totalDist) % totalDist;
        const progress = cyclePos / totalDist;
        const delay = -(progress * cssDuration);
        // Set animation first — CSS animations override inline transform,
        // so the slider snaps to the correct cycle position immediately
        slider.style.animation = `infiniteProjectSlide ${cssDuration}s ${delay}s linear infinite`;
        slider.style.transform = '';
    }

    function nudgeSlider(direction) {
        const pos = getCurrentTranslate();
        slider.style.animation = 'none';
        slider.style.transform = `translateX(${pos + direction * 300}px)`;
        clearTimeout(slider._resumeTimer);
        slider._resumeTimer = setTimeout(resumeFromPosition, 3000);
    }

    if (leftBtn)  leftBtn.addEventListener('click', () => nudgeSlider(1));
    if (rightBtn) rightBtn.addEventListener('click', () => nudgeSlider(-1));

    let isDown = false;
    let startX;
    let currentTranslate = 0;
    let isDragging = false;

    // Get current translateX position from the animation or inline style
    function getCurrentTranslate() {
        const style = window.getComputedStyle(slider);
        const matrix = new DOMMatrix(style.transform);
        return matrix.m41;
    }

    function startDrag(pageX) {
        isDown = true;
        isDragging = false;
        wrapper.classList.add('grabbing');
        startX = pageX;

        // Capture duration before killing the animation (computed style returns 0 when animation:none)
        cssDuration = parseFloat(window.getComputedStyle(slider).animationDuration) || cssDuration;
        // Capture current animated position and stop animation
        currentTranslate = getCurrentTranslate();
        slider.style.animation = 'none';
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function endDrag() {
        if (!isDown) return;
        isDown = false;
        wrapper.classList.remove('grabbing');

        // Resume animation from current position after delay
        clearTimeout(slider._resumeTimer);
        slider._resumeTimer = setTimeout(resumeFromPosition, 3000);
    }

    function moveDrag(pageX) {
        if (!isDown) return;
        isDragging = true;
        const walk = (pageX - startX) * 1.5;
        const newPos = currentTranslate + walk;
        // Clamp so slider can't be dragged backwards past the start
        slider.style.transform = `translateX(${Math.min(0, newPos)}px)`;
    }

    // Mouse events
    wrapper.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startDrag(e.pageX);
    });

    wrapper.addEventListener('mouseleave', endDrag);
    wrapper.addEventListener('mouseup', endDrag);

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        moveDrag(e.pageX);
    });

    // Touch events for mobile
    wrapper.addEventListener('touchstart', (e) => {
        startDrag(e.touches[0].pageX);
    }, { passive: true });

    wrapper.addEventListener('touchend', endDrag);

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // stop browser back-navigation gesture
        moveDrag(e.touches[0].pageX);
    }, { passive: false });

    // Prevent clicks on links while dragging
    wrapper.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
});

// Recent Projects 3D Coverflow Carousel
document.addEventListener('DOMContentLoaded', function () {
    const stage = document.querySelector('.carousel-stage');
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll('.carousel-card'));
    const dots  = Array.from(document.querySelectorAll('.carousel-dot'));
    const prev  = document.querySelector('.carousel-btn-prev');
    const next  = document.querySelector('.carousel-btn-next');
    const n     = cards.length;
    let current = 0;

    function update() {
        cards.forEach((card, i) => {
            card.classList.remove('pos-center', 'pos-left', 'pos-right');
            const offset = ((i - current) % n + n) % n;
            if (offset === 0)           card.classList.add('pos-center');
            else if (offset === 1)      card.classList.add('pos-right');
            else                        card.classList.add('pos-left');
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
        current = ((index % n) + n) % n;
        update();
    }

    // Auto-rotate
    let autoPlay = setInterval(() => goTo(current + 1), 3500);

    function resetAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => goTo(current + 1), 3500);
    }

    prev.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
    next.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAutoPlay(); }));

    // Click side cards to bring them forward
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('pos-center')) { goTo(i); resetAutoPlay(); }
        });
    });

    // Swipe (pause during touch, reset timer after)
    let tx = 0;
    stage.addEventListener('touchstart', e => {
        tx = e.touches[0].clientX;
        clearInterval(autoPlay);
    }, { passive: true });
    stage.addEventListener('touchend', e => {
        const diff = tx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        resetAutoPlay();
    });

    update();

    const wrap = stage.closest('.carousel-wrap') || stage.parentElement;
    wrap.addEventListener('mouseenter', () => clearInterval(autoPlay));
    wrap.addEventListener('mouseleave', () => resetAutoPlay());
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Skip if it's the dropdown toggle
        if (this.classList.contains('dropdown-toggle')) {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

        // FAQ Toggle
        function toggleFAQ(element) {
            const faqItem = element.parentNode;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        }

        // Form Submission
        if (document.getElementById('contactForm')) {
            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();

                // Get form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);

                // Simple validation
                if (!data.name || !data.email || !data.message) {
                    alert('Please fill in all required fields.');
                    return;
                }

                // Simulate form submission
                const submitBtn = document.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }


// Hero creature — speech bubbles + sparkle trail
(function() {
    if (document.body.classList.contains('reduced-motion')) return;
    const creature = document.querySelector('.hero-creature');
    if (!creature) return;

    const bubble = creature.querySelector('.creature-speech');
    const messages = [
        "Just passing through!",
        "Have you tried turning it off and on again?",
        "I work for biscuits",
        "Loading personality... done!",
        "Is this the way to the contact page?",
        "404: break time not found",
        "I've walked 500 miles...",
        "Nice website btw",
        "*scurrying intensifies*",
        "Someone said FREE WiFi??",
        "Don't mind me, just doing my rounds",
        "I'm not small, I'm fun-sized",
        "Built different",
        "My therapist said get out more...",
    ];
    let msgIndex = Math.floor(Math.random() * messages.length);
    let bubbleTimer;

    function showMessage() {
        bubble.textContent = messages[msgIndex];
        bubble.classList.add('visible');
        msgIndex = (msgIndex + 1) % messages.length;
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => bubble.classList.remove('visible'), 2800);
    }

    showMessage();
    setInterval(showMessage, 5000);

    // Sparkle trail
    const sparkleColors = ['#ff1493','#ff69b4','#cc0077','#bb44ff','#dd88ff','#fff'];
    setInterval(() => {
        const rect = creature.getBoundingClientRect();
        const sparkle = document.createElement('div');
        sparkle.className = 'creature-sparkle';
        sparkle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 30) + 'px';
        sparkle.style.top  = (rect.bottom - 8 - Math.random() * 10) + 'px';
        sparkle.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
    }, 180);
})();

// Bottom creature — falls from top of viewport when FAQ scrolled into view
(function() {
    if (document.body.classList.contains('reduced-motion')) return;
    const zone = document.querySelector('.page-bottom-creature-zone');
    const creature = document.getElementById('bottomCreature');
    if (!zone || !creature) return;

    const bubble = creature.querySelector('.creature-speech');
    const messages = [
        "Made it!",
        "Phew, that was a long way down...",
        "You scrolled all the way here?",
        "Almost at the footer!",
        "Did someone say contact page?",
        "I've walked this whole website",
        "Still working, don't mind me",
        "Nice to meet you at the bottom",
        "Free real estate down here",
        "The WiFi's better at the bottom",
    ];
    let msgIndex = 0;
    let bubbleTimer;
    let started = false;

    function showMsg() {
        bubble.textContent = messages[msgIndex % messages.length];
        bubble.classList.add('visible');
        msgIndex++;
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => bubble.classList.remove('visible'), 2800);
    }

    function startSparkles() {
        setInterval(() => {
            const rect = creature.getBoundingClientRect();
            if (rect.width === 0) return;
            const sparkle = document.createElement('div');
            sparkle.className = 'creature-sparkle';
            sparkle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 30) + 'px';
            sparkle.style.top  = (rect.bottom - 8 - Math.random() * 10) + 'px';
            const colors = ['#ff1493','#ff69b4','#cc0077','#bb44ff','#dd88ff','#fff'];
            sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 900);
        }, 180);
    }

    const zoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                creature.classList.add('falling');
                // Show landing message just as it arrives
                setTimeout(showMsg, 1400);
                // Switch to walking once fall animation ends
                setTimeout(() => {
                    creature.classList.remove('falling');
                    creature.classList.add('walking');
                    setInterval(showMsg, 5000);
                    startSparkles();
                }, 1450);
            }
        });
    }, { threshold: 0.1 });

    zoneObserver.observe(zone);
})();

// Feature mascot eye tracking
(function() {
    const mascot = document.querySelector('.service-feature-mascot');
    if (!mascot) return;
    const eyes = mascot.querySelectorAll('.creature-eye');
    document.addEventListener('mousemove', (e) => {
        eyes.forEach(eye => {
            const r = eye.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxScreen = 7;
            const s = dist > 0 ? Math.min(1, maxScreen / dist) : 0;
            eye.style.setProperty('--px', (dx * s / 4) + 'px');
            eye.style.setProperty('--py', (dy * s / 4) + 'px');
        });
    });
})();

// Feature section mascot speech bubble
(function() {
    const bubble = document.querySelector('.sfm-speech');
    if (!bubble) return;
    const messages = [
        "See what your site could do!",
        "Animations, sliders, buttons...",
        "Mix and match features!",
        "Built and ready to preview!",
        "What will you choose?",
        "Your site, your style!",
    ];
    let i = 0;
    function cycle() {
        bubble.textContent = messages[i % messages.length];
        bubble.classList.add('visible');
        i++;
        setTimeout(() => bubble.classList.remove('visible'), 2800);
    }
    cycle();
    setInterval(cycle, 4000);
})();


// ── Electrical dot cursor trail ──
(function () {
    if (document.body.classList.contains('reduced-motion')) return;
    if (window.matchMedia('(hover: none)').matches) return;

    // Custom glow cursor dot
    const cursorDot = document.createElement('div');
    cursorDot.id = 'hb-cursor';
    document.body.appendChild(cursorDot);

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'fixed', inset: '0',
        width: '100%', height: '100%',
        zIndex: '9998', pointerEvents: 'none',
        mixBlendMode: 'screen',
    });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let mx = -999, my = -999;
    window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top  = my + 'px';
    });

    const particles = [];

    function spawn() {
        if (mx < 0) return;
        const pink = Math.random() < 0.35;
        const r = 1.5 + Math.random() * 3;
        particles.push({
            x: mx, y: my,
            r,
            dx: (Math.random() - 0.5) * 1.2,
            dy: (Math.random() - 0.5) * 1.2 - 0.4,
            op: 0.7 + Math.random() * 0.3,
            decay: 0.03 + Math.random() * 0.03,
            color:   pink ? '#ff1493' : '#ffffff',
            glowRgb: pink ? '255,20,147' : '255,255,255',
        });
    }

    let frame = 0, trailRaf;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        frame++;
        if (frame % 2 === 0) spawn();

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x  += p.dx;
            p.y  += p.dy;
            p.op -= p.decay;
            p.r  *= 0.97;
            if (p.op <= 0) { particles.splice(i, 1); continue; }

            // Glow
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
            g.addColorStop(0,   `rgba(${p.glowRgb},${(p.op * 0.8).toFixed(3)})`);
            g.addColorStop(0.4, `rgba(${p.glowRgb},${(p.op * 0.2).toFixed(3)})`);
            g.addColorStop(1,   `rgba(${p.glowRgb},0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.op;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        trailRaf = requestAnimationFrame(draw);
    }

    trailRaf = requestAnimationFrame(draw);

    window._hbStopFns = window._hbStopFns || [];
    window._hbStopFns.push(function () {
        cancelAnimationFrame(trailRaf);
        canvas.remove();
        cursorDot.remove();
    });
})();

// ── Floating glowing dots background ──
(function () {
    if (document.body.classList.contains('reduced-motion')) return;

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'fixed', inset: '0',
        width: '100%', height: '100%',
        zIndex: '3', pointerEvents: 'none',
        mixBlendMode: 'screen',
    });
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    let W, H, dots = [];

    const blockSel = '.hero, .service-hero, .contact-hero, .features-hero, ' +
        '.feature-card, .pricing-card, .ideal-card, .cw-split-card, ' +
        '.demo-tile, .contact-form-card, .info-item, .faq-item, ' +
        '.timeline-item, .comparison-row, .project-item, ' +
        '.carousel-card, .advanced-card, .service-feature, ' +
        '.about-highlight, .cert-item, .technologies, ' +
        '.seo-concept-card, .review-llm-card, .timeline-explainer-item, ' +
        '.keyword-box, .seo-analogy-box, .seo-intro-block, ' +
        '.host-concept-card, .hosting-tier, .site-size-card, ' +
        '.speed-factor-card, .term-card, .host-analogy-box, .host-intro-block';

    function getBlockRects() {
        return Array.from(document.querySelectorAll(blockSel))
            .map(el => el.getBoundingClientRect())
            .filter(r => r.width > 0 && r.height > 0);
    }

    function makeDot() {
        const pink = Math.random() < 0.22;
        const r    = 1.5 + Math.random() * 5;
        return {
            x: Math.random() * W, y: Math.random() * H,
            r, baseR: r,
            dx: (Math.random() - 0.5) * 0.35,
            dy: (Math.random() - 0.5) * 0.35,
            op: 0.15 + Math.random() * 0.45,
            color:   pink ? '#ff1493' : '#ffffff',
            glowRgb: pink ? '255,20,147' : '255,255,255',
            phase:    Math.random() * Math.PI * 2,
            phaseSpd: 0.004 + Math.random() * 0.008,
        };
    }

    function init() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        const count = Math.max(40, Math.min(80, Math.floor(W * H / 12000)));
        dots = Array.from({ length: count }, makeDot);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Clip to areas outside heroes and cards
        const blocked = getBlockRects();
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, H);
        blocked.forEach(r => ctx.rect(r.left, r.top, r.width, r.height));
        ctx.clip('evenodd');

        dots.forEach(d => {
            d.phase += d.phaseSpd;
            const pulse = 0.65 + 0.35 * Math.sin(d.phase);
            const r     = d.baseR * (0.85 + 0.15 * Math.sin(d.phase));
            const op    = d.op * pulse;

            d.x += d.dx; d.y += d.dy;
            if (d.x < -30) d.x = W + 30;
            if (d.x > W + 30) d.x = -30;
            if (d.y < -30) d.y = H + 30;
            if (d.y > H + 30) d.y = -30;

            const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r * 7);
            g.addColorStop(0,   `rgba(${d.glowRgb},${(op * 0.9).toFixed(3)})`);
            g.addColorStop(0.4, `rgba(${d.glowRgb},${(op * 0.25).toFixed(3)})`);
            g.addColorStop(1,   `rgba(${d.glowRgb},0)`);
            ctx.beginPath();
            ctx.arc(d.x, d.y, r * 7, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
            ctx.fillStyle = d.color;
            ctx.globalAlpha = op;
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        ctx.restore();
        dotsRaf = requestAnimationFrame(draw);
    }

    let dotsRaf;
    init();
    window.addEventListener('resize', init);
    dotsRaf = requestAnimationFrame(draw);

    window._hbStopFns = window._hbStopFns || [];
    window._hbStopFns.push(function () {
        cancelAnimationFrame(dotsRaf);
        canvas.remove();
    });
})();

// ── Service hero circuit animation ──
(function () {
    const hero = document.querySelector('.service-hero, .features-hero, .contact-hero');
    if (!hero || document.body.classList.contains('reduced-motion')) return;

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'absolute', inset: '0',
        width: '100%', height: '100%',
        zIndex: '2', pointerEvents: 'none',
    });
    hero.insertBefore(canvas, hero.firstChild);
    const ctx = canvas.getContext('2d');

    const CELL = 52;
    let W, H, COLS, ROWS, paths = [], pulses = [];

    function buildPaths() {
        paths = [];
        for (let i = 0; i < 18; i++) {
            const pts = [];
            let gx = Math.floor(Math.random() * COLS);
            let gy = Math.floor(Math.random() * (ROWS + 1));
            pts.push({ x: gx * CELL, y: gy * CELL });
            let dir = Math.random() > 0.5 ? 0 : 1;
            const segs = 3 + Math.floor(Math.random() * 5);
            for (let s = 0; s < segs; s++) {
                const step = 1 + Math.floor(Math.random() * 4);
                if (dir === 0) gx = Math.max(0, Math.min(COLS - 1, gx + (Math.random() > 0.5 ? step : -step)));
                else           gy = Math.max(0, Math.min(ROWS,     gy + (Math.random() > 0.5 ? step : -step)));
                pts.push({ x: gx * CELL, y: gy * CELL });
                dir = 1 - dir;
            }
            paths.push(pts);
        }
    }

    function segLen(a, b) { return Math.abs(b.x - a.x) + Math.abs(b.y - a.y); }
    function pathLen(pts) { let l = 0; for (let i = 1; i < pts.length; i++) l += segLen(pts[i-1], pts[i]); return l; }
    function posAt(pts, t) {
        let target = (((t % 1) + 1) % 1) * pathLen(pts);
        for (let i = 1; i < pts.length; i++) {
            const sl = segLen(pts[i-1], pts[i]);
            if (target <= sl) {
                const f = sl ? target / sl : 0;
                return { x: pts[i-1].x + (pts[i].x - pts[i-1].x) * f, y: pts[i-1].y + (pts[i].y - pts[i-1].y) * f };
            }
            target -= sl;
        }
        return pts[pts.length - 1];
    }

    function spawnPulse(t) {
        const pi = Math.floor(Math.random() * paths.length);
        const pink = Math.random() > 0.4;
        return {
            pi, t: t !== undefined ? t : Math.random(),
            speed: 60 + Math.random() * 80,
            color: pink ? '#ff1493' : '#cccccc',
            glow:  pink ? 'rgba(255,20,147,' : 'rgba(200,200,200,',
            r: 2.5 + Math.random() * 1.5,
        };
    }

    function resize() {
        W = canvas.width  = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
        COLS = Math.ceil(W / CELL) + 1;
        ROWS = Math.ceil(H / CELL) + 1;
        buildPaths();
        pulses = [];
        for (let i = 0; i < 10; i++) pulses.push(spawnPulse());
    }

    let last = null;
    function draw(ts) {
        if (!last) last = ts;
        const dt = Math.min((ts - last) / 1000, 0.05);
        last = ts;

        ctx.clearRect(0, 0, W, H);

        // Traces
        paths.forEach(pts => {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Node dots
            pts.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fill();
            });
        });

        // Pulses
        pulses.forEach((pulse) => {
            const pts  = paths[pulse.pi];
            const L    = pathLen(pts);
            pulse.t    = (pulse.t + pulse.speed * dt / L) % 1;
            const pos  = posAt(pts, pulse.t);

            // Glow halo
            const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pulse.r * 9);
            g.addColorStop(0,   pulse.glow + '0.6)');
            g.addColorStop(0.3, pulse.glow + '0.2)');
            g.addColorStop(1,   pulse.glow + '0)');
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pulse.r * 9, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pulse.r, 0, Math.PI * 2);
            ctx.fillStyle = pulse.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = pulse.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        circuitRaf = requestAnimationFrame(draw);
    }

    let circuitRaf;
    resize();
    window.addEventListener('resize', () => { last = null; resize(); });
    circuitRaf = requestAnimationFrame(draw);

    window._hbStopFns = window._hbStopFns || [];
    window._hbStopFns.push(function () {
        cancelAnimationFrame(circuitRaf);
        canvas.remove();
    });
})();
