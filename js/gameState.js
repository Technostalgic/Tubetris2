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
var gameMode = null;

// a generic gameState object, designed as a template base class to be extended from
class gameState{
	constructor(){ 
		// initializes a generic gamestate object which is never really used
		this.timeElapsed = 0;
		this.previousState = null;
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
	switchTo(fromstate = null){
		if(!this.previousState)
			this.previousState = fromstate;
	}
	
	// override these:
	// called when a control is tapped (the first frame the control action is triggered)
	controlTap(control = controlAction.none){}
	// called when the mouse button is tapped (the first frame the mouse button is pressed)
	mouseTap(pos){}
	// called when the mouse is moved
	mouseMove(pos){}
	
	// touch actions that are called when the listener for the corresponding event is triggered:
	touchStart(pos, touch){
		this.mouseMove(pos);
	}
	touchMove(pos, touch){
		this.mouseMove(pos);
	}
	touchEnd(pos, touch){
		if(controlState.getTouchDuration() < 350)
			if(pos.distance(controlState.touchStartPos) <= 10)
				this.touchTap(pos);
	}
	touchCancel(pos, touch){
		touchEnd(pos, touch);
	}
	
	// a custom touch action
	touchTap(pos){
		this.mouseTap(pos);
	}
}

// a pressable button in the GUI that the player can interact with
class menuButton{
	constructor(){ }
	
	static buildCreditsLink(author, desc, hyperlink, pos, style, anim){
		// simple way to build a credits link
		var mb = new menuButton().construct(author, pos, desc + " - click to visit their website", 
			function(){
				log("opening author page: " + hyperlink, logType.notify);
				window.open(hyperlink, "_blank");
			}
		);
		
		style.scale = 1;
		mb.setStyles(style);
		mb.animation = anim;
		
		return mb;
	}
	
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
		
		if(hapticFeedbackEnabled())
			window.navigator.vibrate(50);
		if(this.action)
			this.action(args);
	}
	
	draw(selected = false){
		// renders the button on screen
		if(!this.preRenders) return; // returns if the button's graphics haven't been generated
		
		// determines if this button's selected state is different than it was last frame
		var fSel = selected != this.selectedLast;
		
		if(selected){
			// reset's the button's animation if there's a change in it's state
			if(fSel) this.selectAnim.resetAnim();
			var fpr = this.preRenders.selected;
			
			// applies the emphasis animations if any
			fpr = fpr.animated(this.selectAnim);
			if(this.animation) fpr = fpr.animated(this.animation);
			fpr.draw();
			
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
			// reset's the button's animation if there's a change in it's state
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
	setEnumGetterAndSetter(enumObject, optionVarName){
		// sets getters and setters specific to settingButtons that use enumerations
		var keys = Object.keys(enumObject);
		
		// set the getters and setters
		this.getValue = function(){ return config[optionVarName]; }
		this.setValue = function(val){ config[optionVarName] = val; };
		this.setStyles(textStyle.getDefault(), textStyle.getDefault().setColor(textColor.green));
		
		// so that getValueString returns a string that represent the enumeration, instead of just an integer
		this.getValueString = function(){ return keys[this.getValue()]; };
		
		// sets the min and max value
		this.setValueBounds(0, keys.length - 1, 1, buttonSwitchMode.enumeration);
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
		
		this.title = new preRenderedText();
		this.titleStyle = new textStyle(fonts.large, textColor.green, 2);
		this.titleAnim = null;
		
		this.currentTouchPanel = null;
	}
	
	initialize(){
		// list of menu buttons
		this.buttons = [];
		// currently selected button
		this.currentSelection = 0;
		
		this.addButtons();
		this.initialized = true;
	}
	addButtons(){} // for override
	setTitle(titlename, style = null, anim = null){
		this.titleStyle = style || new textStyle(fonts.large, textColor.green, 2);
		
		if(!anim){
			this.titleAnim = new textAnim_scaleTransform(300, 0, 1, 0);
			this.titleAnim.animType = textAnimType.easeOut;
		} 
		else this.titleAnim = anim;
		
		this.title = preRenderedText.fromString(titlename, new vec2(screenBounds.center.x, screenBounds.top + 100), this.titleStyle);
	}
	
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
	switchToPreviousState(){
		if(this.previousState instanceof state_menuState)
			this.previousState.initialize();
		gameState.switchState(this.previousState);
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
		if(this.currentTouchPanel){
			this.killTouchPanel()
			return;
		}
		if(this.selectionFocus) return;
		if(!this.initialized) this.initialize();
		if(this.buttons.length <= 0) return;
		if(this.selectedButton.selectedBounds.overlapsPoint(pos)){
			this.touchStart(pos, null);
			if(!this.currentTouchPanel)
				this.select();
		}
	}
	mouseMove(pos){
		// defines what happens when the mouse is moved in the main menu
		
		if(this.selectionFocus) return;
		if(!this.initialized) this.initialize();
		
		// emulate touchmove
		if(this.currentTouchPanel){
			this.touchMove(pos, null);
			//if(!controlState.mouseDown)
			//	this.killTouchPanel();
			return;
		}
		
		if(this.buttons.length <= 0) return;
		if(this.selectedButton.selectedBounds.overlapsPoint(pos))
			return;
		
		// checks mouse collision with each button
		for(let i = 0; i < this.buttons.length; i ++){
			if(this.buttons[i].normalBounds.overlapsPoint(pos)){
				this.currentSelection = i;
				audioMgr.playSound(sfx.moveCursor);
				if(hapticFeedbackEnabled())
					window.navigator.vibrate(25);
				return;
			}
		}
	}

	touchStart(pos, touch){
		// creates a touch panel on the button if applicable
		if(!this.selectedButton) return;
		
		if(this.selectedButton.selectedBounds.overlapsPoint(pos)){
			if(this.selectedButton instanceof settingButton){
				if(!(
					this.selectedButton.mode == buttonSwitchMode.bool ||
					this.selectedButton.mode == buttonSwitchMode.enumeration ||
					this.selectedButton.mode == buttonSwitchMode.directValue
					)){
					this.currentTouchPanel = this.getValueSliderPanel(pos);
				}
			}
		}
		if(!this.currentTouchPanel)
			super.touchStart(pos, touch);
	}
	touchMove(pos, touch){
		if(this.currentTouchPanel)
			this.currentTouchPanel.touchMove(pos, touch);
		else
			super.touchMove(pos, touch);
	}
	touchEnd(pos, touch){
		if(!this.currentTouchPanel)
			super.touchEnd(pos, touch);
		this.killTouchPanel();
	}
	
	killTouchPanel(){
		if(this.currentTouchPanel){
			this.currentTouchPanel.kill();
			this.currentTouchPanel = null;
		}
	}
	getValueSliderPanel(pos){
		// gets a touch panel for sliding a value up or down
		var ths = this;
		var panel = new touchPanel();
		var swiperad = 32 * config.swipeRadius;
		
		panel.activeDirections = [side.left, side.right];
		
		var swipeLeft = function(){
			ths.navigateLeft();
			panel.origin.x -= swiperad;
		};
		var swipeRight = function(){
			ths.navigateRight();
			panel.origin.x += swiperad;
		};
		var move = function(pos){
			panel.drawPos.x = panel.touchPos.x;
			
			var dif = panel.touchPos.x - panel.origin.x;
			while(Math.abs(dif) >= swiperad){
				if(dif > 0) swipeRight();
				else swipeLeft();
				dif = panel.touchPos.x - panel.origin.x;
			}
		};
		
		panel.action_swipeLeft = swipeLeft;
		panel.action_swipeRight = swipeRight;
		panel.action_move = move;
		
		return panel.spawn(pos);
	}
	
	drawTitle(){
		var pr = !!this.titleAnim ? this.title.animated(this.titleAnim) : this.title;
		pr.draw();
	}
	drawInternals(){}
	draw(){
		// draws the menuState
		if(!this.initialized) this.initialize();
		// renders tiled background
		drawBackground(); 

		// draws all the user-defined graphics that aren't buttons
		this.drawInternals();
		this.drawTitle();
		
		// renders all the buttons
		var ths = this;
		this.buttons.forEach(function(btn, i){
			let sel = i == ths.currentSelection;
			btn.draw(sel);
		});
		
		// renders the foreground border
		drawForegroundBorder();
		
		if(this.currentTouchPanel) this.currentTouchPanel.draw();
	}
}

// a simple confirmation dialogue
class state_confirmationDialogue extends state_menuState{
	constructor(confirmAction, denyAction = function(){}){
		super();
		// title text = "Warning"
		this.description = "this action cannot be undone";
		this.prompt = "are you sure";
		
		var titleAnim = new textAnim_scaleTransform(350, 1, 1.15, 0);
		titleAnim.looping = true;
		titleAnim.animType = textAnimType.trigonometricCycle;
		var titleBlink = new textAnim_blink(400, 0.025, textColor.yellow);
		this.titleAnim = new textAnim_compound([titleAnim, titleBlink]);

		this.setTitle("Warning", new textStyle(fonts.large, textColor.red, 2), new textAnim_compound([titleAnim, titleBlink]));
		
		var ths = this;
		this.action_confirm = function(){ log("confirmation accepted", logType.unimportant); confirmAction(); gameState.switchState(ths.previousState); };
		this.action_deny = function(){ log("confirmation denied", logType.unimportant); denyAction(); gameState.switchState(ths.previousState); };
		
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
		// title prerender is drawn in this.draw()
		
		var descStyle = new textStyle(fonts.large, textColor.green, 1);
		textRenderer.drawText(this.description, new vec2(screenBounds.center.x, screenBounds.top + 150), descStyle);
		
		var promptStyle = new textStyle(fonts.large, textColor.green, 1);
		textRenderer.drawText(this.prompt, new vec2(screenBounds.center.x, screenBounds.bottom - 250), promptStyle);
	}
	
	switchTo(fromstate = null){
		super.switchTo(fromstate);
		log("gameState '" + this.previousState.constructor.name + "' asking for confirmation", logType.notify);
	}
}

// a gameState object that represents the main menu interface
class state_mainMenu extends state_menuState{
	constructor(){
		// initializes a main menu gameState
		super();
		
		// set the title and title animation
		var tubetrisEntrance = new textAnim_scale(300, 0, 1, 0.4);
		tubetrisEntrance.animType = textAnimType.bulgeIn;
		tubetrisEntrance.animDelay = 200;
		this.setTitle("TUBETRIS", new textStyle(fonts.large, textColor.green, 3), tubetrisEntrance);
		
		// "deluxe" text animation
		var deluxeEntrance = new textAnim_scale(100, 0, 1, 0);
		deluxeEntrance.animType = textAnimType.linear;
		deluxeEntrance.animDelay = 1300;
		
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
		var action_switchToCredits = function(){ gameState.switchState(new state_credits()); }
		
		this.buttons.push(new menuButton().construct("Start Game", screenBounds.center.plus(new vec2(0, off * dif)), "start a new game", action_startGame)); off++;
		this.buttons.push(new menuButton().construct("Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), "view the highest scoring players", action_switchToScoreboard)); off++;
		this.buttons.push(new menuButton().construct("Options", screenBounds.center.plus(new vec2(0, off * dif)), "configure gameplay and av options", action_switchToOptions)); off++;
		//this.buttons.push(new menuButton().construct("Extras", screenBounds.center.plus(new vec2(0, off * dif)), "other things n stuff")); off++;
		this.buttons.push(new menuButton().construct("Credits", screenBounds.center.plus(new vec2(0, off * dif)), "see who contributed to making the game!", action_switchToCredits)); off++;
	}
	
	drawTitle(){
		super.drawTitle();
		
		var animStyle = new textStyle(fonts.large, textColor.yellow, 2);
		textRenderer.drawText("DELUXE", new vec2(screenBounds.center.x, screenBounds.top + 180), animStyle, this.titleDeluxeAnim);
	}
	
	switchFrom(tostate = null){
		
	}
	switchTo(fromstate = null){
		super.switchTo(fromstate);
	}
}
// a gameState object that represents the scoreboard screen interface
class state_scoreboard extends state_menuState{
	constructor(){
		super();
		
		this.setTitle("SCOREBOARD");
		
		// text animations for first place
		this.anim_value1 = scoring.getRankColorAnim(1);
		var anim_p1 = new textAnim_scale(500, 0.75, 1.25, 0.1).setAnimType(textAnimType.trigonometricCycle);
		this.anim_place1 = new textAnim_compound([
			this.anim_value1,
			anim_p1
		]);
		
		// text animations for second place
		this.anim_value2 = scoring.getRankColorAnim(2);
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
			textStyle.getDefault().setColor(textColor.blue),
			textStyle.getDefault().setColor(textColor.pink)
		];
		this.addScoreboardText();
	}
	
	addButtons(){
		this.buttons = [];
		var ths = this;
		var off = 0;
		var dif = 55;
		var tpos = new vec2(screenBounds.center.x, screenBounds.bottom - 200);
		
		var action_switchToPreviousMenu = function(){
			let state = !ths.previousState ? new state_mainMenu() : ths.previousState;
			state.initialize();
			gameState.switchState(state); 
		};
		this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the previous menu", action_switchToPreviousMenu));
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
				default: n = n.animated(scoring.getRankColorAnim(i + 1)); break;
			}
			n.draw();
		});
		this.scoreValues.forEach(function(score, i){
			var s = score;
			switch(i){
				case 0: s = s.animated(ths.anim_value1); break;
				case 1: s = s.animated(ths.anim_value2); break;
				default: s = s.animated(scoring.getRankColorAnim(i + 1)); break;
			}
			s.draw();
		});
		
		// draws the title
		var style = new textStyle(fonts.large, textColor.green, 2);
		textRenderer.drawText("SCOREBOARD", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
		
	}
}
// the credits screen
class state_credits extends state_menuState{
	constructor(){ 
		super(); 
		this.setTitle("Credits");
	}
	
