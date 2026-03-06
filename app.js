/* app.js — Japan in April interactivity */
(function () {
  "use strict";

  /* ---- Theme Toggle ---- */
  var toggle = document.querySelector("[data-theme-toggle]");
  var root = document.documentElement;
  var theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  root.setAttribute("data-theme", theme);

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.setAttribute(
      "aria-label",
      "Switch to " + (theme === "dark" ? "light" : "dark") + " mode"
    );
    toggle.innerHTML =
      theme === "dark"
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      updateToggleIcon();
    });
  }

  /* ---- Mobile Menu ---- */
  var menuBtn = document.querySelector("[data-mobile-menu]");
  var navList = document.getElementById("nav-list");

  if (menuBtn && navList) {
    menuBtn.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    /* Close nav on link click */
    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.innerHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });
    });
  }

  /* ---- Header scroll shadow ---- */
  var header = document.getElementById("site-header");
  if (header) {
    var lastScroll = 0;
    window.addEventListener(
      "scroll",
      function () {
        var currentScroll = window.scrollY;
        if (currentScroll > 10) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
        lastScroll = currentScroll;
      },
      { passive: true }
    );
  }

  /* ---- Category Filter ---- */
  var filterPills = document.querySelectorAll(".filter-pill");
  var cards = document.querySelectorAll(".prefecture-card");
  var regionSections = document.querySelectorAll(".region-section");
  var noResults = document.getElementById("no-results");

  filterPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      /* Update active state */
      filterPills.forEach(function (p) {
        p.classList.remove("active");
      });
      pill.classList.add("active");

      var filter = pill.getAttribute("data-filter");
      var visibleCount = 0;

      cards.forEach(function (card) {
        if (filter === "all") {
          card.classList.remove("hidden");
          visibleCount++;
        } else {
          var cats = card.getAttribute("data-categories") || "";
          if (cats.indexOf(filter) !== -1) {
            card.classList.remove("hidden");
            visibleCount++;
          } else {
            card.classList.add("hidden");
          }
        }
      });

      /* Hide region sections that have no visible cards */
      regionSections.forEach(function (section) {
        var visibleCards = section.querySelectorAll(
          ".prefecture-card:not(.hidden)"
        );
        if (visibleCards.length === 0) {
          section.style.display = "none";
        } else {
          section.style.display = "";
        }
      });

      /* Show/hide no results message */
      if (noResults) {
        if (visibleCount === 0) {
          noResults.hidden = false;
        } else {
          noResults.hidden = true;
        }
      }
    });
  });

  /* ---- Intersection Observer for card reveal ---- */
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px 0px -20px 0px" }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }
})();
