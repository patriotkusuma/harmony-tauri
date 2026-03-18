import React, { useRef } from 'react'
import { Card, CardBody, CardHeader, Row, Table } from 'reactstrap'
import PropTypes from 'prop-types'

export const CustomTable = (props) => {
    const {tableHead, data, headData, children} = props;


    return (
        <>
                <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                  {headData.map((th,index) => {
                    return (
                      <td  key={index}> 
                        {th}
                      </td>
                      
                      )
                    })}
                    </tr>
                </thead>
                <tbody>
                  {children}
                </tbody>
              </Table>
              
        </>
    )
}

CustomTable.propTypes = {
    tableHead: PropTypes.string.isRequired,
    data: PropTypes.array,
    headData: PropTypes.array.isRequired,
    toggleModal: PropTypes.func,
    addData: PropTypes.func,
    isAdd: PropTypes.bool,
};
