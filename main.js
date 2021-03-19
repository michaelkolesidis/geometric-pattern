let backgroundPalette = '#1d1d1b';
let outlinePalette = '#f2f2e7';
let colorPalette = [
  '#e74368',
  '#f28065',
  '#e6be5c',
  '#06c398',
  '#107d9f',
  '#063443',
];

let sineScale = 0.01;

let gridColumnQty;
let gridRowQty;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeJoin(ROUND);

  gridColumnQty = floor(random(3, 7));
  let moduleSize = width / gridColumnQty;
  gridRowQty = ceil(height / moduleSize);

  seed = random(1000);

  describe(
    'Draw a grid of squares and within each square a geometric graphic is drawn that varies from simple shapes such as circles and rhombuses, to more complex shapes such as stars and others that resemble a two-pronged ax and a crown. Elements are randomly filled from a palette of red, yellow, green, pink, and black. The internal designs of each square grow and shrink over time.'
  );
}

function draw() {
  background(220);
  randomSeed(seed);
  grid(0, 0, gridColumnQty, gridRowQty, width);
}

function grid(xInitial, yInitial, columnQty, rowQty, totalWidth) {
  stroke(outlinePalette);
  strokeWeight(2);

  let moduleSize = totalWidth / columnQty;
  let movementDifferential = 0;
  for (let j = 0; j < rowQty; j++) {
    for (let i = 0; i < columnQty; i++) {
      let x = xInitial + i * moduleSize;
      let y = yInitial + j * moduleSize;

      let colorIndex = floor(random(colorPalette.length - 1));
      fill(colorPalette[colorIndex]);
      rect(x, y, moduleSize, moduleSize);
      fill(colorPalette[(colorIndex + 1) % colorPalette.length]);

      let movement = map(
        sin(frameCount * sineScale + movementDifferential),
        -1,
        1,
        0,
        1
      );

      let selector = floor(random(6 + 3));

      if (selector === 0) {
        let outerRadius = moduleSize / 2 - 5;
        let innerRadius = outerRadius * movement;
        let pointsQty = [4, 6, 8, 10, 12, 14, 16, 18][floor(random() * 8)];
        star(
          x + moduleSize / 2,
          y + moduleSize / 2,
          innerRadius,
          outerRadius,
          pointsQty,
          0
        );
      }

      if (selector === 1) {
        let diameter = random(moduleSize / 2, moduleSize) * movement;
        circle(x + moduleSize / 2, y + moduleSize / 2, diameter);
      }

      if (selector === 2) {
        let points = [3, 5, 7, 9, 11, 13][floor(random(6))];
        let pointsHeight = map(movement, 0, 1, 0.2, 0.8);
        doubleCrown(x, y, moduleSize, moduleSize, points, pointsHeight);
      }

      if (selector === 3) {
        let handleWidth = map(movement, 0, 1, 0.2, 0.8);
        axe(x, y, moduleSize, moduleSize, handleWidth);
      }

      if (selector === 4) {
        let openingWidth = random(0.4, 1) * movement;
        diamond(x, y, moduleSize, moduleSize, openingWidth);
      }
      if (selector >= 5 && moduleSize > 60) {
        grid(x, y, 2, 2, moduleSize);
      }
      movementDifferential += 1;
    }
  }
}

function star(x, y, innerRadius, outerRadius, pointsQty, initialAngle) {
  let step = TWO_PI / pointsQty;
  beginShape();
  for (i = 0; i < pointsQty; i++) {
    ang = initialAngle + step * i;
    innerX = x + cos(ang) * innerRadius;
    innerY = y + sin(ang) * innerRadius;
    vertex(innerX, innerY);
    outerX = x + cos(ang + step / 2.0) * outerRadius;
    outerY = y + sin(ang + step / 2.0) * outerRadius;
    vertex(outerX, outerY);
  }
  endShape(CLOSE);
}

function simpleCrown(x, y, width, height, pointsQty, pointsHeightRelative) {
  let pointsHeight = height * pointsHeightRelative;
  let pointsOffset = width / (pointsQty - 1);
  let pointX, pointY;
  beginShape();
  for (i = 0; i < pointsQty; i++) {
    pointX = x + i * pointsOffset;
    pointY = y;
    if (i % 2 != 0) {
      pointY = y + pointsHeight;
    }
    vertex(pointX, pointY);
  }
  vertex(x + width, pointY + height);
  vertex(x, pointY + height);
  endShape(CLOSE);
}

function doubleCrown(x, y, width, height, pointsQty, pointsHeightRelative) {
  let pointsHeight = (height * pointsHeightRelative) / 2;
  let pointsOffset = width / (pointsQty - 1);
  beginShape();
  for (let i = 0; i < pointsQty; i++) {
    var pointX = x + i * pointsOffset;
    var pointY = y;
    if (i % 2 !== 0) {
      pointY = y + pointsHeight;
    }
    vertex(pointX, pointY);
  }
  for (let i = 0; i < pointsQty; i++) {
    let pointX = x + width - i * pointsOffset;
    let pointY = y + height;
    if (i % 2 !== 0) {
      pointY = y + height - pointsHeight;
    }
    vertex(pointX, pointY);
  }
  endShape(CLOSE);
}

function axe(x, y, width, height, handleWidthRelative) {
  let handleWidth = (width * handleWidthRelative) / 2;
  beginShape();
  vertex(x, y);
  vertex(x + handleWidth, y + handleWidth);
  vertex(x + handleWidth, y);
  vertex(x + (width - handleWidth), y);
  vertex(x + (width - handleWidth), y + handleWidth);
  vertex(x + width, y);
  vertex(x + width, y + height);
  vertex(x + (width - handleWidth), y + (height - handleWidth));
  vertex(x + (width - handleWidth), y + height);
  vertex(x + handleWidth, y + height);
  vertex(x + handleWidth, y + (height - handleWidth));
  vertex(x, y + height);
  endShape(CLOSE);
}

function diamond(x, y, width, height, openingRelative) {
  let openingWidth = (width * openingRelative) / 2;
  beginShape();
  vertex(x + openingWidth, y + height / 2);
  vertex(x + width / 2, y);
  vertex(x + (width - openingWidth), y + height / 2);
  vertex(x + width / 2, y + height);
  endShape(CLOSE);
}
