function setupConfetti() {
    var canvas = document.createElement('canvas');
    canvas.style = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999';
    document.body.appendChild(canvas);

    var myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
    
    function shootConfetti() {
        myConfetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors: ['#A17D58', '#FAB3B3', '#FDF1D9', '#FFF8F0']
        });
        myConfetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors: ['#A17D58', '#FAB3B3', '#FDF1D9', '#FFF8F0']
        });
    }

    var brand = document.querySelector('.brand');
    if (brand) {
        brand.style.cursor = 'pointer';
        brand.onclick = shootConfetti;
    }
}

document.addEventListener('DOMContentLoaded', setupConfetti);