	addButtons(){
		var ths = this;
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, screenBounds.top + 165);
		
		// technostalgic
		this.buttons.push(
			menuButton.buildCreditsLink(
				"Technostalgic",
				"Technostalgic programmed the game and everything you love about it! I also made some of the graphics",
				"http://technostalgic.itch.io/",
				tpos.plus(new vec2(0, off * dif)),
				textStyle.getDefault().setColor(textColor.yellow),
				new textAnim_compound([
					new textAnim_rainbow(),
					new textAnim_yOffset(1000, 10),
					new textAnim_rotationOffset(1000, 0.25)
				])
			)
		); off++;
		off += 0.5;
		
		var scaleAnim = new textAnim_scale(500, 0.85, 1.15);
		scaleAnim.animType = textAnimType.trigonometricCycle;
		scaleAnim.looping = true;
		
		this.buttons.push(
			menuButton.buildCreditsLink(
				"Surt",
				"Surt made the sweet pixel art graphics for the pipes!",
				"https://opengameart.org/users/surt",
				tpos.plus(new vec2(0, off * dif)),
				textStyle.getDefault().setColor(textColor.cyan),
				new textAnim_compound([
					new textAnim_blink(500, 0.1, textColor.yellow),
					scaleAnim
				])
			)
		); off++;
		this.buttons.push(
			menuButton.buildCreditsLink(
				"J-Robot",
				"J-Robot created the retro fonts and the explosion effect",
				"https://opengameart.org/users/j-robot",
				tpos.plus(new vec2(0, off * dif)),
				textStyle.getDefault().setColor(textColor.cyan),
				new textAnim_compound([
					new textAnim_blink(500, 0.1, textColor.yellow),
					scaleAnim
				])
			)
		); off++;
		//this.buttons.push(
		//	menuButton.buildCreditsLink(
		//		"Puddin",
		//		"Puddin animated the coin graphic",
		//		"https://opengameart.org/users/puddin",
		//		tpos.plus(new vec2(0, off * dif)),
		//		textStyle.getDefault().setColor(textColor.cyan),
		//		new textAnim_compound([
		//			new textAnim_blink(500, 0.1, textColor.yellow),
		//			scaleAnim
		//		])
		//	)
		//); off++;
		off += 0.5;
		
		this.buttons.push(
			menuButton.buildCreditsLink(
				"gega",
				"gega composed the modern sound track that goes so well with the gameplay",
				"https://opengameart.org/users/gega",
				tpos.plus(new vec2(0, off * dif)),
				textStyle.getDefault().setColor(textColor.cyan),
				new textAnim_compound([
					new textAnim_blink(500, 0.1, textColor.yellow),
					scaleAnim
				])
			)
		); off++;
		this.buttons.push(
			menuButton.buildCreditsLink(
				"Necrosome",
				"Ethan Nickerson slammed his face against his keyboard until the menu music somehow came out of that",
				"https://atsugotwasted.bandcamp.com/releases",
				tpos.plus(new vec2(0, off * dif)),
				textStyle.getDefault().setColor(textColor.cyan),
				new textAnim_compound([
					new textAnim_blink(500, 0.1, textColor.yellow),
					scaleAnim
				])
			)
		); off++;
		off += 0.5;
		
		this.buttons.push(
			menuButton.buildCreditsLink(
				"Ogrebane",
				"Ogrebane made all those metallic clanking sound effects that you hear in the game",
				"https://opengameart.org/users/ogrebane",
				tpos.plus(new vec2(0, off * dif)),
				textStyle.getDefault().setColor(textColor.cyan),
				new textAnim_compound([
					new textAnim_blink(500, 0.1, textColor.yellow),
					scaleAnim
				])
			)
		); off++;
		this.buttons.push(
			menuButton.buildCreditsLink(
				"SubspaceAudio",
				"SubspaceAudio designed all the bleep bloops and other retro sounding old school 16 bit sound effects",
				"https://opengameart.org/users/subspaceaudio",
				tpos.plus(new vec2(0, off * dif)),
				textStyle.getDefault().setColor(textColor.cyan),
				new textAnim_compound([
					new textAnim_blink(500, 0.1, textColor.yellow),
					scaleAnim
				])
			)
		); off++;
		
		// list button
		var action_list = function(){
			window.open("./credits.txt", "_blank");
		};
		this.buttons.push(new menuButton().construct("list", new vec2(screenBounds.center.x, screenBounds.bottom - 145), "get the full credits list", action_list));
	
		// back button
		var action_switchToPreviousMenu = function(){
			if(ths.previousState) ths.switchToPreviousState();
			else gameState.switchState(new state_mainMenu());
		};
		this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the previous menu", action_switchToPreviousMenu));
	}
}

// a gameState object that represents the options screen interface
class state_optionsMenu extends state_menuState{
	constructor(){
		super();
		
		this.setTitle("OPTIONS");
		this.previousMenu = null;
	}
	
	addButtons(){
		this.buttons = [];
		var ths = this;
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
		
		var action_gotoControlSettings = function(){ gameState.switchState(new state_controlOptions()); };
		this.buttons.push(new menuButton().construct("Controls", tpos.plus(new vec2(0, off * dif)), "customize the controls", action_gotoControlSettings)); 
		off++;
		
		// back button
		var action_switchToPreviousMenu = function(){
			if(ths.previousState) ths.switchToPreviousState();
			else gameState.switchState(new state_mainMenu());
		};
		this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the previous menu", action_switchToPreviousMenu));
	}
	
	switchFrom(tostate = null){
		applyConfig();
		saveConfig();
	}
}
// generic options submenu that will be inherited from submenus of the the options menu
class state_optionsSubMenu extends state_menuState{
	constructor(){
		super();
		
		this.buttonStartPos = screenBounds.top + 200;
	}
	
