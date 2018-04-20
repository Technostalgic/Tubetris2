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
		var itemNames = [
			"getItem_extraItems",
			"getItem_extraPoints",
			"getItem_rollingBomb",
			"getItem_detonateBricks"
		];

		var itm = Math.floor(Math.random() * itemNames.length);
		return item[itemNames[itm]]();
	}
	static getItem_extraItems(){
		// returns the 'extra items' item
		var r = new item();
		r.icon = 0;
		r.m_activate = item.ACT_extraItems;
		r.iconAnim = item.anim_pulsate();
		return r;
	}
	static getItem_extraPoints(){
		// returns the 'extra points' item
		var r = new item();
		r.icon = 1;
		r.m_activate = item.ACT_extraPoints;
		r.iconAnim = item.anim_pulsate();
		return r;
	}
	static getItem_rollingBomb(){
		var r = new item();
		r.icon = 2;
		r.m_activate = item.ACT_rollingBomb;
		r.iconAnim = item.anim_pulsate();
		return r;
	}
	static getItem_detonateBricks(){
		var r = new item();
		r.icon = 3;
		r.m_activate = item.ACT_detonateBricks;
		r.iconAnim = item.anim_pulsate();
		return r;
	}
	
	static anim_pulsate(){
		// returns a pulsating animation
		var r = new textAnim_scale();
		r.animLength = 1000;
		r.minScale = 0.85;
		r.maxScale = 1.15;
		r.looping = true;
		r.animType = textAnimType.trigonometricCycle;
		
		return r;
	}
	static anim_teeter(){
		return new textAnim_rotationOffset(1000);
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
	static ACT_rollingBomb(self, ballOb){
		ballOb.addDestroyEventListener(function(self){
			tile.explodeAt(new vec2(self.gridPos.x, self.gridPos.y));
		});
	}
	static ACT_detonateBricks(self, ballOb){
		var bricksDetonated = 0;
		var iterator = function(tileOb, x, y){
			if(tileOb.isEntity(blocks.brick, entities.block)){
				tile.explodeAt(new vec2(x, y), false);
				bricksDetonated++;
				scoring.addScore(bricksDetonated *= 200, tile.toScreenPos(new vec2(x, y)), scoreTypes.bonus);
			}
		};
		tile.iterateGrid(iterator);
	}
	
	draw(pos){
		// draws the item at the specified position
		drawCenteredImage(renderContext, gfx.item_backdrop, pos);
		this.drawIcon(pos);
	}
	drawIcon(pos){
		// draws the icon for the item
		var spritesheet = gfx.item_icons;
		var spr = new spriteBox(new vec2(), new vec2(gfx.item_icons.height));
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