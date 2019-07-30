window.Hexagon = window.classes.Hexagon = class Hexagon extends Shape {
    constructor() {
        
super("positions", "normals", "texture_coords");
//         this.positions.push(...Vec.cast([1, 6, 0], [4, 2, 0], [8, 2, 0], [11, 6, 0], [8, 9.6, 0], [4, 9.6, 0]));
//         this.normals.push(...Vec.cast([ 0,  0, 1], [0,  0, 1], [ 0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1] ));
//         this.texture_coords.push(...Vec.cast([ 0, 0],     [1, 0],     [ 0, 1],    [1, 1]   ));
//         //this.indices.push(0, 1, 5, 1, 5, 2, 5, 2, 4, 4, 2, 3);
//         this.indices.push(0, 1, 5);

        this.positions.push(...Vec.cast([2, 3, 0], [4, 0, 0], [2, -3, 0], [-2, -3, 0], [-4, 0, 0], [-2, 3, 0],
                                        [2, 3, -4], [4, 0, -4], [2, -3, -4], [-2, -3, -4], [-4, 0, -4], [-2, 3, -4],
                                        //top face
                                        [-2, 3, 0], [2, 3, 0], [-2, 3, -4], [2, 3, -4],
                                        //top left face
                                        [-4, 0, 0], [-2, 3, 0], [-4, 0, -4], [-2, 3, -4],
                                        //top right face
                                        [2, 3, 0], [4, 0, 0], [2, 3, -4], [4, 0, -4],
                                        //bottom left face
                                        [-4, 0, 0], [-2, -3, 0], [-4, 0, -4], [-2, -3, -4],
                                        //bottom right face
                                        [4, 0, 0], [2, -3, 0], [4, 0, -4], [2, -3, -4],
                                        //bottom face
                                        [-2, -3, 0], [2, -3, 0], [-2, -3, -4], [2, -3, -4]
                                        ));
        let v1 = Vec.of(0, 1, 0);
        let v2 = Vec.of(0, 0, 1);
        let v3 = Vec.of(12, -8, 0);
        let v4 = v1.plus(v2).plus(v3).normalized();

        let v5 = Vec.of(-12, 8, 0);
        let v6 = v5.plus(v3).normalized();

        this.normals.push(...Vec.cast(v4, v4, v4, v4, v4, v4,
                                      [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1],
                                      v4, v4, v4, v4,
                                      [12, -8, 0], [12, -8, 0], [12, -8, 0], [12, -8, 0],
                                      //v4, v4, v4, v4,
                                      //v4, v4, v4, v4,
                                      [-12, -8, 0], [-12, -8, 0], [-12, -8, 0], [-12, -8, 0],
                                      [-12, 8, 0], [-12, 8, 0], [-12, 8, 0], [-12, 8, 0],
                                      [-12, 8, 0], [-12, 8, 0], [-12, 8, 0], [-12, 8, 0],
                                      [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0]));

           //no flat shaded effect
//         this.normals.push(...Vec.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1],
//                                       [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1],
//                                       [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
//                                       [12, -8, 0], [12, -8, 0], [12, -8, 0], [12, -8, 0],
//                                       [-12, -8, 0], [-12, -8, 0], [-12, -8, 0], [-12, -8, 0],
//                                       //[12, 8, 0], [12, 8, 0], [12, 8, 0], [12, 8, 0],
//                                       [-12, 8, 0], [-12, 8, 0], [-12, 8, 0], [-12, 8, 0],
//                                       [12, 8, 0], [12, 8, 0], [12, 8, 0], [12, 8, 0],
//                                       [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0]));

        this.texture_coords.push(...Vec.cast([0.75, 1], [1, 0.5], [0.75, 0], [0.25, 0], [0, 0.5], [0.25, 1],
                                        [0.75, 1], [1, 0.5], [0.75, 0], [0.25, 0], [0, 0.5], [0.25, 1],
                                        [0.25, 1], [0.75, 1], [0.25, 1], [0.75, 1],
                                        [0, 0.5], [0.25, 1], [0, 0.5], [0.25, 1],
                                        [0.75, 1], [1, 0.5], [0.75, 1], [1, 0.5],
                                        [0, 0.5], [0.25, 0], [0, 0.5], [0.25, 0],
                                        [1, 0.5], [0.75, 0], [1, 0.5], [0.75, 0],
                                        [0.25, 0], [0.75, 0], [0.25, 0], [0.75, 0]));
                                        
        this.indices.push(
                          //front hexagon face
                          0, 1, 2,
                          0, 2, 3,
                          0, 3, 5,
                          3, 4, 5,      //stop right here would be just flat hexagon
                          //back hexagon face
                          6, 7, 8,
                          6, 8, 9,
                          6, 11, 9,
                          10, 11, 9,
                          //top side
                          12, 13, 14,
                          13, 14, 15,
                          //top left side
                          16, 17, 18,
                          17, 18, 19,
                          //top right side
                          20, 21, 22,
                          21, 22, 23,
                          //bottom left side
                          24, 25, 26,
                          25, 26, 27,
                          //bottom right side
                          28, 29, 30,
                          29, 30, 31,
                          //bottom side
                          32, 33, 34,
                          33, 34, 35

                          );
    }
}

