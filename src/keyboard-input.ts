class KeyboardInput {
    _keydown: boolean = false
    _keyup: boolean = true
    _last_pressed_keycode: string
    _pressing_keycodes: {[key:string]:boolean} = {}
    _uped_key: string
    
    constructor() {
        window.document.addEventListener('keydown', this.onKeyDown.bind(this))
        window.document.addEventListener('keyup', this.onKeyUp.bind(this))
        this._pressing_keycodes = {}
    }

    init() {

    }

    get code(): string {
        return this._last_pressed_keycode
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

    isKeyUped(code: string) {
        if(!this.isKeyUp) {
            return false
        }
        return code === this._uped_key
    }

    onKeyDown(ev: KeyboardEvent) {
        if(ev.code !== 'F5' && ev.code !== 'F12' ) {
            ev.preventDefault()
        }
        this._keyup = false
        this._keydown = true
        this._last_pressed_keycode = ev.code
        this._uped_key = ""
        this._pressing_keycodes[ev.code] = true
    }

    onKeyUp(ev: KeyboardEvent) {
        ev.preventDefault()
        this._keydown = false
        this._keyup = true
        this._uped_key = ev.code
        this._pressing_keycodes[ev.code] = false
    }
}

const kbd = new KeyboardInput()

export default kbd