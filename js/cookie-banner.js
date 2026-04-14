(function () {
    'use strict';

    var STORAGE_KEY = 'hb_cookie_consent';

    // Don't show the banner if the user has already made a choice
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Build the banner HTML
    var banner = document.createElement('div');
    banner.id = 'hb-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
        '<div class="hb-cookie-text">' +
            '<p>We use cookies to improve your experience and analyse site traffic. By clicking "Accept", you consent to our use of cookies. Read our <a href="privacy-policy.html">Privacy Policy</a> for more information.</p>' +
        '</div>' +
        '<div class="hb-cookie-actions">' +
            '<button class="hb-cookie-decline" id="hbCookieDecline">Decline</button>' +
            '<button class="hb-cookie-accept" id="hbCookieAccept">Accept</button>' +
        '</div>';

    document.body.appendChild(banner);

    // Slide in after a short delay
    setTimeout(function () {
        banner.classList.add('hb-cookie-visible');
    }, 600);

    function dismiss(choice) {
        localStorage.setItem(STORAGE_KEY, choice);
        banner.classList.remove('hb-cookie-visible');
        setTimeout(function () {
            if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 450);
    }

    document.getElementById('hbCookieAccept').addEventListener('click', function () {
        dismiss('accepted');
    });

    document.getElementById('hbCookieDecline').addEventListener('click', function () {
        dismiss('declined');
    });
})();
