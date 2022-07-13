import React, { createContext, useContext, useEffect, useState } from 'react'
import { formatBigNumber } from '../utilities/functions'

const DataContext = createContext({})

const DataProvider = ({ children }) => {
  const [owner, setOwner] = useState()
  const [bids, setBids] = useState([])
  const [account, setAccount] = useState()
  const [signer, setSigner] = useState()
  const [provider, setProvider] = useState()
  const [contract, setContract] = useState()
  const [expiryDate, setExpiryDate] = useState()
  const [balance, setBalance] = useState('')
  const [loading, setLoading] = useState(true)
  const [signedContract, setSignedContract] = useState()

  async function loadBids () {
    if (!contract) return
    setLoading(true)
    var data = await contract.getBids()
    setBids(data)
    console.log(data)
    data = await contract.getExpiryDate()
    setExpiryDate(formatBigNumber(data))
    var exp = new Date()
    exp.setTime(formatBigNumber(data))
    console.log(exp)
    setLoading(false)
  }

  return (
    <DataContext.Provider
      value={{
        account,
        owner,
        bids,
        signer,
        provider,
        contract,
        expiryDate,
        loading,
        balance,
        signedContract,
        setBids,
        setOwner,
        setAccount,
        setLoading,
        setSigner,
        setContract,
        setProvider,
        loadBids,
        setExpiryDate,
        setBalance,
        setSignedContract
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

export default DataProvider
