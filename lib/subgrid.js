(function () {
  if (typeof Jezzball === "undefined") {
    window.Jezzball = {};
  };

  var Subgrid = Jezzball.Subgrid = function (options) {
    this.cells = [];
    this.id = options.id;
  };

  Subgrid.prototype.addCell = function (cell) {
    cell.subgridId = this.id;
    this.cells.push(cell);
  };

})();
