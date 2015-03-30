(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  }


  var Game = Jezzball.Game = function () {
    this.jezzballs = [];
    this.jezzcells = [];
    this.builders = [];
    this.noBuildersOnScreen = true;
    this.subgrids = [];
  };

  Game.BG_COLOR = "#EEE";
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
    var counter = 0;
    while (col < 500) {
      var row = 0;
      while (row < 300) {
        var cell = new Jezzball.Cell({
          pos: [col, row],
          color: "#EEE",
          game: this,
          id: counter
        });
        this.jezzcells.push(cell)
        row += 10
        counter += 1;
      }
      col += 10
    }
    // console.log(this.jezzcells);
  };

  Game.prototype.getCellByPos = function (pos) {
    pos = pos[0] + "" + pos[1];
    return _.findWhere(this.jezzcells, {posString: pos});
  };

  // Game.prototype.addCelltoSubgrid = function (subgrid, pos) {
  //   this.recursiveSubgridCreation(subgrid, [pos[0], pos[1] - 10]); // N
  //   this.recursiveSubgridCreation(subgrid, [pos[0] + 10, pos[1] - 10]); // NE
  //   this.recursiveSubgridCreation(subgrid, [pos[0] + 10, pos[1]]); // E
  //   this.recursiveSubgridCreation(subgrid, [pos[0] + 10, pos[1] + 10]); // SE
  //   this.recursiveSubgridCreation(subgrid, [pos[0], pos[1] + 10]); // S
  //   this.recursiveSubgridCreation(subgrid, [pos[0] - 10, pos[1] + 10]); // SW
  //   this.recursiveSubgridCreation(subgrid, [pos[0] - 10, pos[1]]); // W
  //   this.recursiveSubgridCreation(subgrid, [pos[0] - 10, pos[1] - 10]); // NW
  // }

  Game.prototype.recursiveSubgridCreation = function (subgrid, pos) {
    var currentCell = this.getCellByPos(pos);
    if (!currentCell || currentCell.solid || currentCell.subgridId) {
      return null;
    } else {
      subgrid.addCell(currentCell);
      //Cells are 10px by 10px, so...
      this.recursiveSubgridCreation(subgrid, [pos[0], pos[1] - 10]); // N
      this.recursiveSubgridCreation(subgrid, [pos[0] + 10, pos[1] - 10]); // NE
      this.recursiveSubgridCreation(subgrid, [pos[0] + 10, pos[1]]); // E
      this.recursiveSubgridCreation(subgrid, [pos[0] + 10, pos[1] + 10]); // SE
      this.recursiveSubgridCreation(subgrid, [pos[0], pos[1] + 10]); // S
      this.recursiveSubgridCreation(subgrid, [pos[0] - 10, pos[1] + 10]); // SW
      this.recursiveSubgridCreation(subgrid, [pos[0] - 10, pos[1]]); // W
      this.recursiveSubgridCreation(subgrid, [pos[0] - 10, pos[1] - 10]); // NW
    }
  };

  Game.prototype.makeSubgrids = function () {
    //todo: Will this garbage collect dead subgrids automatically?
    var subGridCounter = 1;
    this.subgrids = [];
    this.jezzcells.forEach(function(cell){ cell.subgridId = null });
    // var subgrid = new Jezzball.Subgrid ({ id: subGridCounter });
    this.jezzcells.forEach(function(cell){
      if (cell.subgridId || cell.solid) {
        return null;
      } else {
        var subgrid = new Jezzball.Subgrid ({ id: subGridCounter })
        this.recursiveSubgridCreation(subgrid, cell.pos);
        console.log(subgrid)
        // this.addCelltoSubgrid(subgrid, cell.pos);
      }
    }.bind(this))
    // var subgrid = new Jezzball.Subgrid ({ id: subGridCounter });
    // this.recursiveSubgridCreation(subgrid, [0, 0]);
    // console.log(subgrid);
  }

  Game.prototype.calculateClearedPercentage = function () {
    var solidCounter = 0;
    this.jezzcells.forEach(function(cell) {
      if (cell.solid) {
        solidCounter += 1;
      }
    })
    return Math.floor((solidCounter / this.jezzcells.length) * 100)
  };

  Game.prototype.step = function () {
    window.CLEARED = this.calculateClearedPercentage();
    this.moveObjects();
    // this.checkCollisions;
  };

  Game.prototype.moveObjects = function () {
    this.jezzballs.forEach(function (jezzball) {
      jezzball.move();
    });
  };

  Game.prototype.adjustCoord = function (coord) {
    if (coord % 10 === 0) {
      return coord
    } else if (coord % 10 < 5) {
      return coord - (coord % 10)
    } else {
      var offset = 10 - (coord % 10)
      return coord + offset
    }
  };

  Game.prototype.generateBuilders = function (x, y) {
    x = this.adjustCoord(x);
    y = this.adjustCoord(y);
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
      var colCheck = builder.isAtEndOfBoard()
      if (colCheck[0] === true) {
        this.builders = _.without(this.builders, builder);
        this.jezzcells.forEach(function(cell) {
          cell.makeCellSolidCheck(colCheck[1])
        })
      }
    }.bind(this))
  };

  Game.prototype.builderRemoveCheck = function () {
    this.builderEndCheck();
    if (this.builders.length <= 0) {
      this.noBuildersOnScreen = true;
    }
  };
  
  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.jezzcells.forEach(function (cell) {
      cell.drawB(ctx);
    });

    this.builders.forEach(function (builder) {
      var colCheck = builder.drawB(ctx, this.jezzballs);
      if (colCheck[0] === true) {
        this.builders = _.without(this.builders, builder);
        window.LIVES -= 1;
      };
    }.bind(this));

    this.jezzballs.forEach(function (object) {
      // this.jezzcells.forEach(function (cell) {
      //   object.isCollidedWithCell(cell)
      // })
      object.draw(ctx);
    }.bind(this));

  };
})();
