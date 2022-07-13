import { ethers } from 'ethers'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import { simpleAuctionAddress } from '../info'
import SimpleAuction from '../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json'
import { useData } from '../contexts/DataContext'

import BidsList from '../components/BidsList'
import { formatStringToBytes32 } from '../utilities/functions'

export default function Home () {
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [endTime, setEndTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const {
    signedContract,
    loading,
    loadBids,
    owner,
    account,
    balance,
    expiryDate
  } = useData()

  useEffect(() => {
    return () => {}
  }, [])

  const addBid = async () => {
    try {
      if (!signedContract) return
      await signedContract.bid(formatStringToBytes32(name), {
        value: web3.utils.toWei(amount)
      })

      signedContract.on('HighestBidIncreased', (from, to, value, event) => {
        setAmount('')

        loadBids()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const init = async () => {
    var timeline =
      new Date(endDate).getMilliseconds() + new Date(endTime).getMilliseconds()
    // new Date(endDate).setTime()
    let t = endTime // hh:mm
    let ms =
      Number(t.split(':')[0]) * 60 * 60 * 1000 +
      Number(t.split(':')[1]) * 60 * 1000
    var fulldate = new Date(endDate)
    fulldate.setTime(fulldate.getTime() + ms)

    if (!signedContract) return
    await signedContract.init(fulldate.getTime())
    signedContract.on('AuctionTimeSet', (from, to, value, event) => {
      setEndDate('')
      setEndTime('')

      loadBids()
    })
  }

  if (loading) return <h1>Loading ...</h1>

  return (
    <div id='ballot'>
      <h1>Set Up Auction</h1>
      {String(owner).toLowerCase() === String(account).toLowerCase() ? (
        expiryDate > 0 ? (
          <></>
        ) : (
          <form>
            <div className='form-group'>
              <label htmlFor='name'>Initiate Auction</label>
              <input
                type='date'
                className='form-control'
                id='name'
                value={endDate}
                onChange={event => {
                  setEndDate(event.target.value)
                }}
                placeholder='Expiry Date'
              />
            </div>

            <div className='form-group'>
              <input
                type='time'
                className='form-control'
                id='name'
                value={endTime}
                onChange={event => {
                  setEndTime(event.target.value)
                }}
                placeholder='Expiry Time'
              />
            </div>

            <div className='tc-button'>
              <a onClick={() => init()} type='button' className='btn btn-black'>
                Save
              </a>
            </div>
          </form>
        )
      ) : (
        <form>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              className='form-control'
              id='name'
              value={name}
              onChange={event => {
                setName(event.target.value)
              }}
              placeholder='Bidder Name'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='amount'>New Bid</label>
            <input
              type='number'
              className='form-control'
              id='amount'
              value={amount}
              onChange={event => {
                setAmount(event.target.value)
              }}
              placeholder='Bid Amount'
            />
            <div className='d-flex align-items-center justify-content-end'>
              ETH Balance: &nbsp; <span className='bold'>{balance}</span> ETH
            </div>
            <p></p>
          </div>

          <div className='tc-button'>
            <a onClick={() => addBid()} type='button' className='btn btn-black'>
              Save
            </a>
          </div>
        </form>
      )}

      <BidsList />
    </div>
  )
}
