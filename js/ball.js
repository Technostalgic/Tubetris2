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
		
		this.state = ballStates.choosing;
		this.travelDir = side.none;
		this.momentum = 0;
		this.lastPosUpdate = gameState.current.timeElapsed;
		
		this.tilesTagged = [];
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
	
	getMoveAnimProgress(){
		// returns a value between 0 and 1 indicating the percent complete that the movement animation is
		var animLength = 100;
		
		return Math.min(1 - (this.lastPosUpdate + animLength - gameState.current.timeElapsed) / animLength, 1);
	}
	move(){
		// moves the ball to it's nextPos
		var prog = this.getMoveAnimProgress();
		
		// if the movement animation is complete, decide where to go next
		if(prog >= 1) {
			this.drawPos = tile.toScreenPos(this.nextPos);
			this.state = ballStates.choosing;
			if(this.nextPos)
				this.gridPos = this.nextPos.clone();
			return;
		}
		
		// the ball is drawn between it's gridPos and nextPos based on a percentage(prog) of how complete the 
		// movement animation is
		var off = this.nextPos.minus(this.gridPos).multiply(prog * tile.tilesize);
		this.drawPos = tile.toScreenPos(this.gridPos).plus(off);
		
		// tags the tile at the current draw position
		var gpos = tile.toTilePos(this.drawPos);
		if(!tile.at(gpos).isEmpty()){
			if(!this.tilesTagged.includes(tile.at(gpos))){
				this.tilesTagged.push(tile.at(gpos));
			}
		}
	}
	
	pause(){
		// pauses the ball to wait for player input
		this.state = ballStates.paused;
		this.findPauseDirections();
	}
	findPauseDirections(){
		// get the unblocked directions at the current tile
		var unblocked = tile.at(this.gridPos).getUnblockedSides();
		
		// remove the previous travelDirection's opposite from the possible travel directions
		for(var i = unblocked.length; i >= 0; i--){
			if(unblocked[i] == invertedSide(this.travelDir)){
				unblocked.splice(i, 1);
				break;
			}
		}
		
		this.pauseDirections = unblocked;
	}
	direct(dir){
		// when the ball is paused, this method allows the user to decide which way the ball should go
		if(this.state != ballStates.paused) return;
	}
	
	chooseNextTravelDir(){
		// decides which way the ball will go next
		var unblocked = tile.at(this.gridPos).getUnblockedSides();
		var tdir;
		
		// remove the previous travelDirection's opposite from the possible travel directions
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
		
		// if downward is open, gravity will pull the ball down, otherwise it gets paused
		if(unblocked.includes(side.down)) 
			tdir = side.down;
		else{
			this.pause();
			return;
		}
		
		this.travelDir = tdir;
		this.updateNextPos();
		this.state = ballStates.moving;
	}
	updateNextPos(){
		// updates the ball's nextPos once the travel direction has been determined
		this.nextPos = this.gridPos.plus(vec2.fromSide(this.travelDir));
		this.lastPosUpdate = gameState.current.timeElapsed;
		
		log(this.nextPos);
	}
	
	destroy(){
		// destroys the ball object
		this.state = ballStates.dead;
	}
	
	draw(){
		// draws the ball object if it's still alive
		if(this.state == ballStates.dead) return;
		
		var sprt = new spriteBox(new vec2(tile.tilesize * this.ballType, 0), new vec2(tile.tilesize));
		drawCenteredImage(renderContext, gfx.tiles_balls, this.drawPos, sprt);
		
		if(this.state == ballStates.paused)
			this.drawDirectionIndicators();
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
}