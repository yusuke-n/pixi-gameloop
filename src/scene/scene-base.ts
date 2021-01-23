import GameObject from "../game-object"
import * as PIXI from "pixi.js"

abstract class Scene {
    stage: PIXI.Container
    disposed: boolean
    active: boolean
    objects: GameObject[]
    constructor({ autoStart }:{ autoStart:boolean }) {
        this.objects = []
        this.stage = new PIXI.Container
        this.disposed = false
        if(autoStart) {
            this.start()
        }
    }
    

    start() {
        this.active = true
    }

    stop() {
        this.active = false
    }

    abstract init(): void
    abstract update(delta: number): void
    abstract cleanup(): void

    destroy() {
        for(let i = 0; i <this.objects.length; i++) {
            this.objects[i]?.destroy()
        }
        this.stage.destroy()
    }
}

export default Scene