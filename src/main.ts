import "./style.css";
import p5 from "p5";

/* ============================
   GLOBAL STATE
============================ */

let stage = 0;

/* Polygon Growth */
let totalPoints = 1;
const maxPoints = 120;
const growthRate = 0.15;

/* Geometry */
const radius = 160;

/* ============================
   STAGE CONTENT
============================ */

type StageContent = {
  text: string;
  button: string;
};

const stages: StageContent[] = [
  {
    text: `I was reading a book and came across a simple illustration.<br>
    One idea. Then two. Then three.<br>
    Slowly, shapes began to appear.<br><br>
    Could we begin with a single point…<br>
    and end with a circle?`,
    button: "Let’s begin."
  },
  {
  text: `
  A point has no length.<br>
  No width.<br>
  No height.<br>

  Yet it defines position.
  `,
  button: "Place another point."
},
  {
  text: `
  Two points appear.<br>

  In how many ways can we connect them?<br>

  And how many of those connections are shortest?
  `,
  button: "Add one more point."
},
  {
  text: `
  Three non-collinear points form a triangle.<br>

  If we place three points evenly around a circle,<br>
  how many degrees apart must they be?<br>

  One complete rotation is 360°.
  `,
  button: "Divide again."
},
  {
  text: `
  Now four points.<br>

  What is the angle between consecutive points
  if they are evenly spaced around the circle?<br>

  `,
  button: "Keep dividing."
},
  {
  text: `
  Five points.<br><br>

  Six.<br>
  Seven.<br>
  Eight.<br>

  As the number increases,<br>
  what happens to the angle between them?
  `,
  button: "Watch closely."
},
 {
  text: `
  As we keep adding points —<br>
  edges shorten.<br>
  corners soften.<br>

  <div class="highlight">
    <p>When did it stop being a polygon?</p>
    <p>Is a circle truly different — or just a limit?</p>
    <p>Is smoothness an illusion created by closeness?</p>
  </div>

  <br>

  We kept adding points evenly.<br><br>

  But how did the computer know
  where to place each one?<br>

  What information is necessary
  to determine the position
  of a point around a circle?
  `,
  button: "Watch closely."
}
];

/* ============================
   P5 SKETCH
============================ */

new p5((p: p5) => {

 p.setup = () => {
  const size = Math.min(window.innerWidth * 0.9, 500);
  const canvas = p.createCanvas(size, size * 0.75);
  canvas.parent("app");
  updateText();
};

p.windowResized = () => {
  const size = Math.min(window.innerWidth * 0.9, 500);
  p.resizeCanvas(size, size * 0.75);
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

  switch (stage) {

    case 1:
      drawPoint(p, cx, cy);
      break;

    case 2:
      drawTwoPoints(p, cx, cy);
      break;

    case 3:
      drawRegularPolygon(p, 3);
      break;

    case 4:
      drawRegularPolygon(p, 4);
      break;

    case 5:
      drawRegularPolygon(p, 5);
      drawCenter(p, cx, cy);
      drawRadiusLine(p, cx, cy, 5);
      break;

    case 6:
      drawGrowingPolygon(p, cx, cy);
      break;
  }
}

/* ============================
   GEOMETRY FUNCTIONS
============================ */

function drawPoint(p: p5, x: number, y: number) {
  p.strokeWeight(8);
  p.point(x, y);
}

function drawTwoPoints(p: p5, cx: number, cy: number) {
  p.strokeWeight(8);
  p.point(cx - 60, cy);
  p.point(cx + 60, cy);

  p.strokeWeight(2);
  p.line(cx - 60, cy, cx + 60, cy);
}

function drawCenter(p: p5, x: number, y: number) {
  p.strokeWeight(6);
  p.point(x, y);
}

function drawRegularPolygon(p: p5, sides: number) {

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

function drawRadiusLine(p: p5, cx: number, cy: number, sides: number) {

  const angle = p.TWO_PI / sides * 0;
  const x = cx + radius * p.cos(angle);
  const y = cy + radius * p.sin(angle);

  p.strokeWeight(2);
  p.line(cx, cy, x, y);
}

/* ============================
   GROWING POLYGON
============================ */

function drawGrowingPolygon(p: p5, cx: number, cy: number) {

  // Gradual growth
  if (totalPoints < maxPoints) {
    totalPoints += growthRate;
  }

  const n = Math.floor(totalPoints);
  if (n < 1) return;

  p.stroke(0);
  p.noFill();
  p.strokeWeight(1.5);

  // Draw polygon edges
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

  // Draw visible points
  p.strokeWeight(4);
  for (let i = 0; i < n; i++) {

    const angle = p.TWO_PI / n * i;
    const x = cx + radius * p.cos(angle);
    const y = cy + radius * p.sin(angle);

    p.point(x, y);
  }
}

/* ============================
   UI CONTROL
============================ */

function updateText() {
  const story = document.getElementById("story");
  const button = document.getElementById("nextBtn");
  const img = document.getElementById("introImage");
  const canvas = document.querySelector("canvas");

  if (!story || !button) return;

  story.innerHTML = stages[stage].text;
  button.innerText = stages[stage].button;

  // Show image only on first page
  if (img) {
    img.style.display = stage === 0 ? "block" : "none";
  }

  // Hide canvas only on first page
  if (canvas) {
    canvas.style.display = stage === 0 ? "none" : "block";
  }
}

(window as any).nextStage = () => {

  if (stage < stages.length - 1) {
    stage++;

    if (stage === stages.length - 1) {
      totalPoints = 1; // reset growth
    }

    updateText();
    return;
  }

  // Replay final animation
  if (stage === stages.length - 1) {
    totalPoints = 1;
  }
};
