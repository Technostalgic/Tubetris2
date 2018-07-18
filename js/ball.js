///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerate the different states a ball object can be
var ballStates = {
	none: -1,
	choosing: 0,
	moving: 1,
	paused: 2,
	dead: 3
}

// a physical ball entity that can move through the tubes during the phase_ballPhysics gameplayPhase
class ball{
	constructor(pos, type = balls.grey){
		this.gridPos = pos;
		this.nextPos = null;
		this.drawPos = tile.toScreenPos(this.gridPos);
		this.ballType = type;
		this.pauseDirections = null;
		this.pausePaths = null;
		this.isVirtual = false;
		
		this.state = ballStates.choosing;
		this.travelDir = side.none;
		this.momentum = 0;
		this.lastPosUpdate = gameState.current.timeElapsed;
		
		this.toPause = false;
		this.tilesTagged = [];
		this.gridsTrotted = [];
	}
	
	update(dt){
		// main logic step for the ball
		switch(this.state){
			case ballStates.moving: // moving animation
				this.move();
				break;
			case ballStates.choosing: // deciding which way to go next
				this.chooseNextTravelDir();
				break;
			case ballStates.paused: break;
			case ballStates.dead: return;
		}
	}
	
	getTrotCount(pos = this.gridPos){
		// returns how many times the ball has occupied this tile
		if(!this.gridsTrotted[pos.x])
			return 0;
		if(!this.gridsTrotted[pos.x][pos.y])
			return 0;
		
		return this.gridsTrotted[pos.x][pos.y];
	}

	getMoveAnimProgress(){
		// returns a value between 0 and 1 indicating the percent complete that the movement animation is
		var animLength = 100;
		
		return Math.min(1 - (this.lastPosUpdate + animLength - gameState.current.timeElapsed) / animLength, 1);
	}
	finishMoveAnim(){
		// in a nutshell, tells the ball to start deciding where it should go next
		if(this.nextPos)
			this.drawPos = tile.toScreenPos(this.nextPos);
		this.state = ballStates.choosing;
		if(this.nextPos)
			this.gridPos = this.nextPos.clone();
		
		audioMgr.playSound(sfx.ballRoll);
		
		// counts how many times the tile has been occupied by the ball
		if(!this.gridsTrotted[this.gridPos.x])
			this.gridsTrotted[this.gridPos.x] = [];
		if(!this.gridsTrotted[this.gridPos.x][this.gridPos.y])
			this.gridsTrotted[this.gridPos.x][this.gridPos.y] = 0;
		this.gridsTrotted[this.gridPos.x][this.gridPos.y]++;

		// if the tile has been occupied 5 or more times, destroy the ball (prevents ball from getting stuck in an infinite loop)
		if(this.gridsTrotted[this.gridPos.x][this.gridPos.y] >= 5)
			this.destroy();
	}
	move(){
		// moves the ball to it's nextPos
		var prog = this.getMoveAnimProgress();
		this.checkTileForTagging();
		
		// if the movement animation is complete, decide where to go next
		if(prog >= 1) {
			this.checkTileForTagging();
			this.finishMoveAnim();
			return;
		}
		
		// the ball is drawn between it's gridPos and nextPos based on a percentage(prog) of how complete the 
		// movement animation is
		var off = this.nextPos.minus(this.gridPos).multiply(prog * tile.tilesize);
		this.drawPos = tile.toScreenPos(this.gridPos).plus(off);
	}
	checkTileForTagging(){
		// ensures the tile at the current draw position is tagged
		var gpos = tile.toTilePos(this.drawPos);
		var ttile = tile.at(gpos);
		
		if(!ttile.isEmpty()){
			ttile.collectItem(this);
			
			// don't tag the tile if it's a different color than the ball (unless either is gold)
			if(ttile.isEntityType(entities.tube))
				if(this.ballType != balls.gold && ttile.tileVariant != tubeColors.gold)
					if(ttile.tileVariant != this.ballType)
						return;
				
			if(!this.tilesTagged.includes(ttile))
				this.tagTile(ttile);
		}
	}
	tagTile(tileOb){
		// tags the specified tile
		this.tilesTagged.push(tileOb);
		tileOb.rollThrough(this);
	}
	
