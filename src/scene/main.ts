import * as PIXI from "pixi.js"
import Player from "../player"
import Scene from "./scene-base"
import TextureHelper from "../texture-helper"
import Bullet from "../bullet"
import ScoreItem from "../score-item"
import { FontName, ViewSize } from "../const"
import { LocatableContainer } from "../ui"
import { levelMap, LevelData } from "../setting"
import KeyboardInput from "../keyboard-input"
import State from "../state"
import App from "../pixi-app"
import SceneManager from "../scene-manager"
import GameOverScene from "./gameover"

class MainScene extends Scene {
    player: Player
    tiles: { [key:string]: PIXI.TilingSprite } = {}
    scoreLabel: PIXI.BitmapText
    scoreTxt: PIXI.BitmapText
    fpsTxt: PIXI.BitmapText
    fps: PIXI.BitmapText
    levelText: PIXI.BitmapText
    ui_sprites: { [key:string]: PIXI.Sprite } = {}
    score: number = 9999
    static ScoreSpan = 2800
    static BulletSpan = 3000
    score_span:number = 2800
    bullet_span:number = 3000
    from_score_spawned: number = 0
    from_bullet_spawned: number = 0
    level:number = 1
    toggle_skip: number = 0

    constructor() {
        super({autoStart: true})
    }

    init() {
        this.stage = new PIXI.Container
        this.disposed = false
        this.objects = []
        this.level = 1
        MainScene.ScoreSpan = 2800
        MainScene.BulletSpan = 3000
        this.score_span = 2800
        this.bullet_span = 3000
        this.from_score_spawned = 0
        this.from_bullet_spawned = 0
        State.score = 0
        this.toggle_skip = 0

        this.prepareObjects()
        this.displayBackground()
        this.displayUI()
        this.player.display(32 * 4, ViewSize.height - 64)
        SceneManager.current.start()
    }

