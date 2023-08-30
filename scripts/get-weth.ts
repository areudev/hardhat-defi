import {ethers, network} from 'hardhat'

const AMOUNT = ethers.parseEther('9000').toString()
const A_TOKEN = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
async function getWeth() {
  // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  // const deployer = (await ethers.getSigners())[0]

  const accounts = await ethers.getSigners()
  console.log(AMOUNT)

  // console.log(
  //   'accounts addresses and money',
  //   accounts.map(a => a.address),
  // )

  const deployer = accounts[0]
  // console.log('deployer', deployer.address)

  const iWeth = await ethers.getContractAt(
    'IWeth',
    A_TOKEN,
    // '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  )

  const tx = await iWeth.deposit({
    value: AMOUNT,
  })
  await tx.wait(1)

  const wethBalance = await iWeth.balanceOf(deployer)
  console.log('wethBalance', ethers.formatEther(wethBalance))
}

export {getWeth, AMOUNT, A_TOKEN}