	addButtons(){
		var ths = this;
		this.buttons = [];
		this.addSubMenuButtions();
		
		// back button
		var action_backToOptions = function(){ 
			if(ths.previousState) ths.switchToPreviousState();
			else gameState.switchState(new state_mainMenu());
		};
		this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to previous menu", action_backToOptions));
	}
	addSubMenuButtions(){}
	
	switchFrom(tostate = null){
		applyConfig();
		saveConfig();
	}
}
class state_audioOptions extends state_optionsSubMenu{
	constructor(){
		super();
		this.setTitle("AUDIO");		
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		
		// audio ops:
		// Track
		// Music Volume
		// Sound Volume
		//this.buttons.push(new settingButton().construct("track", tpos.plus(new vec2(0, off * dif)), "choose the song that plays during the game",
		//	).setGettersAndSetters(null, null
		//	).setValueBounds(0, 1, 0.1, buttonSwitchMode.enumeration).generateSettingPreRenders() ); 
		//	off += 1.5;
		this.buttons.push(new settingButton().construct("Music Volume", tpos.plus(new vec2(0, off * dif)), "the volume level of the music", true
			).setGettersAndSetters(settingButton.generateGetValueFunc("volume_music"), settingButton.generateSetValueFunc("volume_music")
			).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent).generateSettingPreRenders() ); off ++;
		this.buttons.push(new settingButton().construct("Sound Volume", tpos.plus(new vec2(0, off * dif)), "the volume level of the sound effects"
			).setGettersAndSetters(settingButton.generateGetValueFunc("volume_sound"), settingButton.generateSetValueFunc("volume_sound")
			).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent).generateSettingPreRenders() );
	}
}
class state_videoOptions extends state_optionsSubMenu{
	constructor(){
		super();
		this.setTitle("VIDEO");
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		
		// Animated Text
		// Explosions
		// Image Smoothing
		// Scale Smoothing
		this.buttons.push(new settingButton().construct(
			"Animated Text", tpos.plus(new vec2(0, off * dif)), 
			"whether or not text animations are enabled - may increase performance if disabled"
			).setGettersAndSetters(settingButton.generateGetValueFunc("animText"), settingButton.generateSetValueFunc("animText")).generateSettingPreRenders() ); off++;
		this.buttons.push(new settingButton().construct(
			"Explosions", tpos.plus(new vec2(0, off * dif)), 
			"whether or not explosion or smoke effects appear when a tile is destroyed - may increase performance if disabled"
			).setGettersAndSetters(settingButton.generateGetValueFunc("explosionEffects"), settingButton.generateSetValueFunc("explosionEffects")).generateSettingPreRenders() ); off++;
		this.buttons.push(new settingButton().construct(
			"Image Smoothing", tpos.plus(new vec2(0, off * dif)), 
			"enable if you want ugly blurs or keep disabled for nice crispy pixel graphics", true
			).setGettersAndSetters(settingButton.generateGetValueFunc("imageSmoothing"), settingButton.generateSetValueFunc("imageSmoothing")).generateSettingPreRenders() ); off++;
		this.buttons.push(new settingButton().construct(
			"Scale Smoothing", tpos.plus(new vec2(0, off * dif)), 
			"whether or not the scaled render context will be smoothed - generally looks better if the canvas is rendering at a smaller than native resolution", true
			).setGettersAndSetters(settingButton.generateGetValueFunc("scaleSmoothing"), settingButton.generateSetValueFunc("scaleSmoothing")).generateSettingPreRenders() ); off++;
		
		// fit to screen
		var action_fitToScreen = function(){}
		this.buttons.push(new settingButton().construct(
			"Screen Fit", tpos.plus(new vec2(0, off * dif)), 
			"choose the way that the game canvas fits to the screen", true
			).setEnumGetterAndSetter(canvasScaleMode, "canvasScaleMode")); off += 1.2;
	}
}
class state_gameOptions extends state_optionsSubMenu{
	constructor(){
		super();
		this.setTitle("GAME");
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		var ths = this;
		
		// game ops:
		// Tooltips
		// Arrow Indicators
		// Path Indicators
		
		this.buttons.push(new settingButton().construct("Tooltips", tpos.plus(new vec2(0, off * dif)), "whether or not tooltips should appear in-game to help you learn how to play"
			).setGettersAndSetters(settingButton.generateGetValueFunc("tooltipsEnabled"), settingButton.generateSetValueFunc("tooltipsEnabled")
			).generateSettingPreRenders() ); off ++;
		this.buttons.push(new settingButton().construct("Arrow Indicators", tpos.plus(new vec2(0, off * dif)), "arrows appear while you are placing a ball to suggest possible tube entrances for the ball"
			).setGettersAndSetters(settingButton.generateGetValueFunc("arrowIndicators"), settingButton.generateSetValueFunc("arrowIndicators")
			).generateSettingPreRenders() ); off ++;
		this.buttons.push(new settingButton().construct("Path Indicators", tpos.plus(new vec2(0, off * dif)), "projected paths of the ball will be shown when deciding which direction to go at an intersection"
			).setGettersAndSetters(settingButton.generateGetValueFunc("pathIndicators"), settingButton.generateSetValueFunc("pathIndicators")
			).generateSettingPreRenders() );
		off += 1.5;
		
		// Reset Tooltips
		// Reset Config
		// Reset Scores 
		
		var action_resetTooltips = function(){
			seenTips = [];
		}
		this.buttons.push(new menuButton().construct("Reset Tooltips", tpos.plus(new vec2(0, off * dif)), "forgets the tooltips that have already been shown so that all tooltips will be shown again", action_resetTooltips));
		off += 1.2;
		var action_resetConfig = function(){
			gameState.switchState(new state_confirmationDialogue(function(){
				setDefaultConfig(); saveConfig(); ths.addButtons() 
			}));
		};
		this.buttons.push(new menuButton().construct("Reset Config", tpos.plus(new vec2(0, off * dif)), "resets the game configuration and settings back to default", action_resetConfig));
		off += 1.2;
		var action_resetScores = function(){ 
			gameState.switchState(new state_confirmationDialogue(function(){ setDefaultScores(); 
				localStorage.removeItem(storageKeys.scoreboard); 
				loadScores();
			})); 
		};
		this.buttons.push(new menuButton().construct("Reset Scores", tpos.plus(new vec2(0, off * dif)), "removes all high score data", action_resetScores));
	}
}
class state_controlOptions extends state_optionsSubMenu{
	constructor(){
		super();
		this.setTitle("CONTROLS");
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		var ths = this;
		
		// Touch Mode: on/off
		var action_touchModeSetter = function(val){
			config.touchMode = val;
			config.touchModeSpecified = true;
		}
		this.buttons.push(new settingButton().construct("Touch Mode", tpos.plus(new vec2(0, off * dif)), "optomized control mode for touchscreen devices"
			).setGettersAndSetters(settingButton.generateGetValueFunc("touchMode"), action_touchModeSetter
			).generateSettingPreRenders() );
		
		// Edit Keys
		// Touch Options
		
		off += 1.5;
		var action_gotoConfigureKeybindings = function(){
			gameState.switchState(new state_configureKeybindings());
		}
		this.buttons.push(new menuButton().construct("Edit Keys", tpos.plus(new vec2(0, off * dif)), "change the key bindings for the keyboard controls", action_gotoConfigureKeybindings));
		off += 1.2;
		
		var action_gotoTouchControls = function(){
			gameState.switchState(new state_touchOptions());
		}
		this.buttons.push(new menuButton().construct("Touch Options", tpos.plus(new vec2(0, off * dif)), "configure the options for touchscreen controls", action_gotoTouchControls));
		
	}
}
class state_touchOptions extends state_optionsSubMenu{
	constructor(){
		super();
		this.setTitle("TOUCHSCREEN");
	}
	
	addSubMenuButtions(){
		var off = 0;
		var dif = 40;
		var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
		var ths = this;
		
		// Haptic Pulses: on/off
		// Swipe Radius: 0.1 - 2.0 (+/- 0.1)
		
		this.buttons.push(new settingButton().construct("Touchscreen Mode", tpos.plus(new vec2(0, off * dif)), "optomized control mode for touchscreen devices"
			).setGettersAndSetters(settingButton.generateGetValueFunc("touchMode"), settingButton.generateSetValueFunc("touchMode")
			).generateSettingPreRenders() ); off++;
		this.buttons.push(new settingButton().construct("Haptic Pulses", tpos.plus(new vec2(0, off * dif)), "whether or not the device vibrates to provide haptic feedback when pressing buttons or operating controls"
			).setGettersAndSetters(settingButton.generateGetValueFunc("hapticPulses"), settingButton.generateSetValueFunc("hapticPulses")
			).generateSettingPreRenders() ); off++;
		this.buttons.push(new settingButton().construct("Swipe Radius", tpos.plus(new vec2(0, off * dif)), "the in-game sensitivity to swipe actions: lower numbers are more sensitive"
			).setGettersAndSetters(settingButton.generateGetValueFunc("swipeRadius"), settingButton.generateSetValueFunc("swipeRadiusV")
			).setValueBounds(0.1, 2, 0.1, buttonSwitchMode.percent).generateSettingPreRenders() ); off++;
	}
}

// a keybinding configuration screen
class state_configureKeybindings extends state_menuState{
	constructor(){
		super();
		this.setTitle("CONTROLS");
	}
	
