(function () {
  "use strict";
  var RM = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* page-load rise + measure line */
  window.addEventListener("load", function () {
    document.documentElement.classList.add("loaded");
    /* ---------- drafting canvas background ---------- */
    (function draftCanvas() {
      if (RM) return;
      var c = document.createElement("canvas");
      c.id = "draft-canvas";
      document.body.appendChild(c);
      var ctx = c.getContext && c.getContext("2d");
      if (!ctx) return;
      var W, H, t = 0, vis = true;
      var nodes, marks, rings;
      var COB = "37,71,232", MINT = "14,168,143";
      function size() {
        var dpr = Math.min(devicePixelRatio || 1, 2);
        W = innerWidth; H = innerHeight;
        c.width = W * dpr; c.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var n = Math.round(Math.min(42, Math.max(14, (W * H) / 42000)));
        nodes = [];
        for (var i = 0; i < n; i++) nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
          r: Math.random() * 1.3 + .7, ph: Math.random() * 6.28,
          c: Math.random() < .18 ? MINT : COB
        });
        marks = [];
        var mn = W < 700 ? 4 : 8;
        for (var m = 0; m < mn; m++) marks.push({
          x: Math.random() * W, y: Math.random() * H,
          s: 7 + Math.random() * 9, rot: Math.random() * 6.28,
          vr: (Math.random() - .5) * .004,
          vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12,
          a: .10 + Math.random() * .10
        });
        rings = [];
      }
      function frame() {
        requestAnimationFrame(frame);
        if (!vis) return;
        t += .006;
        ctx.clearRect(0, 0, W, H);
        var LINK = Math.min(150, W * .14);
        for (var i = 0; i < nodes.length; i++) {
          var p = nodes[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
          var pulse = .55 + .45 * Math.sin(t * 2.4 + p.ph);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.fillStyle = "rgba(" + p.c + "," + (.22 + .18 * pulse).toFixed(3) + ")";
          ctx.fill();
          for (var j = i + 1; j < nodes.length; j++) {
            var q = nodes[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
            if (d2 < LINK * LINK) {
              var o = (1 - Math.sqrt(d2) / LINK) * .09;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = "rgba(" + COB + "," + o.toFixed(3) + ")";
              ctx.lineWidth = .7; ctx.stroke();
            }
          }
        }
        /* drifting crosshair marks */
        for (var m = 0; m < marks.length; m++) {
          var k = marks[m];
          k.x += k.vx; k.y += k.vy; k.rot += k.vr;
          if (k.x < -30) k.x = W + 30; if (k.x > W + 30) k.x = -30;
          if (k.y < -30) k.y = H + 30; if (k.y > H + 30) k.y = -30;
          ctx.save();
          ctx.translate(k.x, k.y); ctx.rotate(k.rot);
          ctx.strokeStyle = "rgba(" + COB + "," + k.a.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-k.s, 0); ctx.lineTo(k.s, 0);
          ctx.moveTo(0, -k.s); ctx.lineTo(0, k.s);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, k.s * .55, 0, 6.2832);
          ctx.stroke();
          ctx.restore();
        }
        /* occasional survey rings */
        if (rings.length < 2 && Math.random() < .008) {
          var rn = nodes[(Math.random() * nodes.length) | 0];
          rings.push({ x: rn.x, y: rn.y, r: 2 });
        }
        for (var rk = rings.length - 1; rk >= 0; rk--) {
          var R = rings[rk];
          R.r += 1.1;
          var ra = Math.max(0, .20 * (1 - R.r / 90));
          if (ra <= 0) { rings.splice(rk, 1); continue; }
          ctx.beginPath(); ctx.arc(R.x, R.y, R.r, 0, 6.2832);
          ctx.strokeStyle = "rgba(" + COB + "," + ra.toFixed(3) + ")";
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
      addEventListener("resize", size, { passive: true });
      document.addEventListener("visibilitychange", function () { vis = !document.hidden; });
      size(); frame();
    })();

  });
  /* fallback if load already fired */
  if (document.readyState === "complete") document.documentElement.classList.add("loaded");

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- nav burger ---------- */
    var burger = document.querySelector(".nav-burger");
    var links = document.querySelector(".nav-links");
    if (burger && links) {
      function setMenu(open) {
        links.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      }
      burger.setAttribute("aria-expanded", "false");
      burger.addEventListener("click", function (e) {
        e.stopPropagation();
        setMenu(!links.classList.contains("open"));
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { setMenu(false); });
      });
      /* tap outside closes */
      document.addEventListener("click", function (e) {
        if (!links.classList.contains("open")) return;
        if (!links.contains(e.target) && e.target !== burger) setMenu(false);
      });
      /* esc closes */
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setMenu(false);
      });
      /* rotating to desktop resets state */
      addEventListener("resize", function () {
        if (innerWidth > 820) setMenu(false);
      }, { passive: true });
    }

    /* ---------- active nav link ---------- */
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path) a.classList.add("active");
    });

    /* ---------- scroll progress ---------- */
    var bar = document.createElement("div");
    bar.id = "progress";
    document.body.appendChild(bar);
    var ticking = false;
    addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          var h = document.body.scrollHeight - innerHeight;
          bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
          ticking = false;
        });
      }
    }, { passive: true });

    /* ---------- scroll reveals ---------- */
    if ("IntersectionObserver" in window && !RM) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- counters ---------- */
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          cio.unobserve(en.target);
          var el = en.target;
          var m = el.textContent.trim().match(/^(\d+)(.*)$/);
          if (!m) return;
          var end = parseInt(m[1], 10), suf = m[2] || "";
          if (RM) { el.textContent = end + suf; return; }
          var st = performance.now(), dur = 1500;
          (function step(now) {
            var p = Math.min((now - st) / dur, 1);
            var ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * end) + suf;
            if (p < 1) requestAnimationFrame(step);
          })(st);
        });
      }, { threshold: 0.4 });
      document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });
    }

    /* ---------- ticker duplicate for seamless loop ---------- */
    document.querySelectorAll(".ticker-track").forEach(function (track) {
      track.innerHTML += track.innerHTML;
    });

    /* ---------- accordion ---------- */
    document.querySelectorAll(".acc-row").forEach(function (row) {
      var head = row.querySelector(".acc-head");
      var body = row.querySelector(".acc-body");
      if (!head || !body) return;
      head.addEventListener("click", function () {
        var isOpen = row.classList.contains("open");
        /* close siblings */
        row.parentElement.querySelectorAll(".acc-row.open").forEach(function (r) {
          r.classList.remove("open");
          r.querySelector(".acc-body").style.maxHeight = "0px";
        });
        if (!isOpen) {
          row.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });

    /* ---------- case study filters ---------- */
    var filterWrap = document.querySelector(".filters");
    if (filterWrap) {
      filterWrap.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter");
        if (!btn) return;
        filterWrap.querySelectorAll(".filter").forEach(function (f) { f.classList.remove("active"); });
        btn.classList.add("active");
        var tag = btn.dataset.tag;
        document.querySelectorAll("[data-cs-tag]").forEach(function (card) {
          var show = tag === "All" || card.dataset.csTag === tag;
          card.style.display = show ? "" : "none";
        });
      });
    }

    /* ---------- case study modal ---------- */
    var modal = document.getElementById("cs-modal");
    if (modal) {
      document.querySelectorAll("[data-cs]").forEach(function (card) {
        card.addEventListener("click", function () {
          var d = JSON.parse(card.dataset.cs);
          modal.querySelector(".cs-tag").textContent = d.tag;
          modal.querySelector("h3").textContent = d.title;
          modal.querySelector(".client").textContent = d.client + (d.timeline ? " · " + d.timeline : "");
          modal.querySelector(".cs-challenge").textContent = d.challenge || d.summary;
          modal.querySelector(".cs-solution").textContent = d.solution || "";
          modal.querySelector(".cs-solution").parentElement.style.display = d.solution ? "" : "none";
          modal.querySelector(".cs-result").textContent = d.result || "";
          modal.querySelector(".cs-tech").textContent = (d.tech || []).join(" · ");
          var view = modal.querySelector(".cs-view");
          if (d.url) {
            view.style.display = "";
            view.onclick = function (ev) {
              ev.stopPropagation();
              window.open(d.url, "_blank", "noopener,noreferrer");
            };
          } else {
            view.style.display = "none";
          }
          modal.showModal();
        });
      });
      modal.querySelector(".cs-close").addEventListener("click", function () { modal.close(); });
      modal.addEventListener("click", function (e) {
        var r = modal.querySelector(".cs-modal-body").getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
      });
    }

    /* ---------- contact form → WhatsApp ---------- */
    var form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = form.querySelector("[name=name]").value.trim();
        var email = form.querySelector("[name=email]").value.trim();
        var service = form.querySelector("[name=service]").value;
        var msg = form.querySelector("[name=message]").value.trim();
        var text = "Hi Megsolve, I'd like to discuss a project.%0A%0AName: " + encodeURIComponent(name) +
          "%0AEmail: " + encodeURIComponent(email) +
          "%0AService: " + encodeURIComponent(service) +
          "%0A%0A" + encodeURIComponent(msg);
        window.open("https://wa.me/923361993378?text=" + text, "_blank", "noopener,noreferrer");
      });
    }

  });
})();
