/* ================================================================
   synergy.js — Manual Article Manager for Synergy Weekly
   ---------------------------------------------------------------
   Changes made:
   - Featured card is now a single clickable <a> that opens the article URL.
   - Featured selection logic: uses the article posted 20 articles before the newest (index 20)
     but falls back to the last available article if there are fewer than 21 items
     (this matches option B you picked).
   - Minor robustness: gracefully handles empty/missing url fields.
   ================================================================ */

const articles = [

  /* 👇 NEWEST ARTICLE (image 25) */
  // { title:"Why Wikipedia Works (Mostly), and When it Doesn’t", image:"./data/27.png", description:"", url:"https://www.linkedin.com/pulse/why-wikipedia-works-mostly-when-doesnt-protocol-bmsce-dvhjc/?trackingId=1AUBZSM8SIeS69ucbhDpkg%3D%3D" },
  { title: "How Netflix Reinvented Itself Before It Was Forced To", image: "./data/30.PNG", description: "", url: "https://www.linkedin.com/pulse/how-netflix-reinvented-itself-before-forced-protocol-bmsce-nydsc/?trackingId=hp7IRdwTRSif3METH47kvw%3D%3D" },
  { title: "Palantir and the Software Behind Modern Warfare: A Deep Dive", image: "./data/29.png", description: "", url: "https://www.linkedin.com/pulse/palantir-software-behind-modern-warfare-deep-dive-protocol-bmsce-yeuac/?trackingId=BSwnXJoUSkG1IC%2F9k%2FZ7dA%3D%3D" },
  { title: "Inside Spotify Wrapped: How Your Listening Becomes a Story", image: "./data/28.png", description: "", url: "https://www.linkedin.com/pulse/inside-spotify-wrapped-how-your-listening-becomes-story-xr8mc/?trackingId=mIP0NcOuR8SKZBmnc2%2BJhw%3D%3D" },

  { title: "Why Wikipedia Works (Mostly), and When it Doesn’t", image: "./data/27.png", description: "", url: "https://www.linkedin.com/pulse/why-wikipedia-works-mostly-when-doesnt-protocol-bmsce-dvhjc/?trackingId=1AUBZSM8SIeS69ucbhDpkg%3D%3D" },
  { title: "How do Self-Driving Cars Make Decisions?", image: "./data/26.png", description: "", url: "https://www.linkedin.com/pulse/how-do-self-driving-cars-make-decisions-protocol-bmsce-8a1ac/?trackingId=hpLs2DhdRAi5B6tkebMD0w%3D%3D" },
  {
    title: "If Data Drives the World, Why Aren’t You Getting Paid?",
    image: "./data/25.png",
    description: "A deep dive into how personal data became the world’s most powerful currency, and why users deserve a share.",
    url: "https://www.linkedin.com/pulse/data-drives-world-why-arent-you-getting-paid-protocol-bmsce-wmgjc/?trackingId=AySRqloVSCOTzC5PfRI5cQ%3D%3D"
  },

  { title: "Does Computer Science Still Matter in 2025? What Every Student Needs to Know", image: "./data/24.png", description: "", url: "https://www.linkedin.com/pulse/does-computer-science-still-matter-2025-what-every-student-pdnsc/?trackingId=bRYN953LSU2WnySOBWZrRQ%3D%3D" },
  { title: "Who Owns Generative AI Content? The User, the Model, or the Brand?", image: "./data/23.png", description: "", url: "https://www.linkedin.com/pulse/who-owns-generative-ai-content-user-model-brand-protocol-bmsce-nzxbc/?trackingId=aGH0GkhNTESCjIRbHV5gxg%3D%3D" },
  { title: "Are We Losing the \"Human\" in Art?", image: "./data/22.png", description: "", url: "https://www.linkedin.com/pulse/we-losing-human-art-protocol-bmsce-p8tjc/?trackingId=ap3vnELbTVqi0gZIAdzVrA%3D%3D" },
  { title: "The Alignment Problem: Why aligning AI with human values is harder than it sounds", image: "./data/21.png", description: "", url: "https://www.linkedin.com/pulse/alignment-problem-why-aligning-ai-human-values-harder-than-mpvrc/?trackingId=ltHj6BwbRRS0hbmuH%2FGx0Q%3D%3D" },
  { title: "How do food delivery apps ACTUALLY work?", image: "./data/20.jpg", description: "", url: "https://www.linkedin.com/pulse/how-do-food-delivery-apps-actually-work-protocol-bmsce-dvtjc/?trackingId=yM29sxj4RbGVOIdGF6mubg%3D%3D" },
  { title: "How Tsinghua Researchers Shattered the Sorting Bottleneck in Directed Graphs", image: "./data/19.png", description: "", url: "https://www.linkedin.com/pulse/how-tsinghua-researchers-shattered-sorting-bottleneck-directed-lqicc/?trackingId=E9Mkpgy8RL6vX0o7%2F%2FLyLA%3D%3D" },
  { title: "What Happens When You Hit 'Send' on WhatsApp?", image: "./data/18.jpg", description: "", url: "https://www.linkedin.com/pulse/what-happens-when-you-hit-send-whatsapp-protocol-bmsce-a73sc/?trackingId=C6GKzbU9QsW4p7LIPOdd6w%3D%3D" },
  { title: "The Rise of Bio-Computers: When Your Next Processor Could Be Alive", image: "./data/17.png", description: "", url: "https://www.linkedin.com/pulse/rise-bio-computers-when-your-next-processor-could-alive-wgvjc/?trackingId=JjO%2BXAj3QmiKkWV%2FgaEOAw%3D%3D" },
  { title: "Bitcoin Explained: Cryptography, Blockchain, and Mining", image: "./data/16.png", description: "", url: "https://www.linkedin.com/pulse/bitcoin-explained-cryptography-blockchain-mining-protocol-bmsce-o8wrc/?trackingId=ADLTrV%2B0Q3%2BvDyJJDL9pCg%3D%3D" },
  { title: "How YouTube, Spotify, and Netflix Decide What You See Next", image: "./data/15.png", description: "", url: "https://www.linkedin.com/pulse/how-youtube-spotify-netflix-decide-what-you-see-next-protocol-bmsce-ftlsc/?trackingId=TP3PIfbKQluzUCzWBWCDSg%3D%3D" },
  { title: "Nanomedicine Explained: How Robots Smaller Than a Cell Could Change Everything", image: "./data/14.png", description: "", url: "https://www.linkedin.com/pulse/nanomedicine-explained-how-robots-smaller-than-cell-could-fffcc/?trackingId=U%2FRQZ%2BGRSDOO7rJp%2BckV%2BQ%3D%3D" },
  { title: "From Sand to Supercomputers: The Story of How Processors Power Our World", image: "./data/13.PNG", description: "", url: "https://www.linkedin.com/pulse/from-sand-silicon-sorcery-tiny-chip-behind-your-doomscrolls-mwxzc/?trackingId=fDuetHMpSMOzUtG8J92sLQ%3D%3D" },
  { title: "Understanding CAPTCHA: The Human Test Machines Couldn’t Pass (Until AI)", image: "./data/12.png", description: "", url: "https://www.linkedin.com/pulse/understanding-captcha-human-test-machines-couldnt-pass-gmkfc/?trackingId=AmGqcoBLRKu9v1eey8liPg%3D%3D" },
  { title: "Why Algorithmic Bias Happens: Math Can Be Neutral, Data Cannot", image: "./data/11.png", description: "", url: "https://www.linkedin.com/pulse/why-algorithmic-bias-happens-math-can-neutral-data-cannot-lfs4c/?trackingId=oiziwrw8QVWOOkWiXaIJsw%3D%3D" },
  { title: "What Really Happens When You Book an Uber", image: "./data/10.jpg", description: "", url: "https://www.linkedin.com/pulse/what-really-happens-when-you-book-uber-protocol-bmsce-ciboc/?trackingId=eQOkanpiT%2BCviYtvjoyeUw%3D%3D" },
  { title: "It Talks Like It Thinks — But Does ChatGPT Really Understand?", image: "./data/09.png", description: "", url: "https://www.linkedin.com/pulse/talks-like-thinks-does-chatgpt-really-understand-protocol-bmsce-pqblc/?trackingId=v7Bb7fCfSYK7dsoHIeKuJg%3D%3D" },
  { title: "Inside the Black Box: The Unsung Tech Hero of Aviation Safety", image: "./data/08.jpg", description: "", url: "https://www.linkedin.com/pulse/inside-black-box-unsung-tech-hero-aviation-safety-protocol-bmsce-zzt0c/?trackingId=QeeifIYGTGG%2Byg%2FtVYi1pg%3D%3D" },
  { title: "Would You Delete Your Worst Memory? The Science and Ethics of Rewriting the Mind", image: "./data/07.png", description: "", url: "https://www.linkedin.com/pulse/would-you-delete-your-worst-memory-science-ethics-rewriting-8dykc/?trackingId=1nnF7TgXTOKUpuFLjPFGlw%3D%3D" },
  { title: "How India's UPI Became the World’s Most Advanced Payment Protocol", image: "./data/06.png", description: "", url: "https://www.linkedin.com/pulse/how-indias-upi-became-worlds-most-advanced-payment-protocol-zybxc/?trackingId=jg5WE8A0QtyGqaJBxp5aCA%3D%3D" },
  { title: "The Quantum Clock is Ticking: Why Every Password You've Ever Created is Living on Borrowed Time", image: "./data/05.png", description: "", url: "https://www.linkedin.com/pulse/quantum-clock-ticking-why-every-password-youve-ever-created-zc9oc/?trackingId=iVby71sHTbyLxXME8MrZMA%3D%3D" },
  { title: "Electric Aircraft: The Future of Aviation", image: "./data/04.png", description: "https://www.linkedin.com/pulse/electric-aircraft-future-aviation-protocol-bmsce-xkrcc/?trackingId=N3IJAF3GQxu2ftm152eaMA%3D%3D", url: "" },
  { title: "How Does Google Maps Always Know the Fastest Route?", image: "./data/03.png", description: "", url: "https://www.linkedin.com/pulse/how-does-google-maps-always-know-fastest-route-protocol-bmsce-yqjsc/?trackingId=kK%2FDsbbtRS%2BP%2Bb2nFOnl9g%3D%3D" },
  { title: "Quantum Communication for Military Security", image: "./data/02.png", description: "", url: "https://www.linkedin.com/pulse/quantum-communication-military-security-protocol-bmsce-vyooc/?trackingId=GCZBEBGsTqiqG%2FLeDGv6NA%3D%3D" },
  { title: "Neural Processing Unit: The Microchip that Thinks Like You", image: "./data/01.jpg", description: "", url: "https://www.linkedin.com/pulse/neural-processing-unit-microchip-thinks-like-you-protocol-bmsce-hzy4c/?trackingId=3fnZMEKbQO6NwVRrceE43A%3D%3D" }
];


