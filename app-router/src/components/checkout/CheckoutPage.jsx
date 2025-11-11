'use client';

import { useState } from 'react';

export default function CheckoutPage() {
    const [billingInfo, setBillingInfo] = useState({
        name: '',
        email: '',
        address: '',
    });

    const handleChange = (e) => {
        setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for order placement
        alert('Order placed successfully!');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl mb-2">Order Summary</h2>
                    <p>Item: Research Report</p>
                    <p>Price: $100</p>
                </div>
                <div>
                    <h2 className="text-xl mb-2">Billing Information</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={billingInfo.name}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={billingInfo.email}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                            required
                        />
                        <textarea
                            name="address"
                            placeholder="Address"
                            value={billingInfo.address}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
                            Place Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
