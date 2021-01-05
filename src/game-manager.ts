import * as PIXI from 'pixi.js'
import App from './pixi-app'
import GameObject from './game-object'
import Player from './player'
import TextureHelper from './texture-helper'
import KeyboardInput from './keyboard-input'
import PixiApp from './pixi-app'
import ScoreItem from './score-item'

class GameManager {
    app: App
    kbd: KeyboardInput
    tiles: { [key:string]: PIXI.TilingSprite } = {}
    scoreLabel: PIXI.BitmapText
    scoreTxt: PIXI.BitmapText
    fpsTxt: PIXI.BitmapText
    fps: PIXI.BitmapText
    ui_sprites: { [key:string]: PIXI.Sprite } = {}
    player: Player
    game_objects: GameObject[] = []
    score: number = 0
    score_span:number = 2800
    from_score_spawned: number = 0
    prev_score_spawned_time: number = 0

    constructor() {
        this.app = new App()
        this.kbd = new KeyboardInput()
        this.app.gameLoop = this.gameLoop.bind(this)
    }
    
    async init() {
        this.app.init()
        await TextureHelper.init()
        this.setupObjects()
        this.displayInit()
        this.displayUI()
    }

    setupObjects() {
        this.player = new Player(this.app.stage)
        this.tiles.ground = new PIXI.TilingSprite(TextureHelper.getFromCache("ground"), this.app.view.width, 32)
        this.tiles.sky = new PIXI.TilingSprite(TextureHelper.getFromCache("sky2"), this.app.view.width, this.app.view.height)
        this.ui_sprites.right = new PIXI.Sprite(TextureHelper.getFromCache("rightarrow"))
        this.ui_sprites.left = new PIXI.Sprite(TextureHelper.getFromCache("leftarrow"))
        this.ui_sprites.up = new PIXI.Sprite(TextureHelper.getFromCache("uparrow"))
    }

    displayInit() {
        this.tiles.sky.position.x = 0
        this.tiles.sky.position.y = 0
        this.app.stage.addChild(this.tiles.sky)
        this.tiles.ground.position.x = 0
        this.tiles.ground.position.y = this.app.view.height - 32
        this.app.stage.addChild(this.tiles.ground)
        this.player.display(32 * 4, this.app.view.height - 64)
    }

    displayUI() {
        const fpstxt = new PIXI.BitmapText("fps:", {fontName: 'PixelMplus12'})
        this.fpsTxt = fpstxt
        this.fps = new PIXI.BitmapText(this.app.fps.toString(), {fontName: 'PixelMplus12'})
        fpstxt.position.x = this.app.view.width - fpstxt.width - this.fps.width - 12
        fpstxt.position.y = this.app.view.height - fpstxt.height - 6
        this.fps.position.x = this.app.view.width - this.fps.width - 6
        this.fps.position.y = this.app.view.height - fpstxt.height - 6
        
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

        this.scoreLabel = new PIXI.BitmapText("score:", {fontName: 'PixelMplus12', tint: 0x000000})
        this.scoreTxt = new PIXI.BitmapText(this.score.toString(), {fontName: 'PixelMplus12', tint: 0x000000})
        this.scoreLabel.position.x = this.app.view.width - this.scoreTxt.width - 64
        this.scoreTxt.position.x = this.app.view.width - this.scoreTxt.width - 6
        this.scoreTxt.position.y = 1

        this.app.stage.addChild(this.ui_sprites.up)
        this.app.stage.addChild(this.ui_sprites.left)
        this.app.stage.addChild(this.ui_sprites.right)
        this.app.stage.addChild(fpstxt)
        this.app.stage.addChild(this.fps)
        this.app.stage.addChild(movetxt)
        this.app.stage.addChild(jumptxt)
        this.app.stage.addChild(this.scoreLabel)
        this.app.stage.addChild(this.scoreTxt)
    }

    toggleFPS() {
        if(this.fps.visible) {
            this.fps.visible = false
            this.fpsTxt.visible = false
        } else {
            this.fps.visible = true
            this.fpsTxt.visible = true
        }
    }

    gameLoop(delta: number) {
        if(this.kbd.isKeyPressed("F8")) {
            this.toggleFPS()
        }

        if(this.fps){
            this.fps.text = this.app.fps.toString()
        }

        this.from_score_spawned += this.app.ticker.elapsedMS
        if(this.from_score_spawned >= this.score_span) {
            console.log("item spawned")
            this.game_objects.push(ScoreItem.spawn(this.app.stage))
            this.from_score_spawned = 0
        }

        this.prev_score_spawned_time
        
        this.player?.update()
        
        for(const k in this.game_objects) {
            const obj = this.game_objects[k]
            if(obj?.destroyed) {
                this.game_objects[k] = null
            }
            obj?.update()
        }
    }
    
}

export default GameManager

