function queryStringify(data: Record<string, any>): string | never {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('input must be an object');
    }

    const result: string[] = [];

    function encode(obj: any, prefix: string = ''): void {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                encode(item, `${prefix}[${index}]`);
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach((key) => {
                const newPrefix = prefix ? `${prefix}[${key}]` : key;
                encode(obj[key], newPrefix);
            });
        } else {
            result.push(`${prefix}=${String(obj)}`);
        }
    }

    encode(data);

    return result.join('&');
}

export default queryStringify;
