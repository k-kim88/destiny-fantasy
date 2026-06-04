// 화면 하단 토스트 메시지
export function toast(t) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = t;
  el.style.opacity = 1;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.style.opacity = 0), 1400);
}
