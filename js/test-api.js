// Wait for Google Maps API to load
function testGooglePlacesAPI() {
    // Ensure Google Maps API is loaded
    if (!window.google || !window.google.maps) {
        console.error('Google Maps API not loaded');
        return;
    }

    console.log('Starting Places API test...');
    
    // Create a map element
    const mapDiv = document.createElement('div');
    document.body.appendChild(mapDiv);
    
    const service = new google.maps.places.PlacesService(mapDiv);
    
    const request = {
        placeId: 'ChIJkbhytOT5PzsRaPa_AnDL3bA',
        fields: ['name', 'rating', 'reviews', 'formatted_address']
    };

    service.getDetails(request, (place, status) => {
        console.log('API Response Status:', status);
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log('Place Details:', place);
        } else {
            console.error('Error fetching place details:', status);
        }
        
        // Clean up
        document.body.removeChild(mapDiv);
    });
}

// Don't auto-execute the test - wait for callback
if (window.google && window.google.maps) {
    testGooglePlacesAPI();
}