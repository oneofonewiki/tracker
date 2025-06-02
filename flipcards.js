document.addEventListener("click", function (e) {
  const card = e.target.closest(".flip-card");
  const isButton = e.target.closest("button, a");

  if (card && !isButton) {
    // Remove .flipped from all other cards
    document.querySelectorAll(".flip-card.flipped").forEach(c => {
      if (c !== card) c.classList.remove("flipped");
    });

    // Toggle current card
    card.classList.toggle("flipped");
  }
});