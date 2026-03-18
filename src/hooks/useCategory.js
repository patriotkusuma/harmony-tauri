import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'services/axios-instance';

const CATEGORY_QUERY_KEY = ['categories'];
const CACHE_KEY_LOCAL = 'harmony_categories_cache';

const fetchCategories = async ({ queryKey }) => {
    const [_key, searchValue, headers] = queryKey;
    const res = await axios.get('api/category-packet', {
        headers,
        params: { search: searchValue }
    });
    
    // Backup to local storage for offline/fast-load fallback
    if (res.data.data && !searchValue) {
        localStorage.setItem(CACHE_KEY_LOCAL, JSON.stringify(res.data.data));
    }
    
    return res.data.data;
};

const useCategory = (authenticated) => {
    const [searchValue, setSearchValue] = useState('');
    const [timer, setTimer] = useState(null);
    const queryClient = useQueryClient();

    const headers = useMemo(() => ({
        Authorization: `${authenticated}`,
        "Content-Type": "Application/json"
    }), [authenticated]);

    // Use React Query for caching and sync
    const { 
        data: category, 
        isLoading, 
        isError, 
        refetch 
    } = useQuery({
        queryKey: [CATEGORY_QUERY_KEY[0], searchValue, headers],
        queryFn: fetchCategories,
        enabled: !!authenticated,
        staleTime: 10 * 60 * 1000, // 10 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
        // Fallback to local storage if API is slow/down
        initialData: () => {
            if (!searchValue) {
                const cached = localStorage.getItem(CACHE_KEY_LOCAL);
                return cached ? JSON.parse(cached) : undefined;
            }
            return undefined;
        }
    });

    const searchCategory = (value) => {
        clearTimeout(timer);
        const newTimer = setTimeout(() => {
            setSearchValue(value);
        }, 500);
        setTimer(newTimer);
    };

    return {
        category,
        isLoading,
        isError,
        getCategory: refetch,
        searchCategory,
        refreshCategories: () => queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY })
    };
};

export default useCategory;