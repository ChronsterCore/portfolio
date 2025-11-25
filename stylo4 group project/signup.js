document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Basic Validation
        if (!email || !username || !password || !confirmPassword) {
            alert('Please fill out all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Get existing users from localStorage or initialize an empty array
        const users = JSON.parse(localStorage.getItem('styloUsers')) || [];

        // Check if username or email already exists
        const userExists = users.some(user => user.username === username || user.email === email);
        if (userExists) {
            alert('Username or email already exists. Please choose another.');
            return;
        }

        // Create new user object
        const newUser = {
            email: email,
            username: username,
            password: password, // In a real app, you would HASH this password!
            profilePic: 'https://i.pravatar.cc/150?u=niana' // Default profile pic
        };

        // Add new user to the array
        users.push(newUser);

        // Save the updated users array back to localStorage
        localStorage.setItem('styloUsers', JSON.stringify(users));

        alert('Account created successfully! Please log in to continue.');

        // Redirect to login page
        window.location.href = 'login.html';
    });
});