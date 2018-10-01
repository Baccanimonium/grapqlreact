import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { SINGUP_USER } from '../queries';
import Error from '../components/Error';

const initialState = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
};
class SingUp extends Component {
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

    handleSubmit = (singupUser, event) => {
        event.preventDefault();
        singupUser()
            .then(({ data }) => {
                localStorage.setItem('token', data.singupUser.token);
                this.clearState();
            });
    };

    render() {
        const { name, email, password, passwordConfirmation } = this.state;
        return (
            <div>
                <h2>SingUp</h2>
                <Mutation mutation={SINGUP_USER} variables={{ name, email, password }}>
                    {(singupUser, { data, loading, error }) => (
                        <form action="" onSubmit={(e) => this.handleSubmit(singupUser, e)}>
                            <input
                                type="text"
                                name="name"
                                placeholder="username"
                                onChange={this.handleChange}
                                value={name}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="email"
                                onChange={this.handleChange}
                                value={email}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                onChange={this.handleChange}
                                value={password}
                            />
                            <input
                                type="password"
                                name="passwordConfirmation"
                                placeholder="passwordConfirmation"
                                onChange={this.handleChange}
                                value={passwordConfirmation}
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

SingUp.propTypes = {};

export default SingUp;