/* ================================================================
   FEATURED ARTICLE (Top – Full Width 16:9)
   ================================================================ */

/**
 * Choose featured article index using rule B:
 * - Prefer the article "20 articles before the newest" (index 20)
 * - If there are fewer than 21 articles, fall back to the last available article
 */
function getFeaturedIndex() {
  // clamp to available range: use Math.min(20, articles.length - 1)
  return Math.min(19, Math.max(0, articles.length - 1));
}

function buildFeatured(article) {
  const box = document.getElementById("featured-slot");
  box.innerHTML = "";

  // Clickable wrapper (block-level)
  const anchor = document.createElement("a");
  anchor.className = "featured-link";
  anchor.href = article.url && article.url.trim() !== "" ? article.url : "javascript:void(0)";
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "block";
  anchor.style.textDecoration = "none";
  anchor.style.color = "inherit";

  // INNER STRUCTURE (unchanged visual layout)
  const wrap = document.createElement("div");
  wrap.className = "featured-inner";

  const tag = document.createElement("div");
  tag.className = "featured-label";

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "featured-media";

  const img = document.createElement("img");
  img.className = "featured-thumb";
  img.src = article.image;
  img.alt = article.title || "Featured";

  mediaWrap.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "featured-meta";

  const h3 = document.createElement("h3");
  h3.textContent = article.title || "";
  h3.style.fontWeight = "100";

  const p = document.createElement("p");
  p.textContent = article.description || "";

  const btn = document.createElement("span");
  btn.className = "read-btn";
  btn.textContent = "Read on LinkedIn";

  meta.append(h3, p, btn);


  wrap.append(tag, mediaWrap, meta);
  anchor.appendChild(wrap);
  box.appendChild(anchor);
}



