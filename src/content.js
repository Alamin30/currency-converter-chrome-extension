chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'convertCurrency') {
        const dollarPriceElements = document.body.querySelectorAll('*:not(script):not(style):not(noscript):not(meta):not(link)');

        dollarPriceElements.forEach(element => {
            if (element.childNodes && element.childNodes.length > 0) {
                element.childNodes.forEach(childNode => {
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        const text = childNode.nodeValue;
                        const regex = /\$([0-9,]+(?:\.[0-9]{1,2})?)/g;
                        let match;
                        let modified = false;

                        while ((match = regex.exec(text)) !== null) {
                            const price = parseFloat(match[1].replace(/,/g, ''));
                            if (!isNaN(price)) {
                                const localPrice = (price * request.rate).toFixed(2);
                                childNode.nodeValue = childNode.nodeValue.replace(match[0], `${localPrice} BDT`);
                                modified = true;
                            }
                        }

                        if (modified) {
                            element.normalize(); // Merge text nodes to avoid duplications
                        }
                    }
                });
            }
        });

        sendResponse({ status: 'Conversion completed' });
    }
});

