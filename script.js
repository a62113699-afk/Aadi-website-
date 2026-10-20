const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");
menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

// Replace this URL with the society's approved Google Form URL before launch.
const MEMBERSHIP_FORM_URL = "https://forms.google.com/";
const joinButton = document.getElementById("joinButton");
if (joinButton && MEMBERSHIP_FORM_URL) joinButton.href = MEMBERSHIP_FORM_URL;
