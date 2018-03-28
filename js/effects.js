///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

// used for creating visual effects like explosions in the game
class effect{
	constructor(){
		this.pos = new vec2();
	}
	
	static createPoof(pos){
		// creates a poof effect at the specified position
		var e = animatedSpriteEffect.build(gfx.effect_poof, 33, animatedSpriteEffect.getFrames(gfx.effect_poof, 10));
		e.pos = pos;
		log(pos);
		
		effects.push(e);
		return e;
	}
	
	update(dt){ }
	draw(){ }
	remove(){
		// removes an effect from the effect array
		effects.splice(effects.indexOf(this), 1);
	}
}

// a type of effect that uses data from a sprite sheet image
class animatedSpriteEffect extends effect{
	constructor(){ 
		super();
		
		this.animStartTime = gameState.current.timeElapsed;
		this.spriteSheet = null;
		this.animRate = 33;
		this.frames = []; // a list of spriteBox objects that will be cycled through to create the animation
	}
	
	static getFrames(spriteSheet, frameCount){
		// generates a list of spriteBox objects from the specified data
		var r = [];
		var width = Math.round(spriteSheet.width / frameCount);
		
		for(var i = 0; i < frameCount; i++){
			let tpos = new vec2(i * width, 0);
			let f = new spriteBox(tpos, new vec2(width, spriteSheet.height));
			
			r.push(f);
		}
		
		return r;
	}
	static build(spriteSheet, animRate, frames){
		// builds an animated sprite effect from the specified data
		var r = new animatedSpriteEffect();
		
		r.spriteSheet = spriteSheet;
		r.animRate = animRate;
		r.frames = frames;
		
		return r;
	}
	
	getCurrentAnimFrame(){
		// returns the current frame number that the animation is on
		// returns null if the animation start time is somehow after the current game time
		if(this.animStartTime > gameState.current.timeElapsed) return null;
		var totalAnimLength = this.frames.length * this.animRate;
		var animElapsed = gameState.current.timeElapsed - this.animStartTime;
		
		// returns null if the animation is complete
		if(animElapsed >= totalAnimLength) return null;
		
		var frame = Math.floor(animElapsed / this.animRate);
		return frame;
	}
	
	draw(){
		// renders the animation at it's current position
		var frameNum = this.getCurrentAnimFrame();
		if(frameNum == null) {
			this.remove(); 
			return;
		}
		var frame = this.frames[frameNum];
		
		var spriteBounds = new collisionBox(new vec2(), frame.size.clone());
		spriteBounds.setCenter(this.pos);
		var sprite = new spriteContainer(this.spriteSheet, frame, spriteBounds);
		sprite.draw();
	}
}