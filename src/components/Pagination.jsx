import React from 'react';
import '../styles/Pagination.css';

function Pagination({page, totalPages, onPageChange}){
    const getPageNumbers = ()=>{
        const maxToShow = 5;
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, startPage + maxToShow - 1);

        startPage = Math.max(1, endPage - maxToShow + 1);
        const pages = [];
        for(let i = startPage; i <= endPage; i++){
            pages.push(i);
        }
        return pages;
    }
    const pageNumbers = getPageNumbers();

    const pageInc = ()=>{
        onPageChange(page + 1);
    }
    const pageDec = ()=>{
        onPageChange(page - 1);
    }


    return (
        <div className="pagination-box">
            <button className='btn-prev' onClick={pageDec} disabled={page === 1}></button>

            {pageNumbers.map((num) => (
                <button
                    key={num}
                    onClick={()=>onPageChange(num)}
                >{num}</button>
            ))}
            <button className='btn-next' onClick={pageInc} disabled={page === totalPages}></button>
        </div>
    );
}

export default Pagination;