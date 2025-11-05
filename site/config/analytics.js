/* ========================================
   ANALYTICS & TRACKING CONFIGURATION
   ======================================== */

/**
 * Configuration object for analytics and tracking
 * Replace placeholder values with actual IDs
 */
const ANALYTICS_CONFIG = {
    // Google Analytics 4
    ga4: {
        enabled: true, // Set to false to disable
        measurementId: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
        config: {
            send_page_view: true,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
        }
    },

    // Facebook Pixel
    facebookPixel: {
        enabled: true, // Set to false to disable
        pixelId: '123456789012345', // Replace with your Facebook Pixel ID
        config: {
            autoConfig: true,
            debug: false
        }
    },

    // Google Tag Manager (Optional - alternative to direct GA4/Pixel)
    gtm: {
        enabled: false, // Set to true if using GTM
        containerId: 'GTM-XXXXXXX' // Replace with your GTM Container ID
    },

    // Google Maps API
    googleMaps: {
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your Maps API Key
        location: {
            lat: -23.550520, // Replace with your actual latitude
            lng: -46.633308, // Replace with your actual longitude
            address: 'Rua Exemplo, 123 - São Paulo, SP'
        },
        mapOptions: {
            zoom: 15,
            mapTypeId: 'roadmap',
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: true
        }
    }
};

/* ========================================
   INITIALIZATION FUNCTIONS
   ======================================== */

/**
 * Initialize Google Analytics 4
 */
function initGA4() {
    if (!ANALYTICS_CONFIG.ga4.enabled) return;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.ga4.measurementId, ANALYTICS_CONFIG.ga4.config);

    console.log('✓ Google Analytics 4 initialized');
}

/**
 * Initialize Facebook Pixel
 */
function initFacebookPixel() {
    if (!ANALYTICS_CONFIG.facebookPixel.enabled) return;

    // Facebook Pixel Code
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', ANALYTICS_CONFIG.facebookPixel.pixelId);
    fbq('track', 'PageView');

    console.log('✓ Facebook Pixel initialized');
}

/**
 * Initialize Google Tag Manager
 */
function initGTM() {
    if (!ANALYTICS_CONFIG.gtm.enabled) return;

    // GTM script
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', ANALYTICS_CONFIG.gtm.containerId);

    console.log('✓ Google Tag Manager initialized');
}

/**
 * Initialize Google Maps
 */
function initGoogleMaps(mapElementId = 'map') {
    if (!ANALYTICS_CONFIG.googleMaps.apiKey) {
        console.warn('Google Maps API key not configured');
        return;
    }

    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) {
        console.warn(`Map element #${mapElementId} not found`);
        return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${ANALYTICS_CONFIG.googleMaps.apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize map callback
    window.initMap = function() {
        const location = ANALYTICS_CONFIG.googleMaps.location;

        const map = new google.maps.Map(mapElement, {
            center: { lat: location.lat, lng: location.lng },
            ...ANALYTICS_CONFIG.googleMaps.mapOptions
        });

        // Add marker
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: 'Toldo Vela',
            animation: google.maps.Animation.DROP
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 10px 0;">Toldo Vela</h3>
                    <p style="margin: 0;">${location.address}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        console.log('✓ Google Maps initialized');
    };
}

/* ========================================
   AUTO-INITIALIZATION
   ======================================== */

// Initialize all enabled services when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initGA4();
        initFacebookPixel();
        initGTM();
    });
} else {
    initGA4();
    initFacebookPixel();
    initGTM();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ANALYTICS_CONFIG,
        initGA4,
        initFacebookPixel,
        initGTM,
        initGoogleMaps
    };
}
