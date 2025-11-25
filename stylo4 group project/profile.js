document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const profilePicImg = document.getElementById('profile-pic');
    const profilePicInput = document.getElementById('profile-pic-input');
    const profileNameEl = document.getElementById('profile-name');
    const profileEmailEl = document.getElementById('profile-email');
    const logoutBtn = document.getElementById('logout-btn');
    const itemsCountEl = document.getElementById('items-count');
    const profileGalleryGrid = document.getElementById('profile-gallery-grid');

    // --- Load User Data ---
    // Get the active user's username from the "session"
    const activeUsername = JSON.parse(localStorage.getItem('styloActiveUser'));
    // Get all users to find the full profile
    let allUsers = JSON.parse(localStorage.getItem('styloUsers')) || [];
    // Find the full user object
    let currentUser = allUsers.find(user => user.username === activeUsername);

    if (!currentUser) {
        // This case should ideally not happen if auth check in main.js is working
        alert('Error: Could not find user data. Logging out.');
        localStorage.removeItem('styloActiveUser');
        window.location.href = 'login.html';
        return;
    }

    const updateProfileView = () => {
        profileNameEl.textContent = currentUser.username;
        profileEmailEl.textContent = currentUser.email;
        if (currentUser.profilePic) {
            profilePicImg.src = currentUser.profilePic;
        }
    };

    // --- Profile Picture Change Logic ---
    profilePicInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPicDataUrl = e.target.result;
                
                // Update the image on the page immediately
                profilePicImg.src = newPicDataUrl;

                // Update the user's data
                currentUser.profilePic = newPicDataUrl;

                // Find the index of the current user in the main array to update it
                const userIndex = allUsers.findIndex(user => user.username === activeUsername);
                if (userIndex !== -1) {
                    allUsers[userIndex] = currentUser;
                }

                // Save the entire updated user list back to localStorage
                localStorage.setItem('styloUsers', JSON.stringify(allUsers));
                alert('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Logout Logic ---
    logoutBtn.addEventListener('click', () => {
        // Clear the active user session
        localStorage.removeItem('styloActiveUser');
        alert('You have been logged out.');
        // Redirect to the login page
        window.location.href = 'login.html';
    });

    // --- Load Wardrobe Stats and Gallery ---
    const wardrobe = JSON.parse(localStorage.getItem('styloWardrobe')) || [];
    itemsCountEl.textContent = wardrobe.length;
    document.getElementById('outfits-count').textContent = '15'; 
    document.getElementById('wishlist-count').textContent = '12'; 
    
    if (wardrobe.length > 0) {
        wardrobe.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'profile-gallery-item';
            galleryItem.innerHTML = `<img src="${item.image}" alt="Uploaded clothing item">`;
            profileGalleryGrid.appendChild(galleryItem);
        });
    } else {
        profileGalleryGrid.innerHTML = `<p class="no-items-gallery">No items uploaded yet.</p>`;
    }

    // --- Initial Load ---
    updateProfileView();
});