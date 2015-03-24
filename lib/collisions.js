(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  }

  var Collisions = Jezzball.Collisions = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
  };

  Collisions.prototype.isJezzballCollidedWithBuilder(jezzball, builder)
})();
