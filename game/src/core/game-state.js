/**
 * 存档级状态（跨场景）
 * 为什么单独一层：World / UI / 菜单都读同一份，后续接 localStorage 只改这里。
 */
const KEY = "lingxing-phaser-v1"

const defaults = () => ({
  playerName: "无名散修",
  realm: "炼气",
  qi: 0,
  herbs: 0,
  elderBonus: false,
  mapId: "qingyunshan",
  x: 960,
  y: 1050,
})

export const GameState = {
  data: defaults(),

  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) this.data = { ...defaults(), ...JSON.parse(raw) }
    } catch {
      this.data = defaults()
    }
    return this.data
  },

  save() {
    localStorage.setItem(KEY, JSON.stringify(this.data))
  },

  reset() {
    this.data = defaults()
    this.save()
  },
}
