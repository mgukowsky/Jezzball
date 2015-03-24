(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  };

  var WallBuilder = Jezzball.WallBuilder = function (options) {
    this.orientation = options.orientation;
    this.pos = options.pos;
    this.game = options.game;
    this.vel = [5, 5];
    if (this.orientation === "N" || this.orientation === "E") {
      this.color = "#FF6600";
    } else {
      this.color = "#0000FF"
    }
    //Used to determine the length of the wall builder each frame
    this.frames = 0;
  };

  WallBuilder.prototype.drawB = function (ctx, jezzballs) {
    var colFlag = false;
    var range = [];
    jezzballs.forEach(function (jezzball) {
      var isCollided = this.isCollidedWithJezzball(jezzball);
      if (typeof isCollided !== "undefined" && isCollided[0] === true){colFlag = true; range = isCollided[1]}
    }.bind(this))
    ctx.beginPath();
    ctx.rect(this.getOriginX(this.frames), this.getOriginY(this.frames), this.getDX(this.frames), this.getDY(this.frames));
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    this.frames += 1
    return [colFlag, range];
  };

  WallBuilder.prototype.getOriginX = function (frames) {
    if (this.orientation === "E") {
      return this.pos[0] - (this.vel[0] * frames);
    } else {
      return this.pos[0];
    }
  };

  WallBuilder.prototype.getOriginY = function (frames) {
    if (this.orientation === "N") {
      return this.pos[1] - (this.vel[1] * frames);
    } else {
      return this.pos[1];
    }
  };

  WallBuilder.prototype.getDX = function (frames) {
    if (this.orientation === "N" || this.orientation === "S") {
      return 10;
    } else {
      return this.vel[0] * frames;
    }
  };

  WallBuilder.prototype.getDY = function (frames) {
    if (this.orientation === "E" || this.orientation === "W") {
      return 10;
    } else {
      return this.vel[1] * frames;
    }
  };

  WallBuilder.prototype.isAtEndOfBoard = function () {
    if (this.orientation === "N" && this.pos[1] - (this.vel[1] * this.frames) < 0){
      return [true, [this.getOriginX(this.frames), this.getOriginX(this.frames) + 10, this.getOriginY(this.frames), this.getOriginY(this.frames) + this.getDY(this.frames)]]
    }
    else if (this.orientation === "E" && this.pos[0] - (this.vel[0] * this.frames) < 0) {
      return [true, [this.getOriginX(this.frames), this.getDX(this.frames), this.getOriginY(this.frames), this.getOriginY(this.frames) + 10]]
    } else if (this.orientation === "S" && this.pos[1] + (this.vel[1] * this.frames) > Jezzball.Game.DIM_Y) {
      return [true, [this.getOriginX(this.frames), this.getOriginX(this.frames) + 10, this.getOriginY(this.frames), this.getOriginY(this.frames) + this.getDY(this.frames)]]
    } else if (this.orientation === "W" && this.pos[0] + (this.vel[0] * this.frames) > Jezzball.Game.DIM_X) {
      return [true, [this.getOriginX(this.frames), this.getOriginX(this.frames) + this.getDX(this.frames), this.getOriginY(this.frames), this.getOriginY(this.frames) + 10]]
    } else {
      return [false];
    }
  };

  WallBuilder.prototype.getEndPos = function () {
    if (this.orientation === "N" || this.orientation === "S") {
      return [this.pos[0], this.pos[1] + (this.vel[1] * this.frames)]
    } else {
      return [this.pos[0] + (this.vel[0] * this.frames), this.pos[1]]
    }
  };

  WallBuilder.prototype.isCollidedWithJezzball = function (jezzball) {
    var endPos = this.getEndPos();
    if (this.orientation === "N") {
      if ((jezzball.pos[0] >= this.getOriginX(this.frames) && jezzball.pos[0] <= this.getOriginX(this.frames) + 10)
        && (jezzball.pos[1] >= this.getOriginY(this.frames) && jezzball.pos[1] <= this.getOriginY(this.frames) + this.getDY(this.frames))) {
        return [true]
      }
    } else if (this.orientation === "S") {
      if ((jezzball.pos[0] >= this.getOriginX(this.frames) && jezzball.pos[0] <= this.getOriginX(this.frames) + 10)
        && (jezzball.pos[1] >= this.getOriginY(this.frames) && jezzball.pos[1] <= this.getOriginY(this.frames) + this.getDY(this.frames))) {
          return [true]
        }
    } else if (this.orientation === "E") {
      if ((jezzball.pos[0] >= this.getOriginX(this.frames) && jezzball.pos[0] <= this.getOriginX(this.frames) + this.getDX(this.frames))
        && (jezzball.pos[1] >= this.getOriginY(this.frames) && jezzball.pos[1] <= this.getOriginY(this.frames) + 10)) {
        return [true]
      }
    } else if (this.orientation === "W") {
      if ((jezzball.pos[0] >= this.getOriginX(this.frames) && jezzball.pos[0] <= this.getOriginX(this.frames) + this.getDX(this.frames))
        && (jezzball.pos[1] >= this.getOriginY(this.frames) && jezzball.pos[1] <= this.getOriginY(this.frames) + 10)) {
        return [true]
      }
    }
  };
})();
