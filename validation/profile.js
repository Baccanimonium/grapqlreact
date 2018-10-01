import validator from 'validator';
import isEmpty from './is-empty';

export default function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if(validator.isEmpty(data.handle)) {
        errors.handle = 'Handle is required'
    }

    if(!validator.isLength(data.handle, { min: 2, max: 40})) {
        errors.handle = 'Handle needs to be between 2 and 40 characters'
    }

    if(validator.isEmpty(data.status)) {
        errors.status = 'Status field required'
    }
    if(validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field required'
    }
    if(data.website) {
        if(!validator.isURL(data.website)) {
        errors.website = 'Not a valid URL'
        }
    }
    if(data.youtube) {
        if(!validator.isURL(data.youtube)) {
        errors.youtube = 'Not a valid URL'
        }
    }
    if(data.facebook) {
        if(!validator.isURL(data.facebook)) {
        errors.facebook = 'Not a valid URL'
        }
    }
    if(data.twitter) {
        if(!validator.isURL(data.twitter)) {
        errors.twitter = 'Not a valid URL'
        }
    }
    if(data.instagram) {
        if(!validator.isURL(data.instagram)) {
        errors.instagram = 'Not a valid URL'
        }
    }
    if(data.linkedin) {
        if(!validator.isURL(data.linkedin)) {
        errors.linkedin = 'Not a valid URL'
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};