export default class Letter {
  constructor(ctx, letter, x, y) {
    this.ctx = ctx;
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.color = "white";
    this.scale = 1;
    this.history = [];
    this.state = false;
    this.timer = 0;
    this.i = 0;
  }

  update() {
    this.history.push(this.color);
    if (this.history.length > 100) {
      this.history.shift();
    }
  }
  colorUpdate(color) {
    this.color = color;

    this.history.push(color);
    if (this.history.length > 100) {
      this.history.shift();
    }
  }
  scaleUpdate(scale) {
    this.scale = scale;
  }
  draw() {
    if (this.state) {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.fillStyle = this.history[this.i];
      this.ctx.fillText(this.letter, 0, 0);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      this.i++;
      if (this.i >= this.history.length) {
        this.i = 0;
        this.state = false;
      }
    } else {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(this.letter, 0, 0);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      this.timer++;
      if (this.timer > 50) {
        this.state = true;
        this.timer = 0;
      }
    }
  }
}
