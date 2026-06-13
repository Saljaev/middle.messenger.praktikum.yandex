function cloneDeep<T extends object = object>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map((item) => cloneDeep(item as any)) as unknown as T;
    }

    if (obj !== null && typeof obj === 'object') {
        const result = {} as Record<string, any>;
        Object.keys(obj).forEach((key) => {
            result[key] = cloneDeep((obj as Record<string, any>)[key]);
        });
        return result as T;
    }

    return obj;
}

export default cloneDeep;
