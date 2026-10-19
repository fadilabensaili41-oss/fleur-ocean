const menu=document.querySelector('.menu');const nav=document.querySelector('#navigation');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}});document.querySelector('#year').textContent=new Date().getFullYear();document.querySelectorAll('[data-product]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#sujet').value=link.dataset.product}));const formStatus=document.querySelector('#form-status');
if(formStatus&&new URLSearchParams(location.search).get('envoi')==='confirme')formStatus.textContent='Votre demande a été prise en compte. Si c’est votre premier envoi, l’activation de l’adresse est nécessaire avant sa livraison.';

// La houle est pilotée en JavaScript via la Web Animations API.
// Les transformations restent sur le compositeur, sans recalcul de la mise en page.
(() => {
  const title = document.querySelector('.ocean-title');
  const word = title?.querySelector('.ocean-word');
  const tagline = title?.querySelector('.ocean-tagline');
  if (!word || !tagline || typeof word.animate !== 'function') return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const originalText = word.textContent;
  const animations = [];
  let inView = !('IntersectionObserver' in window);
  let observer;

  // Le titre complet reste disponible aux lecteurs d’écran dans un seul élément.
  const letters = Array.from(originalText, character => {
    const letter = document.createElement('span');
    letter.className = 'ocean-letter';
    letter.textContent = character;
    return letter;
  });
  word.replaceChildren(...letters);

  function createAnimations() {
    if (animations.length || motionPreference.matches) return;
    letters.forEach((letter, index) => {
      const animation = letter.animate([
        { transform: 'translateY(0) rotate(0deg)', offset: 0 },
        { transform: 'translateY(0) rotate(0deg)', offset: .15 },
        { transform: 'translateY(-3.5px) rotate(-.65deg)', offset: .34 },
        { transform: 'translateY(3.5px) rotate(.65deg)', offset: .60 },
        { transform: 'translateY(0) rotate(0deg)', offset: .82 },
        { transform: 'translateY(0) rotate(0deg)', offset: 1 }
      ], {
        duration: 6800,
        delay: index * 160,
        iterations: Infinity,
        easing: 'cubic-bezier(.45,0,.55,1)'
      });
      animation.pause();
      animations.push(animation);
    });
    const signature = tagline.animate([
      { transform: 'translateY(0) rotate(0deg)', offset: 0 },
      { transform: 'translateY(-1.5px) rotate(-.18deg)', offset: .35 },
      { transform: 'translateY(1.5px) rotate(.18deg)', offset: .70 },
      { transform: 'translateY(0) rotate(0deg)', offset: 1 }
    ], {
      duration: 8600,
      delay: 650,
      iterations: Infinity,
      easing: 'cubic-bezier(.45,0,.55,1)'
    });
    signature.pause();
    animations.push(signature);
  }

  function syncMotion() {
    if (motionPreference.matches) {
      animations.forEach(animation => animation.cancel());
      animations.length = 0;
      return;
    }
    createAnimations();
    const running = inView && !document.hidden;
    animations.forEach(animation => running ? animation.play() : animation.pause());
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      syncMotion();
    }, { threshold: .15 });
    observer.observe(title);
  }
  motionPreference.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
})();
