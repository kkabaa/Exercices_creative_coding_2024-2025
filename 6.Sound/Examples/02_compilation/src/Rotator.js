export default class Rotator {
  constructor(position, size, context) {
    this.position = position; // Position as a percentage
    this.size = size; // Diameter of the circle
    this.angle = 0; // Current angle in degrees
    this.context = context; // Canvas context
    this.direction = 1;
  }

  update(angleIncrement) {
    if (angleIncrement) {
      if (angleIncrement > 100 && angleIncrement < 255) {
        this.direction *= -1;
        console.log(this.direction);
      }
      // Normalize angle increment to a smaller scale (e.g., 0 to 5 degrees)
      const normalizedIncrement = angleIncrement / 51; // Maps 0-255 to 0-5
      this.angle = (this.angle + this.direction * normalizedIncrement) % 360; // Keep angle within 0-360 degrees
      if (this.angle < 0) this.angle += 360; // Keep angle positive
    }
  }

  draw() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate circle position based on position percentage
    const yOffset = ((this.position / 100) * window.innerHeight) / 2;
    const circleX = centerX + Math.cos(this.angle * (Math.PI / 180)) * yOffset;
    const circleY = centerY - Math.sin(this.angle * (Math.PI / 180)) * yOffset;

    // Draw the circle
    this.context.beginPath();
    this.context.arc(circleX, circleY, this.size / 2, 0, Math.PI * 2);
    if (this.direction > 0) {
      this.context.fillStyle = "red";
    } // Circle color
    else {
      this.context.fillStyle = "blue"; // Circle color
    }
    this.context.fill();
    this.context.closePath();
  }
}
