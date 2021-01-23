import * as PIXI from "pixi.js"
import Scene from "./scene-base";
import Player from "../player"
import TextureHelper from "../texture-helper"
import { ViewSize, FontName } from "../const"
import { LocatableContainer } from "../ui"
import KeyboardInput from "../keyboard-input"
import SceneManager from "../scene-manager"
import MainScene from "./main";

class TitleScene extends Scene {
    started: boolean
    constructor() {
        super({autoStart: true})
        this.started = false
    }
    
    init() {
        const player = new Player(this.stage)
        const groundtiles = new PIXI.TilingSprite(TextureHelper.getFromCache("ground"), ViewSize.width, 32)
        groundtiles.position.y = ViewSize.height - 32
        const skytiles = new PIXI.TilingSprite(TextureHelper.getFromCache("sky2"), ViewSize.width, ViewSize.height)
        this.stage.addChild(skytiles)
        this.stage.addChild(groundtiles)
        player.display(ViewSize.width / 2 - 16, ViewSize.height - 64)
        const txtContainer = new LocatableContainer({ orientation: "vertical", margin: 12, align: "center"})
        const titleTxt = new PIXI.BitmapText("SUSHI", {fontName: FontName, fontSize: -32, tint: 0x000000 })
        txtContainer.add(titleTxt)
        txtContainer.add(new PIXI.BitmapText("hit any key", {fontName: FontName, tint: 0x000000 }))
        txtContainer.displayTo(this.stage, { position: "center" })
    }
    
    update() {
        if(KeyboardInput.isKeyDown && !this.started) {
            this.started = true
            this.disposed = true
            SceneManager.goto(new MainScene())
        }
    }

    cleanup() {
        this.stage.destroy({children: true})
    }
}

export default TitleScene