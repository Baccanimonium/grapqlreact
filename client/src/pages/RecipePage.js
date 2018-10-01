import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_RECIPE } from '../queries';

const RecipePage = ({ match: { params: { _id } } }) => {
    return (
        <Query query={GET_RECIPE} variables={{ _id }}>
            {({ data: { getRecipe }, loading, error }) => {
                if (loading) return <div>loading</div>;
                if (error) return <div>Error</div>;
                const { name, category } = getRecipe;
                return (
                    <div>
                        {name}
                        {category}
                    </div>
                )
            }}
        </Query>
    );
};

RecipePage.propTypes = {

};

export default withRouter(RecipePage);
