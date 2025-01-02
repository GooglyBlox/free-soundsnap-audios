document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const fetchButton = document.getElementById('fetchButton');
    const buttonText = fetchButton.querySelector('.button-text');
    const loader = fetchButton.querySelector('.loader');
    const audioLinkContainer = document.getElementById('audioLinkContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorText = document.getElementById('errorText');

    const showError = (message) => {
        errorText.textContent = message;
        errorContainer.style.display = 'block';
        audioLinkContainer.innerHTML = '';
    };

    const hideError = () => {
        errorContainer.style.display = 'none';
    };

    const setLoading = (isLoading) => {
        fetchButton.disabled = isLoading;
        buttonText.textContent = isLoading ? 'Fetching...' : 'Fetch Audio';
        loader.style.display = isLoading ? 'block' : 'none';
    };

    fetchButton.addEventListener('click', async () => {
        const inputUrl = urlInput.value.trim();
        
        if (!inputUrl.startsWith('https://www.soundsnap.com/')) {
            showError('Please enter a valid Soundsnap URL');
            return;
        }

        hideError();
        setLoading(true);

        try {
            const response = await fetch('/api/getAudioSource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: inputUrl })
            });

            const data = await response.json();

            if (data.audioSrc) {
                const linkHtml = `
                    <a href="${data.audioSrc}" target="_blank" class="audio-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download Audio
                    </a>`;
                audioLinkContainer.innerHTML = linkHtml;
            } else {
                showError('No audio source found.');
            }
        } catch (error) {
            showError('Failed to fetch audio source. Please try again.');
        } finally {
            setLoading(false);
        }
    });
});