import gsap from 'https://cdn.skypack.dev/gsap@3.11.0';

const CONFIG = {
  hue: 10,
  blur: 14,
  active: false,
  winddown: 1.5,
  saturation: 95,
  lightness: 65,
  size: 50,
  sizeMultiplier: 0.5,
  scaleBump: 1.75 };


const RATIO = window.devicePixelRatio || 1;

const BUTTON = document.querySelector('.button');
const CANVAS = BUTTON.querySelector('.button__canvas');
CANVAS.height = CANVAS.offsetHeight * RATIO;
CANVAS.width = CANVAS.offsetWidth * RATIO;
const CONTEXT = CANVAS.getContext('2d');
CONTEXT.filter = `blur(${CONFIG.blur}px) brightness(1.5)`;


let TRAILS = [];
let activeTrail;

let head = {
  active: 1 };

const FPS = 24;
gsap.ticker.fps(FPS);


/**
 * When drawing, you need to iterate over any active trails
 * and draw their nodes with the assigned hue
 * */
const DRAW = () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

  // Need to loop over all your trails and render as necessary
  for (let t = 0; t < TRAILS.length; t++) {if (window.CP.shouldStopExecution(0)) break;
    const TRAIL = TRAILS[t];
    // if (TRAIL.nodes.length === 0) TRAILS.splice(t, 1)
    CONTEXT.fillStyle = `hsl(${TRAIL.hue} ${CONFIG.saturation}% ${CONFIG.lightness}%)`;
    for (const NODE of TRAIL.nodes) {
      const { x, y, active } = NODE;
      const RENDER_SIZE = active * CONFIG.size;
      CONTEXT.beginPath();
      CONTEXT.arc(
      x,
      y,
      RENDER_SIZE * 0.5,
      0,
      Math.PI * 2);

      CONTEXT.fill();
    }
  }window.CP.exitedLoop(0);
  if (CONFIG.active) {
    const RENDER_SIZE = CONFIG.size * head.active;
    CONTEXT.fillStyle = `hsl(${head.hue} ${CONFIG.saturation}% ${CONFIG.lightness}%)`;
    CONTEXT.beginPath();
    CONTEXT.arc(
    head.x,
    head.y,
    RENDER_SIZE * 0.5,
    0,
    Math.PI * 2);

    CONTEXT.fill();
  }
};

const ADD_NODE = ({ x, y }) => {
  const BOUNDS = BUTTON.getBoundingClientRect();

  const normalizedX = x - BOUNDS.x;
  const normalizedY = y - BOUNDS.y;

  const NEW_NODE = {
    id: crypto.randomUUID(),
    x: normalizedX,
    y: normalizedY,
    active: 1 };


  head.hue = activeTrail.hue;
  head.x = NEW_NODE.x;
  head.y = NEW_NODE.y;

  activeTrail.nodes.push(NEW_NODE);
};

/**
 * Each trail is an Object with an id,
 * Array of nodes and a dedicated hue
 * */
let count = 0;
const INITIATE_TRAIL = ({ x, y }) => {
  CONFIG.size = CANVAS.height * CONFIG.sizeMultiplier;
  const NEW_TRAIL = {
    id: crypto.randomUUID(),
    hue: count === 0 ? 10 : gsap.utils.random(0, 359),
    nodes: [] };

  TRAILS.push(NEW_TRAIL);
  activeTrail = TRAILS[TRAILS.length - 1];
  ADD_NODE({ x, y });
  count++;
  CONFIG.active = true;
};

// These are still running when you leave and the new activeTrail interferes with it
const REMOVE_NODE = (nodeId, trail) => {
  const node = activeTrail.nodes.filter(node => node.id === nodeId)[0];
  if (node) {
    gsap.to(node, {
      active: 0,
      duration: CONFIG.winddown,
      onComplete: () => {
        trail.nodes.splice(
        trail.nodes.findIndex(node => node.id === nodeId),
        1);

      } });

  }
};

const UPDATE_TRAIL = ({ x, y }) => {
  if (activeTrail.nodes.length > 0) {
    REMOVE_NODE(activeTrail.nodes[activeTrail.nodes.length - 1].id, activeTrail);
  }
  ADD_NODE({ x, y });
};

const WIND_TRAIL = () => {
  CONFIG.active = false;
  if (activeTrail && activeTrail.nodes.length > 0) {
    for (let n = 0; n < activeTrail.nodes.length; n++) {if (window.CP.shouldStopExecution(1)) break;

      REMOVE_NODE(activeTrail.nodes[n].id, activeTrail);
    }window.CP.exitedLoop(1);
  }
};

const SCALE_UP = () => {
  gsap.to(head, { active: CONFIG.scaleBump, duration: 0.15 });
};
const SCALE_DOWN = () => {
  gsap.to(head, { active: 1, duration: 0.15 });
};

BUTTON.addEventListener('pointerenter', INITIATE_TRAIL);
BUTTON.addEventListener('pointermove', UPDATE_TRAIL);
BUTTON.addEventListener('pointerleave', WIND_TRAIL);
BUTTON.addEventListener('pointerdown', SCALE_UP);
BUTTON.addEventListener('pointerup', SCALE_DOWN);

gsap.ticker.add(DRAW);
//# sourceURL=pen.js