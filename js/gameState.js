///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

// enumerates all the different ways buttons can be switched
var buttonSwitchMode = {
	bool: 0,
	percent: 1,
	percentInfinite: 2,
	integer: 3
}

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
		if(!gameMode) return gameState.empty;
		return gameMode;
	}
	static get empty(){
		return {
			timeElapsed: 0
		};
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
	constructor(text, pos, description = "", action = null){
		// initializes a button
		this.pos = pos;
		this.text = text;
		this.description = description;
		this.action = action;
		this.navLeft = null;
		this.navRight = null;
		
		this.styles = null;
		this.preRenders = null;
		this.setStyles();
		
		this.normalBounds = null;
		this.selectedBounds = null;
		this.calcSize();
		this.selectedLast = false;
		
		this.selectAnim = new textAnim_scaleTransform(200, 0.5, 1, 0);
		this.selectAnim.animType = textAnimType.bulgeIn;
		this.unselectAnim = new textAnim_scaleTransform(100, 2, 1, 0);
		this.unselectAnim.animType = textAnimType.easeIn;
	}
	
	calcSize(){
		// calculates and sets this.size
		this.normalBounds = this.preRenders.normal.getBounds();
		this.selectedBounds = this.preRenders.selected.getBounds();
	}
	generatePreRenders(){
		this.preRenders = {};
		this.preRenders.normal = preRenderedText.fromString(this.text, this.pos, this.styles.normal);
		this.preRenders.selected = preRenderedText.fromString(this.text, this.pos, this.styles.selected);
		
		var descBlock = new textBlock(this.description, this.styles.description);
		descBlock.bounds = collisionBox.fromSides(
			screenBounds.left + 20, 
			screenBounds.bottom - 6, 
			screenBounds.right - 20, 
			screenBounds.bottom - 6 );
		descBlock.lineHeight = 16;
		this.preRenders.description = preRenderedText.fromBlock(descBlock);
	}
	
	setStyles(normalStyle = textStyle.getDefault(), selectedStyle = new textStyle(fonts.large, textColor.cyan, 2), descriptionStyle = (new textStyle(fonts.small)).setAlignment(0.5, 1)){
		descriptionStyle.hAlign = 0.5;
		this.styles = {
			normal: normalStyle || this.styles.normalStyle,
			selected: selectedStyle || this.styles.selectedStyle,
			description: descriptionStyle || this.styles.descriptionStyle
			};
		this.generatePreRenders();
	}
	
	trigger(args){
		// called when the button is pressed by the player
		log("menu button '" + this.text + "' triggered", logType.log);
		
		if(this.action)
			this.action(args);		
	}
	
	draw(selected = false){
		// renders the button on screen
		var fSel = selected != this.selectedLast;
		
		if(selected){
			if(fSel) this.selectAnim.resetAnim();
			this.preRenders.selected.animated(this.selectAnim).draw();
			
			// draws arrows to the left and right of the button
			var off = 10;
			var lpos = new vec2(this.preRenders.selected.getBounds().inflated(this.selectAnim.maxScale).left - off, this.pos.y);
			var rpos = new vec2(this.preRenders.selected.getBounds().inflated(this.selectAnim.maxScale).right + off, this.pos.y);
			drawArrow(lpos, side.right);
			drawArrow(rpos, side.left);
			
			// draws the button's description
			this.preRenders.description.draw();
		}
		else {
			if(fSel) this.unselectAnim.resetAnim();
			this.preRenders.normal.animated(this.unselectAnim).draw();
		}
		this.selectedLast = selected;
	}
}
class settingButton extends menuButton{
	constructor(text, pos, description = "", applyOnChange = false){
		super(text, pos, description);
		this.setStyles(textStyle.getDefault(), textStyle.getDefault().setColor(textColor.cyan));
		
		this.mode = buttonSwitchMode.bool;
		this.minVal = 0;
		this.maxVal = 1;
		this.deltaVal = 0.1;
		
		this.applyOnChange = applyOnChange;
		
		this.getValue = null;
		this.setValue = null;
		this.navRight = this.increment;
		this.navLeft = this.decrement;
		this.action = this.cycle;
		
		this.selectAnim = new textAnim_scale(200, 1.5, 1, 0);
		this.selectAnim.animType = textAnimType.trigonometricCycle;
		this.unselectAnim = new textAnim_scale(100, 1, 1, 0);
		this.unselectAnim.animType = textAnimType.trigonometricCycle;
		
		this.generateSettingPreRenders();
	}
	
