/**
 * 玩家：优先用抠好透明底的 player 贴图，不再用带灰格的立绘。
 */
import { DEPTH } from "../core/constants.js"
import { bus } from "../core/event-bus.js"

export class Player {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    this.scene = scene
    this.speed = 170

    const key = scene.textures.exists("player")
      ? "player"
      : scene.textures.exists("player_dot")
        ? "player_dot"
        : null

    if (!key) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0x3a8f74, 1)
      g.fillCircle(20, 28, 16)
      g.fillStyle(0xf2e6d0, 1)
      g.fillCircle(20, 14, 9)
      g.generateTexture("player_dot", 40, 48)
      g.destroy()
    }

    const tex = scene.textures.exists("player") ? "player" : "player_dot"
    this.sprite = scene.physics.add.sprite(x, y, tex)
    if (tex === "player") {
      this.sprite.setDisplaySize(42, 72)
    }
    this.sprite.setDepth(DEPTH.player)
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setDrag(900)
    this.sprite.body.setSize(22, 16)
    this.sprite.body.setOffset(
      (this.sprite.width - 22) / 2,
      this.sprite.height - 22,
    )

    this.label = scene.add
      .text(x, y - 44, "修士", {
        fontFamily: "Songti SC, serif",
        fontSize: "13px",
        color: "#f2e6d0",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.player)
  }

  /** @param {{ left:boolean,right:boolean,up:boolean,down:boolean }} input */
  update(input) {
    let vx = 0
    let vy = 0
    if (input.left) vx -= 1
    if (input.right) vx += 1
    if (input.up) vy -= 1
    if (input.down) vy += 1
    if (vx !== 0 && vy !== 0) {
      const inv = Math.SQRT1_2
      vx *= inv
      vy *= inv
    }
    this.sprite.setVelocity(vx * this.speed, vy * this.speed)
    if (vx < 0) this.sprite.setFlipX(true)
    if (vx > 0) this.sprite.setFlipX(false)
    this.sprite.setDepth(DEPTH.player + this.sprite.y * 0.01)
    this.label.setPosition(this.sprite.x, this.sprite.y - 44)
    this.label.setDepth(this.sprite.depth + 1)
    bus.emit("player:move", { x: this.sprite.x, y: this.sprite.y })
  }

  get x() {
    return this.sprite.x
  }
  get y() {
    return this.sprite.y
  }
}
