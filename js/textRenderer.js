///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerates the different fields of the floating score text
var floatingScoreFieldID = {
	ballScore: 0,
	bombCombo: 1,
	bombComboPts: 2,
	bombComboBonus: 3,
	coinCombo: 4,
	coinComboPts: 5,
	coinComboBonus: 6
}
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
	linear: 0,
	linearBounce: 1,
	trigonometric: 2,
	trigonometricCycle: 3,
	easeIn: 4,
	easeOut: 5,
	bulgeIn: 6,
	bulgeOut: 7
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
		for(let i in cwidths){
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
			
		for(let i = 0; i < str.length; i++){
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
		for(let i = sprites.length - 1; i >= 0; i--)
			w += sprites[i].width * style.scale;
		return w * this.defaultStyle.scale;
	}
	
	drawString(str = "-- hello: world! --", pos = new vec2(), style = this.defaultStyle){
		// renders the string to the specified context with the graphics inside this textRenderer's spritesheet
		var sprites = this.getStringSprites(str, style.color);
		var scl = style.scale;
		
		var swidth = 0;
		for(let i = sprites.length - 1; i >= 0; i--)
			swidth += sprites[i].width;
		var alignOffset = style.hAlign * (swidth * scl);
		
		var xoff = 0;
		for(let i = 0; i < sprites.length; i++){
			var box = sprites[i];
			if(box.height > 0){
				var tpos = pos.plus(new vec2(xoff - alignOffset, 0));
				drawImage(renderContext, this.spritesheet, tpos, box, scl);
			}
			xoff += box.width * scl;
		}
	}
	
	static drawText(text, pos, style, animation = null){
		preRenderedText.fromString(text, pos, style).animated(animation).draw();
	}
}

// holds information about how to style text when trying to render it
class textStyle{
	constructor(font, color = textColor.light, scale = 1, horizontalAlign = 0.5){
		// initializes a textStyle object
		this.font = font; // the font (textRenderer) object that the text will be drawn with
		this.color = color; // the textColor for the color to be rendered as
		this.scale = scale; // the multiplier for the size of the text, 1 = native size
		this.hAlign = horizontalAlign; // how the text should be aligned horizontally, 0 = left, 0.5 = centered, 1 = right, etc
		this.vAlign = 0.5; // how the text should be aligned vertically
	}
	static fromAlignment(horizontal = 0.5, vertical = 0.5){
		// sets the h and v alignment of the default style and returns it
		var r = textStyle.getDefault();
		
		r.hAlign = horizontal;
		r.vAlign = vertical;
		
		return r;
	}
	static getDefault(){
		// gets the default text style
		var r = new textStyle(fonts.large, textColor.light, 1, 0.5);
		
		r.vAlign = 0.5;
		
		return r;
	}

	setScale(scl){
		this.scale = scl;
		return this;
	}
	setAlignment(horizontal = 0.5, vertical = 1){
		this.hAlign = horizontal;
		this.vAlign = vertical;
		return this;
	}
	setColor(col = textColor.green){
		this.color = col;
		return this;
	}
}

