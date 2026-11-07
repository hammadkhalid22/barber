(() => {
  const memory = new Map();
  const keys = {
    bookings: "atelierNoir.bookings",
    cancellations: "atelierNoir.cancellations",
    contacts: "atelierNoir.contacts"
  };

  function read(key) {
    try {
      const value = localStorage.getItem(key);
      const parsed = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("LocalStorage is unavailable; this demo's saved data will last for this page session only.", error);
      try {
        const parsed = JSON.parse(memory.get(key) || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
  }

  function write(key, value) {
    const serialized = JSON.stringify(value);
    memory.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn("Could not save this item to LocalStorage; keeping it for this page session only.", error);
      return false;
    }
  }

  function listBookings() { return read(keys.bookings); }
  function saveBooking(booking) {
    const bookings = listBookings();
    if (bookings.some((item) => item.id === booking.id) ||
        slotTaken(booking.barberId, booking.date, booking.time, booking.duration)) return false;
    bookings.push(booking);
    write(keys.bookings, bookings);
    return true;
  }
  function findBooking(id) {
    return listBookings().find((item) => item.id.toLowerCase() === String(id).trim().toLowerCase()) || null;
  }
  function cancelBooking(id, reason = "") {
    const bookings = listBookings();
    const index = bookings.findIndex((item) => item.id.toLowerCase() === String(id).trim().toLowerCase());
    if (index < 0 || bookings[index].status !== "confirmed") return null;
    bookings[index] = { ...bookings[index], status: "cancelled", cancelledAt: new Date().toISOString(), cancellationReason: reason };
    write(keys.bookings, bookings);
    const requests = read(keys.cancellations);
    requests.push({ bookingId: bookings[index].id, reason, createdAt: bookings[index].cancelledAt });
    write(keys.cancellations, requests);
    return bookings[index];
  }
  function slotTaken(barberId, date, time, duration) {
    const start = timeToMinutes(time);
    const end = start + duration;
    return listBookings().some((booking) => {
      if (booking.status !== "confirmed" || booking.barberId !== barberId || booking.date !== date) return false;
      const otherStart = timeToMinutes(booking.time);
      return start < otherStart + Number(booking.duration) && end > otherStart;
    });
  }
  function saveContact(contact) {
    const contacts = read(keys.contacts);
    contacts.push({ ...contact, id: `MSG-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString() });
    write(keys.contacts, contacts);
  }
  function timeToMinutes(time) {
    const [hours, minutes] = String(time).split(":").map(Number);
    return hours * 60 + minutes;
  }

  window.AtelierStorage = { listBookings, saveBooking, findBooking, cancelBooking, slotTaken, saveContact };
})();
