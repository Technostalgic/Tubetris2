///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerate the different tube pieces and entities
var entity = {
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
	quad: 10,
	block_brick: 11,
	block_bomb: 12
}

// gets the open sides of each entity type
var entityOpenSides = [
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
// gets the sprite of each entity type
var entitySprites = [
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 0, tile.tilesize * 0), new vec2(tile.tilesize) )),	// S_horizontal: 0,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 1, tile.tilesize * 0), new vec2(tile.tilesize) )),	// S_vertical: 1,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 2, tile.tilesize * 0), new vec2(tile.tilesize) )),	// T_horizontalDown: 2,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 3, tile.tilesize * 0), new vec2(tile.tilesize) )),	// T_horizontalUp: 3,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 2, tile.tilesize * 1), new vec2(tile.tilesize) )),	// T_verticalRight: 4,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 3, tile.tilesize * 1), new vec2(tile.tilesize) )),	// T_verticalLeft: 5,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 4, tile.tilesize * 0), new vec2(tile.tilesize) )),	// L_downRight: 6,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 5, tile.tilesize * 0), new vec2(tile.tilesize) )),	// L_downLeft: 7,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 4, tile.tilesize * 1), new vec2(tile.tilesize) )),	// L_upRight: 8,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 5, tile.tilesize * 1), new vec2(tile.tilesize) )),	// L_upLeft: 9,
	new spriteContainer(gfx.tiles_tubes, new spriteBox(new vec2(tile.tilesize * 0, tile.tilesize * 1), new vec2(tile.tilesize) )),	// quad: 10,
	new spriteContainer(gfx.tiles_blocks, new spriteBox(new vec2(tile.tilesize * 0, 0), new vec2(tile.tilesize) )),	// block_brick: 11,
	new spriteContainer(gfx.tiles_blocks, new spriteBox(new vec2(tile.tilesize * 1, 0), new vec2(tile.tilesize) )),	// block_bomb: 12
]

class tile{
	constructor(){
		this.gridPos = new vec2(-1);
		this.entityType = entity.none;
	}
	
	static init(){
		// initializes the static fields for the tile class
		tile.tilesize = 32;
		tile.offset = new vec2(-screenBounds.width % tile.tilesize - 2, -screenBounds.height % tile.tilesize - 2).plus(new vec2(tile.tilesize));
		tile.gridBounds = collisionBox.fromSides(0, 0, 10, 20);
		tile.grid = [];
		tile.constructGrid();
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
		// returns the tile at the specified pos
		if(ypos) return tile.at(new vec2(pos, ypos));
		
		// returns a full tile if the position is below the tile grid (if the tile at pos is undefined)
		if(pos.y > tile.gridBounds.bottom){
			if(!tile.grid[pos.x]) return tile.getFull(pos);
			return tile.fromAny(tile.grid[pos.x][pos.y], false, pos);
		}
		// returns an empty tile if the position is above the bottom of the tile grid (if the tile at pos is undefined)
		if(!tile.grid[pos.x]) return tile.getEmpty(pos);
		return tile.fromAny(tile.grid[pos.x][pos.y], true, pos);
	}
	static fromAny(ob, empty = true, pos = null){
		// returns a tile from ANY object type
		// if the object is a tile, simply return the object
		if(ob instanceof tile) return ob;
		// otherwise, return either an empty or full tile at the specified position
		var r = empty ? tile.getEmpty(pos) : tile.getFull(pos);
		return r;
	}
	
	getOpenSides(){
		if(this.entityType == entity.none) return [side.left, side.right, side.up, side.down];
		return entityOpenSides[this.entityType];
	}
	
	draw(){
	}
}