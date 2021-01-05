import * as PIXI from 'pixi.js'

abstract class GameObject {
    _sprite: PIXI.Sprite
    _stage: PIXI.Container
    active: boolean
    destroyed: boolean = false
    position: {
        x: number,
        y: number
    } = { x: 0, y: 0 }
    vel_x: number = 0
    vel_y: number = 0

    constructor(texture: PIXI.Texture, stage: PIXI.Container, active: boolean = true)
    {
        const spr = new PIXI.Sprite(texture)
        this._sprite = spr
        this.active = active
        this._stage = stage
    }
    
    abstract update(): void
    abstract onHit(target: GameObject): void

    display(pos_x: number, pos_y: number) {
        if(!this._sprite) {
            return
        }
        this.position.x = pos_x
        this.position.y = pos_y
        this._sprite.position.x = pos_x
        this._sprite.position.y = pos_y
        this._stage.addChild(this._sprite)
    }

}

export default GameObject