import { StockCard } from "@/components/cards/stock-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockCardSkeleton } from "@/components/ui/stock-card-skeleton";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStockExploration } from "@/requests/services/equities/explore";
import { useEffect, useCallback, useRef } from "react";

export const ExploreEquitiesUI = () => {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const {
    stocks,
    availableSectors,
    paginationInfo,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    searchTerm,
    selectedSector,
    sortBy,
    sortOrder,
    setSearchTerm,
    setSelectedSector,
    setSortBy,
    setSortOrder,
    loadMore,
    resetFilters,
  } = useStockExploration();

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder, setSortBy, setSortOrder]);

  // Render skeleton cards
  const renderSkeletonCards = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <StockCardSkeleton
        key={`skeleton-${index}`}
        className={cn(
          "flex items-center justify-between w-full sm:w-fit sm:block",
          "[&>div:first-of-type]:flex [&>div:first-of-type]:gap-2 sm:[&>div:first-of-type]:block",
        )}
      />
    ));
  };

  return (
    <>
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back
      </Button>

      <section className="mx-auto max-w-[940px] mt-8">
        <h2 className="text-p1 sm:text-h3 font-semibold text-txt-primary mb-4">
          Explore equities
        </h2>
        
        {/* Search Bar */}
        <div className="bg-white rounded border border-stroke-primary rounded-[10px] flex mb-4">
          <Search color="#56575D" size={18} className="ml-3 mt-3" />
          <Input
            placeholder="Search by name or symbol, e.g. Access bank"
            parentClassName="w-full"
            className="border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Sector Filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-txt-secondary" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 border border-stroke-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sectors</option>
              {availableSectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-txt-secondary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-stroke-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort by</option>
              <option value="name">Name</option>
              <option value="symbol">Symbol</option>
              <option value="price">Price</option>
              <option value="change">Change %</option>
              <option value="volume">Volume</option>
            </select>
            
            {sortBy && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange(sortBy)}
                className="text-xs"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            )}
          </div>

          {/* Reset Filters */}
          {(searchTerm || selectedSector || sortBy) && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Info */}
        {paginationInfo && (
          <div className="mb-4 text-sm text-txt-secondary">
            Showing {stocks.length} of {paginationInfo.totalItems} stocks
            {searchTerm && ` for "${searchTerm}"`}
            {selectedSector && ` in "${selectedSector}"`}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-txt-danger mb-4">Failed to load stocks. Please try again.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {/* Stock Cards Grid */}
        <div className="flex-col sm:flex-row flex gap-3 sm:gap-6 flex-wrap">
          {/* Render actual stock cards */}
          {stocks.map((stock) => (
            <StockCard
              key={stock.id}
              stockCode={stock.symbol}
              name={stock.name}
              price={stock.close}
              percentChange={stock.changePercent}
              iconUrl={stock.iconUrl}
              className={cn(
                "flex items-center justify-between w-full sm:w-fit sm:block",
                "[&>div:first-of-type]:flex [&>div:first-of-type]:gap-2 sm:[&>div:first-of-type]:block",
                "[&>div:first-of-type>div:first-of-type]:mb-0 sm:[&>div:first-of-type>div:first-of-type]:mb-3",
                "[&>div:first-of-type>div:last-of-type>p:last-of-type]:mb-0 sm:[&>div:first-of-type>div:last-of-type>p:last-of-type]:mb-3",
                "[&>div:first-of-type>div:last-of-type]:ml-2 sm:[&>div:first-of-type>div:last-of-type]:ml-0",
              )}
            />
          ))}

          {/* Loading skeletons for next page */}
          {isFetchingNextPage && renderSkeletonCards(12)}
          
          {/* Initial loading skeletons */}
          {isLoading && renderSkeletonCards(24)}
        </div>

        {/* Load more trigger for infinite scroll */}
        <div ref={loadMoreRef} className="h-10 w-full" />

        {/* No results message */}
        {!isLoading && stocks.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-txt-secondary mb-4">
              {searchTerm || selectedSector
                ? "No stocks found matching your criteria."
                : "No stocks available at the moment."}
            </p>
            {(searchTerm || selectedSector) && (
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* End of results message */}
        {!hasNextPage && stocks.length > 0 && (
          <div className="text-center py-8">
            <p className="text-txt-secondary text-sm">
              You&apos;ve reached the end of the results
            </p>
          </div>
        )}
      </section>
    </>
  );
};
