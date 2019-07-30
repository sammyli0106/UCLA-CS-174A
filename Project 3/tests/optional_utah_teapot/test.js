function configureTest(callback) {

    const camera = new PerspectiveCamera(Math.PI / 4, 1,
        Mat4.translation([0,2,0])
            .times(Mat4.rotation(-0.3, Vec.of(1,0,0))));
    const scene = new Scene();

    scene.addLight(new SimplePointLight(
        Vec.of(-15, 5, 12, 1),
        Vec.of(1, 1, 1)       
    ));
    scene.addObject(new SceneObject(
        new Plane(Vec.of(0, 1, 0, 0), -1.5),
        new PhongMaterial(Vec.of(0,0,1), 0.1, 0.4, 0.6, 100)));

    loadObjFile(
        "../assets/teapot.obj",
        new PhongMaterial(Vec.of(1,1,1), 0.1, 0.4, 0.6, 100, 0.6),

        Mat4.translation([-0.4,-1,-6])
            .times(Mat4.rotation(-0.5, Vec.of(0,1,0)))
            .times(Mat4.rotation(-Math.PI/2, Vec.of(1,0,0)))
            .times(Mat4.scale(0.15)),

        function(triangles) {
            scene.addObjects(triangles);

            callback({
                renderer: new SimpleRenderer(scene, camera, 4),
                width: 600,
                height: 600
            });
        });
}