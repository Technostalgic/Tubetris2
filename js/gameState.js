///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

var gameMode;

class gameState{
	constructor(){ 
		this.timeElapsed = 0;
	}
	
	update(dt){
		this.timeElapsed += dt;
	}
	draw(){ }
	
	static get current(){
		return gameMode;
	}
	static switchState(tostate){
		log("gameState switched from " + (
			gameState.current ? 
				gameState.current.constructor.name : 
				"UNDEFINED" )
			+ " to " + tostate.constructor.name, logType.notify);
			
		if(gameMode)
			gameMode.switchFrom(tostate);
		tostate.switchTo(gameMode);
		gameMode = tostate;
	}
	
	switchFrom(tostate = null){}
	switchTo(fromstate = null){}
	
	controlTap(control = controlAction.none){}
	mouseTap(pos){}
	mouseMove(pos){}
}

class menuButton{
	constructor(text, pos){
		this.pos = pos;
		this.text = text;
		this.action = null;
		
		// sets this.size
		this.calcSize();
	}
	
	calcSize(){
		fonts.large.getStringWidth();
	}
	
	trigger(args){
		if(action)
			action(args);
	}
	
	draw(selected = false){
		var col = selected ? textColor.green : textColor.light;
		
		fonts.large.drawString(renderContext, this.text, this.pos, col);
	}
}

class state_mainMenu extends gameState{
	constructor(){
		super();
		
		this.buttons = [];
		this.addButtons();
		this.currentSelection = 0;
	}
	
	addButtons(){
		this.buttons = [];
		var off = -2;
		this.buttons.push(new menuButton("Start Game", screenCenter().plus(new vec2(0, off * 45)))); off++;
		this.buttons.push(new menuButton("Scoreboard", screenCenter().plus(new vec2(0, off * 45)))); off++;
		this.buttons.push(new menuButton("Options", screenCenter().plus(new vec2(0, off * 45)))); off++;
		this.buttons.push(new menuButton("Credits", screenCenter().plus(new vec2(0, off * 45)))); off++;
	}
	
	selectionDown(){
		this.currentSelection += 1;
		if(this.currentSelection >= this.buttons.length)
			this.currentSelection = 0;
	}
	selectionUp(){
		console.log(this.currentSelection);
		this.currentSelection -= 1;
		if(this.currentSelection < 0)
			this.currentSelection = this.buttons.length - 1;
	}
	select(pos = null){
		if(!pos){
			this.buttons[this.currentSelection].trigger();
			return;
		}
	}
	
	update(dt){
		// updates the main menu
		super.update(dt);
	}
	draw(){
		// draws the the main menu
		drawBackground();
		
		fonts.large.drawString(renderContext, "TUBETRIS", new vec2(screenCenter().x, 48), textColor.green, 3);
		
		for(var i = this.buttons.length - 1; i >= 0; i--){
			var sel = i == this.currentSelection;
			this.buttons[i].draw(sel);
		}
		
		drawForegroundBorder();
	}
	
	switchFrom(tostate = null){
		
	}
	switchTo(fromstate = null){
		
	}
	
	controlTap(control = controlAction.none){
		switch(control){
			case controlAction.up: this.selectionUp(); break;
			case controlAction.down: this.selectionDown(); break;
			case controlAction.select: this.select(); break;
		}
	}
	mouseTap(pos){
		
	}
	mouseMove(pos){
		
	}
}