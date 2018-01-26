///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

var dir = {
	none: 0,
	left: 1,
	right: 2,
	up: 3,
	down: 4
}

class vec2{
  constructor(x = 0, y = x){
    this.x = x;
    this.y = y;
  }
  
  normalized(magnitude = 1){
    //returns a vector 2 with the same direction as this but
    //with a specified magnitude
    return this.multiply(magnitude / this.distance());
  }
  inverted(){
    //returns the opposite of this vector
    return this.multiply(-1);
  }
  multiply(factor){
    //returns this multiplied by a specified factor    
    return new vec2(this.x * factor, this.y * factor);
  }
  plus(vec){
    //returns the result of this added to another specified vector2
    return new vec2(this.x + vec.x, this.y + vec.y);
  }
  minus(vec){
    //returns the result of this subtracted to another specified vector2
    return this.plus(vec.inverted);
  }
  rotate(rot){
    //rotates the vector by the specified angle
    var ang = this.direction;
    var mag = this.distance();
    ang += rot;
    return vec2.fromAng(ang, mag)
  }
  equals(vec, leniency = 0.0001){
    //returns true if the difference between rectangular distance of the two vectors is less than the specified leniency
    return (
      Math.abs(this.x - vec.x) <= leniency) && (
      Math.abs(this.y - vec.y) <= leniency);
  }
  
  direction(){
    //returns the angle this vector is pointing in radians
    return Math.atan2(this.y, this.x);
  }
  distance(vec = null){
    //returns the distance between this and a specified vector2
    if(vec === null)
      vec = new vec2();
    var d = Math.sqrt(
      Math.pow(this.x - vec.x, 2) + 
      Math.pow(this.y - vec.y, 2));
    return d;
  }
  
  clone(){
    return new vec2(this.x, this.y);
  }
  static fromAng(angle, magnitude = 1){
    //returns a vector which points in the specified angle
    //and has the specified magnitude
    return new vec2(
      Math.cos(angle) * magnitude, 
      Math.sin(angle) * magnitude);
  }
  static fromDir(direction){
	  switch(direction){
		  case dir.none: return new vec2(0, 0);
		  case dir.left: return new vec2(-1, 0);
		  case dir.right: return new vec2(1, 0);
		  case dir.up: return new vec2(0, -1);
		  case dir.down: return new vec2(0, 1);
	  }
	  return new vec2();
  }
  
  toString(){
    return "vector<" + this.x + ", " + this.y + ">";
  }
}