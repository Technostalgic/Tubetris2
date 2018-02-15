///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerates the different colors in a font's color spritesheet
var textColor = {
	light: 0,
	dark: 1,
	green: 2,
	cyan: 3,
	blue: 4,
	pink: 5,
	red: 6,
	yellow: 7
};
// enumerates the different ways an animation can be played
var textAnimType = {
	unlimited: -1,
	once: 0,
	continuous: 1,
	looping: 2,
	pingPong: 3
}

// a text renderer object, used for storing information about sprite fonts
class textRenderer{
	constructor(spritesheet, charsize, colorVariants = 8){
		// initializes a textRenderer object, used for rendering text with a given text spritesheet
		this.spritesheet = spritesheet;
		this.charSize = charsize;
		this.colors = colorVariants;
		this.specCharWidths = [];
		this.useSpecificCharWidth = false;
		
		this.defaultStyle = new textStyle(this, textColor.light);
	}
	
	setDefaultColor(col = textColor.light){
		// sets the default textColor that the text will be rendered as
		this.defaults.color = col;
	}
	setDefaultScale(scale = 1){
		// sets the default scale that the text will be rendered at
		this.defaults.scale = scale;
	}
	setSpecificCharacterWidths(cwidths){
		// sets an individual width for each character in the spritesheet to provide more accurate spacing
		for(var i in cwidths){
			var j = i.toLowerCase().charCodeAt(0);
			this.specCharWidths[j] = cwidths[i];
		}
		this.useSpecificCharWidth = true;
	}
	
	getCharSprite(character = ' '){
		// returns the spritebox that represents the character's position and size within the spritesheet
		character = character.toLowerCase();
		
		var cwidth = this.charSize.x;
		if(this.useSpecificCharWidth)
			if(this.specCharWidths[character.charCodeAt(0)] != undefined)
				cwidth = this.specCharWidths[character.charCodeAt(0)];
		
		var cz = this.charSize;
		var ii;
		
		ii = "0123456789".indexOf(character);
		if(ii >= 0) return cz.getSprite(ii, 0, cwidth);
		
		switch(character){
			case ' ': return new spriteBox(new vec2(), new vec2(cwidth, 0));
			case '!': return cz.getSprite(10, 0, cwidth);
			case ':': return cz.getSprite(11, 0, cwidth);
			case '-': return cz.getSprite(12, 0, cwidth);
		}
		
		ii = "abcdefghijklm".indexOf(character);
		if(ii >= 0) return cz.getSprite(ii, 1, cwidth);
		
		ii = "nopqrstuvwxyz".indexOf(character);
		if(ii >= 0) return cz.getSprite(ii, 2, cwidth);
		
		return new spriteBox(new vec2(), new vec2(cwidth, 0));
	}
	getStringSprites(str = "", color = null){
		// returns a list of character sprites that represent the characters' position and size inside the spritesheet
		var sprites = [];
		
		var col = color || this.defaultStyle.color;
		var colOffset =
			(col >= this.colors ? 0 : col) * 
			(this.charSize.y * 3);
			
		for(var i = 0; i < str.length; i++){
			var s = this.getCharSprite(str[i]);
			s.pos.y += colOffset;
			sprites.push(s);
		}
		return sprites;
	}
	getStringWidth(str, style = this.defaultStyle){
		// returns the width in pixels that the string will be when it's drawn
		var sprites = this.getStringSprites(str);
		var w = 0;
		for(var i = sprites.length - 1; i >= 0; i--)
			w += sprites[i].width * style.scale;
		return w * this.defaultStyle.scale;
	}
	
