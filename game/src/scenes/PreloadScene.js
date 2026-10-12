/**
 * 加载青云山真实素材（草地/角色/装饰）
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload")
  }

  preload() {
    const w = this.scale.width
    const h = this.scale.height
    this.cameras.main.setBackgroundColor("#0b1a24")
    this.add
      .text(w / 2, h / 2 - 40, "青云山灵气汇聚…", {
        fontFamily: "Songti SC, serif",
        fontSize: "20px",
        color: "#f2e6d0",
      })
      .setOrigin(0.5)
    const barBg = this.add.rectangle(w / 2, h / 2, 320, 14, 0x1a2a22)
    const bar = this.add.rectangle(w / 2 - 158, h / 2, 4, 10, 0xd4b15a).setOrigin(0, 0.5)
    this.load.on("progress", (p) => {
      bar.width = 4 + 312 * p
    })

    // 路径相对 game/index.html
    this.load.image("grass", "assets/images/maps/qingyunshan/grass.jpg")
    this.load.image("player", "assets/images/characters/player.png")
    this.load.image("tree", "assets/images/maps/qingyunshan/tree.png")
    this.load.image("rock", "assets/images/maps/qingyunshan/rock.png")
    this.load.image("lantern", "assets/images/maps/qingyunshan/lantern.png")
    this.load.image("menu_bg", "../assets/ai/bg.png")

    this.load.on("loaderror", (file) => {
      console.warn("缺资源", file?.key)
    })
  }

  create() {
    this.scene.start("MainMenu")
  }
}
