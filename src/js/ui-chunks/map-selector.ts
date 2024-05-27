export class MapSelector {
  static getRow(rowIdx: number): HTMLDivElement {
    return document.querySelectorAll<HTMLDivElement>(
      '#MapSelectorFirstRow, #MapSelectorFirstRow ~ div'
    )[rowIdx];
  }

  static toggleFavorite(rowIdx: number): void {
    const button = this.getRow(rowIdx).querySelector('& > .faves');
    button.classList.toggle('selected');
  }

  static fakeDownload(rowIdx: number): void {
    const button = this.getRow(rowIdx).querySelector('& > .download');
    const duration = Math.random() * 2 + 0.5;
    if (button.classList.contains('playable')) return;
    button.classList.add('downloading');
    button.querySelector<HTMLSpanElement>('& > span').style.transitionDuration =
      `${duration}s`;
    setTimeout(() => {
      button.classList.remove('downloading');
      button.classList.add('playable');
    }, duration * 1000);
  }
}

// Not unreasonable using globals for such a small site.
Object.assign(window, { MapSelector });
