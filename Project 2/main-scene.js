class Assignment_Two_Skeleton extends Scene_Component {
  // The scene begins by requesting the camera, shapes, and materials it will need.
  constructor(context, control_box) {
    super(context, control_box);

    this.CBALL_START_X = 0;
	this.CBALL_START_Y = 30;
	this.TBALL_START_X = 0;
	this.TBALL_START_Y = 0;
	this.CAM_DIST = 30;
	this.CAM_HEIGHT = 15;
	this.INDICATOR_RAD = 0.5;
	this.INDICATOR_LEN = 20;
	this.MIN_POWER = 0;
	this.MAX_POWER = 100;
	this.CHANGE_CAM_DELAY = 0.75;
	this.ROBOT_T_START = -2;
	this.ROBOT_T_END = 2;
	this.ROBOT_T_CONTACT = 0;
	this.ROBOT_T_INVALID = -5;

    this.shootPower = 25;
    this.follow_ball = true;
	this.shoot_mode = true;
    this.context = context;
    this.graphics_state = context.globals.graphics_state;
    this.velRatio = 0;
	this.start_timer = -1;
	this.cam_xVel = 0;
	this.cam_yVel = 0;
	this.epsilon = 0.000000000000001;
	this.ball_is_still = true;
	this.sign_cam_xVel = 0;
	this.sign_cam_yVel = 0;
	this.draw_indic_cylind = true;
	this.draw_robot_flag = false;
	this.robot_t = this.ROBOT_T_INVALID;
	this.allow_launch = true;

    // First, include a secondary Scene that provides movement controls:
    if (!context.globals.has_controls)
      context.register_scene_component(new Movement_Controls(context,control_box.parentElement.insertCell()));

    // Locate the camera here (inverted matrix).
    const r = context.width / context.height;
    //context.globals.graphics_state.camera_transform = Mat4.translation(
    //[-this.CBALL_START_X, -this.CAM_HEIGHT, -this.CBALL_START_Y - this.CAM_DIST_FR_BALL]);
    context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

    // At the beginning of our program, load one of each of these shape
    // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
    // design.  Once you've told the GPU what the design of a cube is,
    // it would be redundant to tell it again.  You should just re-use
    // the one called "box" more than once in display() to draw
    // multiple cubes.  Don't define more than one blueprint for the
    // same thing here.
    const shapes = {
		'square': new Square(),
		'circle': new Circle(15),
        'pyramid': new Tetrahedron(false),
        'simplebox': new SimpleCube(),
        'box': new Cube(),
        'cylinder': new Cylinder(15),
        'cone': new Cone(20),
        'ball': new Subdivision_Sphere(4),
        'hexagon' : new Hexagon(), 
        'star' : new Star(),
        'pentagon': new Pentagon(),
        'pocket' : new Pocket(16),
        'hand' : new Hand(16),
        'cylinder2' : new Cylinder2(15),
      'myObstacle':new myObstacle(32)
    }
    this.submit_shapes(context, shapes);
    this.shape_count = Object.keys(shapes).length;

    // Make some Material objects available to you:
    this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
      ambient: .4,
      diffusivity: .4
    });
    this.pocketMat = context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
      ambient: .1,
      diffusivity: .4
    });
    this.plastic = this.clay.override({
      specularity: .6
    });
    this.texture_base = context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
      ambient: 1,
      diffusivity: 0.4,
      specularity: 0.3
    });

    this.pockethit_sound = new Audio("assets/pockethit.mp3");

    // Load some textures for the demo shapes
    this.shape_materials = {};
    const shape_textures = {
      square: "assets/butterfly.png",
      box: "assets/robot3.jpg",
	  box1 : "assets/metal2.jpg",
      cueball: "assets/cue.jpg",
      ball1: "assets/1ball.jpg",
      ball2: "assets/2ball.jpg",
      ball3: "assets/3ball.jpg",
      ball4: "assets/4ball.jpg",
      ball5: "assets/5ball.jpg",
      ball6: "assets/6ball.jpg",
      cylinder: "assets/treebark.png",
      pyramid: "assets/tetrahedron-texture2.png",
      simplebox: "assets/tetrahedron-texture2.png",
      cone: "assets/fire.jpg",
      tabletop: "assets/felt1024.jpg",
      tablelegs: "assets/treebark.png",
      obstacle: "assets/metallic.jpg",
	  circle: "assets/button.jpg",
      hexagon : "assets/hypnosis.jpg",
      star : "assets/butterfly.png",
      pentagon : "assets/butterfly.png",
      hand : "assets/metal5.jpg",
      eye : "assets/sparkle.jpeg",
      arm : "assets/metal4.jpeg",
      cylinder2 : "assets/booster.jpg",
      button : "assets/button.jpg",
    };
    for (let t in shape_textures)
      this.shape_materials[t] = this.texture_base.override({
        texture: context.get_instance(shape_textures[t])
      });

    this.lights = [new Light(Vec.of(10, 10, 20, 1),Color.of(1, .4, 1, 1),100000)];

    this.blue = Color.of(0, 0, 1, 1);
    this.yellow = Color.of(1, 1, 0, 1);
    this.green = Color.of(0, 1, 0, 1);
    this.pink = Color.of(1, 0, 1, 1);
    this.red = Color.of(1, 0, 0, 1);
    this.white = Color.of(255, 255, 255, 1);
    this.black = Color.of(0, 0, 0, 1);

    this.t = 0;
    this.t2 = this.t;
    this.cueball = new Pool_Ball(this.CBALL_START_X,this.CBALL_START_Y,0,0,this.shape_materials.cueball);
    //x,y,xvelocity,yvelocity
    this.targetball1 = new Pool_Ball(this.TBALL_START_X,this.TBALL_START_Y,0,0,this.shape_materials.ball1);
    this.targetball2 = new Pool_Ball(this.TBALL_START_X - 1.6,this.TBALL_START_Y - 3,0,0,this.shape_materials.ball2);
    this.targetball3 = new Pool_Ball(this.TBALL_START_X + 1.6,this.TBALL_START_Y - 3,0,0,this.shape_materials.ball3);
    this.targetball4 = new Pool_Ball(this.TBALL_START_X - 3.1,this.TBALL_START_Y - 6,0,0,this.shape_materials.ball4);
    this.targetball5 = new Pool_Ball(this.TBALL_START_X + 3.1,this.TBALL_START_Y - 6,0,0,this.shape_materials.ball5);
    this.targetball6 = new Pool_Ball(this.TBALL_START_X,this.TBALL_START_Y - 6,0,0,this.shape_materials.ball6);
    //x,y,velocity
    this.balls = [this.cueball, this.targetball6, this.targetball1, this.targetball2, this.targetball3, this.targetball4, this.targetball5];
    //this.balls = [this.cueball, this.targetball1];
    this.poolTable = new Pool_Table();
    this.obstacle1 = new Obstacle(this.poolTable.widthTable-3,this.poolTable.lengthTable-3);
    this.obstacle2 = new Obstacle(-this.poolTable.widthTable+3,this.poolTable.lengthTable-3);
    this.obstacle3 = new Obstacle(this.poolTable.widthTable-3,-this.poolTable.lengthTable+3);
    this.obstacle4 = new Obstacle(-this.poolTable.widthTable+3,-this.poolTable.lengthTable+3);
    this.obstacles = [this.obstacle1, this.obstacle2, this.obstacle3, this.obstacle4];
  }

  cubicBezier(p0, p1, p2, p3, t) {
    var pFinal = {};
    pFinal.x = Math.pow(1 - t, 3) * p0.x + Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x;
    pFinal.y = Math.pow(1 - t, 3) * p0.y + Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y;
    return pFinal;
  }

  // randomRange(min, max)
  // {
  // 	return min + Math.random() * (max - min);
  // }

  // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
	make_control_panel() {
        this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
		
		// this.key_triggered_button("Move back to ball", ["g"], () => {
			// this.follow_ball = false;
			// this.graphics_state.allow_cam_turn = true;
            // this.context.globals.graphics_state.camera_transform = 
				// Mat4.rotation(-this.graphics_state.shootAngle, Vec.of(0, 1, 0))
				// .times(Mat4.translation(
					// Vec.of(-this.cueball.xCoord, -this.CAM_HEIGHT, -this.cueball.yCoord)))
				// .times(Mat4.translation(Vec.of(Math.sin(-this.graphics_state.shootAngle) * this.CAM_DIST_FR_BALL,
												// 0,
												// -Math.cos(-this.graphics_state.shootAngle) * this.CAM_DIST_FR_BALL)));
			// //this.graphics_state.shootAngle = 0;
        // });
		
		this.key_triggered_button("Shoot ball", ["h"], () => {
			if (this.cueball.xVelocity == 0 && this.cueball.yVelocity == 0)
			{
				this.draw_robot_flag = true;
				this.robot_t = this.ROBOT_T_START;
			}
			
			// this.cueball.update_xVelocity(-this.shootPower * Math.sin(this.graphics_state.shootAngle));
			// this.cueball.update_yVelocity(-this.shootPower * Math.cos(this.graphics_state.shootAngle));
		});
		
		this.new_line();
		this.key_triggered_button("-", ["k"], () => {
			if (this.shootPower > this.MIN_POWER)
				this.shootPower -= 1;
		});
		
		const left_spacing = this.control_panel.appendChild(document.createElement("span"));
		left_spacing.style.margin = "15px";
        this.live_string(box => {box.textContent = "Speed: " + this.shootPower});
		const right_spacing = this.control_panel.appendChild(document.createElement("span"));
		right_spacing.style.margin = "15px";
		
        this.key_triggered_button("+", ["l"], () => {
			if (this.shootPower < this.MAX_POWER)
				this.shootPower += 1;
		});
		
		this.key_triggered_button("Stop balls", [";"], () => {
			this.cueball.update_xVelocity(0);
			this.cueball.update_yVelocity(0);
			this.targetball.update_xVelocity(0);
			this.targetball.update_yVelocity(0);
		});
		this.new_line();
		this.key_triggered_button("Follow ball", ["b"], () => {
			this.follow_ball = !this.follow_ball;
		});
		this.live_string(box => {box.textContent = (this.follow_ball ? "ON" : "OFF")});
		
		this.key_triggered_button("Shoot view", ["j"], () => {
			this.shoot_mode = !this.shoot_mode;
		});
		this.live_string(box => {box.textContent = (this.shoot_mode ? "Shoot view" : "Free view")});
		
		this.new_line();
		this.key_triggered_button("Bird's eye view", ["y"], () => {
			this.follow_ball = false;
			this.shoot_mode = false;
			this.context.globals.graphics_state.camera_transform = 
				Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0))
				.times(Mat4.translation(Vec.of(0, -150, 0)));
		});
    }

  draw_obstacles(deltaT, graphics_state, m, t) {
    for (var i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].update_obstacle_pos(t,deltaT);
      this.shapes.myObstacle.draw(graphics_state, m.times(Mat4.translation(Vec.of(this.obstacles[i].xCoord, this.poolTable.thickness*2, this.obstacles[i].yCoord))).times(Mat4.rotation(Math.PI/2,Vec.of(1,0,0))).times(Mat4.scale(Vec.of(3,3,1))), this.shape_materials.obstacle);
    }
  }

  draw_balls(deltaT, graphics_state, m, t) {
    for (var i = 0; i < this.balls.length; i++) {
      let currBall = this.balls[i];
      currBall.update_ball_pos(deltaT);
      if (this.poolTable.pocket_collision(currBall)) {
        this.pockethit_sound.play();

        if (i == 0) {
          currBall.xCoord = 0;
          currBall.yCoord = 0;
          currBall.update_xVelocity(0);
          currBall.update_yVelocity(0);
        }//cueball
        else {
          this.balls.splice(i, 1);
          i--;
          continue;
        }
      }
      currBall.collision_detection_wall(this.poolTable.widthTable, this.poolTable.lengthTable);
      for(var j = 0;j<this.obstacles.length;j++){
      	this.balls[i].collision_detection_obstacles(this.obstacles[j]);
      }
      for (var j = 0; j < this.balls.length; j++) {
        if (j != i) {
          this.balls[i].collision_detection_balls(this.balls[j]);
        }
      }
    }
    for (var i = 0; i < this.balls.length; i++) {
      for (var j = 0; j < this.balls.length; j++) {
        if (j != i) {
          let distance = Math.sqrt(Math.pow(this.balls[i].xCoord - this.balls[j].xCoord, 2) + Math.pow(this.balls[i].yCoord - this.balls[j].yCoord, 2));
          if (distance < 3.0) {
            let dx = this.balls[i].xCoord - this.balls[j].xCoord;
            let dy = this.balls[i].yCoord - this.balls[j].yCoord;
            this.balls[j].xCoord -= dx / 2;
            this.balls[j].yCoord -= dy / 2;
            this.balls[j].update_xVelocity(this.balls[i].xVelocity/4);
            this.balls[j].update_yVelocity(this.balls[i].yVelocity/4);
          }
        }

      }
      for(var k = 0; k< this.obstacles.length;k++){
      	let distance = Math.sqrt(Math.pow(this.balls[i].xCoord-this.obstacles[k].xCoord,2)+Math.pow(this.balls[i].yCoord-this.obstacles[k].yCoord,2));
      	if(distance < 3.5){
      		let dx = this.obstacles[k].xCoord-this.balls[i].xCoord;
      		let dy = this.obstacles[k].yCoord-this.balls[i].yCoord ;
      		this.balls[i].xCoord -= dx;
      		this.balls[i].yCoord -= dy;
      		this.balls[i].update_xVelocity(this.balls[i].xDir*(this.balls[i].xSpeed+Math.abs(this.obstacles[k].xVelocity)+2));
            this.balls[i].update_yVelocity(this.balls[i].yDir*(this.balls[i].ySpeed+Math.abs(this.obstacles[k].yVelocity)+2));
      	}
      }
    }
    for (var j = 0; j < this.balls.length; j++) {
      let currBall = this.balls[j];
      let M = m.times(Mat4.translation(Vec.of(currBall.xCoord, this.poolTable.thickness + currBall.radius, currBall.yCoord))).times(Mat4.scale(Vec.of(currBall.radius, currBall.radius, currBall.radius))).times(Mat4.rotation(currBall.rotationAngle, currBall.rotationVector));
      this.shapes.ball.draw(graphics_state, M, currBall.ballText || this.plastic.override({
        color: this.red
      }));
    }
  }
  display(graphics_state) {
    // Use the lights stored in this.lights.
    //Don't know how to work with this yet!!
    graphics_state.lights = this.lights;
    let dt = graphics_state.animation_delta_time;
    if (this.paused)
      dt = 0;
    // Find how much time has passed in seconds, and use that to place shapes.
    if (!this.paused)
	{
      this.t += dt / 1000;
	  if (this.draw_robot_flag)
		this.robot_t += dt / 1000;
	}
    const t = this.t;
    let m = Mat4.identity();

    if (this.cueball.xVelocity == 0 && this.cueball.yVelocity == 0)
	{	
		if (this.shoot_mode)
		{
			if (!this.ball_is_still)
			{
				this.ball_is_still = true;
				
				if (Math.sign(this.cam_xVel) >= 0)
				{
					this.graphics_state.shootAngle = -Math.acos(
						(Vec.of(0, 0, -1).dot(Vec.of(this.cam_xVel, 0, this.cam_yVel)))
							/ (1 * Vec.of(this.cam_xVel, 0, this.cam_yVel).norm()));
				}
				else
				{					
					this.graphics_state.shootAngle = Math.acos(
						(Vec.of(0, 0, -1).dot(Vec.of(this.cam_xVel, 0, this.cam_yVel)))
							/ (1 * Vec.of(this.cam_xVel, 0, this.cam_yVel).norm()));
				}
			}
			
			let eyeVec = Vec.of(
						this.cueball.xCoord + this.CAM_DIST * Math.sin(this.graphics_state.shootAngle),
						this.CAM_HEIGHT,
						this.cueball.yCoord + this.CAM_DIST * Math.cos(this.graphics_state.shootAngle));
			
			this.context.globals.graphics_state.camera_transform =
				Mat4.look_at(
					eyeVec,
					Vec.of(this.cueball.xCoord,
						this.poolTable.thickness + this.cueball.radius,
						this.cueball.yCoord),
					Vec.of(0, 1, 0));
		}
		
		if (this.draw_robot_flag && this.allow_launch)
		{
			this.draw_robot(graphics_state, m,
				this.cueball.xCoord,
				3.5,
				this.cueball.yCoord,
				this.graphics_state.shootAngle, this.poolTable.thickness, this.robot_t);
		}
		
		if (this.robot_t > this.ROBOT_T_CONTACT && this.allow_launch)
		{
			this.cueball.update_xVelocity(-this.shootPower * Math.sin(this.graphics_state.shootAngle));
			this.cueball.update_yVelocity(-this.shootPower * Math.cos(this.graphics_state.shootAngle));
			this.allow_launch = false;
		}
		
		// Shoot direction indicator
		if (this.allow_launch)
			this.draw_indic_cylind = true;
	}
	
	// Have camera follow ball if toggled on
	else
	{
		if (this.draw_robot_flag && this.robot_t > this.ROBOT_T_CONTACT)
		{
			this.draw_robot(graphics_state, m,
				this.cueball.xCoord,
				3.5,
				this.cueball.yCoord,
				this.graphics_state.shootAngle, this.poolTable.thickness, this.robot_t);
		}
		else //our robot did not hit the ball
		{
			this.draw_robot_flag = false;
			this.robot_t = this.ROBOT_T_INVALID;
			this.allow_launch = true;
		}
		this.draw_indic_cylind = false;
		if (this.follow_ball)
		{		
			if (this.ball_is_still)
			{
				this.cam_xVel = this.cueball.xVelocity;
				this.cam_yVel = this.cueball.yVelocity;
				this.velRatio = this.cueball.xVelocity / this.cueball.yVelocity;
				this.sign_cam_xVel = this.cueball.xDir;
				this.sign_cam_yVel = this.cueball.yDir;
				this.ball_is_still = false;
			}
			// Check if direction has changed
			else
			{
				if ((this.cam_xVel < this.epsilon && this.sign_cam_yVel != this.cueball.yDir) ||
					(this.cam_yVel < this.epsilon && this.sign_cam_xVel != this.cueball.xDir) ||
					(Math.abs(this.velRatio - (this.cueball.xVelocity/this.cueball.yVelocity)) > this.epsilon))
				{	
					this.start_timer = t;
					this.velRatio = this.cueball.xVelocity / this.cueball.yVelocity;
					this.sign_cam_xVel = this.cueball.xDir;
					this.sign_cam_yVel = this.cueball.yDir;
				}
				
			}
			if (this.start_timer >= 0 && t - this.start_timer > this.CHANGE_CAM_DELAY)
			{
				this.cam_xVel = this.cueball.xVelocity;
				this.cam_yVel = this.cueball.yVelocity;
			}

			let factor = 
				this.CAM_DIST / 
					Math.sqrt(Math.pow(this.cam_xVel, 2) + Math.pow(this.cam_yVel, 2));
			let eyeVec = Vec.of(
							this.cueball.xCoord - this.cam_xVel * factor,
							this.CAM_HEIGHT,
							this.cueball.yCoord - this.cam_yVel * factor);
			
			this.context.globals.graphics_state.camera_transform =
				Mat4.look_at(
					eyeVec,
					Vec.of(this.cueball.xCoord,
						this.poolTable.thickness + this.cueball.radius,
						this.cueball.yCoord),
					Vec.of(0, 1, 0));
		}
	}
	
	if (this.robot_t > this.ROBOT_T_END && this.draw_robot_flag)
	{
		this.draw_robot_flag = false;
		this.robot_t = this.ROBOT_T_INVALID;
		this.allow_launch = true;
	}
	
	this.poolTable.draw_table(graphics_state, m, this.shapes, this.shape_textures, this.plastic, this.shape_materials, this.pocketMat);
	this.draw_obstacles(dt/1000,graphics_state,m,Math.abs(Math.sin(t/4)));
    this.draw_balls(dt/1000, graphics_state, m, t);

	if (this.draw_indic_cylind)
	{
		// Shoot direction indicator
		this.shapes.cylinder.draw(
			graphics_state,
			m.times(Mat4.translation(Vec.of(this.cueball.xCoord,
											this.poolTable.thickness + this.cueball.radius,
											this.cueball.yCoord)))
			.times(Mat4.rotation(graphics_state.shootAngle, Vec.of(0, 1, 0)))
			.times(Mat4.translation(Vec.of(0, 0, -this.INDICATOR_LEN/2 - this.cueball.radius)))
			.times(Mat4.scale(Vec.of(this.INDICATOR_RAD, this.INDICATOR_RAD, this.INDICATOR_LEN/2))),
			this.plastic.override({color:this.white}));
	}
  }

  draw_robot(graphics_state, m, x_coord, y_coord, z_coord, angle, thickness, t)
	{
		let bodyLength = 1;
        let bodyWidth = 1;
        let bodyHeight = 2.5;
		
		//bodymatrix, move the entire robot
		//takes in the position
		let bodymatrix = m.times(Mat4.translation(Vec.of(x_coord, bodyHeight + thickness + y_coord, z_coord)))
					       .times(Mat4.rotation(angle, Vec.of(0, 1, 0)));

// 	    this.shapes.ball.draw(
//         graphics_state,
//         bodymatrix
//         .times(Mat4.translation(Vec.of(0, 0, -4)))
//         .times(Mat4.rotation(Math.PI / 2, Vec.of(0, 1, 0)))
//         .times(Mat4.scale(Vec.of(0.5, 0.5, 0.5)))
//         ,this.shape_materials.button || this.plastic);


		//draw the fire booster
		let radiusBooster = bodyHeight * 0.25;
		let heightBooster = bodyHeight;
        this.shapes.cylinder2.draw(
        graphics_state,
        bodymatrix
        .times(Mat4.translation(Vec.of(0, -1, radiusBooster + bodyLength)))
        .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
        .times(Mat4.rotation(-0.9, Vec.of(0, 0, 1)))
        .times(Mat4.scale(Vec.of(radiusBooster, radiusBooster, heightBooster)))
        ,this.shape_materials.cylinder2 || this.plastic);

        let boostermatrix = bodymatrix
        .times(Mat4.translation(Vec.of(0, -1, radiusBooster + bodyLength)))
        .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)));

        //The fire
        let radiusFire = 1;
        let heightFire = 3;
        this.shapes.cone.draw(
        graphics_state,
        boostermatrix
        .times(Mat4.scale(Vec.of(radiusBooster, radiusBooster, heightFire)))
        ,this.shape_materials.cone || this.plastic);

        //draw the star around 
        this.shapes.star.draw(graphics_state, 
		boostermatrix.times(Mat4.translation(Vec.of(1, 0, 2)))
		.times(Mat4.rotation(2 * this.t, Vec.of(1, 1, 1)))
		.times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
		.times(Mat4.scale(Vec.of(0.1, 0.1, 0.1)))
		,this.shape_textures || this.plastic.override({color:this.yellow}));

		this.shapes.star.draw(graphics_state, 
		boostermatrix.times(Mat4.translation(Vec.of(-0.8, 0, 1.5)))
		.times(Mat4.rotation(1.5 * -this.t, Vec.of(1, 1, 1)))
		.times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
		.times(Mat4.scale(Vec.of(0.08, 0.08, 0.08)))
		,this.shape_textures || this.plastic.override({color:this.red}));

        this.shapes.box.draw(
        graphics_state,
        bodymatrix
        .times(Mat4.translation(Vec.of(0, 0, 0)))
        .times(Mat4.scale(Vec.of(bodyLength, bodyHeight, bodyWidth)))
        ,this.shape_materials.box1 || this.plastic);

        //robot head
		let headSize = 1.3;
		this.shapes.box.draw(
        graphics_state,
        bodymatrix
        .times(Mat4.translation(Vec.of(0, bodyHeight + headSize, 0)))
        .times(Mat4.rotation(3 * Math.PI /2, Vec.of(0, 0, 1)))
        .times(Mat4.scale(Vec.of(headSize, headSize, headSize)))
        ,this.shape_materials.box || this.plastic);

        let headmatrix = bodymatrix
        .times(Mat4.translation(Vec.of(0, bodyHeight + headSize, 0)));

