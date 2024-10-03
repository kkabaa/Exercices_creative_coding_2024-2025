export default class App{
    contructor() {
      this.canvas;
      this.ctx;
    }
  
   createCanvas(width, height) {
  this.canvas = document.createElement("canvas");
  this.canvas.width = width;
  this.canvas.height = height;
  document.body.appendChild(this.canvas);
  }
  
   circle(x, y, radius, color) {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.strokeStyle = color;
  }
  }