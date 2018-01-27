///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

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
		this.spritesheet = spritesheet;
		this.charSize = charsize;
		this.colors = colorVariants;
		this.align = 0.5; // centered text alignment
		
		this.defaults = {
			color: textColor.light,
			scale: 1,
		}
	}
	
	setDefaultColor(col = textColor.light){
		this.defaults.color = col;
	}
	setDefaultScale(scale = 1){
		this.defaults.scale = scale;
	}
	
	getCharSprite(character = ' '){
		character = character.toLowerCase();
		var cz = this.charSize;
		var ii;
		
		ii = "0123456789".indexOf(character);
		if(ii >= 0) return cz.getSprite(ii, 0);
		
		switch(character){
			case ' ': return new spriteBox(new vec2(), new vec2(this.charSize.x, 0));
			case '!': return cz.getSprite(10);
			case ':': return cz.getSprite(11);
			case '-': return cz.getSprite(12);
		}
		
		ii = "abcdefghijklm".indexOf(character);
		if(ii >= 0) return cz.getSprite(ii, 1);
		
		ii = "nopqrstuvwxyz".indexOf(character);
		if(ii >= 0) return cz.getSprite(ii, 2);
		
		return new spriteBox(new vec2(), new vec2(this.charSize.x, 0));
	}
	getStringSprites(str = "", color = 0){
		var sprites = [];
		
		var col = color || this.defaults.color;
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
	
	drawString(ctx, str = "-- hello world! --", pos = new vec2(), color, scale){
		var sprites = this.getStringSprites(str, color);
		var scl = scale || this.defaults.scale;
		
		var alignOffset = this.align * (sprites.length * this.charSize.x * scl)
		
		for(var i = 0; i < sprites.length; i++){
			var box = sprites[i];
			if(box.height <= 0) continue;
			var tpos = pos.plus(new vec2(i * this.charSize.x * scl - alignOffset, 0));
			
			drawImage(ctx, this.spritesheet, tpos, box, scale);
			//ctx.drawImage(
			//	this.spritesheet,
			//	box.left, box.top,
			//	box.width, box.height,
			//	pos.x + i * this.charSize.x * scl - alignOffset, pos.y,
			//	box.width * scl, box.height * scl
			//	);
		}
	}
}