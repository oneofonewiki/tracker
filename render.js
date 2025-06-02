function renderCards(data) {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const filterUnhit = document.getElementById("filter-unhit").checked;
  const selectedParallel = document.getElementById("parallel-select").value;
  const selectedSet = document.getElementById("set-select").value;
  const selectedYear = document.getElementById("year-select").value;

  const container = document.getElementById("result-list");
  container.innerHTML = "";

  const searchWords = query.split(/\s+/).filter(Boolean);
let filtered = data.filter(card => {
  if (card.extra["Exclude"] === true) return false;

  const haystack = `${card.name} ${card.parallel} ${card.extra.Year} ${card.extra.Set}`.toLowerCase();
  const match = searchWords.every(word => haystack.includes(word));
  const unhit = !filterUnhit || !card.hit;
  const parallelMatch = !selectedParallel || selectedParallel === "All Parallels" || card.parallel === selectedParallel;
  return match && unhit && parallelMatch;
});

filtered.sort((a, b) => {
  const queryNorm = query.toLowerCase();
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();

  const isExactA = aName === queryNorm;
  const isExactB = bName === queryNorm;

  if (isExactA && !isExactB) return -1;
  if (!isExactA && isExactB) return 1;

  const startsWithA = aName.startsWith(queryNorm);
  const startsWithB = bName.startsWith(queryNorm);

  if (startsWithA && !startsWithB) return -1;
  if (!startsWithA && startsWithB) return 1;

  const indexA = aName.indexOf(queryNorm);
  const indexB = bName.indexOf(queryNorm);

  return indexA - indexB;
});

const isGlobalSearch = !selectedYear && !selectedSet && query;

if (isGlobalSearch) {
  filtered.sort((a, b) => {
    const aDate = new Date(
      SETS[a.extra.Year]?.[a.extra.Set]?.releaseDate || "2000-01-01"
    );
    const bDate = new Date(
      SETS[b.extra.Year]?.[b.extra.Set]?.releaseDate || "2000-01-01"
    );

    // Newest set first
    return bDate - aDate;
  });
}

if (filtered.length > 200) {
  filtered = filtered.slice(0, 200); // only render the first 200 results
}

const statsPool = data.filter(card => {
  if (card.extra["Exclude"] === true) return false;

  const haystack = `${card.name} ${card.parallel} ${card.extra.Year} ${card.extra.Set}`.toLowerCase();
  const match = searchWords.every(word => haystack.includes(word));
  const parallelMatch = !selectedParallel || selectedParallel === "All Parallels" || card.parallel === selectedParallel;
  return match && parallelMatch;
});

  if (filtered.length === 0) {
    container.innerHTML = "<p class='text-black'>No matching cards found.</p>";
    return;
  }



  filtered.forEach(card => {
    const isHit = card.hit;
    const hasImage = !!card.extra["Image"];

    const div = document.createElement("div");
    div.className = `
      relative pt-5 pb-4 px-4 rounded-xl border-2 bg-gradient-to-br 
      ${isHit ? "from-green-600 to-green-800 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "from-red-600 to-red-800 border-red-400"} 
      text-white shadow-md hover:shadow-xl hover:scale-105 transition transform duration-200 
      flex flex-col justify-between h-full min-h-[240px]
    `;

    const badge = `
      <span class="absolute top-6 right-5 text-[11px] font-semibold tracking-wide uppercase bg-white ${isHit ? 'text-green-600' : 'text-red-600'} px-2 py-0.5 rounded-full shadow-md ring-1 ${isHit ? 'ring-green-500/50' : 'ring-red-500/50'}">
  ${isHit ? '1/1 Hit ✅' : '1/1 Live 🔴'}
</span>
    `;

    let actionButton = "";
    if (isHit && hasImage) {
      actionButton = `
        <button onclick="openImageModal('${encodeURIComponent(card.extra["Image"])}')" 
          class="w-full text-xs font-bold bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition shadow hover:shadow-lg hover:-translate-y-[1px] active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 flex items-center justify-center gap-2">
          View Image
        </button>
      `;
    } else if (isHit && !hasImage) {
      actionButton = `
        <button onclick="openImageUploadModal('${encodeURIComponent(card.name)}','${encodeURIComponent(card.extra["Year"] + ' ' + card.extra["Set"])}','${encodeURIComponent(card.parallel)}')" 
          class="w-full text-xs font-bold bg-slate-100 text-black px-3 py-1 rounded-lg hover:bg-slate-200 transition shadow hover:shadow-lg hover:-translate-y-[1px] active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 flex items-center justify-center gap-2">
          Add Image
        </button>`;
    } else {
      actionButton = `
        <button onclick="openFormModal('${encodeURIComponent(card.name)}','${encodeURIComponent(card.extra["Year"] + ' ' + card.extra["Set"])}','${encodeURIComponent(card.parallel)}')" 
          class="w-full text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition shadow hover:shadow-lg hover:-translate-y-[1px] active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-300 flex items-center justify-center gap-2">
          Report Hit
        </button>`;
    }

div.innerHTML = `
  <div class="flip-card group h-full">
    <div class="flip-card-inner h-full">

      <!-- FRONT -->
<div class="flip-card-front h-full relative pt-6 pb-[35px] px-5 rounded-xl border-2 bg-gradient-to-br 
        ${isHit ? "from-green-600 to-green-800 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "from-red-600 to-red-800 border-red-400"} 
        text-white shadow-md hover:shadow-xl hover:scale-105 transition transform duration-200 
        flex flex-col justify-between">

        <span class="absolute top-6 right-5 text-[11px] font-semibold tracking-wide uppercase bg-white ${isHit ? 'text-green-600' : 'text-red-600'} px-2 py-0.5 rounded-full shadow-md ring-1 ${isHit ? 'ring-green-500/50' : 'ring-red-500/50'}">
          ${isHit ? 'Hit ✅' : 'Live 🔴'}
        </span>

        <div class="flex-grow">
          <p class="text-sm text-white/70 tracking-wide font-medium uppercase">
            ${card.extra["Year"]} ${card.extra["Set"]}
          </p>
          <h2 class="text-xl font-bold leading-snug text-white mt-1">
            ${card.name}
          </h2>
          ${(() => {
            const year = card.extra.Year;
            const set = card.extra.Set;
            const par = card.parallel;
            const rarity = card.extra["Rarity"];
            if (year === "2024" && set === "Topps Finest UFC" && par === "Base" && rarity) {
              return `<p class="text-sm italic text-white/90 font-medium mt-1">Base (${rarity})</p>`;
            } else {
              const parHTML = `<p class="text-sm italic text-white/90 font-medium mt-1">${par}</p>`;
              const rarityHTML = rarity ? `<p class="text-xs uppercase text-white/60 font-semibold tracking-wide mt-0.5">${rarity}</p>` : "";
              return parHTML + rarityHTML;
            }
          })()}
        </div>

       <div class="mt-8 pb-3">
          ${actionButton}
        </div>

        ${
          isHit && (card.extra["Contributor"] || card.extra["Breaker Credit"]) ? `
          <div class="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/30 text-xs text-white flex items-center justify-between rounded-b-xl">
            ${card.extra["Contributor"] ? `
              <span class="flex items-center gap-1" title="Contributor">
                <i class="fas fa-user text-white/80"></i>
                ${
                  card.extra["Contributor Link"]
                    ? `<a href="${card.extra["Contributor Link"]}" target="_blank" class="underline underline-offset-2 hover:text-zinc-300">${card.extra["Contributor"]}</a>`
                    : `<span>${card.extra["Contributor"]}</span>`
                }
              </span>` : "<span></span>"
            }

            ${card.extra["Breaker Credit"] ? `
              <span class="flex items-center gap-1" title="Breaker">
                <i class="fas fa-box-open text-white/80"></i>
                ${
                  card.extra["Breaker Credit Link"]
                    ? `<a href="${card.extra["Breaker Credit Link"]}" target="_blank" class="underline underline-offset-2 hover:text-zinc-300">${card.extra["Breaker Credit"]}</a>`
                    : `<span>${card.extra["Breaker Credit"]}</span>`
                }
              </span>` : ""
            }
          </div>
          ` : ""
        }
      </div>

      <!-- BACK -->
<div class="flip-card-back bg-slate-800 text-white p-4 rounded-xl h-full text-sm flex flex-col justify-start overflow-y-hidden group-[.flipped]:overflow-y-auto">
  ${(() => {
    const fighterName = card.name.split("/").map(n => n.trim())[0];
    const year = card.extra.Year;
    const set = card.extra.Set;

    // Gather all cards by this fighter in this set
const relatedSource = currentData.length > 0 ? currentData : globalData;
const related = relatedSource.filter(c => {
  const names = c.name.toLowerCase().split("/").map(n => n.trim());
  return (
    names.includes(fighterName.toLowerCase()) &&
    c.extra.Year === year &&
    c.extra.Set === set
  );
});

const statusCounts = {
  hit: 0,
  live: 0,
  na: 0
};

related.forEach(c => {
  if (c.extra["Exclude"]) {
    statusCounts.na++;
  } else if (c.hit) {
    statusCounts.hit++;
  } else {
    statusCounts.live++;
  }
});

    const totalCards = related.length;
const badgeHTML = `
  <span class="absolute top-2 right-3 bg-white text-black text-[11px] font-semibold px-2 py-0.5 rounded-full shadow ring-1 ring-black/10">
    ${totalCards} Cards
  </span>
`;
    const classCount = {};
    related.forEach(c => {
      const cls = c.extra["Class"] || "Other";
      classCount[cls] = (classCount[cls] || 0) + 1;
    });

    const summaryText = Object.entries(classCount)
      .map(([k, v]) => `${v} ${k}${v > 1 ? "s" : ""}`)
      .join(", ");

   const groupedByClass = {};
related.forEach(c => {
  const cls = c.extra["Class"] || "Other";
  if (!groupedByClass[cls]) groupedByClass[cls] = [];
  groupedByClass[cls].push(c);
});

const uniqueCardId = `${card.name.replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 8)}`;
const cardList = Object.entries(groupedByClass).map(([cls, cards], index) => {
  const groupId = `group-${index}-${uniqueCardId}`;

  const rows = cards.map(c => {
    const badge = c.extra["Exclude"]
      ? 'N/A'
      : c.hit
      ? '1/1 Hit ✅'
      : '1/1 Live 🔴';
    const badgeColor = c.extra["Exclude"]
      ? 'text-gray-400'
      : c.hit
      ? 'text-green-400'
      : 'text-red-400';

    return `
      <li class="flex items-center justify-between border-b border-white/10 pb-1">
        <span>${c.parallel}</span>
        <span class="text-xs font-bold ${badgeColor}">${badge}</span>
      </li>
    `;
  }).join("");

  return `
    <div class="mb-2">
      <button class="text-left font-semibold text-white/90 py-1 hover:underline"
              onclick="document.getElementById('${groupId}').classList.toggle('hidden')">
        ▸ ${cls} (${cards.length})
      </button>
      <ul id="${groupId}" class="ml-2 mt-1 space-y-1 hidden">
        ${rows}
      </ul>
    </div>
  `;
}).join("");

    return `
  <div class="mb-2 relative">
    ${badgeHTML}
    <p class="text-sm text-white/70">${year} ${set}</p>
    <h3 class="text-lg font-bold text-white">${fighterName}</h3>
    <div class="mt-1 text-xs text-white/70 space-x-2">
      <span class="text-green-300 font-semibold">${statusCounts.hit} Hit</span>
      <span class="text-red-300 font-semibold">${statusCounts.live} Live</span>
      <span class="text-gray-400 font-semibold">${statusCounts.na} N/A</span>
    </div>
  </div>
     
      <ul class="text-sm space-y-1">
        ${cardList}
      </ul>
    `;
  })()}
</div>

    </div>
  </div>
`;

    container.appendChild(div);
  });

