
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in-up');
  animatedElements.forEach(el => observer.observe(el));

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Optional: Header scroll effect (add shadow on scroll)
  // We don't have a fixed header in the current plan, but good for future proofing
  /*
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  */

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // Sticky Download Bar
  const stickyBar = document.getElementById('stickyBar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Show sticky bar after scrolling down past Hero section (approx 600px)
    if (currentScrollY > 600) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
  });

  // OS Detection and Smart Download Function
  function getDownloadUrl() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS Detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'https://apps.apple.com/kr/app/%EB%82%B4%EC%9A%B0%EC%95%BD-%EC%83%81%EB%B9%84%EC%95%BD-%EC%9C%A0%ED%9A%A8%EA%B8%B0%ED%95%9C-%EA%B4%80%EB%A6%AC-%EC%98%81%EC%96%91%EC%A0%9C-%EC%A0%95%EB%A6%AC/id6751311561';
    }

    // Android Detection
    if (/android/i.test(userAgent)) {
      return 'https://play.google.com/store/apps/details?id=com.star.medicine_inventory2&hl=ko';
    }

    // Default: QR 코드 페이지로 이동 (Windows, Mac 등)
    return '#qr-download';
  }

  // Download button click handler
  function handleDownload(e) {
    e.preventDefault();
    const downloadUrl = getDownloadUrl();

    if (downloadUrl.startsWith('#')) {
      // Scroll to QR section for desktop users
      const targetElement = document.querySelector(downloadUrl);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Redirect to app store for mobile users
      window.open(downloadUrl, '_blank');
    }
  }

  // Attach click handlers to all download buttons using event delegation
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.download-btn');
    if (target) {
      handleDownload(e);
    }
  });

  // --------------------------------------------------------------------------
  // Visual Upgrades
  // --------------------------------------------------------------------------

  // 1. Text Rotator (Fade/Slide Effect)
  class TextRotator {
    constructor(el, texts, period = 2000) {
      this.el = el;
      this.texts = texts;
      this.period = parseInt(period, 10) || 2000;
      this.loopNum = 0;
      this.isDeleting = false;
      this.tick();
    }

    tick() {
      const i = this.loopNum % this.texts.length;
      const fullTxt = this.texts[i];

      // Initial state
      if (this.el.innerHTML === '') {
        this.el.innerHTML = fullTxt;
      }

      // Schedule next rotation
      setTimeout(() => {
        this.rotate();
      }, this.period);
    }

    rotate() {
      // Fade out
      this.el.classList.add('fade-out');

      // Wait for transition to finish (0.5s matches CSS)
      setTimeout(() => {
        this.loopNum++;
        const i = this.loopNum % this.texts.length;
        const fullTxt = this.texts[i];

        this.el.innerHTML = fullTxt;

        // Fade in
        this.el.classList.remove('fade-out');

        // Loop again
        setTimeout(() => {
          this.rotate();
        }, this.period);
      }, 500);
    }
  }

  // Initialize TextRotator
  const rotatorElement = document.querySelector('.text-rotator');
  if (rotatorElement) {
    const texts = JSON.parse(rotatorElement.getAttribute('data-text'));
    new TextRotator(rotatorElement, texts, 2500);
  }

  // 2. Parallax Effect
  document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.hero::before, .hero::after');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
      // Create a subtle parallax movement
      // Note: Pseudo-elements can't be directly manipulated via JS style.
      // We'll effectively move the background or use CSS variables if set up.
      // Since they are pseudo-elements, let's use a Custom Property on the parent.
    });

    // Easier approach for elements that ARE in DOM (like hero mockup)
    const mockup = document.querySelector('.hero-phone-mockup');
    if (mockup) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.05;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.05;
      // Combine with existing rotate (set in CSS hover) or override
      // Let's use CSS variables to be cleaner
      document.body.style.setProperty('--mouse-x', moveX);
      document.body.style.setProperty('--mouse-y', moveY);
    }
  });
});
