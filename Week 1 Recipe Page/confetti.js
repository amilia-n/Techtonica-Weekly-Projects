document.addEventListener('DOMContentLoaded', function() {
    const myCanvas = document.createElement('canvas');
    myCanvas.style.position = 'fixed';
    myCanvas.style.top = '0';
    myCanvas.style.left = '0';
    myCanvas.style.width = '100%';
    myCanvas.style.height = '100%';
    myCanvas.style.pointerEvents = 'none';
    myCanvas.style.zIndex = '999999';
    document.body.appendChild(myCanvas);

    const myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true
    });

    var brandElement = document.querySelector('.brand');
    
    if (brandElement) {
        brandElement.style.cursor = 'pointer';
        
        brandElement.addEventListener('click', function() {
            var duration = 3000;
            var end = Date.now() + duration;
            // Play from left edge
            myConfetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.5 },
                colors: ['#A17D58', '#FAB3B3', '#FDF1D9', '#FFF8F0']
            });
            // Play from right edge
            myConfetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.5 },
                colors: ['#A17D58', '#FAB3B3', '#FDF1D9', '#FFF8F0']
            });
            // Repeat firing
            var interval = setInterval(function() {
                if (Date.now() > end) {
                    return clearInterval(interval);
                }
                //From random positions
                myConfetti({
                    particleCount: 30,
                    angle: 90,
                    spread: 100,
                    origin: { x: Math.random(), y: Math.random() - 0.2 },
                    colors: ['#A17D58', '#FAB3B3', '#FDF1D9', '#FFF8F0']
                });
            }, 200);
        });
    }
});