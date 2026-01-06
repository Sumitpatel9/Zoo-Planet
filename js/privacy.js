// ==================== SIDEBAR NAVIGATION (FULLY FIXED) ====================
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.privacy-section, .privacy-intro');

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

// ==================== ACCORDION ====================
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
});

// ==================== COOKIE BANNER ====================
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    const customizeCookies = document.getElementById('customizeCookies');
    const manageCookies = document.getElementById('manageCookies');

    // Show cookie banner if not accepted
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }

    // Accept all cookies
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // Customize cookies
    if (customizeCookies) {
        customizeCookies.addEventListener('click', () => {
            alert('Cookie preferences modal will open here. Implement your cookie preference UI.');
        });
    }

    // Manage cookies button
    if (manageCookies) {
        manageCookies.addEventListener('click', () => {
            localStorage.removeItem('cookiesAccepted');
            cookieBanner.classList.add('show');
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
function printPage() {
    window.print();
}

const printBtn = document.getElementById('printBtn');
if (printBtn) {
    printBtn.addEventListener('click', printPage);
}
