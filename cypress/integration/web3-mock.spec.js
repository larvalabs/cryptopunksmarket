import { mock } from '@depay/web3-mock'

describe('Basic Ethereum mock provider is working.', ()=> {

    beforeEach(()=>mock('ethereum'))

    it('does something', async ()=>{

        let chainId = await window.ethereum.request({method: 'eth_chainId'}) // '0x1'
        let netVersion = await window.ethereum.request({method: 'net_version'}) // 1
        cy.log("Chain ID: " + chainId)
        expect(chainId).to.equal('0x1')
        cy.log("Net version: " + netVersion)

    })
})