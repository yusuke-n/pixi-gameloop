import * as PIXI from "pixi.js"
import { ViewSize } from "./const"
import { toCenteringCoord } from "./utils"

interface AbsoluteDisplayOption {
    position: "absolute"
    coord: { x:number, y:number }
}
interface LocationDisplayOption {
    position: "top-left" | "top" | "top-right" | "left" | "center" | "right" | "bottom-left" | "bottom" | "bottom-right"
    padding?: { x:number, y:number }
}
interface Margin { top: number, right: number, bottom: number, left: number }
type Location = AbsoluteDisplayOption["position"] | LocationDisplayOption["position"]
type Orientation = "horizontal" | "vertical"

class BitmapTextBox extends PIXI.Container {
    orientation: Orientation
    margin: number
    location: Location

    constructor({orientation, margin}: { orientation: Orientation, margin?: number }) {
        super()
        this.orientation = orientation
        this.margin = margin || 0
    }

    get texts(): PIXI.BitmapText[] {
        return this.children as PIXI.BitmapText[]
    }
    
    addText(text: PIXI.BitmapText | PIXI.BitmapText[]) {
        const texts = Array.isArray(text) ? text : [text]
        for(let i = 0; i < texts.length; i++) {
            const txt = texts[i]
            this.addChild(txt)
            if(this.texts.length === 1) {
                txt.position.x = 0
                txt.position.y = 0
            } else {
                const last_elm = this.texts[this.texts.length - 2]            
                if(this.orientation === "vertical") {
                    txt.position.x = 0
                    txt.position.y = last_elm.height + this.margin
                } else {
                    txt.position.y = 0
                    txt.position.x = last_elm.width + this.margin
                }
            }
        }        
    }

    displayTo(stage: PIXI.Container, location: LocationDisplayOption | AbsoluteDisplayOption) {
        let x, y = 0
        this.location = location.position
        switch(location.position) {
            case "absolute":
                x = location.coord.x
                y = location.coord.y
                break
            case "top-left":
                x = location.padding.x || 0
                y = location.padding.y || 0
                break
            case "top":
                x = toCenteringCoord(ViewSize.width, this.width)
                y = location.padding?.y || 0
                break
            case "top-right":
                x = ViewSize.width - this.width - (location.padding?.x || 0)
                y = location.padding?.y || 0
                break
            case "left":
                x = location.padding?.x || 0
                y = toCenteringCoord(ViewSize.height, this.height)
                break
            case "center":
                x = toCenteringCoord(ViewSize.width, this.width)
                y = toCenteringCoord(ViewSize.height, this.height)
                break
            case "right":
                x = ViewSize.width - this.width - (location.padding?.x || 0)
                y = toCenteringCoord(ViewSize.width, this.width)
                break
            case "bottom-left":
                x = 0
                y = ViewSize.height - this.height - (location.padding?.y || 0)
                break
            case "bottom":
                x = toCenteringCoord(ViewSize.width, this.width)
                y = ViewSize.height - this.height- (location.padding?.y || 0)
                break
            case "bottom-right":
                x = ViewSize.width - this.width - (location.padding?.x || 0)
                y = ViewSize.height - this.height - (location.padding?.y || 0)
                break
        }

        this.position.x = x
        this.position.y = y
        stage.addChild(this)
    }

}

export { BitmapTextBox }