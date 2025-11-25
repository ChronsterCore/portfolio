// main.js - Shared script for all pages

document.addEventListener('DOMContentLoaded', () => {
    // --- Universal Authentication Check ---
    // This is the gatekeeper for all protected pages.
    const activeUser = localStorage.getItem('styloActiveUser');
    if (!activeUser) {
        // If no user is logged in, redirect to the login page.
        // This line prevents unauthorized access to the app's main pages.
        window.location.href = 'login.html';
        return; // Stop further execution of the script
    }


    // --- Universal Greeting ---
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) {
        // We know activeUser is a string (the username), so we can use it directly.
        const username = JSON.parse(activeUser);
        greetingEl.textContent = `${username}, let's turn heads today!`;
    }

    // --- Universal Time Display ---
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        function updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}`;
        }
        updateTime();
        setInterval(updateTime, 1000 * 60);
    }

    // --- Universal Notification Panel Logic ---
    const notificationBtn = document.getElementById('notification-bell-btn');
    const notificationPanel = document.getElementById('notification-panel');

    if (notificationBtn && notificationPanel) {
        notificationBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the 'click outside' from firing immediately
            notificationPanel.classList.toggle('show');
        });

        // Close panel if clicking outside of it
        document.addEventListener('click', (event) => {
            if (!notificationPanel.contains(event.target) && !notificationBtn.contains(event.target)) {
                notificationPanel.classList.remove('show');
            }
        });
    }
});