const validator = require('validator');
const isEmpty = require('./is-empty');

export default function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if(validator.isEmpty(data.title)) {
        errors.title = 'Job title field required'
    }
    if(validator.isEmpty(data.company)) {
        errors.company = 'Company field required'
    }
    if(validator.isEmpty(data.from)) {
        errors.from = 'From date title field required'
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
};