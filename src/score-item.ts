import GameObject from './game-object'
import TextureHelper from './texture-helper'
import State from './state'

class ScoreItem extends GameObject {
    drop_spd: number = 2.5
    stage: PIXI.Container
    view_h: number
    view_w: number
    static max_spd: number = 20
    static prev_spawned_pos_x = 0
    static spd_factor = 0.75

    constructor(stage: PIXI.Container, pos_x: number) {
        super(TextureHelper.getFromCache("soy"), stage)
        this.position.y = -32
        this.position.x = pos_x
        this.stage = stage
        this.view_w = this.stage.width
        this.view_h = this.stage.height
    }

    static setMaxSpd(max: number) {
        ScoreItem.max_spd = max
    }
    
    static setSpdFactor(f: number) {
        ScoreItem.spd_factor = f
    }

    static spawn(stage: PIXI.Container) {
        const item = new ScoreItem(stage, 256)
        let spawn_x = Math.floor(Math.random()*256)
        item.position.x = spawn_x
        ScoreItem.prev_spawned_pos_x = spawn_x

        const spd = Math.floor(Math.random() * ScoreItem.max_spd)/10 * ScoreItem.spd_factor
        item.drop_spd = Math.round(spd * 100) / 100
        if(item.drop_spd < 0.3) {
            item.drop_spd = 0.3
        }
        console.log("item spawned at(x):", item.position.x)
        console.log("drop_spd:", item.drop_spd)
        item.display(item.position.x, item.position.y)
        return item
    }

    onHit(target: GameObject) {
        if(State.score <= 9999) {
            State.score += 1
        }
        this.destroy()
    }

    isHitted(target: GameObject): boolean {
        if(!this.active || this.destroyed) {
            return false
        }
        const b1 = this._sprite.getBounds()
        const b2 = target.boundBox

        if(b2.x + b2.width < b1.x || 
           b1.x + b1.width < b2.x ||
           b1.y + b1.height < b2.y ||
           b2.y + b2.height < b1.y) {
               return false
           }
        
        return true;
    }

    update() {
        if(!this.active) {
            return
        }
        this.position.y += this.drop_spd
        this._sprite.position.x = this.position.x
        this._sprite.position.y = this.position.y
        if(this.position.y > this.view_h + 32) {
            this.destroy()
        }
    }

    destroy() {
        console.log("item destroyed:", this)
        this._sprite.destroy()
        this.active = false
        this.destroyed = true
    }
}

export default ScoreItem