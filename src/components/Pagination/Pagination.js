import React from 'react'
import { DOTS, UsePagination } from './usePagination'
import {PaginationItem, PaginationLink, Pagination as PaginationRS} from 'reactstrap'

const Pagination = ({currentPage,rowPerPage, totalPosts, onPageChange, previousPage, nextPage, siblingCount=1}) => {
  
    const paginationRange = UsePagination({
        totalPosts,
        currentPage,
        rowPerPage,
        siblingCount
    });

    console.log(totalPosts)
    console.log(currentPage)
    console.log(rowPerPage)
    console.log(siblingCount)


    if(currentPage === 0 || paginationRange.length <2) {
        return null;
    }

    let lastPage = paginationRange[paginationRange.length -1];


    return (
        <PaginationRS
            className='pagination justify-content-end mb-0'
            listClassName='justify-content-end mb-0'
            >
                <PaginationItem disabled={currentPage == 1} className={currentPage == 1 ? 'disabled' : ''}>
                    <PaginationLink onClick={previousPage}>
                        <i className='fa fa-angle-left'/>
                        <span className='sr-only'>Previous</span>
                    </PaginationLink>
                </PaginationItem>

                {paginationRange.map((pageNumber, index) => {
                    if(pageNumber === DOTS){
                        return (
                            <PaginationItem>
                                ...
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={index} className={pageNumber === currentPage ? 'active' : ''} >
                            <PaginationLink key={pageNumber} onClick={() => onPageChange(pageNumber)}>
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem disabled={lastPage == currentPage} className={lastPage == currentPage ? 'disabled' : ''}>
                    <PaginationLink onClick={nextPage}>
                        <i className='fa fa-angle-right' />
                        <span className='sr-only' >Next</span>
                    </PaginationLink>
                </PaginationItem>

        </PaginationRS>
    )
}

export default Pagination