//         //robot eyes(both)
//          let eyeRadius = headSize / 4;
//          //how much it moves away from the center once put at the head
//          let eyeDistance = headSize / 2;
//          let eyeUpDist = headSize / 2;
//          let eyeOutDist = headSize;
//          this.shapes.ball.draw(
//          graphics_state,
//          headmatrix.times(Mat4.translation(Vec.of(eyeDistance, eyeUpDist, -eyeOutDist)))
//          .times(Mat4.scale(Vec.of(eyeRadius, eyeRadius, eyeRadius)))
//          ,this.shape_materials.eye || this.plastic);

//          this.shapes.ball.draw(
//          graphics_state,
//          headmatrix.times(Mat4.translation(Vec.of(-eyeDistance, eyeUpDist, -eyeOutDist)))
//          .times(Mat4.scale(Vec.of(eyeRadius, eyeRadius, eyeRadius)))
//          ,this.shape_materials.eye || this.plastic);

//          //nose of the robot
//          let tribottom = headSize / 2;
//          let flatHeight = headSize / 2;
//          let triHeight = headSize / 1.5;
//          let noseUpDist = headSize / 5;
//          let noseOutDist = headSize;
//          this.shapes.pyramid.draw(
//          graphics_state,
//          headmatrix.times(Mat4.translation(Vec.of(0, -noseUpDist, -noseOutDist)))
//          .times(Mat4.rotation(Math.PI/2, Vec.of(0, 1, 0)))
//          .times(Mat4.scale(Vec.of(flatHeight, triHeight, tribottom)))
//          ,this.shape_textures || this.plastic.override({color:this.blue}));

