"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

// enumerates between the 4 sides of a rectangle
var side = {
	none: 0,
	left: 1,
	right: 2,
	up: 3,
	down: 4
};
function invertedSide(dir) {
	// gets the oppisite of the specified side
	switch (dir) {
		case side.left:
			return side.right;
		case side.right:
			return side.left;
		case side.up:
			return side.down;
		case side.down:
			return side.up;
	}
	return side.none;
}

var vec2 = function () {
	function vec2() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

		_classCallCheck(this, vec2);

		this.x = x;
		this.y = y;
	}

	_createClass(vec2, [{
		key: "normalized",
		value: function normalized() {
			var magnitude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			//returns a vector 2 with the same direction as this but
			//with a specified magnitude
			return this.multiply(magnitude / this.distance());
		}
	}, {
		key: "inverted",
		value: function inverted() {
			//returns the opposite of this vector
			return this.multiply(-1);
		}
	}, {
		key: "multiply",
		value: function multiply(factor) {
			//returns this multiplied by a specified factor		
			return new vec2(this.x * factor, this.y * factor);
		}
	}, {
		key: "plus",
		value: function plus(vec) {
			//returns the result of this added to another specified vector2
			return new vec2(this.x + vec.x, this.y + vec.y);
		}
	}, {
		key: "minus",
		value: function minus(vec) {
			//returns the result of this subtracted to another specified vector2
			return this.plus(vec.inverted());
		}
	}, {
		key: "rotate",
		value: function rotate(rot) {
			//rotates the vector by the specified angle
			var ang = this.direction();
			var mag = this.distance();
			ang += rot;
			return vec2.fromAng(ang, mag);
		}
	}, {
		key: "equals",
		value: function equals(vec) {
			var leniency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0001;

			//returns true if the difference between rectangular distance of the two vectors is less than the specified leniency
			return Math.abs(this.x - vec.x) <= leniency && Math.abs(this.y - vec.y) <= leniency;
		}
	}, {
		key: "getPointingSide",
		value: function getPointingSide() {
			if (this.x >= 0) {
				if (this.x >= Math.abs(this.y)) return side.right;else if (this.y >= 0) return side.down;
				return side.up;
			} else {
				if (this.x <= -1 * Math.abs(this.y)) return side.left;else if (this.y >= 0) return side.down;
				return side.up;
			}
			return side.none;
		}
	}, {
		key: "direction",
		value: function direction() {
			//returns the angle this vector is pointing in radians
			return Math.atan2(this.y, this.x);
		}
	}, {
		key: "distance",
		value: function distance() {
			var vec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			//returns the distance between this and a specified vector2
			if (vec === null) vec = new vec2();
			var d = Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
			return d;
		}
	}, {
		key: "getSprite",
		value: function getSprite() {
			var xColumn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var yRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var altwidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			// returns a spritebox using this as the sprite's frame size

			return spriteBox.charSprite(this.clone(), xColumn, yRow, altwidth);
		}
	}, {
		key: "clone",
		value: function clone() {
			return new vec2(this.x, this.y);
		}
	}, {
		key: "toString",
		value: function toString() {
			return "vector<" + this.x + ", " + this.y + ">";
		}
	}], [{
		key: "fromAng",
		value: function fromAng(angle) {
			var magnitude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

			//returns a vector which points in the specified angle
			//and has the specified magnitude
			return new vec2(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
		}
	}, {
		key: "fromSide",
		value: function fromSide(dir) {
			switch (dir) {
				case side.none:
					return new vec2(0, 0);
				case side.left:
					return new vec2(-1, 0);
				case side.right:
					return new vec2(1, 0);
				case side.up:
					return new vec2(0, -1);
				case side.down:
					return new vec2(0, 1);
			}
			return new vec2();
		}
	}, {
		key: "getBounds",
		value: function getBounds(vec2arrray) {
			// returns a collisionBox that surrounds all the vectors in vec2arrray
			var minX, minY, maxX, maxY;

			vec2arrray.forEach(function (vec, i) {
				if (i == 0) {
					minX = vec.x;
					minY = vec.y;
					maxX = vec.x;
					maxY = vec.y;
					return; // acts as "continue" keyword in anon callback in a forEach loop
				}

				if (vec.x < minX) minX = vec.x;
				if (vec.y < minY) minY = vec.y;
				if (vec.x > maxX) maxX = vec.x;
				if (vec.y > maxY) maxY = vec.y;
			});

			return collisionBox.fromSides(minX, minY, maxX, maxY);
		}
	}]);

	return vec2;
}();

var spriteBox = function () {
	function spriteBox() {
		var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new vec2();
		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new vec2();

		_classCallCheck(this, spriteBox);

		this.pos = pos;
		this.size = size;
	}

	_createClass(spriteBox, [{
		key: "clone",
		value: function clone() {
			return new spriteBox(this.pos.clone(), this.size.clone());
		}
	}, {
		key: "left",
		get: function get() {
			return Math.round(this.pos.x);
		}
	}, {
		key: "right",
		get: function get() {
			return Math.round(this.pos.x + this.size.x);
		}
	}, {
		key: "top",
		get: function get() {
			return Math.round(this.pos.y);
		}
	}, {
		key: "bottom",
		get: function get() {
			return Math.round(this.pos.y + this.size.y);
		}
	}, {
		key: "width",
		get: function get() {
			return Math.round(this.size.x);
		}
	}, {
		key: "height",
		get: function get() {
			return Math.round(this.size.y);
		}
	}], [{
		key: "charSprite",
		value: function charSprite(charSize) {
			var xColumn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var yRow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var altwidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			// simplified function that works well with getting the specific character sprite
			// from a font spritesheet
			altwidth = !!altwidth ? altwidth : charSize.x;
			return new spriteBox(new vec2(charSize.x * xColumn, charSize.y * yRow), new vec2(altwidth, charSize.y));
		}
	}]);

	return spriteBox;
}();

var color = function () {
	function color() {
		_classCallCheck(this, color);

		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
	}

	_createClass(color, [{
		key: "toRGB",
		value: function toRGB() {
			// returns the RGB string of the color for styling (no alpha)
			return "rgb(" + Math.floor(this.r).toString() + "," + Math.floor(this.g).toString() + "," + Math.floor(this.b).toString() + ")";
		}
	}, {
		key: "toRGBA",
		value: function toRGBA() {
			// returns the RGBA string of the color for styling
			return "rgb(" + Math.floor(this.r).toString() + "," + Math.floor(this.g).toString() + "," + Math.floor(this.b).toString() + "," + this.a.toString() + ")";
		}
	}, {
		key: "toHex",
		value: function toHex() {
			// returns the Hex string of the color for styling (no alpha)
			var r = Math.floor(this.r).toString(16);
			var g = Math.floor(this.g).toString(16);
			var b = Math.floor(this.b).toString(16);

			return "#" + r + g + b;
		}
	}, {
		key: "setFill",
		value: function setFill() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : renderContext;

			// sets the specified context's fill style to this color
			ctx.fillStyle = this.toRGBA();
		}
	}, {
		key: "setStroke",
		value: function setStroke() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : renderContext;

			// sets the specified context's stroke style to this color
			ctx.strokeStyle = this.toRGBA();
		}
	}], [{
		key: "fromRGBA",
		value: function fromRGBA() {
			var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

			// creates a color object from red, green, blue, and alpha channels
			var col = new color();

			col.r = r;
			col.g = g;
			col.b = b;
			col.a = a;

			return col;
		}
	}, {
		key: "fromHex",
		value: function fromHex() {
			var hex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#000";
			var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

			// creates a color object from a hexidecimal value
			var sslength = hex.length == 4 ? 1 : 2;
			var r = parseInt(hex.substr(1 + 0 * sslength, sslength), 16);
			var g = parseInt(hex.substr(1 + 1 * sslength, sslength), 16);
			var b = parseInt(hex.substr(1 + 2 * sslength, sslength), 16);

			if (sslength == 1) {
				r = r * 17;
				g = g * 17;
				b = b * 17;
			}

			return color.fromRGBA(r, g, b, alpha);
		}
	}]);

	return color;
}();

var collisionBox = function () {
	function collisionBox() {
		var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new vec2();
		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new vec2();

		_classCallCheck(this, collisionBox);

		this.pos = pos;
		this.size = size;
	}

	_createClass(collisionBox, [{
		key: "setCenter",
		value: function setCenter(newCenter) {
			// set's the center of the collisionBox to the specified position
			this.pos = new vec2(newCenter.x - this.size.x / 2, newCenter.y - this.size.y / 2);
			return this;
		}
	}, {
		key: "inflated",
		value: function inflated(factor) {
			// returns a new instance of the collisionBox enlarged by the specified amount
			var r = this.clone();

			r.size = r.size.multiply(factor);

			// makes sure to keep the same centerpoint
			r.setCenter(this.center);

			return r;
		}
	}, {
		key: "overlapsPoint",
		value: function overlapsPoint(point) {
			// returns true if the specified point is inside the collisionBox (inclusive)
			return point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom;
		}
	}, {
		key: "overlapsBox",
		value: function overlapsBox(colbox) {
			// returns true if this collision box overlaps the specified collision box (inclusive)
			return this.right >= colbox.left && this.left <= colbox.right && this.bottom >= colbox.top && this.top <= colbox.bottom;
		}
	}, {
		key: "clone",
		value: function clone() {
			// returns a new instance with the same values
			return new collisionBox(this.pos.clone(), this.size.clone());
		}
	}, {
		key: "drawFill",
		value: function drawFill(ctx) {
			var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#aaa";

			ctx.fillStyle = color;
			ctx.fillRect(this.left, this.top, this.width, this.height);
		}
	}, {
		key: "drawOutline",
		value: function drawOutline(ctx) {
			var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#000";
			var lineWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

			ctx.strokeStyle = color;
			ctx.lineWidth = lineWidth;
			ctx.strokeRect(this.left, this.top, this.width, this.height);
		}
	}, {
		key: "left",
		get: function get() {
			return this.pos.x;
		}
	}, {
		key: "right",
		get: function get() {
			return this.pos.x + this.size.x;
		}
	}, {
		key: "top",
		get: function get() {
			return this.pos.y;
		}
	}, {
		key: "bottom",
		get: function get() {
			return this.pos.y + this.size.y;
		}
	}, {
		key: "width",
		get: function get() {
			return this.size.x;
		}
	}, {
		key: "height",
		get: function get() {
			return this.size.y;
		}
	}, {
		key: "center",
		get: function get() {
			return this.pos.plus(this.size.multiply(0.5));
		}
	}, {
		key: "topLeft",
		get: function get() {
			return this.pos.clone();
		}
	}, {
		key: "topRight",
		get: function get() {
			return this.pos.plus(new vec2(this.size.x, 0));
		}
	}, {
		key: "bottomLeft",
		get: function get() {
			return this.pos.plus(new vec2(0, this.size.y));
		}
	}, {
		key: "bottomRight",
		get: function get() {
			return this.pos.plus(this.size);
		}
	}], [{
		key: "fromSides",
		value: function fromSides(left, top, right, bottom) {
			// creates a collisionBox object from the specified x and y values for the box's sides
			return new collisionBox(new vec2(left, top), new vec2(right - left, bottom - top));
		}
	}]);

	return collisionBox;
}();

var spriteContainer = function () {
	function spriteContainer(spriteSheet, sprite) {
		var bounds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		_classCallCheck(this, spriteContainer);

		this.spriteSheet = spriteSheet;
		this.sprite = sprite;
		this.bounds = bounds;
		if (bounds == null && !!sprite) this.bounds = new collisionBox(new vec2(), sprite.size);

		this.rotation = null;
	}

	_createClass(spriteContainer, [{
		key: "animated",
		value: function animated(anim) {
			// returns a spritecontainer that is animated according to the specified animation
			var r = this.clone();
			var pr = { spriteContainers: [r] };

			anim.applyAnim(pr);

			return pr.spriteContainers[0];
		}
	}, {
		key: "clone",
		value: function clone() {
			// creates a new spriteContainer instance with the same values as this instance
			var r = new spriteContainer();

			r.spriteSheet = this.spriteSheet;
			r.sprite = this.sprite.clone();
			r.bounds = this.bounds.clone();

			return r;
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : renderContext;

			// draws the sprite
			if (this.sprite.size.x <= 0 || this.sprite.size.y <= 0) return;
			if (this.rotation) {
				this.drawRotated(ctx);
				return;
			}
			ctx.drawImage(this.spriteSheet, this.sprite.left, this.sprite.top, this.sprite.width, this.sprite.height, this.bounds.left, this.bounds.top, this.bounds.width, this.bounds.height);
		}
	}, {
		key: "drawRotated",
		value: function drawRotated() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : renderContext;

			// draws the sprite with the specified rotation
			if (this.sprite.size.x <= 0 || this.sprite.size.y <= 0) return;
			var cCorrect = this.bounds.size.multiply(-0.5);
			var tTot = this.bounds.pos.minus(cCorrect);

			ctx.translate(tTot.x, tTot.y);
			ctx.rotate(this.rotation);

			ctx.drawImage(this.spriteSheet, this.sprite.left, this.sprite.top, this.sprite.width, this.sprite.height, cCorrect.x, cCorrect.y, this.bounds.width, this.bounds.height);

			ctx.rotate(-this.rotation);
			ctx.translate(-tTot.x, -tTot.y);
		}
	}]);

	return spriteContainer;
}();

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
	// enumerates the different colors in a font's color spritesheet
};var textColor = {
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

	// a text renderer object, used for storing information about sprite fonts
};
var textRenderer = function () {
	function textRenderer(spritesheet, charsize) {
		var colorVariants = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 8;

		_classCallCheck(this, textRenderer);

		// initializes a textRenderer object, used for rendering text with a given text spritesheet
		this.spritesheet = spritesheet;
		this.charSize = charsize;
		this.colors = colorVariants;
		this.specCharWidths = [];
		this.useSpecificCharWidth = false;

		this.defaultStyle = new textStyle(this, textColor.light);
	}

	_createClass(textRenderer, [{
		key: "setDefaultColor",
		value: function setDefaultColor() {
			var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : textColor.light;

			// sets the default textColor that the text will be rendered as
			this.defaults.color = col;
		}
	}, {
		key: "setDefaultScale",
		value: function setDefaultScale() {
			var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			// sets the default scale that the text will be rendered at
			this.defaults.scale = scale;
		}
	}, {
		key: "setSpecificCharacterWidths",
		value: function setSpecificCharacterWidths(cwidths) {
			// sets an individual width for each character in the spritesheet to provide more accurate spacing
			for (var i in cwidths) {
				var j = i.toLowerCase().charCodeAt(0);
				this.specCharWidths[j] = cwidths[i];
			}
			this.useSpecificCharWidth = true;
		}
	}, {
		key: "getCharSprite",
		value: function getCharSprite() {
			var character = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';

			// returns the spritebox that represents the character's position and size within the spritesheet
			character = character.toLowerCase();

			var cwidth = this.charSize.x;
			if (this.useSpecificCharWidth) if (this.specCharWidths[character.charCodeAt(0)] != undefined) cwidth = this.specCharWidths[character.charCodeAt(0)];

			var cz = this.charSize;
			var ii;

			ii = "0123456789".indexOf(character);
			if (ii >= 0) return cz.getSprite(ii, 0, cwidth);

			switch (character) {
				case ' ':
					return new spriteBox(new vec2(), new vec2(cwidth, 0));
				case '!':
					return cz.getSprite(10, 0, cwidth);
				case ':':
					return cz.getSprite(11, 0, cwidth);
				case '-':
					return cz.getSprite(12, 0, cwidth);
			}

			ii = "abcdefghijklm".indexOf(character);
			if (ii >= 0) return cz.getSprite(ii, 1, cwidth);

			ii = "nopqrstuvwxyz".indexOf(character);
			if (ii >= 0) return cz.getSprite(ii, 2, cwidth);

			return new spriteBox(new vec2(), new vec2(cwidth, 0));
		}
	}, {
		key: "getStringSprites",
		value: function getStringSprites() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			// returns a list of character sprites that represent the characters' position and size inside the spritesheet
			var sprites = [];

			var col = color || this.defaultStyle.color;
			var colOffset = (col >= this.colors ? 0 : col) * (this.charSize.y * 3);

			for (var i = 0; i < str.length; i++) {
				var s = this.getCharSprite(str[i]);
				s.pos.y += colOffset;
				sprites.push(s);
			}
			return sprites;
		}
	}, {
		key: "getStringWidth",
		value: function getStringWidth(str) {
			var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultStyle;

			// returns the width in pixels that the string will be when it's drawn
			var sprites = this.getStringSprites(str);
			var w = 0;
			for (var i = sprites.length - 1; i >= 0; i--) {
				w += sprites[i].width * style.scale;
			}return w * this.defaultStyle.scale;
		}
	}, {
		key: "drawString",
		value: function drawString() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "-- hello: world! --";
			var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new vec2();
			var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.defaultStyle;

			// renders the string to the specified context with the graphics inside this textRenderer's spritesheet
			var sprites = this.getStringSprites(str, style.color);
			var scl = style.scale;

			var swidth = 0;
			for (var i = sprites.length - 1; i >= 0; i--) {
				swidth += sprites[i].width;
			}var alignOffset = style.hAlign * (swidth * scl);

			var xoff = 0;
			for (var _i = 0; _i < sprites.length; _i++) {
				var box = sprites[_i];
				if (box.height > 0) {
					var tpos = pos.plus(new vec2(xoff - alignOffset, 0));
					drawImage(renderContext, this.spritesheet, tpos, box, scl);
				}
				xoff += box.width * scl;
			}
		}
	}], [{
		key: "drawText",
		value: function drawText(text, pos, style) {
			var animation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			preRenderedText.fromString(text, pos, style).animated(animation).draw();
		}
	}]);

	return textRenderer;
}();

// holds information about how to style text when trying to render it


var textStyle = function () {
	function textStyle(font) {
		var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : textColor.light;
		var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
		var horizontalAlign = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;

		_classCallCheck(this, textStyle);

		// initializes a textStyle object
		this.font = font; // the font (textRenderer) object that the text will be drawn with
		this.color = color; // the textColor for the color to be rendered as
		this.scale = scale; // the multiplier for the size of the text, 1 = native size
		this.hAlign = horizontalAlign; // how the text should be aligned horizontally, 0 = left, 0.5 = centered, 1 = right, etc
		this.vAlign = 0.5; // how the text should be aligned vertically
	}

	_createClass(textStyle, [{
		key: "setScale",
		value: function setScale(scl) {
			this.scale = scl;
			return this;
		}
	}, {
		key: "setAlignment",
		value: function setAlignment() {
			var horizontal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
			var vertical = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

			this.hAlign = horizontal;
			this.vAlign = vertical;
			return this;
		}
	}, {
		key: "setColor",
		value: function setColor() {
			var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : textColor.green;

			this.color = col;
			return this;
		}
	}], [{
		key: "fromAlignment",
		value: function fromAlignment() {
			var horizontal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
			var vertical = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

			// sets the h and v alignment of the default style and returns it
			var r = textStyle.getDefault();

			r.hAlign = horizontal;
			r.vAlign = vertical;

			return r;
		}
	}, {
		key: "getDefault",
		value: function getDefault() {
			// gets the default text style
			var r = new textStyle(fonts.large, textColor.light, 1, 0.5);

			r.vAlign = 0.5;

			return r;
		}
	}]);

	return textStyle;
}();

// an animation that can be applied to text


var textAnim = function () {
	function textAnim() {
		_classCallCheck(this, textAnim);

		this.animType = textAnimType.linear; // how the animation will handle transitioning from its first to last state
		this.animLength = 500; // total length of the animation in milliseconds
		this.animDelay = 0; // delay before the animation starts in milliseconds
		this.animCharOffset = 0.1; // the animation percent offset between each character
		this.animOffset = 0; // the offset of the animation from the global gameState's total timeElapsed
		this.looping = true;
	}

	_createClass(textAnim, [{
		key: "resetAnim",
		value: function resetAnim() {
			var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// restarts the animation
			this.animOffset = gameState.current.timeElapsed;
			if (delay != null) this.animDelay = delay;
		}
	}, {
		key: "getAnimProgress",
		value: function getAnimProgress() {
			var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			// returns a percent indicating the amount that the animation has progressed
			var correctedAnimTime = gameState.current.timeElapsed - this.animOffset - this.animDelay;
			var aProg = correctedAnimTime / this.animLength - index * this.animCharOffset;
			if (this.animType == textAnimType.unlimited) return aProg;

			// if the animation is only supposed to play once
			if (!this.looping) {
				if (aProg < 0) return 0; // return 0 if animation hasn't started
				if (Math.abs(aProg) >= 1) return 1; // return 1 if animation is finished
			} else aProg = aProg > 0 ? aProg % 1 : 1 + aProg % 1;

			switch (this.animType) {
				case textAnimType.linear:
					// progresses from 0 to 1 at a constant speed
					return aProg;
				case textAnimType.linearBounce:
					// progresses from 0 to 1 and then back to 0 at a constant speed
					return Math.abs(aProg * 2 - 1);
				case textAnimType.trigonometric:
					// progresses from 0 to 1 starting slow, speeding up and then ending slowly
					return 1 - (Math.cos(aProg * Math.PI) + 1) / 2;
				case textAnimType.trigonometricCycle:
					// progresses from 0 to 1 back to 0 increasing and decreasing speed gradually
					return (Math.cos(aProg * Math.PI * 2) + 1) / 2;
				case textAnimType.easeIn:
					// 0 to 1 starting slowly and speeding up as it approaches 1
					return 1 - Math.cos(aProg * (Math.PI / 2));
				case textAnimType.easeOut:
					// 0 to 1 starting at full speed and slowing down as it approaches 1
					return Math.sin(aProg * (Math.PI / 2));
				case textAnimType.bulgeIn:
					// 0 to 1.25ish back to 1 starting at full speed and slowing down and reversing as it peaks
					return Math.sin(aProg * (3 * Math.PI / 4)) * Math.sqrt(2);
				case textAnimType.bulgeOut:
					//0 to -0.25ish up to 1 starting at a low speed and accelerating as it peaks
					return 1 - Math.cos(-(Math.PI / 4) + aProg * (3 * Math.PI / 4)) * Math.sqrt(2);
			}

			return aProg;
		}
	}, {
		key: "setAnimType",
		value: function setAnimType(type) {
			var looping = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			this.animType = type;
			this.looping = looping;
			return this;
		}

		// for override

	}, {
		key: "applyAnim",
		value: function applyAnim(prerender) {}
	}, {
		key: "drawText",
		value: function drawText(text, pos, style) {
			// draws the specified text at the specified position with the specified style
			var pr = preRenderedText.fromString(text, pos, style);
			this.applyAnim(pr);
			pr.draw();
		}
	}]);

	return textAnim;
}();
// an animation that combines the effects of many different text animations


var textAnim_compound = function (_textAnim) {
	_inherits(textAnim_compound, _textAnim);

	function textAnim_compound() {
		var textAnimations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		_classCallCheck(this, textAnim_compound);

		var _this = _possibleConstructorReturn(this, (textAnim_compound.__proto__ || Object.getPrototypeOf(textAnim_compound)).call(this));

		_this.anims = textAnimations; // array of different text animations that are combined to make a compound animation
		return _this;
	}

	_createClass(textAnim_compound, [{
		key: "resetAnim",
		value: function resetAnim() {
			this.anims.forEach(function (anim) {
				anim.resetAnim();
			});
		}

		// adds an animation to the anims array

	}, {
		key: "addAnimation",
		value: function addAnimation(anim) {
			this.anims.push(anim);
		}
		// applies all the animations to a preRenderedText object

	}, {
		key: "applyAnim",
		value: function applyAnim(pr) {
			for (var i = 0; i < this.anims.length; i++) {
				this.anims[i].applyAnim(pr);
			}
		}
	}]);

	return textAnim_compound;
}(textAnim);

// an animation that makes the text wave up and down like a sin wave


var textAnim_yOffset = function (_textAnim2) {
	_inherits(textAnim_yOffset, _textAnim2);

	function textAnim_yOffset() {
		var animLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
		var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
		var charOff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;

		_classCallCheck(this, textAnim_yOffset);

		var _this2 = _possibleConstructorReturn(this, (textAnim_yOffset.__proto__ || Object.getPrototypeOf(textAnim_yOffset)).call(this));

		_this2.animType = textAnimType.trigonometricCycle;
		_this2.animLength = animLength;
		_this2.animCharOffset = charOff;
		_this2.range = range;
		_this2.off = range / -2;
		return _this2;
	}

	_createClass(textAnim_yOffset, [{
		key: "applyAnim",
		value: function applyAnim(pr) {
			for (var i = 0; i < pr.spriteContainers.length; i++) {
				var cy = this.getAnimProgress(i) * this.range + this.off;

				pr.spriteContainers[i].bounds.pos.y += cy;
			}
		}
	}]);

	return textAnim_yOffset;
}(textAnim);
// an animation that changes the color of the text by incrementing its hue


var textAnim_rainbow = function (_textAnim3) {
	_inherits(textAnim_rainbow, _textAnim3);

	function textAnim_rainbow() {
		var animLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
		var charOff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;

		_classCallCheck(this, textAnim_rainbow);

		var _this3 = _possibleConstructorReturn(this, (textAnim_rainbow.__proto__ || Object.getPrototypeOf(textAnim_rainbow)).call(this));

		_this3.animType = textAnimType.looping;
		_this3.animCharOffset = charOff;
		_this3.animLength = animLength;
		return _this3;
	}

	_createClass(textAnim_rainbow, [{
		key: "applyAnim",
		value: function applyAnim(pr) {
			for (var i = 0; i < pr.spriteContainers.length; i++) {
				var col = Math.floor(2 + this.getAnimProgress(i) * 6);
				var charHeight = pr.spriteContainers[i].sprite.size.y;
				var colOff = col * charHeight * 3;
				var sy = pr.spriteContainers[i].sprite.pos.y % (charHeight * 3);
				sy += colOff;

				pr.spriteContainers[i].sprite.pos.y = sy;
			}
		}
	}]);

	return textAnim_rainbow;
}(textAnim);
// an animation where the text blinks between its stylized color and a defined color


var textAnim_blink = function (_textAnim4) {
	_inherits(textAnim_blink, _textAnim4);

	function textAnim_blink() {
		var animLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
		var charOff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
		var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : textColor.dark;

		_classCallCheck(this, textAnim_blink);

		var _this4 = _possibleConstructorReturn(this, (textAnim_blink.__proto__ || Object.getPrototypeOf(textAnim_blink)).call(this));

		_this4.animType = textAnimType.linear;
		_this4.animCharOffset = charOff;
		_this4.animLength = animLength;
		_this4.color = color;
		return _this4;
	}

	_createClass(textAnim_blink, [{
		key: "applyAnim",
		value: function applyAnim(pr) {
			for (var i = 0; i < pr.spriteContainers.length; i++) {
				if (this.getAnimProgress(i) < 0.5) continue;
				var charHeight = pr.spriteContainers[i].sprite.size.y;
				var colOff = this.color * charHeight * 3;
				var sy = pr.spriteContainers[i].sprite.pos.y % (charHeight * 3);
				sy += colOff;

				pr.spriteContainers[i].sprite.pos.y = sy;
			}
		}
	}]);

	return textAnim_blink;
}(textAnim);
// an animation that changes the text's size


var textAnim_scale = function (_textAnim5) {
	_inherits(textAnim_scale, _textAnim5);

	function textAnim_scale() {
		var animLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
		var minScale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
		var maxScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
		var charOff = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.1;

		_classCallCheck(this, textAnim_scale);

		var _this5 = _possibleConstructorReturn(this, (textAnim_scale.__proto__ || Object.getPrototypeOf(textAnim_scale)).call(this));

		_this5.animType = textAnimType.linear;
		_this5.animLength = animLength;
		_this5.animCharOffset = charOff;
		_this5.minScale = minScale;
		_this5.maxScale = maxScale;
		_this5.looping = false;
		return _this5;
	}

	_createClass(textAnim_scale, [{
		key: "applyAnim",
		value: function applyAnim(pr) {
			for (var i = 0; i < pr.spriteContainers.length; i++) {
				var cRange = this.maxScale - this.minScale;
				var cs = this.minScale + this.getAnimProgress(i) * cRange;
				var oc = pr.spriteContainers[i].bounds.center.clone();

				pr.spriteContainers[i].bounds.size = pr.spriteContainers[i].bounds.size.multiply(cs);
				pr.spriteContainers[i].bounds.setCenter(oc);
			}
		}
	}]);

	return textAnim_scale;
}(textAnim);
// an animation that scales the text while keeping it's relative size and position ratio


var textAnim_scaleTransform = function (_textAnim6) {
	_inherits(textAnim_scaleTransform, _textAnim6);

	function textAnim_scaleTransform() {
		var animLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
		var minScale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
		var maxScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
		var charOff = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		_classCallCheck(this, textAnim_scaleTransform);

		var _this6 = _possibleConstructorReturn(this, (textAnim_scaleTransform.__proto__ || Object.getPrototypeOf(textAnim_scaleTransform)).call(this));

		_this6.animType = textAnimType.linear;
		_this6.animLength = animLength;
		_this6.animCharOffset = charOff;
		_this6.minScale = minScale;
		_this6.maxScale = maxScale;
		_this6.looping = false;
		return _this6;
	}

	_createClass(textAnim_scaleTransform, [{
		key: "applyAnim",
		value: function applyAnim(pr) {
			var prCenter = pr.findCenter();
			for (var i = 0; i < pr.spriteContainers.length; i++) {
				var cRange = this.maxScale - this.minScale;
				var cs = this.minScale + this.getAnimProgress(i) * cRange;
				var rc = pr.spriteContainers[i].bounds.center.minus(prCenter);

				pr.spriteContainers[i].bounds.size = pr.spriteContainers[i].bounds.size.multiply(cs);
				pr.spriteContainers[i].bounds.setCenter(prCenter.plus(rc.multiply(cs)));
			}
		}
	}]);

	return textAnim_scaleTransform;
}(textAnim);
// an animation that set's the texts rotation


var textAnim_rotationOffset = function (_textAnim7) {
	_inherits(textAnim_rotationOffset, _textAnim7);

	function textAnim_rotationOffset() {
		var animLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
		var rotVariance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
		var charOff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;

		_classCallCheck(this, textAnim_rotationOffset);

		var _this7 = _possibleConstructorReturn(this, (textAnim_rotationOffset.__proto__ || Object.getPrototypeOf(textAnim_rotationOffset)).call(this));

		_this7.animOffset = animLength / 4;
		_this7.animType = textAnimType.trigonometricCycle;
		_this7.animLength = animLength;
		_this7.animCharOffset = charOff;
		_this7.rotVariance = rotVariance;
		_this7.looping = true;
		return _this7;
	}

	_createClass(textAnim_rotationOffset, [{
		key: "applyAnim",
		value: function applyAnim(pr) {
			for (var i = 0; i < pr.spriteContainers.length; i++) {
				var rOff = this.getAnimProgress(i) * this.rotVariance - this.rotVariance / 2;

				pr.spriteContainers[i].rotation = rOff;
			}
		}
	}]);

	return textAnim_rotationOffset;
}(textAnim);

var floatingTextField = function () {
	function floatingTextField() {
		_classCallCheck(this, floatingTextField);

		this.fieldID = floatingScoreFieldID.ballScore;
		this.text = "";
		this.style = textStyle.getDefault();
		this.animation = null;

		this.preRender = null;
	}

	_createClass(floatingTextField, [{
		key: "setText",
		value: function setText(txt, style, animation) {
			this.text = txt;
			if (style) this.style = style;
			if (animation) this.animation = animation;
			this.updatePreRender();
		}
	}, {
		key: "updatePreRender",
		value: function updatePreRender() {
			this.preRender = preRenderedText.fromString(this.text, new vec2(), this.style);
		}
	}, {
		key: "draw",
		value: function draw(pos) {
			var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

			var pr = this.preRender;

			if (animated) if (this.animation) pr = this.preRender.animated(this.animation);

			pr = pr.scaled(scale);
			pr.setCenter(pos);

			pr.draw();
		}
	}]);

	return floatingTextField;
}();

// allows a large amount of text with different styles to be drawn inline in the same 
// paragraph with word wrapping and vertical/horizontal alignment rules


var textBlock = function () {
	function textBlock(text, style, bounds) {
		var altStyles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
		var lineHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 32;

		_classCallCheck(this, textBlock);

		this.style = style;
		this.altStyles = altStyles;
		this.bounds = bounds;
		this.lineHeight = lineHeight;
		this.setText(text);
		this.preRender = null;
	}

	_createClass(textBlock, [{
		key: "setStylesHAlign",
		value: function setStylesHAlign() {
			var hAlign = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			this.style.hAlign = hAlign;
			for (var i in this.altStyles) {
				this.altStyles[i].hAlign = hAlign;
			}
		}
	}, {
		key: "setText",
		value: function setText(text) {
			this.text = text;
			this.textSpans = [];
			this.formTextSpans();
		}
	}, {
		key: "formTextSpans",
		value: function formTextSpans() {
			var r = [];

			var ssChars = "([{<";
			var seChars = ")]}>";
			var spanStart = 0;
			for (var i = 0; i < this.text.length; i++) {
				var curChar = this.text[i];

				if (spanStart < 0) spanStart = i;

				if (ssChars.includes(curChar) || seChars.includes(curChar)) {
					var spanStr = this.text.substr(spanStart, i - spanStart);
					var spanStyle = seChars.indexOf(curChar);
					spanStyle = spanStyle >= 0 ? this.altStyles[spanStyle] : this.style;

					var m = { text: spanStr, style: spanStyle };
					if (m.text.length > 0) this.textSpans.push(m);

					spanStart = -1;
				}
			}
			if (spanStart >= 0) {
				var curChar = this.text[this.text.length - 1];
				var spanStr = this.text.substr(spanStart, this.text.length - spanStart);
				var spanStyle = seChars.indexOf(curChar);
				spanStyle = spanStyle >= 0 ? this.altStyles[spanStyle] : this.style;

				var m = { text: spanStr, style: spanStyle };
				this.textSpans.push(m);
			}
		}
	}, {
		key: "draw",
		value: function draw() {
			if (!this.preRender) this.preRender = preRenderedText.fromBlock(this);
			this.preRender.draw();
		}
	}]);

	return textBlock;
}();

// gets soon-to-be rendered text's character sprite information and styling information and stores
// it so it doesn't have to be re-calculated each frame


var preRenderedText = function () {
	function preRenderedText() {
		_classCallCheck(this, preRenderedText);

		// initializes a new preRenderedText instance
		this.spriteContainers = [];
		this.mainStyle = textStyle.fromAlignment(0.5, 0.5);
		this.lines = [];
	}

	_createClass(preRenderedText, [{
		key: "calculateLines",
		value: function calculateLines() {
			if (this.spriteContainers.length <= 0) return;
			this.lines = [];

			var curline = [];
			var lastX = this.spriteContainers[0].bounds.left - 1;
			for (var i = 0; i < this.spriteContainers.length; i++) {
				var sc = this.spriteContainers[i];
				if (sc.bounds.left <= lastX) {
					this.lines.push(curline);
					curline = [];
				}

				curline.push(sc);
				lastX = sc.bounds.left;
			}
			if (curline.length > 0) this.lines.push(curline);
		}
	}, {
		key: "findCenter",
		value: function findCenter() {
			// returns the center point of the prerendered text
			return this.getBounds().center;
		}
	}, {
		key: "setCenter",
		value: function setCenter(pos) {
			var cent = this.findCenter();
			this.spriteContainers.forEach(function (sc) {
				var off = sc.bounds.pos.minus(cent);
				sc.bounds.pos = pos.plus(off);
			});
		}
	}, {
		key: "applyHorizontalAlignment",
		value: function applyHorizontalAlignment(minLeft) {
			var maxRight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : minLeft;

			// applies the horizontal alignment according to the mainStyle rules
			// iterate through each line of text
			for (var i0 = 0; i0 < this.lines.length; i0++) {
				var charSprites = this.lines[i0];
				if (charSprites.length <= 0) continue;

				// determines how much to adjust the x-position of the character
				var startPos = charSprites[0].bounds.left;
				var endPos = charSprites[charSprites.length - 1].bounds.right;
				var maxXOff = maxRight - endPos;
				var minXOff = minLeft - startPos;
				var xOff = maxXOff * this.mainStyle.hAlign + minXOff;

				// iterate through each character in the line
				for (var i1 = 0; i1 < charSprites.length; i1++) {
					// apply the x-offset to each character
					var sprCont = charSprites[i1];
					sprCont.bounds.pos.x += xOff;
				}
			}
			return this;
		}
	}, {
		key: "applyVerticalAlignment",
		value: function applyVerticalAlignment(yMin) {
			var yMax = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : yMin;

			// re-centers the text vertically based on the given rules

			// determines how much to adjust the y-position of the character
			var startPos = this.spriteContainers[0].bounds.top;
			var endPos = this.spriteContainers[this.spriteContainers.length - 1].bounds.bottom;
			var maxYOff = yMax - endPos;
			var minYOff = yMin - startPos;
			var yOff = maxYOff * this.mainStyle.vAlign + minYOff;

			for (var i0 = 0; i0 < this.lines.length; i0++) {
				var charSprites = this.lines[i0];
				if (charSprites.length <= 0) continue;

				// iterate through each character in the line
				for (var i1 = 0; i1 < charSprites.length; i1++) {
					// apply the y-offset to each character
					var sprCont = charSprites[i1];
					sprCont.bounds.pos.y += yOff;
				}
			}
			return this;
		}
	}, {
		key: "getBounds",
		value: function getBounds() {
			// returns a rectangle that supposedly encompasses all the text characters
			if (this.spriteContainers.length <= 0) return null;
			return collisionBox.fromSides(this.spriteContainers[0].bounds.left, this.spriteContainers[0].bounds.top, this.spriteContainers[this.spriteContainers.length - 1].bounds.right, this.spriteContainers[this.spriteContainers.length - 1].bounds.bottom);
		}
	}, {
		key: "animated",
		value: function animated(anim) {
			// returns a new instance of the preRender with an animation applied
			if (!config.animText || !anim) return this;
			var c = this.clone();

			anim.applyAnim(c);

			return c;
		}
	}, {
		key: "scaled",
		value: function scaled() {
			var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			// scaletransforms the preRendered text object even if animated text is disabled
			var r = this.clone();

			var ctr = this.findCenter();
			for (var i = 0; i < r.spriteContainers.length; i++) {
				var rc = r.spriteContainers[i].bounds.center.minus(ctr);

				r.spriteContainers[i].bounds.size = r.spriteContainers[i].bounds.size.multiply(scale);
				r.spriteContainers[i].bounds.setCenter(ctr.plus(rc.multiply(scale)));
			}

			return r;
		}
	}, {
		key: "clone",
		value: function clone() {
			// returns a new preRenderedText instance with the same values
			var r = new preRenderedText();

			r.spriteContainers = [];
			for (var i = 0; i < this.spriteContainers.length; i++) {
				r.spriteContainers.push(this.spriteContainers[i].clone());
			}r.calculateLines();

			r.mainStyle = this.mainStyle;

			return r;
		}
	}, {
		key: "draw",
		value: function draw() {
			// renders all the spritecontainers, making a line of bitmap ascii characters
			for (var i = 0; i < this.spriteContainers.length; i++) {
				this.spriteContainers[i].draw();
			}
		}
	}], [{
		key: "fromBlock",
		value: function fromBlock(txtBlock) {
			// generates preRenderedText from a textBlock
			var r = new preRenderedText();
			r.mainStyle = txtBlock.style;

			// keeps track of the line that each character is on
			r.lines = [];
			var curLine = [];

			// used to keep track of the current character's position (aka the cursor)
			var cPos = txtBlock.bounds.topLeft;

			// iterate through each span in the textBlock
			for (var i0 = 0; i0 < txtBlock.textSpans.length; i0++) {
				var span = txtBlock.textSpans[i0]; // current span
				var words = span.text.split(' '); // array of words in span

				// iterate through each word in the span
				for (var i1 = 0; i1 < words.length; i1++) {
					var word = words[i1];
					var charsprites = span.style.font.getStringSprites(word, span.style.color);

					// if the word ends with '|', truncate it and start a new line (with the characters before '|' representing the line 
					// height multiplier)
					if (word.includes('|')) {
						var mult = parseFloat(word) || 1;
						cPos = new vec2(txtBlock.bounds.left, cPos.y + txtBlock.lineHeight * mult);

						// starts a new line and adds the old one to the line query
						r.lines.push(curLine);
						curLine = [];

						continue;
					}

					// if the word goes past the textblock bounds, the cursor is put on a new line
					var wwidth = span.style.font.getStringWidth(word.trim(), span.style);
					if (cPos.x + wwidth > txtBlock.bounds.right) {
						cPos = new vec2(txtBlock.bounds.left, cPos.y + txtBlock.lineHeight);

						// starts a new line and adds the old one to the line query
						r.lines.push(curLine);
						curLine = [];
					}

					// iterate through each spritebox that represents a character in the word
					for (var i2 = 0; i2 < charsprites.length; i2++) {
						// offsets the cursor's y-position to account for vertical alignment styling
						var maxYOff = txtBlock.lineHeight - span.style.font.charSize.y * span.style.scale;
						var yOff = maxYOff * span.style.vAlign;

						// create a spriteContainer to render and add it to the query
						var sprCont = new spriteContainer(span.style.font.spritesheet, charsprites[i2], new collisionBox(cPos.plus(new vec2(0, yOff)), charsprites[i2].size.multiply(span.style.scale)));
						r.spriteContainers.push(sprCont);

						// records the line that the character is on
						curLine.push(sprCont);

						// increment the cursor's x-position
						cPos.x += charsprites[i2].width * span.style.scale;
					}

					// if it's not the last word in the span, the cursor is incremented to account for the truncated space from text.split(' ')
					if (i1 + 1 < words.length) cPos.x += span.style.font.getCharSprite().width * span.style.scale;
				}
			}

			// if the cursor didn't end on a new line, add the current line to the line query
			if (curLine.length > 0) r.lines.push(curLine);

			r.applyHorizontalAlignment(txtBlock.bounds.left, txtBlock.bounds.right);
			r.applyVerticalAlignment(txtBlock.bounds.top, txtBlock.bounds.bottom);
			return r;
		}
	}, {
		key: "fromString",
		value: function fromString(str, pos) {
			var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : textStyle.getDefault();

			// generates preRenderedText from a string
			var r = new preRenderedText();
			r.mainStyle = style;
			var cPos = 0;
			var curLine = [];

			// gets all the sprite information from each text character, applies styling and stores it for
			// later rendering
			var sChars = style.font.getStringSprites(str, style.color);
			for (var i = 0; i < sChars.length; i++) {
				var sprCont = new spriteContainer(style.font.spritesheet, sChars[i], new collisionBox(pos.plus(new vec2(cPos, 0)), sChars[i].size.multiply(style.scale)));
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
	}]);

	return preRenderedText;
}();

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

// enumerates all the different ways buttons can be switched


var buttonSwitchMode = {
	bool: 0,
	percent: 1,
	percentInfinite: 2,
	integer: 3,
	directValue: 4,
	enumeration: 5

	// the current gameMode object (to reference, it's recommended to use the 'gameState.current' static field)
};var gameMode = null;

// a generic gameState object, designed as a template base class to be extended from

var gameState = function () {
	function gameState() {
		_classCallCheck(this, gameState);

		// initializes a generic gamestate object which is never really used
		this.timeElapsed = 0;
		this.previousState = null;
	}

	_createClass(gameState, [{
		key: "update",
		value: function update(dt) {
			// updates the gameState object, meant for override
			this.timeElapsed += dt;
		}
	}, {
		key: "draw",
		value: function draw() {}
	}, {
		key: "switchFrom",


		// override these:
		// called when a gameState is being switched away from
		value: function switchFrom() {
			var tostate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		}
		// called when a gameState is being switched to

	}, {
		key: "switchTo",
		value: function switchTo() {
			var fromstate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!this.previousState) this.previousState = fromstate;
		}

		// override these:
		// called when a control is tapped (the first frame the control action is triggered)

	}, {
		key: "controlTap",
		value: function controlTap() {
			var control = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : controlAction.none;
		}
		// called when the mouse button is tapped (the first frame the mouse button is pressed)

	}, {
		key: "mouseTap",
		value: function mouseTap(pos) {}
		// called when the mouse is moved

	}, {
		key: "mouseMove",
		value: function mouseMove(pos) {}

		// touch actions that are called when the listener for the corresponding event is triggered:

	}, {
		key: "touchStart",
		value: function touchStart(pos, touch) {
			this.mouseMove(pos);
		}
	}, {
		key: "touchMove",
		value: function touchMove(pos, touch) {
			this.mouseMove(pos);
		}
	}, {
		key: "touchEnd",
		value: function touchEnd(pos, touch) {
			if (controlState.getTouchDuration() < 350) if (pos.distance(controlState.touchStartPos) <= 10) this.touchTap(pos);
		}
	}, {
		key: "touchCancel",
		value: function touchCancel(pos, touch) {
			touchEnd(pos, touch);
		}

		// a custom touch action

	}, {
		key: "touchTap",
		value: function touchTap(pos) {
			this.mouseTap(pos);
		}
	}], [{
		key: "switchState",
		value: function switchState(tostate) {
			// switches the game from one gameState to another
			log("gameState switched from " + (gameState.current ? gameState.current.constructor.name : "UNDEFINED") + " to " + tostate.constructor.name, logType.notify);

			if (gameMode) gameMode.switchFrom(tostate);
			tostate.switchTo(gameMode);
			gameMode = tostate;
		}
	}, {
		key: "current",
		get: function get() {
			// returns the active gameState object
			if (!gameMode) return gameState.empty;
			return gameMode;
		}
	}, {
		key: "empty",
		get: function get() {
			return new gameState();
		}
	}]);

	return gameState;
}();

// a pressable button in the GUI that the player can interact with


var menuButton = function () {
	function menuButton() {
		_classCallCheck(this, menuButton);
	}

	_createClass(menuButton, [{
		key: "calcSize",
		value: function calcSize() {
			// calculates and sets the selected and unselected boundaries based on the text and font styles
			this.normalBounds = this.preRenders.normal.getBounds();
			this.selectedBounds = this.preRenders.selected.getBounds();
		}
	}, {
		key: "generatePreRenders",
		value: function generatePreRenders() {
			// generates the preRenderedTexts for the the selected and unselected states as well as the 
			// preRenderedText for the button's description text
			this.preRenders = {};
			this.preRenders.normal = preRenderedText.fromString(this.text, this.pos, this.styles.normal);
			this.preRenders.selected = preRenderedText.fromString(this.text, this.pos, this.styles.selected);

			// the description can be multiple lines so we need to use a textBlock to generate the preRenderedText
			// which will break the paragraph into multiple lines and apply vertical alignment rules
			var descBlock = new textBlock(this.description, this.styles.description);
			descBlock.bounds = collisionBox.fromSides(screenBounds.left + 20, screenBounds.bottom - 6, screenBounds.right - 20, screenBounds.bottom - 6);
			descBlock.lineHeight = 16;
			this.preRenders.description = preRenderedText.fromBlock(descBlock);
		}
	}, {
		key: "construct",
		value: function construct(text, pos) {
			var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
			var action = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			// used in lue of a functional contstructor in order to prevent deriving classes from needing to
			// call performance intensive code more than one time
			this.pos = pos;
			this.text = text;
			this.description = description;
			this.action = action;
			this.navLeft = null;
			this.navRight = null;

			// generates the preRenders based on provided styles
			this.styles = null;
			this.preRenders = null;
			this.setStyles();

			// calculates the normal and selected boundaries of the button
			this.normalBounds = null;
			this.selectedBounds = null;
			this.calcSize();
			// used for a check to see if the animation should be reset
			this.selectedLast = false;

			// defines the animations that play when the button is selected or unselected
			this.selectAnim = new textAnim_scaleTransform(200, 0.5, 1, 0);
			this.selectAnim.animType = textAnimType.bulgeIn;
			this.unselectAnim = new textAnim_scaleTransform(100, 2, 1, 0);
			this.unselectAnim.animType = textAnimType.easeIn;

			return this;
		}
	}, {
		key: "setStyles",
		value: function setStyles() {
			var normalStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : textStyle.getDefault();
			var selectedStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new textStyle(fonts.large, textColor.green, 2);
			var descriptionStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new textStyle(fonts.small).setAlignment(0.5, 1);

			// sets the text styles for the normal and unselected states of the button
			descriptionStyle.hAlign = 0.5;
			this.styles = {
				normal: normalStyle || this.styles.normalStyle,
				selected: selectedStyle || this.styles.selectedStyle,
				description: descriptionStyle || this.styles.descriptionStyle
			};
			// when the styles are changed, the preRenderedTexts must be regenerated
			this.generatePreRenders();
		}
	}, {
		key: "settingStylize",
		value: function settingStylize() {
			this.setStyles(null, new textStyle(fonts.large, textColor.cyan, 1));

			this.selectAnim = new textAnim_scale(200, 1.5, 1, 0);
			this.selectAnim.animType = textAnimType.trigonometricCycle;
			this.unselectAnim = new textAnim_scale(100, 1, 1, 0);
			this.unselectAnim.animType = textAnimType.trigonometricCycle;
		}
	}, {
		key: "trigger",
		value: function trigger(args) {
			// called when the button is pressed by the player
			log("menu button '" + this.text + "' triggered", logType.log);

			if (hapticFeedbackEnabled()) window.navigator.vibrate(50);
			if (this.action) this.action(args);
		}
	}, {
		key: "draw",
		value: function draw() {
			var selected = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// renders the button on screen
			if (!this.preRenders) return; // returns if the button's graphics haven't been generated

			// determines if this button's selected state is different than it was last frame
			var fSel = selected != this.selectedLast;

			if (selected) {
				// reset's the button's animation if there's a change in it's state
				if (fSel) this.selectAnim.resetAnim();
				var fpr = this.preRenders.selected;

				// applies the emphasis animations if any
				fpr = fpr.animated(this.selectAnim);
				if (this.animation) fpr = fpr.animated(this.animation);
				fpr.draw();

				// draws arrows to the left and right of the button
				var off = 10;
				var lpos = new vec2(this.preRenders.selected.getBounds().inflated(this.selectAnim.maxScale).left - off, this.pos.y);
				var rpos = new vec2(this.preRenders.selected.getBounds().inflated(this.selectAnim.maxScale).right + off, this.pos.y);
				drawArrow(lpos, side.right);
				drawArrow(rpos, side.left);

				// draws the button's description
				this.preRenders.description.draw();
			} else {
				// reset's the button's animation if there's a change in it's state
				if (fSel) this.unselectAnim.resetAnim();
				// applys the animation for the button's unselected state
				this.preRenders.normal.animated(this.unselectAnim).draw();
			}

			// sets a flag so that the button knows if it was selected on the previous frame or not
			this.selectedLast = selected;
		}
	}], [{
		key: "buildCreditsLink",
		value: function buildCreditsLink(author, desc, hyperlink, pos, style, anim) {
			// simple way to build a credits link
			var mb = new menuButton().construct(author, pos, desc + " - click to visit their website", function () {
				log("opening author page: " + hyperlink, logType.notify);
				window.open(hyperlink, "_blank");
			});

			style.scale = 1;
			mb.setStyles(style);
			mb.animation = anim;

			return mb;
		}
	}]);

	return menuButton;
}();

var settingButton = function (_menuButton) {
	_inherits(settingButton, _menuButton);

	function settingButton() {
		_classCallCheck(this, settingButton);

		return _possibleConstructorReturn(this, (settingButton.__proto__ || Object.getPrototypeOf(settingButton)).call(this));
	}

	_createClass(settingButton, [{
		key: "construct",
		value: function construct(text, pos) {
			var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
			var applyOnChange = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			// see super.construct() for info ony why this is used in lue of a constructor
			this.pos = pos;
			this.text = text;
			this.description = description;

			this.selectAnim = new textAnim_scaleTransform(200, 0.5, 1, 0);
			this.selectAnim.animType = textAnimType.bulgeIn;
			this.unselectAnim = new textAnim_scaleTransform(100, 2, 1, 0);
			this.unselectAnim.animType = textAnimType.easeIn;

			this.styles = null;
			this.preRenders = null;

			this.normalBounds = null;
			this.selectedBounds = null;
			this.selectedLast = false;

			this.mode = buttonSwitchMode.bool;
			this.minVal = 0;
			this.maxVal = 1;
			this.deltaVal = 0.1;

			// a flag that tells the button whether or not the configuration settings should be applied when
			// the value is changed
			this.applyOnChange = applyOnChange;

			this.getValue = null;
			this.setValue = null;
			this.navRight = this.increment;
			this.navLeft = this.decrement;
			this.action = this.cycle;

			this.selectAnim = new textAnim_scale(200, 1.5, 1, 0);
			this.selectAnim.animType = textAnimType.trigonometricCycle;
			this.unselectAnim = new textAnim_scale(100, 1, 1, 0);
			this.unselectAnim.animType = textAnimType.trigonometricCycle;

			return this;
		}
	}, {
		key: "setValueBounds",
		value: function setValueBounds(min, max, delta, switchMode) {
			// sets the upper and lower bounds for the value that is being set by getter and setter functions
			this.minVal = min || this.minVal;
			this.maxVal = max || this.maxVal;
			this.deltaVal = delta || this.deltaVal;
			this.mode = switchMode || this.mode;
			this.generateSettingPreRenders();
			return this;
		}
	}, {
		key: "setGettersAndSetters",
		value: function setGettersAndSetters(getter, setter) {
			// sets the getter and setter functions for the setting button
			// this is VITAL and MUST BE CALLED for every settingButton instance that is created
			this.getValue = getter || this.getValue;
			this.setValue = setter || this.setValue;
			this.setStyles(textStyle.getDefault(), textStyle.getDefault().setColor(textColor.green));
			this.calcSize();
			return this;
		}
	}, {
		key: "setEnumGetterAndSetter",
		value: function setEnumGetterAndSetter(enumObject, optionVarName) {
			// sets getters and setters specific to settingButtons that use enumerations
			var keys = Object.keys(enumObject);

			// set the getters and setters
			this.getValue = function () {
				return config[optionVarName];
			};
			this.setValue = function (val) {
				config[optionVarName] = val;
			};
			this.setStyles(textStyle.getDefault(), textStyle.getDefault().setColor(textColor.green));

			// so that getValueString returns a string that represent the enumeration, instead of just an integer
			this.getValueString = function () {
				return keys[this.getValue()];
			};

			// sets the min and max value
			this.setValueBounds(0, keys.length - 1, 1, buttonSwitchMode.enumeration);
			this.calcSize();

			return this;
		}
	}, {
		key: "increment",
		value: function increment() {
			// increments the option's value by deltaValue until it reaches the max value
			if (!this.getValue) {
				log("getValue function not set for settingButton '" + this.text + "'", logType.error);
				return;
			}

			var m = this.getValue();

			if (this.mode == buttonSwitchMode.bool) m = !m;else {
				if (m >= this.maxVal) {
					if (this.mode == buttonSwitchMode.percentInfinite) m = Infinity;else m = this.maxVal;
				} else {
					m += this.deltaVal;
					if (m > this.maxVal) m = this.maxVal;
				}
			}

			this.changeValue(m);
		}
	}, {
		key: "decrement",
		value: function decrement() {
			// decrements the option's value by deltaValue until it reaches the min value
			if (!this.getValue) {
				log("getValue function not set for settingButton '" + this.text + "'", logType.error);
				return;
			}

			var m = this.getValue();

			if (this.mode == buttonSwitchMode.bool) m = !m;else {
				m -= this.deltaVal;
				if (m == Infinity) m = this.maxVal;
				if (m < this.minVal) m = this.minVal;
			}

			this.changeValue(m);
		}
	}, {
		key: "cycle",
		value: function cycle() {
			// cycles the value between the specified min and max value
			if (!this.getValue) {
				log("getValue function not set for settingButton '" + this.text + "'", logType.error);
				return;
			}

			var m = this.getValue();
			this.increment();
			var n = this.getValue();
			if (m == n) m = this.minVal;else m = n;

			this.changeValue(m);
		}
	}, {
		key: "changeValue",
		value: function changeValue(value) {
			// changes the value of the config option that is being modified by the settingButton
			if (!this.setValue) {
				log("setValue function not set for settingButton '" + this.text + "'", logType.error);
				return;
			}
			this.setValue(value);
			this.generateSettingPreRenders();
			if (this.applyOnChange) applyConfig();
		}
	}, {
		key: "getFullString",
		value: function getFullString() {
			// returns the full string that will be drawn when the settingButton is drawn
			return this.getFullText() + this.getValueString();
		}
	}, {
		key: "getFullText",
		value: function getFullText() {
			// gets the full non-stylized text that will be drawn
			return this.text + ": ";
		}
	}, {
		key: "getValueString",
		value: function getValueString() {
			// gets the string that represents the value of the option that this settingButton is modifying
			if (!this.getValue) {
				log("getValue function not set for settingButton '" + this.text + "'", logType.error);
				return "null";
			}
			var m = this.getValue();
			switch (this.mode) {
				case buttonSwitchMode.bool:
					return m ? "on" : "off";
				case buttonSwitchMode.percent:
					return Math.round(m * 100).toString();
				case buttonSwitchMode.percentInfinite:
					return Math.round(m * 100).toString();
				case buttonSwitchMode.integer:
					return Math.round(m).toString();
			}
			return m.toString();
		}
	}, {
		key: "generateSettingPreRenders",
		value: function generateSettingPreRenders() {
			// generates the preRenderedText that will be drawn to the screen when this.draw() is called
			this.preRenders = {};

			// generates the preRenderedText that represents the unselected button
			var normBlock = new textBlock(this.getFullText() + "(" + this.getValueString() + ")", this.styles.normal.setAlignment(0.5, 0.5), collisionBox.fromSides(screenBounds.left, this.pos.y, screenBounds.right, this.pos.y), [textStyle.getDefault().setColor(textColor.yellow)]);
			this.preRenders.normal = preRenderedText.fromBlock(normBlock);

			// generates the preRenderedText that represents the selected button
			var selBlock = new textBlock(this.getFullText() + "(" + this.getValueString() + ")", this.styles.selected.setAlignment(0.5, 0.5), collisionBox.fromSides(screenBounds.left, this.pos.y, screenBounds.right, this.pos.y), [textStyle.getDefault().setColor(textColor.yellow)]);
			this.preRenders.selected = preRenderedText.fromBlock(selBlock);

			// generates the preRenderedText that represents the button's description
			var descBlock = new textBlock(this.description, this.styles.description);
			descBlock.bounds = collisionBox.fromSides(screenBounds.left + 20, screenBounds.bottom - 6, screenBounds.right - 20, screenBounds.bottom - 6);
			descBlock.lineHeight = 16;
			this.preRenders.description = preRenderedText.fromBlock(descBlock);

			this.calcSize();
			return this;
		}
	}], [{
		key: "generateGetValueFunc",
		value: function generateGetValueFunc(optionVarName) {
			// generates a getter function that will get the value of the specified variable as long
			// as it is a part of the 'config' object
			return function () {
				return config[optionVarName];
			};
		}
	}, {
		key: "generateSetValueFunc",
		value: function generateSetValueFunc(optionVarName) {
			// generates a setter function that will set the value of the specified variable as long
			// as it is a part of the 'config' object
			return function (val) {
				config[optionVarName] = val;
			};
		}
	}]);

	return settingButton;
}(menuButton);

// a generic menu gameState that can be used as a blueprint for other menu interfaces


var state_menuState = function (_gameState) {
	_inherits(state_menuState, _gameState);

	function state_menuState() {
		_classCallCheck(this, state_menuState);

		var _this9 = _possibleConstructorReturn(this, (state_menuState.__proto__ || Object.getPrototypeOf(state_menuState)).call(this));

		_this9.initialized = false;
		_this9.selectionFocus = false;

		_this9.title = new preRenderedText();
		_this9.titleStyle = new textStyle(fonts.large, textColor.green, 2);
		_this9.titleAnim = null;

		_this9.currentTouchPanel = null;
		return _this9;
	}

	_createClass(state_menuState, [{
		key: "initialize",
		value: function initialize() {
			// list of menu buttons
			this.buttons = [];
			// currently selected button
			this.currentSelection = 0;

			this.addButtons();
			this.initialized = true;
		}
	}, {
		key: "addButtons",
		value: function addButtons() {} // for override

	}, {
		key: "setTitle",
		value: function setTitle(titlename) {
			var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var anim = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			this.titleStyle = style || new textStyle(fonts.large, textColor.green, 2);

			if (!anim) {
				this.titleAnim = new textAnim_scaleTransform(300, 0, 1, 0);
				this.titleAnim.animType = textAnimType.easeOut;
			} else this.titleAnim = anim;

			this.title = preRenderedText.fromString(titlename, new vec2(screenBounds.center.x, screenBounds.top + 100), this.titleStyle);
		}
	}, {
		key: "selectionDown",
		value: function selectionDown() {
			// moves the menu cursor down to the next selectable menu item
			if (!this.initialized) this.initialize();
			if (this.buttons.length <= 0) return;
			this.currentSelection += 1;
			if (this.currentSelection >= this.buttons.length) this.currentSelection = 0;

			audioMgr.playSound(sfx.moveCursor);
		}
	}, {
		key: "selectionUp",
		value: function selectionUp() {
			// moves the menu cursor up to the previous selectable menu item
			if (!this.initialized) this.initialize();
			if (this.buttons.length <= 0) return;
			this.currentSelection -= 1;
			if (this.currentSelection < 0) this.currentSelection = this.buttons.length - 1;

			audioMgr.playSound(sfx.moveCursor);
		}
	}, {
		key: "navigateLeft",
		value: function navigateLeft() {
			// calls navLeft() on the currently selected button
			if (!this.initialized) this.initialize();
			if (this.selectedButton.navLeft) {
				this.selectedButton.navLeft();
				audioMgr.playSound(sfx.moveCursor);
			}
		}
	}, {
		key: "navigateRight",
		value: function navigateRight() {
			// calls navRight() on the currently selected button
			if (!this.initialized) this.initialize();
			if (this.selectedButton.navRight) {
				this.selectedButton.navRight();
				audioMgr.playSound(sfx.moveCursor);
			}
		}
	}, {
		key: "switchToPreviousState",
		value: function switchToPreviousState() {
			if (this.previousState instanceof state_menuState) this.previousState.initialize();
			gameState.switchState(this.previousState);
		}
	}, {
		key: "select",
		value: function select() {
			var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// selects the menu item at the specefied position, if no position is specified, the currently selected menu item is triggered
			if (!this.initialized) this.initialize();
			if (this.buttons.length <= 0) return;
			if (!pos) {
				this.buttons[this.currentSelection].trigger();
				audioMgr.playSound(sfx.select);
				return;
			}
		}
	}, {
		key: "controlTap",
		value: function controlTap() {
			var control = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : controlAction.none;

			// defines the what the controls do when you press them, used for menu navigation in the main menu
			if (!this.initialized) this.initialize();
			if (this.selectionFocus) return;
			switch (control) {
				case controlAction.up:
					this.selectionUp();break;
				case controlAction.down:
					this.selectionDown();break;
				case controlAction.left:
					this.navigateLeft();break;
				case controlAction.right:
					this.navigateRight();break;
				case controlAction.select:
					this.select();break;
			}
		}
	}, {
		key: "mouseTap",
		value: function mouseTap(pos) {
			// defines what happens when the mouse is clicked in the main menu
			if (this.currentTouchPanel) {
				this.killTouchPanel();
				return;
			}
			if (this.selectionFocus) return;
			if (!this.initialized) this.initialize();
			if (this.buttons.length <= 0) return;
			if (this.selectedButton.selectedBounds.overlapsPoint(pos)) {
				this.touchStart(pos, null);
				if (!this.currentTouchPanel) this.select();
			}
		}
	}, {
		key: "mouseMove",
		value: function mouseMove(pos) {
			// defines what happens when the mouse is moved in the main menu

			if (this.selectionFocus) return;
			if (!this.initialized) this.initialize();

			// emulate touchmove
			if (this.currentTouchPanel) {
				this.touchMove(pos, null);
				//if(!controlState.mouseDown)
				//	this.killTouchPanel();
				return;
			}

			if (this.buttons.length <= 0) return;
			if (this.selectedButton.selectedBounds.overlapsPoint(pos)) return;

			// checks mouse collision with each button
			for (var i = 0; i < this.buttons.length; i++) {
				if (this.buttons[i].normalBounds.overlapsPoint(pos)) {
					this.currentSelection = i;
					audioMgr.playSound(sfx.moveCursor);
					if (hapticFeedbackEnabled()) window.navigator.vibrate(25);
					return;
				}
			}
		}
	}, {
		key: "touchStart",
		value: function touchStart(pos, touch) {
			// creates a touch panel on the button if applicable
			if (!this.selectedButton) return;

			if (this.selectedButton.selectedBounds.overlapsPoint(pos)) {
				if (this.selectedButton instanceof settingButton) {
					if (!(this.selectedButton.mode == buttonSwitchMode.bool || this.selectedButton.mode == buttonSwitchMode.enumeration)) {
						this.currentTouchPanel = this.getValueSliderPanel(pos);
					}
				}
			}
		}
	}, {
		key: "touchMove",
		value: function touchMove(pos, touch) {
			if (this.currentTouchPanel) this.currentTouchPanel.touchMove(pos, touch);
		}
	}, {
		key: "touchEnd",
		value: function touchEnd(pos, touch) {
			this.killTouchPanel();
		}
	}, {
		key: "killTouchPanel",
		value: function killTouchPanel() {
			if (this.currentTouchPanel) {
				this.currentTouchPanel.kill();
				this.currentTouchPanel = null;
			}
		}
	}, {
		key: "getValueSliderPanel",
		value: function getValueSliderPanel(pos) {
			// gets a touch panel for sliding a value up or down
			var ths = this;
			var panel = new touchPanel();
			var swiperad = 32 * config.swipeRadius;

			panel.activeDirections = [side.left, side.right];

			var swipeLeft = function swipeLeft() {
				ths.navigateLeft();
				panel.origin.x -= swiperad;
			};
			var swipeRight = function swipeRight() {
				ths.navigateRight();
				panel.origin.x += swiperad;
			};
			var move = function move(pos) {
				panel.drawPos.x = panel.touchPos.x;

				var dif = panel.touchPos.x - panel.origin.x;
				while (Math.abs(dif) >= swiperad) {
					if (dif > 0) swipeRight();else swipeLeft();
					dif = panel.touchPos.x - panel.origin.x;
				}
			};

			panel.action_swipeLeft = swipeLeft;
			panel.action_swipeRight = swipeRight;
			panel.action_move = move;

			return panel.spawn(pos);
		}
	}, {
		key: "drawTitle",
		value: function drawTitle() {
			var pr = !!this.titleAnim ? this.title.animated(this.titleAnim) : this.title;
			pr.draw();
		}
	}, {
		key: "drawInternals",
		value: function drawInternals() {}
	}, {
		key: "draw",
		value: function draw() {
			// draws the menuState
			if (!this.initialized) this.initialize();
			// renders tiled background
			drawBackground();

			// draws all the user-defined graphics that aren't buttons
			this.drawInternals();
			this.drawTitle();

			// renders all the buttons
			var ths = this;
			this.buttons.forEach(function (btn, i) {
				var sel = i == ths.currentSelection;
				btn.draw(sel);
			});

			// renders the foreground border
			drawForegroundBorder();

			if (this.currentTouchPanel) this.currentTouchPanel.draw();
		}
	}, {
		key: "selectedButton",
		get: function get() {
			// returns the button that is currently selected
			if (!this.initialized) this.initialize();
			if (this.buttons.length <= 0) return null;
			return this.buttons[this.currentSelection];
		}
	}]);

	return state_menuState;
}(gameState);

// a simple confirmation dialogue


var state_confirmationDialogue = function (_state_menuState) {
	_inherits(state_confirmationDialogue, _state_menuState);

	function state_confirmationDialogue(confirmAction) {
		var denyAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

		_classCallCheck(this, state_confirmationDialogue);

		// title text = "Warning"
		var _this10 = _possibleConstructorReturn(this, (state_confirmationDialogue.__proto__ || Object.getPrototypeOf(state_confirmationDialogue)).call(this));

		_this10.description = "this action cannot be undone";
		_this10.prompt = "are you sure";

		var titleAnim = new textAnim_scaleTransform(350, 1, 1.15, 0);
		titleAnim.looping = true;
		titleAnim.animType = textAnimType.trigonometricCycle;
		var titleBlink = new textAnim_blink(400, 0.025, textColor.yellow);
		_this10.titleAnim = new textAnim_compound([titleAnim, titleBlink]);

		_this10.setTitle("Warning", new textStyle(fonts.large, textColor.red, 2), new textAnim_compound([titleAnim, titleBlink]));

		var ths = _this10;
		_this10.action_confirm = function () {
			log("confirmation accepted", logType.unimportant);confirmAction();gameState.switchState(ths.previousState);
		};
		_this10.action_deny = function () {
			log("confirmation denied", logType.unimportant);denyAction();gameState.switchState(ths.previousState);
		};

		_this10.currentSelection = 1;
		return _this10;
	}

	_createClass(state_confirmationDialogue, [{
		key: "addButtons",
		value: function addButtons() {
			this.buttons = [new menuButton().construct("Yes", new vec2(screenBounds.center.x, screenBounds.bottom - 200), "confirm your choice", this.action_confirm), new menuButton().construct("No", new vec2(screenBounds.center.x, screenBounds.bottom - 145), "cancel and return", this.action_deny)];
		}
	}, {
		key: "drawInternals",
		value: function drawInternals() {
			// title prerender is drawn in this.draw()

			var descStyle = new textStyle(fonts.large, textColor.green, 1);
			textRenderer.drawText(this.description, new vec2(screenBounds.center.x, screenBounds.top + 150), descStyle);

			var promptStyle = new textStyle(fonts.large, textColor.green, 1);
			textRenderer.drawText(this.prompt, new vec2(screenBounds.center.x, screenBounds.bottom - 250), promptStyle);
		}
	}, {
		key: "switchTo",
		value: function switchTo() {
			var fromstate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			_get(state_confirmationDialogue.prototype.__proto__ || Object.getPrototypeOf(state_confirmationDialogue.prototype), "switchTo", this).call(this, fromstate);
			log("gameState '" + this.previousState.constructor.name + "' asking for confirmation", logType.notify);
		}
	}]);

	return state_confirmationDialogue;
}(state_menuState);

// a gameState object that represents the main menu interface


var state_mainMenu = function (_state_menuState2) {
	_inherits(state_mainMenu, _state_menuState2);

	function state_mainMenu() {
		_classCallCheck(this, state_mainMenu);

		// set the title and title animation
		var _this11 = _possibleConstructorReturn(this, (state_mainMenu.__proto__ || Object.getPrototypeOf(state_mainMenu)).call(this));
		// initializes a main menu gameState


		var tubetrisEntrance = new textAnim_scale(300, 0, 1, 0.4);
		tubetrisEntrance.animType = textAnimType.bulgeIn;
		tubetrisEntrance.animDelay = 200;
		_this11.setTitle("TUBETRIS", new textStyle(fonts.large, textColor.green, 3), tubetrisEntrance);

		// "deluxe" text animation
		var deluxeEntrance = new textAnim_scale(100, 0, 1, 0);
		deluxeEntrance.animType = textAnimType.linear;
		deluxeEntrance.animDelay = 1300;

		_this11.titleDeluxeAnim = new textAnim_compound([deluxeEntrance, new textAnim_yOffset(2000 / 3, 15, 1 / 4), new textAnim_rainbow(500, 1 / 12)]);

		return _this11;
	}

	_createClass(state_mainMenu, [{
		key: "addButtons",
		value: function addButtons() {
			// adds the buttons to the interface
			this.buttons = [];
			var off = 0;
			var dif = 55;

			var action_startGame = function action_startGame() {
				startNewGame();
			};
			var action_switchToScoreboard = function action_switchToScoreboard() {
				gameState.switchState(new state_scoreboard());
			};
			var action_switchToOptions = function action_switchToOptions() {
				gameState.switchState(new state_optionsMenu());
			};
			var action_switchToCredits = function action_switchToCredits() {
				gameState.switchState(new state_credits());
			};

			this.buttons.push(new menuButton().construct("Start Game", screenBounds.center.plus(new vec2(0, off * dif)), "start a new game", action_startGame));off++;
			this.buttons.push(new menuButton().construct("Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), "view the highest scoring players", action_switchToScoreboard));off++;
			this.buttons.push(new menuButton().construct("Options", screenBounds.center.plus(new vec2(0, off * dif)), "configure gameplay and av options", action_switchToOptions));off++;
			//this.buttons.push(new menuButton().construct("Extras", screenBounds.center.plus(new vec2(0, off * dif)), "other things n stuff")); off++;
			this.buttons.push(new menuButton().construct("Credits", screenBounds.center.plus(new vec2(0, off * dif)), "see who contributed to making the game!", action_switchToCredits));off++;
		}
	}, {
		key: "drawTitle",
		value: function drawTitle() {
			_get(state_mainMenu.prototype.__proto__ || Object.getPrototypeOf(state_mainMenu.prototype), "drawTitle", this).call(this);

			var animStyle = new textStyle(fonts.large, textColor.yellow, 2);
			textRenderer.drawText("DELUXE", new vec2(screenBounds.center.x, screenBounds.top + 180), animStyle, this.titleDeluxeAnim);
		}
	}, {
		key: "switchFrom",
		value: function switchFrom() {
			var tostate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		}
	}, {
		key: "switchTo",
		value: function switchTo() {
			var fromstate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			_get(state_mainMenu.prototype.__proto__ || Object.getPrototypeOf(state_mainMenu.prototype), "switchTo", this).call(this, fromstate);
		}
	}]);

	return state_mainMenu;
}(state_menuState);
// a gameState object that represents the scoreboard screen interface


var state_scoreboard = function (_state_menuState3) {
	_inherits(state_scoreboard, _state_menuState3);

	function state_scoreboard() {
		_classCallCheck(this, state_scoreboard);

		var _this12 = _possibleConstructorReturn(this, (state_scoreboard.__proto__ || Object.getPrototypeOf(state_scoreboard)).call(this));

		_this12.setTitle("SCOREBOARD");

		// text animations for first place
		_this12.anim_value1 = scoring.getRankColorAnim(1);
		var anim_p1 = new textAnim_scale(500, 0.75, 1.25, 0.1).setAnimType(textAnimType.trigonometricCycle);
		_this12.anim_place1 = new textAnim_compound([_this12.anim_value1, anim_p1]);

		// text animations for second place
		_this12.anim_value2 = scoring.getRankColorAnim(2);
		var anim_p2 = new textAnim_yOffset(500, 3, 0.5);
		_this12.anim_place2 = new textAnim_compound([_this12.anim_value2, anim_p2]);

		_this12.scoreNames = [];
		_this12.scoreValues = [];
		_this12.scoreStyles = [textStyle.getDefault().setColor(textColor.yellow), textStyle.getDefault().setColor(textColor.green), textStyle.getDefault().setColor(textColor.cyan), textStyle.getDefault().setColor(textColor.blue), textStyle.getDefault().setColor(textColor.pink)];
		_this12.addScoreboardText();
		return _this12;
	}

	_createClass(state_scoreboard, [{
		key: "addButtons",
		value: function addButtons() {
			this.buttons = [];
			var ths = this;
			var off = 0;
			var dif = 55;
			var tpos = new vec2(screenBounds.center.x, screenBounds.bottom - 200);

			var action_switchToPreviousMenu = function action_switchToPreviousMenu() {
				var state = !ths.previousState ? new state_mainMenu() : ths.previousState;
				state.initialize();
				gameState.switchState(state);
			};
			this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the previous menu", action_switchToPreviousMenu));
		}
	}, {
		key: "addScoreboardText",
		value: function addScoreboardText() {
			var off = new vec2(-screenBounds.width % 32 - 2, -screenBounds.height % 32 - 2);
			var padding = 50;
			for (var i = 0; i < 5 && i < scores.length; i++) {
				var ypos = screenBounds.top + off.y + 192 + i * 64;
				var txtBounds = collisionBox.fromSides(screenBounds.left + padding, ypos, screenBounds.right - padding, ypos + 32);
				var style = i < this.scoreStyles.length ? this.scoreStyles[i] : this.scoreStyles[this.scoreStyles.length - 1];
				var block = new textBlock("", style, txtBounds);

				// generate score name text graphic
				block.setStylesHAlign(0);
				block.setText(scores[i].name);
				var nameText = preRenderedText.fromBlock(block);

				// generate score value text graphic
				block.setStylesHAlign(1);
				block.setText(scores[i].score.toString());
				var scoreText = preRenderedText.fromBlock(block);

				this.scoreNames.push(nameText);
				this.scoreValues.push(scoreText);
			}
		}
	}, {
		key: "drawInternals",
		value: function drawInternals() {
			var ths = this;
			// draw the scoreboard text
			this.scoreNames.forEach(function (name, i) {
				var n = name;
				switch (i) {
					case 0:
						n = n.animated(ths.anim_place1);break;
					case 1:
						n = n.animated(ths.anim_place2);break;
					default:
						n = n.animated(scoring.getRankColorAnim(i + 1));break;
				}
				n.draw();
			});
			this.scoreValues.forEach(function (score, i) {
				var s = score;
				switch (i) {
					case 0:
						s = s.animated(ths.anim_value1);break;
					case 1:
						s = s.animated(ths.anim_value2);break;
					default:
						s = s.animated(scoring.getRankColorAnim(i + 1));break;
				}
				s.draw();
			});

			// draws the title
			var style = new textStyle(fonts.large, textColor.green, 2);
			textRenderer.drawText("SCOREBOARD", new vec2(screenBounds.center.x, screenBounds.top + 100), style, this.titleAnim);
		}
	}]);

	return state_scoreboard;
}(state_menuState);
// the credits screen


var state_credits = function (_state_menuState4) {
	_inherits(state_credits, _state_menuState4);

	function state_credits() {
		_classCallCheck(this, state_credits);

		var _this13 = _possibleConstructorReturn(this, (state_credits.__proto__ || Object.getPrototypeOf(state_credits)).call(this));

		_this13.setTitle("Credits");
		return _this13;
	}

	_createClass(state_credits, [{
		key: "addButtons",
		value: function addButtons() {
			var ths = this;
			var off = 0;
			var dif = 40;
			var tpos = new vec2(screenBounds.center.x, screenBounds.top + 165);

			// technostalgic
			this.buttons.push(menuButton.buildCreditsLink("Technostalgic", "Technostalgic programmed the game and everything you love about it! I also made some of the graphics", "http://technostalgic.itch.io/", tpos.plus(new vec2(0, off * dif)), textStyle.getDefault().setColor(textColor.yellow), new textAnim_compound([new textAnim_rainbow(), new textAnim_yOffset(1000, 10), new textAnim_rotationOffset(1000, 0.25)])));off++;
			off += 0.5;

			var scaleAnim = new textAnim_scale(500, 0.85, 1.15);
			scaleAnim.animType = textAnimType.trigonometricCycle;
			scaleAnim.looping = true;

			this.buttons.push(menuButton.buildCreditsLink("Surt", "Surt made the sweet pixel art graphics for the pipes!", "https://opengameart.org/users/surt", tpos.plus(new vec2(0, off * dif)), textStyle.getDefault().setColor(textColor.cyan), new textAnim_compound([new textAnim_blink(500, 0.1, textColor.yellow), scaleAnim])));off++;
			this.buttons.push(menuButton.buildCreditsLink("J-Robot", "J-Robot created the retro fonts and the explosion effect", "https://opengameart.org/users/j-robot", tpos.plus(new vec2(0, off * dif)), textStyle.getDefault().setColor(textColor.cyan), new textAnim_compound([new textAnim_blink(500, 0.1, textColor.yellow), scaleAnim])));off++;
			//this.buttons.push(
			//	menuButton.buildCreditsLink(
			//		"Puddin",
			//		"Puddin animated the coin graphic",
			//		"https://opengameart.org/users/puddin",
			//		tpos.plus(new vec2(0, off * dif)),
			//		textStyle.getDefault().setColor(textColor.cyan),
			//		new textAnim_compound([
			//			new textAnim_blink(500, 0.1, textColor.yellow),
			//			scaleAnim
			//		])
			//	)
			//); off++;
			off += 0.5;

			this.buttons.push(menuButton.buildCreditsLink("gega", "gega composed the modern sound track that goes so well with the gameplay", "https://opengameart.org/users/gega", tpos.plus(new vec2(0, off * dif)), textStyle.getDefault().setColor(textColor.cyan), new textAnim_compound([new textAnim_blink(500, 0.1, textColor.yellow), scaleAnim])));off++;
			this.buttons.push(menuButton.buildCreditsLink("Necrosome", "Ethan Nickerson slammed his face against his keyboard until the menu music somehow came out of that", "https://atsugotwasted.bandcamp.com/releases", tpos.plus(new vec2(0, off * dif)), textStyle.getDefault().setColor(textColor.cyan), new textAnim_compound([new textAnim_blink(500, 0.1, textColor.yellow), scaleAnim])));off++;
			off += 0.5;

			this.buttons.push(menuButton.buildCreditsLink("Ogrebane", "Ogrebane made all those metallic clanking sound effects that you hear in the game", "https://opengameart.org/users/ogrebane", tpos.plus(new vec2(0, off * dif)), textStyle.getDefault().setColor(textColor.cyan), new textAnim_compound([new textAnim_blink(500, 0.1, textColor.yellow), scaleAnim])));off++;
			this.buttons.push(menuButton.buildCreditsLink("SubspaceAudio", "SubspaceAudio designed all the bleep bloops and other retro sounding old school 16 bit sound effects", "https://opengameart.org/users/subspaceaudio", tpos.plus(new vec2(0, off * dif)), textStyle.getDefault().setColor(textColor.cyan), new textAnim_compound([new textAnim_blink(500, 0.1, textColor.yellow), scaleAnim])));off++;

			// list button
			var action_list = function action_list() {
				window.open("./credits.txt", "_blank");
			};
			this.buttons.push(new menuButton().construct("list", new vec2(screenBounds.center.x, screenBounds.bottom - 145), "get the full credits list", action_list));

			// back button
			var action_switchToPreviousMenu = function action_switchToPreviousMenu() {
				if (ths.previousState) ths.switchToPreviousState();else gameState.switchState(new state_mainMenu());
			};
			this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the previous menu", action_switchToPreviousMenu));
		}
	}]);

	return state_credits;
}(state_menuState);

// a gameState object that represents the options screen interface


var state_optionsMenu = function (_state_menuState5) {
	_inherits(state_optionsMenu, _state_menuState5);

	function state_optionsMenu() {
		_classCallCheck(this, state_optionsMenu);

		var _this14 = _possibleConstructorReturn(this, (state_optionsMenu.__proto__ || Object.getPrototypeOf(state_optionsMenu)).call(this));

		_this14.setTitle("OPTIONS");
		_this14.previousMenu = null;
		return _this14;
	}

	_createClass(state_optionsMenu, [{
		key: "addButtons",
		value: function addButtons() {
			this.buttons = [];
			var ths = this;
			var off = 0;
			var dif = 45;
			var tpos = new vec2(screenBounds.center.x, screenBounds.top + 200);

			// saving 
			this.buttons.push(new settingButton().construct("Save Data", tpos.plus(new vec2(0, off * dif)), "if disabled new high scores or changes to settings will not be saved", true).setGettersAndSetters(settingButton.generateGetValueFunc("saving"), settingButton.generateSetValueFunc("saving")).generateSettingPreRenders());
			off += 1.5;

			// audio, video, game options
			var action_gotoAudioOps = function action_gotoAudioOps() {
				gameState.switchState(new state_audioOptions());
			};
			this.buttons.push(new menuButton().construct("Audio", tpos.plus(new vec2(0, off * dif)), "configure audio settings", action_gotoAudioOps));off++;
			var action_gotoVideoOps = function action_gotoVideoOps() {
				gameState.switchState(new state_videoOptions());
			};
			this.buttons.push(new menuButton().construct("Video", tpos.plus(new vec2(0, off * dif)), "configure video settings", action_gotoVideoOps));off++;
			var action_gotoGameOps = function action_gotoGameOps() {
				gameState.switchState(new state_gameOptions());
			};
			this.buttons.push(new menuButton().construct("Game", tpos.plus(new vec2(0, off * dif)), "configure game settings", action_gotoGameOps));off++;

			var action_gotoControlSettings = function action_gotoControlSettings() {
				gameState.switchState(new state_controlOptions());
			};
			this.buttons.push(new menuButton().construct("Controls", tpos.plus(new vec2(0, off * dif)), "customize the controls", action_gotoControlSettings));
			off++;

			// back button
			var action_switchToPreviousMenu = function action_switchToPreviousMenu() {
				if (ths.previousState) ths.switchToPreviousState();else gameState.switchState(new state_mainMenu());
			};
			this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the previous menu", action_switchToPreviousMenu));
		}
	}, {
		key: "switchFrom",
		value: function switchFrom() {
			var tostate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			applyConfig();
			saveConfig();
		}
	}]);

	return state_optionsMenu;
}(state_menuState);
// generic options submenu that will be inherited from submenus of the the options menu


var state_optionsSubMenu = function (_state_menuState6) {
	_inherits(state_optionsSubMenu, _state_menuState6);

	function state_optionsSubMenu() {
		_classCallCheck(this, state_optionsSubMenu);

		var _this15 = _possibleConstructorReturn(this, (state_optionsSubMenu.__proto__ || Object.getPrototypeOf(state_optionsSubMenu)).call(this));

		_this15.buttonStartPos = screenBounds.top + 200;
		return _this15;
	}

	_createClass(state_optionsSubMenu, [{
		key: "addButtons",
		value: function addButtons() {
			var ths = this;
			this.buttons = [];
			this.addSubMenuButtions();

			// back button
			var action_backToOptions = function action_backToOptions() {
				if (ths.previousState) ths.switchToPreviousState();else gameState.switchState(new state_mainMenu());
			};
			this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to previous menu", action_backToOptions));
		}
	}, {
		key: "addSubMenuButtions",
		value: function addSubMenuButtions() {}
	}, {
		key: "switchFrom",
		value: function switchFrom() {
			var tostate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			applyConfig();
			saveConfig();
		}
	}]);

	return state_optionsSubMenu;
}(state_menuState);

var state_audioOptions = function (_state_optionsSubMenu) {
	_inherits(state_audioOptions, _state_optionsSubMenu);

	function state_audioOptions() {
		_classCallCheck(this, state_audioOptions);

		var _this16 = _possibleConstructorReturn(this, (state_audioOptions.__proto__ || Object.getPrototypeOf(state_audioOptions)).call(this));

		_this16.setTitle("AUDIO");
		return _this16;
	}

	_createClass(state_audioOptions, [{
		key: "addSubMenuButtions",
		value: function addSubMenuButtions() {
			var off = 0;
			var dif = 40;
			var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);

			// audio ops:
			// Track
			// Music Volume
			// Sound Volume
			//this.buttons.push(new settingButton().construct("track", tpos.plus(new vec2(0, off * dif)), "choose the song that plays during the game",
			//	).setGettersAndSetters(null, null
			//	).setValueBounds(0, 1, 0.1, buttonSwitchMode.enumeration).generateSettingPreRenders() ); 
			//	off += 1.5;
			this.buttons.push(new settingButton().construct("Music Volume", tpos.plus(new vec2(0, off * dif)), "the volume level of the music", true).setGettersAndSetters(settingButton.generateGetValueFunc("volume_music"), settingButton.generateSetValueFunc("volume_music")).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Sound Volume", tpos.plus(new vec2(0, off * dif)), "the volume level of the sound effects").setGettersAndSetters(settingButton.generateGetValueFunc("volume_sound"), settingButton.generateSetValueFunc("volume_sound")).setValueBounds(0, 1, 0.1, buttonSwitchMode.percent).generateSettingPreRenders());
		}
	}]);

	return state_audioOptions;
}(state_optionsSubMenu);

var state_videoOptions = function (_state_optionsSubMenu2) {
	_inherits(state_videoOptions, _state_optionsSubMenu2);

	function state_videoOptions() {
		_classCallCheck(this, state_videoOptions);

		var _this17 = _possibleConstructorReturn(this, (state_videoOptions.__proto__ || Object.getPrototypeOf(state_videoOptions)).call(this));

		_this17.setTitle("VIDEO");
		return _this17;
	}

	_createClass(state_videoOptions, [{
		key: "addSubMenuButtions",
		value: function addSubMenuButtions() {
			var off = 0;
			var dif = 40;
			var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);

			// Animated Text
			// Explosions
			// Image Smoothing
			// Scale Smoothing
			this.buttons.push(new settingButton().construct("Animated Text", tpos.plus(new vec2(0, off * dif)), "whether or not text animations are enabled - may increase performance if disabled").setGettersAndSetters(settingButton.generateGetValueFunc("animText"), settingButton.generateSetValueFunc("animText")).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Explosions", tpos.plus(new vec2(0, off * dif)), "whether or not explosion or smoke effects appear when a tile is destroyed - may increase performance if disabled").setGettersAndSetters(settingButton.generateGetValueFunc("explosionEffects"), settingButton.generateSetValueFunc("explosionEffects")).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Image Smoothing", tpos.plus(new vec2(0, off * dif)), "enable if you want ugly blurs or keep disabled for nice crispy pixel graphics", true).setGettersAndSetters(settingButton.generateGetValueFunc("imageSmoothing"), settingButton.generateSetValueFunc("imageSmoothing")).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Scale Smoothing", tpos.plus(new vec2(0, off * dif)), "whether or not the scaled render context will be smoothed - generally looks better if the canvas is rendering at a smaller than native resolution", true).setGettersAndSetters(settingButton.generateGetValueFunc("scaleSmoothing"), settingButton.generateSetValueFunc("scaleSmoothing")).generateSettingPreRenders());off++;

			// fit to screen
			var action_fitToScreen = function action_fitToScreen() {};
			this.buttons.push(new settingButton().construct("Screen Fit", tpos.plus(new vec2(0, off * dif)), "choose the way that the game canvas fits to the screen", true).setEnumGetterAndSetter(canvasScaleMode, "canvasScaleMode"));off += 1.2;
		}
	}]);

	return state_videoOptions;
}(state_optionsSubMenu);

var state_gameOptions = function (_state_optionsSubMenu3) {
	_inherits(state_gameOptions, _state_optionsSubMenu3);

	function state_gameOptions() {
		_classCallCheck(this, state_gameOptions);

		var _this18 = _possibleConstructorReturn(this, (state_gameOptions.__proto__ || Object.getPrototypeOf(state_gameOptions)).call(this));

		_this18.setTitle("GAME");
		return _this18;
	}

	_createClass(state_gameOptions, [{
		key: "addSubMenuButtions",
		value: function addSubMenuButtions() {
			var off = 0;
			var dif = 40;
			var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
			var ths = this;

			// game ops:
			// Tooltips
			// Arrow Indicators
			// Path Indicators

			this.buttons.push(new settingButton().construct("Tooltips", tpos.plus(new vec2(0, off * dif)), "whether or not tooltips should appear in-game to help you learn how to play").setGettersAndSetters(settingButton.generateGetValueFunc("tooltipsEnabled"), settingButton.generateSetValueFunc("tooltipsEnabled")).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Arrow Indicators", tpos.plus(new vec2(0, off * dif)), "arrows appear while you are placing a ball to suggest possible tube entrances for the ball").setGettersAndSetters(settingButton.generateGetValueFunc("arrowIndicators"), settingButton.generateSetValueFunc("arrowIndicators")).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Path Indicators", tpos.plus(new vec2(0, off * dif)), "projected paths of the ball will be shown when deciding which direction to go at an intersection").setGettersAndSetters(settingButton.generateGetValueFunc("pathIndicators"), settingButton.generateSetValueFunc("pathIndicators")).generateSettingPreRenders());
			off += 1.5;

			// Reset Tooltips
			// Reset Config
			// Reset Scores 

			var action_resetTooltips = function action_resetTooltips() {
				seenTips = [];
			};
			this.buttons.push(new menuButton().construct("Reset Tooltips", tpos.plus(new vec2(0, off * dif)), "forgets the tooltips that have already been shown so that all tooltips will be shown again", action_resetTooltips));
			off += 1.2;
			var action_resetConfig = function action_resetConfig() {
				gameState.switchState(new state_confirmationDialogue(function () {
					setDefaultConfig();saveConfig();ths.addButtons();
				}));
			};
			this.buttons.push(new menuButton().construct("Reset Config", tpos.plus(new vec2(0, off * dif)), "resets the game configuration and settings back to default", action_resetConfig));
			off += 1.2;
			var action_resetScores = function action_resetScores() {
				gameState.switchState(new state_confirmationDialogue(function () {
					setDefaultScores();
					localStorage.removeItem(storageKeys.scoreboard);
					loadScores();
				}));
			};
			this.buttons.push(new menuButton().construct("Reset Scores", tpos.plus(new vec2(0, off * dif)), "removes all high score data", action_resetScores));
		}
	}]);

	return state_gameOptions;
}(state_optionsSubMenu);

var state_controlOptions = function (_state_optionsSubMenu4) {
	_inherits(state_controlOptions, _state_optionsSubMenu4);

	function state_controlOptions() {
		_classCallCheck(this, state_controlOptions);

		var _this19 = _possibleConstructorReturn(this, (state_controlOptions.__proto__ || Object.getPrototypeOf(state_controlOptions)).call(this));

		_this19.setTitle("CONTROLS");
		return _this19;
	}

	_createClass(state_controlOptions, [{
		key: "addSubMenuButtions",
		value: function addSubMenuButtions() {
			var off = 0;
			var dif = 40;
			var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
			var ths = this;

			// Touch Mode: on/off
			var action_touchModeSetter = function action_touchModeSetter(val) {
				config.touchMode = val;
				config.touchModeSpecified = true;
			};
			this.buttons.push(new settingButton().construct("Touch Mode", tpos.plus(new vec2(0, off * dif)), "optomized control mode for touchscreen devices").setGettersAndSetters(settingButton.generateGetValueFunc("touchMode"), action_touchModeSetter).generateSettingPreRenders());

			// Edit Keys
			// Touch Options

			off += 1.5;
			var action_gotoConfigureKeybindings = function action_gotoConfigureKeybindings() {
				gameState.switchState(new state_configureKeybindings());
			};
			this.buttons.push(new menuButton().construct("Edit Keys", tpos.plus(new vec2(0, off * dif)), "change the key bindings for the keyboard controls", action_gotoConfigureKeybindings));
			off += 1.2;

			var action_gotoTouchControls = function action_gotoTouchControls() {
				gameState.switchState(new state_touchOptions());
			};
			this.buttons.push(new menuButton().construct("Touch Options", tpos.plus(new vec2(0, off * dif)), "configure the options for touchscreen controls", action_gotoTouchControls));
		}
	}]);

	return state_controlOptions;
}(state_optionsSubMenu);

var state_touchOptions = function (_state_optionsSubMenu5) {
	_inherits(state_touchOptions, _state_optionsSubMenu5);

	function state_touchOptions() {
		_classCallCheck(this, state_touchOptions);

		var _this20 = _possibleConstructorReturn(this, (state_touchOptions.__proto__ || Object.getPrototypeOf(state_touchOptions)).call(this));

		_this20.setTitle("TOUCHSCREEN");
		return _this20;
	}

	_createClass(state_touchOptions, [{
		key: "addSubMenuButtions",
		value: function addSubMenuButtions() {
			var off = 0;
			var dif = 40;
			var tpos = new vec2(screenBounds.center.x, this.buttonStartPos);
			var ths = this;

			// Haptic Pulses: on/off
			// Swipe Radius: 0.1 - 2.0 (+/- 0.1)

			this.buttons.push(new settingButton().construct("Touchscreen Mode", tpos.plus(new vec2(0, off * dif)), "optomized control mode for touchscreen devices").setGettersAndSetters(settingButton.generateGetValueFunc("touchMode"), settingButton.generateSetValueFunc("touchMode")).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Haptic Pulses", tpos.plus(new vec2(0, off * dif)), "whether or not the device vibrates to provide haptic feedback when pressing buttons or operating controls").setGettersAndSetters(settingButton.generateGetValueFunc("hapticPulses"), settingButton.generateSetValueFunc("hapticPulses")).generateSettingPreRenders());off++;
			this.buttons.push(new settingButton().construct("Swipe Radius", tpos.plus(new vec2(0, off * dif)), "the in-game sensitivity to swipe actions: lower numbers are more sensitive").setGettersAndSetters(settingButton.generateGetValueFunc("swipeRadius"), settingButton.generateSetValueFunc("swipeRadiusV")).setValueBounds(0.1, 2, 0.1, buttonSwitchMode.percent).generateSettingPreRenders());off++;
		}
	}]);

	return state_touchOptions;
}(state_optionsSubMenu);

// a keybinding configuration screen


var state_configureKeybindings = function (_state_menuState7) {
	_inherits(state_configureKeybindings, _state_menuState7);

	function state_configureKeybindings() {
		_classCallCheck(this, state_configureKeybindings);

		var _this21 = _possibleConstructorReturn(this, (state_configureKeybindings.__proto__ || Object.getPrototypeOf(state_configureKeybindings)).call(this));

		_this21.setTitle("CONTROLS");
		return _this21;
	}

	_createClass(state_configureKeybindings, [{
		key: "addButtons",
		value: function addButtons() {
			var retrievecontrols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (retrievecontrols) this.controls = this.getControls();
			this.buttons = [];
			var off = 0;
			var dif = 32;
			var tpos = new vec2(screenBounds.center.x, screenBounds.top + 155);
			var ths = this;

			// create control mapping button for each control
			Object.keys(this.controls).forEach(function (key) {
				var btn = new settingButton();
				btn.construct(key, tpos.plus(new vec2(0, off * dif)), "change input for " + key);
				btn.mode = buttonSwitchMode.directValue;
				btn.setGettersAndSetters(function () {
					return controlState.keyCodeToName(ths.controls[key]);
				}, function (val) {
					ths.controls[key] = val;
				});

				// sets the button's action to rebind the control to the next key that the player presses
				var listener = function listener(e) {
					btn.changeValue(e.keyCode);
					log("temp list control '" + key + "' changed to key '" + controlState.keyCodeToName(ths.controls[key]) + "'", logType.notify);
					controlState.resetControlChangeListener();
				};
				btn.action = function () {
					ths.selectionFocus = true;
					window.addEventListener("keydown", listener);
					controlState.controlChangeListener = listener;
				};

				// so menu navigate left/right doesn't do anything
				btn.increment = null;
				btn.decrement = null;

				// adds the button to the button array and increments the offset
				ths.buttons.push(btn.generateSettingPreRenders());
				off++;
			});

			// defaults button
			var action_setDefaultControls = function action_setDefaultControls() {
				ths.controls = getDefaultControls(); // sets the controls to the default controls
				ths.addButtons(false); // refresh the buttons
				ths.currentSelection = ths.buttons.length - 2; // sets the currently selected button to be on the defaults button
			};
			this.buttons.push(new menuButton().construct("Defaults", new vec2(screenBounds.center.x, screenBounds.bottom - 144), "reset keys to the default configuration", action_setDefaultControls));

			// back button
			var action_backToOptions = function action_backToOptions() {
				if (ths.previousState) ths.switchToPreviousState();else gameState.switchState(new state_mainMenu());
			};
			this.buttons.push(new menuButton().construct("Back", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to previous menu", action_backToOptions));
		}
	}, {
		key: "getControls",
		value: function getControls() {
			var c = {};
			Object.keys(controlState.controls).forEach(function (key) {
				c[key] = controlState.controls[key];
			});
			return c;
		}
	}, {
		key: "switchFrom",
		value: function switchFrom() {
			var tostate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			controlState.setControls(this.controls);
			saveControls();
		}
	}]);

	return state_configureKeybindings;
}(state_menuState);
// when the game is paused


var state_pauseMenu = function (_state_menuState8) {
	_inherits(state_pauseMenu, _state_menuState8);

	function state_pauseMenu() {
		_classCallCheck(this, state_pauseMenu);

		var _this22 = _possibleConstructorReturn(this, (state_pauseMenu.__proto__ || Object.getPrototypeOf(state_pauseMenu)).call(this));

		_this22.resumeState = null;
		_this22.setTitle("GAME PAUSED");
		return _this22;
	}

	_createClass(state_pauseMenu, [{
		key: "addButtons",
		value: function addButtons() {
			// adds buttons to the interface
			this.buttons = [];
			var ths = this;
			var off = 0;
			var dif = 55;

			var ths = this;
			var action_resumeGame = function action_resumeGame() {
				ths.resume();
			};
			var action_switchToScoreboard = function action_switchToScoreboard() {
				gameState.switchState(new state_scoreboard());
			};
			var action_switchToOptions = function action_switchToOptions() {
				gameState.switchState(new state_optionsMenu());
			};
			var action_quitSession = function action_quitSession() {
				goToMainMenu();
			};

			this.buttons.push(new menuButton().construct("Resume", screenBounds.center.plus(new vec2(0, off * dif)), "resumes the gameplay", action_resumeGame));off++;
			this.buttons.push(new menuButton().construct("Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), "view the highest scoring players", action_switchToScoreboard));off++;
			this.buttons.push(new menuButton().construct("Options", screenBounds.center.plus(new vec2(0, off * dif)), "configure gameplay and av options", action_switchToOptions));off++;
			this.buttons.push(new menuButton().construct("Quit", screenBounds.center.plus(new vec2(0, off * dif)), "quit the current game and return to the main menu", action_quitSession));off++;
		}
	}, {
		key: "setResumeState",
		value: function setResumeState(gameplayState) {
			this.resumeState = gameplayState;
		}
	}, {
		key: "resume",
		value: function resume() {
			gameState.switchState(this.resumeState);
			audioMgr.resumeMusic();
		}
	}]);

	return state_pauseMenu;
}(state_menuState);
// the screen that displays when the player loses


var state_gameOver = function (_state_menuState9) {
	_inherits(state_gameOver, _state_menuState9);

	function state_gameOver() {
		_classCallCheck(this, state_gameOver);

		var _this23 = _possibleConstructorReturn(this, (state_gameOver.__proto__ || Object.getPrototypeOf(state_gameOver)).call(this));

		_this23.lostGame = null;
		_this23.setTitle("GAME OVER");
		return _this23;
	}

	_createClass(state_gameOver, [{
		key: "addButtons",
		value: function addButtons() {
			// adds buttons to the interface
			this.buttons = [];
			var ths = this;
			var off = 0;
			var dif = 55;

			var ths = this;
			var action_restartGame = function action_restartGame() {
				startNewGame();
			};
			var action_switchToScoreboard = function action_switchToScoreboard() {
				gameState.switchState(new state_scoreboard());
			};
			var action_switchToOptions = function action_switchToOptions() {
				gameState.switchState(new state_optionsMenu());
			};
			var action_quitSession = function action_quitSession() {
				goToMainMenu();
			};

			this.buttons.push(new menuButton().construct("Main Menu", screenBounds.center.plus(new vec2(0, off * dif)), "return to the main menu", action_quitSession));off++;
			this.buttons.push(new menuButton().construct("Scoreboard", screenBounds.center.plus(new vec2(0, off * dif)), "view the highest scoring players", action_switchToScoreboard));off++;
			this.buttons.push(new menuButton().construct("Restart", screenBounds.center.plus(new vec2(0, off * dif)), "start a new game", action_restartGame));
		}
	}, {
		key: "setLostGame",
		value: function setLostGame(gameplaystate) {
			this.lostGame = gameplaystate;
		}
	}, {
		key: "switchFrom",
		value: function switchFrom(tostate) {
			audioMgr.resumeMusic();
			if (!audioMgr.currentMusic) {
				var song = tostate instanceof state_gameplayState ? music.modern : music.menu;
				audioMgr.playMusic(song);
			}
		}
	}, {
		key: "switchTo",
		value: function switchTo(fromstate) {
			audioMgr.pauseMusic();
		}
	}, {
		key: "drawBG",
		value: function drawBG() {
			this.lostGame.draw();
			var rect = new collisionBox(new vec2(), new vec2(renderTarget.width, renderTarget.height));
			rect.drawFill(renderContext, "rgba(0, 0, 0, 0.5)");
		}
	}, {
		key: "draw",
		value: function draw() {
			if (!this.initialized) this.initialize();

			//draws the faded tiles in the background 
			this.drawBG();

			// draws all the user-defined graphics that aren't buttons
			this.drawInternals();
			this.drawTitle();

			// renders all the buttons
			var ths = this;
			this.buttons.forEach(function (btn, i) {
				var sel = i == ths.currentSelection;
				btn.draw(sel);
			});

			// renders the foreground border
			drawForegroundBorder();
		}
	}]);

	return state_gameOver;
}(state_menuState);

var state_gameOverRanked = function (_state_gameOver) {
	_inherits(state_gameOverRanked, _state_gameOver);

	function state_gameOverRanked() {
		_classCallCheck(this, state_gameOverRanked);

		var _this24 = _possibleConstructorReturn(this, (state_gameOverRanked.__proto__ || Object.getPrototypeOf(state_gameOverRanked)).call(this));

		_this24.setTitle("RANK ACHIEVED!", null, new textAnim_yOffset());

		_this24.rank = 0;
		_this24.rankPR = null;
		_this24.scorePR = null;
		_this24.scoreAnim = null;
		_this24.promptPR = preRenderedText.fromString(responsiveText("Press Enter to Continue", "Swipe up to Continue"), new vec2(screenBounds.center.x, screenBounds.bottom - 100));
		return _this24;
	}

	_createClass(state_gameOverRanked, [{
		key: "setRank",
		value: function setRank(rank, score) {
			// generate the preRenders and styles that require information about the player's rank
			this.rank = rank;
			this.score = score;

			var rCol = scoring.getRankStyle(rank + 1).color;

			// the text that tells you what rank you got
			this.rankPR = preRenderedText.fromBlock(new textBlock("You ranked (" + (rank + 1).toString() + ")[" + scoring.getRankSuffix(rank + 1) + "] place 1| on the scoreboard!", textStyle.getDefault(), new collisionBox(new vec2(50, screenBounds.center.y - 150), new vec2(screenBounds.width - 100, 100)), [textStyle.getDefault().setColor(rCol), new textStyle(fonts.small).setColor(rCol).setAlignment(0.5, 0)]));

			// the text that shows you your score
			this.scorePR = preRenderedText.fromString(scoring.getCurrentScore().toString() + " Pts", screenBounds.center, scoring.getRankStyle(rank + 1).setScale(2));

			this.scoreAnim = new textAnim_compound([scoring.getRankColorAnim(rank + 1), new textAnim_yOffset(500, 10, 0.2)]);
		}
	}, {
		key: "controlTap",
		value: function controlTap(action) {
			if (action == controlAction.select) this.finishState();
		}
	}, {
		key: "touchMove",
		value: function touchMove(pos, touch) {
			if (pos.y <= controlState.touchStartPos.y - 75 * config.swipeRadius) this.finishState();
		}
	}, {
		key: "finishState",
		value: function finishState() {
			var stt = new state_nameEntry();
			stt.setRank(this.rank, this.score);
			gameState.switchState(stt);
		}
	}, {
		key: "addButtons",
		value: function addButtons() {}
	}, {
		key: "drawInternals",
		value: function drawInternals() {
			this.rankPR.draw();
			this.scorePR.animated(this.scoreAnim).draw();

			if (timeElapsed % 1000 >= 500) this.promptPR.draw();
		}
	}]);

	return state_gameOverRanked;
}(state_gameOver);
// name entry screen for scoreboard rankers


var state_nameEntry = function (_state_menuState10) {
	_inherits(state_nameEntry, _state_menuState10);

	function state_nameEntry() {
		_classCallCheck(this, state_nameEntry);

		var _this25 = _possibleConstructorReturn(this, (state_nameEntry.__proto__ || Object.getPrototypeOf(state_nameEntry)).call(this));

		_this25.name = "";
		_this25.maxLength = 12;
		_this25.rank = 0;
		_this25.score = 0;
		_this25.rankText = null;
		_this25.rankAnim = null;
		_this25.prompt = null;
		_this25.setTitle("Well Done!", new textStyle(fonts.large, textColor.light, 2), new textAnim_scaleTransform(1000, 1, 1.15, 0.1).setAnimType(textAnimType.trigonometricCycle));
		return _this25;
	}

	_createClass(state_nameEntry, [{
		key: "addButtons",
		value: function addButtons() {
			var ths = this;
			var action_continue = function action_continue() {
				ths.finishEntry();
			};
			this.buttons.push(new menuButton().construct("Continue", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "proceed to scoreboard", action_continue));
		}
	}, {
		key: "setRank",
		value: function setRank(rank, score) {
			// informs the gamestate to stylize for the specified rank
			var rSTR = (rank + 1).toString() + '(' + scoring.getRankSuffix(rank + 1) + ')';
			var anms = [];

			this.rank = rank;
			this.score = score;

			// the rank text style
			var style = [textStyle.getDefault().setColor(textColor.yellow), textStyle.getDefault().setColor(textColor.green), textStyle.getDefault().setColor(textColor.cyan), textStyle.getDefault().setColor(textColor.blue), textStyle.getDefault().setColor(textColor.pink)];
			style = style[rank];

			// set the animations
			switch (rank + 1) {
				case 1:
					anms = [
					//new textAnim_scale(500, 0.75, 1.25, 0.1).setAnimType(textAnimType.trigonometricCycle),
					new textAnim_rainbow()];
					break;
				case 2:
					anms = [
					//new textAnim_yOffset(500, 3, 0.5),
					new textAnim_blink(500, 0.5, textColor.yellow)];
					break;
			}
			if (anms.length > 0) this.rankAnim = new textAnim_compound(anms);

			var rankBlock = new textBlock("You ranked " + rSTR + " place!", style, new collisionBox(new vec2(0, screenBounds.center.y - 120), new vec2(screenBounds.width, 32)), [new textStyle(fonts.small, style.color).setAlignment(0.5, 0)]);
			var promptTxt = responsiveText("Enter your name below:", "Tap to enter your name below:");

			this.rankText = preRenderedText.fromBlock(rankBlock);
			this.prompt = preRenderedText.fromString(promptTxt, screenBounds.center.minus(new vec2(0, 46)), new textStyle(fonts.small));
		}
	}, {
		key: "switchTo",
		value: function switchTo(fromstate) {
			window.addEventListener("keydown", state_nameEntry.keypress);
			_get(state_nameEntry.prototype.__proto__ || Object.getPrototypeOf(state_nameEntry.prototype), "switchTo", this).call(this, fromstate);
		}
	}, {
		key: "switchFrom",
		value: function switchFrom(tostate) {
			window.removeEventListener("keydown", state_nameEntry.keypress);
			_get(state_nameEntry.prototype.__proto__ || Object.getPrototypeOf(state_nameEntry.prototype), "switchFrom", this).call(this, tostate);
		}
	}, {
		key: "typeName",
		value: function typeName(keyCode) {
			// enters a character to this.name
			var chr = controlState.keyCodeToName(keyCode);
			if (chr.length > 1) chr = "";

			// if backspace is pressed
			if (keyCode == 8) this.name = this.name.substr(0, this.name.length - 1);
			if (keyCode == 13) {
				this.finishEntry();
			} else {
				if (keyCode == 32) chr = " ";
				this.name = this.name + chr;
			}

			// makes sure the name stays within the max length
			if (this.name.length > this.maxLength) this.name = this.name.substr(0, this.maxLength);
		}
	}, {
		key: "finishEntry",
		value: function finishEntry() {
			insertScore(this.rank, this.name, this.score);
			saveScores();

			var stt = new state_scoreboard();
			stt.addButtons = function () {
				stt.buttons.push(new menuButton().construct("Main Menu", new vec2(screenBounds.center.x, screenBounds.bottom - 100), "return to the main menu", function () {
					gameState.switchState(new state_mainMenu());
				}));
			};
			gameState.switchState(stt);
		}
	}, {
		key: "controlTap",
		value: function controlTap(action) {}
	}, {
		key: "touchStart",
		value: function touchStart(pos, touch) {
			if (pos.y <= 380 && pos.y >= 230) {
				this.name = prompt("Enter Name:");
				if (!this.name) this.name = "";
				if (this.name.length > this.maxLength) this.name = this.name.substr(0, this.maxLength);
			}
			_get(state_nameEntry.prototype.__proto__ || Object.getPrototypeOf(state_nameEntry.prototype), "touchStart", this).call(this, pos, touch);
		}
	}, {
		key: "drawName",
		value: function drawName() {
			// draws the name that is currently being typed by the player
			var nSTR = this.name;

			// adds a blinking ':' if the max length is not reached
			if (this.name.length < this.maxLength) nSTR = nSTR + (timeElapsed % 500 >= 250 ? ":" : "  ");else nSTR = nSTR + "";

			if (nSTR.length < 1) return;

			var nameStyle = textStyle.fromAlignment(0.5, 0);
			var namePR = preRenderedText.fromString(nSTR, screenBounds.center.minus(new vec2(0, 32)), nameStyle);

			if (this.rankAnim) namePR = namePR.animated(this.rankAnim);

			namePR.draw();
		}
	}, {
		key: "draw",
		value: function draw() {
			if (!this.initialized) this.initialize();
			_get(state_nameEntry.prototype.__proto__ || Object.getPrototypeOf(state_nameEntry.prototype), "draw", this).call(this);

			// if there is a rank animation, animate the rank text
			var rTXT = this.rankText;
			if (this.rankAnim) rTXT = this.rankText.animated(this.rankAnim);

			rTXT.draw();
			this.prompt.draw();
			this.drawName();
		}
	}], [{
		key: "keypress",
		value: function keypress(e) {
			gameState.current.typeName(e.keyCode);
		}
	}]);

	return state_nameEntry;
}(state_menuState);
// when the player is playing the game


var state_gameplayState = function (_gameState2) {
	_inherits(state_gameplayState, _gameState2);

	function state_gameplayState() {
		_classCallCheck(this, state_gameplayState);

		var _this26 = _possibleConstructorReturn(this, (state_gameplayState.__proto__ || Object.getPrototypeOf(state_gameplayState)).call(this));

		_this26.currentTouchPanel = null;

		_this26.tilesTagged = [];
		_this26.scoreBonus = {};
		_this26.resetScoreBonuses();

		_this26.floatingScoreFields = [];
		_this26.floatingScoreFieldKillStart = null;
		_this26.activeCombos = [];

		_this26.currentScore = 0;
		_this26.currentBallScore = 0;
		_this26.currentLevel = new level(1);
		_this26.scoreEmphasisAnim = new textAnim_scaleTransform(100, 1.5, 1);
		_this26.scoreEmphasisAnim.animType = textAnimType.easeIn;

		_this26.initUntil();
		_this26.nextTileforms = [];
		_this26.generateNextTileforms();
		_this26.switchGameplayPhase(new phase_placeTileform(_this26));
		_this26.tooltipProgress = tooltipProgression.getDefault();

		_this26.lastMousePressed = false;

		_this26.initHudPreRenders();
		_this26.updateHUDPreRenders();

		//animation stuff
		_this26.anim_HUDNextTileOff = 0;
		return _this26;
	}

	_createClass(state_gameplayState, [{
		key: "spawnBallAt",
		value: function spawnBallAt(pos, balltype) {
			//spawns a ball at the specified position and changes the phase to the ball physics phase
			if (!(this.phase instanceof phase_ballPhysics)) this.switchGameplayPhase(new phase_ballPhysics(this));

			var b = new ball(pos, balltype);
			this.phase.addBall(b);
		}
	}, {
		key: "getNextTileform",
		value: function getNextTileform() {
			// gets the next tileform and allows the player to control it
			if (this.currentLevel.isOver && this.nextTileforms.length <= 0) {
				this.endLevel();
				return;
			}

			if (!this.nextTileforms[0]) this.generateNextTileforms();

			log("next tileform retrieved", logType.notify);

			var ptf = new phase_placeTileform(this);
			this.switchGameplayPhase(ptf);
			ptf.setTileform(this.nextTileforms.splice(0, 1)[0], this.currentLevel.tfDropInterval);

			this.decrementUntil();
			this.generateNextTileforms();
			this.updateTileformDecrementPreRenders();

			this.resetScoreBonuses();

			// animation stuff
			this.anim_HUDNextTileOff = this.timeElapsed;
		}
	}, {
		key: "generateNextTileforms",
		value: function generateNextTileforms() {
			// generates a specified amount of tileforms and adds them to this.nextTileforms
			var c = 1;
			while (!this.untilHasValues() && !this.currentLevel.isOver) {
				this.nextTileforms = this.nextTileforms.concat(this.currentLevel.getRandomPieces(c));
				c++;
				this.findUntil();
			}
		}
	}, {
		key: "endLevel",
		value: function endLevel() {
			this.switchGameplayPhase(new phase_levelComplete(this));
			this.currentLevel.completeLevel(this);
			this.updateHUDPreRenders();
		}
	}, {
		key: "initUntil",
		value: function initUntil() {
			// initialize the 'until' fields, which keep track of how many tileForms must be used until the
			// specified peice type comes up
			this.until = {
				ball: null,
				bomb: null
			};
		}
	}, {
		key: "decrementUntil",
		value: function decrementUntil() {
			// decrements all the tileform 'until' fields, each time a new piece is gotten, and if any of the
			// fields reach below zero, the new 'until' counts are searched for
			var ths = this;
			var doSearch = false;
			Object.keys(this.until).forEach(function (key) {
				if (ths.until[key]) ths.until[key] -= 1;
				if (ths.until[key] <= 0 || ths.until[key] == null) doSearch = true;
			});
			if (doSearch) this.findUntil();
		}
	}, {
		key: "findUntil",
		value: function findUntil() {
			// finds the amount of tileforms that come before the next ball, and the next bomb, and store those
			// values in this.until
			this.initUntil();
			var ths = this;
			for (var i = this.nextTileforms.length - 1; i >= 0; i--) {
				if (this.nextTileforms[i].hasEntityType(entities.ball)) ths.until.ball = i;
				if (this.nextTileforms[i].hasEntity(blocks.block_bomb, entities.block)) ths.until.bomb = i;
			}
		}
	}, {
		key: "untilHasValues",
		value: function untilHasValues() {
			// if any of the fields in this.until are null, this function returns false
			var keys = Object.keys(this.until);
			for (var i = keys.length - 1; i >= 0; i--) {
				var key = keys[i];
				if (this.until[key] == null) return false;
			}
			return true;
		}
	}, {
		key: "setFloatingScoreField",
		value: function setFloatingScoreField(text, style, fieldID, exitAnim) {
			// sets the text and style of a specified floating score field that is drawn floating in the center of the tile grid

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.floatingScoreFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var field = _step.value;

					if (field.fieldID == fieldID) {
						field.setText(text, style, exitAnim);
						return;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var r = new floatingTextField();
			r.fieldID = fieldID;
			r.setText(text, style, exitAnim);
			this.floatingScoreFields.push(r);
		}
	}, {
		key: "getFloatingScoreField",
		value: function getFloatingScoreField(fieldID) {
			// gets the specified floating score field that is drawn floating in the center of the tile grid

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.floatingScoreFields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var field = _step2.value;

					if (field.fieldID == fieldID) return field;
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return null;
		}
	}, {
		key: "isTrackingCombo",
		value: function isTrackingCombo(comboID) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.activeCombos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var combo = _step3.value;

					if (combo.comboID == comboID) {
						return true;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	}, {
		key: "addToComboValue",
		value: function addToComboValue(comboID) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

			// adds a combo point to the specified score combo
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.activeCombos[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var _combo = _step4.value;

					if (_combo.comboID == comboID) {
						_combo.addValue(value);
						return;
					}
				}

				// if the combo doesn't exist, create a new one
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			var combo = scoreCombo.fromComboID(comboID);
			combo.addValue(value);
			this.activeCombos.push(combo);
		}
	}, {
		key: "endCombos",
		value: function endCombos() {
			// removes all the active combos and kills the floating score text
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.activeCombos[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var c = _step5.value;

					c.cashIn();
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			this.activeCombos = [];
			this.killFloatingScoreText();
			this.updateFloatingScoreText();
			this.currentBallScore = 0;
		}
	}, {
		key: "checkRank",
		value: function checkRank() {
			var place = null;

			for (var i = scores.length - 1; i >= 0; i--) {
				if (scores[i].score > this.currentScore) break;
				place = i;
			}

			var msg = place == null ? "player is not ranking in the scoreboard" : "player is ranked #" + (place + 1).toString();
			log(msg, logType.notify);

			return place;
		}
	}, {
		key: "killFloatingScoreText",
		value: function killFloatingScoreText() {
			// starts the floating score text's ending animation
			if (this.floatingScoreFieldKillStart) return;
			this.floatingScoreFieldKillStart = this.timeElapsed;
		}
	}, {
		key: "drawFloatingScoreText",
		value: function drawFloatingScoreText() {
			// renders the floating score text

			// makes the text blink if the ball is paused
			if (this.phase instanceof phase_ballPhysics) {
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = this.phase.balls[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var _ball = _step6.value;

						if (_ball.state == ballStates.paused) if (timeElapsed % 1000 >= 500) return;
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}
			}

			var scl = 1;
			var anm = false;

			// applies the ending animation to the floating score fields
			if (this.floatingScoreFieldKillStart) {
				anm = true; // tell the floating score field to start using it's emphasis animation
				var el = this.timeElapsed - this.floatingScoreFieldKillStart; // calculates the elapsed milleseconds since "killFloatingScoreText" was called
				var prog = el / 2000; // makes it a linear scale from 0 to 1

				// if 3/4 of the way done, start shrinking
				if (prog > 0.75) scl = 1 - 4 * (prog - 0.75);

				// if all the way done, remove floating score fields and reset animation
				if (prog >= 1) {
					this.floatingScoreFields = [];
					this.floatingScoreFieldKillStart = null;
				}
			}

			var spos = tile.toScreenPos(new vec2(4.5, 9));
			this.floatingScoreFields.forEach(function (field, i) {
				var tpos = spos.plus(new vec2(0, i * 32));
				field.draw(tpos, anm, scl);
			});
		}
	}, {
		key: "updateFloatingScoreText",
		value: function updateFloatingScoreText() {
			// increment the floating score text
			//if(!this.floatingScoreText) this.constructFloatingScoreText();

			if (this.currentBallScore <= 0) return;

			var txt = this.currentBallScore + " PTS";
			var style = textStyle.getDefault();

			//change the style based on the score
			if (this.currentBallScore >= 500) style.color = textColor.cyan;
			if (this.currentBallScore >= 1000) style.color = textColor.green;

			// apply the style and new text
			//this.floatingScoreText.style = style;
			//this.floatingScoreText.setText(txt);

			this.setFloatingScoreField(txt, style, floatingScoreFieldID.ballScore, new textAnim_blink(250, 0));
		}
	}, {
		key: "updateScoreVisuals",
		value: function updateScoreVisuals() {
			// makes the score animation pop and the floating score text increment
			this.scoreEmphasisAnim.resetAnim();
			this.updateFloatingScoreText();
			this.updateScorePreRender();
		}
	}, {
		key: "checkScoreBonuses",
		value: function checkScoreBonuses() {
			return;

			if (!this.scoreBonus.extraBall) if (this.currentBallScore >= 1000) {
				this.scoreBonus.extraBall = true;
				this.nextTileforms.splice(0, 0, tileform.getPiece_ball());
			}

			if (!this.scoreBonus.goldBall) if (this.currentBallScore >= 1500) {
				this.scoreBonus.goldBall = true;
				this.nextTileforms[0] = tileform.getPiece_ball(balls.gold);
			}
		}
	}, {
		key: "resetScoreBonuses",
		value: function resetScoreBonuses() {
			this.scoreBonus = {
				extraBall: false,
				goldBall: false
			};
		}
	}, {
		key: "switchGameplayPhase",
		value: function switchGameplayPhase(newphase) {
			// switches the active gameplayPhase from one to another
			if (this.phase) {
				this.killTouchPanel();
				log("gameplayPhase switching from '" + this.phase.constructor.name + "' to '" + newphase.constructor.name + "'");
				this.phase.end();
			}

			newphase.parentState = this;
			this.phase = newphase;
		}
	}, {
		key: "controlTap",
		value: function controlTap() {
			var control = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : controlAction.none;

			// called when a control is tapped
			if (control == controlAction.pause) {
				this.pauseGame();
				return;
			}

			this.phase.controlTap(control);
		}
	}, {
		key: "mouseTap",
		value: function mouseTap(pos) {
			this.touchStart(pos);
			this.lastMousePressed = true;
		}
	}, {
		key: "mouseMove",
		value: function mouseMove(pos) {
			this.touchMove(pos);
		}
	}, {
		key: "mouseUp",
		value: function mouseUp(pos) {
			this.touchEnd(pos);
			this.lastMousePressed = false;
		}
	}, {
		key: "handleMouseTouchEmulation",
		value: function handleMouseTouchEmulation() {
			// handles all the logic that has to do with emulating a touchscreen with the mouse
			if (this.lastMousePressed) if (!controlState.mouseDown) this.mouseUp(controlState.mousePos);
		}
	}, {
		key: "touchStart",
		value: function touchStart(pos, touch) {
			this.createTouchPanel(pos);
		}
	}, {
		key: "touchMove",
		value: function touchMove(pos, touch) {
			if (this.currentTouchPanel) this.currentTouchPanel.touchMove(pos, touch);
		}
	}, {
		key: "touchEnd",
		value: function touchEnd(pos, touch) {
			this.killTouchPanel();
		}
	}, {
		key: "createTouchPanel",
		value: function createTouchPanel(pos) {
			// creates the appropriate touch panel at the specified location
			if (pos.y <= 35) {
				this.setTouchPanel(this.getPauseTouchPanel(pos));
				return;
			}

			var tp = null;
			if (this.phase) tp = this.phase.getNewTouchPanelAt(pos);

			this.setTouchPanel(tp);
		}
	}, {
		key: "getPauseTouchPanel",
		value: function getPauseTouchPanel(pos) {
			var r = new touchPanel();
			var ths = this;
			r.activeDirections = [side.down];

			r.action_swipeDown = function () {
				gameState.current.controlTap(controlAction.pause);
				ths.killTouchPanel();
			};

			return r.spawn(pos);
		}
	}, {
		key: "setTouchPanel",
		value: function setTouchPanel(panel) {
			// sets the current touch panel to the specified touch panel
			this.currentTouchPanel = panel;
		}
	}, {
		key: "killTouchPanel",
		value: function killTouchPanel() {
			// kills the touch panel if there is one
			if (this.currentTouchPanel) this.currentTouchPanel.kill();
			this.currentTouchPanel = null;
		}
	}, {
		key: "pauseGame",
		value: function pauseGame() {
			var pauseState = new state_pauseMenu();
			pauseState.setResumeState(this);
			gameState.switchState(pauseState);

			audioMgr.pauseMusic();
		}
	}, {
		key: "loseGame",
		value: function loseGame() {
			// called when the player loses a game
			log("Game Ended", logType.notify);

			this.switchGameplayPhase(new phase_gameOver());
			audioMgr.stopMusic();

			audioMgr.playSound(sfx.gameOver);
		}
	}, {
		key: "switchFrom",
		value: function switchFrom(tostate) {
			scoring.rememberScore();
			_get(state_gameplayState.prototype.__proto__ || Object.getPrototypeOf(state_gameplayState.prototype), "switchFrom", this).call(this, tostate);
		}
	}, {
		key: "update",
		value: function update(dt) {
			// main logic step
			_get(state_gameplayState.prototype.__proto__ || Object.getPrototypeOf(state_gameplayState.prototype), "update", this).call(this, dt);
			this.handleMouseTouchEmulation();

			this.tooltipProgress.checkTooltips(this);

			updateEffects(dt);
			this.phase.update(dt);
			this.checkScoreBonuses();
		}
	}, {
		key: "initHudPreRenders",
		value: function initHudPreRenders() {
			var hudPreRenders = {};

			// draw next piece label:
			var nplPos = tile.toScreenPos(new vec2(12.5, 0));
			hudPreRenders.nplPreRender = preRenderedText.fromString("NEXT:", nplPos, textStyle.getDefault().setColor(textColor.yellow));

			// draw tileforms til next ball:
			var nballPos = tile.toScreenPos(new vec2(12, 7)).plus(new vec2(0, -22));
			hudPreRenders.nballLabelPreRender = preRenderedText.fromString("next ball:", nballPos, new textStyle(fonts.small));

			// draw tileforms til next bomb:
			var nbombPos = tile.toScreenPos(new vec2(12, 9)).plus(new vec2(0, -22));
			hudPreRenders.nbombLabelPreRender = preRenderedText.fromString("next bomb:", nbombPos, new textStyle(fonts.small));

			// bonus
			// var bonusPos = tile.toScreenPos(new vec2(12, 11)).plus(new vec2(0, -22));
			// hudPreRenders.bonusLabelPreRender = preRenderedText.fromString("bonus:", bonusPos, new textStyle(fonts.small));

			// current score
			var scorePos = tile.toScreenPos(new vec2(12, 18)).plus(new vec2(0, -22));
			hudPreRenders.scoreLabelPreRender = preRenderedText.fromString("score:", scorePos, new textStyle(fonts.small));

			// high score
			var hscoretext = scores[0].score.toString();
			var hscorePos = tile.toScreenPos(new vec2(12, 19)).plus(new vec2(0, 10));
			hudPreRenders.hscoreLabelPreRender = preRenderedText.fromString("high:", new vec2(hscorePos.x, hscorePos.y - 10), new textStyle(fonts.small));
			hudPreRenders.hscorePreRender = preRenderedText.fromString(hscoretext, hscorePos, new textStyle(fonts.small, textColor.green, 1));

			this.hudPreRenders = hudPreRenders;
		}
	}, {
		key: "updateHUDPreRenders",
		value: function updateHUDPreRenders() {
			this.updateTileformDecrementPreRenders();
			this.updateScorePreRender();

			// current level:
			var lvlPos = tile.toScreenPos(new vec2(12, 16));
			this.hudPreRenders.lvlPreRender = preRenderedText.fromString("LEVEL " + this.currentLevel.difficulty, lvlPos, new textStyle(fonts.large, this.currentLevel.getDifficultyColor()));
		}
	}, {
		key: "updateScorePreRender",
		value: function updateScorePreRender() {
			// draw the score
			var scoreText = this.currentScore.toString();
			var scorePos = tile.toScreenPos(new vec2(12, 18));
			this.hudPreRenders.scorePreRender = preRenderedText.fromString(scoreText, scorePos, new textStyle(fonts.large, textColor.green));
		}
	}, {
		key: "updateTileformDecrementPreRenders",
		value: function updateTileformDecrementPreRenders() {
			// draw tileform count til next ball:
			var nball = this.until.ball;
			if (nball == null) nball = "--";
			var nballPos = tile.toScreenPos(new vec2(12, 7));
			this.hudPreRenders.nballPreRender = preRenderedText.fromString(nball.toString(), nballPos, new textStyle(fonts.large, textColor.green));

			// draw tileforms til next bomb:
			var nbomb = this.until.bomb;
			if (nbomb == null) nbomb = "--";
			var nbombPos = tile.toScreenPos(new vec2(12, 9));
			this.hudPreRenders.nbombPreRender = preRenderedText.fromString(nbomb.toString(), nbombPos, new textStyle(fonts.large, textColor.red));

			// ??
			//var bonus = "none";
			//var bonusPos = tile.toScreenPos(new vec2(12, 11));
			//this.hudPreRenders.bonusPreRender = preRenderedText.fromString(bonus.toString(), bonusPos, textStyle.getDefault());

			// draw tileforms til next level:
			var lvlPos = tile.toScreenPos(new vec2(12, 16));
			var progPos = lvlPos.plus(new vec2(0, 22));
			var tftlvl = this.nextTileforms.length + this.currentLevel.tfTilProgression;
			this.hudPreRenders.progLabelPreRender = preRenderedText.fromString("next level in " + tftlvl, progPos, new textStyle(fonts.small));
		}
	}, {
		key: "drawTouchPanel",
		value: function drawTouchPanel() {
			// draws the touch panel if there is one
			if (this.currentTouchPanel) this.currentTouchPanel.draw();
		}
	}, {
		key: "drawHUDPreRenders",
		value: function drawHUDPreRenders() {
			var ths = this;
			Object.keys(this.hudPreRenders).forEach(function (key) {
				ths.hudPreRenders[key].draw();
			});
		}
	}, {
		key: "drawHUD",
		value: function drawHUD() {
			// draws the heads up display
			this.drawNextTileformAnim();
			drawForegroundOverlay();

			this.drawHUDPreRenders();
		}
	}, {
		key: "drawNextTileformAnim",
		value: function drawNextTileformAnim() {
			// draws the next tile form on the HUD (and the current tileForm if it is still being animated off the screen)
			var animLength = 200;
			var animScale = tile.tilesize * 3;
			var off = this.anim_HUDNextTileOff + animLength - this.timeElapsed;
			off = Math.min(1 - off / animLength, 1);

			if (off < 1) this.drawPrevNextTileform(-off * animScale);
			this.drawNextTileform(-off * animScale + animScale);
		}
	}, {
		key: "drawPrevNextTileform",
		value: function drawPrevNextTileform(off) {
			// draws the previous "nextTileform" (aka the current tileform) being animated off the HUD
			if (!this.phase.currentTileform) return;

			off = new vec2(0, off);
			this.phase.currentTileform.drawAtScreenPos(tile.nextTileformSlot.minus(this.phase.currentTileform.getCenterOff()).plus(off));
		}
	}, {
		key: "drawNextTileform",
		value: function drawNextTileform() {
			var off = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			// draws the next tileform in the "next" slot in the HUD
			var next = this.nextTileforms[0];
			if (!next) return;

			off = new vec2(0, off);
			next.drawAtScreenPos(tile.nextTileformSlot.minus(next.getCenterOff()).plus(off));
		}
	}, {
		key: "draw",
		value: function draw() {
			// renders tiled background
			drawBackground();

			// draws all the tiles in the tile grid
			tile.drawGrid();

			// member specific draw funciton for the current gameplayPhase
			this.phase.draw();

			// draw's the current game session info
			this.drawHUD();

			drawEffects();
			this.drawFloatingScoreText();

			if (this.phase instanceof phase_tooltip) this.phase.drawOverlay();

			// draws the touch interface if available
			this.drawTouchPanel();
		}
	}]);

	return state_gameplayState;
}(gameState);

// a state machine for a handler inside a different state machine, yay nested state machines!


var gameplayPhase = function () {
	function gameplayPhase(parentState) {
		_classCallCheck(this, gameplayPhase);

		this.parentState = parentState;
		this.init();
	}

	// to be overridden by objects that inherit from this class


	_createClass(gameplayPhase, [{
		key: "init",
		value: function init() {}
	}, {
		key: "update",
		value: function update(dt) {}
	}, {
		key: "draw",
		value: function draw() {}
	}, {
		key: "end",
		value: function end() {}

		// for override, called when a control is tapped

	}, {
		key: "controlTap",
		value: function controlTap() {
			var control = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : controlAction.none;
		}

		// for override, create the appropriate touch panel for the current phase

	}, {
		key: "getNewTouchPanelAt",
		value: function getNewTouchPanelAt(pos) {
			var r = new touchPanel();
			var ths = this;

			r.action_swipeLeft = function () {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.left);
				ths.parentState.killTouchPanel();
			};
			r.action_swipeRight = function () {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.right);
				ths.parentState.killTouchPanel();
			};
			r.action_swipeUp = function () {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.up);
				ths.parentState.killTouchPanel();
			};
			r.action_swipeDown = function () {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.down);
				ths.parentState.killTouchPanel();
			};

			return r.spawn(pos);
		}
	}]);

	return gameplayPhase;
}();
// the phase for when a tooltip is being displayed


var phase_tooltip = function (_gameplayPhase) {
	_inherits(phase_tooltip, _gameplayPhase);

	function phase_tooltip(parentState) {
		_classCallCheck(this, phase_tooltip);

		var _this27 = _possibleConstructorReturn(this, (phase_tooltip.__proto__ || Object.getPrototypeOf(phase_tooltip)).call(this, parentState));

		_this27.startTime = parentState.timeElapsed;
		_this27.previousPhase = gameState.current.phase;
		_this27.tip = null;
		return _this27;
	}

	_createClass(phase_tooltip, [{
		key: "controlTap",
		value: function controlTap(control) {
			if (control == controlAction.select) this.nextPhase();
		}
	}, {
		key: "getNewTouchPanelAt",
		value: function getNewTouchPanelAt(pos) {
			var r = new touchPanel();
			var ths = this;

			r.activeDirections = [side.up];
			r.action_swipeUp = function () {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.select);
				ths.parentState.killTouchPanel();
			};

			return r.spawn(pos);
		}
	}, {
		key: "nextPhase",
		value: function nextPhase() {
			this.parentState.timeElapsed = this.startTime;
			this.parentState.switchGameplayPhase(this.previousPhase);
		}
	}, {
		key: "draw",
		value: function draw() {
			this.previousPhase.draw();
		}
	}, {
		key: "drawOverlay",
		value: function drawOverlay() {
			this.tip.draw();
		}
	}], [{
		key: "fromTooltip",
		value: function fromTooltip(tip) {
			var r = new phase_tooltip(gameState.current);

			r.tip = tip;

			return r;
		}
	}]);

	return phase_tooltip;
}(gameplayPhase);
// the gameplay phase that lets the player control the tileform that is falling from the sky


var phase_placeTileform = function (_gameplayPhase2) {
	_inherits(phase_placeTileform, _gameplayPhase2);

	function phase_placeTileform(parentState) {
		_classCallCheck(this, phase_placeTileform);

		var _this28 = _possibleConstructorReturn(this, (phase_placeTileform.__proto__ || Object.getPrototypeOf(phase_placeTileform)).call(this, parentState));

		_this28.currentTileform = null; // the falling tileform that the player can control
		_this28.tfDropInterval = 1000;

		_this28.arrowIndicators = null;
		_this28.tfLastBumpTime = _this28.parentState.timeElapsed;
		_this28.bumpStop = true; // used to stop tileforms from immediately being dropped because the down key is held
		_this28.parentState.endCombos();
		return _this28;
	}

	_createClass(phase_placeTileform, [{
		key: "update",
		value: function update(dt) {
			this.handleTileform();

			// if down is not being held, reset bumpstop flag so that the tileform can be bumped downward
			if (!controlState.isControlDown(controlAction.down)) this.bumpStop = false;
		}
	}, {
		key: "end",
		value: function end() {}
	}, {
		key: "controlTap",
		value: function controlTap(control) {
			if (!this.currentTileform) return;
			switch (control) {
				case controlAction.down:
					if (!this.bumpStop) this.bumpDownTF();
					break;
				case controlAction.rotateCW:
					this.currentTileform.rotateCW();
					break;
				case controlAction.rotateCCW:
					this.currentTileform.rotateCCW();
					break;
				case controlAction.left:
					this.currentTileform.move(side.left);
					break;
				case controlAction.right:
					this.currentTileform.move(side.right);
					break;
				case controlAction.swap:
					this.swapTileform();
					break;
				case controlAction.quickDrop:
					this.quickDropTF();
					break;
			}
		}
	}, {
		key: "getNewTouchPanelAt",
		value: function getNewTouchPanelAt(pos) {
			// returns null if the player is actually trying to tap the next tileform
			if (pos.x >= tile.nextTileformSlot.x - 2 * tile.tilesize && pos.x <= tile.nextTileformSlot.x + 2 * tile.tilesize) {
				if (pos.y >= tile.nextTileformSlot.y - 1 * tile.tilesize && pos.y <= tile.nextTileformSlot.y + 1 * tile.tilesize) {
					this.parentState.controlTap(controlAction.swap);
					if (hapticFeedbackEnabled()) window.navigator.vibrate(25);
					return null;
				}
			}

			// returns a touch panel at the specified position
			var r = new touchPanel();
			var ths = this;
			r.touchRadius = 35;

			r.setSwipeSprite(side.up, new spriteContainer(gfx.touchPanelIcons, new spriteBox(new vec2(), new vec2(32))));
			r.action_swipeLeft = function () {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.left);
				ths.parentState.setTouchPanel(ths.getNewXMoveTouchPanel(r.touchPos));
			};
			r.action_swipeRight = function () {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.right);
				ths.parentState.setTouchPanel(ths.getNewXMoveTouchPanel(r.touchPos));
			};
			r.action_swipeUp = function () {
				r.hapticPulse();
				ths.parentState.setTouchPanel(ths.getNewRotTouchPanel(r.touchPos));
			};
			r.action_swipeDown = function () {
				r.hapticPulse();
				if (ths.currentTileform.canMove(side.down)) ths.currentTileform.move(side.down);else {
					ths.placeTileform();
					return;
				}
				ths.parentState.setTouchPanel(ths.getNewYMoveTouchPanel(r.touchPos));
			};

			return r.spawn(pos);
		}
	}, {
		key: "getNewRotTouchPanel",
		value: function getNewRotTouchPanel(pos) {
			var phase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			// returns a new rotation touch panel for when the rotate action is selected from the main touch panel
			var r = new touchPanel();
			var ths = this;

			r.stripDrawActions();

			// the function that will be called for rotate clockwise
			var rotCW = function rotCW() {
				r.hapticPulse();
				ths.parentState.setTouchPanel(ths.getNewRotTouchPanel(r.touchPos, (phase + 1) % 4));
				gameState.current.controlTap(controlAction.rotateCW);
			};
			// ** counter clockwise
			var rotCCW = function rotCCW() {
				r.hapticPulse();
				var nphase = phase - 1;
				if (nphase < 0) nphase = 3;
				ths.parentState.setTouchPanel(ths.getNewRotTouchPanel(r.touchPos, nphase));
				gameState.current.controlTap(controlAction.rotateCCW);
			};

			// the icon for clockwise
			var spriteCW = new spriteContainer(gfx.touchPanelIcons, new spriteBox(new vec2(), new vec2(32)));
			// ** counter clockwise
			var spriteCCW = new spriteContainer(gfx.touchPanelIcons, new spriteBox(new vec2(32, 0), new vec2(32)));

			// sets dirs based on the phase that is specified
			// dir[0] will always be the direction for clockwise and dir[1] counter clockwise
			var dirs = [];
			switch (phase) {
				case 0:
					dirs = [side.right, side.left];
					break;
				case 1:
					dirs = [side.down, side.up];
					break;
				case 2:
					dirs = [side.left, side.right];
					break;
				case 3:
					dirs = [side.up, side.down];
					break;
			}
			r.activeDirections = dirs;

			// bind the actions and the icons to the touch panel 
			r.setSwipeSprite(dirs[0], spriteCW);
			r.setSwipeSprite(dirs[1], spriteCCW);
			r.setSwipeAction(dirs[0], rotCW);
			r.setSwipeAction(dirs[1], rotCCW);

			// makes it so that the touchpanel slides along with the player's finger
			// but only along the axis that isn't being used for determining a swipe action
			var horizontalSlide = phase % 2 == 1;
			r.action_move = function (pos) {
				if (horizontalSlide) r.origin.x = pos.x;else r.origin.y = pos.y;

				r.drawPos = r.origin.clone();
			};

			return r.spawn(pos);
		}
	}, {
		key: "getNewXMoveTouchPanel",
		value: function getNewXMoveTouchPanel(pos) {
			// returns a new sliding touch panel for when the left or right swipe action is selected from the main touch panel
			var r = new touchPanel();
			var ths = this;
			var slideDist = 32 * config.swipeRadius;

			r.activeDirections = [side.left, side.right];

			var moveLeft = function moveLeft() {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.left);
				r.origin.x -= slideDist;
			};
			var moveRight = function moveRight() {
				r.hapticPulse();
				gameState.current.controlTap(controlAction.right);
				r.origin.x += slideDist;
			};

			r.setSwipeAction(side.left, moveLeft);
			r.setSwipeAction(side.right, moveRight);

			// set so that the player doesn't have to stay centered on the touch panel
			r.action_move = function (pos) {
				r.drawPos.x = pos.x;

				var dif = pos.x - r.origin.x;
				while (Math.abs(dif) >= slideDist) {
					if (dif < 0) moveLeft();else moveRight();
					dif = pos.x - r.origin.x;
				}
			};

			return r.spawn(pos);
		}
	}, {
		key: "getNewYMoveTouchPanel",
		value: function getNewYMoveTouchPanel(pos) {
			// returns a new touch panel for when the down swipe action is triggered
			var r = new touchPanel();
			var ths = this;
			var slideDist = 32 * config.swipeRadius;
			this.bumps = 1;

			r.activeDirections = [side.down, side.up];
			var moveDown = function moveDown() {
				r.hapticPulse();
				if (ths.currentTileform.canMove(side.down)) ths.currentTileform.move(side.down);
				r.origin.y += slideDist;
				ths.bumps++;
			};
			var moveUp = function moveUp() {
				r.hapticPulse();
				r.origin.y -= slideDist;
				if (ths.bumps <= 0) return;
				ths.currentTileform.move(side.up);
				ths.bumps--;
			};

			r.setSwipeAction(side.down, moveDown);
			r.setSwipeAction(side.up, moveUp);

			// set so that the player doesn't have to stay centered on the touch panel
			r.action_move = function (pos) {
				r.drawPos.y = pos.y;

				var dif = pos.y - r.origin.y;
				while (Math.abs(dif) >= slideDist) {
					if (dif > 0) moveDown();else moveUp();
					dif = pos.y - r.origin.y;
				}
			};

			return r.spawn(pos);
		}
	}, {
		key: "setTileform",
		value: function setTileform(tf) {
			var dropInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

			// sets the current tileform
			this.currentTileform = tf;
			this.currentTileform.setPos(new vec2(Math.floor((tile.gridBounds.size.x - 1) / 2), -1));
			this.tfDropInterval = dropInterval;

			if (this.currentTileform.hasEntityType(entities.ball)) this.calculateArrowIndicators();

			this.bumpDownTF();
		}
	}, {
		key: "swapTileform",
		value: function swapTileform() {
			var ptf = this.parentState.nextTileforms[0];
			ptf.setPos(this.currentTileform.gridPos.clone());
			if (ptf.isOverlappingTile()) {
				ptf.setPos(new vec2());
				audioMgr.playSound(sfx.invalidMove);
				return;
			}
			if (this.currentTileform.getGridSize().y + 1 > 2) this.currentTileform.rotate(1, true);
			this.currentTileform.setPos(new vec2());
			this.currentTileform = this.parentState.nextTileforms.splice(0, 1, this.currentTileform)[0];
			audioMgr.playSound(sfx.swapTileform);

			// disable arrow indicators if they were on and the swapped tileform is not a ball
			if (this.arrowIndicators) {
				if (!this.currentTileform.hasEntityType(entities.ball)) this.arrowIndicators = null;
			}
			// and vice-versa
			else if (this.currentTileform.hasEntityType(entities.ball)) this.calculateArrowIndicators();
		}
	}, {
		key: "placeTileform",
		value: function placeTileform() {
			// places the current tileform and does all the necessary checks
			this.currentTileform.setInPlace();

			if (this.tileformOverflowCheck()) return;

			this.currentTileform = null;
			tile.checkTilePlacement();
			tile.checkForFullRows();

			// if the gameplay phase hasn't changed, get the next tileForm
			if (this.parentState.phase == this) this.parentState.getNextTileform();
		}
	}, {
		key: "tileformOverflowCheck",
		value: function tileformOverflowCheck() {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = this.currentTileform.tiles[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var tileOb = _step7.value;

					if (tileOb.gridPos.y < 0) {
						this.parentState.loseGame();
						return true;
					}
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return false;
		}
	}, {
		key: "quickDropTF",
		value: function quickDropTF() {
			while (this.currentTileform.canMove(side.down)) {
				this.currentTileform.move(side.down);
			}this.placeTileform();
		}
	}, {
		key: "bumpDownTF",
		value: function bumpDownTF() {
			// bumps the current tileform object downward
			if (!this.currentTileform) return;

			// bumps down the tileform if possible
			var canBump = this.currentTileform.canMove(side.down);
			if (canBump) this.currentTileform.move(side.down);

			// otherwise the tileform is set in place
			else this.placeTileform();

			// resets the bump interval so that the tileform will be bumped down at the right time
			this.tfLastBumpTime = this.parentState.timeElapsed;
		}
	}, {
		key: "handleTileform",
		value: function handleTileform() {
			// handles updating the tileform object
			if (!this.currentTileform) this.parentState.getNextTileform();
			if (!this.tfLastBumpTime) this.tfLastBumpTime = this.parentState.timeElapsed;

			// if the tileform drop interval has passed, bump the tileform down
			var nextBump = this.tfLastBumpTime + this.tfDropInterval;
			if (this.parentState.timeElapsed >= nextBump) {
				this.bumpDownTF();
				this.tfLastBumpTime -= this.parentState.timeElapsed - nextBump;
			}
		}
	}, {
		key: "calculateArrowIndicators",
		value: function calculateArrowIndicators() {
			// calculates all the arrow indicators and stores the info in this.arrowIndicators
			var indicators = [];
			tile.iterateGrid(function (tileOb, x, y) {
				if (tileOb.isEmpty()) return; // continue if empty tile
				var openDirs = tileOb.getUnblockedSides(); // get all the sides the ball can enter from
				var ind = []; // arrow indicators for this tile will be stored here
				openDirs.forEach(function (dir) {
					if (dir == side.down) return; // continue if direction is downward, because the ball can never travel upward on the first tick
					var tpos = new vec2(x, y).plus(vec2.fromSide(dir)); // the position next to the tile in the direction of the open side
					//if the tile's neighbor is empty, it may be able to place an indicator there
					if (tile.at(tpos).isEmpty()) {
						// if the open side is facing upward, add an indicator and continue
						if (dir == side.up) {
							ind.push({ pos: tpos, direction: side.down });
							return;
						}
						// if the open side is facing sideways, check to make sure there is ground below it's neighbor so that the ball can
						// enter. If there is, add an indicator and continue
						if (!tile.at(tpos.plus(vec2.fromSide(side.down))).getUnblockedSides().includes(side.up)) {
							ind.push({ pos: tpos, direction: invertedSide(dir) });
							return;
						}
					}
				});

				// add all the arrow indicators from 'ind'
				indicators = indicators.concat(ind);
			});

			// set the arrow indicators variable
			this.arrowIndicators = indicators;
		}
	}, {
		key: "drawArrowIndicators",
		value: function drawArrowIndicators() {
			// draws each arrow indicator to suggest where to place the ball
			this.arrowIndicators.forEach(function (indicator) {
				var tpos = tile.toScreenPos(indicator.pos).plus(vec2.fromSide(indicator.direction).multiply(tile.tilesize / 4));
				drawArrow(tpos, indicator.direction);
			});
		}
	}, {
		key: "draw",
		value: function draw() {
			// draws the current tileform
			if (this.currentTileform) this.currentTileform.draw();
			if (this.arrowIndicators) this.drawArrowIndicators();
		}
	}]);

	return phase_placeTileform;
}(gameplayPhase);
// the gameplay phase that handles the movement and logic for ball objects


var phase_ballPhysics = function (_gameplayPhase3) {
	_inherits(phase_ballPhysics, _gameplayPhase3);

	function phase_ballPhysics(parentState) {
		_classCallCheck(this, phase_ballPhysics);

		// the array that holds the ball objects
		var _this29 = _possibleConstructorReturn(this, (phase_ballPhysics.__proto__ || Object.getPrototypeOf(phase_ballPhysics)).call(this, parentState));

		_this29.balls = [];
		return _this29;
	}

	_createClass(phase_ballPhysics, [{
		key: "update",
		value: function update(dt) {
			// update all the balls in the array and remove the ones that are dead from the ball array
			var ths = this;
			this.balls.forEach(function (ballOb) {
				ballOb.update(dt);
				if (ballOb.state == ballStates.dead) ths.killBall(ballOb);
			});

			// if there are no more balls to be handled end this gameplayPhase
			// Because, well what's the point of life without any balls to handle?
			if (this.balls.length <= 0) this.nextPhase();
		}
	}, {
		key: "draw",
		value: function draw() {
			// renders the gameplayPhase
			this.balls.forEach(function (ballOb) {
				ballOb.draw();
			});
		}
	}, {
		key: "end",
		value: function end() {}
	}, {
		key: "nextPhase",
		value: function nextPhase() {
			var phase = new phase_destroyTaggedTiles(this.parentState);
			this.parentState.switchGameplayPhase(phase);
		}
	}, {
		key: "controlTap",
		value: function controlTap(control) {
			this.balls.forEach(function (ballOb) {
				switch (control) {
					case controlAction.left:
						ballOb.direct(side.left);
						break;
					case controlAction.right:
						ballOb.direct(side.right);
						break;
					case controlAction.up:
						ballOb.direct(side.up);
						break;
					case controlAction.down:
						ballOb.direct(side.down);
						break;
				}
			});
		}
	}, {
		key: "addBall",
		value: function addBall(ballOb) {
			// adds a ball to the ball array
			this.balls.push(ballOb);
		}
	}, {
		key: "killBall",
		value: function killBall(ballOb) {
			// destroys the specified ball, removes it from the array and queries all the tiles that it tagged
			this.balls.splice(this.balls.indexOf(ballOb), 1);
		}
	}]);

	return phase_ballPhysics;
}(gameplayPhase);
// destroys the tiles that have been tagged by the ball


var phase_destroyTaggedTiles = function (_gameplayPhase4) {
	_inherits(phase_destroyTaggedTiles, _gameplayPhase4);

	function phase_destroyTaggedTiles(parentState) {
		_classCallCheck(this, phase_destroyTaggedTiles);

		var _this30 = _possibleConstructorReturn(this, (phase_destroyTaggedTiles.__proto__ || Object.getPrototypeOf(phase_destroyTaggedTiles)).call(this, parentState));

		_this30.tileCombo = 0;
		_this30.chargedTileCombo = 1;

		_this30.lastTileDestroyed = parentState.timeElapsed;
		_this30.tilesChargeTagged = [];
		_this30.fallHeights = [];

		_this30.brickBombs = false;
		return _this30;
	}

	_createClass(phase_destroyTaggedTiles, [{
		key: "update",
		value: function update(dt) {
			// destroy each tagged tile sequentially
			var animInterval = 100;
			var nextDestroy = this.lastTileDestroyed + animInterval;

			while (this.parentState.timeElapsed >= nextDestroy) {
				this.lastTileDestroyed += animInterval;

				if (this.parentState.tilesTagged.length > 0) this.destroyTiles(this.parentState.tilesTagged.splice(0, 1));else if (this.tilesChargeTagged.length > 0) this.destroyChargedTiles();

				nextDestroy = this.lastTileDestroyed + animInterval;
			}

			if (this.parentState.tilesTagged.length <= 0 && this.tilesChargeTagged.length <= 0) this.nextPhase();
		}
	}, {
		key: "draw",
		value: function draw() {}
	}, {
		key: "destroyTiles",
		value: function destroyTiles(tileArray) {
			// destroy the specified tiles
			var ths = this;
			tileArray.forEach(function (tileOb) {
				ths.destroyTile(tileOb);
			});
		}
	}, {
		key: "destroyTile",
		value: function destroyTile(tileOb) {
			// destroys the tile and sets the corresponding fall height
			this.concatFallHeight(tileOb.gridPos.x, tileOb.gridPos.y);
			tileOb.destroy();

			var rollpts = true;

			if (tileOb.isEntity(blocks.block_bomb, entities.block)) {
				this.parentState.addToComboValue(floatingScoreFieldID.bombCombo);
				rollpts = false;
			}

			if (rollpts) {
				var comboAdd = 1;
				if (this.tileCombo >= 10) comboAdd = 0.5;
				this.tileCombo += comboAdd;
				var comboMult = Math.min(Math.floor(this.tileCombo), 15);
				scoring.addScore(comboMult * 10, tile.toScreenPos(tileOb.gridPos), scoreTypes.pop);
			}
		}
	}, {
		key: "destroyChargedTiles",
		value: function destroyChargedTiles(tileArray) {
			// specify that the tiles are being destroyed by the tile's charged chain reaction
			var tileArray = this.tilesChargeTagged;
			this.tilesChargeTagged = [];

			var ths = this;
			tileArray.forEach(function (tileOb) {
				ths.destroyChargedTile(tileOb);
			});
		}
	}, {
		key: "destroyChargedTile",
		value: function destroyChargedTile(tileOb) {
			// destroys the tile and sets the corresponding fall height
			this.concatFallHeight(tileOb.gridPos.x, tileOb.gridPos.y);
			tileOb.destroy();

			var rollpts = true;

			if (tileOb.isEntity(blocks.block_bomb, entities.block)) {
				this.parentState.addToComboValue(floatingScoreFieldID.bombCombo);
				rollpts = false;
			}

			if (rollpts) {
				var comboAdd = 0.25;
				if (this.chargedTileCombo >= 3) comboAdd = 0.125;
				var comboMult = Math.min(Math.floor(this.chargedTileCombo), 5);
				scoring.addScore(comboMult * 10, tile.toScreenPos(tileOb.gridPos), scoreTypes.pop);
				this.chargedTileCombo += comboAdd;
			}
		}
	}, {
		key: "concatFallHeights",
		value: function concatFallHeights() {
			var heightArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			// updates the fallheights in all the specified columns
			var ths = this;
			heightArray.forEach(function (height, x) {
				ths.concatFallHeight(x, height);
			});
		}
	}, {
		key: "concatFallHeight",
		value: function concatFallHeight(x, height) {
			// adds a fall height at the necessary column if the height is lower than the previous fall height
			this.fallHeights[x] = !this.fallHeights[x] ? height : Math.max(this.fallHeights[x], height);
		}
	}, {
		key: "doBrickBombs",
		value: function doBrickBombs() {
			// converts all the bricks to bombs (per combo bonus)
			var iter = function iter(tileOb) {
				if (tileOb.isEntity(blocks.block_brick, entities.block)) {
					tileOb.setEntity(blocks.block_bomb, entities.block);
					effect.createPoof(tile.toScreenPos(tileOb.gridPos));
				}
			};
			tile.iterateGrid(iter);
			tile.checkTilePlacement();

			this.brickBombs = false;
		}
	}, {
		key: "nextPhase",
		value: function nextPhase() {
			if (this.brickBombs) {
				this.doBrickBombs();
				return;
			}

			// enters the next gameplay phase
			var phase = new phase_fellTiles(this.parentState);
			phase.setFallHeights(this.fallHeights);
			this.parentState.switchGameplayPhase(phase);
		}
	}]);

	return phase_destroyTaggedTiles;
}(gameplayPhase);
// the phase where tiles can fall


var phase_fellTiles = function (_gameplayPhase5) {
	_inherits(phase_fellTiles, _gameplayPhase5);

	function phase_fellTiles(parentState) {
		_classCallCheck(this, phase_fellTiles);

		var _this31 = _possibleConstructorReturn(this, (phase_fellTiles.__proto__ || Object.getPrototypeOf(phase_fellTiles)).call(this, parentState));

		_this31.fallHeights = [];
		_this31.fallingTiles = null;
		_this31.fallOffset = 0;

		_this31.lastOffReset = _this31.parentState.timeElapsed;
		return _this31;
	}

	_createClass(phase_fellTiles, [{
		key: "firstStep",
		value: function firstStep() {
			// if it is the first tick in this phase, retrieve the falling tiles list and remove those tiles from the 
			// tile grid
			if (!this.fallingTiles) {
				this.fallingTiles = this.getFallingTiles();
				this.fallingTiles.forEach(function (tileOb) {
					// mark each falling tile as empty in the tile grid
					var tpos = tileOb.gridPos.clone();
					tile.setTileAt(tile.getEmpty(tpos), tpos);
				});

				// solo tiles are gotten after the falling tiles are marked empty so that the solo condition is tested 
				// in a more chronoligically accurate way
				var soloTiles = this.getSoloTiles();
				soloTiles.forEach(function (tileOb) {
					// mark each solo tile as empty in the tile grid
					var tpos = tileOb.gridPos.clone();
					tile.setTileAt(tile.getEmpty(tpos), tpos);
				});

				// concat this.falling tiles with the solo tiles that we just got
				this.fallingTiles = this.fallingTiles.concat(soloTiles);
			}
		}
	}, {
		key: "update",
		value: function update(dt) {
			// handles update logic for the falling tiles phase
			// first step
			if (!this.fallingTiles) this.firstStep();

			this.handleFallingTiles();
		}
	}, {
		key: "draw",
		value: function draw() {
			// draws all the falling tiles with the specified tile offset
			if (!this.fallingTiles) this.firstStep();

			var yOff = this.fallOffset * tile.tilesize;
			var ths = this;
			this.fallingTiles.forEach(function (tileOb) {
				tileOb.drawAtScreenPos(tile.toScreenPos(tileOb.gridPos, false).plus(new vec2(0, yOff)));
			});
		}
	}, {
		key: "handleFallingTiles",
		value: function handleFallingTiles() {
			this.updateFallingTileOffset();

			if (this.fallOffset >= 1) this.updateFallingTilePos();

			if (this.fallingTiles.length <= 0) this.nextPhase();
		}
	}, {
		key: "updateFallingTilePos",
		value: function updateFallingTilePos() {
			// updates the falling tiles gridpos by moving them down 1 tile
			this.fallingTiles.forEach(function (tileOb) {
				tileOb.gridPos.y += 1;
			});
			this.lastOffReset = this.parentState.timeElapsed;
			this.fallOffset = 0;
			this.checkFallingTiles();
		}
	}, {
		key: "checkFallingTiles",
		value: function checkFallingTiles() {
			// checks to see if the falling tiles have landed on the ground or another solid tile
			for (var i = this.fallingTiles.length - 1; i >= 0; i--) {
				var gpos = this.fallingTiles[i].gridPos.plus(vec2.fromSide(side.down));
				var ttile = tile.at(gpos);
				if (!ttile.isEmpty()) {
					this.fallingTiles[i].place();
					this.fallingTiles.splice(i, 1);
				}
			}
		}
	}, {
		key: "updateFallingTileOffset",
		value: function updateFallingTileOffset() {
			// updates the Y offset that the tiles should be drawn at
			var animLength = 100;
			this.fallOffset = (this.parentState.timeElapsed - this.lastOffReset) / animLength;

			//caps the fall offset to %100
			this.fallOffset = Math.min(this.fallOffset, 1);
		}
	}, {
		key: "setFallHeights",
		value: function setFallHeights(heights) {
			this.fallHeights = heights;
		}
	}, {
		key: "getFallingTiles",
		value: function getFallingTiles() {
			var r = [];

			this.fallHeights.forEach(function (y0, x) {
				for (var y = y0; y >= 0; y--) {
					var t = tile.at(x, y);
					if (!t.isEmpty()) r.push(t);
				}
			});

			// reverse the tile array, this is important because the bottom tiles must check for 
			// ground collision beffore the tiles above them
			return r.reverse();
		}
	}, {
		key: "getSoloTiles",
		value: function getSoloTiles() {
			// gets all the single tiles that are just floating randomly in the air
			var r = [];

			var iter = function iter(ttile) {
				if (ttile.gridPos.y >= tile.gridBounds.size.y - 1 || ttile.isEmpty()) return;
				if (ttile.getDirectNeighbors().length <= 0) r.push(ttile);
			};
			tile.iterateGrid(iter);

			return r;
		}
	}, {
		key: "nextPhase",
		value: function nextPhase() {
			// check the tile placement and then progress to the next tileform if the gameplayPhase hasn't changed
			tile.checkTilePlacement();
			tile.checkForFullRows();
			if (this.parentState.phase == this) this.parentState.getNextTileform();
		}
	}]);

	return phase_fellTiles;
}(gameplayPhase);
// the level complete animation


var phase_levelComplete = function (_gameplayPhase6) {
	_inherits(phase_levelComplete, _gameplayPhase6);

	function phase_levelComplete(parentState) {
		_classCallCheck(this, phase_levelComplete);

		var _this32 = _possibleConstructorReturn(this, (phase_levelComplete.__proto__ || Object.getPrototypeOf(phase_levelComplete)).call(this, parentState));

		_this32.parentState.endCombos();

		_this32.startTime = _this32.parentState.timeElapsed;
		_this32.constructPreRender();
		return _this32;
	}

	_createClass(phase_levelComplete, [{
		key: "constructPreRender",
		value: function constructPreRender() {
			// creates the preRender and the animations to be drawn
			var box = new collisionBox(new vec2(), new vec2(10 * tile.tilesize, 4 * tile.tilesize)).setCenter(tile.toScreenPos(new vec2(4.5, 5)));
			var textblock = new textBlock("Level " + this.parentState.currentLevel.difficulty + " Complete!", new textStyle(fonts.large, textColor.green, 2), box, [], 70);

			// the "Level X Complete!" text preRender
			this.preRender = preRenderedText.fromBlock(textblock);

			// determine how much points you earn from completing the level
			var pts = 500 * this.parentState.currentLevel.difficulty;
			scoring.addScore(pts);

			// the "X Points" text preRender
			this.ptsPreRender = preRenderedText.fromString(pts + " Points", new vec2(box.center.x, box.bottom + 35), new textStyle(fonts.large, textColor.yellow));

			// the animation of the prerenders' entrance
			var enterAnim = new textAnim_scaleTransform(300, 0, 1, 0.1);
			enterAnim.animType = textAnimType.easeOut;

			// the emphasis animation of the prerenders
			var anim = new textAnim_yOffset(500, 20, 0.15);
			var anim2 = new textAnim_rainbow();

			// the animation of the prerenders' exits
			var exitAnim = new textAnim_scaleTransform(300, 1, 0, 0.1);
			exitAnim.animType = textAnimType.easeIn;
			exitAnim.animDelay = 2500;

			this.textAnim = new textAnim_compound([enterAnim, exitAnim, anim]);
			this.ptsAnim = new textAnim_compound([enterAnim, exitAnim, anim2]);

			this.textAnim.resetAnim();
			this.ptsAnim.resetAnim();
		}
	}, {
		key: "update",
		value: function update(dt) {
			if (this.parentState.timeElapsed > this.startTime + 4000) this.nextPhase();
		}
	}, {
		key: "draw",
		value: function draw() {
			this.preRender.animated(this.textAnim).draw();
			this.ptsPreRender.animated(this.ptsAnim).draw();
		}
	}, {
		key: "controlTap",
		value: function controlTap() {
			this.nextPhase();
		}
	}, {
		key: "nextPhase",
		value: function nextPhase() {
			// proceeds to place the first tileform of the next level
			tile.checkTilePlacement();
			if (this.parentState.phase == this) this.parentState.getNextTileform();
		}
	}]);

	return phase_levelComplete;
}(gameplayPhase);
// the game over animation


var phase_gameOver = function (_gameplayPhase7) {
	_inherits(phase_gameOver, _gameplayPhase7);

	function phase_gameOver(parentState) {
		_classCallCheck(this, phase_gameOver);

		var _this33 = _possibleConstructorReturn(this, (phase_gameOver.__proto__ || Object.getPrototypeOf(phase_gameOver)).call(this, parentState));

		_this33.isFinished = false;
		return _this33;
	}

	_createClass(phase_gameOver, [{
		key: "update",
		value: function update(dt) {
			this.finishLoss();
		}
	}, {
		key: "finishLoss",
		value: function finishLoss() {
			this.isFinished = true;
			scoring.rememberScore();

			var didRank = this.parentState.checkRank() != null;

			var stt = null;
			if (didRank) {
				stt = new state_gameOverRanked();
				stt.setRank(this.parentState.checkRank(), scoring.getCurrentScore());
			} else stt = new state_gameOver();

			stt.setLostGame(this.parentState);
			gameState.switchState(stt);
		}
	}, {
		key: "draw",
		value: function draw() {
			if (this.isFinished) return;
			var rect = new collisionBox(tile.offset.clone(), tile.gridBounds.size.multiply(tile.tilesize));
			rect.drawFill(renderContext, "rgba(0, 0, 0, 0.5)");
		}
	}]);

	return phase_gameOver;
}(gameplayPhase);

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

// enumerates all the different actions performed by triggering a control


var controlAction = {
	none: -1,
	left: 0,
	right: 1,
	up: 2,
	down: 3,
	quickDrop: 4,
	nudgeDown: 5,
	rotateCW: 6,
	rotateCCW: 7,
	swap: 8,
	select: 9,
	pause: 10
};

var controlState = function () {
	function controlState() {
		_classCallCheck(this, controlState);
	}

	_createClass(controlState, null, [{
		key: "init",
		value: function init() {
			// initializes the static fields of controlState
			log("initializing controlState...");
			controlState.keys = [];
			controlState.mouseDown = false;
			controlState.mousePos = new vec2();
			controlState.controls = {};
			controlState.controlChangeListener = null;

			controlState.touchStartPos = null;
			controlState.touchStartTime = null;
			controlState.touchPos = null;
			controlState.currentTouchID = null;
			controlState.touchList = [];
		}
	}, {
		key: "listenForMouseMove",
		value: function listenForMouseMove(e) {
			// the event listener that is triggered when the mouse is moved
			var fixedPos = new vec2(e.offsetX, e.offsetY);

			// adjust for the size of the canvas if it's different from the native resolution
			fixedPos.x /= scalingTarget.width / nativeResolution.x;
			fixedPos.y /= scalingTarget.height / nativeResolution.y;

			controlState.mousePos = fixedPos;
			gameState.current.mouseMove(controlState.mousePos);
		}
	}, {
		key: "listenForMouseDown",
		value: function listenForMouseDown(e) {
			// the event listener that is triggered when the mouse is pressed
			controlState.mouseDown = true;
			gameState.current.mouseTap(controlState.mousePos);

			// sets the control mode to keyboard mode unless the touch mode was explicitly specified by the user
			if (!config.touchModeSpecified) config.touchMode = false;
		}
	}, {
		key: "listenForMouseUp",
		value: function listenForMouseUp(e) {
			// the event listener that is triggered when the mouse is released
			controlState.mouseDown = false;
			log("mouse click at: " + new vec2(e.offsetX, e.offsetY));
		}
	}, {
		key: "listenForKeyDown",
		value: function listenForKeyDown(e) {
			// the event listener that is triggered when a keyboard key is pressed
			if (!e.keyCode) return;
			//console.log(e.key + "(key #" + e.keyCode.toString() + ") Pressed");

			controlState.keys[e.keyCode] = true;

			var a = controlState.getControlsForKey(e.keyCode);
			a.forEach(function (ctrl) {
				gameState.current.controlTap(ctrl);
			});

			// sets the control mode to keyboard mode unless the touch mode was explicitly specified by the user
			if (!config.touchModeSpecified) config.touchMode = false;
		}
	}, {
		key: "listenForKeyUp",
		value: function listenForKeyUp(e) {
			// the event listener that is triggered when a keyboard key is released
			if (!e.keyCode) return;
			controlState.keys[e.keyCode] = false;
		}
	}, {
		key: "listenForTouchStart",
		value: function listenForTouchStart(e) {
			// triggered when the screen is touched
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = e.touches[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var touch = _step8.value;

					if (!controlState.touchList.includes(touch)) {
						controlState.touchList.push(touch);

						// if there is no active touch, make this the currently active touch
						if (!controlState.currentTouchID) {
							controlState.currentTouchID = touch.identifier;
							controlState.touchStartTime = timeElapsed;

							// calculate the touch's in-game position
							controlState.touchStartPos = clientToOffsetPos(new vec2(touch.clientX, touch.clientY));
							controlState.touchStartPos.x /= scalingTarget.width / nativeResolution.x;
							controlState.touchStartPos.y /= scalingTarget.height / nativeResolution.y;
							controlState.touchPos = controlState.touchStartPos.clone();

							gameState.current.touchStart(controlState.touchStartPos, touch);
						}
					}
				}

				// sets the control mode to touchscreen mode unless keyboard mode was explicitly specified by the user
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			if (!config.touchModeSpecified) config.touchMode = true;
		}
	}, {
		key: "listenForTouchMove",
		value: function listenForTouchMove(e) {
			e.preventDefault(); // disable touch scrolling

			for (var i = e.touches.length - 1; i >= 0; i--) {
				if (e.touches[i].identifier == controlState.currentTouchID) {
					// calculate the touch's in-game position
					var tpos = clientToOffsetPos(new vec2(e.touches[i].clientX, e.touches[i].clientY));
					tpos.x /= scalingTarget.width / nativeResolution.x;
					tpos.y /= scalingTarget.height / nativeResolution.y;

					controlState.touchPos = tpos.clone();
					gameState.current.touchMove(tpos, e.touches[i]);
					break;
				}
			}
		}
	}, {
		key: "listenForTouchEnd",
		value: function listenForTouchEnd(e) {
			e.preventDefault(); // disable touch clicking and right-clicking

			// remove the touch object that ended from the controlState.touchList
			for (var i = controlState.touchList.length - 1; i >= 0; i--) {
				if (!touchListIncludes(e.touches, controlState.touchList[i])) {

					// if it's the currently active touch, reset the flags and call the gamestate touchEnd fuction
					if (controlState.touchList[i].identifier == controlState.currentTouchID) {
						gameState.current.touchEnd(controlState.touchPos.clone(), controlState.touchList[i]);

						controlState.currentTouchID = null;
						controlState.touchStartPos = null;
						controlState.touchStartTime = null;
					}
					controlState.touchList.splice(i, 1);
				}
			}
		}
	}, {
		key: "listenForTouchCancel",
		value: function listenForTouchCancel(e) {
			for (var i = controlState.touchList.length - 1; i >= 0; i--) {
				if (!touchListIncludes(e.touches, controlState.touchList[i])) {
					if (controlState.touchList[i].identifier == controlState.currentTouchID) {
						gameState.current.touchEnd(controlState.touchList[i]);
						controlState.currentTouchID = null;
						controlState.touchStartPos = null;
						controlState.touchStartTime = null;
					}
					controlState.touchList.splice(i, 1);
				}
			}
		}
	}, {
		key: "getTouchDuration",
		value: function getTouchDuration() {
			if (!controlState.touchStartTime) return null;
			return timeElapsed - controlState.touchStartTime;
		}
	}, {
		key: "isKeyDown",
		value: function isKeyDown(keyCode) {
			// checks to see if a key is currently pressed
			return !!controlState.keys[keyCode];
		}
	}, {
		key: "isControlDown",
		value: function isControlDown() {
			var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : controlAction.none;

			// checks to see if a control action is currently being triggered
			var key = Object.keys(controlAction)[action + 1];

			switch (action) {
				case controlAction.select:
					return controlState.isKeyDown(controlState.controls.select) || controlState.isKeyDown(13); // non-overridable default key 'enter'
				case controlAction.pause:
					return controlState.isKeyDown(controlState.controls.pause) || controlState.isKeyDown(27); // non-overridable default key 'escape'
				default:
					return controlState.isKeyDown(controlState.controls[key]);

			}
			return false;
		}
	}, {
		key: "getControlKeyName",
		value: function getControlKeyName(controlaction) {
			// returns the name of a key that is bound tot the specified control action
			return controlState.keyCodeToName(controlState.controls[Object.keys(controlState.controls)[controlaction]]);
		}
	}, {
		key: "keyCodeToName",
		value: function keyCodeToName(code) {
			//parses a keyCode and converts it into understandable text, used to display player controls
			if (code >= 65 && code <= 90) return String.fromCharCode(code);
			if (code >= 48 && code <= 57) return (code - 48).toString();
			if (code >= 96 && code <= 105) return "kp " + (code - 96).toString();
			switch (code) {
				case -1:
					return ":::";
				case 0:
					return "none";
				case 8:
					return "backspc";
				case 13:
					return "enter";
				case 37:
					return "left arw";
				case 39:
					return "right arw";
				case 40:
					return "down arw";
				case 38:
					return "up arw";
				case 17:
					return "ctrl";
				case 16:
					return "shift";
				case 27:
					return "escape";
				case 32:
					return "space";
				case 219:
					return "l brckt";
				case 221:
					return "r brckt";
				case 191:
					return "backslash";
				case 220:
					return "fwdslash";
				case 190:
					return "period";
				case 186:
					return "semicolon";
				case 222:
					return "apstrophe";
				case 188:
					return "comma";
			}
			return "key" + code.toString();
		}
	}, {
		key: "setControls",
		value: function setControls(controls) {
			// sets the key bindings to the specified controls
			controlState.controls = controls;
		}
	}, {
		key: "resetControlChangeListener",
		value: function resetControlChangeListener() {
			// used when the player presses a key to change a keybinding
			// removes the controlChangeListener from 'keydown' so that future keypresses are not binded
			window.removeEventListener("keydown", controlState.controlChangeListener);
			// resets the focus on the gamestate so the user can navigate the menu again
			gameState.current.selectionFocus = false;
		}
	}, {
		key: "getAllControls",
		value: function getAllControls() {
			// returns a list of all the keys currently bound to control actions
			return [controlState.controls.left, controlState.controls.right, controlState.controls.up, controlState.controls.down, controlState.controls.quickDrop, controlState.controls.nudgeDown, controlState.controls.rotateCW, controlState.controls.rotateCCW, controlState.controls.select, controlState.controls.pause];
		}
	}, {
		key: "getControlsForKey",
		value: function getControlsForKey(keycode) {
			// returns all the control actions currently bound to a specified key
			var r = [];

			Object.keys(controlState.controls).forEach(function (key) {
				if (controlState.controls[key] == keycode) r.push(controlAction[key]);
			});

			// non-overridable default keys 'enter' and 'escape' bound to actions 'select' and 'pause'
			if (keycode == 13) {
				if (!r.includes(controlAction.select)) r.push(controlAction.select);
			} else if (keycode == 27) if (!r.includes(controlAction.pause)) r.push(controlAction.pause);

			return r;
		}
	}]);

	return controlState;
}();

var touchPanel = function () {
	function touchPanel() {
		_classCallCheck(this, touchPanel);

		this.isActive = false;
		this.timeOpened = timeElapsed;
		this.origin = new vec2();
		this.drawPos = this.origin.clone();
		this.touchPos = this.origin.clone();
		this.activeDirections = [side.left, side.right, side.up, side.down];
		this.radius = 75;
		this.touchRadius = 50;
		this.backdrop = null;
	}

	// override these:


	_createClass(touchPanel, [{
		key: "action_swipeLeft",
		value: function action_swipeLeft() {}
	}, {
		key: "action_swipeRight",
		value: function action_swipeRight() {}
	}, {
		key: "action_swipeUp",
		value: function action_swipeUp() {}
	}, {
		key: "action_swipeDown",
		value: function action_swipeDown() {}
	}, {
		key: "action_kill",
		value: function action_kill() {}
	}, {
		key: "action_move",
		value: function action_move(pos) {}
	}, {
		key: "generateBackdrop",
		value: function generateBackdrop() {
			return touchPanel.getDefaultBackdrop(this.radius);
		}
	}, {
		key: "spawn",
		value: function spawn(pos) {
			// spawns the panel at the specified position
			this.isActive = true;
			this.timeOpened = timeElapsed;
			this.origin = pos;
			this.drawPos = this.origin.clone();
			this.touchPos = this.origin.clone();
			this.backdrop = this.generateBackdrop();
			return this;
		}
	}, {
		key: "kill",
		value: function kill() {
			// makes the panel inactive
			this.action_kill();
			this.isActive = false;
		}
	}, {
		key: "stripActions",
		value: function stripActions() {
			action_swipeLeft = function action_swipeLeft() {};
			action_swipeRight = function action_swipeRight() {};
			action_swipeUp = function action_swipeUp() {};
			action_swipeDown = function action_swipeDown() {};
			action_kill = function action_kill() {};
			action_move = function action_move(pos) {};
		}
	}, {
		key: "stripDrawActions",
		value: function stripDrawActions() {
			this.drawAction_swipeLeft = function () {};
			this.drawAction_swipeRight = function () {};
			this.drawAction_swipeUp = function () {};
			this.drawAction_swipeDown = function () {};
		}
	}, {
		key: "touchMove",
		value: function touchMove(pos, touch) {
			// triggered when the player moves their finger
			if (!this.isActive) return;

			this.touchPos = pos.clone();
			this.determineSwipeAction(pos);
			this.action_move(pos);
		}
	}, {
		key: "determineSwipeAction",
		value: function determineSwipeAction(pos) {
			// determines if a swipe action is triggered, and if so, which direction the swipe was
			var sdist = this.touchRadius * config.swipeRadius;

			if (this.origin.distance(pos) >= sdist) {
				var dif = pos.minus(this.origin);
				var dir = dif.getPointingSide();

				switch (dir) {
					case side.left:
						this.action_swipeLeft();break;
					case side.right:
						this.action_swipeRight();break;
					case side.up:
						this.action_swipeUp();break;
					case side.down:
						this.action_swipeDown();break;
				}
			}
		}
	}, {
		key: "hapticPulse",
		value: function hapticPulse() {
			// sends a haptic pulse to the device to let the use know exactly when a control was triggered
			if (hapticFeedbackEnabled()) window.navigator.vibrate(15);
		}
	}, {
		key: "getAnimProgress",
		value: function getAnimProgress() {
			// returns the progress between 0 and 1 how complete the panel opening animation is
			var animLength = 100;

			var r = timeElapsed - this.timeOpened;
			r = Math.min(r / animLength, 1);

			return r;
		}
	}, {
		key: "drawAction_swipeLeft",
		value: function drawAction_swipeLeft(pos) {
			drawArrow(pos, side.left);
		}
	}, {
		key: "drawAction_swipeRight",
		value: function drawAction_swipeRight(pos) {
			drawArrow(pos, side.right);
		}
	}, {
		key: "drawAction_swipeUp",
		value: function drawAction_swipeUp(pos) {
			drawArrow(pos, side.up);
		}
	}, {
		key: "drawAction_swipeDown",
		value: function drawAction_swipeDown(pos) {
			drawArrow(pos, side.down);
		}
	}, {
		key: "setSwipeSprite",
		value: function setSwipeSprite(dir, spCont) {
			// sets the appropriate drawAction to draw the specified spriteContainer
			var func = function func(pos) {
				spCont.bounds.setCenter(pos);
				spCont.draw();
			};
			switch (dir) {
				case side.left:
					this.drawAction_swipeLeft = func;break;
				case side.right:
					this.drawAction_swipeRight = func;break;
				case side.up:
					this.drawAction_swipeUp = func;break;
				case side.down:
					this.drawAction_swipeDown = func;break;
			}
		}
	}, {
		key: "setSwipeAction",
		value: function setSwipeAction(dir, action) {
			switch (dir) {
				case side.left:
					this.action_swipeLeft = action;break;
				case side.right:
					this.action_swipeRight = action;break;
				case side.up:
					this.action_swipeUp = action;break;
				case side.down:
					this.action_swipeDown = action;break;
			}
		}
	}, {
		key: "draw",
		value: function draw() {
			// draws the touch panel
			if (!this.isActive) return;

			var prog = this.getAnimProgress();
			var drawDist = this.radius * config.swipeRadius;

			// draws the backdrop
			var alpha = prog * 0.65;
			var maxSize = new vec2(this.backdrop.width, this.backdrop.height);
			var bdSprite = new spriteContainer(this.backdrop, new spriteBox(new vec2(), maxSize.clone()), new collisionBox(new vec2(), maxSize.multiply(prog)));
			bdSprite.bounds.setCenter(this.drawPos);
			renderContext.globalAlpha = alpha;
			bdSprite.draw();
			renderContext.globalAlpha = 1;

			//draws each active direction
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = this.activeDirections[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var dir = _step9.value;

					var off = vec2.fromSide(dir).multiply(prog * drawDist);
					switch (dir) {
						case side.left:
							this.drawAction_swipeLeft(this.drawPos.plus(off));break;
						case side.right:
							this.drawAction_swipeRight(this.drawPos.plus(off));break;
						case side.up:
							this.drawAction_swipeUp(this.drawPos.plus(off));break;
						case side.down:
							this.drawAction_swipeDown(this.drawPos.plus(off));break;
					}
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}
		}
	}], [{
		key: "getDefaultBackdrop",
		value: function getDefaultBackdrop(radius) {
			// returns the default circular backdrop with a transparent center
			var cvs = document.createElement("canvas");
			cvs.width = (radius + 15) * 2 * config.swipeRadius;
			cvs.height = cvs.width;
			var ctx = cvs.getContext("2d");

			drawCircleFill(ctx, new vec2(cvs.width / 2), cvs.width / 2, color.fromHex("#000"));

			ctx.globalCompositeOperation = "destination-out";
			drawCircleFill(ctx, new vec2(cvs.width / 2), cvs.width / 4, color.fromHex("#000"));
			ctx.globalCompositeOperation = "source-over";

			return cvs;
		}
	}]);

	return touchPanel;
}();

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

// used to play all sound effects and music according to the game's audio configuration


var audioMgr = function () {
	function audioMgr() {
		_classCallCheck(this, audioMgr);
	}

	_createClass(audioMgr, null, [{
		key: "init",
		value: function init() {
			// initialize static fields
			audioMgr.currentMusic = null;
			audioMgr.musicPlayCallback = null;
		}
	}, {
		key: "playSound",
		value: function playSound(sound) {
			var forceRestart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			// plays a sound unless it is already playing, if forceRestart is enabled, will restart the
			// sound if it is already playing
			if (forceRestart) sound.currentTime = 0;
			sound.volume = config.volume_sound;

			sound.play();
		}
	}, {
		key: "playMusic",
		value: function playMusic(track) {
			// starts looping a music track
			if (audioMgr.currentMusic) audioMgr.stopMusic();
			audioMgr.currentMusic = track;
			track.currentTime = 0;
			track.volume = config.volume_music;
			track.onended = function () {
				audioMgr.currentMusic.currentTime = 0;
				audioMgr.currentMusic.play();
			};

			track.play();

			// ensures that the music will begin playback when the browser allows it to
			if (track.paused) audioMgr.playMusicWhenPossible(track);

			// if music playback is successfull, remove previous music playback call
			else audioMgr.musicPlayCallback = null;
		}
	}, {
		key: "playMusicWhenPossible",
		value: function playMusicWhenPossible(track) {
			// some browsers prevent playback of audio under certain circumstances. This ensures that the
			// music will be played as soon as the browser allows it to if the initial playback request is
			// denied

			if (track.paused) {
				// store the track in audioMgr.musicPlayCallback so that only the most recent song that is
				// attempted to be played starts playing when available
				audioMgr.musicPlayCallback = track;
				setTimeout(function () {
					audioMgr.tryStartMusic();
				});
			}
		}
	}, {
		key: "tryStartMusic",
		value: function tryStartMusic() {
			// tries to start the track that was most recently attempted to be played
			if (!audioMgr.musicPlayCallback) return;
			var track = audioMgr.musicPlayCallback;
			log("starting music: " + track.src);
			this.playMusic(track);

			// if the track successfully plays, cancel the previous unsuccessful music playback calls
			if (!track.paused) audioMgr.musicPlayCallback = null;
		}
	}, {
		key: "pauseMusic",
		value: function pauseMusic() {
			if (!audioMgr.currentMusic) return;
			audioMgr.currentMusic.onended = null;
			audioMgr.currentMusic.pause();
		}
	}, {
		key: "resumeMusic",
		value: function resumeMusic() {
			if (!audioMgr.currentMusic) return;
			audioMgr.currentMusic.volume = config.volume_music;
			audioMgr.currentMusic.onended = function () {
				audioMgr.playMusic(audioMgr.currentMusic);
			};

			audioMgr.currentMusic.play();
		}
	}, {
		key: "stopMusic",
		value: function stopMusic() {
			if (!audioMgr.currentMusic) return;
			audioMgr.currentMusic.onended = null;
			audioMgr.currentMusic.pause();
			audioMgr.currentMusic.currentTime = 0;
			audioMgr.currentMusic = null;
		}
	}]);

	return audioMgr;
}();

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

// enumerate all the different types of points earned


var scoreTypes = {
	none: -1,
	roll: 0,
	pop: 1,
	combo: 2,
	bonus: 3,
	roundEnd: 4,
	levelEnd: 5
};

// static class used for keeping track of and adjusting the current player's score

var scoring = function () {
	function scoring() {
		_classCallCheck(this, scoring);
	}

	_createClass(scoring, null, [{
		key: "init",
		value: function init() {
			// set the static scoring fields
			scoring.memorizedScore = null;
			scoring.memorizedBallScore = null;
		}
	}, {
		key: "getRankSuffix",
		value: function getRankSuffix(rank) {
			// returns the correct rank suffix string (ie 'st' in '1st' or 'nd' in '2nd')
			switch (rank) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
			}
			return "th";
		}
	}, {
		key: "getRankStyle",
		value: function getRankStyle(rank) {
			switch (rank) {
				case 1:
					return textStyle.getDefault().setColor(textColor.yellow);
				case 2:
					return textStyle.getDefault().setColor(textColor.green);
				case 3:
					return textStyle.getDefault().setColor(textColor.cyan);
				case 4:
					return textStyle.getDefault().setColor(textColor.blue);
				case 5:
					return textStyle.getDefault().setColor(textColor.pink);
			}
			return null;
		}
	}, {
		key: "getRankColorAnim",
		value: function getRankColorAnim(rank) {
			switch (rank) {
				case 1:
					return new textAnim_rainbow();
				case 2:
					return new textAnim_blink(500, 0.85, textColor.yellow);
				case 3:
					return new textAnim_blink(650, 0.15, textColor.light);
				case 4:
					return new textAnim_blink(800, 0.85, textColor.light);
				case 5:
					return new textAnim_blink(950, 0.15, textColor.light);
			}
			return null;
		}
	}, {
		key: "rememberScore",
		value: function rememberScore() {
			// stores the score from the gameplay state so it can be accessed after the gamestate has ended (used 
			// while displaying most recent score in the scoreboard screen)
			scoring.memorizedScore = scoring.getCurrentScore();
			scoring.memorizedBallScore = scoring.getCurrentBallScore();
		}
	}, {
		key: "getCurrentScore",
		value: function getCurrentScore() {
			// retrieves the current score if available, otherwise gets the memorized score
			if (gameState.current instanceof state_gameplayState) return gameState.current.currentScore;
			return scoring.memorizedScore;
		}
	}, {
		key: "getCurrentBallScore",
		value: function getCurrentBallScore() {
			// retrieves the current score of the latest ball if available, otherwise gets the memorized ball score
			if (gameState.current instanceof state_gameplayState) return gameState.current.currentBallScore;
			return scoring.memorizedBallScore;
		}
	}, {
		key: "addScore",
		value: function addScore(points) {
			var splashPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var scoreType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : scoreTypes.roll;

			// adds points to the current score
			gameState.current.currentScore += points;

			// keep track of the round score
			gameState.current.currentBallScore += points;
			gameState.current.updateScoreVisuals(points);

			// create a splash effect if there is a defined splash position
			if (splashPos) scoring.createScoreSplashEffect(points, splashPos, scoreType);
		}
	}, {
		key: "createScoreSplashEffect",
		value: function createScoreSplashEffect(value, pos) {
			var scoreType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : scoreTypes.roll;

			// creates splash text at the specified pos

			var style = scoring.getScoreStyle(value, scoreType);

			var time = 450 + Math.min(value * 2, 500);
			if (scoreType == scoreTypes.bonus) time += 150;

			var splash = splashText.build(value.toString(), pos, time, style, style.anim);
			splash.add();
		}
	}, {
		key: "getScoreStyle",
		value: function getScoreStyle(score) {
			var scoreType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scoreTypes.roll;

			// gets a textStyle appropriate for the specified score
			var style = textStyle.getDefault();
			var anim = null;

			switch (scoreType) {
				case scoreTypes.roll:
					style.font = fonts.small;
					style.scale = 2;
					if (score >= 150) {
						anim = new textAnim_rainbow(400, 0.1);
						style.color = textColor.green;
					} else if (score >= 50) style.color = textColor.cyan;
					break;
				case scoreTypes.pop:
					style.font = fonts.small;
					if (score >= 150) anim = new textAnim_rainbow(400, 0.1);else if (score >= 120) anim = new textAnim_blink(100, 0, textColor.yellow);
					if (score >= 100) style.scale = 2;
					if (score >= 80) style.color = textColor.green;else if (score >= 40) style.color = textColor.cyan;
					break;
				case scoreTypes.bonus:
					if (score >= 1000) anim = new textAnim_rainbow(400, 0.1);else if (score >= 750) anim = new textAnim_blink(300, 0.2, textColor.yellow);
					if (score >= 500) style.color = textColor.green;else if (score >= 100) style.color = textColor.cyan;
					break;
			}

			style.anim = anim;
			return style;
		}
	}]);

	return scoring;
}();

// a data structure for maintaining combo information while the player is executing the combo


var scoreCombo = function () {
	function scoreCombo() {
		_classCallCheck(this, scoreCombo);

		this.comboID = 0;
		this.comboValue = 0;
		this.comboThreshold = 3;
		this.comboPointValue = 0;
	}

	_createClass(scoreCombo, [{
		key: "addValue",
		value: function addValue() {
			var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			// adds to what number of extent the combo has been executed
			this.comboValue += val;
			if (this.comboValue < this.comboThreshold) return;

			this.updatePointValue();
			this.updateFloatingTexts();
		}
	}, {
		key: "updatePointValue",
		value: function updatePointValue() {
			// updates how much points the whole combo is worth to the player
			this.comboPointValue = this.comboValue * 100;
		}
	}, {
		key: "updatefloatingTexts",
		value: function updatefloatingTexts() {}
	}, {
		key: "cashIn",
		value: function cashIn() {
			// gives the player the amount of points that the combo is worth
			scoring.addScore(this.comboPointValue);
		}
	}], [{
		key: "fromComboID",
		value: function fromComboID(comboID) {
			switch (comboID) {
				case floatingScoreFieldID.bombCombo:
					return new combo_bombs();
				case floatingScoreFieldID.coinCombo:
					return new combo_coins();
			}
			return new scoreCombo();
		}
	}]);

	return scoreCombo;
}();

// the combo structure for detonating multiple bombs with one ball


var combo_bombs = function (_scoreCombo) {
	_inherits(combo_bombs, _scoreCombo);

	function combo_bombs() {
		_classCallCheck(this, combo_bombs);

		var _this34 = _possibleConstructorReturn(this, (combo_bombs.__proto__ || Object.getPrototypeOf(combo_bombs)).call(this));

		_this34.comboID = floatingScoreFieldID.bombCombo;
		return _this34;
	}

	_createClass(combo_bombs, [{
		key: "updatePointValue",
		value: function updatePointValue() {
			var mult;
			if (this.comboValue < 4) mult = 200;else if (this.comboValue < 5) mult = 250;else mult = 300;

			// if 5 bombs are detonated in one go, all the bricks are converted to bombs
			if (this.comboValue == 4) gameState.current.phase.brickBombs = true;

			this.comboPointValue = mult * this.comboValue;
		}
	}, {
		key: "updateFloatingTexts",
		value: function updateFloatingTexts() {
			var str1 = this.comboValue.toString() + "x Chain Reaction!";
			var str2 = this.comboPointValue.toString() + " pts";
			var str3 = null;

			if (this.comboValue >= 5) str3 = "Brick Bombs!";

			var anim = new textAnim_blink(250, 0, textColor.yellow);
			var style = new textStyle(fonts.large, textColor.red);
			gameState.current.setFloatingScoreField(str1, style, floatingScoreFieldID.bombCombo, anim);
			gameState.current.setFloatingScoreField(str2, style, floatingScoreFieldID.bombComboPts, anim);
			if (str3) gameState.current.setFloatingScoreField(str3, style, floatingScoreFieldID.bombComboBonus, anim);
		}
	}]);

	return combo_bombs;
}(scoreCombo);

// the combo structure for collecting multiple coins with one ball


var combo_coins = function (_scoreCombo2) {
	_inherits(combo_coins, _scoreCombo2);

	function combo_coins() {
		_classCallCheck(this, combo_coins);

		var _this35 = _possibleConstructorReturn(this, (combo_coins.__proto__ || Object.getPrototypeOf(combo_coins)).call(this));

		_this35.comboID = floatingScoreFieldID.coinCombo;
		_this35.comboThreshold = 2;
		return _this35;
	}

	_createClass(combo_coins, [{
		key: "updatePointValue",
		value: function updatePointValue() {
			var val = 0;

			// adds an extra ball if 5 coins are collected
			if (this.comboValue == 5) gameState.current.nextTileforms.splice(0, 0, tileform.getPiece_ball(gameState.current.currentLevel.getRandomColor()));

			// adds an extra gold ball if 10 coins are collected
			else if (this.comboValue == 10) gameState.current.nextTileforms.splice(0, 0, tileform.getPiece_ball(balls.gold));

				// adds detPack if 15 coins are collected
				else if (this.comboValue == 15) gameState.current.nextTileforms.splice(0, 0, tileform.getPiece_detPack());

			if (this.comboValue >= 10) val = 2250 * Math.floor(this.comboValue / 5);

			this.comboPointValue = val;
		}
	}, {
		key: "updateFloatingTexts",
		value: function updateFloatingTexts() {
			var anim = new textAnim_blink(250, 0, textColor.light);
			var style = new textStyle(fonts.large, textColor.yellow);
			var str1 = this.comboValue.toString() + "x Coins";
			for (var i = Math.floor(this.comboValue / 5); i > 0; i--) {
				str1 += "!";
			}var str2 = null;
			var str3 = null;
			var anim2 = anim;
			if (this.comboValue >= 5) {
				str3 = "extra ball!";
			}
			if (this.comboValue >= 10) {
				str3 = "extra gold ball!!";
			}
			if (this.comboValue >= 15) {
				str3 = "det-pack gained!!!";
			}
			if (this.comboPointValue > 0) {
				str2 = this.comboPointValue + " pts";
				if (this.comboValue >= 15) {
					str2 += "! Mamma Mia!";
					anim2 = new textAnim_compound([new textAnim_blink(250, 0.1, textColor.red), new textAnim_blink(250, 0.2, textColor.blue), new textAnim_yOffset()]);
				}
			}

			gameState.current.setFloatingScoreField(str1, style, floatingScoreFieldID.coinCombo, anim);

			if (str3 != null) gameState.current.setFloatingScoreField(str3, style, floatingScoreFieldID.coinComboBonus, anim);

			if (str2 != null) gameState.current.setFloatingScoreField(str2, style, floatingScoreFieldID.coinComboPts, anim2);
		}
	}]);

	return combo_coins;
}(scoreCombo);

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

// used for creating visual effects like explosions in the game


var effect = function () {
	function effect() {
		_classCallCheck(this, effect);

		this.pos = new vec2();
		this.dead = false;
	}

	_createClass(effect, [{
		key: "update",
		value: function update(dt) {
			if (this.dead) effects.splice(effects.indexOf(this), 1);
		}
	}, {
		key: "draw",
		value: function draw() {}
	}, {
		key: "add",
		value: function add() {
			effects.push(this);
		}
	}, {
		key: "kill",
		value: function kill() {
			// removes an effect from the effect array
			this.dead = true;
		}
	}], [{
		key: "createPoof",
		value: function createPoof(pos) {
			// creates a poof effect at the specified position
			if (!config.explosionEffects) return;
			var e = animatedSpriteEffect.build(gfx.effect_poof, 33, animatedSpriteEffect.getFrames(gfx.effect_poof, 10));
			e.pos = pos;

			e.add();
			return e;
		}
	}, {
		key: "createExplosion",
		value: function createExplosion(pos) {
			// creates an explosion effect at the specified location
			if (!config.explosionEffects) return;
			if (hapticFeedbackEnabled()) window.navigator.vibrate(50);
			var e = animatedSpriteEffect.build(gfx.effect_explosion, 33, animatedSpriteEffect.getFrames(gfx.effect_explosion, 12));
			e.pos = pos;

			e.add();
			return e;
		}
	}]);

	return effect;
}();

// a type of effect that uses data from a sprite sheet image


var animatedSpriteEffect = function (_effect) {
	_inherits(animatedSpriteEffect, _effect);

	function animatedSpriteEffect() {
		_classCallCheck(this, animatedSpriteEffect);

		var _this36 = _possibleConstructorReturn(this, (animatedSpriteEffect.__proto__ || Object.getPrototypeOf(animatedSpriteEffect)).call(this));

		_this36.animStartTime = gameState.current.timeElapsed;
		_this36.spriteSheet = null;
		_this36.animRate = 33;
		_this36.frames = []; // a list of spriteBox objects that will be cycled through to create the animation
		return _this36;
	}

	_createClass(animatedSpriteEffect, [{
		key: "getCurrentAnimFrame",
		value: function getCurrentAnimFrame() {
			// returns the current frame number that the animation is on
			// returns null if the animation start time is somehow after the current game time
			if (this.animStartTime > gameState.current.timeElapsed) return null;
			var totalAnimLength = this.frames.length * this.animRate;
			var animElapsed = gameState.current.timeElapsed - this.animStartTime;

			// returns null if the animation is complete
			if (animElapsed >= totalAnimLength) return null;

			var frame = Math.floor(animElapsed / this.animRate);
			return frame;
		}
	}, {
		key: "draw",
		value: function draw() {
			// renders the animation at it's current position
			var frameNum = this.getCurrentAnimFrame();
			if (frameNum == null) {
				this.kill();
				return;
			}
			var frame = this.frames[frameNum];

			var spriteBounds = new collisionBox(new vec2(), frame.size.clone());
			spriteBounds.setCenter(this.pos);
			var sprite = new spriteContainer(this.spriteSheet, frame, spriteBounds);
			sprite.draw();
		}
	}], [{
		key: "getFrames",
		value: function getFrames(spriteSheet, frameCount) {
			// generates a list of spriteBox objects from the specified data
			var r = [];
			var width = Math.round(spriteSheet.width / frameCount);

			for (var i = 0; i < frameCount; i++) {
				var tpos = new vec2(i * width, 0);
				var f = new spriteBox(tpos, new vec2(width, spriteSheet.height));

				r.push(f);
			}

			return r;
		}
	}, {
		key: "build",
		value: function build(spriteSheet, animRate, frames) {
			// builds an animated sprite effect from the specified data
			var r = new animatedSpriteEffect();

			r.spriteSheet = spriteSheet;
			r.animRate = animRate;
			r.frames = frames;

			return r;
		}
	}]);

	return animatedSpriteEffect;
}(effect);

// a type of effect that temporarily shows floating text on the screen


var splashText = function (_effect2) {
	_inherits(splashText, _effect2);

	function splashText() {
		_classCallCheck(this, splashText);

		var _this37 = _possibleConstructorReturn(this, (splashText.__proto__ || Object.getPrototypeOf(splashText)).call(this));

		_this37.text = "";
		_this37.pos = new vec2();
		_this37.style = textStyle.getDefault();
		_this37.animStartTime = gameState.current.timeElapsed;
		_this37.maxLife = 500;
		_this37.animLength = _this37.maxLife;
		_this37.preRender = null;
		_this37.anim = null;
		_this37.scaling = true;
		return _this37;
	}

	_createClass(splashText, [{
		key: "setLifetime",
		value: function setLifetime(ms) {
			// resets the animation start time and sets the animation end time as specified in milliseconds
			this.animStartTime = gameState.current.timeElapsed;
			this.maxLife = ms;
			this.animLength = this.maxLife;
			return this;
		}
	}, {
		key: "setText",
		value: function setText(txt) {
			this.text = txt;
			this.preRenderText();
		}
	}, {
		key: "getAnimProgress",
		value: function getAnimProgress() {
			// returns a number between 0 and 1 indicating how close to the end of the animation the effect currently is
			var endTime = this.animStartTime + this.maxLife;
			if (endTime < gameState.current.timeElapsed || this.animStartTime > gameState.current.timeElapsed) return null;

			// split into two different animations: enter and exit
			var enterAnim_start = 0;
			var enterAnim_end = this.animLength / 2;
			var exitAnim_end = this.maxLife;
			var exitAnim_start = exitAnim_end - this.animLength / 2;

			// calculate delta time (how long the effect has existed in milliseconds)
			var dtime = gameState.current.timeElapsed - this.animStartTime;

			// if the deltaTime of the effect is between the two animations, return a the midpoint
			if (dtime >= enterAnim_end && dtime <= exitAnim_start) return 0.5;

			// if the enter anim is happening
			if (dtime < exitAnim_start) return dtime / this.animLength;
			// if the exit anim is happening
			return 0.5 + (dtime - exitAnim_start) / this.animLength;
		}
	}, {
		key: "startEndAnim",
		value: function startEndAnim() {
			if (gameState.current.timeElapsed >= this.animStartTime + this.maxLife) return;
			this.maxLife = gameState.current.timeElapsed - this.animStartTime + this.animLength / 2;
		}
	}, {
		key: "preRenderText",
		value: function preRenderText() {
			// generates the text preRender object
			this.preRender = preRenderedText.fromString(this.text, this.pos, this.style);
		}
	}, {
		key: "draw",
		value: function draw() {
			// renders the splash text
			if (!this.preRender) this.preRenderText();
			var prog = this.getAnimProgress();
			if (prog == null) {
				this.kill();
				return;
			}

			var pr = !!this.anim ? this.preRender.animated(this.anim) : this.preRender;
			if (this.scaling) {
				var scl = Math.sin(prog * Math.PI);
				pr = pr.scaled(scl);
			}

			pr.draw();
		}
	}], [{
		key: "build",
		value: function build(text, pos) {
			var lifetime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
			var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : textStyle.getDefault();
			var anim = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

			// bulds a splashText effect from the specified data
			var r = new splashText();

			r.text = text;
			r.pos = pos;
			r.style = style;
			r.anim = anim;
			r.setLifetime(lifetime);

			return r;
		}
	}]);

	return splashText;
}(effect);

///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerate the different entity types


var entities = {
	none: -1,
	tube: 0,
	block: 1,
	ball: 2
	// enumerate the different tube entity IDs
};var tubes = {
	none: -1,
	S_horizontal: 0,
	S_vertical: 1,
	T_horizontalDown: 2,
	T_horizontalUp: 3,
	T_verticalRight: 4,
	T_verticalLeft: 5,
	L_downRight: 6,
	L_downLeft: 7,
	L_upRight: 8,
	L_upLeft: 9,
	quad: 10
	// enumerate the different block entity IDs
};var blocks = {
	none: -1,
	block_brick: 0,
	block_bomb: 1
	// enumerate the different ball entity IDs
};var balls = {
	none: -1,
	grey: 0,
	red: 1,
	blue: 2,
	green: 3,
	gold: 4
	// enumerate the different tube colors
};var tubeColors = {
	grey: 0,
	red: 1,
	blue: 2,
	green: 3,
	gold: 4,
	black: 5

	// object that occupies an area in the tile grid
};
var tile = function () {
	function tile() {
		_classCallCheck(this, tile);

		this.gridPos = new vec2(-1);
		this.setEntity(entities.none, entities.none);
		this.tintColor = new color();
		this.tileVariant = -1;
		this.item = null;
		this.tagged = false;
		this.charged = false;
	}

	_createClass(tile, [{
		key: "isEmpty",
		value: function isEmpty() {
			return this.entityID == entities.none || this.entityType == entities.none;
		}
	}, {
		key: "setEntity",
		value: function setEntity(entityID) {
			var entityType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : entities.tube;

			this.entityType = entityType;
			this.entityID = entityID;

			switch (entityType) {
				case entities.tube:
					this.m_destroy = tile.DST_normal;
					break;
				case entities.ball:
					this.m_checkPlacement = tile.CP_ball;
					break;
				case entities.block:
					this.m_destroy = tile.DST_normal;
					if (this.entityID == blocks.block_bomb) {
						this.m_checkPlacement = tile.CP_bomb;
						this.m_rollThrough = tile.RT_bomb;
						this.m_destroy = tile.DST_bomb;
					}
					break;
				default:
					this.m_rollThrough = tile.RT_normal;
					this.m_destroy = tile.DST_normal;
					break;
			}
		}
	}, {
		key: "isEntity",
		value: function isEntity(entityID) {
			var entityType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : entities.tube;

			return this.entityID == entityID && this.entityType == entityType;
		}
	}, {
		key: "isEntityType",
		value: function isEntityType(entityType) {
			return this.entityType == entityType;
		}
	}, {
		key: "getDirectNeighbors",
		value: function getDirectNeighbors() {
			// returns the neighbors to the left, right, top, and bottom of this tile
			var npos = [this.gridPos.plus(new vec2(0, 1)), this.gridPos.plus(new vec2(0, -1)), this.gridPos.plus(new vec2(1, 0)), this.gridPos.plus(new vec2(-1, 0))];

			var r = [];
			for (var i = npos.length - 1; i >= 0; i--) {
				if (tile.isOutOfBounds(npos[i])) continue;

				var ttile = tile.at(npos[i]);
				if (!ttile.isEmpty()) r.push(ttile);
			};

			return r;
		}
	}, {
		key: "getConectedNeighbors",
		value: function getConectedNeighbors() {
			// returns all the nearby tiles that this tile is connected to
			var os = this.getOpenSides();
			var r = [];

			var ths = this;
			os.forEach(function (odir) {
				var tpos = ths.gridPos.plus(vec2.fromSide(odir));
				var ttile = tile.at(tpos);
				if (ttile.getOpenSides().includes(invertedSide(odir))) r.push(ttile);
			});

			return r;
		}
	}, {
		key: "getOpenSides",
		value: function getOpenSides() {
			if (this.entityID == entities.none) return [side.left, side.right, side.up, side.down];
			return tile.getEntityOpenSides(this.entityID, this.entityType);
		}
	}, {
		key: "getUnblockedSides",
		value: function getUnblockedSides() {
			var os = this.getOpenSides();
			var us = [];

			var ths = this;
			os.forEach(function (dir) {
				if (tile.at(ths.gridPos.plus(vec2.fromSide(dir))).getOpenSides().includes(invertedSide(dir))) us.push(dir);
			});

			return us;
		}
	}, {
		key: "getSprite",
		value: function getSprite() {
			if (this.entityID == entities.none) return null;
			var r = tile.getEntitySprite(this.entityID, this.entityType);
			var bounds = new collisionBox(tile.toScreenPos(this.gridPos, false), new vec2(tile.tilesize));
			r.bounds = bounds;
			return r;
		}
	}, {
		key: "setTubeColor",
		value: function setTubeColor() {
			var tubecolor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tubeColors.grey;

			// sets the tube color if the tile entity is a tube type
			if (this.entityType != entities.tube) return;
			this.tileVariant = tubecolor;
		}
	}, {
		key: "setItem",
		value: function setItem(itemOb) {
			itemOb.setToTile(this);
		}
	}, {
		key: "place",
		value: function place() {
			var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (pos) this.gridPos = pos;
			tile.setTileAt(this, this.gridPos);
		}
	}, {
		key: "destroy",
		value: function destroy() {
			// destroys the tile
			var tpos = this.gridPos.clone();
			tile.setTileAt(tile.getEmpty(tpos), tpos);
			effect.createPoof(tile.toScreenPos(tpos));
			this.m_destroy(this);

			// makes the chain reaction of the charged tile spread to other connected tiles
			if (this.charged) this.doChargedChainReaction();
		}
	}, {
		key: "doChargedChainReaction",
		value: function doChargedChainReaction() {
			// makes the chain reaction of the charged tile spread to other connected tiles
			var ttiles = this.getConectedNeighbors();
			for (var i = ttiles.length - 1; i >= 0; i--) {
				if (!ttiles[i].isEmpty()) {
					if (!ttiles[i].tagged) {
						ttiles[i].tagged = true;
						gameState.current.phase.tilesChargeTagged.push(ttiles[i]);
					}
				}
			}
		}
	}, {
		key: "tag",
		value: function tag(ballOb) {
			// gets tagged by ball rolling through it
			this.tagged = true;
			gameState.current.tilesTagged.push(this);
		}
	}, {
		key: "checkPlacement",
		value: function checkPlacement() {
			this.m_checkPlacement(this);
		}
	}, {
		key: "rollThrough",
		value: function rollThrough() {
			var ballOb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (this.tagged) return;
			if (this.isEntity(entities.tube)) if (ballOb.ballType != balls.gold && this.tileVariant != tubeColors.gold) if (ballOb.ballType != this.tileVariant) return;
			this.m_rollThrough(this, ballOb);
		}
	}, {
		key: "collectItem",
		value: function collectItem() {
			var ballOb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// collects the item in the tile
			if (ballOb.isVirtual) return;
			if (this.item) this.item.activate(this);
		}
	}, {
		key: "m_checkPlacement",
		value: function m_checkPlacement() {
			var self = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		}
	}, {
		key: "m_rollThrough",
		value: function m_rollThrough() {
			var self = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var ballOb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		}
	}, {
		key: "m_destroy",
		value: function m_destroy(self) {}
	}, {
		key: "clone",
		value: function clone() {
			// returns an identical tile object of a seperate instance
			var r = tile.fromData(this.gridPos.clone(), this.entityID, this.entityType);

			return r;
		}
	}, {
		key: "draw",
		value: function draw() {
			// draw the sprite
			this.drawAtScreenPos(tile.toScreenPos(this.gridPos, false));
		}
	}, {
		key: "drawAtScreenPos",
		value: function drawAtScreenPos(pos) {
			var rotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var drawTint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			// draw the sprite at the specified position
			if (drawTint) this.drawTintAtScreenPos(pos);

			var sprite = this.getSprite();

			if (this.entityType == entities.tube) {
				var sp = sprite.clone();
				var spriteYOff = Math.floor(this.tileVariant * tile.tilesize * 2);
				if (this.tagged) spriteYOff = Math.floor(tubeColors.black * tile.tilesize * 2);
				sp.sprite.pos.y += spriteYOff;
				sprite = sp;
			}

			if (!sprite) return;
			sprite.bounds.pos = pos;
			if (rotation) sprite.rotation = rotation;
			sprite.draw();

			if (this.item) this.item.draw(pos.plus(new vec2(tile.tilesize / 2)));
		}
	}, {
		key: "drawTintAtScreenPos",
		value: function drawTintAtScreenPos(pos) {
			var col = this.tintColor;
			if (this.charged) col = color.fromRGBA(100, 100, 0, 0.5);else if (this.tagged) col = color.fromRGBA(255, 255, 255, 0.5);
			col.setFill();
			renderContext.fillRect(pos.x, pos.y, tile.tilesize, tile.tilesize);
		}
	}], [{
		key: "fromData",
		value: function fromData(pos, entityID) {
			var entityType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : entities.tube;

			// used to construct a tile from the specified data
			var r = new tile();
			r.tintColor = tile.normalTint;
			r.gridPos = pos;
			r.setEntity(entityID, entityType);
			return r;
		}
	}, {
		key: "init",
		value: function init() {
			// initializes the static fields for the tile class
			tile.tilesize = 32;
			tile.normalTint = color.fromRGBA(0, 0, 0, 0.4);
			tile.offset = new vec2(-screenBounds.width % tile.tilesize - 2, -screenBounds.height % tile.tilesize - 2).plus(new vec2(tile.tilesize));
			tile.gridBounds = collisionBox.fromSides(0, 0, 10, 20);
			tile.grid = [];
			tile.constructGrid();
			tile.nextTileformSlot = screenBounds.topRight.plus(new vec2(-74, 74));

			// gets the sprite of each entity type offset to its ID
			tile.entitySprites = [new spriteBox(new vec2(tile.tilesize * 0, tile.tilesize * 0), new vec2(tile.tilesize)), // S_horizontal: 0,
			new spriteBox(new vec2(tile.tilesize * 1, tile.tilesize * 0), new vec2(tile.tilesize)), // S_vertical: 1,
			new spriteBox(new vec2(tile.tilesize * 2, tile.tilesize * 0), new vec2(tile.tilesize)), // T_horizontalDown: 2,
			new spriteBox(new vec2(tile.tilesize * 3, tile.tilesize * 0), new vec2(tile.tilesize)), // T_horizontalUp: 3,
			new spriteBox(new vec2(tile.tilesize * 2, tile.tilesize * 1), new vec2(tile.tilesize)), // T_verticalRight: 4,
			new spriteBox(new vec2(tile.tilesize * 3, tile.tilesize * 1), new vec2(tile.tilesize)), // T_verticalLeft: 5,
			new spriteBox(new vec2(tile.tilesize * 4, tile.tilesize * 0), new vec2(tile.tilesize)), // L_downRight: 6,
			new spriteBox(new vec2(tile.tilesize * 5, tile.tilesize * 0), new vec2(tile.tilesize)), // L_downLeft: 7,
			new spriteBox(new vec2(tile.tilesize * 4, tile.tilesize * 1), new vec2(tile.tilesize)), // L_upRight: 8,
			new spriteBox(new vec2(tile.tilesize * 5, tile.tilesize * 1), new vec2(tile.tilesize)), // L_upLeft: 9,
			new spriteBox(new vec2(tile.tilesize * 0, tile.tilesize * 1), new vec2(tile.tilesize)), // quad: 10 
			//~~ bricks:
			new spriteBox(new vec2(tile.tilesize * 0, 0), new vec2(tile.tilesize)), // block_brick: 11,
			new spriteBox(new vec2(tile.tilesize * 1, 0), new vec2(tile.tilesize)), // block_bomb: 12 
			//~~ balls:
			new spriteBox(new vec2(tile.tilesize * 0, 0), new vec2(tile.tilesize)), // grey: 13,
			new spriteBox(new vec2(tile.tilesize * 1, 0), new vec2(tile.tilesize)), // orange: 14,
			new spriteBox(new vec2(tile.tilesize * 2, 0), new vec2(tile.tilesize)), // blue: 15,
			new spriteBox(new vec2(tile.tilesize * 3, 0), new vec2(tile.tilesize)), // green: 16,
			new spriteBox(new vec2(tile.tilesize * 4, 0), new vec2(tile.tilesize))];
			// gets the open side list of each entity type offset to its ID
			tile.entityOpenSides = [[side.left, side.right], // S_horizontal: 0,
			[side.up, side.down], // S_vertical: 1,
			[side.left, side.right, side.down], // T_horizontalDown: 2,
			[side.left, side.right, side.up], // T_horizontalUp: 3,
			[side.right, side.up, side.down], // T_verticalRight: 4,
			[side.left, side.up, side.down], // T_verticalLeft: 5,
			[side.right, side.down], // L_downRight: 6,
			[side.left, side.down], // L_downLeft: 7,
			[side.right, side.up], // L_upRight: 8,
			[side.left, side.up], // L_upLeft: 9,
			[side.left, side.right, side.up, side.down], // quad: 10,
			[], // block_brick: 11,
			[side.left, side.right, side.up, side.down], // block_bomb: 12
			[], // ball: 13
			[], // ball: 14
			[], // ball: 15
			[], // ball: 16
			[] // ball: 17
			];
			// gets the entityID after being rotated by 90 degrees clockwise
			tile.rotatedEntityID = [1, // S_horizontal: 0,
			0, // S_vertical: 1,
			5, // T_horizontalDown: 2,
			4, // T_horizontalUp: 3,
			2, // T_verticalRight: 4,
			3, // T_verticalLeft: 5,
			7, // L_downRight: 6,
			9, // L_downLeft: 7,
			6, // L_upRight: 8,
			8, // L_upLeft: 9,
			10, // quad: 10,
			0, // block_brick: (11 - offIDCount) -> 0
			1, // block_bomb: (12 - offIDCount) -> 1
			1, // ball(grey): (13 - offIDCount) -> 1
			2, // ball(orange): (14 - offIDCount) -> 2
			3, // ball(blue): (15 - offIDCount) -> 3
			0, // ball(green): (16 - offIDCount) -> 0
			4];
		}
	}, {
		key: "constructGrid",
		value: function constructGrid() {
			// constructs a tile grid full of empty tiles
			tile.grid = [];
			for (var x = tile.gridBounds.left; x < tile.gridBounds.right; x++) {
				// creates an empty array for each valid iteration of the horizontal grid bounds
				tile.grid[x] = [];
				for (var y = tile.gridBounds.top; y < tile.gridBounds.bottom; y++) {
					// adds an empty tile at each available location inside the grid bounds
					tile.grid[x][y] = tile.getEmpty(new vec2(x, y));
				}
			}
		}
	}, {
		key: "drawGrid",
		value: function drawGrid() {
			// draws each tile in the grid
			tile.grid.forEach(function (tileArr, x) {
				tileArr.forEach(function (tile, y) {
					tile.draw();
				});
			});
		}
	}, {
		key: "iterateGrid",
		value: function iterateGrid() {
			var func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (tileOb, x, y) {};

			// iterates through each tile in the tile grid applying the specified function
			for (var x = tile.gridBounds.left; x < tile.gridBounds.right; x++) {
				for (var y = tile.gridBounds.top; y < tile.gridBounds.bottom; y++) {
					func(tile.grid[x][y], x, y);
				}
			}
		}
	}, {
		key: "getEmpty",
		value: function getEmpty() {
			var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// returns an empty tile
			var r = new tile();
			if (pos) r.gridPos = pos;
			return r;
		}
	}, {
		key: "getFull",
		value: function getFull() {
			var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// returns a full tile
			var r = new tile();
			r.setEntity(blocks.block_brick, entities.block);
			r.tintColor = tile.normalTint;
			if (pos) r.gridPos = pos;
			return r;
		}
	}, {
		key: "getEntityOpenSides",
		value: function getEntityOpenSides(entityID) {
			var entityType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : entities.tube;

			var uid = tile.getEntityUID(entityID, entityType);
			return tile.entityOpenSides[uid];
		}
	}, {
		key: "getEntitySprite",
		value: function getEntitySprite(entityID) {
			var entityType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : entities.tube;

			var spritesheet = null;

			// sets the spritesheet according to the entity's type
			switch (entityType) {
				case entities.none:
					return null;
				case entities.tube:
					spritesheet = gfx.tiles_tubes;
					break;
				case entities.block:
					spritesheet = gfx.tiles_blocks;
					break;
				case entities.ball:
					spritesheet = gfx.tiles_balls;
					break;
			}

			var uid = tile.getEntityUID(entityID, entityType);
			return new spriteContainer(spritesheet, tile.entitySprites[uid]);
		}
	}, {
		key: "getEntityRotatedID",
		value: function getEntityRotatedID(direction, entityID) {
			var entityType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : entities.tube;

			var uid = tile.getEntityUID(entityID, entityType);

			// if clockwise, rotate once by 90 degrees clockwise
			var r = uid;
			if (direction == 1) r = tile.rotatedEntityID[r];
			// if counter clockwise, rotate by 90 degrees clockwise 3 times (270 degrees) to get the same result as rotating by 90 degrees CCW
			else for (var i = 3; i > 0; i--) {
					r = tile.rotatedEntityID[r];

					// if not on the last iteration, set r to the new rotated object's UID instead of the entityID
					if (i > 1) r = tile.getEntityUID(r, entityType);
				}

			return r;
		}
	}, {
		key: "toTilePos",
		value: function toTilePos(screenPos) {
			// converts a screen position to a coordinate on the tile grid
			var r = screenPos.minus(tile.offset);

			r = r.multiply(1 / tile.tilesize);
			r = new vec2(Math.floor(r.x), Math.floor(r.y));

			return r;
		}
	}, {
		key: "toScreenPos",
		value: function toScreenPos(tilePos) {
			var centered = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			// converts a coordinate on the tile grid to a screen position
			var r = tilePos.multiply(tile.tilesize).plus(tile.offset);

			if (centered) r = r.plus(new vec2(tile.tilesize / 2));

			return r;
		}
	}, {
		key: "at",
		value: function at(pos) {
			var ypos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			// returns the tile at the specified grid position
			// paramaters accept format: at(vec2) or at(int, int)
			if (ypos != null) return tile.at(new vec2(pos, ypos));

			// returns a full tile if the position is below, or to the left or right of the tile grid bounds
			if (pos.y >= tile.gridBounds.bottom || pos.x < tile.gridBounds.left || pos.x >= tile.gridBounds.right) {
				if (!tile.grid[pos.x]) return tile.getFull(pos);
				return tile.fromAny(tile.grid[pos.x][pos.y], false, pos);
			}
			// returns an empty tile if the position is above the bottom of the tile grid (if the tile at pos is undefined)
			if (!tile.grid[pos.x]) return tile.getEmpty(pos);
			return tile.fromAny(tile.grid[pos.x][pos.y], true, pos);
		}
	}, {
		key: "setTileAt",
		value: function setTileAt(tileOb, pos) {
			var ypos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			// sets the specified tile at the specified grid position
			// parameters accept formats: setTileAt(tile, vec2) or setTileAt(tile, int, int)
			if (ypos != null) tile.setTileAt(tileOb, new vec2(pos, ypos));

			// tiles outside of the grid cannot be set
			if (tile.isOutOfBounds(pos)) return;

			tileOb.gridPos = pos;
			if (!tile.grid[pos.x]) tile.grid[pos.x] = [];
			tile.grid[pos.x][pos.y] = tileOb;
		}
	}, {
		key: "isOutOfBounds",
		value: function isOutOfBounds(pos) {
			var ypos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (ypos != null) return tile.isOutOfBounds(new vec2(pos, ypos));
			return pos.x < tile.gridBounds.left || pos.x >= tile.gridBounds.right ||
			//pos.y < tile.gridBounds.top ||
			pos.y >= tile.gridBounds.bottom;
		}
	}, {
		key: "fromAny",
		value: function fromAny(ob) {
			var empty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
			var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			// returns a tile from ANY object type
			// if the object is a tile, simply return the object
			if (ob instanceof tile) return ob;
			// otherwise, return either an empty or full tile at the specified position
			var r = empty ? tile.getEmpty(pos) : tile.getFull(pos);

			return r;
		}
	}, {
		key: "getAllTilesOfType",
		value: function getAllTilesOfType() {
			var entitytype = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : entities.tube;

			// returns all the tiles in the tile grid that are of the specified type
			var r = [];
			var func = function func(tileOb) {
				if (tileOb.entityType == entitytype) r.push(tileOb);
			};
			tile.iterateGrid(func);

			return r;
		}
	}, {
		key: "getEntityUID",
		value: function getEntityUID(entityID) {
			var entityType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : entities.tube;

			var off = 0;

			// returns null entity if either the entity type or id is none
			if (entityID < 0 || entityType < 0) return entities.none;

			// adds the length of the entity specific enumerator to offset the entityID so that the correct UID offset is returned
			// the switch statement probably looks like a dumb way to do it but it will be cleaner if I end up adding more entity types
			switch (entityType) {
				case entities.ball:
					off += Object.keys(blocks).length - 1;
				case entities.block:
					off += Object.keys(tubes).length - 1;
				default:
					break;
			}

			return off + entityID;
		}
	}, {
		key: "getUIDEntityType",
		value: function getUIDEntityType(uid) {
			if (uid > tile.getEntityUID(0, entities.ball)) return entities.ball;
			if (uid > tile.getEntityUID(0, entities.block)) return entities.block;
			return entities.tube;
		}
	}, {
		key: "getUIDEntityID",
		value: function getUIDEntityID(uid) {
			var type = tile.getUIDEntityType(uid);
			var off = tile.getEntityUID(0, type);
			return uid - off;
		}
	}, {
		key: "explodeAt",
		value: function explodeAt(pos) {
			var earnpoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			// causes a destructive explosion at the specified position
			effect.createExplosion(tile.toScreenPos(pos));
			audioMgr.playSound(sfx.explosion);

			// switches the game phase to destroy tiles phase if it's not already an instance of the destroy tiles phase
			if (!(gameState.current.phase instanceof phase_destroyTaggedTiles)) {
				var phase = new phase_destroyTaggedTiles(gameState.current);
				gameState.current.switchGameplayPhase(phase);
			}

			// iterate through the 9 tiles the explosion covers centered at the specified tile pos
			var tilesDestroyed = 0;
			for (var y = pos.y - 1; y <= pos.y + 1; y++) {
				for (var x = pos.x - 1; x <= pos.x + 1; x++) {
					// ignore out of bounds positions
					if (tile.isOutOfBounds(x, y)) continue;
					var ttile = tile.at(x, y);
					if (!ttile.isEmpty()) {
						if (gameState.current.phase instanceof phase_destroyTaggedTiles) {
							// if the tile is a bomb, set it to be detonated next
							if (ttile.isEntity(blocks.block_bomb, entities.block)) {
								// if the tile is already set to be detonated, ignore it
								if (ttile.tagged) continue;
								ttile.tagged = true;
								gameState.current.tilesTagged.push(ttile);
							}
							// destroy the tile and add to the destruction counter
							else ttile.destroy();
							tilesDestroyed += 1;
						} else {
							ttile.destroy();
							tilesDestroyed += 1;
						}
					}
				}
			}

			// earn points based on how many tiles were destroyed
			if (earnpoints) scoring.addScore(100 + tilesDestroyed * 50, tile.toScreenPos(pos), scoreTypes.bonus);
		}
	}, {
		key: "checkTilePlacement",
		value: function checkTilePlacement() {
			var ctiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// checks the tile placement of all the specified tiles

			// the iteration function that is called on each specified tile
			var iterator = function iterator(tileOb) {
				if (tileOb.isEmpty()) return;
				tileOb.checkPlacement();
			};

			// if no tiles are specified, check all the tiles in the tile grid
			if (!ctiles) tile.iterateGrid(iterator);else ctiles.forEach(iterator);
		}
	}, {
		key: "getFullRows",
		value: function getFullRows() {
			// returns a list of the rows of tiles that are filled out
			var r = [];
			var g = tile.grid[0];

			// add each row to the list who's leftmost column has a non-empty tile in it
			for (var i = g.length - 1; i >= 0; i--) {
				if (!g[i].isEmpty()) r.push(i);
			} // iterate through each column and remove any rows that have an empty tile in that column
			for (var x = 1; x < tile.gridBounds.size.x; x++) {
				g = tile.grid[x];
				for (var _i2 = r.length - 1; _i2 >= 0; _i2--) {
					if (g[r[_i2]].isEmpty()) r.splice(_i2, 1);
				}
				// if all the rows have been eliminated, return an empty list
				if (r.length <= 0) return [];
			}

			// return the list of remaining rows
			return r;
		}
	}, {
		key: "getNewFullRows",
		value: function getNewFullRows() {
			// gets all the full rows that haven't been charged yet
			var fr = tile.getFullRows();

			// go through each full row to check if it has already been counted as full
			for (var i = fr.length - 1; i >= 0; i--) {
				// checks each tile in the row to make sure that at least one tile isn't charged already, which would indicate that
				// the row hasn't yet been counted as filled
				var isNew = false;
				for (var x = 0; x < tile.gridBounds.size.x; x++) {
					var ttile = tile.at(x, fr[i]);
					if (!ttile.charged) {
						isNew = true;
						break;
					}
				}
				// remove the row from the return array if it's not newly charged
				if (!isNew) fr.splice(i, 1);
			};

			return fr;
		}
	}, {
		key: "checkForFullRows",
		value: function checkForFullRows() {
			// checks to see if any of the rows of tiles have been filled out
			var fr = tile.getNewFullRows();

			fr.forEach(function (row) {
				for (var x = 0; x < tile.gridBounds.size.x; x++) {
					var ttile = tile.at(x, row);
					if (ttile.entityType == entities.tube) ttile.tileVariant = tubeColors.gold;
					ttile.charged = true;
				}
			});

			if (fr.length > 0) {
				// if any tiles were changed, check the tile placement
				tile.checkTilePlacement();

				// determine the amount of coins to place
				var coinCount = 2 + Math.pow(2, fr.length);

				// place the coins
				var ttiles = tile.getAllTilesOfType(entities.tube);
				for (var i = coinCount; i > 0; i--) {
					var ti = void 0;
					var ttile = void 0;

					// picks a random tile that doesn't already have an item inside it
					do {
						// break out of the loop if there are no valid tiles left to place a coin
						if (ttiles.length <= 0) {
							ttile = null;
							break;
						}

						// pick a random tile from ttiles and remove it from the list
						ti = Math.floor(Math.random() * ttiles.length);
						ttile = ttiles[ti];
						ttiles.splice(ti, 1);
					} while (ttile.item != null);

					if (ttile) ttile.setItem(item.getItem_random());
				}
			}
		}
	}, {
		key: "CP_ball",
		value: function CP_ball(self) {
			// the set in place action for a ball tile entity
			tile.at(this.gridPos).destroy();
			if (gameState.current instanceof state_gameplayState) gameState.current.spawnBallAt(self.gridPos, self.entityID);
		}
	}, {
		key: "CP_bomb",
		value: function CP_bomb(self) {
			// what happens when a bomb is set in place
			tile.setTileAt(self, self.gridPos);
			var neighbors = self.getDirectNeighbors();

			if (self.tagged) return;

			var enterDestMode = false;
			var tagblocks = [self];
			neighbors.forEach(function (ttile) {
				if (ttile.isEntity(blocks.block_bomb, entities.block)) {
					if (!ttile.tagged) tagblocks.push(ttile);
					enterDestMode = true;
					self.tagged = true;
					ttile.tagged = true;
				}
			});

			if (enterDestMode) {
				gameState.current.tilesTagged = gameState.current.tilesTagged.concat(tagblocks);
				var p = new phase_destroyTaggedTiles(gameState.current);
				gameState.current.switchGameplayPhase(p);
			}
		}
	}, {
		key: "RT_normal",
		value: function RT_normal(self, ballOb) {
			// tag the tile
			if (!this.tagged && this.isEntity(tubes.quad)) if (ballOb.ballType == balls.gold || self.tileVariant == tubeColors.gold || ballOb.ballType == self.tileVariant) ballOb.toPause = true;

			// return if the ball is just a tracer
			if (ballOb.isVirtual) return;

			this.tag(ballOb);
			// add score based on the ball and tube color (if the tile is a tube)
			if (self.entityType == entities.tube) {
				var score = 0;
				if (ballOb.ballType == balls.grey) {
					if (self.tileVariant == tubeColors.grey) score = 100; // if they are both grey, score 10 pts
				} else if (ballOb.ballType == self.tileVariant || self.tileVariant == tubeColors.gold) {
					score = 50; // if they aren't grey, but match colors, score 50 pts
					if (ballOb.ballType == balls.gold) score = 150; // if they are both gold, score 150 pts
				}

				// add the score if it is non zero
				if (score) scoring.addScore(score, tile.toScreenPos(self.gridPos), scoreTypes.roll);
			}
		}
	}, {
		key: "RT_bomb",
		value: function RT_bomb(self, ball) {
			if (!ball.isVirtual) this.tag();
			ball.destroy();
		}
	}, {
		key: "DST_normal",
		value: function DST_normal(self) {
			audioMgr.playSound(sfx.burst);
		}
	}, {
		key: "DST_bomb",
		value: function DST_bomb(self) {
			// the custom destroy method for bombs
			tile.explodeAt(self.gridPos);

			// if the gameplay phase is in the destroy tagged tiles phase, set the fallHeight to compensate for the tiles in the bomb's explosion radius
			if (gameState.current.phase instanceof phase_destroyTaggedTiles) {
				gameState.current.phase.concatFallHeight(this.gridPos.x - 1, this.gridPos.y + 1);
				gameState.current.phase.concatFallHeight(this.gridPos.x, this.gridPos.y + 1);
				gameState.current.phase.concatFallHeight(this.gridPos.x + 1, this.gridPos.y + 1);
			}
		}
	}]);

	return tile;
}();

// a data structure that represents an assortment of tiles that can be moved and rotated as one, basically tubtris' version of a tetromino


var tileform = function () {
	function tileform() {
		_classCallCheck(this, tileform);

		this.gridPos = new vec2();
		this.tiles = [];
		this.swappable = true;
		this.anchoredRotation = false;
		this.tubeColor = tubeColors.grey;

		// animation stuff for smooth transformations
		this.animOffset_translate = gameState.current.timeElapsed;
		this.drawPos = tile.toScreenPos(this.gridPos);
		this.lastDrawPos = this.drawPos.clone();
		this.animOffset_rotate = gameState.current.timeElapsed - 1000;
		this.lastDrawRot = 0;
	}

	_createClass(tileform, [{
		key: "getCenterOff",
		value: function getCenterOff() {
			// gets the offset of the tileform's center
			var min = this.getMinGridPos();
			var max = this.getMaxGridPos();

			if (this.tiles.length <= 0) return new vec2(tile.tilesize / 2);

			var center = new vec2((max.x - min.x + 1) / 2, (max.y - min.y + 1) / 2);
			return center.plus(min).multiply(tile.tilesize);
		}
	}, {
		key: "getMinGridPos",
		value: function getMinGridPos() {
			var minY, minX;

			this.tiles.forEach(function (tileOb, i) {
				if (i == 0) {
					minY = tileOb.gridPos.y;
					minX = tileOb.gridPos.x;
					return;
				}

				if (tileOb.gridPos.y < minY) minY = tileOb.gridPos.y;
				if (tileOb.gridPos.x < minX) minX = tileOb.gridPos.x;
			});
			return new vec2(minX, minY);
		}
	}, {
		key: "getMaxGridPos",
		value: function getMaxGridPos() {
			var maxY, maxX;

			this.tiles.forEach(function (tileOb, i) {
				if (i == 0) {
					maxY = tileOb.gridPos.y;
					maxX = tileOb.gridPos.x;
					return;
				}

				if (tileOb.gridPos.y > maxY) maxY = tileOb.gridPos.y;
				if (tileOb.gridPos.x > maxX) maxX = tileOb.gridPos.x;
			});
			return new vec2(maxX, maxY);
		}
	}, {
		key: "getGridSize",
		value: function getGridSize() {
			return this.getMaxGridPos().minus(this.getMinGridPos());
		}
	}, {
		key: "getVisualBounds",
		value: function getVisualBounds() {
			var minX, minY;
			var maxX, maxY;

			this.tiles.forEach(function (ttile) {
				if (minX == undefined) minX = ttile.gridPos.x;else minX = Math.min(minX, ttile.gridPos.x);
				if (minY == undefined) minY = ttile.gridPos.y;else minY = Math.min(minY, ttile.gridPos.y);

				if (maxX == undefined) maxX = ttile.gridPos.x;else maxX = Math.max(maxX, ttile.gridPos.x);
				if (maxY == undefined) maxY = ttile.gridPos.y;else maxY = Math.max(maxY, ttile.gridPos.y);
			});

			var min = tile.toScreenPos(new vec2(minX, minY), false).plus(tile.toScreenPos(this.gridPos, false));
			var max = tile.toScreenPos(new vec2(maxX, maxY), false).plus(tile.toScreenPos(this.gridPos, false)).plus(new vec2(tile.tilesize));

			return new collisionBox(min, max.minus(min));
		}
	}, {
		key: "hasEntity",
		value: function hasEntity(entityID) {
			var entityType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : entities.tube;

			// checks to see if the tileform contains any of the specified entity
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = this.tiles[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var tileOb = _step10.value;

					if (tileOb.isEntity(entityID, entityType)) return true;
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}

			return false;
		}
	}, {
		key: "hasEntityType",
		value: function hasEntityType(entityType) {
			// checks to see if the tileform contains any entities of the specified type
			var _iteratorNormalCompletion11 = true;
			var _didIteratorError11 = false;
			var _iteratorError11 = undefined;

			try {
				for (var _iterator11 = this.tiles[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
					var tileOb = _step11.value;

					if (tileOb.entityType == entityType) return true;
				}
			} catch (err) {
				_didIteratorError11 = true;
				_iteratorError11 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion11 && _iterator11.return) {
						_iterator11.return();
					}
				} finally {
					if (_didIteratorError11) {
						throw _iteratorError11;
					}
				}
			}

			return false;
		}
	}, {
		key: "getTopLeftTilePos",
		value: function getTopLeftTilePos() {
			var minX = null;
			var minY = null;

			this.tiles.forEach(function (tileOb, i) {
				if (i == 0) {
					minX = tileOb.gridPos.x;
					minY = tileOb.gridPos.y;
					return; // acts as 'continue' keyword in async forEach
				}
				if (tileOb.gridPos.x < minX) minX = tileOb.gridPos.x;
				if (tileOb.gridPos.y < minY) minY = tileOb.gridPos.y;
			});

			return new vec2(minX, minY);
		}
	}, {
		key: "getTileGridPositions",
		value: function getTileGridPositions() {
			// returns a list of grid positions that are occupied by the tileform's tiles
			var r = [];
			var ths = this;

			// adds the tileform's gridPos to each of its tile's gridPos and adds the result to a list
			this.tiles.forEach(function (tileOb) {
				var gpos = tileOb.gridPos.clone().plus(ths.gridPos);
				r.push(gpos);
			});

			return r;
		}
	}, {
		key: "getRelativeTilePositions",
		value: function getRelativeTilePositions() {
			// returns a list of position offsets that the tileform's tiles have
			var r = [];
			var ths = this;

			// adds the tileform's gridPos to a list
			this.tiles.forEach(function (tileOb) {
				r.push(tileOb.gridPos.clone());
			});

			return r;
		}
	}, {
		key: "canMove",
		value: function canMove() {
			var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : side.down;

			// checks to see if the tileform can move in the specified direction
			return this.canTranslate(vec2.fromSide(dir));
		}
	}, {
		key: "canTranslate",
		value: function canTranslate(translation) {
			// checks to see if the tileform overlaps any tiles or goes out of bounds with the specified translation applied
			var lpos = this.gridPos.clone();
			this.gridPos = this.gridPos.plus(translation);

			var r = !this.isOverlappingTile();
			this.gridPos = lpos;
			return r;
		}
	}, {
		key: "canRotate",
		value: function canRotate() {
			var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
			var anchored = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			// checks to see if the tileform can be rotated
			// applies the rotation to each tile in the tileform and stores the results in tposes
			var tposes = this.getRelativeTilePositions();
			tposes.forEach(function (pos, i) {
				// clockwise rotation
				if (dir == 1) tposes[i] = new vec2(-pos.y, pos.x);
				// counter-clockwise rotation
				else tposes[i] = new vec2(pos.y, -pos.x);
			});

			// calculates the difference betweem the old top left grid pos and the new one, if not anchored, an empty vector is used
			var dtlPos = new vec2();
			if (anchored) dtlPos = this.getTopLeftTilePos().minus(vec2.getBounds(tposes).topLeft);

			for (var i = tposes.length - 1; i >= 0; i--) {
				// applies the difference and tileform's grid translation to each tile
				var tpos = tposes[i].plus(this.gridPos).plus(dtlPos);
				// if the position is not able to be occupied, return false
				if (!tile.at(tpos).isEmpty() || tile.isOutOfBounds(tpos)) return false;
			}

			return true;
		}
	}, {
		key: "isOverlappingTile",
		value: function isOverlappingTile() {
			var dposes = this.getTileGridPositions();

			// check to see if each tile in the tileform is overlapping a tile in the tile grid
			for (var i = dposes.length - 1; i >= 0; i--) {
				if (!tile.at(dposes[i]).isEmpty() || tile.isOutOfBounds(dposes[i])) return true;
			}
			return false;
		}
	}, {
		key: "setPos",
		value: function setPos(gridPos) {
			this.gridPos = gridPos;
			this.drawPos = tile.toScreenPos(gridPos, false);
			this.lastDrawPos = this.drawPos.clone();
		}
	}, {
		key: "setColor",
		value: function setColor() {
			var tubecolor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tubeColors.grey;

			// sets the tubecolor of this tileform and all the tiles within it
			this.tubeColor = tubecolor;
			this.tiles.forEach(function (tileOb) {
				tileOb.setTubeColor(tubecolor);
			});
		}
	}, {
		key: "translate",
		value: function translate(translation) {
			var forced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			// moves the tileform by the specified translation
			// 'forced' forces the piece to move if it overlaps a non-empty tile
			if (!forced && !this.canTranslate(translation)) return;

			// applies the translation
			this.gridPos = this.gridPos.plus(translation);

			// animation stuff for smooth translation
			if (!this.drawPos) this.drawPos = tile.toScreenPos(this.gridPos);
			this.lastDrawPos = this.drawPos.clone();
			this.animOffset_translate = gameState.current.timeElapsed;
		}
	}, {
		key: "move",
		value: function move() {
			var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : side.down;
			var forced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			// moves the tileform in the specified direction by one grid unit
			// 'forced' forces the piece to move if it overlaps a non-empty tile
			if (!forced && !this.canMove(dir)) return;

			// applies the movement
			this.translate(vec2.fromSide(dir));

			audioMgr.playSound(sfx.bump);
		}
	}, {
		key: "bumpDown",
		value: function bumpDown() {
			// bumps the tileform downward if possible, otherwise sets it in place
			if (this.canMove()) this.move();else {
				this.setInPlace();
				return false;
			}
			return true;
		}
	}, {
		key: "rotate",
		value: function rotate() {
			var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
			var forced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var anchored = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.anchoredRotation;

			// rotates each tile 
			// 'dir = 1' is clockwise 'dir = -1' is counter-clockwise
			// 'anchored' determines whether or not the tileform should be translated so that the top left tile matches the same 
			//   tile position as it did before being rotated, useful for square pieces not looking weird while rotated
			// 'forced' forces the piece to rotate if it overlaps a non-empty tile
			if (!forced && !this.canRotate(dir, anchored)) {
				audioMgr.playSound(sfx.invalidMove);
				return;
			}

			// if anchored, stores the lop left tile position in tlPos0
			var tlPos0;
			if (anchored) tlPos0 = this.getTopLeftTilePos();

			var ths = this;
			this.tiles.forEach(function (tileOb) {
				var tpos = null;
				// clockwise rotation
				if (dir == 1) tpos = new vec2(-tileOb.gridPos.y, tileOb.gridPos.x);
				// counter-clockwise rotation
				else tpos = new vec2(tileOb.gridPos.y, -tileOb.gridPos.x);

				tileOb.gridPos = tpos;
				tileOb.entityID = tile.getEntityRotatedID(dir, tileOb.entityID, tileOb.entityType);
			});

			// if anchored, offsets the tileform by the grid pos difference between the new top left and the old top left
			if (anchored) {
				var dtlPos = tlPos0.minus(this.getTopLeftTilePos());
				this.translate(dtlPos);
			}

			audioMgr.playSound(sfx.bump);

			//animation stuff for smooth rotation
			this.animOffset_rotate = gameState.current.timeElapsed;
			this.lastDrawRot = Math.PI / 2 * (dir == 1 ? -1 : 1);
		}
	}, {
		key: "rotateCW",
		value: function rotateCW() {
			this.rotate(1);
		}
	}, {
		key: "rotateCCW",
		value: function rotateCCW() {
			this.rotate(-1);
		}
	}, {
		key: "setInPlace",
		value: function setInPlace() {
			// sets each tile in the tileform and applies it to the tile grid
			audioMgr.playSound(sfx.placeTileform);
			var ths = this;
			this.tiles.forEach(function (tileOb) {
				var tpos = tileOb.gridPos.plus(ths.gridPos);
				tileOb.place(tpos);
			});
		}
	}, {
		key: "getTranslateAnimOffset",
		value: function getTranslateAnimOffset() {
			// calculates the draw position's animation offset based on the smooth translation anim interval
			var animInterval = 50; // time in milliseconds it takes to complete the smooth translation animation

			var animElapsed = (gameState.current.timeElapsed - this.animOffset_translate) / animInterval;
			animElapsed = Math.max(0, Math.min(animElapsed, 1));
			var lpos = this.lastDrawPos.clone();
			var npos = tile.toScreenPos(this.gridPos, false);
			var dpos = npos.minus(lpos);

			return dpos.multiply(animElapsed);
		}
	}, {
		key: "getRotateAnimOffset",
		value: function getRotateAnimOffset() {
			// calculates the draw rotation's animation offset based on the smooth rotation anim interval
			var animInterval = 50; // time in milliseconds it takes to complete the smooth translation animation

			var animElapsed = (gameState.current.timeElapsed - this.animOffset_rotate) / animInterval;
			animElapsed = Math.max(0, Math.min(animElapsed, 1));

			var lRot = this.lastDrawRot;
			var nRot = 0;
			var dRot = nRot - lRot;

			return lRot + dRot * animElapsed;
		}
	}, {
		key: "draw",
		value: function draw() {
			// draws the tileform's tiles
			// calculates the draw position and rotation based on the smooth movement animation speed
			if (!this.lastDrawPos) this.lastDrawPos = tile.toScreenPos(this.gridPos);
			this.drawPos = this.lastDrawPos.plus(this.getTranslateAnimOffset());
			var drawRot = this.getRotateAnimOffset();

			// draws each tile in the tileform
			var ths = this;
			this.tiles.forEach(function (tileOb) {
				var off = tileOb.gridPos.multiply(tile.tilesize);
				off = off.rotate(drawRot);
				tileOb.drawAtScreenPos(ths.drawPos.plus(off), drawRot);
			});
		}
	}, {
		key: "drawAtScreenPos",
		value: function drawAtScreenPos(pos) {
			var drawtint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			// calculates the draw position and rotation based on the smooth movement animation speed
			var dpos = pos;

			// draws each tile in the tileform
			this.tiles.forEach(function (tileOb) {
				var off = tileOb.gridPos.multiply(tile.tilesize);
				tileOb.drawAtScreenPos(dpos.plus(off), null, false);
			});
		}
	}], [{
		key: "getPiece_random",
		value: function getPiece_random() {
			var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			//return Math.random() >= 0.5 ? tileform.getPiece_bomb() : tileform.getPiece_brick();
			var r = ["getPiece_square0", "getPiece_square1", "getPiece_straight0", "getPiece_straight1", "getPiece_straight2", "getPiece_L0", "getPiece_L1", "getPiece_Z0", "getPiece_Z1", "getPiece_T0", "getPiece_T1"];
			var i = Math.floor(r.length * Math.random());

			var t = tileform[r[i]]();

			if (color == null) t.setColor(Math.floor(Object.keys(tubeColors).length * Math.random()));else t.setColor(color);

			return t;
		}
	}, {
		key: "getPiece_square0",
		value: function getPiece_square0() {
			var r = new tileform();
			r.anchoredRotation = true;
			r.tiles = [tile.fromData(new vec2(0, 0), tubes.S_horizontal), tile.fromData(new vec2(1, 0), tubes.L_upLeft), tile.fromData(new vec2(1, -1), tubes.L_downLeft), tile.fromData(new vec2(0, -1), tubes.S_horizontal)];
			return r;
		}
	}, {
		key: "getPiece_square1",
		value: function getPiece_square1() {
			var r = new tileform();
			r.anchoredRotation = true;
			r.tiles = [tile.fromData(new vec2(0, 0), tubes.quad), tile.fromData(new vec2(1, 0), tubes.L_upLeft), tile.fromData(new vec2(1, -1), tubes.quad), tile.fromData(new vec2(0, -1), tubes.L_downRight)];
			return r;
		}
	}, {
		key: "getPiece_straight0",
		value: function getPiece_straight0() {
			var r = new tileform();
			r.tiles = [tile.fromData(new vec2(-1, 0), tubes.T_horizontalDown), tile.fromData(new vec2(0, 0), tubes.T_horizontalUp), tile.fromData(new vec2(1, 0), tubes.T_horizontalDown), tile.fromData(new vec2(2, 0), tubes.T_horizontalUp)];
			return r;
		}
	}, {
		key: "getPiece_straight1",
		value: function getPiece_straight1() {
			var r = new tileform();
			r.tiles = [tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp), tile.fromData(new vec2(0, 0), tubes.T_horizontalDown), tile.fromData(new vec2(1, 0), tubes.T_horizontalUp), tile.fromData(new vec2(2, 0), tubes.T_horizontalDown)];
			return r;
		}
	}, {
		key: "getPiece_straight2",
		value: function getPiece_straight2() {
			var r = new tileform();
			r.tiles = [tile.fromData(new vec2(-1, 0), tubes.quad), tile.fromData(new vec2(0, 0), tubes.S_horizontal), tile.fromData(new vec2(1, 0), tubes.S_horizontal), tile.fromData(new vec2(2, 0), tubes.quad)];
			return r;
		}
	}, {
		key: "getPiece_L0",
		value: function getPiece_L0() {
			var r = new tileform();
			r.tiles = [tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp), tile.fromData(new vec2(0, 0), tubes.S_horizontal), tile.fromData(new vec2(1, 0), tubes.L_upLeft), tile.fromData(new vec2(1, -1), tubes.T_horizontalDown)];
			return r;
		}
	}, {
		key: "getPiece_L1",
		value: function getPiece_L1() {
			var r = new tileform();
			r.tiles = [tile.fromData(new vec2(-1, -1), tubes.T_horizontalDown), tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp), tile.fromData(new vec2(0, 0), tubes.S_horizontal), tile.fromData(new vec2(1, 0), tubes.T_horizontalUp)];
			return r;
		}
	}, {
		key: "getPiece_Z0",
		value: function getPiece_Z0() {
			var r = new tileform();
			r.anchoredRotation = true;
			r.tiles = [tile.fromData(new vec2(-1, -1), tubes.L_downRight), tile.fromData(new vec2(0, -1), tubes.T_horizontalDown), tile.fromData(new vec2(0, 0), tubes.L_upRight), tile.fromData(new vec2(1, 0), tubes.S_horizontal)];
			return r;
		}
	}, {
		key: "getPiece_Z1",
		value: function getPiece_Z1() {
			var r = new tileform();
			r.anchoredRotation = true;
			r.tiles = [tile.fromData(new vec2(-1, 0), tubes.S_horizontal), tile.fromData(new vec2(0, 0), tubes.L_upLeft), tile.fromData(new vec2(0, -1), tubes.T_horizontalDown), tile.fromData(new vec2(1, -1), tubes.L_downLeft)];
			return r;
		}
	}, {
		key: "getPiece_T0",
		value: function getPiece_T0() {
			var r = new tileform();
			r.tiles = [tile.fromData(new vec2(0, -1), tubes.T_horizontalDown), tile.fromData(new vec2(-1, 0), tubes.T_horizontalUp), tile.fromData(new vec2(0, 0), tubes.quad), tile.fromData(new vec2(1, 0), tubes.T_horizontalUp)];
			return r;
		}
	}, {
		key: "getPiece_T1",
		value: function getPiece_T1() {
			var r = new tileform();
			r.tiles = [tile.fromData(new vec2(0, -1), tubes.S_vertical), tile.fromData(new vec2(-1, 0), tubes.L_downRight), tile.fromData(new vec2(0, 0), tubes.quad), tile.fromData(new vec2(1, 0), tubes.L_downLeft)];
			return r;
		}
	}, {
		key: "getPiece_bomb",
		value: function getPiece_bomb() {
			var r = new tileform();

			r.tiles = [tile.fromData(new vec2(), blocks.block_bomb, entities.block)];

			return r;
		}
	}, {
		key: "getPiece_detPack",
		value: function getPiece_detPack() {
			// 2 bombs next to each other
			var r = new tileform();

			r.tiles = [tile.fromData(new vec2(), blocks.block_bomb, entities.block), tile.fromData(new vec2(1, 0), blocks.block_bomb, entities.block)];

			return r;
		}
	}, {
		key: "getPiece_brick",
		value: function getPiece_brick() {
			var r = new tileform();

			r.tiles = [tile.fromData(new vec2(), blocks.block_brick, entities.block)];

			return r;
		}
	}, {
		key: "getPiece_ball",
		value: function getPiece_ball() {
			var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			var r = new tileform();

			if (type == null) type = Math.floor(Math.random() * (Object.keys(balls).length - 1));
			r.tiles = [tile.fromData(new vec2(), type, entities.ball)];

			return r;
		}
	}]);

	return tileform;
}();

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

var item = function () {
	function item() {
		_classCallCheck(this, item);

		this.parentTile = null;
		this.icon = null;
		this.iconAnim = null;
	}

	_createClass(item, [{
		key: "setToTile",
		value: function setToTile(tileOb) {
			// sets the item to the specified tile object
			this.parentTile = tileOb;
			this.parentTile.item = this;
		}
	}, {
		key: "setToTilePos",
		value: function setToTilePos(pos) {
			// sets the item to the tile at the specified grid position
			var ttile = tile.at(pos);
			if (!ttile || ttile.isEmpty()) return;
			this.setToTile(ttile);
		}
	}, {
		key: "destroy",
		value: function destroy() {
			// destroys the item so it can no longer be activated by a ball
			this.parentTile.item = null;
		}
	}, {
		key: "activate",
		value: function activate(ballOb) {
			// activates the item, ballOb should be the ball object that touched it to activate it
			this.destroy();
			audioMgr.playSound(sfx.getCoin);
			scoring.addScore(300 + 50 * gameState.current.currentLevel.difficulty, tile.toScreenPos(this.parentTile.gridPos), scoreTypes.bonus);

			gameState.current.addToComboValue(floatingScoreFieldID.coinCombo);
		}
	}, {
		key: "draw",
		value: function draw(pos) {
			// draws the item at the specified position
			var frame = Math.floor(gameState.current.timeElapsed / 60) % 8;

			var spBox = new spriteBox(new vec2(frame * 16, 0), new vec2(16));
			var spcont = new spriteContainer(gfx.coin, spBox);

			spcont.bounds.setCenter(pos);
			spcont.draw();
		}
	}, {
		key: "drawIcon",
		value: function drawIcon(pos) {
			// draws the icon for the item
			var spritesheet = gfx.item_icons;
			var spr = new spriteBox(new vec2(), new vec2(25));
			spr.pos.x = this.icon * spr.size.x;

			// if the icon doesn't exist, use an ascii character as a placeholder
			if (spr.pos.x >= gfx.item_icons.width) {
				spritesheet = fonts.small.spritesheet;
				spr.size = new vec2(12, 8);
				spr.pos.x = this.icon * spr.size.x % spritesheet.width;
				spr.pos.y = Math.floor(this.icon * spr.size.x / spritesheet.width) * (spritesheet.height / 3);
			}

			var spCont = new spriteContainer(spritesheet, spr, new collisionBox(new vec2(), spr.size.clone()));
			spCont.bounds.setCenter(pos);

			if (this.iconAnim) spCont.animated(this.iconAnim).draw();else spCont.draw();
		}
	}, {
		key: "gridPos",
		get: function get() {
			// returns the item's parentTile's grid position
			if (!this.parentTile) return null;
			return this.parentTile.gridPos;
		}
	}], [{
		key: "getItem_random",
		value: function getItem_random() {
			return new item();
		}
	}, {
		key: "getItem_extraPoints",
		value: function getItem_extraPoints() {
			// returns the 'extra points' item
			var r = new item();
			r.icon = 1;
			r.m_activate = item.ACT_extraPoints;
			r.iconAnim = item.anim_pulsate();
			return r;
		}
	}]);

	return item;
}();

///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerate the different states a ball object can be


var ballStates = {
	none: -1,
	choosing: 0,
	moving: 1,
	paused: 2,
	dead: 3

	// a physical ball entity that can move through the tubes during the phase_ballPhysics gameplayPhase
};
var ball = function () {
	function ball(pos) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : balls.grey;

		_classCallCheck(this, ball);

		this.gridPos = pos;
		this.nextPos = null;
		this.drawPos = tile.toScreenPos(this.gridPos);
		this.ballType = type;
		this.pauseDirections = null;
		this.pausePaths = null;
		this.isVirtual = false;

		this.state = ballStates.choosing;
		this.travelDir = side.none;
		this.momentum = 0;
		this.lastPosUpdate = gameState.current.timeElapsed;

		this.toPause = false;
		this.tilesTagged = [];
		this.gridsTrotted = [];
	}

	_createClass(ball, [{
		key: "update",
		value: function update(dt) {
			// main logic step for the ball
			switch (this.state) {
				case ballStates.moving:
					// moving animation
					this.move();
					break;
				case ballStates.choosing:
					// deciding which way to go next
					this.chooseNextTravelDir();
					break;
				case ballStates.paused:
					break;
				case ballStates.dead:
					return;
			}
		}
	}, {
		key: "getTrotCount",
		value: function getTrotCount() {
			var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.gridPos;

			// returns how many times the ball has occupied this tile
			if (!this.gridsTrotted[pos.x]) return 0;
			if (!this.gridsTrotted[pos.x][pos.y]) return 0;

			return this.gridsTrotted[pos.x][pos.y];
		}
	}, {
		key: "getMoveAnimProgress",
		value: function getMoveAnimProgress() {
			// returns a value between 0 and 1 indicating the percent complete that the movement animation is
			var animLength = 100;

			return Math.min(1 - (this.lastPosUpdate + animLength - gameState.current.timeElapsed) / animLength, 1);
		}
	}, {
		key: "finishMoveAnim",
		value: function finishMoveAnim() {
			// in a nutshell, tells the ball to start deciding where it should go next
			if (this.nextPos) this.drawPos = tile.toScreenPos(this.nextPos);
			this.state = ballStates.choosing;
			if (this.nextPos) this.gridPos = this.nextPos.clone();

			audioMgr.playSound(sfx.ballRoll);

			// counts how many times the tile has been occupied by the ball
			if (!this.gridsTrotted[this.gridPos.x]) this.gridsTrotted[this.gridPos.x] = [];
			if (!this.gridsTrotted[this.gridPos.x][this.gridPos.y]) this.gridsTrotted[this.gridPos.x][this.gridPos.y] = 0;
			this.gridsTrotted[this.gridPos.x][this.gridPos.y]++;

			// if the tile has been occupied 5 or more times, destroy the ball (prevents ball from getting stuck in an infinite loop)
			if (this.gridsTrotted[this.gridPos.x][this.gridPos.y] >= 5) this.destroy();
		}
	}, {
		key: "move",
		value: function move() {
			// moves the ball to it's nextPos
			var prog = this.getMoveAnimProgress();
			this.checkTileForTagging();

			// if the movement animation is complete, decide where to go next
			if (prog >= 1) {
				this.checkTileForTagging();
				this.finishMoveAnim();
				return;
			}

			// the ball is drawn between it's gridPos and nextPos based on a percentage(prog) of how complete the 
			// movement animation is
			var off = this.nextPos.minus(this.gridPos).multiply(prog * tile.tilesize);
			this.drawPos = tile.toScreenPos(this.gridPos).plus(off);
		}
	}, {
		key: "checkTileForTagging",
		value: function checkTileForTagging() {
			// ensures the tile at the current draw position is tagged
			var gpos = tile.toTilePos(this.drawPos);
			var ttile = tile.at(gpos);

			if (!ttile.isEmpty()) {
				ttile.collectItem(this);

				// don't tag the tile if it's a different color than the ball (unless either is gold)
				if (ttile.isEntityType(entities.tube)) if (this.ballType != balls.gold && ttile.tileVariant != tubeColors.gold) if (ttile.tileVariant != this.ballType) return;

				if (!this.tilesTagged.includes(ttile)) this.tagTile(ttile);
			}
		}
	}, {
		key: "tagTile",
		value: function tagTile(tileOb) {
			// tags the specified tile
			this.tilesTagged.push(tileOb);
			tileOb.rollThrough(this);
		}
	}, {
		key: "pause",
		value: function pause() {
			var backtracking = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// pauses the ball to wait for player input
			this.toPause = false;
			this.state = ballStates.paused;

			this.findPauseDirections(backtracking);
			if (config.pathIndicators) this.findPausePaths();

			audioMgr.playSound(sfx.ballPause);
		}
	}, {
		key: "findPauseDirections",
		value: function findPauseDirections() {
			var backtracking = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// get the unblocked directions at the current tile
			if (this.isVirtual) return;
			var unblocked = tile.at(this.gridPos).getUnblockedSides();

			// remove the previous travelDirection's opposite from the possible travel directions if backtracking is disabled
			if (!backtracking) for (var i = unblocked.length; i >= 0; i--) {
				if (unblocked[i] == invertedSide(this.travelDir)) {
					unblocked.splice(i, 1);
					break;
				}
			}

			this.pauseDirections = unblocked;
		}
	}, {
		key: "findPausePaths",
		value: function findPausePaths() {
			// calculate the potential travel paths and generate an imgage that displays them
			if (this.isVirtual) return;
			var pathWidth = 4;

			var pathCanvas = document.createElement("canvas");
			pathCanvas.width = tile.gridBounds.width * tile.tilesize;
			pathCanvas.height = tile.gridBounds.height * tile.tilesize;

			var pathCtx = pathCanvas.getContext("2d");

			// send a virtual ball out in each direction and draw its path
			var ths = this;
			this.pauseDirections.forEach(function (dir) {
				var tball = new ball(ths.gridPos.clone(), ths.ballType);
				tball.isVirtual = true;
				tball.travelDir = dir;
				tball.updateNextPos();

				// roll the ball until it is destroyed or paused and track its location with pArray
				var pArray = [{
					pos: tball.gridPos,
					dir: tball.travelDir
				}];
				for (var i = 100; i >= 0; i--) {
					tball.finishMoveAnim();
					tball.chooseNextTravelDir();
					tile.at(tball.gridPos).rollThrough(tball);

					pArray.push({
						pos: tball.gridPos,
						dir: tball.travelDir
					});

					if (tball.toPause) tball.pause();
					if (tball.state == ballStates.paused || tball.state == ballStates.dead) break;
				}

				// print all the tball's positions onto the path canvas
				var lpoint = null;
				pArray.forEach(function (bpoint, i) {
					var tpoint = null;
					var tsize = null;

					// create the second dash of the path in the tile
					var tbox = null;
					if (i > 0 && i < pArray.length - 1) {
						// if not the first or last iteration
						tpoint = tile.toScreenPos(bpoint.pos).plus(vec2.fromSide(bpoint.dir).multiply(tile.tilesize / 4));
						tpoint = tpoint.minus(tile.offset);
						tsize = vec2.fromSide(bpoint.dir).multiply(tile.tilesize / 4);
						tsize.x = Math.max(Math.abs(tsize.x), pathWidth);
						tsize.y = Math.max(Math.abs(tsize.y), pathWidth);
						tbox = new collisionBox(new vec2(), tsize.clone());
						tbox.setCenter(tpoint.clone());
					}

					// create the first dash of the path in the tile
					var lbox = null;
					if (lpoint) {
						// if not the first iteration
						tpoint = tile.toScreenPos(bpoint.pos).plus(vec2.fromSide(invertedSide(lpoint.dir)).multiply(tile.tilesize / 4));
						tpoint = tpoint.minus(tile.offset);
						tsize = vec2.fromSide(invertedSide(lpoint.dir)).multiply(tile.tilesize / 4);
						tsize.x = Math.max(Math.abs(tsize.x), pathWidth);
						tsize.y = Math.max(Math.abs(tsize.y), pathWidth);
						lbox = new collisionBox(new vec2(), tsize.clone());
						lbox.setCenter(tpoint.clone());
					}
					lpoint = bpoint;

					// draw the first dash if possible, as well as the second if possible
					if (lbox) lbox.drawOutline(pathCtx, "#000", 2);
					if (tbox) tbox.drawOutline(pathCtx, "#000", 2);
					if (lbox) lbox.drawFill(pathCtx, "#FFF");
					if (tbox) tbox.drawFill(pathCtx, "#FFF");
				});

				// print the end point onto the path canvas
				var tsprt = new spriteBox(new vec2(), new vec2(gfx.pathIndicators.height, gfx.pathIndicators.width / 2));
				if (tball.state == ballStates.dead) tsprt.pos.x = gfx.pathIndicators.width / 2;
				var tbox = new collisionBox(new vec2(), tsprt.size);
				tbox.setCenter(tile.toScreenPos(tball.gridPos).minus(tile.offset));
				var endSprt = new spriteContainer(gfx.pathIndicators, tsprt, tbox);
				endSprt.draw(pathCtx);
			});

			this.pausePaths = pathCanvas;
		}
	}, {
		key: "direct",
		value: function direct(dir) {
			// when the ball is paused, this method allows the user to decide which way the ball should go
			if (this.state != ballStates.paused) return;

			var _iteratorNormalCompletion12 = true;
			var _didIteratorError12 = false;
			var _iteratorError12 = undefined;

			try {
				for (var _iterator12 = this.pauseDirections[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
					var pdir = _step12.value;

					if (pdir == dir) {
						this.travelDir = dir;
						this.updateNextPos();
						this.state = ballStates.moving;
						break;
					}
				}
			} catch (err) {
				_didIteratorError12 = true;
				_iteratorError12 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion12 && _iterator12.return) {
						_iterator12.return();
					}
				} finally {
					if (_didIteratorError12) {
						throw _iteratorError12;
					}
				}
			}

			audioMgr.playSound(sfx.ballRoll);
		}
	}, {
		key: "chooseNextTravelDir",
		value: function chooseNextTravelDir() {
			// decides which way the ball will go next
			var ttile = tile.at(this.gridPos);
			var unblocked = ttile.getUnblockedSides();
			var tdir;

			// if it's travel direction isn't none (which only ever happens on the first ball movement tick), 
			// the ball will be destroyed if not inside a tube
			// otherwise set the travelDir to down
			if (this.travelDir != side.none) {
				if (tile.at(this.gridPos).isEmpty()) {
					this.destroy();
					return;
				}
			} else this.travelDir = side.down;

			// if the ball has been set to pause by the tile it previously tagged, pause it
			if (this.toPause) {
				this.pause(true);
				return;
			}

			// remove the opposite of the previous travelDirection from the array of possible travel directions
			for (var i = unblocked.length; i >= 0; i--) {
				if (unblocked[i] == invertedSide(this.travelDir)) {
					unblocked.splice(i, 1);
					break;
				}
			}

			// destroy the ball if nowhere left to go
			if (unblocked.length <= 0) {
				this.destroy();
				return;
			}

			// if downward is unblocked, gravity will pull the ball down,
			// otherwise if it's previous travelDir is unblocked it goes that way,
			// otherwise if there is more than one possible direction to go, it pauses,
			// otherwise it goes the only possible direction left to go
			if (unblocked.includes(side.down)) tdir = side.down;else if (unblocked.includes(this.travelDir)) tdir = this.travelDir;else if (unblocked.length > 1) {
				this.pause();
				return;
			} else tdir = unblocked[0];

			this.travelDir = tdir;
			this.updateNextPos();
			this.state = ballStates.moving;
		}
	}, {
		key: "updateNextPos",
		value: function updateNextPos() {
			// updates the ball's nextPos once the travel direction has been determined
			this.nextPos = this.gridPos.plus(vec2.fromSide(this.travelDir));
			this.lastPosUpdate = gameState.current.timeElapsed;
		}
	}, {
		key: "destroy",
		value: function destroy() {
			// destroys the ball object
			if (this.state == ballStates.dead) return;
			this.state = ballStates.dead;

			if (this.isVirtual) return;
			effect.createPoof(this.drawPos);
			audioMgr.playSound(sfx.burst);
		}
	}, {
		key: "draw",
		value: function draw() {
			// draws the ball object if it's still alive
			if (this.state == ballStates.dead) return;

			var sprt = new spriteBox(new vec2(tile.tilesize * this.ballType, 0), new vec2(tile.tilesize));
			drawCenteredImage(renderContext, gfx.tiles_balls, this.drawPos, sprt);

			if (this.state == ballStates.paused) {
				this.drawDirectionIndicators();
				if (config.pathIndicators) this.drawPathIndicators();
			}
		}
	}, {
		key: "drawDirectionIndicators",
		value: function drawDirectionIndicators() {
			// draws the arrows that show which way the ball can be directed when it is paused
			if (!this.pauseDirections) return;

			var ths = this;
			this.pauseDirections.forEach(function (dir) {
				var tpos = tile.toScreenPos(ths.gridPos).plus(vec2.fromSide(dir).multiply(tile.tilesize / 2));
				drawArrow(tpos, dir);
			});
		}
	}, {
		key: "drawPathIndicators",
		value: function drawPathIndicators() {
			// draws the potential paths the ball can travel along
			if (!this.pausePaths) this.findPausePaths();
			drawImage(renderContext, this.pausePaths, tile.offset);
		}
	}]);

	return ball;
}();

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

var level = function () {
	function level(difficulty) {
		_classCallCheck(this, level);

		this.difficulty = difficulty;
		this.calculateTheme();
		this.calculateBlockFrequency();
		this.calculateIncrementors();

		this.goldLikenessInterval = 0;
		this.tfTilBall = this.ballFrequency;
		this.isOver = false;
	}

	_createClass(level, [{
		key: "calculateIncrementors",
		value: function calculateIncrementors() {
			// calculates the amount of tiles that need to be placed in order to progress to the next level
			this.tfTilProgression = 15 + this.difficulty * 5;

			// calculate how quickly the tileform will drop
			this.tfDropInterval = Math.max(200, 1000 - 40 * this.difficulty);
			if (this.difficulty > 20) this.tfDropInterval = Math.max(150, this.tfDropInterval - (this.difficulty - 20) * 10);
		}
	}, {
		key: "calculateTheme",
		value: function calculateTheme() {
			// calculates the different tube colors that the level will use
			var dif = this.difficulty;

			// on the first level there will only be 1 color
			var thm = [tubeColors.blue];

			// on the levels 2 - 4 there will be 2 colors, but blue will be the most common
			if (dif > 1) thm = [tubeColors.blue, tubeColors.blue, tubeColors.green];

			// on levels 5 and above there will be 3 or more colors, but blue will be the most common
			if (dif >= 5) thm = [tubeColors.blue, tubeColors.blue, tubeColors.red, tubeColors.green];

			// on level 15 there will be all 4 colors in the theme
			if (dif >= 15) thm.splice(0, 0, tubeColors.grey);

			// on levels after 5 there will be only 3 colors but one of them will be replaced with grey, which yeilds the least points
			else if (dif > 5) {
					thm.splice(0, 1);
					thm[Math.floor(Math.random() * thm.length)] = tubeColors.grey;
				}

			this.goldFrequency = 0.2 / (1 + this.difficulty / 5);

			this.theme = thm;
			return this.theme;
		}
	}, {
		key: "calculateBlockFrequency",
		value: function calculateBlockFrequency() {
			// calculates the level's frequency that the different types of blocks appear
			var dif = this.difficulty;
			this.bombFrequency = 0.15;
			this.brickFrequency = 0;
			this.ballFrequency = 5;
			this.itemFrequency = 0.15;

			// higher brick frequency as level difficulty increases
			this.brickFrequency = Math.min((dif - 1) / 100, 0.175);
			if (this.brickFrequency >= 20) this.brickFrequency = 0.2;

			// lower bomb frequency as level difficulty progresses
			if (dif > 5) this.bombFrequency = 0.135;else if (dif > 10) this.bombFrequency = 0.125;else if (dif > 15) this.bombFrequency = 0.10;

			// lower ball frequency as level difficulty increases (ball frequency variable represents 
			// the amount of tileforms between each ball)
			this.ballFrequency += Math.round((dif - 1) / 2);
			this.ballFrequency = Math.min(this.ballFrequency, 16);
		}
	}, {
		key: "getDifficultyColor",
		value: function getDifficultyColor() {
			if (this.difficulty >= 20) return textColor.red;
			if (this.difficulty >= 10) return textColor.yellow;
			if (this.difficulty >= 5) return textColor.cyan;
			return textColor.light;
		}
	}, {
		key: "getRandomColor",
		value: function getRandomColor() {
			// returns a random color in the theme
			var c = this.theme[Math.floor(this.theme.length * Math.random())];

			// make tubeColors.gold appear half as often as the others
			if (c == this.theme.length - 1) if (Math.random() >= 0.5) c = this.theme[Math.floor((this.theme.length - 1) * Math.random())];

			// return gold if the player gets lucky
			var gc = this.goldFrequency * (1 + this.goldLikenessInterval);
			if (gc >= Math.random()) {
				this.goldLikenessInterval = 0;
				return tubeColors.gold;
			} else this.goldLikenessInterval += this.goldFrequency;

			return c;
		}
	}, {
		key: "getRandomPieces",
		value: function getRandomPieces() {
			var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			// returns a random set of tileforms that adhere to the level's theme
			// returns nothing if level is over
			if (this.isOver) return [];
			var r = [];

			// iterates until the count reaches zero
			while (count > 0) {
				// if the level is over or on the last piece, break the loop
				if (this.tfTilProgression <= 1) break;

				// pushes a ball object to the set if the ball countdown is completed
				if (this.tfTilBall <= 0) {
					this.tfTilBall = Math.max(this.ballFrequency, 1);
					r.push(tileform.getPiece_ball(this.getRandomColor()));
					continue;
				}

				// define deciding variables
				var m = void 0;
				var blf = this.bombFrequency + this.brickFrequency;
				var fd = Math.random();

				// allows 'm' to be set to a randomly selected piece according to the specified block frequency values 
				// for this level
				if (fd <= blf) {
					if (fd <= this.bombFrequency) m = tileform.getPiece_bomb();else m = tileform.getPiece_brick();
				} else m = tileform.getPiece_random(this.getRandomColor());

				if (m.hasEntityType(entities.tube)) {
					m.setColor(this.getRandomColor());
					if (Math.random() <= this.itemFrequency) m.tiles[Math.floor(Math.random() * m.tiles.length)].setItem(item.getItem_random());
				}

				r.push(m);

				// decrement the counter variables
				this.tfTilProgression--;
				this.tfTilBall--;
				count--;
			}
			if (count > 0 && this.tfTilProgression == 1) {
				r.push(tileform.getPiece_ball(balls.gold));
				this.tfTilProgression--;
				this.tfTilBall--;
				count--;
			}
			if (this.tfTilProgression <= 0) this.isOver = true;
			return r;
		}
	}, {
		key: "getNextLevel",
		value: function getNextLevel() {
			return new level(this.difficulty + 1);
		}
	}, {
		key: "completeLevel",
		value: function completeLevel(parentState) {
			audioMgr.playSound(sfx.levelUp);
			var next = this.getNextLevel();
			parentState.currentLevel = next;
		}
	}]);

	return level;
}();

///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

var tooltip = function () {
	function tooltip() {
		_classCallCheck(this, tooltip);

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
		this.getFocusArea = function () {
			return null;
		};
		this.focusArea = null;

		// the tooltip will only activate if the current gameplayPhase is an instance of this.activePhase
		this.activePhase = gameplayPhase;

		// the tooltip will only activate when the condition returns true
		this.condition = function () {
			return true;
		};

		// these tooltips will be unlocked when this tooltip is activated
		this.childTips = [];
	}

	_createClass(tooltip, [{
		key: "setTitle",
		value: function setTitle(txt) {
			var anim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new textAnim_scaleTransform(750, 1, 1.1, 0).setAnimType(textAnimType.trigonometricCycle);
			var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new textStyle(fonts.large, textColor.light, 1).setAlignment(0.5, 0);

			// sets the animated title of the tooltip to be drawn at the top of the screen
			var tblock = new textBlock(txt, style, screenBounds.inflated(0.9), [], style.scale * style.font.charSize.y);
			this.titlePreRender = preRenderedText.fromBlock(tblock);
			this.titleAnim = anim;

			// pushes the text bounds to be below the title
			var offY = this.titlePreRender.getBounds().height + 25;
			this.textBounds.pos.y += offY;
			this.textBounds.size.y -= offY;
		}
	}, {
		key: "generateBackground",
		value: function generateBackground() {
			// generates the translucent background with the transparent hole in the focusArea
			this.background = document.createElement("canvas");
			this.background.width = screenBounds.width;
			this.background.height = screenBounds.height;
			var bgctx = this.background.getContext("2d");

			bgctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			bgctx.fillRect(0, 0, this.background.width, this.background.height);

			// make the transparent hole for the focus area if applicable
			this.focusArea = this.getFocusArea();
			if (!this.focusArea) return;
			bgctx.globalCompositeOperation = "destination-out";
			bgctx.fillStyle = "rgba(255, 255, 255, 1)";
			bgctx.fillRect(this.focusArea.left, this.focusArea.top, this.focusArea.width, this.focusArea.height);
			bgctx.globalCompositeOperation = "source-over";
		}
	}, {
		key: "generatePreRender",
		value: function generatePreRender() {
			// generates the text preRender and stores it in this.preRender
			var txt = this.text_pc;
			if (this.text_mobile) txt = responsiveText(this.text_pc, this.text_mobile);

			this.textBlock = new textBlock(txt, textStyle.getDefault().setColor(textColor.green).setAlignment(0.5, 0), this.textBounds, [textStyle.getDefault().setColor(textColor.yellow), textStyle.getDefault().setColor(textColor.light), textStyle.getDefault().setColor(textColor.red), textStyle.getDefault().setColor(textColor.dark)], 32);
			this.preRender = preRenderedText.fromBlock(this.textBlock);

			// return if there is no focus area
			if (!this.focusArea) return;

			// otherwise, make sure the title text doesn't block the focus area
			var titleBounds = this.titlePreRender.getBounds();
			titleBounds = new collisionBox(new vec2(this.textBounds.left, titleBounds.top), new vec2(this.textBounds.width, titleBounds.height));
			// if title overlaps the focus area, move it below so that the focus area is unobstructed
			var tcent = this.titlePreRender.findCenter();
			if (this.focusArea.overlapsBox(titleBounds)) {
				var offY = this.focusArea.bottom - titleBounds.top + 25;
				this.titlePreRender.setCenter(this.titlePreRender.findCenter().plus(new vec2(0, offY)));
				this.preRender.setCenter(this.preRender.findCenter().plus(new vec2(0, offY)));
			}

			// if the title goes too low, move it back to the original position
			testBounds = this.titlePreRender.getBounds();
			testBounds = new collisionBox(new vec2(this.textBounds.left, testBounds.top), new vec2(this.textBounds.width, testBounds.height));
			if (testBounds.bottom >= screenBounds.bottom - 100) {
				var dif = this.titlePreRender.findCenter().y - tcent.y;
				var _pcent = this.preRender.findCenter();
				this.titlePreRender.setCenter(tcent);
				this.preRender.setCenter(new vec2(_pcent.x, _pcent.y - dif));
			}

			var testBounds = this.preRender.getBounds();
			testBounds = new collisionBox(new vec2(this.textBounds.left, testBounds.top), new vec2(this.textBounds.width, testBounds.height));

			// if the text overlaps the focus area, move it below so that the focus area is unobstructed
			var pcent = this.preRender.findCenter();
			if (this.focusArea.overlapsBox(testBounds)) {
				var offY = this.focusArea.bottom - testBounds.top + 25;
				this.preRender.setCenter(this.preRender.findCenter().plus(new vec2(0, offY)));
			}

			// if the text goes too low, move it back to the original position
			testBounds = this.preRender.getBounds();
			testBounds = new collisionBox(new vec2(this.textBounds.left, testBounds.top), new vec2(this.textBounds.width, testBounds.height));
			if (testBounds.bottom >= screenBounds.bottom - 60) this.preRender.setCenter(pcent);
		}
	}, {
		key: "getPUID",
		value: function getPUID() {
			// returns the (probably) unique identification number
			var r = 0;
			for (var i = this.text_pc.length - 1; i >= 0; i--) {
				r += this.text_pc.charCodeAt(i);
			}return r;
		}
	}, {
		key: "conditionIsMet",
		value: function conditionIsMet() {
			// a safe way to check if the tooltip's condition has been met, if an error is thrown, it is caught and returns false
			try {
				return this.condition();
			} catch (e) {
				log("tooltip condition threw exception: " + e, logType.error);
			}
			return false;
		}
	}, {
		key: "activate",
		value: function activate(parentState) {
			// activates the tooltip		
			this.generateBackground();
			if (!this.preRender) this.generatePreRender();

			// remove this tooltip from the current tooltip progression query
			var ti = tooltipProgression.current.tooltips.indexOf(this);
			if (ti >= 0) {
				tooltipProgression.current.tooltips.splice(ti, 1);
				tooltipProgression.current.revealedTooltips.push(this);
			}

			// add the child tips to the tooltipProgression's tooltip query
			var _iteratorNormalCompletion13 = true;
			var _didIteratorError13 = false;
			var _iteratorError13 = undefined;

			try {
				for (var _iterator13 = this.childTips[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
					var ttip = _step13.value;

					tooltipProgression.current.tooltips.push(ttip);
				} // switch the gameState's gameplayPhase to a tooltip phase
			} catch (err) {
				_didIteratorError13 = true;
				_iteratorError13 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion13 && _iterator13.return) {
						_iterator13.return();
					}
				} finally {
					if (_didIteratorError13) {
						throw _iteratorError13;
					}
				}
			}

			parentState.switchGameplayPhase(phase_tooltip.fromTooltip(this));

			// skips the tooltip if it's already been seen
			if (seenTips.includes(this.getPUID())) parentState.phase.nextPhase();else seenTips.push(this.getPUID());
		}
	}, {
		key: "drawBackground",
		value: function drawBackground() {
			drawImage(renderContext, this.background, new vec2());

			// if there is a focus area draw a flashing box around it
			if (this.focusArea) {
				var col = gameState.current.timeElapsed % 500 >= 250 ? "rgba(255,255,255, 1)" : "rgba(255,255,255, 0.5)";
				this.focusArea.drawOutline(renderContext, col, 2);
			}
		}
	}, {
		key: "drawText",
		value: function drawText() {
			this.preRender.draw();

			// draw the title
			var tpr = this.titlePreRender;
			if (this.titleAnim) tpr = tpr.animated(this.titleAnim);
			tpr.draw();

			this.drawPrompt();
		}
	}, {
		key: "drawPrompt",
		value: function drawPrompt() {
			// draw the "press enter to continue" prompt
			if (timeElapsed % 1000 >= 500) this.promptPreRender.draw();
		}
	}, {
		key: "draw",
		value: function draw() {
			this.drawBackground();

			// draws the text over the background
			this.drawText();
		}
	}], [{
		key: "tip_removeTooltips",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Welcome to Tubetris!", new textAnim_yOffset(750, 10, 0.15), new textStyle(fonts.large, textColor.light, 2).setAlignment(0.5, 0));
			r.text_pc = "These (tooltips) will help guide you through how to play the game 2| " + "if you already know how to play you can go into the (options menu) by pressing [escape] and turn them off";
			r.text_mobile = "These (tooltips) will help guide you through how to play the game 2| " + "if you already know how to play you can go into the (options menu) by [swiping down from the top of the screen] and turn them off";

			r.childTips = [tooltip.tip_HUD, tooltip.tip_tileformMovement, tooltip.tip_completeRow];

			return r;
		}
	}, {
		key: "tip_HUD",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Heads Up Display");
			r.text_pc = "this is your (HUD) 1.5| or (Heads Up Display) 2| " + "it displays a large amount of (useful information) that you will probably need to reference on a regular basis";

			r.getFocusArea = function () {
				var cpos = new vec2(tile.toScreenPos(new vec2(10, 0), false).x, 0);
				return new collisionBox(cpos, new vec2(screenBounds.right - cpos.x, screenBounds.height));
			};

			r.childTips = [tooltip.tip_HUD_nextPiece, tooltip.tip_HUD_tilBall, tooltip.tip_HUD_tilBomb, tooltip.tip_HUD_level, tooltip.tip_HUD_score];

			return r;
		}
	}, {
		key: "tip_HUD_nextPiece",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Upcoming Tileform");
			r.text_pc = "This will be the (next tileform) that appears after the (current tileform) is placed 1.5| " + "Use [" + controlState.getControlKeyName(controlAction.swap) + "] to swap your (current tileform) with the (next tileform)";
			r.text_mobile = "This will be the (next tileform) that appears after the (current tileform) is placed 1.5| " + "[Tap on it] to swap it with your (current tileform)";

			r.getFocusArea = function () {
				return new collisionBox(tile.nextTileformSlot.minus(new vec2(2, 1).multiply(tile.tilesize)), new vec2(4, 2).multiply(tile.tilesize));
			};

			return r;
		}
	}, {
		key: "tip_HUD_tilBall",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Ball Countdown");
			r.text_pc = "This number shows you how many tileforms come between the (current tileform) and your next (ball) 1.5| " + "(Balls) are special tileforms that will be explained when they come up";

			r.getFocusArea = function () {
				return new collisionBox(tile.toScreenPos(new vec2(12, 7), false).minus(new vec2(1, 0.5).multiply(tile.tilesize)), new vec2(3, 1.5).multiply(tile.tilesize));
			};

			return r;
		}
	}, {
		key: "tip_HUD_tilBomb",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Bomb Countdown");
			r.text_pc = "This number shows you how many tileforms come between the (current tileform) and your next (bomb) 1.5| " + "(Bombs) are special tileforms that will be explained when they come up";

			r.getFocusArea = function () {
				return new collisionBox(tile.toScreenPos(new vec2(12, 9), false).minus(new vec2(1, 0.5).multiply(tile.tilesize)), new vec2(3, 1.5).multiply(tile.tilesize));
			};

			return r;
		}
	}, {
		key: "tip_HUD_level",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Current Level");
			r.text_pc = "This displays the (game level) that you are currenly on 1.5| " + "The level is complete when the (number below) counts down to zero and that last tileform is placed 1.5| " + "After each level you will recieve a (point reward) and progress to the (next level) 1.5| " + "As the levels progress (new tiles) and (tubes) will be introduced and the (difficulty will increase)";

			r.getFocusArea = function () {
				return new collisionBox(tile.toScreenPos(new vec2(12, 16), false).minus(new vec2(2, 0).multiply(tile.tilesize)), new vec2(5, 1.5).multiply(tile.tilesize));
			};

			return r;
		}
	}, {
		key: "tip_HUD_score",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Scoring");
			r.text_pc = "This shows how many (points) you currently have and compares it to the (top score) on the (local scoreboard) 2| " + "If you rank within the (top 5) highest local scores you will be asked to enter your name into the (scoreboard) when your game comes to an end";

			r.getFocusArea = function () {
				return new collisionBox(tile.toScreenPos(new vec2(12, 18), false).minus(new vec2(2, 0.5).multiply(tile.tilesize)), new vec2(5, 2.5).multiply(tile.tilesize));
			};

			return r;
		}
	}, {
		key: "tip_tileformMovement",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Tileform Movement");
			r.text_pc = "This is a (tileform) 1.5| use [" + controlState.getControlKeyName(controlAction.left) + "] and [" + controlState.getControlKeyName(controlAction.right) + "] to move it around";
			r.text_mobile = "This is a (tileform) 1.5| [swipe left or right] to move it around";

			// gets a rectangle surrounding the current tileform
			r.getFocusArea = function () {
				var r = gameState.current.phase.currentTileform.getVisualBounds();
				r.pos = r.pos.minus(tile.offset);

				return r;
			};

			r.activePhase = phase_placeTileform;
			r.condition = function () {
				return gameState.current.phase.currentTileform.gridPos.y >= 1;
			};

			r.childTips = [tooltip.tip_tileformRotation, tooltip.tip_tileformDropping, tooltip.tip_bombs, tooltip.tip_balls];

			return r;
		}
	}, {
		key: "tip_tileformRotation",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Tileform Rotation");
			r.text_pc = "You can also rotate the tileform clockwise with [" + controlState.getControlKeyName(controlAction.rotateCW) + "]";
			r.text_mobile = "You can also rotate the tileform by [swiping upward] and making a [circular gesture] with your finger";

			// gets a rectangle surrounding the current tileform
			r.getFocusArea = function () {
				var r = gameState.current.phase.currentTileform.getVisualBounds();
				r.pos = r.pos.minus(tile.offset);

				return r;
			};

			r.activePhase = phase_placeTileform;
			r.condition = function () {
				return gameState.current.phase.currentTileform.tiles.length > 1;
			};

			r.childTips = [];

			return r;
		}
	}, {
		key: "tip_tileformDropping",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Tileform Dropping");
			r.text_pc = "If you are impatient and want the tileform to drop faster you can use [" + controlState.getControlKeyName(controlAction.nudgeDown) + "] to bump it downward or [" + controlState.getControlKeyName(controlAction.quickDrop) + "] to quick-drop it";
			r.text_mobile = "If you are impatient and want the tileform to drop faster try [swiping downward]";

			// gets a rectangle surrounding the current tileform
			r.getFocusArea = function () {
				var r = gameState.current.phase.currentTileform.getVisualBounds();
				r.pos = r.pos.minus(tile.offset);

				return r;
			};

			r.activePhase = phase_placeTileform;
			r.condition = function () {
				return gameState.current.phase.currentTileform.gridPos.y > 5;
			};

			r.childTips = [];

			return r;
		}
	}, {
		key: "tip_bombs",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Bombs");
			r.text_pc = "This (special tileform) is a (bomb) 1.5| " + "(bombs) will detonate when placed next to each other or when a ball rolls into them 1.5| " + "when the (bomb) detonates | all of the tiles surrounding it will be destroyed 1.5| " + "if enough bombs are detonated with a (single ball) there will be a bonus";

			// gets a rectangle surrounding the current tileform
			r.getFocusArea = function () {
				var r = gameState.current.phase.currentTileform.getVisualBounds();
				r.pos = r.pos.minus(tile.offset);

				return r;
			};

			r.activePhase = phase_placeTileform;
			r.condition = function () {
				return gameState.current.phase.currentTileform.hasEntity(blocks.block_bomb, entities.block);
			};

			r.childTips = [tooltip.tip_bombBonuses];

			return r;
		}
	}, {
		key: "tip_bombBonuses",
		get: function get() {
			var r = new tooltip();

			r.setTitle("Bomb bonus");
			r.text_pc = "if you detonate (4 or more bombs) in a single turn then all of the (bricks) on the screen will (turn into bombs)";

			return r;
		}
	}, {
		key: "tip_balls",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Balls!");
			r.text_pc = "This (special tileform) is a (ball) 1.5| " + "(balls) are used to clear pipes by rolling through them 1.5| " + "place the (ball) on or near an (open tube) and see what happens";

			// gets a rectangle surrounding the current tileform
			r.getFocusArea = function () {
				var r = gameState.current.phase.currentTileform.getVisualBounds();
				r.pos = r.pos.minus(tile.offset);

				return r;
			};

			r.activePhase = phase_placeTileform;
			r.condition = function () {
				return gameState.current.phase.currentTileform.hasEntityType(entities.ball);
			};

			r.childTips = [tooltip.tip_balls2];

			return r;
		}
	}, {
		key: "tip_balls2",
		get: function get() {
			var r = new tooltip();

			r.setTitle("Balls: Continued");
			r.text_pc = "the ball (must match colors) with the tube to destroy it unless either the ball or tube is (gold colored) 1.5| " + "(rotate) the ball with [" + controlState.getControlKeyName(controlAction.rotateCW) + "] to cycle through different ball colors";
			r.text_mobile = "the ball (must match colors) with the tube to destroy it unless either the ball or tube is (gold colored) 1.5| " + "(rotate) the ball to cycle through different ball colors";

			r.childTips = [tooltip.tip_ballPause, tooltip.tip_coins, tooltip.tip_fallingTiles];

			return r;
		}
	}, {
		key: "tip_coins",
		get: function get() {
			var r = new tooltip();

			r.setTitle("Coins");
			r.text_pc = "this is a (coin)! 2| " + "coins earn you (extra points) 1.5| " + "you are also rewarded with certain (bonuses) when you collect enough coins with a (single ball)";

			r.getFocusArea = function () {
				if (gameState.current.phase.balls.length <= 0) return null;

				var r = new collisionBox(tile.toScreenPos(gameState.current.phase.balls[0].nextPos, false).plus(new vec2(tile.tilesize / 4)), new vec2(tile.tilesize / 2));

				return r;
			};

			r.activePhase = phase_ballPhysics;
			r.condition = function () {
				if (tile.at(gameState.current.phase.balls[0].nextPos).item != null) return true;
				return false;
			};

			r.childTips = [tooltip.tip_coinBonuses];

			return r;
		}
	}, {
		key: "tip_coinBonuses",
		get: function get() {
			var r = new tooltip();

			r.setTitle("Coin Bonuses");
			r.text_pc = "collect enough coins to get the (bonuses) listed below: 1.5| " + "(5x coins) - extra ball 1| " + "(10x coins) - extra gold ball 1| ";+"(15x coins) - det-pack";

			return r;
		}
	}, {
		key: "tip_ballPause",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Ball Intersection");
			r.text_pc = "When the ball comes to an (intersection) it will stop and let you decide which way to go 1.5| the (arrow indicators) let you know all the directions that the ball can be directed in 1.5| " + "use [" + controlState.getControlKeyName(controlAction.left) + "] or [" + controlState.getControlKeyName(controlAction.right) + "] or [" + controlState.getControlKeyName(controlAction.up) + "] or [" + controlState.getControlKeyName(controlAction.down) + "] to choose a direction";
			r.text_mobile = "When the ball comes to an (intersection) it will stop and let you decide which way to go 1.5| the (arrow indicators) let you know all the directions that the ball can be directed in 1.5| " + "direct the ball by [swiping in the direction] that you choose for it to go";

			// gets a rectangle surrounding the current ball
			r.getFocusArea = function () {
				var r = tile.toScreenPos(gameState.current.phase.balls[0].gridPos, false);
				r = new collisionBox(r.clone(), new vec2(tile.tilesize));

				return r;
			};

			r.activePhase = phase_ballPhysics;
			r.condition = function () {
				return gameState.current.phase.balls[0].state == ballStates.paused;
			};

			r.childTips = [];

			return r;
		}
	}, {
		key: "tip_completeRow",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Row Completion");
			r.text_pc = "If you fill all the tiles (in a row) then those tiles will become (charged) and coins will spawn 1.5| " + "the tubes will also turn into (gold tubes) when the row is completed 2| " + "(Row completion is ESSENTIAL for success!)";

			// highlights the bottom row
			r.getFocusArea = function () {
				var r = new collisionBox(tile.toScreenPos(new vec2(0, tile.gridBounds.height - 1), false), new vec2(tile.gridBounds.width, 1).multiply(tile.tilesize));

				return r;
			};

			// sets a conditional that returns true when any tile in the bottom row is filled
			r.activePhase = phase_placeTileform;
			r.condition = function () {
				for (var x = 0; x < tile.gridBounds.width; x++) {
					var tgpos = new vec2(x, tile.gridBounds.height - 1);
					if (!tile.at(tgpos).isEmpty()) return true;
				}
				return false;
			};

			r.childTips = [tooltip.tip_chargedTiles];

			return r;
		}
	}, {
		key: "tip_chargedTiles",
		get: function get() {
			var r = new tooltip();
			r.setTitle("Charged Tiles");
			r.text_pc = "tiles that are (charged) will have a (yellow tinted background) 1.5| " + "when destroyed they will cause a (chain reaction) that causes all the " + "other tiles and tubes that are connected to it to also be destroyed 1.5| " + "this can be very beneficial if you have a lot of interconnected pipe systems laid " + "out and they are inside of charged rows";

			return r;
		}
	}, {
		key: "tip_fallingTiles",
		get: function get() {
			var r = new tooltip();

			r.setTitle("Falling Tiles");
			r.text_pc = "The (destruction) of tiles will also cause certain tiles to (fall down) to the ground 1.5| " + "tiles will fall if either one of (2 conditions) are met 2| " + "they will fall if any tile (beneath them) in the (same column) has been destroyed 1.5| " + "or they will fall if they have (no direct neighbors)";

			r.activePhase = phase_fellTiles;
			r.condition = function () {
				if (gameState.current.phase.fallingTiles.length > 0) return true;
			};

			return r;
		}
	}]);

	return tooltip;
}();

// a data structure that progresses from the first throughout the rest of the tooltips


var tooltipProgression = function () {
	function tooltipProgression() {
		_classCallCheck(this, tooltipProgression);

		this.tooltips = [];
		this.revealedTooltips = [];
	}

	_createClass(tooltipProgression, [{
		key: "checkTooltips",
		value: function checkTooltips(parentState) {
			// return if tooltips are disabled in the options menu
			if (!config.tooltipsEnabled) return;

			// return if there is already a tooltip being displayed
			if (gameState.current.phase instanceof phase_tooltip) return;

			// check the conditions of the active tooltips, and activate them if necessary
			var _iteratorNormalCompletion14 = true;
			var _didIteratorError14 = false;
			var _iteratorError14 = undefined;

			try {
				for (var _iterator14 = this.tooltips[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
					var ttip = _step14.value;

					if (gameState.current.phase instanceof ttip.activePhase) {
						if (ttip.conditionIsMet()) {
							ttip.activate(parentState);
							return;
						}
					}
				}
			} catch (err) {
				_didIteratorError14 = true;
				_iteratorError14 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion14 && _iterator14.return) {
						_iterator14.return();
					}
				} finally {
					if (_didIteratorError14) {
						throw _iteratorError14;
					}
				}
			}
		}
	}], [{
		key: "getDefault",
		value: function getDefault() {
			// the default tooltips starting from the beginning of the game
			var r = new tooltipProgression();

			r.tooltips = [tooltip.tip_removeTooltips];

			return r;
		}
	}, {
		key: "current",
		get: function get() {
			return gameState.current.tooltipProgress;
		}
	}]);

	return tooltipProgression;
}();

///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

/// =================================|----------------|===================================
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global variables{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// =================================|----------------|===================================


var debug = true,
	localStorageEnabled = true,
	timeElapsed = 0,
	tStamps = [];

var config = {},
    scores = {};

var effects = [];

var fonts = {},
    gfx = {},
    sfx = {},
    music = {};

// canvas and contexts
var renderTarget, scalingTarget;
var renderContext, scalingContext;
var nativeResolution = new vec2(500, 660),
    screenBounds = new collisionBox(new vec2(), new vec2(nativeResolution.x, nativeResolution.y));

// sets the keys that are used to retrieve saved information in localStorage
var storageKeys = {
	config: "technostalgic_tubetris2_config",
	controls: "technostalgic_tubetris2_keybind",
	scoreboard: "technostalgic_tubetris2_scores"
};

// stores the tooltips that have already been seen
var seenTips = [];
/// ================================|------------------|==================================
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global enumerators{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// ================================|------------------|==================================
// enumerates the different styles that console logs can be
var logType = {
	log: 0,
	error: 1,
	success: 2,
	notify: 3,
	unimportant: 4
	// enumerates the different ways that the canvas can be scaled
};var canvasScaleMode = {
	native: 0,
	fit: 1,
	stretch: 2
	/// ================================|-------------------|=================================
	/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Low-Level functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	/// ================================|-------------------|=================================
};function log() {
	var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : logType.log;

	// logs the spcified object to the console
	if (!debug) return;

	var ob = obj;
	if (obj == undefined) ob = "console logged @" + timeElapsed + "ms";

	// sets the console styling if the object is stylable (if it's a string)
	var style;
	if (ob.constructor.name == "String") {
		ob = "%c" + ob;

		style = "color: #222; background-color: #ddd";
		switch (type) {
			case logType.log:
				style = "color: #000; background-color: #fff";
				break;
			case logType.error:
				style = "color: #f00; background-color: #fdd";
				break;
			case logType.success:
				style = "color: #0b0; background-color: #efe";
				break;
			case logType.notify:
				style = "color: #00d; background-color: #fff";
				break;
			case logType.unimportant:
				style = "color: #999; background-color: #fff";
				break;
		}
	}

	if (style) console.log(ob, style);else console.log(ob);
}
function mobileDebugLog(e) {
	// logs the exception on the html body so that mobile browsers can see it
	console.log(e);
	document.body.innerHTML = e.toString();
}
function loadFont(assetname, filename, charsize) {
	var colorVariants = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;

	// downloads the specified font image to the client and puts it into a textRenderer container with the specified data

	var out = "load font '" + filename + "'... ";

	var r = new Image();
	var f = new textRenderer(r, charsize, colorVariants);

	// sets flags when done loading so that the game knows when the assets are finished loading
	r.onload = function (e) {
		this.loadedState = 1;f.loadedState = 1;
	};
	r.onerror = function (e) {
		this.loadedState = e;f.loadedState = e;
	};
	r.src = "gfx/" + filename;

	fonts[assetname] = f;
	log(out, logType.unimportant);
	return r;
}
function loadGraphic(assetname, filename) {
	// downloads the specified image asset to the client

	var out = "load graphic '" + filename + "'... ";

	var r = new Image();

	// sets flags when done loading so that the game knows when the assets are finished loading
	r.onload = function (e) {
		this.loadedState = 1;
	};
	r.onerror = function (e) {
		this.loadedState = e;
	};

	r.src = "gfx/" + filename;
	gfx[assetname] = r;

	log(out, logType.unimportant);
	return r;
}
function loadSound(assetname, filename) {
	// downloads the specified sound asset to the client

	var out = "load sound '" + filename + "'... ";

	var r = new Audio("sfx/" + filename);

	// sets flags when done loading so that the game knows when the assets are finished loading
	r.oncanplay = function (e) {
		this.loadedState = 1;
	};
	r.onerror = function (e) {
		this.loadedState = e;
	};

	sfx[assetname] = r;

	log(out, logType.unimportant);
	return r;
}
function loadTrack(assetname, filename) {
	// downloads the specified music asset to the client
	var out = "load track '" + filename + "'... ";
	var r = new Audio("sfx/music/" + filename);

	// sets flags when done loading so that the game knows when the assets are finished loading
	r.oncanplay = function (e) {
		this.loadedState = 1;
	};
	r.onerror = function (e) {
		this.loadedState = e;
	};

	music[assetname] = r;

	log(out, logType.unimportant);
}

function clearScreen() {
	var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#aaa";

	// clears the screen to a solid color

	renderContext.fillStyle = color;
	scalingContext.fillStyle = color;

	renderContext.fillRect(0, 0, renderTarget.width, renderTarget.height);
	scalingContext.fillRect(0, 0, scalingTarget.width, scalingTarget.height);
}
function printScreen() {
	// prints the rendering canvas onto the main canvas so it can be scaled to fit the screen
	scalingContext.drawImage(renderTarget, 0, 0, scalingTarget.width, scalingTarget.height);
}

function drawImage(ctx, img, pos) {
	var sprite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	var scale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

	// draws an image onto the specifed context
	if (!sprite) sprite = new spriteBox(new vec2(), new vec2(img.width, img.height));

	ctx.drawImage(img, sprite.left, sprite.top, sprite.width, sprite.height, pos.x, pos.y, sprite.width * scale, sprite.height * scale);
}
function drawCenteredImage(ctx, img, pos) {
	var sprite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	var scale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
	var rotation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

	// draws an image onto the specifed context
	if (!sprite) sprite = new spriteBox(new vec2(), new vec2(img.width, img.height));
	var cCorrect = sprite.size.multiply(-0.5);

	// sets the context transformation to allow rotation
	ctx.translate(pos.x, pos.y);
	ctx.rotate(rotation);

	ctx.drawImage(img, sprite.left, sprite.top, sprite.width, sprite.height, cCorrect.x, cCorrect.y, sprite.width * scale, sprite.height * scale);

	// resets the context transformation
	ctx.rotate(-rotation);
	ctx.translate(-pos.x, -pos.y);
}

function drawArrow(pos) {
	var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : side.right;

	// renders a blinking arrow at the specified position and facing the specified direction
	var blinkRate = 500;
	var isBlinking = gameState.current.timeElapsed % blinkRate >= blinkRate / 2;

	var ssize = 16;
	var spos = new vec2(ssize * (dir - 1), isBlinking ? 16 : 0);
	var sprite = new spriteBox(spos, new vec2(ssize));

	drawImage(renderContext, gfx.arrows, pos.minus(new vec2(ssize / 2)), sprite);
}
function drawCircleFill(ctx, pos) {
	var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
	var col = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : color.fromRGBA(0, 0, 0, 1);

	// draws a filled circle with the specified parameters
	col.setFill(ctx);

	ctx.beginPath();
	ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}
function drawCircleOutline(ctx, pos) {
	var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
	var col = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : color.fromRGBA(255, 255, 255, 1);
	var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2;

	// draws a circle outline with the specified parameters
	col.setStroke(ctx);

	ctx.beginPath();
	ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
	ctx.closePath();
	ctx.stroke();
}
/// ================================|--------------------|================================
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }High-Level functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// ================================|--------------------|================================
function init() {
	// initializes the game

	log("initializing game @" + performance.now().toString() + "ms...", logType.notify);

	// check to see if the user's browser has localStorage enabled
	localStorageCheck();

	// initialize the static class variables
	audioMgr.init();
	controlState.init();
	tile.init();

	// loads all the assets from the server and the config/scores from localStorage, and when that's finished, starts the gameloop
	load();

	// create the canvas and set the canvas variables
	makeCanvas();
	getCanvas();

	// applies the configuration that was loaded
	applyConfig();

	// adds event listeners for the keyboard and touchscreen and mouse
	addInputEventListeners();

	// opens the main menu game state
	goToMainMenu();

	log("intitialized game!");
}
function load() {
	// loads all the game data
	loadAssets();
	loadConfig();
	loadControls();
	loadScores();
}
function loadAssets() {
	// downloads and prepares all the assets needed from the server
	loadFonts();
	loadGFX();
	loadSFX();
	loadMusic();

	log("waiting for assets to finish downloading... ");
	// enters a recursive callback to check to see if the assets are finished loading 
	// a few times per second, when they are finished, finishLoading() is called
	assetLoadingFinishCheck();
}
function determineIfMobile() {
	// determines whether or not the player's device is a mobile device
	if (navigator.platform == null) return true;
	if (!navigator.platform) return false;

	var ua = navigator.userAgent.toLocaleLowerCase();
	if (ua.includes("touch") || ua.includes("mobile")) return true;

	var mobPlats = ["android", "linux armv", "linux aarch64", "linux i686", "iphone", "ipod", "ipad", "pike", "blackberry"];
	var platstr = navigator.platform.toLowerCase();
	var _iteratorNormalCompletion15 = true;
	var _didIteratorError15 = false;
	var _iteratorError15 = undefined;

	try {
		for (var _iterator15 = mobPlats[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
			var plat = _step15.value;

			if (platstr.includes(plat)) return true;
		}
	} catch (err) {
		_didIteratorError15 = true;
		_iteratorError15 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion15 && _iterator15.return) {
				_iterator15.return();
			}
		} finally {
			if (_didIteratorError15) {
				throw _iteratorError15;
			}
		}
	}

	return false;
}

function startGameLoop() {
	// sets an animation frame callback for the main gameloop step
	log("initiating game loop...", logType.notify);
	window.requestAnimationFrame(step);
}
function step() {
	// a game step occurs, update logic is applied and the game is rendered
	var dt = performance.now() - timeElapsed;
	timeElapsed = performance.now();

	update(dt);
	draw();

	window.requestAnimationFrame(step);
}
function update(dt) {
	// handles game logic that doesn't have to do with rendering
	gameState.current.update(dt);
}
function draw() {
	// draws the graphics onto the canvas
	clearScreen();

	gameState.current.draw();

	if (config.showFPS) drawFPS();
	printScreen();

	var now = [performance.now()];
	tStamps.push(now);
	while (tStamps[0] < now - 1000) {
		tStamps.splice(0, 1);
	}
}
/// ==================================|----------------|==================================
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global Functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// ==================================|----------------|==================================
function loadFonts() {
	// downloads all the needed font spritesheets from the server and parses them into a textRenderer container
	log("loading fonts... ");
	fonts = {};

	loadFont("small", "font_small.png", new vec2(12, 8), 8);
	loadFont("large", "font_large.png", new vec2(18, 32), 8);

	// set individual character widths for each font
	fonts.large.setSpecificCharacterWidths({
		'1': 14, '!': 12, ':': 12, ' ': 6, 'j': 16
	});
	fonts.small.setSpecificCharacterWidths({
		'0': 9, '1': 7, '2': 9, '3': 9, '4': 10, '5': 10, '6': 9, '7': 9, '8': 9, '9': 9, '!': 5, ':': 5, '-': 9,
		' ': 4, 'a': 10, 'b': 9, 'c': 9, 'd': 10, 'e': 9, 'f': 7, 'g': 10, 'h': 10, 'i': 7, 'j': 9, 'k': 10, 'l': 8,
		'm': 12, 'n': 11, 'o': 11, 'p': 10, 'q': 11, 'r': 10, 's': 9, 't': 9, 'u': 10, 'v': 10, 'w': 12, 'x': 12,
		'y': 11, 'z': 10
	});

	log(Object.keys(fonts).length.toString() + " fonts indexed", logType.notify);
}
function loadGFX() {
	// downloads all the needed graphics from the server to the client
	log("loading graphics... ");
	gfx = {};

	loadGraphic("tiles_empty", "tiles_empty.png");
	loadGraphic("tiles_tubes", "tiles_tubes.png");
	loadGraphic("tiles_blocks", "tiles_blocks.png");
	loadGraphic("tiles_balls", "tiles_balls.png");
	loadGraphic("effect_poof", "effect_poof.png");
	loadGraphic("effect_explosion", "effect_explosion.png");
	loadGraphic("pathIndicators", "pathIndicators.png");
	loadGraphic("touchPanelIcons", "touchPanelIcons.png");
	loadGraphic("arrows", "arrows.png");
	loadGraphic("coin", "coin.png");

	log(Object.keys(gfx).length.toString() + " images indexed", logType.notify);
}
function loadSFX() {
	// downloads the all the needed sound effects from the server to the client
	log("loading sound effects... ");
	sfx = {};

	// load sounds
	loadSound("moveCursor", "moveCursor.wav");
	loadSound("select", "select.wav");
	loadSound("notify", "notify.wav");
	loadSound("getCoin", "getCoin.wav");
	loadSound("burst", "burst.wav");
	loadSound("explosion", "explosion.wav");
	loadSound("bump", "bump.wav");
	loadSound("swapTileform", "swapTileform.wav");
	loadSound("placeTileform", "placeTileform.wav");
	loadSound("invalidMove", "invalidMove.wav");
	loadSound("ballRoll", "ballRoll.wav");
	loadSound("ballDirect", "ballDirect.wav");
	loadSound("ballPause", "ballPause.wav");
	loadSound("levelUp", "levelUp.wav");
	loadSound("gameOver", "gameOver.wav");

	log(Object.keys(sfx).length.toString() + " sounds indexed", logType.notify);
}
function loadMusic() {
	// downloads the all the needed music tracks from the server to the client
	log("loading music... ");

	// load tracks
	loadTrack("modern", "modern.mp3");
	loadTrack("menu", "menu.mp3");

	log(Object.keys(music).length.toString() + " tracks indexed", logType.notify);
}
function loadConfig() {
	// loads the game configuration from localStorage
	log("loading game configuration... ");

	setDefaultConfig();
	if (!localStorageEnabled) {
		log("localStorage is not enabled", logType.error);
		return;
	}

	var cStr = localStorage.getItem(storageKeys.config);
	if (!cStr) {
		log("no configuration settings found, using default", logType.notify);
		return;
	}

	var cfgFields = Object.keys(config);
	var splCStr = cStr.split('\n');
	splCStr.forEach(function (cOp) {
		var splOp = cOp.split(':');
		if (splOp.length <= 1) return;

		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = cfgFields[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var field = _step16.value;

				if (field == splOp[0]) {
					config[field] = parseAny(splOp[1]);
				}
			}
		} catch (err) {
			_didIteratorError16 = true;
			_iteratorError16 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion16 && _iterator16.return) {
					_iterator16.return();
				}
			} finally {
				if (_didIteratorError16) {
					throw _iteratorError16;
				}
			}
		}

		log(splOp[0] + " = " + config[splOp[0]], logType.unimportant);
	});

	log("loaded!", logType.success);
}
function loadControls() {
	// loads the controlState.controls from localStorage
	log("loading controls... ");
	setDefaultControls();

	if (!localStorageEnabled) {
		log("localStorage is not enabled", logType.error);
		return;
	}

	var cStr = localStorage.getItem(storageKeys.controls);
	if (!cStr) {
		log("no controls settings found, using default", logType.notify);
		return;
	}

	var c = {};
	var splCStr = cStr.split('\n');
	splCStr.forEach(function (cOp) {
		var splOp = cOp.split(':');
		if (splOp.length <= 1) return;
		c[splOp[0]] = Number.parseInt(splOp[1]);
	});

	controlState.setControls(c);
	log(Object.keys(controlState.controls).length + " controls loaded", logType.unimportant);
}
function loadScores() {
	// loads the scoreboard data from localStorage
	log("loading scores... ");

	var r = [];
	if (!localStorageEnabled) {
		log("localStorage is not enabled", logType.error);
		setDefaultScores();
		return;
	}

	var data = localStorage.getItem(storageKeys.scoreboard);
	if (!data) {
		// returns if there is no score data
		log("no score data found, reverting to default", logType.unimportant);
		setDefaultScores();
		return;
	}

	var splData = data.split('\n');
	splData.forEach(function (score, i) {
		var splScore = score.split(':');
		if (splScore.length < 2) return;

		var sCap = { name: splScore[0], score: parseInt(splScore[1]) };
		r.push(sCap);
	});

	scores = r;
	log(r.length + " scores loaded", logType.unimportant);
}

function localStorageCheck() {
	// checks to see if the browser is able to store and load data from localStorage
	log("testing to see if localStorage is enabled...", logType.notify);
	try {
		localStorage.setItem("technostalgic_test", true);
		localStorageEnabled = localStorage.getItem("technostalgic_test");
		log("browser localStorage is enabled!", logType.success);
	} catch (e) {
		localStorageEnabled = false;
		log("browser localStorage is disabled by user", logType.error);
	}
}
function saveConfig() {
	// saves the game configuration to localStorage
	log("saving game configuration... ", logType.notify);
	if (!localStorageEnabled) {
		log("localStorage is not enabled", logType.error);
		return;
	}

	var cStr = "";
	Object.keys(config).forEach(function (key) {
		var op = key + ":" + config[key].toString();
		cStr += op + "\n";
	});
	localStorage.setItem(storageKeys.config, cStr);

	log("saved!", logType.success);
}
function saveControls() {
	// saves the game controls to the browser's localStorage
	log("saving game controls... ", logType.notify);
	if (!localStorageEnabled) {
		log("localStorage is not enabled", logType.error);
		return;
	}

	var cStr = "";
	Object.keys(controlState.controls).forEach(function (key) {
		var op = key + ":" + controlState.controls[key];
		cStr += op + "\n";
	});
	localStorage.setItem(storageKeys.controls, cStr);

	log("saved!", logType.success);
}
function saveScores() {
	// saves the scoreboard data to localStorage
	log("saving scoreboard scores...", logType.notify);
	if (!localStorageEnabled) {
		log("localStorage is not enabled", logType.error);
		return;
	}

	var dataStr = "";
	scores.forEach(function (score, i) {
		var sStr = score.name + ":" + score.score.toString();
		dataStr += sStr + '\n';
	});
	localStorage.setItem(storageKeys.scoreboard, dataStr);

	log("saved!", logType.success);
}

function checkSmallScreenScaling() {
	// checks to see if the user is playing the game on a device with a small screen
	// and adjusts to accomodate
	if (window.outerWidth < nativeResolution.x || window.outerHeight < nativeResolution.y) config.canvasScaleMode = 1;
	//applyConfig();
}

function setDefaultConfig() {
	// sets the default game configuration settings
	config = {
		touchMode: determineIfMobile(),
		touchModeSpecified: false,
		hapticPulses: true,
		swipeRadius: 1,
		animText: true,
		animSpeed: 1,
		explosionEffects: true,
		volume_music: 1,
		volume_sound: 1,
		imageSmoothing: false,
		scaleSmoothing: false,
		canvasScaleMode: 0,
		saving: true,
		tooltipsEnabled: true,
		arrowIndicators: true,
		pathIndicators: true,
		showFPS: false
	};
	checkSmallScreenScaling();
}
function setDefaultControls() {
	// sets the default game controlState.controls
	controlState.setControls(getDefaultControls());
}
function getDefaultControls() {
	return {
		left: 37,
		right: 39,
		up: 38,
		down: 40,
		quickDrop: 88,
		nudgeDown: 40,
		rotateCW: 38,
		rotateCCW: 0,
		swap: 90,
		select: 13,
		pause: 27
	};
}
function setDefaultScores() {
	scores = getDefaultScores();
}
function getDefaultScores() {
	return [{ name: "Techno 1", score: 250000 }, { name: "Techno 2", score: 100000 }, { name: "Techno 3", score: 50000 }, { name: "Techno 4", score: 10000 }, { name: "Techno 5", score: 5000 }];
}

function insertScore(rank, scName, points) {
	// inserts a score at the specified place
	scores.splice(rank, 0, { name: scName, score: points });

	if (scores.length > 5) scores.splice(5);
}
function responsiveText(pcText) {
	var mobileText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : pcText;

	// returns mobileText if user is on a device with a touchscreen, otherwise returns pcText
	return !config.touchMode ? pcText : mobileText;
}
function hapticFeedbackEnabled() {
	// if the game is allowed to send haptic feedback to the device
	return (
		//config.touchMode && 
		config.hapticPulses
	);
}

function addInputEventListeners() {
	//window.addEventListener('keydown', function(e){ log("key '" + e.key + "'(" + e.keyCode + ") pressed", logType.notify); });
	scalingTarget.addEventListener('mousedown', controlState.listenForMouseDown);
	scalingTarget.addEventListener('mouseup', controlState.listenForMouseUp);
	scalingTarget.addEventListener('mousemove', controlState.listenForMouseMove);
	window.addEventListener('keydown', controlState.listenForKeyDown);
	window.addEventListener('keyup', controlState.listenForKeyUp);

	// touch events:
	scalingTarget.addEventListener('touchstart', controlState.listenForTouchStart);
	scalingTarget.addEventListener('touchmove', controlState.listenForTouchMove);
	scalingTarget.addEventListener('touchend', controlState.listenForTouchEnd);
	scalingTarget.addEventListener('touchcancel', controlState.listenForTouchCancel);
}
function preventKeyScrolling() {
	// prevents arrow key / space scrolling on the web page
	window.addEventListener("keydown", function (e) {
		if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);
	window.addEventListener("touchmove", function (e) {
		e.preventDefault();
	}, false);
}

function generateDynamicTextures() {
	// generates all the textures that need to be created dynamically
	log("generating dynamic textures...");

	generateBackground();
	generateForeground_border();
	generateForeground_overlay();

	log("finished generating dynamic textures! @" + performance.now() + "ms", logType.success);
}
function generateBackground() {
	// generates the dark tile texture that is drawn in the background
	log("generating background texture...", logType.unimportant);

	var bg = document.createElement("canvas");
	bg.width = screenBounds.width;
	bg.height = screenBounds.height;
	var bgctx = bg.getContext("2d");
	var tilesize = tile.tilesize;
	var off = tile.offset;
	var cX = Math.floor(bg.width / tilesize) + 1;
	var cY = Math.floor(bg.height / tilesize) + 1;
	var sbox = new spriteBox(new vec2(tile.tilesize, 0), new vec2(tile.tilesize));

	for (var y = -1; y <= cY; y++) {
		for (var x = -1; x <= cX; x++) {
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(bgctx, gfx.tiles_empty, tpos, sbox);
		}
	}

	gfx.background = bg;
}
function generateForeground_border() {
	// generates the tile border that surrounds the background tiles in menu
	log("generating foreground border texture...", logType.unimportant);

	var fg = document.createElement("canvas");
	fg.width = screenBounds.width;
	fg.height = screenBounds.height;
	var fgctx = fg.getContext("2d");
	var tilesize = tile.tilesize;
	var off = tile.offset;
	var cX = Math.floor(fg.width / tilesize) + 1;
	var cY = Math.floor(fg.height / tilesize);
	var sbox = new spriteBox(new vec2(0), new vec2(tile.tilesize));

	for (var y = -1; y <= cY; y++) {
		for (var x = -1; x <= cX; x += y == -1 || y == cY ? 1 : cX) {
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}

	gfx.foreground_border = fg;
}
function generateForeground_overlay() {
	//generates the texture that is overlayed over the background for the HUD text to disply on during gameplay
	log("generating foreground overlay texture...", logType.unimportant);

	var fg = document.createElement("canvas");
	fg.width = screenBounds.width;
	fg.height = screenBounds.height;
	var fgctx = fg.getContext("2d");
	var tilesize = tile.tilesize;
	var off = tile.offset.minus(new vec2(tilesize));
	var cX = Math.floor(fg.width / tilesize) + 1;
	var cY = Math.floor(fg.height / tilesize) + 1;
	var sbox = new spriteBox(new vec2(), new vec2(tile.tilesize));

	// border foreground tiles
	for (var y = 0; y <= cY; y++) {
		for (var x = 0; x <= cX; x += y == 0 || y == cY ? 1 : cX) {
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground tiles to the left of next piece area
	for (var _y = 2; _y <= 3; _y++) {
		for (var _x187 = 11; _x187 < 12; _x187++) {
			var tpos = off.plus(new vec2(_x187 * tilesize, _y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground above next piece area
	for (var _y2 = 1; _y2 <= 1; _y2++) {
		for (var _x188 = 11; _x188 < cX; _x188++) {
			var tpos = off.plus(new vec2(_x188 * tilesize, _y2 * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground tiles on the right side of the screen
	for (var _y3 = 4; _y3 < cY; _y3++) {
		for (var _x189 = 11; _x189 < cX; _x189++) {
			var tpos = off.plus(new vec2(_x189 * tilesize, _y3 * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}

	// tileboard righthand shadow
	var spos1 = off.plus(new vec2(tilesize * 11 - 1, tilesize * 1));
	var ssize1 = new vec2(1, tilesize * 20);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos1.x, spos1.y, ssize1.x, ssize1.y);

	// tileboard top shadow
	var spos2 = off.plus(new vec2(tilesize * 1, tilesize * 1));
	var ssize2 = new vec2(tilesize * 10, 1);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos2.x, spos2.y, ssize2.x, ssize2.y);

	// next piece righthand shadow
	var spos1 = off.plus(new vec2(tilesize * cX - 1, tilesize * 2));
	var ssize1 = new vec2(1, tilesize * 2);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos1.x, spos1.y, ssize1.x, ssize1.y);

	// next piece top shadow
	var spos2 = off.plus(new vec2(tilesize * 12, tilesize * 2));
	var ssize2 = new vec2(tilesize * 4, 1);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos2.x, spos2.y, ssize2.x, ssize2.y);

	gfx.foreground_overlay = fg;
}

function parseAny(str) {
	// decides what value type str is supposed to represent and parses it into either a 
	// number or a boolean
	var r = parseFloat(str);
	return r || str[0] == 't';
}
function applyConfig() {
	// applies the game configuration settings

	// applies canvasScaleMode
	switch (config.canvasScaleMode) {
		case canvasScaleMode.native:
			setNativeResolution();break;
		case canvasScaleMode.fit:
			fitToScreen();break;
		case canvasScaleMode.stretch:
			stretchToScreen();break;
	}

	// applies image smoothing
	renderContext.mozImageSmoothingEnabled = config.imageSmoothing;
	renderContext.oImageSmoothingEnabled = config.imageSmoothing;
	renderContext.webkitImageSmoothingEnabled = config.imageSmoothing;
	renderContext.msImageSmoothingEnabled = config.imageSmoothing;
	renderContext.imageSmoothingEnabled = config.imageSmoothing;

	// applies scale smoothing
	scalingContext.mozImageSmoothingEnabled = config.scaleSmoothing;
	scalingContext.oImageSmoothingEnabled = config.scaleSmoothing;
	scalingContext.webkitImageSmoothingEnabled = config.scaleSmoothing;
	scalingContext.msImageSmoothingEnabled = config.scaleSmoothing;
	scalingContext.imageSmoothingEnabled = config.scaleSmoothing;

	// applies music volume
	if (audioMgr.currentMusic) audioMgr.currentMusic.volume = config.volume_music;
}

function getFitCanvasSize() {
	var ratio = nativeResolution.x / nativeResolution.y;
	var maxSize = getMaxCanvasSize();
	var w = maxSize.x;
	var h = w / ratio;

	if (h > maxSize.y) {
		h = maxSize.y;
		w = h * ratio;
	}

	return new vec2(w, h);
}
function getMaxCanvasSize() {
	var maxW = Math.min(screen.availWidth, screen.width, window.innerWidth, window.outerWidth);
	var maxH = Math.min(screen.availHeight, screen.height, window.innerHeight, window.outerHeight);
	return new vec2(maxW, maxH);
}
function nativeResolutionSupported() {
	var size = getMaxCanvasSize();
	return nativeResolution.x <= size.x && nativeResolution.y <= size.y;
}

function makeCanvas() {
	// creates the game canvas element
	var size = nativeResolutionSupported() ? nativeResolution.clone() : getFitCanvasSize();
	switch (config.canvasScaleMode) {
		case canvasScaleMode.fit:
			size = getFitCanvasSize();
			break;
		case config.canvasScaleMode.stretch:
			size = getMaxCanvasSize();
			break;
	}

	var cvs = document.createElement("canvas");
	cvs.width = size.x;
	cvs.height = size.y;
	cvs.id = "gameCanvas";

	document.body.appendChild(cvs);
}
function getCanvas() {
	// gets or creates the canvas and canvas contexts from the webpage and sets them to the global variables
	log("retrieving canvas data... ");

	// the scaling canvas is what is displayed on the webpage
	scalingTarget = document.getElementById("gameCanvas");
	scalingContext = scalingTarget.getContext("2d");

	// the rendering canvas is the canvas that everything is rendered to in the game's native resolution, it is then rescaled by the scaling canvas to the desired resolution before being drawn
	renderTarget = document.createElement("canvas");
	renderTarget.width = nativeResolution.x;
	renderTarget.height = nativeResolution.y;
	renderContext = renderTarget.getContext("2d");
}
function fitToScreen() {
	// expands the canvas so that it fills the screen while keeping the native aspect ratio
	var size = getFitCanvasSize();

	scalingTarget.width = size.x;
	scalingTarget.height = size.y;
}
function stretchToScreen() {
	// stretches the canvas so that its covers the whole screen
	var size = getMaxCanvasSize();

	scalingTarget.width = size.x;
	scalingTarget.height = size.y;
}
function setNativeResolution() {
	// sets the canvas back to native resolution
	var size = nativeResolutionSupported() ? nativeResolution.clone() : getFitCanvasSize();

	scalingTarget.width = size.x;
	scalingTarget.height = size.y;
}

function updateEffects(dt) {
	// updates all the effects
	// must be iterated through backwards, so that when an effect is removed from the effect list during its update step, the 
	// loop won't lose its place
	for (var i = effects.length - 1; i >= 0; i--) {
		effects[i].update(dt);
	}
}
function drawEffects() {
	// draws all the effect objects
	effects.forEach(function (effectOb) {
		effectOb.draw();
	});
}

function assetLoadingFinishCheck() {
	// checks to see if the assets are done downloading, if not, it sets a callback to itself and returns empty

	var errs = [];
	for (var i in fonts) {
		if (!fonts[i].spritesheet.loadedState) {
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the font, it is added to the errs array
		else if (fonts[i].spritesheet.loadedState != 1) errs.push({ obj: fonts[i], varName: "fonts." + i });
	}
	for (var _i3 in gfx) {
		if (!gfx[_i3].loadedState) {
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the asset, it is added to the errs array
		else if (gfx[_i3].loadedState != 1) errs.push({ obj: gfx[_i3], varName: "gfx." + _i3 });
	}
	for (var _i4 in sfx) {
		if (!sfx[_i4].loadedState) {
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the asset, it is added to the errs array 
		else if (sfx[_i4].loadedState != 1) errs.push({ obj: gfx[_i4], varName: "sfx." + _i4 });
	}
	for (var _i5 in music) {
		if (!music[_i5].loadedState) {
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the asset, it is added to the errs array 
		else if (music[_i5].loadedState != 1) errs.push({ obj: gfx[_i5], varName: "music." + _i5 });
	}

	finishLoading(errs);
	return true;
}
function handleAssetLoadingErrors(errors) {
	// logs the errors in the console
	Object.keys(errors).forEach(function (key) {
		// the problem variable
		log("*** error loading '" + errors[key].obj.constructor.name + "' @ var: " + errors[key].varName, logType.error);
		// the error object
		log(errors[key].obj.loadedState);
	});
}
function finishLoading() {
	var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	// called after all assets are done downloading
	if (debug) handleAssetLoadingErrors(errors);
	log("--> finished loading game assets! @" + performance.now().toString() + "ms", logType.success);
	generateDynamicTextures();
	applyConfig();
	startGameLoop();
}

function startNewGame() {
	// starts a new game
	var state = new state_gameplayState();

	tile.constructGrid();

	audioMgr.playMusic(music.modern);
	gameState.switchState(state);
}
function goToMainMenu() {
	audioMgr.playMusic(music.menu);
	gameState.switchState(new state_mainMenu());
}

function drawFPS() {
	textRenderer.drawText(tStamps.length.toString(), new vec2(10, 10), new textStyle(fonts.small));
}
function drawBackground() {
	// draws the tiled backgroumd image onto the canvas
	drawImage(renderContext, gfx.background, new vec2());
}
function drawForegroundBorder() {
	// draws the border around inside of the canvas
	drawImage(renderContext, gfx.foreground_border, new vec2());
}
function drawForegroundOverlay() {
	// draws the overlay for the HUD to be displayed on while in game
	drawImage(renderContext, gfx.foreground_overlay, new vec2());
}

function touchListIncludes(touchlist, item) {
	// for some stupid fucking reason, touch events contain lists of the touches on the screen at that time,
	// but those lists are some pointless bullshit object called "TouchLists" instead of just being a normal
	// fucking array so you can't use any of the array member methods on them
	var _iteratorNormalCompletion17 = true;
	var _didIteratorError17 = false;
	var _iteratorError17 = undefined;

	try {
		for (var _iterator17 = touchlist[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
			var t = _step17.value;

			if (t == item) return true;
		}
	} catch (err) {
		_didIteratorError17 = true;
		_iteratorError17 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion17 && _iterator17.return) {
				_iterator17.return();
			}
		} finally {
			if (_didIteratorError17) {
				throw _iteratorError17;
			}
		}
	}

	return false;
}
function clientToOffsetPos(clientpos) {
	// converts a client position to an offset position with respect to the scaling canvas
	var bounds = scalingTarget.getBoundingClientRect();
	return clientpos.minus(new vec2(bounds.left, bounds.top));
}
/// ================================|--------------------|================================
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ { -Script Execution- } ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// ================================|--------------------|================================

preventKeyScrolling();
//window.addEventListener("load", init);