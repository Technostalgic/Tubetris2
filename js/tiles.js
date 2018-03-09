///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

class tile{
	constructor(){
		this.gridPos = new vec2(-1);
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
			tile.grid[x] = [];
			for(let y = tile.gridBounds.top; y <= tile.gridBounds.bottom; y++){
				tile.grid[x][y] = tile.getEmpty(new vec2(x, y));
			}
		}
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
		var r = screenPos.minus(offset);
		
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
		// returns the tile at pos
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
}