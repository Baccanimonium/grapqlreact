const validator = require('validator');
const isEmpty = require('./is-empty');

export default function validateExperienceInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if(validator.isEmpty(data.school)) {
        errors.school = 'Schoold field required'
    }
    if(validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field required'
    }
    if(validator.isEmpty(data.fieldOfStudy)) {
        errors.fieldOfStudy = 'FieldOfStudy title field required'
    }
    if(validator.isEmpty(data.from)) {
        errors.from = 'From date title field required'
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
};