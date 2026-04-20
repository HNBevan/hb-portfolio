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
                const frag = document.createDocumentFragment();
                node.textContent.split(/(\s+)/).forEach(function (segment) {
                    if (/^\s/.test(segment)) {
                        const sp = document.createElement('span');
                        sp.style.display = 'inline-block';
                        sp.style.width = '0.35em';
                        sp.style.animationDelay = delay + 'ms';
                        delay += stagger;
                        frag.appendChild(sp);
                    } else if (segment.length) {
                        const wordWrap = document.createElement('span');
                        wordWrap.className = 'h1-word';
                        wordWrap.style.display = 'inline-block';
                        wordWrap.style.whiteSpace = 'nowrap';
                        segment.split('').forEach(function (ch) {
                            const s = document.createElement('span');
                            s.className = 'h1-letter';
                            s.textContent = ch;
                            s.style.animationDelay = delay + 'ms';
                            delay += stagger;
                            wordWrap.appendChild(s);
                        });
                        frag.appendChild(wordWrap);
                    }
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (!isWave) delay += 40; // pause before coloured word on drop-in only
                node.style.display = 'inline-block';
                node.style.whiteSpace = 'nowrap';
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

        // Keyboard support for FAQ questions
        document.querySelectorAll('.faq-question').forEach(el => {
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(this);
                }
            });
        });

        // Form Submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            const successModal = document.getElementById('successModal');
            const successClose = document.getElementById('successModalClose');
            const submitBtn = contactForm.querySelector('.submit-btn');
            const errMsg = 'Something went wrong. Please try again or email info@hbwebdevelopment.co.uk directly.';

            if (successClose && successModal) {
                successClose.addEventListener('click', () => successModal.classList.add('hidden'));
            }

            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const data = Object.fromEntries(new FormData(this));

                if (!data.name || !data.email || !data.message) {
                    alert('Please fill in all required fields.');
                    return;
                }

                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000);

                try {
                    const res = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        signal: controller.signal,
                        body: JSON.stringify({
                            access_key: 'e390c99c-4954-4b6f-ba1a-12edcde1da5e',
                            subject: 'New enquiry from HB Web Development contact form',
                            ...data,
                        }),
                    });

                    const result = await res.json();

                    if (result.success) {
                        this.reset();
                        if (successModal) successModal.classList.remove('hidden');
                    } else {
                        alert(errMsg);
                    }
                } catch {
                    alert(errMsg);
                } finally {
                    clearTimeout(timeout);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
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

    // Hide cursor on touch, restore only on real mouse movement
    let usingMouse = false;
    document.addEventListener('touchstart', () => {
        usingMouse = false;
        cursorDot.style.display = 'none';
        canvas.style.display = 'none';
    }, { passive: true });
    document.addEventListener('mousemove', (e) => {
        if (e.movementX === 0 && e.movementY === 0) return;
        usingMouse = true;
        cursorDot.style.display = '';
        canvas.style.display = '';
    });

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

// ── Contact Animations ──
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

// ── Package Deals Animations ──
(function () {
        var selectors = [
            '.feature-card', '.pricing-card', '.ideal-card',
            '.timeline-item', '.faq-item', '.comparison-row:not(.header)'
        ];
        var dirs = ['srv-from-right', '', 'srv-from-left', 'srv-from-top', 'srv-from-right', 'srv-from-bottom'];
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

// ── SEO Services Animations ──
(function () {
        var selectors = [
            '.feature-card', '.pricing-card', '.ideal-card',
            '.timeline-item', '.faq-item', '.comparison-row:not(.header)'
        ];
        var dirs = ['', 'srv-from-top', 'srv-from-left', 'srv-from-right', 'srv-from-bottom', 'srv-from-left'];
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

// ── Hosting Explained Animations ──
(function () {
        var selectors = ['.host-concept-card', '.hosting-tier', '.site-size-card', '.speed-factor-card', '.term-card', '.faq-item'];
        var dirs = ['srv-from-left', 'srv-from-top', 'srv-from-right', '', 'srv-from-bottom', 'srv-from-left', 'srv-from-right', 'srv-from-top'];
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
                el.dataset.srvDelay = i * 100;
            });
        });
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                setTimeout(function () { el.classList.add('srv-visible'); }, parseInt(el.dataset.srvDelay) || 0);
                obs.unobserve(el);
            });
        }, { threshold: 0.1 });
        elements.forEach(function (el) { obs.observe(el); });
    })();

// ── SEO Explained Animations ──
(function () {
        var selectors = ['.seo-concept-card', '.timeline-explainer-item', '.faq-item', '.review-llm-card'];
        var dirs = ['srv-from-top', 'srv-from-left', '', 'srv-from-right', 'srv-from-bottom', 'srv-from-left', 'srv-from-right', 'srv-from-top', ''];
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
                el.dataset.srvDelay = i * 100;
            });
        });
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                setTimeout(function () { el.classList.add('srv-visible'); }, parseInt(el.dataset.srvDelay) || 0);
                obs.unobserve(el);
            });
        }, { threshold: 0.1 });
        elements.forEach(function (el) { obs.observe(el); });
    })();

