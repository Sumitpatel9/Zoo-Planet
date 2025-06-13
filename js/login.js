// Tab switching with animation
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        // Remove active class from all tabs
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.remove('active');
            t.style.boxShadow = 'none';
        });

        // Add active class to clicked tab
        this.classList.add('active');

        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        // Show corresponding form with animation
        const targetForm = document.getElementById(`${this.dataset.tab}-form`);
        targetForm.classList.add('active');
    });
});

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Password strength indicator
const passwordInput = document.getElementById('reg-password');
if (passwordInput) {
    passwordInput.addEventListener('input', function () {
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        const password = this.value;
        let strength = 0;

        // Reset bars
        strengthBars.forEach(bar => {
            bar.style.backgroundColor = '#eee';
        });

        // Check password strength
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;

        // Update UI
        if (strength > 0) {
            for (let i = 0; i < strength; i++) {
                let color;
                if (strength === 1) color = '#ff4d4d'; // Weak
                else if (strength === 2) color = '#ffa64d'; // Medium
                else if (strength === 3) color = '#66cc66'; // Strong
                else color = '#2d862d'; // Very strong

                strengthBars[i].style.backgroundColor = color;
            }

            const strengthLabels = ['Weak', 'Medium', 'Strong', 'Very strong'];
            strengthText.textContent = strengthLabels[strength - 1];
            strengthText.style.color = strengthBars[strength - 1].style.backgroundColor;
        } else {
            strengthText.textContent = 'Password strength';
            strengthText.style.color = '#999';
        }

        // Check password match when password changes
        checkPasswordMatch();
    });
}

// Function to check if passwords match
function checkPasswordMatch() {
    const password = document.getElementById('reg-password')?.value || '';
    const confirmPassword = document.getElementById('reg-confirm')?.value || '';
    const confirmInput = document.getElementById('reg-confirm');
    
    if (!confirmInput) return;

    // Remove existing error message
    let errorElement = document.querySelector('.password-mismatch');
    if (errorElement) {
        errorElement.remove();
    }

    // Only show error if confirm password field has content and passwords don't match
    if (confirmPassword.length > 0 && password !== confirmPassword) {
        // Create and show error message
        errorElement = document.createElement('div');
        errorElement.className = 'password-mismatch';
        errorElement.style.color = '#ff4d4d';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.fontWeight = '500';
        errorElement.textContent = 'Passwords do not match!';
        
        confirmInput.parentNode.appendChild(errorElement);
        
        // Add red border to confirm password field
        confirmInput.style.borderColor = '#ff4d4d';
        confirmInput.style.boxShadow = '0 0 0 2px rgba(255, 77, 77, 0.1)';
    } else if (confirmPassword.length > 0 && password === confirmPassword) {
        // Add green border when passwords match
        confirmInput.style.borderColor = '#2d862d';
        confirmInput.style.boxShadow = '0 0 0 2px rgba(45, 134, 45, 0.1)';
    } else {
        // Reset border when confirm password is empty
        confirmInput.style.borderColor = '';
        confirmInput.style.boxShadow = '';
    }
}

// Check password match when confirm password changes
document.getElementById('reg-confirm')?.addEventListener('input', function () {
    checkPasswordMatch();
});

// Registration form submission with enhanced validation
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('reg-confirm')?.value;
    const email = document.getElementById('reg-email')?.value;
    const name = document.getElementById('reg-name')?.value;

    // Validate all required fields
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all required fields!');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        // Show error message
        let errorElement = document.querySelector('.password-mismatch');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'password-mismatch';
            errorElement.style.color = '#ff4d4d';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '0.5rem';
            errorElement.style.fontWeight = '500';
            document.getElementById('reg-confirm').parentNode.appendChild(errorElement);
        }
        errorElement.textContent = 'Passwords do not match! Please check your passwords.';
        
        // Focus on confirm password field
        document.getElementById('reg-confirm').focus();
        
        // Show alert as well for better user experience
        alert('Passwords do not match! Please make sure both password fields contain the same password.');
        return; // Stop form submission
    }

    // Check minimum password strength (at least 2 criteria)
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    if (strength < 2) {
        alert('Password is too weak! Please use a stronger password with at least 8 characters, including uppercase letters, numbers, or special characters.');
        return;
    }

    // If all validation passes, proceed with registration
    showSuccessModal('Your account has been created successfully!');
});

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    if (!email || !password) {
        alert('Please fill in both email and password!');
        return;
    }
    
    showSuccessModal('You have successfully logged in!');
});

// Social login buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
        showSuccessModal(`In a real implementation, this would authenticate with ${provider}`);
    });
});

// Forgot password link
document.querySelector('.forgot-password')?.addEventListener('click', function (e) {
    e.preventDefault();
    showSuccessModal('Password reset link would be sent to your email in a real implementation');
});

// Show success modal
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');

    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
document.getElementById('modalContinue')?.addEventListener('click', function () {
    closeModal();
});

document.querySelector('.close-modal')?.addEventListener('click', function () {
    closeModal();
});

// Close modal with ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Click outside modal to close
document.getElementById('successModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}