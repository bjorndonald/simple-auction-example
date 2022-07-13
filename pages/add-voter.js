import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { formatStringToBytes32 } from '../utilities/functions'

function AddVoter (props) {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const { signedContract, loadVoters } = useData()

  const addVoter = async () => {
    if (!signedContract) return
    await signedContract.giveRightToVote(address, formatStringToBytes32(name))
    signedContract.on('VoterAdded', (from, to, value, event) => {
      setName('')
      setAddress('')
      loadVoters()
    })
  }

  return (
    <div id='add-voter'>
      <h1>Add New Voter</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='name'>Voter Name</label>
          <input
            type='text'
            className='form-control'
            id='name'
            value={name}
            onChange={event => {
              setName(event.target.value)
            }}
            placeholder='Voter Name'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='name'>Voter Address</label>
          <input
            type='text'
            className='form-control'
            id='name'
            value={address}
            onChange={event => {
              setAddress(event.target.value)
            }}
            placeholder='Voter Address'
          />
        </div>

        <div className='tc-button'>
          <a onClick={() => addVoter()} type='button' className='btn btn-black'>
            Save
          </a>
        </div>
      </form>
    </div>
  )
}

export default AddVoter
