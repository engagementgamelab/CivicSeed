window.ss = require('socketstream');
var appInitialized = false;

// TODO: only do this in dev mode
ss.server.on('disconnect', function() { console.log('Lost connection to server...'); });
ss.server.on('reconnect', function() { console.log('Connection to server...'); });

ss.server.on('ready', function() {

	jQuery(function() {

		if(!appInitialized) {

			require('/game-setup').init(function() {

				appInitialized = true;

				var gameModule = require('/game');

				gameModule.gameModuleReady(function() {

					window.$game = gameModule.$game;

					var $account = require('/account');
					$account.accountHandlers();

					var $map = require('/map');
					var $render = require('/render');
					var $npc = require('/npc');
					var $resources = require('/resources');
					var $player = require('/player');
					var $others = require('/others');
					var $robot = require('/robot');
					var $botanist = require('/botanist');
					var $mouse = require('/mouse');
					var $audio = require('/audio');
					var $pathfinder = require('/pathfinder');
					var $events = require('/events');
					var $input = require('/input');
					var $chat = require('/chat');
					var $log = require('/log');
					var $boss = require('/boss');

					$game.init();

				});

			});
		}

	});

});