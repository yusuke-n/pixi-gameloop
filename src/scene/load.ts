import * as PIXI from "pixi.js"
import TextureHelper from "../texture-helper"
import { LocatableContainer } from "../ui"
import SceneManager from "../scene-manager"
import Scene from "./scene-base"
import TitleScene from "./title"
import { FontName } from "../const"

class LoadScene extends Scene {
    _initialized: boolean

    constructor() {
        super({autoStart: true})
        this._initialized = false
    }
    
    init() {
        PIXI.Loader.shared.onComplete.add(() => { this._initialized = true })
        TextureHelper.loadFont().then(async () => {
            const cont = new LocatableContainer({orientation: "horizontal"})
            const label = new PIXI.BitmapText("loading", { fontName: FontName })
            cont.addChild(label)
            cont.displayTo(this.stage, { position:"center" })
            await TextureHelper.init()
            SceneManager.goto(new TitleScene())
            this.disposed = true
        })
    }

    update() {
    }

    cleanup() {
        this.stage.destroy({children: true})
    }
}

export default LoadScene