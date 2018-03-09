///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

class tile{
	constructor(){}
	
	static init(){
		tile.tilesize = 32;
		tile.offset = new vec2(-screenBounds.width % tile.tilesize - 2, -screenBounds.height % tile.tilesize - 2).plus(new vec2(tile.tilesize));
		tile.board = collisionBox.fromSides(0, 0, 10, 20);
	}
	
	static toTilePos(screenPos){
		var r = screenPos.minus(offset);
		
		r = r.multiply(1 / tile.tilesize);
		r = new vec2(Math.floor(r.x), Math.floor(r.y));
		
		return r;
	}
}