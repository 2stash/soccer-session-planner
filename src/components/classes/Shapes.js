export class Shape {
  constructor({
    position = { startX: 0, startY: 0, endX: 0, endY: 0 },
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

  draw(context) {
    const currentX = this.position.startX;
    const currentY = this.position.startY;
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
    } else if (this.shape === 'arrow') {
      const x_center = this.position.endX;
      const y_center = this.position.endY;

      let angle;
      let x;
      let y;

      context.strokeStyle = 'rgba(0,0,0,1)'; // set Line color
      context.fillStyle = this.color; // set arrow head color
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(this.position.startX, this.position.startY);

      context.lineTo(this.position.endX, this.position.endY);
      context.stroke();
      context.closePath();

      context.beginPath();

      angle = Math.atan2(
        this.position.endY - this.position.startY,
        this.position.endX - this.position.startX
      );
      x = this.radius * Math.cos(angle) + x_center;
      y = this.radius * Math.sin(angle) + y_center;

      context.moveTo(x, y);

      angle += (1.0 / 3.0) * (2 * Math.PI);
      x = this.radius * Math.cos(angle) + x_center;
      y = this.radius * Math.sin(angle) + y_center;

      context.lineTo(x, y);

      angle += (1.0 / 3.0) * (2 * Math.PI);
      x = this.radius * Math.cos(angle) + x_center;
      y = this.radius * Math.sin(angle) + y_center;

      context.lineTo(x, y);

      context.closePath();

      context.fill();
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

export class Arrow {
  constructor() {
    this.color = 'black';
    this.shape = 'arrow';
  }
}
