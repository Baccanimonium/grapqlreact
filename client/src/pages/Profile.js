import React from 'react';
import PropTypes from 'prop-types';
import UserRecipes from './userResicpes';

const Profile = ({ name, date, email, favorites }) => {
    const formatedDate = (data) => {
        const newDate = new Date(date).toLocaleDateString('ru');
        const newTime = new Date(date).toLocaleTimeString('ru');
        return `${newDate} at ${newTime}`;
    };

    return (
        <div>
            Propfile
            <div>Name: {name}</div>
            <div>Join Date: {formatedDate(date)}</div>
            <div>Email: {email}</div>
            <ul>
                {favorites.map(({ name }) => (
                    <div>{name}</div>
                ))}
            </ul>
            <UserRecipes name={name}/>
        </div>
    );
};

Profile.propTypes = {

};

export default Profile;
