import {describe, it, expect} from 'vitest';
import trim from './trim';

describe('trim', () => {
    it('should trim whitespace by default', () => {
        expect(trim('  hello  ')).toBe('hello');
    });

    it('should trim custom characters', () => {
        expect(trim('xxhelloxx', 'x')).toBe('hello');
    });

    it('should handle empty string', () => {
        expect(trim('')).toBe('');
    });
});
