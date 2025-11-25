// register_page.js
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  // const loginLink = document.getElementById("loginLink"); // This is an <a> tag

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number. Allows special chars.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  function validateFullName(fullName) {
    return fullName.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(fullName.trim()); // Allow letters, spaces, hyphens, apostrophes
  }
  
  function emailExistsInSession(email) {
    const users = JSON.parse(sessionStorage.getItem("registeredUsers")) || [];
    return users.some(user => user.email === email);
  }

  function showError(inputElement, message) {
    removeError(inputElement);
    const formGroup = inputElement.closest(".form-group");
    if (formGroup) {
      inputElement.style.borderColor = "#e53e3e";
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      formGroup.appendChild(errorDiv);
    }
  }

  function removeError(inputElement) {
    const formGroup = inputElement.closest(".form-group");
    if (formGroup) {
      inputElement.style.borderColor = "#E2E8F0"; // Reset to default
      const error = formGroup.querySelector(".error-message");
      if (error) {
        error.remove();
      }
    }
  }

  function showGlobalSuccess(message) {
    const existingSuccess = document.querySelector(".success-message-global");
    if (existingSuccess) existingSuccess.remove();

    const successDiv = document.createElement("div");
    successDiv.className = "success-message-global";
    successDiv.textContent = message;
    // Styling is in CSS
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.opacity = "0";
        setTimeout(() => {
            if (successDiv.parentNode) {
                 successDiv.remove();
            }
        }, 500);
    }, 3000);
  }


  // Add event listeners for real-time validation on blur and input
  if (fullNameInput) {
    fullNameInput.addEventListener("input", () => removeError(fullNameInput));
    fullNameInput.addEventListener("blur", () => {
      if (fullNameInput.value && !validateFullName(fullNameInput.value)) {
        showError(fullNameInput, "Min. 2 chars, letters, spaces, hyphens, apostrophes.");
      } else {
        removeError(fullNameInput);
      }
    });
  }
  if (emailInput) {
    emailInput.addEventListener("input", () => removeError(emailInput));
    emailInput.addEventListener("blur", () => {
      if (emailInput.value) {
        if (!validateEmail(emailInput.value)) {
          showError(emailInput, "Please enter a valid email address.");
        } else if (emailExistsInSession(emailInput.value)) {
          showError(emailInput, "Email already registered. Please login or use a different email.");
        } else {
          removeError(emailInput);
        }
      }
    });
  }
  if (passwordInput) {
    passwordInput.addEventListener("input", () => removeError(passwordInput));
    passwordInput.addEventListener("blur", () => {
      if (passwordInput.value && !validatePassword(passwordInput.value)) {
        showError(passwordInput, "Min. 8 chars, 1 uppercase, 1 lowercase, 1 number.");
      } else {
        removeError(passwordInput);
      }
      // Re-validate confirmPassword if password changes
      if (confirmPasswordInput.value) {
        if (confirmPasswordInput.value !== passwordInput.value) {
          showError(confirmPasswordInput, "Passwords do not match.");
        } else {
          removeError(confirmPasswordInput);
        }
      }
    });
  }
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", () => removeError(confirmPasswordInput));
    confirmPasswordInput.addEventListener("blur", () => {
      if (confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, "Passwords do not match.");
      } else if (confirmPasswordInput.value) { // Only remove if there's content and it matches
        removeError(confirmPasswordInput);
      }
    });
  }


  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      // Perform all validations on submit
      if (!fullNameInput.value.trim()) {
        showError(fullNameInput, "Full name is required.");
        isValid = false;
      } else if (!validateFullName(fullNameInput.value)) {
        showError(fullNameInput, "Min. 2 chars, letters, spaces, hyphens, apostrophes.");
        isValid = false;
      } else {
        removeError(fullNameInput);
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, "Email is required.");
        isValid = false;
      } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, "Please enter a valid email address.");
        isValid = false;
      } else if (emailExistsInSession(emailInput.value)) {
        showError(emailInput, "Email already registered. Please login or use a different email.");
        isValid = false;
      } else {
        removeError(emailInput);
      }
      
      if (!passwordInput.value) {
        showError(passwordInput, "Password is required.");
        isValid = false;
      } else if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, "Min. 8 chars, 1 uppercase, 1 lowercase, 1 number.");
        isValid = false;
      } else {
        removeError(passwordInput);
      }

      if (!confirmPasswordInput.value) {
        showError(confirmPasswordInput, "Confirm password is required.");
        isValid = false;
      } else if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, "Passwords do not match.");
        isValid = false;
      } else {
        removeError(confirmPasswordInput);
      }


      if (isValid) {
        const submitBtn = this.querySelector(".auth-submit-btn");
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Creating Account...";
        submitBtn.disabled = true;
        // submitBtn.style.opacity = "0.7"; // Or use :disabled CSS

        setTimeout(() => { // Simulate API call
          const userData = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value, // In a real app, hash this password
            registeredAt: new Date().toISOString()
          };

          const existingUsers = JSON.parse(sessionStorage.getItem("registeredUsers")) || [];
          existingUsers.push(userData);
          sessionStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
          
          // Set flags for login page to prefill email and show success message
          sessionStorage.setItem("registrationSuccess", "true");
          sessionStorage.setItem("newUserEmail", userData.email);


          showGlobalSuccess("Account created successfully! Redirecting to login...");
          
          registerForm.reset(); // Clear the form
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          // submitBtn.style.opacity = "1";

          setTimeout(() => {
            window.location.href = "login_page.html";
          }, 1500); // Redirect after success message shown for a bit
        }, 1000); // Simulate network delay
      }
    });
  }

  const socialButtons = document.querySelectorAll(".social-btn");
  socialButtons.forEach(button => {
    button.addEventListener("click", function() {
        const platform = this.classList.contains('google-btn') ? 'Google' :
                         this.classList.contains('facebook-btn') ? 'Facebook' :
                         this.classList.contains('twitter-btn') ? 'Twitter' : 'Social';
        showGlobalSuccess(`${platform} Sign-up integration coming soon!`);
    });
  });

  console.log("%cActiFlow Registration Page Ready! 🌟", "color: #18b058; font-size: 16px; font-weight: bold;");
});