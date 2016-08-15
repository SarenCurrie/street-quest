var _player = localStorage.getItem('playerData');

var getPlayerData = function () {
  if (_player) {
    return _player;
  } else {
    var _player = {
      points: 0,

      // Saves the player's data to browser's localStorage.
      save: function () {
        localStorage.setItem('playerData', JSON.stringify({
          points: _player.points
        }));
      }
    };
  }
}
