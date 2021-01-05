import * as PIXI from 'pixi.js'

abstract class GameObject {
    _sprite: PIXI.Sprite
    position: {
        x: number,
        y: number
    } = { x: 0, y: 0 }
    vel_x: number = 0
    vel_y: number = 0

    constructor(texture: PIXI.Texture)
    {
        const spr = new PIXI.Sprite(texture)
        this._sprite = spr
    }
    
    abstract update(): void
    abstract onHit(target: GameObject): void

    displayTo(container:PIXI.Container, pos_x: number, pos_y: number) {
        if(!this._sprite) {
            return
        }
        this.position.x = pos_x
        this.position.y = pos_y
        this._sprite.position.x = pos_x
        this._sprite.position.y = pos_y
        container.addChild(this._sprite)
    }

}

export default GameObject