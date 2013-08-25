var player = {
  "alive": true,
  "cell": undefined,
  "stats": {
    // base stats:
    "health": 10,
    "strength": 10,
    "endurance": 10,
    "dexterity" : 10,

    // calculated stats
    "agility": 10, // = dexterity - gear impact (Weight, bulkiness, etc.)
    "offense": 10, // = strength + gear damage bonuses
    "defense": 10, // = endurance + gear protection bonuses
  },
  "gear": {
    "head": undefined,
    "shoulders": undefined,
    "body": undefined,
    "arms": undefined,
    "hands": undefined,
    "waist": undefined,
    "legs": undefined,
    "feet": undefined,
    "left": undefined,
    "right": undefined,
    "tome": undefined,
    "aura": undefined,
    "inventory": []
  },
  "spawn": function(x, y) {
    do {
      x = x + Math.floor(Math.random() * 3) - 1;
      y = y + Math.floor(Math.random() * 3) - 1;
      var next = world.cell(x, y);
    } while (next.hasClass("wall"));
    this.coordinates = [x, y];
    this.step([[0, 0]]);
  },
  "move": function(x, y) {
    var next = world.cell(x, y);

    // make sure the player can move to the next cell
    if (typeof next == "undefined") {
      // ToDo: verify that we indeed are moving to a new map
      //       load that map, and place the player appropriately on the new map
      return false;
    } else if (next.hasClass("wall")) {
      // ToDo: "Secret doors"
      return false;
    } else if (next.hasClasses(["player", "object", "npc"])) {
      // ToDo: start interaction with the object, player, or npc
      return false;
    }

    if (typeof next != "undefined") {
      if (typeof this.cell != "undefined") { this.cell.removeClass("player"); }
      this.coordinates = [x, y];
      this.light([x, y]);
      this.cell = next;
      next.addClass("player");
    }
    return true;
  },
  "step": function(vectors) {
    // establish the coordinates of the next cell and go there
    for (var v = 0; v < vectors.length; v++) {
      x = vectors[v][0] + this.coordinates[0];
      y = vectors[v][1] + this.coordinates[1];
      if (this.move(x, y) === false) { return; }
    }
  },
  "light": function(c) {
    if (world.isLit) { return; }
    world.grid.find('td').removeClass('lit');
    for (var x = -3; x < 4; x++) {
      for (var y = -3; y < 4; y++) {
        if (Math.abs(x) + Math.abs(y) <= 3) {
          var cx = c[0] + x;
          var cy = c[1] + y;
          if (cx >= 0 && cx < world.width && cy >= 0 && cy < world.height) {
            // ToDo: a "line_of_sight" function and this:
            // if (world.line_of_sight(c, [c[0] + x, c[1] + y]) {
            world.cell(c[0] + x, c[1] + y).addClass('lit');
            // }
          }
        }
      }
    }
  },
  "die": function(msg) {
    // The player did something to end the game.  How do you plead?
    this.alive = false;
    if (confirm("GAME OVER!\n\n"+msg+"\n\nPlay again?")) {
      world.reset(this);
    }
  },
  "addItem": function (where, item) {
    if (where in this.gear && where !== 'inventory') {
      var _tmp = (this.gear[where] !== undefined) ? this.gear[where] : undefined;
      this.gear[where] = item;
      item = _tmp;
    }
    if (item !== undefined) {
      this.gear.inventory.push(item);
    }
  }
};
