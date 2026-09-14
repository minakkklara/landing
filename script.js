// Language toggle for the hub page (index.html).
// Switches which [data-lang-content] blocks are visible; role links inside
// each block already point to the matching language's CV pages, so no
// href-rewriting is needed.
document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".lang-switch button");
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");

      buttons.forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });

      document.querySelectorAll("[data-lang-content]").forEach(function (el) {
        el.hidden = el.getAttribute("data-lang-content") !== lang;
      });

      document.documentElement.lang = lang;
    });
  });
});
