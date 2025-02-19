export class Shape {
  constructor({
    position = { x: 0, y: 0 },
    shape = 'circle',
    number = 0,
    color = 'rgba(255,0,0,1)',
    isMoving = false,
    radius = 25,
  }) {
    this.position = position;
    this.number = number;
    this.color = color;
    this.isMoving = isMoving;
    this.shape = shape;
    this.radius = radius;
  }

  draw(context, offsets) {
    const currentX = this.position.x - offsets.offset_x;
    const currentY = this.position.y - offsets.offset_y;
    if (this.shape === 'circle') {
      context.beginPath();

      context.arc(currentX, currentY, this.radius, 0, 2 * Math.PI);
      context.fillStyle = this.color;
      context.fill();

      context.font = '30px Arial';
      context.fillStyle = 'white';
      context.fillText(this.number, currentX - 10, currentY + 10);
    } else if (this.shape === 'triangle') {
      context.beginPath();
      context.moveTo(currentX, currentY - 25);
      context.lineTo(currentX - 25, currentY + 25);
      context.lineTo(currentX + 25, currentY + 25);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();

      context.font = '30px Arial';
      context.fillStyle = 'white';
      context.fillText(this.number, currentX - 8, currentY + 18);
    }
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

export class ArrowStarter {
  constructor() {
    this.color = 'black';
    this.shape = 'arrow';
  }
}
