export default function ProductCardSkeleton({ isCompact }: { isCompact?: boolean }) {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-full ${
        isCompact ? "sm:rounded-3xl" : ""
      }`}
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gray-100 animate-pulse ${
          isCompact ? "aspect-video" : "aspect-square"
        }`}
      ></div>
      <div className={`${isCompact ? "p-4 sm:p-5" : "p-5 sm:p-8"} flex flex-col flex-grow bg-white`}>
        <div className={`h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse ${isCompact ? "h-4" : ""}`}></div>
        <div className={`h-4 bg-gray-100 rounded w-full mb-2 animate-pulse ${isCompact ? "hidden" : ""}`}></div>
        <div className={`h-4 bg-gray-100 rounded w-5/6 animate-pulse ${isCompact ? "hidden" : ""}`}></div>

        <div className={`${isCompact ? "mt-3 mb-3" : "mt-6 mb-6"}`}>
          <div className={`h-8 bg-gray-200 rounded w-1/3 animate-pulse ${isCompact ? "h-6" : ""}`}></div>
        </div>
        <div className="mt-auto space-y-3">
          <div className="h-10 bg-gray-200 rounded-xl w-full animate-pulse"></div>
          {!isCompact && <div className="h-10 bg-gray-200 rounded-xl w-full animate-pulse"></div>}
        </div>
      </div>
    </div>
  );
}
