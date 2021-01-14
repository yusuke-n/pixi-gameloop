import GameObject from "./game-object"
import * as PIXI from "pixi.js"

abstract class Scene {
    stage: PIXI.Container
    _ticker: PIXI.Ticker
    destroyed: boolean
    objects: GameObject[]
    constructor({ autoStart }:{ autoStart:boolean }) {
        this.objects = []
        this.stage = new PIXI.Container
        this._ticker = new PIXI.Ticker
        this.destroyed = false
        this._ticker.autoStart = autoStart
        this._ticker.add(this.update)
    }
    

    start() {
        this._ticker.start()
    }

    stop() {
        this._ticker.stop()
    }

    abstract update(): void

    destroy() {
        for(let i = 0; i <this.objects.length; i++) {
            this.objects[i]?.destroy()
        }
        this.stop()
        this.destroyed = true
    }
}

export default Scene