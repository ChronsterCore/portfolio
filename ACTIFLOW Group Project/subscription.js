// subscription.js

document.addEventListener("DOMContentLoaded", () => {
    // Header interactions (mobile menu, notifications) are handled by base.js

    // DOM elements specific to subscription page content
    const planBtns = document.querySelectorAll('.plan-btn');
    const pricingCards = document.querySelectorAll('.pricing-card');

    // Plan button interactions
    planBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isProBtn = btn.classList.contains('pro-btn');
            const isFreeBtn = btn.classList.contains('free-btn');
            
            if (isProBtn) {
                handleProSubscription();
            } else if (isFreeBtn) {
                handleFreeSignup();
            }
            
            createRipple(e, btn);
        });
    });

    // Card hover effects with enhanced animations
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Lift effect for all cards
            if (!card.classList.contains('popular')) { // Popular card has its own transform
                 card.style.transform = 'translateY(-10px)';
            } else {
                 card.style.transform = 'translateY(-10px) scale(1.05)'; // Keep scale for popular
            }
           
            if (card.classList.contains('pro-card')) {
                card.style.boxShadow = '0 30px 60px rgba(79, 172, 254, 0.4), 0 0 50px rgba(0, 242, 254, 0.3)';
            } else if (card.classList.contains('free-card')) {
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('popular')) {
                card.style.transform = 'scale(1.05)'; // Maintain slight scale for popular
            } else {
                card.style.transform = 'translateY(0) scale(1)';
            }
            
            if (card.classList.contains('pro-card')) {
                card.style.boxShadow = '0 20px 40px rgba(0, 242, 254, 0.2)';
            } else if (card.classList.contains('free-card')) {
                card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }
        });
    });

    // Feature item animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target); // Animate only once
            }
        });
    };
    const featureObserver = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `all 0.6s ease ${index * 0.05}s`; // Faster stagger
        featureObserver.observe(item);
    });

    // Utility Functions
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Add ripple styles dynamically
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleEffect 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        element.appendChild(ripple);
        
        // Inject keyframes if not already present
        if (!document.getElementById('rippleKeyframes')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'rippleKeyframes';
            styleSheet.type = "text/css";
            styleSheet.innerText = `@keyframes rippleEffect { to { transform: scale(4); opacity: 0; } }`;
            document.head.appendChild(styleSheet);
        }
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function showPageNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.page-notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `page-notification notification-${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        else if (type === 'warning') iconClass = 'fa-exclamation-triangle';
        else if (type === 'error') iconClass = 'fa-times-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
                <button class="notification-close-btn" aria-label="Close notification">×</button>
            </div>
        `;
        
        // Apply styles for .page-notification (can be moved to subscription.css)
        notification.style.position = 'fixed';
        notification.style.top = '80px'; // Below header
        notification.style.right = '20px';
        notification.style.zIndex = '10001';
        notification.style.animation = 'slideInRight 0.3s ease';
        
        const content = notification.querySelector('.notification-content');
        content.style.background = 'white';
        content.style.padding = '1rem 1.5rem';
        content.style.borderRadius = '12px';
        content.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.gap = '1rem';
        content.style.minWidth = '300px';
        content.style.borderLeft = `4px solid ${getNotificationBorderColor(type)}`;

        notification.querySelector('.notification-close-btn').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        if (!document.getElementById('slideInRightKeyframes')) {
            const animStyleSheet = document.createElement("style");
            animStyleSheet.id = 'slideInRightKeyframes';
            animStyleSheet.innerText = `@keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }`;
            document.head.appendChild(animStyleSheet);
        }

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards'; // Assuming slideOutRight is defined
                 if (!document.getElementById('slideOutRightKeyframes')) {
                    const animStyleSheetOut = document.createElement("style");
                    animStyleSheetOut.id = 'slideOutRightKeyframes';
                    animStyleSheetOut.innerText = `@keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }`;
                    document.head.appendChild(animStyleSheetOut);
                }
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    function getNotificationBorderColor(type) {
        const colors = {
            info: '#4facfe', success: '#48bb78', warning: '#ed8936', error: '#f56565'
        };
        return colors[type] || colors.info;
    }
    
    let activeModal = null; // Track active modal

    function handleProSubscription() {
        const modalContent = `
            <div class="modal-content-inner">
                <div class="modal-icon upgrade-icon">
                    <i class="fas fa-star"></i>
                </div>
                <h3>Ready to unlock premium features?</h3>
                <p>Get personalized insights, advanced AI recommendations, and priority support for just IDR 150,000/month.</p>
                <div class="modal-actions">
                    <button class="btn-secondary modal-action-btn" data-action="close">Maybe Later</button>
                    <button class="btn-primary modal-action-btn" data-action="upgrade">Upgrade Now</button>
                </div>
            </div>
        `;
        activeModal = createModal('Upgrade to Pro', modalContent);
        document.body.appendChild(activeModal);
        activeModal.querySelector('[data-action="close"]').addEventListener('click', closeModal);
        activeModal.querySelector('[data-action="upgrade"]').addEventListener('click', processUpgrade);
    }

    function handleFreeSignup() {
        const modalContent = `
            <div class="modal-content-inner">
                <div class="modal-icon signup-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <h3>Welcome to ActiFlow!</h3>
                <p>Start your wellness journey today with our free plan. No credit card required.</p>
                <div class="signup-form">
                    <input type="email" placeholder="Enter your email address" class="email-input-modal">
                    <div class="modal-actions">
                        <button class="btn-secondary modal-action-btn" data-action="close">Cancel</button>
                        <button class="btn-primary modal-action-btn" data-action="signup">Create Account</button>
                    </div>
                </div>
            </div>
        `;
        activeModal = createModal('Get Started Free', modalContent);
        document.body.appendChild(activeModal);
        activeModal.querySelector('[data-action="close"]').addEventListener('click', closeModal);
        activeModal.querySelector('[data-action="signup"]').addEventListener('click', processSignup);
    }
    
    function createModal(title, contentHTML) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay-custom'; // Use a custom class to avoid conflicts
        modal.innerHTML = `
            <div class="modal-inner-custom">
                <div class="modal-header-custom">
                    <h2>${title}</h2>
                    <button class="modal-close-custom" aria-label="Close modal">×</button>
                </div>
                ${contentHTML}
            </div>
        `;
        
        // Add modal styles if not already present (scoped to these custom classes)
        if (!document.getElementById('custom-modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'custom-modal-styles';
            modalStyles.textContent = `
                .modal-overlay-custom { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeInModal 0.3s ease; }
                .modal-inner-custom { background: white; border-radius: 16px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; animation: slideUpModal 0.3s ease; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
                .modal-header-custom { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
                .modal-header-custom h2 { color: #2d3748; font-size: 1.3rem; font-weight: 600; }
                .modal-close-custom { background: none; border: none; font-size: 1.5rem; color: #718096; cursor: pointer; padding: 0.25rem; line-height: 1; }
                .modal-content-inner { padding: 1.5rem; text-align: center; }
                .modal-icon { width: 60px; height: 60px; margin: 0 auto 1rem; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; }
                .modal-content-inner h3 { color: #2d3748; font-size: 1.3rem; font-weight: 600; margin-bottom: 0.75rem; }
                .modal-content-inner p { color: #718096; line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.95rem; }
                .email-input-modal { width: calc(100% - 2rem); padding: 0.8rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; margin-bottom: 1.2rem; transition: border-color 0.3s ease; box-sizing: border-box;}
                .email-input-modal:focus { outline: none; border-color: #4facfe; }
                .modal-actions { display: flex; gap: 0.75rem; justify-content: center; }
                .modal-action-btn { padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; border: none; font-size: 0.9rem; }
                .modal-action-btn.btn-primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
                .modal-action-btn.btn-secondary { background: #f0f2f5; color: #4a5568; border: 1px solid #e2e8f0; }
                @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUpModal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(modalStyles);
        }
        
        modal.querySelector('.modal-close-custom').addEventListener('click', closeModal);
        return modal;
    }

    function closeModal() {
        if (activeModal) {
            activeModal.style.animation = 'fadeOutModal 0.3s ease forwards'; // Define fadeOutModal keyframes if needed
            if (!document.getElementById('fadeOutModalKeyframes')) {
                const animStyleSheetOut = document.createElement("style");
                animStyleSheetOut.id = 'fadeOutModalKeyframes';
                animStyleSheetOut.innerText = `@keyframes fadeOutModal { from { opacity: 1; } to { opacity: 0; } }`;
                document.head.appendChild(animStyleSheetOut);
            }
            setTimeout(() => {
                activeModal.remove();
                activeModal = null;
            }, 300);
        }
    }

    function processUpgrade() {
        closeModal();
        showPageNotification('Redirecting to payment gateway...', 'info');
        setTimeout(() => {
            showPageNotification('Upgrade successful! Welcome to Pro!', 'success');
            // Potentially update UI to reflect Pro status
            const navLogoText = document.querySelector('.logo-text');
            if (navLogoText && !navLogoText.textContent.includes('Pro')) {
                 navLogoText.textContent += ' Pro';
            }
        }, 2000);
    }

    function processSignup() {
        const emailInput = activeModal ? activeModal.querySelector('.email-input-modal') : null;
        const email = emailInput ? emailInput.value.trim() : '';
        
        if (!email) {
            showPageNotification('Please enter your email address', 'warning');
            return;
        }
        if (!isValidEmail(email)) {
            showPageNotification('Please enter a valid email address', 'error');
            return;
        }
        
        closeModal();
        showPageNotification('Creating your account...', 'info');
        setTimeout(() => {
            showPageNotification('Account created! Check your email to verify.', 'success');
            // This would typically redirect or update login state
        }, 2000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Animate pricing numbers on load
    function animatePricing() {
        const amounts = document.querySelectorAll('.amount');
        amounts.forEach(amountEl => {
            const finalValueText = amountEl.textContent;
            const isIDR = amountEl.parentElement.querySelector('.currency').textContent === 'IDR';
            const finalValue = parseInt(finalValueText.replace(/,/g, ''));
            
            let currentValue = 0;
            const duration = 1500; // Animation duration in ms
            const frameDuration = 1000 / 60; // 60 FPS
            const totalFrames = Math.round(duration / frameDuration);
            const increment = finalValue / totalFrames;

            let currentFrame = 0;
            const timer = setInterval(() => {
                currentValue += increment;
                currentFrame++;

                if (currentFrame >= totalFrames) {
                    amountEl.textContent = isIDR ? finalValue.toLocaleString('id-ID') : finalValue.toString();
                    clearInterval(timer);
                } else {
                    amountEl.textContent = isIDR ? Math.floor(currentValue).toLocaleString('id-ID') : Math.floor(currentValue).toString();
                }
            }, frameDuration);
        });
    }
    
    // Initial animations for cards and pricing
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        // Keep transition in CSS for hover, use JS for initial load animation
        setTimeout(() => {
            card.style.transition = `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s ease-out ${index * 0.15}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100); // Delay before starting animation
    });
    
    setTimeout(() => {
        animatePricing();
    }, 600); // Delay pricing animation until cards are visible
    

    // Add parallax effect to floating elements
    const floatingElements = document.querySelectorAll('.floating-circle');
    if (floatingElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            floatingElements.forEach((element, index) => {
                // Adjust speed and rotation factor for subtle effect
                const speed = (index + 1) * 0.05 + 0.05; 
                const rotationFactor = 0.02;
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * rotationFactor}deg)`;
            });
        });
    }
    
    // Keyboard shortcuts for accessibility (ESC to close modal)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    console.log("Subscription Page JS Loaded");
});