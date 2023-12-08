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
const { Cube, Subdivision_Sphere } = defs;

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
            ball: new Subdivision_Sphere(4),
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
            sky_2: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.1,
                specularity: 0,
                color: hex_color("#FF9720"),
            }),
            sky_3: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.1,
                specularity: 0,
                color: hex_color("#00285D"),
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
            pink: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#F4BFD4"),
            }),
            blue: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#8aa6b8"),
            }),
            royal: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#4169e1"),
            }),
            cloud: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 1,
                specularity: 0.8,
                color: hex_color("#FCFBF4"),
            }),
            orange: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("#FFA500"),
            }),
            clear: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 1,
                specularity: 0,
                color: hex_color("rgba(255,255,255,0)"),
            }),
            watermelon: new Material(new defs.Textured_Phong(1), {
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                texture: new Texture("assets/watermelon.png"),
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
        this.cow_print = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: hex_color("#f2f2f2"),
            ambient: 0.3,
            diffusivity: 0.5,
            specularity: 0.5,
            color_texture: new Texture("assets/cow_print.png"),
            light_depth_texture: null,
        });
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
            ambient: 0.5,
            diffusivity: 1,
            specularity: 0.1,
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
            diffusivity: 0.65,
            specularity: 1,
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
        this.shadowed_miffy = new Material(
            new Shadow_Textured_Phong_Shader(1),
            {
                color: color(1, 1, 1, 1),
                ambient: 0.5,
                diffusivity: 1,
                specularity: 0,
                smoothness: 100,
                color_texture: null,
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
        this.title = true; //title screen
        this.first_scene = false; //Im miffy intro
        this.scene_1_b = false; //Do you wanna join?
        this.scene_1_yes = false; //yay, im so excited
        this.scene_1_no = false; //oh, thats too bad
        this.scene_2_a = false; // what scarf do i wear?
        this.scene_2_red = false; // I love it! (red toggle)
        this.scene_2_blue = false; // I love it!( blue toggle)
        this.scene_3_a = false; // lets go to the zoo!
        this.scene_3_b = false; //what animal do i see?
        this.scene_3_lion = false; // So cool! (stare at lion)
        this.scene_3_cow = false; //so cool! (stare at cow)
        this.scene_4_a = false; //What should I eat?
        this.scene_4_orange = false; //orange table
        this.scene_4_other = false; //other food on the table
        this.scene_5_a = false; //Wow what a long day
        this.scene_5_b = false; //I hope you had fun, I sure did!
        this.scene_final = false; //Fin.

        this.scarf = false;
        this.scarf_red = false;
        this.scarf_blue = false;

        // *** BUTTON STATES *** //
        this.is_picking = false;
        this.left_button = false;
        this.right_button = false;

        // *** CAMERA STATE *** //
        // this.attached

        //TRANSFORMATION MATRICES
        this.miffy_transform = Mat4.identity().times(Mat4.translation(0, 0, 7));

        //TIME
        this.balloon_start = -1;
        this.final_start = -1;
        this.sky_start = -1;
        this.movie_start = -1;
        this.scene3_move = -1;
    }

    playsound(current_scene) {
        let speak = new Audio("./assets/miffy_speaks.mp3");

        if (current_scene == "scene_1_b") {
            // set picking mode to true
            speak.play();
        } else if (current_scene == "scene_2_a") {
            speak.play();
        } else if (current_scene == "scene_3_b") {
            speak.play();
        } else if (current_scene == "scene_4_a") {
            speak.play();
        } else if (current_scene == "default") {
            speak.play();
        }
        this.scene1_move = -1;
    }

    make_control_panel() {
        this.key_triggered_button("Enter", ["Enter"], () => {
            if (this.title) {
                this.title = false;
                this.first_scene = true;

                this.playsound("default");
            } else if (this.first_scene) {
                this.first_scene = false;
                this.scene_1_b = true;

                this.playsound("default");
            }
            // else if(this.scene_1_b){
            //     this.scene_1_b = false;
            //     this.scene_1_yes = true;
            // }
            else if (this.scene_1_yes) {
                this.scene_1_yes = false;
                this.scene_2_a = true;

                this.playsound("default");
            } else if (this.scene_1_no) {
                this.scene_1_no = false;
                this.scene_final = true;

                this.playsound("default");
            }
            // else if (this.scene_2_a) {
            //     //Option Picker
            //     this.scene_2_a = false;
            //     this.scene_2_red = true;}
            else if (this.scene_2_red) {
                this.scene_2_red = false;
                this.scene_3_a = true;

                this.playsound("default");

                //no current mapping to blue
            } else if (this.scene_2_blue) {
                this.scene_2_blue = false;
                this.scene_3_a = true;

                this.playsound("default");
            } else if (this.scene_3_a) {
                this.scene_3_a = false;
                this.scene_3_b = true;
                this.miffy_transform = this.miffy_transform
                    .times(Mat4.translation(0, 0, -7))
                    .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
                    .times(Mat4.translation(-24, 0, -20));

                this.playsound("default");
            }
            // else if (this.scene_3_b) {
            //         this.scene_3_b = false;
            //         this.scene_3_lion = true;
            // }
            else if (this.scene_3_lion) {
                this.scene_3_lion = false;
                this.scene_4_a = true;

                this.playsound("default");
            } else if (this.scene_3_cow) {
                this.scene_3_cow = false;
                this.scene_4_a = true;

                this.playsound("default");
            }
            //     else if (this.scene_4_a) {
            //     //Option Picker
            //     this.scene_4_a = false;
            //     this.scene_4_orange = true;
            // }
            else if (this.scene_4_orange) {
                this.scene_4_orange = false;
                this.scene_5_a = true;

                this.playsound("default");

                //No current mapping to other fruit
            } else if (this.scene_4_other) {
                this.scene_4_other = false;
                this.scene_5_a = true;

                this.playsound("default");
            } else if (this.scene_5_a) {
                this.scene_5_a = false;
                this.scene_5_b = true;

                this.playsound("default");
            } else if (this.scene_5_b) {
                this.scene_5_b = false;
                this.scene_final = true;

                this.playsound("default");
            }
            // else if(this.scene_2_a){
            //     this.scene_2_a = false;
            //     this.scene_2_red = true;
            // }
        });
        this.key_triggered_button(
            "Move to miffy",
            ["Control", "0"],
            () => (this.attached = () => this.miffy_camera)
        );
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

        this.shadowed_miffy.light_depth_texture = this.light_depth_texture;

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

    my_mouse_down(e, pos, context, program_state) {
        let pos_ndc_near = vec4(pos[0], pos[1], -1.0, 1.0);
        let pos_ndc_far = vec4(pos[0], pos[1], 1.0, 1.0);
        let center_ndc_near = vec4(0.0, 0.0, -1.0, 1.0);
        let P = program_state.projection_transform;
        let V = program_state.camera_inverse;
        let pos_world_near = Mat4.inverse(P.times(V)).times(pos_ndc_near);
        let pos_world_far = Mat4.inverse(P.times(V)).times(pos_ndc_far);
        let center_world_near = Mat4.inverse(P.times(V)).times(center_ndc_near);
        pos_world_near.scale_by(1 / pos_world_near[3]);
        pos_world_far.scale_by(1 / pos_world_far[3]);
        center_world_near.scale_by(1 / center_world_near[3]);
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
        const t = (this.t = program_state.animation_time);
        const time = t / 1000; // seconds
        const sway_angle = (Math.sin(time) * Math.PI) / 8; // Sway back and forth up to +/- 22.5 degrees
        const brown = color(0.24, 0.1, 0.1, 1); // Brown color for the horns
        const cream = color(1, 0.98, 0.82, 1); // Adjust RGB values for desired shade of cream
        const tan = color(0.788, 0.58, 0.396, 1);

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
        {
            let ground_transform = Mat4.identity()
                .times(Mat4.scale(80, 1, 100))
                .times(Mat4.translation(0, -4, 0));
            this.shapes.cube.draw(
                context,
                program_state,
                ground_transform,
                shadow_pass ? this.grass : this.pure
            );
        }

        //HILLS
        let hills_transform = Mat4.identity();
        {
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
        }

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
        {
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
        }

        //PICNIC TABLE
        // some of the .obj is not shadowing right :(
        {
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
        }
        let bush = Mat4.identity();
        this.shapes.ball.draw(
            context,
            program_state,
            bush.times(Mat4.translation(30, -3, 3)).times(Mat4.scale(2, 2, 2)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.ball.draw(
            context,
            program_state,
            bush
                .times(Mat4.translation(31, -3.2, 4))
                .times(Mat4.scale(1.8, 1.8, 1.8)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.ball.draw(
            context,
            program_state,
            bush
                .times(Mat4.translation(30.5, -3.6, 4.9))
                .times(Mat4.scale(1.7, 1.7, 1.7)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.ball.draw(
            context,
            program_state,
            bush
                .times(Mat4.translation(28, -3.6, 3))
                .times(Mat4.scale(1.7, 1.7, 1.7)),
            shadow_pass ? this.shadowed_green : this.pure
        );
        this.shapes.ball.draw(
            context,
            program_state,
            bush
                .times(Mat4.translation(29, -2.9, 4))
                .times(Mat4.scale(1.3, 1.3, 1.3)),
            shadow_pass ? this.shadowed_green : this.pure
        );

        //TREES
        {
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
            tree_transform = tree_transform.times(Mat4.translation(-40, 0, 10));
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
            tree_transform = tree_transform.times(Mat4.translation(-5, 0, -7));
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
        }

        //FENCE
        {
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
        }

        //ZOO
        {
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
        }

        //PATH
        {
            let path_transform = Mat4.identity();
            this.shapes.cube.draw(
                context,
                program_state,
                path_transform
                    .times(Mat4.scale(27, 1, 3))
                    .times(Mat4.translation(-1.1, -3.95, 8)),
                shadow_pass ? this.shadowed_path : this.pure
            );
            this.shapes.cube.draw(
                context,
                program_state,
                path_transform
                    .times(Mat4.scale(3, 1, 50))
                    .times(Mat4.translation(0, -3.95, 1)),
                shadow_pass ? this.shadowed_path : this.pure
            );
        }

        //CLOUDS
        //let cloud_transform = Mat4.identity();
        //this.shapes.sphere.draw()

        // draw miffy
        if (this.scene3_move === -1) {
            this.shapes.miffy.draw(
                context,
                program_state,
                this.miffy_transform,
                shadow_pass ? this.shadowed_miffy : this.pure
            );
            this.shapes.sphere.draw(
                context,
                program_state,
                this.miffy_transform
                    .times(Mat4.translation(0.6, 0, 1.2))
                    .times(Mat4.scale(0.1, 0.15, 0.1)),
                this.materials.black
            );
            this.shapes.sphere.draw(
                context,
                program_state,
                this.miffy_transform
                    .times(Mat4.translation(-0.6, 0, 1.2))
                    .times(Mat4.scale(0.1, 0.15, 0.1)),
                this.materials.black
            );
            this.shapes.cube.draw(
                context,
                program_state,
                this.miffy_transform
                    .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                    .times(Mat4.translation(-0.25, -0.4, 1.15))
                    .times(Mat4.scale(0.15, 0.03, 0.1)),
                this.materials.black
            );
            this.shapes.cube.draw(
                context,
                program_state,
                this.miffy_transform
                    .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                    .times(Mat4.translation(0.25, -0.4, 1.15))
                    .times(Mat4.scale(0.15, 0.03, 0.1)),
                this.materials.black
            );
            if (this.scarf) {
                this.shapes.sphere.draw(
                    context,
                    program_state,
                    this.miffy_transform
                        .times(Mat4.translation(0, -1, 0))
                        .times(Mat4.scale(1, 1, 1)),
                    shadow_pass
                        ? this.scarf_red
                            ? this.shadowed_red
                            : this.scarf_blue
                            ? this.materials.royal
                            : this.materials.clear
                        : this.pure
                );
                this.shapes.cube.draw(
                    context,
                    program_state,
                    this.miffy_transform
                        .times(Mat4.rotation(Math.PI / 8, -1, 0, 1))
                        .times(Mat4.translation(0.15, -1.8, 0.6))
                        .times(Mat4.scale(0.2, 0.5, 0.05)),
                    shadow_pass
                        ? this.scarf_red
                            ? this.shadowed_red
                            : this.scarf_blue
                            ? this.materials.royal
                            : this.materials.clear
                        : this.pure
                );
            }
        }
        this.miffy_camera = Mat4.inverse(
            this.miffy_transform.times(Mat4.translation(0, 0, -35))
        );

        //COW
        let cow_body_transform = Mat4.identity()
            .times(Mat4.translation(-45, -0.2, 13))
            .times(Mat4.scale(3, 2, 2))
            .times(Mat4.rotation(0.8, 0, 1, 0));
        this.shapes.ball.draw(
            context,
            program_state,
            cow_body_transform, // Body as an oval,
            shadow_pass ? this.cow_print : this.pure
        );

        // Draw the head
        let cow_head_transform = cow_body_transform
            .times(Mat4.translation(-0.7, 1, 0))
            .times(Mat4.rotation(sway_angle, 0, 1, 0)) // Apply swaying motion
            .times(Mat4.scale(0.5, 0.5, 0.5));
        this.shapes.ball.draw(
            context,
            program_state,
            cow_head_transform,
            shadow_pass ? this.cow_print : this.pure
        );

        // Draw the legs
        const cow_leg_scale = Mat4.scale(0.2, 0.65, 0.2); // Adjust scale for legs
        const cow_leg_positions = [
            [0.8, -0.85, 0.4],
            [-0.8, -0.85, 0.4],
            [0.5, -0.65, -0.2],
            [-0.5, -0.65, -0.2],
        ]; // Adjust leg positions

        const horn_scale = Mat4.scale(0.1, 0.4, 0.1); // Scale for the horns
        const horn_positions = [
            [0.4, 1.2, 0.5],
            [0.5, 1.2, -0.5],
        ]; // Positions for the horns

        for (let pos of horn_positions) {
            let horn_transform = cow_head_transform
                .times(Mat4.translation(...pos))
                .times(horn_scale);
            this.shapes.box.draw(
                context,
                program_state,
                horn_transform,
                this.materials.plastic.override(brown)
            );
        }

        // Draw the eye
        let cow_eye_transform = cow_head_transform
            .times(Mat4.translation(0.2, 0.2, 0.9))
            .times(Mat4.scale(0.12, 0.2, 0.2)); // Scale and position for the eye
        this.shapes.ball.draw(
            context,
            program_state,
            cow_eye_transform,
            this.materials.black
        );

        for (let pos of cow_leg_positions) {
            let cow_leg_transform = cow_body_transform
                .times(Mat4.translation(...pos))
                .times(cow_leg_scale);
            this.shapes.ball.draw(
                context,
                program_state,
                cow_leg_transform,
                shadow_pass ? this.cow_print : this.pure
            );
        }

        const cow_ear_scale = Mat4.scale(0.1, 0.3, 0.65); // Scale for the horns
        const cow_ear_positions = [
            [0.4, 0.65, 0.5],
            [0.5, 0.65, -0.5],
        ]; // Positions for the horns

        for (let pos of cow_ear_positions) {
            let cow_ear_transform = cow_head_transform
                .times(Mat4.translation(...pos))
                .times(cow_ear_scale);
            this.shapes.ball.draw(
                context,
                program_state,
                cow_ear_transform,
                shadow_pass ? this.cow_print : this.pure
            );
        }

        //LION

        let body_transform = Mat4.identity()
            .times(Mat4.translation(-45, -0.2, 37))
            .times(Mat4.scale(4, 2, 2)); // Body as an oval
        this.shapes.ball.draw(
            context,
            program_state,
            body_transform,
            this.materials.plastic.override(tan)
        );

        // Draw the head
        let head_transform = body_transform
            .times(Mat4.translation(-0.8, 1.02, 0))
            .times(Mat4.rotation(sway_angle, 0, 1, 0)) // Apply swaying motion
            .times(Mat4.scale(0.5, 0.5, 0.5));
        this.shapes.ball.draw(
            context,
            program_state,
            head_transform,
            this.materials.plastic.override(tan)
        );

        // Draw the legs
        const leg_scale = Mat4.scale(0.2, 0.65, 0.2); // Adjust scale for legs
        const leg_positions = [
            [0.8, -0.85, 0.4],
            [-0.8, -0.85, 0.4],
            [0.8, -0.85, -0.4],
            [-0.8, -0.85, -0.4],
        ]; // Adjust leg positions

        const mane_scale = Mat4.scale(0.6, 0.8, 0.5); // Scale for the horns
        const mane_positions = [
            [0.4, 1.2, 0.5],
            [0.5, 1.2, -0.5],
            [0.3, 0.6, 0.8],
            [0.3, 0.6, -0.8],
            [0.9, 0.5, 0.6],
            [0.9, 0.5, -0.6],
            [1.2, 0.65, 0],
            [0.9, 1.2, 0],
            [0, 1.2, 0],
            [0, -1.2, 0],
            [0.5, -1.2, 0.5],
            [0.5, -1.2, -0.5],
            [0.4, -1.2, 0.5],
            [0.5, -1.2, -0.5],
            [0.3, -0.6, 0.8],
            [0.3, -0.6, -0.8],
            [0.9, -0.5, 0.6],
            [0.9, -0.5, -0.6],
        ]; // Positions for the horns

        for (let pos of mane_positions) {
            let mane_transform = head_transform
                .times(Mat4.translation(...pos))
                .times(mane_scale);
            this.shapes.ball.draw(
                context,
                program_state,
                mane_transform,
                this.materials.plastic.override(brown)
            );
        }

        // Draw the eye
        let eye_transform = head_transform
            .times(Mat4.translation(-0.7, 0.3, 0.7))
            .times(Mat4.scale(0.12, 0.2, 0.1)); // Scale and position for the eye
        this.shapes.ball.draw(
            context,
            program_state,
            eye_transform,
            this.materials.black
        );

        let eye2_transform = head_transform
            .times(Mat4.translation(-0.7, 0.3, -0.7))
            .times(Mat4.scale(0.12, 0.2, 0.2)); // Scale and position for the eye
        this.shapes.ball.draw(
            context,
            program_state,
            eye2_transform,
            this.materials.black
        );

        // Draw the eye
        let nose_transform = head_transform
            .times(Mat4.translation(-0.95, 0.2, 0))
            .times(Mat4.scale(0.12, 0.2, 0.4)); // Scale and position for the eye
        this.shapes.ball.draw(
            context,
            program_state,
            nose_transform,
            this.materials.black
        );

        for (let pos of leg_positions) {
            let leg_transform = body_transform
                .times(Mat4.translation(...pos))
                .times(leg_scale);
            this.shapes.ball.draw(
                context,
                program_state,
                leg_transform,
                this.materials.plastic.override(tan)
            );
        }

        const ear_scale = Mat4.scale(0.1, 0.3, 0.65); // Scale for the horns
        const ear_positions = [
            [0.4, 0.65, 0.5],
            [0.5, 0.65, -0.5],
        ]; // Positions for the horns

        for (let pos of ear_positions) {
            let ear_transform = head_transform
                .times(Mat4.translation(...pos))
                .times(ear_scale);
            this.shapes.ball.draw(
                context,
                program_state,
                ear_transform,
                this.materials.plastic.override(tan)
            );
        }
    }
    render_scene_1(context, program_state) {
        //this scene will be the intro. Miffy will introduce herself then ask if you're ready to embark
        //on her fun day/journey with her. It will end with a prompt of either yes or no
        const time = program_state.animation_time / 1000;
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string(
            "Hi, my name is Miffy and I'm so ",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let Line_2_transform = Mat4.identity().times(
            Mat4.translation(-15.1, 7, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string(
            "excited for our adventure!",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_2_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(5.2, 7, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_1_b(context, program_state) {
        //this scene will ask if you are ready to embark on Miffy's big day with her
        // console.log("SCENE 1_B: WOULD YOU LIKE TO JOIN");

        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );

        this.shapes.text.set_string("Would you like to join?", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );

        let Button_1 = Mat4.identity().times(
            Mat4.scale(2.4, 1, 0.01).times(Mat4.translation(-2, -1.6, 1500))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1,
            this.materials.black
        );
        let Button_1_cover = Button_1.times(
            Mat4.scale(0.98, 0.95, 0.5).times(Mat4.translation(0, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1_cover,
            this.materials.pink
        );
        let Line_2_transform = Button_1_cover.times(
            Mat4.translation(-0.27, -0.16, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("Yes", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_2_transform,
            this.materials.text_image
        );

        let Button_2 = Mat4.identity().times(
            Mat4.scale(2.4, 1, 0.01).times(Mat4.translation(2, -1.6, 1500))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2,
            this.materials.black
        );
        let Button_2_cover = Button_2.times(
            Mat4.scale(0.98, 0.95, 0.5).times(Mat4.translation(0, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2_cover,
            this.materials.blue
        );
        let Line_3_transform = Button_2_cover.times(
            Mat4.translation(-0.22, -0.15, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("No", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_3_transform,
            this.materials.text_image
        );
    }

    render_scene_1_yes(context, program_state) {
        //this scene will be the intro. Miffy will introduce herself then ask if you're ready to embark
        //on her fun day/journey with her. It will end with a prompt of either yes or no
        let time = program_state.animation_time / 1000;
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string("Yay! I'm so excited! ", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(1, 8, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_1_no(context, program_state) {
        console.log("SCENE_1_NO: No, you don't want to join Miffy's day");

        //this scene will be the intro. Miffy will introduce herself then ask if you're ready to embark
        //on her fun day/journey with her. It will end with a prompt of either yes or no
        let time = program_state.animation_time / 1000;
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string(
            "Oh, well that's too bad ",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(2.5, 8, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_2_a(context, program_state) {
        let time = program_state.animation_time / 1000;
        //this scene will ask if you are ready to embark on Miffy's big day with her
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string("Help me pick an outfit!", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let Line_4_transform = Mat4.identity().times(
            Mat4.translation(-15, 7, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string(
            "What color scarf do I wear?",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_4_transform,
            this.materials.text_image
        );

        let Button_1 = Mat4.identity().times(
            Mat4.scale(2.4, 1, 0.01).times(Mat4.translation(-2, -1.6, 1500))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1,
            this.materials.black
        );
        let Button_1_cover = Button_1.times(
            Mat4.scale(0.98, 0.95, 0.5).times(Mat4.translation(0, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1_cover,
            this.materials.red
        );
        let Line_2_transform = Button_1_cover.times(
            Mat4.translation(-0.27, -0.16, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("Red", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_2_transform,
            this.materials.text_image
        );

        let Button_2 = Mat4.identity().times(
            Mat4.scale(2.4, 1, 0.01).times(Mat4.translation(2, -1.6, 1500))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2,
            this.materials.black
        );
        let Button_2_cover = Button_2.times(
            Mat4.scale(0.98, 0.95, 0.5).times(Mat4.translation(0, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2_cover,
            this.materials.royal
        );
        let Line_3_transform = Button_2_cover.times(
            Mat4.translation(-0.3, -0.15, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("Blue", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_3_transform,
            this.materials.text_image
        );
    }
    render_scene_2_red(context, program_state) {
        let time = program_state.animation_time / 1000;
        this.scarf_red = true;
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string("I love it!", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(-7.5, 8, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }
    render_scene_2_blue(context, program_state) {
        let time = program_state.animation_time / 1000;
        this.scarf_blue = true;
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string("I love it!", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(-7.5, 8, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_3_a(context, program_state) {
        let time = program_state.animation_time / 1000;
        // timing for animation
        if (this.scene3_move === -1) {
            this.scene3_move = time + 8;
        }

        this.render_miffy_scene3a(context, program_state, true, 7 + 1.5 *  time - this.scene3_move);

        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string("Let's go to the Zoo!", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(1, 8, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_3_b(context, program_state) {
        // set flag back so miffy still renders
        this.scene3_move = -1;
        let Line_1_transform = Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 1, 0))
            .times(Mat4.translation(-39, 7.5, -20))
            .times(Mat4.scale(0.5, 0.5, 0.5));
        this.shapes.text.set_string(
            "What animal should we see?",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );

        let new_origin = Mat4.identity()
            .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
            .times(Mat4.translation(-24, 0, -25));

        let Button_1 = new_origin.times(
            Mat4.scale(2.4, 1, 0.01).times(Mat4.translation(-2, -1.6, 1500))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1,
            this.materials.black
        );
        let Button_1_cover = Button_1.times(
            Mat4.scale(0.98, 0.95, 0.5).times(Mat4.translation(0, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1_cover,
            this.materials.pink
        );
        let Line_2_transform = Button_1_cover.times(
            Mat4.translation(-0.27, -0.16, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("Cow", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_2_transform,
            this.materials.text_image
        );

        let Button_2 = new_origin.times(
            Mat4.scale(2.4, 1, 0.01).times(Mat4.translation(2, -1.6, 1500))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2,
            this.materials.black
        );
        let Button_2_cover = Button_2.times(
            Mat4.scale(0.98, 0.95, 0.5).times(Mat4.translation(0, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2_cover,
            this.materials.blue
        );
        let Line_3_transform = Button_2_cover.times(
            Mat4.translation(-0.3, -0.15, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("Lion", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_3_transform,
            this.materials.text_image
        );
    }

    render_scene_3_lion(context, program_state) {
        let time = program_state.animation_time / 1000;

        let new_origin = Mat4.identity()
            .times(Mat4.rotation(-Math.PI / 1.5, 0, 1, 0))
            .times(Mat4.translation(45, 0, 20));

        let Line_1_transform = new_origin.times(
            Mat4.translation(5, 7, 2)
                .times(Mat4.scale(0.5, 0.5, 0.5))
                .times(Mat4.rotation(-0.05, 0, 1, 0))
        );
        this.shapes.text.set_string("Wow! So Majestic!", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Line_1_transform.times(
            Mat4.translation(0, -3, 0).times(Mat4.scale(0.6, 0.6, 0.6))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_3_cow(
        context,
        program_state,
        shadow_pass,
        draw_light_source = false,
        draw_shadow = false
    ) {
        let time = program_state.animation_time / 1000;
        let light_position = this.light_position;
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

        let miffy_cow_transform = Mat4.identity().times(
            Mat4.translation(-43, 0, 24.5)
                .times(Mat4.scale(0.6, 0.6, 0.6))
                .times(Mat4.rotation(-5, 0, 1, 0))
        );
        this.shapes.miffy.draw(
            context,
            program_state,
            miffy_cow_transform,
            shadow_pass ? this.shadowed_miffy : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.translation(0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.translation(-0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(-0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        if (this.scarf) {
            this.shapes.sphere.draw(
                context,
                program_state,
                miffy_cow_transform
                    .times(Mat4.translation(0, -1, 0))
                    .times(Mat4.scale(1, 1, 1)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
            this.shapes.cube.draw(
                context,
                program_state,
                miffy_cow_transform
                    .times(Mat4.rotation(Math.PI / 8, -1, 0, 1))
                    .times(Mat4.translation(0.15, -1.8, 0.6))
                    .times(Mat4.scale(0.2, 0.5, 0.05)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
        }

        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-80, 12, 8)
                .times(Mat4.scale(0.9, 0.9, 0.9))
                .times(Mat4.rotation(13.05, 0, 1, 0))
        );
        this.shapes.text.set_string("Look! This cow is so cute!", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(-42, 7.1, 8)
                .times(Mat4.scale(0.4, 0.4, 0.4))
                .times(Mat4.rotation(13.05, 0, 1, 0))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_4_a(
        context,
        program_state,
        shadow_pass,
        draw_light_source = false,
        draw_shadow = false
    ) {
        let light_position = this.light_position;
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

        let miffy_food_transform = Mat4.identity().times(
            Mat4.translation(20, 0, 6)
                .times(Mat4.scale(0.7, 0.7, 0.7))
                .times(Mat4.rotation(-0.7, 0, 1, 0))
        );

        this.shapes.miffy.draw(
            context,
            program_state,
            miffy_food_transform,
            shadow_pass ? this.shadowed_miffy : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_food_transform
                .times(Mat4.translation(0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_food_transform
                .times(Mat4.translation(-0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_food_transform
                .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(-0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_food_transform
                .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        if (this.scarf) {
            this.shapes.sphere.draw(
                context,
                program_state,
                miffy_food_transform
                    .times(Mat4.translation(0, -1, 0))
                    .times(Mat4.scale(1, 1, 1)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
            this.shapes.cube.draw(
                context,
                program_state,
                miffy_food_transform
                    .times(Mat4.rotation(Math.PI / 8, -1, 0, 1))
                    .times(Mat4.translation(0.15, -1.8, 0.6))
                    .times(Mat4.scale(0.2, 0.5, 0.05)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
        }

        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(10, 3, 3.5)
                .times(Mat4.scale(0.3, 0.3, 0.3))
                .times(Mat4.rotation(-0.13, 0, 1, 0))
        );
        this.shapes.text.set_string(
            "I'm hungry, what should I eat?",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );

        let Button_1 = Mat4.identity()
            .times(Mat4.translation(15, -1, 10))
            .times(Mat4.rotation(-0.13, 0, 1, 0))
            .times(Mat4.scale(1.2, 0.6, 0.01));
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1,
            this.materials.black
        );

        let Button_1_cover = Button_1.times(
            Mat4.scale(0.98, 0.98, 0.5).times(Mat4.translation(0.01, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_1_cover,
            this.materials.orange
        );
        let Line_2_transform = Button_1_cover.times(
            Mat4.translation(-0.55, -0.1, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("Orange", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_2_transform,
            this.materials.text_image
        );

        let Button_2 = Mat4.identity()
            .times(Mat4.translation(20, -1, 10.7))
            .times(Mat4.rotation(-0.13, 0, 1, 0))
            .times(Mat4.scale(1.2, 0.6, 0.01));
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2,
            this.materials.black
        );
        let Button_2_cover = Button_2.times(
            Mat4.scale(0.98, 0.98, 0.5).times(Mat4.translation(-0.01, 0, 5))
        );
        this.shapes.cube.draw(
            context,
            program_state,
            Button_2_cover,
            this.materials.red
        );
        let Line_3_transform = Button_2_cover.times(
            Mat4.translation(-0.45, -0.1, 10).times(Mat4.scale(0.15, 0.3, 1))
        );
        this.shapes.text.set_string("Apple", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_3_transform,
            this.materials.text_image
        );
    }

    render_scene_4_orange(
        context,
        program_state,
        shadow_pass,
        draw_light_source,
        draw_shadow
    ) {
        let time = program_state.animation_time / 1000;
        let light_position = this.light_position;
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

        let miffy_orange_transform = Mat4.identity().times(
            Mat4.translation(20, 0, 6)
                .times(Mat4.scale(0.7, 0.7, 0.7))
                .times(Mat4.rotation(-0.7, 0, 1, 0))
        );
        this.shapes.miffy.draw(
            context,
            program_state,
            miffy_orange_transform,
            shadow_pass ? this.shadowed_miffy : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_orange_transform
                .times(Mat4.translation(0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_orange_transform
                .times(Mat4.translation(-0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_orange_transform
                .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(-0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_orange_transform
                .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        if (this.scarf) {
            this.shapes.sphere.draw(
                context,
                program_state,
                miffy_orange_transform
                    .times(Mat4.translation(0, -1, 0))
                    .times(Mat4.scale(1, 1, 1)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
            this.shapes.cube.draw(
                context,
                program_state,
                miffy_orange_transform
                    .times(Mat4.rotation(Math.PI / 8, -1, 0, 1))
                    .times(Mat4.translation(0.15, -1.8, 0.6))
                    .times(Mat4.scale(0.2, 0.5, 0.05)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
        }

        let orange_transform = Mat4.identity().times(
            Mat4.translation(17, 0.55, 7).times(Mat4.scale(0.8, 0.8, 0.8))
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            orange_transform,
            shadow_pass ? this.shadowed_orange : this.pure
        );

        let plate_transform = Mat4.identity()
            .times(Mat4.translation(17, -0.3, 7))
            .times(Mat4.rotation(-11, 1, 0, 0))
            .times(Mat4.scale(0.7, 0.7, 0.05));
        this.shapes.sphere.draw(
            context,
            program_state,
            plate_transform,
            this.materials.miffy
        );

        let stem_transform = Mat4.identity()
            .times(Mat4.translation(17, 1.5, 7))
            .times(Mat4.scale(0.05, 0.15, 0.01));
        this.shapes.cube.draw(
            context,
            program_state,
            stem_transform,
            this.materials.green
        );

        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(10, 3, 3.5)
                .times(Mat4.scale(0.3, 0.3, 0.3))
                .times(Mat4.rotation(-0.13, 0, 1, 0))
                .times(Mat4.rotation(-0.13, 1, 0, 0))
        );
        this.shapes.text.set_string("So Yummy!", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(14.5, 2.8, 5)
                .times(Mat4.scale(0.15, 0.15, 0.15))
                .times(Mat4.rotation(-0.2, 0, 1, 0))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_4_other(
        context,
        program_state,
        shadow_pass,
        draw_light_source,
        draw_shadow
    ) {
        let time = program_state.animation_time / 1000;
        let light_position = this.light_position;
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

        let miffy_watermelon_transform = Mat4.identity().times(
            Mat4.translation(20, 0, 6)
                .times(Mat4.scale(0.7, 0.7, 0.7))
                .times(Mat4.rotation(-0.7, 0, 1, 0))
        );
        this.shapes.miffy.draw(
            context,
            program_state,
            miffy_watermelon_transform,
            shadow_pass ? this.shadowed_miffy : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_watermelon_transform
                .times(Mat4.translation(0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_watermelon_transform
                .times(Mat4.translation(-0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_watermelon_transform
                .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(-0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_watermelon_transform
                .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        if (this.scarf) {
            this.shapes.sphere.draw(
                context,
                program_state,
                miffy_watermelon_transform
                    .times(Mat4.translation(0, -1, 0))
                    .times(Mat4.scale(1, 1, 1)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
            this.shapes.cube.draw(
                context,
                program_state,
                miffy_watermelon_transform
                    .times(Mat4.rotation(Math.PI / 8, -1, 0, 1))
                    .times(Mat4.translation(0.15, -1.8, 0.6))
                    .times(Mat4.scale(0.2, 0.5, 0.05)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
        }

        let watermelon_transform = Mat4.identity().times(
            Mat4.translation(17, 1, 6).times(Mat4.scale(1.5, 1.5, 1.5))
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            watermelon_transform,
            shadow_pass ? this.materials.watermelon : this.pure
        );

        let plate_transform = Mat4.identity()
            .times(Mat4.translation(17, -0.3, 6.5))
            .times(Mat4.rotation(-11, 1, 0, 0))
            .times(Mat4.scale(0.7, 0.7, 0.05));
        this.shapes.sphere.draw(
            context,
            program_state,
            plate_transform,
            this.materials.miffy
        );

        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(10, 3, 3.5)
                .times(Mat4.scale(0.3, 0.3, 0.3))
                .times(Mat4.rotation(-0.13, 0, 1, 0))
                .times(Mat4.rotation(-0.13, 1, 0, 0))
        );
        this.shapes.text.set_string("This isn't an apple...", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(21, 3.2, 3.5)
                .times(Mat4.scale(0.2, 0.2, 0.2))
                .times(Mat4.rotation(-0.2, 0, 1, 0))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_5_a(context, program_state) {
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(-20, 0, 0))
                .times(Mat4.scale(80, 80, 80)),
            this.materials.sky_2
        );

        let time = program_state.animation_time / 1000;
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string(
            "Wow, what a fun adventure!",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(5.2, 8, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
    }

    render_scene_5_b(context, program_state) {
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(-20, 0, 0))
                .times(Mat4.scale(80, 80, 80)),
            this.materials.sky_2
        );

        const time = program_state.animation_time / 1000;
        if (this.balloon_start === -1) {
            this.balloon_start = time;
        }
        let Line_1_transform = Mat4.identity().times(
            Mat4.translation(-15, 8, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string(
            "I hope you had fun, let's go",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_1_transform,
            this.materials.text_image
        );
        let Line_2_transform = Mat4.identity().times(
            Mat4.translation(-15.1, 7, 5).times(Mat4.scale(0.5, 0.5, 0.5))
        );
        this.shapes.text.set_string(
            "on another adventure soon!",
            context.context
        );
        this.shapes.text.draw(
            context,
            program_state,
            Line_2_transform,
            this.materials.text_image
        );
        let enter = Mat4.identity().times(
            Mat4.translation(4.7, 7, 5).times(Mat4.scale(0.4, 0.4, 0.4))
        );
        this.shapes.text.set_string("[press enter]", context.context);
        if (Math.floor(time % 2) === 1) {
            this.shapes.text.draw(
                context,
                program_state,
                enter,
                this.materials.text_image
            );
        }
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(0, 2.2 + time - this.balloon_start, 7))
                .times(Mat4.scale(0.03, 2.1, 0.03)),
            this.materials.wall
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(0, 3.5 + time - this.balloon_start, 7))
                .times(Mat4.scale(0.6, 0.75, 0.6)),
            this.materials.red
        );
        this.render_miffy(
            context,
            program_state,
            true,
            time - this.balloon_start
        );

        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(2, 0.2 + time - this.balloon_start, 9))
                .times(Mat4.scale(0.03, 1.5, 0.03)),
            this.materials.wall
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(2, 1.5 + time - this.balloon_start, 9))
                .times(Mat4.scale(0.6, 0.75, 0.6)),
            this.materials.royal
        );
        this.render_dog(
            context,
            program_state,
            true,
            -2.36 + time - this.balloon_start
        );
    }

    sky_color() {}

    render_scene_final(context, program_state) {
        function hexToRGB(hex) {
            var r = parseInt(hex.substring(1, 3), 16) / 255;
            var g = parseInt(hex.substring(3, 5), 16) / 255;
            var b = parseInt(hex.substring(5, 7), 16) / 255;
            return { r, g, b };
        }

        var startColor = hexToRGB("#FF9720"); // Orange
        var endColor = hexToRGB("#00285D"); // Blue
        var duration = 3; // Duration in seconds
        var time2 = program_state.animation_time / 1000; // Time in seconds

        if (this.sky_start == -1) {
            this.sky_start = time2;
        }

        // Calculate interpolation factor
        var factor = Math.min((time2 - this.sky_start) / duration, 1); // Clamp between 0 and 1

        // Interpolate between the colors
        var interpolatedColor = {
            r: startColor.r + (endColor.r - startColor.r) * factor,
            g: startColor.g + (endColor.g - startColor.g) * factor,
            b: startColor.b + (endColor.b - startColor.b) * factor,
        };

        // Create the color object
        var sun_color = color(
            interpolatedColor.r,
            interpolatedColor.g,
            interpolatedColor.b,
            1
        );

        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(-20, 0, 0))
                .times(Mat4.scale(80, 80, 80)),
            this.materials.sky_3.override({ color: sun_color })
        );

        let time = program_state.animation_time / 1000;

        if (this.final_start === -1) {
            this.final_start = time;
        }
        this.render_clouds(context, program_state, true);
        let title_transform = Mat4.identity()
            .times(Mat4.translation(2.5, 57, 0))
            .times(Mat4.scale(1.5, 1.5, 1.5));
        this.shapes.text.set_string("The End.", context.context);
        this.shapes.text.draw(
            context,
            program_state,
            title_transform,
            this.materials.text_image
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(0, 51.4 + time - this.final_start, 7))
                .times(Mat4.scale(0.03, 2.1, 0.03)),
            this.materials.wall
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(0, 52.7 + time - this.final_start, 7))
                .times(Mat4.scale(0.6, 0.75, 0.6)),
            this.materials.red
        );
        this.render_miffy(
            context,
            program_state,
            true,
            50 + time - this.final_start
        );

        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(2, 49.4 + time - this.final_start, 9))
                .times(Mat4.scale(0.03, 1.5, 0.03)),
            this.materials.wall
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.translation(2, 50.7 + time - this.final_start, 9))
                .times(Mat4.scale(0.6, 0.75, 0.6)),
            this.materials.royal
        );
        this.render_dog(
            context,
            program_state,
            true,
            48 + time - this.final_start
        );
    }

    render_clouds(context, program_state) {
        let time = program_state.animation_time / 1000;
        let sway_offset = Math.sin(time) * 2; // Swaying amount, adjust the multiplier for amplitude

        // Define the base transformations for cloud 1 and cloud 2 with sway_offset
        let cloud_1_transform = Mat4.identity().times(
            Mat4.translation(-7 + sway_offset, 60, 0).times(Mat4.scale(3, 3, 3))
        );
        let cloud_2_transform = Mat4.identity().times(
            Mat4.translation(30 + sway_offset, 60, 5).times(Mat4.scale(3, 3, 3))
        );

        // Common cloud scale
        const cloud_scale = Mat4.scale(0.8, 0.8, 0.8);

        // Positions for cloud 1
        const cloud_positions = [
            [-1, 0, 0],
            [-1, 0, -5],
            [-2.5, -0.5, -2],
            [-6, 0, -5],
        ];

        // Draw cloud 1
        this.shapes.ball.draw(
            context,
            program_state,
            cloud_1_transform,
            this.materials.cloud
        );
        for (let pos of cloud_positions) {
            let cloud_transform = cloud_1_transform
                .times(Mat4.translation(...pos))
                .times(cloud_scale);
            this.shapes.ball.draw(
                context,
                program_state,
                cloud_transform,
                this.materials.cloud
            );
        }

        // Positions for cloud 2
        const cloud_positions_2 = [
            [-1, 0, 0],
            [-0.1, 0, -5],
            [-0.5, -0.5, -2],
            [3, 0, -5],
        ];

        // Draw cloud 2
        this.shapes.ball.draw(
            context,
            program_state,
            cloud_2_transform,
            this.materials.cloud
        );
        for (let pos of cloud_positions_2) {
            let cloud_transform = cloud_2_transform
                .times(Mat4.translation(...pos))
                .times(cloud_scale);
            this.shapes.ball.draw(
                context,
                program_state,
                cloud_transform,
                this.materials.cloud
            );
        }
    }

    option_picker(current_scene) {
        console.log("in option picker");

        if (current_scene == "scene_1_b") {
            // set picking mode to true

            this.is_picking = true;

            if (this.left_button) {
                // yes
                console.log("left button state = " + this.left_button);
                this.left_button = false; // reset the button state
                this.scene_1_b = false; // disable this current one
                this.scene_1_yes = true; // go to the next one

                // set picking mode to false
                this.is_picking = false;
            }
            if (this.right_button) {
                // no
                console.log("right button state = " + this.right_button);
                this.right_button = false; // reset the button state
                this.scene_1_b = false; // disable this current one
                this.scene_1_no = true; // go to the next one

                // set picking mode to false
                this.is_picking = false;
            }
        } else if (current_scene == "scene_2_a") {
            // set picking mode to true
            this.is_picking = true;

            if (this.left_button) {
                // yes
                console.log("left button state = " + this.left_button);
                this.left_button = false; // reset the button state
                this.scene_2_a = false; // disable this current one
                this.scene_2_red = true; // go to the next one

                // set picking mode to false
                this.is_picking = false;
            }
            if (this.right_button) {
                // no
                console.log("right button state = " + this.right_button);
                this.right_button = false; // reset the button state
                this.scene_2_a = false; // disable this current one
                this.scene_2_blue = true; // go to the next one

                // set picking mode to false
                this.is_picking = false;
            }
        } else if (current_scene == "scene_3_b") {
            // set picking mode to true
            this.is_picking = true;

            if (this.left_button) {
                // cow
                console.log("left button state = " + this.left_button);
                this.left_button = false; // reset the button state
                this.scene_3_b = false; // disable this current one
                this.scene_3_cow = true; // go to the next one

                // set picking mode to false
                this.is_picking = false;
            }
            if (this.right_button) {
                // lion
                console.log("right button state = " + this.right_button);
                this.right_button = false; // reset the button state
                this.scene_3_b = false; // disable this current one
                this.scene_3_lion = true; // go to the next one
                this.miffy_transform = this.miffy_transform
                    .times(Mat4.translation(24, 0, 27))
                    .times(Mat4.rotation(Math.PI, 0, 1, 0))
                    .times(Mat4.translation(25, 0, 50));

                // this.miffy_transform = this.miffy_transform.times(Mat4.translation(0, 0, -7))
                //     .times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(-24, 0, -20));

                // set picking mode to false
                this.is_picking = false;
            }
        } else if (current_scene == "scene_4_a") {
            // set picking mode to true
            this.is_picking = true;

            if (this.left_button) {
                // yes
                console.log("left button state = " + this.left_button);
                this.left_button = false; // reset the button state
                this.scene_4_a = false; // disable this current one
                this.scene_4_orange = true; // go to the next one

                // set picking mode to false
                this.is_picking = false;
            }
            if (this.right_button) {
                // no
                console.log("right button state = " + this.right_button);
                this.right_button = false; // reset the button state
                this.scene_4_a = false; // disable this current one
                this.scene_4_other = true; // go to the next one

                // set picking mode to false
                this.is_picking = false;
            }
        }
    }
    render_miffy(context, program_state, shadow_pass, y_position) {
        let miffy_cow_transform = Mat4.identity().times(
            Mat4.translation(0, y_position, 7)
            // .times(Mat4.rotation(13.05, 0, 1, 0))
        );
        this.shapes.miffy.draw(
            context,
            program_state,
            miffy_cow_transform,
            shadow_pass ? this.shadowed_miffy : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.translation(0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.translation(-0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(-0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            miffy_cow_transform
                .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(0.25, -0.4, 1.15))
                .times(Mat4.scale(0.15, 0.03, 0.1)),
            this.materials.black
        );
        if (this.scarf) {
            this.shapes.sphere.draw(
                context,
                program_state,
                miffy_cow_transform
                    .times(Mat4.translation(0, -1, 0))
                    .times(Mat4.scale(1, 1, 1)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
            this.shapes.cube.draw(
                context,
                program_state,
                miffy_cow_transform
                    .times(Mat4.rotation(Math.PI / 8, -1, 0, 1))
                    .times(Mat4.translation(0.15, -1.8, 0.6))
                    .times(Mat4.scale(0.2, 0.5, 0.05)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : this.scarf_blue
                        ? this.materials.royal
                        : this.materials.clear
                    : this.pure
            );
        }
    }

    render_miffy_scene3a(context, program_state, shadow_pass, z_pos) {
        let miffy_transform = Mat4.identity().times(Mat4.translation(-z_pos / 3, 0, z_pos)).times(Mat4.rotation(-0.5, 0, 1, 0))
        this.shapes.miffy.draw(
            context,
            program_state,
            miffy_transform,
            shadow_pass ? this.shadowed_miffy : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_transform
                .times(Mat4.translation(0.6, 0, 1.2))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            miffy_transform
                .times(Mat4.translation(-0.6, 0, 1.1))
                .times(Mat4.scale(0.1, 0.15, 0.1)),
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
        if (this.scarf) {
            this.shapes.sphere.draw(
                context,
                program_state,
                miffy_transform
                    .times(Mat4.translation(0, -1, 0))
                    .times(Mat4.scale(1, 1, 1)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : ( this.scarf_blue ? this.materials.royal : this.materials.clear)
                    : this.pure
            );
            this.shapes.cube.draw(
                context,
                program_state,
                miffy_transform
                    .times(Mat4.rotation(Math.PI / 8, -1, 0, 1))
                    .times(Mat4.translation(0.15, -1.8, 0.6))
                    .times(Mat4.scale(0.2, 0.5, 0.05)),
                shadow_pass
                    ? this.scarf_red
                        ? this.shadowed_red
                        : ( this.scarf_blue ? this.materials.royal : this.materials.clear )
                    : this.pure
            );
        }
    }

    render_dog(context, program_state, shadow_pass, y_position) {
        let dog_transform = Mat4.identity().times(
            Mat4.translation(2, y_position, 9)
            // .times(Mat4.rotation(13.05, 0, 1, 0))
        );
        this.shapes.ball.draw(
            context,
            program_state,
            dog_transform.times(Mat4.scale(0.6, 0.5, 0.8)),
            shadow_pass ? this.shadowed_wood : this.pure
        );
        let head_transform = dog_transform.times(Mat4.translation(0, 0.6, 0.6));
        this.shapes.ball.draw(
            context,
            program_state,
            head_transform.times(Mat4.scale(0.52, 0.52, 0.52)),
            shadow_pass ? this.shadowed_wood : this.pure
        );

        const ear_scale = Mat4.scale(0.15, 0.3, 0.3); // Scale for the horns

        let ear_1_transform = head_transform
            .times(Mat4.translation(0.5, 0.15, 0.1))
            .times(Mat4.rotation(0.7, 0, 0, 1))
            .times(ear_scale);
        this.shapes.ball.draw(
            context,
            program_state,
            ear_1_transform,
            shadow_pass ? this.shadowed_wood : this.pure
        );
        let ear_2_transform = head_transform
            .times(Mat4.translation(-0.5, 0.15, 0.1))
            .times(Mat4.rotation(-0.7, 0, 0, 1))
            .times(ear_scale);
        this.shapes.ball.draw(
            context,
            program_state,
            ear_2_transform,
            shadow_pass ? this.shadowed_wood : this.pure
        );

        const leg_scale = Mat4.scale(0.18, 0.5, 0.18);
        let leg_1_transform = dog_transform
            .times(Mat4.translation(0.45, -0.15, 0.55))
            .times(Mat4.rotation(0.5, -0.2, 0, 0.05))
            .times(leg_scale);
        this.shapes.ball.draw(
            context,
            program_state,
            leg_1_transform,
            shadow_pass ? this.shadowed_wood : this.pure
        );
        let leg_2_transform = dog_transform
            .times(Mat4.translation(-0.45, -0.15, 0.55))
            .times(Mat4.rotation(0.5, -0.2, 0, -0.05))
            .times(leg_scale);
        this.shapes.ball.draw(
            context,
            program_state,
            leg_2_transform,
            shadow_pass ? this.shadowed_wood : this.pure
        );
        let leg_3_transform = dog_transform
            .times(Mat4.translation(0.4, -0.15, -0.4))
            .times(Mat4.rotation(0.5, 0.2, 0, -0.02))
            .times(leg_scale);
        this.shapes.ball.draw(
            context,
            program_state,
            leg_3_transform,
            shadow_pass ? this.shadowed_wood : this.pure
        );
        let leg_4_transform = dog_transform
            .times(Mat4.translation(-0.4, -0.15, -0.4))
            .times(Mat4.rotation(0.5, 0.2, 0, 0.02))
            .times(leg_scale);
        this.shapes.ball.draw(
            context,
            program_state,
            leg_4_transform,
            shadow_pass ? this.shadowed_wood : this.pure
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            head_transform
                .times(Mat4.rotation(Math.PI / 8, 0, 0, 1))
                .times(Mat4.translation(0.22, -0.12, 0.5))
                .times(Mat4.scale(0.05, 0.07, 0)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            head_transform
                .times(Mat4.rotation(-Math.PI / 8, 0, 0, 1))
                .times(Mat4.translation(-0.22, -0.12, 0.5))
                .times(Mat4.scale(0.05, 0.07, 0)),
            this.materials.black
        );
        this.shapes.sphere.draw(
            context,
            program_state,
            head_transform
                .times(Mat4.translation(0, -0.1, 0.55))
                .times(Mat4.scale(0.06, 0.04, 0)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            head_transform
                .times(Mat4.rotation(Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(-0.13, -0.13, 0.5))
                .times(Mat4.scale(0.07, 0.015, 0.01)),
            this.materials.black
        );
        this.shapes.cube.draw(
            context,
            program_state,
            head_transform
                .times(Mat4.rotation(-Math.PI / 6, 0, 0, 1))
                .times(Mat4.translation(0.13, -0.13, 0.5))
                .times(Mat4.scale(0.07, 0.015, 0.01)),
            this.materials.black
        );
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.
        const t = program_state.animation_time;
        const gl = context.context;

        // let sun_rgb = ((1/2) + Math.sin((2 * Math.PI / 10) * t + (3 * Math.PI/2)) * (1/2)) ;
        // var sun_color = color(1, sun_rgb, sun_rgb, 1);

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
                Mat4.look_at(vec3(0, 0, 20), vec3(0, 0, 0), vec3(0, 1, 0))
            ); // Locate the camera here

            //  *** EVENT LISTENER FOR MOUSE DOWN *** //
            {
                let canvas = context.canvas;
                const mouse_position = (
                    e,
                    rect = canvas.getBoundingClientRect()
                ) =>
                    vec(
                        (e.clientX - (rect.left + rect.right) / 2) /
                            ((rect.right - rect.left) / 2),
                        (e.clientY - (rect.bottom + rect.top) / 2) /
                            ((rect.top - rect.bottom) / 2)
                    );

                canvas.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    const rect = canvas.getBoundingClientRect();
                    const midX = (rect.left + rect.right) / 2;

                    // Check if the click is on the left or right side of the canvas
                    if (this.is_picking) {
                        if (e.clientX < midX) {
                            console.log("Click on the left side");
                            this.left_button = true;
                        } else {
                            console.log("Click on the right side");
                            this.right_button = true;
                        }
                    }

                    this.my_mouse_down(
                        e,
                        mouse_position(e),
                        context,
                        program_state
                    );
                });
            }
        }

        // *** SHADER SHIT DO NOT DELETEEEEEE OR TOUCH *** //
        {
            // The position of the light

            // *** LIGHT POSITION *** //
            // We could easily adjust this to account for the "time of day"

            this.light_position = Mat4.identity().times(vec4(3, 30, 0, 1));
            // this.light_position = Mat4.rotation(t / 1500, 0, 1, 0).times(vec4(3, 30, 0, 1));  // this one is like rotating

            // The color of the light
            this.light_color = color(1, 0.7490196078431373, 0, 1);

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
        }

        //MAIN RENDERING
        this.render_scene(context, program_state, true, true, true);
        if (this.title) {
            function hexToRGB(hex) {
                var r = parseInt(hex.substring(1, 3), 16) / 255;
                var g = parseInt(hex.substring(3, 5), 16) / 255;
                var b = parseInt(hex.substring(5, 7), 16) / 255;
                return { r, g, b };
            }

            var startColor = hexToRGB("#FFCFF7"); // Pink
            var endColor = hexToRGB("#027ddb"); // Blue
            var duration = 3; // Duration in seconds
            var time3 = program_state.animation_time / 1000; // Time in seconds

            if (this.movie_start == -1) {
                this.movie_start = time3;
            }

            // Calculate interpolation factor
            var factor = Math.min((time3 - this.movie_start) / duration, 1); // Clamp between 0 and 1

            // Interpolate between the colors
            var interpolatedColor = {
                r: startColor.r + (endColor.r - startColor.r) * factor,
                g: startColor.g + (endColor.g - startColor.g) * factor,
                b: startColor.b + (endColor.b - startColor.b) * factor,
            };

            // Create the color object
            var sun_color = color(
                interpolatedColor.r,
                interpolatedColor.g,
                interpolatedColor.b,
                1
            );

            this.shapes.sphere.draw(
                context,
                program_state,
                Mat4.identity()
                    .times(Mat4.translation(-20, 0, 0))
                    .times(Mat4.scale(80, 80, 80)),
                this.materials.sky_3.override({ color: sun_color })
            );

            this.render_clouds(context, program_state);
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
            if (Math.floor((t / 1000) % 2) === 1) {
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
            this.render_scene_1(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
            //call function render_scene_1
        } else if (this.scene_1_b) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_1_b(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
            this.option_picker("scene_1_b");
        } else if (this.scene_1_yes) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_1_yes(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
            // call function render_scene_2
        } else if (this.scene_1_no) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_1_no(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
        } else if (this.scene_2_a) {
            this.scarf = true;
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_2_a(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
            this.option_picker("scene_2_a");
        } else if (this.scene_2_red) {
            this.scarf = true;
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_2_red(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
        } else if (this.scene_2_blue) {
            this.scarf = true;
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_2_blue(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
        } else if (this.scene_3_a) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_3_a(context, program_state);
            this.render_dog(context, program_state, true, -2.36);
        } else if (this.scene_3_b) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 24), vec3(-35, 2, 24), vec3(0, 1, 0))
            );
            this.render_scene_3_b(context, program_state);
            this.option_picker("scene_3_b");
        } else if (this.scene_3_lion) {
            program_state.set_camera(
                Mat4.look_at(vec3(-60, 0, 22), vec3(-40, 2, 35), vec3(0, 1, 0))
            );
            this.render_scene_3_lion(context, program_state);
        } else if (this.scene_3_cow) {
            program_state.set_camera(
                Mat4.look_at(vec3(-35, 1, 29), vec3(-50, 0, 0), vec3(0, 1, 0))
            );
            this.render_scene_3_cow(context, program_state, true);
        } else if (this.scene_4_a) {
            program_state.set_camera(
                Mat4.look_at(vec3(17, 1.2, 16), vec3(18, 0, 8), vec3(0, 1, 0))
            );
            this.render_scene_4_a(context, program_state, true);
            this.option_picker("scene_4_a");
        } else if (this.scene_4_orange) {
            // program_state.set_camera(
            //     Mat4.look_at(vec3(17, 1.2, 16), vec3(18, 0, 8), vec3(0, 1, 0))
            // );
            this.render_scene_4_orange(context, program_state, true);
        } else if (this.scene_4_other) {
            program_state.set_camera(
                Mat4.look_at(vec3(17, 1.2, 16), vec3(18, 0, 8), vec3(0, 1, 0))
            );
            this.render_scene_4_other(context, program_state, true);
        } else if (this.scene_5_a) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_5_a(context, program_state);
            this.render_miffy(context, program_state, true, 0);
            this.render_dog(context, program_state, true, -2.36);
        } else if (this.scene_5_b) {
            program_state.set_camera(
                Mat4.look_at(vec3(0, 0, 25), vec3(0, 2, 0), vec3(0, 1, 0))
            );
            this.render_scene_5_b(context, program_state);
        } else if (this.scene_final) {
            program_state.set_camera(
                Mat4.look_at(vec3(10, 55, 30), vec3(10, 55, 0), vec3(0, 1, 0))
            );
            this.render_scene_final(context, program_state);
        }

        if (this.attached !== undefined) {
            let desired = this.attached();
            program_state.camera_inverse = desired.map((x, i) =>
                Vector.from(program_state.camera_inverse[i]).mix(x, 0.1)
            );
        }
    }
}
