const STORAGE_KEY = "eventConfig:v1";

export function getEventConfig() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  // 預設活動內容（你之後可以改）
  return {
    title: "校園演唱會報名暨入場系統",
    subtitle: "報名 / 查詢 / 掃描 / 後台管理",
    datetime: "（請在後台設定時間）",
    location: "（請在後台設定地點）",
    notice: "請依照主辦單位公告為準。",
    updatedAt: null
  };
}

export function saveEventConfig(cfg) {
  const next = { ...cfg, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function renderHome() {
  const cfg = getEventConfig();
  const el = document.getElementById("event");
  if (!el) return;

  el.innerHTML = `
    <div class="card">
      <h1>${escapeHtml(cfg.title)}</h1>
      <p>${escapeHtml(cfg.subtitle)}</p>

      <div class="row">
        <p><b>時間</b>：${escapeHtml(cfg.datetime)}</p>
        <p><b>地點</b>：${escapeHtml(cfg.location)}</p>
      </div>

      <div class="row">
        <p><b>注意事項</b></p>
        <p style="white-space:pre-wrap;">${escapeHtml(cfg.notice)}</p>
      </div>

      <p class="small">最後更新：${cfg.updatedAt ? new Date(cfg.updatedAt).toLocaleString() : "尚未更新"}</p>

      <div class="nav">
        <a class="link" href="/admin.html">後台：活動內容設定</a>
        <a class="link" href="/register.html" onclick="return false;">（之後）學生報名</a>
        <a class="link" href="/lookup.html" onclick="return false;">（之後）學生查詢</a>
        <a class="link" href="/scan.html" onclick="return false;">（之後）工作人員掃描</a>
      </div>
    </div>
  `;
}

export function renderAdmin() {
  const cfg = getEventConfig();

  document.getElementById("title").value = cfg.title;
  document.getElementById("subtitle").value = cfg.subtitle;
  document.getElementById("datetime").value = cfg.datetime;
  document.getElementById("location").value = cfg.location;
  document.getElementById("notice").value = cfg.notice;

  const form = document.getElementById("adminForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const next = saveEventConfig({
      title: document.getElementById("title").value.trim(),
      subtitle: document.getElementById("subtitle").value.trim(),
      datetime: document.getElementById("datetime").value.trim(),
      location: document.getElementById("location").value.trim(),
      notice: document.getElementById("notice").value.trim(),
    });
    const msg = document.getElementById("msg");
    msg.textContent = "已儲存 ✅";
    msg.style.color = "#16a34a";
    setTimeout(() => (msg.textContent = ""), 2000);

    // 讓你按完可以回首頁看效果
    console.log("saved", next);
  });
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}