
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 100);
});

// Effet hover sur les liens et boutons
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1.5)';
    cursorFollower.style.transform = 'scale(2)';
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursorFollower.style.transform = 'scale(1.5)';
  });
});

// ==========================================================================
// Navigation mobile
// ==========================================================================
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const icon = navToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  });
});

// ==========================================================================
// Header scroll effect
// ==========================================================================
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollY = window.scrollY;
});

// ==========================================================================
// Smooth scroll pour les ancres
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ==========================================================================
// Animations au scroll (AOS-like)
// ==========================================================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-aos-delay') || 0;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      
      // Animation des barres de compétences
      if (entry.target.classList.contains('skill__card')) {
        const progressBar = entry.target.querySelector('.skill__progress');
        const level = progressBar.getAttribute('data-level');
        setTimeout(() => {
          progressBar.style.width = `${level}%`;
        }, 300 + parseInt(delay));
      }
      
      // Animation des statistiques
      if (entry.target.classList.contains('about__container')) {
        setTimeout(() => {
          animateStats();
        }, 300);
      }
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer tous les éléments avec data-aos
document.querySelectorAll('[data-aos]').forEach(el => {
  observer.observe(el);
});

// Observer les cartes de compétences et la section about
document.querySelectorAll('.skill__card, .about__container').forEach(el => {
  observer.observe(el);
});

// ==========================================================================
// Animation des statistiques
// ==========================================================================
function animateStats() {
  const stats = document.querySelectorAll('.stat__number');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Ajouter K si nécessaire
      const suffix = stat.parentElement.querySelector('.stat__label').textContent.includes('Abonnés') ? 'K' : '';
      stat.textContent = Math.floor(current) + suffix;
      
      if (suffix === 'K' && current < 10) {
        stat.textContent = current.toFixed(1) + suffix;
      }
    }, 16);
  });
}

// ==========================================================================
// Validation et soumission du formulaire de contact
// ==========================================================================
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
  const inputs = contactForm.querySelectorAll('.form__input, .form__textarea');
  
  // Animation des inputs au focus
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });
  
  // Soumission du formulaire
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validation des champs
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        isValid = false;
        
        // Animation de secousse
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      } else {
        input.style.borderColor = 'rgba(212, 196, 168, 0.3)';
      }
    });
    
    // Validation de l'email
    const emailInput = contactForm.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value)) {
      emailInput.style.borderColor = '#ef4444';
      isValid = false;
    }
    
    if (isValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      
      // Animation de chargement
      submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;
      submitBtn.style.cursor = 'not-allowed';
      
      // Simulation d'envoi
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Message envoyé !</span><i class="fas fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        // Message de confirmation
        showNotification('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
        
        // Reset du formulaire
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          submitBtn.style.cursor = 'pointer';
          submitBtn.style.background = '';
        }, 3000);
      }, 2000);
    } else {
      showNotification('Veuillez remplir tous les champs correctement.', 'error');
    }
  });
}

// ==========================================================================
// Système de notifications
// ==========================================================================
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Styles inline pour la notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#ffffff',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    zIndex: '10000',
    animation: 'slideInRight 0.5s ease-out',
    fontWeight: '500',
    fontSize: '0.95rem'
  });
  
  document.body.appendChild(notification);
  
  // Supprimer après 4 secondes
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 4000);
}

// Ajouter les animations CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);

// ==========================================================================
// Effet parallaxe sur le hero
// ==========================================================================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero__content');
  const shapes = document.querySelectorAll('.shape');
  
  parallaxElements.forEach(el => {
    const speed = 0.3;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
  
  shapes.forEach((shape, index) => {
    const speed = 0.1 + (index * 0.05);
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ==========================================================================
// Chargement progressif des images
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        
        img.addEventListener('load', () => {
          img.style.opacity = '1';
          img.style.filter = 'blur(0)';
        });
        
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    img.style.opacity = '0';
    img.style.filter = 'blur(10px)';
    img.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
    imageObserver.observe(img);
  });
});

// ==========================================================================
// Gestion des erreurs d'images
// ==========================================================================
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmN2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2EzOTE3MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
    this.alt = 'Image non disponible';
  });
});

