// assets/script.js

// Wait for DOM to load before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initProjectFilters();
    initContactForm();
    initAnimations();
    initScrollObserver();
    initDynamicBackground(); 
    initProjectCards();

});

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.project-overlay').style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.project-overlay').style.opacity = '0';
        });
    });
}

// Mobile Navigation Toggle
function initNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('nav-active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.burger')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerOffset = 80; // Adjust based on your header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            const burger = document.querySelector('.burger');
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                document.querySelectorAll('.nav-links li').forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
}

// Project Filtering
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    if (filterBtns.length && projects.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                // Filter projects with animation
                projects.forEach(project => {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        if (filter === 'all' || project.getAttribute('data-category') === filter) {
                            project.style.display = 'block';
                            setTimeout(() => {
                                project.style.opacity = '1';
                                project.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            project.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData.entries());
            
            // Basic form validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'message'];
            
            requiredFields.forEach(field => {
                const input = form.querySelector(`[name="${field}"]`);
                if (!formValues[field] || formValues[field].trim() === '') {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailInput = form.querySelector('[name="email"]');
            
            if (formValues.email && !emailRegex.test(formValues.email)) {
                isValid = false;
                emailInput.classList.add('error');
            }
            
            if (!isValid) {
                showFormMessage('Please fill in all required fields correctly', 'error');
                return;
            }
            
            // Here you would typically send the data to a server
            // For demonstration, we'll simulate a successful submission
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate server request
            setTimeout(() => {
                // Reset form
                form.reset();
                
                // Show success message
                showFormMessage('Your message has been sent successfully!', 'success');
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        });
    }
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.classList.add('form-message', type);
        messageElement.textContent = message;
        
        // Add to form
        form.appendChild(messageElement);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 5000);
    }
}

// Animations
function initAnimations() {
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
    
    // Skill items animation
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('skill-item-active');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('skill-item-active');
        });
    });
}

// Scroll Animation Observer
function initScrollObserver() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .project-card, .contact-container');
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Create stars and floating circles for dynamic background
function createStars() {
    const stars = document.createElement('div');
    stars.classList.add('stars');
    document.body.appendChild(stars);
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        stars.appendChild(star);
    }
}

// Create floating circles
function createFloatingCircles() {
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.classList.add('floating-circle');
        circle.style.width = `${100 + Math.random() * 200}px`;
        circle.style.height = circle.style.width;
        circle.style.top = `${Math.random() * 100}%`;
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(circle);
    }
}

// Initialize dynamic background
function initDynamicBackground() {
    createStars();
    createFloatingCircles();
}

// Add CSS for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .toggle .line2 {
        opacity: 0;
    }
    
    .toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .nav-active {
        transform: translateX(0%) !important;
    }
    
    .scrolled {
        background-color: rgba(255, 255, 255, 0.98);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .header-hidden {
        transform: translateY(-100%);
    }
    
    .project-card, .section-header, .about-content, .contact-container {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-item-active {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .form-message {
        padding: 10px;
        margin-top: 15px;
        border-radius: 4px;
        text-align: center;
        transition: opacity 0.3s ease;
    }
    
    .form-message.success {
        background-color: rgba(52, 211, 153, 0.2);
        color: #065f46;
    }
    
    .form-message.error {
        background-color: rgba(239, 68, 68, 0.2);
        color: #b91c1c;
    }
    
    .fade-out {
        opacity: 0;
    }
    
    .error {
        border-color: #ef4444 !important;
    }
    
    @media screen and (max-width: 768px) {
        .nav-links {
            position: absolute;
            right: 0;
            height: 100vh;
            top: 0;
            background-color: var(--background-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            width: 70%;
            transform: translateX(100%);
            transition: transform 0.5s ease-in;
            box-shadow: -5px 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            padding: 100px 0;
        }
        
        .burger {
            display: block;
            z-index: 2000;
        }
    }
    
    @keyframes twinkle {
        0% { opacity: 0.2; }
        50% { opacity: 1; }
        100% { opacity: 0.2; }
    }
    
    @keyframes float {
        0% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(50px, 25px) rotate(90deg); }
        50% { transform: translate(0, 50px) rotate(180deg); }
        75% { transform: translate(-50px, 25px) rotate(270deg); }
        100% { transform: translate(0, 0) rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);