	addButtons(retrievecontrols = true){
		if(retrievecontrols)
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
				setTimeout(function(){
					window.addEventListener("mousedown", controlState.resetControlChangeListener);
					window.addEventListener("touchstart", controlState.resetControlChangeListener);
				});
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
			ths.addButtons(false); // refresh the buttons
			ths.currentSelection = ths.buttons.length - 2; // sets the currently selected button to be on the defaults button
		};
		this.buttons.push(new menuButton().construct(
			"Defaults", 
			new vec2(screenBounds.center.x, screenBounds.bottom - 144), 
			"reset keys to the default configuration", 
			action_setDefaultControls));
		
		// back button
		var action_backToOptions = function(){ 
			if(ths.previousState) ths.switchToPreviousState();
			else gameState.switchState(new state_mainMenu());
		};
		this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to previous menu", action_backToOptions));
	}
	getControls(){
		var c = {};
		Object.keys(controlState.controls).forEach(function(key){
			c[key] = controlState.controls[key];
		});
		return c;
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
		this.setTitle("GAME PAUSED");
	}
	
	addButtons(){
		// adds buttons to the interface
		this.buttons = [];
		var ths = this;
		var off = 0;
		var dif = 55;
		
		var ths = this;
		var action_resumeGame = function(){ ths.resume(); };
		var action_switchToScoreboard = function(){ gameState.switchState(new state_scoreboard()); };
		var action_switchToOptions = function(){ gameState.switchState(new state_optionsMenu()); };
		var action_quitSession = function(){ goToMainMenu(); };
		
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
		audioMgr.resumeMusic();
	}
}
// the screen that displays when the player loses
class state_gameOver extends state_menuState{
	constructor(){
		super();
		this.lostGame = null;
		this.setTitle("GAME OVER");
	}

	addButtons(){
		// adds buttons to the interface
		this.buttons = [];
		var ths = this;
		var off = 0;
		var dif = 55;
		
		var ths = this;
		var action_restartGame = function(){ startNewGame(); };
		var action_switchToScoreboard = function(){ gameState.switchState(new state_scoreboard()); };
		var action_switchToOptions = function(){ gameState.switchState(new state_optionsMenu()); };
		var action_quitSession = function(){ goToMainMenu(); };
		
		this.buttons.push(new menuButton().construct(
			"Main Menu", screenBounds.center.plus(new vec2(0, off * dif)),
			"return to the main menu", action_quitSession)); off++;
		this.buttons.push(new menuButton().construct(
			"Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), 
			"view the highest scoring players", action_switchToScoreboard)); off++;
		this.buttons.push(new menuButton().construct(
			"Restart", screenBounds.center.plus(new vec2(0, off * dif)), 
			"start a new game", action_restartGame));
	}
	setLostGame(gameplaystate){
		this.lostGame = gameplaystate;
	}
	
	switchFrom(tostate){
		audioMgr.resumeMusic();
		if(!audioMgr.currentMusic){
			var song = tostate instanceof state_gameplayState ? music.modern : music.menu;
			audioMgr.playMusic(song);
		}
	}
	switchTo(fromstate){
		audioMgr.pauseMusic();
	}
	
