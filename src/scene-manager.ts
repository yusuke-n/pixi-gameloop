import Scene from "./scene/scene-base"

class SceneManager {
    scenes: Scene[]
    constructor() {
        this.scenes = []
    }

    init() {
        this.cleanup({all: true})
        this.scenes = []
    }

    goto(scene: Scene) {
        scene.init()
        this.scenes.unshift(scene)
    }

    back({withInit}: {withInit:boolean} = {withInit: false}): Scene {
        const scene = this.scenes.shift()
        scene.cleanup()
        if(withInit) {
            this.current.init()
        }
        return scene
    }
    
    cleanup({ all }:{ all: boolean } = { all: false }) {
        for(let i = all ? 0 : 1; i<this.scenes.length; i++) {
            const scene = this.scenes[i]
            if(scene.disposed) {
                scene.cleanup()
                scene.destroy()
                this.scenes[i] = null
            }
        }
        this.scenes = this.scenes.filter((sc) => sc !== null)
    }

    get current():Scene {
        const current = this.scenes[0]
        if(!current) {
            throw new Error("SceneManager has no scenes.")
        }
        return current
    }

}

const scm = new SceneManager()

export default scm