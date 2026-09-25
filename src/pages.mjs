import { business, cateringSections, communityExamples, communityThemes, impactFigures, menuHighlights, photoSlots } from './content.mjs';
import { isProduction } from './build-mode.mjs';

const numberFormat = new Intl.NumberFormat('en-CA');
const annualizedDonatedMeals = impactFigures.donatedMealsMonthlyFloor * 12;

const photoSlot = (key, modifier = '') => {
  const slot = photoSlots[key];
  if (!slot) throw new Error(`Unknown photo slot: ${key}`);
  if (slot.src && !slot.alt) throw new Error(`Add descriptive alt text for photo slot: ${key}`);
  const media = slot.src
    ? `<img src="${slot.src}" alt="${slot.alt}" loading="${key === 'homeFood' ? 'eager' : 'lazy'}">`
    : `<div class="photo-slot__pending">${isProduction ? '' : '<span>Photo coming soon</span>'}<strong>${slot.title}</strong></div>`;
  return `<figure class="photo-slot photo-slot--${slot.shape} ${modifier}" data-photo-slot="${key}" data-expected-file="/photos/${slot.file}"><div class="photo-slot__media">${media}</div>${slot.src ? `<figcaption>${slot.title}</figcaption>` : ''}</figure>`;
};

const cardPhoto = (key) => {
  const slot = photoSlots[key];
  if (!slot) throw new Error(`Unknown card photo slot: ${key}`);
  if (slot.src && !slot.alt) throw new Error(`Add descriptive alt text for card photo slot: ${key}`);
  const media = slot.src
    ? `<img src="${slot.src}" alt="${slot.alt}" loading="lazy">`
    : `<span class="food-flashcard__pending">${isProduction ? '' : '<span class="food-flashcard__pending-label">Photo coming soon</span>'}<strong>${slot.title}</strong></span>`;
  return `<span class="food-flashcard__photo" data-photo-slot="${key}" data-expected-file="/photos/${slot.file}">${media}</span>`;
};

const menuCard = (item, index) => `
  <details class="food-flashcard" name="menu-food" data-number="0${index + 1}">
    <summary class="food-flashcard__front" aria-label="${item.name} food card">
      ${cardPhoto(item.photoKey)}
      <span class="food-flashcard__face-copy">
        <span class="food-flashcard__number" aria-hidden="true">0${index + 1}</span>
        <span class="food-flashcard__category">${item.category}</span>
        <span class="food-flashcard__title" role="heading" aria-level="3">${item.name}</span>
        <span class="food-flashcard__hint"><span class="food-flashcard__hint-closed">Open food card</span><span class="food-flashcard__hint-open">Close food card</span></span>
      </span>
    </summary>
    <div class="food-flashcard__back">
      <p class="eyebrow">The food story</p>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a class="text-link text-link--light" href="${business.currentMenuUrl}">Check today’s menu on Skip</a>
    </div>
  </details>`;

const communityCard = (item, index, kind) => {
  const isExample = kind === 'example';
  return `
  <details class="food-flashcard community-flashcard ${isExample ? 'community-flashcard--example' : ''}" name="community-${kind}" data-number="0${index + 1}">
    <summary class="food-flashcard__front" aria-label="${item.title} community card">
      ${cardPhoto(item.photoKey)}
      <span class="food-flashcard__face-copy">
        <span class="food-flashcard__number" aria-hidden="true">0${index + 1}</span>
        <span class="food-flashcard__category">${item.eyebrow}</span>
        <span class="food-flashcard__title" role="heading" aria-level="3">${item.title}</span>
        <span class="food-flashcard__hint"><span class="food-flashcard__hint-closed">Open story card</span><span class="food-flashcard__hint-open">Close story card</span></span>
      </span>
    </summary>
    <div class="food-flashcard__back">
      <p class="eyebrow">${isExample ? 'Community in action' : 'Where care takes shape'}</p>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  </details>`;
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const cateringSectionCard = (section, index) => `
  <details class="catering-menu-card" name="catering-sections">
    <summary>
      <span class="catering-menu-card__number">${String(index + 1).padStart(2, '0')}</span>
      <span class="catering-menu-card__heading"><small>Shelly’s catering menu</small><strong>${escapeHtml(section.title)}</strong></span>
      <span class="catering-menu-card__count">${section.items.length} ${section.items.length === 1 ? 'selection' : 'selections'}<span class="catering-menu-card__hint"><span class="catering-menu-card__hint-closed">Open card</span><span class="catering-menu-card__hint-open">Close card</span></span></span>
    </summary>
    <div class="catering-menu-card__inside"><ul>${section.items.map((item) => `
      <li><div><h3>${escapeHtml(item.name)}</h3>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}</div><span>${item.price ? escapeHtml(item.price) : 'Request a quote'}</span></li>`).join('')}</ul></div>
  </details>`;

