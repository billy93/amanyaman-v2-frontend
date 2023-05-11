import * as Yup from "yup";
// import { AnyObject } from "yup/lib/types";
// import { FormSection, InputProps } from '../types';
import { forms } from './forms';

// type YupBoolean = Yup.BooleanSchema<boolean | undefined, AnyObject, boolean | undefined>
// type YupString = Yup.StringSchema<string | undefined, AnyObject, string | undefined>
// type YupNumber = Yup.NumberSchema<number | undefined, AnyObject, number | undefined>

const generateValidations = (field) => {

    if (!field.validations) return null

    let schema = Yup[field.typeValue || 'string']()

    for (const rule of field.validations) {
        switch (rule.type) {
            case 'isTrue': schema = (schema).isTrue(rule.message); break;
            case 'isEmail': schema = (schema).email(rule.message); break;
            case 'minLength': schema = (schema).min(rule.value, rule.message); break;
            case 'oneOf': schema = (schema).oneOf([Yup.ref(rule.ref)], rule.message); break;
            default: schema = schema.required(rule.message); break;
        }
    }

    return schema
}


export const getInputs = (section) => {

    let initialValues = {};

    let validationsFields = {};

    for (const field of forms[section]) {

        initialValues[field.name] = field.value;

        if (!field.validations) continue;

        const schema = generateValidations(field)

        validationsFields[field.name] = schema;
    }

    return {
        validationSchema: Yup.object({ ...validationsFields }),
        initialValues: initialValues,
        inputs: forms[section],
    };

};