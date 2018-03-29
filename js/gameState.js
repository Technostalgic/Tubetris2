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
	integer: 3,
	directValue: 4,
	enumeration: 5
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
		return new gameState();
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
	constructor(){ }
	
	calcSize(){
		// calculates and sets the selected and unselected boundaries based on the text and font styles
		this.normalBounds = this.preRenders.normal.getBounds();
		this.selectedBounds = this.preRenders.selected.getBounds();
	}
	generatePreRenders(){
		// generates the preRenderedTexts for the the selected and unselected states as well as the 
		// preRenderedText for the button's description text
		this.preRenders = {};
		this.preRenders.normal = preRenderedText.fromString(this.text, this.pos, this.styles.normal);
		this.preRenders.selected = preRenderedText.fromString(this.text, this.pos, this.styles.selected);
		
		// the description can be multiple lines so we need to use a textBlock to generate the preRenderedText
		// which will break the paragraph into multiple lines and apply vertical alignment rules
		var descBlock = new textBlock(this.description, this.styles.description);
		descBlock.bounds = collisionBox.fromSides(
			screenBounds.left + 20, 
			screenBounds.bottom - 6, 
			screenBounds.right - 20, 
			screenBounds.bottom - 6 );
		descBlock.lineHeight = 16;
		this.preRenders.description = preRenderedText.fromBlock(descBlock);
	}
	
	construct(text, pos, description = "", action = null){
		// used in lue of a functional contstructor in order to prevent deriving classes from needing to
		// call performance intensive code more than one time
		this.pos = pos;
		this.text = text;
		this.description = description;
		this.action = action;
		this.navLeft = null;
		this.navRight = null;
		
		// generates the preRenders based on provided styles
		this.styles = null;
		this.preRenders = null;
		this.setStyles();
		
		// calculates the normal and selected boundaries of the button
		this.normalBounds = null;
		this.selectedBounds = null;
		this.calcSize();
		// used for a check to see if the animation should be reset
		this.selectedLast = false;
		
		// defines the animations that play when the button is selected or unselected
		this.selectAnim = new textAnim_scaleTransform(200, 0.5, 1, 0);
		this.selectAnim.animType = textAnimType.bulgeIn;
		this.unselectAnim = new textAnim_scaleTransform(100, 2, 1, 0);
		this.unselectAnim.animType = textAnimType.easeIn;
		
		return this;
	}
	setStyles(normalStyle = textStyle.getDefault(), selectedStyle = new textStyle(fonts.large, textColor.green, 2), descriptionStyle = (new textStyle(fonts.small)).setAlignment(0.5, 1)){
		// sets the text styles for the normal and unselected states of the button
		descriptionStyle.hAlign = 0.5;
		this.styles = {
			normal: normalStyle || this.styles.normalStyle,
			selected: selectedStyle || this.styles.selectedStyle,
			description: descriptionStyle || this.styles.descriptionStyle
			};
		// when the styles are changed, the preRenderedTexts must be regenerated
		this.generatePreRenders();
	}
	settingStylize(){
		this.setStyles(null, new textStyle(fonts.large, textColor.cyan, 1));
		
		this.selectAnim = new textAnim_scale(200, 1.5, 1, 0);
		this.selectAnim.animType = textAnimType.trigonometricCycle;
		this.unselectAnim = new textAnim_scale(100, 1, 1, 0);
		this.unselectAnim.animType = textAnimType.trigonometricCycle;
	}
	
	trigger(args){
		// called when the button is pressed by the player
		log("menu button '" + this.text + "' triggered", logType.log);
		
		if(this.action)
			this.action(args);		
	}
	
	draw(selected = false){
		// renders the button on screen
		if(!this.preRenders) return; // returns if the button's graphics haven't been generated
		
		// determines if this button's selected state is different than it was last frame
		var fSel = selected != this.selectedLast;
		
		if(selected){
			// reset's the button's animation if there is a change in it's state
			if(fSel) this.selectAnim.resetAnim();
			// applys the animation for the button's selected state
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
			// reset's the button's animation if there is a change in it's state
			if(fSel) this.unselectAnim.resetAnim();
			// applys the animation for the button's unselected state
			this.preRenders.normal.animated(this.unselectAnim).draw();
		}
		
		// sets a flag so that the button knows if it was selected on the previous frame or not
		this.selectedLast = selected;
	}
}
class settingButton extends menuButton{
	constructor(){ super(); }
	
	static generateGetValueFunc(optionVarName){
		// generates a getter function that will get the value of the specified variable as long
		// as it is a part of the 'config' object
		return function(){
			return config[optionVarName];
		}
	}
	static generateSetValueFunc(optionVarName){
		// generates a setter function that will set the value of the specified variable as long
		// as it is a part of the 'config' object
		return function(val){
			config[optionVarName] = val;
		}
	}
	
	construct(text, pos, description = "", applyOnChange = false){
		// see super.construct() for info ony why this is used in lue of a constructor
		this.pos = pos;
		this.text = text;
		this.description = description;
		
		this.selectAnim = new textAnim_scaleTransform(200, 0.5, 1, 0);
		this.selectAnim.animType = textAnimType.bulgeIn;
		this.unselectAnim = new textAnim_scaleTransform(100, 2, 1, 0);
		this.unselectAnim.animType = textAnimType.easeIn;
		
		this.styles = null;
		this.preRenders = null;
		
		this.normalBounds = null;
		this.selectedBounds = null;
		this.selectedLast = false;
		
		this.mode = buttonSwitchMode.bool;
		this.minVal = 0;
		this.maxVal = 1;
		this.deltaVal = 0.1;
		
		// a flag that tells the button whether or not the configuration settings should be applied when
		// the value is changed
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
		
		return this;
	}
	
