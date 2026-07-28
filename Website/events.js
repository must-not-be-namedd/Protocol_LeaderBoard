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
    title: "Design Odyssey",
    image: "./data/events/designOdyssey.jpeg",
    date: "Wednesday, 29th July, 2026 | 5:00 PM – 8:30 PM",
    description: "🎨 Greetings from PROTOCOL!  As part of TROIKA, BMSCE IEEE Computer Society, in collaboration with Protocol, presents Design Odyssey – an exciting Online Poster Design Challenge that puts your creativity, imagination, and design skills to the ultimate test!  Create a visually stunning poster by combining a common theme with a unique set of randomly assigned elements. Transform unrelated ideas into one cohesive masterpiece and showcase your visual storytelling abilities.  💻 Mode: Online  🆓 Registration Fee: FREE 🎁 Prizes: Exciting Goodies for the Winners!  Whether you're a beginner or an experienced designer, Design Odyssey is your chance to think outside the box, innovate, and let your creativity shine!",
    register: "https://forms.gle/vkpprFxpZ9Mvxt8i6"
  },
  {
    title: "Code Escape",
    image: "./data/events/codeEscape.jpeg",
    date: "Thursday, 30th July, 2026 | 5:00 PM – 7:00 PM",
    description: "Greetings from BMSCE IEEE Computer Society and PROTOCOL! BMSCE IEEE Computer Society, in collaboration with Protocol, proudly presents Code Escape! An immersive online cybersecurity inspired challenge where participants decode encrypted clues, solve programming and logic puzzles, uncover hidden digital evidence and race against time to restore a compromised system.",
    register: "https://forms.gle/ZPXzNHjmLsqdoFwf7"
  }, 
  {
    title: "Synaptrix",
    image: "./data/events/synaptrix.jpeg",
    date: "Friday, 31st July, 2026 | 10:00 AM – 6:00 PM",
    description: "BMSCE IEEE Computer Society, in collaboration with Protocol, presents Synaptrix, an 8-hour Online Hackathon, designed to foster innovation and encourage the development of technology-driven solutions to real-world challenges. Step into an intensive environment focused on innovation, problem-solving, and purposeful AI integration. Explore technologies such as LLM APIs, Computer Vision, Machine Learning models, and transform innovative ideas into functional prototypes with an emphasis on real-world impact, technical excellence, and effective implementation.",
    register: "https://forms.gle/Nwm4kcqrsWSxrMxa9"
  } 
];

/* ================================================================
   ALL EVENTS (Newest First — ALL are past)
   ================================================================ */

const pastEvents = [
   {
    title: "Gateway to GATE",
    image: "./data/events/gatewayToGATE.jpeg",
    date: "21st June, 2026 | 4:00 PM – 5:00 PM",
    description: "🚀 CRACK GATE & NAVIGATE YOUR CAREER  💙 Greetings from Protocol Club, Department of Computer Science and Engineering, BMSCE, in collaboration with GeeksforGeeks India!  Confused about what comes next after engineering? Whether you're planning for GATE, higher studies, or a career in tech, we've got you covered!  Join us for an insightful session designed to help you make informed decisions about your future. 🎯  🎙️ Speaker: Mr. Chandan Jha Associate Vice President, GeeksforGeeks. ✨ Learn about: * GATE Preparation Strategy * Higher Studies Opportunities * Career Guidance & Industry Insights",
    //register: "https://forms.gle/MtfJyBf5LZsSgL9d6"
   },
 
   {
    title: "Cloud Management Mechanisms",
    image: "./data/events/cloudManagementMechanisms.jpeg",
    date: "4th and 5th June, 2026 | 1:30 PM – 4:30 PM",
    description: "🚀 PROTOCOL –  CSE Department Club presents  ☁️ CLOUD MANAGEMENT MECHANISMS Two days hands-on workshop designed to help you explore practical cloud concepts, coding exercises, and real-world case studies!  📌 What you’ll gain: ✨ Practical cloud computing skills ✨ Two days hands-on coding experience ✨ Industry-oriented case studies ✨ Interactive learning session with speaker Mr. Ravi Sajjanar",
    //register: "https://forms.gle/pXfna6oykDvprQdw9"
  },

  {
    title: "INSYNC 2026",
    image: "./data/events/insync.jpeg",
    date: "Tuesday, 28th April, 2026 | 1:00 PM – 2:00 PM",
    description: "Are you a 1st Year CSE Core Student looking to be a part of the Official Club of Department of Computer Science & Engineering? PROTOCOL is now recruiting for our core teams. Join us for our Orientation Event — INSYNC 2026 and this is your chance to find out what we do, meet the team, and learn how you can be a part of it. Interested in tech, events, content, design, management, or building cool things with a great team? This is for you. See you there 👀",
    //register: "https://forms.gle/sNGCG8uhj136iMUXA"
  },

  {
    title: "Among Us - IRL",
    image: "./data/events/among.jpeg",
    date: "18th-19th April, 2026",
    description: "Trust is a luxury in this real-life simulation of Among Us, where survival hinges on your ability to read the room. Navigate the chaos as the Imposter to sabotage and eliminate, the Medic to revive teammates and shift the balance, or the Jester to master the art of suspicion and win by getting voted out. The countdown has begun—watch your back, because the truth is harder to find than you think.",
    //register: "https://protocol-utsav.lovable.app/"
  },

  {
    title: "TriCipher",
    image: "./data/events/tri.jpeg",
    date: "17th April, 2026",
    description: "Decode. Strategize. Dominate. TriCipher is not your usual tech event — it’s a high-energy mix of speed, strategy, and smart thinking. From acting out clues in seconds to unlocking hidden advantages and cracking a final tech puzzle, every round keeps you on your toes. Team up, think fast, outplay the competition, and race your way to victory! 🚀",
    //register: "https://protocol-utsav.lovable.app/"
  },

  {
    title: "The Mega Hackathon",
    image: "./data/events/megaa.jpeg",
    date: "13th-14th March, 2026",
    description: "Protocol and Team Codelocked bring you our flagship hackathon, the highlight of Protocol Week 2026.If you enjoy building, brainstorming, and solving real-world problems, this is your chance to work with your team and turn your ideas into solutions.",
    //register: " https://forms.gle/sHMp48vxGjPpDTWc8"
  },

  {
    title: "CodeBlitz",
    image: "./data/events/cb.jpeg",
    date: "12th March, 2026",
    description: "As part of Protocol Week 2026, we’re bringing back one of our fastest and most exciting challenges.Ready to test both your coding skills and your logical thinking? CodeBlitz is a fast-paced Codeathon + Aptitude Hybrid Challenge where teamwork and coordination matter just as much as skill.",
    //register: "https://forms.gle/ASQqw6rMLnxLbUQ8A"
  },

  {
    title: "Brain Blitz",
    image: "./data/events/brain.jpeg",
    date: "13th March, 2026",
    description: "Pentagram in collaboration with Protocol on the account of Protocol Week 2026 presents:Brain Blitz - Where minds race against time 🚀Participate in the Magic Sum Puzzle, strategize in the Bidding War, and race to the top in the Ladder Game to prove your mastery!",
   //register: "https://forms.gle/HrPFLyLM3VYV4x796"
  },

  {
    title: "Beginner Hackathon",
    image: "./data/events/hack.jpeg",
    date: "5th March, 2026",
    description: "A beginner-friendly hackathon designed to introduce students to problem solving, teamwork, and building real projects.",
  },

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
