import GameObject from "./game-object"

class Bullet extends GameObject {
    isHitted(target: GameObject): boolean {
        return false
    }
    update() {
        
    }
}

export default Bullet