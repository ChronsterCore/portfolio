document.addEventListener("DOMContentLoaded", function () {
  // Mobile Nav, Notifications, Footer animations are handled by base.js

  const profileForm = document.getElementById("profileForm");
  const profileNameDisplay = document.getElementById("profileNameDisplay");
  const profileEmailDisplay = document.getElementById("profileEmailDisplay");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email"); // Assuming email might be displayed or pre-filled
  
  const avatarImage = document.getElementById("avatarImage");
  const changePictureBtn = document.getElementById("changePictureBtn");
  const removePhotoBtn = document.getElementById("removePhotoBtn");
  const fileInput = document.getElementById("fileInput");

  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let originalFormValues = {}; // To store initial form values for cancellation

  // --- Helper: Show Notification ---
  function showUINotification(message, type = "info") { // 'success', 'error', 'info'
    const notificationId = 'ui-notification-' + Date.now();
    const notification = document.createElement("div");
    notification.id = notificationId;
    notification.className = `ui-notification ${type}`; // Added base class and type class
    notification.textContent = message;
    
    // Basic styling (can be enhanced in CSS)
    notification.style.cssText = `
        position: fixed;
        top: 70px; /* Below header */
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 0.9rem;
        z-index: 2000; /* High z-index */
        box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateX(100%);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    if (type === "success") notification.style.backgroundColor = "#28a745"; // Green
    else if (type === "error") notification.style.backgroundColor = "#dc3545"; // Red
    else notification.style.backgroundColor = "#17a2b8"; // Blue for info

    document.body.appendChild(notification);

    setTimeout(() => { // Trigger animation
        notification.style.opacity = "1";
        notification.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => { // Auto-dismiss
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
            const stillExists = document.getElementById(notificationId);
            if (stillExists) stillExists.remove();
        }, 300); // After transition
    }, 3500);
  }

  // --- Load User Data (from sessionStorage or default) ---
  function loadUserData() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const defaultAvatar = "Assets/default_avatar.png"; // Path to your default avatar

    if (currentUser) {
      if (fullNameInput) fullNameInput.value = currentUser.fullName || "John Doe";
      if (emailInput) emailInput.value = currentUser.email || "john.doe@example.com";
      if (profileNameDisplay) profileNameDisplay.textContent = currentUser.fullName || "John Doe";
      if (profileEmailDisplay) profileEmailDisplay.textContent = currentUser.email || "john.doe@example.com";
      
      // Load other profile fields if they were stored
      const userProfileData = JSON.parse(localStorage.getItem(`profile_${currentUser.email}`)) || {};
      if (document.getElementById('age')) document.getElementById('age').value = userProfileData.age || 28;
      if (document.getElementById('gender')) document.getElementById('gender').value = userProfileData.gender || "male";
      if (document.getElementById('height')) document.getElementById('height').value = userProfileData.height || 175;
      if (document.getElementById('weight')) document.getElementById('weight').value = userProfileData.weight || 70;
      if (document.getElementById('interest')) document.getElementById('interest').value = userProfileData.interest || "sports";
      if (document.getElementById('daily_activity_level')) document.getElementById('daily_activity_level').value = userProfileData.daily_activity_level || "moderate";
      if (document.getElementById('bio')) document.getElementById('bio').value = userProfileData.bio || "A professional aiming to maintain a healthy balance.";
      
      if (avatarImage) avatarImage.src = userProfileData.avatar || defaultAvatar;
      updateRemovePhotoButtonVisibility(userProfileData.avatar && userProfileData.avatar !== defaultAvatar);

    } else {
      // Fallback if no user in session (should ideally redirect to login)
      showUINotification("User not logged in. Displaying default data.", "error");
      if (avatarImage) avatarImage.src = defaultAvatar;
      updateRemovePhotoButtonVisibility(false);
    }
    storeOriginalFormValues();
  }

  function storeOriginalFormValues() {
    if (profileForm) {
        originalFormValues = {
            fullName: fullNameInput ? fullNameInput.value : '',
            age: document.getElementById('age') ? document.getElementById('age').value : '',
            gender: document.getElementById('gender') ? document.getElementById('gender').value : '',
            height: document.getElementById('height') ? document.getElementById('height').value : '',
            weight: document.getElementById('weight') ? document.getElementById('weight').value : '',
            interest: document.getElementById('interest') ? document.getElementById('interest').value : '',
            daily_activity_level: document.getElementById('daily_activity_level') ? document.getElementById('daily_activity_level').value : '',
            bio: document.getElementById('bio') ? document.getElementById('bio').value : '',
            avatar: avatarImage ? avatarImage.src : ''
        };
    }
  }

  function resetFormToOriginalValues() {
    if (profileForm) {
        if (fullNameInput) fullNameInput.value = originalFormValues.fullName;
        if (document.getElementById('age')) document.getElementById('age').value = originalFormValues.age;
        if (document.getElementById('gender')) document.getElementById('gender').value = originalFormValues.gender;
        if (document.getElementById('height')) document.getElementById('height').value = originalFormValues.height;
        if (document.getElementById('weight')) document.getElementById('weight').value = originalFormValues.weight;
        if (document.getElementById('interest')) document.getElementById('interest').value = originalFormValues.interest;
        if (document.getElementById('daily_activity_level')) document.getElementById('daily_activity_level').value = originalFormValues.daily_activity_level;
        if (document.getElementById('bio')) document.getElementById('bio').value = originalFormValues.bio;
        if (avatarImage) avatarImage.src = originalFormValues.avatar;
        updateRemovePhotoButtonVisibility(originalFormValues.avatar && originalFormValues.avatar !== "Assets/default_avatar.png");
    }
  }

  // --- Profile Form Submission ---
  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      if (!currentUser || !currentUser.email) {
        showUINotification("Cannot save. User not identified.", "error");
        return;
      }

      const updatedProfileData = {
        fullName: fullNameInput.value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        interest: document.getElementById('interest').value,
        daily_activity_level: document.getElementById('daily_activity_level').value,
        bio: document.getElementById('bio').value,
        avatar: avatarImage.src // Save current avatar src
      };

      // Update display
      if (profileNameDisplay) profileNameDisplay.textContent = updatedProfileData.fullName;
      // Email is typically not changed by user here or is readonly
      
      // Store in localStorage, namespaced by user's email
      localStorage.setItem(`profile_${currentUser.email}`, JSON.stringify(updatedProfileData));
      
      // Update current user's full name in sessionStorage if changed
      if (currentUser.fullName !== updatedProfileData.fullName) {
          currentUser.fullName = updatedProfileData.fullName;
          sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
      }

      storeOriginalFormValues(); // Update original values to current saved state
      showUINotification("Profile updated successfully!", "success");
    });
  }

  // --- Avatar Picture Handling ---
  function updateRemovePhotoButtonVisibility(show) {
      if(removePhotoBtn) {
          removePhotoBtn.style.display = show ? 'flex' : 'none';
      }
  }

  if (changePictureBtn) {
    changePictureBtn.addEventListener("click", () => {
      if (fileInput) fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          if (avatarImage) avatarImage.src = e.target.result;
          updateRemovePhotoButtonVisibility(true); // Show remove button when a new image is loaded
        };
        reader.readAsDataURL(file);
      } else if (file) {
        showUINotification("Please select a valid image file.", "error");
      }
    });
  }

  if (removePhotoBtn) {
      removePhotoBtn.addEventListener("click", () => {
          if (avatarImage) avatarImage.src = "Assets/default_avatar.png"; // Path to your default avatar
          updateRemovePhotoButtonVisibility(false);
          // Also update in localStorage immediately if form isn't submitted yet
          const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
          if(currentUser && currentUser.email) {
              const userProfileData = JSON.parse(localStorage.getItem(`profile_${currentUser.email}`)) || {};
              userProfileData.avatar = "Assets/default_avatar.png";
              localStorage.setItem(`profile_${currentUser.email}`, JSON.stringify(userProfileData));
          }
          showUINotification("Profile photo removed.", "info");
      });
  }

  // --- Cancel Edit ---
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      resetFormToOriginalValues();
      showUINotification("Changes cancelled.", "info");
    });
  }

  // --- Logout ---
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("currentUser"); // Clear current user session
      localStorage.removeItem("rememberedUserEmailActiflow"); // Clear remember me
      // Optionally clear specific profile data from localStorage, or leave it for next login
      // For a full clean logout, you might iterate localStorage keys if namespaced
      showUINotification("Logged out successfully. Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "login_page.html";
      }, 1500);
    });
  }

  // --- Initial Load ---
  loadUserData();
  console.log("Profile Page JS Loaded");
});