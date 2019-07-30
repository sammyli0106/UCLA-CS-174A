class Assignment_One_Scene extends Scene_Component {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    constructor(context, control_box) {
        super(context, control_box);

        // First, include a secondary Scene that provides movement controls:
        if(!context.globals.has_controls)
            context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        // Locate the camera here (inverted matrix).
        const r = context.width / context.height;
        context.globals.graphics_state.camera_transform = Mat4.translation([0, 0, -35]);
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
        // design.  Once you've told the GPU what the design of a cube is,
        // it would be redundant to tell it again.  You should just re-use
        // the one called "box" more than once in display() to draw
        // multiple cubes.  Don't define more than one blueprint for the
        // same thing here.
        const shapes = {
            'box': new Cube(),
            'ball': new Subdivision_Sphere(4),
            'prism': new TriangularPrism()
        }
        this.submit_shapes(context, shapes);

        // Make some Material objects available to you:
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
            ambient: .4,
            diffusivity: .4
        });
        this.plastic = this.clay.override({
            specularity: .6
        });
        
        this.lights = [new Light(Vec.of(10, 10, 20, 1), Color.of(1, .4, 1, 1), 100000)];

        this.blue = Color.of(0, 0, 1, 1);
        this.yellow = Color.of(1, 1, 0, 1);
        this.green = Color.of(0, 1, 0, 1);
        this.pink = Color.of(1, 0, 1, 1);
        this.red = Color.of(1, 0, 0, 1);

        this.t = 0;
    }


    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    make_control_panel() {
        this.key_triggered_button("Hover in Place", ["m"], () => {
            this.hover = !this.hover;
        });
        this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
    }


    display(graphics_state) {
        // Use the lights stored in this.lights.
        graphics_state.lights = this.lights;

        // Variable m will be a temporary matrix that helps us draw most shapes.
        // It starts over as the identity every single frame - coordinate axes at the origin.
        let m = Mat4.identity();
                
        // Find how much time has passed in seconds, and use that to place shapes.
        if (!this.paused)
            this.t += graphics_state.animation_delta_time / 1000;
        const t = this.t;

        //modify m with a transformation matrix to translate the butterfly out to 
        //a circle with radius and rotate along the tangent, with t varies 
        //to fly around the origin
        //perform it when the variable "this.hover" is false
        if (!this.hover)
        {

               m = m
                .times(Mat4.rotation(t, Vec.of(0, 1, 0))) 
                //.times(Mat4.rotation(80 * Math.PI / 180, Vec.of(0, 1, 0)))
                .times(Mat4.translation(Vec.of(0, 8 * Math.sin(1.5 * -t), 0)))
                .times(Mat4.translation(Vec.of(-30, 0, 0)));
                
        }
            
        //Draw a horiozontally stretched box in front of the camera as the butterfly thorax
       //Use the box as draw shapes 
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0, 0, 0))).times(Mat4.scale(Vec.of(1, 1, 6))),
            this.clay.override({color: this.yellow}));

        //On the top side, attach balls for the head first, ball surfaces and box surfaces barely touch, volume not intersect
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0, 0, 7.505))).times(Mat4.scale(Vec.of(1.5, 1.5, 1.5))),
            this.plastic.override({color: this.blue})); 

        //the tail of the butterfly
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.rotation(Math.PI, Vec.of(0, 0, 1)))
            .times(Mat4.translation(Vec.of(0, 0, -8.96)))
            .times(Mat4.scale(Vec.of(1, 1, 3))),
            this.plastic.override({color: this.blue})); 

         let leftleg1 = m.times(Mat4.translation(Vec.of(-1, -1, 3)));
         this.draw_leg(graphics_state, leftleg1, -1)

         let leftleg2 = m.times(Mat4.translation(Vec.of(-1, -1, 0)));
         this.draw_leg(graphics_state, leftleg2, -1)

         let leftleg3 = m.times(Mat4.translation(Vec.of(-1, -1, -3)));
         this.draw_leg(graphics_state, leftleg3, -1)

         let rightleg1 = m.times(Mat4.translation(Vec.of(1, -1, 3)));
         this.draw_leg(graphics_state, rightleg1, 1)

         let rightleg2 = m.times(Mat4.translation(Vec.of(1, -1, 0)));
         this.draw_leg(graphics_state, rightleg2, 1)

         let rightleg3 = m.times(Mat4.translation(Vec.of(1, -1, -3)));
         this.draw_leg(graphics_state, rightleg3, 1)
         

         //draw both of the wings
         this.draw_wing_box1(graphics_state, m)
         this.draw_wing_prism(graphics_state, m)
         this.draw_wing_box2(graphics_state, m)

        //draw the antenna
        this.draw_antennae(graphics_state, m) 
            
    }

    draw_antennae(graphics_state, m)
    {
        let position = 320;
        
        for(var j = 0; j < 2; ++j)
        {
            //declare a local variable as transformation matrix for accumulating the transformations
            let middle = m.times(Mat4.translation(Vec.of(0, 0, 7.5)))   
                .times(Mat4.rotation(position * Math.PI / 180, Vec.of(0, 1, 0)))
                .times(Mat4.rotation(320 * Math.PI / 180, Vec.of(0, 0, 1)))
                .times(Mat4.translation(Vec.of(0, 1.5 + 0.25, 0)));

            //try draw the antenna base first
            this.shapes.box.draw(
                graphics_state,
                middle
                .times(Mat4.scale(Vec.of(0.25, 0.25, 0.25))),
                this.clay.override({color: this.yellow}));

            //declare a angle variable
            let angle = 355;

            //create a for loop for drawing the rest of the antenna
            for(var i = 0; i < 8; ++i)
            {
                middle = middle.times(Mat4.translation(Vec.of(0.25, 0.25, 0)))
                         .times(Mat4.rotation(- Math.abs(0.15 * Math.sin(0.5 * this.t)), Vec.of(0, 0, 1)))
                         .times(Mat4.translation(Vec.of(-0.25, 0.25, 0)));

                this.shapes.box.draw(
                graphics_state,
                middle
                .times(Mat4.scale(Vec.of(0.25, 0.25, 0.25))),
                this.clay.override({color: this.yellow}));

                angle--;
            }

            //attach the ball at the tip of the antenna
           this.shapes.ball.draw(
                graphics_state,
                middle
                .times(Mat4.translation(Vec.of(0, 0.65, 0)))
                .times(Mat4.scale(Vec.of(0.4, 0.4, 0.4))),
                this.plastic.override({color: this.green}));

                //minus 100 degrees to adjust the positions
                position -= 100;
        }
                
    }

    draw_leg(graphics_state, m , sign)
    {
        //sign for left is -1(negative)
        //sign for right is 1(positive)

        m = m.times(Mat4.rotation(sign * 0.3 * Math.abs(Math.sin(1.5 * this.t)), Vec.of(0, 0, 1)))
            .times(Mat4.translation(Vec.of(sign * 0.5, -2, 0)));

        //try draw the first leg box
        this.shapes.box.draw(
            graphics_state,
            m
            .times(Mat4.scale(Vec.of(0.5, 2, 0.5))),
            this.clay.override({color: this.blue}));

        //second leg box based on first leg box(ok)
        this.shapes.box.draw(
            graphics_state,
            m
            //added the next new transformation(same)
            .times(Mat4.translation(Vec.of(-sign * 0.5, -2, 0)))
            .times(Mat4.rotation(-sign * 0.4 * Math.abs(Math.sin(1.5 * this.t)), Vec.of(0, 0, 1)))
            .times(Mat4.translation(Vec.of(sign * 0.5, -2, 0)))
            .times(Mat4.scale(Vec.of(0.5, 2, 0.5))),
            this.clay.override({color: this.yellow}));  

    }

    draw_wing_prism(graphics_state, m)
    {
        let sign = 1;
        let factor = 3;
        for (var i = 0; i < 2; ++i)
        {
         this.shapes.prism.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(1 * sign, 1, 0))) //differ in sign
            .times(Mat4.rotation(0.5 * Math.sin(1.5 * this.t) * sign, Vec.of(0, 0, 1)))
            .times(Mat4.translation(Vec.of(6 * sign, 0.125, 0)))  //differ in sign
            .times(Mat4.rotation(factor * Math.PI / 4, Vec.of(0, 1, 0)))  //differ in factor
            .times(Mat4.rotation(3 * Math.PI / 2, Vec.of(1, 0, 0)))
            .times(Mat4.scale(Vec.of(8.48528, 8.48528, 0.125))),  
            this.plastic.override({color: this.blue}));
            
            sign = -1;
            factor = 7;
                
        }            
    }
    draw_wing_box1(graphics_state, m)
    {
        
        let sign = 1;
        for (var i = 0; i < 2; ++i)
        {
            this.shapes.box.draw(
            graphics_state,
            m
            .times(Mat4.translation(Vec.of(1 * sign, 1, 6))) //sign differ here
            .times(Mat4.rotation(0.5 * Math.sin(1.5 * this.t) * sign, Vec.of(0, 0, 1)))
            .times(Mat4.translation(Vec.of(7.071 * sign, 0.125, 0))) //sign differs here
            .times(Mat4.rotation(3 * Math.PI / 4, Vec.of(0, 1, 0)))
            .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
            .times(Mat4.scale(Vec.of(5, 5, 0.125))),            
            this.clay.override({color: this.yellow}));

            sign = -1;
        }

    }
    draw_wing_box2(graphics_state, m)
    {
        let sign = 1;
        for (var i = 0; i < 2; ++i)
        {
        this.shapes.box.draw(
            graphics_state,
            m
            .times(Mat4.translation(Vec.of(1 * sign, 1, -6)))  
            .times(Mat4.rotation(0.5 * Math.sin(1.5 * this.t) * sign, Vec.of(0, 0, 1)))
            .times(Mat4.translation(Vec.of(6 * sign, 0.125, 0))) 
            .times(Mat4.rotation(3 * Math.PI / 4, Vec.of(0, 1, 0)))
            .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
            .times(Mat4.scale(Vec.of(4.2426, 4.2426, 0.125))),       
            this.clay.override({color: this.red}));
            
         sign = -1;
        }     
    }

}

window.Assignment_One_Scene = window.classes.Assignment_One_Scene = Assignment_One_Scene;