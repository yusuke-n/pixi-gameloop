import * as PIXI from 'pixi.js'

class TextureHelper {
    static init(): Promise<void> {
        const loader = PIXI.Loader.shared
        
        return new Promise((resolve, reject) => {
            loader.add("tileset", "images/tileset.json").add("ui", "images/ui.json").add("bmpfont", "fonts/font.fnt")
            loader.onError.add(() => { reject() } )
            loader.load((loader, resources) => { resolve() })
        })
    }
    static getFromCache(name: string) {
        return PIXI.utils.TextureCache[name]
    }
}

export default TextureHelper