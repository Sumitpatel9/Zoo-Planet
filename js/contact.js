// ==================== API CONFIGURATION ====================
const API_BASE = window.location.hostname === 'localhost'
    ? "http://localhost:4000"
    : "https://zoo-planet-backend.onrender.com";

// ==================== FORM VALIDATION & SUBMISSION ====================
const contactForm = document.getElementById('contactForm') || document.getElementById('contact-form');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('📝 Contact form submitted');
        
        // Clear previous states
        if (formSuccess) formSuccess.classList.remove('show');
        if (formError) formError.classList.remove('show');
        
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });
        
        // Get form data - CLEANED
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone')?.value.replace(/\D/g, '') || '', // Remove formatting
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // console.log('📤 Sending data:', formData);
        
        // Client-side validation
        let isValid = true;
        let errors = [];
        
        // Validate name
        if (!formData.name || formData.name.length < 2) {
            document.getElementById('name').classList.add('error');
            errors.push('Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            document.getElementById('email').classList.add('error');
            errors.push('Please enter a valid email');
            isValid = false;
        }
        
        // Validate phone (optional but if provided, must be valid)
        if (formData.phone && formData.phone.length > 0 && formData.phone.length !== 10) {
            document.getElementById('phone').classList.add('error');
            errors.push('Phone number must be 10 digits');
            isValid = false;
        }
        
        // Validate subject
        if (!formData.subject || formData.subject.length < 5) {
            document.getElementById('subject').classList.add('error');
            errors.push('Subject must be at least 5 characters');
            isValid = false;
        }
        
        // Validate message
        if (!formData.message || formData.message.length < 10) {
            document.getElementById('message').classList.add('error');
            errors.push('Message must be at least 10 characters');
            isValid = false;
        }
        
        if (!isValid) {
            showNotification('❌ ' + errors.join(', '), 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send data to backend
            const response = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            // console.log('📥 Response:', data);
            
            if (response.ok) {
                // Success
                console.log('✅ Contact form sent successfully');
                
                if (formSuccess) {
                    formSuccess.classList.add('show');
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => formSuccess.classList.remove('show'), 5000);
                }
                
                showNotification('✅ ' + (data.message || 'Message sent successfully!'), 'success');
                contactForm.reset();
                
            } else {
                // Server validation error
                throw new Error(data.error || 'Failed to send message');
            }
            
        } catch (error) {
            console.error('❌ Error:', error);
            
            if (formError) {
                formError.textContent = error.message;
                formError.classList.add('show');
                formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => formError.classList.remove('show'), 5000);
            }
            
            showNotification('❌ ' + error.message, 'error');
            
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Remove error class on input
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 7 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 7000);
}

// ==================== FAQ ACCORDION ====================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.8s ease-out';
    observer.observe(element);
});

// ==================== PHONE NUMBER INPUT ====================
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    // Only allow numbers
    phoneInput.addEventListener('input', function(e) {
        // Remove all non-digits
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        // Format: (123) 456-7890
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            }
        }
        
        e.target.value = value;
    });
    
    // Store raw digits in data attribute
    phoneInput.addEventListener('blur', function(e) {
        const rawValue = e.target.value.replace(/\D/g, '');
        e.target.dataset.raw = rawValue;
    });
}

console.log('✅ Contact form script loaded');
