import React from 'react'

const RupiahFormater = ({value}) => {

  const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  // const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
  return (
    <>{`Rp ${addCommas(value != null ? value : 0)}`}</>
  )
}

export default RupiahFormater