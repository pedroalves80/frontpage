export class HeroBanner {
  static scrollToNextSection(): void {
    const nextSection = document.getElementById('Main');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  static checkIfWindowIsOnTop(): void {
    const windowIsOnTop = window.scrollY < 100;

    const scrollDownEl = document.getElementById('ScrollDown');

    if (windowIsOnTop) {
      scrollDownEl.classList.add('isOnTop');
    } else {
      scrollDownEl.classList.remove('isOnTop');
    }
  }
}

window.addEventListener('scroll', HeroBanner.checkIfWindowIsOnTop);

HeroBanner.checkIfWindowIsOnTop();

Object.assign(window, { HeroBanner });