	pause(backtracking = false){
		// pauses the ball to wait for player input
		this.toPause = false;
		this.state = ballStates.paused;

		this.findPauseDirections(backtracking);
		if(config.pathIndicators)
			this.findPausePaths();
		
		audioMgr.playSound(sfx.ballPause);
	}
	findPauseDirections(backtracking = false){
		// get the unblocked directions at the current tile
		if(this.isVirtual) return;
		var unblocked = tile.at(this.gridPos).getUnblockedSides();
		
		// remove the previous travelDirection's opposite from the possible travel directions if backtracking is disabled
		if(!backtracking)
			for(var i = unblocked.length; i >= 0; i--){
				if(unblocked[i] == invertedSide(this.travelDir)){
					unblocked.splice(i, 1);
					break;
				}
			}
		
		this.pauseDirections = unblocked;
	}
	findPausePaths(){
		// calculate the potential travel paths and generate an imgage that displays them
		if(this.isVirtual) return;
		var pathWidth = 4;
		
		var pathCanvas = document.createElement("canvas");
		pathCanvas.width = tile.gridBounds.width * tile.tilesize;
		pathCanvas.height = tile.gridBounds.height * tile.tilesize;
		
		var pathCtx = pathCanvas.getContext("2d");
		
		// send a virtual ball out in each direction and draw its path
		var ths = this;
		this.pauseDirections.forEach(function(dir){
			let tball = new ball(ths.gridPos.clone(), ths.ballType);
			tball.isVirtual = true;
			tball.travelDir = dir;
			tball.updateNextPos();
			
			// roll the ball until it is destroyed or paused and track its location with pArray
			let pArray = [{
					pos:tball.gridPos, 
					dir:tball.travelDir
					}];
			for(let i = 100; i >= 0; i--){
				tball.finishMoveAnim();
				tball.chooseNextTravelDir();
				tile.at(tball.gridPos).rollThrough(tball);
				
				pArray.push({
					pos:tball.gridPos, 
					dir:tball.travelDir
					});
				
				if(tball.toPause) tball.pause();
				if(tball.state == ballStates.paused || tball.state == ballStates.dead)
					break;
			}
			
			// print all the tball's positions onto the path canvas
			var lpoint = null;
			pArray.forEach(function(bpoint, i){
				let tpoint = null;
				let tsize = null;
				
				// create the second dash of the path in the tile
				let tbox = null;
				if(i > 0 && i < pArray.length - 1) { // if not the first or last iteration
					tpoint = tile.toScreenPos(bpoint.pos).plus(vec2.fromSide(bpoint.dir).multiply(tile.tilesize / 4));
					tpoint = tpoint.minus(tile.offset);
					tsize = vec2.fromSide(bpoint.dir).multiply(tile.tilesize / 4);
					tsize.x = Math.max(Math.abs(tsize.x), pathWidth);
					tsize.y = Math.max(Math.abs(tsize.y), pathWidth);
					tbox = new collisionBox(new vec2(), tsize.clone());
					tbox.setCenter(tpoint.clone());
				}
				
				// create the first dash of the path in the tile
				let lbox = null;
				if(lpoint){ // if not the first iteration
					tpoint = tile.toScreenPos(bpoint.pos).plus(vec2.fromSide(invertedSide(lpoint.dir)).multiply(tile.tilesize / 4));
					tpoint = tpoint.minus(tile.offset);
					tsize = vec2.fromSide(invertedSide(lpoint.dir)).multiply(tile.tilesize / 4);
					tsize.x = Math.max(Math.abs(tsize.x), pathWidth);
					tsize.y = Math.max(Math.abs(tsize.y), pathWidth);
					lbox = new collisionBox(new vec2(), tsize.clone());
					lbox.setCenter(tpoint.clone());
				}
				lpoint = bpoint;
				
				// draw the first dash if possible, as well as the second if possible
				if(lbox) lbox.drawOutline(pathCtx, "#000", 2);
				if(tbox) tbox.drawOutline(pathCtx, "#000", 2);
				if(lbox) lbox.drawFill(pathCtx, "#FFF");
				if(tbox) tbox.drawFill(pathCtx, "#FFF");
			});
			
			// print the end point onto the path canvas
			let tsprt = new spriteBox(new vec2(), new vec2(gfx.pathIndicators.height, gfx.pathIndicators.width / 2));
			if(tball.state == ballStates.dead)
				tsprt.pos.x = gfx.pathIndicators.width / 2;
			let tbox = new collisionBox(new vec2(), tsprt.size);
			tbox.setCenter(tile.toScreenPos(tball.gridPos).minus(tile.offset));
			let endSprt = new spriteContainer(gfx.pathIndicators, tsprt, tbox);
			endSprt.draw(pathCtx);
		});
		
		this.pausePaths = pathCanvas;
	}
	direct(dir){
		// when the ball is paused, this method allows the user to decide which way the ball should go
		if(this.state != ballStates.paused) return;
		
		for(var pdir of this.pauseDirections){
			if(pdir == dir){
				this.travelDir = dir;
				this.updateNextPos();
				this.state = ballStates.moving;
				break;
			}
		}
		audioMgr.playSound(sfx.ballRoll);
	}
	
