export class Graph {
  static popover?: HTMLDivElement;

  static showPopover(el: HTMLSpanElement) {
    // Not using popover API since anchor stuff doesn't have widespread support + lacking docs
    this.popover ??= document.querySelector('#RunGraphPopover');
    this.popover.style.left = `${parseInt(el.style.left.slice(0, -1)) - 10}%`;
    this.popover.style.top = `${parseInt(el.style.top.slice(0, -1)) + 5}%`;
    this.popover.querySelector('#Time').textContent = el.dataset['time'];
    const diff = this.popover.querySelector('#Difference');
    diff.textContent = el.dataset['diff'];
    diff.classList.toggle('ahead', el.dataset['ahead'] === 'true');

    this.popover.classList.add('visible');
  }

  static hidePopover() {
    this.popover?.classList.remove('visible');
  }

  static {
    addEventListener('DOMContentLoaded', () =>
      document
        .querySelectorAll('#Graph span.point.interactive')
        .forEach((point: HTMLSpanElement) => {
          point.addEventListener('mouseover', () => this.showPopover(point));
          point.addEventListener('mouseout', () => this.hidePopover());
        })
    );
  }
}
