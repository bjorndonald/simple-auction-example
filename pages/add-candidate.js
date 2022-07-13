import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ballotAddress } from '../info'
import Ballot from '../artifacts/contracts/Ballot.sol/Ballot.json'
import { ethers } from 'ethers'
import web3 from 'web3'
import BidsList from '../components/BidsList'
import { useData } from '../contexts/DataContext'
import { formatStringToBytes32 } from '../utilities/functions'

export default function AddCandidate () {
  const {
    signedContract,
    loading,
    setLoading,
    contract,
    loadCandidates
  } = useData()
  const [name, setName] = useState('')

  async function addCandidate () {
    if (signedContract) {
      await signedContract.addCandidate(formatStringToBytes32(name))

      signedContract.on('CandidateAdded', (from, to, value, event) => {
        setName('')
        loadCandidates()
      })
    }
  }

  if (loading) return <h1>Loading ...</h1>
  return (
    <div id='add-candidate'>
      <BidsList />

      <form>
        <div className='form-group'>
          <label htmlFor='name'>Candidate Name</label>
          <input
            type='text'
            className='form-control'
            id='name'
            value={name}
            onChange={event => {
              setName(event.target.value)
            }}
            placeholder='Candidate Name'
          />
        </div>

        <div className='tc-button'>
          <a
            onClick={() => addCandidate(name)}
            type='button'
            className='btn btn-black'
          >
            Save
          </a>
        </div>
      </form>
    </div>
  )
}
