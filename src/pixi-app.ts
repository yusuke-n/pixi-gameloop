import * as PIXI from 'pixi.js'

const APP_WIDTH = 288
const APP_HEIGHT = 256

class PixiApp {
    app: PIXI.Application
    type: string  = PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
    gameLoop: (delta: number) => void

    constructor() {
        this.app = this.createApp()
        this.app.ticker.stop()
        this.app.ticker.autoStart = false
    }

    get fps(): number {
        return Math.floor(this.app.ticker.FPS)
    }

    get ticker(): PIXI.Ticker {
        return this.app.ticker
    }

    get stage(): PIXI.Container {
        return this.app.stage
    }

    get view(): HTMLCanvasElement {
        return this.app.view
    }

    init() {
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

export default PixiApp