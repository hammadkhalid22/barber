(() => {
  const catalog = window.Atelier;
  const storage = window.AtelierStorage;
  const html = catalog?.escapeHtml || ((value) => String(value ?? ""));
  const bookingForm = document.getElementById("booking-form");

  const state = {
    step: 1,
    service: null,
    barber: null,
    time: null,
    saving: false,
    booking: null
  };

  function getElement(id) {
    return document.getElementById(id);
  }

  function notify(message, type = "error") {
    const alert = getElement("booking-alert");
    if (alert) {
      alert.textContent = message;
      alert.classList.toggle("success", type === "success");
      alert.hidden = false;
    }

    let toast = getElement("booking-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "booking-toast";
      toast.className = "booking-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.toggle("success", type === "success");
    toast.classList.add("visible");
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => toast.classList.remove("visible"), 3600);
  }

  function selectService(serviceId) {
    if (!catalog) return null;
    const service = catalog.services.find((item) => item.id === serviceId) || null;
    state.service = service;
    state.time = null;
    document.querySelectorAll("#booking-services [data-id]").forEach((card) => {
      const selected = card.dataset.id === service?.id;
      card.classList.toggle("selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
    if (getElement("appointment-date")?.value && state.barber) generateTimeSlots();
    updateBookingActions();
    return service;
  }

  function selectBarber(barberId) {
    if (!catalog) return null;
    const barber = catalog.barbers.find((item) => item.id === barberId) || null;
    state.barber = barber;
    state.time = null;
    document.querySelectorAll("#booking-barbers [data-id]").forEach((card) => {
      const selected = card.dataset.id === barber?.id;
      card.classList.toggle("selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
    if (getElement("appointment-date")?.value && state.service) generateTimeSlots();
    updateBookingActions();
    return barber;
  }

  function calculateTotal(service = state.service) {
    return service ? Number(service.price) : 0;
  }

  function generateTimeSlots(service = state.service, barber = state.barber, date = getElement("appointment-date")?.value) {
    const target = getElement("time-slots");
    const status = getElement("slot-status");
    if (!service || !barber || !date) {
      if (target) target.replaceChildren();
      if (status) status.textContent = "Choose a date to see available times.";
      state.time = null;
      updateBookingActions();
      return [];
    }

    const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    const dateValue = new Date(`${date}T12:00:00`);
    if (!dateParts || Number.isNaN(dateValue.valueOf()) ||
        dateValue.getFullYear() !== Number(dateParts[1]) ||
        dateValue.getMonth() + 1 !== Number(dateParts[2]) ||
        dateValue.getDate() !== Number(dateParts[3])) {
      if (target) target.replaceChildren();
      if (status) status.textContent = "Choose a valid appointment date.";
      state.time = null;
      updateBookingActions();
      return [];
    }

    if (date < getTodayString()) {
      if (target) target.replaceChildren();
      if (status) status.textContent = "Choose today or a future date.";
      state.time = null;
      updateBookingActions();
      return [];
    }

    const day = dateValue.getDay();
    if (day === 0) {
      if (target) target.replaceChildren();
      if (status) status.textContent = "The shop is closed on Sundays.";
      state.time = null;
      updateBookingActions();
      return [];
    }

    const opens = day === 6 ? 10 * 60 : 9 * 60;
    const closes = day === 6 ? 18 * 60 : 19 * 60;
    const current = new Date();
    const now = current.getHours() * 60 + current.getMinutes();
    const slots = [];

    for (let start = opens; start + Number(service.duration) <= closes; start += 30) {
      if (date === getTodayString() && start <= now) continue;
      const time = `${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`;
      if (!storage?.slotTaken(barber.id, date, time, service.duration)) slots.push(time);
    }

    state.time = null;
    if (target) {
      target.replaceChildren(...slots.map((time) => {
        const button = document.createElement("button");
        button.className = "time-slot";
        button.type = "button";
        button.dataset.time = time;
        button.textContent = time;
        button.setAttribute("aria-pressed", "false");
        return button;
      }));
    }
    if (status) status.textContent = slots.length
      ? `${slots.length} available time${slots.length === 1 ? "" : "s"}`
      : "No available times. Please choose another date.";
    updateBookingActions();
    return slots;
  }

  function getTodayString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function validateBookingForm() {
    if (!state.service) return false;
    if (!state.barber) return false;
    const date = getElement("appointment-date")?.value;
    if (!date || date < getTodayString()) return false;
    if (!state.time || storage?.slotTaken(state.barber.id, date, state.time, state.service.duration)) return false;
    const name = getElement("customer-name")?.value.trim() || "";
    const phone = getElement("customer-phone")?.value.trim() || "";
    const email = getElement("customer-email")?.value.trim() || "";
    const notes = getElement("customer-notes")?.value || "";
    return /^[\p{L}\p{M}\p{Zs}\p{Pd}.'’]{2,100}$/u.test(name) &&
      /^\+?[0-9 ()-]{7,20}$/.test(phone) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) &&
      notes.length <= 1000;
  }

  function generateBookingID() {
    const bytes = new Uint8Array(8);
    if (globalThis.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(bytes);
      return `AN-${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
    }
    return `AN-${Date.now().toString(16).slice(-10).padStart(10, "0")}${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, "0")}`.toUpperCase();
  }

  function getBookings() {
    return storage?.listBookings() || [];
  }

  function saveBooking(booking) {
    if (!storage || !booking) return false;
    if (storage.slotTaken(booking.barberId, booking.date, booking.time, booking.duration)) return false;
    return storage.saveBooking(booking);
  }

  function cancelBooking(bookingId, reason = "") {
    return storage?.cancelBooking(bookingId, reason) || null;
  }

  function openBooking(serviceId = "", barberId = "") {
    const params = new URLSearchParams();
    if (serviceId) params.set("service", serviceId);
    if (barberId) params.set("barber", barberId);
    const query = params.toString();
    const bookingUrl = `booking.html${query ? `?${query}` : ""}`;
    const isBookingPage = document.body?.dataset.page === "booking";

    if (!isBookingPage) {
      window.location.assign(bookingUrl);
      return;
    }

    if (serviceId) selectService(serviceId);
    if (barberId) selectBarber(barberId);
    showBookingStep(1);
    getElement("booking-area")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showBookingStep(step) {
    if (!bookingForm || step < 1 || step > 7) return;
    state.step = step;
    bookingForm.querySelectorAll(".booking-step").forEach((section) => {
      section.classList.toggle("active", Number(section.dataset.step) === step);
    });
    const labels = ["Choose a service", "Choose a barber", "Choose a date", "Choose a time", "Your details", "Review booking"];
    if (step <= 6) {
      getElement("step-label").textContent = `STEP ${step} OF 6`;
      getElement("step-name").textContent = labels[step - 1];
      getElement("progress-fill").style.width = `${Math.round(step / 6 * 100)}%`;
    } else {
      getElement("step-label").textContent = "BOOKING COMPLETE";
      getElement("step-name").textContent = "Appointment saved";
      getElement("progress-fill").style.width = "100%";
    }
    getElement("booking-actions").hidden = step === 7;
    getElement("booking-back").hidden = step === 1 || step === 7;
    updateBookingActions();
  }

  function canAdvance() {
    if (state.step === 1) return Boolean(state.service);
    if (state.step === 2) return Boolean(state.barber);
    if (state.step === 3) return Boolean(getElement("appointment-date")?.value && getElement("appointment-date").value >= getTodayString());
    if (state.step === 4) return Boolean(state.time);
    if (state.step === 5) {
      const name = getElement("customer-name")?.value.trim() || "";
      const phone = getElement("customer-phone")?.value.trim() || "";
      const email = getElement("customer-email")?.value.trim() || "";
      const notes = getElement("customer-notes")?.value || "";
      return /^[\p{L}\p{M}\p{Zs}\p{Pd}.'’]{2,100}$/u.test(name) &&
        /^\+?[0-9 ()-]{7,20}$/.test(phone) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && notes.length <= 1000;
    }
    if (state.step === 6) return Boolean(getElement("booking-consent")?.checked);
    return false;
  }

  function updateBookingActions() {
    const next = getElement("booking-next");
    if (!next || state.step === 7) return;
    next.disabled = state.saving || !canAdvance();
    next.innerHTML = state.step === 6
      ? (state.saving ? '<span class="booking-button-spinner" aria-hidden="true"></span> Saving…' : 'Confirm booking <i class="bi bi-arrow-up-right"></i>')
      : 'Continue <i class="bi bi-arrow-right"></i>';
  }

  function renderSummary() {
    const date = getElement("appointment-date").value;
    const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    const rows = [
      ["Customer", getElement("customer-name").value.trim()],
      ["Service", state.service.name],
      ["Barber", state.barber.name],
      ["Date", dateLabel],
      ["Time", state.time],
      ["Duration", `${state.service.duration} minutes`],
      ["Total", `$${calculateTotal().toFixed(2)}`]
    ];
    getElement("booking-summary").innerHTML = rows
      .map(([label, value]) => `<div class="summary-row"><span>${html(label)}</span><strong>${html(value)}</strong></div>`)
      .join("");
  }

  function renderSuccess(booking) {
    const dateLabel = new Date(`${booking.date}T12:00:00`).toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    const rows = [
      ["Booking ID", booking.id],
      ["Customer", booking.name],
      ["Service", booking.service],
      ["Barber", booking.barber],
      ["Date", dateLabel],
      ["Time", booking.time],
      ["Total", `$${Number(booking.price).toFixed(2)}`]
    ];
    getElement("booking-success-details").innerHTML = rows
      .map(([label, value]) => `<div class="summary-row"><span>${html(label)}</span><strong>${html(value)}</strong></div>`)
      .join("");
    getElement("booking-details-link").href = `booking-status.html?id=${encodeURIComponent(booking.id)}`;
    getElement("booking-confirmation").classList.add("booking-success");
  }

  function confirmBooking() {
    if (state.saving) return false;
    if (!validateBookingForm() || !getElement("booking-consent").checked) {
      notify("Please review the details and choose an available time before confirming.");
      return false;
    }

    const appointmentDate = getElement("appointment-date").value;
    const booking = {
      id: generateBookingID(),
      name: getElement("customer-name").value.trim(),
      phone: getElement("customer-phone").value.trim(),
      email: getElement("customer-email").value.trim(),
      notes: getElement("customer-notes").value.trim(),
      serviceId: state.service.id,
      service: state.service.name,
      barberId: state.barber.id,
      barber: state.barber.name,
      date: appointmentDate,
      time: state.time,
      duration: Number(state.service.duration),
      price: calculateTotal(),
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    state.saving = true;
    updateBookingActions();
    window.setTimeout(() => {
      const saved = saveBooking(booking);
      state.saving = false;
      updateBookingActions();
      if (!saved) {
        generateTimeSlots();
        showBookingStep(4);
        notify("That time was just booked in this browser. Please choose another time.");
        return;
      }

      state.booking = booking;
      renderSuccess(booking);
      showBookingStep(7);
      getElement("booking-shell").scrollIntoView({ behavior: "smooth", block: "start" });
      notify("Your appointment is confirmed.", "success");
    }, 180);
    return true;
  }

  function resetBookingForm() {
    state.step = 1;
    state.service = null;
    state.barber = null;
    state.time = null;
    state.saving = false;
    state.booking = null;
    bookingForm?.reset();
    document.querySelectorAll("#booking-services [data-id], #booking-barbers [data-id]")
      .forEach((card) => {
        card.classList.remove("selected");
        card.setAttribute("aria-pressed", "false");
      });
    const date = getElement("appointment-date");
    if (date) {
      date.value = "";
      date.min = getTodayString();
    }
    getElement("time-slots")?.replaceChildren();
    getElement("slot-status").textContent = "Choose a date to see available times.";
    getElement("booking-alert").hidden = true;
    getElement("booking-confirmation").classList.remove("booking-success");
    showBookingStep(1);
  }

  function initBookingForm() {
    if (!bookingForm || !catalog || !storage) return;
    const serviceTarget = getElement("booking-services");
    const barberTarget = getElement("booking-barbers");

    serviceTarget.innerHTML = catalog.services.map((service) => `
      <button type="button" class="select-card" data-id="${html(service.id)}" aria-pressed="false">
        <h3>${html(service.name)}</h3><p>${html(service.description)}</p>
        <div class="select-price">$${Number(service.price).toFixed(2)} <span>· ${Number(service.duration)} min</span></div>
      </button>`).join("");
    barberTarget.innerHTML = catalog.barbers.map((barber) => `
      <button type="button" class="select-card" data-id="${html(barber.id)}" aria-pressed="false">
        <img src="${html(barber.image)}" alt="" loading="lazy">
        <span><h3>${html(barber.name)}</h3><p>${html(barber.specialization)}</p><p>${html(barber.experience)} experience</p></span>
      </button>`).join("");

    serviceTarget.addEventListener("click", (event) => {
      const card = event.target.closest("[data-id]");
      if (card) selectService(card.dataset.id);
    });
    barberTarget.addEventListener("click", (event) => {
      const card = event.target.closest("[data-id]");
      if (card) selectBarber(card.dataset.id);
    });
    getElement("time-slots").addEventListener("click", (event) => {
      const button = event.target.closest("[data-time]");
      if (!button) return;
      state.time = button.dataset.time;
      getElement("time-slots").querySelectorAll("[data-time]").forEach((slot) => {
        const selected = slot === button;
        slot.classList.toggle("selected", selected);
        slot.setAttribute("aria-pressed", String(selected));
      });
      updateBookingActions();
    });
    getElement("appointment-date").min = getTodayString();
    getElement("appointment-date").addEventListener("change", () => {
      state.time = null;
      generateTimeSlots();
      updateBookingActions();
    });
    getElement("booking-next").addEventListener("click", () => {
      getElement("booking-alert").hidden = true;
      if (state.step === 3) {
        if (!getElement("appointment-date").value || getElement("appointment-date").value < getTodayString()) {
          notify("Choose today or a future appointment date.");
          getElement("appointment-date").focus();
          return;
        }
        generateTimeSlots();
      }
      if (state.step === 5 && !canAdvance()) {
        ["customer-name", "customer-phone", "customer-email"].some((id) => {
          const field = getElement(id);
          if (!field.checkValidity()) {
            field.reportValidity();
            return true;
          }
          return false;
        });
        return;
      }
      if (state.step === 5) renderSummary();
      if (state.step === 6) {
        if (!getElement("booking-consent").checked) {
          notify("Please confirm the appointment details.");
          return;
        }
        confirmBooking();
        return;
      }
      showBookingStep(state.step + 1);
    });
    getElement("booking-back").addEventListener("click", () => {
      if (state.step > 1 && state.step <= 6) showBookingStep(state.step - 1);
    });
    bookingForm.addEventListener("submit", (event) => event.preventDefault());
    bookingForm.addEventListener("input", updateBookingActions);
    getElement("booking-consent").addEventListener("change", updateBookingActions);
    getElement("booking-start-over")?.addEventListener("click", resetBookingForm);

    const params = new URLSearchParams(window.location.search);
    if (params.has("service")) selectService(params.get("service"));
    if (params.has("barber")) selectBarber(params.get("barber"));
    showBookingStep(1);
  }

  function initStatusForm() {
    const form = document.getElementById("status-form");
    if (!form || !storage) return;
    const alert = getElement("status-alert");
    const result = getElement("status-result");
    const cancelForm = getElement("cancel-form");
    let activeBooking = null;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert.hidden = true;
      result.hidden = true;
      cancelForm.hidden = true;
      if (!form.reportValidity()) return;
      activeBooking = storage.findBooking(form.elements.reference.value.trim());
      if (!activeBooking) {
        alert.textContent = "No booking matches that ID in this browser.";
        alert.hidden = false;
        return;
      }
      const rows = [
        ["Booking ID", activeBooking.id], ["Customer", activeBooking.name],
        ["Service", activeBooking.service], ["Barber", activeBooking.barber],
        ["Date & time", `${activeBooking.date} · ${activeBooking.time}`],
        ["Price", `$${Number(activeBooking.price).toFixed(2)}`], ["Status", activeBooking.status]
      ];
      result.innerHTML = `<h3>Your appointment</h3>${rows.map(([label, value]) => `<div class="summary-row"><span>${html(label)}</span><strong>${html(value)}</strong></div>`).join("")}`;
      result.hidden = false;
      cancelForm.hidden = activeBooking.status !== "confirmed";
    });
    const requestedId = new URLSearchParams(window.location.search).get("id");
    if (requestedId) {
      form.elements.reference.value = requestedId;
      form.requestSubmit();
    }
    cancelForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!activeBooking) return;
      const cancelled = cancelBooking(activeBooking.id, getElement("cancel-reason").value.trim());
      if (!cancelled) {
        alert.textContent = "This booking can no longer be cancelled.";
        alert.hidden = false;
        return;
      }
      activeBooking = cancelled;
      result.querySelector(".summary-row:last-child strong").textContent = cancelled.status;
      result.querySelector(".summary-row:last-child strong").innerHTML = `<span class="status-badge cancelled">${html(cancelled.status)}</span>`;
      cancelForm.hidden = true;
      notify("Booking cancelled.", "success");
    });
  }

  function initBookNowLinks() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href*="booking.html"]');
      if (!link || link.target || event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname.endsWith("/booking.html") && document.body.dataset.page !== "booking") {
        event.preventDefault();
        openBooking(url.searchParams.get("service") || "", url.searchParams.get("barber") || "");
      }
    });
  }

  window.openBooking = openBooking;
  window.selectService = selectService;
  window.selectBarber = selectBarber;
  window.generateTimeSlots = generateTimeSlots;
  window.validateBookingForm = validateBookingForm;
  window.calculateTotal = calculateTotal;
  window.generateBookingID = generateBookingID;
  window.saveBooking = saveBooking;
  window.confirmBooking = confirmBooking;
  window.getBookings = getBookings;
  window.cancelBooking = cancelBooking;
  window.resetBookingForm = resetBookingForm;

  initBookingForm();
  initStatusForm();
  initBookNowLinks();
})();
