class Pool_Table{
	constructor(){
        this.widthTable = 35;
        this.lengthTable = 55;
        this.thickness = 2;
        this.rightTable = 20;
        this.upTable = 1;

        this.widthLeg = 1;
        this.lengthLeg = 1;
        this.heightLeg = 15;
	}
	pocket_collision(ball){
		if(Math.sqrt((ball.xCoord-this.widthTable)*(ball.xCoord-this.widthTable)+(ball.yCoord*ball.yCoord))<2)
			return true;
		if(Math.sqrt((ball.xCoord+this.widthTable)*(ball.xCoord+this.widthTable)+(ball.yCoord*ball.yCoord))<2)
			return true;	
		if(Math.sqrt((ball.xCoord-this.widthTable+this.thickness)*(ball.xCoord-this.widthTable+this.thickness)+((ball.yCoord-this.lengthTable+this.thickness)*(ball.yCoord-this.lengthTable+this.thickness)))<1.5)
			return true;
		if(Math.sqrt((ball.xCoord+this.widthTable-this.thickness)*(ball.xCoord+this.widthTable-this.thickness)+((ball.yCoord-this.lengthTable+this.thickness)*(ball.yCoord-this.lengthTable+this.thickness)))<1.5)
			return true;
		if(Math.sqrt((ball.xCoord-this.widthTable+this.thickness)*(ball.xCoord-this.widthTable+this.thickness)+((ball.yCoord+this.lengthTable-this.thickness)*(ball.yCoord+this.lengthTable-this.thickness)))<1.5)
			return true;
		if(Math.sqrt((ball.xCoord+this.widthTable-this.thickness)*(ball.xCoord+this.widthTable-this.thickness)+((ball.yCoord+this.lengthTable-this.thickness)*(ball.yCoord+this.lengthTable-this.thickness)))<1.5)
			return true;
	}
	draw_table(graphics_state,m,shapes,shape_textures,texture,shape_materials,pocketMat){
		//draw table top
		shapes.box.draw(
        graphics_state,
         m.times(Mat4.scale(Vec.of(this.widthTable,this.thickness,this.lengthTable)))
         ,shape_materials.tabletop || texture);

        let sign1 = 1;
        let sign2 = 1;
        //draw legs
        for (var i = 0; i < 4; i++)
         {
            if (i == 1)
           {
               sign2 = -1;
           }
           if (i == 2)
           {
               sign1 = -1;
           }
           if (i == 3)
           {
            sign2 = 1;
           } 
           shapes.box.draw(
           graphics_state,
           m.times(Mat4.translation(Vec.of(sign1 * (this.widthTable - this.widthLeg), -(this.heightLeg + this.thickness), sign2 * (this.lengthTable - this.lengthLeg))))
           .times(Mat4.scale(Vec.of(this.widthLeg*2, this.heightLeg, this.lengthLeg)))
           ,shape_materials.tablelegs || texture);

         }
         //draw bumpers
         let lengthBumpers = m.times(Mat4.scale(Vec.of(this.thickness,this.thickness,this.lengthTable)));
         let widthBumpers = m.times(Mat4.scale(Vec.of(this.widthTable,this.thickness,this.thickness)));
         shapes.box.draw(graphics_state,m.times(Mat4.translation(Vec.of(this.widthTable+this.thickness,this.thickness,0))).times(Mat4.scale(Vec.of(this.thickness,this.thickness*2,this.lengthTable+2*this.thickness))),shape_materials.tablelegs||texture);
         shapes.box.draw(graphics_state,m.times(Mat4.translation(Vec.of(-1*(this.widthTable+this.thickness),this.thickness,0))).times(Mat4.scale(Vec.of(this.thickness,this.thickness*2,this.lengthTable+2*this.thickness))),shape_materials.tablelegs||texture);
         shapes.box.draw(graphics_state,m.times(Mat4.translation(Vec.of(0,this.thickness,this.lengthTable+this.thickness))).times(Mat4.scale(Vec.of(this.widthTable,this.thickness*2,this.thickness))),shape_materials.tablelegs||texture);
         shapes.box.draw(graphics_state,m.times(Mat4.translation(Vec.of(0,this.thickness,-1*(this.lengthTable+this.thickness)))).times(Mat4.scale(Vec.of(this.widthTable,this.thickness*2,this.thickness))),shape_materials.tablelegs||texture);

         //try to draw the pocket
         shapes.pocket.draw(
        graphics_state,
         m.times(Mat4.translation(Vec.of(this.widthTable - 0.01, this.thickness, 0))) 
         .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
         .times(Mat4.rotation(3 * Math.PI / 2, Vec.of(0, 0, 1))) 
         .times(Mat4.scale(Vec.of(3, 3, 3)))
         ,shape_textures || pocketMat);

         shapes.pocket.draw(
        graphics_state,
         m.times(Mat4.translation(Vec.of(-this.widthTable + 0.01, this.thickness, 0))) 
         .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
         .times(Mat4.rotation(-3 * Math.PI / 2, Vec.of(0, 0, 1))) 
         .times(Mat4.scale(Vec.of(3, 3, 3)))
         ,shape_textures || pocketMat);
		
		//change dimension of the wall, affect the plus 1, outward direction of
		//the semi-circle
         shapes.pocket.draw(
        graphics_state,
         m.times(Mat4.translation(Vec.of(-this.widthTable + this.thickness, this.thickness, -this.lengthTable + this.thickness))) 
         .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
         .times(Mat4.rotation(3 * Math.PI / 4, Vec.of(0, 0, 1)))  
         .times(Mat4.scale(Vec.of(3, 3, 3)))
         ,shape_textures || pocketMat);

         shapes.pocket.draw(
        graphics_state,
         m.times(Mat4.translation(Vec.of(this.widthTable - this.thickness, this.thickness, this.lengthTable - this.thickness))) 
         .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
         .times(Mat4.rotation(7 * Math.PI / 4, Vec.of(0, 0, 1)))  
         .times(Mat4.scale(Vec.of(3, 3, 3)))
         ,shape_textures || pocketMat);

         shapes.pocket.draw(
        graphics_state,
         m.times(Mat4.translation(Vec.of(this.widthTable - this.thickness, this.thickness, -this.lengthTable + this.thickness))) 
         .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
         .times(Mat4.rotation(-3 * Math.PI / 4, Vec.of(0, 0, 1)))  
         .times(Mat4.scale(Vec.of(3, 3, 3)))
         ,shape_textures || pocketMat);

         shapes.pocket.draw(
        graphics_state,
         m.times(Mat4.translation(Vec.of(-this.widthTable + this.thickness, this.thickness, this.lengthTable - this.thickness))) 
         .times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))
         .times(Mat4.rotation(-7 * Math.PI / 4, Vec.of(0, 0, 1)))  
         .times(Mat4.scale(Vec.of(3, 3, 3)))
         ,shape_textures || pocketMat);
	}

}