window.Pentagon = window.classes.Pentagon = class Pentagon extends Shape{
    constructor() {
        super("positions", "normals", "texture_coords");
        this.positions.push(...Vec.cast([2, 3, 1], [-2, 3, 1], [-3, 0, 1], [0, -3, 1], [3, 0, 1],
                                        [2, 3, -1], [-2, 3, -1], [-3, 0, -1],[0, -3, -1], [3, 0, -1],
                                        //top face
                                        [2, 3, 1], [-2, 3, 1], [2, 3, -1], [-2, 3, -1],
                                        //top left face
                                        [-3, 0, 1], [-2, 3, 1], [-3, 0, -1], [-2, 3, -1],
                                        //top right face
                                        [2, 3, 1], [3, 0, 1], [2, 3, -1], [3, 0, -1],
                                        //bottom left face
                                        [-3, 0, 1], [0, -3, 1], [-3, 0, -1], [0, -3, -1],
                                        //bottom right face
                                        [3, 0, 1], [0, -3, 1], [3, 0, -1], [0, -3, -1] 
                                        ));

        this.normals.push(...Vec.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1],
                                      [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1],
                                      [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
                                      [6, -2, 0], [6, -2, 0], [6, -2, 0], [6, -2, 0],
                                      [6, 2, 0], [6, 2, 0], [6, 2, 0], [6, 2, 0],
                                      [-6, -6, 0], [-6, -6, 0], [-6, -6, 0], [-6, -6, 0],
                                      [-6, 6, 0], [-6, 6, 0], [-6, 6, 0], [-6, 6, 0]));

        this.texture_coords.push(...Vec.cast([0.6428571429, 0.64], [0.3571428571, 0.64], [0.2857142857, 0.4], [0.5, 0.16], [0.7142857143, 0.4],
                                     [0.6428571429, 0.64], [0.3571428571, 0.64], [0.2857142857, 0.4], [0.5, 0.16], [0.7142857143, 0.4],
                                     [0.6428571429, 0.64], [0.3571428571, 0.64], [0.6428571429, 0.64], [0.3571428571, 0.64],
                                     [0.2857142857, 0.4], [0.3571428571, 0.64], [0.2857142857, 0.4], [0.3571428571, 0.64],
                                     [0.6428571429, 0.64], [0.7142857143, 0.4], [0.6428571429, 0.64], [0.7142857143, 0.4],
                                     [0.2857142857, 0.4], [0.5, 0.16], [0.2857142857, 0.4], [0.5, 0.16],
                                     [0.7142857143, 0.4], [0.5, 0.16], [0.7142857143, 0.4], [0.5, 0.16]));
            
        this.indices.push(
                          //front pentagon face
                            0, 3, 4,
                            0, 1, 3,
                            1, 2, 3,
                            //back pentagon face
                            5, 8, 9,
                            5, 6, 8,
                            6, 7, 8,
                            //top front face
                            10, 12, 13,
                            10, 11, 13,
                            //top left face
                            14, 15, 16,
                            15, 16, 17,
                            //top right face
                            18, 19, 20,
                            19, 20, 21,
                            //bottom left face
                            22, 23, 24,
                            23, 24, 25,
                            //bottom right face
                            26, 27, 28,
                            27, 28, 29

                            );
    }
}

