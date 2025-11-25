document.addEventListener('DOMContentLoaded', () => {
    // Smooth page load animation
    window.setTimeout(() => {
        if(document.body) document.body.style.opacity = '1';
    }, 100);

    // --- Mobile Navigation Elements ---
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const overlayMenu = document.getElementById("overlayMenu");
    const overlayHamburgerCloseBtn = document.getElementById("overlayHamburgerCloseBtn");
    const body = document.body; // Ensure body element is correctly targeted
    const overlayNotificationTriggerBtn = document.getElementById("overlayNotificationTriggerBtn");
    
    // --- Notification System Elements (shared across pages) ---
    const headerNotificationBtn = document.getElementById('notificationBtn'); // Main header bell
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const markAllReadBtn = document.getElementById('markAllRead');
    const notificationList = notificationDropdown ? notificationDropdown.querySelector(".notification-list") : null;
    
    let notificationCount = 0;
    if (notificationList) {
        notificationCount = notificationList.querySelectorAll(".notification-item.unread").length;
    } else if (notificationBadge && notificationBadge.textContent.trim() !== "" && !isNaN(parseInt(notificationBadge.textContent))) {
        // Fallback if list not queryable but badge has a number
        notificationCount = parseInt(notificationBadge.textContent);
    }


    function updateNotificationBadgeDisplay() {
        if (notificationBadge) {
            if (notificationCount <= 0) {
                notificationBadge.style.display = 'none';
            } else {
                notificationBadge.style.display = 'flex';
                notificationBadge.textContent = notificationCount;
            }
        }
    }
    updateNotificationBadgeDisplay();

    function toggleNotificationDropdown(show) {
        if (notificationDropdown) {
            if (show) {
                notificationDropdown.classList.add('show');
                // Activate main bell only if it's the one being used (visible)
                if (headerNotificationBtn && window.getComputedStyle(headerNotificationBtn).display !== 'none') { 
                    headerNotificationBtn.classList.add('active');
                }
                 // Deactivate overlay bell if it was used to trigger
                if (overlayNotificationTriggerBtn && overlayNotificationTriggerBtn.classList.contains('active')) {
                    overlayNotificationTriggerBtn.classList.remove('active');
                }
            } else {
                notificationDropdown.classList.remove('show');
                if (headerNotificationBtn) {
                    headerNotificationBtn.classList.remove('active');
                }
                if (overlayNotificationTriggerBtn) {
                    overlayNotificationTriggerBtn.classList.remove('active');
                }
            }
        }
    }
    
    // Click on main header notification button
    if (headerNotificationBtn) { 
        headerNotificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // If overlay is open, close it.
            if (overlayMenu && overlayMenu.classList.contains("active")) {
                toggleOverlay(false, true); // Close overlay, skip main hamburger animation
                if (hamburgerMenu) hamburgerMenu.classList.remove("active"); // Reset main hamburger
            }
            const isShowing = notificationDropdown ? notificationDropdown.classList.contains('show') : false;
            toggleNotificationDropdown(!isShowing);
        });
    }
    
    // Close dropdown on outside click
    document.addEventListener('click', function(e) { 
        if (notificationDropdown && notificationDropdown.classList.contains('show')) {
            const isClickInsideHeaderBtn = headerNotificationBtn && headerNotificationBtn.contains(e.target);
            const isClickInsideOverlayTrigger = overlayNotificationTriggerBtn && overlayNotificationTriggerBtn.contains(e.target);
            const isClickInsideDropdown = notificationDropdown.contains(e.target);

            if (!isClickInsideHeaderBtn && !isClickInsideOverlayTrigger && !isClickInsideDropdown) {
                toggleNotificationDropdown(false);
            }
        }
    });
    
    function updateNotificationCount(change) {
        notificationCount += change;
        if (notificationCount < 0) notificationCount = 0;
        updateNotificationBadgeDisplay();
    }
    
    if (notificationList) {
        notificationList.addEventListener('click', function(e) {
            const item = e.target.closest('.notification-item');
            if (item && item.classList.contains('unread')) {
                item.classList.remove('unread'); item.classList.add('read');
                const dot = item.querySelector('.notification-dot');
                if (dot) dot.style.display = 'none';
                updateNotificationCount(-1);
                // Optional animation
                item.style.transform = 'translateX(5px)';
                setTimeout(() => { item.style.transform = 'translateX(0)'; }, 200);
            }
        });
    }

    if (markAllReadBtn && notificationList) {
        markAllReadBtn.addEventListener('click', function() {
            const unreadNotifications = notificationList.querySelectorAll('.notification-item.unread');
            unreadNotifications.forEach(item => {
                item.classList.remove('unread'); item.classList.add('read');
                const dot = item.querySelector('.notification-dot');
                if (dot) dot.style.display = 'none';
            });
            updateNotificationCount(-unreadNotifications.length); // Subtract the count of items made read
            this.textContent = 'All marked as read!'; this.style.color = '#666';
            setTimeout(() => { this.textContent = 'Mark all as read'; this.style.color = '#4ade80'; }, 2000);
        });
    }
    
    if (notificationDropdown) {
        const viewAllBtnInDropdown = notificationDropdown.querySelector(".notification-footer .view-all-btn");
        if (viewAllBtnInDropdown) {
            viewAllBtnInDropdown.addEventListener('click', function() {
                // In a real app, this would navigate to a full notifications page
                alert('Redirecting to full notifications page...');
                toggleNotificationDropdown(false);
            });
        }
    }

    // --- Mobile Navigation Logic ---
    function toggleOverlay(isOpen, skipMainHamburgerAnimation = false) {
        if (!overlayMenu || !body) return;
        const isCurrentlyOpen = overlayMenu.classList.contains("active");
        const openAction = typeof isOpen === "boolean" ? isOpen : !isCurrentlyOpen;

        if (openAction) {
            // If opening overlay, ensure notification dropdown is closed
            if (notificationDropdown && notificationDropdown.classList.contains('show')) {
                toggleNotificationDropdown(false);
            }

            if (!skipMainHamburgerAnimation && hamburgerMenu) {
                hamburgerMenu.classList.add("active");
                hamburgerMenu.setAttribute("aria-expanded", "true");
            }
            if (overlayHamburgerCloseBtn) overlayHamburgerCloseBtn.setAttribute("aria-expanded", "true");
            overlayMenu.classList.add("active");
            overlayMenu.setAttribute("aria-hidden", "false");
            body.style.overflow = "hidden"; // Prevent scrolling of body content
        } else {
            if (!skipMainHamburgerAnimation && hamburgerMenu) {
                hamburgerMenu.classList.remove("active");
                hamburgerMenu.setAttribute("aria-expanded", "false");
            }
            if (overlayHamburgerCloseBtn) overlayHamburgerCloseBtn.setAttribute("aria-expanded", "false");
            overlayMenu.classList.remove("active");
            overlayMenu.setAttribute("aria-hidden", "true");
            body.style.overflow = ""; // Restore scrolling
        }
    }

    if (hamburgerMenu && overlayMenu && overlayHamburgerCloseBtn) {
        hamburgerMenu.addEventListener("click", function () {
            // If notification dropdown is open, close it before opening overlay
            if (notificationDropdown && notificationDropdown.classList.contains('show')) {
                toggleNotificationDropdown(false);
            }
            toggleOverlay();
        });
        overlayHamburgerCloseBtn.addEventListener("click", function () {
            toggleOverlay(false); 
        });
        overlayMenu.addEventListener("click", function (e) {
            // Close overlay if click is on the overlay background itself
            if (e.target === overlayMenu) { 
                toggleOverlay(false); 
            }
        });
    }

    // Event for bell icon inside overlay
    if (overlayNotificationTriggerBtn) { 
        overlayNotificationTriggerBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            // Close overlay menu first
            toggleOverlay(false, true); // Close overlay, skip main hamburger animation
            if (hamburgerMenu) hamburgerMenu.classList.remove("active"); // Ensure main hamburger icon is reset

            // Then, after a short delay to allow overlay to close, open notification dropdown
            setTimeout(() => { 
                toggleNotificationDropdown(true); 
            }, 50); // Small delay might be needed for smooth transition
        });
    }
    
    // Smooth scroll for anchor links (if any page uses them)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Make sure it's not just a placeholder "#"
            if (hrefAttribute.length > 1) { 
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Footer animations (if elements with these classes exist)
    const animatedFooterItems = document.querySelectorAll('.footer .fade-in');
    if (animatedFooterItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1 });

        animatedFooterItems.forEach(item => {
            item.style.animationPlayState = 'paused'; // Start paused
            observer.observe(item);
        });
    }
});