import * as PIXI from 'pixi.js'
import SpriteBase from './sprite-base'

class TileSprite extends SpriteBase {
    constructor(texture: PIXI.Texture, width: number, height: number) {
        super()

        const spr = new PIXI.TilingSprite(texture, width, height)
        this._sprite = spr
    }

    display(container:PIXI.Container, pos_x:number, pos_y:number)
    {
        this._sprite.position.x = pos_x
        this._sprite.position.y = pos_y
        container.addChild(this._sprite)
    }
}

export default TileSprite