window.Star = window.classes.Star = class Star extends Shape{
    constructor() {
        super("positions", "normals", "texture_coords");
        this.positions.push(...Vec.cast([0, 7.5, 0], [-7, 3, 0], [-5, -5, 0], [5, -5, 0], [7, 3, 0],
                                        [2, 3, -1], [-2, 3, -1], [-3, 0, -1], [0, -3, -1], [3, 0, -1],
                                        [2, 3, 1], [-2, 3, 1], [-3, 0, 1], [0, -3, 1], [3, 0, 1]));

 let v1 = Vec.of(0, 0, -1);
 let v2 = Vec.of(0, 0, 1);
 let v3 = v1.plus(v2).normalized();

//  this.normals.push(...Vec.cast(
//         [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], 
//         [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], 
//         [0, 0, 1], [0,  0, 1], [ 0, 0, 1], [0, 0, 1], [0, 0, 1]));

this.normals.push(...Vec.cast(
        [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], 
        [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], 
        [0, 0, 1], [0, 0, 1], [0,  0, 1], [ 0, 0, 1], [0, 0, 1], [0, 0, 1]));

  //calculate using formula, but data from spreadsheets
  this.texture_coords.push(...Vec.cast([0.5, 1], [0, 0.64], [0.1428571429, 0], [0.8571428571, 0], [1, 0.64],
                                     [0.6428571429, 0.64], [0.3571428571, 0.64], [0.2857142857, 0.4], [0.5, 0.16], [0.7142857143, 0.4],
                                     [0.6428571429, 0.64], [0.3571428571, 0.64], [0.2857142857, 0.4], [0.5, 0.16], [0.7142857143, 0.4]));

         //push in the two pentagon first
        this.indices.push(
                            //top vertex
                            0, 5, 6,
                            0, 10, 11,
                            0, 5, 10,
                            0, 6, 11,
                            //top right vertex
                            4, 5, 9,
                            4, 10, 14,
                            5, 4, 10,
                            9, 4, 14,
                            //top left vertex
                            1, 6, 7,
                            1, 11, 12,
                            1, 6, 11,
                            1, 7, 12,
                            //bottom left vertex
                            2, 7, 8,
                            2, 12, 13,
                            2, 7, 12,
                            2, 8, 13,
                            //bottom right vertex
                            3, 8, 9,
                            3, 13, 14,
                            3, 9, 14,
                            3, 8, 13,
                            //pentagon bottom triangles(front and back)
                            7, 8, 9,
                            12, 13, 14,
                           //pentagon top (bottom) half triangles(front and back)
                            6, 7, 9,
                            11, 12, 14,
                           //pentagon top (top) half traiangles (front and back)
                            5, 6, 9,
                            10, 11, 14
                          );
        
    }
}

window.Square = window.classes.Square = class Square extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");
        this.positions.push(     ...Vec.cast([-1, -1, 0], [1, -1, 0], [-1, 1, 0], [1, 1, 0] ));
        this.normals.push(       ...Vec.cast([ 0,  0, 1], [0,  0, 1], [ 0, 0, 1], [0, 0, 1] ));
        this.texture_coords.push(...Vec.cast([ 0, 0],     [1, 0],     [ 0, 1],    [1, 1]   ));
        this.indices.push(0, 1, 2, 1, 3, 2);
    }
}

window.Circle = window.classes.Circle = class Circle extends Shape {
    constructor(sections) {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([0, 0, 0], [1, 0, 0]));
        this.normals.push(...Vec.cast(  [0, 0, 1], [0, 0, 1]));
        this.texture_coords.push(...Vec.cast([0.5, 0.5], [1, 0.5]));

        for (let i = 0; i < sections; ++i) {
            const angle = 2 * Math.PI * (i + 1) / sections,
                v = Vec.of(Math.cos(angle), Math.sin(angle)),
                id = i + 2;

            this.positions.push(...Vec.cast([v[0], v[1], 0]));
            this.normals.push(...Vec.cast(  [0,    0,    1]));
            this.texture_coords.push(...Vec.cast([(v[0] + 1) / 2, (v[1] + 1) / 2]));
            this.indices.push(
                0, id - 1, id);
        }
    }
}

