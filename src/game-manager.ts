import * as PIXI from 'pixi.js'
import App from './pixi-app'
import GameObject from './game-object'
import Player from './player'
import TextureHelper from './texture-helper'
import KeyboardInput from './keyboard-input'
import ScoreItem from './score-item'
import State from './state'
import Bullet from './bullet'
import {levelMap, LevelData} from './setting'
import {BitmapTextBox} from './ui'

class GameManager {
    app = App
    tiles: { [key:string]: PIXI.TilingSprite } = {}
    scoreLabel: PIXI.BitmapText
    scoreTxt: PIXI.BitmapText
    fpsTxt: PIXI.BitmapText
    fps: PIXI.BitmapText
    ui_sprites: { [key:string]: PIXI.Sprite } = {}
    player: Player
    game_objects: GameObject[] = []
    score: number = 9999
    static ScoreSpan = 2800
    static BulletSpan = 3000
    score_span:number = 2800
    bullet_span:number = 3000
    from_score_spawned: number = 0
    from_bullet_spawned: number = 0
    skip_frames: number = 0
    level:number = 1

    constructor() {
        this.app.gameLoop = this.gameLoop.bind(this)
    }
    
    async init() {
        this.app.init()
        await TextureHelper.init()
        this.prepareObjects()
        this.displayInit()
        this.displayUI()
        this.app.start()
    }

    get currentStage(): PIXI.Container{
        return this.app.stage
    }

    prepareObjects() {
        this.player = new Player(this.currentStage)
        this.tiles.ground = new PIXI.TilingSprite(TextureHelper.getFromCache("ground"), this.app.view.width, 32)
        this.tiles.sky = new PIXI.TilingSprite(TextureHelper.getFromCache("sky2"), this.app.view.width, this.app.view.height)
        this.ui_sprites.right = new PIXI.Sprite(TextureHelper.getFromCache("rightarrow"))
        this.ui_sprites.left = new PIXI.Sprite(TextureHelper.getFromCache("leftarrow"))
        this.ui_sprites.up = new PIXI.Sprite(TextureHelper.getFromCache("uparrow"))
    }

    displayInit() {
        this.tiles.sky.position.x = 0
        this.tiles.sky.position.y = 0
        this.currentStage.addChild(this.tiles.sky)
        this.tiles.ground.position.x = 0
        this.tiles.ground.position.y = this.app.view.height - 32
        this.currentStage.addChild(this.tiles.ground)
        this.player.display(32 * 4, this.app.view.height - 64)
    }

    displayUI() {
        this.fpsTxt = new PIXI.BitmapText("fps:", {fontName: 'PixelMplus12'})
        this.fps = new PIXI.BitmapText(this.app.fps.toString(), {fontName: 'PixelMplus12'})
        const fpxbox = new BitmapTextBox({orientation: "horizontal", margin: 6})
        fpxbox.addText([this.fpsTxt, this.fps])
        fpxbox.displayTo(this.currentStage, { position: "bottom-right", padding: { x: 6, y: 6 }})
        
        this.ui_sprites.left.position.x = 6
        this.ui_sprites.right.position.x = this.ui_sprites.left.width + 6 + 3
        this.ui_sprites.right.position.y = this.ui_sprites.left.position.y = 5
        this.ui_sprites.up.position.x = this.ui_sprites.left.width / 2 + 8
        this.ui_sprites.up.position.y = this.ui_sprites.left.height + 12
        this.currentStage.addChild(this.ui_sprites.up)
        this.currentStage.addChild(this.ui_sprites.left)
        this.currentStage.addChild(this.ui_sprites.right)

        const icn_bound = this.ui_sprites.right.getBounds()
        const movetxt = new PIXI.BitmapText(":move", {fontName: 'PixelMplus12', tint: 0x000000})
        const jumptxt = new PIXI.BitmapText(":jump", {fontName: 'PixelMplus12', tint: 0x000000})
        const opbox = new BitmapTextBox({orientation: "vertical", margin: 12})
        opbox.addText([movetxt, jumptxt])
        opbox.displayTo(this.currentStage, {position: "top-left", padding: {x: icn_bound.width + icn_bound.x + 6 , y: 0}})

        this.scoreLabel = new PIXI.BitmapText("score:", {fontName: 'PixelMplus12', tint: 0x000000})
        this.scoreTxt = new PIXI.BitmapText(this.score.toString(), { fontName: 'PixelMplus12', tint: 0x000000 })
        const scorebox = new BitmapTextBox({orientation: "horizontal", margin: 6})
        scorebox.addText([this.scoreLabel, this.scoreTxt])
        scorebox.displayTo(this.currentStage, {position: "top-right", padding: {x: -3, y: 3}})
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

    levelup(lv: LevelData) {
        this.level = lv.lv
        this.player.next_spd = lv.pl_spd
        this.score_span = Math.round(GameManager.ScoreSpan / lv.item_spawn)
        this.bullet_span = Math.round(GameManager.BulletSpan / lv.bl_spawn)
        Bullet.max_length = lv.bl_length
        ScoreItem.spd_factor = lv.item_spd
    }

    gameLoop(delta: number) {
        if(KeyboardInput.isKeyDown && KeyboardInput.code == 'F8') {
            this.toggleFPS()
        }

        this.fps.text = this.app.fps.toString()
        this.scoreTxt.text = State.score.toString().padStart(3, ' ')

        for(let i = 0; i<levelMap.length; i++) {
            if(State.score >= levelMap[i].lv) {
                this.levelup(levelMap[i])
                break
            }
        }

        const elapsed = this.app.ticker.elapsedMS
        this.from_score_spawned += elapsed
        this.from_bullet_spawned += elapsed

        if(this.from_score_spawned >= this.score_span) {
            this.game_objects.push(ScoreItem.spawn(this.currentStage))
            this.from_score_spawned = 0
        }
        if(this.from_bullet_spawned >= this.bullet_span) {
            this.game_objects.push(...Bullet.spawn(this.currentStage))
            this.from_bullet_spawned = 0
        }
        
        this.player.update()
        this.game_objects = this.game_objects.filter((el) => el !== null)

        for(const k in this.game_objects) {
            const obj = this.game_objects[k]
            
            if(obj?.isHitted(this.player)) {
                obj.onHit(this.player)
            }

            obj?.update()

            if(obj?.destroyed) {
                this.game_objects[k] = null
            }
            
            
        }
    }
    
}

export default GameManager

