document.addEventListener("DOMContentLoaded", function () {
  populateDropdowns();
  renderSetBubbles();

  document.getElementById("search").addEventListener("input", () => {
    const year = document.getElementById("year-select").value;
    const set = document.getElementById("set-select").value;

    if (year && set && currentData.length > 0) {
      renderCards(currentData);
    } else {
      const loaders = [];

      for (const [year, sets] of Object.entries(SETS)) {
        for (const [setName, config] of Object.entries(sets)) {
          loaders.push(
            fetch(config.url)
              .then(res => res.text())
              .then(text => {
                const json = JSON.parse(text.substring(47).slice(0, -2));
                const cols = json.table.cols.map(col => col.label.trim());
                const hitColCandidates = ["One of One Hit", "Hit", "1/1 Hit", "Hit Status"];
                const hitColName = hitColCandidates.find(name => cols.includes(name));
                if (!hitColName) throw new Error("No valid hit column found.");
                return json.table.rows.map(row => {
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
                      Set: setName
                    }
                  };
                });
              })
          );
        }
      }

      Promise.all(loaders).then(results => {
        globalData = results.flat();
        window.allFighterNames = [...new Set(globalData.map(c => c.name.trim().toLowerCase().replace(/\s+/g, " ")).filter(Boolean))];
        setupAutocomplete();
        renderCards(globalData);
      });
    }
  });

  document.getElementById("filter-unhit").addEventListener("change", () => {
    if (currentData.length > 0) renderCards(currentData);
    else if (globalData.length > 0) renderCards(globalData);
  });

  document.getElementById("parallel-select").addEventListener("change", () => {
    if (currentData.length > 0) renderCards(currentData);
  });

  document.getElementById("reset-search").addEventListener("click", () => {
    document.getElementById("search").value = "";
    document.getElementById("year-select").value = "";
    document.getElementById("set-select").innerHTML = '<option value="">Select Set</option>';
    document.getElementById("set-select").disabled = true;
    document.getElementById("parallel-select").innerHTML = '<option value="">Select Parallel</option><option value="All Parallels">All Parallels</option>';
    document.getElementById("parallel-select").disabled = true;
    document.getElementById("filter-unhit").checked = false;
    document.getElementById("result-list").innerHTML = "";
    currentData = [];
    globalData = [];
  });
});