window.Hand = window.classes.Hand = class Hand extends Shape {
    constructor(sections)
    {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast(
        //front face
        [2, 2, 0], [-2, 2, 0], [-4, -2, 0], [-2, -2, 0], [-1, 0, 0], [1, 0, 0], [2, -2, 0], [4, -2, 0],
        //back face
        [2, 2, -1], [-2, 2, -1], [-4, -2, -1], [-2, -2, -1], [-1, 0, -1], [1, 0, -1], [2, -2, -1], [4, -2, -1],
        //top face
        [2, 2, 0], [-2, 2, 0], [2, 2, -1], [-2, 2, -1],
        //top left face
        [-2, 2, 0], [-4, -2, 0], [-2, 2, -1], [-4, -2, -1],
        //top right face
        [2, 2, 0], [4, -2, 0], [2, 2, -1], [4, -2, -1],
        //bottom left face
        [-4, -2, 0], [-2, -2, 0], [-4, -2, -1], [-2, -2, -1],
        //bottom right face
        [2, -2, 0], [4, -2, 0], [2, -2, -1], [4, -2, -1],
        //inner top face
        [-1, 0, 0], [1, 0, 0], [-1, 0, -1], [1, 0, -1],
        //inner left face
        [-2, -2, 0], [-2, -2, -1], [-1, 0, 0], [-1, 0, -1], 
        //inner right face
        [2, -2, 0], [2, -2, -1], [1, 0, 0], [1, 0, -1]
        ));

        this.texture_coords.push(...Vec.cast(
        //front face
        [0.75, 1], [0.25, 1], [0, 0], [0.25, 0], [0.375, 0.5], [0.625, 0.5], [0.75, 0], [0.625, 0],
        //back face
        [0.75, 1], [0.25, 1], [0, 0], [0.25, 0], [0.375, 0.5], [0.625, 0.5], [0.75, 0], [0.625, 0],
        //top face
        [0.75, 1], [0.25, 1], [0.75, 1], [0.25, 1],
        //top left face
        [0.25, 1], [0, 0], [0.25, 1], [0, 0],
        //top right face
        [0.75, 1], [0.625, 0], [0.75, 1], [0.625, 0],
        //bottom left face
        [0, 0], [0.25, 0], [0, 0], [0.25, 0],
        //bottom right face
        [0.75, 0], [0.625, 0], [0.75, 0], [0.625, 0],
        //inner top face
        [0.375, 0.5], [0.625, 0.5], [0.375, 0.5], [0.625, 0.5],
        //inner left face
        [0.25, 0], [0.25, 0], [0.375, 0.5], [0.375, 0.5], 
        //inner right face
        [0.75, 0], [0.75, 0], [0.625, 0.5], [0.625, 0.5]
        ));

        this.normals.push(...Vec.cast(
        //front face
        [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1],
        //back face
        [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1],
        //top face
        [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
        //top left face
        [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
        //top right face
        [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
        //bottom left face
        [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0],
        //bottom right face
        [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0],
        //inner top face
        [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
        //inner left face
        [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
        //inner right face
        [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0]

        ));
    
        this.indices.push(
        //front face
        0, 1, 5,
        1, 4, 5,
        1, 3, 4,
        1, 2, 3,
        0, 5, 6,
        0, 6, 7,
        //back face
        8, 9, 13,
        9, 12, 13,
        9, 11, 12,
        9, 10, 11,
        8, 13, 14,
        8, 14, 15,
        //top face
        16, 17, 19,
        16, 18, 19,

        //top left face
        20, 21, 22,
        21, 22, 23,
        //top right face
        24, 25, 26,
        25, 26, 27,
//         0, 7, 8,
//         7, 8, 15,
        //bottom left face
         28, 29, 30,
         29, 30, 31, 
//         2, 3, 10,
//         3, 10, 11,
//         //bottom right face
//         6, 7, 14,
//         7, 14, 15,
        //inner top face
        //4, 5, 12,
        36, 37, 38,
        37, 38, 39,
        //5, 12, 13,
         32, 33, 34,
         33, 34, 35,
//         //inner left face
//         3, 4, 12,
//         3, 11, 12,
            40, 41, 42,
            41, 42, 43, 
//         //inner right face
//         5, 6, 13,
//         6, 13, 14
           44, 45, 46, 
           45, 46, 47

        );

    }
}

window.Cube = window.classes.Cube = class Cube extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast(
            [-1,  1, -1], [-1, -1, -1], [ 1,  1, -1], [ 1, -1, -1],
            [-1, -1,  1], [ 1, -1,  1], [-1,  1,  1], [ 1,  1,  1],
            [-1,  1,  1], [ 1,  1,  1], [-1,  1, -1], [ 1,  1, -1],
            [-1, -1, -1], [ 1, -1, -1], [-1, -1,  1], [ 1, -1,  1],
            [-1, -1, -1], [-1, -1,  1], [-1,  1, -1], [-1,  1,  1],
            [ 1, -1, -1], [ 1, -1,  1], [ 1,  1, -1], [ 1,  1,  1] 
        ));

        this.texture_coords.push(...Vec.cast(
            [0,    2/3], [0.25, 2/3], [0,    1/3], [0.25, 1/3],
            [0.5,  2/3], [0.5,  1/3], [0.75, 2/3], [0.75, 1/3],
            [0.75, 2/3], [0.75, 1/3], [1,    2/3], [1,    1/3],
            [0.25, 2/3], [0.25, 1/3], [0.5,  2/3], [0.5,  1/3],
            [0.25, 2/3], [0.5,  2/3], [0.25, 1  ], [0.5,  1  ],
            [0.25, 1/3], [0.5,  1/3], [0.25, 0  ], [0.5,  0  ]
        )); 

        this.normals.push(...Vec.cast(
            ...Array(4).fill([ 0,  0, -1]),
            ...Array(4).fill([ 0,  0,  1]),
            ...Array(4).fill([ 0,  1,  0]),
            ...Array(4).fill([ 0, -1,  0]),
            ...Array(4).fill([-1,  0,  0]),
            ...Array(4).fill([ 1,  0,  0])
        ));

        this.indices.push(
            0, 2, 1, 1, 2, 3,
            4, 5, 6, 5, 7, 6,
            8, 9, 10, 9, 11, 10,    
            12, 13, 14, 13, 15, 14,
            16, 19, 18, 16, 17, 19,
            20, 22, 21, 21, 22, 23
        );
    }
}


window.SimpleCube = window.classes.SimpleCube = class SimpleCube extends Shape {
    constructor() {
      super( "positions", "normals", "texture_coords" );
      for( var i = 0; i < 3; i++ )                    
        for( var j = 0; j < 2; j++ ) {
          var square_transform = Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) )
                         .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                         .times( Mat4.translation([ 0, 0, 1 ]) );
          Square.insert_transformed_copy_into( this, [], square_transform );
      }
    }
}

