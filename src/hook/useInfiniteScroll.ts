import { useEffect, useRef, useState, useCallback } from "react";

type LoadFunction<T> = (params: { page: number }) => Promise<{
	success: boolean;
	data: T[];
	hasNext: boolean;
}>;

export function useInfiniteScroll<T>(
	loadFn: LoadFunction<T>,
	initialItems: { hasNext: boolean; data: T[] } = { hasNext: false, data: [] }
) {
	const [items, setItems] = useState<T[]>(initialItems.data);
	const [page, setPage] = useState(2);
	const [hasNext, setHasNext] = useState(initialItems.hasNext);
	const [loading, setLoading] = useState(false);
	const loaderRef = useRef(null);
	const loadingRef = useRef(false);

	const appendItem = useCallback((newItem: T) => {
		setItems((prev) => [newItem, ...prev]);
	}, []);

	const fetchMore = useCallback(async () => {
		if (loadingRef.current || !hasNext) return;
		loadingRef.current = true;
		setLoading(true);
		try {
			const res = await loadFn({ page });
			if (res && res.success) {
				setItems((prev) => [...prev, ...res.data]);
				setHasNext(res.hasNext);
				setPage((p) => p + 1);
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
		loadingRef.current = false;
	}, [loadFn, hasNext, page]);

	useEffect(() => {
		if (!loaderRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				fetchMore();
			}
		});

		observer.observe(loaderRef.current);
		return () => observer.disconnect();
	}, [fetchMore]);

	return { items, loaderRef, loading, appendItem };
}
