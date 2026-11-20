"use strict";
(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const fields = ["full-name", "email", "topic", "message"].map(id => form.querySelector(`#${id}`));
  const [name, email, topic, message] = fields;
  const button = form.querySelector("#contact-submit");
  const feedback = form.querySelector("#contact-feedback");
  const fallback = form.querySelector("#contact-fallback");
  const error = form.querySelector("#contact-error");
  if (fields.some(field => !field) || !button || !feedback || !fallback || !error) return;
  let launchCheckTimer;
  let emailAppLikelyOpened = false;
  // Browsers do not report mailto launch success, so use leaving the page as a signal.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) emailAppLikelyOpened = true;
  });
  window.addEventListener("blur", () => {
    emailAppLikelyOpened = true;
  });
  button.disabled = false;
  form.addEventListener("input", event => {
    if (typeof event.target.setCustomValidity === "function") event.target.setCustomValidity("");
    feedback.textContent = "";
    fallback.hidden = true;
    error.hidden = true;
    window.clearTimeout(launchCheckTimer);
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    for (const field of [name, message]) {
      field.setCustomValidity(field.value.trim() ? "" : "Please enter text, not only spaces.");
    }
    if (!form.reportValidity()) return;
    const subject = "Website message: " + topic.options[topic.selectedIndex].text;
    const body = `Name: ${name.value.trim()}\r\nEmail: ${email.value.trim()}\r\n\r\n${message.value.trim()}`;
    form.querySelector("#contact-subject").textContent = subject;
    form.querySelector("#contact-draft").value = body;
    fallback.hidden = false;
    error.hidden = true;
    feedback.textContent = "An email draft has been requested. Review and send it in your email app. If nothing opens, use the manual instructions below. This page has not sent your message.";
    window.clearTimeout(launchCheckTimer);
    emailAppLikelyOpened = false;
    window.location.href = "mailto:hello@examplewebsite142.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    // If the page stays active, offer the manual fallback after the launch attempt.
    launchCheckTimer = window.setTimeout(() => {
      if (!emailAppLikelyOpened) error.hidden = false;
    }, 1500);
  });
})();
