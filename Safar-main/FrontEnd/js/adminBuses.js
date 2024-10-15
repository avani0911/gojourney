document.getElementById("busSearchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Generate sample data for buses
    const locations = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune",
        "Kolkata", "Chennai", "Ahmedabad", "Jaipur", "Goa",
        "Agra", "Bhubaneswar", "Surat"
    ];

    const acOptions = [true, false]; // AC or non-AC options
    const priceRange = [400, 1500]; // Updated minimum and maximum price range

    const buses = [];

    // Store the generated prices for all location and timing combinations
    const priceMap = {};  // This will persist generated prices

    // Generate buses for the next 360 days, every hour for all location combinations
    const startDate = new Date();
    for (let dayOffset = 0; dayOffset < 360; dayOffset++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + dayOffset);
        const formattedDate = date.toISOString().split("T")[0];

        locations.forEach(startLocation => {
            locations.forEach(endLocation => {
                if (startLocation !== endLocation) {
                    // Generate buses for different times of the day
                    const times = [
                        { hour: 6, period: 'AM' }, // Morning
                        { hour: 9, period: 'AM' },
                        { hour: 12, period: 'PM' }, // Afternoon
                        { hour: 3, period: 'PM' },
                        { hour: 6, period: 'PM' }, // Evening
                        { hour: 9, period: 'PM' }, // Night
                    ];

                    times.forEach((timeSlot, index) => {
                        const minutes = Math.floor(Math.random() * 60); // Random minute for realism
                        const time = `${String(timeSlot.hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${timeSlot.period}`;
                        const acStatus = acOptions[Math.floor(Math.random() * acOptions.length)];

                        // Generate a unique key for the location and time combination
                        const key = `${startLocation}-${endLocation}-${time}`;

                        // Check if the price for this route and time is already stored in priceMap
                        if (!priceMap[key]) {
                            // If not, generate a price and store it in priceMap
                            const basePrice = Math.floor(Math.random() * (priceRange[1] - priceRange[0] + 1)) + priceRange[0];
                            priceMap[key] = basePrice;  // Store the price for future use
                        }

                        const price = priceMap[key];  // Retrieve the stored price

                        buses.push({
                            name: `Bus ${String.fromCharCode(65 + index)}-${dayOffset}`,
                            time: time,
                            date: formattedDate,
                            startLocation: startLocation,
                            endLocation: endLocation,
                            ac: acStatus,
                            price: price  // Use the stored/generated price
                        });
                    });
                }
            });
        });
    }

    const date = document.getElementById("date").value;
    const startLocation = document.getElementById("startLocation").value;
    const endLocation = document.getElementById("endLocation").value;

    const busList = document.getElementById("busList");
    busList.innerHTML = ""; // Clear previous results

    // Filtering and displaying available buses based on form inputs
    const filteredBuses = buses.filter(bus =>
        bus.date === date &&
        bus.startLocation === startLocation &&
        bus.endLocation === endLocation
    );

    if (filteredBuses.length > 0) {
        filteredBuses.forEach(bus => {
            const li = document.createElement("li");
            li.textContent = `${bus.name} - ${bus.time} | ${bus.startLocation} to ${bus.endLocation} | Price: ₹${bus.price} | AC: ${bus.ac ? 'Yes' : 'No'}`;
            
            // Make the bus item act as a button
            li.style.cursor = "pointer";
            li.addEventListener("click", function() {
                // Redirect to seatSelection.html with bus details as query parameters
                const queryString = `?busName=${encodeURIComponent(bus.name)}&time=${encodeURIComponent(bus.time)}&date=${encodeURIComponent(bus.date)}&startLocation=${encodeURIComponent(bus.startLocation)}&endLocation=${encodeURIComponent(bus.endLocation)}&price=${encodeURIComponent(bus.price)}&ac=${encodeURIComponent(bus.ac)}`;
                window.location.href = `seatSelection.html${queryString}`;
            });
            
            busList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "No buses found for the selected date and locations.";
        busList.appendChild(li);
    }
});
