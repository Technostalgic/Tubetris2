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
		this.background = null;
		
		var promptStr = "Press ENTER to continue";
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
		r.text_pc = "[Hello there!] 1.5| These (tooltips) will help guide you through how to play the game 2| " +
			"if you already know how to play you can go into the (options menu) by pressing [escape] and turn them off";
		r.text_mobile = "[Hello there!] 1.5| These (tooltips) will help guide you through how to play the game 2| " +
			"if you already know how to play you can go into the (options menu) and turn them off";
		
		r.childTips = [
			tooltip.tip_tileformMovement
		];
		
		return r;
	}
	static get tip_tileformMovement(){
		var r = new tooltip();
		r.text_pc = "This is a (tileform) 1.5| use the [left and right arrow keys] to move it around";
		r.text_mobile = "This is a (tileform) 1.5| [swipe left or right] to move it around";
		
		// gets a rectangle surrounding the current tileform
		r.getFocusArea = function(){
			let ttf = gameState.current.phase.currentTileform;
			let tpos = tile.toScreenPos(ttf.getMinGridPos(), false);
			let tsize = ttf.getMaxGridPos().multiply(tile.tilesize);
			
			return new collisionBox(tpos, tsize);
		}
		
		r.activePhase = phase_placeTileform;
		r.condition = function(){
			return gameState.current.phase.currentTileform.gridPos.y > 1;
		};
		
		r.childTips = [
		];
		
		return r;
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
		log(this.focusArea);
		bgctx.globalCompositeOperation = "destination-out";
		bgctx.fillStyle = "rgba(255, 255, 255, 1)";
		bgctx.fillRect(this.focusArea.left, this.focusArea.top, this.focusArea.width, this.focusArea.height);
		bgctx.globalCompositeOperation = "source-over";
	}
	generatePreRender(){
		// generates the text preRender and stores it in this.preRender
		this.textBlock = new textBlock(
			this.text_pc,
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
	}
	
	conditionIsMet(){
		// a safe way to check if the condition has been met, if an error is thrown, it is caught and returns false
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
	}
	drawPrompt(){
		this.promptPreRender.animated(
			new textAnim_blink(1000, 0)
		).draw();
	}
	draw(){
		this.drawBackground();
		this.preRender.draw();
		this.drawPrompt();
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
		for(var ttip of this.tooltips){
			if(gameState.current.phase instanceof ttip.activePhase)
				if(ttip.conditionIsMet())
					ttip.activate(parentState);
		}
	}
}