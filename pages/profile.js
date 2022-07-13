import React, { useEffect, useState } from 'react'
import Dropdown from '../components/Dropdown'
import web3 from 'web3'
import { useData } from '../contexts/DataContext'

function profile () {
  const { voters } = useData()
  const [value, setValue] = useState('')

  useEffect(() => {
    if (voters.length) {
      setValue(voters[0].addr)
    }

    return () => {}
  }, [])

  return (
    <form className='d-flex justify-content-center'>
      <div className='form-group'>
        <label htmlFor='delegate'>Delegate</label>
        <Dropdown list={voters} value={value} setValue={setValue} />
      </div>
      <div className='button'>
        <a className='btn btn-black'>Save</a>
      </div>
    </form>
  )
}

export default profile
