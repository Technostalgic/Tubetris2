///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerate the different entity types
var entities = {
	none: -1,
	tube: 0,
	block: 1
}
// enumerate the different tube entity IDs
var tubes = {
	none: -1,
	S_horizontal: 0,
	S_vertical: 1,
	T_horizontalDown: 2,
	T_horizontalUp: 3,
	T_verticalRight: 4,
	T_verticalLeft: 5,
	L_downRight: 6,
	L_downLeft: 7,
	L_upRight: 8,
	L_upLeft: 9,
	quad: 10
}
// enumerate the different block entity IDs
var blocks = {
	none: -1,
	block_brick: 0,
	block_bomb: 1
}

class tile{
	constructor(){
		this.gridPos = new vec2(-1);
		this.entityType = entities.none;
		this.entityID = entities.none;
	}
	
	static fromData(pos, entityID, entityType = entities.tube){
		// used to construct a tile from the specified data
		var r = new tile();
		r.gridPos = pos;
		r.setEntity(entityID, entityType);
		return r;
	}
	
	static init(){
		// initializes the static fields for the tile class
		tile.tilesize = 32;
		tile.offset = new vec2(-screenBounds.width % tile.tilesize - 2, -screenBounds.height % tile.tilesize - 2).plus(new vec2(tile.tilesize));
		tile.gridBounds = collisionBox.fromSides(0, 0, 10, 20);
		tile.grid = [];
		tile.constructGrid();
		
		// gets the sprite of each entity type offset to its ID
		tile.entitySprites = [
			new spriteBox(new vec2(tile.tilesize * 0, tile.tilesize * 0), new vec2(tile.tilesize)),	// S_horizontal: 0,
			new spriteBox(new vec2(tile.tilesize * 1, tile.tilesize * 0), new vec2(tile.tilesize)),	// S_vertical: 1,
			new spriteBox(new vec2(tile.tilesize * 2, tile.tilesize * 0), new vec2(tile.tilesize)),	// T_horizontalDown: 2,
			new spriteBox(new vec2(tile.tilesize * 3, tile.tilesize * 0), new vec2(tile.tilesize)),	// T_horizontalUp: 3,
			new spriteBox(new vec2(tile.tilesize * 2, tile.tilesize * 1), new vec2(tile.tilesize)),	// T_verticalRight: 4,
			new spriteBox(new vec2(tile.tilesize * 3, tile.tilesize * 1), new vec2(tile.tilesize)),	// T_verticalLeft: 5,
			new spriteBox(new vec2(tile.tilesize * 4, tile.tilesize * 0), new vec2(tile.tilesize)),	// L_downRight: 6,
			new spriteBox(new vec2(tile.tilesize * 5, tile.tilesize * 0), new vec2(tile.tilesize)),	// L_downLeft: 7,
			new spriteBox(new vec2(tile.tilesize * 4, tile.tilesize * 1), new vec2(tile.tilesize)),	// L_upRight: 8,
			new spriteBox(new vec2(tile.tilesize * 5, tile.tilesize * 1), new vec2(tile.tilesize)),	// L_upLeft: 9,
			new spriteBox(new vec2(tile.tilesize * 0, tile.tilesize * 1), new vec2(tile.tilesize)),	// quad: 10,
			new spriteBox(new vec2(tile.tilesize * 0, 0), new vec2(tile.tilesize)),	// block_brick: 11,
			new spriteBox(new vec2(tile.tilesize * 1, 0), new vec2(tile.tilesize)),	// block_bomb: 12
		];
		// gets the open side list of each entity type offset to its ID
		tile.entityOpenSides = [
			[side.left, side.right],						// S_horizontal: 0,
			[side.up, side.down],							// S_vertical: 1,
			[side.left, side.right, side.down],				// T_horizontalDown: 2,
			[side.left, side.right, side.up],				// T_horizontalUp: 3,
			[side.right, side.up, side.down],				// T_verticalRight: 4,
			[side.left, side.up, side.down],				// T_verticalLeft: 5,
			[side.right, side.down],						// L_downRight: 6,
			[side.left, side.down],							// L_downLeft: 7,
			[side.right, side.up],							// L_upRight: 8,
			[side.left, side.up],							// L_upLeft: 9,
			[side.left, side.right, side.up, side.down],	// quad: 10,
			[],												// block_brick: 11,
			[]												// block_bomb: 12
		];
	}
	static constructGrid(){
		// constructs a tile grid full of empty tiles
		tile.grid = [];
		for(let x = tile.gridBounds.left; x <= tile.gridBounds.right; x++){
			// creates an empty array for each valid iteration of the horizontal grid bounds
			tile.grid[x] = [];
			for(let y = tile.gridBounds.top; y <= tile.gridBounds.bottom; y++){
				// adds an empty tile at each available location inside the grid bounds
				tile.grid[x][y] = tile.getEmpty(new vec2(x, y));
			}
		}
	}
	static drawGrid(){
		// draws each tile in the grid
		tile.grid.forEach(function(tileArr, x){
			tileArr.forEach(function(tile, y){
				tile.draw();
			});
		});
	}
	
