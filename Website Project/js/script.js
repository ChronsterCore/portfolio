document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            if (mainNav.classList.contains('active')) {
                mobileNavToggle.innerHTML = '×'; 
                mobileNavToggle.setAttribute('aria-label', 'Close navigation');
            } else {
                mobileNavToggle.innerHTML = '☰'; 
                mobileNavToggle.setAttribute('aria-label', 'Open navigation');
            }
        });
    }

    // Product Detail Page add and minus Selector
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    if (quantityInput && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }

     // Product Detail Page Notifications
    const addToCartBtn = document.getElementById('addToCartBtn');
    const orderNowBtn = document.getElementById('orderNowBtn');
    const notificationArea = document.getElementById('product-notification-area');
    const notificationMessage = document.getElementById('product-notification-message');
    
    // Show Notification
    let notificationTimeout;
    function showProductNotification(message, type = 'success', duration = 3000) {
        if (!notificationArea || !notificationMessage) return;

        clearTimeout(notificationTimeout);

        notificationMessage.textContent = message;
        notificationArea.className = 'product-notification-area';
        notificationArea.classList.add(type);
        
        notificationArea.style.display = 'block';
        setTimeout(() => {
            notificationArea.classList.add('show');
        }, 10); 


        notificationTimeout = setTimeout(() => {
            notificationArea.classList.remove('show');
            setTimeout(() => {
                notificationArea.style.display = 'none';
            }, 500);
        }, duration);
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-info h1')?.textContent || "Product";
            const quantity = quantityInput?.value || 1;
            const message = `${quantity} x ${productName} added to cart!`;
            showProductNotification(message, 'success');
        });
        
        
    }

    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-info h1')?.textContent || "Product";
            const quantity = quantityInput?.value || 1;
            const message = `Order for ${quantity} x ${productName} confirmed! Proceeding to checkout...`;
            showProductNotification(message, 'info', 4000);
        });
    }

    // Event Page Form Validation
    const eventForm = document.getElementById('eventRegistrationForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            let isValid = true;
            clearErrors();
            
            // Email Validation
            const email = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            if (email.value.trim() === '') {
                isValid = false;
                emailError.textContent = 'Email address is required.';
            } else if (!isValidEmail(email.value.trim())) {
                isValid = false;
                emailError.textContent = 'Please enter a valid email address (e.g., name@domain.com).';
            }

            // Full Name Validation
            const fullName = document.getElementById('fullName');
            const fullNameError = document.getElementById('fullNameError');
            if (fullName.value.trim() === '') {
                isValid = false;
                fullNameError.textContent = 'Full name is required.';
            } else if (fullName.value.trim().length < 3) {
                isValid = false;
                fullNameError.textContent = 'Full name must be at least 3 characters long.';
            }

            // Birth Date Validation
            const birthDate = document.getElementById('birthDate');
            const birthDateError = document.getElementById('birthDateError');
            if (birthDate.value === '') {
                isValid = false;
                birthDateError.textContent = 'Birth date is required.';
            } else {
                const today = new Date();
                const inputDate = new Date(birthDate.value);
                today.setHours(0, 0, 0, 0);
                inputDate.setHours(0,0,0,0);

                if (inputDate >= today) {
                    isValid = false;
                    birthDateError.textContent = 'Birth date cannot be today or a future date.';
                }
                const minAge = 18;
                let age = today.getFullYear() - inputDate.getFullYear();
                const monthDiff = today.getMonth() - inputDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
                    age--;
                }
                if (age < minAge) {
                    isValid = false;
                    birthDateError.textContent = `You must be at least ${minAge} years old.`;
                }
            }

            // Gender Validation
            const gender = document.getElementById('gender');
            const genderError = document.getElementById('genderError');
            if (gender.value === '') {
                isValid = false;
                genderError.textContent = 'Please select your gender.';
            }

            // Terms and Conditions Validation
            const terms = document.getElementById('terms');
            const termsError = document.getElementById('termsError');
            if (!terms.checked) {
                isValid = false;
                termsError.textContent = 'You must agree to the terms and conditions.';
            }

            // Portfolio Link Validation
            const portfolioLink = document.getElementById('portfolioLink');
            const portfolioLinkError = document.getElementById('portfolioLinkError');
            if (portfolioLink && portfolioLink.value.trim() !== '' && !isValidUrl(portfolioLink.value.trim())) {
                isValid = false;
                if (portfolioLinkError) portfolioLinkError.textContent = 'Please enter a valid URL (e.g., https://example.com).';
            }


            const successMessage = document.getElementById('formSuccessMessage');
            if (isValid) {
                eventForm.style.display = 'none'; 
                successMessage.style.display = 'block';
                successMessage.textContent = `Thank you, ${fullName.value.trim()}! Your application has been received.`;
            } else {
                 successMessage.style.display = 'none';
            }
        });
    }

    function isValidEmail(email) {
        const atSymbolIndex = email.indexOf('@');
        const dotSymbolIndex = email.lastIndexOf('.');
        return (
            atSymbolIndex > 0 &&
            dotSymbolIndex > atSymbolIndex + 1 &&
            dotSymbolIndex < email.length - 1
        );
    }

    function isValidUrl(string) {
        if (string.indexOf("http://") === 0 || string.indexOf("https://") === 0) {
            return string.length > (string.indexOf("http://") === 0 ? 7 : 8);
        }
        return false;
    }
    
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
    }
});