	drawBG(){
		this.lostGame.draw();
		var rect = new collisionBox(new vec2(), new vec2(renderTarget.width, renderTarget.height));
		rect.drawFill(renderContext, "rgba(0, 0, 0, 0.5)");
	}
	draw(){
		if(!this.initialized) this.initialize();

		//draws the faded tiles in the background 
		this.drawBG();
		
		// draws all the user-defined graphics that aren't buttons
		this.drawInternals();
		this.drawTitle();
		
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
class state_gameOverRanked extends state_gameOver{
	constructor(){
		super();
		this.setTitle("RANK ACHIEVED!", null, new textAnim_yOffset);
		
		this.rank = 0;
		this.rankPR = null;
		this.scorePR = null;
		this.scoreAnim = null;
		this.promptPR = preRenderedText.fromString(
			responsiveText("Press Enter to Continue", "Swipe up to Continue"), 
			new vec2(screenBounds.center.x, screenBounds.bottom - 100)
		);
	}
	
	setRank(rank, score){
		// generate the preRenders and styles that require information about the player's rank
		this.rank = rank;
		this.score = score;
		
		var rCol = scoring.getRankStyle(rank + 1).color;
		
		// the text that tells you what rank you got
		this.rankPR = preRenderedText.fromBlock(
			new textBlock(
				"You ranked (" + (rank + 1).toString() + ")[" + scoring.getRankSuffix(rank + 1) + "] place 1| on the scoreboard!",
				textStyle.getDefault(),
				new collisionBox(new vec2(50, screenBounds.center.y - 150), new vec2(screenBounds.width - 100, 100)),
				[textStyle.getDefault().setColor(rCol), new textStyle(fonts.small).setColor(rCol).setAlignment(0.5, 0)]
			)
		);
		
		// the text that shows you your score
		this.scorePR = preRenderedText.fromString(
			scoring.getCurrentScore().toString() + " Pts",
			screenBounds.center,
			scoring.getRankStyle(rank + 1).setScale(2)
		);
		
		this.scoreAnim = new textAnim_compound([
			scoring.getRankColorAnim(rank + 1),
			new textAnim_yOffset(500, 10, 0.2)
			]);
	}
	
	controlTap(action){
		if(action == controlAction.select)
			this.finishState();
	}
	touchMove(pos, touch){
		if(pos.y <= controlState.touchStartPos.y - 75 * config.swipeRadius)
			this.finishState();
	}

	finishState(){
		var stt = new state_nameEntry();
		stt.setRank(this.rank, this.score);
		gameState.switchState(stt);
	}

	addButtons(){}
	
	drawInternals(){
		this.rankPR.draw();
		this.scorePR.animated(this.scoreAnim).draw();
		
		if(timeElapsed % 1000 >= 500)
			this.promptPR.draw();
	}
}
// name entry screen for scoreboard rankers
class state_nameEntry extends state_menuState{
	constructor(){
		super();
		this.name = "";
		this.maxLength = 12;
		this.rank = 0;
		this.score = 0;
		this.rankText = null;
		this.rankAnim = null;
		this.prompt = null;
		this.setTitle("Well Done!", new textStyle(fonts.large, textColor.light, 2), new textAnim_scaleTransform(1000, 1, 1.15, 0.1).setAnimType(textAnimType.trigonometricCycle));
	}
	
	addButtons(){
		var ths = this;
		var action_continue = function(){
			ths.finishEntry();
		};
		this.buttons.push(new menuButton().construct("Continue", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "proceed to scoreboard", action_continue));
	}
	
	setRank(rank, score){
		// informs the gamestate to stylize for the specified rank
		var rSTR = (rank + 1).toString() + '(' + scoring.getRankSuffix(rank + 1) + ')';
		var anms = [];
		
		this.rank = rank;
		this.score = score;
		
		// the rank text style
		var style = [
			textStyle.getDefault().setColor(textColor.yellow),
			textStyle.getDefault().setColor(textColor.green),
			textStyle.getDefault().setColor(textColor.cyan),
			textStyle.getDefault().setColor(textColor.blue),
			textStyle.getDefault().setColor(textColor.pink)
		];
		style = style[rank];
		
		// set the animations
		switch(rank + 1){
			case 1:
				anms = [
					//new textAnim_scale(500, 0.75, 1.25, 0.1).setAnimType(textAnimType.trigonometricCycle),
					new textAnim_rainbow()
				];
				break;
			case 2:
				anms = [
					//new textAnim_yOffset(500, 3, 0.5),
					new textAnim_blink(500, 0.5, textColor.yellow)
				];
				break;
		}
		if(anms.length > 0)
			this.rankAnim = new textAnim_compound(anms);
		
		var rankBlock = new textBlock(
			"You ranked " + rSTR + " place!", 
			style, 
			new collisionBox(new vec2(0, screenBounds.center.y - 120), new vec2(screenBounds.width, 32)),
			[new textStyle(fonts.small, style.color).setAlignment(0.5, 0)]
		);
		var promptTxt = responsiveText("Enter your name below:", "Tap to enter your name below:");
		
		this.rankText = preRenderedText.fromBlock(rankBlock);
		this.prompt = preRenderedText.fromString(promptTxt, screenBounds.center.minus(new vec2(0, 46)), new textStyle(fonts.small));
	}
	
	switchTo(fromstate){
		window.addEventListener("keydown", state_nameEntry.keypress);
		super.switchTo(fromstate);
	}
	switchFrom(tostate){
		window.removeEventListener("keydown", state_nameEntry.keypress);
		super.switchFrom(tostate);
	}
	
	static keypress(e){
		gameState.current.typeName(e.keyCode);
	}
	typeName(keyCode){
		// enters a character to this.name
		var chr = controlState.keyCodeToName(keyCode);
		if(chr.length > 1)
			chr = "";
		
		// if backspace is pressed
		if(keyCode == 8)
			this.name = this.name.substr(0, this.name.length - 1);
		if(keyCode == 13){
			this.finishEntry();
		}
		else{ 
			if(keyCode == 32)
				chr = " ";
			this.name = this.name + chr;
		}
		
		// makes sure the name stays within the max length
		if(this.name.length > this.maxLength)
			this.name = this.name.substr(0, this.maxLength);
	}
	finishEntry(){
		insertScore(this.rank, this.name, this.score)
		saveScores();

		var stt = new state_scoreboard();
		stt.addButtons = function(){
			stt.buttons.push(
				new menuButton().construct(
					"Main Menu",
					new vec2(screenBounds.center.x, screenBounds.bottom - 100), 
					"return to the main menu", 
					function(){
						gameState.switchState(new state_mainMenu());
					}
				));
		};
		gameState.switchState(stt);
	}
	
	controlTap(action){ }
	touchStart(pos, touch){
		if(pos.y <= 380 && pos.y >= 230){
			this.name = prompt("Enter Name:");
			if(!this.name)
				this.name = "";
			if(this.name.length > this.maxLength)
				this.name = this.name.substr(0, this.maxLength);
		}
		super.touchStart(pos, touch);
	}
	
	drawName(){
		// draws the name that is currently being typed by the player
		var nSTR = this.name;
		
		// adds a blinking ':' if the max length is not reached
		if(this.name.length < this.maxLength) 
			nSTR = nSTR + (
				timeElapsed % 500 >= 250 ?
					":" : "  "
			);
		else nSTR = nSTR + "";
		
		if(nSTR.length < 1) return;
		
		var nameStyle = textStyle.fromAlignment(0.5, 0);
		var namePR = preRenderedText.fromString(nSTR, screenBounds.center.minus(new vec2(0, 32)), nameStyle);
		
		if(this.rankAnim)
			namePR = namePR.animated(this.rankAnim);
		
		namePR.draw();
	}
	draw(){
		if(!this.initialized) this.initialize();
		super.draw();
		
		// if there is a rank animation, animate the rank text
		var rTXT = this.rankText;
		if(this.rankAnim)
			rTXT = this.rankText.animated(this.rankAnim);
		
		rTXT.draw();
		this.prompt.draw();
		this.drawName();
	}
}
// when the player is playing the game
class state_gameplayState extends gameState{
	constructor(){
		super();
		
		this.currentTouchPanel = null;
		
		this.tilesTagged = [];
		this.scoreBonus = {};
		this.resetScoreBonuses();
		
		this.floatingScoreFields = [];
		this.floatingScoreFieldKillStart = null;
		this.activeCombos = [];
		
		this.currentScore = 0;
		this.currentBallScore = 0;
		this.currentLevel = new level(1);
		this.scoreEmphasisAnim = new textAnim_scaleTransform(100, 1.5, 1);
		this.scoreEmphasisAnim.animType = textAnimType.easeIn;
		
		this.initUntil();
		this.nextTileforms = [];
		this.generateNextTileforms();
		this.switchGameplayPhase(new phase_placeTileform(this));
		this.tooltipProgress = tooltipProgression.getDefault();
		
		this.lastMousePressed = false;
		
		this.initHudPreRenders();
		this.updateHUDPreRenders();
		
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
		if(this.currentLevel.isOver && this.nextTileforms.length <= 0) {
			this.endLevel();
			return;
		}
		
		if(!this.nextTileforms[0])
			this.generateNextTileforms();
		
		log("next tileform retrieved", logType.notify);
		
		var ptf = new phase_placeTileform(this);
		this.switchGameplayPhase(ptf);
		ptf.setTileform(this.nextTileforms.splice(0, 1)[0], this.currentLevel.tfDropInterval);
		
		this.decrementUntil();
		this.generateNextTileforms();
		this.updateTileformDecrementPreRenders();
		
		this.resetScoreBonuses();
		
		// animation stuff
		this.anim_HUDNextTileOff = this.timeElapsed;
	}
	generateNextTileforms(){
		// generates a specified amount of tileforms and adds them to this.nextTileforms
		var c = 1;
		while(!this.untilHasValues() && !this.currentLevel.isOver){
			this.nextTileforms = this.nextTileforms.concat(
				this.currentLevel.getRandomPieces(c)
			);
			c++;
			this.findUntil();
		}
	}
	endLevel(){
		this.switchGameplayPhase(new phase_levelComplete(this));
		this.currentLevel.completeLevel(this);
		this.updateHUDPreRenders();
	}
	
	initUntil(){
		// initialize the 'until' fields, which keep track of how many tileForms must be used until the
		// specified peice type comes up
		this.until = {
			ball: null,
			bomb: null
		};
	}
	decrementUntil(){
		// decrements all the tileform 'until' fields, each time a new piece is gotten, and if any of the
		// fields reach below zero, the new 'until' counts are searched for
		var ths = this;
		var doSearch = false;
		Object.keys(this.until).forEach(function(key){
			if(ths.until[key])
				ths.until[key] -= 1;
			if(ths.until[key] <= 0 || ths.until[key] == null) doSearch = true;
		});
		if(doSearch)
			this.findUntil();
	}
	findUntil(){
		// finds the amount of tileforms that come before the next ball, and the next bomb, and store those
		// values in this.until
		this.initUntil();
		var ths = this;
		for(let i = this.nextTileforms.length - 1; i >= 0; i --){
			if(this.nextTileforms[i].hasEntityType(entities.ball))
				ths.until.ball = i;
			if(this.nextTileforms[i].hasEntity(blocks.block_bomb, entities.block))
				ths.until.bomb = i;
		}
	}
	untilHasValues(){
		// if any of the fields in this.until are null, this function returns false
		var keys = Object.keys(this.until);
		for(let i = keys.length - 1; i >= 0; i--){
			let key = keys[i];
			if(this.until[key] == null) return false;
		}
		return true;
	}
	
	setFloatingScoreField(text, style, fieldID, exitAnim){
		// sets the text and style of a specified floating score field that is drawn floating in the center of the tile grid
		
		for(var field of this.floatingScoreFields){
			if(field.fieldID == fieldID){
				field.setText(text, style, exitAnim);
				return;
			}
		}
		
		var r = new floatingTextField();
		r.fieldID = fieldID;
		r.setText(text, style, exitAnim);
		this.floatingScoreFields.push(r);
	}
	getFloatingScoreField(fieldID){
		// gets the specified floating score field that is drawn floating in the center of the tile grid
		
		for(var field of this.floatingScoreFields){
			if(field.fieldID == fieldID)
				return field;
		}
		
		return null;
	}
	
	isTrackingCombo(comboID){
		for(let combo of this.activeCombos){
			if(combo.comboID == comboID){
				return true;
			}
		}
	}
	addToComboValue(comboID, value = 1){
		// adds a combo point to the specified score combo
		for(let combo of this.activeCombos){
			if(combo.comboID == comboID){
				combo.addValue(value);
				return;
			}
		}
		
		// if the combo doesn't exist, create a new one
		var combo = scoreCombo.fromComboID(comboID);
		combo.addValue(value)
		this.activeCombos.push(combo);
	}
	endCombos(){
		// removes all the active combos and kills the floating score text
		for(let c of this.activeCombos)
			c.cashIn();
		this.activeCombos = [];
		this.killFloatingScoreText();
		this.updateFloatingScoreText();
		this.currentBallScore = 0;
	}
	checkRank(){
		var place = null;
		
		for(let i = scores.length - 1; i >= 0; i--){
			if(scores[i].score > this.currentScore)
				break;
			place = i;
		}
		
		var msg = place == null ? "player is not ranking in the scoreboard" : "player is ranked #" + (place + 1).toString();
		log(msg, logType.notify);
		
		return place;
	}
	
	killFloatingScoreText(){
		// starts the floating score text's ending animation
		if(this.floatingScoreFieldKillStart) return;
		this.floatingScoreFieldKillStart = this.timeElapsed;
	}
	drawFloatingScoreText(){
		// renders the floating score text
		
		// makes the text blink if the ball is paused
		if(this.phase instanceof phase_ballPhysics){
			for(let ball of this.phase.balls){
				if(ball.state == ballStates.paused)
					if(timeElapsed % 1000 >= 500)
						return;
			}
		}
		
		var scl = 1;
		var anm = false;
		
		// applies the ending animation to the floating score fields
		if(this.floatingScoreFieldKillStart){
			anm = true; // tell the floating score field to start using it's emphasis animation
			var el = this.timeElapsed - this.floatingScoreFieldKillStart; // calculates the elapsed milleseconds since "killFloatingScoreText" was called
			var prog = el / 2000; // makes it a linear scale from 0 to 1
			
			// if 3/4 of the way done, start shrinking
			if(prog > 0.75)
				scl = (1 - (4 * (prog - 0.75)));
			
			// if all the way done, remove floating score fields and reset animation
			if(prog >= 1){
				this.floatingScoreFields = [];
				this.floatingScoreFieldKillStart = null;
			}
		}
		
		var spos = tile.toScreenPos(new vec2(4.5, 9));
		this.floatingScoreFields.forEach(function(field, i){
			let tpos = spos.plus(new vec2(0, i * 32));
			field.draw(tpos, anm, scl);
		});
	}
	updateFloatingScoreText(){
		// increment the floating score text
		//if(!this.floatingScoreText) this.constructFloatingScoreText();
		
		if(this.currentBallScore <= 0) return;
		
		var txt = this.currentBallScore + " PTS";
		var style = textStyle.getDefault();
		
		//change the style based on the score
		if(this.currentBallScore >= 500)
			style.color = textColor.cyan;
		if(this.currentBallScore >= 1000)
			style.color = textColor.green;
		
		// apply the style and new text
		//this.floatingScoreText.style = style;
		//this.floatingScoreText.setText(txt);
		
		this.setFloatingScoreField(txt, style, floatingScoreFieldID.ballScore, new textAnim_blink(250, 0));
	}
	updateScoreVisuals(){
		// makes the score animation pop and the floating score text increment
		this.scoreEmphasisAnim.resetAnim();
		this.updateFloatingScoreText();
		this.updateScorePreRender();
	}
	checkScoreBonuses(){
		return;
		
		if(!this.scoreBonus.extraBall)
			if(this.currentBallScore >= 1000){
				this.scoreBonus.extraBall = true;
				this.nextTileforms.splice(0, 0, tileform.getPiece_ball());
			}
		
		if(!this.scoreBonus.goldBall)
			if(this.currentBallScore >= 1500){
				this.scoreBonus.goldBall = true;
				this.nextTileforms[0] = tileform.getPiece_ball(balls.gold);
			}
	}
	resetScoreBonuses(){
		this.scoreBonus = {
			extraBall:false,
			goldBall:false
		};
	}
	
	switchGameplayPhase(newphase){
		// switches the active gameplayPhase from one to another
		if(this.phase){
			this.killTouchPanel();
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
	
	mouseTap(pos){
		this.touchStart(pos);
		this.lastMousePressed = true;
	}
	mouseMove(pos){
		this.touchMove(pos);
	}
	mouseUp(pos){
		this.touchEnd(pos);
		this.lastMousePressed = false;
	}
	handleMouseTouchEmulation(){
		// handles all the logic that has to do with emulating a touchscreen with the mouse
		if(this.lastMousePressed)
			if(!controlState.mouseDown)
				this.mouseUp(controlState.mousePos);
	}
	
	touchStart(pos, touch){
		this.createTouchPanel(pos);
	}
	touchMove(pos, touch){
		if(this.currentTouchPanel)
			this.currentTouchPanel.touchMove(pos, touch);
	}
	touchEnd(pos, touch){
		this.killTouchPanel();
	}
	
	createTouchPanel(pos){
		// creates the appropriate touch panel at the specified location
		if(pos.y <= 35){
			this.setTouchPanel(this.getPauseTouchPanel(pos));
			return;
		}

		var tp = null;
		if(this.phase)
			tp = this.phase.getNewTouchPanelAt(pos);
		
		this.setTouchPanel(tp);
	}
	getPauseTouchPanel(pos){
		var r = new touchPanel();
		var ths = this;
		r.activeDirections = [side.down];

		r.action_swipeDown = function(){
			gameState.current.controlTap(controlAction.pause);
			ths.killTouchPanel();
		}

		return r.spawn(pos);
	}
	setTouchPanel(panel){
		// sets the current touch panel to the specified touch panel
		this.currentTouchPanel = panel;
	}
	killTouchPanel(){
		// kills the touch panel if there is one
		if(this.currentTouchPanel)
			this.currentTouchPanel.kill();
		this.currentTouchPanel = null;
	}
	
	pauseGame(){
		var pauseState = new state_pauseMenu();
		pauseState.setResumeState(this);
		gameState.switchState(pauseState);
		
		audioMgr.pauseMusic();
	}
	loseGame(){
		// called when the player loses a game
		log("Game Ended", logType.notify);
		
		this.switchGameplayPhase(new phase_gameOver());
		audioMgr.stopMusic();

		audioMgr.playSound(sfx.gameOver);
	}
	
	switchFrom(tostate){
		scoring.rememberScore();
		super.switchFrom(tostate);
	}
	
	update(dt){
		// main logic step
		super.update(dt);
		this.handleMouseTouchEmulation();
		
		this.tooltipProgress.checkTooltips(this);
		
		updateEffects(dt);
		this.phase.update(dt);
		this.checkScoreBonuses();
	}
	
	initHudPreRenders(){
		var hudPreRenders = {};
		
		// draw next piece label:
		var nplPos = tile.toScreenPos(new vec2(12.5, 0));
		hudPreRenders.nplPreRender = preRenderedText.fromString("NEXT:", nplPos, textStyle.getDefault().setColor(textColor.yellow));
		
		// draw tileforms til next ball:
		var nballPos = tile.toScreenPos(new vec2(12, 7)).plus(new vec2(0, -22));
		hudPreRenders.nballLabelPreRender = preRenderedText.fromString("next ball:", nballPos, new textStyle(fonts.small));
		
		// draw tileforms til next bomb:
		var nbombPos = tile.toScreenPos(new vec2(12, 9)).plus(new vec2(0, -22));
		hudPreRenders.nbombLabelPreRender = preRenderedText.fromString("next bomb:", nbombPos, new textStyle(fonts.small));
		
		// bonus
		// var bonusPos = tile.toScreenPos(new vec2(12, 11)).plus(new vec2(0, -22));
		// hudPreRenders.bonusLabelPreRender = preRenderedText.fromString("bonus:", bonusPos, new textStyle(fonts.small));
		
		// current score
		var scorePos = tile.toScreenPos(new vec2(12, 18)).plus(new vec2(0, -22));
		hudPreRenders.scoreLabelPreRender = preRenderedText.fromString("score:", scorePos, new textStyle(fonts.small));
		
		// high score
		var hscoretext = scores[0].score.toString();
		var hscorePos = tile.toScreenPos(new vec2(12, 19)).plus(new vec2(0, 10));
		hudPreRenders.hscoreLabelPreRender = preRenderedText.fromString("high:", new vec2(hscorePos.x, hscorePos.y - 10), new textStyle(fonts.small));
		hudPreRenders.hscorePreRender = preRenderedText.fromString(hscoretext, hscorePos, new textStyle(fonts.small, textColor.green, 1));
		
		this.hudPreRenders = hudPreRenders;
	}
	updateHUDPreRenders(){
		this.updateTileformDecrementPreRenders();
		this.updateScorePreRender();
		
		// current level:
		var lvlPos = tile.toScreenPos(new vec2(12, 16));
		this.hudPreRenders.lvlPreRender = preRenderedText.fromString("LEVEL " + this.currentLevel.difficulty, lvlPos, new textStyle(fonts.large, this.currentLevel.getDifficultyColor()));
	}
	updateScorePreRender(){
		// draw the score
		var scoreText = this.currentScore.toString();
		var scorePos = tile.toScreenPos(new vec2(12, 18));
		this.hudPreRenders.scorePreRender = preRenderedText.fromString(scoreText, scorePos, new textStyle(fonts.large, textColor.green));
	}
	updateTileformDecrementPreRenders(){
		// draw tileform count til next ball:
		var nball = this.until.ball;
		if(nball == null) nball = "--";
		var nballPos = tile.toScreenPos(new vec2(12, 7));
		this.hudPreRenders.nballPreRender = preRenderedText.fromString(nball.toString(), nballPos, new textStyle(fonts.large, textColor.green));
		
		// draw tileforms til next bomb:
		var nbomb = this.until.bomb;
		if(nbomb == null) nbomb = "--";
		var nbombPos = tile.toScreenPos(new vec2(12, 9));
		this.hudPreRenders.nbombPreRender = preRenderedText.fromString(nbomb.toString(), nbombPos, new textStyle(fonts.large, textColor.red));
		
		// ??
		//var bonus = "none";
		//var bonusPos = tile.toScreenPos(new vec2(12, 11));
		//this.hudPreRenders.bonusPreRender = preRenderedText.fromString(bonus.toString(), bonusPos, textStyle.getDefault());
		
		// draw tileforms til next level:
		var lvlPos = tile.toScreenPos(new vec2(12, 16));
		var progPos = lvlPos.plus(new vec2(0, 22));
		var tftlvl = this.nextTileforms.length + this.currentLevel.tfTilProgression;
		this.hudPreRenders.progLabelPreRender = preRenderedText.fromString("next level in " + tftlvl, progPos, new textStyle(fonts.small));
	}

	drawTouchPanel(){
		// draws the touch panel if there is one
		if(this.currentTouchPanel)
			this.currentTouchPanel.draw();
	}
	drawHUDPreRenders(){
		var ths = this;
		Object.keys(this.hudPreRenders).forEach(function(key){
			ths.hudPreRenders[key].draw();
		});
	}
	drawHUD(){
		// draws the heads up display
		this.drawNextTileformAnim();
		drawForegroundOverlay();
		
		this.drawHUDPreRenders();
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
		// draws the previous "nextTileform" (aka the current tileform) being animated off the HUD
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
	draw(){
		// renders tiled background
		drawBackground(); 
		
		// draws all the tiles in the tile grid
		tile.drawGrid();
		
		// member specific draw funciton for the current gameplayPhase
		this.phase.draw();
		
		// draw's the current game session info
		this.drawHUD();
		
		drawEffects();
		this.drawFloatingScoreText();
		
		if(this.phase instanceof phase_tooltip)
			this.phase.drawOverlay();
		
		// draws the touch interface if available
		this.drawTouchPanel();
	}
}

// a state machine for a handler inside a different state machine, yay nested state machines!
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
	
	// for override, create the appropriate touch panel for the current phase
	getNewTouchPanelAt(pos){
		var r = new touchPanel();
		var ths = this;
		
		r.action_swipeLeft = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.left);
			ths.parentState.killTouchPanel();
		}
		r.action_swipeRight = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.right);
			ths.parentState.killTouchPanel();
		}
		r.action_swipeUp = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.up);
			ths.parentState.killTouchPanel();
		}
		r.action_swipeDown = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.down);
			ths.parentState.killTouchPanel();
		}
		
		return r.spawn(pos);
	}
}
// the phase for when a tooltip is being displayed
class phase_tooltip extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		
		this.startTime = parentState.timeElapsed;
		this.previousPhase = gameState.current.phase;
		this.tip = null;
	}
	
	static fromTooltip(tip){
		var r = new phase_tooltip(gameState.current);
		
		r.tip = tip;
		
		return r;
	}
	
	controlTap(control){
		if(control == controlAction.select)
			this.nextPhase();
	}
	
	getNewTouchPanelAt(pos){
		var r = new touchPanel();
		var ths = this;
		
		r.activeDirections = [side.up];
		r.action_swipeUp = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.select);
			ths.parentState.killTouchPanel();
		}
		
		return r.spawn(pos);
	}
	
	nextPhase(){
		this.parentState.timeElapsed = this.startTime;
		this.parentState.switchGameplayPhase(this.previousPhase);
	}
	
	draw(){
		this.previousPhase.draw();
	}
	drawOverlay(){
		this.tip.draw();
	}
	
}
// the gameplay phase that lets the player control the tileform that is falling from the sky
class phase_placeTileform extends gameplayPhase{
	constructor(parentState){ 
		super(parentState);
		
		this.currentTileform = null; // the falling tileform that the player can control
		this.tfDropInterval = 1000;
		
		this.arrowIndicators = null;
		this.tfLastBumpTime = this.parentState.timeElapsed;
		this.bumpStop = true; // used to stop tileforms from immediately being dropped because the down key is held
		this.parentState.endCombos();
	}
	
