import * as PIXI from "pixi.js"
import GameObject from "./game-object"
import KeyboardInput from "./keyboard-input"
import TextureHelper from './texture-helper'
import { sleep } from "./utils"
import State from "./state"
import { ViewSize } from "./const"

class Player extends GameObject{
    _jumping:boolean = false
    _jumping_frame:number = 0
    _jump_disable_frames:number = 0
    jump_frame: number = 40
    jump_height: number = 96
    spd: number = 1
    next_spd: number = 0
    bomb_anime: PIXI.AnimatedSprite

    constructor(stage: PIXI.Container) {
        super(TextureHelper.getFromCache("sushi"),  stage)
        const bomb = new PIXI.AnimatedSprite(TextureHelper.getSpriteSheet("tileset").animations["bomb"])
        bomb.loop = false
        bomb.onComplete = async () => { 
            bomb.visible = false
            bomb.destroy()
            await sleep(1000)
            State.gameover = true
        }
        this.bomb_anime = bomb
    }

    update() {
        if(this.destroyed) {
            this._sprite.visible = false
            return
        }

        if(!this.active) {
            return
        }
        if(this.next_spd > 0 && !this._jumping) {
            this.spd = this.next_spd
            this.next_spd = 0
        }
        if(KeyboardInput.isKeyPressed("ArrowUp") && !this._jumping) {
            this.jump()
        }
        if(this._jumping) {
            const jump_per_frame = Math.floor((this.jump_height / this.jump_frame)*2)
            this._jumping_frame++
            if(this._jumping_frame > this.jump_frame/2) {
                this.position.y += jump_per_frame
            } else {
                this.position.y -= jump_per_frame
            }
            
            if(this._jumping_frame >= this.jump_frame) {
                this._jumping = false
                this._jumping_frame = 0
            }
        }
        if(KeyboardInput.isKeyPressed("ArrowRight")) {
            this.vel_x = 2 * this.spd
        } else if(KeyboardInput.isKeyPressed("ArrowLeft")) {
            this.vel_x = -2 * this.spd
        }
        if(Math.abs(this.vel_x) > 0) {
            if(this.vel_x > 0) {
                this.vel_x = (this.vel_x * 10 - (2 * this.spd))/10
            } else {
                this.vel_x = (this.vel_x * 10 + (2 * this.spd))/10
            }
        }
        if(
            (this.vel_x > 0 && (Math.floor(this.position.x) + this._sprite.width + this.vel_x) < ViewSize.width) ||
            (this.vel_x < 0 && (Math.floor(this.position.x) + this.vel_x > 0))
        ) {
            this.position.x += this.vel_x
        }

        if(Math.floor(this.position.x) + this._sprite.width )
        this._sprite.position.x = this.position.x
        this._sprite.position.y = this.position.y
        if(this._display_boundbox) {
            this._box.position.x = this.position.x
            this._box.position.y = this.position.y
        }
    }

    destroy() {
        super.destroy()
    }

    jump() {
        this._jumping = true
    }

    boom() {
        if(this.destroyed || !this.active) {
            return
        } 
        const anime = this.bomb_anime
        anime.position.x = this.position.x
        anime.position.y = this.position.y
        anime.animationSpeed = 0.125
        this._stage.addChild(anime)
        anime.play()
    }

    isHitted(target:GameObject): boolean {
        return false
    }
    
}

export default Player