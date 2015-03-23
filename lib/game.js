(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  }


  var Game = Jezzball.Game = function () {
    this.jezzballs = [];
    this.jezzcells = [];
    this.builders = [];
    this.noBuildersOnScreen = true;
  };

  Game.BG_COLOR = "#CCC";
  Game.DIM_X = 500;
  Game.DIM_Y = 300;
  Game.FPS = 30;

  Game.prototype.addJezzball = function () {
    this.jezzballs.push (new Jezzball.MovingObject({
      pos: Jezzball.MovingObject.prototype.getRandomPos(),
      vel: [4, 4],
      radius: 7,
      color: "#F00",
      game: this
    }))
  };

  Game.prototype.setupCells = function (ctx) {
    var col = 0;
    while (col < 500) {
      var row = 0;
      while (row < 300) {
        var cell = new Jezzball.Cell({
          pos: [col, row],
          color: "#CCC",
          game: this
        });
        this.jezzcells.push(cell)
        row += 10
      }
      col += 10
    }
    // console.log(this.jezzcells);
  }

  Game.prototype.step = function () {
    this.moveObjects();
    // this.checkCollisions;
  };

  Game.prototype.moveObjects = function () {
    this.jezzballs.forEach(function (jezzball) {
      jezzball.move();
    });
  };

  Game.prototype.generateBuilders = function (x, y) {
    if ($("canvas").hasClass("horizontal-wall")) {
      this.builders.push( new Jezzball.WallBuilder ({
        pos: [x, y],
        game: this,
        orientation: "E"
      }));
      this.builders.push( new Jezzball.WallBuilder ({
        pos: [x, y],
        game: this,
        orientation: "W"
      }));
    } else {
      this.builders.push( new Jezzball.WallBuilder ({
        pos: [x, y],
        game: this,
        orientation: "N"
      }));
      this.builders.push( new Jezzball.WallBuilder ({
        pos: [x, y],
        game: this,
        orientation: "S"
      }));
    }
    this.noBuildersOnScreen = false;
  };

  Game.prototype.builderEndCheck = function () {
    this.builders.forEach(function(builder) {
      if (builder.isAtEndOfBoard() === true) {
        this.builders = _.without(this.builders, builder);
      }
    }.bind(this))
  };

  Game.prototype.builderRemoveCheck = function () {
    this.builderEndCheck();
    if (this.builders.length <= 0) {
      this.noBuildersOnScreen = true;
    }
  }
  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.jezzcells.forEach(function (cell) {
      cell.drawB(ctx);
    });

    this.builders.forEach(function (builder) {
      builder.drawB(ctx);
    });

    this.jezzballs.forEach(function (object) {
      object.draw(ctx);
    });

  };
})();