	static generateGetValueFunc(optionVarName){
		return function(){
			return config[optionVarName];
		}
	}
	static generateSetValueFunc(optionVarName){
		return function(val){
			config[optionVarName] = val;
		}
	}
	
	setValueBounds(min, max, delta, switchMode){
		this.minVal = min || this.minVal;
		this.maxVal = max || this.maxVal;
		this.deltaVal = delta || this.deltaVal;
		this.mode = switchMode || this.mode;
		this.generateSettingPreRenders();
		return this;
	}
	setGettersAndSetters(getter, setter){
		this.getValue = getter || this.getValue;
		this.setValue = setter || this.setValue;
		this.generateSettingPreRenders();
		return this;
	}
	
	increment(){
		// increments the option's value by deltaValue until it reaches the max value
		if(!this.getValue) {
			log("getValue function not set for settingButton '" + this.text + "'", logType.error);
			return;
		}
		
		var m = this.getValue();
		
		if(this.mode == buttonSwitchMode.bool)
			m = !m;
		else {
			if(m >= this.maxVal){
				if(this.mode == buttonSwitchMode.percentInfinite)
					m = Infinity;
				else 
					m = this.maxVal;
			}
			else{
				m += this.deltaVal;
				if(m > this.maxVal)
					m = this.maxVal;
			}
		}
		
		this.changeValue(m);
	}
	decrement(){
		// decrements the option's value by deltaValue until it reaches the min value
		if(!this.getValue) {
			log("getValue function not set for settingButton '" + this.text + "'", logType.error);
			return;
		}
		
		var m = this.getValue();
		
		if(this.mode == buttonSwitchMode.bool)
			m = !m;
		else {
			m -= this.deltaVal;
			if(m == Infinity) m = this.maxVal;
			if(m < this.minVal)
				m = this.minVal;
		}
		
		this.changeValue(m);
	}
	cycle(){
		// cycles the value between the specified min and max value
		if(!this.getValue) {
			log("getValue function not set for settingButton '" + this.text + "'", logType.error);
			return;
		}
		
		var m = this.getValue();
		if(this.mode == buttonSwitchMode.bool)
			m = !m;
		else{
			if(m >= this.maxVal){
				if(this.mode == buttonSwitchMode.percentInfinite){
					if(m == Infinity)
						m = this.minVal;
					else m = Infinity;
				}
				else m = this.minVal;
			}
			else{
				m += this.deltaVal;
				if(m > this.maxVal)
					m = this.maxVal;
			}
		}
		
		this.changeValue(m);
	}
	changeValue(value){
		if(!this.setValue) {
			log("setValue function not set for settingButton '" + this.text + "'", logType.error);
			return;
		}
		this.setValue(value);
		this.generateSettingPreRenders();
		if(this.applyOnChange) applyConfig();
	}
	
	getFullString(){
		return this.getFullText() + this.getValueString();
	}
	getFullText(){
		return this.text + ": ";
	}
	getValueString(){
		if(!this.getValue) {
			log("getValue function not set for settingButton '" + this.text + "'", logType.error);
			return "null";
		}
		var m = this.getValue();
		switch(this.mode){
			case buttonSwitchMode.bool: return m ? "on" : "off";
			case buttonSwitchMode.percent: return Math.round(m * 100).toString();
			case buttonSwitchMode.percentInfinite: return Math.round(m * 100).toString();
			case buttonSwitchMode.integer: return Math.round(m).toString();
		}
		return m.toString();
	}
	generateSettingPreRenders(){
		this.preRenders = {};
		
		var normBlock = new textBlock(
			this.getFullText()+ "(" + this.getValueString() + ")", 
			this.styles.normal.setAlignment(0.5, 0.5), collisionBox.fromSides(screenBounds.left, this.pos.y, screenBounds.right, this.pos.y), 
			[textStyle.getDefault().setColor(textColor.yellow)]
			);
		this.preRenders.normal = preRenderedText.fromBlock(normBlock);
		
		var selBlock = new textBlock(
			this.getFullText()+ "(" + this.getValueString() + ")", 
			this.styles.selected.setAlignment(0.5, 0.5), collisionBox.fromSides(screenBounds.left, this.pos.y, screenBounds.right, this.pos.y),
			[textStyle.getDefault().setColor(textColor.yellow)]
			);
		this.preRenders.selected = preRenderedText.fromBlock(selBlock);
		
		var descBlock = new textBlock(this.description, this.styles.description);
		descBlock.bounds = collisionBox.fromSides(
			screenBounds.left + 20, 
			screenBounds.bottom - 6, 
			screenBounds.right - 20, 
			screenBounds.bottom - 6 );
		descBlock.lineHeight = 16;
		this.preRenders.description = preRenderedText.fromBlock(descBlock);
	}
}

