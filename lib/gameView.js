(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  }

  var GameView =Jezzball.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.timerId = null;
  };

  GameView.prototype.setupKeys = function () {
    $("canvas").on("click", function(event) {
      if (this.game.noBuildersOnScreen === true) {
        this.game.generateBuilders(event.offsetX, event.offsetY)
      }
    }.bind(this));
    // $("canvas").on( "scroll", function(event) { console.log(event) });
    document.getElementById("jezzball")
      .addEventListener("mousewheel",
                        function(event){$("canvas")
                          .toggleClass("horizontal-wall vertical-wall")},
                        false);
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.game.addJezzball();
    this.game.setupCells();
    this.timerId = setInterval(
      function () {
        gameView.game.step();
        gameView.game.draw(gameView.ctx);
        gameView.game.builderRemoveCheck();
      }, 1000 / Jezzball.Game.FPS
    );

    this.setupKeys();
  };
})();
