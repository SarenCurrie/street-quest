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
        $("#inventory_container").show();
    },

    hideInventory : function(){
        $("#inventory_container").hide();
    },

    updatePlayerStats: function(player){
        $("#show_player_stats").text('Player distance: ' + Math.round(player.traveledDistance) + 'm');
    }
}
