import * as PIXI from 'pixi.js'

type Position = {
    x: number
    y: number
}

abstract class GameObject {
    protected _sprite: PIXI.Sprite
    protected _stage: PIXI.Container
    active: boolean
    destroyed: boolean = false
    position: Position = { x: 0, y: 0 }
    vel_x: number = 0
    vel_y: number = 0
    protected _display_boundbox: boolean = false
    protected _box: PIXI.Graphics

    constructor(texture: PIXI.Texture, stage: PIXI.Container, active: boolean = true)
    {
        const spr = new PIXI.Sprite(texture)
        this._sprite = spr
        this.active = active
        this._stage = stage
        const box = new PIXI.Graphics()
        const bound = spr.getBounds()
        box.lineStyle(2, 0xff0000)
        this._box = box.drawRect(bound.x, bound.y, bound.width, bound.height)
    }
    
    abstract update(): void
    abstract isHitted(target: GameObject): boolean
    onHit(target: GameObject): void {}

    get boundBox():PIXI.Rectangle {
        return this._sprite.getBounds()
    }

    display(pos_x: number, pos_y: number) {
        if(!this._sprite) {
            return
        }
        this.position.x = pos_x
        this.position.y = pos_y
        this._sprite.position.x = pos_x
        this._sprite.position.y = pos_y
        this._stage.addChild(this._sprite)
        if(this._display_boundbox) {
            this._box.position.x = pos_x
            this._box.position.y = pos_y
            this._stage.addChild(this._box)
        }
    }

    destroy() {
        if(this.destroyed) {
            return
        }
        this.active = false
        this.destroyed = true
        this._sprite?.destroy()
        this._box?.destroy()
    }

}

export default GameObject