	drawString(str = "-- hello: world! --", pos = new vec2(), style = this.defaultStyle){
		// renders the string to the specified context with the graphics inside this textRenderer's spritesheet
		var sprites = this.getStringSprites(str, style.color);
		var scl = style.scale;
		
		var swidth = 0;
		for(var i = sprites.length - 1; i >= 0; i--)
			swidth += sprites[i].width;
		var alignOffset = style.hAlign * (swidth * scl);
		
		var xoff = 0;
		for(var i = 0; i < sprites.length; i++){
			var box = sprites[i];
			if(box.height > 0){
				var tpos = pos.plus(new vec2(xoff - alignOffset, 0));
				drawImage(renderContext, this.spritesheet, tpos, box, scl);
			}
			xoff += box.width * scl;
		}
	}
	
	static drawText(text, pos, style, animation = null){
		if(animation) animation.drawText(text, pos, style);
		else preRenderedText.fromString(text, pos, style).draw();
	}
}

// holds information about how to style text when trying to render it
class textStyle{
	constructor(font, color = textColor.light, scale = 1, horizontalAlign = 0.5){
		this.font = font;
		this.color = color;
		this.scale = scale;
		this.hAlign = horizontalAlign;
		this.vAlign = 0.5;
	}
	static fromAlignment(horizontal = 0.5, vertical = 0.5){
		var r = textStyle.getDefault();
		
		r.hAlign = horizontal;
		r.vAlign = vertical;
		
		return r;
	}
	static getDefault(){
		var r = new textStyle(fonts.large, textColor.light, 1, 0.5);
		
		r.vAlign = 0.5;
		
		return r;
	}

	setAlignment(horizontal = 0.5, vertical = 1){
		this.hAlign = horizontal;
		this.vAlign = vertical;
		return this;
	}
}

// an animation that can be applied to text
class textAnim{
	constructor(){
		this.animType = textAnimType.looping; // how the animation will handle repition
		this.animLength = 500; // the total length in milliseconds of the animation
		this.animDelay = 0; // the delay in milliseconds before the animation starts
		this.animCharOffset = 0.1; // the animation percent offset between each character
		this.animOffset = gameState.current.timeElapsed; // the offset of the animation from the global gameState's total timeElapsed
	}
	
	resetAnim(delay = null){
		// restarts the animation
		this.animOffset = gameState.current.timeElapsed;
		if(delay != null) this.animDelay = delay;
	}
	getAnimProgress(index = 0){
		// returns a percent indicating the amount that the animation has progressed
		var correctedAnimTime = gameState.current.timeElapsed - this.animOffset - this.animDelay;
		var aProg = correctedAnimTime / this.animLength - index * this.animCharOffset;
		
		switch(this.animType){
			case textAnimType.once:
				return Math.max(0, Math.min(aProg, 1));
			case textAnimType.continuous:
				return aProg >= 0 ? aProg % 2 - 1 : 2 - Math.abs(aProg % 2) - 1;
			case textAnimType.looping:
				return aProg >= 0 ? aProg % 1 : 1 - Math.abs(aProg % 1);
			case textAnimType.pingPong:
				return 1 - Math.abs(aProg % 2 - 1);
		}
		return aProg;
	}
	
	// for override
	applyAnim(prerender){ }
	
	drawText(text, pos, style){
		var pr = preRenderedText.fromString(text, pos, style);
		this.applyAnim(pr);
		pr.draw();
	}
}
// an animation that combines the effects of many different text animations
class textAnim_compound extends textAnim{
	constructor(textAnimations = []){
		super();
		this.anims = textAnimations; // array of different text animations that are combined to make a compound animation
	}
	
	// adds an animation to the anims array
	addAnimation(anim){
		this.anims.push(anim);
	}
	// applies all the animations to a preRenderedText object
	applyAnim(pr){
		for(var i = 0; i < this.anims.length; i++)
			this.anims[i].applyAnim(pr);
	}
}

// an animation that makes the text wave up and down like a sin wave
class textAnim_sinWave extends textAnim{
	constructor(animLength = 500, waveMag = 1, charOff = 0.1){
		super();
		this.animType = textAnimType.continuous;
		this.animLength = animLength;
		this.animCharOffset = charOff;
		this.waveMag = waveMag;
		this.waveLength = Math.PI;
	}
	
