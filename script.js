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

// Avatar lightbox: click the small sidebar photo to see it bigger.
document.addEventListener("DOMContentLoaded", function () {
  var avatars = document.querySelectorAll(".toc-avatar");
  if (!avatars.length) return;

  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.hidden = true;

  var img = document.createElement("img");
  img.className = "lightbox-image";
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  avatars.forEach(function (avatar) {
    avatar.setAttribute("tabindex", "0");
    avatar.setAttribute("role", "button");
    avatar.setAttribute("aria-label", (avatar.alt || "Photo") + " — open larger");
    avatar.addEventListener("click", function () {
      openLightbox(avatar.src, avatar.alt);
    });
    avatar.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(avatar.src, avatar.alt);
      }
    });
  });

  overlay.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) closeLightbox();
  });
});

// Horizontal career timeline (About page): click a point, or use the
// prev/next buttons, to make it the "active" (enlarged) one.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".career-timeline").forEach(function (timeline) {
    var points = Array.prototype.slice.call(timeline.querySelectorAll(".career-point"));
    if (!points.length) return;
    var prevBtn = timeline.querySelector(".career-nav-prev");
    var nextBtn = timeline.querySelector(".career-nav-next");
    var activeIndex = points.findIndex(function (p) { return p.classList.contains("active"); });
    if (activeIndex < 0) activeIndex = 0;

    function setActive(index) {
      index = Math.max(0, Math.min(points.length - 1, index));
      activeIndex = index;
      points.forEach(function (p, i) {
        p.classList.toggle("active", i === index);
      });
    }

    points.forEach(function (p, i) {
      p.addEventListener("click", function () { setActive(i); });
    });
    if (prevBtn) prevBtn.addEventListener("click", function () { setActive(activeIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { setActive(activeIndex + 1); });
  });
});
