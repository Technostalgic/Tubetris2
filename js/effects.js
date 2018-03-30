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
		this.dead = false;
	}
	
	static createPoof(pos){
		// creates a poof effect at the specified position
		var e = animatedSpriteEffect.build(gfx.effect_poof, 33, animatedSpriteEffect.getFrames(gfx.effect_poof, 10));
		e.pos = pos;
		
		e.add();
		return e;
	}
	static createExplosion(pos){
		var e = animatedSpriteEffect.build(gfx.effect_explosion, 33, animatedSpriteEffect.getFrames(gfx.effect_explosion, 12));
		e.pos = pos;
		
		e.add();
		return e;
	}
	
	update(dt){ 
		if(this.dead)
			effects.splice(effects.indexOf(this), 1);
	}
	draw(){ }
	
	add(){
		effects.push(this);
	}
	kill(){
		// removes an effect from the effect array
		this.dead = true;
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
			this.kill(); 
			return;
		}
		var frame = this.frames[frameNum];
		
		var spriteBounds = new collisionBox(new vec2(), frame.size.clone());
		spriteBounds.setCenter(this.pos);
		var sprite = new spriteContainer(this.spriteSheet, frame, spriteBounds);
		sprite.draw();
	}
}

// a type of effect that temporarily shows floating text on the screen
class splashText extends effect{
	constructor(){
		super();
		
		this.text = "";
		this.pos = new vec2();
		this.style = textStyle.getDefault();
		this.animStartTime = gameState.current.timeElapsed;
		this.maxLife = 500;
		this.preRender = null;
		this.anim = null;
	}
	
	static build(text, pos, lifetime = 500, style = textStyle.getDefault(), anim = null){
		// bulds a splashText effect from the specified data
		var r = new splashText;
		
		r.text = text;
		r.pos = pos;
		r.style = style;
		r.anim = anim;
		
		return r;
	}
	
	setLifetime(ms){
		// resets the animation start time and sets the animation end time as specified in milliseconds
		this.animStartTime = gameState.current.timeElapsed;
		this.maxLife = ms;
		return this;
	}
	getAnimProgress(){
		// returns a number between 0 and 1 indicating how close to the end of the animation the effect currently is
		var endTime = this.animStartTime + this.maxLife;
		if(endTime < gameState.current.timeElapsed || this.animStartTime > gameState.current.timeElapsed) return null;
		
		var dtime = gameState.current.timeElapsed - this.animStartTime;
		
		log(dtime);
		return dtime / this.maxLife;
	}
	
	preRenderText(){
		// generates the text preRender object
		this.preRender = preRenderedText.fromString(this.text, this.pos, this.style);
	}
	draw(){
		// renders the splash text
		if(!this.preRender) this.preRenderText();
		var prog = this.getAnimProgress();
		if(prog == null){
			this.kill();
			return;
		}
		
		if(this.anim)
			this.preRender.animated(this.anim).draw();
		else this.preRender.draw();
	}
}