import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function IsAfterDate(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (
        object: object,
        propertyName: string,
    ) {
        registerDecorator({
            name: 'isAfterDate',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,

            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;

                    const relatedValue = (args.object as any)[relatedPropertyName];

                    if (!relatedValue || !value) {
                        return true;
                    }

                    return (
                        new Date(value).getTime() >
                        new Date(relatedValue).getTime()
                    );
                },

                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;

                    return `${args.property} doit être postérieure à ${relatedPropertyName}.`;
                },
            },
        });
    };
}