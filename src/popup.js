document.addEventListener('DOMContentLoaded', () => {
    const rateInput = document.getElementById('rate');
    const statusDiv = document.getElementById('status');

    // Function to fetch conversion rate from API
    function fetchConversionRate() {
        statusDiv.textContent = 'Fetching latest conversion rate...';
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(response => response.json())
            .then(data => {
                const rate = data.rates.BDT;
                rateInput.value = rate.toFixed(2);
                statusDiv.textContent = 'Conversion rate updated.';
                chrome.storage.sync.set({ rate: rate }, () => {
                    console.log('Conversion rate saved:', rate);
                });
            })
            .catch(error => {
                console.error('Error fetching conversion rate:', error);
                statusDiv.textContent = 'Failed to fetch conversion rate.';
            });
    }

    // Update rate button event listener
    document.getElementById('update-rate').addEventListener('click', fetchConversionRate);

    // Form submit event listener to trigger currency conversion
    document.getElementById('converter-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const rate = parseFloat(rateInput.value);

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'convertCurrency',
                rate: rate
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    statusDiv.textContent = `Error converting currency: ${chrome.runtime.lastError.message}`;
                } else {
                    statusDiv.textContent = 'Currency conversion successful.';
                }
            });
        });
    });

    chrome.storage.sync.get('rate', (data) => {
        if (data.rate) {
            rateInput.value = data.rate.toFixed(2);
        } else {
            fetchConversionRate();
        }
    });
});

