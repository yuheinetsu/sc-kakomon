let currentFilter = "all";

const list = document.querySelector("#question-list");
const count = document.querySelector("#count");
const search = document.querySelector("#search");

function render() {
  const keyword = search.value.trim().toLowerCase();

  const filtered = questions.filter(q => {
    const matchesFilter =
      currentFilter === "all" || q.session === currentFilter;

    const text = [
      q.year, q.session, q.number, q.field, q.question,
      q.answer, q.explanation, q.related, ...(q.tags || [])
    ].join(" ").toLowerCase();

    return matchesFilter && text.includes(keyword);
  });

  count.textContent = `${filtered.length}問`;

  if (!filtered.length) {
    list.innerHTML = '<div class="card">該当する問題がありません。</div>';
    return;
  }

  list.innerHTML = filtered.map(q => `
    <article class="card">
      <div class="meta">${escapeHtml(q.year)} / ${escapeHtml(q.session)} / ${escapeHtml(q.number)}</div>
      <h3>${escapeHtml(q.field)}</h3>
      <div>${(q.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
      <p><strong>問題</strong><br>${escapeHtml(q.question)}</p>

      <ol>
        ${q.choices.map((c, i) => `<li>${String.fromCharCode(65+i)}. ${escapeHtml(c)}</li>`).join("")}
      </ol>

      <div class="answer"><strong>正解：${escapeHtml(q.answer)}</strong></div>

      <details>
        <summary>解説を見る</summary>
        <p class="explanation">${escapeHtml(q.explanation)}</p>
      </details>

      <details>
        <summary>関連知識を見る</summary>
        <p>${escapeHtml(q.related)}</p>
      </details>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    render();
  });
});

search.addEventListener("input", render);
render();