// a generic menu gameState that can be used as a blueprint for other menu interfaces
class state_menuState extends gameState{
	constructor(){
		super();
		
		// list of menu buttons
		this.buttons = [];
		this.currentSelection = 0;
		this.addButtons();
	}
	
	addButtons(){}
	
	selectionDown(){
		// moves the menu cursor down to the next selectable menu item
		if(this.buttons.length <= 0) return;
		this.currentSelection += 1;
		if(this.currentSelection >= this.buttons.length)
			this.currentSelection = 0;
	}
	selectionUp(){
		// moves the menu cursor up to the previous selectable menu item
		if(this.buttons.length <= 0) return;
		this.currentSelection -= 1;
		if(this.currentSelection < 0)
			this.currentSelection = this.buttons.length - 1;
	}
	navigateLeft(){
		if(this.selectedButton.navLeft)
			this.selectedButton.navLeft();
	}
	navigateRight(){
		if(this.selectedButton.navRight)
			this.selectedButton.navRight();
	}
	
	get selectedButton(){
		if(this.buttons.length <= 0) return null;
		return this.buttons[this.currentSelection];
	}
	select(pos = null){
		// selects the menu item at the specefied position, if no position is specified, the currently selected menu item is triggered
		if(this.buttons.length <= 0) return;
		if(!pos){
			this.buttons[this.currentSelection].trigger();
			return;
		}
	}
	
	controlTap(control = controlAction.none){
		// defines the what the controls do when you press them, used for menu navigation in the main menu
		switch(control){
			case controlAction.up: this.selectionUp(); break;
			case controlAction.down: this.selectionDown(); break;
			case controlAction.left: this.navigateLeft(); break;
			case controlAction.right: this.navigateRight(); break;
			case controlAction.select: this.select(); break;
		}
	}
	mouseTap(pos){
		// defines what happens when the mouse is clicked in the main menu
		if(this.buttons.length <= 0) return;
		if(this.selectedButton.selectedBounds.overlapsPoint(pos))
			this.select();
	}
	mouseMove(pos){
		// defines what happens when the mouse is moved in the main menu
		if(this.buttons.length <= 0) return;
		if(this.selectedButton.selectedBounds.overlapsPoint(pos))
			return;
		
		for(var i = 0; i < this.buttons.length; i ++){
			if(this.buttons[i].normalBounds.overlapsPoint(pos)){
				this.currentSelection = i;
				return;
			}
		}
	}

	drawInternals(){}
	draw(){
		drawBackground();

		this.drawInternals();
		
		for(var i = this.buttons.length - 1; i >= 0; i--){
			var sel = i == this.currentSelection;
			this.buttons[i].draw(sel);
		}
		
		drawForegroundBorder();
	}
}

// a gameState object that represents the main menu interface
class state_mainMenu extends state_menuState{
	constructor(){
		// initializes a main menu gameState
		super();
		var tubetrisEntrance = new textAnim_scale(300, 0, 1, 0.4);
		tubetrisEntrance.animType = textAnimType.bulgeIn;
		tubetrisEntrance.animDelay = 200;
		var deluxeEntrance = new textAnim_scale(100, 0, 1, 0);
		deluxeEntrance.animType = textAnimType.linear;
		deluxeEntrance.animDelay = 1300;
		
		this.titleAnim = tubetrisEntrance;
		this.titleDeluxeAnim = new textAnim_compound([
			deluxeEntrance,
			new textAnim_yOffset(2000 / 3, 15, 1/4),
			new textAnim_rainbow(500, 1/12)
			]);
		
	}
	
