import React from 'react'
import { Table } from 'reactstrap'
import PropTypes from 'prop-types'

export const CustomTable = ({ headData, children }) => {
    return (
        <div className="table-responsive">
            <Table className="align-middle mb-0">
                <thead>
                    <tr>
                        {headData.map((th, index) => (
                            <td
                                key={index}
                                style={{
                                    padding: '0.875rem 1rem',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.8px',
                                    color: '#8898aa',
                                    backgroundColor: '#f8f9fe',
                                    borderBottom: '2px solid #e9ecef',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {th}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </Table>
        </div>
    );
};

CustomTable.propTypes = {
    headData: PropTypes.array.isRequired,
    children: PropTypes.node,
};

export default CustomTable;
