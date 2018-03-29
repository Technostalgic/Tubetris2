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
	block: 1,
	ball: 2
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
// enumerate the different ball entity IDs
var balls = {
	none: -1,
	grey: 0,
	orange: 1,
	blue: 2,
	green: 3,
	gold: 4
}

class tile{
	constructor(){
		this.gridPos = new vec2(-1);
		this.setEntity(entities.none, entities.none);
		this.tintColor = new color();
	}
	
	static fromData(pos, entityID, entityType = entities.tube){
		// used to construct a tile from the specified data
		var r = new tile();
		r.tintColor = tile.normalTint;
		r.gridPos = pos;
		r.setEntity(entityID, entityType);
		return r;
	}
	
	static init(){
		// initializes the static fields for the tile class
		tile.tilesize = 32;
		tile.normalTint = color.fromRGBA(0, 0, 0, 0.4);
		tile.offset = new vec2(-screenBounds.width % tile.tilesize - 2, -screenBounds.height % tile.tilesize - 2).plus(new vec2(tile.tilesize));
		tile.gridBounds = collisionBox.fromSides(0, 0, 10, 20);
		tile.grid = [];
		tile.constructGrid();
		tile.nextTileformSlot = screenBounds.topRight.plus(new vec2(-74, 74));
		
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
			new spriteBox(new vec2(tile.tilesize * 0, tile.tilesize * 1), new vec2(tile.tilesize)),	// quad: 10 
																									//~~ bricks:
			new spriteBox(new vec2(tile.tilesize * 0, 0), new vec2(tile.tilesize)),	// block_brick: 11,
			new spriteBox(new vec2(tile.tilesize * 1, 0), new vec2(tile.tilesize)),	// block_bomb: 12 
																					//~~ balls:
			new spriteBox(new vec2(tile.tilesize * 0, 0), new vec2(tile.tilesize)),	// grey: 13,
			new spriteBox(new vec2(tile.tilesize * 1, 0), new vec2(tile.tilesize)),	// orange: 14,
			new spriteBox(new vec2(tile.tilesize * 2, 0), new vec2(tile.tilesize)),	// blue: 15,
			new spriteBox(new vec2(tile.tilesize * 3, 0), new vec2(tile.tilesize)),	// green: 16,
			new spriteBox(new vec2(tile.tilesize * 4, 0), new vec2(tile.tilesize)),	// gold: 17
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
			[side.left, side.right, side.up, side.down],	// block_bomb: 12
			[],												// ball: 13
			[],												// ball: 14
			[],												// ball: 15
			[],												// ball: 16
			[]												// ball: 17
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
			0,	// block_brick: (11 - offIDCount) -> 0
			1,	// block_bomb: (12 - offIDCount) -> 1
			0,	// ball(grey): (13 - offIDCount) -> 0
			1,	// ball(orange): (14 - offIDCount) -> 1
			2,	// ball(blue): (15 - offIDCount) -> 2
			3,	// ball(green): (16 - offIDCount) -> 3
			4,	// ball(gold): (17 - offIDCount) -> 4
		];  
	}       
	static constructGrid(){
		// constructs a tile grid full of empty tiles
		tile.grid = [];
		for(let x = tile.gridBounds.left; x < tile.gridBounds.right; x++){
			// creates an empty array for each valid iteration of the horizontal grid bounds
			tile.grid[x] = [];
			for(let y = tile.gridBounds.top; y < tile.gridBounds.bottom; y++){
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
		r.setEntity(blocks.block_brick, entities.block);
		r.tintColor = tile.normalTint;
		if(pos) r.gridPos = pos;
		return r;
	}
	
	static getEntityOpenSides(entityID, entityType = entities.tube){
		var uid = tile.getEntityUID(entityID, entityType);
		return tile.entityOpenSides[uid];
	}
	static getEntitySprite(entityID, entityType = entities.tube){
		var spritesheet = null;
		
		// sets the spritesheet according to the entity's type
		switch (entityType){
			case entities.none: return null;
			case entities.tube:
				spritesheet = gfx.tiles_tubes;
				break;
			case entities.block: 
				spritesheet = gfx.tiles_blocks; 
				break;
			case entities.ball:
				spritesheet = gfx.tiles_balls;
				break;
		}
		
		var uid = tile.getEntityUID(entityID, entityType);
		return new spriteContainer(spritesheet, tile.entitySprites[uid]);
	}
	static getEntityRotatedID(direction, entityID, entityType = entities.tube){
		var uid = tile.getEntityUID(entityID, entityType);
		
		// if clockwise, rotate once by 90 degrees clockwise
		var r = uid;
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
		
		// returns a full tile if the position is below, or to the left or right of the tile grid bounds
		if(pos.y >= tile.gridBounds.bottom || pos.x < tile.gridBounds.left || pos.x >= tile.gridBounds.right){
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
		
		// tiles outside of the grid cannot be set
		if(tile.isOutOfBounds(pos)) return;
		
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
	
	static getEntityUID(entityID, entityType = entities.tube){
		var off = 0;
		
		// returns null entity if either the entity type or id is none
		if(entityID < 0 || entityType < 0) return entities.none;
		
		// adds the length of the entity specific enumerator to offset the entityID so that the correct UID offset is returned
		// the switch statement probably looks like a dumb way to do it but it will be cleaner if I end up adding more entity types
		switch (entityType){
			case entities.ball: off += Object.keys(blocks).length - 1;
			case entities.block: off += Object.keys(tubes).length - 1;
			default: break;
		}
		
		return off + entityID;
	}
	static getUIDEntityType(uid){
		if(uid > tile.getEntityUID(0, entities.ball))
			return entities.ball;
		if(uid > tile.getEntityUID(0, entities.block))
			return entities.block;
		return entities.tube;
	}
	static getUIDEntityID(uid){
		var type = tile.getUIDEntityType(uid);
		var off = tile.getEntityUID(0, type);
		return uid - off;
	}
	
	static explodeAt(pos){
		// causes a destructive explosion at the specified position
		effect.createExplosion(tile.toScreenPos(pos));
		for(let y = pos.y - 1; y <= pos.y + 1; y++){
			for(let x = pos.x - 1; x <= pos.x + 1; x++){
				var ttile = tile.at(x, y);
				if(!ttile.isEmpty()){
					if(gameState.current.phase instanceof phase_destroyTaggedTiles){
						if(ttile.isEntity(blocks.block_bomb, entities.block))
							gameState.current.phase.tilesTagged.push(ttile);
						else ttile.destroy();
					}
					else ttile.destroy();
				}
			}
		}
	}
	
	static CP_ball(self){
		// the set in place action for a ball tile entity
		tile.at(this.gridPos).destroy();
		if(gameState.current instanceof state_gameplayState)
			gameState.current.spawnBallAt(self.gridPos, self.entityID);
	}
	static CP_bomb(self){
		// what happens when a bomb is set in place
		tile.setTileAt(self, self.gridPos);
		var neighborPos = [
			self.gridPos.plus(vec2.fromSide(side.down)),
			self.gridPos.plus(vec2.fromSide(side.left)),
			self.gridPos.plus(vec2.fromSide(side.right)),
			self.gridPos.plus(vec2.fromSide(side.up))
		];
		
		var enterDestMode = false;
		var tagblocks = [self];
		neighborPos.forEach(function(npos){
			let ttile = tile.at(npos);
			if(ttile.isEntity(blocks.block_bomb, entities.block)){
				enterDestMode = true;
				tagblocks.push(ttile);
			}
		});
		
		if(enterDestMode){
			var p = new phase_destroyTaggedTiles(gameState.current);
			p.setTilesTagged(tagblocks);
			gameState.current.switchGameplayPhase(p);
		}
	}
	static RT_normal(self, ball){
		// tag
		this.tag();
	}
	static RT_bomb(self, ball){
		ball.destroy();
	}
	static DST_bomb(self){
		// the custom destroy method for bombs
		tile.explodeAt(self.gridPos);
		
		// if the gameplay phase is in the destroy tagged tiles phase, set the fallHeight to compensate for the tiles in the bomb's explosion radius
		if(gameState.current.phase instanceof phase_destroyTaggedTiles){
			gameState.current.phase.concatFallHeight(this.gridPos.x - 1, this.gridPos.y + 1);
			gameState.current.phase.concatFallHeight(this.gridPos.x, this.gridPos.y + 1);
			gameState.current.phase.concatFallHeight(this.gridPos.x + 1, this.gridPos.y + 1);
		}
	}
	
	isEmpty(){
		return this.entityID == entities.none || this.entityType == entities.none;
	}
	setEntity(entityID, entityType = entities.tube){
		this.entityType = entityType;
		this.entityID = entityID;
		
		switch(entityType){
			case entities.tube:
				break;
			case entities.ball: 
				this.m_checkPlacement = tile.CP_ball;
				break;
			case entities.block:
				if(this.entityID == blocks.block_bomb){
					this.m_checkPlacement = tile.CP_bomb;
					this.m_rollThrough = tile.RT_bomb;
					this.m_destroy = tile.DST_bomb;
				}
				break;
			default: 
				this.m_rollThrough = tile.RT_normal;
				break;
		}
	}
	isEntity(entityID, entityType = entities.tube){
		return(this.entityID == entityID && this.entityType == entityType);
	}
	
	getOpenSides(){
		if(this.entityID == entities.none) return [side.left, side.right, side.up, side.down];
		return tile.getEntityOpenSides(this.entityID, this.entityType);
	}
	getUnblockedSides(){
		var os = this.getOpenSides();
		var us = [];
		
		var ths = this;
		os.forEach(function(dir){
			if(tile.at(ths.gridPos.plus(vec2.fromSide(dir))).getOpenSides().includes(invertedSide(dir)))
				us.push(dir);
		});
		
		return us;
	}
	getSprite(){
		if(this.entityID == entities.none) return null;
		var r = tile.getEntitySprite(this.entityID, this.entityType);
		var bounds = new collisionBox(tile.toScreenPos(this.gridPos, false), new vec2(tile.tilesize));
		r.bounds = bounds;
		return r;
	}
	
	place(pos = null){
		if(pos) this.gridPos = pos;
		tile.setTileAt(this, this.gridPos);
	}
	destroy(){
		// destroys the tile
		var tpos = this.gridPos.clone();
		tile.setTileAt(tile.getEmpty(tpos), tpos);
		effect.createPoof(tile.toScreenPos(tpos));
		this.m_destroy(this);
	}
	tag(){
		// gets tagged by ball rolling through it
		this.tintColor = color.fromRGBA(255, 255, 255, 0.5);
	}
	
	checkPlacement(){
		this.m_checkPlacement(this);
	}
	rollThrough(ballOb = null){
		this.m_rollThrough(this, ballOb);
	}
	
	m_checkPlacement(self = null){}
	m_rollThrough(self = null, ballOb = null){}
	m_destroy(self){}
	
	clone(){
		// returns an identical tile object of a seperate instance
		var r = tile.fromData(this.gridPos.clone(), this.entityID, this.entityType);
		
		return r;
	}
	
	draw(){
		// draw the sprite
		this.drawAtScreenPos(tile.toScreenPos(this.gridPos, false));
	}
	drawAtScreenPos(pos, rotation = null, drawTint = true){
		// draw the sprite at the specified position
		if(drawTint)
			this.drawTintAtScreenPos(pos);
		
		var sprite = this.getSprite();
		if(!sprite) return;
		sprite.bounds.pos = pos;
		if(rotation) sprite.rotation = rotation;
		sprite.draw();
	}
	drawTintAtScreenPos(pos){
		this.tintColor.setFill();
		renderContext.fillRect(pos.x, pos.y, tile.tilesize, tile.tilesize);
	}
}

// a data structure that represents an assortment of tiles that can be moved and rotated as one, basically tubtris' version of a tetromino
class tileform{
	constructor(){
		this.gridPos = new vec2(4, -1);
		this.tiles = [];
		this.swappable = true;
		this.anchoredRotation = false;
		
		// animation stuff for smooth transformations
		this.animOffset_translate = gameState.current.timeElapsed;
		this.drawPos = tile.toScreenPos(this.gridPos, false);
		this.lastDrawPos = this.drawPos.clone();
		this.animOffset_rotate = gameState.current.timeElapsed - 1000;
		this.lastDrawRot = 0;
	}
	
	static getPiece_random(){
		var r = [
			"getPiece_square",
			"getPiece_straight",
			"getPiece_L0",
			"getPiece_L1",
			"getPiece_Z0",
			"getPiece_Z1",
			"getPiece_bomb",
			"getPiece_brick"
		];
		var i = Math.floor(r.length * Math.random());
		
		return tileform[r[i]]();
	}
	
	static getPiece_square(){
		var r = new tileform();
		r.anchoredRotation = true;
		r.tiles = [
			tile.fromData(new vec2(0, 0), tubes.S_horizontal),
			tile.fromData(new vec2(1, 0), tubes.L_upLeft),
			tile.fromData(new vec2(1, -1), tubes.L_downLeft),
			tile.fromData(new vec2(0, -1), tubes.S_horizontal)
		];
		return r;
	}
	static getPiece_straight(){
		var r = new tileform();
		r.tiles = [
			tile.fromData(new vec2(-1, 0), tubes.T_horizontalDown),
			tile.fromData(new vec2(0, 0), tubes.T_horizontalUp),
			tile.fromData(new vec2(1, 0), tubes.T_horizontalDown),
			tile.fromData(new vec2(2, 0), tubes.T_horizontalUp)
		];
		return r;
	}
	static getPiece_L0(){
		var r = new tileform();
		r.tiles = [
			tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp),
			tile.fromData(new vec2(0, 0), tubes.S_horizontal),
			tile.fromData(new vec2(1, 0), tubes.L_upLeft),
			tile.fromData(new vec2(1, -1), tubes.T_horizontalDown)
		];
		return r;
	}
	static getPiece_L1(){
		var r = new tileform();
		r.tiles = [
			tile.fromData(new vec2(-1, -1), tubes.T_horizontalDown),
			tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp),
			tile.fromData(new vec2(0, 0), tubes.S_horizontal),
			tile.fromData(new vec2(1, 0), tubes.T_horizontalUp)
		];
		return r;
	}
	static getPiece_Z0(){
		var r = new tileform();
		r.anchoredRotation = true;
		r.tiles = [
			tile.fromData(new vec2(-1, -1), tubes.L_downRight),
			tile.fromData(new vec2(0, -1), tubes.T_horizontalDown),
			tile.fromData(new vec2(0, 0), tubes.L_upRight),
			tile.fromData(new vec2(1, 0), tubes.S_horizontal)
		];
		return r;
	}
	static getPiece_Z1(){
		var r = new tileform();
		r.anchoredRotation = true;
		r.tiles = [
			tile.fromData(new vec2(-1, 0), tubes.S_horizontal),
			tile.fromData(new vec2(0, 0), tubes.L_upLeft),
			tile.fromData(new vec2(0, -1), tubes.T_horizontalDown),
			tile.fromData(new vec2(1, -1), tubes.L_downLeft)
		];
		return r;
	}
	
	static getPiece_bomb(){
		var r = new tileform();
		
		r.tiles = [
			tile.fromData(new vec2(), blocks.block_bomb, entities.block)
		];
		
		return r;
	}
	static getPiece_brick(){
		var r = new tileform();
		
		r.tiles = [
			tile.fromData(new vec2(), blocks.block_brick, entities.block)
		];
		
		return r;
	}
	static getPiece_ball(type = null){
		var r = new tileform();
		
		if(type == null) type = Math.floor(Math.random() * (Object.keys(balls).length - 1));
		r.tiles = [
			tile.fromData(new vec2(), type, entities.ball)
		];
		
		return r;
	}
	
	getCenterOff(){
		var minY,
			maxY;
		var minX,
			maxX;
		
		this.tiles.forEach(function(tileOb, i){
			if(i == 0){
				minY = tileOb.gridPos.y;
				maxY = minY;
				minX = tileOb.gridPos.x;
				maxX = minX;
				return;
			}
			
			if(tileOb.gridPos.y < minY) minY = tileOb.gridPos.y;
			if(tileOb.gridPos.y > maxY) maxY = tileOb.gridPos.y;
			
			if(tileOb.gridPos.x < minX) minX = tileOb.gridPos.x;
			if(tileOb.gridPos.x > maxX) maxX = tileOb.gridPos.x;
		});
		
		if(minY == undefined) return new vec2(tile.tilesize / 2);
		
		var min = new vec2(minX, minY);
		var center = new vec2((maxX - minX + 1) / 2, (maxY - minY + 1) / 2);
		
		return center.plus(min).multiply(tile.tilesize);
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
		// returns a list of grid positions that are occupied by the tileform's tiles
		var r = [];
		var ths = this;
		
		// adds the tileform's gridPos to each of it's tile's gridPos and adds the result to a list
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
		
		// adds the tileform's gridPos to a list
		this.tiles.forEach(function(tileOb){
			r.push(tileOb.gridPos.clone());
		});
		
		return r;
	}
	canMove(dir = side.down){
		// checks to see if the tileform can move in the specified direction
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
		// checks to see if the tileform can be rotated
		// applies the rotation to each tile in the tileform and stores the results in tposes
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
			// applies the difference and tileform's grid translation to each tile
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
		// 'anchored' determines whether or not the tileform should be translated so that the top left tile matches the same 
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
		
		// if anchored, offsets the tileform by the grid pos difference between the new top left and the old top left
		if(anchored){
			var dtlPos = tlPos0.minus(this.getTopLeftTilePos());
			this.translate(dtlPos);
		}
		
		//animation stuff for smooth rotation
		this.animOffset_rotate = gameState.current.timeElapsed;
		this.lastDrawRot = Math.PI / 2 * (dir == 1 ? -1 : 1);
	}
	rotateCW(){
		this.rotate(1, this.anchoredRotation);
	}
	rotateCCW(){
		this.rotate(-1, this.anchoredRotation);
	}
	
	setInPlace(){
		// sets each tile in the tileform and applies it to the tile grid
		var ths = this;
		this.tiles.forEach(function(tileOb){
			let tpos = tileOb.gridPos.plus(ths.gridPos);
			tileOb.place(tpos);
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
		// draws the tileform's tiles
		// calculates the draw position and rotation based on the smooth movement animation speed
		this.drawPos = this.lastDrawPos.plus(this.getTranslateAnimOffset());
		var drawRot = this.getRotateAnimOffset();
		
		// draws each tile in the tileform
		var ths = this;
		this.tiles.forEach(function(tileOb){
			let off = tileOb.gridPos.multiply(tile.tilesize);
			off = off.rotate(drawRot);
			tileOb.drawAtScreenPos(ths.drawPos.plus(off), drawRot);
		});
	}
	drawAtScreenPos(pos, drawtint = true){
		// calculates the draw position and rotation based on the smooth movement animation speed
		var dpos = pos;
		
		// draws each tile in the tileform
		this.tiles.forEach(function(tileOb){
			let off = tileOb.gridPos.multiply(tile.tilesize);
			tileOb.drawAtScreenPos(dpos.plus(off), null, false);
		});
	}
}