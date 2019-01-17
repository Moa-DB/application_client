import React from 'react';

/**
 * The global Footer for the application.
 */
const Footer = () => {
    return (
        <div>
            <CopyrightLink />
        </div>
    );
};

const CopyrightLink = () => {
    return (
        <p>
            &copy;
            2019 Moa-DB
        </p>
    );
};

export default Footer;
