document.addEventListener("DOMContentLoaded", async function loadAndRenderChaseCards() {
  const allChaseCards = [];
  const fetchPromises = [];

  for (const [year, sets] of Object.entries(SETS)) {
    for (const [setName, config] of Object.entries(sets)) {
      fetchPromises.push(
        fetch(config.url)
          .then(res => res.text())
          .then(text => {
            const json = JSON.parse(text.substring(47).slice(0, -2));
            const cols = json.table.cols.map(col => col.label.trim());
            const hitColCandidates = ["One of One Hit", "Hit", "1/1 Hit", "Hit Status"];
            const hitColName = hitColCandidates.find(name => cols.includes(name));
            if (!hitColName) return [];

            const rows = json.table.rows.map(row => {
              const obj = {};
              cols.forEach((col, i) => {
                obj[col] = row.c[i] ? row.c[i].v : "";
              });
              obj["Year"] = year;
              obj["Set"] = setName;
              return obj;
            });

            return rows.filter(row => row["Chase"] === true && row[hitColName] !== true);
          })
          .catch(e => {
            console.error("Failed to fetch set", setName, e);
            return [];
          })
      );
    }
  }

  const results = await Promise.all(fetchPromises);
  results.forEach(rows => allChaseCards.push(...rows));

  if (allChaseCards.length === 0) return;

  const featuredIndex = allChaseCards.findIndex(c => c["Feature"] === true);
  if (featuredIndex > 0) {
    const featuredCard = allChaseCards.splice(featuredIndex, 1)[0];
    allChaseCards.unshift(featuredCard);
  }

  const chaseContainer = document.createElement("div");
  chaseContainer.id = "chase-sidebar";
  chaseContainer.className = "w-full p-4 relative";
  const trackerWrapper = document.getElementById("tracker-wrapper");
  trackerWrapper.parentElement.insertBefore(chaseContainer, trackerWrapper);

  const isMobile = window.innerWidth < 640;

  if (isMobile) {
    let currentIndex = 0;
    let intervalId;
    let startX = 0;

    const displayChaseCard = () => {
      const card = allChaseCards[currentIndex];
      chaseContainer.innerHTML = `
        <div class="max-w-screen-md mx-auto">
          <h2 class="text-sm text-gray-400 uppercase tracking-wide mb-2 text-center">Live Chase Cards</h2>
          <div id="chase-card" class="grid grid-cols-1 gap-6">
            <div class="bg-zinc-900 text-white rounded-xl shadow-lg overflow-hidden relative">
              <div class="absolute top-2 right-2 z-10 text-[11px] font-semibold tracking-wide uppercase 
                bg-gradient-to-r from-red-600 to-red-700 text-white px-2.5 py-0.5 rounded-full 
                shadow-md ring-1 ring-white/10 animate-pulse ring-2 ring-red-500/50">1/1 Live</div>
              <img src="${card["Image"] || "https://images.squarespace-cdn.com/content/682caef5d585c85a6f7dcd3e/8c0891cf-f977-4068-9d57-9f2dcb1b59b7/IMG_1263-2-2.jpg?content-type=image%2Fjpeg"}"
                alt="Chase Card Image"
                class="w-full h-48 object-cover border-t border-b border-white/10" />
              <div class="text-xs text-white/80 px-4 pt-2 pb-0 truncate">
                ${card["Year"]} ${card["Set"]} · ${card["Parallel"]}
              </div>
              <div class="text-sm font-semibold text-white px-4 truncate">
                ${card["Card Name"]}
              </div>
              <div class="px-4 pb-4 pt-2">
                <button onclick="openFormModal('${encodeURIComponent(card["Card Name"])}','${encodeURIComponent(card["Year"] + ' ' + card["Set"])}','${encodeURIComponent(card["Parallel"])}')"
                  class="w-full text-sm font-bold bg-white text-black py-2 rounded hover:bg-gray-200 transition shadow">
                  Report Hit
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      const cardEl = document.getElementById("chase-card");
      cardEl.addEventListener("touchstart", e => (startX = e.touches[0].clientX), { passive: true });
      cardEl.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) window.nextChaseCard();
      }, { passive: true });
    };

    window.nextChaseCard = () => {
      currentIndex = (currentIndex + 1) % allChaseCards.length;
      displayChaseCard();
      resetInterval();
    };

    const resetInterval = () => {
      clearInterval(intervalId);
      intervalId = setInterval(window.nextChaseCard, 8000);
    };

    displayChaseCard();
    intervalId = setInterval(window.nextChaseCard, 8000);
    return;
  }

  // Desktop version
  chaseContainer.innerHTML = `
    <div class="max-w-screen-xl mx-auto">
      <h2 class="text-sm text-gray-400 uppercase tracking-wide mb-2">Live Chase Cards</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${allChaseCards.map(card => `
          <div class="bg-zinc-900 text-white rounded-xl shadow-lg overflow-hidden relative">
            <div class="absolute top-2 right-2 z-10 text-[11px] font-semibold tracking-wide uppercase 
              bg-gradient-to-r from-red-600 to-red-700 text-white px-2.5 py-0.5 rounded-full 
              shadow-md ring-1 ring-white/10 animate-pulse ring-2 ring-red-500/50">1/1 Live</div>
            <img src="${card["Image"] || "https://images.squarespace-cdn.com/content/682caef5d585c85a6f7dcd3e/cbcd1183-00cc-44ea-b478-77ecb3f8f55f/IMG_12632-2.jpg?content-type=image%2Fjpeg"}"
              alt="Chase Card Image"
              class="w-full h-48 object-cover border-t border-b border-white/10" />
            <div class="text-xs text-white/80 px-4 pt-2 pb-0 truncate">
              ${card["Year"]} ${card["Set"]} · ${card["Parallel"]}
            </div>
            <div class="text-sm font-semibold text-white px-4 truncate">
              ${card["Card Name"]}
            </div>
            <div class="px-4 pb-4 pt-2">
              <button onclick="openFormModal('${encodeURIComponent(card["Card Name"])}','${encodeURIComponent(card["Year"] + ' ' + card["Set"])}','${encodeURIComponent(card["Parallel"])}')"
                class="w-full text-sm font-bold bg-white text-black py-2 rounded hover:bg-gray-200 transition shadow">
                Report Hit
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
});