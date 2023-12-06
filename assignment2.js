import {defs, tiny} from './examples/common.js';
import {Shape_From_File} from "./examples/obj-file-demo.js";
import {Text_Line} from "./examples/text-demo.js";

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        //  TODO (Requirement 5).
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Requirement 6)
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'picnic': new Shape_From_File("assets/picnic_table.obj"),
            'tree1': new Shape_From_File("assets/Tree1.obj"),
            'houses1': new Shape_From_File("assets/houses1.obj"),
            'houses2': new Shape_From_File("assets/houses2.obj"),
            'square': new defs.Square(),
            'triangle': new defs.Triangle(),
            'sphere': new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
            'fence2': new Shape_From_File("assets/fence2.obj"),
            'torus': new defs.Torus(50, 50),
            'zoo_text': new Text_Line(10),
            'text': new Text_Line(35),
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            picnic: new Material(new defs.Phong_Shader(),
                {ambient: 0.9, diffusivity: 0.8, specularity: 0, color: hex_color("#964B00")}),
            wall: new Material(new defs.Phong_Shader(),
                {ambient: 0.6, diffusivity: 1, specularity: 0, color: hex_color("#FFFFFF")}),
            red: new Material(new defs.Phong_Shader(),
                {ambient: 0.6, diffusivity: 1, specularity: 0, color: hex_color("#FF0000")}),
            green: new Material(new defs.Phong_Shader(),
                {ambient: 0.8, diffusivity: 1, specularity: 0, color: hex_color("#28632b")}),
            yellow: new Material(new defs.Phong_Shader(),
                {ambient: 0.9, diffusivity: 0.8, specularity: 0, color: hex_color("#e3c310")}),
            sky: new Material(new defs.Phong_Shader(),
                {ambient: 0.9, diffusivity: 0.1, specularity: 0, color: hex_color("#027ddb")}),
            wood: new Material(new defs.Phong_Shader(),
                {ambient: 0.9, diffusivity: 0.1, specularity: 0, color: hex_color("#3b2f1d")}),
            zoo_text: new Material(new defs.Textured_Phong(1),
                {ambient: 1, diffusivity: 0, specularity: 0, texture: new Texture("assets/text.png")}),
            path: new Material(new defs.Phong_Shader(),
                {ambient: 0.9, diffusivity: 0.1, specularity: 0, color: hex_color("#c9af7b")}),
            text_image: new Material(new defs.Textured_Phong(),
                {ambient: 1, color: hex_color("#000000"), texture: new Texture("assets/text.png")}),

        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            //program_state.set_camera(Mat4.translation(0, -5, -60));
            program_state.set_camera(Mat4.look_at(vec3(0, 0, 50), vec3(0, 0, 0), vec3(0, 1, 0)));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 300);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        //GROUND
        let ground_transform = Mat4.identity().times(Mat4.scale(80, 1, 100)).times(Mat4.translation(0, -4, 0));
        this.shapes.cube.draw(context, program_state, ground_transform, this.materials.green);

        //HILLS
        let hills_transform = Mat4.identity();
        this.shapes.sphere.draw(context, program_state,
            hills_transform.times(Mat4.translation(-40, -20, -60)).times(Mat4.scale(60, 30, 40)),
            this.materials.green);
        this.shapes.sphere.draw(context, program_state,
            hills_transform.times(Mat4.translation(50, -20, -60)).times(Mat4.scale(60, 30, 40)),
            this.materials.green);

        //SKY
        this.shapes.sphere.draw(context, program_state,
            hills_transform.times(Mat4.translation(-20, 0, 0)).times(Mat4.scale(100, 100, 100)),
            this.materials.sky);

        //HOUSE
        let house_transform = Mat4.identity().times(Mat4.scale(3.5, 3, 3));
        this.shapes.cube.draw(context, program_state, house_transform, this.materials.wall);
        this.shapes.triangle.draw(context, program_state, house_transform.times(Mat4.translation(0,1,1))
            , this.materials.wall);
        this.shapes.triangle.draw(context, program_state,
            house_transform.times(Mat4.translation(0,1,1)).times(Mat4.rotation(Math.PI/2, 0, 0, 1)),
            this.materials.wall);
        this.shapes.triangle.draw(context, program_state, house_transform.times(Mat4.translation(0,1,-1))
            , this.materials.wall);
        this.shapes.triangle.draw(context, program_state,
            house_transform.times(Mat4.translation(0,1,-1)).times(Mat4.rotation(Math.PI/2, 0, 0, 1)),
            this.materials.wall);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.rotation(Math.PI/4, 0, 0, 1))
                .times(Mat4.scale(1, 0.15, 1.2))
                .times(Mat4.translation(0.65, 10, 0)),
            this.materials.red);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.rotation(-Math.PI/4, 0, 0, 1))
                .times(Mat4.scale(1, 0.15, 1.2))
                .times(Mat4.translation(-0.65, 10, 0)),
            this.materials.red);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.2, 0.5, 0.2)).times(Mat4.translation(3.5, 3.5, 3)),
            this.materials.wall);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.2, 0.6, 0.1)).times(Mat4.translation(-3.3, 0, 10)),
            this.materials.red);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.2, 0.6, 0.1)).times(Mat4.translation(3.3, 0, 10)),
            this.materials.red);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.45, 0.6, 0.1)).times(Mat4.translation(0, 0, 10)),
            this.materials.green);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.15, 0.2, 0.1)).times(Mat4.translation(-1.3, 1.3, 10.1)),
            this.materials.yellow);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.15, 0.2, 0.1)).times(Mat4.translation(1.3, 1.3, 10.1)),
            this.materials.yellow);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.15, 0.2, 0.1)).times(Mat4.translation(-1.3, -1.3, 10.1)),
            this.materials.yellow);
        this.shapes.cube.draw(context, program_state,
            house_transform.times(Mat4.scale(0.15, 0.2, 0.1)).times(Mat4.translation(1.3, -1.3, 10.1)),
            this.materials.yellow);

        //PICNIC TABLE
        let picnic_transform = Mat4.identity();
        this.shapes.picnic.draw(context, program_state,
            picnic_transform.times(Mat4.rotation(Math.PI/5, 0, 1, 0)).times(Mat4.scale(2, 2, 2)).times(Mat4.translation(5, -0.5, 8)),
            this.materials.picnic);

        //TREES
        let tree_transform = Mat4.identity();
        this.shapes.sphere.draw(context, program_state,
            tree_transform.times(Mat4.translation(15, -3, 0)).times(Mat4.scale(0.7, 10, 0.7)),
            this.materials.wood);
        this.shapes.sphere.draw(context, program_state,
            tree_transform.times(Mat4.translation(15, 4, 0)).times(Mat4.scale(3.5, 3.5, 3.5)),
            this.materials.green);
        this.shapes.sphere.draw(context, program_state,
            tree_transform.times(Mat4.rotation(Math.PI/4, 0, 0, 1)).times(Mat4.translation(9, -11, 0)).times(Mat4.scale(0.3, 1, 0.3)),
            this.materials.wood);
        tree_transform = tree_transform.times(Mat4.translation(0, 0, 0)).times(Mat4.rotation(Math.PI, 0, 1, 0));
        this.shapes.sphere.draw(context, program_state,
            tree_transform.times(Mat4.translation(15, -3, 0)).times(Mat4.scale(0.7, 10, 0.7)),
            this.materials.wood);
        this.shapes.sphere.draw(context, program_state,
            tree_transform.times(Mat4.translation(15, 4, 0)).times(Mat4.scale(3.5, 3.5, 3.5)),
            this.materials.green);
        this.shapes.sphere.draw(context, program_state,
            tree_transform.times(Mat4.rotation(Math.PI/4, 0, 0, 1)).times(Mat4.translation(9, -11, 0)).times(Mat4.scale(0.3, 1, 0.3)),
            this.materials.wood);

        //FENCE
        let fence_transform = Mat4.identity().times(Mat4.rotation(-Math.PI/2, 1, 0, 0));
        this.shapes.fence2.draw(context, program_state,
            fence_transform.times(Mat4.translation(6.5,-2,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.yellow);
        this.shapes.fence2.draw(context, program_state,
            fence_transform.times(Mat4.translation(-6.5,-2,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.yellow);

        //ZOO
            //FENCES
        let zoo_transform = Mat4.identity();
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-40,-20,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-46,-20,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-52,-20,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-52,-8,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-40,-8,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-46,-8,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-37, -1.7, 11)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-37, -1.7, 17)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-55, -1.7, 11)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-55, -1.7, 17)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        zoo_transform = zoo_transform.times(Mat4.translation(0, 0, 20));
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-40,-20,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-46,-20,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-52,-20,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-52,-8,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-40,-8,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
                .times(Mat4.translation(-46,-8,-1.7)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-37, -1.7, 11)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-37, -1.7, 17)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-55, -1.7, 11)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
        this.shapes.fence2.draw(context, program_state,
            zoo_transform.times(Mat4.translation(-55, -1.7, 17)).times(Mat4.rotation(Math.PI/2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI/2, 1, 0, 0)).times(Mat4.scale(2,1,1)),
            this.materials.red);
            //SIGN (zoo)
        this.shapes.torus.draw(context, program_state,
            zoo_transform.times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.scale(20,12,4))
                .times(Mat4.translation(-0.2, -0.1, -8)),
            this.materials.yellow);
        this.shapes.cube.draw(context, program_state,
            zoo_transform.times(Mat4.scale(1,3,10))
                .times(Mat4.translation(-32, 0, 3)),
            this.materials.yellow);
        this.shapes.cube.draw(context, program_state,
            zoo_transform.times(Mat4.scale(1,3,10))
                .times(Mat4.translation(-32, 0, -2)),
            this.materials.yellow);
        this.shapes.zoo_text.set_string("ZOO", context.context);
        this.shapes.zoo_text.draw(context, program_state,
            zoo_transform.times(Mat4.scale(2, 2, 2)).times(Mat4.translation(-15, 3, 3.5)).times(Mat4.rotation(Math.PI/2, 0, 1, 0)),
            this.materials.zoo_text);
            //BUSHES
        this.shapes.sphere.draw(context, program_state,
            zoo_transform.times(Mat4.scale(1.5, 1.5, 1.5)).times(Mat4.translation(-19, -1.5, -2)),
            this.materials.green);
        this.shapes.sphere.draw(context, program_state,
            zoo_transform.times(Mat4.scale(1.5, 1.5, 1.5)).times(Mat4.translation(-19, -1.5, 7.45)),
            this.materials.green);

        //PATH
        let path_transform = Mat4.identity();
        this.shapes.cube.draw(context, program_state,
            path_transform.times(Mat4.scale(27, 1, 3)).times(Mat4.translation(-1.1, -3.95, 8)),
            this.materials.path)
        this.shapes.cube.draw(context, program_state,
            path_transform.times(Mat4.scale(3, 1, 50)).times(Mat4.translation(0, -3.95, 1)),
            this.materials.path)

        //CLOUDS
        //let cloud_transform = Mat4.identity();
        //this.shapes.sphere.draw()
    }
}

