var ui = {
    init: function () {
        var self = this;
        $('#menu_button').on('click', self.showMenu);
        $('#close_menu').on('click', self.hideMenu);
        $('#show_dialog').on('click', function () {
            self.hideMenu();
            self.makeDialog('Tate', ['I need help getting elected to coucil.', 'Help me by destroying 10 oppoision billboards.']);
        });
        $('#clear_data').on('click', function () {
            clearData();
            ui.updatePlayerStats(getPlayerData());
        });

        //Inventory events
        $('#show_inventory').on('click',function(){
            self.hideMenu();
            self.showInventory();
        });
        $("#inventory .panel-footer").on('click',self.hideInventory);
    },

    showMenu: function () {
        console.log('Showing menu');
        $('#menu_button').hide();
        $('#menu').show();
    },

    hideMenu: function () {
        $('#menu_button').show();
        $('#menu').hide();
    },

    makeDialog: function (name, text, next) {
        var dialogRight = 'auto';
        var dialogLeft = 'auto';
        if (name === getPlayerData().name) {
            // show dialog on the right if the player is speaking
            dialogRight = '5%';
        }
        $('#dialog_container').css({
           'right': dialogRight,
           'left': dialogLeft
        });

        $('#dialog').show();
        $('#dialog_speaker').text(name);
        $('#dialog_text').text(text[0]);

        $('#dialog').on('click', function () {
            if(text[1]) {
                text.shift();
                $('#dialog_text').text(text[0]);
            } else {
                $('#dialog').hide()
                .off('click');
                next && next();
            }
        });
    },

    makeCombatButton: function (next) {
      var dialogRight = 'auto';
      var dialogLeft = 'auto';

      dialogRight = '5%';
      $('#dialog_container').css({
         'right': dialogRight,
         'left': dialogLeft
      });

      $('#dialog').show();
      $('#dialog_speaker').text(getPlayerData().name);
      $('#dialog_text').text('').append('<a class="btn btn-primary">Attack</a>');

      $('#dialog').on('click', function () {

        $('#dialog').hide()
        .off('click');
        next && next();
      });
    },

    showInventory: function(){
        $('#inventory_container').show();
        var player = getPlayerData();
        player.items.forEach(function(e){
            var li = $('<li class="list-group-item"></li>');
            if(e.picture){
                var span = $('<span></span>');
                span.text(e.name);
                var thumbnail = $('<div class="thumbnail"></div>');
                var img = $('<img></img>');
                img.prop('src',e.picture);
                thumbnail.append(img);
                li.append(thumbnail);
                li.append(span);
            } else {
                li.text(e.name);
            }
            $('#inventory_list').append(li);
        });
        console.log(player);
    },

    hideInventory : function(){
        $('#inventory_list').empty();
        $('#inventory_container').hide();
    },

    updatePlayerStats: function(player){
        $("#show_player_stats").text('Player distance: ' + Math.round(player.traveledDistance) + 'm');
    },

    showLowGpsWarning: function () {
        $("#low_gps_container").show();
    },
    hideLowGpsWarning: function () {
        $("#low_gps_container").hide();
    },

    startCombat: function() {
        $("#map").css('visibility', 'hidden');
        $("#combat_container").show();
    },
    finishCombat: function(monsterDied) {
        var dialogText;
        if (monsterDied) {
            // TODO: show dead monster
            dialogText = ["I beat the sh*t out of this freaky monster!"];
        } else {
            // TODO: show dead player
            dialogText = ["I was too weak!"];
        }
        ui.makeDialog(getPlayerData().name, dialogText, function() {
            $("#combat_container").hide();
            $("#map").css('visibility', 'visible');
        });
    },
    updateCombat: function(playerHealth, playerDefense, monsterHealth, monsterDefense) {
        $("#player_health").text("Player health: " + playerHealth + ", defense: " + playerDefense);
        $("#monster_health").text("Monster health: " + monsterHealth + ", defense: " + monsterDefense);
    }

}
