import React from 'react'
import { useEffect, useState } from 'react'
import { ballotAddress } from '../info'
import Ballot from '../artifacts/contracts/Ballot.sol/Ballot.json'
import { ethers } from 'ethers'
import web3 from 'web3'
import { useData } from '../contexts/DataContext'
import { formatBigNumber, formatBytes32ToString } from '../utilities/functions'

function BidsList (props) {
  const { bids } = useData()

  // async function makeVote (proposal) {
  //   if (String(owner).toLowerCase() === account) return
  //   if (!signedContract) return
  //   if (vote?.voted) {
  //     alert('Already voted')
  //   } else {
  //     await signedContract.vote(proposal)

  //     signedContract.on('VoteDone', (from, to, value, event) => {
  //       getVote()
  //       loadCandidates()
  //     })
  //   }
  // }

  return (
    <ul className='list-group candidate-list'>
      {bids?.map((bid, index) => (
        <li
          key={index}
          onClick={() => {
            // makeVote(index)
          }}
          className={
            'list-group-item  d-flex justify-content-between align-items-center'
          }
          style={{
            cursor: 'pointer'
          }}
        >
          {formatBytes32ToString(bid.name)}
          <span className='badge badge-primary badge-pill'>
            {web3.utils.fromWei(formatBigNumber(bid.amount).toString())}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default BidsList
