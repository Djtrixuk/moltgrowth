(() => {
  const canvas = document.querySelector(".bg-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      const dots = Math.floor((width * height) / 8000);
      for (let i = 0; i < dots; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const alpha = Math.random() * 0.3 + 0.05;
        ctx.fillStyle = `rgba(0, 255, 180, ${alpha})`;
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    };
    draw();
    window.addEventListener("resize", draw);
  }

  const toggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("is-open");
    });
  }

  const initGalleryFilters = () => {
    const buttons = [...document.querySelectorAll("[data-filter]")];
    const items = [...document.querySelectorAll("[data-tags]")];
    if (!buttons.length || !items.length) {
      return;
    }
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        items.forEach((item) => {
          const tags = item.dataset.tags.split(" ");
          const matches = filter === "all" || tags.includes(filter);
          item.style.display = matches ? "block" : "none";
        });
      });
    });
  };

  const initRarityChecker = () => {
    const form = document.querySelector("[data-rarity-form]");
    const input = document.querySelector("[data-rarity-input]");
    const result = document.querySelector("[data-rarity-result]");
    const samples = [...document.querySelectorAll("[data-sample-id]")];
    if (!form || !input || !result) {
      return;
    }

    const tiers = [
      { name: "Legendary", range: [0, 100], color: "#ff00ff" },
      { name: "Epic", range: [101, 500], color: "#a855f7" },
      { name: "Rare", range: [501, 1500], color: "#00ffff" },
      { name: "Uncommon", range: [1501, 4000], color: "#4488ff" },
      { name: "Common", range: [4001, 9999], color: "#8888aa" },
    ];

    const traits = {
      head: ["Crab", "Lobster", "Shrimp", "Mantis", "Sentinel", "Drone"],
      shell: ["Ocean Blue", "Deep Red", "Coral Pink", "Obsidian", "Chrome"],
      eyes: ["Round", "Scanner", "Visor", "LED Red", "Void"],
      accessory: ["None", "Helmet", "Crown", "Bandana", "Antenna"],
    };

    const pick = (list, seed) => list[seed % list.length];

    const render = (id) => {
      if (Number.isNaN(id) || id < 0 || id > 9999) {
        result.innerHTML =
          "<strong>Invalid token.</strong> Enter an ID between 0 and 9999 to scan traits.";
        return;
      }
      const tier = tiers.find((t) => id >= t.range[0] && id <= t.range[1]) || tiers[4];
      const seed = (id * 9301 + 49297) % 233280;
      const score = (10000 - id) + (seed % 500);
      const faction = id % 5 === 0 ? "Terminal-Born" : "Crustacean";
      result.innerHTML = `
        <div><strong>Shellborn #${id.toString().padStart(4, "0")}</strong></div>
        <div>Rarity Tier: <span style="color:${tier.color}">${tier.name}</span></div>
        <div>Rarity Score: ${score}</div>
        <div>Faction: ${faction}</div>
        <div>Head: ${pick(traits.head, seed)}</div>
        <div>Shell: ${pick(traits.shell, seed + 3)}</div>
        <div>Eyes: ${pick(traits.eyes, seed + 7)}</div>
        <div>Accessory: ${pick(traits.accessory, seed + 11)}</div>
      `;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = Number.parseInt(input.value, 10);
      render(id);
    });

    samples.forEach((button) => {
      button.addEventListener("click", () => {
        input.value = button.dataset.sampleId;
        render(Number.parseInt(button.dataset.sampleId, 10));
      });
    });

    render(42);
  };

  initGalleryFilters();
  initRarityChecker();
})();
