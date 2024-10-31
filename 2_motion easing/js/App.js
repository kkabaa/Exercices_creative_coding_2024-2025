import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;

    // premier étape : créer le canvas
    this.createCanvas();
    //créer un cercle
    this.letter = new Letter(this.width / 2, this.height / 2, 100);
    // initialiser l'interaction click
    this.initInteraction();
    // dessiner le canvas
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

  initInteraction() {
    document.addEventListener("click", (e) => {
      // récupérer la position du click
      // et l'appliquer au cercle
      // this.letter.targetx = e.x;
      // this.letter.targety = e.y;
      this.letter.reset(e.x, e.y);
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // dessiner le cercle
    this.letter.update();
    this.letter.dessine(this.ctx);
    // faire bouger le cercle
    // this.letter.x += Math.sin(this.letter.x);
    // this.letter.y += 1;
    if (this.letter.y > this.height) {
      this.letter.y = 0;
    }
    if(this.letter.x > this.width){
      this.letter.x = 0;
    }
    if (this.radius > 300) {
      this.radius = 300;
    }
    if(this.letter.radius < 50){
   
    
    this.letter.dessine2(this.ctx);
    }
    // if (this.radius < 1) {
    //   this.letter.dessine2(this.ctx);
    // }
    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
