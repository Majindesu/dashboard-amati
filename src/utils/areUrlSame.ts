function areURLsSame(url1: string, url2: string): boolean {
	const normalizeUrl = (url: string) => {
		// Remove query parameters
		url = url.split("?")[0];
		// Ensure there is no trailing slash
		url = url.endsWith("/") ? url.slice(0, -1) : url;
		return url.toLowerCase();
	};

	return normalizeUrl(url1) === normalizeUrl(url2);
}

export default areURLsSame;
