import {ethers, network} from 'hardhat'
import {getWeth, AMOUNT, A_TOKEN} from './get-weth'
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
  console.log(`You have ${totalCollateralBase} ETH as collateral`)
  console.log(`You have ${totalDebtBase} ETH as debt`)
  console.log(`You can borrow ${availableBorrowsBase} ETH`)

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

async function borrowDai(
  daiAddress: string,
  pool: IPool,
  amountDaiToBorrowWei: string,
  account: Signer,
) {
  const borrowTx = await pool.borrow(
    daiAddress,
    amountDaiToBorrowWei,
    1,
    0,
    account,
  )

  await borrowTx.wait(1)
  console.log('Borrowed!')
}

async function main() {
  await getWeth()
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const pool = await getPool(deployer)
  console.log('pool', pool.target)
  // deposid
  const wethTokenAddress = A_TOKEN
  // approve

  await apporveErc20(wethTokenAddress, pool.target, AMOUNT, deployer)
  console.log('Deposit...')

  const tx = await pool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
  await tx.wait(1)

  console.log('Deposited!')

  let {totalDebtBase, availableBorrowsBase} = await getBorrowUserData(
    pool,
    accounts[0],
  )

  const daiPrice = await getDaiPrice()
  console.log('daiPrice', ethers.parseEther(daiPrice.toString()))

  // const amountDaiToBorrow =
  //   availableBorrowsBase * BigInt(0.95) * (BigInt(1) / daiPrice)
  // const amountDaiToBorrowWei = ethers.parseEther(amountDaiToBorrow.toString())

  const amountDaiToBorrow = convertEthToDai(
    availableBorrowsBase.toString(),
    daiPrice.toString(),
  )

  console.log('amountDaiToBorrow', amountDaiToBorrow)

  await borrowDai(
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    pool,
    '2',
    deployer,
  )

  await getBorrowUserData(pool, accounts[0])
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
function convertEthToDai(ethAmount: string, daiPrice: string) {
  const ethAmountWei = ethers.parseEther(ethAmount)
  const daiPriceWei = ethers.parseEther(daiPrice)

  // Since we're dealing with BigIntegers, multiplication before division to avoid float.
  const daiAmountWei =
    (ethAmountWei * BigInt('1000000000000000000')) / daiPriceWei

  // return ethers.formatEther(daiAmountWei)
  return daiAmountWei
}
