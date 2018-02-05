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
	getStringWidth(str){
		// returns the width in pixels that the string will be when it's drawn
		var sprites = this.getStringSprites(str);
		var w = 0;
		for(var i = sprites.length - 1; i >= 0; i--)
			w += sprites[i].width;
		return w * this.defaultStyle.scale;
	}
	
	drawString(ctx, str = "-- hello: world! --", pos = new vec2(), style = this.defaultStyle){
		// renders the string to the specified context with the graphics inside this textRenderer's spritesheet
		var sprites = this.getStringSprites(str, style.color);
		var scl = style.scale;
		
		var swidth = 0;
		for(var i = sprites.length - 1; i >= 0; i--)
			swidth += sprites[i].width;
		var alignOffset = style.hAlign * (swidth * scl);
		console.log(style);
		
		var xoff = 0;
		for(var i = 0; i < sprites.length; i++){
			var box = sprites[i];
			if(box.height > 0){
				var tpos = pos.plus(new vec2(xoff - alignOffset, 0));
				drawImage(ctx, this.spritesheet, tpos, box, scl);
			}
			xoff += box.width * scl;
		}
	}
	
}

class textStyle{
	constructor(font, color = textColor.light, scale = 1, horizontalAlign = 0.5){
		this.font = font;
		this.color = color;
		this.scale = scale;
		this.hAlign = horizontalAlign;
	}
}