// src/components/Rating.jsx

import React from 'react';

/**
 * A reusable component to display a star rating.
 * It uses the new CSS classes from index.css
 */
function Rating({ value, text }) {
    // This creates an array of 5 star icons based on the rating value
    const stars = [1, 2, 3, 4, 5].map((index) => (
        <span key={index}> {/* Use <span> for inline layout */}
            <i 
                className={
                    value >= index
                        ? 'fas fa-star' // Full star
                        : value >= index - 0.5
                        ? 'fas fa-star-half-alt' // Half star
                        : 'far fa-star' // Empty star
                }
            ></i>
        </span>
    ));

    return (
        <div className="rating"> {/* Use CSS class */}
            {stars}
            {/* Show review text like "(10 reviews)" */}
            {text && <span className="rating-text">{text}</span>}
        </div>
    );
}

export default Rating;