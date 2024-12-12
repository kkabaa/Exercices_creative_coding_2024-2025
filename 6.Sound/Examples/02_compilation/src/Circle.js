import BaseApp from "./BaseApp";
import Rotator from "./Rotator";
export default class App extends BaseApp {
  constructor() {
    super();
    this.audioFile = "./audio/track.mp3";
    this.audio = new Audio(this.audioFile);
    this.init();
  }
  init() {
    document.addEventListener("click", (e) => {
      this.play(e);
    });
    document.addEventListener("keydown", (e) => {
      console.log(e);
      this.audio.pause();
      this.isPlaying = false;
    });
    this.rotators = [];
    this.n=50;
    for (let i = 0; i < this.n; i++) {
      this.rotators.push(
        new Rotator(
          i* 100/this.n,
          25,
          this.ctx
        )
      );
    }
 
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.initBroadcast();
    this.setupAnalyser();
  }

  initBroadcast() {
    this.source = this.audioContext.createMediaElementSource(this.audio);
  }

  setupAnalyser() {
    this.analyser = this.audioContext.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    console.log(this.audioContext.destination);
    //expliquer
    this.analyser.fftSize = 2048;
    //expliquer
    this.bufferLength = this.analyser.frequencyBinCount;
    //tableau de data (2 type)
    this.dataFrequency = new Uint8Array(this.bufferLength);
    this.dataFloatFrequency = new Float32Array(this.bufferLength);
    this.dataWave = new Uint8Array(this.bufferLength);
    this.draw();
  }
  updateWaveForm() {
    this.analyser.getByteTimeDomainData(this.dataWave);
  }
  updateFrequency() {
    this.analyser.getByteFrequencyData(this.dataFrequency);
  }
  updatedFloatFrequency() {
    this.analyser.getFloatFrequencyData(this.dataFloatFrequency);
  }
  play(mouse) {
    if (!this.isPlaying) {
      if (!this.audioContext) {
        this.initAudioContext();
      }
      this.audio.play();
      this.isPlaying = true;
    } else {
      // this.audio.pause();
      // this.isPlaying = false;
      let timeToStart =
        (mouse.clientX / window.innerWidth) * this.audio.duration;
      this.audio.currentTime = timeToStart;
    }
  }

  draw() {
    const { ctx, width, height } = this;
    this.ctx.clearRect(0, 0, width, height);
    // Mise à jour des données audio
    this.updateWaveForm();
    this.updateFrequency();
    this.updatedFloatFrequency();

    const dataWave = this.dataWave;
    const dataFrequency = this.dataFrequency;
    const bufferLength = this.bufferLength;

    this.rotators.forEach((rotator, i) => {
      rotator.update(dataFrequency[i*200/this.n+500]);
      rotator.draw();
    });

    requestAnimationFrame(this.draw.bind(this));
  }
}