	static getEmpty(pos = null){ 
		// returns an empty tile
		var r = new tile();
		if(pos) r.gridPos = pos;
		return r;
	}
	static getFull(pos = null){
		// returns a full tile
		var r = new tile();
		if(pos) r.gridPos = pos;
		return r;
	}
	static getEntityOpenSides(entityID, entityType = entities.tube){
		var off = 0;
		
		// adds the length of the entity specific enumerator to offset the entityID so that the correct index is referenced in entityOpenSides
		// the switch statement probably looks like a dumb way to do it but it will be cleaner if I end up adding more entity types
		switch(entityType){
			case entities.none: return [side.left, side.right, side.up, side.down];
			case entities.block: off += Object.keys(tubes).length;
			default: break;
		}
		
		return tile.entityOpenSides[off + entityID];
	}
	static getEntitySprite(entityID, entityType = entities.tube){
		var spritesheet = null;
		var off = 0;
		
		// sets the spritesheet according to the entity's type
		switch (entityType){
			case entities.none: return null;
			case entities.tube:
				spritesheet = gfx.tiles_tubes;
				break;
			case entities.block: 
				spritesheet = gfx.tiles_blocks; 
				break;
		}
		
		// adds the length of the entity specific enumerator to offset the entityID so that the correct index is referenced in entitySprites
		// the switch statement probably looks like a dumb way to do it but it will be cleaner if I end up adding more entity types
		switch (entityType){
			case entities.block: off += Object.keys(tubes).length;
			default: break;
		}
		
		return new spriteContainer(spritesheet, tile.entitySprites[off + entityID]);
	}
	
	static toTilePos(screenPos){
		// converts a screen position to a coordinate on the tile grid
		var r = screenPos.minus(tile.offset);
		
		r = r.multiply(1 / tile.tilesize);
		r = new vec2(Math.floor(r.x), Math.floor(r.y));
		
		return r;
	}
	static toScreenPos(tilePos, centered = true){
		// converts a coordinate on the tile grid to a screen position
		var r = tilePos.multiply(tile.tilesize).plus(tile.offset);
		
		if(centered)
			r = r.plus(new vec2(tile.tilesize / 2));
		
		return r;
	}
	static at(pos, ypos = null){
		// returns the tile at the specified grid position
		// paramaters accept format: at(vec2) or at(int, int)
		if(ypos != null) return tile.at(new vec2(pos, ypos));
		
		// returns a full tile if the position is below the tile grid (if the tile at pos is undefined)
		if(pos.y > tile.gridBounds.bottom){
			if(!tile.grid[pos.x]) return tile.getFull(pos);
			return tile.fromAny(tile.grid[pos.x][pos.y], false, pos);
		}
		// returns an empty tile if the position is above the bottom of the tile grid (if the tile at pos is undefined)
		if(!tile.grid[pos.x]) return tile.getEmpty(pos);
		return tile.fromAny(tile.grid[pos.x][pos.y], true, pos);
	}
	static setTileAt(tile, pos, ypos = null){
		// sets the specified tile at the specified grid position
		// parameters accept formats: setTileAt(tile, vec2) or setTileAt(tile, int, int)
		if(ypos != null) tile.setTileAt(tile, new vec2(pos, ypos));
		tile.gridPos = pos;
		if(!tile[x]) tile[x] = [];
		tile.grid[x][y] = tile;
	}
	static fromAny(ob, empty = true, pos = null){
		// returns a tile from ANY object type
		// if the object is a tile, simply return the object
		if(ob instanceof tile) return ob;
		// otherwise, return either an empty or full tile at the specified position
		var r = empty ? tile.getEmpty(pos) : tile.getFull(pos);
		return r;
	}
	