	chooseNextTravelDir(){
		// decides which way the ball will go next
		var ttile = tile.at(this.gridPos);
		var unblocked = ttile.getUnblockedSides();
		var tdir;
		
		// if it's travel direction isn't none (which only ever happens on the first ball movement tick), 
		// the ball will be destroyed if not inside a tube
		// otherwise set the travelDir to down
		if(this.travelDir != side.none){
			if(tile.at(this.gridPos).isEmpty()){
				this.destroy();
				return;
			}
		}
		else this.travelDir = side.down;
		
		// if the ball has been set to pause by the tile it previously tagged, pause it
		if(this.toPause) {
			this.pause(true); 
			return;
		}
		
		// remove the opposite of the previous travelDirection from the array of possible travel directions
		for(var i = unblocked.length; i >= 0; i--){
			if(unblocked[i] == invertedSide(this.travelDir)){
				unblocked.splice(i, 1);
				break;
			}
		}
		
		// destroy the ball if nowhere left to go
		if(unblocked.length <= 0){
			this.destroy();
			return;
		}
		
		// if downward is unblocked, gravity will pull the ball down,
		// otherwise if it's previous travelDir is unblocked it goes that way,
		// otherwise if there is more than one possible direction to go, it pauses,
		// otherwise it goes the only possible direction left to go
		if(unblocked.includes(side.down)) 
			tdir = side.down;
		else if(unblocked.includes(this.travelDir))
			tdir = this.travelDir;
		else if(unblocked.length > 1){
			this.pause();
			return;
		}
		else tdir = unblocked[0];
		
		this.travelDir = tdir;
		this.updateNextPos();
		this.state = ballStates.moving;
	}
	updateNextPos(){
		// updates the ball's nextPos once the travel direction has been determined
		this.nextPos = this.gridPos.plus(vec2.fromSide(this.travelDir));
		this.lastPosUpdate = gameState.current.timeElapsed;
	}
	
	destroy(){
		// destroys the ball object
		if(this.state == ballStates.dead) return;
		this.state = ballStates.dead;
		
		if(this.isVirtual) return;
		effect.createPoof(this.drawPos);
		audioMgr.playSound(sfx.burst);
	}
	
	draw(){
		// draws the ball object if it's still alive
		if(this.state == ballStates.dead) return;
		
		var sprt = new spriteBox(new vec2(tile.tilesize * this.ballType, 0), new vec2(tile.tilesize));
		drawCenteredImage(renderContext, gfx.tiles_balls, this.drawPos, sprt);
		
		if(this.state == ballStates.paused){
			this.drawDirectionIndicators();
			if(config.pathIndicators)
				this.drawPathIndicators();
		}
	}
	drawDirectionIndicators(){
		// draws the arrows that show which way the ball can be directed when it is paused
		if(!this.pauseDirections) return;
		
		var ths = this;
		this.pauseDirections.forEach(function(dir){
			var tpos = tile.toScreenPos(ths.gridPos).plus(vec2.fromSide(dir).multiply(tile.tilesize / 2));
			drawArrow(tpos, dir);
		});
	}
	drawPathIndicators(){
		// draws the potential paths the ball can travel along
		if(!this.pausePaths) this.findPausePaths();
		drawImage(renderContext, this.pausePaths, tile.offset);
	}
}