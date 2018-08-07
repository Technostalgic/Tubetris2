///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

// enumerates all the different actions performed by triggering a control
var controlAction = {
	none: -1,
	left: 0,
	right: 1,
	up: 2,
	down: 3,
	quickDrop: 4,
	nudgeDown: 5,
	rotateCW: 6,
	rotateCCW: 7,
	swap: 8,
	select: 9,
	pause: 10
}

class controlState{
	static init(){
		// initializes the static fields of controlState
		log("initializing controlState...");
		controlState.keys = [];
		controlState.mouseDown = false;
		controlState.mousePos = new vec2();
		controlState.controls = {};
		controlState.controlChangeListener = null;
		
		controlState.touchStartPos = null;
		controlState.touchStartTime = null;
		controlState.touchPos = null;
		controlState.currentTouchID = null;
		controlState.touchList = [];
	}
	
	static listenForMouseMove(e){
		// the event listener that is triggered when the mouse is moved
		var fixedPos = new vec2(e.offsetX, e.offsetY);
		
		// adjust for the size of the canvas if it's different from the native resolution
		fixedPos.x /= scalingTarget.width / nativeResolution.x;
		fixedPos.y /= scalingTarget.height / nativeResolution.y;
		
		controlState.mousePos = fixedPos;
		gameState.current.mouseMove(controlState.mousePos);
	}
	static listenForMouseDown(e){
		// the event listener that is triggered when the mouse is pressed
		controlState.mouseDown = true;
		gameState.current.mouseTap(controlState.mousePos);
		
		// sets the control mode to keyboard mode unless the touch mode was explicitly specified by the user
		if(!config.touchModeSpecified)
			config.touchMode = false;
	}
	static listenForMouseUp(e){
		// the event listener that is triggered when the mouse is released
		controlState.mouseDown = false;
		log("mouse click at: " + new vec2(e.offsetX, e.offsetY));
	}
	static listenForKeyDown(e){
		// the event listener that is triggered when a keyboard key is pressed
		if(!e.keyCode) return;
		//console.log(e.key + "(key #" + e.keyCode.toString() + ") Pressed");

		controlState.keys[e.keyCode] = true;
		
		var a = controlState.getControlsForKey(e.keyCode);
		a.forEach(function(ctrl){
			gameState.current.controlTap(ctrl);
		});

		// sets the control mode to keyboard mode unless the touch mode was explicitly specified by the user
		if(!config.touchModeSpecified)
			config.touchMode = false;
	}
	static listenForKeyUp(e){
		// the event listener that is triggered when a keyboard key is released
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = false;
	}
	
	static listenForTouchStart(e){
		// triggered when the screen is touched
		for(let touch of e.touches){
			if(!controlState.touchList.includes(touch)){
				controlState.touchList.push(touch);
				
				// if there is no active touch, make this the currently active touch
				if(!controlState.currentTouchID){
					controlState.currentTouchID = touch.identifier;
					controlState.touchStartTime = timeElapsed;
				
					// calculate the touch's in-game position
					controlState.touchStartPos = clientToOffsetPos(new vec2(touch.clientX, touch.clientY));
					controlState.touchStartPos.x /= scalingTarget.width / nativeResolution.x;
					controlState.touchStartPos.y /= scalingTarget.height / nativeResolution.y;
					controlState.touchPos = controlState.touchStartPos.clone();
					
					gameState.current.touchStart(controlState.touchStartPos, touch);
				}
			}
		}
		
		// sets the control mode to touchscreen mode unless keyboard mode was explicitly specified by the user
		if(!config.touchModeSpecified)
			config.touchMode = true;
	}
	static listenForTouchMove(e){
		e.preventDefault(); // disable touch scrolling
		
		for(let i = e.touches.length - 1; i >= 0; i--){
			if(e.touches[i].identifier == controlState.currentTouchID){
				// calculate the touch's in-game position
				var tpos = clientToOffsetPos(new vec2(e.touches[i].clientX, e.touches[i].clientY));
				tpos.x /= scalingTarget.width / nativeResolution.x;
				tpos.y /= scalingTarget.height / nativeResolution.y;
				
				controlState.touchPos = tpos.clone();
				gameState.current.touchMove(tpos, e.touches[i]);
				break;
			}
		}
	}
	static listenForTouchEnd(e){
		e.preventDefault(); // disable touch clicking and right-clicking
		
		// remove the touch object that ended from the controlState.touchList
		for(let i = controlState.touchList.length - 1; i >= 0; i--){
			if(!touchListIncludes(e.touches, controlState.touchList[i])){
				
				// if it's the currently active touch, reset the flags and call the gamestate touchEnd fuction
				if(controlState.touchList[i].identifier == controlState.currentTouchID){
					gameState.current.touchEnd(controlState.touchPos.clone(), controlState.touchList[i]);
					
					controlState.currentTouchID = null;
					controlState.touchStartPos = null;
					controlState.touchStartTime = null;
				}
				controlState.touchList.splice(i, 1);
			}
		}
	}
	static listenForTouchCancel(e){
		for(let i = controlState.touchList.length - 1; i >= 0; i--){
			if(!touchListIncludes(e.touches, controlState.touchList[i])){
				if(controlState.touchList[i].identifier == controlState.currentTouchID){
					gameState.current.touchEnd(controlState.touchList[i]);
					controlState.currentTouchID = null;
					controlState.touchStartPos = null;
					controlState.touchStartTime = null;
				}
				controlState.touchList.splice(i, 1);
			}
		}
	}
	
