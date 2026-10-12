/**
 * 青云山主场景：可走、可撞、可采灵草、可对话
 */
import { GameState } from "../core/game-state.js"
import { MapManager } from "../systems/MapManager.js"
import { Player } from "../entities/Player.js"
import { bus } from "../core/event-bus.js"
import { DEPTH } from "../core/constants.js"

export class WorldScene extends Phaser.Scene {
  constructor() {
    super("World")
  }

  create() {
    GameState.load()
    if (GameState.data.herbs == null) GameState.data.herbs = 0
    this.cameras.main.setBackgroundColor("#1a3a2c")

    this.map = new MapManager(this, {
      id: GameState.data.mapId || "qingyunshan",
      cols: 30,
      rows: 20,
    })
    this.map.build()

    // 出生点：石径靠下；旧存档若在怪位置则拉回
    let spawnX = GameState.data.x || 960
    let spawnY = GameState.data.y || 1050
    if (spawnX < 40 || spawnY < 40) {
      spawnX = 960
      spawnY = 1050
    }
    this.player = new Player(this, spawnX, spawnY)
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12)
    this.cameras.main.setZoom(1.15)

    if (this.map.obstacles) {
      this.physics.add.collider(this.player.sprite, this.map.obstacles)
    }

    // NPC：守山长老
    this.npc = this.add.circle(960, 380, 18, 0xc9a227, 1)
    this.npc.setStrokeStyle(3, 0xf2e6d0)
    this.npc.setDepth(DEPTH.entity)
    this.add
      .text(960, 350, "守山长老", {
        fontFamily: "Songti SC, serif",
        fontSize: "13px",
        color: "#d4b15a",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.entity)
    this._npcHint = this.add
      .text(960, 410, "靠近按 E 对话", {
        fontFamily: "Songti SC, serif",
        fontSize: "11px",
        color: "#f2e6d0",
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ui)
      .setVisible(false)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      talk: Phaser.Input.Keyboard.KeyCodes.E,
    })

    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.pause("World")
      this.scene.launch("Pause")
    })

    this._touch = { left: false, right: false, up: false, down: false }
    this._buildJoystick()

    this._talking = false
    this._dlg = null
  }

  /** 左下虚拟摇杆，不再劫持全屏点击 */
  _buildJoystick() {
    const baseX = 90
    const baseY = this.scale.height - 90
    this._joy = { baseX, baseY, r: 52, active: false }

    this._joyBase = this.add
      .circle(baseX, baseY, 52, 0x000000, 0.35)
      .setStrokeStyle(2, 0xd4b15a, 0.6)
      .setScrollFactor(0)
      .setDepth(DEPTH.ui)
    this._joyKnob = this.add
      .circle(baseX, baseY, 22, 0xd4b15a, 0.55)
      .setScrollFactor(0)
      .setDepth(DEPTH.ui)

    this.input.on("pointerdown", (p) => {
      if (p.x < this.scale.width * 0.45 && p.y > this.scale.height * 0.45) {
        this._joy.active = true
        this._aimJoy(p.x, p.y)
      }
    })
    this.input.on("pointermove", (p) => {
      if (this._joy.active && p.isDown) this._aimJoy(p.x, p.y)
    })
    this.input.on("pointerup", () => {
      this._joy.active = false
      this._touch = { left: false, right: false, up: false, down: false }
      this._joyKnob.setPosition(this._joy.baseX, this._joy.baseY)
    })
  }

  _aimJoy(x, y) {
    const { baseX, baseY, r } = this._joy
    let dx = x - baseX
    let dy = y - baseY
    const len = Math.hypot(dx, dy) || 1
    if (len > r) {
      dx = (dx / len) * r
      dy = (dy / len) * r
    }
    this._joyKnob.setPosition(baseX + dx, baseY + dy)
    const dead = 12
    this._touch = {
      left: dx < -dead,
      right: dx > dead,
      up: dy < -dead,
      down: dy > dead,
    }
  }

  _tryTalk() {
    const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, 960, 380)
    this._npcHint.setVisible(d < 90)
    if (d >= 90) return
    if (!Phaser.Input.Keyboard.JustDown(this.wasd.talk)) return
    if (this._talking) {
      this._closeDlg()
      return
    }
    this._talking = true
    const lines = [
      "小友，青云山禁地凶险，且先采些灵草稳固道基。",
      `你已采集灵草 ${GameState.data.herbs || 0} 株。满 5 株可来找我点拨吐纳。`,
      GameState.data.herbs >= 5
        ? "善。记住所见所感，闭关之时必有进益。（灵气感悟 +1）"
        : "石径两侧幽光便是灵草，靠近即可采撷。",
    ]
    if (GameState.data.herbs >= 5 && !GameState.data.elderBonus) {
      GameState.data.elderBonus = true
      GameState.data.qi = (GameState.data.qi || 0) + 1
    }
    const text = lines[Math.min(2, GameState.data.herbs >= 5 ? 2 : 1)]
    this._dlg = this.add
      .text(this.scale.width / 2, this.scale.height - 70, text, {
        fontFamily: "Songti SC, serif",
        fontSize: "15px",
        color: "#f2e6d0",
        backgroundColor: "rgba(12,22,30,0.85)",
        padding: { x: 14, y: 10 },
        wordWrap: { width: this.scale.width - 80 },
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ui + 5)
    bus.emit("ui:toast", "再按 E 关闭对话")
  }

  _closeDlg() {
    this._talking = false
    this._dlg?.destroy()
    this._dlg = null
  }

  _pickHerbs() {
    if (!this.map.herbs) return
    for (const h of this.map.herbs) {
      if (h.taken) continue
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, h.x, h.y)
      if (d < 36) {
        h.taken = true
        h.node.destroy()
        GameState.data.herbs = (GameState.data.herbs || 0) + 1
        bus.emit("ui:herbs", GameState.data.herbs)
        bus.emit("ui:toast", `采得灵草 ×${GameState.data.herbs}`)
      }
    }
  }

  update() {
    if (this._talking) {
      this.player.sprite.setVelocity(0, 0)
      if (Phaser.Input.Keyboard.JustDown(this.wasd.talk)) this._closeDlg()
      return
    }
    const input = {
      left: this.cursors.left.isDown || this.wasd.left.isDown || this._touch.left,
      right: this.cursors.right.isDown || this.wasd.right.isDown || this._touch.right,
      up: this.cursors.up.isDown || this.wasd.up.isDown || this._touch.up,
      down: this.cursors.down.isDown || this.wasd.down.isDown || this._touch.down,
    }
    this.player.update(input)
    GameState.data.x = this.player.x
    GameState.data.y = this.player.y
    this._pickHerbs()
    this._tryTalk()
  }
}
