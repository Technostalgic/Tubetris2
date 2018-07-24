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
		this.iconAnim = null;
	}
	
	static getItem_random(){
		return new item();
	}
	static getItem_extraPoints(){
		// returns the 'extra points' item
		var r = new item();
		r.icon = 1;
		r.m_activate = item.ACT_extraPoints;
		r.iconAnim = item.anim_pulsate();
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
		audioMgr.playSound(sfx.getCoin);
		scoring.addScore(
			300 + 50 * gameState.current.currentLevel.difficulty, 
			tile.toScreenPos(this.parentTile.gridPos),
			scoreTypes.bonus);
			
		gameState.current.addToComboValue(floatingScoreFieldID.coinCombo);
	}
	
	draw(pos){
		// draws the item at the specified position
		var frame = Math.floor(gameState.current.timeElapsed / 60) % 8;

		var spBox = new spriteBox(
			new vec2(frame * 16, 0),
			new vec2(16)
		);
		var spcont = new spriteContainer(
			gfx.coin,
			spBox
		);

		spcont.bounds.setCenter(pos);
		spcont.draw();
	}
	drawIcon(pos){
		// draws the icon for the item
		var spritesheet = gfx.item_icons;
		var spr = new spriteBox(new vec2(), new vec2(25));
		spr.pos.x = this.icon * spr.size.x;
		
		// if the icon doesn't exist, use an ascii character as a placeholder
		if(spr.pos.x >= gfx.item_icons.width){
			spritesheet = fonts.small.spritesheet;
			spr.size = new vec2(12, 8);
			spr.pos.x = (this.icon * spr.size.x) % spritesheet.width;
			spr.pos.y = Math.floor((this.icon * spr.size.x) / spritesheet.width) * (spritesheet.height / 3);
		}
		
		var spCont = new spriteContainer(spritesheet, spr, new collisionBox(new vec2(), spr.size.clone()));
		spCont.bounds.setCenter(pos);
		
		if(this.iconAnim)
			spCont.animated(this.iconAnim).draw();
		else spCont.draw();
	}
}