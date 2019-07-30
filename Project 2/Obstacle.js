class Obstacle {
  constructor(xRange,yRange) {
    this.constraint1x = Math.floor((Math.random() * xRange));//cahnge these hardcoded values
    this.constraint1y = Math.floor((Math.random() * yRange));
    this.constraint2x = Math.floor((Math.random()*xRange));
    this.constraint2y = Math.floor((Math.random()*yRange));
    this.xStart = Math.floor((Math.random() * xRange));
    this.yStart =Math.floor((Math.random() * yRange));
    this.xEnd = Math.floor((Math.random() * xRange));
    this.yEnd = Math.floor((Math.random() * yRange));
    this.xCoord=this.xStart;
    this.yCoord=this.yStart;
    this.xVelocity=0;
    this.yVelocity=0
  }
  update_obstacle_pos(T,dt) {
    let newxCoord = Math.pow(1 - T, 3) * this.xStart + Math.pow(1 - T, 2) * this.constraint1x * T * 1 + (1 - T) * 3 * T * T * this.constraint2x + T * T * T * this.xEnd;
    let newyCoord = Math.pow(1 - T, 3) * this.yStart + Math.pow(1 - T, 2) * this.constraint1y * T * 1 + (1 - T) * 3 * T * T * this.constraint2y + T * T * T * this.yEnd;
    this.xVelocity = (newxCoord-this.xCoord)/dt;
    this.yVelocity=  (newyCoord-this.yCoord)/dt;
    this.xCoord = newxCoord;
    this.yCoord = newyCoord;
  }
  speed(){
    return Math.sqrt((this.xCoord*this.xCoord)+(this.yCoord*this.yCoord));
  }
}
