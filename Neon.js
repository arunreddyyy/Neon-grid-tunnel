(function () {
    const canvass = doucument.getElementById('tunnel');
    const ctx = canvas.getContext('2d');
    const panel = document.getElementById('panel');

    let W, H, DPR, cx, cy;

    function resize(){
        DPR = Math.min(window.devicePixelRation || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;

        canvas.width = W * DPR;
        canvas.height = H * DPR;

        ctx.setTransform(DPR, 0 ,0,DPR,0,0)

        cx =W / 2;
        cy = H / 2;

        buildStars();
    }

    
    const palettes = [
        {
            name:'Miami',
            sky1:'#1a0a2e',
            sky2:'#3a0f4f',
            grid:'#00fff2',
            gridAlt:'#ff6ec7',
            suntop:'#ffe37a',
            sunMid:'#ff6ec7',
            sunbottom:'#7b2ff7',
            beam:'#ff6ec7',
        },
        {
            name: 'Dusk',
            sky1:'#050318',
            sky2:'#1c1140',
            grid:'#5ad1ff',
            gridAlt:'#a06bff',
            sunTop:'#ffd27a',
            sunMid:'#ff7a7a',
            sunBottom:'#6a3fd6',
            beam:'#8fb8ff',
        },
        {
            name:'Cyber',
            sky1:'#020a08',
            sky2:'#07231c',
            grid:'#39ff9e',
            gridAlt:'#ff2fd0',
            sunTop:'#c8ffef',
            sunMid:'#39ffd0',
            sunBottom:'#7b2ff7',
            beam:'#39ff9e',
        },
        {
            name:'Ember',
            sky1:'#100304',
            sky2:'#33070a',
            grid:'#ffb04c',
            gridAlt:'#ff4c4c',
            sunTop:'#fff2bc',
            sunMid:'#ff8a4c',
            sunBottom:'#a8102a',
            beam:'#ffb04c',
        }
    ];

    let paletteIndex = 0;
     
    function palette() {
        return palettes[paletteIndex];
    }

    palettes.forEach((p, i) => {
        const b = document.createElement('button');

        b.className = 'swatch' + (i === paletteIndex ? ' active' : '');

        b.style.background = 'linear-gradient(145deg, ${p.sunMid}, ${p.grid})';

        b.tittle = p.name;

        b.addEventListener('click', () => {
            paletteIndex = i;

            document.querySelectorAll('.swatch').forEach((s,si) => 
            s.classList.toggle('active', si === i)
        );
        });

        panel.appendChild(b);
    });

    let stars = [];

    function buildStars() {
        stars = [];

        const count = Math.floor((W * H) / 12000);

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.1 + 0.2,
                tx: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.7
            });
        }
    }

    let scrollOffset = 0;
    let baseSpeed = 0.22;
    let boost = 0;
    let mouseX = 0.5, mouseY = 0.5;
    let camX = 0, camY = 0;
    let time = 0;
    let flash = 0;

    widow.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / W - 0.5) * 2;
        mouseY = (e.clientY / H - 0.5) * 2;
    });

    window.addEvetListener(
        'touchmove', 
        (e) => {
            if (e.touches[0]) {
                mouseX = (e.touches[0].clientX / W - 0.5) * 2;
                mouseY = (e.touches[0].clientY / h - 0.5) * 2;
            }
        },
        {passive : true}
    );

    canvas.addEventListener('click', () => {
        boost = 1;
        flash = 1;
    });

    function drawSky() {
        const p = palette();

        const grad = cyx.createLinearGradient(0,0,0,H);

        grad.addColorStop(0, p.sky1);
        grad,addColorStop(0.5, p.sky2);
        grad.addColorStop(1,p.sky1);

        ctx.fillStyle = grad;
        ctx.fillReact(0,0,W,H);
    }

    function drawStars() {
        stars.forEach(s => {
            s.tw += 0.02 * s.speed;

            const a = 0.3 + math.sin(s.tw) * 0.35;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

            ctx.fillStyle = 'rgba(242,240,255,${Math.max(a,0)})';

            ctx.fill();

        });
    }

    function drawSun(vpX, vpY) {
        const pulse = 
        1 + Math.sin(time * 1.4) * 0.03 + boost * 0.08;

        const radius = 
        Math.min(W,H) * 0.16 * pulse;

        ctx.save();

        const save();

        const glow = ctx.createRadialGradient(
            vpX,
            vpY,
            radius * 0.2,
            vpX,
            vpY,
            radius * 2.2
        );

        glow.addColorStop(0, p.sunMid + 'aa');
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = glow;

        ctx.fillRect(
            vpX - radius * 2.5,
            vpY - radius * 2.5,
            radius * 5,
            radius * 5
        );

        ctx.beginPath();
        ctx.arc(vpX,vpY,radius,0, Math.PI * 2);
        ctx.clip();

        const bodyGrad = ctx.createLineargradient(
            vpX,
            vpY - radius,
            vpX,
            vpY + radius
        );

        ctx.globalCompositeOperation = 'desitination-out';

        let sy = vpY - radius * 0.05;
        let gap = radius * 0.06;

        while (sy < vpY + radius * 0.05) {
            const stripeH = gap * 0.55;

            ctx.fillStyle = 'rgba(0,0,0,0.9)';

            ctx.fillRect(
                vpX - radius,
                sy,
                radius * 2,
                stripeH
            );

            sy += gap;
            gap *= 1.18;
        }

        ctx.globalCompositeOperation = 'source-over';

        ctx.restore();
    }

    function drawscanBeams(vpX,vpY) {
        const p = palette();

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const beamCount = 3;

        for (let i =0 ; i < beamCount; i++){
            const angle = 
            time * (0.025 + i * 0.007) + i * (Math.PI * 2/beamCount);

            const len = Math.max(W,H) * 0.9;

            const spread = 0.11 + boost * 0.05;

            const x1 = 
            vpX + Math.cos(angle - spread) * len;

            const y1 = 
            vpY + Math.sin(angle - spread) * len;

            const x2 = 
            vpX + Math.cos(angle + spread) * len;

            const y2=
            vpY + Math.sin(angle + spread) * len;

            ctx.beginPath();
             
            ctx.moveTo(vpX,vpY);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);

            ctx.closePath();

            const beamGrad = ctx.createradialGradient(
                vpX,
                vpY,
                0,
                vpX,
                vpY,
                length
            );

            beamGrad.addColorStop(0, p.beam + '33');
            beamGrad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = beamGrad;

            ctx.fill();
        }

        ctx.restore();
    }

    function drawGrid(vpX, vpY) {
        const p = palette();

        const speed = baseSpeed + boost * 0.9;

        scrollOffset = 
        (scrollOffset + speed * 0.01) % 1;

        const halfW = W * 0.85;

        const numH = 26;
        const numV = 22;

        ctx.save();

        ctx.lineWidth = 1;

        for (let dir = -1; dir <= 1; dir += 2) {
            const maxExtent = 
            dir === 1
            ? (H - vpY)
            : vpY;

            for (let i = 0; i < numH; i++){
                let z = (i / numH + scrollOffset) % 1;

                const y = 
                vpY + dir * maxExtent * z * z;

                const alpha = 
                Math.min(1, z * 1.6) * (1 - z * 0.15);

                const lineW = 
                W - (W - halfW * 2) * (1 - z);

                ctx.beginPath();

                ctx.moveTo(
                    vpX - (halfW * z),
                    y
                );

            }
        }
    }
})