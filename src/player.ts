import * as PIXI from "pixi.js"
import GameManager from "./game-manager"
import GameObject from "./game-object"
import KeyboardInput from "./keyboard-input"
import TextureHelper from './texture-helper'

const JUMP_FRAME = 24

class Player extends GameObject {
    _jumping:boolean = false
    _jumping_frame:number = 0
    _jump_disable_frames:number = 0

    constructor(stage: PIXI.Container) {
        super(TextureHelper.getFromCache("sushi"),  stage)
    }

    update() {
        if(KeyboardInput.isKeyPressed("ArrowUp") && !this._jumping) {
            this.jump()
        }
        if(this._jumping) {
            this._jumping_frame++
            if(this._jumping_frame > JUMP_FRAME/2) {
                this.position.y += 4
            } else {
                this.position.y -= 4
            }
            
            if(this._jumping_frame >= JUMP_FRAME) {
                this._jumping = false
                this._jumping_frame = 0
            }
        }
        if(KeyboardInput.isKeyPressed("ArrowRight")) {
            this.vel_x = 2
        } else if(KeyboardInput.isKeyPressed("ArrowLeft")) {
            this.vel_x = -2
        }
        if(Math.abs(this.vel_x) > 0) {
            if(this.vel_x > 0) {
                this.vel_x = (this.vel_x * 10 - 2)/10
            } else {
                this.vel_x = (this.vel_x * 10 + 2)/10
            }
        }

        this.position.x += this.vel_x
        this._sprite.position.x = this.position.x
        this._sprite.position.y = this.position.y
    }

    jump() {
        this._jumping = true
    }

    isHitted(target:GameObject): boolean {
        return false
    }
    
}

export default Player