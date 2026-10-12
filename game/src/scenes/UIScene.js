/**
 * HUD：道号、灵草、提示
 */
import { GameState } from "../core/game-state.js"
import { bus } from "../core/event-bus.js"
import { DEPTH } from "../core/constants.js"

export class UIScene extends Phaser.Scene {
  constructor() {
    super("UI")
  }

  create() {
    const d = GameState.data
    this.nameText = this.add
      .text(16, 36, `${d.playerName} · ${d.realm}`, {
        fontFamily: "Songti SC, serif",
        fontSize: "16px",
        color: "#f2e6d0",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ui)

    this.herbText = this.add
      .text(16, 68, `灵草 ${d.herbs || 0}`, {
        fontFamily: "Songti SC, serif",
        fontSize: "14px",
        color: "#7dcea0",
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: { x: 8, y: 3 },
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ui)

    this.hint = this.add
      .text(16, 98, "WASD 移动 · E 对话 · 采发光灵草 · ESC 暂停", {
        fontFamily: "Songti SC, serif",
        fontSize: "12px",
        color: "#d4b15a",
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ui)

    this.toast = this.add
      .text(this.scale.width / 2, 120, "", {
        fontFamily: "Songti SC, serif",
        fontSize: "16px",
        color: "#f2e6d0",
        backgroundColor: "rgba(143,46,34,0.85)",
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ui + 6)
      .setAlpha(0)

    this._offs = [
      bus.on("ui:herbs", (n) => this.herbText.setText(`灵草 ${n}`)),
      bus.on("ui:toast", (msg) => {
        this.toast.setText(msg)
        this.toast.setAlpha(1)
        this.tweens.add({
          targets: this.toast,
          alpha: 0,
          delay: 1200,
          duration: 400,
        })
      }),
    ]

    this.events.on("shutdown", () => this._offs.forEach((f) => f && f()))
  }
}
