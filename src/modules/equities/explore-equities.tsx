import { StockCard } from "@/components/cards/stock-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockCardSkeleton } from "@/components/ui/stock-card-skeleton";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { showcaseStockDetails } from "./showcase-data";

export const ExploreEquitiesUI = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const availableSectors = useMemo(
    () => Array.from(new Set(showcaseStockDetails.map((stock) => stock.sector))),
    []
  );

  const stocks = useMemo(() => {
    const filtered = showcaseStockDetails.filter((stock) => {
      const matchesSearch =
        !searchTerm ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = !selectedSector || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });

    if (!sortBy) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;

      if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
      if (sortBy === "symbol") return a.symbol.localeCompare(b.symbol) * dir;
      if (sortBy === "price") return (Number(a.close) - Number(b.close)) * dir;
      if (sortBy === "change") {
        return (Number(a.changePercent) - Number(b.changePercent)) * dir;
      }
      if (sortBy === "volume") return (Number(a.volume) - Number(b.volume)) * dir;

      return 0;
    });

    return sorted;
  }, [searchTerm, selectedSector, sortBy, sortOrder]);

  const paginationInfo = {
    totalItems: showcaseStockDetails.length,
  };

  const isLoading = false;
  const isFetchingNextPage = false;
  const hasNextPage = false;
  const error = null;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSector("");
    setSortBy("");
    setSortOrder("asc");
  };

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
              key={stock.symbol}
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

      </section>
    </>
  );
};
