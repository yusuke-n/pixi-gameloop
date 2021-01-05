import * as PIXI from 'pixi.js'
import App from './pixi-app'
import GameObject from './game-object'
import Player from './player'

class GameManager {
    app: App
    tiles: { [key:string]: PIXI.TilingSprite } = {}
    fps: PIXI.BitmapText
    ui_sprites: { [key:string]: PIXI.Sprite } = {}
    player: Player
    game_objects: { [key:string]: GameObject } = {}

    constructor() {
        this.app = new App()
        this.app.gameLoop = this.gameLoop.bind(this)
        this.app.textureLoaded = this.onTextureLoaded.bind(this)
    }
    
    init() {
        this.app.init()
    }

    onTextureLoaded(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
        const spritesheet = resources.tileset.spritesheet
        const ui_spritesheet = resources.ui.spritesheet

        this.player = new Player(spritesheet.textures["sushi.png"])

        this.tiles.ground = new PIXI.TilingSprite(spritesheet.textures["ground.png"], this.app.view.width, 32)
        this.tiles.sky = new PIXI.TilingSprite(spritesheet.textures["sky2.png"], this.app.view.width, this.app.view.height)
        this.ui_sprites.right = new PIXI.Sprite(ui_spritesheet.textures["rightarrow.png"])
        this.ui_sprites.left = new PIXI.Sprite(ui_spritesheet.textures["leftarrow.png"])
        this.ui_sprites.up = new PIXI.Sprite(ui_spritesheet.textures["uparrow.png"])

        this.displayInit()
        this.displayUI()
        
    }

    displayInit() {
        this.tiles.sky.position.x = 0
        this.tiles.sky.position.y = 0
        this.app.stage.addChild(this.tiles.sky)
        this.tiles.ground.position.x = 0
        this.tiles.ground.position.y = this.app.view.height - 32
        this.app.stage.addChild(this.tiles.ground)
        this.player.displayTo(this.app.stage, 32 * 4, this.app.view.height - 64)
    }

    displayUI() {
        const fpstxt = new PIXI.BitmapText("fps:", {fontName: 'PixelMplus12', tint: 0x000000})
        this.fps = new PIXI.BitmapText(this.app.fps.toString(), {fontName: 'PixelMplus12', tint: 0x000000})
        fpstxt.position.x = this.app.view.width - fpstxt.width - this.fps.width - 12
        fpstxt.position.y += 3
        this.fps.position.x = this.app.view.width - this.fps.width - 6
        this.fps.position.y += 3
        
        this.ui_sprites.left.position.x += 6
        this.ui_sprites.left.position.y += 3
        this.ui_sprites.right.position.x = this.ui_sprites.left.width + 6 + 3
        this.ui_sprites.right.position.y += 3
        this.ui_sprites.up.position.x = this.ui_sprites.left.width / 2 + 8
        this.ui_sprites.up.position.y = this.ui_sprites.left.height + 12
        
        const icn_bound = this.ui_sprites.right.getBounds()
        const movetxt = new PIXI.BitmapText(": move", {fontName: 'PixelMplus12', tint: 0x000000})
        const jumptxt = new PIXI.BitmapText(": jump", {fontName: 'PixelMplus12', tint: 0x000000})
        movetxt.position.x = icn_bound.x + icn_bound.width + 6
        jumptxt.position.x = icn_bound.x + icn_bound.width + 6
        jumptxt.position.y = movetxt.height + 15

        this.app.stage.addChild(this.ui_sprites.up)
        this.app.stage.addChild(this.ui_sprites.left)
        this.app.stage.addChild(this.ui_sprites.right)
        this.app.stage.addChild(fpstxt)
        this.app.stage.addChild(this.fps)
        this.app.stage.addChild(movetxt)
        this.app.stage.addChild(jumptxt)
    }

    gameLoop(delta: number) {
        if(this.fps){
            this.fps.text = this.app.fps.toString()
        }
        
        this.player?.update()
        
        for(const k in this.game_objects) {
            this.game_objects[k]?.update()
        }
    }
    
}

export default GameManager

