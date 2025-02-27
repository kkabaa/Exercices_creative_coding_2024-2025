import Utils from "./Utils.js";

export default class Particle {
  /**
   * Crée une nouvelle particule avec une position initiale et une position cible
   * @param {number} x - Position x initiale
   * @param {number} y - Position y initiale
   * @param {number} targetX - Position x cible
   * @param {number} targetY - Position y cible
   */
  constructor(x, y, targetX, targetY) {
    // Position et mouvement de la particule
    this.pos = { x, y };
    this.target = { x: targetX, y: targetY };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };

    // Propriétés de la particule
    this.radius = 2;
    this.maxSpeed = 3;
    this.maxForce = 0.1;
    this.slowDownDistance = 50;

    // Gestion de l'état de la particule
    this.isAtTarget = false;
    this.isDead = false;
    this.targetTimer = 0;
    this.fadeOutDuration = 60;

    this.maxLifetime = 500; // Durée de vie maximale d'une particule
    this.lifetime = 0; // Temps de vie actuel

    // force de direction
    this.gravity = { x: 0, y: 10 };
  }
  applyGravity() {
    this.addForce(this.gravity);
  }
  //add force to the particle
  addForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  /**
   * Calcule la force de direction vers la cible
   * Applique un comportement de ralentissement quand la particule s'approche de sa cible
   * @returns {Object} Force de direction {x, y}
   */

  seek() {
    if (this.isDead) return { x: 0, y: 0 };

    const desired = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const distanceToTarget = Utils.getSpeed(desired);
    const currentSpeed = Utils.getSpeed(this.velocity);

    const wasAtTarget = this.isAtTarget;
    if (!this.isAtTarget) {
      this.isAtTarget = distanceToTarget < 0.5 && currentSpeed < 0.1;
    }

    // if (!wasAtTarget && this.isAtTarget) {
    //   this.targetTimer = 0;
    // }

    if (distanceToTarget === 0) return { x: 0, y: 0 };

    let desiredSpeed = this.maxSpeed;
    if (distanceToTarget < this.slowDownDistance) {
      desiredSpeed = this.maxSpeed * (distanceToTarget / this.slowDownDistance);
    }

    const movement = Utils.getDirection(desired, desiredSpeed);
    const steer = {
      x: movement.x - this.velocity.x,
      y: movement.y - this.velocity.y,
    };

    return Utils.getDirection(steer, this.maxForce);
  }

  /**
   * Met à jour la position et l'état de la particule
   * Gère le cycle de vie de la particule (naissance, déplacement, mort)
   */

  update2() {
    this.lifetime++;
    if (!this.isAtTarget) {
      const steering = this.seek();
      this.acceleration.x += steering.x;
      this.acceleration.y += steering.y;
    } else if (this.targetTimer <= 100) {
      this.targetTimer += 1;
      this.acceleration.x = 0;
      this.acceleration.y = 0;
    } else {
      this.acceleration.x += this.gravity.x;
      this.acceleration.y += this.gravity.y;
    }

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    const speed = Utils.getSpeed(this.velocity);
    if (speed > this.maxSpeed) {
      const movement = Utils.getDirection(this.velocity, this.maxSpeed);
      this.velocity.x = movement.x;
      this.velocity.y = movement.y;
    }

    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }
  update() {
    // Incrémente le temps de vie
    this.lifetime++;
    console.log(this.isDead);

    // Vérifie si la particule doit mourir
    if (this.isAtTarget) {
      this.targetTimer++;
      if (this.targetTimer >= this.fadeOutDuration) {
        // this.isDead = true;
        return;
      }
    } else if (this.lifetime >= this.maxLifetime) {
      // Si la particule n'a pas atteint sa cible après maxLifetime
      this.isDead = true;
      // console.log("particle dead");
      return;
    }

    if (this.isDead) {
      // Apply gravity when the particle is dead
      this.addForce(this.gravity);
    } else {
      // Normal steering behavior
      const steering = this.seek();
      this.acceleration.x += steering.x;
      this.acceleration.y += steering.y;
    }

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    const speed = Utils.getSpeed(this.velocity);
    if (speed > this.maxSpeed) {
      const movement = Utils.getDirection(this.velocity, this.maxSpeed);
      this.velocity.x = movement.x;
      this.velocity.y = movement.y;
    }

    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  /**
   * Dessine la particule sur le contexte canvas
   * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu 2D du canvas
   */
  draw(ctx) {
    if (this.isDead) return;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}
