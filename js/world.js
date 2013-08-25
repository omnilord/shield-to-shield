var world = {
  "grid": undefined,
  "rooms": [],
  "height": 0,
  "width": 0,
  "isLit": false,
  "cell": function(x, y) {
    if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) { return undefined; }
    return this.grid.find("tr").eq(y).find("td").eq(x);
  },
  "spawn": function($main, startWidth, startHeight) {
    this.grid = $("<table></table>");
    var maze = this.calculate_maze(startWidth, startHeight);
    var x, y;
    for (x = 0; x < maze.width * 2 + 1; x++) {
      var $row = $('<tr></tr>');
      for (y = 0; y < maze.height * 2 + 1; y++) {
        var $col = $('<td></td>').toggleClass('lit', this.isLit);
        if (y % 2 === 0) {
          if (x % 2 === 0 || !(y > 0 && maze.xList[(x - 1) / 2][y / 2 - 1])) {
            $col.addClass('wall');
          }
        } else {
          if (x % 2 === 0 && !(x > 0 && maze.yList[x / 2 - 1][Math.floor(y / 2)])) {
            $col.addClass('wall');
          }
        }
        $row.append($col);
      }
      this.grid.append($row);
    }
    $main.empty().append(this.grid);
    this.width = maze.width * 2 + 1;
    this.height = maze.height * 2 + 1;

    // Add some rooms and note their location for populating.
    var n = Math.floor(Math.sqrt(maze.width * maze.height) / 10) + Math.floor(Math.random() * 6);
    var m = n;
    do {
      var rWidth = Math.floor(maze.width / 10) * (Math.floor(Math.random() * 4) + 3);
      var rHeight = Math.floor(maze.height / 10) * (Math.floor(Math.random() * 4) + 3);
      do {
        var rx = Math.floor(Math.random() * (this.width - (rWidth / 2) - 2));
        var ry = Math.floor(Math.random() * (this.height - (rHeight / 2) - 2));
      } while ((function(wo, x, y, w, h, n) {
        if (x - ((w / 2) + 1) <= 0 || y - ((h / 2) + 1) <= 0) { return true; }
        for (var r = 0; r < wo.rooms.length; r++) {
          var room = wo.rooms[r];
          if (Math.abs(room.x - x) < n && Math.abs(room.y - y) < n) { return true; }
        }
        return false;
      })(this, rx, ry, rWidth, rHeight, n));
      var xShift = Math.floor(rWidth / 2);
      var yShift = Math.floor(rHeight / 2);
      for (x = rx - xShift; x < rx + xShift; x++) {
        for (y = ry - yShift; y < ry + yShift; y++) {
          $(this.cell(x, y)).removeClass("wall");
        }
      }
    } while (--m);
  },
  "populate": function() {
    // ToDo: load all the objects and NPCs, This should be outsourced to a different "items" handler

    // Simple objective, find the key, find the door, leave the maze
    // First load the door.
    (function() {
      do {
        var _rnd = Math.floor(Math.random() * 4);
        var _alt = Math.floor(Math.random() * ((_rnd % 2 === 0) ? world.height : world.width));
        switch (_rnd) {
          case 0:
            var hall = [_alt, 1];
            if (world.cell(_alt, 1).hasClass('wall')) { break; }
            var door = world.cell(_alt, 0);
            break;
          case 1:
            var hall = [1, _alt];
            if (world.cell(1, _alt).hasClass('wall')) { break; }
            var door = world.cell(0, _alt);
            break;
          case 2:
            var hall = [_alt, (world.height - 2)];
            if (world.cell(_alt, (world.height - 2)).hasClass('wall')) { break; }
            var door = world.cell(_alt, (world.height - 1));
            break;
          case 3:
            var hall = [(world.width - 2), _alt];
            if (world.cell((world.width - 2), _alt).hasClass('wall')) { break; }
            var door = world.cell((world.width - 1), _alt);
            break;
          default:
        }
      } while (!door);
      door.removeClass('wall').addClass("door theDoor").text('X').on('addClass', function(ev, cls) {
        if (cls.match(/player/)) {
          if (player.gear.inventory.indexOf('theKey') != -1) {
            $(this).text('');
            alert("You have found your way out of the maze!  Congradulations!");
            player.alive = false;
          } else {
            player.move(hall[0], hall[1]);
            alert('You do not have the key to unlock "The Door". Please go find the key first.');
          }
        }
      });
    }());

    // Next, load the key in some random deadend
    do {
      var cell = world.cell(Math.floor(Math.random() * (world.width - 2)) + 1, Math.floor(Math.random() * (world.height - 2)) + 1);
      if (cell.hasClass('wall')) { continue; }
      var key = cell.addClass('item theKey').on('addClass', function(ev, cls) {
        if (cls.match(/player/)) {
          $(this).removeClass('item theKey');
          player.addItem('inventory', 'theKey');
        }
      });
    } while (!key);
  },
  "reset": function() {
    // ToDo: whatever reset does
  },
  "calculate_maze": function(width, height) {
    var i = width * height - 1;
    if (i < 0) { return; }
    var x, y;
    var xList = [];
    var yList = [];
    var here = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    var path = [here];
    var unvisited = [];
    var next;

    for (var x = 0; x < width + 1; x++) {
      xList[x] = [];
    }
    for (var y = 0; y < height + 1; y++) {
      yList[y] = [];
    }
    for (x = 0; x < width + 2; x++) {
      unvisited[x] = [];
      for (y = 0; y < height + 1; y++) {
        unvisited[x].push(x > 0 && x < width + 1 && y > 0 && (x != here[0] + 1 || y != here[1] + 1));
      }
    }

    while (i) {
      var neighbors = [[here[0] + 1, here[1]], [here[0], here[1] + 1], [here[0] - 1, here[1]], [here[0], here[1] - 1]];
      var search = [];
      for (var n in neighbors) {
        if (unvisited[neighbors[n][0] + 1][neighbors[n][1] + 1]) {
          search.push(neighbors[n]);
        }
      }
      if (search.length) {
        i = i - 1;
        next = search[Math.floor(Math.random() * search.length)];
        unvisited[next[0] + 1][next[1] + 1] = false;
        if (next[0] == here[0]) {
          xList[next[0]][(next[1] + here[1] - 1) / 2] = true;
        } else {
          yList[(next[0] + here[0] - 1) / 2][next[1]] = true;
        }
        path.push(here = next);
      } else {
        here = path.pop();
      }
    }
    return ({width: width, height: height, xList: xList, yList: yList});
  }
};

