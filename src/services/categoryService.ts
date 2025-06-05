import { unstable_cache } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import Category from '@/models/Category'

export const getCategories = unstable_cache(
	async () => {
		await dbConnect()
		const categories = await Category.find({});
		return categories.map(c => c.toObject())
	},
	['categories'],
	{
		tags: ['categories']
	}
)