const action = (href, label, style = 'button--primary', extra = '') =>
  `<a class="button ${style}" href="${href}" ${extra}>${label}</a>`;

export const pages = [
  {
    path: '/',
    title: 'Shelly’s Indigenous Bistro | Food & Catering in Winnipeg',
    description: 'Discover Shelly’s Indigenous Bistro in Winnipeg: bannock, comforting favourites, a welcoming table and catering for gatherings.',
    body: `
      <section class="hero hero--home" aria-labelledby="home-title">
        <div class="wrap hero__grid">
          <div class="hero__copy">
            <p class="eyebrow">Indigenous-owned &amp; operated · Winnipeg</p>
            <h1 id="home-title">Indigenous favourites.<br> <em>Winnipeg comfort food.</em></h1>
            <p class="hero__lead">Made to bring people together. Come for fresh bannock, comforting favourites and a warm welcome—or let Shelly’s cater your next gathering.</p>
            <div class="actions">
              ${action('/catering/', 'Explore catering')}
              ${action(business.currentMenuUrl, 'Menu on Skip', 'button--light')}
            </div>
          </div>
          <div class="hero__art" aria-hidden="true">
            <div class="hero__stage"><div class="hero__art-frame"><img src="/brand/flowers.webp" width="165" height="890" alt=""></div></div>
            <div class="hero__ingredients">
              <svg class="ingredient ingredient--corn" viewBox="0 0 116 180" focusable="false"><path d="M59 15c25 0 34 18 34 59 0 51-15 83-34 83S25 125 25 74c0-41 9-59 34-59Z" fill="#f3c46c" stroke="#173a31" stroke-width="4"/><path d="M25 82C13 88 10 120 25 154c3-31 13-42 27-49M93 82c12 6 15 38 0 72-3-31-13-42-27-49" fill="#668a63" stroke="#173a31" stroke-width="4" stroke-linejoin="round"/><path d="M46 24v117M59 20v130M72 24v117M34 42h49M31 63h56M30 85h58M32 107h54M38 129h42" fill="none" stroke="#bc7d3f" stroke-width="3" stroke-linecap="round" opacity=".72"/><path d="M59 15V3" stroke="#173a31" stroke-width="5" stroke-linecap="round"/></svg>
              <svg class="ingredient ingredient--bean" viewBox="0 0 124 94" focusable="false"><path d="M100 25c17 17 10 45-12 57-19 10-35 1-46-12C31 58 9 67 8 45 7 22 32 5 56 9c16 3 28 0 44 16Z" fill="#7d4c68" stroke="#173a31" stroke-width="4"/><path d="M82 25c-18-8-34 0-42 19" fill="none" stroke="#f4dcaa" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>
              <svg class="ingredient ingredient--squash" viewBox="0 0 158 142" focusable="false"><path d="M81 27C43 8 17 36 16 74c-1 34 26 57 63 57 38 0 66-23 66-57 0-38-27-66-64-47Z" fill="#d99b54" stroke="#173a31" stroke-width="4"/><path d="M79 27c-14 22-22 59 0 104M79 27c16 22 22 59 0 104M47 26c-17 22-13 72 12 101M111 26c18 22 13 72-12 101" fill="none" stroke="#a96845" stroke-width="3" opacity=".8"/><path d="M79 28c-2-9 1-17 10-21" fill="none" stroke="#173a31" stroke-width="7" stroke-linecap="round"/><path d="M89 16c14-9 29-7 39 2-16 9-29 12-39-2Z" fill="#668a63" stroke="#173a31" stroke-width="3"/></svg>
            </div>
          </div>
        </div>
        <div class="wrap hero__foot"><span>Good food makes room for everyone.</span><a href="#food">Discover Shelly’s</a></div>
      </section>

      <section id="food" class="section section--cream" aria-labelledby="food-title">
        <div class="wrap section-heading">
          <div><p class="eyebrow eyebrow--dark">Food with a story</p><h2 id="food-title">Start with the food.</h2></div>
          <p>At Shelly’s, food is about more than what is on the plate. It is about family, culture, generosity and gathering together.</p>
        </div>
        <div class="wrap home-food-photo">${photoSlot('homeFood')}</div>
        <div class="wrap signature-grid">
          <details class="signature signature--featured signature--flash" name="home-food"><summary aria-label="Three Sisters Soup food card"><span class="signature__index">01 / A Shelly’s staple</span><span class="signature__title" role="heading" aria-level="3">Three Sisters Soup</span><span class="signature__tease">Warm, nourishing and made for sharing.</span><span class="signature__hint"><span class="signature__hint-closed">Open food card</span><span class="signature__hint-open">Close food card</span></span></summary><div class="signature__back"><p>Corn, beans and squash come together in a warm, nourishing bowl. Pair it with fresh bannock or fry bread.</p><a class="text-link text-link--light" href="/menu/#three-sisters">Read the full food story</a></div></details>
          <details class="signature signature--flash" name="home-food"><summary aria-label="Bannock food card"><span class="signature__index">02 / Fresh from the kitchen</span><span class="signature__title" role="heading" aria-level="3">Bannock</span><span class="signature__tease">Fresh dough, many ways to enjoy it.</span><span class="signature__hint"><span class="signature__hint-closed">Open food card</span><span class="signature__hint-open">Close food card</span></span></summary><div class="signature__back"><p>Enjoy it baked, fried, topped with locally made berry spread, or transformed into a taco or burger.</p><a class="text-link text-link--light" href="/menu/#bannock">Explore the bannock story</a></div></details>
          <article class="signature"><div class="signature__index">03 / Food to share</div><h3>Catering</h3><p>From team lunches and celebrations to large community gatherings, Shelly’s brings generous food to the table.</p><a class="text-link" href="/catering/">Plan your gathering</a></article>
        </div>
      </section>

      <section class="section section--plum" aria-labelledby="story-title">
        <div class="wrap split"><div><p class="eyebrow">The name behind the bistro</p><h2 id="story-title">Who was Shelly?</h2></div><div class="split__copy"><p>Shelly Kanfer was a bookkeeper, a trusted friend and part of the family. Her guidance and belief in the people behind this bistro helped an idea become a real business. Shelly’s carries her name in honour of her love of food and the place she holds in the family’s story.</p><a class="text-link text-link--light" href="/our-story/#shelly">Read Shelly’s story</a></div></div>
      </section>

      <section class="section section--butter" aria-labelledby="ownership-title">
        <div class="wrap split"><div><p class="eyebrow eyebrow--dark">Proudly Indigenous-owned</p><h2 id="ownership-title">Built with purpose.</h2></div><div class="split__copy"><p>Owner Vince Bignell, a member of Mathias Colomb First Nation, opened Shelly’s in Winnipeg in April 2023. Indigenous food, employment and care for community are all part of what the bistro is working to bring together.</p><a class="text-link" href="/indigenous-ownership/">Learn about our ownership</a></div></div>
      </section>

      <section class="section section--sage" aria-labelledby="community-home-title">
        <div class="wrap split"><div><p class="eyebrow eyebrow--dark">When community gathers</p><h2 id="community-home-title">We show up.</h2></div><div class="split__copy"><p>From lunch bags for evacuees to food for gatherings and support for Indigenous programs, Shelly’s believes a good meal can be a source of care and connection.</p><a class="text-link" href="/community/">Explore community work</a></div></div>
      </section>

      <section class="section section--cream" aria-labelledby="catering-title">
        <div class="wrap catering-feature"><div><p class="eyebrow eyebrow--dark">For the moments we share</p><h2 id="catering-title">Bring everyone to the table.</h2><p>Choose from Indigenous favourites, Three Sisters Soup with bannock, bannock taco bars, soups, stews and customized meals. The team can discuss dietary requests and the service that fits your gathering.</p><div class="actions">${action('/catering/', 'Explore catering')}${action(business.cateringRequestUrl, 'Start a catering request', 'button--outline')}</div></div>${photoSlot('cateringSpread')}</div>
      </section>

      <section class="section section--ink" aria-labelledby="visit-title"><div class="wrap closing"><p class="eyebrow">Come hungry</p><h2 id="visit-title">Leave feeling part of the community.</h2><p>Find Shelly’s in Winnipeg or call ahead to confirm today’s hours.</p><div class="actions">${action('/contact/', 'Find Shelly’s')}${action(business.phoneHref, `Call ${business.phoneDisplay}`, 'button--light')}</div></div></section>
    `
  },
  {
    path: '/menu/',
    title: 'Menu Highlights | Shelly’s Indigenous Bistro',
    description: 'Explore signature food at Shelly’s Indigenous Bistro, from fresh bannock and Three Sisters Soup to familiar comfort food.',
    body: `
      <section class="page-hero page-hero--menu"><div class="wrap"><p class="eyebrow">The food</p><h1>Made for the table.</h1><p>Fresh bannock, Three Sisters Soup and comforting favourites tell the story of Shelly’s kitchen. For current availability, the full menu and prices, visit Shelly’s on SkipTheDishes.</p><div class="actions">${action(business.currentMenuUrl, 'View the menu on Skip')}${action('/catering/', 'Explore catering', 'button--light')}</div></div></section>
      <section class="section section--cream"><div class="wrap section-heading"><div><p class="eyebrow eyebrow--dark">Shelly’s signatures</p><h2>Food to come back for.</h2></div><p>Get to know four Shelly’s favourites, from a warming bowl of soup to fresh bannock made into something special. Check Skip for today’s menu and prices.</p></div><div class="wrap menu-list">${menuHighlights.map(menuCard).join('')}</div><p class="wrap menu-afterword">Looking for more? Ask about fry bread burgers, bison creations, sweet treats and seasonal specials.</p></section>
      <section id="three-sisters" class="section section--butter"><div class="wrap split"><div><p class="eyebrow eyebrow--dark">A Shelly’s staple</p><h2>Three Sisters Soup.</h2></div><div class="split__copy"><p>Our Three Sisters Soup brings corn, beans and squash together in a warm, nourishing bowl. It is served the way food should be—generous and made to bring people together. Pair it with fresh bannock or fry bread.</p><p>These plants have long been grown together by many Indigenous peoples. In the garden, each supports the others; at the table, they offer a reminder of connection and community. Teachings and preparations vary among Nations and families.</p></div></div></section>
      <section id="bannock" class="section section--sage"><div class="wrap split"><div><p class="eyebrow eyebrow--dark">Start with the bannock</p><h2>Fresh, golden and made to share.</h2></div><div class="split__copy"><p>Shelly’s bannock dough is prepared fresh and served in many of the dishes that have made the bistro a local favourite. Enjoy it baked, fried, with berry spread, or as the foundation for a taco or burger.</p><p>From sweet treats to hearty fusion creations, the menu brings together generous portions and bold, comforting flavour.</p></div></div></section>
      <section class="section section--forest"><div class="wrap split"><div><p class="eyebrow">For your gathering</p><h2>More to share.</h2></div><div class="split__copy"><p>Explore the catering catalogue for bannock taco bars, soups, stews, reception selections and customized meals. Shelly’s confirms availability, dietary requests and final pricing with you.</p><a class="text-link text-link--light" href="/catering/">Explore catering</a></div></div></section>
    `
  },
  {
    path: '/catering/',
    title: 'Catering in Winnipeg | Shelly’s Indigenous Bistro',
    description: 'Plan food for a gathering with Shelly’s Indigenous Bistro. Explore catering favourites and tell us about your event.',
    body: `
      <section class="page-hero page-hero--catering"><div class="wrap"><p class="eyebrow">Shelly’s catering</p><h1>Shelly’s brings your favourites to your gathering.</h1><p>From fresh bannock platters and boxed lunches to comfort-food dinners and recurring meal programs, find a menu that fits your group.</p><div class="actions">${action('#catering-menu', 'Explore the catering menu')}${action(business.phoneHref, 'Call about catering', 'button--light')}</div></div></section>
      <section class="section section--butter"><div class="wrap section-heading"><div><p class="eyebrow eyebrow--dark">Ways to gather</p><h2>Food for your kind of event.</h2></div><p>From work lunches to family celebrations, we’ll help you find food that fits your group. Tell us your date, guest count and service needs.</p></div><div class="wrap catering-paths"><article><span>01</span><h3>Corporate &amp; Government</h3><p>Team lunches, meetings and public-sector events.</p></article><article><span>02</span><h3>Indigenous Organizations</h3><p>Community gatherings and cultural events.</p></article><article><span>03</span><h3>Traditional Feasts</h3><p>Discuss menu and service needs directly with the team.</p></article><article><span>04</span><h3>Conferences &amp; Training</h3><p>Meals for full-day programs and workplace learning.</p></article><article><span>05</span><h3>Weddings &amp; Family</h3><p>Celebrations centred on food and connection.</p></article><article><span>06</span><h3>Schools &amp; Youth</h3><p>Food for student gatherings and youth events.</p></article><article><span>07</span><h3>Emergency &amp; Large-Volume</h3><p>Ask about practical meal support and capacity.</p></article><article><span>08</span><h3>Individually Packaged</h3><p>Meal formats for groups that need easy distribution.</p></article></div></section>
      <section id="catering-menu" class="section section--cream"><div class="wrap section-heading"><div><p class="eyebrow eyebrow--dark">From Shelly’s kitchen</p><h2>Find your kind of feast.</h2></div><p>Open a menu card to explore the choices. Prices are shown where available; we’ll quote the rest around your group, service and delivery needs.</p></div><div class="wrap catering-menu-grid">${cateringSections.map(cateringSectionCard).join('')}</div></section>
      <section class="section section--butter"><div class="wrap catering-feature"><div><p class="eyebrow eyebrow--dark">Fresh favourites to share</p><h2>Start with the bannock.</h2><p>The Bannock &amp; Fry Bread Platter comes with whipped butter and homemade blueberry spread. Choose a small platter for $30, medium for $48 or large for $69. Ask about additional spreads or build a meal around a bannock taco bar.</p><div class="actions">${action(business.cateringRequestUrl, 'Start a catering request')}</div></div>${photoSlot('cateringSpread')}</div></section>
      <section class="section section--forest"><div class="wrap"><div class="section-heading section-heading--light"><div><p class="eyebrow">How a request works</p><h2>Start with the food. We’ll confirm the details.</h2></div></div><ol class="steps"><li><span>01</span><h3>Explore</h3><p>Choose from the menu cards above, including platters, packaged lunches, comfort-food dinners and desserts.</p></li><li><span>02</span><h3>Send</h3><p>Share your selections and event details in a catering request. No payment is taken when you submit it.</p></li><li><span>03</span><h3>Confirm</h3><p>Shelly’s reviews availability, dietary requests, delivery and final pricing with you.</p></li></ol><div class="actions actions--end">${action(business.cateringRequestUrl, 'Start your request')}</div></div></section>
      <section class="section section--sage"><div class="wrap split"><div><p class="eyebrow eyebrow--dark">Plan the details</p><h2>Let’s shape the meal around your event.</h2></div><div class="split__copy"><p>Advance notice is recommended. Menu selections and pricing may vary with group size, seasonal ingredients and dietary needs. Delivery is quoted by location; ask us about your service area and schedule.</p><a class="text-link" href="${business.phoneHref}">Call ${business.phoneDisplay}</a></div></div></section>
    `
  },
  {
    path: '/our-story/',
    title: 'Our Story | Shelly’s Indigenous Bistro',
    description: 'Meet Vince Bignell and discover the story of Shelly Kanfer, whose friendship and support inspired Shelly’s Indigenous Bistro.',
    body: `
      <section class="page-hero page-hero--story"><div class="wrap"><p class="eyebrow">Our story</p><h1>The people behind the table.</h1><p>Every dish carries a story—and every meal is an opportunity to bring people together. The story of Shelly’s begins with Vince, with family, and with the friend whose name is on the door.</p><div class="actions">${action('/catering/', 'Explore catering')}${action('/menu/', 'Discover the food', 'button--light')}</div></div></section>
      <section class="section section--cream"><div class="wrap story-feature"><div class="story-feature__copy"><p class="eyebrow eyebrow--dark">How Shelly’s began</p><h2>Meet Vince Bignell.</h2><p>Vince Bignell, a member of Mathias Colomb First Nation, is the owner and operator of Shelly’s Indigenous Bistro. His experiences in food, hospitality and catering helped shape an Indigenous-owned business built around generous meals and a welcoming table.</p><p>Shelly’s opened in Winnipeg on April 17, 2023. Since then, bannock creations, catering and community connection have been part of its growing story.</p><a class="text-link" href="/indigenous-ownership/">What Indigenous ownership means here</a></div>${photoSlot('vincePortrait')}</div></section>
      <section id="shelly" class="section section--butter"><div class="wrap story-feature story-feature--reverse">${photoSlot('shellyPortrait')}<div class="story-feature__copy"><p class="eyebrow eyebrow--dark">Who is Shelly?</p><h2>A name carried with love.</h2><p>Shelly Kanfer was more than our bookkeeper. She became a trusted friend, a source of guidance and eventually part of our family.</p><p>After her husband passed away in 2017, Shelly became our roommate. Her wisdom, encouragement and practical support helped us navigate difficult moments and overcome the obstacles that stood between an idea and a real business.</p><p>She offered non-judgmental support, patience and, most importantly, love. We named Shelly’s Bistro in her honour—celebrating her love of food, her belief in us and the place she continues to hold in our family’s story.</p></div></div></section>
      <section class="section section--sage"><div class="wrap section-heading"><div><p class="eyebrow eyebrow--dark">Our chapters</p><h2>How the story grows.</h2></div><p>What began with a love of food and hospitality has grown into a place for generous meals, catering and community connection.</p></div><ol class="wrap timeline"><li><span>Before 2023</span><h3>Food and hospitality</h3><p>Vince’s earlier hospitality and catering experience shaped the idea for Shelly’s.</p></li><li><span>April 17, 2023</span><h3>Shelly’s opens</h3><p>An Indigenous-owned bistro opens its doors in Winnipeg.</p></li><li><span>Early growth</span><h3>Bannock and community</h3><p>Bannock creations and a welcoming response help define the bistro.</p></li><li><span>The next chapter</span><h3>More people at the table</h3><p>Catering, partnerships, employment and community support remain part of the vision.</p></li></ol></section>
      <section class="section section--plum"><div class="wrap closing"><p class="eyebrow">Come share a meal</p><h2>The story continues around the table.</h2><div class="actions">${action('/contact/', 'Plan a visit')}${action('/stories/', 'Read more stories', 'button--light')}</div></div></section>
    `
  },
  {
    path: '/indigenous-ownership/',
    title: 'Indigenous Ownership | Shelly’s Indigenous Bistro',
    description: 'Learn how Indigenous ownership shapes Shelly’s Indigenous Bistro, its food, employment priorities and community relationships.',
    body: `
      <section class="page-hero page-hero--ownership"><div class="wrap"><p class="eyebrow">Indigenous ownership</p><h1>Indigenous-owned. Community-led. Open to everyone.</h1><p>Ownership is not a theme added to the bistro. It is part of who Shelly’s is, how we welcome people and why community stays central to the work.</p><div class="actions">${action('/our-story/', 'Meet the people')}${action('/catering/', 'Explore catering', 'button--light')}</div></div></section>
      <section class="section section--cream"><div class="wrap split"><div><p class="eyebrow eyebrow--dark">Our identity</p><h2>Grounded in a real story.</h2></div><div class="split__copy"><p>Shelly’s Indigenous Bistro is owned and operated by Vince Bignell, a member of Mathias Colomb First Nation.</p><p>Indigenous ownership shapes the bistro’s purpose, employment priorities and community relationships. Shelly’s shares food and hospitality with Winnipeg and the wider Manitoba community while creating opportunity.</p></div></div></section>
      <section class="section section--sage"><div class="wrap story-feature"><div class="story-feature__copy"><p class="eyebrow eyebrow--dark">Indigenous employment</p><h2>Opportunity belongs at the table.</h2><p>Shelly’s works to create opportunities for Indigenous people to learn, work and grow in hospitality and catering.</p><p>The people behind the food matter as much as the food itself. Every welcome, meal and gathering is shaped by the team that makes it happen.</p></div>${photoSlot('teamAtWork')}</div></section>
      <section class="section section--butter"><div class="wrap split"><div><p class="eyebrow eyebrow--dark">Culture and food</p><h2>Specific food. Many stories.</h2></div><div class="split__copy"><p>Some dishes connect with long-held food traditions. Others are personally meaningful or created in Shelly’s kitchen. Bannock, Three Sisters Soup and creative fusion dishes each have a place at the table; no single recipe tells every Indigenous food story.</p><p>The Three Sisters—corn, beans and squash—have been grown together by many Indigenous peoples. Teachings, preparations and relationships with these foods differ among Nations, communities and families.</p></div></div></section>
      <section class="section section--forest"><div class="wrap split"><div><p class="eyebrow">Economic reconciliation</p><h2>What a choice can support.</h2></div><div class="split__copy"><p>Choosing Shelly’s supports an Indigenous-owned company and its work to create employment and contribute to community initiatives.</p><a class="text-link text-link--light" href="/community/">See our community focus</a></div></div></section>
    `
  },
  {
    path: '/community/',
    title: 'Community | Shelly’s Indigenous Bistro',
    description: 'Learn how Shelly’s Indigenous Bistro brings food, hospitality and community care together in Winnipeg.',
    body: `
      <section class="page-hero page-hero--community"><div class="wrap"><p class="eyebrow">Community</p><h1>Food is a way to show up.</h1><p>Food has the power to make people feel welcomed, supported and remembered. That belief guides Shelly’s work with community organizations, Indigenous programs, cultural gatherings, families and people facing difficult circumstances.</p><div class="actions">${action('/catering/', 'Plan a gathering')}${action('/contact/', 'Get in touch', 'button--light')}</div></div></section>
      <section class="section section--cream"><div class="wrap story-feature"><div class="story-feature__copy"><p class="eyebrow eyebrow--dark">When our community gathers</p><h2>We show up with food.</h2><p>Community support is part of the way Shelly’s does business. We bring food, catering, sponsorship and hands-on support to gatherings and programs for Indigenous people, youth, families, artists and organizations.</p><p>Whether it is lunch bags for evacuees, meals at a cultural gathering or a local partnership to reduce food waste, the purpose is the same: food can be a source of care and connection.</p></div>${photoSlot('communityGathering')}</div></section>
      <section class="section section--sage"><div class="wrap section-heading"><div><p class="eyebrow eyebrow--dark">Where care takes shape</p><h2>More than one way to contribute.</h2></div><p>Care takes many forms: a nourishing meal, a shared gathering, a story lifted up or an opportunity to grow. Explore the ways Shelly’s works alongside community.</p></div><div class="wrap community-theme-grid">${communityThemes.map((item, index) => communityCard(item, index, 'theme')).join('')}</div></section>
      <section class="section section--butter"><div class="wrap section-heading"><div><p class="eyebrow eyebrow--dark">Community in action</p><h2>Showing up in practical ways.</h2></div><p>From food in difficult moments to meals that bring people together, these are some of the ways Shelly’s puts care into action.</p></div><div class="wrap example-grid">${communityExamples.map((item, index) => communityCard(item, index, 'example')).join('')}</div></section>
      <section class="section section--forest"><div class="wrap section-heading"><div><p class="eyebrow">Measure what matters</p><h2>Food that reaches further.</h2></div><p>Every meal is a chance to care for someone. Shelly’s feeds people throughout the year and shares food with neighbours who need it.</p></div><ul class="wrap impact-list"><li><strong>${(impactFigures.peopleFedAnnualFloor / 1_000_000).toFixed(1)}M+</strong><span>people fed each year</span></li><li><strong>${numberFormat.format(impactFigures.donatedMealsMonthlyFloor)}+</strong><span>meals donated each month</span></li><li><strong>${numberFormat.format(annualizedDonatedMeals)}+</strong><span>meals a year at this pace</span><small>Calculated from more than ${numberFormat.format(impactFigures.donatedMealsMonthlyFloor)} donated monthly.</small></li></ul></section>
      <section class="section section--plum"><div class="wrap closing"><p class="eyebrow">Work together</p><h2>Bring us your gathering.</h2><p>Planning a community event or group meal? Tell Shelly’s what you have in mind.</p><div class="actions">${action('/catering/', 'Explore catering')}${action('/contact/', 'Get in touch', 'button--light')}</div></div></section>
    `
  },
  {
    path: '/stories/',
    title: 'Stories from Shelly’s | Shelly’s Indigenous Bistro',
    description: 'Read the people-and-food stories behind Shelly’s Indigenous Bistro, with more community stories to come.',
    body: `
      <section class="page-hero page-hero--stories"><div class="wrap"><p class="eyebrow">Stories from Shelly’s</p><h1>Good food has a story.</h1><p>Meet the people behind the name and discover why bannock and Three Sisters Soup are at the heart of Shelly’s table.</p><div class="actions">${action('/our-story/', 'Read our story')}${action('/menu/', 'Discover the food', 'button--light')}</div></div></section>
      <section class="section section--cream"><div class="wrap section-heading"><div><p class="eyebrow eyebrow--dark">Start here</p><h2>Stories already on the table.</h2></div><p>Start with the friend who inspired the name, then explore the food that keeps bringing people back.</p></div><div class="wrap story-teasers"><article><span>People / Our story</span><h3>Why the bistro is named Shelly’s</h3><p>Shelly Kanfer was a bookkeeper, a friend and part of the family. Her belief in the people behind this bistro still has a place at the table.</p><a class="text-link" href="/our-story/#shelly">Read Shelly’s story</a></article><article><span>Food / The menu</span><h3>Three Sisters Soup, Shelly’s way</h3><p>Corn, beans and squash come together in a warm bowl that has become one of Shelly’s signatures.</p><a class="text-link" href="/menu/#three-sisters">Read the food story</a></article><article><span>Food / The menu</span><h3>Start with the bannock</h3><p>Fresh dough becomes baked bannock, fry bread, tacos, burgers and other generous Shelly’s creations.</p><a class="text-link" href="/menu/#bannock">Explore bannock</a></article></div></section>
      <section class="section section--butter"><div class="wrap story-feature"><div class="story-feature__copy"><p class="eyebrow eyebrow--dark">Behind the scenes</p><h2>Fresh bannock, many possibilities.</h2><p>At Shelly’s, bannock dough is prepared fresh. Enjoy it baked, fried, with a locally made berry spread or transformed into tacos, burgers, sweet treats and hearty fusion dishes.</p></div>${photoSlot('freshBannock')}</div></section>
      <section class="section section--plum"><div class="wrap closing"><p class="eyebrow">Make a new memory</p><h2>Pull up a chair.</h2><div class="actions">${action('/catering/', 'Plan a gathering')}${action('/contact/', 'Visit Shelly’s', 'button--light')}</div></div></section>
    `
  },
  {
    path: '/contact/',
    title: 'Visit & Contact | Shelly’s Indigenous Bistro',
    description: 'Find Shelly’s Indigenous Bistro in Winnipeg and call for current hours, menu availability or catering questions.',
    body: `
      <section class="page-hero page-hero--contact"><div class="wrap"><p class="eyebrow">Visit &amp; contact</p><h1>Come find Shelly’s.</h1><p>We’d love to hear from you. Call ahead to confirm current hours, availability or details for your visit.</p><div class="actions">${action(business.phoneHref, `Call ${business.phoneDisplay}`)}${action(business.directionsUrl, 'Get directions', 'button--light')}</div></div></section>
      <section class="section section--cream"><div class="wrap contact-grid"><div><p class="eyebrow eyebrow--dark">Where to find us</p><h2>A table in Winnipeg.</h2><p>We would love to welcome you. Please call ahead for today’s hours.</p>${photoSlot('bistroExterior')}</div><div class="contact-panel"><p class="contact-panel__label">Shelly’s Indigenous Bistro</p><address>${business.address}</address><a class="text-link" href="${business.directionsUrl}">Open directions</a><div class="contact-panel__rule"></div><p class="contact-panel__label">Phone</p><a class="contact-panel__phone" href="${business.phoneHref}">${business.phoneDisplay}</a><p>Planning a group event? Share your details in a catering request.</p>${action(business.cateringRequestUrl, 'Start a catering request', 'button--primary')}</div></div></section>
    `
  }
];

export const notFoundPage = {
  path: '/404/',
  title: 'Page not found | Shelly’s Indigenous Bistro',
  description: 'Find your way back to Shelly’s Indigenous Bistro.',
  body: `<section class="page-hero page-hero--contact"><div class="wrap"><p class="eyebrow">Page not found</p><h1>Let’s get you back to the table.</h1><p>That page is not here. You can order on Skip or return home.</p><div class="actions">${action(business.currentMenuUrl, 'Order on Skip')}${action('/', 'Return home', 'button--light')}</div></div></section>`
};
