import { ethers } from 'ethers'
import Web3 from 'web3'

export function formatBigNumber (num) {
  if (num)
    return Math.round(parseFloat(ethers.utils.formatEther(num) * 10 ** 18))
  else return null
}

export function formatStringToBytes32 (txt) {
  return ethers.utils.hexZeroPad(Web3.utils.fromAscii(txt), 32)
}

export function formatBytes32ToString (hex) {
  return Web3.utils.toAscii(hex).replace(/[^a-zA-Z ]/g, '')
}
