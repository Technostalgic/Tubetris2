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
		
		this.textBounds = screenBounds.clone();
		this.textBlock = null;
		this.preRender = null;
		
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
	
	static tip_tileformMovement(){
		var r = new tooltip();
		r.text_pc = "This is a (tileform) - use the [left and right arrow keys] to move it around";
		r.text_mobile = "This is a (tileform) - [swipe left or right] to move it around";
		
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
		
		return r;
	}
	
	generatePreRender(){
		
	}
	
	activate(parentState){
		this.focusArea = this.getFocusArea();
		if(!this.preRender) this.generatePreRender();
	}
	
	draw(){
		this.preRender.draw();
	}
}

class tooltipProgression{
	constructor(){
		this.tooltips = [];
		this.revealedTooltips = [];
	}
	
	update(parentState){
		for(var ttip of this.tooltips){
			if(gameState.current.phase instanceof ttip.activePhase)
				if(ttip.condition())
					ttip.activate(parentState);
		}
	}
}