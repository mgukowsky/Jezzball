(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  };

  var Cell = Jezzball.Cell = function (options) {
    this.pos = options.pos;
    this.color = options.color;
    this.game = options.game;
  };

  Cell.prototype.drawB = function (ctx) {
    ctx.beginPath();
    ctx.rect(this.pos[0], this.pos[1], 10, 10);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  };

})();
