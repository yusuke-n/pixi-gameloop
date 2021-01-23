import * as PIXI from 'pixi.js'

class TextureHelper {
    loadFont(): Promise<void> {
        const loader = PIXI.Loader.shared
        
        return new Promise((resolve, reject) => {
            loader.add("bmpfont", "fonts/font.fnt")
            loader.onError.add(() => { reject() } )
            loader.load((loader, resources) => { resolve() })
        })
    }
    
    init(): Promise<void> {
        const loader = PIXI.Loader.shared
        
        return new Promise((resolve, reject) => {
            loader.add("tileset", "images/tileset.json").add("ui", "images/ui.json")
            loader.onError.add(() => { reject() } )
            loader.load((loader, resources) => { resolve() })
        })
    }

    getFromCache(name: string) {
        return PIXI.utils.TextureCache[name]
    }

    getSpriteSheet(name: string) {
        return PIXI.Loader.shared.resources[name]?.spritesheet
    }
}

const helper = new TextureHelper()

export default helper