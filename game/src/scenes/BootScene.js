/**
 * 启动场景：只做缩放与跳转，保证首屏快。
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot")
  }

  preload() {
    // 可在此放极小 logo；主资源去 Preload
  }

  create() {
    this.scene.start("Preload")
  }
}
