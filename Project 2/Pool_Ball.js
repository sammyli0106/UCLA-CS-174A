class Pool_Ball{
	constructor(xCoord, yCoord,velocityX,velocityY,ballText){
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.oldX = xCoord;
		this.oldY = yCoord;
		this.radius = 1.5;
		this.xVelocity = velocityX;
		this.yVelocity = velocityY;
		this.acceleration = -10;
		this.xSpeed = Math.abs(this.xVelocity);
		this.ySpeed = Math.abs(this.yVelocity);
		this.xDir = Math.sign(this.xVelocity);
		this.yDir = Math.sign(this.yVelocity);
		this.rotationAngle = 0;
		this.rotationVector = Vec.of(0,1,0);
		this.ballText = ballText;
		let matrix= Mat4.identity();
		
		this.ballhit_sound = new Audio("assets/ballhit.mp3");
		this.wallhit_sound = new Audio("assets/wallhit.mp3");
		this.obstacle_sound = new Audio("assets/MetalClank.mp3");
	}
	update_ball_pos(t){
		let currSpeed = this.speed();
		let dv = this.acceleration*t;
		if(currSpeed+dv<=0){
			this.update_xVelocity(0);
			this.update_yVelocity(0);
		}
		else{
			currSpeed += dv;
			let angle = Math.atan2(this.yVelocity,this.xVelocity);
			this.update_xVelocity(currSpeed*Math.cos(angle));
			this.update_yVelocity(currSpeed*Math.sin(angle));
		}
		let tmp=Math.sqrt((this.xCoord-(this.xCoord+this.xVelocity*t))*(this.xCoord-(this.xCoord+this.xVelocity*t))+(this.yCoord-(this.yCoord+this.yVelocity*t))*(this.yCoord-(this.yCoord+this.yVelocity*t)))/9.42;
		this.rotationAngle += (tmp*2*Math.PI)%(2*Math.PI);
		if(this.xVelocity!= 0 || this.yVelocity!=0){
			this.rotationVector = Vec.of(this.yVelocity,0,-1*this.xVelocity);
		}
		this.oldX = this.xCoord;
		this.oldY = this.yCoord;
		this.xCoord += this.xVelocity*t;
		this.yCoord += this.yVelocity*t;
		if (this.xCoord>0)
			this.acceleration = -10;
		else
			this.acceleration = -5
	}

	update_xVelocity(vel){
		this.xVelocity = vel;
		this.xSpeed = Math.abs(vel);
		this.xDir = Math.sign(vel);
	}
	update_yVelocity(vel){
		this.yVelocity= vel;
		this.ySpeed = Math.abs(vel);
		this.yDir = Math.sign(vel);
	}
	speed(){
		return Math.sqrt(this.xVelocity*this.xVelocity+this.yVelocity*this.yVelocity);
	}

	handle_collision_obstacle(obstacle){
		this.obstacle_sound.play();
		let vecX = obstacle.xCoord - this.xCoord;
		let vecY = obstacle.yCoord - this.yCoord;
		this.update_xVelocity(-1*vecX*5);
		this.update_yVelocity(-1*vecY*5);

	}
	handle_collision_balls(ball2){//handle perfectly ellastic collisions
		this.ballhit_sound.play();
		
		let vecX = ball2.xCoord - this.xCoord;
		let vecY = ball2.yCoord - this.yCoord;
		let phi = Math.atan2(vecY,vecX);
		let theta1 = Math.atan2(this.yVelocity,this.xVelocity);
		let theta2 = Math.atan2(ball2.yVelocity,ball2.xVelocity);
		let speed1 = this.speed();
		let speed2 = ball2.speed();
		let new1x = speed2*Math.cos(theta2-phi)*Math.cos(phi)+speed1*Math.sin(theta1-phi)*Math.cos(phi+Math.PI/2);
		let new1y = speed2*Math.cos(theta2-phi)*Math.sin(phi)+speed1*Math.sin(theta1-phi)*Math.sin(phi+Math.PI/2);
		let new2x = speed1*Math.cos(theta1-phi)*Math.cos(phi)+speed2*Math.sin(theta2-phi)*Math.cos(phi+Math.PI/2);
		let new2y = speed1*Math.cos(theta1-phi)*Math.sin(phi)+speed2*Math.sin(theta2-phi)*Math.sin(phi+Math.PI/2);
		if(Math.abs(new1x)>200)
			new1x = 0;
		if(Math.abs(new1y)>200)
			new1y = 0;
		if(Math.abs(new2x)>200)
			new2x  = 0;
		if(Math.abs(new2y)>200)
			new2y = 0;
		

		this.update_xVelocity(new1x);
		this.update_yVelocity(new1y);
		ball2.update_xVelocity(new2x);
		ball2.update_yVelocity(new2y);
	}

	handle_collision_walls(type){
		this.wallhit_sound.play();
		
		if(type==0)
			if(this.xVelocity>0)
				this.update_xVelocity(this.xVelocity*-1);
		if(type==1)
			if(this.xVelocity<0)
				this.update_xVelocity(this.xVelocity*-1);
		if(type==2)
			if(this.yVelocity>0)
				this.update_yVelocity(this.yVelocity*-1);
		if(type==3)
			if(this.yVelocity<0)
				this.update_yVelocity(this.yVelocity*-1);
	}

	collision_detection_wall(width,length){
		if((this.xCoord+this.radius>=width))
			this.handle_collision_walls(0);
		if(this.xCoord-this.radius <= (-1*width))
			this.handle_collision_walls(1);
		if((this.yCoord+this.radius>=length))
			this.handle_collision_walls(2);
		if(this.yCoord-this.radius<=(-1*length))
			this.handle_collision_walls(3);
	}
	collision_detection_balls(ball2){
		let deltax = ball2.xCoord -this.xCoord;
		let deltay = ball2.yCoord-this.yCoord;
		let distance =Math.sqrt(Math.pow(ball2.xCoord-this.xCoord,2)+Math.pow(ball2.yCoord-this.yCoord,2));
		if(distance<=(this.radius*2)){
			this.handle_collision_balls(ball2);
		}
			
	}
	collision_detection_obstacles(obstacle){
		let deltax = obstacle.xCoord -this.xCoord;
		let deltay = obstacle.yCoord-this.yCoord;
		let distance =Math.sqrt(Math.pow(obstacle.xCoord-this.xCoord,2)+Math.pow(obstacle.yCoord-this.yCoord,2));
		if(distance<=(4.5)){
			this.handle_collision_obstacle(obstacle);
		}
	}
}