//          let widthMouth = headSize * 0.2;
//          let lengthMouth = headSize / 1.5;
//          let heightMouth = headSize * 0.2;
//          let mouthUpDist = headSize / 1.4;
//          let mouthOutDist = headSize;
//          this.shapes.box.draw(
//          graphics_state,
//          headmatrix.times(Mat4.translation(Vec.of(0, -mouthUpDist, -mouthOutDist)))
//          .times(Mat4.rotation(Math.PI/2, Vec.of(0, 1, 0)))
//          .times(Mat4.scale(Vec.of(widthMouth, heightMouth, lengthMouth)))
//          ,this.shape_textures || this.plastic.override({color:this.green}));

        //adjust the arm motion, left arm first
        //left first sphere, the parent
        //let armSphere = 0.4;
        let armSphere = 0.25 * bodyLength;
        let heightFirstSphere = bodyHeight - 0.3;
        this.shapes.ball.draw(
        graphics_state,
        bodymatrix.times(Mat4.translation(Vec.of(bodyLength + armSphere, heightFirstSphere, 0)))
        .times(Mat4.rotation(0.5 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.scale(Vec.of(armSphere, armSphere, armSphere)))
        ,this.shape_textures || this.plastic.override({color:this.blue}));

		//store matrix for the left first sphere
		let lstore = bodymatrix.times(Mat4.translation(Vec.of(bodyLength + armSphere, heightFirstSphere, 0)))
        .times(Mat4.rotation(0.5 * Math.sin(t), Vec.of(1, 0, 0)));

		
        //create the first rectangle of the arm, replace with variables 
		let armRecWidth = 0.14 * bodyHeight;
		let armRecLength = 0.15 * bodyHeight;
		let armHeight = 0.6 * bodyHeight;

		//left first rectangle of the arm, child of the left first sphere
		this.shapes.box.draw(
        graphics_state,
	    lstore
        .times(Mat4.translation(Vec.of(0.1, -armSphere, 0)))
        .times(Mat4.rotation(0.1 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(Math.PI/ 5, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)))
        .times(Mat4.scale(Vec.of(armRecWidth, armHeight, armRecLength)))
        ,this.shape_materials.arm || this.plastic);

		//store matrix for the left first rectangle
		let lstore2 = lstore
        .times(Mat4.translation(Vec.of(0.1, -armSphere, 0)))
        .times(Mat4.rotation(0.1 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(Math.PI/ 5, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)));

        //left second ball
		this.shapes.ball.draw(
        graphics_state,
        lstore2
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)))
        .times(Mat4.rotation(0.2 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.translation(Vec.of(0, -armSphere, 0)))
        .times(Mat4.scale(Vec.of(armSphere, armSphere, armSphere)))
        ,this.shape_textures || this.plastic.override({color:this.blue}));

        //store matrix for left second ball
        let lstore3 =  lstore2
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)))
        .times(Mat4.rotation(0.2 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.translation(Vec.of(0, -armSphere, 0)));

        //left side of second rectangle of the arm
		this.shapes.box.draw(
        graphics_state,
		lstore3
        .times(Mat4.translation(Vec.of(0, -armSphere - 0.1, 0)))
        .times(Mat4.rotation(0.4 * Math.abs(Math.sin(this.t)), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(-Math.PI/ 4, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(-0.25, -armHeight, 0)))
        .times(Mat4.scale(Vec.of(armRecWidth, armHeight, armRecLength)))
        ,this.shape_materials.arm || this.plastic);

        let lstore4 = lstore3.times(Mat4.translation(Vec.of(0, -armSphere - 0.1, 0)))
        .times(Mat4.rotation(0.4 * Math.abs(Math.sin(this.t)), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(-Math.PI/ 4, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(-0.25, -armHeight, 0)));

		let sizeHand = 0.2 * armHeight;

        this.shapes.hand.draw(
        graphics_state,
        lstore4
         .times(Mat4.translation(Vec.of(0, - armHeight - 2 * sizeHand, armRecWidth / 3)))
         //.times(Mat4.rotation(2 * Math.PI, Vec.of(1, 0, 0)))
         .times(Mat4.rotation(-3 * this.t, Vec.of(0, 1, 0)))
         .times(Mat4.scale(Vec.of(sizeHand, sizeHand, sizeHand)))
         ,this.shape_materials.hand || this.plastic);

        //Right arm here
        //right first sphere, the parent
        this.shapes.ball.draw(
        graphics_state,
        bodymatrix.times(Mat4.translation(Vec.of(-bodyLength - armSphere, heightFirstSphere, 0)))
        .times(Mat4.rotation(0.5 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.scale(Vec.of(armSphere, armSphere, armSphere)))
        ,this.shape_textures || this.plastic.override({color:this.blue}));

		//store matrix for the right first sphere
		let rstore = bodymatrix.times(Mat4.translation(Vec.of(-bodyLength - armSphere, heightFirstSphere, 0)))
        .times(Mat4.rotation(0.5 * Math.sin(t), Vec.of(1, 0, 0)));

		//right first rectangle of the arm, child of the left first sphere
		this.shapes.box.draw(
        graphics_state,
	    rstore
        .times(Mat4.translation(Vec.of(-0.1, -armSphere, 0)))
        .times(Mat4.rotation(0.1 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(-Math.PI/ 5, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)))
        .times(Mat4.scale(Vec.of(armRecWidth, armHeight, armRecLength)))
        ,this.shape_materials.arm || this.plastic);


		//store matrix for the right first rectangle
		let rstore2 = rstore
        .times(Mat4.translation(Vec.of(-0.1, -armSphere, 0)))
        .times(Mat4.rotation(0.1 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(-Math.PI/ 5, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)));

        //right second ball
		this.shapes.ball.draw(
        graphics_state,
        rstore2
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)))
        .times(Mat4.rotation(0.2 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.translation(Vec.of(0, -armSphere, 0)))
        .times(Mat4.scale(Vec.of(armSphere, armSphere, armSphere)))
        ,this.shape_textures || this.plastic.override({color:this.blue}));

        //store matrix for right second ball
        let rstore3 =  rstore2
        .times(Mat4.translation(Vec.of(0, -armHeight, 0)))
        .times(Mat4.rotation(0.2 * Math.sin(this.t), Vec.of(1, 0, 0)))
        .times(Mat4.translation(Vec.of(0, -armSphere, 0)));

        //right side second rectangle
		this.shapes.box.draw(
        graphics_state,
		rstore3
        .times(Mat4.translation(Vec.of(0, -armSphere - 0.1, 0)))
        .times(Mat4.rotation(0.4 * Math.abs(Math.sin(this.t)), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(Math.PI/ 4, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(0.25, -armHeight, -0.1)))
        .times(Mat4.scale(Vec.of(armRecWidth, armHeight, armRecLength)))
        ,this.shape_materials.arm || this.plastic);


        let rstore4 = rstore3
        .times(Mat4.translation(Vec.of(0, -armSphere - 0.1, 0)))
        .times(Mat4.rotation(0.4 * Math.abs(Math.sin(this.t)), Vec.of(1, 0, 0)))
        .times(Mat4.rotation(Math.PI/ 4, Vec.of(0, 0, 1)))
        .times(Mat4.translation(Vec.of(0.25, -armHeight, -0.1)));

        this.shapes.hand.draw(
        graphics_state,
        rstore4
         .times(Mat4.translation(Vec.of(0, - armHeight - 2 * sizeHand, armRecWidth / 3)))
         .times(Mat4.rotation(3 * this.t, Vec.of(0, 1, 0)))
         .times(Mat4.scale(Vec.of(sizeHand, sizeHand, sizeHand)))
         ,this.shape_materials.hand || this.plastic);
 
	}
}

window.Assignment_Two_Skeleton = window.classes.Assignment_Two_Skeleton = Assignment_Two_Skeleton;
