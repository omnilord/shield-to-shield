var player = {
  "alive": true,
  "coordinates": [30, 30],
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
    "aura": undefined
  },
  "step": function(vectors) {
    // establish the coordinates of the next cell and go there
    for (var v = 0; v < vectors.length; v++) {
      var c = vectors[v];
      c[0] = c[0] + this.coordinates[0];
      c[1] = c[1] + this.coordinates[1];
      var next = world.cell(c[0], c[1]);

      // make sure the player can move to the next cell
      if (typeof next == "undefined") {
        // ToDo: verify that we indeed are moving to a new map
        //       load that map, and place the player appropriately on the new map
      } else if (next.hasClass("wall")) {
        // ToDo: "Secret doors"
        return;
      } else if (next.hasClasses(["player", "object", "wall", "npc"])) {
        // ToDo: start interaction with the object, player, or npc, if player is able, search for "Secrets"
        return;
      }

      if (typeof next != "undefined") {
        if (typeof this.cell != "undefined") { this.cell.removeClass("player"); }
        this.cell = next.addClass("player");
        this.coordinates = c;
      }
    }
  },
  "die": function(msg) {
    // The player did something to end the game.  How do you plead?
    this.alive = false;
    if (confirm("GAME OVER!\n\n"+msg+"\n\nPlay again?")) {
      $("#reset").trigger("click");
    }
  }
};