	setValueBounds(min, max, delta, switchMode){
		// sets the upper and lower bounds for the value that is being set by getter and setter functions
		this.minVal = min || this.minVal;
		this.maxVal = max || this.maxVal;
		this.deltaVal = delta || this.deltaVal;
		this.mode = switchMode || this.mode;
		this.generateSettingPreRenders();
		return this;
	}
	setGettersAndSetters(getter, setter){
		// sets the getter and setter functions for the setting button
		// this is VITAL and MUST BE CALLED for every settingButton instance that is created
		this.getValue = getter || this.getValue;
		this.setValue = setter || this.setValue;
		this.setStyles(textStyle.getDefault(), textStyle.getDefault().setColor(textColor.green));
		this.calcSize();
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
		this.increment();
		var n = this.getValue();
		if(m == n)
			m = this.minVal;
		else m = n;
		
		this.changeValue(m);
	}
	changeValue(value){
		// changes the value of the config option that is being modified by the settingButton
		if(!this.setValue) {
			log("setValue function not set for settingButton '" + this.text + "'", logType.error);
			return;
		}
		this.setValue(value);
		this.generateSettingPreRenders();
		if(this.applyOnChange) applyConfig();
	}
	
	getFullString(){
		// returns the full string that will be drawn when the settingButton is drawn
		return this.getFullText() + this.getValueString();
	}
	getFullText(){
		// gets the full non-stylized text that will be drawn
		return this.text + ": ";
	}
	getValueString(){
		// gets the string that represents the value of the option that this settingButton is modifying
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
		// generates the preRenderedText that will be drawn to the screen when this.draw() is called
		this.preRenders = {};
		
		// generates the preRenderedText that represents the unselected button
		var normBlock = new textBlock(
			this.getFullText()+ "(" + this.getValueString() + ")", 
			this.styles.normal.setAlignment(0.5, 0.5), collisionBox.fromSides(screenBounds.left, this.pos.y, screenBounds.right, this.pos.y), 
			[textStyle.getDefault().setColor(textColor.yellow)]
			);
		this.preRenders.normal = preRenderedText.fromBlock(normBlock);
		
		// generates the preRenderedText that represents the selected button
		var selBlock = new textBlock(
			this.getFullText()+ "(" + this.getValueString() + ")", 
			this.styles.selected.setAlignment(0.5, 0.5), collisionBox.fromSides(screenBounds.left, this.pos.y, screenBounds.right, this.pos.y),
			[textStyle.getDefault().setColor(textColor.yellow)]
			);
		this.preRenders.selected = preRenderedText.fromBlock(selBlock);
		
		// generates the preRenderedText that represents the button's description
		var descBlock = new textBlock(this.description, this.styles.description);
		descBlock.bounds = collisionBox.fromSides(
			screenBounds.left + 20,
			screenBounds.bottom - 6,
			screenBounds.right - 20,
			screenBounds.bottom - 6 );
		descBlock.lineHeight = 16;
		this.preRenders.description = preRenderedText.fromBlock(descBlock);
		
		this.calcSize();
		return this;
	}
}

// a generic menu gameState that can be used as a blueprint for other menu interfaces
class state_menuState extends gameState{
	constructor(){
		super();
		
		this.initialized = false;
		this.selectionFocus = false;
	}
	
	initialize(){
		// list of menu buttons
		this.buttons = [];
		this.currentSelection = 0;
		this.addButtons();

		this.initialized = true;
	}
	addButtons(){}
	
	selectionDown(){
		// moves the menu cursor down to the next selectable menu item
		if(!this.initialized) this.initialize();
		if(this.buttons.length <= 0) return;
		this.currentSelection += 1;
		if(this.currentSelection >= this.buttons.length)
			this.currentSelection = 0;
		
		audioMgr.playSound(sfx.moveCursor);
	}
	selectionUp(){
		// moves the menu cursor up to the previous selectable menu item
		if(!this.initialized) this.initialize();
		if(this.buttons.length <= 0) return;
		this.currentSelection -= 1;
		if(this.currentSelection < 0)
			this.currentSelection = this.buttons.length - 1;
		
		audioMgr.playSound(sfx.moveCursor);
	}
	navigateLeft(){
		// calls navLeft() on the currently selected button
		if(!this.initialized) this.initialize();
		if(this.selectedButton.navLeft){
			this.selectedButton.navLeft();
			audioMgr.playSound(sfx.moveCursor);
		}
	}
	navigateRight(){
		// calls navRight() on the currently selected button
		if(!this.initialized) this.initialize();
		if(this.selectedButton.navRight){
			this.selectedButton.navRight();
			audioMgr.playSound(sfx.moveCursor);
		}
	}
	
	get selectedButton(){
		// returns the button that is currently selected
		if(!this.initialized) this.initialize();
		if(this.buttons.length <= 0) return null;
		return this.buttons[this.currentSelection];
	}
	select(pos = null){
		// selects the menu item at the specefied position, if no position is specified, the currently selected menu item is triggered
		if(!this.initialized) this.initialize();
		if(this.buttons.length <= 0) return;
		if(!pos){
			this.buttons[this.currentSelection].trigger();
			audioMgr.playSound(sfx.select);
			return;
		}
	}
	