window.Tetrahedron = window.classes.Tetrahedron = class Tetrahedron extends Shape {
    constructor(using_flat_shading) {
        super("positions", "normals", "texture_coords");
        const s3 = Math.sqrt(3) / 4,
            v1 = Vec.of(Math.sqrt(8/9), -1/3, 0),
            v2 = Vec.of(-Math.sqrt(2/9), -1/3, Math.sqrt(2/3)),
            v3 = Vec.of(-Math.sqrt(2/9), -1/3, -Math.sqrt(2/3)),
            v4 = Vec.of(0, 1, 0);

        this.positions.push(...Vec.cast(
            v1, v2, v3,
            v1, v3, v4,
            v1, v2, v4,
            v2, v3, v4));

        this.normals.push(...Vec.cast(
            ...Array(3).fill(v1.plus(v2).plus(v3).normalized()),
            ...Array(3).fill(v1.plus(v3).plus(v4).normalized()),
            ...Array(3).fill(v1.plus(v2).plus(v4).normalized()),
            ...Array(3).fill(v2.plus(v3).plus(v4).normalized())));

        this.texture_coords.push(...Vec.cast(
            [0.25, s3], [0.75, s3], [0.5, 0], 
            [0.25, s3], [0.5,  0 ], [0,   0],
            [0.25, s3], [0.75, s3], [0.5, 2 * s3], 
            [0.75, s3], [0.5,  0 ], [1,   0]));

        this.indices.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
    }
}

