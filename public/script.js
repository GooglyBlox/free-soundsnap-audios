document.getElementById('fetchButton').addEventListener('click', function() {
    var inputUrl = document.getElementById('urlInput').value;
    var audioLinkContainer = document.getElementById('audioLinkContainer');
    
    if (inputUrl.startsWith('https://www.soundsnap.com/')) {
        // Show loading indicator
        audioLinkContainer.innerHTML = '<div class="loader">Loading...</div>';

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
                // Replace loading indicator with the audio link
                audioLinkContainer.innerHTML = `<a href="${data.audioSrc}" target="_blank" class="audio-button">Go to Audio</a>`;
            } else {
                // Handle no audio source case
                audioLinkContainer.innerHTML = 'No audio source found.';
            }
        });
    } else {
        alert('Invalid URL');
    }
});