// ── Custom Websites Animations ──
(function () {
        var selectors = [
            '.feature-card', '.pricing-card', '.ideal-card', '.cw-split-card',
            '.timeline-item', '.faq-item', '.comparison-row:not(.header)'
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

// ── Website Features Animations ──
// ── Stack cards ──
    (function () {
        const demo = document.getElementById('fcStackDemo');
        if (!demo) return;
        const cards = Array.from(demo.querySelectorAll('.fc-stack-card'));
        let current = 0;
        let locked = false;

        function goTo(index) {
            if (locked) return;
            const next = Math.max(0, Math.min(cards.length - 1, index));
            if (next === current) return;
            locked = true;
            current = next;
            cards.forEach(function (card, i) {
                if (i < current) {
                    card.style.transform = 'translateY(0) scale(' + (1 - (current - i) * 0.03) + ')';
                } else if (i === current) {
                    card.style.transform = 'translateY(0) scale(1)';
                } else {
                    card.style.transform = 'translateY(105%)';
                }
            });
            setTimeout(function () { locked = false; }, 420);
        }

        demo.addEventListener('wheel', function (e) {
            e.preventDefault();
            goTo(e.deltaY > 0 ? current + 1 : current - 1);
        }, { passive: false });

        let ty = 0;
        demo.addEventListener('touchstart', function (e) {
            ty = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        demo.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, { passive: false });
        demo.addEventListener('touchend', function (e) {
            const diff = ty - e.changedTouches[0].clientY;
            if (Math.abs(diff) > 20) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: false });
    })();

    // ── Reveal animations ──
    (function () {
        const cards = Array.from(document.querySelectorAll('.fr-card'));
        if (!cards.length) return;

        function reveal(card) {
            setTimeout(function () {
                card.classList.add('fr-visible');
            }, parseInt(card.dataset.delay || 0));
        }

        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) reveal(entry.target);
            });
        }, { threshold: 0.15 });

        cards.forEach(function (card) { obs.observe(card); });

        // Replay button
        const replayBtn = document.getElementById('frReplayBtn');
        if (replayBtn) {
            replayBtn.addEventListener('click', function () {
                // Add spin to button icon
                replayBtn.classList.add('spinning');
                setTimeout(() => replayBtn.classList.remove('spinning'), 700);

                // Instantly snap cards to hidden (no transition), then animate back in
                cards.forEach(function (card) {
                    card.style.transition = 'none';
                    card.classList.remove('fr-visible');
                });
                // Force reflow so hidden state is painted
                void cards[0].offsetHeight;
                setTimeout(function () {
                    cards.forEach(function (card) {
                        card.style.transition = '';
                    });
                    cards.forEach(function (card) { reveal(card); });
                }, 20);
            });
        }
    })();

    // ── Accordion ──
    function toggleAcc(head) {
        const item = head.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('#demoAccordion .fa-acc-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    }

    // Keyboard support for accordion heads
    document.querySelectorAll('.fa-acc-head').forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAcc(this);
            }
        });
    });

    // ── Modal ──
    function openModal(id)  { document.getElementById(id).classList.add('open'); }
    function closeModal(id) { document.getElementById(id).classList.remove('open'); }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.querySelectorAll('.fm-overlay.open').forEach(m => m.classList.remove('open'));
    });

    // ── Tab nav ──
    const tabLabels = ['Overview tab selected.','Features tab selected.','Pricing tab selected.','Contact tab selected.'];
    const demoTabs = document.getElementById('demoTabs');
    if (demoTabs) {
        demoTabs.addEventListener('click', e => {
            const btn = e.target.closest('.fn-tab');
            if (!btn) return;
            document.querySelectorAll('#demoTabs .fn-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tabContent').textContent = tabLabels[btn.dataset.tab];
        });
    }

    // ── Pill nav ──
    const demoPills = document.getElementById('demoPills');
    if (demoPills) {
        demoPills.addEventListener('click', e => {
            const btn = e.target.closest('.fn-pill');
            if (!btn) return;
            document.querySelectorAll('#demoPills .fn-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    }

    // ── Tabbed carousel ──
    const demoTabCar = document.getElementById('demoTabCar');
    if (demoTabCar) {
        demoTabCar.addEventListener('click', e => {
            const btn = e.target.closest('.fs-tab-btn');
            if (!btn) return;
            const panel = btn.dataset.panel;
            document.querySelectorAll('#demoTabCar .fs-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.fs-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === panel));
        });
    }

    // ── Strip slider ──
    (function() {
        const inner = document.getElementById('demoStripInner');
        if (!inner) return;
        const dots  = document.querySelectorAll('#stripDots .fs-strip-dot');
        let current = 0;
        const total = 4;

        function goTo(n) {
            current = (n + total) % total;
            inner.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        document.getElementById('stripNext').addEventListener('click', () => goTo(current + 1));
        document.getElementById('stripPrev').addEventListener('click', () => goTo(current - 1));
        dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

        // Auto-advance
        setInterval(() => goTo(current + 1), 3500);
    })();

    // ── Fade carousel ──
    (function() {
        const slides = document.querySelectorAll('#demoFade .fs-fade-slide');
        if (!slides.length) return;
        const dots   = document.querySelectorAll('#fadeDots .fs-fade-dot');
        let cur = 0;
        function goTo(n) {
            slides[cur].classList.remove('active');
            dots[cur].classList.remove('active');
            cur = (n + slides.length) % slides.length;
            slides[cur].classList.add('active');
            dots[cur].classList.add('active');
        }
        document.getElementById('fadeNext').addEventListener('click', () => goTo(cur + 1));
        document.getElementById('fadePrev').addEventListener('click', () => goTo(cur - 1));
        dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
        setInterval(() => goTo(cur + 1), 4000);
    })();

    // ── Mini 3D Coverflow ──
    (function() {
        const cards = Array.from(document.querySelectorAll('#demoCoverflow .fs-cf-card'));
        if (!cards.length) return;
        const positions = ['pos-left', 'pos-center', 'pos-right'];
        // initial order: index 0=center, 1=right, 2=left
        let order = [0, 1, 2]; // order[i] = which card is at position i (left/center/right)

        function update() {
            cards.forEach(c => c.classList.remove('pos-left', 'pos-center', 'pos-right'));
            order.forEach((cardIdx, posIdx) => cards[cardIdx].classList.add(positions[posIdx]));
        }

        function next() {
            order = [order[1], order[2], order[0]];
            update();
        }
        function prev() {
            order = [order[2], order[0], order[1]];
            update();
        }

        document.getElementById('cfNext').addEventListener('click', next);
        document.getElementById('cfPrev').addEventListener('click', prev);
        cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('pos-right')) next();
                else if (card.classList.contains('pos-left')) prev();
            });
        });
        setInterval(next, 3800);
    })();

    // ── Tilt card ──
    const tiltCard = document.getElementById('tiltCard');
    const tiltShine = document.getElementById('tiltShine');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotX = (y - 0.5) * -18;
            const rotY = (x - 0.5) * 18;
            tiltCard.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
            tiltCard.style.boxShadow = `${-rotY * 0.8}px ${rotX * 0.8}px 30px rgba(255,20,147,0.2)`;
            tiltShine.style.setProperty('--mx', (x * 100) + '%');
            tiltShine.style.setProperty('--my', (y * 100) + '%');
        });
        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = '';
            tiltCard.style.boxShadow = '';
        });
    }

    // ── Expandable card ──
    function toggleExpandCard() {
        document.getElementById('expandCard').classList.toggle('open');
    }

    // Keyboard support for expand card head
    document.querySelectorAll('.fc-expand-head').forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleExpandCard();
            }
        });
    });

    // ── Range slider ──
    const range = document.getElementById('budgetRange');
    const rangeVal = document.getElementById('rangeVal');
    if (range) {
        range.addEventListener('input', () => {
            rangeVal.textContent = '£' + Number(range.value).toLocaleString();
        });
    }

    // ── Lucide icons ──
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ── Features hero creature ──
    (function() {
        const creature = document.getElementById('featCreature');
        if (!creature) return;
        const speech     = document.getElementById('featCreatureSpeech');
        const hero       = document.querySelector('.features-hero');
        const hint       = creature.querySelector('.fc-hint'); // may be null
        const leftEye    = creature.querySelector('.creature-eye.left');
        const rightEye   = creature.querySelector('.creature-eye.right');
        const leftPupil  = leftEye  && leftEye.querySelector('.fc-pupil');
        const rightPupil = rightEye && rightEye.querySelector('.fc-pupil');

        const messages = [
            "Psst... try clicking a chip!",
            "I helped write some of this CSS",
            "Grab and throw me at the wall!",
            "Every component is customisable",
            "Scroll down for more styles",
            "The flip card is my favourite",
            "Built with love and coffee",
            "Dark mode is the only mode",
            "Your site could look like this",
            "I passed my accessibility audit",
            "Did you see the glitch animation?",
            "I live in this hero full time",
            "Double-click me for a surprise",
            "Hayley built all of this",
        ];
        let msgIndex = 0, bubbleTimer;

        function showMessage(text) {
            speech.textContent = text || messages[msgIndex++ % messages.length];
            speech.classList.add('visible');
            clearTimeout(bubbleTimer);
            bubbleTimer = setTimeout(() => speech.classList.remove('visible'), 2800);
        }
        setTimeout(showMessage, 1800);

        // ── Home position helper ──
        function setHomePos() {
            creature.style.top    = '';
            if (window.innerWidth <= 1024) {
                creature.style.transform = 'none'; // cancel CSS translateX(50%)
                creature.style.left      = 'calc(50% - ' + (creature.offsetWidth / 2) + 'px)';
                creature.style.right     = 'auto';
                creature.style.bottom    = '10px';
            } else {
                creature.style.transform = ''; // restore CSS default (no transform on desktop)
                creature.style.left      = '';
                creature.style.right     = '80px';
                creature.style.bottom    = '18px';
            }
        }

        // ── Physics state ──
        let posX = 0, posY = 0;
        let vx = 0, vy = 0;
        let flying = false;
        let isChaos = false;
        let rafId = null;
        let physicsStart = 0;
        const GRAVITY         = 0.42;
        const WALL_DAMPING    = 0.52;
        const FLOOR_DAMPING   = 0.48;
        const AIR_FRICTION    = 0.978;
        const GROUND_FRICTION = 0.88;

        // ── Chonk state ──
        let chonkLevel = 0;

        let bounds = { maxX: 0, maxY: 0 };

        function cacheBounds() {
            const hr = hero.getBoundingClientRect();
            bounds.maxX = hr.width  - creature.offsetWidth;
            bounds.maxY = hr.height - creature.offsetHeight;
        }

        function spawnSparkles(n) {
            const rect = creature.getBoundingClientRect();
            const cols = ['#ff1493','#ff69b4','#bb44ff','#dd88ff','#fff'];
            for (let i = 0; i < n; i++) {
                setTimeout(() => {
                    const s = document.createElement('div');
                    s.className = 'creature-sparkle';
                    s.style.left = (rect.left + rect.width/2  + (Math.random()-.5)*60) + 'px';
                    s.style.top  = (rect.top  + rect.height/2 + (Math.random()-.5)*40) + 'px';
                    s.style.background = cols[Math.floor(Math.random()*cols.length)];
                    document.body.appendChild(s);
                    setTimeout(() => s.remove(), 900);
                }, i * 50);
            }
        }

        function squish(axis) {
            creature.classList.remove('squish-x','squish-y');
            void creature.offsetWidth;
            creature.classList.add(axis === 'x' ? 'squish-x' : 'squish-y');
            setTimeout(() => creature.classList.remove('squish-x','squish-y'), 250);
            spawnSparkles(3);
            if (Math.random() < 0.4) showMessage(["Ow!","Boing!","Wheeeee!","That wall was solid...","Again!"][Math.floor(Math.random()*5)]);
        }

        function stopPhysics(andWalk) {
            flying = false;
            vx = 0; vy = 0;
            creature.classList.remove('flying');
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            if (andWalk) setTimeout(walkHome, 150);
        }

        function walkHome() {
            // Ensure creature is in left/top coordinate space
            const cr = creature.getBoundingClientRect();
            const hr = hero.getBoundingClientRect();
            if (!creature.style.left) {
                posX = cr.left - hr.left;
                posY = cr.top  - hr.top;
                creature.style.transform = 'none'; // cancel CSS translateX(50%) on mobile/tablet
                creature.style.left   = posX + 'px';
                creature.style.top    = posY + 'px';
                creature.style.right  = 'auto';
                creature.style.bottom = 'auto';
            }

            const getTarget = () => {
                const hr2 = hero.getBoundingClientRect();
                const cw  = creature.offsetWidth;
                const ch  = creature.offsetHeight;
                const x   = window.innerWidth <= 1024
                    ? (hr2.width / 2) - (cw / 2)
                    : hr2.width - cw - 80;
                return { x, y: hr2.height - ch - (window.innerWidth <= 1024 ? 10 : 18) };
            };

            const WALK_SPEED = 2.8; // px per frame
            let walkRaf = null;

            function walkTick() {
                const { x: tx, y: ty } = getTarget();
                const dx = tx - posX;
                const dy = ty - posY;
                const dist = Math.hypot(dx, dy);

                // Update facing direction
                if (Math.abs(dx) > 2) {
                    const goingLeft = dx < 0;
                    creature.classList.toggle('fc-walk-left',  goingLeft);
                    creature.classList.toggle('fc-walk-right', !goingLeft);
                }

                if (dist <= WALK_SPEED) {
                    // Arrived — clean up and restore CSS positioning
                    posX = tx; posY = ty;
                    creature.classList.remove('fc-walk-left', 'fc-walk-right');
                    setHomePos();
                    walkRaf = null;
                    showMessage("Home sweet home.");
                    return;
                }

                const step = WALK_SPEED / dist;
                posX += dx * step;
                posY += dy * step;
                creature.style.left = posX + 'px';
                creature.style.top  = posY + 'px';
                walkRaf = requestAnimationFrame(walkTick);
            }

            // Cancel if user grabs creature mid-walk
            creature.addEventListener('mousedown', () => {
                if (walkRaf) {
                    cancelAnimationFrame(walkRaf);
                    walkRaf = null;
                    creature.classList.remove('fc-walk-left', 'fc-walk-right');
                }
            }, { once: true });

            walkRaf = requestAnimationFrame(walkTick);
        }

        function physicsTick() {
            // Chaos runs on its own timer; normal physics times out at 10s
            if (!isChaos && Date.now() - physicsStart > 10000) { stopPhysics(true); return; }

            const { maxX, maxY } = bounds;
            const onFloor = posY >= maxY - 1;
            const wd = isChaos ? 0.93 : WALL_DAMPING;
            const fd = isChaos ? 0.93 : FLOOR_DAMPING;

            if (!onFloor) vy += GRAVITY;
            vx *= onFloor ? GROUND_FRICTION : AIR_FRICTION;
            if (!onFloor) vy *= AIR_FRICTION;

            posX += vx;
            posY += vy;

            // Wall collisions
            if (posX <= 0)    { posX = 0;    vx =  Math.abs(vx) * wd; if (!isChaos) squish('x'); }
            if (posX >= maxX) { posX = maxX; vx = -Math.abs(vx) * wd; if (!isChaos) squish('x'); }
            if (posY <= 0)    { posY = 0;    vy =  Math.abs(vy) * wd; if (!isChaos) squish('y'); }

            // Floor collision
            if (posY >= maxY) {
                posY = maxY;
                const bounced = Math.abs(vy) * fd;
                if (bounced > 1.0 || isChaos) {
                    vy = -Math.max(bounced, isChaos ? 8 : 0);
                    if (!isChaos) squish('y');
                } else {
                    vy = 0;
                    if (!isChaos && flying) {
                        flying = false;
                        creature.classList.remove('flying');
                    }
                }
            }

            creature.style.left   = posX + 'px';
            creature.style.top    = posY + 'px';
            creature.style.right  = 'auto';
            creature.style.bottom = 'auto';

            // Normal stop condition (chaos ends via its own setTimeout)
            if (!isChaos && Math.abs(vx) < 0.08 && Math.abs(vy) < 0.08) {
                stopPhysics(true);
                return;
            }
            rafId = requestAnimationFrame(physicsTick);
        }

        function launch(throwVx, throwVy) {
            if (rafId) cancelAnimationFrame(rafId);
            cacheBounds();
            physicsStart = Date.now();
            vx = throwVx;
            vy = throwVy;
            flying = true;
            creature.classList.add('flying');
            creature.classList.remove('bouncing');
            if (hint) hint.style.opacity = '0';
            rafId = requestAnimationFrame(physicsTick);
        }

        // ── Eye tracking ──
        document.addEventListener('mousemove', (e) => {
            [[leftEye, leftPupil],[rightEye, rightPupil]].forEach(([eye, pupil]) => {
                if (!eye || !pupil) return;
                const r = eye.getBoundingClientRect();
                const angle = Math.atan2(e.clientY - (r.top + r.height/2), e.clientX - (r.left + r.width/2));
                pupil.style.transform = `translate(${Math.cos(angle)*3}px,${Math.sin(angle)*3}px)`;
            });
        });

        // ── Click (delayed so dblclick can cancel it) ──
        let wasDragging = false;
        let clickTimer = null;
        const funnyMessages = [
            "Oi! That tickles!",
            "I felt that.",
            "Do that again, I dare you.",
            "Rude, but okay.",
            "I'm trying to look professional here!",
            "My coffee is going cold.",
            "Yes, I'm interactive. Very clever.",
            "Stop poking me!",
            "I'm a mascot, not a button.",
            "That was unnecessary.",
            "Fine. FINE. I'll bounce.",
            "Every click is a cry for help.",
        ];
        let funMsgIdx = 0;
        creature.addEventListener('click', () => {
            if (wasDragging) return;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                const msg = funnyMessages[funMsgIdx++ % funnyMessages.length];
                showMessage(msg);
                if (!flying) {
                    creature.classList.remove('bouncing');
                    void creature.offsetWidth;
                    creature.classList.add('bouncing');
                    setTimeout(() => creature.classList.remove('bouncing'), 400);
                }
                spawnSparkles(7);
            }, 230);
        });

        // ── Double-click — sprint off screen, fall back in ──
        creature.addEventListener('dblclick', () => {
            clearTimeout(clickTimer);
            if (isChaos) return;

            // Stop any ongoing physics / walk
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            creature.classList.remove('flying','bouncing','party','fc-walk-left','fc-walk-right');
            flying = false;

            // Snap to left/top coordinate space
            const cr = creature.getBoundingClientRect();
            const hr = hero.getBoundingClientRect();
            posX = cr.left - hr.left;
            posY = cr.top  - hr.top;
            creature.style.transform = 'none'; // cancel CSS translateX(50%) on mobile/tablet
            creature.style.left   = posX + 'px';
            creature.style.top    = posY + 'px';
            creature.style.right  = 'auto';
            creature.style.bottom = 'auto';

            showMessage("Catch me if you can!");

            // Run toward far edge (away from home corner)
            const goRight  = posX < hr.width / 2;
            const runVx    = goRight ? 22 : -22;
            const offEdge  = goRight ? hr.width + creature.offsetWidth + 20
                                     : -(creature.offsetWidth + 20);

            creature.classList.add(goRight ? 'fc-walk-right' : 'fc-walk-left');

            const trailId = setInterval(() => spawnSparkles(2), 45);

            // ── Phase 1: sprint off screen ──
            function runTick() {
                posX += runVx;
                creature.style.left = posX + 'px';

                if (goRight ? posX > offEdge : posX < offEdge) {
                    clearInterval(trailId);
                    creature.classList.remove('fc-walk-left','fc-walk-right');

                    // ── Phase 2: appear above hero ──
                    const homeX = window.innerWidth <= 1024
                        ? (hr.width / 2) - (creature.offsetWidth / 2)
                        : hr.width - creature.offsetWidth - 80;
                    const homeY = hr.height - creature.offsetHeight - (window.innerWidth <= 1024 ? 10 : 18);
                    posX = homeX;
                    posY = -(creature.offsetHeight + 20);
                    creature.style.left = posX + 'px';
                    creature.style.top  = posY + 'px';

                    let fallVy = 0;

                    setTimeout(() => {
                        // ── Phase 3: fall down ──
                        function fallTick() {
                            fallVy += GRAVITY * 2.2;
                            posY   += fallVy;
                            creature.style.top = posY + 'px';

                            if (posY >= homeY) {
                                posY = homeY;
                                creature.style.top = posY + 'px';
                                squish('y');
                                spawnSparkles(20);
                                showMessage("Ta-da!");

                                // Settle back to CSS-based positioning
                                setTimeout(() => { setHomePos(); }, 500);
                                return;
                            }
                            requestAnimationFrame(fallTick);
                        }
                        requestAnimationFrame(fallTick);
                    }, 180);
                    return;
                }
                requestAnimationFrame(runTick);
            }
            requestAnimationFrame(runTick);
        });

        // ── Drag + throw (mouse & touch) ──
        function startCreatureDrag(clientX, clientY) {
            wasDragging = false;

            const cr = creature.getBoundingClientRect();
            const hr = hero.getBoundingClientRect();
            posX = cr.left - hr.left;
            posY = cr.top  - hr.top;
            creature.style.transform = 'none'; // cancel CSS translateX(50%) on mobile/tablet
            creature.style.left   = posX + 'px';
            creature.style.top    = posY + 'px';
            creature.style.right  = 'auto';
            creature.style.bottom = 'auto';

            if (rafId) cancelAnimationFrame(rafId);
            flying = false;
            creature.classList.remove('flying');

            const offX = clientX - cr.left;
            const offY = clientY - cr.top;
            const hist = [];

            function moveCreature(cx, cy) {
                wasDragging = true;
                const hr2 = hero.getBoundingClientRect();
                const cw = creature.offsetWidth, ch = creature.offsetHeight;
                let x = cx - hr2.left - offX;
                let y = cy - hr2.top  - offY;
                x = Math.max(0, Math.min(hr2.width  - cw, x));
                y = Math.max(0, Math.min(hr2.height - ch, y));
                posX = x; posY = y;
                creature.style.left = x + 'px';
                creature.style.top  = y + 'px';
                hist.push({ x: cx, y: cy, t: Date.now() });
                if (hist.length > 12) hist.shift();
            }

            function endCreatureDrag() {
                setTimeout(() => { wasDragging = false; }, 50);
                if (hist.length >= 2) {
                    const cutoff = Date.now() - 120;
                    const recent = hist.filter(p => p.t >= cutoff);
                    if (recent.length >= 2) {
                        const first = recent[0], last = recent[recent.length - 1];
                        const dt = Math.max((last.t - first.t) / 16, 1);
                        const tvx = (last.x - first.x) / dt;
                        const tvy = (last.y - first.y) / dt;
                        const cap = 22;
                        const fx = Math.max(-cap, Math.min(cap, tvx));
                        const fy = Math.max(-cap, Math.min(cap, tvy));
                        if (Math.abs(fx) > 1.5 || Math.abs(fy) > 1.5) { launch(fx, fy); return; }
                    }
                }
                launch(0, 0);
            }

            // Mouse
            const onMouseMove = (e) => moveCreature(e.clientX, e.clientY);
            const onMouseUp   = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup',  onMouseUp);
                endCreatureDrag();
            };

            // Touch
            const onTouchMove = (e) => { e.preventDefault(); moveCreature(e.touches[0].clientX, e.touches[0].clientY); };
            const onTouchEnd  = () => {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend',  onTouchEnd);
                endCreatureDrag();
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup',   onMouseUp);
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend',  onTouchEnd);
        }

        creature.addEventListener('mousedown', (e) => { e.preventDefault(); startCreatureDrag(e.clientX, e.clientY); });

        // ── Touch: detect double-tap on touchstart to prevent drag on 2nd tap ──
        let lastTap = 0;
        creature.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const now = Date.now();
            if (now - lastTap < 300) {
                lastTap = 0;
                creature.dispatchEvent(new MouseEvent('dblclick'));
                return;
            }
            lastTap = now;
            startCreatureDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });

        // ── Sparkle trail ──
        const trailCols = ['#ff1493','#ff69b4','#cc0077','#bb44ff','#dd88ff'];
        setInterval(() => {
            const rect = creature.getBoundingClientRect();
            const s = document.createElement('div');
            s.className = 'creature-sparkle';
            s.style.left = (rect.left + rect.width/2 + (Math.random()-.5)*40) + 'px';
            s.style.top  = (rect.bottom - 10 - Math.random()*12) + 'px';
            s.style.background = trailCols[Math.floor(Math.random()*trailCols.length)];
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 900);
        }, 280);

        // ── Food: chonk & chaos ──
        const chonkMessages = [
            "Mmm, tasty!",
            "Getting bigger…",
            "I probably shouldn't have had that.",
            "TOO MUCH FOOD!!!",
        ];

        function setChonk(level) {
            creature.classList.remove('chonk-1','chonk-2','chonk-3');
            if (level > 0) creature.classList.add('chonk-' + level);
        }

        function respawnFood(foodEl) {
            foodEl.classList.remove('fc-eaten','fc-dragging');
            foodEl.style.position = '';
            foodEl.style.left  = '';
            foodEl.style.top   = '';
            foodEl.style.right = '';
            foodEl.style.bottom = '';
            // Re-enable so CSS handles position via #fcFoodN rules
        }

        function triggerChaos() {
            isChaos = true;
            creature.classList.add('chaos');
            setChonk(0);
            showMessage("TOO MUCH FOOD!!!");
            spawnSparkles(30);

            // Snap to current rendered pos before launching
            const cr = creature.getBoundingClientRect();
            const hr = hero.getBoundingClientRect();
            posX = cr.left - hr.left;
            posY = cr.top  - hr.top;
            creature.style.transform = 'none'; // cancel CSS translateX(50%) on mobile/tablet
            creature.style.left   = posX + 'px';
            creature.style.top    = posY + 'px';
            creature.style.right  = 'auto';
            creature.style.bottom = 'auto';

            cacheBounds();
            physicsStart = Date.now();
            vx = (Math.random() < 0.5 ? 1 : -1) * (16 + Math.random() * 10);
            vy = -(14 + Math.random() * 8);
            flying = true;
            creature.classList.add('flying');
            creature.classList.remove('bouncing');
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(physicsTick);

            // End chaos after 3.5s
            setTimeout(() => {
                isChaos = false;
                chonkLevel = 0;
                creature.classList.remove('chaos','flying');
                flying = false;
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

                showMessage("I need a lie down…");
                spawnSparkles(20);

                // Walk home from wherever chaos left the creature
                setTimeout(walkHome, 300);

                // Respawn all food after a beat
                setTimeout(() => {
                    document.querySelectorAll('.fc-food').forEach(f => respawnFood(f));
                }, 600);
            }, 3500);
        }

        function feedCreature(foodEl) {
            // Eat animation on creature
            creature.classList.remove('eating');
            void creature.offsetWidth;
            creature.classList.add('eating');
            setTimeout(() => creature.classList.remove('eating'), 600);

            // Food disappears
            foodEl.classList.add('fc-eaten');
            spawnSparkles(10);

            chonkLevel++;
            showMessage(chonkMessages[Math.min(chonkLevel - 1, chonkMessages.length - 1)]);

            if (chonkLevel > 3) {
                chonkLevel = 0;
                setTimeout(triggerChaos, 300);
            } else {
                setChonk(chonkLevel);
                // Respawn food back in its original CSS position
                setTimeout(() => respawnFood(foodEl), 1800);
            }
        }

        // ── Food drag logic ──
        function startFoodDrag(food, clientX, clientY) {
            if (isChaos) return;
            food.classList.add('fc-dragging');
            const startRect = food.getBoundingClientRect();
            const offX = clientX - startRect.left;
            const offY = clientY - startRect.top;

            // Switch to fixed so it can roam the full screen
            food.style.position = 'fixed';
            food.style.left   = startRect.left + 'px';
            food.style.top    = startRect.top  + 'px';
            food.style.right  = 'auto';
            food.style.bottom = 'auto';

            function checkAndDrop(cx, cy) {
                food.classList.remove('fc-dragging');
                const mouth = creature.querySelector('.creature-mouth');
                if (mouth) {
                    const mr  = mouth.getBoundingClientRect();
                    const mcx = mr.left + mr.width  / 2;
                    const mcy = mr.top  + mr.height / 2;
                    const dist = Math.hypot(cx - offX + startRect.width/2 - mcx,
                                            cy - offY + startRect.height/2 - mcy);
                    if (dist < 80) { feedCreature(food); return; }
                }
                respawnFood(food);
            }

            // Mouse
            const onMouseMove = (e) => {
                food.style.left = (e.clientX - offX) + 'px';
                food.style.top  = (e.clientY - offY) + 'px';
            };
            const onMouseUp = (e) => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup',  onMouseUp);
                checkAndDrop(e.clientX, e.clientY);
            };

            // Touch
            const onTouchMove = (e) => {
                e.preventDefault();
                const t = e.touches[0];
                food.style.left = (t.clientX - offX) + 'px';
                food.style.top  = (t.clientY - offY) + 'px';
            };
            const onTouchEnd = (e) => {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend',  onTouchEnd);
                const t = e.changedTouches[0];
                checkAndDrop(t.clientX, t.clientY);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup',  onMouseUp);
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend',  onTouchEnd);
        }

        document.querySelectorAll('.fc-food').forEach(food => {
            food.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                startFoodDrag(food, e.clientX, e.clientY);
            });
            food.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                startFoodDrag(food, e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: false });
        });
    })();


    // ── Category filter tags (badges section) ──
    document.querySelectorAll('.fb-cat-tag').forEach(tag => {
        tag.addEventListener('click', () => tag.classList.toggle('active'));
    });

    // ── Tag filter bar (toggle active) ──
    document.querySelectorAll('.fn-tagbar').forEach(bar => {
        bar.querySelectorAll('.fn-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                bar.querySelectorAll('.fn-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
            });
        });
    });

    // ── Pagination (toggle active page) ──
    document.querySelectorAll('.fn-pagination').forEach(pg => {
        pg.querySelectorAll('.fn-page:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.textContent === '‹' || btn.textContent === '›' || btn.textContent === '…') return;
                pg.querySelectorAll('.fn-page').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // ── Text Animations ──

    // Typewriter
    (function() {
        const el = document.getElementById('taTypewriter');
        if (!el) return;
        const phrases = ['Custom websites.', 'Built for you.', 'Designed to convert.'];
        let pi = 0, ci = 0, deleting = false;
        function tick() {
            const phrase = phrases[pi];
            if (!deleting) {
                el.textContent = phrase.slice(0, ++ci);
                if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
            } else {
                el.textContent = phrase.slice(0, --ci);
                if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
            }
            setTimeout(tick, deleting ? 55 : 95);
        }
        tick();
    })();

    // Bounce in — replay on loop
    (function() {
        const wrap = document.getElementById('taBounce');
        if (!wrap) return;
        function play() {
            wrap.classList.remove('playing');
            void wrap.offsetWidth;
            const spans = wrap.querySelectorAll('span');
            wrap.classList.add('playing');
            spans.forEach((s, i) => s.style.animationDelay = (i * 0.08) + 's');
        }
        play();
        setInterval(play, 3000);
    })();

    // Fade up + Slide in — IntersectionObserver
    (function() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('played'); });
        }, { threshold: 0.4 });
        ['taFadeUp', 'taSlide'].forEach(id => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
    })();

    // Word by word — replay on loop
    (function() {
        const wrap = document.getElementById('taWords');
        if (!wrap) return;
        function play() {
            wrap.classList.remove('playing');
            void wrap.offsetWidth;
            const spans = wrap.querySelectorAll('span');
            wrap.classList.add('playing');
            spans.forEach((s, i) => s.style.animationDelay = (i * 0.2) + 's');
        }
        play();
        setInterval(play, 3500);
    })();

    // Count up — trigger on scroll into view, then repeat every 1.75s while visible
    (function() {
        const counters = document.querySelectorAll('.ta-count');
        if (!counters.length) return;

        function runCounters() {
            counters.forEach(el => {
                const target = +el.dataset.target;
                let cur = 0;
                el.textContent = 0;
                const step = Math.ceil(target / 50);
                const t = setInterval(() => {
                    cur = Math.min(cur + step, target);
                    el.textContent = cur;
                    if (cur >= target) clearInterval(t);
                }, 30);
            });
        }

        let loopInterval = null;
        let ran = false;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!ran) { ran = true; runCounters(); }
                if (!loopInterval) {
                    loopInterval = setInterval(runCounters, 1750);
                }
            } else {
                clearInterval(loopInterval);
                loopInterval = null;
            }
        }, { threshold: 0.5 });

        const row = document.querySelector('.ta-counter-row');
        if (row) obs.observe(row);
    })();

