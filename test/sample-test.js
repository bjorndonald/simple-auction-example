const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Ballot', function () {
  it('Should add new proposal names', async function () {
    const Ballot = await ethers.getContractFactory('Ballot')
    const ballot = await Ballot.deploy()
    await ballot.deployed()

    console.log('Ballot deployed to:', ballot.address)
  })
})
