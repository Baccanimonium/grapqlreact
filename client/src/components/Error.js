import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ error }) => (
    <div>
        {error.message}
    </div>
);

Error.propTypes = {
    error: PropTypes.shape().isRequired,
};

export default Error;
