import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER } from '../queries';

const UserRecipes = ({ name }) => {
    const handleDelete = deleteUserRecipe => {
        const confirmDelete = window.confirm('delete recipe?');
        if (confirmDelete) {
            deleteUserRecipe()
                .then(({ data }) => {
                    console.log(data)
            })
        }
    }
    return (
        <div>
            <h6>User recipes</h6>
            <Query query={GET_USER_RECIPES} variables={{ username: name }}>
                {({ data, loading, error }) => {
                    if(loading) return <div>Loading</div>;
                    if(error) return <div>error</div>;
                    return (
                        <div>
                            <h3>ur recipe</h3>
                            <ul>
                                {data.getUserRecipes.map(({name: recipeName, likes, _id}, i) => (
                                    <li key={i}>
                                        <div>{recipeName}</div>
                                        <div>{likes}</div>
                                        <Mutation
                                            mutation={DELETE_USER_RECIPE}
                                            variables={{ _id }}
                                            refetchQueries={() => [
                                                { query: GET_ALL_RECIPES },
                                                { query: GET_CURRENT_USER }
                                            ]}
                                            update={(cache, { data: { deleteUserRecipe: { _id } }}) => {
                                                const { getUserRecipes } = cache.readQuery({
                                                    query: GET_USER_RECIPES,
                                                    variables: { username: name },
                                                });
                                                cache.writeQuery({
                                                    query: GET_USER_RECIPES,
                                                    variables: { username: name },
                                                    data: {
                                                        getUserRecipes: getUserRecipes.filter(
                                                            recipe => recipe._id !== _id
                                                        )
                                                    }
                                                })
                                            }}
                                        >
                                            {(deleteUserRecipe, attrs = {}) => {
                                                return (
                                                    <button
                                                        onClick={() => handleDelete(deleteUserRecipe)}
                                                    >{attrs.loading ? 'deleting' : 'X'}</button>
                                                )
                                            }}
                                        </Mutation>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    )
                }}
            </Query>
        </div>
    );
};

UserRecipes.propTypes = {

};

export default UserRecipes;
