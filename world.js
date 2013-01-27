var world = {
  "grid": $("<table></table>"),
  "height": 60,
  "width": 60,
  "createGrid": function($main) {
    for (var row = 0; row < this.height; row++) {
      var $row = $("<tr></tr>");
      for (var col = 0; col < this.width; col++) {
        $row.append($("<td></td>"));
      }
      this.grid.append($row);
    }
    $main.empty().append(this.grid);
  },
  "cell": function(x, y) {
    if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) { return undefined; }
    return this.grid.find("tr").eq(y).find("td").eq(x);
  },
  "spawn": function(data) {
    
  },
};
