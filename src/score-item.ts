import GameObject from './game-object'
import TextureHelper from './texture-helper'
import State from './state'
import { ViewSize } from './const'

class ScoreItem extends GameObject {
    drop_spd: number = 2.5
    stage: PIXI.Container
    _spd_factor = 0.75
    static max_spd: number = 8
    static prev_spawned_pos_x = 0
    static spd_factor = 0.75

    constructor(stage: PIXI.Container, pos_x: number) {
        super(TextureHelper.getFromCache("soy"), stage)
        this.position.y = -32
        this.position.x = pos_x
        this._spd_factor = ScoreItem.spd_factor
        this.stage = stage
    }

    static spawn(stage: PIXI.Container) {
        const item = new ScoreItem(stage, 256)
        let spawn_x = Math.floor(Math.random()*256)
        item.position.x = spawn_x
        ScoreItem.prev_spawned_pos_x = spawn_x

        let spd = Math.floor(Math.random() * ScoreItem.max_spd)/10 * item._spd_factor
        if(spd > ScoreItem.max_spd) {
            spd = ScoreItem.max_spd
        }
        item.drop_spd = Math.round(spd * 100) / 100
        if(item.drop_spd < 0.3) {
            item.drop_spd = 0.3
        }
        item.display(item.position.x, item.position.y)
        return item
    }

    onHit(target: GameObject) {
        if(State.score <= 999) {
            State.score += 1
        }
        this.destroy()
    }

    isHitted(target: GameObject): boolean {
        if(!this.active || this.destroyed || !target.active || target.destroyed) {
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

        if(this._display_boundbox) {
            this._box.position.x = this.position.x
            this._box.position.y = this.position.y
        }
        
        if(this.position.y > ViewSize.height + 32) {
            this.destroy()
        }
    }

    destroy() {
        super.destroy()
    }
}

export default ScoreItem