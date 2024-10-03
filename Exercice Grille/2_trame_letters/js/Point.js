export default class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(ctx) {
    // Save the current context state
    ctx.save();


    // Set the font size based on the radius
    ctx.font = `${this.radius * 2}px sans-serif`;
    ctx.fillStyle="white";

    // Center the text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the letter 'o'
    ctx.fillText("O", this.x, this.y);

    // Restore the context state
    ctx.restore();
/*
    // Draw a circle around the point
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    //ctx.closePath();
    */
  }
}
