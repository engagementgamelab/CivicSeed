
//map formula:
//viewport width * numQuads in width - (numQuads in width-1 * 2)

$game.$map = {

	coloredTiles: [], //needs x, y, display
	growingSeed: false,
	seedsInProgress: [],
	collectiveImage: null,
	ready: false,

	miniMap: {},

	init: function() {
		// ss.rpc('game.map.init', function(bigMap) {
		// 	$game.$map.collectiveImage = bigMap;
		// });
		$game.$map.ready = true;
	},
	paintMini: function() {
		
	},
	growSeeds: function() {

	},

	addPlayer: function(id, x, y, col) {
		$game.$map.miniMap[id] = {};
		$game.$map.miniMap[id].x = x,
		$game.$map.miniMap[id].y = y;
		$game.$map.miniMap[id].col = col;
		$game.$map.render();
	},

	updatePlayer: function(id, x, y) {
		$game.$renderer.clearMiniMap();
		$game.$map.miniMap[id].x = x;
		$game.$map.miniMap[id].y = y;
		$game.$map.render();
	},

	removePlayer: function(id) {
		$game.$renderer.clearMiniMap();
		delete $game.$map.miniMap[id];
		$game.$map.render();
	},

	render: function() {
		$game.$renderer.renderMiniMapConstants();
		$.each($game.$map.miniMap, function(key, player) {
			$game.$renderer.renderMiniPlayer(player);
		});
	},

	newBomb: function(bombed, id) {
		//THIS WILL MOVE TO THE RPC on server, NOT local
		//this will simply send out the coords of the tiles to redraw
		//console.log(bombed);
		for(var b = 0; b < bombed.length; b += 1) {
			//only add it to render list if it is on current screen
			var loc = $game.masterToLocal(bombed[b].x, bombed[b].y),
				curTile = null;
			if(loc) {
				//if there IS a color
				curTile = $game.currentTiles[loc.x][loc.y];
				curTile.color = bombed[b].color;
				curTile.curColor = bombed[b].curColor;
				$game.$renderer.clearMapTile(loc.x * $game.TILE_SIZE, loc.y * $game.TILE_SIZE);
				$game.$renderer.renderTile(loc.x,loc.y);

				if(id === $game.$player.id) {
					$game.$renderer.renderMiniTile(bombed[b].x, bombed[b].y, bombed[b].color);
				}
			}
		}
	},

	saveImage: function() {
		var myDrawing = document.getElementById('minimapTile');
		var drawingURL = myDrawing.toDataURL('img/png');
		return drawingURL;
	},

	createCollectiveImage: function() {
		ss.rpc('game.player.getAllImages', function(data) {
			//console.log(data.length);
			var index = data.length;
			//go thru each image create a new image using canvas?
			while(--index > -1) {
				$('.colorMapEveryone').append('<img src="'+ data[index] + '">');
			}
		});
	}
};