function renderStatBox(label, total, hit, unhit, percent) {
  const container = document.getElementById("result-list");
  const box = document.createElement("div");

  const barColor = percent === 1
    ? "bg-green-400"
    : percent >= 0.5
    ? "bg-blue-400"
    : percent > 0
    ? "bg-yellow-400"
    : "bg-red-400";

box.className = `
  col-span-full sm:col-span-2 mb-2 rounded-xl border border-white/10 shadow 
  bg-slate-800 text-white
  px-5 py-4
  flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3
`;

  box.innerHTML = `
    <div>
      <h3 class="text-lg font-bold text-white">${label} Stats</h3>
      <p class="text-sm text-white/80 mt-1">
        ${hit} of ${total} hit — 
        <span class="text-yellow-300 font-bold">${unhit} live</span>
      </p>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
        <div class="h-2 ${barColor} rounded-full" style="width: ${Math.round(percent * 100)}%;"></div>
      </div>
      <span class="text-sm font-bold text-white">${Math.round(percent * 100)}% Hit</span>
    </div>
  `;

  container.prepend(box);
}

  // Determine best label
  let label = "Filtered";
  const uniqueNames = [...new Set(filtered.map(c => c.name))];

  if (uniqueNames.length === 1) {
    label = uniqueNames[0];
  } else if (selectedYear && selectedSet && !query && (!selectedParallel || selectedParallel === "All Parallels")) {
    label = `${selectedYear} ${selectedSet}`;
  } else if (selectedParallel && selectedParallel !== "All Parallels" && !query) {
    label = selectedParallel;
  } else if (query && selectedSet) {
    label = `${query} (${selectedSet})`;
  } else if (query && !selectedSet && !selectedParallel) {
  const bestMatch = [...new Set(filtered.map(c => c.name))].find(name =>
    name.toLowerCase().includes(query)
  );
  label = bestMatch || query;
}

if (statsPool.length > 0) {
  const total = statsPool.length;
  const hit = statsPool.filter(c => c.hit).length;
  const unhit = total - hit;
  const percent = hit / total;

  renderStatBox(label, total, hit, unhit, percent);
}
  
}
