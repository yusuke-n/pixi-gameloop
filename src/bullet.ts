import * as PIXI from "pixi.js"
import GameObject from "./game-object"
import Player from "./player"
import TextureHelper from "./texture-helper"
import { belowPercent } from "./utils"
import { ViewSize } from './const'

type status = "warning" | "stinging" | "waiting" | "stung"
interface SpawnOption {
    horizontal: boolean
    length: number
    fromLeft?: boolean
}

class Bullet extends GameObject {
    status: status = "warning"
    sting_spd: number = 2
    sting_frame: number = 15
    wait_frame: number = 50
    warning_frame: number = 45
    current_frame: number = 0
    _warning_sprite: PIXI.Sprite = null
    _warning_area_sprite: PIXI.Sprite
    _warning_displayed: boolean = false
    _blink: number = 0
    static max_height:number = 72
    static max_length:number = 4

    constructor(texture: PIXI.Texture, stage: PIXI.Container, public horizontal: boolean, public length: number, public index: number, public fromLeft: boolean) {
        super(texture, stage)
        
        this._warning_sprite = new PIXI.Sprite(TextureHelper.getFromCache("warn"))
        const area_sprite =  new PIXI.Sprite(PIXI.Texture.WHITE)
        area_sprite.tint = 0xfff39b
        area_sprite.alpha = 0.5
        area_sprite.width = 32 * this.length
        area_sprite.height = 32
        this._warning_area_sprite = area_sprite
        if(!this.horizontal) {
            this._sprite.angle = 90
            this._box.angle = 90
            this._warning_area_sprite.width = 32
            this._warning_area_sprite.height = 32 * this.length
        } else if(this.fromLeft) {
            this._sprite.angle = 180
            this._box.angle = 180
        }
    }

    static spawn(stage: PIXI.Container): Bullet[] {
        let length, horizontal, fromLeft
        length = Math.floor(Math.random() * (Bullet.max_length - 3) + 3)
        horizontal = belowPercent(50)
        fromLeft = belowPercent(50)

        let bullets: {obj: Bullet, x:number, y:number}[] = []
        let bl, x, y
        for(let i = 0; i < length; i++) {
            let texture = TextureHelper.getFromCache("chop1")
            if(i > 0) {
                texture = TextureHelper.getFromCache("chop2")
            }
            bl = new Bullet(texture, stage, horizontal, length, i, fromLeft)
            
            if(horizontal) {
                if(fromLeft === true){
                    if(i === 0){
                        x = 0 
                        y = Math.floor(Math.random() * (ViewSize.height - 32 - this.max_height) + this.max_height)
                    } else {
                        x -= 32
                    }
                } else {
                    if(i === 0){
                        x = ViewSize.width 
                        y = Math.floor(Math.random() * (ViewSize.height - 42 - this.max_height) + this.max_height)
                    } else {
                        x += 32
                    }
                }
            } else {
                if(i === 0) {
                    x = Math.floor(Math.random() * 256 + 20)
                    y = 256
                } else {
                    y += 32
                }
            }
            bullets.push({obj: bl, x:x, y:y})
        }
        bullets.map((bl) => bl.obj.display(bl.x, bl.y))
        return bullets.map((bl) => bl.obj)
    }

    update() {
        if(!this.active) {
            return
        }

        this.current_frame++
        switch(this.status) {
            case "warning":
                this.displayWarning()
                this.transitionToNextIfCan(this.warning_frame, "stinging")
                break
            case "stinging":
                this.fadeWarning()
                this.transitionToNextIfCan(this.sting_frame, "waiting")
                break
            case "waiting":
                this.transitionToNextIfCan(this.wait_frame, "stung")
        }

        if(this.status === "stinging" || this.status === "stung") {
            const delta = Math.floor((this.length * 32) / this.sting_frame)
            if(this.horizontal) {
                if(this.status === "stinging") {
                    if(this.fromLeft) {
                        this.position.x += delta
                    } else {
                        this.position.x -= delta
                    }
                } else {
                    if(this.fromLeft) {
                        this.position.x -= delta
                    } else {
                        this.position.x += delta
                    }
                }
            } else {
                if(this.status === "stinging") {
                    this.position.y -= delta
                } else {
                    this.position.y += delta
                }
            }
            this._sprite.position.x = this.position.x
            this._sprite.position.y = this.position.y

            if(this._display_boundbox) {
                this._box.position.x = this.position.x
                this._box.position.y = this.position.y
            }

            this.destroyIfStung()
        }
    }

    transitionToNextIfCan(condition_frames: number, next: status) {
        if(this.current_frame >= condition_frames) {
            this.status = next
            this.current_frame = 0
        }
    }

    display(x: number, y: number) {
        super.display(x, y)
    }

    displayWarning() {
        if(this.index !== 0) {
            return
        }
        const icn_spr = this._warning_sprite
        const area_spr = this._warning_area_sprite
        if(this._warning_displayed) {
            if(this._blink == 0) {
                area_spr.alpha -= 0.5
                this._blink = 1
            } else {
                area_spr.alpha += 0.5
                this._blink = 0
            }
        } else {
            if(this.horizontal) {
                if(this.fromLeft) {
                    icn_spr.position.x = 0
                    icn_spr.position.y = this.position.y - 21
                    area_spr.position.x = 0 
                    area_spr.position.y = this.position.y - 21
                } else {
                    icn_spr.position.x = ViewSize.width - 32
                    icn_spr.position.y = this.position.y - 9
                    area_spr.position.x = ViewSize.width - 32 * this.length
                    area_spr.position.y = this.position.y - 9
                }
            } else {
                icn_spr.position.x = this.position.x - 21
                icn_spr.position.y = ViewSize.height - 32 * 2
                area_spr.position.x = this.position.x - 21
                area_spr.position.y = ViewSize.height - area_spr.height
            }
            this._stage.addChild(area_spr)
            this._stage.addChild(icn_spr)
            this._warning_displayed = true
        }
    }

    fadeWarning() {
        if(this.index !== 0) {
            return
        }
        this._warning_sprite.visible = false
        if(this._warning_area_sprite.alpha > 0) {
            this._warning_area_sprite.alpha -= 0.1
        } else {
            this._warning_area_sprite.visible = false
        }
    }

    destroyIfStung() {
        if(this.status !== "stung") {
            return
        }
        if(this.position.y >= ViewSize.height + this._sprite.height) {
            super.destroy()
            this._stage.removeChild(this._warning_sprite, this._warning_area_sprite)
            this._warning_sprite.destroy()
            this._warning_area_sprite.destroy()
        }
        
    }

    onHit(target: Player) {
        target.boom()
        target.destroy()
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
}

export default Bullet