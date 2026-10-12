/**
 * 主菜单
 */
import { GameState } from "../core/game-state.js"

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenu")
  }

  create() {
    GameState.load()
    const w = this.scale.width
    const h = this.scale.height

    if (this.textures.exists("menu_bg")) {
      this.add.image(w / 2, h / 2, "menu_bg").setDisplaySize(w, h).setAlpha(0.55)
    } else {
      this.cameras.main.setBackgroundColor("#0b1a24")
    }

    this.add
      .text(w / 2, h * 0.28, "岭  行", {
        fontFamily: "Songti SC, serif",
        fontSize: "48px",
        color: "#f2e6d0",
      })
      .setOrigin(0.5)

    this.add
      .text(w / 2, h * 0.38, "采灵草 · 访长老 · 走石径", {
        fontFamily: "Songti SC, serif",
        fontSize: "15px",
        color: "#d4b15a",
      })
      .setOrigin(0.5)

    if (this.textures.exists("player")) {
      this.add.image(w / 2, h * 0.48, "player").setDisplaySize(56, 96)
    }

    const mkBtn = (y, label, onClick) => {
      const t = this.add
        .text(w / 2, y, label, {
          fontFamily: "Songti SC, serif",
          fontSize: "22px",
          color: "#f2e6d0",
          backgroundColor: "#8f2e22",
          padding: { x: 28, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
      t.on("pointerdown", onClick)
      return t
    }

    mkBtn(h * 0.62, "踏入青云山", () => {
      this.scene.start("World")
      this.scene.launch("UI")
    })

    mkBtn(h * 0.74, "重置存档", () => {
      GameState.reset()
      this.add
        .text(w / 2, h * 0.84, "已重置", { fontSize: "14px", color: "#7dcea0" })
        .setOrigin(0.5)
    })
  }
}
