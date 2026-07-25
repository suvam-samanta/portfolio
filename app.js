document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME MANAGEMENT (DARK / LIGHT)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Retrieve active theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* ==========================================================================
       STICKY HEADER SCROLL EFFECT & ACTIVE NAVIGATION INDICATOR
       ========================================================================== */
    const header = document.querySelector('.main-header');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header class addition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav item highlight on scroll
        let currentActiveSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentActiveSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       MOBILE RESPONSIVE HAMBURGER NAVIGATION
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking navigation links
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    /* ==========================================================================
       HERO TYPING TYPEWRITER EFFECT
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter-text');
    const phrases = [
        "Creative Full-Stack Developer",
        "UI/UX Design Architect",
        "Performance Optimization Specialist",
        "Problem Solver"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTypewriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting goes faster
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle typing state shifts
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(handleTypewriter, typingSpeed);
    }

    // Initiate typewriter effect
    setTimeout(handleTypewriter, 1000);

    /* ==========================================================================
       SCROLL-TRIGGERED FADE-IN-UP OBSERVER
       ========================================================================== */
    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once triggered
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    // Observe fade-in components
    document.querySelectorAll('.fade-in-up').forEach(elem => {
        scrollRevealObserver.observe(elem);
    });

    /* ==========================================================================
       SKILL SECTION FILTER AND ANIMATION
       ========================================================================== */
    const skillFilterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            skillFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    // Retrigger progress bar animation
                    const progress = card.querySelector('.skill-progress-bar');
                    const targetWidth = progress.style.width;
                    progress.style.width = '0%';
                    setTimeout(() => {
                        progress.style.width = targetWidth;
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       PROJECT FILTER MECHANISM
       ========================================================================== */
    const projectFilterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            projectFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Hide or show with simple scaling animation trigger
                if (filter === 'all' || cardCategory === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'none';
                    // Trigger reflow
                    void card.offsetWidth;
                    card.style.animation = 'card-appear 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       PROJECT DETAILS MODAL MANAGEMENT
       ========================================================================== */
    const projectData = {
        'project-saas': {
            title: 'Quantum Analytics SaaS',
            category: 'Full-Stack SaaS',
            image: 'assets/project_saas.png',
            tags: ['React', 'Node.js', 'Postgres', 'D3.js', 'WebSockets'],
            desc: 'Quantum Analytics is a complete cloud-native infrastructure monitoring dashboard. It digests raw telemetry streams, performs aggregations, and updates the user interface in real-time. Features include custom metrics charting, dynamic alerting, and historical query analysis.',
            features: [
                'Engineered real-time socket connections with automated reconnect protocols.',
                'Designed customized responsive D3 line and radial charts using CSS custom parameters.',
                'Crafted automated alerts configured with dynamic query triggers on telemetry logs.',
                'Refactored SQL queries, reducing analytical computation time by 45%.'
            ],
            demo: '#',
            code: '#'
        },
        'project-ai': {
            title: 'NeuroCodex AI Assistant',
            category: 'Artificial Intelligence',
            image: 'assets/project_ai.png',
            tags: ['Python', 'FastAPI', 'Tailwind CSS', 'OpenAI API', 'Vector DB'],
            desc: 'NeuroCodex is an intelligent coding assistant tool. Operating as a clean browser companion, it indexes workspace files locally, allows context-aware chat, writes optimized code blocks, and runs complex semantic queries utilizing localized embeddings.',
            features: [
                'Constructed semantic index pipeline using vectorized sentence embedding databases.',
                'Implemented streaming response channels using server-sent events (SSE).',
                'Built responsive, glassmorphic code visualizers with copy and editing integrations.',
                'Integrated security filter levels preventing prompt injections or key leaks.'
            ],
            demo: '#',
            code: '#'
        },
        'project-crypto': {
            title: 'AetherMarket Web3 Platform',
            category: 'Web3 & Creative UI',
            image: 'assets/project_crypto.png',
            tags: ['Solidity', 'Ethers.js', 'CSS Grid', 'Framer Motion', 'Web3Modal'],
            desc: 'AetherMarket is a decentralized bidding platform built to showcase interactive graphics, transparent blockchain bidding logs, and responsive layout structures. Uses web hooks to track smart contract auction events.',
            features: [
                'Programmed gas-optimized Solidity smart contracts for decentralized auction handling.',
                'Designed fluid glassmorphism interface displaying neon gradient animations on state shifts.',
                'Integrated multiple Web3 wallet options utilizing standard library tools.',
                'Configured clean theme structures that dynamically match local UI layout tokens.'
            ],
            demo: '#',
            code: '#'
        }
    };

    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-project-img');
    const modalCategory = document.getElementById('modal-project-category');
    const modalTitle = document.getElementById('modal-project-title');
    const modalTags = document.getElementById('modal-project-tags');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalFeaturesList = document.getElementById('modal-project-features');
    const modalDemoBtn = document.getElementById('modal-demo-link');
    const modalCodeBtn = document.getElementById('modal-code-link');

    // Open Modal function
    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        // Populate Modal Fields
        modalImg.src = data.image;
        modalImg.alt = `${data.title} Visual Preview`;
        modalCategory.textContent = data.category;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalDemoBtn.href = data.demo;
        modalCodeBtn.href = data.code;

        // Populate Tags
        modalTags.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            modalTags.appendChild(span);
        });

        // Populate Key Achievements
        modalFeaturesList.innerHTML = '';
        data.features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            modalFeaturesList.appendChild(li);
        });

        // Open Overlay
        modalOverlay.classList.add('open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    // Close Modal function
    function closeModal() {
        modalOverlay.classList.remove('open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock background scrolling
    }

    // Attach Event Handlers to Project Cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('id');
            openModal(projectId);
        });
    });

    // Close Modal via button click
    modalCloseBtn.addEventListener('click', closeModal);

    // Close Modal via clicking outside container
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close Modal via Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
            closeModal();
        }
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUCCESS FEEDBACK MICRO-ANIMATION
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('#submit-btn');
        const originalBtnContent = submitBtn.innerHTML;

        // Visual loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending Message...</span>
            <svg class="btn-icon rotating-loader" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: rotate-loader 1s linear infinite;">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
        `;

        // Inject loader animation CSS rules temporarily if not present
        if (!document.getElementById('loader-style')) {
            const style = document.createElement('style');
            style.id = 'loader-style';
            style.innerHTML = `
                @keyframes rotate-loader {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Transform form into dynamic success message state
            contactForm.classList.add('fade-out');
            
            setTimeout(() => {
                contactForm.innerHTML = `
                    <div class="contact-success-state">
                        <div class="success-icon-ring">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3>Message Transmitted!</h3>
                        <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
                    </div>
                `;
            }, 300);

        }, 1500);
    });

    /* ==========================================================================
       SCROLL TO TOP SCROLL VISIBILITY AND CLICK TRIGGER
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
