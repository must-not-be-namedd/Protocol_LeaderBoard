/* ================================================================
   events.js — Manual event manager for Events page
   ---------------------------------------------------------------
   HOW TO ADD / UPDATE EVENTS:
   - Save poster images in: /data/events/
     (event01.png, event02.png …)
   - Add NEW events at the TOP of the array.
     Newest → Oldest.
   - All events here are considered “past”.
   ================================================================ */


/* ================================================================
   UPCOMING EVENTS (Future)
   ================================================================ */

const upcomingEvents = [
  {
    title: "Beginner Hackathon",
    image: "./data/events/hack.jpeg",
    date: "5th March, 2026",
    description: "A beginner-friendly hackathon designed to introduce students to problem solving, teamwork, and building real projects.",
    register: "https://forms.gle/fdbw8ZikoGQDPsTs6"
  }
];


/* ================================================================
   ALL EVENTS (Newest First — ALL are past)
   ================================================================ */

const pastEvents = [

  /* 1) Project Blackscreen — 14 Nov 2025 */
  {
    title: "Project Blackscreen",
    image: "./data/events/event01.png",
    date: "14th November, 2025",
    description: "Protocol in collaboration with Pentagram for Anveshana hosted a challenge where teams of 2 competed in a series of high intensity coding and mathematical questions in an intense setting."
  },

  /* 2) GitHub Workshop — 13 Nov 2025 */
  {
    title: "GitHub Workshop",
    image: "./data/events/event02.png",
    date: "13th November, 2025",
    description: "The GitHub workshop held on 13 November 2025 introduced students to version control, repositories, branching, pull requests, and real-world collaboration workflows. Hosted by members of Protocol's very own senior team, this hands on session was found of great value by our juniors."
  },

  /* 3) The Protocol Gauntlet — 19 Sept 2025 */
  {
    title: "The Protocol Gauntlet",
    image: "./data/events/event03.png",
    date: "19th September, 2025",
    description: "Protocol Gauntlet is our flagship, multi-stage technical challenge at Phaseshift Meridian, built to test how quickly teams can think, solve, and adapt across different types of problems."
  },

  /* 4) Climb & Slide — 9 May 2025 */
  {
    title: "Climb & Slide",
    image: "./data/events/event04.jpg",
    date: "9th May, 2025",
    description: "During Utsav 2025, Protocol hosted a giant Snakes & Ladders game with a task-based twist."
  },

  /* 5) Among Us IRL — 10 & 11 May 2025 */
  {
    title: "Among Us — IRL",
    image: "./data/events/event05.jpg",
    date: "10th & 11th May, 2025",
    description: "During Utsav ‘25, we brought Among Us to life with physical tasks, hidden roles, and strategic eliminations."
  },

  /* 6) CodeBlitz 2.0 — 8 Apr 2025 */
  {
    title: "CodeBlitz 2.0",
    image: "./data/events/event06.jpg",
    date: "8th April, 2025",
    description: "A relay-style coding event during Protocol Week."
  },

  /* 7) COD Tournament — 7 Apr 2025 */
  {
    title: "COD (Call of Duty)",
    image: "./data/events/event07.jpg",
    date: "7th April, 2025",
    description: "Protocol hosted a COD Mobile tournament during Protocol Week."
  },

  /* 8) UI/UX Workshop — 13 Mar 2025 */
  {
    title: "UI/UX Workshop",
    image: "./data/events/event08.png",
    date: "13th March, 2025",
    description: "Led by Cherissha U Shetty, this Figma-based workshop introduced UI/UX principles."
  },

  /* 9) LeapCode Workshop — 2024 */
  {
    title: "LeapCode Workshop",
    image: "./data/events/event09.jpg",
    date: "3rd to 27th October, 2024",
    description: "LeapCode was a 4-week DSA workshop led by faculty and student mentors."
  },

  /* 10) Ciphered Coordinates Quest — 9 Jul 2024 */
  {
    title: "The Ciphered Coordinates Quest",
    image: "./data/events/event10.jpg",
    date: "9th July, 2024",
    description: "In collaboration with Pentagram, this treasure hunt combined math, coding, and problem-solving."
  }

];


/* ================================================================
   CARD BUILDER — No cropping + better card elevation
   ================================================================ */

function createEventCard(ev) {
  const card = document.createElement("div");
  card.className = "event-card";

  const imgWrap = document.createElement("div");
  imgWrap.className = "event-card-poster";

  const img = document.createElement("img");
  img.className = "event-card-img";
  img.src = ev.image;
  img.alt = ev.title;

  imgWrap.appendChild(img);

  const body = document.createElement("div");
  body.className = "event-card-body";

  const title = document.createElement("h4");
  title.className = "event-card-title condensed";
  title.textContent = ev.title;

  const date = document.createElement("div");
  date.className = "event-card-date small text-muted";
  date.textContent = ev.date;

  const desc = document.createElement("p");
  desc.className = "event-card-desc";
  desc.textContent = ev.description;

  body.append(title, date, desc);

  if (ev.register) {
    const btn = document.createElement("a");
    btn.href = ev.register;
    btn.target = "_blank";
    btn.className = "read-btn w-100 text-center mt-2";
    btn.textContent = "Register";
    body.appendChild(btn);
  }

  card.append(imgWrap, body);
  return card;
}


/* ================================================================
   RENDER GRID
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const upcomingGrid = document.getElementById("upcoming-grid");
  if (upcomingGrid) {
    upcomingEvents.forEach(ev => {
      upcomingGrid.appendChild(createEventCard(ev));
    });
  }

  const pastGrid = document.getElementById("past-grid");
  pastGrid.innerHTML = "";

  pastEvents.forEach(ev => {
    pastGrid.appendChild(createEventCard(ev));
  });

});