    update(delta: number) {
        if(State.gameover) {
            SceneManager.current.stop()
            SceneManager.goto(new GameOverScene(SceneManager.current.stage))
        }

        if(this.toggle_skip > 0) {
            this.toggle_skip++
        }
        if(this.toggle_skip >= 10) {
            this.toggle_skip = 0
        }
        if(KeyboardInput.isKeyDown && KeyboardInput.code == 'F8' && this.toggle_skip === 0) {
            this.toggle_skip++
            this.toggleFPS()
        }

        this.fps.text = App.fps.toString()
        this.scoreTxt.text = State.score.toString().padStart(3, ' ')

        for(let i = 0; i<levelMap.length; i++) {
            if(State.score >= levelMap[i].score) {
                this.levelup(levelMap[i])
                break
            }
        }

        const elapsed = App.ticker.elapsedMS
        this.from_score_spawned += elapsed
        this.from_bullet_spawned += elapsed

        if(this.from_score_spawned >= this.score_span) {
            this.objects.push(ScoreItem.spawn(this.stage))
            this.from_score_spawned = 0
        }
        if(this.from_bullet_spawned >= this.bullet_span) {
            this.objects.push(...Bullet.spawn(this.stage))
            this.from_bullet_spawned = 0
        }
        
        this.player.update()
        this.objects = this.objects.filter((el) => el !== null)

        for(let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i]
            
            if(obj?.isHitted(this.player)) {
                obj.onHit(this.player)
            }

            obj?.update()

            if(obj?.destroyed) {
                this.objects[i] = null
            }
        }
    }

    cleanup() {}

    toggleFPS() {
        this.fpsTxt.visible = !this.fpsTxt.visible
        this.fps.visible = !this.fps.visible
    }

    prepareObjects() {
        this.player = new Player(this.stage)
        this.tiles.ground = new PIXI.TilingSprite(TextureHelper.getFromCache("ground"), ViewSize.width, 32)
        this.tiles.sky = new PIXI.TilingSprite(TextureHelper.getFromCache("sky2"), ViewSize.width, ViewSize.height)
        this.ui_sprites.right = new PIXI.Sprite(TextureHelper.getFromCache("rightarrow"))
        this.ui_sprites.left = new PIXI.Sprite(TextureHelper.getFromCache("leftarrow"))
        this.ui_sprites.up = new PIXI.Sprite(TextureHelper.getFromCache("uparrow"))
    }

    displayBackground() {
        this.tiles.sky.position.x = 0
        this.tiles.sky.position.y = 0
        this.stage.addChild(this.tiles.sky)
        this.tiles.ground.position.x = 0
        this.tiles.ground.position.y = ViewSize.height - 32
        this.stage.addChild(this.tiles.ground)
    }

    displayUI() {
        this.fpsTxt = new PIXI.BitmapText("fps:", {fontName: 'PixelMplus12'})
        this.fps = new PIXI.BitmapText(App.fps.toString(), {fontName: 'PixelMplus12'})
        const fpxbox = new LocatableContainer({orientation: "horizontal", margin: 6})
        fpxbox.add(this.fpsTxt, this.fps)
        fpxbox.displayTo(this.stage, { position: "bottom-right", padding: { x: 6, y: 6 }})
        
        this.ui_sprites.left.position.x = 6
        this.ui_sprites.right.position.x = this.ui_sprites.left.width + 6 + 3
        this.ui_sprites.right.position.y = this.ui_sprites.left.position.y = 5
        this.ui_sprites.up.position.x = this.ui_sprites.left.width / 2 + 8
        this.ui_sprites.up.position.y = this.ui_sprites.left.height + 12
        this.stage.addChild(this.ui_sprites.up)
        this.stage.addChild(this.ui_sprites.left)
        this.stage.addChild(this.ui_sprites.right)

        const icn_bound = this.ui_sprites.right.getBounds()
        const movetxt = new PIXI.BitmapText(":move", {fontName: FontName, tint: 0x000000})
        const jumptxt = new PIXI.BitmapText(":jump", {fontName: FontName, tint: 0x000000})
        const opbox = new LocatableContainer({orientation: "vertical", margin: 12})
        opbox.add(movetxt, jumptxt)
        opbox.displayTo(this.stage, {position: "top-left", padding: {x: icn_bound.width + icn_bound.x + 6 , y: 0}})

        this.scoreLabel = new PIXI.BitmapText("score:", {fontName: FontName, tint: 0x000000})
        this.scoreTxt = new PIXI.BitmapText(this.score.toString(), { fontName: FontName, tint: 0x000000 })
        const scorebox = new LocatableContainer({orientation: "horizontal", margin: 6})
        scorebox.add(this.scoreLabel, this.scoreTxt)
        scorebox.displayTo(this.stage, {position: "top-right", padding: {x: -3, y: 3}})

        const lvLabelTxt = new PIXI.BitmapText("level:", {fontName: FontName, tint: 0x000000})
        this.levelText = new PIXI.BitmapText(this.level.toString().padStart(3), {fontName: FontName, tint: 0x000000})
        const levelbox = new LocatableContainer({orientation: "horizontal", margin: 8})
        levelbox.add(lvLabelTxt, this.levelText)
        levelbox.displayTo(this.stage, {position: "top-right", padding: {x: 12, y: 30}})
    }

    levelup(lv: LevelData) {
        this.level = lv.lv
        if(this.level === 5) {
            this.levelText.text = "max"
        } else {
            this.levelText.text = lv.lv.toString().padStart(3)
        }
        this.player.next_spd = lv.pl_spd
        this.score_span = Math.round(MainScene.ScoreSpan / lv.item_spawn)
        this.bullet_span = Math.round(MainScene.BulletSpan / lv.bl_spawn)
        Bullet.max_length = lv.bl_length
        ScoreItem.spd_factor = lv.item_spd
    }
}

export default MainScene