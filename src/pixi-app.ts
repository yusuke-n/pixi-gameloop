import * as PIXI from 'pixi.js'
import { ViewSize } from './const'

const APP_WIDTH = 288
const APP_HEIGHT = 256

class PixiApp {
    app: PIXI.Application
    type: string  = PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
    layer: PIXI.Container[]
    gameLoop: (delta: number) => void

    constructor() {
        this.app = this.createApp()
        this.app.ticker.stop()
        this.app.ticker.autoStart = false
        this.layer = []
    }

    get fps(): number {
        return Math.floor(this.app.ticker.FPS)
    }

    get ticker(): PIXI.Ticker {
        return this.app.ticker
    }

    set ticker(val: PIXI.Ticker) {
        this.app.ticker = val
    }

    get stage(): PIXI.Container {
        return this.app.stage
    }

    set stage(val: PIXI.Container) {
        this.app.stage = val
    }

    get view(): HTMLCanvasElement {
        return this.app.view
    }

    init() {
        ViewSize.width = this.app.view.width
        ViewSize.height = this.app.view.height
        this.app.ticker.add(this.gameLoop)
    }

    start() {
        this.app.ticker.start()
    }

    createApp() {
        PIXI.autoDetectRenderer({width: APP_WIDTH, height: APP_HEIGHT})
        const app = new PIXI.Application({ width: APP_WIDTH, height: APP_HEIGHT, transparent: false })
        document.getElementById("app").appendChild(app.view)
        return app
    }
}

const app = new PixiApp()
export default app