window.Pocket = window.classes.Pocket = class Pocket extends Shape {
    constructor(sections)
    {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([1, 0, 0], [1, 0, -1.34]));
        this.normals.push(...Vec.cast(  [1, 0, 0], [1, 0,  0]));
        this.texture_coords.push(...Vec.cast([0, 1], [0, 0]));

        for (let i = 0; i < sections / 2; ++i) {
            const ratio = (i + 1) / sections,
                angle = 2 * Math.PI * ratio,
                v = Vec.of(Math.cos(angle), Math.sin(angle)),
                id = 2 * i + 2;

            this.positions.push(...Vec.cast([v[0], v[1], 0], [v[0], v[1], -1.34]));
            this.normals.push(...Vec.cast(  [v[0], v[1], 0], [v[0], v[1],  0]));
            this.texture_coords.push(...Vec.cast([ratio, 1], [ratio, 0]));
            this.indices.push(
                id, id - 1, id + 1,
                id, id - 1, id - 2,
                id, id - 2, 0,
                id - 1, id + 1, 1,
                id, id + 1, 0,
                id + 1, 1, 0
                );
        }
    }
}

window.myObstacle = window.classes.myObstacle = class myObstacle extends Shape {
    constructor(sections)
    {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([1, 0, 0], [1, 0, -1.34]));
        this.normals.push(...Vec.cast(  [1, 0, 0], [1, 0,  0]));
        this.texture_coords.push(...Vec.cast([0, 1], [0, 0]));

        for (let i = 0; i < sections; ++i) {
            const ratio = (i + 1) / sections,
                angle = 2 * Math.PI * ratio,
                v = Vec.of(Math.cos(angle), Math.sin(angle)),
                id = 2 * i + 2;

            this.positions.push(...Vec.cast([v[0], v[1], 0], [v[0], v[1], -1.34]));
            this.normals.push(...Vec.cast(  [v[0], v[1], 0], [v[0], v[1],  0]));
            this.texture_coords.push(...Vec.cast([ratio, 1], [ratio, 0]));
            this.indices.push(
                id, id - 1, id + 1,
                id, id - 1, id - 2,
                id, id - 2, 0,
                id - 1, id + 1, 1,
                id, id + 1, 0,
                id + 1, 1, 0
                );
        }
    }
}

window.Cylinder2 = window.classes.Cylinder2 = class Cylinder2 extends Shape {
    constructor(sections)
    {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([1, 0, 0], [1, 0, -1.34]));
        this.normals.push(...Vec.cast(  [1, 0, 0], [1, 0,  0]));
        this.texture_coords.push(...Vec.cast([0, 1], [0, 0]));

        for (let i = 0; i < sections; ++i) {
            const ratio = (i + 1) / sections,
                angle = 2 * Math.PI * ratio,
                v = Vec.of(Math.cos(angle), Math.sin(angle)),
                id = 2 * i + 2;

            this.positions.push(...Vec.cast([v[0], v[1], 0], [v[0], v[1], -1.34]));
            this.normals.push(...Vec.cast(  [v[0], v[1], 0], [v[0], v[1],  0]));
            this.texture_coords.push(...Vec.cast([ratio, 1], [ratio, 0]));
            this.indices.push(
                id, id - 1, id + 1,
                id, id - 1, id - 2,
                id, id - 2, 0,
                id - 1, id + 1, 1,
                id, id + 1, 0,
                id + 1, 1, 0
                );
        }
    }
}


window.Cylinder = window.classes.Cylinder = class Cylinder extends Shape {
    constructor(sections) {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([1, 0, 1], [1, 0, -1]));
        this.normals.push(...Vec.cast(  [1, 0, 0], [1, 0,  0]));
        this.texture_coords.push(...Vec.cast([0, 1], [0, 0]));

        for (let i = 0; i < sections; ++i) {
            const ratio = (i + 1) / sections,
                angle = 2 * Math.PI * ratio,
                v = Vec.of(Math.cos(angle), Math.sin(angle)),
                id = 2 * i + 2;

            this.positions.push(...Vec.cast([v[0], v[1], 1], [v[0], v[1], -1]));
            this.normals.push(...Vec.cast(  [v[0], v[1], 0], [v[0], v[1],  0]));
            this.texture_coords.push(...Vec.cast([ratio, 1], [ratio, 0]));
            this.indices.push(
                id, id - 1, id + 1,
                id, id - 1, id - 2);
        }
    }
}

