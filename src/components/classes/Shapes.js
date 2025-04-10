export class Shape {
  constructor({
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    shape = 'circle',
    number = 0,
    color = 'rgba(255,0,0,1)',
    isMoving = false,
    radius = 25,
  }) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.number = number;
    this.color = color;
    this.isMoving = isMoving;
    this.shape = shape;
    this.radius = radius;
  }
}

export class Triangle {
  constructor() {
    this.color = 'rgba(0,0,255,1)';
    this.shape = 'triangle';
  }
}

export class Circle {
  constructor() {
    this.color = 'rgba(255,0,0,1)';
    this.shape = 'circle';
  }
}

export class Arrow {
  constructor() {
    this.color = 'black';
    this.shape = 'arrow';
  }
}
