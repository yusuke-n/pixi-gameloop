import * as PIXI from "pixi.js"
import Scene from "./scene-base"
import { toCenteringCoord } from "../utils"
import { FontName, ViewSize } from "../const"
import { LocatableContainer } from "../ui"
import State from "../state"
import KeyboardInput from "../keyboard-input"
import SceneManager from "../scene-manager"
import MainScene from "./main"

class GameOverScene extends Scene {
    _current_frame: number = 0
    _result_texts: PIXI.BitmapText[]
    _display_finished: boolean
    _restarted: boolean

    constructor(stageFrom: PIXI.Container) {
        super({autoStart: true})
        this.stage = stageFrom
        this._result_texts = []
        this._display_finished = false
    }
    
    init() {
        this._restarted = false
        const modal = new PIXI.Graphics()
        modal.beginFill(0x000000, 0.5).drawRect(0, 0, 180, 100).endFill()
        modal.position.x = toCenteringCoord(ViewSize.width, modal.width)
        modal.position.y = toCenteringCoord(ViewSize.height, modal.height)
        this.stage.addChild(modal)
        const cont = new LocatableContainer({orientation: "vertical", margin: 8, align: "center"})
        this._result_texts = [
            new PIXI.BitmapText("You got", {fontName: FontName}), 
            new PIXI.BitmapText(`${State.score} liters`, {fontName: FontName}),
            new PIXI.BitmapText("of soy sauce!!", {fontName: FontName}),
            new PIXI.BitmapText("hit any key to restart", { fontName: FontName, fontSize: -15, tint: 0x000000})
        ]
        for(let i = 0; i<this._result_texts.length; i++) {
            this._result_texts[i].alpha = 0
        }
        cont.add(this._result_texts[0], this._result_texts[1], this._result_texts[2])
        cont.displayTo(this.stage, {position:"center"})

        const restartCont = new LocatableContainer({orientation: "vertical", align: "center"})
        restartCont.add(this._result_texts[3])
        restartCont.displayTo(this.stage, {position: "bottom", padding: {x: 0, y: 60}}) 
    }

    update() {
        if(this._display_finished && KeyboardInput.isKeyDown && !this._restarted) {
            State.gameover = false
            this._restarted = true
            SceneManager.back({withInit: true})
        }
        if(this._current_frame < 60) {
            this._current_frame++
        }
        if(this._current_frame > 15) {
            this._result_texts[0].alpha = 1
        }
        if(this._current_frame > 30) {
            this._result_texts[1].alpha = 1
        }
        if(this._current_frame > 45) {
            this._result_texts[2].alpha = 1
        }
        if(this._current_frame > 55) {
            this._result_texts[3].alpha = 1
            this._display_finished = true
        }
    }

    cleanup() {

    }
}

export default GameOverScene