// an animation that can be applied to text
class textAnim{
	constructor(){
		this.animType = textAnimType.linear; // how the animation will handle transitioning from its first to last state
		this.animLength = 500; // total length of the animation in milliseconds
		this.animDelay = 0; // delay before the animation starts in milliseconds
		this.animCharOffset = 0.1; // the animation percent offset between each character
		this.animOffset = 0; // the offset of the animation from the global gameState's total timeElapsed
		this.looping = true;
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
		if(this.animType == textAnimType.unlimited) return aProg;
		
		// if the animation is only supposed to play once
		if(!this.looping){
			if(aProg < 0) return 0; // return 0 if animation hasn't started
			if(Math.abs(aProg) >= 1) return 1; // return 1 if animation is finished
		}
		else
			aProg = aProg > 0 ? aProg % 1 : 1 + (aProg % 1);
		
		switch(this.animType){
			case textAnimType.linear: // progresses from 0 to 1 at a constant speed
				return aProg;
			case textAnimType.linearBounce: // progresses from 0 to 1 and then back to 0 at a constant speed
				return Math.abs(aProg * 2 - 1);
			case textAnimType.trigonometric: // progresses from 0 to 1 starting slow, speeding up and then ending slowly
				return 1 - (Math.cos(aProg * Math.PI) + 1) / 2;
			case textAnimType.trigonometricCycle: // progresses from 0 to 1 back to 0 increasing and decreasing speed gradually
				return (Math.cos(aProg * Math.PI * 2) + 1) / 2;
			case textAnimType.easeIn: // 0 to 1 starting slowly and speeding up as it approaches 1
				return 1 - (Math.cos(aProg * (Math.PI / 2)));
			case textAnimType.easeOut: // 0 to 1 starting at full speed and slowing down as it approaches 1
				return (Math.sin(aProg * (Math.PI / 2)));
			case textAnimType.bulgeIn: // 0 to 1.25ish back to 1 starting at full speed and slowing down and reversing as it peaks
				return (Math.sin(aProg * (3 * Math.PI / 4))) * Math.sqrt(2);
			case textAnimType.bulgeOut: //0 to -0.25ish up to 1 starting at a low speed and accelerating as it peaks
				return 1 - (Math.cos(-(Math.PI / 4) + aProg * (3 * Math.PI / 4))) * Math.sqrt(2);
		}
		
		return aProg;
	}
	
	setAnimType(type, looping = true){
		this.animType = type;
		this.looping = looping;
		return this;
	}
	
	// for override
	applyAnim(prerender){ }
	
	drawText(text, pos, style){
		// draws the specified text at the specified position with the specified style
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
	
	resetAnim(){
		this.anims.forEach(function(anim){
			anim.resetAnim();
		});
	}
	
	// adds an animation to the anims array
	addAnimation(anim){
		this.anims.push(anim);
	}
	// applies all the animations to a preRenderedText object
	applyAnim(pr){
		for(let i = 0; i < this.anims.length; i++)
			this.anims[i].applyAnim(pr);
	}
}

// an animation that makes the text wave up and down like a sin wave
class textAnim_yOffset extends textAnim{
	constructor(animLength = 500, range = 5, charOff = 0.1){
		super();
		this.animType = textAnimType.trigonometricCycle;
		this.animLength = animLength;
		this.animCharOffset = charOff;
		this.range = range;
		this.off = range / -2;
	}
	
	applyAnim(pr){
		for(let i = 0; i < pr.spriteContainers.length; i++){
			var cy = this.getAnimProgress(i) * this.range + this.off;
			
			pr.spriteContainers[i].bounds.pos.y += cy;
		}
	}
}
// an animation that changes the color of the text by incrementing its hue
class textAnim_rainbow extends textAnim{
	constructor(animLength = 500, charOff = 0.1){
		super();
		this.animType = textAnimType.looping;
		this.animCharOffset = charOff;
		this.animLength = animLength;
	}
	
	applyAnim(pr){
		for(let i = 0; i < pr.spriteContainers.length; i++){
			var col = Math.floor(2 + this.getAnimProgress(i) * 6);
			var charHeight = pr.spriteContainers[i].sprite.size.y;
			var colOff = col * charHeight * 3;
			var sy = pr.spriteContainers[i].sprite.pos.y % (charHeight * 3);
			sy += colOff;
			
			pr.spriteContainers[i].sprite.pos.y = sy;
		}
	}
}
// an animation where the text blinks between its stylized color and a defined color
class textAnim_blink extends textAnim{
	constructor(animLength = 500, charOff = 0.1, color = textColor.dark){
		super();
		this.animType = textAnimType.linear;
		this.animCharOffset = charOff;
		this.animLength = animLength;
		this.color = color;
	}
	
	applyAnim(pr){
		for(let i = 0; i < pr.spriteContainers.length; i++){
			if(this.getAnimProgress(i) < 0.5) continue;
			var charHeight = pr.spriteContainers[i].sprite.size.y;
			var colOff = this.color * charHeight * 3;
			var sy = pr.spriteContainers[i].sprite.pos.y % (charHeight * 3);
			sy += colOff;
			
			pr.spriteContainers[i].sprite.pos.y = sy;
		}
	}
}
// an animation that changes the text's size
class textAnim_scale extends textAnim{
	constructor(animLength = 500, minScale = 0.5, maxScale = 1, charOff = 0.1){
		super();
		
		this.animType = textAnimType.linear;
		this.animLength = animLength;
		this.animCharOffset = charOff;
		this.minScale = minScale;
		this.maxScale = maxScale;
		this.looping = false;
	}
	