	applyAnim(pr){
		for(var i = 0; i < pr.spriteContainers.length; i++){
			var cy = this.getAnimProgress(i) * this.waveLength;
			cy = Math.sin(cy) * this.waveMag;
			
			pr.spriteContainers[i].bounds.pos.y += cy;
		}
	}
}
// an animation that changes the color of the text by incrementing its hue
class textAnim_rainbow extends textAnim{
	constructor(animLength = 500, charOff = 0.1, charHeight = fonts.large.charSize.y){
		super();
		this.animType = textAnimType.looping;
		this.animCharOffset = charOff;
		this.animLength = animLength;
		this.charHeight = charHeight;
	}
	
	applyAnim(pr){
		for(var i = 0; i < pr.spriteContainers.length; i++){
			var col = Math.floor(2 + this.getAnimProgress(i) * 6);
			var colOff = col * this.charHeight * 3;
			var sy = pr.spriteContainers[i].sprite.pos.y % (this.charHeight * 3);
			sy += colOff;
			
			pr.spriteContainers[i].sprite.pos.y = sy;
		}
	}
}
// an animation that changes the text's size
class textAnim_scale extends textAnim{
	constructor(animLength = 500, minScale = 0.5, maxScale = 1, charOff = 0){
		super();
		
		this.animType = textAnimType.pingPong;
		this.animLength = animLength;
		this.animCharOffset = charOff;
		this.minScale = minScale;
		this.maxScale = maxScale;
	}
	
	applyAnim(pr){
		for(var i = 0; i < pr.spriteContainers.length; i++){
			var cRange = this.maxScale - this.minScale;
			var cs = this.minScale + this.getAnimProgress(i) * cRange;
			var oc = pr.spriteContainers[i].bounds.center.clone();
			
			pr.spriteContainers[i].bounds.size = pr.spriteContainers[i].bounds.size.multiply(cs);
			pr.spriteContainers[i].bounds.setCenter(oc);
		}
	}
}

// allows a large amount of text with different styles to be drawn inline in the same 
// paragraph with word wrapping and vertical/horizontal alignment rules
class textBlock{
	constructor(text, style, bounds, altStyles = [], lineHeight = 32){
		this.style = style;
		this.altStyles = altStyles;
		this.bounds = bounds;
		this.lineHeight = lineHeight;
		this.setText(text);
		this.preRender = null;
	}
	
	setStylesHAlign(hAlign = 0){
		this.style.hAlign = hAlign;
		for(var i in this.altStyles)
			this.altStyles[i].hAlign = hAlign;
	}
	setText(text){
		this.text = text;
		this.textSpans = [];
		this.formTextSpans();
	}
	formTextSpans(){
		var r = [];
		
		var ssChars = "([{<";
		var seChars = ")]}>";
		var spanStart = 0;
		for(var i = 0; i < this.text.length; i++){
			var curChar = this.text[i];
			
			if(spanStart < 0)
				spanStart = i;
			
			if(ssChars.includes(curChar) || seChars.includes(curChar)){
				var spanStr = this.text.substr(spanStart, i - spanStart);
				var spanStyle = (seChars).indexOf(curChar);
				spanStyle = spanStyle >= 0 ? this.altStyles[spanStyle] : this.style;
				
				var m = {text: spanStr, style: spanStyle};
				if(m.text.length > 0)
					this.textSpans.push(m);
				
				spanStart = -1;
			}
		}
		var curChar = this.text[this.text.length - 1];
		var spanStr = this.text.substr(spanStart, this.text.length - spanStart);
		var spanStyle = (seChars).indexOf(curChar);
		spanStyle = spanStyle > 0 ? this.altStyles[spanStyle] : this.style;
		
		var m = {text: spanStr, style: spanStyle};
		this.textSpans.push(m);
	}
	
