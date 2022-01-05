import { mock } from '@depay/web3-mock'

describe('Cryptopunks Market UI and Contract Interaction Tests', ()=> {

    let userAccount = '0xaaaaaaf26964af9d7eed9e03e53415d37aa96045';
    let bidderAccount = '0xbbbbbbf26964af9d7eed9e03e53415d37aa96045';
    let transferRecipientAccount = '0xccccccf26964af9d7eed9e03e53415d37aa96045';
    let offerToSaleRecipientAccount = '0xddddddf26964af9d7eed9e03e53415d37aa96045';
    let zeroAccount = '0x0000000000000000000000000000000000000000';

    let punkIndex = 0;
    let blockchain = 'ethereum'
    let cryptopunksContractAddress = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
    let cryptopunksABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string", "value": "CRYPTOPUNKS"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "punksOfferedForSale", "outputs": [{"name": "isForSale", "type": "bool", "value": false}, { "name": "punkIndex", "type": "uint256", "value": "0"}, { "name": "seller", "type": "address", "value": "0x0000000000000000000000000000000000000000"}, {"name": "minValue", "type": "uint256", "value": "0"}, { "name": "onlySellTo", "type": "address", "value": "0x0000000000000000000000000000000000000000"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "enterBidForPunk", "outputs": [], "payable": true, "type": "function"}, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256", "value": "10000"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}, {"name": "minPrice", "type": "uint256"}], "name": "acceptBidForPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "addresses", "type": "address[]"}, {"name": "indices", "type": "uint256[]"}], "name": "setInitialOwners", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "imageHash", "outputs": [{ "name": "", "type": "string", "value": "ac39af4793119ee46bbff351d8cb6b5f23da60222126add4268e261199a2921b"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "nextPunkIndexToAssign", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "punkIndexToAddress", "outputs": [{"name": "", "type": "address", "value": "0xc352b534e8b987e036a93539fd6897f53488e56a"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "standard", "outputs": [{"name": "", "type": "string", "value": "CryptoPunks"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "punkBids", "outputs": [{"name": "hasBid", "type": "bool", "value": false}, { "name": "punkIndex", "type": "uint256", "value": "0"}, { "name": "bidder", "type": "address", "value": "0x0000000000000000000000000000000000000000"}, {"name": "value", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [], "name": "allInitialOwnersAssigned", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "allPunksAssigned", "outputs": [{"name": "", "type": "bool", "value": true}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "buyPunk", "outputs": [], "payable": true, "type": "function"}, { "constant": false, "inputs": [{"name": "to", "type": "address"}, {"name": "punkIndex", "type": "uint256"}], "name": "transferPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string", "value": "Ͼ"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "withdrawBidForPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "to", "type": "address"}, {"name": "punkIndex", "type": "uint256"}], "name": "setInitialOwner", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}, { "name": "minSalePriceInWei", "type": "uint256"}, {"name": "toAddress", "type": "address"}], "name": "offerPunkForSaleToAddress", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "punksRemainingToAssign", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}, {"name": "minSalePriceInWei", "type": "uint256"}], "name": "offerPunkForSale", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "getPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "address"}], "name": "pendingWithdrawals", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "punkNoLongerForSale", "outputs": [], "payable": false, "type": "function"}, {"inputs": [], "payable": true, "type": "constructor"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "to", "type": "address"}, { "indexed": false, "name": "punkIndex", "type": "uint256"}], "name": "Assign", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, { "indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}], "name": "Transfer", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, { "indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "punkIndex", "type": "uint256"}], "name": "PunkTransfer", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "minValue", "type": "uint256"}, {"indexed": true, "name": "toAddress", "type": "address"}], "name": "PunkOffered", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "value", "type": "uint256"}, {"indexed": true, "name": "fromAddress", "type": "address"}], "name": "PunkBidEntered", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "value", "type": "uint256"}, {"indexed": true, "name": "fromAddress", "type": "address"}], "name": "PunkBidWithdrawn", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "value", "type": "uint256"}, {"indexed": true, "name": "fromAddress", "type": "address"}, { "indexed": true, "name": "toAddress", "type": "address"}], "name": "PunkBought", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}], "name": "PunkNoLongerForSale", "type": "event"}];
    let accounts = [userAccount]

    let withdrawValue = '5000000000000000000';
    let listPriceValue = '9000000000000000000';
    let bidValue = '1000000000000000000';

    beforeEach(() => {
        cy.viewport(1000, 800)

        mock('ethereum')
        let mockEth = cy.window().specWindow.window.ethereum
        Cypress.on('window:before:load', win => {
            console.log("Setting mock eth before window load: "+mockEth)
            win.ethereum = mockEth
        });

        mock({
            blockchain,
            accounts: {
                return: accounts
            }
        })

        let pendingWithdrawalsMock = mock({
            blockchain,
            call: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'pendingWithdrawals',
                params: userAccount,
                return: withdrawValue
            }
        })

        let punkIndexToAddressMock = mock({
            blockchain,
            call: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'punkIndexToAddress',
                params: punkIndex,
                return: userAccount
            }
        })

        let punksOfferedForSaleMock = mock({
            blockchain,
            call: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'punksOfferedForSale',
                params: punkIndex,
                return: [true, 0, userAccount, listPriceValue, '0x0000000000000000000000000000000000000000']
            }
        })

        let punkBidsMock = mock({
            blockchain,
            call: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'punkBids',
                params: punkIndex,
                return: [true, 0, bidderAccount, bidValue]
            }
        })

    })

    it('Punk is shown in UI as owned by correct account.', () => {
        cy.visit('/')

        cy.get('[data-cy=logo]').should('have.length', 1)
        cy.get('[data-cy=owned-by]').should('be.visible')
        cy.get('[data-cy=owned-by]').should('have.text', 'Owned by 0xAaAAAA', {timeout: 60000})
    })

    it('Can accept bid and correct minPrice is specified.', () => {
        // {"blockchain":"ethereum","transaction":{"to":"0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb","api":["PLACE API HERE"],"method":"acceptBidForPunk","params":{"punkIndex":"0","minPrice":"1000000000000000000"}}}"
        let acceptBidTransaction = mock({
            blockchain,
            transaction: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'acceptBidForPunk',
                params: {
                    punkIndex: punkIndex,
                    minPrice: bidValue
                }
            }
        })

        cy.visit('/')

        cy.get('[data-cy=btn-accept-bid]').should('be.visible')
        cy.get('[data-cy=btn-accept-bid]').click()
        // cy.get('[data-cy=btn-dialog-confirm]').should('be.visible')
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').click()
    })

    // todo Figure out why punkNoLongerForSale mock not working
