document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu, smooth scroll, and footer animations are handled by base.js

  // --- Parallax Effect for Hero Image (disabled on mobile) ---
  const heroImage = document.querySelector(".hero-image img");
  function applyParallax() {
    if (heroImage && window.innerWidth > 768) {
      const scrolled = window.pageYOffset;
      // Adjust multiplier for desired parallax intensity
      heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    } else if (heroImage) {
      heroImage.style.transform = `translateY(0px)`; // Reset on mobile
    }
  }

  if (heroImage) {
    window.addEventListener("scroll", applyParallax);
    applyParallax(); // Apply on load
  }


  // --- Newsletter Form Handling (if a newsletter form exists on this page,
  // ensure it has .newsletter-form, .newsletter-input, and .subscribe-btn classes) ---
  const newsletterForm = document.querySelector(".footer .newsletter-form"); //Scoped to footer
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector(".newsletter-input");
    const subscribeBtn = newsletterForm.querySelector(".subscribe-btn");

    if (emailInput && subscribeBtn) {
      function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
      }

      function handleSubscription(e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
          alert("Please enter your email address.");
          emailInput.focus();
          return;
        }
        if (!validateEmail(email)) {
          alert("Please enter a valid email address.");
          emailInput.focus();
          return;
        }

        const originalBtnText = subscribeBtn.textContent;
        subscribeBtn.textContent = "Subscribing...";
        subscribeBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
          alert(`Thank you for subscribing, ${email}!`);
          emailInput.value = ""; // Clear input
          subscribeBtn.textContent = originalBtnText;
          subscribeBtn.disabled = false;
        }, 1500);
      }

      subscribeBtn.addEventListener("click", handleSubscription);
      // Optional: Allow submit with Enter key on email input
      emailInput.addEventListener("keypress", function(e) {
          if (e.key === 'Enter') {
              handleSubscription(e);
          }
      });
    }
  }

  // Intersection Observer for section animations (if needed beyond footer)
  const sectionsToAnimate = document.querySelectorAll('.hero-section, .features-grid, .subscription-section');
  if (sectionsToAnimate.length > 0) {
      const sectionObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('visible'); // Add a class to trigger CSS animation
                  observer.unobserve(entry.target);
              }
          });
      }, { threshold: 0.15 });

      sectionsToAnimate.forEach(section => {
          sectionObserver.observe(section);
      });
  }
  // Add a CSS rule for .visible if you use this, e.g.:
  // .hero-section, .features-grid, .subscription-section { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
  // .hero-section.visible, .features-grid.visible, .subscription-section.visible { opacity: 1; transform: translateY(0); }

  console.log("Homepage 1 (Pre-login) JS Loaded");
});