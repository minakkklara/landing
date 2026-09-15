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

// Generic carousel (used for the case-studies block): arrow buttons + dots
// drive native horizontal scroll-snap, so touch swipe keeps working for free.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = carousel.querySelector(".carousel-arrow-prev");
    var nextBtn = carousel.querySelector(".carousel-arrow-next");
    var dotsWrap = carousel.parentElement.querySelector(".carousel-dots");
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
    var activeIndex = 0;

    function slideOffset(slide) {
      return slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    }

    function setActiveDot(idx) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === idx);
      });
    }

    // Button/dot clicks track the target index directly rather than
    // re-measuring scroll position, so dots update instantly and rapid
    // clicking (before a smooth-scroll finishes) still advances by one.
    function goTo(index) {
      index = Math.max(0, Math.min(slides.length - 1, index));
      activeIndex = index;
      track.scrollTo({ left: slideOffset(slides[index]), behavior: "smooth" });
      setActiveDot(index);
    }

    // Fallback for manual swipe/scroll: once scrolling settles, find
    // whichever slide is actually closest to the track's left edge.
    function closestIndex() {
      var trackLeft = track.getBoundingClientRect().left;
      var closest = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var dist = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      return closest;
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(activeIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(activeIndex + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); });
    });

    var scrollTimer;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        activeIndex = closestIndex();
        setActiveDot(activeIndex);
      }, 100);
    });
  });
});
