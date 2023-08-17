type Store = {
	id: String;
	name: String;
	userId: String;
};

const urlAddress = 'http://localhost:3000';
export default async function sitemap() {
	// const stores = await fetch(`${urlAddress}/api/stores`).then(
	// 	(res) => res.json() as Promise<Store[]>
	// );

	// const storeRoutes = stores.map((store: any) => ({
	// 	url: `${urlAddress}/${store.slug}`,
	// 	lastModified: new Date().toISOString(),
	// 	changefreq: 'daily',
	// 	priority: 1,
	// }));

	const staticRoutes = ['', '/sign-in', '/sign-up'].map((route) => ({
		url: `${urlAddress}${route}`,
		lastModified: new Date().toISOString(),
		changefreq: 'daily',
		priority: 0.9,
	}));

	return [...staticRoutes];
}