	update(dt){
		this.handleTileform();
		
		// if down is not being held, reset bumpstop flag so that the tileform can be bumped downward
		if(!controlState.isControlDown(controlAction.down))
			this.bumpStop = false;
	}
	end(){
	}
	
	controlTap(control){
		if(!this.currentTileform) return;
		switch(control){
			case controlAction.down:
				if(!this.bumpStop)
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
			case controlAction.swap:
				this.swapTileform();
				break;
			case controlAction.quickDrop:
				this.quickDropTF();
				break;
		}
	}
	
	getNewTouchPanelAt(pos){
		// returns null if the player is actually trying to tap the next tileform
		if(pos.x >= tile.nextTileformSlot.x - 2 * tile.tilesize && pos.x <= tile.nextTileformSlot.x + 2 * tile.tilesize ){
			if(pos.y >= tile.nextTileformSlot.y - 1 * tile.tilesize && pos.y <= tile.nextTileformSlot.y + 1 * tile.tilesize ){
				this.parentState.controlTap(controlAction.swap);
				if(hapticFeedbackEnabled())
					window.navigator.vibrate(25);
				return null;
			}
		}
		
		// returns a touch panel at the specified position
		var r = new touchPanel();
		var ths = this;
		r.touchRadius = 35;

		r.setSwipeSprite(side.up, new spriteContainer(
			gfx.touchPanelIcons,
			new spriteBox(new vec2(), new vec2(32))
		));
		r.action_swipeLeft = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.left);
			ths.parentState.setTouchPanel(ths.getNewXMoveTouchPanel(r.touchPos));
		}
		r.action_swipeRight = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.right);
			ths.parentState.setTouchPanel(ths.getNewXMoveTouchPanel(r.touchPos));
		}
		r.action_swipeUp = function(){
			r.hapticPulse();
			ths.parentState.setTouchPanel(ths.getNewRotTouchPanel(r.touchPos));
		}
		r.action_swipeDown = function(){
			r.hapticPulse();
			if(ths.currentTileform.canMove(side.down)) 
				ths.currentTileform.move(side.down);
			else {
				ths.placeTileform();
				return;
			}
			ths.parentState.setTouchPanel(ths.getNewYMoveTouchPanel(r.touchPos));
		}
		
		return r.spawn(pos);
	}
	getNewRotTouchPanel(pos, phase = 0){
		// returns a new rotation touch panel for when the rotate action is selected from the main touch panel
		var r = new touchPanel();
		var ths = this;
		
		r.stripDrawActions();

		// the function that will be called for rotate clockwise
		var rotCW = function(){
			r.hapticPulse();
			ths.parentState.setTouchPanel(ths.getNewRotTouchPanel(r.touchPos, (phase + 1) % 4));
			gameState.current.controlTap(controlAction.rotateCW);
		};
		// ** counter clockwise
		var rotCCW = function(){
			r.hapticPulse();
			let nphase = phase - 1;
			if(nphase < 0)
				nphase = 3;
			ths.parentState.setTouchPanel(ths.getNewRotTouchPanel(r.touchPos, nphase));
			gameState.current.controlTap(controlAction.rotateCCW);
		};

		// the icon for clockwise
		var spriteCW = new spriteContainer(
			gfx.touchPanelIcons,
			new spriteBox(new vec2(), new vec2(32))
		);
		// ** counter clockwise
		var spriteCCW = new spriteContainer(
			gfx.touchPanelIcons,
			new spriteBox(new vec2(32, 0), new vec2(32))
		);

		// sets dirs based on the phase that is specified
		// dir[0] will always be the direction for clockwise and dir[1] counter clockwise
		var dirs = [];
		switch(phase){
			case 0:
				dirs = [side.right, side.left];
				break;
			case 1:
				dirs = [side.down, side.up];
				break;
			case 2:
				dirs = [side.left, side.right];
				break;
			case 3:
				dirs = [side.up, side.down];
				break;
		}
		r.activeDirections = dirs;

		// bind the actions and the icons to the touch panel 
		r.setSwipeSprite(dirs[0], spriteCW);
		r.setSwipeSprite(dirs[1], spriteCCW);
		r.setSwipeAction(dirs[0], rotCW);
		r.setSwipeAction(dirs[1], rotCCW);

		// makes it so that the touchpanel slides along with the player's finger
		// but only along the axis that isn't being used for determining a swipe action
		var horizontalSlide = phase % 2 == 1;
		r.action_move = function(pos){
			if(horizontalSlide)
				r.origin.x = pos.x;
			else
				r.origin.y = pos.y;

			r.drawPos = r.origin.clone();
		}

		return r.spawn(pos);
	}
	getNewXMoveTouchPanel(pos){
		// returns a new sliding touch panel for when the left or right swipe action is selected from the main touch panel
		var r = new touchPanel();
		var ths = this;
		var slideDist = 32 * config.swipeRadius;
		
		r.activeDirections = [side.left, side.right];
		
		var moveLeft = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.left);
			r.origin.x -= slideDist;
		};
		var moveRight = function(){
			r.hapticPulse();
			gameState.current.controlTap(controlAction.right);
			r.origin.x += slideDist;
		};
		
		r.setSwipeAction(side.left, moveLeft);
		r.setSwipeAction(side.right, moveRight);
		
		// set so that the player doesn't have to stay centered on the touch panel
		r.action_move = function(pos){
			r.drawPos.x = pos.x;
			
			let dif = pos.x - r.origin.x;
			while(Math.abs(dif) >= slideDist){
				if(dif < 0) moveLeft();
				else moveRight();
				dif = pos.x - r.origin.x;
			}
		}
		
		return r.spawn(pos);
	}
	getNewYMoveTouchPanel(pos){
		// returns a new touch panel for when the down swipe action is triggered
		var r = new touchPanel();
		var ths = this;
		var slideDist = 32 * config.swipeRadius;
		this.bumps = 1;
		
		r.activeDirections = [side.down, side.up];
		var moveDown = function(){
			r.hapticPulse();
			if(ths.currentTileform.canMove(side.down)) 
				ths.currentTileform.move(side.down);
			r.origin.y += slideDist;
			ths.bumps++;
		};
		var moveUp = function(){
			r.hapticPulse();
			r.origin.y -= slideDist;
			if(ths.bumps <= 0) return;
			ths.currentTileform.move(side.up);
			ths.bumps--;
		}
		
		r.setSwipeAction(side.down, moveDown);
		r.setSwipeAction(side.up, moveUp);
		
		// set so that the player doesn't have to stay centered on the touch panel
		r.action_move = function(pos){
			r.drawPos.y = pos.y;
			
			let dif = pos.y - r.origin.y;
			while(Math.abs(dif) >= slideDist){
				if(dif > 0) moveDown();
				else moveUp();
				dif = pos.y - r.origin.y;
			}
		};
		
		return r.spawn(pos);
	}
	
	setTileform(tf, dropInterval = 1000){
		// sets the current tileform
		this.currentTileform = tf;
		this.currentTileform.setPos(new vec2(Math.floor((tile.gridBounds.size.x - 1) / 2), -1));
		this.tfDropInterval = dropInterval;
		
		if(this.currentTileform.hasEntityType(entities.ball))
			this.calculateArrowIndicators();

		this.bumpDownTF();
	}
	swapTileform(){
		var ptf = this.parentState.nextTileforms[0];
		ptf.setPos(this.currentTileform.gridPos.clone());
		if(ptf.isOverlappingTile()){
			ptf.setPos(new vec2());
			audioMgr.playSound(sfx.invalidMove);
			return;
		}
		if(this.currentTileform.getGridSize().y + 1 > 2)
			this.currentTileform.rotate(1, true);
		this.currentTileform.setPos(new vec2());
		this.currentTileform = this.parentState.nextTileforms.splice(0, 1, this.currentTileform)[0];
		audioMgr.playSound(sfx.swapTileform);

		// disable arrow indicators if they were on and the swapped tileform is not a ball
		if(this.arrowIndicators){
			if(!this.currentTileform.hasEntityType(entities.ball))
				this.arrowIndicators = null;
		}
		// and vice-versa
		else if(this.currentTileform.hasEntityType(entities.ball))
			this.calculateArrowIndicators();
	}
	placeTileform(){
		// places the current tileform and does all the necessary checks
		this.currentTileform.setInPlace();
		
		if(this.tileformOverflowCheck())
			return;
		
		this.currentTileform = null;
		tile.checkTilePlacement();
		tile.checkForFullRows();
		
		// if the gameplay phase hasn't changed, get the next tileForm
		if(this.parentState.phase == this) 
			this.parentState.getNextTileform();
	}
	tileformOverflowCheck(){
		for(let tileOb of this.currentTileform.tiles){
			if(tileOb.gridPos.y < 0){
				this.parentState.loseGame();
				return true;
			}
		}
		return false;
	}
	quickDropTF(){
		while(this.currentTileform.canMove(side.down))
			this.currentTileform.move(side.down);
		this.placeTileform();
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
		var nextBump = this.tfLastBumpTime + this.tfDropInterval;
		if(this.parentState.timeElapsed >= nextBump){
			this.bumpDownTF();
			this.tfLastBumpTime -= this.parentState.timeElapsed - nextBump;
		}
	}
	
	calculateArrowIndicators(){
		// calculates all the arrow indicators and stores the info in this.arrowIndicators
		var indicators = [];
		tile.iterateGrid(function(tileOb, x, y){
			if(tileOb.isEmpty()) return; // continue if empty tile
			let openDirs = tileOb.getUnblockedSides(); // get all the sides the ball can enter from
			let ind = []; // arrow indicators for this tile will be stored here
			openDirs.forEach(function(dir){
				if(dir == side.down) return; // continue if direction is downward, because the ball can never travel upward on the first tick
				let tpos = new vec2(x, y).plus(vec2.fromSide(dir)); // the position next to the tile in the direction of the open side
				//if the tile's neighbor is empty, it may be able to place an indicator there
				if(tile.at(tpos).isEmpty()){
					// if the open side is facing upward, add an indicator and continue
					if(dir == side.up){
						ind.push({pos: tpos, direction: side.down});
						return;
					}
					// if the open side is facing sideways, check to make sure there is ground below it's neighbor so that the ball can
					// enter. If there is, add an indicator and continue
					if(!tile.at(tpos.plus(vec2.fromSide(side.down))).getUnblockedSides().includes(side.up)){
						ind.push({pos: tpos, direction: invertedSide(dir)})
						return;
					}
				}
			});
			
			// add all the arrow indicators from 'ind'
			indicators = indicators.concat(ind);
		});
		
		// set the arrow indicators variable
		this.arrowIndicators = indicators;
	}
	
	drawArrowIndicators(){
		// draws each arrow indicator to suggest where to place the ball
		this.arrowIndicators.forEach(function(indicator){
			var tpos = tile.toScreenPos(indicator.pos).plus(vec2.fromSide(indicator.direction).multiply(tile.tilesize / 4));
			drawArrow(tpos, indicator.direction);
		});
	}
	draw(){
		// draws the current tileform
		if(this.currentTileform)
			this.currentTileform.draw();
		if(this.arrowIndicators)
			this.drawArrowIndicators();
	}
}
// the gameplay phase that handles the movement and logic for ball objects
class phase_ballPhysics extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		
		// the array that holds the ball objects
		this.balls = [];
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
	end(){ }
	
	nextPhase(){
		var phase = new phase_destroyTaggedTiles(this.parentState);
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
	}
}
// destroys the tiles that have been tagged by the ball
class phase_destroyTaggedTiles extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		
		this.tileCombo = 0;
		this.chargedTileCombo = 1;
		
		this.lastTileDestroyed = parentState.timeElapsed;
		this.tilesChargeTagged = [];
		this.fallHeights = [];
		
		this.brickBombs = false;
	}
	
	update(dt){
		// destroy each tagged tile sequentially
		var animInterval = 100;
		var nextDestroy = this.lastTileDestroyed + animInterval;
		
		while(this.parentState.timeElapsed >= nextDestroy){
			this.lastTileDestroyed += animInterval;
			
			if(this.parentState.tilesTagged.length > 0)
				this.destroyTiles(this.parentState.tilesTagged.splice(0, 1));
			else if(this.tilesChargeTagged.length > 0)
				this.destroyChargedTiles();
			
			nextDestroy = this.lastTileDestroyed + animInterval;
		}
		
		if(this.parentState.tilesTagged.length <= 0 && this.tilesChargeTagged.length <= 0)
			this.nextPhase();
	}
	draw(){ }
	
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
		
		var rollpts = true;
		
		if(tileOb.isEntity(blocks.block_bomb, entities.block)){
			this.parentState.addToComboValue(floatingScoreFieldID.bombCombo);
			rollpts = false;
		}
		
		if(rollpts){
			var comboAdd = 1;
			if(this.tileCombo >= 10)
				comboAdd = 0.5;
			this.tileCombo += comboAdd;
			var comboMult = Math.min(Math.floor(this.tileCombo), 15);
			scoring.addScore(comboMult * 10, tile.toScreenPos(tileOb.gridPos), scoreTypes.pop);
		}
	}
	destroyChargedTiles(tileArray){
		// specify that the tiles are being destroyed by the tile's charged chain reaction
		var tileArray = this.tilesChargeTagged;
		this.tilesChargeTagged = [];
		
		var ths = this;
		tileArray.forEach(function(tileOb){
			ths.destroyChargedTile(tileOb);
		});
	}
	destroyChargedTile(tileOb){
		// destroys the tile and sets the corresponding fall height
		this.concatFallHeight(tileOb.gridPos.x, tileOb.gridPos.y);
		tileOb.destroy();
		
		var rollpts = true;
		
		if(tileOb.isEntity(blocks.block_bomb, entities.block)){
			this.parentState.addToComboValue(floatingScoreFieldID.bombCombo);
			rollpts = false;
		}
		
		if(rollpts){
			var comboAdd = 0.25;
			if(this.chargedTileCombo >= 3)
				comboAdd = 0.125;
			var comboMult = Math.min(Math.floor(this.chargedTileCombo), 5);
			scoring.addScore(comboMult * 10, tile.toScreenPos(tileOb.gridPos), scoreTypes.pop);
			this.chargedTileCombo += comboAdd;
		}
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
	
	doBrickBombs(){
		// converts all the bricks to bombs (per combo bonus)
		var iter = function(tileOb){
			if(tileOb.isEntity(blocks.block_brick, entities.block)){
				tileOb.setEntity(blocks.block_bomb, entities.block);
				effect.createPoof(tile.toScreenPos(tileOb.gridPos));
			}
		};
		tile.iterateGrid(iter);
		tile.checkTilePlacement();
		
		this.brickBombs = false;
	}
	
	nextPhase(){
		if(this.brickBombs){
			this.doBrickBombs();
			return;
		}
		
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
				// mark each falling tile as empty in the tile grid
				let tpos = tileOb.gridPos.clone();
				tile.setTileAt(tile.getEmpty(tpos), tpos);
			});
			
			// solo tiles are gotten after the falling tiles are marked empty so that the solo condition is tested 
			// in a more chronoligically accurate way
			let soloTiles = this.getSoloTiles();
			soloTiles.forEach(function(tileOb){
				// mark each solo tile as empty in the tile grid
				let tpos = tileOb.gridPos.clone();
				tile.setTileAt(tile.getEmpty(tpos), tpos);
			});
			
			// concat this.falling tiles with the solo tiles that we just got
			this.fallingTiles = this.fallingTiles.concat(soloTiles);
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
	getSoloTiles(){
		// gets all the single tiles that are just floating randomly in the air
		var r = [];

		var iter = function(ttile){
			if(ttile.gridPos.y >= tile.gridBounds.size.y - 1 || ttile.isEmpty())
				return;
			if(ttile.getDirectNeighbors().length <= 0)
				r.push(ttile);
		}
		tile.iterateGrid(iter);
		
		return r;
	}

	nextPhase(){
		// check the tile placement and then progress to the next tileform if the gameplayPhase hasn't changed
		tile.checkTilePlacement();
		tile.checkForFullRows();
		if(this.parentState.phase == this)
			this.parentState.getNextTileform();
	}
}
// the level complete animation
class phase_levelComplete extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		this.parentState.endCombos();
		
		this.startTime = this.parentState.timeElapsed;
		this.constructPreRender();
	}
	
	constructPreRender(){
		// creates the preRender and the animations to be drawn
		var box = new collisionBox(new vec2(), new vec2(10 * tile.tilesize, 4 * tile.tilesize)).setCenter(tile.toScreenPos(new vec2(4.5, 5)));
		var textblock = new textBlock(
			"Level " + this.parentState.currentLevel.difficulty + " Complete!", 
			new textStyle(fonts.large, textColor.green, 2),
			box, [], 70);
		
		// the "Level X Complete!" text preRender
		this.preRender = preRenderedText.fromBlock(textblock);
		
		// determine how much points you earn from completing the level
		var pts = 500 * this.parentState.currentLevel.difficulty;
		scoring.addScore(pts);
		
		// the "X Points" text preRender
		this.ptsPreRender = preRenderedText.fromString(pts + " Points", new vec2(box.center.x, box.bottom + 35), new textStyle(fonts.large, textColor.yellow));
		
		// the animation of the prerenders' entrance
		var enterAnim = new textAnim_scaleTransform(300, 0, 1, 0.1);
		enterAnim.animType = textAnimType.easeOut;
		
		// the emphasis animation of the prerenders
		var anim = new textAnim_yOffset(500, 20, 0.15);
		var anim2 = new textAnim_rainbow();
		
		// the animation of the prerenders' exits
		var exitAnim = new textAnim_scaleTransform(300, 1, 0, 0.1);
		exitAnim.animType = textAnimType.easeIn;
		exitAnim.animDelay = 2500;
		
		this.textAnim = new textAnim_compound([enterAnim, exitAnim, anim]);
		this.ptsAnim = new textAnim_compound([enterAnim, exitAnim, anim2]);
		
		this.textAnim.resetAnim();
		this.ptsAnim.resetAnim();
	}
	
	update(dt){
		if(this.parentState.timeElapsed > this.startTime + 4000)
			this.nextPhase();
	}
	draw(){
		this.preRender.animated(this.textAnim).draw();
		this.ptsPreRender.animated(this.ptsAnim).draw();
	}
	
	controlTap(){
		this.nextPhase();
	}
	
	nextPhase(){
		// proceeds to place the first tileform of the next level
		tile.checkTilePlacement();
		if(this.parentState.phase == this)
			this.parentState.getNextTileform();
	}
}
// the game over animation
class phase_gameOver extends gameplayPhase{
	constructor(parentState){
		super(parentState);
		
		this.isFinished = false;
	}
	
	update(dt){
		this.finishLoss();
	}
	finishLoss(){
		this.isFinished = true;
		scoring.rememberScore();
		
		var didRank = this.parentState.checkRank() != null;
		
		var stt = null;
		if(didRank) {
			stt = new state_gameOverRanked();
			stt.setRank(this.parentState.checkRank(), scoring.getCurrentScore());
		}
		else stt = new state_gameOver();
		
		stt.setLostGame(this.parentState);
		gameState.switchState(stt);
	}
	
	draw(){
		if(this.isFinished) return;
		var rect = new collisionBox(tile.offset.clone(), tile.gridBounds.size.multiply(tile.tilesize));
		rect.drawFill(renderContext, "rgba(0, 0, 0, 0.5)");
	}
}