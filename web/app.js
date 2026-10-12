/**
 * 岭行 · 修仙放置 — 运行时
 * 为什么：把点击修炼、挂机、突破、奇遇、丹药、存档收成一处，睡觉期间也能完整可玩。
 */

const D = window.LX_DATA
const STORAGE_KEY = "lingxing-xiuxian-v2"

function needQi(realmIndex) {
  return Math.floor(100 * Math.pow(2.15, realmIndex))
}

function failChance(realmIndex, techMult, nextFailReduce) {
  const raw = 0.07 + realmIndex * 0.055
  let p = raw / Math.sqrt(Math.max(1, techMult))
  p -= nextFailReduce || 0
  return Math.min(0.7, Math.max(0.04, p))
}

function defaultState() {
  return {
    name: "无名散修",
    realm: 0,
    qi: 0,
    stones: 20,
    techId: "basic",
    auto: true,
    nextFailReduce: 0,
    trainBuffUntil: 0,
    totalTrains: 0,
    breakthroughs: 0,
    adventures: 0,
    lastTick: Date.now(),
    log: ["夜色初定。你于岭上落座，开始第一口吐纳。"],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return { ...defaultState(), ...JSON.parse(raw) }
  } catch {
    return defaultState()
  }
}

function save(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      log: state.log.slice(0, 50),
    }),
  )
}

const state = load()

const $ = (id) => document.getElementById(id)
const el = {
  title: $("title"),
  subtitle: $("subtitle"),
  playerName: $("playerName"),
  realm: $("realm"),
  realmDesc: $("realmDesc"),
  qiText: $("qiText"),
  stoneText: $("stoneText"),
  techText: $("techText"),
  bar: $("bar"),
  failHint: $("failHint"),
  log: $("log"),
  btnTrain: $("btnTrain"),
  btnBreak: $("btnBreak"),
  btnAdventure: $("btnAdventure"),
  btnAuto: $("btnAuto"),
  techList: $("techList"),
  pillList: $("pillList"),
  art: $("art"),
  hero: $("hero"),
  realmCard: $("realmCard"),
  overlay: $("overlay"),
  overlayText: $("overlayText"),
  floatLayer: $("floatLayer"),
  tabBtns: [...document.querySelectorAll("[data-tab]")],
  panels: {
    train: $("panel-train"),
    tech: $("panel-tech"),
    pill: $("panel-pill"),
    log: $("panel-log"),
  },
  stats: $("stats"),
}

/** 应用离线收益：睡觉/切后台回来也能攒一点灵气 */
function applyOffline() {
  const now = Date.now()
  const elapsed = Math.min(8 * 3600, Math.max(0, (now - (state.lastTick || now)) / 1000))
  state.lastTick = now
  if (!state.auto || elapsed < 5 || state.realm >= D.realms.length - 1) return
  const tech = currentTech()
  const ticks = Math.floor(elapsed / 2)
  if (ticks <= 0) return
  const gain = ticks * 2.4 * tech.mult * (Date.now() < state.trainBuffUntil ? 1.35 : 1)
  const need = needQi(state.realm)
  const before = state.qi
  state.qi = Math.min(need, state.qi + gain)
  const got = Math.floor(state.qi - before)
  if (got > 0) {
    pushLog(`离线吐纳 ${Math.floor(elapsed / 60)} 分钟，灵气 <span class="good">+${got}</span>。`, false)
  }
}

function currentTech() {
  return D.techniques.find((t) => t.id === state.techId) || D.techniques[0]
}

function pushLog(html, renderNow = true) {
  state.log.unshift(html)
  if (state.log.length > 50) state.log.pop()
  if (renderNow) renderLog()
}

function renderLog() {
  el.log.innerHTML = state.log.map((line) => `<p>${line}</p>`).join("")
}

function floatNum(text, cls = "") {
  const n = document.createElement("div")
  n.className = `float-num ${cls}`
  n.textContent = text
  n.style.left = `${40 + Math.random() * 40}%`
  n.style.bottom = "28%"
  el.floatLayer.appendChild(n)
  setTimeout(() => n.remove(), 900)
}

function showOverlay(text) {
  el.overlayText.textContent = text
  el.overlay.classList.add("show")
  setTimeout(() => el.overlay.classList.remove("show"), 1200)
}

function softChime(ok = true) {
  try {
    const ctx = softChime._ctx || (softChime._ctx = new (window.AudioContext || window.webkitAudioContext)())
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "sine"
    o.frequency.value = ok ? 660 : 220
    g.gain.value = 0.03
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
    o.stop(ctx.currentTime + 0.26)
  } catch {
    /* 静音环境忽略 */
  }
}

