import React from 'react';
import PropTypes from 'prop-types';

/**
 * Modern Clean Table Wrapper
 * Menggunakan class hl-modern-table untuk styling rapi tanpa inline styles.
 */
export const CustomTable = ({ headData, children }) => {
    return (
        <div className="table-responsive hl-card">
            <table className="hl-modern-table align-middle">
                <thead>
                    <tr>
                        {headData.map((th, index) => (
                            <th key={index}>
                                {th}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
};

CustomTable.propTypes = {
    headData: PropTypes.array.isRequired,
    children: PropTypes.node,
};

export default CustomTable;
