import BaseApp from "./BaseApp";
import { loadSVG } from "./utils/Utils";

export default class App extends BaseApp {
  constructor() {
    super();
    this.audioFile = "./noise.m4a";
    this.audio = new Audio(this.audioFile);
    this.audio.controls = true;
    document.body.appendChild(this.audio);
    this.isPlaying = false;

    this.particles = [];
    this.init();
  }

  async init() {
    // Load SVG first
    try {
      const { points, viewBox } = await loadSVG("/Fichier 2.svg");
      this.svgPoints = points;
      this.svgViewBox = viewBox;

      document.addEventListener("click", this.handleClick.bind(this));
      this.draw();
    } catch (error) {
      console.error("Error loading SVG:", error);
    }
  }

  handleClick(e) {
    if (!this.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.setup();
      this.createParticles();
    }

    // Update audio playback position
    const positionX = e.clientX;
    const percentage = positionX / window.innerWidth;
    this.audio.currentTime = this.audio.duration * percentage;

    // Toggle play/pause
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  createParticles() {
    if (!this.svgPoints) return;

    // Calculate scale to fit SVG to canvas
    const scaleX = this.width / this.svgViewBox.width;
    const scaleY = this.height / this.svgViewBox.height;
    const scale = Math.min(scaleX, scaleY) * 0.8; // 0.8 to add some margin

    // Calculate offset to center the letter
    const offsetX = (this.width - this.svgViewBox.width * scale) / 2;
    const offsetY = (this.height - this.svgViewBox.height * scale) / 2;

    this.particles = this.svgPoints.map((point) => {
      const x = point.x * scale + offsetX;
      const y = point.y * scale + offsetY;
      return new Particle(x, y, 4, 1);
    });
  }

  setup() {
    // on crée un noeud source
    this.source = this.audioContext.createMediaElementSource(this.audio);
    // on crée un noeud d'analyse
    this.analyser = this.audioContext.createAnalyser();
    // crée un noeud de destination
    this.destination = this.audioContext.destination;
    // on connecte le noeud source à l'analyseur
    this.source.connect(this.analyser);
    // on connecte l'analyseur à la destination
    this.analyser.connect(this.destination);
    // on definie la taille du buffer
    this.analyser.fftSize = 2048;
    // on crée un tableau de données pour l'anayse de frequences (en Byte)
    this.dataArray = new Uint8Array(this.analyser.fftSize);
    // on crée un tableau de données pour l'anayse de waveform (en Byte)
    this.waveArray = new Uint8Array(this.analyser.fftSize);
  }

  draw() {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.dataArray);
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw particles affected by frequency data
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const frequency = this.dataArray[i % this.dataArray.length];
      particle.update(frequency);
      particle.draw(this.ctx);
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}

class Particle {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.size = size;
    this.speed = speed;
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
  }

  update(frequency) {
    // Adjust size based on frequency magnitude
    this.size = Math.max(2, frequency / 15);

    // Create a more dynamic movement based on frequency
    const angle = (frequency / 255) * Math.PI * 2;
    const distance = (frequency / 255) * 30;

    this.x = this.originalX + Math.cos(angle) * distance;
    this.y = this.originalY + Math.sin(angle) * distance;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
