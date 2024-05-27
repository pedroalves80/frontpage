type Gamemode = {
  id: string;
  name: string;
  description: string[];
  // hate having to hardcode this but a nightmare getting programmatically since
  // video isn't loaded immediately
  videoDuration: number;
  button?: HTMLButtonElement;
  section?: HTMLDivElement;
  video?: HTMLVideoElement;
};

const Gamemodes: Gamemode[] = [
  {
    id: 'surf',
    name: 'Surf',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ],
    videoDuration: 27.0
  },
  {
    id: 'bhop',
    name: 'Bhop',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ],
    videoDuration: 23.534
  },
  {
    id: 'climb',
    name: 'Climb',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ],
    videoDuration: 30.8
  },
  {
    id: 'rj',
    name: 'Rocket Jump',
    description: [
      'Rocket Jump is based on the soldier class from TF2, ',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ],
    videoDuration: 22.25
  },
  {
    id: 'sj',
    name: 'Sticky Jump',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ],
    videoDuration: 22.55
  },
  {
    id: 'defrag',
    name: 'Defrag',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ],
    videoDuration: 34.854
  },
  {
    id: 'ahop',
    name: 'Ahop',
    description: [
      "Ahop is derived from Valve's attempt stop bunny-hopping in Half-Life 2, " +
        "whereby convincing the game you're jumping backwards allows the player to rapidly increasing their velocity.",
      'In Ahop, speed is practically free; the challenge of Ahop is using multiple techniques ' +
        ' such as back/side/forward-hopping, sprint/duck/walking, and circlestrafing to maintain control and accurately navigate maps.',
      'Unlike other gamemodes, Ahop has never been played on dedicated servers, and is instead best known from Half-Life 2 and Portal speedrunnning.'
    ],
    videoDuration: 31.684
  },
  {
    id: 'conc',
    name: 'Conc',
    description: [
      'Conc comes from Team Fortress Classic and is based around using the knockback of concussion grenades (concs).',
      "Concs have a fixed timer, don't stick to surfaces, and so can easily become chaotic; " +
        'skilled concing requires awareness of every active conc and planning your next step at least 4 seconds in the future.',
      'Whilst TFC has historically had a very small playerbase, the conc community has remained active ' +
        'for multiple decades and has played an active role in shaping the mode in Momentum.'
    ],
    videoDuration: 28.35
  }
];

let selected: Gamemode | undefined;
let timerHandle: ReturnType<typeof setTimeout> | undefined;
let timeBar: HTMLDivElement;
let timeBarProgress: HTMLSpanElement;

//prettier-ignore
function init() {
  timeBar                 = document.querySelector('#TimeBar')                   as HTMLDivElement;
  timeBarProgress         = document.querySelector('#TimeBar > span')            as HTMLSpanElement;
  const selection         = document.querySelector('#GamemodeSelection');
  const selectionTemplate = document.querySelector('#GamemodeSelectionTemplate') as HTMLTemplateElement;
  const sections          = document.querySelector('#GamemodeContainer');
  const sectionTemplate   = document.querySelector('#GamemodeTemplate')          as HTMLTemplateElement;

  // Horrible approach to serving lower-quality vid to slow connections.
  // I want to be able to use a regular <video> instead of faffing with streaming players,
  // which would be the sane way of dynamically serving different video qualities.
  const diff = Date.now() - (window as any).loadStartTime;
  const useHighQuality = diff < 500;
  
  for (const gamemode of Gamemodes) {
    const buttonNode = selectionTemplate.content.cloneNode(true) as DocumentFragment;
    
    buttonNode.querySelector('h1').textContent = gamemode.name;
    buttonNode.querySelector('img').src = `/assets/images/gamemodes/${gamemode.id}.svg`;
    
    const button = buttonNode.children[0] as HTMLButtonElement;
    
    button.id = `${gamemode.id}Button`;
    button.addEventListener('focus', () => selectMode(gamemode, false));
    
    selection.appendChild(buttonNode);
    gamemode.button = button;

    const sectionNode = sectionTemplate.content.cloneNode(true) as DocumentFragment;
    
    const video = sectionNode.querySelector('video');
    video.src = `/assets/videos/gamemodes/${gamemode.id}_vp9_${useHighQuality ? 'high' : 'low'}.webm`;
    video.poster = `/assets/images/gamemodes/${gamemode.id}_thumbnail.webp`;

    const details = sectionNode.querySelector('#GamemodeDetails');
    const heading = document.createElement('h1');
    heading.textContent = gamemode.name;
    details.appendChild(heading);
    for (const line of gamemode.description) {
      const p = document.createElement('p');
      p.textContent = line;
      details.appendChild(p);
    }

    const section = sectionNode.children[0] as HTMLDivElement;
    section.id = gamemode.id;
    sections.appendChild(sectionNode);
    gamemode.section = section;
  }

  // Run on next EL cycle so progress bar and videos behaves
  setTimeout(() => selectMode(Gamemodes[0], true));
}

function selectMode(gamemode: Gamemode, autoswitch: boolean) {
  if (selected) {
    selected.button?.classList?.remove('selected');
    selected.section?.classList?.remove('selected');
    void selected.section.querySelector('video')?.pause();
  }

  if (timerHandle) {
    clearTimeout(timerHandle);
    timerHandle = undefined;
  }

  timeBar.style.width = `${parseFloat(window.getComputedStyle(gamemode.button).width.replace('px', ''))}px`;
  timeBar.style.left = `${gamemode.button.offsetLeft}px`;
  timeBarProgress.style.width = '0%';
  timeBarProgress.style.transitionDuration = '0s';

  if (autoswitch) {
    const duration = gamemode.videoDuration;
    timerHandle = setTimeout(
      () =>
        selectMode(
          Gamemodes[(Gamemodes.indexOf(selected) + 1) % Gamemodes.length],
          true
        ),
      duration * 1000
    );
    setTimeout(() => {
      timeBar.style.transitionDuration = '0.5s';
      timeBarProgress.style.width = '100%';
      timeBarProgress.style.transitionDuration = `${duration}s`;
    });
  }

  gamemode.button.classList.add('selected');
  gamemode.section.classList.add('selected');
  void gamemode.section.querySelector('video')?.play();

  selected = gamemode;
}

init();
