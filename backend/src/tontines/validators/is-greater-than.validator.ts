import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function IsGreaterThan(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (
        object: object,
        propertyName: string,
    ) {
        registerDecorator({
            name: 'isGreaterThan',

            target: object.constructor,

            propertyName,

            constraints: [property],

            options: validationOptions,

            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;

                    const relatedValue = (args.object as any)[relatedPropertyName];

                    if (
                        value === undefined ||
                        relatedValue === undefined
                    ) {
                        return true;
                    }

                    return Number(value) >= Number(relatedValue);
                },

                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;

                    return `${args.property} doit être supérieur ou égal à ${relatedPropertyName}.`;
                },
            },
        });
    };
}