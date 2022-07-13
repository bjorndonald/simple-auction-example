import React, { useEffect, useState } from 'react'
import Dropdown from '../components/Dropdown'
import web3 from 'web3'

import { useData } from '../contexts/DataContext'
import { formatBytes32ToString } from '../utilities/functions'

function Delegate () {
  const { voters, account, signedContract } = useData()
  const [value, setValue] = useState({})

  useEffect(() => {
    if (voters.length) {
      setValue(voters.filter(x => String(x.addr).toLowerCase() !== account)[0])
    }

    return () => {}
  }, [voters])

  const delegate = async () => {
    if (signedContract) return
    await signedContract.delegate(value.addr)
    signedContract.on('DelegateDone', (from, to, value, event) => {})
  }

  return (
    <div id='delegate'>
      <form className=''>
        <div className='form-group'>
          <label htmlFor='delegate'>Delegate</label>
          <Dropdown
            list={voters.filter(x => String(x.addr).toLowerCase() !== account)}
            value={value}
            setValue={setValue}
          />
        </div>
        <div className='button'>
          <a
            onClick={() => {
              delegate()
            }}
            className='btn btn-black'
          >
            Save
          </a>
        </div>
      </form>
    </div>
  )
}

export default Delegate
