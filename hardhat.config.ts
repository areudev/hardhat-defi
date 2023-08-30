import {HardhatUserConfig} from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
// import '@nomiclabs/hardhat-ethers'
// import 'hardhat-deploy'
import 'dotenv/config'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

const SEPOLIA_URL = process.env.RPC_URL || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ''
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || ''

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    token: 'MATIC',
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  // solidity: '0.8.19',
  solidity: {
    compilers: [
      {
        version: '0.8.19',
      },
      {
        version: '0.4.19',
      },
      {
        version: '0.6.6',
      },
    ],
  },
}

export default config
