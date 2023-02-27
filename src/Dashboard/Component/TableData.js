import React, { useState } from 'react'
import ReactPaginate from 'react-paginate';
import { BsThreeDotsVertical } from "react-icons/bs";
import { NavLink } from 'react-router-dom';

export default function TableData(props) {

    const { items } = props;
    const [itemOffset, setItemOffset] = useState(0);

    const itemsPerPage = 2;

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items && items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items && items.length / itemsPerPage);

    const handlePageClick = (e) => {
        const newOffset = (e.selected * itemsPerPage) % items.length;

        setItemOffset(newOffset);
    };

    return (
        <>
        <div className="container">

            <div className="row">
            {currentItems && currentItems.map((item, index) => {
                return (
                    <div className="col-6">
                        <img src={item.url} className="img-fluid" alt="" />

                    </div>

                )
            })}
            </div>
        </div>





            {/* <tr > */}
            <div>
                <ReactPaginate className="pagination"
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    disabledClassName="disabled"
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />
            </div>
            {/* </tr> */}
        </>
    );
}