function renderTechs() {
  el.techList.innerHTML = D.techniques
    .map((t) => {
      const locked = state.realm < t.unlock
      const active = state.techId === t.id
      return `<button type="button" class="cell ${active ? "active" : ""}" data-tech="${t.id}" ${locked ? "disabled" : ""}>
        <img src="../assets/ai/icon-tech.png" alt="" />
        <div>
          <strong>${t.name}</strong>
          <span>×${t.mult.toFixed(2)} · ${locked ? `需${D.realms[t.unlock].name}` : t.tip}</span>
        </div>
      </button>`
    })
    .join("")
  el.techList.querySelectorAll("[data-tech]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.techId = btn.getAttribute("data-tech")
      pushLog(`改修 <span class="hi">${currentTech().name}</span>。`)
      softChime(true)
      render()
    })
  })
}

function renderPills() {
  el.pillList.innerHTML = D.pills
    .map(
      (p) => `<button type="button" class="cell" data-pill="${p.id}">
        <div class="pill-dot"></div>
        <div>
          <strong>${p.name}</strong>
          <span>${p.tip} · ${p.cost} 灵石</span>
        </div>
      </button>`,
    )
    .join("")
  el.pillList.querySelectorAll("[data-pill]").forEach((btn) => {
    btn.addEventListener("click", () => usePill(btn.getAttribute("data-pill")))
  })
}

function usePill(id) {
  const p = D.pills.find((x) => x.id === id)
  if (!p) return
  if (state.stones < p.cost) {
    pushLog(`<span class="bad">灵石不足</span>，无法购得${p.name}。`)
    softChime(false)
    return
  }
  state.stones -= p.cost
  if (p.qi) {
    const need = needQi(state.realm)
    state.qi = Math.min(need, state.qi + p.qi)
    floatNum(`+${p.qi} 灵气`, "good")
    pushLog(`服下 <span class="hi">${p.name}</span>，灵气 +${p.qi}。`)
  }
  if (p.failReduce) {
    state.nextFailReduce = Math.max(state.nextFailReduce, p.failReduce)
    pushLog(`服下 <span class="hi">${p.name}</span>，下次突破更为稳固。`)
  }
  softChime(true)
  render()
}

function train(base = 10, fromAuto = false) {
  if (state.realm >= D.realms.length - 1) return
  const tech = currentTech()
  const buff = Date.now() < state.trainBuffUntil ? 1.35 : 1
  const gain = base * tech.mult * buff * (0.85 + Math.random() * 0.35)
  const need = needQi(state.realm)
  const before = state.qi
  state.qi = Math.min(need, state.qi + gain)
  state.totalTrains += 1
  const got = state.qi - before
  if (!fromAuto && got > 0) floatNum(`+${got.toFixed(0)}`, "good")
  if (!fromAuto && Math.random() < 0.12) {
    const line = D.flavorTrain[Math.floor(Math.random() * D.flavorTrain.length)]
    pushLog(line)
  }
  // 偶发灵石
  if (!fromAuto && Math.random() < 0.08) {
    const s = 3 + Math.floor(Math.random() * 8)
    state.stones += s
    floatNum(`+${s} 石`, "gold")
  }
  render()
}

function tryBreakthrough() {
  const need = needQi(state.realm)
  if (state.qi < need || state.realm >= D.realms.length - 1) return
  const tech = currentTech()
  const fail = failChance(state.realm, tech.mult, state.nextFailReduce)
  state.nextFailReduce = 0
  el.realmCard.classList.remove("flash")
  void el.realmCard.offsetWidth
  el.realmCard.classList.add("flash")

  if (Math.random() < fail) {
    const loss = Math.floor(need * (0.22 + Math.random() * 0.2))
    state.qi = Math.max(0, state.qi - loss)
    pushLog(`<span class="bad">突破失败</span>：心魔作祟，灵气散去 ${loss}。`)
    showOverlay("突破失败")
    softChime(false)
  } else {
    state.realm += 1
    state.qi = 0
    state.breakthroughs += 1
    state.stones += 20 + state.realm * 10
    const r = D.realms[state.realm]
    pushLog(`<span class="good">突破成功</span>：踏入 <span class="hi">${r.name}</span>——${r.desc}`)
    showOverlay(`${r.name}！`)
    softChime(true)
    const unlocked = D.techniques.filter((t) => t.unlock === state.realm)
    unlocked.forEach((t) => pushLog(`机缘：可参悟 <span class="hi">${t.name}</span>。`))
  }
  render()
}