	draw(){
		if(!this.preRender)
			this.preRender = preRenderedText.fromBlock(this);
		this.preRender.draw();
	}
}

// gets soon-to-be rendered text's character sprite information and styling information and stores
// it so it doesn't have to be re-calculated each frame
class preRenderedText{
	constructor(){
		// initializes a new preRenderedText instance
		this.spriteContainers = [];
		this.mainStyle = textStyle.fromAlignment(0.5, 0.5);
		this.lines = [];
	}
	
	static fromBlock(txtBlock){
		// generates preRenderedText from a textBlock
		var r = new preRenderedText();
		r.mainStyle = txtBlock.style;
		
		// keeps track of the line that each character is on
		r.lines = [];
		var curLine = [];
		
		// used to keep track of the current character's position (aka cursor)
		var cPos = txtBlock.bounds.topLeft; 
		
		// iterate through each span in the textBlock
		for(var i0 = 0; i0 < txtBlock.textSpans.length; i0++){
			var span = txtBlock.textSpans[i0]; // current span
			var words = span.text.split(' '); // array of words in span
			
			// iterate through each word in the span
			for(var i1 = 0; i1 < words.length; i1++){
				var word = words[i1];
				var charsprites = span.style.font.getStringSprites(word, span.style.color);
				
				// if the word goes past the textblock bounds, the cursor is put on a new line
				var wwidth = span.style.font.getStringWidth(word.trim(), span.style);
				if(cPos.x + wwidth > txtBlock.bounds.right){
					cPos = new vec2(txtBlock.bounds.left, cPos.y + txtBlock.lineHeight);
					
					// starts a new line and adds the old one to the line query
					r.lines.push(curLine);
					curLine = [];
				}
				
				// iterate through each spritebox that represents a character in the word
				for(var i2 = 0; i2 < charsprites.length; i2++){
					// offsets the cursor's y-position to account for vertical alignment styling
					var maxYOff = txtBlock.lineHeight - (span.style.font.charSize.y * span.style.scale);
					var yOff = maxYOff * r.mainStyle.vAlign;
					
					// create a spriteContainer to render and add it to the query
					var sprCont = new spriteContainer(
						span.style.font.spritesheet, 
						charsprites[i2],
						new collisionBox(cPos.plus(new vec2(0, yOff)), charsprites[i2].size.multiply(span.style.scale))
						);
					r.spriteContainers.push(sprCont);
					
					// records the line that the character is on
					curLine.push(sprCont);
					
					// increment the cursor's x-position
					cPos.x += charsprites[i2].width * span.style.scale;
				}
				
				// if it's not the last word in the span, the cursor is incremented to account for the truncated space from text.split(' ')
				if(i1 + 1 < words.length)
					cPos.x += span.style.font.getCharSprite().width * span.style.scale;
			}
		}
		
		// if the cursor didn't end on a new line, add the current line to the line query
		if(curLine.length > 0)
			r.lines.push(curLine);
		
		r.applyHorizontalAlignment(txtBlock.bounds.left, txtBlock.bounds.right);
		r.applyVerticalAlignment(txtBlock.bounds.top, txtBlock.bounds.bottom);
		return r;
	}
	static fromString(str, pos, style = textStyle.getDefault()){
		// generates preRenderedText from a string
		var r = new preRenderedText();
		r.mainStyle = style;
		var cPos = 0;
		var curLine = [];
		
		// gets all the sprite information from each text character, applies styling and stores it for
		// later rendering
		var sChars = style.font.getStringSprites(str, style.color);
		for(var i = 0; i < sChars.length; i++){
			var sprCont = new spriteContainer(
				style.font.spritesheet,
				sChars[i],
				new collisionBox(pos.plus(new vec2(cPos, 0)), sChars[i].size.multiply(style.scale))
				);
			r.spriteContainers.push(sprCont);
			curLine.push(sprCont);
			
			cPos += sChars[i].width * style.scale;
		}
		
		// fromString() only supports single-line rendering
		r.lines = [curLine];
		r.applyHorizontalAlignment(pos.x);
		r.applyVerticalAlignment(pos.y);
		return r;
	}
	
