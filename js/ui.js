var ui = {
    init: function () {
        var self = this;
        $('#menu_button').on('click', self.showMenu);
        $('#close_menu').on('click', self.hideMenu);
        $('#show_dialog').on('click', function () {
            self.hideMenu();
            self.makeDialog('Tate', ['I need help getting elected to coucil.', 'Help me by destroying 10 oppoision billboards.']);
        });

        //Inventory events
        $('#show_inventory').on('click',function(){
            self.hideMenu();
            self.showInventory();
        });
        $("#inventory .panel-footer").on('click', self.hideInventory);

        //Quest Log events
        $('#show_quest_log').on('click',function(){
            self.hideMenu();
            self.showQuestLog();
        });
        $("#inventory .panel-footer").on('click', self.hideQuestLog);
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

    showQuestLog: function(){
        $("#inventory_container").show();
    },

    hideQuestLog : function(){
        $("#inventory_container").hide();
    }
}
