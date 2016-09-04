var _player = JSON.parse(localStorage.getItem('playerData'));

var getPlayerData = function () {
  if (!_player) {
    _player = {
      points: 0,
      traveledDistance: 0,
      lastLocation: null
    };
  }

  if (!_player.save) {
    // add save() function to parsed object
    _player.save = function () {
      localStorage.setItem('playerData', JSON.stringify(_player));
    };
  }

  return _player;
};

function clearData() {
  localStorage.clear();
  _player = null;
}
