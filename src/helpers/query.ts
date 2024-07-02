const parseQueryString = (query: string): Record<string, string> => {
    let params: Record<string, string> = {};
    query.replace(/^\?/, '').split('&').forEach((param: string) => {
        let parts = param.split('=');
        let key = decodeURIComponent(parts[0]);
        let value = decodeURIComponent(parts[1]);
        params[key] = value;
    });
    return params;
}

export default parseQueryString;
