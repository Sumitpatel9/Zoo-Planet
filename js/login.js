// ==================== CONFIGURATION ====================
const LOGIN_API_URL = 'http://localhost:5000/api/auth/login';
const SIGNUP_API_URL = 'http://localhost:5000/api/auth/signup';
// For production: Update URLs accordingly

// ==================== TAB SWITCHING ====================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ==================== PASSWORD TOGGLE ====================
const toggleButtons = document.querySelectorAll('.toggle-password');

toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);
        const icon = button.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// ==================== PASSWORD STRENGTH CHECKER ====================
const signupPasswordInput = document.getElementById('signupPassword');
const passwordStrength = document.getElementById('passwordStrength');

if (signupPasswordInput) {
    signupPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthBar = passwordStrength.querySelector('.strength-bar');
        
        if (password.length === 0) {
            passwordStrength.classList.remove('show');
            return;
        }
        
        passwordStrength.classList.add('show');
        
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        
        strengthBar.className = 'strength-bar';
        
        if (strength <= 2) {
            strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    });
}

// ==================== LOGIN FORM SUBMISSION ====================
const loginForm = document.getElementById('loginForm');
const loginSuccess = document.getElementById('loginSuccess');
const loginError = document.getElementById('loginError');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        loginSuccess.classList.remove('show');
        loginError.classList.remove('show');
        
        // Clear errors
        document.querySelectorAll('#login .form-control').forEach(input => {
            input.classList.remove('error');
        });
        
        // Get form data
        const formData = {
            email: document.getElementById('loginEmail').value.trim(),
            password: document.getElementById('loginPassword').value
        };
        
        // Validate
        let isValid = true;
        
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            document.getElementById('loginEmail').classList.add('error');
            isValid = false;
        }
        
        if (!formData.password) {
            document.getElementById('loginPassword').classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                loginSuccess.classList.add('show');
                
                // Store token (if using JWT)
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } else {
                throw new Error(data.message || 'Login failed');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            loginError.classList.add('show');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                loginError.classList.remove('show');
            }, 5000);
        }
    });
}

// ==================== SIGNUP FORM SUBMISSION ====================
const signupForm = document.getElementById('signupForm');
const signupSuccess = document.getElementById('signupSuccess');
const signupError = document.getElementById('signupError');

if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        signupSuccess.classList.remove('show');
        signupError.classList.remove('show');
        
        // Clear errors
        document.querySelectorAll('#signup .form-control').forEach(input => {
            input.classList.remove('error');
        });
        
        // Get form data
        const formData = {
            name: document.getElementById('signupName').value.trim(),
            email: document.getElementById('signupEmail').value.trim(),
            password: document.getElementById('signupPassword').value,
            confirmPassword: document.getElementById('signupConfirmPassword').value
        };
        
        // Validate
        let isValid = true;
        
        if (!formData.name) {
            document.getElementById('signupName').classList.add('error');
            isValid = false;
        }
        
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            document.getElementById('signupEmail').classList.add('error');
            isValid = false;
        }
        
        if (!formData.password || formData.password.length < 6) {
            document.getElementById('signupPassword').classList.add('error');
            isValid = false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            document.getElementById('signupConfirmPassword').classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(SIGNUP_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                signupSuccess.classList.add('show');
                
                // Store token if provided
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } else {
                throw new Error(data.message || 'Signup failed');
            }
            
        } catch (error) {
            console.error('Signup error:', error);
            signupError.querySelector('p').textContent = error.message || 'Registration failed. Please try again.';
            signupError.classList.add('show');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                signupError.classList.remove('show');
            }, 5000);
        }
    });
}

// Remove error on input
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

// ==================== SOCIAL LOGIN (Placeholder) ====================
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
        alert(`${provider} login will be implemented with OAuth 2.0`);
        // TODO: Implement OAuth 2.0 flow
    });
});
