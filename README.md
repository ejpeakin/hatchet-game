# Hatchet Survival

A first-person 3D survival game in the browser, inspired by Gary Paulsen's novel *Hatchet*. It's an unofficial fan project, not affiliated with the author or publisher, and the story is retold in original words.

A bush pilot lets thirteen-year-old Brian take the controls over the Canadian wilderness. Then the pilot has a heart attack, and Brian has to set the plane down on a lake. After that it's just Brian, a hatchet, and the woods.

## Playing

Open `index.html` in a recent desktop or mobile browser (Chrome, Edge, Firefox or Safari) with WebGL turned on. The whole game is that single file. It loads three.js and the fonts from public CDNs, so it needs an internet connection the first time.

To play it on the web, turn on GitHub Pages for this repository (Settings → Pages → deploy from the `main` branch, root folder). The game will be served from `index.html`.

### Modes

- **Story:** the flight, the crash and the chapters of the book: water and food, shelter, fire, the bow, the moose, the storm, swimming down into the sunken plane for the med kit, and the signal. The game saves at each chapter.
- **Open world:** no chapters and no limits. Explore landmarks, hunt, build a camp, ride out the weather and keep away from wolves and bears. Progress saves automatically, so you can continue later.

### Controls

| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | W A S D or arrow keys | Left joystick |
| Look | Mouse (click the game to capture it) | Drag the screen |
| Run | Shift | |
| Jump | Space | Jump |
| Use / interact | E or Enter | Use |
| Swing hatchet / shoot bow | Click (hold to throw the hatchet or draw the bow) | Axe |
| Dodge | Q or C | Dodge |
| Swim down / up (in deep water) | Look down and swim, or hold C / Space | Dodge / Jump |
| Switch hatchet / bow | 1, 2, X or mouse wheel | Swap |
| Field notes | J or Tab | |
| Pause | Esc or P | Pause button |
| Graphics quality | G | |
| Frame-rate counter | F3 | |
| Mute | M | ♪ button |

## Credits

- [three.js](https://threejs.org/) r128 and its GLTFLoader (MIT licence).
- The people use the Ready Player Me sample avatar from the three.js examples, restyled in the game as a bush pilot.
- Fonts: Alfa Slab One, Barlow Condensed and Lora from Google Fonts.
