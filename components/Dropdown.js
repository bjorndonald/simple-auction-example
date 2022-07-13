import React, { useState } from 'react'

import { formatBytes32ToString } from '../utilities/functions'

function Dropdown (props) {
  const [open, setOpen] = useState(false)
  console.log('list', props.list)
  return (
    <div className={open ? 'dropdown show' : 'dropdown'}>
      <button
        className='btn btn-secondary dropdown-toggle'
        type='button'
        onClick={() => {
          setOpen(!open)
        }}
        id='dropdownMenuButton'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded={open}
      >
        {props.value.name ? formatBytes32ToString(props.value.name) : null}
      </button>
      <div
        className={open ? 'dropdown-menu show' : 'dropdown-menu'}
        aria-labelledby='dropdownMenuButton'
      >
        {props.list.map((x, i) => (
          <a
            onClick={() => props.setValue(x)}
            className='dropdown-item'
            href='#'
          >
            {formatBytes32ToString(x.name)}
          </a>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
