const hre = require('hardhat')

async function main () {
  const SimpleAuction = await hre.ethers.getContractFactory('SimpleAuction')
  const simpleAuction = await SimpleAuction.deploy(
    '0x4093832Fd46f244479043963950EE42d0AC1E108'
  )

  await simpleAuction.deployed()

  console.log('Simple Auction deployed to:', simpleAuction.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
