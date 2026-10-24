# Hatchet Survival

A first-person 3D survival game in the browser, inspired by Gary Paulsen's novel *Hatchet*. It's an unofficial fan project, not affiliated with the author or publisher, and the story is retold in original words.

A bush pilot lets thirteen-year-old Brian take the controls over the Canadian wilderness. Then the pilot has a heart attack, and Brian has to set the plane down on a lake. After that it's just Brian, a hatchet, and the woods.

## Playing

Open `index.html` in a recent desktop or mobile browser (Chrome, Edge, Firefox or Safari) with WebGL turned on. The whole game is that single file. It loads three.js and the fonts from public CDNs, so it needs an internet connection the first time.

To play it on the web, turn on GitHub Pages for this repository (Settings → Pages → deploy from the `main` branch, root folder). The game will be served from `index.html`.

The game picks a graphics setting to suit your computer and adjusts it as you play: it lowers the setting if the game is slow, and tries one step up if it stays smooth. To choose a setting yourself, press G to switch between Auto, High, Medium and Low. F3 shows the frame rate.

### Invite-only access (email sign-up)

Every new player has to ask before the game opens:

1. They enter their name and email and press **Ask to Play**.
2. The owner gets an email (sent through [FormSubmit](https://formsubmit.co), free, no account) with that player's 6-character unlock code.
3. To let them in, the owner replies with the code. To say no, the owner ignores the email.
4. The player types the code, and the game opens and remembers them on that device.

A code only works with the email it was made for, so a forwarded link still needs its own request.

- The address the requests go to is `ACCESS_FORM` in `index.html`.
- The very first request makes FormSubmit send the owner an **Activate Form** email. Click it once, and requests arrive from then on (check spam).
- After activating, FormSubmit offers a private random address. Put it in `ACCESS_FORM` instead to keep the real email out of the page.
- An empty `ACCESS_FORM` turns the sign-in off. The copy on claude.ai never shows it: that copy is private already.
- This stops anyone who only has the link. Someone who reads the page's code could work codes out, because the whole game is in that one public file.

`access/Code.gs` is an alternative with one-click Approve buttons and a Google Sheet of everyone who asked. It needs a Google account that may publish a web app for anyone, which school accounts usually can't. To use it, set `ACCESS_URL` and leave `ACCESS_FORM` empty.

### Modes

- **Story:** the flight, the crash and the chapters of the book: water and food, shelter, fire, the bow, the moose, the storm, swimming down into the sunken plane for the med kit, and the signal. The game saves at each chapter.
- **Open world:** no chapters and no limits. Explore landmarks, hunt, chop down trees for wood, build a camp, ride out the weather and keep away from wolves and bears, and from the pike in the lake. Progress saves automatically, so you can continue later.

### Stamina and breath

Sprinting, jumping, rolling, swinging the hatchet and swimming strokes use stamina (the green bar). It refills when Brian eases off, faster standing still and slower when he's hungry or thirsty. If it runs out he's worn out for a moment: no sprinting, jumping, rolling or strokes until he gets his strength back.

The BREATH bar beside it is Brian's air underwater. At the surface, press 4 (or tap BREATH) to take a deep breath before a dive. It fills his lungs past full, shown in gold, for about nine more seconds underwater. The extra fades if he doesn't dive soon.

### Controls

| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | W A S D or arrow keys | Left joystick |
| Look | Mouse (click the game to capture it) | Drag the screen |
| Run | Shift | |
| Jump | Space | Jump |
| Use / interact | E or Enter | Use |
| Swing hatchet / shoot bow | Click (hold to throw the hatchet or draw the bow) | Axe |
| Chop down a tree for wood | Click at the trunk (bigger trees take more swings) | Axe |
| Dodge | Q or C | Dodge |
| Swim stroke (in any water deep enough to swim) | Click | Stroke |
| Swim down / up (in deep water) | Look down and swim, or hold C / Space | Dodge / Jump |
| Switch hatchet / bow | 1, 2, X or mouse wheel | Swap, or tap HATCHET / BOW |
| Use the med kit | 3 | Tap MED KIT |
| Deep breath before a dive (at the surface, for extra air) | 4 | Tap BREATH |
| Field notes | J or Tab | |
| Pause | Esc or P | Pause button |
| Graphics quality | G | |
| Frame-rate counter | F3 | |
| Mute | M | ♪ button |

## Credits

- [three.js](https://threejs.org/) r128 and its GLTFLoader (MIT licence).
- The people use the Ready Player Me sample avatar from the three.js examples, restyled in the game as a bush pilot.
- Fonts: Bebas Neue, Special Elite, Alfa Slab One, Barlow Condensed and Lora from Google Fonts.
