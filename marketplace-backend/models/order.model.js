// models/order.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the blueprint for an "Order"
const orderSchema = new Schema(
    {
        // 1. User
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        
        // 2. Order Items
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                }
            }
        ],

        // 3. Shipping
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true }
        },

        // 4. Payment
        paymentMethod: {
            type: String,
            required: true,
            default: 'Cash on Delivery'
        },

        // 5. Prices
        itemsPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },

        // 6. Statuses
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },

        // --- NEW FIELDS (Shipped Status) ---
        isShipped: {
            type: Boolean,
            required: true,
            default: false
        },
        shippedAt: {
            type: Date
        },
        // --- NEW FIELDS END ---

        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },

        isCancelled: { type: Boolean, required: true, default: false },
        cancelledAt: { type: Date }
    },
    {
        timestamps: true // Adds 'createdAt' and 'updatedAt'
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;