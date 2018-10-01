import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import { SEARCH_RECIPES} from '../../queries';

class Search extends Component {
    state = {
        searchResults: [],
    };

    handleChange = ({ searchRecipes }) => {
        this.setState({
            searchResults: searchRecipes,
        });
    };

    render() {
        const { searchResults } = this.state;
        return (
            <ApolloConsumer>
                {(client) => {
                    return (
                        <div>
                            <input
                                type="search"
                                onChange={async (e) => {
                                    e.persist();
                                    const { data } = await client.query({
                                        query: SEARCH_RECIPES,
                                        variables: { searchTerm: e.target.value },
                                    });
                                    console.log(data)
                                    this.handleChange(data);
                                }}
                            />
                            <ul>
                                {searchResults.map(recipe => (
                                    <li key={recipe._id}>
                                        <Link to={`/recipes/${recipe._id}`}><h4>{recipe.name}</h4></Link>
                                        <div>Likes: {recipe.likes}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }}
            </ApolloConsumer>
        );
    }
}

Search.propTypes = {

};

export default Search;
