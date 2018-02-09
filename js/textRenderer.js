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
	
	static drawText(text, pos, style){
		style.font.drawString(text, pos, style);
	}
}

class textStyle{
	constructor(font, color = textColor.light, scale = 1, horizontalAlign = 0.5){
		this.font = font;
		this.color = color;
		this.scale = scale;
		this.hAlign = horizontalAlign;
		this.vAlign = 1;
	}
	static fromAlignment(horizontal = 0.5, vertical = 1){
		var r = textStyle.getDefault();
		
		r.hAlign = horizontal;
		r.vAlign = vertical;
		
		return r;
	}
	static getDefault(){
		var r = new textStyle(fonts.large, textColor.light, 1, 0.5);
		
		r.vAlign = 1;
		
		return r;
	}
}

class textBlock{
	constructor(text, style, bounds, altStyles = [], lineHeight = 32){
		this.style = style;
		this.altStyles = altStyles;
		this.bounds = bounds;
		this.lineHeight = lineHeight;
		this.setText(text);
		this.setStyleAlign();
		this.preRender = null;
	}
	
	setStyleAlign(){
		this.style.hAlign = 0;
		for(var i in this.altStyles)
			this.altStyles[i].hAlign = 0;
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

class preRenderedText{
	constructor(){
		this.spriteContainers = [];
		this.mainStyle = textStyle.fromAlignment(0.5, 0.5);
		this.lines = [];
	}
	
	static fromBlock(txtBlock){
		// generates preRenderedText from a textBlock
		var r = new preRenderedText();
		
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
		return r;
	}
	
	applyHorizontalAlignment(minLeft, maxRight){
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
	}
	
	draw(){
		for(var i = 0; i < this.spriteContainers.length; i++)
			this.spriteContainers[i].draw();
	}
}