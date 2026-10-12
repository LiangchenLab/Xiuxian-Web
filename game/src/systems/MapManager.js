/**
 * 青云山地图：草地贴图铺地 + 松树/石/灯装饰 + 石径与山门感
 * 为什么不用灰绿棋盘：玩家要「看得见游戏」，占位棋盘等于没有内容。
 */
import { TILE, DEPTH } from "../core/constants.js"

export class MapManager {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ id: string, cols: number, rows: number }} def
   */
  constructor(scene, def) {
    this.scene = scene
    this.def = def
    this.obstacles = null
  }

  build() {
    const { cols, rows, id } = this.def
    const worldW = cols * TILE
    const worldH = rows * TILE
    const s = this.scene

    // 草地：有贴图则平铺，否则柔和色块兜底
    if (s.textures.exists("grass")) {
      const tile = s.add.tileSprite(0, 0, worldW, worldH, "grass")
      tile.setOrigin(0, 0)
      tile.setDepth(DEPTH.ground)
      // 略压暗，让角色更突出
      tile.setTint(0xc8e0c0)
    } else {
      const g = s.add.graphics()
      g.fillStyle(0x3d6b4f, 1)
      g.fillRect(0, 0, worldW, worldH)
      g.setDepth(DEPTH.ground)
    }

    // 石径：从下方通往中央「洞府」
    const path = s.add.graphics()
    path.fillStyle(0x8a7a5c, 0.85)
    path.fillRoundedRect(worldW * 0.5 - 36, worldH * 0.35, 72, worldH * 0.55, 12)
    path.fillStyle(0x6e624a, 0.5)
    for (let y = worldH * 0.4; y < worldH * 0.9; y += 28) {
      path.fillEllipse(worldW * 0.5, y, 50, 10)
    }
    path.setDepth(DEPTH.ground + 1)

    // 中央洞府台地
    const plaza = s.add.graphics()
    plaza.fillStyle(0x5a4a38, 0.55)
    plaza.fillRoundedRect(worldW * 0.5 - 120, worldH * 0.28 - 80, 240, 160, 16)
    plaza.lineStyle(3, 0xd4b15a, 0.65)
    plaza.strokeRoundedRect(worldW * 0.5 - 120, worldH * 0.28 - 80, 240, 160, 16)
    plaza.setDepth(DEPTH.ground + 2)

    s.add
      .text(worldW * 0.5, worldH * 0.28 - 50, "青云洞府", {
        fontFamily: "Songti SC, serif",
        fontSize: "22px",
        color: "#f2e6d0",
        stroke: "#1a1814",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ground + 3)

    // 装饰：树 / 石 / 灯笼散落，带简易碰撞
    this.obstacles = s.physics.add.staticGroup()
    const spots = [
      { k: "tree", x: 180, y: 220, sc: 0.35 },
      { k: "tree", x: worldW - 200, y: 260, sc: 0.4 },
      { k: "tree", x: 320, y: worldH - 180, sc: 0.38 },
      { k: "tree", x: worldW - 280, y: worldH - 220, sc: 0.42 },
      { k: "tree", x: 520, y: 160, sc: 0.32 },
      { k: "rock", x: 640, y: 420, sc: 0.28 },
      { k: "rock", x: 260, y: 480, sc: 0.25 },
      { k: "rock", x: worldW - 360, y: 520, sc: 0.3 },
      { k: "lantern", x: worldW * 0.5 - 100, y: worldH * 0.28 + 40, sc: 0.22 },
      { k: "lantern", x: worldW * 0.5 + 100, y: worldH * 0.28 + 40, sc: 0.22 },
      { k: "lantern", x: 400, y: worldH - 280, sc: 0.2 },
    ]

    for (const sp of spots) {
      if (!s.textures.exists(sp.k)) continue
      const img = s.add.image(sp.x, sp.y, sp.k)
      img.setScale(sp.sc)
      img.setDepth(DEPTH.entity + sp.y * 0.01)
      img.setOrigin(0.5, 0.85)
      // 脚底小碰撞，别挡死整棵树
      const body = s.add.rectangle(sp.x, sp.y - 8, 28, 18, 0x000000, 0)
      s.physics.add.existing(body, true)
      this.obstacles.add(body)
    }

    // 灵草可拾取点（金色光点）
    this.herbs = []
    for (let i = 0; i < 8; i++) {
      const hx = 120 + Math.random() * (worldW - 240)
      const hy = 120 + Math.random() * (worldH - 240)
      const herb = s.add.circle(hx, hy, 7, 0x7dcea0, 0.95)
      herb.setStrokeStyle(2, 0xd4b15a, 0.9)
      herb.setDepth(DEPTH.entity)
      s.tweens.add({
        targets: herb,
        alpha: 0.45,
        y: hy - 4,
        duration: 900,
        yoyo: true,
        repeat: -1,
        delay: i * 80,
      })
      this.herbs.push({ x: hx, y: hy, node: herb, taken: false })
    }

    s.physics.world.setBounds(0, 0, worldW, worldH)
    s.cameras.main.setBounds(0, 0, worldW, worldH)

    s.add
      .text(12, 8, `青云山 · ${id}`, {
        fontFamily: "Songti SC, serif",
        fontSize: "14px",
        color: "#d4b15a",
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: { x: 6, y: 3 },
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ui)

    return { worldW, worldH }
  }

  expand(side) {
    console.info(`[MapManager] expand ${side}`)
  }
}
