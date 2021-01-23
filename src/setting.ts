type LevelData = {
    lv: number
    score: number
    pl_spd: number
    item_spd: number
    item_spawn: number
    bl_spawn: number
    bl_length: number
}

const levelMap: LevelData[] = [
    { lv: 5, score: 100, pl_spd: 2, item_spd: 2.5, item_spawn: 2.5, bl_spawn: 3, bl_length: 6 },
    { lv: 4, score: 50, pl_spd: 1.75, item_spd: 2, item_spawn: 2.5, bl_spawn: 2.5, bl_length: 6 },
    { lv: 3, score: 30, pl_spd: 1.5, item_spd: 1.5, item_spawn: 1.75, bl_spawn: 1.75, bl_length: 5 },
    { lv: 2, score: 10, pl_spd: 1.25, item_spd: 1, item_spawn: 1.5, bl_spawn: 1.5, bl_length: 4 },
]

export { levelMap, LevelData }