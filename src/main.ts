import "./style.css";
import p5 from "p5";

/* ============================
   GLOBAL STATE
============================ */

let stage = 0;
let totalPoints = 1;

const maxPoints = 120;
const growthRate = 0.15;

/* ============================
   STAGE CONTENT
============================ */

type StageContent = {
  text: string;
  button: string;
};

const stages: StageContent[] = [
  {
    text: `
    I was reading a book and came across a beautiful illustration.<br>
    One idea. Then two. Then three.<br>
    Slowly, shapes began to appear.<br><br>

    Kleon was talking about creativity. — collect enough ideas, and you stop being something rigid and angular.<br>
    The more ideas you absorb,the more you stop being angular — and start becoming whole..<br><br>

    But the moment I saw that illustration, my mind went somewhere else entirely: this is exactly how geometry works.<br>

    The circle looks like the simplest shape in the room.<br>
    But mathematically, it is the shape that requires the most — infinite points, infinite sides, infinite ideas — to truly exist.<br>

    Every polygon is just a circle that gave up too early.<br><br>

    Could we begin with a single point…<br>
    and end with a circle?
    `,
    button: "Let’s begin."
  },
  {
    text: `
    A point has no length.<br>
    No width.<br>
    No height.<br><br>

    Yet it does one thing nothing else can:<br>
    it marks a position.
    `,
    button: "Place another point."
  },
  {
    text: `
    Two points appear.<br><br>

    In how many ways can we connect them?<br><br>

    And how many of those connections are shortest?
    `,
    button: "Add one more point."
  },
  {
    text: `
    Three non-collinear points form a triangle.<br><br>

    If we place three points evenly around a circle,<br>
    how many degrees apart must they be?<br><br>

    One complete rotation is 360°.
    `,
    button: "Divide again."
  },
  {
    text: `
    Now four points.<br><br>

    What is the angle between consecutive points<br>
    if they are evenly spaced around the circle?
    `,
    button: "Keep dividing."
  },
  {
    text: `
    Five points.<br><br>

    Six.<br>
    Seven.<br>
    Eight.<br><br>

    As the number increases,<br>
    what happens to the angle between them?
    `,
    button: "Watch closely."
  },
  {
    text: `
    As we keep adding points —<br>
    edges shorten.<br>
    corners soften.<br><br>

    <div class="highlight">
      <p>When did it stop being a polygon?</p>
      <p>Is a circle truly different — or just a limit?</p>
      <p>Is smoothness an illusion created by closeness?</p>
    </div>

    <br>

    We kept adding points evenly.<br><br>

    But how did the computer know<br>
    where to place each one?<br><br>

    What information is necessary<br>
    to determine the position<br>
    of a point around a circle?
    `,
    button: "Watch closely."
  }
];

/* ============================
   P5 SKETCH
============================ */

new p5((p: p5) => {

  const getCanvasSize = () => {
    const container = document.getElementById("app");
    const width = container ? container.clientWidth : 500;
    return Math.min(width, 500);
  };

  p.setup = () => {
    const size = getCanvasSize();
    const canvas = p.createCanvas(size, size); // square canvas
    canvas.parent("app");
    updateText();
  };

  p.windowResized = () => {
    const size = getCanvasSize();
    p.resizeCanvas(size, size);
  };

  p.draw = () => {
    p.background(245);
    drawStage(p);
  };
});

/* ============================
   STAGE RENDERER
============================ */

function drawStage(p: p5) {

  const cx = p.width / 2;
  const cy = p.height / 2;
  const radius = p.width * 0.35;

  switch (stage) {

    case 1:
      drawPoint(p, cx, cy);
      break;

    case 2:
      drawTwoPoints(p, cx, cy);
      break;

    case 3:
      drawRegularPolygon(p, 3, radius);
      break;

    case 4:
      drawRegularPolygon(p, 4, radius);
      break;

    case 5:
      drawRegularPolygon(p, 5, radius);
      drawCenter(p, cx, cy);
      drawRadiusLine(p, cx, cy, radius);
      break;

    case 6:
      drawGrowingPolygon(p, cx, cy, radius);
      break;
  }
}

/* ============================
   GEOMETRY
============================ */

function drawPoint(p: p5, x: number, y: number) {
  p.strokeWeight(p.width * 0.02);
  p.point(x, y);
}

function drawTwoPoints(p: p5, cx: number, cy: number) {

  const offset = p.width * 0.12;

  p.strokeWeight(p.width * 0.02);
  p.point(cx - offset, cy);
  p.point(cx + offset, cy);

  p.strokeWeight(2);
  p.line(cx - offset, cy, cx + offset, cy);
}

function drawCenter(p: p5, x: number, y: number) {
  p.strokeWeight(p.width * 0.015);
  p.point(x, y);
}

function drawRegularPolygon(p: p5, sides: number, radius: number) {

  const cx = p.width / 2;
  const cy = p.height / 2;

  p.stroke(0);
  p.noFill();
  p.strokeWeight(1.5);

  p.beginShape();

  for (let i = 0; i < sides; i++) {
    const angle = p.TWO_PI / sides * i;
    const x = cx + radius * p.cos(angle);
    const y = cy + radius * p.sin(angle);
    p.vertex(x, y);
  }

  p.endShape(p.CLOSE);
}

function drawRadiusLine(p: p5, cx: number, cy: number, radius: number) {
  p.strokeWeight(2);
  p.line(cx, cy, cx + radius, cy);
}

function drawGrowingPolygon(p: p5, cx: number, cy: number, radius: number) {

  if (totalPoints < maxPoints) {
    totalPoints += growthRate;
  }

  const n = Math.floor(totalPoints);
  if (n < 1) return;

  p.stroke(0);
  p.noFill();
  p.strokeWeight(1.5);

  if (n > 1) {
    p.beginShape();
    for (let i = 0; i < n; i++) {
      const angle = p.TWO_PI / n * i;
      const x = cx + radius * p.cos(angle);
      const y = cy + radius * p.sin(angle);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }

  p.strokeWeight(p.width * 0.01);
  for (let i = 0; i < n; i++) {
    const angle = p.TWO_PI / n * i;
    const x = cx + radius * p.cos(angle);
    const y = cy + radius * p.sin(angle);
    p.point(x, y);
  }
}

/* ============================
   UI
============================ */

function updateText() {

  const story = document.getElementById("story");
  const button = document.getElementById("nextBtn");
  const img = document.getElementById("introImage");
  const canvas = document.querySelector("canvas");

  if (!story || !button) return;

  story.innerHTML = stages[stage].text;
  button.innerText = stages[stage].button;

  if (img) img.style.display = stage === 0 ? "block" : "none";
  if (canvas) canvas.style.display = stage === 0 ? "none" : "block";
}

(window as any).nextStage = () => {

  if (stage < stages.length - 1) {
    stage++;
    if (stage === stages.length - 1) totalPoints = 1;
    updateText();
    return;
  }

  totalPoints = 1;
};