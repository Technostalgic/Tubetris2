///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

class tooltip{
	constructor(){
		this.text_pc = ""; // the text to display if user is on a pc
		this.text_mobile = null; // the text to display if user is on a mobile device
		
		this.textBounds = screenBounds.inflated(0.9);
		this.textBlock = null;
		this.preRender = null;
		this.titlePreRender = null;
		this.titleAnim = null;
		this.background = null;
		
		var promptStr = responsiveText("Press ENTER to Continue", "Swipe up to Continue");
		//TODO: if mobile, change promptStr
		this.promptPreRender = preRenderedText.fromString(promptStr, new vec2(screenBounds.center.x, screenBounds.bottom - 30), textStyle.getDefault());
		
		// on the tooltip's activation, getFocusArea will be called, and if a collisionBox is returned,
		// it will be stored in this.focusArea and highlighted to direct the users attention to the area
		this.getFocusArea = function(){ return null; }
		this.focusArea = null;
		
		// the tooltip will only activate if the current gameplayPhase is an instance of this.activePhase
		this.activePhase = gameplayPhase;
		
		// the tooltip will only activate when the condition returns true
		this.condition = function(){ return true; };
		
		// these tooltips will be unlocked when this tooltip is activated
		this.childTips = [];
	}
	
	static get tip_removeTooltips(){
		var r = new tooltip();
		r.setTitle("Welcome to Tubetris!", new textAnim_yOffset(750, 10, 0.15), new textStyle(fonts.large, textColor.light, 2).setAlignment(0.5, 0));
		r.text_pc = "These (tooltips) will help guide you through how to play the game 2| " +
			"if you already know how to play you can go into the (options menu) by pressing [escape] and turn them off";
		r.text_mobile = "These (tooltips) will help guide you through how to play the game 2| " +
			"if you already know how to play you can go into the (options menu) and turn them off";
		
		r.childTips = [
			tooltip.tip_HUD,
			tooltip.tip_tileformMovement,
			tooltip.tip_completeRow
		];
		
		return r;
	}
	static get tip_HUD(){
		var r = new tooltip();
		r.setTitle("Heads Up Display");
		r.text_pc = "this is your (HUD) 1.5| or (Heads Up Display) 2| " +
			"it displays a large amount of (useful information) that you will probably need to reference on a regular basis";

		r.getFocusArea = function(){
			let cpos = new vec2(tile.toScreenPos(new vec2(10, 0), false).x, 0);
			return new collisionBox(
				cpos,
				new vec2(screenBounds.right - cpos.x, screenBounds.height)
			);
		};

		r.childTips = [
			tooltip.tip_HUD_nextPiece,
			tooltip.tip_HUD_tilBall,
			tooltip.tip_HUD_tilBomb,
			tooltip.tip_HUD_level,
		];

		return r;
	}
	static get tip_HUD_nextPiece(){
		var r = new tooltip();
		return r;
	}
	static get tip_HUD_tilBall(){
		var r = new tooltip();
		return r;
	}
	static get tip_HUD_tilBomb(){
		var r = new tooltip();
		return r;
	}
	static get tip_HUD_level(){
		var r = new tooltip();
		return r;
	}
	static get tip_tileformMovement(){
		var r = new tooltip();
		r.setTitle("Tileform Movement");
		r.text_pc = "This is a (tileform) 1.5| use [" + controlState.getControlKeyName(controlAction.left) + 
		"] and [" + controlState.getControlKeyName(controlAction.right) + 
		"] to move it around";
		r.text_mobile = "This is a (tileform) 1.5| [swipe left or right] to move it around";
		
		// gets a rectangle surrounding the current tileform
		r.getFocusArea = function(){
			var r = gameState.current.phase.currentTileform.getVisualBounds();
			r.pos = r.pos.minus(tile.offset);

			return r;
		}
		
		r.activePhase = phase_placeTileform;
		r.condition = function(){
			return gameState.current.phase.currentTileform.gridPos.y > 1;
		};
		
		r.childTips = [
			tooltip.tip_tileformRotation,
			tooltip.tip_tileformDropping,
			tooltip.tip_bombs,
			tooltip.tip_balls
		];
		
		return r;
	}
	static get tip_tileformRotation(){
		var r = new tooltip();
		r.setTitle("Tileform Rotation");
		r.text_pc = "You can also rotate the tileform clockise with [" + controlState.getControlKeyName(controlAction.rotateCW) + "]";
		r.text_mobile = "You can also rotate it by [swiping upward]";
		
		// gets a rectangle surrounding the current tileform
		r.getFocusArea = function(){
			var r = gameState.current.phase.currentTileform.getVisualBounds();
			r.pos = r.pos.minus(tile.offset);

			return r;
		}
		
		r.activePhase = phase_placeTileform;
		r.condition = function(){
			return gameState.current.phase.currentTileform.tiles.length > 1;
		};
		
		r.childTips = [
		];
		
		return r;
	}
	static get tip_tileformDropping(){
		var r = new tooltip();
		r.setTitle("Tileform Dropping");
		r.text_pc = "If you are impatient and want the tileform to drop faster you can use [" + 
			controlState.getControlKeyName(controlAction.nudgeDown) + "] to bump it downward or [" +
			controlState.getControlKeyName(controlAction.quickDrop) + "] to quick-drop it";
		r.text_mobile = "If you are impatient and want the tileform to drop faster try [swiping downward]";
		
		// gets a rectangle surrounding the current tileform
		r.getFocusArea = function(){
			var r = gameState.current.phase.currentTileform.getVisualBounds();
			r.pos = r.pos.minus(tile.offset);

			return r;
		}
		
		r.activePhase = phase_placeTileform;
		r.condition = function(){
			return gameState.current.phase.currentTileform.gridPos.y > 5;
		};
		
		r.childTips = [
		];
		
		return r;
	}	
	static get tip_bombs(){
		var r = new tooltip();
		r.setTitle("Bombs");
		r.text_pc = "This (special tileform) is a (bomb) 1.5| " + 
			"(bombs) will detonate when placed next to each other or when a ball rolls into them 1.5| " + 
			"when the (bomb) detonates | all of the tiles surrounding it will be destroyed";
		
		// gets a rectangle surrounding the current tileform
		r.getFocusArea = function(){
			var r = gameState.current.phase.currentTileform.getVisualBounds();
			r.pos = r.pos.minus(tile.offset);

			return r;
		}
		
		r.activePhase = phase_placeTileform;
		r.condition = function(){
			return gameState.current.phase.currentTileform.hasEntity(blocks.block_bomb, entities.block);
		};
		
		r.childTips = [
		];
		
		return r;
	}
	static get tip_balls(){
		var r = new tooltip();
		r.setTitle("Balls!");
		r.text_pc = "This (special tileform) is a (ball) 1.5| " + 
			"(balls) are used to clear pipes by rolling through them 1.5| " + 
			"place the (ball) on or near an (open tube) and see what happens";
		
		// gets a rectangle surrounding the current tileform
		r.getFocusArea = function(){
			var r = gameState.current.phase.currentTileform.getVisualBounds();
			r.pos = r.pos.minus(tile.offset);

			return r;
		}
		
		r.activePhase = phase_placeTileform;
		r.condition = function(){
			return gameState.current.phase.currentTileform.hasEntityType(entities.ball);
		};
		
		r.childTips = [
			tooltip.tip_ballColors,
			tooltip.tip_ballPause
		];
		
		return r;
	}
	static get tip_ballColors(){
		var r = new tooltip();
		r.setTitle("Colors");
		r.text_pc = "There are also different (colors) of tubes: 1.5| " +
			"(Gold - Blue - Green - Red - Grey) 2|" +
			"Notice the (ball) also has a color 1.5| " + 
			"if the (ball color) matches the (tube color) when it rolls through you are rewarded with more points 1.5|" + 
			"you can (change the ball color) with the rotation key [" + controlState.getControlKeyName(controlAction.rotateCW) + "]";

		r.childTips = [
			tooltip.tip_greyTubes
		];

		return r;
	}
	static get tip_ballPause(){
		var r = new tooltip();
		r.setTitle("Ball Intersection");
		r.text_pc = "When the ball comes to an (intersection) it will stop and let you decide which way to go 1.5| the (arrow indicators) let you know all the directions that the ball can be directed in 1.5| " +
			"use [" + controlState.getControlKeyName(controlAction.left) + "] or [" + controlState.getControlKeyName(controlAction.right) + "] or [" + controlState.getControlKeyName(controlAction.up) + "] or [" + controlState.getControlKeyName(controlAction.down) + "] to choose a direction";
		
		// gets a rectangle surrounding the current ball
		r.getFocusArea = function(){
			var r = tile.toScreenPos(gameState.current.phase.balls[0].gridPos, false);
			r = new collisionBox(r.clone(), new vec2(tile.tilesize));

			return r;
		}
		
		r.activePhase = phase_ballPhysics;
		r.condition = function(){
			return gameState.current.phase.balls[0].state == ballStates.paused;
		};
		
		r.childTips = [
		];
		
		return r;
	}
	static get tip_completeRow(){
		var r = new tooltip();
		r.setTitle("Row Completion");
		r.text_pc = "If you fill all the tiles (in a row) then those tiles will become (charged) and coins will spawn";
		
		// highlights the bottom row
		r.getFocusArea = function(){
			var r = new collisionBox(
				tile.toScreenPos(new vec2(0, tile.gridBounds.height - 1), false), 
				new vec2(tile.gridBounds.width, 1).multiply(tile.tilesize) );
			
			return r;
		}
		
		// sets a conditional that returns true when any tile in the bottom row is filled
		r.activePhase = phase_placeTileform;
		r.condition = function(){
			for(let x = 0; x < tile.gridBounds.width; x++){
				let tgpos = new vec2(x, tile.gridBounds.height - 1);
				if(!tile.at(tgpos).isEmpty())
					return true;
			}
			return false;
		};
		
		r.childTips = [
		];
		
		return r;
	}
	static get tip_greyTubes(){
		var r = new tooltip();
		r.setTitle("Grey Tubes");
		r.text_pc = "This (tileform) contains (grey) tubes which are a special case 1.5| " + 
			"(grey) tubes can only be destroyed by a (grey ball) so make sure to (cycle the ball color to grey) before dropping it through these tubes!";

		// gets a rectangle surrounding the current tileform
		r.getFocusArea = function(){
			var r = gameState.current.phase.currentTileform.getVisualBounds();
			r.pos = r.pos.minus(tile.offset);

			return r;
		}

		r.activePhase = phase_placeTileform;
		r.condition = function(){
			return gameState.current.phase.currentTileform.tiles[0].tileVariant == tubeColors.grey;
		}

		return r;
	}

