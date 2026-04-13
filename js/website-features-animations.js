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

    // ── Modal ──
    function openModal(id)  { document.getElementById(id).classList.add('open'); }
    function closeModal(id) { document.getElementById(id).classList.remove('open'); }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.querySelectorAll('.fm-overlay.open').forEach(m => m.classList.remove('open'));
    });

    // ── Tab nav ──
    const tabLabels = ['Overview tab selected.','Features tab selected.','Pricing tab selected.','Contact tab selected.'];
    document.getElementById('demoTabs').addEventListener('click', e => {
        const btn = e.target.closest('.fn-tab');
        if (!btn) return;
        document.querySelectorAll('#demoTabs .fn-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tabContent').textContent = tabLabels[btn.dataset.tab];
    });

    // ── Pill nav ──
    document.getElementById('demoPills').addEventListener('click', e => {
        const btn = e.target.closest('.fn-pill');
        if (!btn) return;
        document.querySelectorAll('#demoPills .fn-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });

    // ── Tabbed carousel ──
    document.getElementById('demoTabCar').addEventListener('click', e => {
        const btn = e.target.closest('.fs-tab-btn');
        if (!btn) return;
        const panel = btn.dataset.panel;
        document.querySelectorAll('#demoTabCar .fs-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.fs-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === panel));
    });

    // ── Strip slider ──
    (function() {
        const inner = document.getElementById('demoStripInner');
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

    // ── Range slider ──
    const range = document.getElementById('budgetRange');
    const rangeVal = document.getElementById('rangeVal');
    if (range) {
        range.addEventListener('input', () => {
            rangeVal.textContent = '£' + Number(range.value).toLocaleString();
        });
    }

    // ── Lucide icons ──
    lucide.createIcons();

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