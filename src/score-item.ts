import GameObject from './game-object'
import TextureHelper from './texture-helper'

let prev_spawned_pos_x = 0

class ScoreItem extends GameObject {
    drop_spd: number = 0.5
    stage: PIXI.Container
    view_h: number

    constructor(stage: PIXI.Container, pos_x: number) {
        super(TextureHelper.getFromCache("soy"), stage)
        this.position.y = -32
        this.stage = stage
        this.view_h = this.stage.height
    }

    static spawn(stage: PIXI.Container) {
        const item = new ScoreItem(stage, 0)
        stage.addChild(item._sprite)
        return item
    }

    onHit(target: GameObject) {

    }

    update() {
        if(!this.active) {
            return
        }
        this.position.y += this.drop_spd
        this._sprite.position.y = this.position.y
        if(this.position.y > this.view_h + 32) {
            this.destroy()
        }
    }

    destroy() {
        this._sprite.destroy()
        this.active = false
        this.destroyed = true
    }
}

export default ScoreItem