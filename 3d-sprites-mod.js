(function (Scratch) {
    'use strict';

    class 3eD_Sprites_Mod {
        getInfo() {
            return {
                id: '3dspritesmod', 
                name: '3D sprites mod', 
                color1: '#6842f5', 
                color2: '#5229cb',
                blocks: [
                    {
                        opcode: 'setSprite3D',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set sprite 3D X: [X] Y: [Y] Z: [Z]',
                        arguments: {
                            X: { type: Scratch.BlockType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.BlockType.NUMBER, defaultValue: 0 },
                            Z: { type: Scratch.BlockType.NUMBER, defaultValue: 100 }
                        }
                    },
                    {
                        opcode: 'setLightnessToDark',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'lightness to dark [AMOUNT]',
                        arguments: {
                            AMOUNT: { type: Scratch.BlockType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'getDimensionProperty',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '3D [PROP]',
                        arguments: {
                            PROP: {
                                type: Scratch.BlockType.STRING,
                                menu: 'properties'
                            }
                        }
                    },
                    {
                        opcode: 'setDimensionness',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set dimensionness to [DIM]',
                        arguments: {
                            DIM: { type: Scratch.BlockType.NUMBER, defaultValue: 100 }
                        }
                    }
                ],
                menus: {
                    properties: {
                        acceptReporters: false,
                        items: ['brightness', 'darkness', 'dimensionness']
                    }
                }
            };
        }

        // Sets up hidden variables on clones and sprites automatically
        _initProperties(target) {
            if (!target) return;
            if (typeof target._3d_dim === 'undefined') target._3d_dim = 100;
            if (typeof target._3d_dark === 'undefined') target._3d_dark = 0;
            if (typeof target._3d_bright === 'undefined') target._3d_bright = 100;
        }

        setSprite3D(args, util) {
            const target = util.target;
            this._initProperties(target);

            const x3d = Number(args.X);
            const y3d = Number(args.Y);
            const z3d = Number(args.Z) <= 0 ? 0.1 : Number(args.Z);

            // True 3D depth projection calculation
            const fov = 300;
            const scaleFactor = fov / (fov + z3d);

            const screenX = x3d * scaleFactor;
            const screenY = y3d * scaleFactor;
            
            if (target) {
                target.setXY(screenX, screenY);
                target.setSize(scaleFactor * target._3d_dim);
            }
        }

        setLightnessToDark(args, util) {
            const target = util.target;
            this._initProperties(target);
            
            const value = Number(args.AMOUNT);
            target._3d_dark = value;
            target._3d_bright = 100 - value;

            // Inverts standard graphic matrix to cast shades over the sprite
            if (target && target.effects) {
                target.effects.brightness = -value; 
            }
        }

        setDimensionness(args, util) {
            const target = util.target;
            this._initProperties(target);
            target._3d_dim = Number(args.DIM);
            
            if (target.size) {
                target.setSize(target.size); 
            }
        }

        getDimensionProperty(args, util) {
            const target = util.target;
            this._initProperties(target);

            const prop = args.PROP;
            if (prop === 'brightness') return target._3d_bright;
            if (prop === 'darkness') return target._3d_dark;
            if (prop === 'dimensionness') return target._3d_dim;
            return 0;
        }
    }

    Scratch.extensions.register(new ThreeD_Sprites_Mod());
})(Scratch);
