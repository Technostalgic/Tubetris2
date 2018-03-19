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
		this.tintColor = new color();
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
		// gets the entityID after being rotated by 90 degrees clockwise
		tile.rotatedEntityID = [
			1,	// S_horizontal: 0,
			0,	// S_vertical: 1,
			5,	// T_horizontalDown: 2,
			4,	// T_horizontalUp: 3,
			2,	// T_verticalRight: 4,
			3,	// T_verticalLeft: 5,
			7,	// L_downRight: 6,
			9,	// L_downLeft: 7,
			6,	// L_upRight: 8,
			8,	// L_upLeft: 9,
			10,	// quad: 10,
			0,	// block_brick: (11 - tubeIDCount) -> 0
			1,	// block_bomb: (12 - tubeIDCount) -> 1
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
	static getEntityRotatedID(direction, entityID, entityType = entities.tube){
		var off = 0;
		
		// adds the length of the entity specific enumerator to offset the entityID so that the correct index is referenced in rotatedEntityID
		// the switch statement probably looks like a dumb way to do it but it will be cleaner if I end up adding more entity types
		switch (entityType){
			case entities.block: off += Object.keys(tubes).length;
			default: break;
		}
		
		var r = off + entityID;
		
		// if clockwise, rotate by 90 degrees clockwise once
		if(direction == 1) r = tile.rotatedEntityID[r];
		// if counter clockwise, rotate by 90 degrees clockwise 3 times (270 degrees) to get the same result as rotating by 90 degrees CCW
		else for(var i = 3; i > 0; i--) 
			r = tile.rotatedEntityID[r];
		
		return r;
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
	static setTileAt(tileOb, pos, ypos = null){
		// sets the specified tile at the specified grid position
		// parameters accept formats: setTileAt(tile, vec2) or setTileAt(tile, int, int)
		if(ypos != null) tile.setTileAt(tileOb, new vec2(pos, ypos));
		tileOb.gridPos = pos;
		if(!tile.grid[pos.x]) tile.grid[pos.x] = [];
		tile.grid[pos.x][pos.y] = tileOb;
	}
	static isOutOfBounds(pos, ypos = null){
		if(ypos != null) return tile.isOutOfBounds(new vec2(pos, ypos));
		return ( 
			pos.x < tile.gridBounds.left ||
			pos.x >= tile.gridBounds.right ||
			//pos.y < tile.gridBounds.top ||
			pos.y >= tile.gridBounds.bottom
			);
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
	drawAtScreenPos(pos, rotation = null){
		// draw the sprite at the specified position
		var sprite = this.getSprite();
		if(!sprite) return;
		sprite.bounds.pos = pos;
		if(rotation) sprite.rotation = rotation;
		sprite.draw();
	}
}

// a data structure that represents an assortment of tiles that can be moved and rotated as one, basically tubtris' version of a tetromino
class tileForm{
	constructor(){
		this.gridPos = new vec2(4, 0);
		this.tiles = [];
		
		// animation stuff for smooth transformations
		this.animOffset_translate = gameState.current.timeElapsed;
		this.drawPos = tile.toScreenPos(this.gridPos, false);
		this.lastDrawPos = this.drawPos.clone();
		this.animOffset_rotate = gameState.current.timeElapsed - 1000;
		this.lastDrawRot = 0;
	}
	
	static getRandomPiece(){
		var r = new tileForm();
		r.tiles = [
			tile.fromData(new vec2(0, 0), tubes.S_horizontal),
			tile.fromData(new vec2(1, 0), tubes.L_downLeft),
			tile.fromData(new vec2(1, 1), tubes.L_upLeft),
			tile.fromData(new vec2(0, 1), tubes.S_horizontal)
		];
		//r.tiles = [
		//	tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp),
		//	tile.fromData(new vec2(0, 0), tubes.S_horizontal),
		//	tile.fromData(new vec2(1, 0), tubes.L_downLeft),
		//	tile.fromData(new vec2(1, 1), tubes.T_horizontalUp)
		//];
		return r;
	}
	
	getTopLeftTilePos(){
		var minX = null;
		var minY = null;
		
		this.tiles.forEach(function(tileOb, i){
			if(i == 0) {
				minX = tileOb.gridPos.x;
				minY = tileOb.gridPos.y;
				return; // acts as 'continue' keyword in async forEach
			}
			if(tileOb.gridPos.x < minX) minX = tileOb.gridPos.x;
			if(tileOb.gridPos.y < minY) minY = tileOb.gridPos.y;
		});
		
		return new vec2(minX, minY);
	}
	getTileGridPositions(){
		// returns a list of grid positions that are occupied by the tileForm's tiles
		var r = [];
		var ths = this;
		
		// adds the tileForm's gridPos to each of it's tile's gridPos and adds the result to a list
		this.tiles.forEach(function(tileOb){
			let gpos = tileOb.gridPos.plus(ths.gridPos);
			r.push(gpos);
		});
		
		return r;
	}
	getRelativeTilePositions(){
		// returns a list of position offsets that the tileform's tiles have
		var r = [];
		var ths = this;
		
		// adds the tileForm's gridPos to a list
		this.tiles.forEach(function(tileOb){
			r.push(tileOb.gridPos.clone());
		});
		
		return r;
	}
	canMove(dir = side.down){
		// checks to see if the tileForm can move in the specified direction
		return this.canTranslate(vec2.fromSide(dir));
	}
	canTranslate(translation){
		// checks to see if the tileform overlaps any tiles or goes out of bounds with the specified translation applied
		var lpos = this.gridPos;
		this.gridPos = this.gridPos.plus(translation);
		var dposes = this.getTileGridPositions();
		
		for(var i = dposes.length - 1; i >= 0; i--){
			if(!tile.at(dposes[i]).isEmpty() || tile.isOutOfBounds(dposes[i])){
				this.gridPos = lpos;
				return false;
			}
		}
		
		this.gridPos = lpos;
		return true;
	}
	canRotate(dir = 1, anchored = false){
		// checks to see if the tileForm can be rotated
		// applies the rotation to each tile in the tileForm and stores the results in tposes
		var tposes = this.getRelativeTilePositions();
		tposes.forEach(function(pos, i){
			// clockwise rotation
			if(dir == 1) tposes[i] = new vec2(-pos.y, pos.x);
			// counter-clockwise rotation
			else tposes[i] = new vec2(pos.y, -pos.x);
		});
		
		// calculates the difference betweem the old top left grid pos and the new one, if not anchored, an empty vector is used
		var dtlPos = new vec2();
		if(anchored) dtlPos = this.getTopLeftTilePos().minus(vec2.getBounds(tposes).topLeft);
		
		for(let i = tposes.length - 1; i >= 0; i--){
			// applies the difference and tileForm's grid translation to each tile
			let tpos = tposes[i].plus(this.gridPos).plus(dtlPos);
			// if the position is not able to be occupied, return false
			if(!tile.at(tpos).isEmpty() || tile.isOutOfBounds(tpos))
				return false;
		}
		
		return true;
	}
	
	translate(translation, forced = false){
		// moves the tileform by the specified translation
		// 'forced' forces the piece to move if it overlaps a non-empty tile
		if(!forced && !this.canTranslate(translation)) return;
		
		// applies the translation
		this.gridPos = this.gridPos.plus(translation);
		
		// animation stuff for smooth translation
		this.lastDrawPos = this.drawPos.clone();
		this.animOffset_translate = gameState.current.timeElapsed;
	}
	move(dir = side.down, forced = false){
		// moves the tileform in the specified direction by one grid unit
		// 'forced' forces the piece to move if it overlaps a non-empty tile
		if(!forced && !this.canMove(dir)) return;
		
		// applies the movement
		this.translate(vec2.fromSide(dir));
	}
	bumpDown(){
		// bumps the tileform downward if possible, otherwise sets it in place
		if(this.canMove()) this.move();
		else {
			this.setInPlace(); 
			return false;
		}
		return true;
	}
	rotate(dir = 1, anchored = false, forced = false){
		// rotates each tile 
		// 'dir = 1' is clockwise 'dir = -1' is counter-clockwise
		// 'anchored' determines whether or not the tileForm should be translated so that the top left tile matches the same 
		//   tile position as it did before being rotated, useful for square pieces not looking weird while rotated
		// 'forced' forces the piece to rotate if it overlaps a non-empty tile
		if(!forced && !this.canRotate(dir, anchored)) return;
		
		// if anchored, stores the lop left tile position in tlPos0
		var tlPos0;
		if(anchored) tlPos0 = this.getTopLeftTilePos();
		
		var ths = this;
		this.tiles.forEach(function(tileOb){
			let tpos = null;
			// clockwise rotation
			if(dir == 1) tpos = new vec2(-tileOb.gridPos.y, tileOb.gridPos.x);
			// counter-clockwise rotation
			else tpos = new vec2(tileOb.gridPos.y, -tileOb.gridPos.x);
			
			tileOb.gridPos = tpos;
			tileOb.entityID = tile.getEntityRotatedID(dir, tileOb.entityID, tileOb.entityType);
		});
		
		// if anchored, offsets the tileForm by the grid pos difference between the new top left and the old top left
		if(anchored){
			var dtlPos = tlPos0.minus(this.getTopLeftTilePos());
			this.translate(dtlPos);
		}
		
		//animation stuff for smooth rotation
		this.animOffset_rotate = gameState.current.timeElapsed;
		this.lastDrawRot = Math.PI / 2 * (dir == 1 ? -1 : 1);
	}
	rotateCW(){
		this.rotate(1, true);
	}
	rotateCCW(){
		this.rotate(-1, true);
	}
	
	setInPlace(){
		// sets each tile in the tileform and applies it to the tile grid
		var ths = this;
		this.tiles.forEach(function(tileOb){
			let tpos = tileOb.gridPos.plus(ths.gridPos);
			tile.setTileAt(tileOb, tpos);
		});
	}
	
	getTranslateAnimOffset(){
		// calculates the draw position's animation offset based on the smooth translation anim interval
		var animInterval = 50; // time in milliseconds it takes to complete the smooth translation animation
		
		var animElapsed = (gameState.current.timeElapsed - this.animOffset_translate) / animInterval;
		animElapsed = Math.max(0, Math.min(animElapsed, 1));
		var lpos = this.lastDrawPos.clone();
		var npos = tile.toScreenPos(this.gridPos, false);
		var dpos = npos.minus(lpos);
		
		return dpos.multiply(animElapsed);
	}
	getRotateAnimOffset(){
		// calculates the draw rotation's animation offset based on the smooth rotation anim interval
		var animInterval = 50; // time in milliseconds it takes to complete the smooth translation animation
		
		var animElapsed = (gameState.current.timeElapsed - this.animOffset_rotate) / animInterval;
		animElapsed = Math.max(0, Math.min(animElapsed, 1));
		
		var lRot = this.lastDrawRot;
		var nRot = 0;
		var dRot = nRot - lRot;
		
		return lRot + dRot * animElapsed;
	}
	
	draw(){
		// draws the tileForm's tiles
		
		// calculates the draw position and rotation based on the smooth movement animation speed
		this.drawPos = this.lastDrawPos.plus(this.getTranslateAnimOffset());
		var drawRot = this.getRotateAnimOffset();
		
		// draws each tile in the tileForm
		var ths = this;
		this.tiles.forEach(function(tileOb){
			let off = tileOb.gridPos.multiply(tile.tilesize);
			off = off.rotate(drawRot);
			tileOb.drawAtScreenPos(ths.drawPos.plus(off), drawRot);
		});
	}
}