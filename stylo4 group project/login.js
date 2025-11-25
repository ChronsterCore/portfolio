document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');

    // Check for a "Remember Me" user on page load
    const rememberedUser = localStorage.getItem('styloRememberedUser');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameOrEmail = usernameInput.value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // In a real app, you'd fetch this from a server.
        const users = JSON.parse(localStorage.getItem('styloUsers')) || [];

        const foundUser = users.find(user => 
            (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password
        );

        if (foundUser) {
            // Login successful
            alert('Login successful!');

            // Create a "session" for the active user
            localStorage.setItem('styloActiveUser', JSON.stringify(foundUser.username));

            // Handle "Remember Me"
            if (rememberMe) {
                localStorage.setItem('styloRememberedUser', foundUser.username);
            } else {
                localStorage.removeItem('styloRememberedUser');
            }

            // Redirect to the main app
            window.location.href = 'home.html';
        } else {
            // Login failed
            alert('Invalid username or password. Please try again.');
        }
    });
});