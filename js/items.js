///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

class item{
	constructor(){
		this.parentTile = null;
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
	}
	
	draw(pos){
		// draws the item at the specified position
		drawCenteredImage(renderContext, gfx.items_backdrop, pos);
	}
}