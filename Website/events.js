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
      description: "Protocol Gauntlet is our flagship, multi-stage technical challenge at Phaseshift Meridian, built to test how quickly teams can think, solve, and adapt across different types of problems. Teams progress through three rounds — Treasure Hunt, Escape Room, and a Game Show — each unlocking the next. The event takes participants from clue-solving across campus to fast, high-pressure puzzles and finally a competitive technical game show. It’s quick, chaotic in the best way, and brings together teamwork, logic, and technical skills in one unforgettable challenge."
    },
  
    /* 4) Climb & Slide — 9 May 2025 */
    {
      title: "Climb & Slide",
      image: "./data/events/event04.jpg",
      date: "9th May, 2025",
      description: "During Utsav 2025, Protocol hosted a giant Snakes & Ladders game with a task-based twist. Fun challenges, surprise elements, and a prize pool made for a nostalgic and energetic event."
    },
  
    /* 5) Among Us IRL — 10 & 11 May 2025 */
    {
      title: "Among Us — IRL",
      image: "./data/events/event05.jpg",
      date: "10th & 11th May, 2025",
      description: "During Utsav ‘25, we brought Among Us to life with physical tasks, hidden roles, and strategic eliminations. Fun, bluffing, and social deduction kept participants hooked throughout each round."
    },
  
    /* 6) CodeBlitz 2.0 — 8 Apr 2025 */
    {
      title: "CodeBlitz 2.0",
      image: "./data/events/event06.jpg",
      date: "8th April, 2025",
      description: "A relay-style coding event during Protocol Week, where teams alternated between puzzles and coding tasks. Time pressure and role swaps tested logic, speed, and teamwork."
    },
  
    /* 7) COD Tournament — 7 Apr 2025 */
    {
      title: "COD (Call of Duty)",
      image: "./data/events/event07.jpg",
      date: "7th April, 2025",
      description: "Protocol hosted a COD Mobile tournament during Protocol Week with intense 4v4 matches. The event combined fast reflexes, strategy, and campus esports enthusiasm in an engaging offline-online experience."
    },
  
    /* 8) UI/UX Workshop — 13 Mar 2025 */
    {
      title: "UI/UX Workshop",
      image: "./data/events/event08.png",
      date: "13th March, 2025",
      description: "Led by Cherissha U Shetty, this Figma-based workshop introduced UI/UX principles, wireframing, and design thinking. Students engaged in hands-on activities and group tasks to build intuitive interfaces."
    },
  
    /* 9) LeapCode Workshop — 2024 */
    {
      title: "LeapCode Workshop",
      image: "./data/events/event09.jpg",
      date: "3rd to 27th October, 2024",
      description: "LeapCode was a 4-week DSA workshop led by faculty and student mentors. Each week focused on core topics like arrays, strings, and trees, helping students strengthen coding skills for interviews and challenges."
    },
  
    /* 10) Ciphered Coordinates Quest — 9 Jul 2024 */
    {
      title: "The Ciphered Coordinates Quest",
      image: "./data/events/event10.jpg",
      date: "9th July, 2024",
      description: "In collaboration with Pentagram, this treasure hunt combined math, coding, and problem-solving. Teams cracked puzzles to unlock coordinates, using logic and speed in a fun, tech-meets-design adventure."
    },
  
    /* 11) Greentech Innovate — 21 Jun 2024 */
    {
      title: "Greentech Innovate",
      image: "./data/events/event11.jpg",
      date: "21st June, 2024",
      description: "Co-hosted with IEEE PELS, GreenTech Innovate was an ideathon exploring sensor tech in agriculture. Guided by Shravan Murthy, teams proposed sustainable farming solutions through creative, tech-driven ideas."
    },
  
    /* 12) Farewell '24 — 28 May 2024 */
    {
      title: "Farewell '24",
      image: "./data/events/event12.jpg",
      date: "28th May, 2024",
      description: "Held on May 28, 2024, Farewell '24 honored graduating CSE students with speeches, performances, and memento distribution. It was a heartfelt celebration of memories, milestones, and new beginnings, organized by Protocol and CodeIO."
    },
  
    /* 13) The World Of Pixels — 6 May 2024 */
    {
      title: "The World Of Pixels",
      image: "./data/events/event13.jpg",
      date: "6th May, 2024",
      description: "A vibrant, hands-on dive into the world of image processing, where participants explored how raw pixels could be transformed into stunning visuals using code. Blending logic and digital art — one algorithm at a time."
    },
  
    /* 14) InSync '24 — 9 May 2024 */
    {
      title: "InSync '24",
      image: "./data/events/event14.jpg",
      date: "9th May, 2024",
      description: "INSYNC '24 marked the official induction of freshers into Protocol. Faculty members and the senior core shared insights, past achievements, and club opportunities. The new core team was revealed, followed by games and refreshments to wrap up the evening."
    },
  
    /* 15) Induction '24 — Sept 2024 */
    {
      title: "Induction '24",
      image: "./data/events/event15.jpg",
      date: "23rd September",
      description: "Protocol and CodeIO introduced first-year CSE students to club structures, cultures, and opportunities. The event included presentations, an emoji game, and a Q&A session, encouraging participation and collaboration."
    },
  
    /* 16) Poisoned Roots — 6 Dec 2024 */
    {
      title: "Poisoned Roots",
      image: "./data/events/event16.jpg",
      date: "6th December, 2024",
      description: "A murder mystery event held during Phaseshift ‘24, where teams investigated a fictional botanist’s death using Python, binary codes, and clues. Fast-paced rounds combined storytelling and tech problem-solving."
    },
  
    /* 17) Marvel Masterminds — 5 Dec 2024 */
    {
      title: "Marvel Masterminds",
      image: "./data/events/event17.jpg",
      date: "5th December, 2024",
      description: "This Phaseshift event mixed Marvel fandom with tech and sustainability. Teams competed in quiz, buzzer, and debate rounds, showcasing knowledge, speed, and creative thinking."
    },
  
    /* 18) Sustainable Suspects — 5 Dec 2024 */
    {
      title: "Sustainable Suspects",
      image: "./data/events/event18.jpg",
      date: "5th December, 2024",
      description: "Held during Phaseshift ‘24, this live-action game turned Among Us into a role-based strategy event. Participants completed tasks, solved clues, and navigated deception in a high-energy team setting."
    },
  
    /* 19) The Matrix — 9 Dec 2023 */
    {
      title: "The Matrix",
      image: "./data/events/event19.jpg",
      date: "9th December, 2023",
      description: "A thrilling mission packed with cryptic codes, brain-twisting puzzles, and high-stakes choices that immersed participants in a gripping, alternate reality. Each challenge unlocked a new layer of the mystery, pushing logic, speed, and teamwork to the limit."
    },
  
    /* 20) Cloud Connect — 15 Dec 2023 */
    {
      title: "Cloud Connect",
      image: "./data/events/event20.jpg",
      date: "15th December, 2023",
      description: "A smart, immersive dive into cloud technology that seamlessly blended practical skills with real-world industry insights. Participants explored the power of scalable infrastructure, unlocking tools that shape the future of computing and innovation."
    },
  
    /* 21) Flutter Workshop — 8 Jun 2023 */
    {
      title: "Flutter Workshop",
      image: "./data/events/event21.jpg",
      date: "8th June, 2023",
      description: "Protocol conducted a hands-on, two-day Flutter workshop covering widgets, UI, and Firebase integration. Students built functional apps and gained real-world mobile development experience under expert guidance."
    }
  
  ];
  
  
  /* ================================================================
     CARD BUILDER — No cropping + better card elevation
     ================================================================ */
  
  function createEventCard(ev) {
    const card = document.createElement("div");
    card.className = "event-card";
  
    // Poster wrapper
    const imgWrap = document.createElement("div");
    imgWrap.className = "event-card-poster";
  
    const img = document.createElement("img");
    img.className = "event-card-img";
    img.src = ev.image;
    img.alt = ev.title;
  
    imgWrap.appendChild(img);
  
    // Body
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
    card.append(imgWrap, body);
  
    return card;
  }
  
  
  /* ================================================================
     RENDER GRID
     ================================================================ */
  
  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("past-grid");
    grid.innerHTML = "";
  
    pastEvents.forEach(ev => {
      grid.appendChild(createEventCard(ev));
    });
  });
  