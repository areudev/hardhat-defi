import {ethers, network} from 'hardhat'
import {getWeth, AMOUNT} from './get-weth'
import {Signer} from 'ethers'
import {IPool} from '../typechain-types'

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

async function getBorrowUserData(pool: IPool, account: Signer) {
  const {totalCollateralBase, totalDebtBase, availableBorrowsBase} =
    await pool.getUserAccountData(account)
  console.log(
    `You have ${ethers.formatEther(totalCollateralBase)} ETH as collateral`,
  )
  console.log(`You have ${ethers.formatEther(totalDebtBase)} ETH as debt`)
  console.log(`You can borrow ${ethers.formatEther(availableBorrowsBase)} ETH`)

  return {totalCollateralBase, totalDebtBase, availableBorrowsBase}
}

async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt(
    'AggregatorV3Interface',
    '0x773616E4d11A78F511299002da57A0a94577F1f4',
  )
  const [, price] = await daiEthPriceFeed.latestRoundData()
  return price
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

  let {totalDebtBase, availableBorrowsBase} = await getBorrowUserData(
    pool,
    deployer,
  )

  const daiPrice = await getDaiPrice()
  console.log('daiPrice', daiPrice.toString())
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
