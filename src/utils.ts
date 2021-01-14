export function toCenteringCoord(container_length: number, obj_length: number) {
    return container_length / 2 - obj_length / 2
}

export function belowPercent(val: number):boolean {
    return val <= Math.floor(Math.random() * 100)
}