	static getTouchDuration(){
		if(!controlState.touchStartTime)
			return null;
		return timeElapsed - controlState.touchStartTime;
	}
	
	static isKeyDown(keyCode){
		// checks to see if a key is currently pressed
		return(!!controlState.keys[keyCode]);
	}
	static isControlDown(action = controlAction.none){
		// checks to see if a control action is currently being triggered
		var key = Object.keys(controlAction)[action + 1];
		
		switch(action){
			case controlAction.select: return (controlState.isKeyDown(controlState.controls.select) || 
				controlState.isKeyDown(13)); // non-overridable default key 'enter'
			case controlAction.pause: return (controlState.isKeyDown(controlState.controls.pause) || 
				controlState.isKeyDown(27)); // non-overridable default key 'escape'
			default:
				return controlState.isKeyDown(controlState.controls[key]);
			
		}
		return false;
	}
	
	static getControlKeyName(controlaction){
		// returns the name of a key that is bound tot the specified control action
		return controlState.keyCodeToName( 
			controlState.controls[(Object.keys(controlState.controls)[controlaction])] 
		);
	}
	static keyCodeToName(code){
		//parses a keyCode and converts it into understandable text, used to display player controls
		if(code >= 65 && code <= 90)
			return String.fromCharCode(code);
		if(code >= 48 && code <= 57)
			return (code - 48).toString();
		if(code >= 96 && code <= 105)
			return "kp " + (code - 96).toString();
		switch(code){
			case -1: return ":::";
			case 0: return "none";
			case 8: return "backspc";
			case 13: return "enter";
			case 37: return "left arw";
			case 39: return "right arw";
			case 40: return "down arw";
			case 38: return "up arw";
			case 17: return "ctrl";
			case 16: return "shift";
			case 27: return "escape"
			case 32: return "space";
			case 219: return "l brckt";
			case 221: return "r brckt";
			case 191: return "backslash";
			case 220: return "fwdslash";
			case 190: return "period";
			case 186: return "semicolon";
			case 222: return "apstrophe";
			case 188: return "comma";
		}
		return "key" + code.toString();
	}
	static setControls(controls){
		// sets the key bindings to the specified controls
		controlState.controls = controls;
	}
	static resetControlChangeListener(){
		// used when the player presses a key to change a keybinding
		// removes the controlChangeListener from 'keydown' so that future keypresses are not binded
		window.removeEventListener("keydown", controlState.controlChangeListener);
		
		// remove the cancel action so it doesn't cancel ever time you click on another button 
		window.removeEventListener("mousedown", controlState.resetControlChangeListener);
		window.removeEventListener("touchstart", controlState.resetControlChangeListener);

		// resets the focus on the gamestate so the user can navigate the menu again
		gameState.current.selectionFocus = false;
	}
	
	static getAllControls(){
		// returns a list of all the keys currently bound to control actions
		return [
			controlState.controls.left,
			controlState.controls.right,
			controlState.controls.up,
			controlState.controls.down,
			controlState.controls.quickDrop,
			controlState.controls.nudgeDown,
			controlState.controls.rotateCW,
			controlState.controls.rotateCCW,
			controlState.controls.select,
			controlState.controls.pause
		];
	}
	static getControlsForKey(keycode){
		// returns all the control actions currently bound to a specified key
		var r = [];
		
		Object.keys(controlState.controls).forEach(function(key){
			if(controlState.controls[key] == keycode)
				r.push(controlAction[key]);
		});
		
		// non-overridable default keys 'enter' and 'escape' bound to actions 'select' and 'pause'
		if(keycode == 13) {
			if(!r.includes(controlAction.select))
				r.push(controlAction.select);
		}
		else if (keycode == 27)
			if(!r.includes(controlAction.pause))
				r.push(controlAction.pause);
		
		return r;
	}
}

class touchPanel{
	constructor(){
		this.isActive = false;
		this.timeOpened = timeElapsed;
		this.origin = new vec2();
		this.drawPos = this.origin.clone();
		this.touchPos = this.origin.clone();
		this.activeDirections = [side.left, side.right, side.up, side.down];
		this.radius = 75;
		this.touchRadius = 50;
		this.backdrop = null;
	}
	
	// override these:
	action_swipeLeft(){}
	action_swipeRight(){}
	action_swipeUp(){}
	action_swipeDown(){}
	action_kill(){}
	action_move(pos){}
	
