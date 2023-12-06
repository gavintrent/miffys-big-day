import { defs, tiny } from "./examples/common.js";
import { Shape_From_File } from "./examples/obj-file-demo.js";
import { Text_Line } from "./examples/text-demo.js";

import {
    Color_Phong_Shader,
    Shadow_Textured_Phong_Shader,
    Depth_Texture_Shader_2D,
    Buffered_Texture,
    LIGHT_DEPTH_TEX_SIZE,
} from "./examples/shadow-demo-shaders.js";

const {
    Vector,
    Vector3,
    vec,
    vec3,
    vec4,
    color,
    hex_color,
    Matrix,
    Mat4,
    Light,
    Shape,
    Material,
    Scene,
    Texture,
} = tiny;
const {Cube, Subdivision_Sphere} = defs;

export class Base_Scene extends Scene {
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
            cube: new defs.Cube(),
            picnic: new Shape_From_File("assets/picnic_table.obj"),
            tree1: new Shape_From_File("assets/Tree1.obj"),
            houses1: new Shape_From_File("assets/houses1.obj"),
            houses2: new Shape_From_File("assets/houses2.obj"),
            square: new defs.Square(),
            triangle: new defs.Triangle(),

            sphere: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(
                4
            ),
            fence2: new Shape_From_File("assets/fence2.obj"),
            torus: new defs.Torus(50, 50),
            zoo_text: new Text_Line(10),
            miffy: new Shape_From_File("assets/mif.obj"),
            text: new Text_Line(35),
            box: new Cube(),
            ball: new Subdivision_Sphere(4)
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(), {
                ambient: 0.4,
                diffusivity: 0.6,
                color: hex_color("#ffffff"),
            }),
            picnic: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.8,
                specularity: 0,
                color: hex_color("#964B00"),
            }),
            wall: new Material(new defs.Phong_Shader(), {
                ambient: 0.6,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#FFFFFF"),
            }),
            red: new Material(new defs.Phong_Shader(), {
                ambient: 0.6,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#FF0000"),
            }),
            green: new Material(new defs.Phong_Shader(), {
                ambient: 0.8,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#28632b"),
            }),
            yellow: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.8,
                specularity: 0,
                color: hex_color("#e3c310"),
            }),
            sky: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.1,
                specularity: 0,
                color: hex_color("#027ddb"),
            }),
            wood: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.1,
                specularity: 0,
                color: hex_color("#3b2f1d"),
            }),
            zoo_text: new Material(new defs.Textured_Phong(1), {
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                texture: new Texture("assets/text.png"),
            }),
            path: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.1,
                specularity: 0,
                color: hex_color("#c9af7b"),
            }),
            miffy: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.1,
                specularity: 0,
                color: hex_color("#FFFFFF"),
            }),
            text_image: new Material(new defs.Textured_Phong(), {
                ambient: 1,
                color: hex_color("#000000"),
                texture: new Texture("assets/text.png"),
            }),
            black: new Material(new defs.Phong_Shader(), {
                ambient: 0.6,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#000000"),

            }),
        };

        // ** Example of how to add a texture to material AND have shadow ** //

        this.shadowed_orange = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(1, 0.592, 0, 1),
                ambient: 0.3,
                diffusivity: 0.6,
                specularity: 0.4,
                smoothness: 64,
                color_texture: new Texture("assets/orangetexture.png"),

            }
        );

        // ** Shadowed textures ** //
        this.cow_print = new Material(
            new Shadow_Textured_Phong_Shader(1),{
            color: hex_color("#000000"),
            ambient: .2,
            diffusivity: 0.5,
            specularity: 0.5,
            color_texture: new Texture("assets/cow_print.png"),light_depth_texture: null }

        );
        this.shadowed_plastic = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(1, 1, 1, 1),
                ambient: 0.4,
                diffusivity: 0.6,
                specularity: 0,
                smoothness: 64,
                color_texture: null,
                light_depth_texture: null,
            }
        );
        this.shadowed_picnic = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(0.588, 0.294, 0, 1),
                ambient: 0.9,
                diffusivity: 0.8,
                specularity: 0,
                smoothness: 64,
                color_texture: null,
                light_depth_texture: null,
            }
        );
        this.shadowed_wall = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(1, 1, 1, 1),
            ambient: 0.6,
            diffusivity: 0.6,
            specularity: 0.4,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null,
        });
        this.shadowed_red = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(1, 0, 0, 1),
            ambient: 0.3,
            diffusivity: 0.6,
            specularity: 0.4,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null,
        });
        this.shadowed_green = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(0.082, 0.678, 0.039, 1),
                ambient: 0.3,
                diffusivity: 0.6,
                specularity: 0.4,
                smoothness: 64,
                color_texture: null,
                light_depth_texture: null,
            }
        );
        this.shadowed_yellow = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(
                    0.8901960784313725,
                    0.7647058823529411,
                    0.06274509803921569,
                    1
                ),
                ambient: 1,
                diffusivity: 0.6,
                specularity: 0.4,
                smoothness: 64,
                color_texture: null,
                light_depth_texture: null,
            }
        );
        this.shadowed_sky = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(
                0.00784313725490196,
                0.49019607843137253,
                0.8588235294117647,
                1
            ),
            ambient: 0.3,
            diffusivity: 0.6,
            specularity: 0.4,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null,
        });
        this.shadowed_wood = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(0.231, 0.184, 0.113, 1),
            ambient: 0.9,
            diffusivity: 0.1,
            specularity: 0,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null,
        });
        this.shadowed_zoo_text = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(0, 0, 0, 1),
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                smoothness: 64,
                color_texture: new Texture("assets/text.png"),
                light_depth_texture: null,
            }
        );
        this.shadowed_path = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(0.788, 0.686, 0.482, 1),
            ambient: 0.9,
            diffusivity: 0.1,
            specularity: 0,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null,
        });
        this.shadowed_text_image = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(0, 0, 0, 1),
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                smoothness: 64,
                color_texture: new Texture("assets/text.png"),
                light_depth_texture: null,
            }
        );

        // *** do not remove please <3 for testing purposes *** //
        this.floor = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(1, 1, 1, 1),
            ambient: 0.3,
            diffusivity: 0.6,
            specularity: 0.4,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null,
        });
        this.grass = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(0.082, 0.678, 0.039, 1),
            ambient: 0.3,
            diffusivity: 0.6,
            specularity: 0.4,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null,
        });

        // ** NECESSARY TEXTURES FOR SHADOWING * DO NOT REMOVE * ** //
        // For the first pass
        this.pure = new Material(new Color_Phong_Shader(), {});
        // For light source
        this.light_src = new Material(new defs.Phong_Shader(), {
            color: color(1, 1, 1, 1),
            ambient: 1,
            diffusivity: 0,
            specularity: 0,
        });
        // For depth texture display
        this.depth_tex = new Material(new Depth_Texture_Shader_2D(), {
            color: color(0, 0, 0.0, 1),
            ambient: 1,
            diffusivity: 0,
            specularity: 0,
            texture: null,
        });
        // To make sure texture initialization only does once
        this.init_ok = false;

        // *** FLAGS
        this.title = true;
        this.first_scene = false;
    }

    make_control_panel() {
        this.key_triggered_button("Enter", ["Enter"], () => {
            if (this.title) {
                this.title = false;
                this.first_scene = true;
            }
        });
    }

    texture_buffer_init(gl) {
        // Depth Texture
        this.lightDepthTexture = gl.createTexture();
        // Bind it to TinyGraphics
        this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);

        // ** ANY NEW SHADOWED TEXTURE MUST BE ADDED HERE IT WILL NOT RENDER ** //
        // ** IF YOU REMOVE ANY SHADOWED TEXTURE OR CHANGE ITS NAME !!!! YOU MUST CHANGE IT HERE AS WELL ** //

        this.shadowed_orange.light_depth_texture = this.light_depth_texture;

        this.grass.light_depth_texture = this.light_depth_texture;
        this.floor.light_depth_texture = this.light_depth_texture;

        this.shadowed_plastic.light_depth_texture = this.light_depth_texture;
        this.shadowed_picnic.light_depth_texture = this.light_depth_texture;
        this.shadowed_wall.light_depth_texture = this.light_depth_texture;
        this.shadowed_red.light_depth_texture = this.light_depth_texture;
        this.shadowed_green.light_depth_texture = this.light_depth_texture;
        this.shadowed_yellow.light_depth_texture = this.light_depth_texture;
        this.shadowed_sky.light_depth_texture = this.light_depth_texture;
        this.shadowed_wood.light_depth_texture = this.light_depth_texture;
        this.shadowed_zoo_text.light_depth_texture = this.light_depth_texture;
        this.shadowed_path.light_depth_texture = this.light_depth_texture;
        this.shadowed_text_image.light_depth_texture = this.light_depth_texture;

        this.lightDepthTextureSize = LIGHT_DEPTH_TEX_SIZE;

        gl.bindTexture(gl.TEXTURE_2D, this.lightDepthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D, // target
            0, // mip level
            gl.DEPTH_COMPONENT, // internal format
            this.lightDepthTextureSize, // width
            this.lightDepthTextureSize, // height
            0, // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT, // type
            null
        ); // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Depth Texture Buffer
        this.lightDepthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, // target
            gl.DEPTH_ATTACHMENT, // attachment point
            gl.TEXTURE_2D, // texture target
            this.lightDepthTexture, // texture
            0
        ); // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // create a color texture of the same size as the depth texture
        // see article why this is needed_
        this.unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.unusedTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.lightDepthTextureSize,
            this.lightDepthTextureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // attach it to the framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, // target
            gl.COLOR_ATTACHMENT0, // attachment point
            gl.TEXTURE_2D, // texture target
            this.unusedTexture, // texture
            0
        ); // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    render_scene(
        context,
        program_state,
        shadow_pass,
        draw_light_source = false,
        draw_shadow = false
    ) {
        // shadow_pass: true if this is the second pass that draw the shadow.
        // draw_light_source: true if we want to draw the light source.
        // draw_shadow: true if we want to draw the shadow

        let light_position = this.light_position;
        let light_color = this.light_color;
        const t = this.t = program_state.animation_time;
        const time = t / 1000; // seconds
        const sway_angle = Math.sin(time) * Math.PI / 8; // Sway back and forth up to +/- 22.5 degrees
        const brown = color(0.24, 0.1, 0.1, 1); // Brown color for the horns
        const cream = color(1, 0.98, 0.82, 1); // Adjust RGB values for desired shade of cream
        const tan = color(0.788, 0.580, 0.396, 1);

        program_state.draw_shadow = draw_shadow;

        if (draw_light_source && shadow_pass) {
            this.shapes.sphere.draw(
                context,
                program_state,
                Mat4.translation(
                    light_position[0],
                    light_position[1],
                    light_position[2]
                ).times(Mat4.scale(0.5, 0.5, 0.5)),
                this.light_src.override({ color: light_color })
            );
        }

        //GROUND
        let ground_transform = Mat4.identity()
            .times(Mat4.scale(80, 1, 100))
            .times(Mat4.translation(0, -4, 0));
        this.shapes.cube.draw(
            context,
            program_state,
            ground_transform,
            shadow_pass ? this.grass : this.pure
        );

        //HILLS
        let hills_transform = Mat4.identity();
        this.shapes.sphere.draw(
            context,
            program_state,
            hills_transform
                .times(Mat4.translation(-40, -20, -60))
                .times(Mat4.scale(60, 30, 40)),
            shadow_pass ? this.grass : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            hills_transform
                .times(Mat4.translation(50, -20, -60))
                .times(Mat4.scale(60, 30, 40)),
            shadow_pass ? this.grass : this.pure
        );

        //SKY ** notice how this is not shaded
        this.shapes.sphere.draw(
            context,
            program_state,
            hills_transform
                .times(Mat4.translation(-20, 0, 0))
                .times(Mat4.scale(100, 100, 100)),
            this.materials.sky
        );

        //HOUSE
        let house_transform = Mat4.identity().times(Mat4.scale(3.5, 3, 3));
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform,
            shadow_pass ? this.shadowed_wall : this.pure
        );
        this.shapes.triangle.draw(
            context,
            program_state,
            house_transform.times(Mat4.translation(0, 1, 1)),
            shadow_pass ? this.shadowed_wall : this.pure
        );
        this.shapes.triangle.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.translation(0, 1, 1))
                .times(Mat4.rotation(Math.PI / 2, 0, 0, 1)),
            shadow_pass ? this.shadowed_wall : this.pure
        );
        this.shapes.triangle.draw(
            context,
            program_state,
            house_transform.times(Mat4.translation(0, 1, -1)),
            shadow_pass ? this.shadowed_wall : this.pure
        );
        this.shapes.triangle.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.translation(0, 1, -1))
                .times(Mat4.rotation(Math.PI / 2, 0, 0, 1)),
            shadow_pass ? this.shadowed_wall : this.pure
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.rotation(Math.PI / 4, 0, 0, 1))
                .times(Mat4.scale(1, 0.15, 1.2))
                .times(Mat4.translation(0.65, 10, 0)),
            shadow_pass ? this.shadowed_red : this.pure
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.rotation(-Math.PI / 4, 0, 0, 1))
                .times(Mat4.scale(1, 0.15, 1.2))
                .times(Mat4.translation(-0.65, 10, 0)),
            shadow_pass ? this.shadowed_red : this.pure
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.2, 0.5, 0.2))
                .times(Mat4.translation(3.5, 3.5, 3)),
            shadow_pass ? this.shadowed_wall : this.pure
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.2, 0.6, 0.1))
                .times(Mat4.translation(-3.3, 0, 10)),
            this.materials.red
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.2, 0.6, 0.1))
                .times(Mat4.translation(3.3, 0, 10)),
            this.materials.red
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.45, 0.6, 0.1))
                .times(Mat4.translation(0, 0, 10)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.15, 0.2, 0.1))
                .times(Mat4.translation(-1.3, 1.3, 10.1)),
            this.materials.yellow
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.15, 0.2, 0.1))
                .times(Mat4.translation(1.3, 1.3, 10.1)),
            this.materials.yellow
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.15, 0.2, 0.1))
                .times(Mat4.translation(-1.3, -1.3, 10.1)),
            this.materials.yellow
        );
        this.shapes.cube.draw(
            context,
            program_state,
            house_transform
                .times(Mat4.scale(0.15, 0.2, 0.1))
                .times(Mat4.translation(1.3, -1.3, 10.1)),
            this.materials.yellow
        );

        //PICNIC TABLE
        // some of the .obj is not shadowing right :(
        let picnic_transform = Mat4.identity();
        this.shapes.picnic.draw(
            context,
            program_state,
            picnic_transform
                .times(Mat4.rotation(Math.PI / 5, 0, 1, 0))
                .times(Mat4.scale(2, 2, 2))
                .times(Mat4.translation(5, -0.5, 8)),
            shadow_pass ? this.shadowed_picnic : this.pure
        );

        //TREES
        let tree_transform = Mat4.identity();
        this.shapes.sphere.draw(
            context,
            program_state,
            tree_transform
                .times(Mat4.translation(15, -3, 0))
                .times(Mat4.scale(0.7, 10, 0.7)),
            shadow_pass ? this.shadowed_wood : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            tree_transform
                .times(Mat4.translation(15, 4, 0))
                .times(Mat4.scale(3.5, 3.5, 3.5)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            tree_transform
                .times(Mat4.rotation(Math.PI / 4, 0, 0, 1))
                .times(Mat4.translation(9, -11, 0))
                .times(Mat4.scale(0.3, 1, 0.3)),
            shadow_pass ? this.shadowed_wood : this.pure
        );
        tree_transform = tree_transform
            .times(Mat4.translation(0, 0, 0))
            .times(Mat4.rotation(Math.PI, 0, 1, 0));
        this.shapes.sphere.draw(
            context,
            program_state,
            tree_transform
                .times(Mat4.translation(15, -3, 0))
                .times(Mat4.scale(0.7, 10, 0.7)),
            shadow_pass ? this.shadowed_wood : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            tree_transform
                .times(Mat4.translation(15, 4, 0))
                .times(Mat4.scale(3.5, 3.5, 3.5)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            tree_transform
                .times(Mat4.rotation(Math.PI / 4, 0, 0, 1))
                .times(Mat4.translation(9, -11, 0))
                .times(Mat4.scale(0.3, 1, 0.3)),
            shadow_pass ? this.shadowed_wood : this.pure
        );

        //FENCE
        let fence_transform = Mat4.identity().times(
            Mat4.rotation(-Math.PI / 2, 1, 0, 0)
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            fence_transform
                .times(Mat4.translation(6.5, -2, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            shadow_pass ? this.shadowed_yellow : this.pure
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            fence_transform
                .times(Mat4.translation(-6.5, -2, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            shadow_pass ? this.shadowed_yellow : this.pure
        );

        //ZOO
        //FENCES
        let zoo_transform = Mat4.identity();
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-40, -20, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-46, -20, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-52, -20, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-52, -8, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-40, -8, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-46, -8, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-37, -1.7, 11))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-37, -1.7, 17))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-55, -1.7, 11))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-55, -1.7, 17))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        zoo_transform = zoo_transform.times(Mat4.translation(0, 0, 20));
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-40, -20, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-46, -20, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-52, -20, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-52, -8, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-40, -8, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.translation(-46, -8, -1.7))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-37, -1.7, 11))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-37, -1.7, 17))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-55, -1.7, 11))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        this.shapes.fence2.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.translation(-55, -1.7, 17))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
                .times(Mat4.scale(2, 1, 1)),
            this.materials.red
        );
        //SIGN (zoo)
        this.shapes.torus.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                .times(Mat4.scale(20, 12, 4))
                .times(Mat4.translation(-0.2, -0.1, -8)),
            shadow_pass ? this.shadowed_yellow : this.pure
        );
        this.shapes.cube.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.scale(1, 3, 10))
                .times(Mat4.translation(-32, 0, 3)),
            shadow_pass ? this.shadowed_yellow : this.pure
        );
        this.shapes.cube.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.scale(1, 3, 10))
                .times(Mat4.translation(-32, 0, -2)),
            shadow_pass ? this.shadowed_yellow : this.pure
        );
        this.shapes.zoo_text.set_string("ZOO", context.context);
        this.shapes.zoo_text.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.scale(2, 2, 2))
                .times(Mat4.translation(-15, 3, 3.5))
                .times(Mat4.rotation(Math.PI / 2, 0, 1, 0)),
            this.materials.zoo_text
        );
        //BUSHES
        this.shapes.sphere.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.scale(1.5, 1.5, 1.5))
                .times(Mat4.translation(-19, -1.5, -2)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            zoo_transform
                .times(Mat4.scale(1.5, 1.5, 1.5))
                .times(Mat4.translation(-19, -1.5, 7.45)),
            shadow_pass ? this.shadowed_green : this.pure
        );

        //PATH
        let path_transform = Mat4.identity();
        this.shapes.cube.draw(
            context,
            program_state,
            path_transform
                .times(Mat4.scale(27, 1, 3))
                .times(Mat4.translation(-1.1, -3.95, 8)),
            !shadow_pass ? this.shadowed_path : this.materials.path
        );
        this.shapes.cube.draw(
            context,
            program_state,
            path_transform
                .times(Mat4.scale(3, 1, 50))
                .times(Mat4.translation(0, -3.95, 1)),
            !shadow_pass ? this.shadowed_path : this.materials.path
        );

        //CLOUDS
        //let cloud_transform = Mat4.identity();
        //this.shapes.sphere.draw()

        //MIFFY
        let miffy_transform = Mat4.identity().times(Mat4.translation(0, 0, 7));
        this.shapes.miffy.draw(
            context,
            program_state,
            miffy_transform,
            this.materials.miffy
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_transform
                .times(Mat4.translation(0.5, 0, 1.2))
                .times(Mat4.scale(0.1, 0.1, 0.1)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_transform
                .times(Mat4.translation(-0.5, 0, 1.2))
                .times(Mat4.scale(0.1, 0.1, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_transform
                .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(-0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_transform
                .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );

        //COW
        let cow_body_transform = Mat4.identity().times(Mat4.translation(-45, -.2, 13))
            .times(Mat4.scale(3, 2, 2));
        this.shapes.ball.draw(context, program_state, cow_body_transform, // Body as an oval,
            this.materials.plastic.override(cream));

        // Draw the head
        let cow_head_transform = cow_body_transform
            .times(Mat4.translation(-0.7, 1, 0))
            .times(Mat4.rotation(sway_angle, 0, 1, 0)) // Apply swaying motion
            .times(Mat4.scale(0.5, 0.5, 0.5));
        this.shapes.ball.draw(context, program_state, cow_head_transform, this.materials.plastic.override(cream));

        // Draw the legs
        const cow_leg_scale = Mat4.scale(0.2, 0.65, 0.2); // Adjust scale for legs
        const cow_leg_positions = [[.8, -.85, .4], [-.8, -.85, .4], [.5, -.65, -.2], [-.5, -.65, -.2]]; // Adjust leg positions

        const horn_scale = Mat4.scale(0.1, 0.4, 0.1); // Scale for the horns
        const horn_positions = [[.4, 1.2, 0.5], [.5, 1.2, -.5]]; // Positions for the horns

        for (let pos of horn_positions) {
            let horn_transform = cow_head_transform.times(Mat4.translation(...pos))
                .times(horn_scale);
            this.shapes.box.draw(context, program_state, horn_transform, this.materials.plastic.override(brown));
        }

        // Draw the eye
        let cow_eye_transform = cow_head_transform.times(Mat4.translation(.2, .2, .9))
            .times(Mat4.scale(0.12, 0.2, 0.2)); // Scale and position for the eye
        this.shapes.ball.draw(context, program_state, cow_eye_transform, this.materials.black);

        for (let pos of cow_leg_positions) {
            let cow_leg_transform = cow_body_transform.times(Mat4.translation(...pos))
                .times(cow_leg_scale);
            this.shapes.ball.draw(context, program_state, cow_leg_transform, this.materials.plastic.override(cream));
        }

        const cow_ear_scale = Mat4.scale(.1, 0.3, 0.65); // Scale for the horns
        const cow_ear_positions = [[.4, .65, 0.5], [.5, .65, -.5]]; // Positions for the horns

        for (let pos of cow_ear_positions) {
            let cow_ear_transform = cow_head_transform.times(Mat4.translation(...pos))
                .times(cow_ear_scale);
            this.shapes.ball.draw(context, program_state, cow_ear_transform, this.materials.plastic.override(cream));
        }


        //LION

        let body_transform =Mat4.identity().times(Mat4.translation(-45, -.2, 37))
            .times(Mat4.scale(4, 2, 2)); // Body as an oval
        this.shapes.ball.draw(context, program_state, body_transform, this.materials.plastic.override(tan));

        // Draw the head
        let head_transform = body_transform.times(Mat4.translation(-0.8, 1.02, 0))
            .times(Mat4.rotation(sway_angle, 0, 1, 0)) // Apply swaying motion
            .times(Mat4.scale(0.5, 0.5, 0.5));
        this.shapes.ball.draw(context, program_state, head_transform, this.materials.plastic.override(tan));

        // Draw the legs
        const leg_scale = Mat4.scale(0.2, 0.65, 0.2); // Adjust scale for legs
        const leg_positions = [[.8, -.85, .4], [-.8, -.85, .4], [.8, -.85, -.4], [-.8, -.85, -.4]]; // Adjust leg positions

        const mane_scale = Mat4.scale(0.6, 0.8, 0.5); // Scale for the horns
        const mane_positions =
            [[.4, 1.2, 0.5], [.5, 1.2, -.5],[.3,.6,.8],[.3,.6,-.8], [.9,.5,.6],[.9,.5,-.6],
                [1.2,.65,0],[.9,1.2,0], [0,1.2,0],
                [0,-1.2,0],[.5,-1.2,.5],[.5,-1.2,-.5],
                [.4, -1.2, 0.5], [.5, -1.2, -.5],[.3,-.6,.8],[.3,-.6,-.8], [.9,-.5,.6],[.9,-.5,-.6]]; // Positions for the horns

        for (let pos of mane_positions) {
            let mane_transform = head_transform.times(Mat4.translation(...pos))
                .times(mane_scale);
            this.shapes.ball.draw(context, program_state, mane_transform, this.materials.plastic.override(brown));
        }

        // Draw the eye
        let eye_transform = head_transform.times(Mat4.translation(-.7, .3, .70))
            .times(Mat4.scale(0.12, 0.2, 0.1)); // Scale and position for the eye
        this.shapes.ball.draw(context, program_state, eye_transform, this.materials.black);

        let eye2_transform = head_transform.times(Mat4.translation(-.7, .3, -.70))
            .times(Mat4.scale(0.12, 0.2, 0.2)); // Scale and position for the eye
        this.shapes.ball.draw(context, program_state, eye2_transform, this.materials.black);

        // Draw the eye
        let nose_transform = head_transform.times(Mat4.translation(-.95, .2, 0))
            .times(Mat4.scale(0.12, 0.2, 0.4)); // Scale and position for the eye
        this.shapes.ball.draw(context, program_state, nose_transform, this.materials.black);

        for (let pos of leg_positions) {
            let leg_transform = body_transform.times(Mat4.translation(...pos))
                .times(leg_scale);
            this.shapes.ball.draw(context, program_state, leg_transform, this.materials.plastic.override(tan));
        }

        const ear_scale = Mat4.scale(.1, 0.3, 0.65); // Scale for the horns
        const ear_positions = [[.4, .65, 0.5], [.5, .65, -.5]]; // Positions for the horns

        for (let pos of ear_positions) {
            let ear_transform = head_transform.times(Mat4.translation(...pos))
                .times(ear_scale);
            this.shapes.ball.draw(context, program_state, ear_transform, this.materials.plastic.override(tan));
        }

    }


    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        const t = program_state.animation_time;
        const gl = context.context;

        if (!this.init_ok) {
            const ext = gl.getExtension("WEBGL_depth_texture");
            if (!ext) {
                return alert("need WEBGL_depth_texture"); // eslint-disable-line
            }
            this.texture_buffer_init(gl);

            this.init_ok = true;
        }

        if (!context.scratchpad.controls) {
            this.children.push(
                (context.scratchpad.controls = new defs.Movement_Controls())
            );
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 50), vec3(0, 0, 0), vec3(0, 1, 0))
            ); // Locate the camera here
        }

        // The position of the light

        // *** LIGHT POSITION *** //
        // We could easily adjust this to account for the "time of day"

        this.light_position = Mat4.identity().times(vec4(3, 30, 0, 1));
        // this.light_position = Mat4.rotation(t / 1500, 0, 1, 0).times(vec4(3, 30, 0, 1));  // this one is like rotating

        // The color of the light
        this.light_color = color(1, 1, 1, 1);

        // This is a rough target of the light.
        // Although the light is point light, we need a target to set the POV of the light
        this.light_view_target = vec4(0, 0, 0, 1);
        this.light_field_of_view = (130 * Math.PI) / 180; // 130 degree

        program_state.lights = [
            new Light(this.light_position, this.light_color, 1000),
        ];

        // Step 1: set the perspective and camera to the POV of light
        const light_view_mat = Mat4.look_at(
            vec3(
                this.light_position[0],
                this.light_position[1],
                this.light_position[2]
            ),
            vec3(
                this.light_view_target[0],
                this.light_view_target[1],
                this.light_view_target[2]
            ),
            vec3(0, 1, 0) // assume the light to target will have a up dir of +y, maybe need to change according to your case
        );
        const light_proj_mat = Mat4.perspective(
            this.light_field_of_view,
            1,
            0.5,
            500
        );
        // Bind the Depth Texture Buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.viewport(
            0,
            0,
            this.lightDepthTextureSize,
            this.lightDepthTextureSize
        );
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Prepare uniforms
        program_state.light_view_mat = light_view_mat;
        program_state.light_proj_mat = light_proj_mat;
        program_state.light_tex_mat = light_proj_mat;
        program_state.view_mat = light_view_mat;
        program_state.projection_transform = light_proj_mat;
        this.render_scene(context, program_state, false, false, false);

        // Step 2: unbind, draw to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        program_state.view_mat = program_state.camera_inverse;
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4,
            context.width / context.height,
            0.5,
            500
        );
        this.render_scene(context, program_state, true, true, true);
        if (this.title) {
            program_state.set_camera(
                Mat4.look_at(vec3(10, 55, 30), vec3(10, 55, 0), vec3(0, 1, 0))
            );
            let title_transform = Mat4.identity().times(
                Mat4.translation(0, 60, 0)
            );
            this.shapes.text.set_string("miffy's big day", context.context);
            this.shapes.text.draw(
                context,
                program_state,
                title_transform,
                this.materials.text_image
            );
            let subtitle_transform = title_transform
                .times(Mat4.scale(0.5, 0.5, 0.5))
                .times(Mat4.translation(4, -10, 0));
            this.shapes.text.set_string(
                "press enter to continue",
                context.context
            );
            if (Math.floor((t/1000) % 2) === 1) {
                this.shapes.text.draw(
                    context,
                    program_state,
                    subtitle_transform,
                    this.materials.text_image
                );
            }
        } else if (this.first_scene) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
        }
    }
}