	calculateLines(){
		if(this.spriteContainers.length <= 0) return;
		this.lines = [];
		
		var curline = [];
		var lastX = this.spriteContainers[0].bounds.left - 1;
		for(var i = 0; i < this.spriteContainers.length; i++){
			var sc = this.spriteContainers[i];
			if(sc.bounds.left <= lastX){
				this.lines.push(curline);
				curline = [];
			}
			
			curline.push(sc);
			lastX = sc.bounds.left;
		}
		if(curline.length > 0)
			this.lines.push(curline);
	}
	
	applyHorizontalAlignment(minLeft, maxRight = minLeft){
		// applies the horizontal alignment according to the mainStyle rules
		// iterate through each line of text
		for(var i0 = 0; i0 < this.lines.length; i0++){
			var charSprites = this.lines[i0];
			if(charSprites.length <= 0) continue;
			
			// determines how much to adjust the x-position of the character
			var startPos = charSprites[0].bounds.left;
			var endPos = charSprites[charSprites.length - 1].bounds.right;
			var maxXOff = maxRight - endPos;
			var minXOff = minLeft - startPos;
			var xOff = maxXOff * this.mainStyle.hAlign + minXOff;
			
			// iterate through each character in the line
			for(var i1 = 0; i1 < charSprites.length; i1++){
				// apply the x-offset to each character
				var sprCont = charSprites[i1];
				sprCont.bounds.pos.x += xOff;
			}
		}
		return this;
	}
	applyVerticalAlignment(yMin, yMax = yMin){
		// re-centers the text vertically based on the given rules
		
		// determines how much to adjust the y-position of the character
		var startPos = this.spriteContainers[0].bounds.top;
		var endPos = this.spriteContainers[this.spriteContainers.length - 1].bounds.bottom;
		var maxYOff = yMax - endPos;
		var minYOff = yMin - startPos;
		var yOff = maxYOff * this.mainStyle.vAlign + minYOff;
			
		for(var i0 = 0; i0 < this.lines.length; i0++){
			var charSprites = this.lines[i0];
			if(charSprites.length <= 0) continue;
			
			// iterate through each character in the line
			for(var i1 = 0; i1 < charSprites.length; i1++){
				// apply the y-offset to each character
				var sprCont = charSprites[i1];
				sprCont.bounds.pos.y += yOff;
			}
		}
		return this;
	}
	getBounds(){
		// returns a rectangle that encompasses all the spritecontainers(representing ascii characters)
		// that are to be rendered
		if(this.spriteContainers.length <= 0) return null;
		return collisionBox.fromSides(
			this.spriteContainers[0].bounds.left, 
			this.spriteContainers[0].bounds.top, 
			this.spriteContainers[this.spriteContainers.length - 1].bounds.right, 
			this.spriteContainers[this.spriteContainers.length - 1].bounds.bottom,);
	}
	
	// returns a new instance of the preRender with an animation applied
	getAnimated(anim){
		var c = this.clone();
		
		anim.applyAnim(c);
		
		return c;
	}
	
	// returns a new preRenderedText instance with the same values
	clone(){
		var r = new preRenderedText();
		
		r.spriteContainers = [];
		for (var i = 0; i < this.spriteContainers.length; i++)
			r.spriteContainers.push(this.spriteContainers[i].clone());
		r.calculateLines();
		
		r.mainStyle = this.mainStyle;
		
		return r;
	}
	
	draw(){
		// renders all the spritecontainers, making a line of bitmap ascii characters
		for(var i = 0; i < this.spriteContainers.length; i++)
			this.spriteContainers[i].draw();
	}
}