/*
    it('Can remove from sale.', () => {
        let mockTransaction = mock({
            blockchain,
            transaction: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'punkNoLongerForSale',
                params: {
                    punkIndex: punkIndex,
                }
            }
        })

        cy.visit('/')

        cy.get('[data-cy=btn-remove-from-sale]').should('be.visible')
        cy.get('[data-cy=btn-remove-from-sale]').click()
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').click()
    })

 */

    //
    // Transfer tests
    //

    it('Can not transfer to partial address.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-transfer]').should('be.visible')
        cy.get('[data-cy=btn-transfer]').click()

        cy.get('[data-cy=input-transfer-to]').type(transferRecipientAccount.substring(0, transferRecipientAccount.length-1))
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not transfer to address with extra characters.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-transfer]').should('be.visible')
        cy.get('[data-cy=btn-transfer]').click()

        cy.get('[data-cy=input-transfer-to]').type(transferRecipientAccount+"1")
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not transfer to zero address.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-transfer]').should('be.visible')
        cy.get('[data-cy=btn-transfer]').click()

        cy.get('[data-cy=input-transfer-to]').type(zeroAccount)
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not transfer to just 0.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-transfer]').should('be.visible')
        cy.get('[data-cy=btn-transfer]').click()

        cy.get('[data-cy=input-transfer-to]').type('0')
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can transfer to valid recipient.', () => {
        // {"blockchain":"ethereum","transaction":{"to":"0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb","api":["PLACE API HERE"],"method":"acceptBidForPunk","params":{"punkIndex":"0","minPrice":"1000000000000000000"}}}"
        let mockTransaction = mock({
            blockchain,
            transaction: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'transferPunk',
                params: {
                    to: transferRecipientAccount,
                    punkIndex: punkIndex,
                }
            }
        })

        cy.visit('/')

        cy.get('[data-cy=btn-transfer]').should('be.visible')
        cy.get('[data-cy=btn-transfer]').click()
        cy.get('[data-cy=input-transfer-to]').type(transferRecipientAccount)
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').click()
    })

    //
    // Offer for Sale tests
    //

    it('Can not offer for empty amount.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not offer to specific address for empty amount.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=input-offer-to-address]').type(offerToSaleRecipientAccount)
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not offer for zero.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=input-offer-value-ether]').type(0)
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not offer for sale to partial address.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=input-offer-value-ether]').type(1)
        cy.get('[data-cy=input-offer-to-address]').type(offerToSaleRecipientAccount.substring(0, offerToSaleRecipientAccount.length-1))
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not offer to address with extra characters.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=input-offer-value-ether]').type(1)
        cy.get('[data-cy=input-offer-to-address]').type(offerToSaleRecipientAccount+'1')
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Can not offer to zero address with extra characters.', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=input-offer-value-ether]').type(1)
        cy.get('[data-cy=input-offer-to-address]').type(zeroAccount)
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').should('be.disabled')
    })

    it('Offer for sale to anyone produces correct transaction.', () => {
        let mockTransaction = mock({
            blockchain,
            transaction: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'offerPunkForSale',
                params: {
                    punkIndex: punkIndex,
                    minSalePriceInWei: '7000000000000000000',
                }
            }
        })

        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=input-offer-value-ether]').type(7)
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').click()
    })

    it('Offer for sale only to specific address produces correct transaction.', () => {
        let mockTransaction = mock({
            blockchain,
            transaction: {
                to: cryptopunksContractAddress,
                api: cryptopunksABI,
                method: 'offerPunkForSaleToAddress',
                params: {
                    punkIndex: punkIndex,
                    minSalePriceInWei: '8000000000000000000',
                    toAddress: offerToSaleRecipientAccount,
                }
            }
        })

        cy.visit('/')

        cy.get('[data-cy=btn-offer-for-sale]').should('be.visible')
        cy.get('[data-cy=btn-offer-for-sale]').click()

        cy.get('[data-cy=input-offer-value-ether]').type(8)
        cy.get('[data-cy=input-offer-to-address]').type(offerToSaleRecipientAccount)
        cy.get('[data-cy=btn-dialog-confirm]').filter(':visible').click()
    })


})