	controlTap(control = controlAction.none){
		// defines the what the controls do when you press them, used for menu navigation in the main menu
		if(!this.initialized) this.initialize();
		if(this.selectionFocus) return;
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
		if(this.selectionFocus) return;
		if(!this.initialized) this.initialize();
		if(this.buttons.length <= 0) return;
		if(this.selectedButton.selectedBounds.overlapsPoint(pos))
			this.select();
	}
	mouseMove(pos){
		// defines what happens when the mouse is moved in the main menu
		if(this.selectionFocus) return;
		if(!this.initialized) this.initialize();
		if(this.buttons.length <= 0) return;
		if(this.selectedButton.selectedBounds.overlapsPoint(pos))
			return;
		
		// checks mouse collision with each button
		for(let i = 0; i < this.buttons.length; i ++){
			if(this.buttons[i].normalBounds.overlapsPoint(pos)){
				this.currentSelection = i;
				audioMgr.playSound(sfx.moveCursor);
				return;
			}
		}
	}

	drawInternals(){}
	draw(){
		// draws the menuState
		if(!this.initialized) this.initialize();
		// renders tiled background
		drawBackground(); 

		// draws all the user-defined graphics that aren't buttons
		this.drawInternals();
		
		// renders all the buttons
		var ths = this;
		this.buttons.forEach(function(btn, i){
			let sel = i == ths.currentSelection;
			btn.draw(sel);
		});
		
		// renders the foreground border
		drawForegroundBorder();
	}
}

// a simple confirmation dialogue
class state_confirmationDialogue extends state_menuState{
	constructor(confirmAction, denyAction = function(){}){
		super();
		this.title = "Warning";
		this.description = "this action cannot be undone";
		this.prompt = "are you sure";
		
		var titleAnim = new textAnim_scaleTransform(350, 1, 1.15, 0);
		titleAnim.looping = true;
		titleAnim.animType = textAnimType.trigonometricCycle;
		var titleBlink = new textAnim_blink(400, 0.025, textColor.yellow);
		this.titleAnim = new textAnim_compound([titleAnim, titleBlink]);
		
		var ths = this;
		this.action_confirm = function(){ log("confirmation accepted", logType.unimportant); confirmAction(); gameState.switchState(ths.lastState); };
		this.action_deny = function(){ log("confirmation denied", logType.unimportant); denyAction(); gameState.switchState(ths.lastState); };
		
		this.currentSelection = 1;
	}
	
	addButtons(){
		this.buttons = [
			new menuButton().construct(
				"Yes", 
				new vec2(screenBounds.center.x, screenBounds.bottom - 200), 
				"confirm your choice", 
				this.action_confirm),
			new menuButton().construct(
				"No", 
				new vec2(screenBounds.center.x, screenBounds.bottom - 145), 
				"cancel and return",
				this.action_deny)
		];
	}
	
	drawInternals(){
		var warnStyle = new textStyle(fonts.large, textColor.red, 2);
		textRenderer.drawText(this.title, new vec2(screenBounds.center.x, screenBounds.top + 100), warnStyle, this.titleAnim);
		
		var descStyle = new textStyle(fonts.large, textColor.green, 1);
		textRenderer.drawText(this.description, new vec2(screenBounds.center.x, screenBounds.top + 150), descStyle);
		
		var promptStyle = new textStyle(fonts.large, textColor.green, 1);
		textRenderer.drawText(this.prompt, new vec2(screenBounds.center.x, screenBounds.bottom - 250), promptStyle);
	}
	
