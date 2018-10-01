import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../queries';

import Error from '../components/Error';


const initialState = {
    name: '',
    category: '',
    description: '',
    instructions: '',
};

class AddRecipe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
            username: props.name,
        };
    }

    handleSubmit = (addRecipe, event) => {
        event.preventDefault();
        addRecipe()
            .then(({ data }) => {
                console.log(data)
            });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    updateCashe = (cache, { data: { addRecipe } }) => {
        const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
                getAllRecipes: [addRecipe, ...getAllRecipes]
            }
        })
    };

    render() {
        const { name, category, description, instructions } = this.state;
        return (
            <Mutation
                mutation={ADD_RECIPE}
                variables={{...this.state}}
                refetchQueries={() => [
                    { query: GET_USER_RECIPES, variables: { username: name } }
                ]}
                update={this.updateCashe}
            >
                {(addRecipe, { data, loading, error }) => {
                    return (
                        <div>
                            <h2>AddRecipe</h2>
                            <form onSubmit={(e) => this.handleSubmit(addRecipe, e)}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Recipe Name"
                                    value={name}
                                    onChange={this.handleChange}
                                />
                                <select
                                    name="category"
                                    onChange={this.handleChange}
                                    value={category}
                                >
                                    <option value="BreakFast">BreakFast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="add Description"
                                    onChange={this.handleChange}
                                    value={description}
                                />
                                <textarea
                                    name="instructions"
                                    placeholder="instructions"
                                    onChange={this.handleChange}
                                    value={instructions}
                                />
                                <button disabled={loading} type="submit">submit</button>
                                {error && <Error error={error} />}
                            </form>
                        </div>
                    )
                }}

            </Mutation>
        );
    }
}

AddRecipe.propTypes = {

};

export default AddRecipe;