	applyAnim(pr){
		for(let i = 0; i < pr.spriteContainers.length; i++){
			var cRange = this.maxScale - this.minScale;
			var cs = this.minScale + this.getAnimProgress(i) * cRange;
			var oc = pr.spriteContainers[i].bounds.center.clone();
			
			pr.spriteContainers[i].bounds.size = pr.spriteContainers[i].bounds.size.multiply(cs);
			pr.spriteContainers[i].bounds.setCenter(oc);
		}
	}
}
// an animation that scales the text while keeping it's relative size and position ratio
class textAnim_scaleTransform extends textAnim{
	constructor(animLength = 500, minScale = 1, maxScale = 2, charOff = 0){
		super();
		
		this.animType = textAnimType.linear;
		this.animLength = animLength;
		this.animCharOffset = charOff;
		this.minScale = minScale;
		this.maxScale = maxScale;
		this.looping = false;
	}
	
	applyAnim(pr){
		var prCenter = pr.findCenter();
		for(let i = 0; i < pr.spriteContainers.length; i++){
			var cRange = this.maxScale - this.minScale;
			var cs = this.minScale + this.getAnimProgress(i) * cRange;
			var rc = pr.spriteContainers[i].bounds.center.minus(prCenter);
			
			pr.spriteContainers[i].bounds.size = pr.spriteContainers[i].bounds.size.multiply(cs);
			pr.spriteContainers[i].bounds.setCenter(prCenter.plus(rc.multiply(cs)));
		}
	}
}
// an animation that set's the texts rotation
class textAnim_rotationOffset extends textAnim{
	constructor(animLength = 500, rotVariance = 1, charOff = 0.1){
		super();
		
		this.animOffset = animLength / 4;
		this.animType = textAnimType.trigonometricCycle;
		this.animLength = animLength;
		this.animCharOffset = charOff;
		this.rotVariance = rotVariance;
		this.looping = true;
	}
	
	applyAnim(pr){
		for(let i = 0; i < pr.spriteContainers.length; i++){
			var rOff = this.getAnimProgress(i) * this.rotVariance - this.rotVariance / 2;
			
			pr.spriteContainers[i].rotation = rOff;
		}
	}
}

class floatingTextField{
	constructor(){
		this.fieldID = floatingScoreFieldID.ballScore;
		this.text = "";
		this.style = textStyle.getDefault();
		this.animation = null;
		
		this.preRender = null;
	}
	
	setText(txt, style, animation){
		this.text = txt;
		if(style)
			this.style = style;
		if(animation)
			this.animation = animation;
		this.updatePreRender();
	}
	updatePreRender(){
		this.preRender = preRenderedText.fromString(this.text, new vec2(), this.style);
	}
	