function pickEvent() {
  const total = D.events.reduce((s, e) => s + e.w, 0)
  let r = Math.random() * total
  for (const e of D.events) {
    r -= e.w
    if (r <= 0) return e
  }
  return D.events[0]
}

function adventure() {
  const cost = 8
  if (state.stones < cost) {
    pushLog(`<span class="bad">灵石不足</span>（需 ${cost}）无法下山寻机缘。`)
    softChime(false)
    return
  }
  state.stones -= cost
  state.adventures += 1
  const e = pickEvent()
  const n = e.min != null ? e.min + Math.floor(Math.random() * (e.max - e.min + 1)) : 0
  let text = e.text.replace("{n}", String(n))
  if (e.kind === "qi") {
    const need = needQi(state.realm)
    state.qi = Math.min(need, state.qi + n)
    text = `<span class="good">奇遇</span>：${text}`
  } else if (e.kind === "stone") {
    state.stones += n
    text = `<span class="good">奇遇</span>：${text}`
  } else if (e.kind === "lose") {
    state.qi = Math.max(0, state.qi - n)
    text = `<span class="bad">波折</span>：${text}`
  } else if (e.kind === "buff") {
    state.trainBuffUntil = Date.now() + 90_000
    text = `<span class="hi">顿悟</span>：${text}（90 秒内修炼加快）`
  } else {
    text = `<span class="hi">见闻</span>：${text}`
  }
  pushLog(text)
  softChime(e.kind !== "lose")
  render()
}

function setTab(name) {
  Object.entries(el.panels).forEach(([k, node]) => {
    node.classList.toggle("hidden", k !== name)
  })
  el.tabBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-tab") === name))
}

function render() {
  const need = needQi(state.realm)
  const tech = currentTech()
  const r = D.realms[state.realm]
  const pct = Math.min(100, (state.qi / need) * 100)
  const fail = failChance(state.realm, tech.mult, state.nextFailReduce)

  el.title.textContent = D.title
  el.subtitle.textContent = D.subtitle
  el.playerName.textContent = state.name
  el.realm.textContent = r.name
  el.realmDesc.textContent = r.desc
  el.qiText.textContent = `灵气 ${Math.floor(state.qi)} / ${need}`
  el.stoneText.textContent = `灵石 ${state.stones}`
  el.techText.textContent = `${tech.name} ×${tech.mult.toFixed(2)}`
  el.bar.style.width = `${pct}%`
  el.failHint.textContent =
    state.realm >= D.realms.length - 1
      ? "已列仙籍，逍遥岭上。"
      : `突破失败率约 ${(fail * 100).toFixed(0)}%${state.nextFailReduce ? "（丹药加持）" : ""}`
  el.btnBreak.disabled = state.qi < need || state.realm >= D.realms.length - 1
  el.btnAuto.textContent = state.auto ? "挂机：开" : "挂机：关"
  el.btnAuto.classList.toggle("on", state.auto)
  el.stats.textContent = `闭关 ${state.totalTrains} · 突破 ${state.breakthroughs} · 奇遇 ${state.adventures}`
  renderLog()
  renderTechs()
  renderPills()
  state.lastTick = Date.now()
  save(state)
}

// —— 绑定 ——
el.btnTrain.addEventListener("click", () => {
  train(16, false)
  softChime(true)
})
el.btnBreak.addEventListener("click", tryBreakthrough)
el.btnAdventure.addEventListener("click", adventure)
el.btnAuto.addEventListener("click", () => {
  state.auto = !state.auto
  pushLog(state.auto ? "恢复挂机吐纳。" : "暂停挂机，专心手动闭关。")
  render()
})
el.tabBtns.forEach((b) => b.addEventListener("click", () => setTab(b.getAttribute("data-tab"))))
el.playerName.addEventListener("click", () => {
  const n = prompt("道号（显示名）", state.name)
  if (n && n.trim()) {
    state.name = n.trim().slice(0, 12)
    render()
  }
})

$("btnReset").addEventListener("click", () => {
  if (!confirm("重置将清空本机存档，确认？")) return
  localStorage.removeItem(STORAGE_KEY)
  location.reload()
})

// 挂机：每秒吐纳
setInterval(() => {
  if (state.auto && state.realm < D.realms.length - 1) train(3.5, true)
}, 1000)

// 奇遇冷却提示：按钮不锁死，靠灵石限制
applyOffline()
setTab("train")
render()