	addButtons(){
		// adds the buttons to the interface
		this.buttons = [];
		var off = 0;
		var dif = 55;
		
		var action_switchToScoreboard = function(){ gameState.switchState(new state_scoreboard()); };
		var action_switchToOptions = function(){ gameState.switchState(new state_options()); };
		
		this.buttons.push(new menuButton("Start Game", screenBounds.center.plus(new vec2(0, off * dif)), "start a new game")); off++;
		this.buttons.push(new menuButton("Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), "view the highest scoring players", action_switchToScoreboard)); off++;
		this.buttons.push(new menuButton("Options", screenBounds.center.plus(new vec2(0, off * dif)), "configure gameplay and av options", action_switchToOptions)); off++;
		this.buttons.push(new menuButton("Credits", screenBounds.center.plus(new vec2(0, off * dif)), "see who contributed to making the game!")); off++;
	}
	
	drawInternals(){
		// draws the the main menu title
		var style = new textStyle(fonts.large, textColor.green, 3);
		textRenderer.drawText("TUBETRIS", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
		
		var animStyle = new textStyle(fonts.large, textColor.yellow, 2);
		textRenderer.drawText("DELUXE", new vec2(screenBounds.center.x, screenBounds.top + 180), animStyle, this.titleDeluxeAnim);
	}
	
	switchFrom(tostate = null){
		
	}
	switchTo(fromstate = null){
		
	}
}
// a gameState object that represents the scoreboard screen interface
class state_scoreboard extends state_menuState{
	constructor(){
		super();
		
		var titleEntrance = new textAnim_scaleTransform(300, 0, 1, 0);
		titleEntrance.animType = textAnimType.easeOut;
		
		this.titleAnim = titleEntrance;
	}
	
	addButtons(){
		this.buttons = [];
		var off = 0;
		var dif = 55;
		var tpos = new vec2(screenBounds.center.x, screenBounds.bottom - 200);
		
		var action_switchToMainMenu = function(){ gameState.switchState(new state_mainMenu()); };
		
		this.buttons.push(new menuButton("Reset Scores", tpos.plus(new vec2(0, off * dif)), "erase the scoreboard data")); off++;
		this.buttons.push(new menuButton("Main Menu", tpos.plus(new vec2(0, off * dif)), "return to the main menu", action_switchToMainMenu)); off++;
		
		this.currentSelection = 1;
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("SCOREBOARD", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}
}
// a gameState object that represents the options screen interface
class state_options extends state_menuState{
	constructor(){
		super();		
		
		var titleEntrance = new textAnim_scaleTransform(300, 0, 1, 0);
		titleEntrance.animType = textAnimType.easeOut;
		
		this.titleAnim = titleEntrance;
	}
	
	addButtons(){
		this.buttons = [];
		var off = 0;
		var dif = 45;
		var tpos = new vec2(screenBounds.center.x, screenBounds.center.y - 100);
		
		this.buttons.push(new settingButton("Animated Text", tpos.plus(new vec2(0, off * dif)), "whether or not animated text is enabled - may increase performance if disabled"
			).setGettersAndSetters(settingButton.generateGetValueFunc("animText"), settingButton.generateSetValueFunc("animText")) ); off++;
		this.buttons.push(new settingButton("Image Smoothing", tpos.plus(new vec2(0, off * dif)), "enable if you want ugly blurs or keep disabled for nice crispy pixel graphics", true
			).setGettersAndSetters(settingButton.generateGetValueFunc("imageSmoothing"), settingButton.generateSetValueFunc("imageSmoothing")) ); off++;
		this.buttons.push(new settingButton("Animation Speed", tpos.plus(new vec2(0, off * dif)), "how quickly the in-game animations are played"
			).setGettersAndSetters(settingButton.generateGetValueFunc("animSpeed"), settingButton.generateSetValueFunc("animSpeed")
			).setValueBounds(0.5, 2.5, 0.5, buttonSwitchMode.percentInfinite) ); off++;
		
		this.buttons.push(new settingButton("Sound", tpos.plus(new vec2(0, off * dif)), "the volume level of the sound effects"
			).setGettersAndSetters(settingButton.generateGetValueFunc("volume_sound"), settingButton.generateSetValueFunc("volume_sound")
			).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent) ); off++;
		this.buttons.push(new settingButton("Music", tpos.plus(new vec2(0, off * dif)), "the volume level of the music"
			).setGettersAndSetters(settingButton.generateGetValueFunc("volume_music"), settingButton.generateSetValueFunc("volume_music")
			).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent) ); off++;
		
		var action_switchToMainMenu = function(){ gameState.switchState(new state_mainMenu()); };
		this.buttons.push(new menuButton("Main Menu", new vec2(screenBounds.center.x, screenBounds.bottom - 150), "return to the main menu", action_switchToMainMenu));
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("OPTIONS", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}
}