///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

textColor = {
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
	constructor(spritesheet, colorVariants = 8){
		this.spritesheet = spritesheet;
		this.colors = colorVariants;
		this.charSize = new vec2(
			spritesheet.width / 13, 
			(spritesheet.height / this.colors / 3) );
	}
	
	getCharSprite(character = ' '){
		character = character.toLowerCase();
		var cz = this.charSize;
		var ii
		
		ii = "0123456789".indexOf(character);
		if(ii >= 0) return cs.getSprite(ii, 0);
		
		switch(character){
			case " ": new spriteBox(new vec2(), new vec2(this.charSize.x, 0));
			case "!": return cz.getSprite(11);
			case ":": return cz.getSprite(12);
			case "-": return cz.getSprite(13);
		}
		
		"abcdefghijklm";
		if(ii >= 0) return cs.getSprite(ii, 1);
		
		"nopqrstuvwxyz";
		if(ii >= 0) return cs.getSprite(ii, 2);
		
		return new spriteBox(new vec2(), new vec2(this.charSize.x, 0));
	}
	
	drawString(ctx, str = "-- hello world! --", pos = new vec2(), color = textColor.light, scale = 1){
		var sprites = [];
		var colOffset = 
			(color >= this.colors ? 0 : color) * 
			(this.charSize.y * 3);
		
		for(var i = 0; i < str.length; i++){
			var s = this.getCharSprite(str[i]);
			console.log(s.width);
			s.pos.y += colOffset;
			sprites.push(s);
		}
		for(var i = 0; i < sprites.length; i++){
			var box = sprites[i];
			ctx.drawImage(
				this.spritesheet,
				box.left, box.top,
				box.width, box.height,
				pos.x, pos.y,
				box.width * scale, box.height * scale
				);
		}
	}
}