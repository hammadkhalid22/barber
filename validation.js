(() => {
  const form = document.getElementById("contact-form");
  const store = window.AtelierStorage;
  if (!form || !store) return;

  const alert = document.getElementById("contact-alert");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert.hidden = true;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    if (!/^[\p{L}\p{M}\p{Zs}\p{Pd}.'’]{2,100}$/u.test(values.name.trim()) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) ||
        (values.phone && !/^\+?[0-9 ()-]{7,20}$/.test(values.phone)) ||
        values.message.trim().length < 10) {
      alert.textContent = "Please enter a valid name, email, phone number, and message of at least 10 characters.";
      alert.classList.remove("success");
      alert.hidden = false;
      return;
    }
    store.saveContact({ ...values, name: values.name.trim(), email: values.email.trim(), message: values.message.trim() });
    alert.textContent = "Thank you. Your demo message has been saved for this browser session; it was not sent to the shop.";
    alert.classList.add("success");
    alert.hidden = false;
    form.reset();
  });
})();
