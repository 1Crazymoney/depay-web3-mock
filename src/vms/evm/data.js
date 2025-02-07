import raise from '../../raise'
import { ethers } from 'ethers'

let getContract = ({ address, api, provider }) => {
  return new ethers.Contract(address, api, provider)
}

let getContractFunction = ({ data, address, api, provider }) => {
  let contract = getContract({ address, api, provider })
  let methodSelector = data.split('000000000000000000000000')[0]
  try {
    return contract.interface.getFunction(methodSelector)
  } catch (error) {
    if (error.reason == 'no matching function') {
      raise('Web3Mock: method not found in mocked api!')
    } else {
      raise(error)
    }
  }
}

let getContractArguments = ({ params, api, provider }) => {
  let data = params.data
  let address = params.to
  let contract = getContract({ address, api, provider })
  let contractFunction = getContractFunction({ data, address, api, provider })
  return contract.interface.decodeFunctionData(contractFunction, data)
}

let encode = ({ result, params, api, provider }) => {
  let address = params.to
  let data = params.data
  let contract = getContract({ address, api, provider })
  let contractFunction = getContractFunction({ data, address, api, provider })
  let encodedResult
  if(contractFunction?.outputs && contractFunction.outputs.length == 1) {
    encodedResult = [result]
  } else {
    encodedResult = result
  }
  return contract.interface.encodeFunctionResult(contractFunction.name, encodedResult)
}

export { encode, getContractFunction, getContractArguments }
