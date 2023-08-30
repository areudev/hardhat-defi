import {ethers, network} from 'hardhat'
import {getWeth} from './get-weth'
import {Signer} from 'ethers'

async function getPool(account: Signer) {
  const poolAddressesProvider = await ethers.getContractAt(
    'IPoolAddressesProvider',
    '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    account,
  )

  const poolAddress = await poolAddressesProvider.getPool()
  const pool = await ethers.getContractAt('IPool', poolAddress, account)
}
async function main() {
  await getWeth()
  // Pool address: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
