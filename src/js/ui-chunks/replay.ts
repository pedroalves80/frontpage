// Absolutely ridiculous overkill but whatever it was FUN
export class Replay {
  static readonly TickRate = 100;
  static readonly SegmentTimes = [
    '0:36.14',
    '1:09.99',
    '1:43.41',
    '1:58.56',
    '2:16.72'
  ];

  static rangeEl: HTMLInputElement;
  static timeEl: HTMLHeadingElement;
  static ticksEl: HTMLHeadingElement;
  static playButtonEl: HTMLButtonElement;
  static segments: Array<{
    div: HTMLDivElement;
    span: HTMLSpanElement;
    startTime: number;
    endTime: number;
  }> = [];

  static totalTime: number;
  static totalTicks: number;
  static totalTimeString: string;

  private static _time: number;

  static get time(): number { return this._time; } //prettier-ignore
  static set time(t: number) {
    this._time = t;
    if (!this.rangeEl) return;
    this.rangeEl.value = ((t * 100) / this.totalTime).toPrecision(10) ?? '0';
    this.updateProgress();
  }

  static {
    addEventListener('DOMContentLoaded', () => this.init());
  }

  static init() {
    const parseTime = (t: string) => {
      const [m, s] = t.split(':').map(Number);
      return m * 60 + s;
    };

    this.totalTimeString = this.SegmentTimes.at(-1);
    this.totalTime = parseTime(this.totalTimeString);
    this.totalTicks = this.totalTime * this.TickRate;

    const segmentContainer = document.querySelector(
      '#Replay.ui-chunk #Segments'
    );

    const segTimes = this.SegmentTimes.map(parseTime);
    this.segments = segTimes.map((time, idx) => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const label = document.createElement('p');
      label.textContent = `S${idx + 1}`;
      div.appendChild(span);
      div.appendChild(label);
      const startTime = idx == 0 ? 0 : segTimes[idx - 1];
      div.style.width = `${((time - startTime) / this.totalTime) * 100}%`;
      segmentContainer.appendChild(div);

      return {
        div,
        span,
        startTime,
        endTime: time
      };
    });

    this.rangeEl = document.querySelector('#Replay.ui-chunk #Progress');
    this.timeEl = document.querySelector('#Replay.ui-chunk #Time');
    this.ticksEl = document.querySelector('#Replay.ui-chunk #Ticks');
    this.playButtonEl = document.querySelector('#Replay.ui-chunk #PlayButton');
    this.rangeEl.addEventListener('input', () => {
      this.time = (+this.rangeEl.value / this.TickRate) * this.totalTime;
    });

    this.time = 81.3;
  }

  static updateProgress() {
    const remainder = this.time % 60;
    const s = remainder.toFixed(1);
    const timeString = `${Math.floor(this.time / 60)}:${remainder < 10 ? '0' + s : s}`;
    this.timeEl.textContent = `${timeString} / ${this.totalTimeString}`;
    this.ticksEl.textContent = `${Math.floor((this.time / this.totalTime) * this.totalTicks)} / ${this.totalTicks}`;

    for (const { div, span, startTime, endTime } of this.segments) {
      if (this.time > endTime) {
        span.style.width = '100%';
        div.classList.remove('current');
      } else if (this.time > startTime) {
        span.style.width = `${((this.time - startTime) / (endTime - startTime)) * 100}%`;
        div.classList.add('current');
      } else {
        span.style.width = '0%';
        div.classList.remove('current');
      }
    }
  }

  static previousSegment() {
    this.time =
      this.segments
        .map(({ startTime }) => startTime)
        .filter((startTime) => startTime < this.time)
        .at(-1) ?? 0;
  }

  static nextSegment() {
    this.time =
      this.segments
        .map(({ startTime }) => startTime)
        .filter((startTime) => this.time < startTime)
        .at(0) ?? 0;
  }

  static previousTick() {
    this.time -= 1 / this.TickRate;
  }

  static nextTick() {
    this.time += 1 / this.TickRate;
  }

  private static playing: boolean = false;

  static togglePlaying() {
    this.playing = !this.playing;
    this.playButtonEl.classList.toggle('playing');

    if (this.playing) {
      this.runAfLoopCycle();
    }
  }

  private static runAfLoopCycle() {
    const before = Date.now();
    requestAnimationFrame(() => {
      if (!this.playing) return;

      if (this.time >= this.totalTime) {
        this.playing = false;
        return;
      }

      this.time += (Date.now() - before) / 1000;

      this.runAfLoopCycle();
    });
  }
}

Object.assign(window, { Replay });
