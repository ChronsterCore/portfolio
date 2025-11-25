// login_page.js
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("remember");
  // const goToRegisterLink = document.querySelector(".auth-action-link"); // For "Sign Up" link
  const formHeaderP = document.querySelector(".form-header p");

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePasswordForLogin(password) {
    return password.length > 0; // Simple check for login, more complex for registration
  }

  function showError(inputElement, message) {
    removeError(inputElement); // Remove existing error first
    const formGroup = inputElement.closest(".form-group");
    if (formGroup) {
      inputElement.style.borderColor = "#e53e3e";
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      formGroup.appendChild(errorDiv); // Append error message to the form-group
    }
  }

  function removeError(inputElement) {
    const formGroup = inputElement.closest(".form-group");
    if (formGroup) {
      inputElement.style.borderColor = "#E2E8F0"; // Reset to default border
      const error = formGroup.querySelector(".error-message");
      if (error) {
        error.remove();
      }
    }
  }
  
  function showGlobalSuccess(message) {
    // Remove any existing global success messages
    const existingSuccess = document.querySelector(".success-message-global");
    if (existingSuccess) existingSuccess.remove();

    const successDiv = document.createElement("div");
    successDiv.className = "success-message-global"; // Use a specific class
    successDiv.textContent = message;
    // Styling is now in CSS, but you can add dynamic parts here if needed
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.opacity = "0";
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 500); // Wait for fade out before removing
    }, 3500); // Message visible for 3.5 seconds
  }

  function showLoginErrorMain(message) {
    const existingError = document.querySelector(".login-error-main");
    if (existingError) existingError.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "login-error-main";
    errorDiv.textContent = message;
    // Styling is in CSS
    
    // Insert before the form within .login-form-container
    const formContainer = document.querySelector(".login-form-container");
    if (formContainer && loginForm) {
      formContainer.insertBefore(errorDiv, loginForm.parentNode.querySelector('.form-header').nextSibling);
    } else if (loginForm) {
        loginForm.parentNode.insertBefore(errorDiv, loginForm);
    }


    setTimeout(() => {
      if (errorDiv && errorDiv.parentNode) errorDiv.remove();
    }, 5000);
  }

  function displaySignUpPrompt(show) {
    let promptDiv = document.getElementById("signUpPromptMessage");
    if (show) {
      if (!promptDiv) {
        promptDiv = document.createElement("div");
        promptDiv.id = "signUpPromptMessage";
        promptDiv.textContent = "New here? You must sign up first.";
        promptDiv.style.color = "#dc3545";
        promptDiv.style.fontSize = "0.9rem";
        promptDiv.style.marginTop = "10px";
        promptDiv.style.textAlign = "center";
        if (formHeaderP && formHeaderP.parentNode) {
          formHeaderP.parentNode.insertBefore(promptDiv, formHeaderP.nextSibling);
        }
      }
      promptDiv.style.display = "block";
    } else {
      if (promptDiv) {
        promptDiv.style.display = "none";
      }
    }
  }

  const registrationSuccess = sessionStorage.getItem("registrationSuccess");
  if (registrationSuccess === "true") {
    showGlobalSuccess("Registration successful! Please login with your account.");
    sessionStorage.removeItem("registrationSuccess");
    const newUserEmail = sessionStorage.getItem("newUserEmail");
    if (newUserEmail && emailInput) {
      emailInput.value = newUserEmail;
      // Optionally focus password field: passwordInput.focus();
    }
    // Clean up newUserEmail from session storage if it's no longer needed
    // sessionStorage.removeItem("newUserEmail"); 
  }

  if (emailInput) {
    emailInput.addEventListener("input", function () {
      removeError(this);
      displaySignUpPrompt(false); 
    });
    emailInput.addEventListener("blur", function () { // Validate on blur
        if (this.value && !validateEmail(this.value)) {
            showError(this, "Please enter a valid email address.");
        } else {
            removeError(this);
        }
    });
  }
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      removeError(this);
      displaySignUpPrompt(false);
    });
     passwordInput.addEventListener("blur", function () { // Basic validation on blur
        if (this.value && !validatePasswordForLogin(this.value)) { // Or just this.value === ""
            showError(this, "Password is required.");
        } else {
            removeError(this);
        }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let isValidForLoginAttempt = true;

      const existingLoginError = document.querySelector(".login-error-main");
      if (existingLoginError) existingLoginError.remove();
      displaySignUpPrompt(false);

      const registeredUsers = JSON.parse(sessionStorage.getItem("registeredUsers") || "[]");

      if (email === "" && password === "") {
        showError(emailInput, "Email is required.");
        showError(passwordInput, "Password is required.");
        isValidForLoginAttempt = false;
      } else if (email === "") {
        showError(emailInput, "Email is required.");
        isValidForLoginAttempt = false;
      } else if (password === "") {
        showError(passwordInput, "Password is required.");
        isValidForLoginAttempt = false;
      }


      if (!validateEmail(email) && email !== "") { // Only show format error if not empty
        showError(emailInput, "Invalid email format.");
        isValidForLoginAttempt = false;
      } else if (email !== "") { // Remove error if format is now okay (and not empty)
        removeError(emailInput);
      }
      
      // No specific format validation for password on login, just presence

      if (!isValidForLoginAttempt) return;
      
      if (registeredUsers.length === 0 && (email !== "" || password !== "")) {
          displaySignUpPrompt(true);
          return; 
      }


      const user = registeredUsers.find(u => u.email === email && u.password === password);

      const submitBtn = loginForm.querySelector(".auth-submit-btn");
      const originalText = submitBtn.textContent;

      if (user) {
        submitBtn.textContent = "Signing In...";
        submitBtn.disabled = true;
        // submitBtn.style.background = "#156b47"; // Loading color - handled by :disabled style

        sessionStorage.setItem("currentUser", JSON.stringify({ fullName: user.fullName, email: user.email }));
        if (rememberCheckbox && rememberCheckbox.checked) {
          localStorage.setItem("rememberedUserEmailActiflow", user.email);
        } else {
          localStorage.removeItem("rememberedUserEmailActiflow");
        }

        showGlobalSuccess(`Welcome back, ${user.fullName}! Redirecting...`);
        setTimeout(() => {
          window.location.href = "homepage2.html";
        }, 1500);
      } else {
        // Only show main error if not an empty submission handled above
        if (email !== "" || password !== "") {
            showLoginErrorMain("Incorrect email or password. Please try again.");
            const emailExistsInStorage = registeredUsers.find(u => u.email === email);
            if (emailExistsInStorage) {
                showError(passwordInput, "Incorrect password.");
                removeError(emailInput); // Email was found, so not an email error
            } else if (email !== "") { // Only show "email not registered" if email was entered
                showError(emailInput, "Email not registered.");
                removeError(passwordInput); // Not a password error at this point
            }
        }
      }
    });
  }

  if (emailInput) {
    const rememberedEmail = localStorage.getItem("rememberedUserEmailActiflow");
    if (rememberedEmail) {
      emailInput.value = rememberedEmail;
      if (rememberCheckbox) rememberCheckbox.checked = true;
    }
  }

  const socialLoginButtons = document.querySelectorAll(".social-btn");
  socialLoginButtons.forEach(button => {
    button.addEventListener("click", function() {
        const platform = this.classList.contains('google-btn') ? 'Google' :
                         this.classList.contains('facebook-btn') ? 'Facebook' :
                         this.classList.contains('twitter-btn') ? 'Twitter' : 'Social';
        showGlobalSuccess(`${platform} Sign-in integration coming soon!`);
    });
  });
  

  const forgotPasswordLink = document.querySelector(".forgot-password");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Forgot Password feature coming soon!"); // Simple alert for now
    });
  }

  console.log("%cActiFlow Login Page Ready! 🚀", "color: #18b058; font-size: 16px; font-weight: bold;");
});