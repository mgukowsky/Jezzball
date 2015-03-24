(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  }

  var MovingObject = Jezzball.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
  };

  MovingObject.prototype.collideWith = function (otherObject) {
    ; // default do nothing
  };

  MovingObject.prototype.getRandomPos = function () {
    //6 accounts for radius of Jezzballs
    var x = Math.floor(Math.random() * (8, Jezzball.Game.DIM_X - 8));
    var y = Math.floor(Math.random() * (8, Jezzball.Game.DIM_Y - 8));
    return [x, y];
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var centerDist = Jezzball.Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  };

  MovingObject.prototype.isCollidedWithCell = function (cell) {
    // var touching =  ((this.pos[0] >= cell.pos[0] ||
    //                   this.pos[0] <= pos[1])
    //                 && (this.pos[1] >= pos[2] ||
    //                   this.pos[1] <= pos[3]))
    // if (touching === true && cell.solid === true) {
    //   return true;
    // }
    if (cell.solid === true) {
      return true;
      console.log("HERE")
    }
  };

  MovingObject.prototype.isCollidedWithBorder = function (pos) {
    return (pos[0] <= 7 ||
            pos[0] >= Jezzball.Game.DIM_X - 7 ||
            pos[1] <= 7 ||
            pos[1] >= Jezzball.Game.DIM_Y - 7);
  };

  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype.move = function () {
    this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];

    // if (this.game.isOutOfBounds(this.pos)) {
    //   if (this.isWrappable) {
    //     this.pos = this.game.wrap(this.pos);
    //   } else {
    //     this.remove();
    //   }
    // }
    if (this.isCollidedWithBorder(this.pos)) {
      this.updateVel();
    }
  };

  MovingObject.prototype.updateVel = function () {
    if ((this.pos[0] <= 7 || this.pos[0] >= Jezzball.Game.DIM_X - 7 )
        && (this.pos[1] <= 7 || this.pos[1] >= Jezzball.Game.DIM_Y - 7 )) {
      this.vel[0] = this.vel[0] * -1;
      this.vel[1] = this.vel[1] * -1;
    }
    else if (this.pos[0] <= 7 || this.pos[0] >= Jezzball.Game.DIM_X - 7 ) {
      this.vel[0] = this.vel[0] * -1;
    } else {
      this.vel[1] = this.vel[1] * -1;
    }
    // if (this.vel[0] > 0 && this.vel[1] > 0)
  };

  MovingObject.prototype.updateVelCell = function (cell) {
    this.vel[0] = this.vel[0] * -1;
    this.vel[1] = this.vel[1] * -1;
  };

  MovingObject.prototype.remove = function () {
    this.game.remove(this);
  };
})();
