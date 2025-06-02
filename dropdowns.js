function populateDropdowns() {
  const yearSelect = document.getElementById("year-select");
  yearSelect.innerHTML = '<option value="">Select Year</option>';
  
  for (const year in SETS) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  yearSelect.addEventListener("change", function () {
    const selectedYear = this.value;
    const setSelect = document.getElementById("set-select");
    setSelect.innerHTML = '<option value="">Select Set</option>';
    setSelect.disabled = true;

    const parallelSelect = document.getElementById("parallel-select");
    parallelSelect.innerHTML = '<option value="">Select Parallel</option><option value="All Parallels">All Parallels</option>';
    parallelSelect.disabled = true;

    if (!selectedYear || !SETS[selectedYear]) return;

    const sets = SETS[selectedYear];
    for (const setName in sets) {
      const option = document.createElement("option");
      option.value = setName;
      option.textContent = setName;
      setSelect.appendChild(option);
    }

    setSelect.disabled = false;
  });

  document.getElementById("set-select").addEventListener("change", () => {
    const year = document.getElementById("year-select").value;
    const set = document.getElementById("set-select").value;
    if (!year || !set) return;

    const config = SETS[year][set];
    if (!config) return;

    fetch(config.url)
      .then(res => res.text())
      .then(text => {
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const cols = json.table.cols.map(col => col.label.trim());

        const hitColCandidates = ["One of One Hit", "Hit", "1/1 Hit", "Hit Status"];
        const hitColName = hitColCandidates.find(name => cols.includes(name));
        if (!hitColName) throw new Error("No valid hit column found.");

        currentData = json.table.rows.map(row => {
          const obj = {};
          cols.forEach((col, i) => {
            obj[col] = row.c[i] ? row.c[i].v : "";
          });
          return {
            name: obj[config.name_column],
            parallel: obj["Parallel"] || "",
            hit: obj[hitColName] === true,
            extra: {
              ...obj,
              Year: year,
              Set: set
            }
          };
        });

        const uniqueParallels = [...new Set(currentData.map(card => card.parallel).filter(Boolean))];
        const parallelSelect = document.getElementById("parallel-select");
        parallelSelect.innerHTML = `<option value="">All Parallels</option>` +
          uniqueParallels.map(p => `<option value="${p}">${p}</option>`).join("");

        window.allFighterNames = [...new Set(currentData.map(c => c.name.trim().toLowerCase()).filter(Boolean))];
        setupAutocomplete();

        renderCards(currentData);
      });
  });
}

function renderSetBubbles() {
  const container = document.getElementById("set-bubbles");
  if (!container) return;

  container.innerHTML = "";
  const setsByYear = Object.entries(SETS);
  setsByYear.forEach(([year, sets]) => {
    Object.entries(sets).forEach(([setName]) => {
      const btn = document.createElement("button");
      btn.className = "text-sm font-semibold bg-zinc-200 text-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-300 transition";
      btn.textContent = `${year} ${setName}`;
      btn.addEventListener("click", async () => {
        document.getElementById("year-select").value = year;
        document.getElementById("year-select").dispatchEvent(new Event("change"));

        await new Promise(resolve => setTimeout(resolve, 100));

        document.getElementById("set-select").value = setName;
        document.getElementById("set-select").dispatchEvent(new Event("change"));
      });
      container.appendChild(btn);
    });
  });
}