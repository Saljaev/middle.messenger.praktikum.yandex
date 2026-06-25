import {describe, it, expect} from 'vitest';
import {
    firstNameValidator,
    loginValidator,
    emailValidator,
    passwordValidator,
    phoneValidator,
    messageValidator,
    composeValidators,
} from './validation';

describe('validation', () => {
    describe('firstNameValidator', () => {
        it('should pass valid names', () => {
            expect(firstNameValidator('Ivan')).toBeNull();
            expect(firstNameValidator('Иван')).toBeNull();
            expect(firstNameValidator('Anna-Maria')).toBeNull();
        });

        it('should fail invalid names', () => {
            expect(firstNameValidator('ivan')).not.toBeNull();
            expect(firstNameValidator('')).not.toBeNull();
            expect(firstNameValidator('123')).not.toBeNull();
        });
    });

    describe('loginValidator', () => {
        it('should pass valid logins', () => {
            expect(loginValidator('user_name')).toBeNull();
            expect(loginValidator('user123')).toBeNull();
            expect(loginValidator('abc')).toBeNull();
        });

        it('should fail invalid logins', () => {
            expect(loginValidator('us')).not.toBeNull();
            expect(loginValidator('123')).not.toBeNull();
            expect(loginValidator('')).not.toBeNull();
        });
    });

    describe('emailValidator', () => {
        it('should pass valid emails', () => {
            expect(emailValidator('test@example.com')).toBeNull();
            expect(emailValidator('a@b.co')).toBeNull();
        });

        it('should fail invalid emails', () => {
            expect(emailValidator('test@')).not.toBeNull();
            expect(emailValidator('test.com')).not.toBeNull();
            expect(emailValidator('')).not.toBeNull();
        });
    });

    describe('passwordValidator', () => {
        it('should pass valid passwords', () => {
            expect(passwordValidator('Password1')).toBeNull();
            expect(passwordValidator('A1bbbbbb')).toBeNull();
        });

        it('should fail invalid passwords', () => {
            expect(passwordValidator('password1')).not.toBeNull();
            expect(passwordValidator('Password')).not.toBeNull();
            expect(passwordValidator('short1')).not.toBeNull();
        });
    });

    describe('phoneValidator', () => {
        it('should pass valid phones', () => {
            expect(phoneValidator('+79990001122')).toBeNull();
            expect(phoneValidator('89990001122')).toBeNull();
        });

        it('should fail invalid phones', () => {
            expect(phoneValidator('123')).not.toBeNull();
            expect(phoneValidator('abc')).not.toBeNull();
        });
    });

    describe('messageValidator', () => {
        it('should pass non-empty messages', () => {
            expect(messageValidator('Hello')).toBeNull();
            expect(messageValidator('  a  ')).toBeNull();
        });

        it('should fail empty messages', () => {
            expect(messageValidator('')).not.toBeNull();
            expect(messageValidator('   ')).not.toBeNull();
        });
    });

    describe('composeValidators', () => {
        it('should return first error', () => {
            const v1 = (value: string) => (value.length < 3 ? 'too short' : null);
            const v2 = (value: string) => (value.length > 5 ? 'too long' : null);
            const composed = composeValidators(v1, v2);

            expect(composed('ab')).toBe('too short');
            expect(composed('abcdef')).toBe('too long');
            expect(composed('abcd')).toBeNull();
        });
    });
});
