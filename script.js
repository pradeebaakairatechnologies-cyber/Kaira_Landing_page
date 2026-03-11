document.addEventListener("DOMContentLoaded", (event) => {
    // Register ScrollTrigger

    gsap.registerPlugin(ScrollTrigger);

    const stackCards = gsap.utils.toArray('.service-stack-card');

    stackCards.forEach((card, i) => {
        // Find the inner content
        const inner = card.querySelector('.ssc-inner');

        // We only animate if there's a card after this one
        if (i < stackCards.length - 1) {
            gsap.to(inner, {
                scale: 0.9,
                opacity: 0.5,
                scrollTrigger: {
                    trigger: stackCards[i + 1], // The next card
                    start: "top 80%", // When the next card reaches 80% from top
                    end: "top 30%", // When the next card reaches 30% from top
                    scrub: true,
                }
            });
        }
    });

    // ================= HERO BUBBLES PARALLAX EFFECT =================
    const heroSection = document.querySelector('.hero-section');
    const bubbles = document.querySelectorAll('.hero-bubbles .bubble');

    if (heroSection && bubbles.length > 0) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Calculate distance from center (normalized between -1 and 1)
            const moveX = (clientX - centerX) / centerX;
            const moveY = (clientY - centerY) / centerY;

            bubbles.forEach((bubble, index) => {
                // Different movement speeds for different bubbles to create depth
                const speed = (index % 3 + 1) * 15; 
                
                const x = moveX * speed;
                const y = moveY * speed;

                // Apply translation, ensuring we don't override the CSS animations
                // by using a transform variable or applying it to a wrapper
                // Since they have varying CSS animations for floating, 
                // we'll apply this as a secondary transform via CSS variables
                bubble.style.setProperty('--mouse-x', `${x}px`);
                bubble.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            bubbles.forEach(bubble => {
                bubble.style.setProperty('--mouse-x', '0px');
                bubble.style.setProperty('--mouse-y', '0px');
            });
        });
    }

    // ================= CONTACT US MODAL LOGIC =================
    const contactBtn = document.getElementById('contactBtn');
    const heroContactBtn = document.getElementById('heroContactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeContactModal = document.getElementById('closeContactModal');
    const contactForm = document.getElementById('contactForm');

    // Open Modal
    if (contactBtn && contactModal) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling on body
        });
    }

    // Open Modal from Hero Button
    if (heroContactBtn && contactModal) {
        heroContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Modal Function
    const closeModal = () => {
        if (contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling

            // Allow exit transition to finish before resetting form
            setTimeout(() => {
                if (contactForm) {
                    contactForm.reset();
                    // Remove validation styling
                    const inputs = contactForm.querySelectorAll('.form-control');
                    inputs.forEach(input => input.classList.remove('is-invalid'));
                }
            }, 400);
        }
    };

    // Close on X button click
    if (closeContactModal) {
        closeContactModal.addEventListener('click', closeModal);
    }

    // Close on clicking outside the modal
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }

    // Form Validation and Submit
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const inputs = contactForm.querySelectorAll('[required]');

            inputs.forEach(input => {
                const value = input.value.trim();
                let inputValid = true;

                if (!value) {
                    inputValid = false;
                } else if (input.type === 'email') {
                    // Simple email regex
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) inputValid = false;
                } else if (input.pattern) {
                    // Test against pattern
                    const patternRegex = new RegExp('^' + input.pattern + '$');
                    if (!patternRegex.test(value)) inputValid = false;
                }

                if (!inputValid) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }

                // Clear validation styling when user types
                input.addEventListener('input', () => {
                    input.classList.remove('is-invalid');
                }, { once: true });
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('.btn-submit-contact');
                const originalContent = submitBtn.innerHTML;

                // Show loading state
                submitBtn.innerHTML = '<span>Sending... <i class="fa-solid fa-spinner fa-spin"></i></span>';
                submitBtn.style.opacity = '0.8';
                submitBtn.disabled = true;

                // Collect data
                const formData = {
                    name: document.getElementById('contactName').value,
                    email: document.getElementById('contactEmail').value,
                    phone: document.getElementById('contactPhone').value,
                    comment: document.getElementById('contactComment').value
                };

                // Google Apps Script Web App URL
                const scriptURL = 'https://script.google.com/macros/s/AKfycbwMlD6cqMtbvRKa5Ft7aPKaCX14su5xb9bQeR7fcanxXxOgPqDvZ1vpH9Cqi7Zyuvbt/exec';

                fetch(scriptURL, {
                    method: 'POST',
                    mode: 'no-cors', // standard for Google Forms/Scripts to avoid CORS issues on client side
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    // Show success state
                    submitBtn.innerHTML = '<span>Sent Successfully! <i class="fa-solid fa-check"></i></span>';
                    submitBtn.style.background = '#4CAF50';
                    submitBtn.style.color = '#fff';
                    submitBtn.style.opacity = '1';

                    // Automatically close modal after success
                    setTimeout(() => {
                        closeModal();

                        // Reset button styling after modal closes
                        setTimeout(() => {
                            submitBtn.innerHTML = originalContent;
                            submitBtn.style.background = '';
                            submitBtn.style.color = '';
                            submitBtn.disabled = false;
                        }, 400);
                    }, 1500);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerHTML = '<span>Error! Try Again</span>';
                    submitBtn.style.background = '#f44336';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }, 3000);
                });
            }
        });
    }
});
