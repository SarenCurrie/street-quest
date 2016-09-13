var _player = JSON.parse(localStorage.getItem('playerData'));

var getPlayerData = function () {
  if (!_player) {
    _player = {
      points: 0,
      traveledDistance: 0,
      lastLocation: null,
      health: 100,
      name: 'Player',
      items: [{
        name: "Cape",
        attack: 0,
        defence: 0 
      },{
        name: "Rune PlateBody",
        attack: 0,
        defence: 100,
        picture: "img/RunePlate.png"
      }]
    };
  }

  // add save() function to parsed object
  _player.save = function () {
    localStorage.setItem('playerData', JSON.stringify(_player));
  };

  _player.addItems = function(items){
    var items = _player.items.concat(items);
    _player.items = items;
  }
  return _player;
};

function clearData() {
  localStorage.clear();
  _player = null;
}
