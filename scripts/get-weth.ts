import {ethers, network} from 'hardhat'
async function getWeth() {
  // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  const deployer = (await ethers.getSigners())[0]
  console.log('deployer', deployer.address)

  const iWeth = await ethers.getContractAt(
    'IWETH',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  )

  const tx = await iWeth.deposit({
    value: ethers.parseEther('0.1'),
  })
  await tx.wait(1)

  const wethBalance = await iWeth.balanceOf(deployer)
  console.log('wethBalance', ethers.formatEther(wethBalance))
}

export {getWeth}
