import * as PIXI from 'pixi.js'

const APP_WIDTH = 288
const APP_HEIGHT = 256

class PixiApp {
    app: PIXI.Application
    type: string  = PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
    gameLoop: (delta: number) => void
    textureLoaded: (loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => void

    constructor() {
        this.app = this.createApp()
        this.app.ticker.autoStart = false
        this.app.loader.add("tileset", "images/tileset.json").add("ui", "images/ui.json").add("bmpfont", "fonts/font.fnt")
    }

    get fps(): number {
        return Math.floor(this.app.ticker.FPS)
    }

    get stage(): PIXI.Container {
        return this.app.stage
    }

    get view(): HTMLCanvasElement {
        return this.app.view
    }

    init() {
        this.app.ticker.add(this.gameLoop)
        this.load()
    }

    load() {
        this.app.loader.load(this.textureLoaded)
    }

    createApp() {
        const app = new PIXI.Application({ width: APP_WIDTH, height: APP_HEIGHT, transparent: false })
        document.getElementById("app").appendChild(app.view)
        return app
    }
}

export default PixiApp