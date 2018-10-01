import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Query } from 'react-apollo';

import { GET_ALL_RECIPES } from './queries';


const App = (props) => (
    <div>
        <h1>Home</h1>
        <Query query={GET_ALL_RECIPES}>
            {({ data, loading, error }) => {
                if (loading) return <div>Loading</div>;
                if (error) return <div>Error</div>;
                return (
                    data.getAllRecipes.map(recipe => (
                        <div key={recipe._id}>
                            <Link to={`/recipe/${recipe._id}`}>{recipe.name}</Link>
                            <span> {recipe.category}</span>
                        </div>
                    ))
                );
            }}
        </Query>
    </div>
);

App.propTypes = {

};

export default App;
