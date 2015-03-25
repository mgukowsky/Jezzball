(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  }

  var GameView = Jezzball.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.timerId = null;
  };

  GameView.prototype.setupKeys = function () {
    $("canvas").on("click", function(event) {
      if (this.game.noBuildersOnScreen === true && !$("button").hasClass("clicked")) {
        this.game.generateBuilders(event.offsetX, event.offsetY)
      }
    }.bind(this));
    $("button").on("click", function(event) {
      if ($(event.target).hasClass("clicked")) {
        $(event.target).html("Click to PAUSE");
      } else {
        $(event.target).html("Click to RESUME");
      }
      $(event.target).toggleClass("clicked");
      window.PAUSED = !window.PAUSED;
    })
    $("body").on("keydown", function(event) {
      if (event.which === 16) {
        $("canvas")
          .toggleClass("horizontal-wall vertical-wall")
      }
    });
    // $("canvas").on( "scroll", function(event) { console.log(event) });
    document.getElementById("jezzball")
      .addEventListener("mousewheel",
                        function(event){
                          event.preventDefault();
                          $("canvas")
                            .toggleClass("horizontal-wall vertical-wall")
                          },
                        false);
  };

  GameView.prototype.winCheck = function () {
    if (window.LIVES === 0) {
      return true;
    }
  };

  GameView.prototype.gameEnd = function () {
    this.game.jezzballs = [];
    this.game.jezzcells = [];
    this.game.builders = [];
    $("section.lives").html(window.LIVES);
    $("button").addClass("restart").html("click to RESTART")
    $("button").off(); $("canvas").off(); $("body").off;
    $("button").on("click", function () {
      $("button").removeClass("restart");
      this.game = new Jezzball.Game();
      this.game.addJezzball();
      this.game.setupCells();
      this.setupKeys();
      window.SCORE = 0;
      window.LIVES = 3;
    }.bind(this))
    this.ctx.font="50px Georgia";
    this.ctx.fillText("Game Over!",50,100);
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.game.addJezzball();
    this.game.addJezzball();
    this.game.setupCells();
    window.SCORE = 0;
    window.LIVES = 3;
    window.LEVEL = 1;
    window.CLEARED = 0;
    window.PAUSED = true;
    this.timerId = setInterval(
      function () {
        if (window.PAUSED) {
          return null;
        }
        else if (this.winCheck() === true) {
          this.gameEnd();
        } else {
          $("section.score").html(window.SCORE);
          $("section.lives").html(window.LIVES);
          $("section.level").html(window.LEVEL);
          $("section.cleared").html(window.CLEARED + "%");
          gameView.game.step();
          gameView.game.draw(gameView.ctx);
          gameView.game.builderRemoveCheck();
        }
      }.bind(this), 1000 / Jezzball.Game.FPS
    );

    this.setupKeys();
  };
})();
