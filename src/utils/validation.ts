export interface InputValidator {
    pattern: RegExp;
    message: string;
}

export function createValidator(validator: InputValidator): (value: string) => string | null {
    return (value: string) => {
        if (!validator.pattern.test(value)) {
            return validator.message;
        }
        return null;
    };
}

export const firstNameValidator = createValidator({
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яё-]*$/,
    message: 'Первая буква должна быть заглавной. Разрешается латиница или кириллица',
});

export const secondNameValidator = createValidator({
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яё-]*$/,
    message: 'Первая буква должна быть заглавной. Разрешается латиница или кириллица',
});

export const loginValidator = createValidator({
    pattern: /^(?![0-9]+$)[a-zA-Z0-9_-]{3,20}$/,
    message:
        'Логин должен состоять из 3–20 символов. Разрешено использовать: латиницу, цифры, -, _',
});

export const emailValidator = createValidator({
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/,
    message: 'Некорректный email',
});

export const passwordValidator = createValidator({
    pattern: /^(?=.*[A-Z])(?=.*\d)\S{8,40}$/,
    message:
        'Пароль должен состоять из 8–40 символов. Содержать в себе минимум одну заглавная буква и цифру',
});

export const phoneValidator = createValidator({
    pattern: /^\+?[0-9]{10,15}$/,
    message:
        'Номер теелфона должен состоять из 10–15 символов, только из цифр. Разрешно использовать "+" в начале',
});

export const messageValidator = createValidator({
    pattern: /^(?!\s*$).+/,
    message: 'Не должно быть пустым',
});

export function composeValidators(
    ...validators: Array<(value: string) => string | null>
): (value: string) => string | null {
    return (value: string) => {
        for (const validator of validators) {
            const error = validator(value);
            if (error) {
                return error;
            }
        }
        return null;
    };
}
