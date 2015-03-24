(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  };

  var Cell = Jezzball.Cell = function (options) {
    this.pos = options.pos;
    this.color = options.color;
    this.game = options.game;
    this.solid = false;
    this.radius = 10;
  };

  Cell.prototype.drawB = function (ctx) {
    ctx.beginPath();
    ctx.rect(this.pos[0], this.pos[1], 10, 10);
    if (this.solid === true) {
      this.color = "#000";
    }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  };

  Cell.prototype.makeCellSolidCheck = function (range) {
    if ((this.pos[0] >= range[0] && this.pos[0] <= range[1])
        && (this.pos[1] >= range[2] && this.pos[1] <= range[3])) {
      window.SCORE += 10;
      this.solid = true;
    }
  };
})();
