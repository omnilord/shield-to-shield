jQuery(function($) {
  // Control events below

  $(document).on("keydown", function(ev) {
    if (!player.alive) return;
    var vector = [0, 0];
    switch (ev.which) {
      case 37: vector = [-1, 0]; break;
      case 38: vector = [0, -1]; break;
      case 39: vector = [1, 0]; break;
      case 40: vector = [0, 1]; break;
      default: return;
    }
    player.step([vector]);
  });

  $("#reset").on("click", function(ev) {
    world.spawn($("#main"), 36, 36);
    player.spawn(Math.floor(world.width / 2), Math.floor(world.height / 2));
    world.populate();
  }).trigger("click");

});