export class Assignment2 extends Base_Scene {

    constructor() {
        super();
        this.title = true;
        this.first_scene = false;

    }


    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Change Colors", ["c"], this.set_colors);
        // Add a button for controlling the scene.
        this.key_triggered_button("Outline", ["o"], () => {
            // TODO:  Requirement 5b:  Set a flag here that will toggle your outline on and off
        });
        this.key_triggered_button("Sit still", ["m"], () => {
            // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
        });
        this.key_triggered_button("Enter", ['Enter'], () => {
            if (this.title) {
                this.title = false;
                this.first_scene = true;
            }
        });
    }


    draw_title(context, program_state) {
        //program_state.set_camera(Mat4.look_at(vec3(0, 0, 50), vec3(0, 0, 0), vec3(0, 1, 0)));
        // let desired = Mat4.look_at(vec3(0, 0, 50), vec3(0, 0, 0), vec3(0, 1, 0));
        // desired.map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.01))
        // this.title = false;
    }

    display(context, program_state) {
        super.display(context, program_state);
        const t = program_state.animation_time / 1000;
        if (this.title) {
            program_state.set_camera(Mat4.look_at(vec3(10, 55, 30), vec3(10, 55, 0), vec3(0, 1, 0)));
            let title_transform = Mat4.identity().times(Mat4.translation(0, 60, 0));
            this.shapes.text.set_string("miffy's big day", context.context);
            this.shapes.text.draw(context, program_state, title_transform, this.materials.text_image);
            let subtitle_transform = title_transform.times(Mat4.scale(0.5,0.5,0.5)).times(Mat4.translation(4,-10,0));
            this.shapes.text.set_string("press enter to continue", context.context);
            if (Math.floor(t%2) === 1) {
                this.shapes.text.draw(context, program_state, subtitle_transform, this.materials.text_image);
            }
        }
        else if (this.first_scene) {
            program_state.set_camera(Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0)));
        }
    }
}