	draw(pos, animated = false, scale = 1){
		var pr = this.preRender;
		
		if(animated)
			if(this.animation) pr = this.preRender.animated(this.animation);
		
		pr = pr.scaled(scale)
		pr.setCenter(pos);
		
		pr.draw();
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
		for(let i in this.altStyles)
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
		for(let i = 0; i < this.text.length; i++){
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
		if(spanStart >= 0){
			var curChar = this.text[this.text.length - 1];
			var spanStr = this.text.substr(spanStart, this.text.length - spanStart);
			var spanStyle = (seChars).indexOf(curChar);
			spanStyle = spanStyle >= 0 ? this.altStyles[spanStyle] : this.style;
			
			var m = {text: spanStr, style: spanStyle};
			this.textSpans.push(m);
		}
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
		
		// used to keep track of the current character's position (aka the cursor)
		var cPos = txtBlock.bounds.topLeft; 
		
		// iterate through each span in the textBlock
		for(let i0 = 0; i0 < txtBlock.textSpans.length; i0++){
			var span = txtBlock.textSpans[i0]; // current span
			var words = span.text.split(' '); // array of words in span
			
			// iterate through each word in the span
			for(let i1 = 0; i1 < words.length; i1++){
				var word = words[i1];
				var charsprites = span.style.font.getStringSprites(word, span.style.color);
				
				// if the word ends with '|', truncate it and start a new line (with the characters before '|' representing the line 
				// height multiplier)
				if(word.includes('|')){
					var mult = parseFloat(word) || 1;
					cPos = new vec2(txtBlock.bounds.left, cPos.y + txtBlock.lineHeight * mult);
					
					// starts a new line and adds the old one to the line query
					r.lines.push(curLine);
					curLine = [];
					
					continue;
				}
				
				// if the word goes past the textblock bounds, the cursor is put on a new line
				var wwidth = span.style.font.getStringWidth(word.trim(), span.style);
				if(cPos.x + wwidth > txtBlock.bounds.right){
					cPos = new vec2(txtBlock.bounds.left, cPos.y + txtBlock.lineHeight);
					
					// starts a new line and adds the old one to the line query
					r.lines.push(curLine);
					curLine = [];
				}
				
				// iterate through each spritebox that represents a character in the word
				for(let i2 = 0; i2 < charsprites.length; i2++){
					// offsets the cursor's y-position to account for vertical alignment styling
					var maxYOff = txtBlock.lineHeight - (span.style.font.charSize.y * span.style.scale);
					var yOff = maxYOff * span.style.vAlign;
					
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
		for(let i = 0; i < sChars.length; i++){
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
		for(let i = 0; i < this.spriteContainers.length; i++){
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
	findCenter(){
		// returns the center point of the prerendered text
		return this.getBounds().center;
	}
	setCenter(pos){
		var cent = this.findCenter();
		this.spriteContainers.forEach(function(sc){
			let off = sc.bounds.pos.minus(cent);
			sc.bounds.pos = pos.plus(off);
		});
	}
	
	applyHorizontalAlignment(minLeft, maxRight = minLeft){
		// applies the horizontal alignment according to the mainStyle rules
		// iterate through each line of text
		for(let i0 = 0; i0 < this.lines.length; i0++){
			var charSprites = this.lines[i0];
			if(charSprites.length <= 0) continue;
			
			// determines how much to adjust the x-position of the character
			var startPos = charSprites[0].bounds.left;
			var endPos = charSprites[charSprites.length - 1].bounds.right;
			var maxXOff = maxRight - endPos;
			var minXOff = minLeft - startPos;
			var xOff = maxXOff * this.mainStyle.hAlign + minXOff;
			
			// iterate through each character in the line
			for(let i1 = 0; i1 < charSprites.length; i1++){
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
		
		for(let i0 = 0; i0 < this.lines.length; i0++){
			var charSprites = this.lines[i0];
			if(charSprites.length <= 0) continue;
			
			// iterate through each character in the line
			for(let i1 = 0; i1 < charSprites.length; i1++){
				// apply the y-offset to each character
				var sprCont = charSprites[i1];
				sprCont.bounds.pos.y += yOff;
			}
		}
		return this;
	}
	getBounds(){
		// returns a rectangle that supposedly encompasses all the text characters
		if(this.spriteContainers.length <= 0) return null;
		return collisionBox.fromSides(
			this.spriteContainers[0].bounds.left,
			this.spriteContainers[0].bounds.top,
			this.spriteContainers[this.spriteContainers.length - 1].bounds.right,
			this.spriteContainers[this.spriteContainers.length - 1].bounds.bottom
			);
	}
	
	animated(anim){
		// returns a new instance of the preRender with an animation applied
		if(!config.animText || !anim) return this;
		var c = this.clone();
		
		anim.applyAnim(c);
		
		return c;
	}
	scaled(scale = 1){
		// scaletransforms the preRendered text object even if animated text is disabled
		var r = this.clone();
		
		var ctr = this.findCenter();
		for(let i = 0; i < r.spriteContainers.length; i++){
			var rc = r.spriteContainers[i].bounds.center.minus(ctr);
			
			r.spriteContainers[i].bounds.size = r.spriteContainers[i].bounds.size.multiply(scale);
			r.spriteContainers[i].bounds.setCenter(ctr.plus(rc.multiply(scale)));
		}
		
		return r;
	}
	
	clone(){
		// returns a new preRenderedText instance with the same values
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
		for(let i = 0; i < this.spriteContainers.length; i++)
			this.spriteContainers[i].draw();
	}
}