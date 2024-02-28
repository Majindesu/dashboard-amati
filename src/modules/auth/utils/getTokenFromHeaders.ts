export default function getTokenFromHeaders(headers: Headers) {
    const authorizationHeader = headers.get('authorization');
    if (authorizationHeader) {
        const parts = authorizationHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        }
    }
    return null;
}
