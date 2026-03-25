window.addEventListener("load", () => {

    const canvas = document.getElementById("network");
    const ctx = canvas.getContext("2d");
    const hero = document.querySelector(".hero");

    let particles = [];
    let mouse = { x: null, y: null };

    // SETTINGS
    function getSettings() {
        const w = hero.offsetWidth;

        return w < 600
            ? { count: 55, dist: 9000, speed: 0.4 }
            : { count: 95, dist: 12000, speed: 0.6 };
    }

    let settings = getSettings();

    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        settings = getSettings();
        init();
    }

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = (Math.random() - 0.5) * settings.speed;
            this.vy = (Math.random() - 0.5) * settings.speed;

            this.size = 2;
        }

        move() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce
            if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

            // 🧲 STÄRKERER MOUSE-EFFEKT (wie ursprünglich)
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const maxDist = 120;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;

                    this.x += dx * force * 0.04;
                    this.y += dy * force * 0.04;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(99,102,241,0.85)";
            ctx.fill();
        }
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy;

                if (dist < settings.dist) {
                    const opacity = 1 - dist / settings.dist;

                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56,189,248,${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < settings.count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
            p.move();
            p.draw();
        }

        connect();
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();
});


// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.card, .step, .price-box').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.01) + "s";
    observer.observe(el);
});

// TRACKING BANNER

function acceptTracking() {
    localStorage.setItem("trackingAccepted", "true");
    document.getElementById("tracking-banner").style.display = "none";
}

window.addEventListener("load", () => {
    if (localStorage.getItem("trackingAccepted")) {
        const banner = document.getElementById("tracking-banner");
        if (banner) banner.style.display = "none";
    }
});
