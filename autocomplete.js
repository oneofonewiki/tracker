function setupAutocomplete() {
  const searchInput = document.getElementById("search");
  const suggestionsBox = document.getElementById("autocomplete-suggestions");

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";

    if (!value || allFighterNames.length === 0) {
      suggestionsBox.classList.add("hidden");
      return;
    }

    const normalize = str => str.trim().toLowerCase().replace(/\s+/g, " ");
    const matches = allFighterNames
      .filter(name => normalize(name).includes(normalize(value)))
      .sort((a, b) => {
        const aNorm = normalize(a);
        const bNorm = normalize(b);
        const val = normalize(value);
        if (aNorm === val) return -1;
        if (bNorm === val) return 1;
        if (aNorm.startsWith(val) && !bNorm.startsWith(val)) return -1;
        if (!aNorm.startsWith(val) && bNorm.startsWith(val)) return 1;
        return aNorm.indexOf(val) - bNorm.indexOf(val);
      })
      .slice(0, 5);

    if (matches.length === 0) {
      suggestionsBox.classList.add("hidden");
      return;
    }

    matches.forEach(name => {
      const li = document.createElement("li");
      const regex = new RegExp(`(${value})`, 'gi');
      const capitalized = name.replace(/\b\w/g, c => c.toUpperCase());
      li.innerHTML = capitalized.replace(regex, "<span class='bg-yellow-200 text-gray-900 font-semibold'>$1</span>");
      li.className = "px-4 py-2 hover:bg-gray-200 cursor-pointer";
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        searchInput.value = name;
        suggestionsBox.classList.add("hidden");

        const year = document.getElementById("year-select").value;
        const set = document.getElementById("set-select").value;
        const dataSource = (year && set && currentData.length > 0) ? currentData : globalData;
        renderCards(dataSource);

        setTimeout(() => searchInput.blur(), 100);
      });
      suggestionsBox.appendChild(li);
    });

    suggestionsBox.classList.remove("hidden");

    let selectedIndex = -1;
    searchInput.addEventListener("keydown", (e) => {
      const items = suggestionsBox.querySelectorAll("li");
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateActiveItem(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateActiveItem(items);
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          items[selectedIndex].dispatchEvent(new Event("mousedown"));
        }
      }
    });

    function updateActiveItem(items) {
      items.forEach((item, i) => {
        item.classList.toggle("bg-gray-300", i === selectedIndex);
      });
    }
  });

  document.addEventListener("click", (e) => {
    if (!document.getElementById("search-wrapper").contains(e.target)) {
      suggestionsBox.classList.add("hidden");
    }
  });
}