/* ================================================================
   Build a Grid Article Card (2-column layout)
   ================================================================ */

function buildArticleCard(a) {
  const card = document.createElement("a");
  card.className = "article-card";
  card.href = a.url && a.url.trim() !== "" ? a.url : "javascript:void(0)";
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  const img = document.createElement("img");
  img.className = "article-thumb";
  img.src = a.image;
  img.alt = a.title || "";

  const body = document.createElement("div");
  body.className = "article-body";

  const h4 = document.createElement("h4");
  h4.className = "article-title";
  h4.textContent = a.title || "";

  const meta = document.createElement("div");
  meta.className = "article-meta";

  const btn = document.createElement("span");
  btn.className = "read-btn";
  btn.textContent = "Read more";
  btn.style.fontWeight = "200";
  // btn.style.fontFamily = "Antonio";

  meta.appendChild(btn);
  body.appendChild(h4);
  body.appendChild(meta);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}


/* ================================================================
   Render Everything on Page Load
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // Determine featured index according to rule B (20 before newest, fallback)
  const featuredIndex = getFeaturedIndex();
  const featuredArticle = articles[featuredIndex] || articles[0];

  if (featuredArticle) {
    buildFeatured(featuredArticle);
  }

  // Build the grid of articles
  const grid = document.getElementById("articles-grid");
  grid.innerHTML = "";

  articles.forEach(article => {
    const card = buildArticleCard(article);
    grid.appendChild(card);
  });
});
