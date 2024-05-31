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
            audioLinkContainer.innerHTML = '';
            const logContainer = document.createElement('div');
            logContainer.className = 'log-container';

            if(data.logs && data.logs.length > 0) {
                data.logs.forEach(log => {
                    const logElement = document.createElement('div');
                    logElement.className = 'log-entry';
                    logElement.textContent = log;
                    logContainer.appendChild(logElement);
                });
            }

            if(data.audioSrc) {
                const audioLink = document.createElement('a');
                audioLink.href = data.audioSrc;
                audioLink.target = '_blank';
                audioLink.className = 'audio-button';
                audioLink.textContent = 'Download audio';
                audioLinkContainer.appendChild(audioLink);
            } else {
                audioLinkContainer.textContent = data.error || 'No audio source found.';
            }

            audioLinkContainer.appendChild(logContainer);
        })
        .catch(error => {
            audioLinkContainer.innerHTML = 'An error occurred.';
            console.error('Error:', error);
        });
    } else {
        alert('Invalid URL');
    }
});
