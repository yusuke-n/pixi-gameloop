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

type Align = "left" | "center" | "right"
type Location = AbsoluteDisplayOption["position"] | LocationDisplayOption["position"]
type Orientation = "horizontal" | "vertical"

class LocatableContainer extends PIXI.Container {
    orientation: Orientation
    margin: number
    location: Location
    align: Align

    constructor({orientation, margin, align}: { orientation: Orientation, margin?: number, align?: Align }) {
        super()
        this.orientation = orientation
        this.margin = margin || 0
        this.align = align || "left"
    }

    add(...items: PIXI.Container[]) {
        for(let i = 0; i < items.length; i++) {
            const txt = items[i]
            this.addChild(txt)
            if(this.children.length === 1) {
                txt.position.x = 0
                txt.position.y = 0
            } else {
                const last_elm = this.children[this.children.length - 2] as PIXI.Container        
                if(this.orientation === "vertical") {
                    txt.position.x = 0
                    txt.position.y = last_elm.y + last_elm.height + this.margin
                } else {
                    txt.position.y = 0
                    txt.position.x = last_elm.x + last_elm.width + this.margin
                }
            }
        }
        if(this.orientation === "vertical") {
            this.alignItems()
        }
    }

    alignItems() {
        for(let i = 0; i<this.children.length; i++) {
            const item = this.children[i] as PIXI.Container
            switch(this.align) {
                case "center":
                    item.position.x = this.width / 2 - item.width / 2
                    break
                case "right":
                    item.position.x = this.width - item.width
                    break
                default:
                    item.position.x = 0
                    break
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

export { LocatableContainer }