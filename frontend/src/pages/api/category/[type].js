// pages/api/category/[type].js
import { BASE_URL } from "../../../../config";

export default async function handler(req, res) {
    const { type } = req.query;
    
    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
        
        const response = await fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${type}`, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch category data`);
        }
        
        const data = await response.json();
        
        if (data?.status === 200) {
            res.status(200).json(data.data);
        } else {
            res.status(404).json({ error: 'Category data not found' });
        }
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch category data' });
    }
}
