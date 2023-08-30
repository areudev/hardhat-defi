import {ethers, network} from 'hardhat'
import {getWeth, AMOUNT} from './get-weth'
import {Signer} from 'ethers'

async function getPool(account: Signer) {
  const poolAddressesProvider = await ethers.getContractAt(
    'IPoolAddressesProvider',
    '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    account,
  )

  const poolAddress = await poolAddressesProvider.getPool()
  const pool = await ethers.getContractAt('IPool', poolAddress, account)

  return pool
}

async function apporveErc20(
  contractAddress: string,
  spenderAddress: any,
  amount: any,
  account: Signer,
) {
  const erc20Token = await ethers.getContractAt(
    'IERC20',
    contractAddress,
    account,
  )
  const tx = await erc20Token.approve(spenderAddress, amount)
  await tx.wait(1)

  console.log('Approved!')
}
async function main() {
  await getWeth()
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const pool = await getPool(deployer)
  console.log('pool', pool.target)
  // deposid
  const wethTokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  // approve

  await apporveErc20(wethTokenAddress, pool.target, AMOUNT, deployer)
  console.log('Deposit...')

  await pool.deposit(wethTokenAddress, AMOUNT, deployer.address, 0)
  console.log('Deposited!')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
