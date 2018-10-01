import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import { NavBar, Name } from './UiComponents';

const Header = ({ name = null, history }) => {
    const handleSingOut = (client) => {
        localStorage.setItem('token', '');
        client.resetStore();
        history.push('/');
    };
    return (
        <NavBar>
            <Name>{name}</Name>
            <Link to="/">app </Link>
            <Link to="/singin">singin</Link>
            <Link to="/singup">singup</Link>
            <Link to="/search">search</Link>
            <Link to="/profile">profile</Link>
            <Link to="/recipe/add">recipe aad</Link>
            <ApolloConsumer>
                {(client) => {
                    return (
                        <button onClick={() => handleSingOut(client)}>sing out</button>
                    )
                }}
            </ApolloConsumer>
        </NavBar>
    );
};

Header.propTypes = {

};
Header.defaultProps = {
    getCurrentUser: {},
};

export default withRouter(Header);
