/* script.js
   - Countdown reads the event datetime from #countdown[data-event]
   - Replace the data-event value in index.html to change the event date/time
*/

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Countdown
  const countdownEl = document.getElementById('countdown');
  const eventData = countdownEl.getAttribute('data-event');
  // If malformed or missing, provide default date (modify as needed)
  const eventDate = new Date(eventData || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  // Target elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date();
    let diff = eventDate - now;

    if (diff < 0) {
      // event passed — show zeros (or you can put an "Event Live" state here)
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / (1000 * 60)) % 60;
    const hr = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hr).padStart(2, '0');
    minutesEl.textContent = String(min).padStart(2, '0');
    secondsEl.textContent = String(sec).padStart(2, '0');
  }

  // initial run + interval
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Make game card clickable (anchor already wraps entire card)
  // Add keyboard accessibility: Enter/Space will follow link when card is focused
  document.querySelectorAll('.game-card').forEach(card => {
    card.setAttribute('tabindex', '0'); // make focusable
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

});
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".semester-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.parentElement;
      const grid = card.querySelector(".subjects-grid");

      card.classList.toggle("open");

      grid.style.display =
        grid.style.display === "grid" ? "none" : "grid";
    });
  });
});