	setTitle(txt, anim = new textAnim_scaleTransform(750, 1, 1.1, 0).setAnimType(textAnimType.trigonometricCycle), style = new textStyle(fonts.large, textColor.light, 1).setAlignment(0.5, 0)){
		// sets the animated title of the tooltip to be drawn at the top of the screen
		var tblock = new textBlock(txt, style, screenBounds.inflated(0.9), [], style.scale * style.font.charSize.y);
		this.titlePreRender = preRenderedText.fromBlock(tblock);
		this.titleAnim = anim;
		
		// pushes the text bounds to be below the title
		var offY = this.titlePreRender.getBounds().height + 25;
		this.textBounds.pos.y += offY;
		this.textBounds.size.y -= offY;
	}
	
	generateBackground(){
		// generates the translucent background with the transparent hole in the focusArea
		this.background = document.createElement("canvas");
		this.background.width = screenBounds.width;
		this.background.height = screenBounds.height;
		var bgctx = this.background.getContext("2d");
		
		bgctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		bgctx.fillRect(0, 0, this.background.width, this.background.height);
		
		// make the transparent hole for the focus area if applicable
		this.focusArea = this.getFocusArea();
		if(!this.focusArea) return;
		bgctx.globalCompositeOperation = "destination-out";
		bgctx.fillStyle = "rgba(255, 255, 255, 1)";
		bgctx.fillRect(this.focusArea.left, this.focusArea.top, this.focusArea.width, this.focusArea.height);
		bgctx.globalCompositeOperation = "source-over";
	}
	generatePreRender(){
		// generates the text preRender and stores it in this.preRender
		var txt = this.text_pc;
		
		this.textBlock = new textBlock(
			txt,
			textStyle.getDefault().setColor(textColor.green).setAlignment(0.5, 0),
			this.textBounds, 
			[
				textStyle.getDefault().setColor(textColor.yellow),
				textStyle.getDefault().setColor(textColor.light),
				textStyle.getDefault().setColor(textColor.red),
				textStyle.getDefault().setColor(textColor.dark)
			],
			32
		);
		this.preRender = preRenderedText.fromBlock(this.textBlock);
		
		// return if there is no focus area
		if(!this.focusArea) return;
		
		// otherwise, make sure the title text doesn't block the focus area
		var titleBounds = this.titlePreRender.getBounds();
		titleBounds = new collisionBox(
			new vec2(this.textBounds.left, titleBounds.top),
			new vec2(this.textBounds.width, titleBounds.height)
		);
		// if title overlaps the focus area, move it below so that the focus area is unobstructed
		var tcent = this.titlePreRender.findCenter();
		if(this.focusArea.overlapsBox(titleBounds)){
			var offY = this.focusArea.bottom - titleBounds.top + 25;
			this.titlePreRender.setCenter(this.titlePreRender.findCenter().plus(new vec2(0, offY)));
			this.preRender.setCenter(this.preRender.findCenter().plus(new vec2(0, offY)));
		}

		// if the title goes too low, move it back to the original position
		testBounds = this.titlePreRender.getBounds();
		testBounds = new collisionBox(
			new vec2(this.textBounds.left, testBounds.top), 
			new vec2(this.textBounds.width, testBounds.height)
		);
		if(testBounds.bottom >= screenBounds.bottom - 100){
			let dif = this.titlePreRender.findCenter().y - tcent.y;
			let pcent = this.preRender.findCenter();
			this.titlePreRender.setCenter(tcent);
			this.preRender.setCenter(new vec2(pcent.x, pcent.y - dif));
		}

		var testBounds = this.preRender.getBounds();
		testBounds = new collisionBox(
			new vec2(this.textBounds.left, testBounds.top), 
			new vec2(this.textBounds.width, testBounds.height)
		);
		
		// if the text overlaps the focus area, move it below so that the focus area is unobstructed
		var pcent = this.preRender.findCenter();
		if(this.focusArea.overlapsBox(testBounds)){
			var offY = this.focusArea.bottom - testBounds.top + 25;
			this.preRender.setCenter(this.preRender.findCenter().plus(new vec2(0, offY)));
		}
		
		// if the text goes too low, move it back to the original position
		testBounds = this.preRender.getBounds();
		testBounds = new collisionBox(
			new vec2(this.textBounds.left, testBounds.top), 
			new vec2(this.textBounds.width, testBounds.height)
		);
		if(testBounds.bottom >= screenBounds.bottom - 60)
			this.preRender.setCenter(pcent);
	}
	
