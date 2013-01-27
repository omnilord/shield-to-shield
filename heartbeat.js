/*
  var heartbeat = {
    "timer": undefined,
    "beats": [],
    "register": function(fn, data, delay) {
      this.beats.push({"fn": fn, "data": data, "ticks": 0});
      if (!delay) { this.reset(); }
    },
    "_heartbeat": function() {
      var _beats = [];
      var beat;
      while (beat = heartbeat.beats.shift()) {
        if (beat.fn(beat.data, beat.ticks)) {
          beat.ticks++;
          _beats.push(beat);
        }
      }
      heartbeat.registered_beats = _beats;
      if (heartbeat.beats.length > 0) {
        heartbeat.reset();
      } else {
        heartbeat.stop();
      }
    },
    "reset": function() {
      clearTimeout(heartbeat.timer);
      heartbeat.timer = setTimeout(heartbeat._heartbeat, 500);
    },
    "stop": function() {
      clearTimeout(heartbeat.timer);
      this.timer = undefined;
    }
  };
*/