window.Cone = window.classes.Cone = class Cone extends Shape {
    constructor(sections) {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([1, 0, 0]));
        this.normals.push(...Vec.cast(  [0, 0, 1]));
        this.texture_coords.push(...Vec.cast([1, 0.5]));

        let t = Vec.of(0, 0, 1);
        for (let i = 0; i < sections; ++i) {
            const angle = 2 * Math.PI * (i + 1) / sections,
                v = Vec.of(Math.cos(angle), Math.sin(angle), 0),
                id = 2 * i + 1;

            this.positions.push(...Vec.cast(t, v));
            this.normals.push(...Vec.cast(
                v.mix(this.positions[id - 1], 0.5).plus(t).normalized(),
                v.plus(t).normalized()));
            this.texture_coords.push(...Vec.cast([0.5, 0.5], [(v[0] + 1) / 2, (v[1] + 1) / 2]));
            this.indices.push(
                id - 1, id, id + 1);
        }
    }
}

// This Shape defines a Sphere surface, with nice (mostly) uniform triangles.  A subdivision surface
// (see) Wikipedia article on those) is initially simple, then builds itself into a more and more 
// detailed shape of the same layout.  Each act of subdivision makes it a better approximation of 
// some desired mathematical surface by projecting each new point onto that surface's known 
// implicit equation.  For a sphere, we begin with a closed 3-simplex (a tetrahedron).  For each
// face, connect the midpoints of each edge together to make more faces.  Repeat recursively until 
// the desired level of detail is obtained.  Project all new vertices to unit vectors (onto the
// unit sphere) and group them into triangles by following the predictable pattern of the recursion.
window.Subdivision_Sphere = window.classes.Subdivision_Sphere = class Subdivision_Sphere extends Shape {
    constructor(max_subdivisions) {
        super("positions", "normals", "texture_coords");

        // Start from the following equilateral tetrahedron:
        this.positions.push(...Vec.cast([0, 0, -1], [0, .9428, .3333], [-.8165, -.4714, .3333], [.8165, -.4714, .3333]));

        // Begin recursion.
        this.subdivideTriangle(0, 1, 2, max_subdivisions);
        this.subdivideTriangle(3, 2, 1, max_subdivisions);
        this.subdivideTriangle(1, 0, 3, max_subdivisions);
        this.subdivideTriangle(0, 2, 3, max_subdivisions);
        
        //from wiki equations for the uv on a sphere
        for (let p of this.positions) {
            this.normals.push(p.copy());
            this.texture_coords.push(Vec.of(
                0.5 + Math.atan2(p[2], p[0]) / (2 * Math.PI),
                0.5 - Math.asin(p[1]) / Math.PI));
        }

        // Fix the UV seam by duplicating vertices with offset UV
        let tex = this.texture_coords;
        for (let i = 0; i < this.indices.length; i += 3) {
            const a = this.indices[i], b = this.indices[i + 1], c = this.indices[i + 2];
            if ([[a, b], [a, c], [b, c]].some(x => (Math.abs(tex[x[0]][0] - tex[x[1]][0]) > 0.5))
                && [a, b, c].some(x => tex[x][0] < 0.5))
            {
                for (let q of [[a, i], [b, i + 1], [c, i + 2]]) {
                    if (tex[q[0]][0] < 0.5) {
                        this.indices[q[1]] = this.positions.length;
                        this.positions.push(this.positions[q[0]].copy());
                        this.normals.push(this.normals[q[0]].copy());
                        tex.push(tex[q[0]].plus(Vec.of(1, 0)));
                    }
                }
            }
        }
    }

    subdivideTriangle(a, b, c, count) {
        if (count <= 0) {
            this.indices.push(a, b, c);
            return;
        }

        let ab_vert = this.positions[a].mix(this.positions[b], 0.5).normalized(),
            ac_vert = this.positions[a].mix(this.positions[c], 0.5).normalized(),
            bc_vert = this.positions[b].mix(this.positions[c], 0.5).normalized();

        let ab = this.positions.push(ab_vert) - 1,
            ac = this.positions.push(ac_vert) - 1,
            bc = this.positions.push(bc_vert) - 1;

        this.subdivideTriangle( a, ab, ac, count - 1);
        this.subdivideTriangle(ab,  b, bc, count - 1);
        this.subdivideTriangle(ac, bc,  c, count - 1);
        this.subdivideTriangle(ab, bc, ac, count - 1);
    }
}