(() => {
  const services = [
    { id: "classic-cut", name: "Classic Haircut", category: "Haircuts", description: "A tailored cut finished with a hot-lather neckline and a considered, easy-to-wear style.", price: 42, duration: 45, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85", included: "Consultation · cut · style" },
    { id: "skin-fade", name: "Skin Fade", category: "Haircuts", description: "A precise, seamless fade blended to your preferred length, shape and finish.", price: 48, duration: 50, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85", included: "Consultation · fade · style" },
    { id: "low-fade", name: "Low Fade", category: "Haircuts", description: "A subtle low fade that keeps the silhouette neat while leaving room for your natural texture.", price: 48, duration: 50, image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=85", included: "Consultation · detailed fade · style" },
    { id: "mid-fade", name: "Mid Fade", category: "Haircuts", description: "A versatile mid-height blend with balanced contrast and a clean, confident finish.", price: 48, duration: 50, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85&sat=-20", included: "Consultation · detailed fade · style" },
    { id: "high-fade", name: "High Fade", category: "Haircuts", description: "A bold, high-contrast fade shaped around your head and finished with precision.", price: 50, duration: 55, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85", included: "Consultation · high fade · style" },
    { id: "taper-fade", name: "Taper Fade", category: "Haircuts", description: "A refined taper at the temples and neckline for an understated, always-sharp outline.", price: 46, duration: 45, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85", included: "Consultation · taper · style" },
    { id: "buzz-cut", name: "Buzz Cut", category: "Haircuts", description: "Clean, even clipper work with a carefully detailed hairline and neck finish.", price: 32, duration: 30, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85", included: "Consultation · clipper cut · line-up" },
    { id: "scissor-cut", name: "Scissor Cut", category: "Haircuts", description: "Shape, movement and soft transitions, cut by hand to complement your features.", price: 52, duration: 55, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85", included: "Consultation · scissor cut · style" },
    { id: "beard-trim", name: "Beard Trim", category: "Beard & Shave", description: "Balanced length, clean edges and a nourishing towel finish for a beard that feels intentional.", price: 30, duration: 30, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85&sat=-25", included: "Shape · detail · conditioning oil" },
    { id: "beard-shaping", name: "Beard Shaping", category: "Beard & Shave", description: "A more considered sculpt to bring definition, proportion and structure to your beard.", price: 38, duration: 40, image: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=900&q=85", included: "Consultation · sculpt · hot towel" },
    { id: "hot-towel-shave", name: "Hot Towel Shave", category: "Beard & Shave", description: "A classic straight-razor shave with warm towels, a rich lather and calming aftercare.", price: 38, duration: 40, image: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=900&q=85", included: "Hot towels · straight razor · balm" },
    { id: "beard-styling", name: "Beard Styling", category: "Beard & Shave", description: "A polished, wearable shape with expert product guidance for your daily routine.", price: 34, duration: 35, image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=900&q=85", included: "Shape · product finish · care tips" },
    { id: "hair-wash", name: "Hair Wash", category: "Hair & Scalp", description: "A refreshing cleanse using considered products, followed by a restorative scalp massage.", price: 18, duration: 20, image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85", included: "Premium cleanse · scalp massage" },
    { id: "hair-styling", name: "Hair Styling", category: "Hair & Scalp", description: "A polished finish for a special occasion or an expert hand with your everyday look.", price: 28, duration: 30, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85&sat=-30", included: "Consultation · blow dry · finish" },
    { id: "hair-color", name: "Hair Coloring", category: "Hair & Scalp", description: "Subtle grey blending or a complete refresh, thoughtfully matched to your natural tone.", price: 68, duration: 75, image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=900&q=85", included: "Color consultation · application · finish" },
    { id: "hair-spa", name: "Hair Spa", category: "Hair & Scalp", description: "A deeply conditioning treatment to soften, replenish and restore healthy-looking hair.", price: 45, duration: 45, image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85", included: "Cleanse · treatment mask · scalp massage" },
    { id: "scalp-treatment", name: "Scalp Treatment", category: "Hair & Scalp", description: "A focused reset with a gentle exfoliating cleanse and a calming, targeted scalp ritual.", price: 40, duration: 40, image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=85", included: "Scalp consultation · treatment · massage" },
    { id: "cut-beard", name: "Haircut + Beard Combo", category: "Packages", description: "A considered haircut and beard detail in one easy, complete appointment.", price: 65, duration: 70, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85&sat=15", included: "Consultation · haircut · beard detail" },
    { id: "vip-grooming", name: "VIP Grooming Package", category: "Packages", description: "Our signature haircut, beard ritual and hot towel finish, with time to enjoy every detail.", price: 95, duration: 90, image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=85", included: "Haircut · beard · hot towel · styling" },
    { id: "complete-grooming", name: "Complete Grooming Experience", category: "Packages", description: "A full reset from hair and beard to scalp care, finished with a tailored style.", price: 125, duration: 120, image: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=900&q=85&sat=20", included: "Haircut · beard · wash · scalp ritual" }
  ];

  const barbers = [
    { id: "marcus-reed", name: "Marcus Reed", experience: "12 years", specialization: "Classic cuts & scissor work", bio: "A master of timeless shape and considered detail, Marcus makes every cut feel personal.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85" },
    { id: "elijah-stone", name: "Elijah Stone", experience: "9 years", specialization: "Skin fades & modern texture", bio: "Elijah pairs clean technical fades with contemporary styling and an easy chair-side manner.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85" },
    { id: "james-walker", name: "James Walker", experience: "15 years", specialization: "Beard design & straight-razor shaves", bio: "A traditionalist at heart, James brings patience and precision to every beard and shave.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85" }
  ];

  const navItems = [
    ["Home", "index.html", "home"], ["Our story", "about.html", "about"], ["Services", "services.html", "services"],
    ["Barbers", "barbers.html", "barbers"], ["Gallery", "gallery.html", "gallery"], ["Pricing", "pricing.html", "pricing"],
    ["Contact", "contact.html", "contact"]
  ];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function header() {
    const host = document.getElementById("site-header");
    if (!host) return;
    const current = document.body.dataset.page;
    host.innerHTML = `<nav class="site-nav" aria-label="Main navigation"><div class="container">
      <a class="brand-mark" href="index.html" aria-label="Atelier Noir home"><span class="brand-icon">A</span><span>ATELIER NOIR<small>BARBER HOUSE</small></span></a>
      <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><i class="bi bi-list" aria-hidden="true"></i></button>
      <ul class="nav-list">${navItems.map(([label, href, page]) => `<li><a href="${href}"${current === page ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}<li><a class="nav-book" href="booking.html">Book now <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a></li></ul>
    </div></nav>`;
    const toggle = host.querySelector(".nav-toggle");
    const list = host.querySelector(".nav-list");
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      toggle.innerHTML = `<i class="bi bi-${expanded ? "list" : "x-lg"}" aria-hidden="true"></i>`;
      list.classList.toggle("open", !expanded);
      document.body.classList.toggle("nav-open", !expanded);
    });
    list.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        list.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
        document.body.classList.remove("nav-open");
      }
    });
  }

  function footer() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.innerHTML = `<footer class="site-footer"><div class="container"><div class="footer-top row g-4">
      <div class="col-lg-4 col-md-6"><a class="footer-brand" href="index.html">ATELIER <span>NOIR</span></a><p class="mt-3">A modern barber house.<br>Old-world craft. Personal style.</p><div class="footer-social"><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="bi bi-facebook"></i></a></div></div>
      <div class="col-6 col-lg-2 col-md-3"><h2 class="footer-heading">Explore</h2><div class="footer-links"><a href="about.html">Our story</a><a href="services.html">Services</a><a href="barbers.html">Our barbers</a><a href="gallery.html">Gallery</a></div></div>
      <div class="col-6 col-lg-2 col-md-3"><h2 class="footer-heading">Your visit</h2><div class="footer-links"><a href="pricing.html">Pricing</a><a href="booking.html">Book an appointment</a><a href="booking-status.html">Booking status</a><a href="contact.html">Contact</a></div></div>
      <div class="col-lg-3 col-md-6"><h2 class="footer-heading">Find the shop</h2><p>127 Mercer Street<br>New York, NY 10012</p><p><a href="tel:+12125550148">+1 (212) 555-0148</a><br><a href="mailto:hello@ateliernoir.com">hello@ateliernoir.com</a></p><p>Mon–Fri 9am–7pm &nbsp;·&nbsp; Sat 10am–6pm</p></div>
    </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Atelier Noir Barber House. Demo concept.</span><span>Made with care in New York.</span></div></div></footer>`;
  }

  function serviceCard(service) {
    return `<article class="service-card"><a class="service-image" href="booking.html?service=${encodeURIComponent(service.id)}"><img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.name)}" loading="lazy"><span class="service-image-shade"></span></a><div class="service-info"><span class="service-category">${escapeHtml(service.category)}</span><h3>${escapeHtml(service.name)}</h3><p>${escapeHtml(service.description)}</p><div class="service-meta"><span>${service.duration} MIN</span><strong>$${service.price}</strong></div><a class="text-link" href="booking.html?service=${encodeURIComponent(service.id)}">Book this service <i class="bi bi-arrow-up-right"></i></a></div></article>`;
  }

  function barberCard(barber) {
    return `<article class="barber-card"><div class="barber-image"><img src="${escapeHtml(barber.image)}" alt="Portrait of ${escapeHtml(barber.name)}" loading="lazy"></div><div class="barber-info"><h3>${escapeHtml(barber.name)}</h3><span class="specialty">${escapeHtml(barber.specialization)}</span><p>${escapeHtml(barber.bio)}</p><span class="experience">${escapeHtml(barber.experience)} of experience</span><a class="text-link" href="booking.html?barber=${encodeURIComponent(barber.id)}">Book with ${escapeHtml(barber.name.split(" ")[0])} <i class="bi bi-arrow-up-right"></i></a></div></article>`;
  }

  function populateCatalog() {
    const servicesTarget = document.getElementById("featured-services");
    if (servicesTarget) servicesTarget.innerHTML = services.slice(0, 3).map((service) => `<div class="col-md-6 col-lg-4 reveal">${serviceCard(service)}</div>`).join("");
    const allBarbers = document.getElementById("all-barbers");
    if (allBarbers) allBarbers.innerHTML = barbers.map((barber) => `<div class="col-md-6 col-lg-4 reveal">${barberCard(barber)}</div>`).join("");
    const featuredBarbers = document.getElementById("featured-barbers");
    if (featuredBarbers) featuredBarbers.innerHTML = barbers.slice(0, 3).map((barber) => `<div class="col-md-6 col-lg-4 reveal">${barberCard(barber)}</div>`).join("");
    const pricing = document.getElementById("pricing-list");
    if (pricing) pricing.innerHTML = services.map((service) => `<article class="pricing-row"><div><h3>${escapeHtml(service.name)}</h3><p>${escapeHtml(service.description)}</p></div><span class="duration">${service.duration} min</span><span class="price">$${service.price}</span><a class="pricing-book" href="booking.html?service=${encodeURIComponent(service.id)}" aria-label="Book ${escapeHtml(service.name)}">Book <i class="bi bi-arrow-up-right"></i></a></article>`).join("");
    populateServicesPage();
    animateCounters();
  }

  function populateServicesPage() {
    const target = document.getElementById("service-categories");
    if (!target) return;
    const categories = [...new Set(services.map((service) => service.category))];
    target.innerHTML = categories.map((category) => `<section class="service-category-section"><div class="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4"><div><p class="eyebrow">${category === "Haircuts" ? "THE FOUNDATIONS" : category === "Beard & Shave" ? "DETAILS THAT DEFINE" : category === "Hair & Scalp" ? "CARE, CONSIDERED" : "THE COMPLETE RITUAL"}</p><h2 class="section-title mb-0">${escapeHtml(category)} <em>${category === "Packages" ? "edit." : "services."}</em></h2></div></div><div class="row g-4">${services.filter((service) => service.category === category).map((service) => `<div class="col-md-6 col-xl-4 reveal">${serviceCard(service)}<div class="service-includes"><span>INCLUDES</span><p>${escapeHtml(service.included)}</p></div></div>`).join("")}</div></section>`).join("");
    revealElements();
  }

  function revealElements() {
    const elements = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);
      observer.observe(item);
    });
  }

  function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    const animate = (element) => {
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const start = performance.now();
      const duration = 1300;
      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = `${Math.round(target * (1 - (1 - progress) ** 3))}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    if (!("IntersectionObserver" in window)) return counters.forEach(animate);
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => {
      if (entry.isIntersecting) { animate(entry.target); current.unobserve(entry.target); }
    }), { threshold: .6 });
    counters.forEach((counter) => observer.observe(counter));
  }

  function stickyNav() {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;
    const update = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  document.querySelectorAll("main img:not([loading])").forEach((image) => image.setAttribute("loading", "lazy"));
  window.Atelier = { services, barbers, escapeHtml };
  header();
  footer();
  populateCatalog();
  revealElements();
  stickyNav();
  document.documentElement.classList.add("page-ready");
})();
