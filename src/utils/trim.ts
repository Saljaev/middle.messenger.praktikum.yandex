function trim(string: string, chars?: string) {
    if (chars === undefined) {
        return string.trim();
    }

    let start = 0;
    let end = string.length - 1;

    while (start <= end && chars.includes(string[start])) {
        start++;
    }

    while (end >= start && chars.includes(string[end])) {
        end--;
    }

    return string.slice(start, end + 1);
}

export default trim;
