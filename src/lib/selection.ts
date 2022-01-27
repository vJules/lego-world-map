export const makeSelection = (topLeft, bottomRight) => {
  const selectedSquares = findSelectedSquares(topLeft, bottomRight);
  let selectedDots = [];
  selectedSquares.forEach((square) => {
    selectedDots = [
      ...selectedDots,
      ...findSelectedDotsInSquare(square, topLeft, bottomRight),
    ];
  });

  return selectedDots;
};

const rectanglesIntersect = (
  minAx,
  minAy,
  maxAx,
  maxAy,
  minBx,
  minBy,
  maxBx,
  maxBy
) => {
  const aLeftOfB = maxAx < minBx;
  const aRightOfB = minAx > maxBx;
  const aAboveB = minAy > maxBy;
  const aBelowB = maxAy < minBy;

  return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
};

const findSelectedDotsInSquare = (square, topLeft, bottomRight) => {
  const foundDots = [];
  const dotHitboxes = square.getElementsByClassName("dot__hitbox");
  for (let index = 0; index < dotHitboxes.length; index++) {
    const dot = dotHitboxes[index];
    var box = dot.getBoundingClientRect();
    if (
      rectanglesIntersect(
        topLeft.x,
        topLeft.y,
        bottomRight.x,
        bottomRight.y,
        box.left,
        box.top,
        box.right,
        box.bottom
      )
    ) {
      foundDots.push(dot);
    }
  }
  return foundDots;
};

const findSelectedSquares = (topLeft, bottomRight) => {
  const foundSquares = [];
  const allSquares = document.getElementsByClassName("square");
  for (let index = 0; index < allSquares.length; index++) {
    const square = allSquares[index];
    var box = square.getBoundingClientRect();
    if (
      rectanglesIntersect(
        topLeft.x,
        topLeft.y,
        bottomRight.x,
        bottomRight.y,
        box.left,
        box.top,
        box.right,
        box.bottom
      )
    ) {
      foundSquares.push(square);
    }
  }
  return foundSquares;
};
