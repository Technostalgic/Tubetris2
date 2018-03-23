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
	select: 8,
	pause: 9
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
	}
	
	static listenForMouseMove(e){
		// the event listener that is triggered when the mouse is moved
		controlState.mousePos = new vec2(e.offsetX, e.offsetY);
		gameState.current.mouseMove(controlState.mousePos);
	}
	static listenForMouseDown(e){
		// the event listener that is triggered when the mouse is pressed
		controlState.mouseDown = true;
		gameState.current.mouseTap(controlState.mousePos);
	}
	static listenForMouseUp(e){
		// the event listener that is triggered when the mouse is released
		controlState.mouseDown = false;
		log("mouse click at: " + new vec2(e.offsetX, e.offsetY));
	}
	static listenForKeyDown(e){
		// the event listener that is triggered when a keyboard key is pressed
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = true;
		
		var a = controlState.getControlsForKey(e.keyCode);
		a.forEach(function(ctrl){
			gameState.current.controlTap(ctrl);
		});
	}
	static listenForKeyUp(e){
		// the event listener that is triggered when a keyboard key is released
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = false;
	}
	
	static isKeyDown(keyCode){
		// checks to see if a key is currently pressed
		return(!!controlState.keys[keyCode]);
	}
	static isControlDown(action = controlAction.none){
		// checks to see if a control action is currently being triggered
		switch(action){
			case controlAction.none: return false;
			case controlAction.left: return controlState.isKeyDown(controlState.controls.left);
			case controlAction.right: return controlState.isKeyDown(controlState.controls.right);
			case controlAction.up: return controlState.isKeyDown(controlState.controls.up);
			case controlAction.down: return controlState.isKeyDown(controlState.controls.down);
			case controlAction.quickDrop: return controlState.isKeyDown(controlState.controls.quickDrop);
			case controlAction.nudgeDown: return controlState.isKeyDown(controlState.controls.nudgeDown);
			case controlAction.rotateCW: return controlState.isKeyDown(controlState.controls.rotateCW);
			case controlAction.rotateCCW: return controlState.isKeyDown(controlState.controls.rotateCCW);
			case controlAction.select: return (controlState.isKeyDown(controlState.controls.select) || 
				controlState.isKeyDown(13)); // non-overridable default key 'enter'
			case controlAction.pause: return (controlState.isKeyDown(controlState.controls.pause) || 
				controlState.isKeyDown(27)); // non-overridable default key 'escape'
		}
		return false;
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