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

    updatePlayerStats: function(player) {
        $("#show_player_stats").html('Player Distance: ' + Math.round(player.traveledDistance));
        $("#player_gold").text('Gold: ' + player.gold);
    },

    showLowGpsWarning: function (accuracy, requiredAccuracy) {
        $("#map").css('visibility', 'hidden');
        var low_gps_text = "Low GPS accuracy! Gameplay paused.";
        low_gps_text += " [Accuracy: " + Math.round(accuracy) + "m";
        low_gps_text += ", Required: " + Math.round(requiredAccuracy) + "m]";
        $("#low_gps_text").text(low_gps_text);
        $("#low_gps_container").show();
    },
    hideLowGpsWarning: function () {
        $("#low_gps_container").hide();
        $("#map").css('visibility', 'visible');
    }

}