// ==========================================================================
// Animation des éléments au scroll avec délai progressif
// ==========================================================================
const staggerElements = document.querySelectorAll('.projet__card, .skill__card');
staggerElements.forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.1}s`;
});

// ==========================================================================
// Indicateur de progression de lecture
// ==========================================================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--sable-doux), var(--sable-fonce));
  z-index: 10000;
  transition: width 0.1s ease;
  width: 0;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  progressBar.style.width = scrolled + '%';
});

// ==========================================================================
// Amélioration de la navigation active
// ==========================================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function highlightNavigation() {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// Style pour le lien actif
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav__link.active {
    color: var(--sable-fonce);
  }
  
  .nav__link.active::after {
    width: 100%;
  }
`;
document.head.appendChild(activeNavStyle);

// ==========================================================================
// Animation du logo au scroll (désactivée)
// ==========================================================================
// const logo = document.querySelector('.nav__logo');
// let logoRotation = 0;

// window.addEventListener('scroll', () => {
//   if (window.scrollY > lastScrollY) {
//     logoRotation += 2;
//   } else {
//     logoRotation -= 2;
//   }
//   logo.style.transform = `translateY(-2px) rotate(${logoRotation}deg)`;
// });

// ==========================================================================
// Effet de typing sur le titre du hero (optionnel)
// ==========================================================================
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Décommenter pour activer l'effet de typing
// const heroTitle = document.querySelector('.hero__title span');
// if (heroTitle) {
//   const originalText = heroTitle.textContent;
//   setTimeout(() => {
//     typeWriter(heroTitle, originalText, 80);
//   }, 1000);
// }

// ==========================================================================
// Performance: Debounce pour les événements scroll
// ==========================================================================
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Appliquer le debounce aux événements scroll intensifs
const debouncedScroll = debounce(() => {
  // Fonctions de scroll optimisées ici
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ==========================================================================
// Animation d'entrée de page
// ==========================================================================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Log de confirmation
  console.log('%c🎨 Portfolio de Cellou chargé avec succès !', 
    'color: #a39171; font-size: 16px; font-weight: bold;');
  console.log('%c✨ Développé avec passion', 
    'color: #d4c4a8; font-size: 12px;');
});

// ==========================================================================
// Easter egg: Konami Code
// ==========================================================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    // Animation spéciale
    document.body.style.animation = 'rainbow 2s linear infinite';
    showNotification('🎉 Code Konami activé ! Vous avez trouvé l\'easter egg !', 'success');
    
    // Ajouter l'animation rainbow
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
  }
});

// ==========================================================================
// Mode sombre (bonus)
// ==========================================================================
const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
darkModeToggle.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sable-doux), var(--sable-fonce));
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
`;

darkModeToggle.addEventListener('mouseenter', () => {
  darkModeToggle.style.transform = 'scale(1.1) rotate(15deg)';
});

darkModeToggle.addEventListener('mouseleave', () => {
  darkModeToggle.style.transform = 'scale(1) rotate(0deg)';
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = darkModeToggle.querySelector('i');
  
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Vérifier la préférence sauvegardée
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

// Ajouter le bouton au body (commenté par défaut)
// document.body.appendChild(darkModeToggle);

// Styles pour le mode sombre (à ajouter au CSS si activé)
const darkModeStyles = document.createElement('style');
darkModeStyles.textContent = `
  .dark-mode {
    --beige-clair: #1a1a1a;
    --sable-doux: #8a795c;
    --sable-fonce: #d4c4a8;
    --noir: #f9f7f3;
    --noir-light: #e5e5e5;
    --blanc: #2c2c2c;
  }
  
  .dark-mode .header {
    background: rgba(26, 26, 26, 0.8);
  }
  
  .dark-mode .projet__card,
  .dark-mode .skill__card,
  .dark-mode .contact__item,
  .dark-mode .contact__form {
    background: #2c2c2c;
  }
`;
document.head.appendChild(darkModeStyles);

// ==========================================================================
// Initialisation finale
// ==========================================================================
console.log('✅ Tous les scripts initialisés avec succès !');