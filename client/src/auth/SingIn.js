import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { SINGIN_USER } from '../queries';
import Error from '../components/Error';

const initialState = {
    name: '',
    password: '',
};

class SingIn extends Component {
    state = {
        ...initialState,
    };

    clearState = () => {
        this.setState({ ...initialState });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = (singinUser, event) => {
        event.preventDefault();
        singinUser()
            .then(async ({ data }) => {
                localStorage.setItem('token', data.singinUser.token);
                await this.props.refetch();
                this.clearState();
                this.props.history.push('/');
            });
    };

    render() {
        const { name, password } = this.state;
        return (
            <div>
                <h2>Sing In</h2>
                <Mutation mutation={SINGIN_USER} variables={{ name, password }}>
                    {(singinUser, { data, loading, error }) => (
                        <form action="" onSubmit={(e) => this.handleSubmit(singinUser, e)}>
                            <input
                                type="text"
                                name="name"
                                placeholder="username"
                                onChange={this.handleChange}
                                value={name}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                onChange={this.handleChange}
                                value={password}
                            />
                            <button disabled={loading} type="submit">Submit</button>
                            {error && <Error error={error} />}
                        </form>

                    )}
                </Mutation>
            </div>
        );
    }
}

SingIn.propTypes = {};

export default withRouter(SingIn);