	conditionIsMet(){
		// a safe way to check if the condition has been met, if an error is thrown, it is caught and returns false
		if(!config.tooltipsEnabled)
			return;
		
		try{
			return this.condition();
		} catch(e){
			log("tooltip condition threw exception: " + e, logType.error);
		}
		return false;
	}
	activate(parentState){
		// activates the tooltip
		this.generateBackground();
		if(!this.preRender) this.generatePreRender();
		
		// remove this tooltip from the current tooltip progression query
		var ti = tooltipProgression.current.tooltips.indexOf(this);
		if(ti >= 0){
			tooltipProgression.current.tooltips.splice(ti, 1);
			tooltipProgression.current.revealedTooltips.push(this);
		}
		
		// add the child tips to the tooltipProgression's tooltip query
		for(let ttip of this.childTips)
			tooltipProgression.current.tooltips.push(ttip);
		
		// switch the gameState's gameplayPhase to a tooltip phase
		parentState.switchGameplayPhase(phase_tooltip.fromTooltip(this));
	}
	
	drawBackground(){
		drawImage(renderContext, this.background, new vec2());
		
		// if there is a focus area draw a flashing box around it
		if(this.focusArea){
			var col = gameState.current.timeElapsed % 500 >= 250 ? 
				"rgba(255,255,255, 1)" : 
				"rgba(255,255,255, 0.5)";
			this.focusArea.drawOutline(renderContext, col, 2);
		}
	}
	drawText(){
		this.preRender.draw();
		
		// draw the title
		var tpr = this.titlePreRender;
		if(this.titleAnim) tpr = tpr.animated(this.titleAnim);
		tpr.draw();
		
		this.drawPrompt();
	}
	drawPrompt(){
		// draw the "press enter to continue" prompt
		if(timeElapsed % 1000 >= 500)
			this.promptPreRender.draw();
	}
	draw(){
		this.drawBackground();
		
		// draws the text over the background
		this.drawText();
	}
}

// a data structure that progresses from the first throughout the rest of the tooltips
class tooltipProgression{
	constructor(){
		this.tooltips = [];
		this.revealedTooltips = [];
	}
	
	static get current(){
		return gameState.current.tooltipProgress;
	}
	static getDefault(){
		// the default tooltips starting from the beginning of the game
		var r = new tooltipProgression();
		
		r.tooltips = [
			tooltip.tip_removeTooltips
		];
		
		return r;
	}
	
	checkTooltips(parentState){
		// return if there is already a tooltip being displayed
		if(gameState.current.phase instanceof phase_tooltip)
			return;
		
		for(var ttip of this.tooltips){
			if(gameState.current.phase instanceof ttip.activePhase){
				if(ttip.conditionIsMet()){
					ttip.activate(parentState);
					return;
				}
			}
		}
	}
}