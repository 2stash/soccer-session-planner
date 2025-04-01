export function is_mouse_in_circle(x, y, shape) {
  let shape_left = shape.position.startX - shape.radius;
  let shape_right = shape.position.startX + shape.radius;
  let shape_top = shape.position.startY - shape.radius;
  let shape_bottom = shape.position.startY + shape.radius;
  if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
    return true;
  }

  return false;
}

export function is_mouse_in_arrow(x, y, arrow) {
  // arrow starting and ending points can be on either side, so need to find which is farthest left and right, and farthest top and bottom

  const padding = 10; // padding to make arrow clicking on easier
  let shape_left =
    arrow.position.startX < arrow.position.endX
      ? arrow.position.startX - padding
      : arrow.position.endX - padding;
  let shape_right =
    arrow.position.startX > arrow.position.endX
      ? arrow.position.startX + padding
      : arrow.position.endX + padding;
  let shape_top =
    arrow.position.startY < arrow.position.endY
      ? arrow.position.startY - padding
      : arrow.position.endY - padding;
  let shape_bottom =
    arrow.position.startY > arrow.position.endY
      ? arrow.position.startY + padding
      : arrow.position.endY + padding;

  if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
    return true;
  }
  return false;
}

export function draw(element, context) {
  const currentX = element.position.startX;
  const currentY = element.position.startY;
  if (element.shape === 'circle') {
    if (element.isMoving) {
      drawMoving(context, currentX, currentY, element.radius);
    }
    context.beginPath();

    context.arc(currentX, currentY, element.radius, 0, 2 * Math.PI);
    context.fillStyle = element.color;
    context.fill();

    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.fillText(element.number, currentX - 10, currentY + 10);
  } else if (element.shape === 'triangle') {
    if (element.isMoving) {
      drawMoving(context, currentX, currentY, element.radius);
    }
    context.beginPath();
    context.moveTo(currentX, currentY - 25);
    context.lineTo(currentX - 25, currentY + 25);
    context.lineTo(currentX + 25, currentY + 25);
    context.closePath();
    context.fillStyle = element.color;
    context.fill();

    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.fillText(element.number, currentX - 8, currentY + 18);
  } else if (element.shape === 'arrow') {
    if (element.isMoving) {
      drawMovingArrow(context, element);
    }
    const x_center = element.position.endX;
    const y_center = element.position.endY;

    let angle;
    let x;
    let y;

    context.strokeStyle = 'rgba(0,0,0,1)'; // set Line color
    context.fillStyle = element.color; // set arrow head color
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(element.position.startX, element.position.startY);

    context.lineTo(element.position.endX, element.position.endY);
    context.stroke();
    context.closePath();

    context.beginPath();

    angle = Math.atan2(
      element.position.endY - element.position.startY,
      element.position.endX - element.position.startX
    );
    x = element.radius * Math.cos(angle) + x_center;
    y = element.radius * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI);
    x = element.radius * Math.cos(angle) + x_center;
    y = element.radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI);
    x = element.radius * Math.cos(angle) + x_center;
    y = element.radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
  }
}

function drawMoving(context, currentX, currentY, radius) {
  context.beginPath();
  context.strokeStyle = 'rgba(0,221,245,.5)';

  context.rect(currentX - radius - 5, currentY - radius - 5, 60, 60);
  context.stroke();
}

function drawMovingArrow(context, element) {
  let xLength = Math.abs(element.position.startX - element.position.endX);
  let yLength = Math.abs(element.position.startY - element.position.endY);
  context.beginPath();
  context.strokeStyle = 'rgba(0,221,245,.5)';

  context.rect(
    (element.position.startX + element.position.endX) / 2 - (30 + xLength) / 2,
    (element.position.startY + element.position.endY) / 2 - (30 + yLength) / 2,
    xLength + 30,
    yLength + 30
  );
  context.stroke();
}
