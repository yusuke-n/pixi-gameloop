import * as PIXI from 'pixi.js'

class SpriteBase {
    _sprite: PIXI.Sprite | PIXI.TilingSprite
    
    get width(): number {
        return this._sprite.width
    }

    get height(): number {
        return this._sprite.height
    }
    
    get texture():PIXI.Texture {
        return this._sprite.texture
    }

}

export default SpriteBase