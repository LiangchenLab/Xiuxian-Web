/**
 * 岭行 · 策划数据表
 * 为什么单独拆：改境界/功法/奇遇只动本文件，UI 与数值引擎不用改。
 */

window.LX_DATA = {
  title: "岭行",
  subtitle: "凡尘问道 · 一念成仙",

  realms: [
    { name: "炼气", desc: "引气入体，初窥门径。" },
    { name: "筑基", desc: "筑就道基，经脉初通。" },
    { name: "金丹", desc: "丹成一粒，寿元大增。" },
    { name: "元婴", desc: "婴成出窍，神识渐广。" },
    { name: "化神", desc: "神游太虚，窥探天机。" },
    { name: "炼虚", desc: "虚空生有，法力如海。" },
    { name: "合体", desc: "天人合一，法体无缺。" },
    { name: "大乘", desc: "大道将成，逼近天劫。" },
    { name: "渡劫", desc: "九霄雷火，生死一线。" },
    { name: "仙人", desc: "超脱轮回，名列仙籍。" },
  ],

  techniques: [
    { id: "basic", name: "吐纳术", mult: 1.0, unlock: 0, tip: "入门吐纳，稳扎稳打。" },
    { id: "cloud", name: "御气诀", mult: 1.25, unlock: 1, tip: "御气周天，效率小增。" },
    { id: "jade", name: "青玄心法", mult: 1.55, unlock: 3, tip: "青玄养神，心魔难侵。" },
    { id: "flame", name: "赤焰功", mult: 1.8, unlock: 4, tip: "以火炼气，突破稍稳。" },
    { id: "thunder", name: "雷引诀", mult: 2.15, unlock: 6, tip: "引雷入体，暴涨灵气。" },
    { id: "void", name: "太虚经", mult: 2.6, unlock: 8, tip: "虚空借力，接近仙途。" },
  ],

  pills: [
    { id: "qi_small", name: "聚气丹", cost: 30, qi: 40, tip: "小补灵气。" },
    { id: "qi_big", name: "凝元丹", cost: 120, qi: 180, tip: "大补灵气。" },
    { id: "stable", name: "凝神丹", cost: 80, failReduce: 0.12, tip: "下次突破失败率降低。" },
  ],

  events: [
    { w: 30, text: "山涧得一缕灵泉，灵气 +{n}。", kind: "qi", min: 20, max: 60 },
    { w: 18, text: "路过散修摊位，购得灵石线索，灵石 +{n}。", kind: "stone", min: 15, max: 45 },
    { w: 12, text: "夜观星象，心有所悟，修炼效率短暂提升。", kind: "buff" },
    { w: 10, text: "遭遇心魔幻影，勉强驱散，灵气 -{n}。", kind: "lose", min: 10, max: 40 },
    { w: 15, text: "仙鹤衔来残页，功法感悟加深。", kind: "log" },
    { w: 10, text: "洞府震动，竟挖出一枚旧丹，灵石等价 +{n}。", kind: "stone", min: 40, max: 90 },
    { w: 5, text: "天降异象：远处雷云翻涌，似在预示渡劫之日。", kind: "log" },
  ],

  flavorTrain: [
    "吐纳之间，丹田微热。",
    "山风入袖，灵气随息而动。",
    "你默诵心法，杂念渐少。",
    "松涛阵阵，仿若有人低语大道。",
    "指尖掠过虚空，似有星芒闪过。",
  ],
}
