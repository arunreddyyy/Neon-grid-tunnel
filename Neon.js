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
        'touchmove', (e) => {
            if (e.touches[0]) {
                mouseX = (e.touches[0].clientX / W - 0.5) * 2;
                mouseY = (e.touches[0].clientY / h - 0.5) * 2;
            }
        },
    );
})