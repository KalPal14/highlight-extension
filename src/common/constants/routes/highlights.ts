export const HIGHLIGHTS_ROUTER_PATH = '/highlights';

export const HIGHLIGHTS_PATH = {
	create: '/highlight',
	update: '/highlight/:id',
	delete: '/highlight/:id',
};

export const HIGHLIGHTS_FULL_PATH = {
	create: HIGHLIGHTS_ROUTER_PATH + HIGHLIGHTS_PATH.create,
	update: HIGHLIGHTS_ROUTER_PATH + HIGHLIGHTS_PATH.update,
	delete: HIGHLIGHTS_ROUTER_PATH + HIGHLIGHTS_PATH.delete,
};
