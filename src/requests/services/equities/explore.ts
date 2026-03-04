import { StocksExploreResponse} from "@/types/equity";
import { useInfiniteQuery} from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState, useCallback, useEffect } from "react";

interface ExploreStocksParams {
  search?: string;
  sector?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch stocks service for a specific page
 */
export const fetchStocksPageService = async ({
  pageParam = 1,
  search = '',
  sector = '',
  sortBy = '',
  sortOrder = 'asc'
}: {
  pageParam?: number;
} & ExploreStocksParams): Promise<StocksExploreResponse> => {
  try {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      per_page: '100',
    });

    if (search) params.append('search', search);
    if (sector) params.append('sector', sector);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const response = await axios.get(`/api/equities/explore?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stocks page:", error);
    throw error;
  }
};

/**
 * Hook for stock exploration with infinite scroll, search, and filtering
 */
export const useStockExploration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Infinite query for pagination
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    //isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['explore-stocks', debouncedSearchTerm, selectedSector, sortBy, sortOrder],
    queryFn: ({ pageParam = 1 }) =>
      fetchStocksPageService({
        pageParam,
        search: debouncedSearchTerm,
        sector: selectedSector,
        sortBy,
        sortOrder,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      return pagination.has_next_page ? pagination.current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten all pages into a single array
  const allStocks = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.data.Data || []);
  }, [data]);

  // Get unique sectors for filter dropdown
  const availableSectors = useMemo(() => {
    const sectors = allStocks.map(stock => stock.sector).filter(Boolean);
    return [...new Set(sectors)].sort();
  }, [allStocks]);

  // Filter and search stocks client-side for instant results
  const filteredStocks = useMemo(() => {
    let filtered = [...allStocks];

    // Apply search filter (symbol or name)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(stock =>
        stock.symbol.toLowerCase().includes(searchLower) ||
        stock.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sector filter
    if (selectedSector) {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }

    return filtered;
  }, [allStocks, debouncedSearchTerm, selectedSector]);

  // Client-side sorting
  const sortedStocks = useMemo(() => {
    if (!sortBy) return filteredStocks;

    const sorted = [...filteredStocks].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'price':
          aValue = parseFloat(a.close) || 0;
          bValue = parseFloat(b.close) || 0;
          break;
        case 'change':
          aValue = parseFloat(a.changePercent) || 0;
          bValue = parseFloat(b.changePercent) || 0;
          break;
        case 'volume':
          aValue = parseFloat(a.volume) || 0;
          bValue = parseFloat(b.volume) || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [filteredStocks, sortBy, sortOrder]);

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset function
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSector('');
    setSortBy('');
    setSortOrder('asc');
  }, []);

  // Get pagination info
  const paginationInfo = useMemo(() => {
    const lastPage = data?.pages?.[data.pages.length - 1];
    if (!lastPage) return null;
    
    return {
      totalItems: lastPage.data.pagination.total_items,
      currentItems: allStocks.length,
      totalPages: lastPage.data.pagination.total_pages,
      currentPage: lastPage.data.pagination.current_page,
    };
  }, [data, allStocks.length]);

  return {
    // Data
    stocks: sortedStocks,
    allStocks,
    availableSectors,
    paginationInfo,
    
    // Loading states
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    
    // Error state
    error,
    
    // Filter states
    searchTerm,
    selectedSector,
    sortBy,
    sortOrder,
    
    // Actions
    setSearchTerm,
    setSelectedSector,
    setSortBy,
    setSortOrder,
    loadMore,
    resetFilters,
    refetch,
  };
};