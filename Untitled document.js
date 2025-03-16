document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const quoteForm = document.getElementById('quote-form');
    const petCountInput = document.getElementById('petCount');
    const pickupAddressInput = document.getElementById('pickupAddress');
    const dropoffAddressInput = document.getElementById('dropoffAddress');
    const serviceTypeInputs = document.querySelectorAll('input[name="serviceType"]');
    
    // Initialize result elements
    const distanceElement = document.getElementById('distance');
    const transportCostElement = document.getElementById('transportCost');
    const handlingFeesElement = document.getElementById('handlingFees');
    const totalCostElement = document.getElementById('totalCost');
    
    // Initialize Google Places Autocomplete
    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupAddressInput);
    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffAddressInput);
    
    // Initialize Distance Matrix Service
    const distanceService = new google.maps.DistanceMatrixService();
    
    // Pricing constants
    const SHUTTLE_RATE = 0.75; // per mile per pet
    const PRIVATE_RATE = 1.50; // per mile per pet
    const HANDLING_FEE = 300; // per pet
    
    // Function to calculate and update the quote
    function updateQuote() {
        const petCount = parseInt(petCountInput.value) || 1;
        const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
        const pickup = pickupAddressInput.value;
        const dropoff = dropoffAddressInput.value;
        
        // Only calculate if both addresses are provided
        if (pickup && dropoff) {
            distanceService.getDistanceMatrix(
                {
                    origins: [pickup],
                    destinations: [dropoff],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.IMPERIAL
                },
                (response, status) => {
                    if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                        // Get distance in miles
                        const distanceText = response.rows[0].elements[0].distance.text;
                        const distanceValue = parseFloat(distanceText.replace(/,/g, '').replace(/\s*mi\s*/, ''));
                        
                        // Update distance display
                        distanceElement.textContent = distanceValue.toFixed(0);
                        
                        // Calculate costs
                        const ratePerMile = serviceType === 'shuttle' ? SHUTTLE_RATE : PRIVATE_RATE;
                        const transportCost = distanceValue * ratePerMile * petCount;
                        const handlingFees = HANDLING_FEE * petCount;
                        const totalCost = transportCost + handlingFees;
                        
                        // Update cost displays
                        transportCostElement.textContent = transportCost.toFixed(2);
                        handlingFeesElement.textContent = handlingFees.toFixed(2);
                        totalCostElement.textContent = totalCost.toFixed(2);
                    } else {
                        // Handle errors or invalid responses
                        distanceElement.textContent = 'Error';
                        transportCostElement.textContent = '0.00';
                        handlingFeesElement.textContent = '0.00';
                        totalCostElement.textContent = '0.00';
                    }
                }
            );
        }
    }
    
    // Add event listeners for real-time updates
    petCountInput.addEventListener('input', updateQuote);
    pickupAddressInput.addEventListener('change', updateQuote);
    dropoffAddressInput.addEventListener('change', updateQuote);
    serviceTypeInputs.forEach(input => {
        input.addEventListener('change', updateQuote);
    });
    
    // Also update when Google Places autocomplete changes
    pickupAutocomplete.addListener('place_changed', updateQuote);
    dropoffAutocomplete.addListener('place_changed', updateQuote);
    
    // Handle form submission
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data to a server
        // For this example, we'll just show an alert
        alert('Thank you for your request! We will contact you shortly to confirm your pet transportation details.');
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('show');
            this.classList.toggle('active');
        });
    }
});