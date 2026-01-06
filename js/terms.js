// ==================== SIDEBAR NAVIGATION (FULLY FIXED) ====================
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.terms-section');

    // Smooth scroll with active state fix
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all links
            document.querySelectorAll('.sidebar-link').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active to clicked link
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active section highlighting on scroll
    function updateActiveSection() {
        const scrollPosition = window.pageYOffset + 150; // Adjust offset
        
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if current scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // If we're at the bottom of the page, activate the last section
        if ((window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 100) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                currentSection = lastSection.getAttribute('id');
            }
        }
        
        // Update active link
        if (currentSection) {
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Throttle scroll event
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveSection, 100);
    });

    // Initial check
    setTimeout(updateActiveSection, 100);
});

// ==================== ACCEPT TERMS ====================
document.addEventListener('DOMContentLoaded', function() {
    const acceptTermsBtn = document.getElementById('acceptTerms');
    const downloadTermsBtn = document.getElementById('downloadTerms');

    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', () => {
            localStorage.setItem('termsAccepted', 'true');
            localStorage.setItem('termsAcceptedDate', new Date().toISOString());
            
            const originalText = acceptTermsBtn.innerHTML;
            acceptTermsBtn.innerHTML = '<i class="fas fa-check-circle"></i> Accepted!';
            acceptTermsBtn.style.background = '#4caf50';
            
            setTimeout(() => {
                acceptTermsBtn.innerHTML = originalText;
                acceptTermsBtn.style.background = '';
            }, 2000);
        });
    }

    if (downloadTermsBtn) {
        downloadTermsBtn.addEventListener('click', () => {
            const originalText = downloadTermsBtn.innerHTML;
            downloadTermsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
            downloadTermsBtn.disabled = true;
            
            setTimeout(() => {
                alert('PDF download will be implemented with a PDF generation library like jsPDF or server-side generation.');
                downloadTermsBtn.innerHTML = originalText;
                downloadTermsBtn.disabled = false;
            }, 1500);
        });
    }
});

// ==================== SCROLL ANIMATIONS ====================
document.addEventListener('DOMContentLoaded', function() {
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
});

// ==================== PRINT PAGE ====================
function printTerms() {
    window.print();
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printTerms();
    }
});
