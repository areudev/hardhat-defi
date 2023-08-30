import {ethers, network} from 'hardhat'
async function getWeth() {
  // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  const deployer = (await ethers.getSigners())[0]
  const iWeth = await ethers.getContractAt(
    'IWETH',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  )
}

export {getWeth}
