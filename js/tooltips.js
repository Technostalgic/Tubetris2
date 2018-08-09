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
			"if you already know how to play you can go into the (options menu) by [swiping down from the top of the screen] and turn them off";
		
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
			tooltip.tip_HUD_score
		];

		return r;
	}
	static get tip_HUD_nextPiece(){
		var r = new tooltip();
		r.setTitle("Upcoming Tileform");
		r.text_pc = "This will be the (next tileform) that appears after the (current tileform) is placed 1.5| " +
			"Use [" + controlState.getControlKeyName(controlAction.swap) + "] to swap your (current tileform) with the (next tileform)";
		r.text_mobile = "This will be the (next tileform) that appears after the (current tileform) is placed 1.5| " +
			"[Tap on it] to swap it with your (current tileform)";

		r.getFocusArea = function(){
			return new collisionBox(
				tile.nextTileformSlot.minus(new vec2(2, 1).multiply(tile.tilesize)),
				new vec2(4, 2).multiply(tile.tilesize)
			);
		}

		return r;
	}
	static get tip_HUD_tilBall(){
		var r = new tooltip();
		r.setTitle("Ball Countdown");
		r.text_pc = "This number shows you how many tileforms come between the (current tileform) and your next (ball) 1.5| " +
			"(Balls) are special tileforms that will be explained when they come up";

		r.getFocusArea = function(){
			return new collisionBox(
				tile.toScreenPos(new vec2(12, 7), false).minus(new vec2(1, 0.5).multiply(tile.tilesize)),
				new vec2(3, 1.5).multiply(tile.tilesize)
			);
		};

		return r;
	}
	static get tip_HUD_tilBomb(){
		var r = new tooltip();
		r.setTitle("Bomb Countdown");
		r.text_pc = "This number shows you how many tileforms come between the (current tileform) and your next (bomb) 1.5| " +
			"(Bombs) are special tileforms that will be explained when they come up";

		r.getFocusArea = function(){
			return new collisionBox(
				tile.toScreenPos(new vec2(12, 9), false).minus(new vec2(1, 0.5).multiply(tile.tilesize)),
				new vec2(3, 1.5).multiply(tile.tilesize)
			);
		};

		return r;
	}
	static get tip_HUD_level(){
		var r = new tooltip();
		r.setTitle("Current Level");
		r.text_pc = "This displays the (game level) that you are currenly on 1.5| " + 
			"The level is complete when the (number below) counts down to zero and that last tileform is placed 1.5| " +
			"After each level you will recieve a (point reward) and progress to the (next level) 1.5| " +
			"As the levels progress (new tiles) and (tubes) will be introduced and the (difficulty will increase)";

		r.getFocusArea = function(){
			return new collisionBox(
				tile.toScreenPos(new vec2(12, 16), false).minus(new vec2(2, 0).multiply(tile.tilesize)),
				new vec2(5, 1.5).multiply(tile.tilesize)
			);
		};

		return r;
	}
	static get tip_HUD_score(){
		var r = new tooltip();
		r.setTitle("Scoring");
		r.text_pc = "This shows how many (points) you currently have and compares it to the (top score) on the (local scoreboard) 2| " +
			"If you rank within the (top 5) highest local scores you will be asked to enter your name into the (scoreboard) when your game comes to an end";

		r.getFocusArea = function(){
			return new collisionBox(
				tile.toScreenPos(new vec2(12, 18), false).minus(new vec2(2, 0.5).multiply(tile.tilesize)),
				new vec2(5, 2.5).multiply(tile.tilesize)
			);
		};

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
			return gameState.current.phase.currentTileform.gridPos.y >= 1;
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
		r.text_pc = "You can also rotate the tileform clockwise with [" + controlState.getControlKeyName(controlAction.rotateCW) + "]";
		r.text_mobile = "You can also rotate the tileform by [swiping upward] and making a [circular gesture] with your finger";
		
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
			"when the (bomb) detonates | all of the tiles surrounding it will be destroyed 1.5| " + 
			"if enough bombs are detonated with a (single ball) there will be a bonus";
		
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
			tooltip.tip_bombBonuses
		];
		
		return r;
	}
	static get tip_bombBonuses(){
		var r = new tooltip();
		
		r.setTitle("Bomb bonus");
		r.text_pc = "if you detonate (4 or more bombs) in a single turn then all of the (bricks) on the screen will (turn into bombs)";
		
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
			tooltip.tip_balls2
		];
		
		return r;
	}
	static get tip_balls2(){
		var r = new tooltip();
		
		r.setTitle("Balls: Continued");
		r.text_pc = "the ball (must match colors) with the tube to destroy it unless either the ball or tube is (gold colored) 1.5| " +
			"(rotate) the ball with [" + controlState.getControlKeyName(controlAction.rotateCW) + "] to cycle through different ball colors";
		r.text_mobile = "the ball (must match colors) with the tube to destroy it unless either the ball or tube is (gold colored) 1.5| " +
			"(rotate) the ball to cycle through different ball colors";
		
		r.childTips = [
			tooltip.tip_ballPause,
			tooltip.tip_coins,
			tooltip.tip_fallingTiles
		];
		
		return r;
	}
	static get tip_coins(){
		var r = new tooltip();
		
		r.setTitle("Coins");
		r.text_pc = "this is a (coin)! 2| " + 
			"coins earn you (extra points) 1.5| " +
			"you are also rewarded with certain (bonuses) when you collect enough coins with a (single ball)";
		
		r.getFocusArea = function(){
			if(gameState.current.phase.balls.length <= 0)
				return null;
			
			var r = new collisionBox(
				tile.toScreenPos(gameState.current.phase.balls[0].nextPos, false).plus(new vec2(tile.tilesize / 4)),
				new vec2(tile.tilesize / 2)
			);
			
			return r;
		}
		
		r.activePhase = phase_ballPhysics;
		r.condition = function(){
			if(tile.at(gameState.current.phase.balls[0].nextPos).item != null)
				return true;
			return false;
		};
		
		r.childTips = [
			tooltip.tip_coinBonuses
		];
		
		return r;
	}
	static get tip_coinBonuses(){
		var r = new tooltip();
		
		r.setTitle("Coin Bonuses");
		r.text_pc = "collect enough coins to get the (bonuses) listed below: 1.5| " +
			"(5x coins): extra ball 1| " +
			"(10x coins): extra gold ball 1| " +
			"(15x coins): det-pack";
		
		return r;
	}
	static get tip_ballPause(){
		var r = new tooltip();
		r.setTitle("Ball Intersection");
		r.text_pc = "When the ball comes to an (intersection) it will stop and let you decide which way to go 1.5| the (arrow indicators) let you know all the directions that the ball can be directed in 1.5| " +
			"use [" + controlState.getControlKeyName(controlAction.left) + "] or [" + controlState.getControlKeyName(controlAction.right) + "] or [" + controlState.getControlKeyName(controlAction.up) + "] or [" + controlState.getControlKeyName(controlAction.down) + "] to choose a direction";
		r.text_mobile = "When the ball comes to an (intersection) it will stop and let you decide which way to go 1.5| the (arrow indicators) let you know all the directions that the ball can be directed in 1.5| " +
			"direct the ball by [swiping in the direction] that you choose for it to go";
		
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
		r.text_pc = "If you fill all the tiles (in a row) then those tiles will become (charged) and coins will spawn 1.5| " + 
			"the tubes will also turn into (gold tubes) when the row is completed 2| " + 
			"(Row completion is ESSENTIAL for success!)";
		
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
			tooltip.tip_chargedTiles
		];
		
		return r;
	}
	static get tip_chargedTiles(){
		var r = new tooltip();
		r.setTitle("Charged Tiles");
		r.text_pc = "tiles that are (charged) will have a (yellow tinted background) 1.5| " + 
			"when destroyed they will cause a (chain reaction) that causes all the " +
			"other tiles and tubes that are connected to it to also be destroyed 1.5| " +
			"this can be very beneficial if you have a lot of interconnected pipe systems laid " +
			"out and they are inside of charged rows";
		
		return r;
	}
	static get tip_fallingTiles(){
		var r = new tooltip();
		
		r.setTitle("Falling Tiles");
		r.text_pc = "The (destruction) of tiles will also cause certain tiles to (fall down) to the ground 1.5| " + 
			"tiles will fall if either one of (2 conditions) are met 2| " +
			"they will fall if any tile (beneath them) in the (same column) has been destroyed 1.5| " +
			"or they will fall if they have (no direct neighbors)";
		
		r.activePhase = phase_fellTiles;
		r.condition = function(){
			if(gameState.current.phase.fallingTiles.length > 0)
				return true;
		};
		
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
		if(this.text_mobile) 
			txt = responsiveText(this.text_pc, this.text_mobile);

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
	
	getPUID(){
		// returns the (probably) unique identification number
		var r = 0;
		for(let i = this.text_pc.length - 1; i >= 0; i--)
			r += this.text_pc.charCodeAt(i);
		
		return r;
	}
	
	conditionIsMet(){
		// a safe way to check if the tooltip's condition has been met, if an error is thrown, it is caught and returns false
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
		
		// skips the tooltip if it's already been seen
		if(seenTips.includes(this.getPUID()))
			parentState.phase.nextPhase();
		else seenTips.push(this.getPUID());
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
		// return if tooltips are disabled in the options menu
		if(!config.tooltipsEnabled)
			return;
		
		// return if there is already a tooltip being displayed
		if(gameState.current.phase instanceof phase_tooltip)
			return;
		
		// check the conditions of the active tooltips, and activate them if necessary
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