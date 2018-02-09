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
	constructor(text, pos, description = ""){
		// initializes a button
		this.pos = pos;
		this.text = text;
		this.description = description;
		this.action = null;
		
		this.size = null;
		this.calcSize();
		
		this.styles = null;
		this.preRenders = null;
		this.setStyles();
	}
	
	calcSize(){
		// calculates and sets this.size
		var w = fonts.large.getStringWidth();
		this.size = new vec2(w, fonts.large.charSize.y);
	}
	generatePreRenders(){
		this.preRenders = {};
		this.preRenders.normal = preRenderedText.fromString(this.text, this.pos, this.styles.normal);
		this.preRenders.selected = preRenderedText.fromString(this.text, this.pos, this.styles.selected);
		
		//FIX STYLES.DESCRIPTION
		var descBlock = new textBlock(this.description, this.styles.description);
		descBlock.bounds = collisionBox.fromSides(
			screenBounds.left + 20, 
			screenBounds.bottom - 46, 
			screenBounds.right - 20, 
			screenBounds.bottom - 18 );
		descBlock.lineHeight = 12;
		this.preRenders.description = preRenderedText.fromBlock(descBlock);
	}
	
	setStyles(normalStyle = textStyle.getDefault(), selectedStyle = new textStyle(fonts.large, textColor.green), descriptionStyle = (new textStyle(fonts.small)).setAlignment(0.5, 1)){
		var v = descriptionStyle.setAlignment(0.5, 1)
		console.log(v);
		this.styles = {
			normal: normalStyle,
			selected: selectedStyle,
			description: descriptionStyle.setAlignment(0.5, 1)
			};
		this.generatePreRenders();
	}
	
	trigger(args){
		// called when the button is pressed by the player
		if(this.action)
			this.action(args);
		
		log("menu button '" + this.text + "' triggered", logType.log);
	}
	
	draw(selected = false){
		// renders the button on screen
		if(selected){
			this.preRenders.selected.draw();
			
			// draws arrows to the left and right of the button
			var l = this.preRenders.selected.getBounds().left;
			var r = this.preRenders.selected.getBounds().right;
			var lpos = new vec2(l - 10, this.pos.y);
			var rpos = new vec2(r + 10, this.pos.y);
			drawArrow(lpos, side.right);
			drawArrow(rpos, side.left);
			
			// draws the button's description
			this.preRenders.description.draw();
		}
		else this.preRenders.normal.draw();
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
		this.buttons.push(new menuButton("Start Game", screenBounds.center.plus(new vec2(0, off * 45)), "start a new game this is a really long description so that I can see what multiple line text blocks look like")); off++;
		this.buttons.push(new menuButton("Scoreboard", screenBounds.center.plus(new vec2(0, off * 45)), "view the highest scoring players")); off++;
		this.buttons.push(new menuButton("Options", screenBounds.center.plus(new vec2(0, off * 45)), "configure gameplay and av options")); off++;
		this.buttons.push(new menuButton("Credits", screenBounds.center.plus(new vec2(0, off * 45)), "see who contributed to making the game!")); off++;
	}
	
	selectionDown(){
		// moves the menu cursor down to the next selectable menu item
		this.currentSelection += 1;
		if(this.currentSelection >= this.buttons.length)
			this.currentSelection = 0;
	}
	selectionUp(){
		// moves the menu cursor up to the previous selectable menu item
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
		
		var style = new textStyle(fonts.large, textColor.green, 3);
		textRenderer.drawText("TUBETRIS", new vec2(screenBounds.center.x, screenBounds.top + 48), style);
		
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