/**
 * Phaser 入口
 * 为什么用模块化 import：对齐语雀「中大型、可维护」要求，禁止单文件巨石。
 */
import { GAME_W, GAME_H } from "./core/constants.js"
import { BootScene } from "./scenes/BootScene.js"
import { PreloadScene } from "./scenes/PreloadScene.js"
import { MainMenuScene } from "./scenes/MainMenuScene.js"
import { WorldScene } from "./scenes/WorldScene.js"
import { UIScene } from "./scenes/UIScene.js"
import { PauseScene } from "./scenes/PauseScene.js"

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: GAME_W,
  height: GAME_H,
  backgroundColor: "#070d12",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene, MainMenuScene, WorldScene, UIScene, PauseScene],
}

// eslint-disable-next-line no-new
new Phaser.Game(config)
