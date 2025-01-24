function toggleGif() {
    var img = document.getElementById('clickableImage');
    img.src = 'Footer.gif';
    setTimeout(function() {
        img.src = 'static.png';
    }, 3000);
}

document.getElementById('clickableImage').onclick = toggleGif;