// ── Cookie Banner ──
(function () {
    'use strict';

    var STORAGE_KEY = 'hb_cookie_consent';

    // Don't show the banner if the user has already made a choice
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Build the banner HTML
    var banner = document.createElement('div');
    banner.id = 'hb-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
        '<div class="hb-cookie-text">' +
            '<p>We use cookies to improve your experience and analyse site traffic. By clicking "Accept", you consent to our use of cookies. Read our <a href="privacy-policy.html">Privacy Policy</a> for more information.</p>' +
        '</div>' +
        '<div class="hb-cookie-actions">' +
            '<button class="hb-cookie-decline" id="hbCookieDecline">Decline</button>' +
            '<button class="hb-cookie-accept" id="hbCookieAccept">Accept</button>' +
        '</div>';

    document.body.appendChild(banner);

    // Slide in after a short delay
    setTimeout(function () {
        banner.classList.add('hb-cookie-visible');
    }, 600);

    function dismiss(choice) {
        localStorage.setItem(STORAGE_KEY, choice);
        banner.classList.remove('hb-cookie-visible');
        setTimeout(function () {
            if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 450);
    }

    document.getElementById('hbCookieAccept').addEventListener('click', function () {
        dismiss('accepted');
    });

    document.getElementById('hbCookieDecline').addEventListener('click', function () {
        dismiss('declined');
    });
})();
