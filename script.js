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

    // ================= CONTACT US MODAL LOGIC =================
    const contactBtn = document.getElementById('contactBtn');
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

                // Show success state
                submitBtn.innerHTML = '<span>Sent Successfully! <i class="fa-solid fa-check"></i></span>';
                submitBtn.style.background = '#4CAF50';
                submitBtn.style.color = '#fff';

                // Automatically close modal after success
                setTimeout(() => {
                    closeModal();

                    // Reset button styling after modal closes
                    setTimeout(() => {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                    }, 400);
                }, 1500);
            }
        });
    }
});
