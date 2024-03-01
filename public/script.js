document.getElementById('fetchButton').addEventListener('click', function() {
    var inputUrl = document.getElementById('urlInput').value;
    var audioLinkContainer = document.getElementById('audioLinkContainer');
    
    if (inputUrl.startsWith('https://www.soundsnap.com/')) {
        audioLinkContainer.innerHTML = '<div class="loader"></div>';

        fetch('/getAudioSource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: inputUrl })
        })
        .then(response => response.json())
        .then(data => {
            if(data.audioSrc) {
                audioLinkContainer.innerHTML = `<a href="${data.audioSrc}" target="_blank" class="audio-button">Download audio</a>`;
            } else {
                audioLinkContainer.innerHTML = 'No audio source found.';
            }
        });
    } else {
        alert('Invalid URL');
    }
});