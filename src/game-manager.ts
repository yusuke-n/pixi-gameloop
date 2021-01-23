import * as PIXI from 'pixi.js'
import App from './pixi-app'
import KeyboardInput from './keyboard-input'
import { LoadScene } from './scene'
import SceneManager from './scene-manager'

class GameManager {
    app = App
    skip_frames: number = 0

    constructor() {
        this.app.gameLoop = this.updateScene.bind(this)
    }
    
    async init() {
        this.app.init()
        KeyboardInput.init()
        SceneManager.init()
        SceneManager.goto(new LoadScene())
        this.app.start()
    }

    get currentStage(): PIXI.Container{
        return this.app.stage
    }

    updateScene(delta: number) {
        SceneManager.cleanup()
        const current = SceneManager.current
        if(current.active) {
            this.app.stage = current.stage
            current.update(delta)
        }
    }
}

export default GameManager