	switchTo(fromstate = null){
		this.lastState = fromstate;
		log("gameState '" + this.lastState.constructor.name + "' asking for confirmation", logType.notify);
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
		
		var action_startGame = function(){ startNewGame(); };
		var action_switchToScoreboard = function(){ gameState.switchState(new state_scoreboard()); };
		var action_switchToOptions = function(){ gameState.switchState(new state_optionsMenu()); };
		
		this.buttons.push(new menuButton().construct("Start Game", screenBounds.center.plus(new vec2(0, off * dif)), "start a new game", action_startGame)); off++;
		this.buttons.push(new menuButton().construct("Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), "view the highest scoring players", action_switchToScoreboard)); off++;
		this.buttons.push(new menuButton().construct("Options", screenBounds.center.plus(new vec2(0, off * dif)), "configure gameplay and av options", action_switchToOptions)); off++;
		this.buttons.push(new menuButton().construct("Credits", screenBounds.center.plus(new vec2(0, off * dif)), "see who contributed to making the game!")); off++;
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
		
		this.anim_value1 = new textAnim_rainbow();
		var anim_p1 = new textAnim_scale(500, 0.75, 1.25, 0.1);
		anim_p1.looping = true;
		anim_p1.animType = textAnimType.trigonometricCycle;
		this.anim_place1 = new textAnim_compound([
			this.anim_value1,
			anim_p1
		]);
		this.anim_value2 = new textAnim_blink(500, 0.5, textColor.yellow);
		var anim_p2 = new textAnim_yOffset(500, 3, 0.5);
		this.anim_place2 = new textAnim_compound([
			this.anim_value2,
			anim_p2
		]);
		
		this.scoreNames = [];
		this.scoreValues = [];
		this.scoreStyles = [
			textStyle.getDefault().setColor(textColor.yellow),
			textStyle.getDefault().setColor(textColor.green),
			textStyle.getDefault().setColor(textColor.cyan),
			textStyle.getDefault()
		];
		this.addScoreboardText();
	}
	
	addButtons(){
		this.buttons = [];
		var off = 0;
		var dif = 55;
		var tpos = new vec2(screenBounds.center.x, screenBounds.bottom - 200);
		
		var action_switchToMainMenu = function(){ gameState.switchState(new state_mainMenu()); };
		this.buttons.push(new menuButton().construct("Main Menu", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the main menu", action_switchToMainMenu));
	}
	addScoreboardText(){
		var off = new vec2(-screenBounds.width % 32 - 2, -screenBounds.height % 32 - 2);
		var padding = 50;
		for(let i = 0; i < 5 && i < scores.length; i++){
			let ypos = screenBounds.top + off.y + 192 + i * 64;
			let txtBounds = collisionBox.fromSides(screenBounds.left + padding, ypos, screenBounds.right - padding, ypos + 32);
			let style = i < this.scoreStyles.length ? this.scoreStyles[i] : this.scoreStyles[this.scoreStyles.length - 1];
			let block = new textBlock("", style, txtBounds);
			
			// generate score name text graphic
			block.setStylesHAlign(0);
			block.setText(scores[i].name);
			let nameText = preRenderedText.fromBlock(block);
			
			// generate score value text graphic
			block.setStylesHAlign(1);
			block.setText(scores[i].score.toString());
			let scoreText = preRenderedText.fromBlock(block);
			
			this.scoreNames.push(nameText);
			this.scoreValues.push(scoreText);
		}
	}
	
	drawInternals(){
		var ths = this;
		// draw the scoreboard text
		this.scoreNames.forEach(function(name, i){
			var n = name;
			switch(i){
				case 0: n = n.animated(ths.anim_place1); break;
				case 1: n = n.animated(ths.anim_place2); break;
			}
			n.draw();
		});
		this.scoreValues.forEach(function(score, i){
			var s = score;
			switch(i){
				case 0: s = s.animated(ths.anim_value1); break;
				case 1: s = s.animated(ths.anim_value2); break;
			}
			s.draw();
		});
		
		// draws the title
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("SCOREBOARD", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
		
	}
}

// a gameState object that represents the options screen interface
class state_optionsMenu extends state_menuState{
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
		var tpos = new vec2(screenBounds.center.x, screenBounds.top + 200);
		
		// saving 
		this.buttons.push(new settingButton().construct("Save Data", tpos.plus(new vec2(0, off * dif)), "if disabled new high scores or changes to settings will not be saved", true
			).setGettersAndSetters(settingButton.generateGetValueFunc("saving"), settingButton.generateSetValueFunc("saving")).generateSettingPreRenders() ); 
		off += 1.5;
		
		// audio, video, game options
		var action_gotoAudioOps = function(){ gameState.switchState(new state_audioOptions()); };
		this.buttons.push(new menuButton().construct("Audio", tpos.plus(new vec2(0, off * dif)), "configure audio settings", action_gotoAudioOps)); off++;
		var action_gotoVideoOps = function(){ gameState.switchState(new state_videoOptions()); };
		this.buttons.push(new menuButton().construct("Video", tpos.plus(new vec2(0, off * dif)), "configure video settings", action_gotoVideoOps)); off++;
		var action_gotoGameOps = function(){ gameState.switchState(new state_gameOptions()); };
		this.buttons.push(new menuButton().construct("Game", tpos.plus(new vec2(0, off * dif)), "configure game settings", action_gotoGameOps)); off++;
		
		var action_gotoControlSettings = function(){ gameState.switchState(new state_controlSettings()); };
		this.buttons.push(new menuButton().construct("Set Controls", tpos.plus(new vec2(0, off * dif)), "customize the controls", action_gotoControlSettings)); 
		off++;
		
		// main menu button
		var action_switchToMainMenu = function(){ gameState.switchState(new state_mainMenu()); };
		this.buttons.push(new menuButton().construct("Main Menu", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the main menu", action_switchToMainMenu));
	}
	
	switchFrom(tostate = null){
		applyConfig();
		saveConfig();
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("OPTIONS", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}
}
// generic options submenu that will be inherited from submenus of the the options menu
class state_optionsSubMenu extends state_menuState{
	constructor(){
		super();
		
		this.titleAnim = new textAnim_scaleTransform(300, 0, 1, 0);
		this.titleAnim.animType = textAnimType.easeOut;
		this.TitleText = "SUBMENU";
		
		this.buttonStartPos = screenBounds.top + 200;
	}
	
	addButtons(){
		this.buttons = [];
		this.addSubMenuButtions();
		
		// back button
		var action_backToOptions = function(){ gameState.switchState(new state_optionsMenu()); };
		this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to previous menu", action_backToOptions));
	}
	addSubMenuButtions(){}
	
	switchFrom(tostate = null){
		applyConfig();
		saveConfig();
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText(this.TitleText, new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}
}
class state_audioOptions extends state_optionsSubMenu{
	constructor(){
		super();
		
		var titleEntrance = new textAnim_scaleTransform(300, 0, 1, 0);
		titleEntrance.animType = textAnimType.easeOut;
		
		this.titleAnim = titleEntrance;
		
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		
		// audio ops:
		// Track
		// Music Volume
		// Sound Volume
		this.buttons.push(new settingButton().construct("track", tpos.plus(new vec2(0, off * dif)), "choose the song that plays during the game"
			).setGettersAndSetters(null, null
			).setValueBounds(0, 1, 0.1, buttonSwitchMode.enumeration).generateSettingPreRenders() ); 
			off += 1.5;
		this.buttons.push(new settingButton().construct("Music", tpos.plus(new vec2(0, off * dif)), "the volume level of the music"
			).setGettersAndSetters(settingButton.generateGetValueFunc("volume_music"), settingButton.generateSetValueFunc("volume_music")
			).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent).generateSettingPreRenders() ); off ++;
		this.buttons.push(new settingButton().construct("Sound", tpos.plus(new vec2(0, off * dif)), "the volume level of the sound effects"
			).setGettersAndSetters(settingButton.generateGetValueFunc("volume_sound"), settingButton.generateSetValueFunc("volume_sound")
			).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent).generateSettingPreRenders() );
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("AUDIO", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}
}
class state_videoOptions extends state_optionsSubMenu{
	constructor(){
		super();
		
		var titleEntrance = new textAnim_scaleTransform(300, 0, 1, 0);
		titleEntrance.animType = textAnimType.easeOut;
		
		this.titleAnim = titleEntrance;
		
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		
		// Animated Text
		// Image Smoothing
		// Animation Speed
		this.buttons.push(new settingButton().construct("Animated Text", tpos.plus(new vec2(0, off * dif)), "whether or not animated text is enabled - may increase performance if disabled"
			).setGettersAndSetters(settingButton.generateGetValueFunc("animText"), settingButton.generateSetValueFunc("animText")).generateSettingPreRenders() ); off++;
		this.buttons.push(new settingButton().construct("Image Smoothing", tpos.plus(new vec2(0, off * dif)), "enable if you want ugly blurs or keep disabled for nice crispy pixel graphics", true
			).setGettersAndSetters(settingButton.generateGetValueFunc("imageSmoothing"), settingButton.generateSetValueFunc("imageSmoothing")).generateSettingPreRenders() ); off++;
		this.buttons.push(new settingButton().construct("Animation Speed", tpos.plus(new vec2(0, off * dif)), "how quickly the in-game animations are played"
			).setGettersAndSetters(settingButton.generateGetValueFunc("animSpeed"), settingButton.generateSetValueFunc("animSpeed")
			).setValueBounds(0.5, 2.5, 0.5, buttonSwitchMode.percentInfinite).generateSettingPreRenders() ); off++;
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("VIDEO", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}
}
class state_gameOptions extends state_optionsSubMenu{
	constructor(){
		super();
		
		var titleEntrance = new textAnim_scaleTransform(300, 0, 1, 0);
		titleEntrance.animType = textAnimType.easeOut;
		
		this.titleAnim = titleEntrance;
		
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		var ths = this;
		
		// game ops:
		// Reset Config
		// Reset Scores 
		
		this.buttons.push(new settingButton().construct("Arrow Indicators", tpos.plus(new vec2(0, off * dif)), "arrows appear while you are placing a ball to suggest possible tube entrances for the ball"
			).setGettersAndSetters(settingButton.generateGetValueFunc("arrowIndicators"), settingButton.generateSetValueFunc("arrowIndicators")
			).generateSettingPreRenders() ); off ++;
		this.buttons.push(new settingButton().construct("Path Indicators", tpos.plus(new vec2(0, off * dif)), "projected paths of the ball will be shown when deciding which direction to go at an intersection"
			).setGettersAndSetters(settingButton.generateGetValueFunc("pathIndicators"), settingButton.generateSetValueFunc("pathIndicators")
			).generateSettingPreRenders() );
		off += 1.5;
		var action_resetConfig = function(){ gameState.switchState(new state_confirmationDialogue(function(){ setDefaultConfig(); saveConfig(); ths.addButtons() })); };
		this.buttons.push(new menuButton().construct("Reset Config", tpos.plus(new vec2(0, off * dif)), "resets the game configuration and settings back to default", action_resetConfig));
		off += 1.2;
		var action_resetScores = function(){ gameState.switchState(new state_confirmationDialogue(function(){ setDefaultScores(); localStorage.setItem(storageKeys.scoreboard, null); })); };
		this.buttons.push(new menuButton().construct("Reset Scores", tpos.plus(new vec2(0, off * dif)), "removes all high score data", action_resetScores));
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("GAME", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}
}
// a control configuration screen
class state_controlSettings extends state_menuState{
	constructor(){
		super();
		
		var titleEntrance = new textAnim_scaleTransform(300, 0, 1, 0);
		titleEntrance.animType = textAnimType.easeOut;
		
		this.titleAnim = titleEntrance;
	}
	
	addButtons(){
		this.controls = this.getControls();
		this.buttons = [];
		var off = 0;
		var dif = 32;
		var tpos = new vec2(screenBounds.center.x, screenBounds.top + 155);
		var ths = this;
		
		// create control mapping button for each control
		Object.keys(this.controls).forEach(function(key){
			let btn = new settingButton();
			btn.construct(key, tpos.plus(new vec2(0, off * dif)), "change input for " + key);
			btn.mode = buttonSwitchMode.directValue;
			btn.setGettersAndSetters(
				function(){ return controlState.keyCodeToName(ths.controls[key]); },
				function(val){ ths.controls[key] = val; }
			);
			
			// sets the button's action to rebind the control to the next key that the player presses
			let listener = function(e){
				btn.changeValue(e.keyCode);
				log("temp list control '" + key + "' changed to key '" + controlState.keyCodeToName(ths.controls[key]) + "'", logType.notify);
				controlState.resetControlChangeListener();
			};
			btn.action = function(){ 
				ths.selectionFocus = true;
				window.addEventListener("keydown", listener);
				controlState.controlChangeListener = listener;
			};
			
			// so menu navigate left/right doesn't do anything
			btn.increment = null;
			btn.decrement = null;
			
			// adds the button to the button array and increments the offset
			ths.buttons.push(btn.generateSettingPreRenders());
			off++;
		});
		
		// defaults button
		var action_setDefaultControls = function(){ 
			ths.controls = getDefaultControls(); // sets the controls to the default controls
			ths.addButtons(); // refresh the buttons
			ths.currentSelection = ths.buttons.length - 2; // sets the currently selected button to be on the defaults button
		};
		this.buttons.push(new menuButton().construct(
			"Defaults", 
			new vec2(screenBounds.center.x, screenBounds.bottom - 144), 
			"reset keys to the default configuration", 
			action_setDefaultControls));
		
		// back button
		var action_backToOptions = function(){ gameState.switchState(new state_optionsMenu()); };
		this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to previous menu", action_backToOptions));
	}
	getControls(){
		var c = {};
		Object.keys(controlState.controls).forEach(function(key){
			c[key] = controlState.controls[key];
		});
		return c;
	}
	
	drawInternals(){
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("CONTROLS", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
	}

	switchFrom(tostate = null){
		controlState.setControls(this.controls);
		saveControls();
	}
}
// when the game is paused
class state_pauseMenu extends state_menuState{
	constructor(){
		super();
		this.resumeState = null;
	}
	
	addButtons(){
		// adds buttons to the interface
		this.buttons = [];
		var off = 0;
		var dif = 55;
		
		var ths = this;
		var action_resumeGame = function(){ ths.resume(); };
		var action_switchToScoreboard = function(){ gameState.switchState(new state_scoreboard()); };
		var action_switchToOptions = function(){ gameState.switchState(new state_optionsMenu()); };
		var action_quitSession = function(){ gameState.switchState(new state_mainMenu()); };
		
		this.buttons.push(new menuButton().construct("Resume", screenBounds.center.plus(new vec2(0, off * dif)), "resumes the gameplay", action_resumeGame)); off++;
		this.buttons.push(new menuButton().construct("Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), "view the highest scoring players", action_switchToScoreboard)); off++;
		this.buttons.push(new menuButton().construct("Options", screenBounds.center.plus(new vec2(0, off * dif)), "configure gameplay and av options", action_switchToOptions)); off++;
		this.buttons.push(new menuButton().construct("Quit", screenBounds.center.plus(new vec2(0, off * dif)), "quit the current game and return to the main menu", action_quitSession)); off++;
	}
	setResumeState(gameplayState){
		this.resumeState = gameplayState;
	}
	resume(){
		gameState.switchState(this.resumeState);
	}

	drawInternals(){
		// draws the the main menu title
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("GAME PAUSED", new vec2(screenBounds.center.x, screenBounds.top + 100), style);
	}
}

// when the player is playing the game
class state_gameplayState extends gameState{
	constructor(){
		super();
		
		this.nextTileforms = [];
		this.generateNextTileforms(3, tileform.getPiece_ball());
		//this.generateNextTileforms(0, tileform.getPiece_bomb());
		//this.generateNextTileforms(0, tileform.getPiece_ball());
		this.switchGameplayPhase(new phase_placeTileform(this));
		
		this.currentTileform = null; // the falling tileform that the player can control
		this.tfDropInterval = 1000;
		this.tfBumpTime = null;
		
		//animation stuff
		this.anim_HUDNextTileOff = 0;
	}
	
	spawnBallAt(pos, balltype){
		//spawns a ball at the specified position and changes the phase to the ball physics phase
		if(!(this.phase instanceof phase_ballPhysics))
			this.switchGameplayPhase(new phase_ballPhysics(this));
		
		var b = new ball(pos, balltype);
		this.phase.addBall(b);
	}
	getNextTileform(){
		// gets the next tileform and allows the player to control it
		if(!this.nextTileforms[0])
			this.generateNextTileforms();
		
		log("next tileform retrieved", logType.notify);
		
		var ptf = new phase_placeTileform(this);
		ptf.setTileform(this.nextTileforms.splice(0, 1)[0]);
		this.switchGameplayPhase(ptf);
		
		this.generateNextTileforms();
		
		// animation stuff
		this.anim_HUDNextTileOff = this.timeElapsed;
	}
	generateNextTileforms(count = 1, backpiece = null){
		// generates a specified amount of tileforms and adds them to this.nextTileforms
		for(let i = count; i > 0; i--){
			let r = tileform.getPiece_random();
			this.nextTileforms.push(r);
		}
		if(backpiece) this.nextTileforms.push(backpiece);
	}
	
	switchGameplayPhase(newphase){
		// switches the active gameplayPhase from one to another
		if(this.phase){
			log("gameplayPhase switching from '" + this.phase.constructor.name + "' to '" + newphase.constructor.name + "'");
			this.phase.end();
		}
		newphase.parentState = this;
		this.phase = newphase;
	}
	controlTap(control = controlAction.none){
		// called when a control is tapped
		if(control == controlAction.pause){
			this.pauseGame();
			return;
		}
		
		this.phase.controlTap(control);
	}
	checkTilePlacement(ctiles = null){
		// checks the tile placement of all the specified tiles
		// if no tiles are specified, check all the tiles in the tile grid
		if(!ctiles){
			ctiles = [];
			tile.grid.forEach(function(tileArray){
				ctiles = ctiles.concat(tileArray);
			});
		}
		ctiles.forEach(function(tileOb){
			if(tileOb.isEmpty()) return;
			tileOb.checkPlacement();
		});
	}
	pauseGame(){
		var pauseState = new state_pauseMenu();
		pauseState.setResumeState(this);
		gameState.switchState(pauseState);
	}
	
	update(dt){
		// main logic step
		super.update(dt);
		
		updateEffects(dt);
		this.phase.update(dt);
	}
	
	drawNextTileformAnim(){
		// draws the next tile form on the HUD (and the current tileForm if it is still being animated off the screen)
		var animLength = 200;
		var animScale = tile.tilesize * 3;
		var off = this.anim_HUDNextTileOff + animLength - this.timeElapsed;
		off = Math.min(1 - off / animLength, 1);
		
		if(off < 1)
			this.drawPrevNextTileform(-off * animScale);
		this.drawNextTileform(-off * animScale + animScale);
	}
	drawPrevNextTileform(off){
		// draws the previous "nextTileform" (aka the current tileform) being animated off the screen
		if(!this.phase.currentTileform) return;
		
		off = new vec2(0, off);
		this.phase.currentTileform.drawAtScreenPos(tile.nextTileformSlot.minus(this.phase.currentTileform.getCenterOff()).plus(off));
	}
	drawNextTileform(off = 0){
		// draws the next tileform in the "next" slot in the HUD
		var next = this.nextTileforms[0];
		if(!next) return;
		
		off = new vec2(0, off);
		next.drawAtScreenPos(tile.nextTileformSlot.minus(next.getCenterOff()).plus(off));
	}
	drawHUD(){
		// draws the heads up display
		this.drawNextTileformAnim();
		drawForegroundOverlay();
	}
	draw(){
		// renders tiled background
		drawBackground(); 
		
		tile.drawGrid();
		this.phase.draw();
		
		this.drawHUD();
		drawEffects();
	}
}

// a state machine for a handler inside a different state machine! It's like stateception!
class gameplayPhase{
	constructor(parentState){
		this.parentState = parentState; 
		this.init(); 
	}
	
	// to be overridden by objects that inherit from this class
	init(){}
	update(dt){}
	draw(){}
	end(){}
	
	// for override, called when a control is tapped
	controlTap(control = controlAction.none){}
}
// the gameplay phase that lets the player control the tileform that is falling from the sky
class phase_placeTileform extends gameplayPhase{
	constructor(parentState){ 
		super(parentState); 
		
		this.currentTileform = null; // the falling tileform that the player can control
		this.tfBumpInterval = 1000;
		this.tfLastBumpTime = this.parentState.timeElapsed;
	}
	
	update(dt){
		this.handleTileform();
	}
	end(){
	}
	
	controlTap(control){
		if(!this.currentTileform) return;
		switch(control){
			case controlAction.down:
				this.bumpDownTF(); 
				break;
			case controlAction.rotateCW:
				this.currentTileform.rotateCW();
				break;
			case controlAction.rotateCCW:
				this.currentTileform.rotateCCW();
				break;
			case controlAction.left: 
				this.currentTileform.move(side.left);
				break;
			case controlAction.right: 
				this.currentTileform.move(side.right);
				break;
		}
	}
	
	setTileform(tf){
		// sets the current tileform
		this.currentTileform = tf;
		this.currentTileform.bumpDown();
	}
	placeTileform(){
		// places the current tileform and does all the necessary checks
		this.currentTileform.setInPlace();
		this.currentTileform = null;
		
		this.parentState.checkTilePlacement();
		
		// if the gameplay phase hasn't changed, get the next tileForm
		if(this.parentState.phase == this) 
			this.parentState.getNextTileform();
	}
	bumpDownTF(){
		// bumps the current tileform object downward
		if(!this.currentTileform) return;
		
		// bumps down the tileform if possible
		var canBump = this.currentTileform.canMove(side.down);
		if(canBump) this.currentTileform.move(side.down);
		
		// otherwise the tileform is set in place
		else this.placeTileform();
		
		// resets the bump interval so that the tileform will be bumped down at the right time
		this.tfLastBumpTime = this.parentState.timeElapsed;
		
	}
	handleTileform(){
		// handles updating the tileform object
		if(!this.currentTileform) this.parentState.getNextTileform();
		if(!this.tfLastBumpTime) this.tfLastBumpTime = this.parentState.timeElapsed;
		
		// if the tileform drop interval has passed, bump the tileform down
		var nextBump = this.tfLastBumpTime + this.tfBumpInterval;
		if(this.parentState.timeElapsed >= nextBump){
			this.bumpDownTF();
			this.tfLastBumpTime -= this.parentState.timeElapsed - nextBump;
		}
	}

	draw(){
		// draws the current tileform
		if(this.currentTileform)
			this.currentTileform.draw();
	}
}
// the gameplay phase that handles the movement and logic for ball objects
class phase_ballPhysics extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		
		// the array that holds the ball objects
		this.balls = [];
		this.tilesTagged = [];
	}
	
	update(dt){
		// update all the balls in the array and remove the ones that are dead from the ball array
		var ths = this;
		this.balls.forEach(function(ballOb){
			ballOb.update(dt);
			if(ballOb.state == ballStates.dead)
				ths.killBall(ballOb);
		});
		
		// if there are no more balls to be handled end this gameplayPhase
		// Because, well what's the point of life without any balls to handle?
		if(this.balls.length <= 0)
			this.nextPhase();
	}
	draw(){
		// renders the gameplayPhase
		this.balls.forEach(function(ballOb){
			ballOb.draw();
		});
	}
	end(){
		
	}
	
	nextPhase(){
		var phase = new phase_destroyTaggedTiles(this.parentState);
		phase.setTilesTagged(this.tilesTagged);
		this.parentState.switchGameplayPhase(phase);
	}
	
	controlTap(control){
		this.balls.forEach(function(ballOb){
			switch(control){
				case controlAction.left:
					ballOb.direct(side.left);
					break;
				case controlAction.right: 
					ballOb.direct(side.right);
					break;
				case controlAction.up: 
					ballOb.direct(side.up);
					break;
				case controlAction.down: 
					ballOb.direct(side.down);
					break;
			}
		});
	}
	
	addBall(ballOb){
		// adds a ball to the ball array
		this.balls.push(ballOb);
	}
	killBall(ballOb){
		// destroys the specified ball, removes it from the array and queries all the tiles that it tagged
		this.balls.splice(this.balls.indexOf(ballOb), 1);
		this.tilesTagged = this.tilesTagged.concat(ballOb.tilesTagged);
	}
}
// destroys the tiles that have been tagged by the ball
class phase_destroyTaggedTiles extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		
		this.lastTileDestroyed = parentState.timeElapsed;
		this.tilesTagged = [];
		this.fallHeights = [];
	}
	
	update(dt){
		// destroy each tagged tile sequentially
		var animInterval = 100;
		var nextDestroy = this.lastTileDestroyed + animInterval;
		
		while(this.parentState.timeElapsed >= nextDestroy){
			this.lastTileDestroyed += animInterval;
			this.destroyTiles(this.tilesTagged.splice(0, 1));
			nextDestroy = this.lastTileDestroyed + animInterval;
		}
		
		if(this.tilesTagged.length <= 0)
			this.nextPhase();
	}
	
	setTilesTagged(tagged){
		// flags the tagged tiles for destruction
		this.tilesTagged = tagged;
	}
	destroyTiles(tileArray){
		// destroy the specified tiles
		var ths = this;
		tileArray.forEach(function(tileOb){
			ths.destroyTile(tileOb);
		});
	}
	destroyTile(tileOb){
		// destroys the tile and sets the corresponding fall height
		this.concatFallHeight(tileOb.gridPos.x, tileOb.gridPos.y);
		tileOb.destroy();
	}
	
	concatFallHeights(heightArray = []){
		// updates the fallheights in all the specified columns
		var ths = this;
		heightArray.forEach(function(height, x){
			ths.concatFallHeight(x, height);
		});
	}
	concatFallHeight(x, height){
		// adds a fall height at the necessary column if the height is lower than the previous fall height
		this.fallHeights[x] = !this.fallHeights[x] ? height : Math.max(this.fallHeights[x], height);
	}
	
	nextPhase(){
		// enters the next gameplay phase
		var phase = new phase_fellTiles(this.parentState);
		phase.setFallHeights(this.fallHeights);
		this.parentState.switchGameplayPhase(phase);
	}
}
// the phase where tiles can fall
class phase_fellTiles extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		
		this.fallHeights = [];
		this.fallingTiles = null;
		this.fallOffset = 0;

		this.lastOffReset = this.parentState.timeElapsed;
	}
	
	firstStep(){
		// if it is the first tick in this phase, retrieve the falling tiles list and remove those tiles from the 
		// tile grid
		if(!this.fallingTiles){
			this.fallingTiles = this.getFallingTiles();
			this.fallingTiles.forEach(function(tileOb){
				let tpos = tileOb.gridPos.clone();
				tile.setTileAt(tile.getEmpty(tpos), tpos);
			});
		}
	}
	update(dt){
		// handles update logic for the falling tiles phase
		// first step
		if(!this.fallingTiles) this.firstStep();

		this.handleFallingTiles();
	}
	draw(){
		// draws all the falling tiles with the specified tile offset
		if(!this.fallingTiles) this.firstStep();

		var yOff = this.fallOffset * tile.tilesize;
		var ths = this;
		this.fallingTiles.forEach(function(tileOb){
			tileOb.drawAtScreenPos(tile.toScreenPos(tileOb.gridPos, false)
				.plus(new vec2(0,
					yOff
				)));
		});
	}
	
	handleFallingTiles(){
		this.updateFallingTileOffset();
		
		if(this.fallOffset >= 1)
			this.updateFallingTilePos();

		if(this.fallingTiles.length <= 0)
			this.nextPhase();
	}
	updateFallingTilePos(){
		// updates the falling tiles gridpos by moving them down 1 tile
		this.fallingTiles.forEach(function(tileOb){
			tileOb.gridPos.y += 1;
		});
		this.lastOffReset = this.parentState.timeElapsed;
		this.fallOffset = 0;
		this.checkFallingTiles();
	}
	checkFallingTiles(){
		// checks to see if the falling tiles have landed on the ground or another solid tile
		for(let i = this.fallingTiles.length - 1; i >= 0; i--){
			let gpos = this.fallingTiles[i].gridPos.plus(vec2.fromSide(side.down));
			let ttile = tile.at(gpos);
			if(!ttile.isEmpty()){
				this.fallingTiles[i].place();
				this.fallingTiles.splice(i, 1);
			}
		}
	}
	updateFallingTileOffset(){
		// updates the Y offset that the tiles should be drawn at
		var animLength = 100;
		this.fallOffset = (this.parentState.timeElapsed - this.lastOffReset) / animLength;
		
		//caps the fall offset to %100
		this.fallOffset = Math.min(this.fallOffset, 1);
	}
	
	setFallHeights(heights){
		this.fallHeights = heights;
	}
	getFallingTiles(){
		var r = [];
		
		this.fallHeights.forEach(function(y0, x){
			for(let y = y0; y >= 0; y--){
				let t = tile.at(x, y);
				if(!t.isEmpty())
					r.push(t);
			}
		});
		
		// reverse the tile array, this is important because the bottom tiles must check for 
		// ground collision beffore the tiles above them
		return r.reverse();
	}

	nextPhase(){
		this.parentState.getNextTileform();
	}
}