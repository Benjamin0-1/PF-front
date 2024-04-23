import React, { useState, useEffect } from "react";

const Donation = () => {
    const [donationAmount, setDonationAmount] = useState(""); // State to store the donation amount

    useEffect(() => {
        // Load PayPal script dynamically
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"; // Replace YOUR_CLIENT_ID with your actual client ID
        script.async = true;
        script.onload = () => {
            // Render PayPal button after script is loaded
            renderPayPalButton();
        };
        document.body.appendChild(script);

        // Clean up function
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const renderPayPalButton = () => {
        window.paypal
            .Buttons({
                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: donationAmount // Dynamic value entered by users
                                }
                            }
                        ]
                    });
                },
                onApprove: Donation.handleApprove
            })
            .render("#paypal");
    };

    const handleApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            console.log(`Transaction completed by: ${details.player.name.given_name}`);
        });
    };

    return <div id="paypal"></div>;
};

export default Donation;
