import Circle from "./Circle.js";
import DrawingTool from "./DrawingTool.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();
    //créer un cercle
    this.circle = new Circle(this.width / 2, this.height / 2, 10);
    this.circle.color = "white";
    this.circle.angleX = 180;
    this.circle.speedX = 2;
    this.circle.speedY = 1;
    // create second circle
    this.circle1 = new Circle(this.width / 2, this.height / 2, 10);
    this.circle1.color = "yellow";
    this.circle1.speedX = 1;
    this.circle1.speedY = 4;
    this.circle1.motion_radiusX = 400;
    // this.circle1.angleX=90;
    // create 3rd circle
    this.circle2 = new Circle(this.width / 2, this.height / 2, 10);
    this.circle2.color = "green";
    this.circle2.speedX = 4;
    this.circle2.speedY = 4;
    this.circle2.motion_radiusX = 400;
    // this.circle2.angleX = 90;

    // créer un outil de dessin
    this.drawingTool = new DrawingTool(this.ctx);
    //2e outil de dessin
    this.drawingTool1 = new DrawingTool(this.ctx);
    // deuxième étape : dessiner le canvas
    this.draw();
  }
  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.circle.move();
    this.circle1.move();
    this.circle2.move();

    this.drawingTool.addPoint(this.circle.x, this.circle.y);
    this.drawingTool.addPoint(this.circle1.x, this.circle1.y);
    this.drawingTool1.color = "blue";
     this.drawingTool1.addPoint(this.circle2.x, this.circle2.y);
    this.drawingTool.draw();
    this.drawingTool1.draw();

    this.circle.draw(this.ctx);
    this.circle1.draw(this.ctx);
    //this.circle2.draw(this.ctx);

    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
