/**
 * 全局常量
 * 为什么集中：键位、层深、块尺寸改一处即可，方便后续接 5×5 地图与 8 向帧。
 */
export const GAME_W = 960
export const GAME_H = 540

/** 地图单块像素（后续接 AI 切图时可改） */
export const TILE = 64

/** 显示层级 */
export const DEPTH = {
  ground: 0,
  entity: 10,
  player: 20,
  fx: 30,
  ui: 100,
}

export const KEYS = {
  up: ["W", "UP"],
  down: ["S", "DOWN"],
  left: ["A", "LEFT"],
  right: ["D", "RIGHT"],
}
