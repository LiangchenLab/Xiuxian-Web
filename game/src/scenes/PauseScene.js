/**
 * 暂停弹层
 */
import { GameState } from "../core/game-state.js"

export class PauseScene extends Phaser.Scene {
  constructor() {
    super("Pause")
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.55).setScrollFactor(0)
    this.add
      .text(w / 2, h * 0.35, "暂停", {
        fontFamily: "Songti SC, serif",
        fontSize: "36px",
        color: "#d4b15a",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)

    const resume = this.add
      .text(w / 2, h * 0.5, "继续问道", {
        fontFamily: "Songti SC, serif",
        fontSize: "20px",
        color: "#f2e6d0",
        backgroundColor: "#2f6b5a",
        padding: { x: 20, y: 8 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })

    resume.on("pointerdown", () => {
      GameState.save()
      this.scene.stop("Pause")
      this.scene.resume("World")
    })

    const menu = this.add
      .text(w / 2, h * 0.62, "回主菜单", {
        fontFamily: "Songti SC, serif",
        fontSize: "18px",
        color: "#e07a6a",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })

    menu.on("pointerdown", () => {
      GameState.save()
      this.scene.stop("Pause")
      this.scene.stop("UI")
      this.scene.stop("World")
      this.scene.start("MainMenu")
    })
  }
}
