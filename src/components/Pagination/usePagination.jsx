import React, { useMemo } from 'react'

export const DOTS = '...';

const range = (start, end) => {
    let length = end-start + 1;
    return Array.from({length}, (_, idx) => idx + start);
}

export const UsePagination = ({totalPosts, rowPerPage, siblingCount=1, currentPage})=> {
    const paginationRange = useMemo(()=>{
        if (!totalPosts || !rowPerPage) return [];
        const totalPageCount = Math.ceil(totalPosts / rowPerPage);
        if (isNaN(totalPageCount)) return [];

        const totalPageNumber = siblingCount + 5;

        if(totalPageNumber >= totalPageCount){
            return range(1, totalPageCount);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage+siblingCount, totalPageCount);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        if(!shouldShowLeftDots && shouldShowRightDots){
            let leftItemCount = 2+  2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, DOTS, totalPageCount];
        }

        if(shouldShowLeftDots && !shouldShowRightDots){
            let rightItemCount = 2+ 2 * siblingCount;
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);

            return [firstPageIndex, DOTS, ...rightRange];
        }

        if(shouldShowLeftDots && shouldShowRightDots){
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
        return [];
    }, [totalPosts, rowPerPage, siblingCount, currentPage]);

    return paginationRange;
}
