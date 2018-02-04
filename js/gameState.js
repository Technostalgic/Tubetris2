///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

// the current gameMode object (to reference, it's recommended to use the 'gameState.current' static field)
var gameMode;

// a generic gameState object, designed as a template base class to be extended from
class gameState{
	constructor(){ 
		// initializes a generic gamestate object which is never really used
		this.timeElapsed = 0;
	}
	
	update(dt){
		// updates the gameState object, meant for override
		this.timeElapsed += dt;
	}
	draw(){ }
	
	static get current(){
		// returns the active gameState object
		return gameMode;
	}
	static switchState(tostate){
		// switches the game from one gameState to another
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
	
	// override these:
	// called when a gameState is being switched away from
	switchFrom(tostate = null){}
	// called when a gameState is being switched to
	switchTo(fromstate = null){}
	
	// override these:
	// called when a control is tapped (the first frame the control action is triggered)
	controlTap(control = controlAction.none){}
	// called when the mouse button is tapped (the first frame the mouse button is pressed)
	mouseTap(pos){}
	// called when the mouse is moved
	mouseMove(pos){}
}

// a pressable button in the GUI that the player can interact with
class menuButton{
	constructor(text, pos){
		// initializes a button
		this.pos = pos;
		this.text = text;
		this.action = null;
		
		// sets this.size
		this.calcSize();
	}
	
	calcSize(){
		// calculates and sets this.size
		fonts.large.getStringWidth();
	}
	
	trigger(args){
		// called when the button is pressed by the player
		if(action)
			action(args);
	}
	
	draw(selected = false){
		// renders the button on screen
		var col = selected ? textColor.green : textColor.light;
		
		fonts.large.drawString(renderContext, this.text, this.pos, col);
	}
}

// a gameState object that represents the main menu interface
class state_mainMenu extends gameState{
	constructor(){
		// initializes a main menu gameState
		super();
		
		this.buttons = [];
		this.addButtons();
		this.currentSelection = 0;
	}
	
	addButtons(){
		// adds the buttons to the interface
		this.buttons = [];
		var off = -2;
		this.buttons.push(new menuButton("Start Game", screenCenter().plus(new vec2(0, off * 45)))); off++;
		this.buttons.push(new menuButton("Scoreboard", screenCenter().plus(new vec2(0, off * 45)))); off++;
		this.buttons.push(new menuButton("Options", screenCenter().plus(new vec2(0, off * 45)))); off++;
		this.buttons.push(new menuButton("Credits", screenCenter().plus(new vec2(0, off * 45)))); off++;
	}
	
	selectionDown(){
		// moves the menu cursor down to the next selectable menu item
		this.currentSelection += 1;
		if(this.currentSelection >= this.buttons.length)
			this.currentSelection = 0;
	}
	selectionUp(){
		// moves the menu cursor up to the previous selectable menu item
		console.log(this.currentSelection);
		this.currentSelection -= 1;
		if(this.currentSelection < 0)
			this.currentSelection = this.buttons.length - 1;
	}
	select(pos = null){
		// selects the menu item at the specefied position, if no position is specified, the currently selected menu item is triggered
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
		// defines the what the controls do when you press them, used for menu navigation in the main menu
		switch(control){
			case controlAction.up: this.selectionUp(); break;
			case controlAction.down: this.selectionDown(); break;
			case controlAction.select: this.select(); break;
		}
	}
	mouseTap(pos){
		// defines what happens when the mouse is clicked in the main menu
	}
	mouseMove(pos){
		// defines what happens when the mouse is moved in the main menu
	}
}