import '../styles/globals.css'
import Link from 'next/link'
import './../styles/app.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { simpleAuctionAddress } from '../info'
import SimpleAuction from '../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3 from 'web3'
import DataProvider, { useData } from '../contexts/DataContext'
import { formatBigNumber } from '../utilities/functions'

function Data (props) {
  const {
    setContract,
    signedContract,
    setSignedContract,

    loadBids
  } = useData()
  useEffect(() => {
    init()

    return () => {}
  }, [])

  useEffect(() => {
    loadBids()

    return () => {}
  }, [signedContract])

  async function init () {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    // Prompt user for account connections
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    var simpleAuctionContract = new ethers.Contract(
      simpleAuctionAddress,
      SimpleAuction.abi,
      provider
    )
    setContract(simpleAuctionContract)
    simpleAuctionContract = new ethers.Contract(
      simpleAuctionAddress,
      SimpleAuction.abi,
      signer
    )
    setSignedContract(simpleAuctionContract)
  }

  return props.children
}

function Nav (props) {
  const { setAccount, setOwner, setBalance } = useData()
  useEffect(() => {
    getOwner()
    window.ethereum.on('accountsChanged', function (accounts) {
      getOwner()
    })
    return () => {}
  }, [])

  const getOwner = async () => {
    const { ethereum } = window

    if (!ethereum) {
      alert('Please install Metamask')
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])

      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')

      web3.eth.getBalance(accounts[0]).then(data => {
        setBalance(parseFloat(web3.utils.fromWei(data)).toFixed(2))
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
      // Prompt user for account connections
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      var simpleAuctionContract = new ethers.Contract(
        simpleAuctionAddress,
        SimpleAuction.abi,
        provider
      )
      const o = await simpleAuctionContract.getOwner()
      setOwner(o)
      simpleAuctionContract = new ethers.Contract(
        simpleAuctionAddress,
        SimpleAuction.abi,
        signer
      )
      // if (String(owner).toLowerCase() !== account) {
      //   const v = await simpleAuctionContract.getVote(accounts[0])
      //   setVote(v)
      // }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <ul className='navbar-nav'>
      <li className='nav-item active'>
        <Link href='/'>
          <a className='nav-link'>Home</a>
        </Link>
      </li>

      {/* {String(owner).toLowerCase() === account ? (
        <>
          <li className='nav-item'>
            <Link href='/add-candidate'>
              <a className='nav-link'>Add new candidate</a>
            </Link>
          </li>
          <li className='nav-item'>
            <Link href='/add-voter'>
              <a className='nav-link'>Add new voter</a>
            </Link>
          </li>
        </>
      ) : (
        <li className='nav-item'>
          <Link href='/delegate'>
            <a className='nav-link'>Delegate</a>
          </Link>
        </li>
      )} */}
    </ul>
  )
}

function MyApp ({ Component, pageProps }) {
  const [owner, setOwner] = useState()
  const [vote, setVote] = useState()
  const [account, setAccount] = useState()

  return (
    <>
      <DataProvider>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div
            className='collapse navbar-collapse justify-content-md-center'
            id='navbarNav'
          >
            <a className='navbar-brand' href='#'>
              Simple Auction
            </a>
            <Nav />
          </div>
        </nav>
        <Data>
          <Component {...pageProps} />
        </Data>
      </DataProvider>
    </>
  )
}

export default MyApp