	isEmpty(){
		return this.entityID == entities.none || this.entityType == entities.none;
	}
	setEntity(entityID, entityType = entities.tube){
		this.entityType = entityType;
		this.entityID = entityID;
	}
	getOpenSides(){
		if(this.entityID == entities.none) return [side.left, side.right, side.up, side.down];
		return tile.getEntityOpenSides(this.entityID, this.entityType);
	}
	getSprite(){
		if(this.entityID == entities.none) return null;
		var r = tile.getEntitySprite(this.entityID, this.entityType);
		var bounds = new collisionBox(tile.toScreenPos(this.gridPos, false), new vec2(tile.tilesize));
		r.bounds = bounds;
		return r;
	}
	
	clone(){
		// returns an identical tile object of a seperate instance
		var r = tile.fromData(this.gridPos.clone(), this.entityID, this.entityType);
		
		return r;
	}
	
	draw(){
		// draw the sprite
		this.drawAtScreenPos(tile.toScreenPos(this.gridPos, false));
	}
	drawAtScreenPos(pos){
		// draw the sprite at the specified position
		var sprite = this.getSprite();
		if(!sprite) return;
		sprite.bounds.pos = pos;
		sprite.draw();
	}
}

// a data structure that represents an assortment of tiles that can be moved and rotated as one, basically tubtris' version of a tetromino
class tileForm{
	constructor(){
		this.gridPos = new vec2(4, 0);
		this.drawPos = tile.toScreenPos(this.gridPos, false);
		this.tiles = [];
	}
	
	static getRandomPiece(){
		var r = new tileForm();
		r.tiles = [
			tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp),
			tile.fromData(new vec2(0, 0), tubes.S_horizontal),
			tile.fromData(new vec2(1, 0), tubes.L_downLeft),
			tile.fromData(new vec2(1, 1), tubes.T_horizontalUp)
		];
		return r;
	}
	
	getTileGridPositions(){
		// returns a list of grid positions that are occupied by the tileForm's tiles
		var r = [];
		
		// adds the tileForm's gridPos to each of it's tile's gridPos and adds the result to a list
		this.tiles.forEach(function(tileOb){
			let gpos = tileOb.gridPos.plus(this.gridPos);
			r.push(gpos);
		});
		
		return r;
	}
	canMove(dir = side.down){
		// checks to see if the tileForm can move in the specified direction
		var tilepos = this.getTileGridPositions();
		
		for(var i = tpos.length - 1; i >= 0; i--){
			var tpos = tilepos[i].plus(vec2.fromSide(dir));
			if(!tile.at(tpos).isEmpty())
				return false;
		}
		
		return true;
	}
	move(dir = side.down){
		// moves the tileform in the specified direction by one grid unit
		if(!this.canMove(dir)) return;
		this.gridPos = this.gridPos.plus(vec2.fromSide(dir));
	}
	bumpDown(){
		// bumps the tileform downward if possible, otherwise sets it in place
		if(this.canMove()) this.move();
		else this.setInPlace();
	}
	
	setInPlace(){
		this.tiles.forEach(function(tileOb){
			let tpos = tileOb.gridPos.plus(this.gridPos);
			tile.setTileAt(tileOb, tpos);
		});
	}
	
	draw(){
		this.drawPos = tile.toScreenPos(this.gridPos, false);
		var ths = this;
		
		this.tiles.forEach(function(tileOb){
			let off = tileOb.gridPos.multiply(tile.tilePos);
			tileOb.drawAtScreenPos(ths.drawPos.plus(off));
		});
	}
}