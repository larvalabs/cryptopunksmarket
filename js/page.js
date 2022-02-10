var punkIndexParam = 0;

window.addEventListener('DOMContentLoaded', function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log("Punk index param: " + urlParams.get("index"));

    if (urlParams.has("index")) {
        punkIndexParam = urlParams.get("index");
    }

    cryptopunksContractLoadedCallback = function () {
        Cryptopunks.loadPunkData(punkIndexParam);
    }

    Cryptopunks.init();
    UDomain.init();
});

window.addEventListener('load', function () {
    var vue = new Vue({
        el: '#main_content',
        data: {
            state: Cryptopunks.PunkState,
            punkIndex: punkIndexParam,
            ownerAddress: '',
            dialogState: {
                showTerms: false,
                showWithdrawAccountBalance: false,
                showOfferForSale: false,
                showRemoveFromSale: false,
                showTransfer: false,
                showBid: false,
                showWithdrawBid: false,
                showAcceptBid: false,
                showBuy: false,
            },
            bidDialog: {
                bidAmountEther: null,
            },
            offerDialog: {
                offerAmountEther: null,
                onlyOfferToAddress: null,
            },
            transferDialog: {
                transferToAddress: null,
            },
            transaction: {
                inProgress: false,
                errorMessage: null,
                completedSuccessfully: false,
            },
            uDomainState: {
                showMenu: false,
                loading: false,
            }
        },
        created: function () {
            var self = this;
        },
        mounted() {
            var self = this;

            this._keyListener = function (e) {
                if (e.key === "Escape") {
                    e.preventDefault();
                    self.closeDialogs();
                }
            };

            document.addEventListener('keydown', this._keyListener.bind(this));
        },
        beforeDestroy() {
            document.removeEventListener('keydown', this._keyListener);
        },
        computed: {
            walletIsAvailable: function () {
                return this.state.accountQueried && !this.state.web3NotPresent && !this.state.web3UsingRemoteWeb3;
            },
            accountNeedsUnlock: function () {
                if (!this.state.accountQueried) return false;
                return !this.state.accountUnlocked && this.walletIsAvailable;
            },
            accountIsUnlocked: function () {
                return this.state.accountQueried && this.state.account != null && this.state.account !== '';
            },
            shortAddress: function () {
                if (this.state.account) {
                    return this.state.account.substring(0, 10);
                } else {
                    return "";
                }
            },
            uDomainAdress: function () {
                if (this.state.uDomain) {
                    return this.state.uDomain;
                } else {
                    return this.shortAddress;
                }
            },
            zeroPaddedPunkIndex: function () {
                var paddedValue = '' + this.punkIndex;
                while (paddedValue.length < 4) {
                    paddedValue = '0' + paddedValue;
                }
                return paddedValue;
            },
            punkImageUrl: function () {
                return "https://www.larvalabs.com/public/images/cryptopunks/punk" + this.zeroPaddedPunkIndex + ".png";
            },
            isCurrentAccountOwner: function () {
                return this.state.account && this.ownerAddress && this.state.account.toLowerCase() === this.ownerAddress.toLowerCase();
            },
            shouldShowBuyButton: function () {
                return !this.state.isOwner && this.state.forSale;
            },
            shouldShowOfferForSaleButton: function () {
                return this.state.isOwner;
            },
            shouldShowRemoveFromSaleButton: function () {
                return this.state.isOwner && this.state.forSale;
            },
            shouldShowTransferButton: function () {
                return this.state.isOwner;
            },
            shouldShowBidButton: function () {
                return !this.state.isOwner;
            },
            shouldShowWithdrawBidButton: function () {
                return this.state.hasBid && this.state.ownsBid;
            },
            shouldShowAcceptBidButton: function () {
                return this.state.isOwner && this.state.hasBid;
            },
            isPunkForSaleToAnyone: function () {
                return this.state.forSale && (!this.state.punkData.onlySellTo || this.state.punkData.onlySellTo === Cryptopunks.NULL_ADDRESS);
            },
            isPunkForSaleToSpecificAddress: function () {
                return this.state.forSale && (this.state.punkData.onlySellTo && this.state.punkData.onlySellTo !== Cryptopunks.NULL_ADDRESS);
            },
            isPunkNotForSale: function () {
                return !this.state.forSale;
            },
            doesPunkHaveBid: function () {
                return this.state.hasBid;
            },
            bidAmountUsd: function () {
                return Cryptopunks.formatUsd(Cryptopunks.etherToUsd(this.bidDialog.bidAmountEther), 0);
            },
            offerAmountUsd: function () {
                return Cryptopunks.formatUsd(Cryptopunks.etherToUsd(this.offerDialog.offerAmountEther), 0);
            },
            transferToAddressStatusMessage: function () {
                if (this.transferDialog.transferToAddress == null) {
                    return "Enter an Ethereum Address";
                } else if (!web3.utils.isAddress(this.transferDialog.transferToAddress)) {
                    return "Invalid Ethereum Address";
                } else if (web3.utils.toBN(this.transferDialog.transferToAddress).isZero()) {
                    return "Invalid Address - Zero Address not Allowed"
                }
                return "Address is valid";
            },
            transferToAddressIsValid: function () {
                return this.transferDialog.transferToAddress !== null
                    && web3.utils.isAddress(this.transferDialog.transferToAddress)
                    && !web3.utils.toBN(this.transferDialog.transferToAddress).isZero();
            },
            onlyOfferingToSpecificAddress: function () {
                return this.offerDialog.onlyOfferToAddress !== null && this.offerDialog.onlyOfferToAddress !== "";
            },
            offerToAddressStatusMessage: function () {
                if (!this.offerDialog.onlyOfferToAddress) {
                    return "Offering for sale to any address.";
                } else if (!web3.utils.isAddress(this.offerDialog.onlyOfferToAddress)) {
                    return "Invalid Ethereum Address";
                } else if (web3.utils.toBN(this.offerDialog.onlyOfferToAddress).isZero()) {
                    return "Invalid Address - Zero Address not Allowed"
                }
                return "Address is valid";
            },
            offerToAddressIsValid: function () {
                return this.offerDialog.onlyOfferToAddress == null
                    || this.offerDialog.onlyOfferToAddress === ''
                    || (web3.utils.isAddress(this.offerDialog.onlyOfferToAddress) && !web3.utils.toBN(this.offerDialog.onlyOfferToAddress).isZero());
            },
            uDomainShowMenu: function () {
                return this.uDomainState.showMenu;
            },
            isUDomainLoading: function () {
                return this.uDomainState.loading;
            }
        },
        methods: {
            showTermsOrUnlockWallet: function () {
                if (this.state.agreedToTerms) {
                    Cryptopunks.requestMetamaskAccess();
                } else {
                    this.dialogState.showTerms = true;
                }
            },
            uDomainLogin: async function () {
                try {
                    this.uDomainState.showMenu = false;
                    const authorization = await uauth.loginWithPopup()
                    console.log(authorization)

                    const account = authorization.idToken.wallet_address;
                    const domain_address = authorization.idToken.sub;
                    Cryptopunks.handleAccountsChanged([account]);
                    Cryptopunks.setUDomainAddress(domain_address);
                    // Cryptopunks.requestMetamaskAccess();
                } catch (error) {
                    console.log(error)
                }
            },
            uDomainLogout: async function() {
                try {
                    this.uDomainState.loading = true;

                    const logout = await uauth.logout()
                    console.log(logout)
                    Cryptopunks.handleAccountsChanged([]);
                    Cryptopunks.setUDomainAddress(null);
                } catch (error) {
                    console.log(error)
                } finally {
                    this.uDomainState.showMenu = false;
                    this.uDomainState.loading = false;
                }
            },
            agreedToTerms: function () {
                this.closeDialogs();
                this.state.agreedToTerms = true;
                Cryptopunks.requestMetamaskAccess();
            },
            reloadPunkData: function () {
                Cryptopunks.loadPunkData(this.punkIndex);
                Cryptopunks.refreshPendingWidthdrawals();
            },
            resetDialogData: function () {
                this.bidDialog.bidAmountEther = null;
                this.offerDialog.offerAmountEther = null;
                this.offerDialog.onlyOfferToAddress = null;
                this.transferDialog.transferToAddress = null;
            },
            transactionStarted: function () {
                this.transaction.inProgress = true;
                this.transaction.completedSuccessfully = false;
                this.transaction.errorMessage = null;
            },
            transactionSuccess: function (receipt) {
                this.transaction.inProgress = false;
                this.transaction.completedSuccessfully = true;
                this.transaction.errorMessage = null;
            },
            transactionError: function (error) {
                this.transaction.inProgress = false;
                this.transaction.completedSuccessfully = false;
                this.transaction.errorMessage = Cryptopunks.parseTransactionErrorMessage(error);
            },
            resetTransactionInfo: function () {
                this.transaction.inProgress = false;
                this.transaction.errorMessage = null;
                this.transaction.completedSuccessfully = false;
            },
            closeDialogs: function () {
                this.dialogState.showTerms = false;
                this.dialogState.showWithdrawAccountBalance = false;
                this.dialogState.showOfferForSale = false;
                this.dialogState.showRemoveFromSale = false;
                this.dialogState.showTransfer = false;
                this.dialogState.showBid = false;
                this.dialogState.showWithdrawBid = false;
                this.dialogState.showAcceptBid = false;
                this.dialogState.showBuy = false;

                this.resetDialogData();
                this.resetTransactionInfo();
            },
            showWithdrawAccountBalanceDialog: function () {
                this.dialogState.showWithdrawAccountBalance = true;
            },
            showOfferForSaleDialog: function () {
                this.dialogState.showOfferForSale = true;
            },
            showRemoveFromSaleDialog: function () {
                this.dialogState.showRemoveFromSale = true;
            },
            showTransferDialog: function () {
                this.dialogState.showTransfer = true;
            },
            showBidDialog: function () {
                this.dialogState.showBid = true;
            },
            showWithdrawBidDialog: function () {
                this.dialogState.showWithdrawBid = true;
            },
            showAcceptBidDialog: function () {
                this.dialogState.showAcceptBid = true;
            },
            showBuyDialog: function () {
                this.dialogState.showBuy = true;
            },
            withdrawAccountBalance: function () {
                var self = this;
                Cryptopunks.withdraw(function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    Cryptopunks.refreshPendingWidthdrawals();
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            enterBidForPunk: function () {
                var self = this;
                Cryptopunks.enterBidForPunk(this.punkIndex, web3.utils.toWei('' + this.bidDialog.bidAmountEther, 'ether'), function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            withdrawBidForPunk: function () {
                var self = this;
                Cryptopunks.withdrawBidForPunk(this.punkIndex, function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            acceptBidForPunk: function () {
                var self = this;
                Cryptopunks.acceptBidForPunk(this.punkIndex, web3.utils.toBN(this.state.punkData.bidValue), function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            offerPunkForSale: function () {
                if (this.onlyOfferingToSpecificAddress) {
                    this.offerPunkForSaleToAddress();
                } else {
                    this.offerPunkForSaleToAnyone();
                }
            },
            offerPunkForSaleToAddress: function () {
                var self = this;
                Cryptopunks.offerPunkForSaleToAddress(this.punkIndex, web3.utils.toWei('' + this.offerDialog.offerAmountEther, 'ether'), this.offerDialog.onlyOfferToAddress, function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            offerPunkForSaleToAnyone: function () {
                var self = this;
                Cryptopunks.offerPunkForSale(this.punkIndex, web3.utils.toWei('' + this.offerDialog.offerAmountEther, 'ether'), function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            removePunkFromSale: function () {
                var self = this;
                Cryptopunks.punkNoLongerForSale(this.punkIndex, function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            transferPunk: function () {
                var self = this;
                Cryptopunks.transferPunk(this.punkIndex, this.transferDialog.transferToAddress, function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            buyPunk: function () {
                var self = this;
                Cryptopunks.buyPunk(this.punkIndex, this.state.punkData.offerValue, function () {
                    self.transactionStarted();
                }, function (receipt) {
                    self.transactionSuccess(receipt);
                    self.reloadPunkData();
                }, function (error) {
                    self.transactionError(error);
                });
            },
            toggleUDomainMenu: function (){
                var self = this;
                let current_menu_state = self.uDomainState.showMenu;
                self.uDomainState.showMenu = !current_menu_state;
            }
        },
    });
});