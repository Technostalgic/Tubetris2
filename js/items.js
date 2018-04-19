///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

class item{
	constructor(){
		this.parentTile = null;
		this.icon = null;
	}
	
	static getItem_random(){
		var itemNames = [
			"getItem_extraPoints",
			"getItem_extraItems",
		];

		var itm = Math.floor(Math.random() * itemNames.length);
		return item[itemNames[itm]]();
	}
	static getItem_extraItems(){
		var r = new item();
		r.icon = 0;
		r.m_activate = item.ACT_extraItems;
		return r;
	}
	static getItem_extraPoints(){
		var r = new item();
		r.icon = 1;
		r.m_activate = item.ACT_extraPoints;
		return r;
	}

	get gridPos(){
		// returns the item's parentTile's grid position
		if(!this.parentTile)
			return null;
		return this.parentTile.gridPos;
	}
	
	setToTile(tileOb){
		// sets the item to the specified tile object
		this.parentTile = tileOb;
		this.parentTile.item = this;
	}
	setToTilePos(pos){
		// sets the item to the tile at the specified grid position
		var ttile = tile.at(pos);
		if(!ttile || ttile.isEmpty()) return;
		this.setToTile(ttile);
	}
	
	destroy(){
		// destroys the item so it can no longer be activated by a ball
		this.parentTile.item = null;
	}
	activate(ballOb){
		// activates the item, ballOb should be the ball object that touched it to activate it
		this.destroy();
		this.m_activate(this, ballOb);
	}

	m_activate(self, ballOb){}
	static ACT_extraItems(self, ballOb){
		// the activation method for the extra items item
		// get all the tube tiles but remove the ones that are already tagged
		var ttiles = tile.getAllTilesOfType(entities.tube);
		for(let i = ttiles.length - 1; i >= 0; i--){
			if(ttiles[i].tagged){
				ttiles.splice(i, 1);
			}
		}
		
		// spawn 2 items if on level 1-10, otherwise spawn 3
		var count = gameState.current.currentLevel.difficulty > 10 ? 3 : 2;
		
		// if the amount of items that are being spawned is greater than or equal to the amount
		// of tiles that they can be spawned on, just spawn random items on all the tiles available
		if(ttiles.length <= count){
			ttiles.forEach(function(tileOb){
				tileOb.setItem(item.getItem_random());
			});
			return;
		}
		
		// push x amount of items to a random tube tile in the tile grid
		var iposes = [];
		for(let i = count; i > 0; i--){
			let ipos = Math.floor(ttiles.length * Math.random());
			while(iposes.includes(ipos)) ipos = Math.floor(ttiles.length * Math.random());
			ttiles[ipos].setItem(item.getItem_random());
			iposes.push(ipos);
		}
	}
	static ACT_extraPoints(self, ballOb){
		// the activation method for the extra points item
		scoring.addScore(
			500 + 150 * gameState.current.currentLevel.difficulty, 
			tile.toScreenPos(self.parentTile.gridPos),
			scoreTypes.bonus);
	}
	
	draw(pos){
		// draws the item at the specified position
		drawCenteredImage(renderContext, gfx.item_backdrop, pos);
		this.drawIcon(pos);
	}
	drawIcon(pos){
		var spr = new spriteBox(new vec2(), new vec2(gfx.item_icons.height));
		spr.pos.x = this.icon * spr.size.x;
		drawCenteredImage(renderContext, gfx.item_icons, pos, spr);
	}
}