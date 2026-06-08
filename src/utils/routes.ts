export const PUBLIC_ROUTES = ['/', '/sign-up'];

export function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.includes(path);
}
