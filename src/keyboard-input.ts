class KeyboardInput {
    _keydown: boolean = false
    _keyup: boolean = true
    _last_pressed_keycode: string
    _pressing_keycodes: {[key:string]:boolean} = {}
    
    constructor() {
        window.document.addEventListener('keydown', this.onKeyDown.bind(this))
        window.document.addEventListener('keyup', this.onKeyUp.bind(this))
        this._pressing_keycodes = {}
    }

    init() {

    }

    get pressingKeys(): {[key:string]: boolean} {
        return this._pressing_keycodes
    }

    get isKeyUp(): boolean {
        return this._keyup
    }

    get isKeyDown(): boolean {
        return this._keydown
    }

    isKeyPressed(code: string) {
        return this._pressing_keycodes[code] === true
    }

    onKeyDown(ev: KeyboardEvent) {
        this._keyup = false
        this._keydown = true
        this._last_pressed_keycode = ev.code
        this._pressing_keycodes[ev.code] = true
    }

    onKeyUp(ev: KeyboardEvent) {
        console.log("keyup")
        this._keydown = false
        this._keyup = true
        this._last_pressed_keycode = undefined
        this._pressing_keycodes[ev.code] = false
    }
}

export default KeyboardInput