	generateBackdrop(){
		return touchPanel.getDefaultBackdrop(this.radius);
	}
	static getDefaultBackdrop(radius){
		// returns the default circular backdrop with a transparent center
		var cvs = document.createElement("canvas");
		cvs.width = ((radius + 15) * 2) * config.swipeRadius;
		cvs.height = cvs.width;
		var ctx = cvs.getContext("2d");
		
		drawCircleFill(ctx, new vec2(cvs.width / 2), cvs.width / 2, color.fromHex("#000"));
		
		ctx.globalCompositeOperation = "destination-out";
		drawCircleFill(ctx, new vec2(cvs.width / 2), cvs.width / 4, color.fromHex("#000"));
		ctx.globalCompositeOperation = "source-over";
		
		return cvs;
	}
	
	spawn(pos){
		// spawns the panel at the specified position
		this.isActive = true;
		this.timeOpened = timeElapsed;
		this.origin = pos;
		this.drawPos = this.origin.clone();
		this.touchPos = this.origin.clone();
		this.backdrop = this.generateBackdrop();
		return this;
	}
	kill(){
		// makes the panel inactive
		this.action_kill();
		this.isActive = false;
	}
	
	stripActions(){
		action_swipeLeft = function(){};
		action_swipeRight = function(){};
		action_swipeUp = function(){};
		action_swipeDown = function(){};
		action_kill = function(){};
		action_move = function(pos){};
	}
	stripDrawActions(){
		this.drawAction_swipeLeft = function(){};
		this.drawAction_swipeRight = function(){};
		this.drawAction_swipeUp = function(){};
		this.drawAction_swipeDown = function(){};
	}
	
	touchMove(pos, touch){
		// triggered when the player moves their finger
		if(!this.isActive)
			return;
		
		this.touchPos = pos.clone();
		this.determineSwipeAction(pos);
		this.action_move(pos);
	}
	determineSwipeAction(pos){
		// determines if a swipe action is triggered, and if so, which direction the swipe was
		var sdist = this.touchRadius * config.swipeRadius;
		
		if(this.origin.distance(pos) >= sdist){
			var dif = pos.minus(this.origin);
			var dir = dif.getPointingSide();
			
			switch(dir){
				case side.left: this.action_swipeLeft(); break;
				case side.right: this.action_swipeRight(); break;
				case side.up: this.action_swipeUp(); break;
				case side.down: this.action_swipeDown(); break;
			}
		}
	}
	hapticPulse(){
		// sends a haptic pulse to the device to let the use know exactly when a control was triggered
		if(hapticFeedbackEnabled())
			window.navigator.vibrate(15);
	}
	
	getAnimProgress(){
		// returns the progress between 0 and 1 how complete the panel opening animation is
		var animLength = 100;
		
		var r = timeElapsed - this.timeOpened;
		r = Math.min(r / animLength, 1);
		
		return r;
	}
	
	drawAction_swipeLeft(pos){
		drawArrow(pos, side.left);
	}
	drawAction_swipeRight(pos){
		drawArrow(pos, side.right);
	}
	drawAction_swipeUp(pos){
		drawArrow(pos, side.up);
	}
	drawAction_swipeDown(pos){
		drawArrow(pos, side.down);
	}
	
	setSwipeSprite(dir, spCont){
		// sets the appropriate drawAction to draw the specified spriteContainer
		var func = function(pos){
			spCont.bounds.setCenter(pos);
			spCont.draw();
		};
		switch(dir){
			case side.left: this.drawAction_swipeLeft = func; break;
			case side.right: this.drawAction_swipeRight = func; break;
			case side.up: this.drawAction_swipeUp = func; break;
			case side.down: this.drawAction_swipeDown = func; break;
		}
	}
	setSwipeAction(dir, action){
		switch(dir){
			case side.left: this.action_swipeLeft = action; break;
			case side.right: this.action_swipeRight = action; break;
			case side.up: this.action_swipeUp = action; break;
			case side.down: this.action_swipeDown = action; break;
		}
	}
	
	draw(){
		// draws the touch panel
		if(!this.isActive)
			return;
		
		var prog = this.getAnimProgress();
		var drawDist = this.radius * config.swipeRadius;
		
		// draws the backdrop
		var alpha = prog * 0.65;
		var maxSize = new vec2(this.backdrop.width, this.backdrop.height);
		var bdSprite = new spriteContainer(
			this.backdrop,
			new spriteBox(new vec2(), maxSize.clone()),
			new collisionBox(new vec2(), maxSize.multiply(prog))
		);
		bdSprite.bounds.setCenter(this.drawPos);
		renderContext.globalAlpha = alpha;
		bdSprite.draw();
		renderContext.globalAlpha = 1;
		
		//draws each active direction
		for(let dir of this.activeDirections){
			let off = vec2.fromSide(dir).multiply(prog * drawDist);
			switch(dir){
				case side.left: this.drawAction_swipeLeft(this.drawPos.plus(off)); break;
				case side.right: this.drawAction_swipeRight(this.drawPos.plus(off)); break;
				case side.up: this.drawAction_swipeUp(this.drawPos.plus(off)); break;
				case side.down: this.drawAction_swipeDown(this.drawPos.plus(off)); break;
			}
		}
	}
}