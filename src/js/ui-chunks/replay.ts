// Absolutely ridiculous overkill but whatever it was FUN
export class Replay {
  static readonly segmentTimes = [
    '0:36.14',
    '1:09.99',
    '1:43.41',
    '1:58.56',
    '2:16.72'
  ];

  static range: HTMLInputElement;
  static time: HTMLHeadingElement;
  static ticks: HTMLHeadingElement;
  static segments: Array<{
    div: HTMLDivElement;
    span: HTMLSpanElement;
    startTime: number;
    endTime: number;
  }> = [];
  static totalTime: number;
  static totalTicks: number;
  static totalTimeString: string;

  static {
    addEventListener('DOMContentLoaded', () => this.init());
  }

  static init() {
    const parseTime = (t: string) => {
      const [m, s] = t.split(':').map(Number);
      return m * 60 + s;
    };

    this.totalTimeString = this.segmentTimes.at(-1);
    this.totalTime = parseTime(this.totalTimeString);
    this.totalTicks = this.totalTime * 100; // 100 tickrate, standard

    const segmentContainer = document.querySelector(
      '#Replay.ui-chunk #Segments'
    );

    const segTimes = this.segmentTimes.map(parseTime);
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

    this.range = document.querySelector('#Replay.ui-chunk #Progress');
    this.time = document.querySelector('#Replay.ui-chunk #Time');
    this.ticks = document.querySelector('#Replay.ui-chunk #Ticks');
    this.range.addEventListener('input', () => this.updateProgress());

    this.updateProgress();
  }

  static updateProgress() {
    const time = this.getCurrentTime();
    const remainder = time % 60;
    const s = remainder.toFixed(2);
    const timeString = `${Math.floor(time / 60)}:${remainder < 10 ? '0' + s : s}`;
    this.time.textContent = `${timeString} / ${this.totalTimeString}`;
    this.ticks.textContent = `${Math.floor((time / this.totalTime) * this.totalTicks)} / ${this.totalTicks}`;

    for (const { div, span, startTime, endTime } of this.segments) {
      if (time > endTime) {
        span.style.width = '100%';
        div.classList.remove('current');
      } else if (time > startTime) {
        span.style.width = `${((time - startTime) / (endTime - startTime)) * 100}%`;
        div.classList.add('current');
      } else {
        span.style.width = '0%';
        div.classList.remove('current');
      }
    }
  }

  static togglePlay() {}

  static previousSegment() {
    const time = this.getCurrentTime();
    this.updateRangeFromTime(
      this.segments
        .map(({ startTime }) => startTime)
        .filter((startTime) => startTime < time - 1) // Some weird inaccuracy here (more than fp imprec) so -1
        .at(-1) ?? 0
    );
  }

  static nextSegment() {
    const time = this.getCurrentTime();
    this.updateRangeFromTime(
      this.segments
        .map(({ startTime }) => startTime)
        .filter((startTime) => time + 1 < startTime)
        .at(0) ?? 0
    );
  }

  static previousTick() {
    const time = this.getCurrentTime();
    this.updateRangeFromTime(time - 0.5);
  }

  static nextTick() {}

  private static getCurrentTime() {
    return (+this.range.value / 100) * this.totalTime;
  }

  private static updateRangeFromTime(time: number) {
    this.range.value = ((time * 100) / this.totalTime).toPrecision(10) ?? '0';
    this.updateProgress();
  }
}
