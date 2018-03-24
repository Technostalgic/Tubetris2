///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

var ballStates = {
	none: -1,
	choosing: 0,
	moving: 1,
	paused: 2,
	dead: 3
}

class ball{
	constructor(pos, type = balls.grey){
		this.gridPos = pos;
		this.nextPos = null;
		this.drawPos = tile.toScreenPos(this.gridPos);
		this.ballType = type;
		
		this.state = ballStates.choosing;
		this.travelDir = side.none;
		this.momentum = 0;
		this.lastPosUpdate = gameState.current.timeElapsed;
	}
	
	update(dt){
		switch(this.state){
			case ballStates.moving: 
				this.move();
				break;
			case ballStates.choosing: 
				this.chooseNextTravelDir();
				break;
			case ballStates.paused: break;
			case ballStates.dead: return;
		}
	}
	
	direct(dir){
		if(this.state != ballStates.paused) return;
	}
	getMoveAnimProgress(){
		var animLength = 100;
		
		return Math.min(1 - (this.lastPosUpdate + animLength - gameState.current.timeElapsed) / animLength, 1);
	}
	move(){
		var prog = this.getMoveAnimProgress();
		
		if(prog >= 1) {
			this.drawPos = tile.toScreenPos(this.nextPos);
			this.state = ballStates.choosing;
			return;
		}
		
		var off = this.nextPos.minus(this.gridPos).multiply(prog * tile.tilesize);
		this.drawPos = tile.toScreenPos(this.gridPos).plus(off);
	}
	
	chooseNextTravelDir(){
		if(this.nextPos)
			this.gridPos = this.nextPos.clone();
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
		
		tdir = unblocked[Math.floor(Math.random() * unblocked.length)];
		if(unblocked.includes(side.down)) 
			tdir = side.down;
		
		this.travelDir = tdir;
		this.updateNextPos();
		this.state = ballStates.moving;
	}
	updateNextPos(){
		this.nextPos = this.gridPos.plus(vec2.fromSide(this.travelDir));
		this.lastPosUpdate = gameState.current.timeElapsed;
		
		log(this.nextPos);
	}
	
	destroy(){
		// destroys the ball object
		this.state = ballStates.dead;
	}
	
	draw(){
		if(this.state == ballStates.dead) return;
		
		var sprt = new spriteBox(new vec2(tile.tilesize * this.ballType, 0), new vec2(tile.tilesize));
		drawCenteredImage(renderContext, gfx.tiles_balls, this.drawPos, sprt);
		
		if(this.state == ballStates.paused)
			this.drawDirectionIndicators();
	}
	drawDirectionIndicators(){
		
	}
}