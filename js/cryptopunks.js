var Cryptopunks = {};

Cryptopunks.NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
Cryptopunks.AGREE_TO_TERMS = "_Cryptopunks_Agree_To_Terms";
Cryptopunks.EVENT_START_BLOCK = 3914490;
Cryptopunks.ETHER_CONVERSION = {USD: 4000};

Cryptopunks.currentPunkIndex = -1;

Cryptopunks.gasPrice = 40 * 1000000001;

// todo Load from API
Cryptopunks.floorPriceEther = 68.0;

Cryptopunks.PunkState = {
    agreedToTermsStatus: 0, // 0 = not yet agreed, 1 = agreed, 2 = denied
	web3Queried: false,
    web3ready: false,
    web3UsingInfura: false,
    web3NotPresent: false,
    accountQueried: false,
    accountUnlocked: false,
    account: null,
    accountHasBalance: false,
    accountBalanceInWei: 0,
    accountBalanceInEther: 0,
    transactions: [],
    isOwned: true,
    isOwner: false,
    canBuy: false,
    forSale: false,
    hasBid: false,
    ownsBid: false,
    punkData: {
	    loadComplete: false,
	    punkIndex: -1,
        owner: Cryptopunks.NULL_ADDRESS,
        offerValue: 0,
        onlySellTo: Cryptopunks.NULL_ADDRESS,
        bidder: Cryptopunks.NULL_ADDRESS,
        bidValue: 0,
    },
    events: {
	    allSorted: [],
	    transfers: [],
	    bids: [],
	    bidsWithdrawn: [],
	    bought: [],
	    offeredForSale: [],
        claimed: []
    },
    loadingDone: {
	    owner: false,
	    bid: false,
        offer: false,
        eventsClaimed: false
    }
};

Cryptopunks.ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string", "value": "CRYPTOPUNKS"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "punksOfferedForSale", "outputs": [{"name": "isForSale", "type": "bool", "value": false}, { "name": "punkIndex", "type": "uint256", "value": "0"}, { "name": "seller", "type": "address", "value": "0x0000000000000000000000000000000000000000"}, {"name": "minValue", "type": "uint256", "value": "0"}, { "name": "onlySellTo", "type": "address", "value": "0x0000000000000000000000000000000000000000"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "enterBidForPunk", "outputs": [], "payable": true, "type": "function"}, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256", "value": "10000"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}, {"name": "minPrice", "type": "uint256"}], "name": "acceptBidForPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "addresses", "type": "address[]"}, {"name": "indices", "type": "uint256[]"}], "name": "setInitialOwners", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "imageHash", "outputs": [{ "name": "", "type": "string", "value": "ac39af4793119ee46bbff351d8cb6b5f23da60222126add4268e261199a2921b"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "nextPunkIndexToAssign", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "punkIndexToAddress", "outputs": [{"name": "", "type": "address", "value": "0xc352b534e8b987e036a93539fd6897f53488e56a"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "standard", "outputs": [{"name": "", "type": "string", "value": "CryptoPunks"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "punkBids", "outputs": [{"name": "hasBid", "type": "bool", "value": false}, { "name": "punkIndex", "type": "uint256", "value": "0"}, { "name": "bidder", "type": "address", "value": "0x0000000000000000000000000000000000000000"}, {"name": "value", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [], "name": "allInitialOwnersAssigned", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "allPunksAssigned", "outputs": [{"name": "", "type": "bool", "value": true}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "buyPunk", "outputs": [], "payable": true, "type": "function"}, { "constant": false, "inputs": [{"name": "to", "type": "address"}, {"name": "punkIndex", "type": "uint256"}], "name": "transferPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string", "value": "Ͼ"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "withdrawBidForPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "to", "type": "address"}, {"name": "punkIndex", "type": "uint256"}], "name": "setInitialOwner", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}, { "name": "minSalePriceInWei", "type": "uint256"}, {"name": "toAddress", "type": "address"}], "name": "offerPunkForSaleToAddress", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [], "name": "punksRemainingToAssign", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}, {"name": "minSalePriceInWei", "type": "uint256"}], "name": "offerPunkForSale", "outputs": [], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "getPunk", "outputs": [], "payable": false, "type": "function"}, { "constant": true, "inputs": [{"name": "", "type": "address"}], "name": "pendingWithdrawals", "outputs": [{"name": "", "type": "uint256", "value": "0"}], "payable": false, "type": "function"}, { "constant": false, "inputs": [{"name": "punkIndex", "type": "uint256"}], "name": "punkNoLongerForSale", "outputs": [], "payable": false, "type": "function"}, {"inputs": [], "payable": true, "type": "constructor"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "to", "type": "address"}, { "indexed": false, "name": "punkIndex", "type": "uint256"}], "name": "Assign", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, { "indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}], "name": "Transfer", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, { "indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "punkIndex", "type": "uint256"}], "name": "PunkTransfer", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "minValue", "type": "uint256"}, {"indexed": true, "name": "toAddress", "type": "address"}], "name": "PunkOffered", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "value", "type": "uint256"}, {"indexed": true, "name": "fromAddress", "type": "address"}], "name": "PunkBidEntered", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "value", "type": "uint256"}, {"indexed": true, "name": "fromAddress", "type": "address"}], "name": "PunkBidWithdrawn", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}, { "indexed": false, "name": "value", "type": "uint256"}, {"indexed": true, "name": "fromAddress", "type": "address"}, { "indexed": true, "name": "toAddress", "type": "address"}], "name": "PunkBought", "type": "event"}, { "anonymous": false, "inputs": [{"indexed": true, "name": "punkIndex", "type": "uint256"}], "name": "PunkNoLongerForSale", "type": "event"}];

//
// Utility functions
//

Cryptopunks.etherToUsd = function (etherValue) {
    return etherValue * Cryptopunks.ETHER_CONVERSION.USD;
}

Cryptopunks.formatUsd = function (usdValue, fractionDigits) {
    if (!fractionDigits) fractionDigits = 2;
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
    if (formatter) {
        usdValStr = formatter.format(usdValue);
    }
    return usdValStr;
}

Cryptopunks.abbrNum = function (number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number*decPlaces/size)/decPlaces;

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}


//
// Vue Components
//

Vue.component('account-link', {
    props: ['account'],
    template: '<a v-bind:href="\'https://larvalabs.com/cryptopunks/accountInfo?account=\'+account" class="text-blue-600 hover:text-blue-300">{{ account.substring(0,8) }}</a>'
});

Vue.component('account-verification-links', {
    props: ['account'],
    template: `
        <div>
            (<a v-bind:href="\'https://larvalabs.com/cryptopunks/accountInfo?account=\'+account" class="text-blue-600 hover:text-blue-300" target="_blank">View on LarvaLabs.com</a>) 
            (<a v-bind:href="\'https://etherscan.io/address/\'+account" class="text-blue-600 hover:text-blue-300" target="_blank">View on Etherscan</a>)
        </div>
    `
});

Vue.component('transaction-link', {
    props: ['hash'],
    template: '<a v-bind:href="\'https://etherscan.io/tx/\'+hash">{{hash.substring(0,8)}}</a>'
});

Vue.component('dialog-confirmation-header', {
    props: [''],
    template: `
        <div class="">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                Confirmation
            </h3>
            <p class="mt-1 text-sm text-gray-500">
                Please check the following values carefully. Important note: Your wallet is the final authority for any transaction values, be sure to also verify in your wallet that everything is correct.
            </p>
        </div>
`
});

Vue.component('dialog-buttons', {
    props: ['buttonMessage', 'buttonDisabled', 'transaction'],
    template: `
        <div>
                <div v-show="transaction.errorMessage !== null" class="mt-5">
                    <div class="rounded-md bg-red-50 p-4 mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <!-- Heroicon name: solid/x-circle -->
                                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">
                                    {{ transaction.errorMessage }}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button v-show="!transaction.completedSuccessfully" :disabled="buttonDisabled" @click="$emit('main-button-click')" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50">
                        <svg v-show="transaction.inProgress" class="mr-2 animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ buttonMessage }}
                    </button>
                    <button v-show="transaction.completedSuccessfully" @click="$emit('cancel-button-click')" type="button" class="col-span-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50">
                        Transaction Successful - Click to Close
                    </button>
                    <button v-show="!transaction.completedSuccessfully" :disabled="transaction.inProgress || transaction.completedSuccessfully" @click="$emit('cancel-button-click')" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50">
                        Cancel
                    </button>
                </div>
        </div>
    `,
});

Vue.component('floor-percent-display', {
    props: ['amountWei', 'amountEther', 'short'],
    computed: {
        etherValue: function () {
            if (this.amountEther) {
                return this.amountEther;
            } else if (this.amountWei) {
                return parseFloat(web3.utils.fromWei(""+this.amountWei, 'ether'))
            }
            return 0;
        },
        floorFraction: function () {
            return this.etherValue / Cryptopunks.floorPriceEther;
        },
        floorPercentMessage: function () {
            const fraction = this.floorFraction;
            if (fraction > 1) {
                return ((fraction-1) * 100).toFixed(0) + "% above current floor.";
            } else {
                return ((1-fraction) * 100).toFixed(0) + "% below current floor.";
            }
        },
        css: function () {
            if (this.floorFraction < 1) {
                return "text-red-500";
            }
        },
    },
    template: '<span :class="css">{{floorPercentMessage}}</span>'
})

Vue.component('value-display', {
    data: function() {
        return {
            etherConversion: Cryptopunks.ETHER_CONVERSION
        };
    },
    props: ['amountWei', 'amountEther', 'short'],
    computed: {
        valueStr: function() {
            if (amountWei) {
                this.amountEther = parseFloat(web3.utils.fromWei(""+this.amountWei, 'ether'));
            }
            var usdVal = Cryptopunks.etherToUsd(amountEther);
            var fractionDigits = 2;
            if (this.short) fractionDigits = 0;
            var usdValStr = '$'+Cryptopunks.abbrNum(usdVal, fractionDigits);

            // The divide by 1 here removes trailing zeros
            if (this.short) {
                return '' + Cryptopunks.abbrNum(amountEther, 4) + ' Ξ (' + usdValStr + ')';
            } else {
                return '' + Cryptopunks.abbrNum(amountEther, 4) + ' ETH (' + usdValStr + ' USD)';
            }
        },
        amount: function () {
            if (this.amountEther) {
                return web3.utils.toWei(""+this.amountEther, 'ether');
                // return parseFloat(web3.utils.fromWei(""+this.amountWei, 'ether'));
            } else if (this.amountWei) {
                return this.amountWei;
            }
            return 0;
        },
        etherValue: function () {
            return parseFloat(web3.utils.fromWei(""+this.amount, 'ether'));
        },
        shortEtherValue: function () {
            return Cryptopunks.abbrNum(this.etherValue, 4);
        },
        shortUSDValue: function () {
            var fractionDigits = 2;
            if (this.short) fractionDigits = 0;
            var usdVal = (this.etherValue * this.etherConversion.USD);
            return Cryptopunks.abbrNum(usdVal, fractionDigits);
        },
    },
    template: '<span><span>{{shortEtherValue}} Ξ</span> <span class="truncate font-normal text-gray-500">(${{shortUSDValue}})</span></span>'
});


//
// Cryptopunks related functions and app startup
//
Cryptopunks.init = function(punkContractAddress, ethereumUrl, testnet) {
    console.log("Cryptopunks Market init...");

    Cryptopunks.PUNK_CONTRACT_ADDRESS = punkContractAddress;

    if (testnet) {
        Project3.state.isTestnet = true;
    }

    // Modern dapp browsers...
    if (window.ethereum) {
        web3 = new Web3(ethereum);
        window.web3 = web3;
    }
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    else if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log("- Found web3");
        // window.web3 = new Web3(web3.currentProvider);
        web3 = new Web3(web3.currentProvider);
        window.web3 = web3;
    } else {
        console.log("- Didn't find web3, using infura.");
        // web3 = null;
        // Project3.state.web3NotPresent = true;
        // console.log('No web3? You should consider trying MetaMask!')
        // console.log("Jquery width: " + width);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        if (ethereumUrl) {
            window.web3 = new Web3(new Web3.providers.HttpProvider(ethereumUrl));
            Cryptopunks.PunkState.web3UsingInfura = true;
        } else {
            web3 = null;
            Cryptopunks.PunkState.web3NotPresent = true;
        }
    }
    Cryptopunks.PunkState.web3Queried = true;

    startApp();
}

var startApp = function () {

	if (web3) {
		console.log("Found web3.");
		// var contractAddress = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
		// var MyContract = web3.eth.contract(Cryptopunks.ABI);
        // Cryptopunks.punkContract = MyContract.at(Cryptopunks.PUNK_CONTRACT_ADDRESS);

        var PunkContract = new web3.eth.Contract(Cryptopunks.ABI, Cryptopunks.PUNK_CONTRACT_ADDRESS);
        console.log("Loading Cryptopunks contract with address: " + Cryptopunks.PUNK_CONTRACT_ADDRESS);
        Cryptopunks.punkContract = PunkContract;
        Cryptopunks.PunkState.web3ready = true;

        if (typeof cryptopunksContractLoadedCallback !== 'undefined' && Cryptopunks.PunkState.web3UsingInfura) {
            cryptopunksContractLoadedCallback();
        }

        var accountInterval = setInterval(function() {
            web3.eth.getAccounts(function(err, accounts) {
                // console.log(accounts);
                if (accounts[0] !== Cryptopunks.PunkState.account) {
                    console.log("Metamask account changed: "+accounts[0]);
                    Cryptopunks.PunkState.account = accounts[0];
                    web3.eth.defaultAccount = accounts[0];
                    Cryptopunks.punkContract.defaultAccount = accounts[0];
                    if (Cryptopunks.PunkState.account === undefined) {
                        Cryptopunks.PunkState.accountUnlocked = false;
                    } else {
                        Cryptopunks.refreshPendingWidthdrawals();
                        // Cryptopunks.showPunkActions(${punkIndex});

                        Cryptopunks.PunkState.accountUnlocked = true;
                    }

                    if (typeof cryptopunksContractLoadedCallback !== 'undefined') {
                        cryptopunksContractLoadedCallback();
                    }
                }
                Cryptopunks.PunkState.accountQueried = true;
            });
        }, 100);

        $.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', function(data) {
            Cryptopunks.ETHER_CONVERSION.USD = data.USD;
            console.log("Value of ether now " + Cryptopunks.ETHER_CONVERSION.USD);
        })

        $.get('https://ethgasstation.info/json/ethgasAPI.json', function(data) {
            if (data.fast) {
                var gasPriceGwei = data.fast/10
                console.log("Fast gas price in gwei: " + gasPriceGwei)
                Cryptopunks.gasPrice = web3.utils.toWei(''+gasPriceGwei, "gwei");
                console.log("Gas price now " + Cryptopunks.gasPrice);
            }
        })
	}
};

Cryptopunks.requestMetamaskAccess = async () => {
    try {
        // Request account access if needed
        console.log("Requesting metamask access...");
        await ethereum.enable();
        // Acccounts now exposed
        // web3.eth.sendTransaction({/* ... */});
    } catch (error) {
        // User denied account access...
    }
}

Cryptopunks.parseTransactionErrorMessage = function(error) {
    try {
        if (error) {
            if (error.message) {
                // Error is already an object, just return the message.
                return error.message;
            }
            var jsonStr = error.substring(error.indexOf('{'), error.length - 1);
            var jsonObj = JSON.parse(jsonStr);
            var errorMessage = jsonObj.value.data.message.replace("VM Exception while processing transaction: revert ", "");
            return "Error processing transaction: " + errorMessage;
        }
    } catch (e) {
        console.log("Error parsing transaction error: " + e);
        return "Error processing transaction.";
    }
}

var allEventsContainsEvent = function(item) {
    for (var i = 0; i < Cryptopunks.PunkState.events.allSorted.length; i++) {
        var obj = Cryptopunks.PunkState.events.allSorted[i];
        if (obj.transactionHash === item.transactionHash) {
            return true;
        }
        if (item.blockNumber > obj.blockNumber) {
            // No need to lok any further
            return false;
        }
    }
    return false;
};

Cryptopunks.addToAllEvents = function(event) {
    if (!allEventsContainsEvent(event)) {
        Cryptopunks.PunkState.events.allSorted.push(event);
        Cryptopunks.PunkState.events.allSorted.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        })
    }
};

Cryptopunks.loadPunkData = function(index) {
	Cryptopunks.currentPunkIndex = index;
	Cryptopunks.PunkState.punkData.punkIndex = index;
	// var index = Cryptopunks.currentPunkIndex;
	var address = Cryptopunks.PunkState.account;
	console.log("Local address='" + address + "'");
	Cryptopunks.punkContract.methods.punkIndexToAddress(index).call(function(error, result) {
		if(!error) {
			console.log("Owner: '" + result + "'");
            Cryptopunks.PunkState.punkData.owner = result;
			if (address == result) {
				console.log(" - Is owner!");
				Cryptopunks.PunkState.isOwner = true;
			} else {
                Cryptopunks.PunkState.isOwner = false;
				console.log(" - Is not owner.");
			}

            Cryptopunks.PunkState.loadingDone.owner = true;
		} else {
			console.log(error);
		}
	});

    Cryptopunks.punkContract.methods.punksOfferedForSale(index).call(function(error, result) {
        if (!error) {
            Cryptopunks.PunkState.forSale = result[0];
            if (result[0]) {
                Cryptopunks.PunkState.punkData.offerValue = result[3];
                Cryptopunks.PunkState.punkData.onlySellTo = result[4];
                console.log("Punk for sale for " + Cryptopunks.PunkState.punkData.offerValue + " to " + Cryptopunks.PunkState.punkData.onlySellTo);
            }
            if (Cryptopunks.NULL_ADDRESS == result[4] || result[4] == address) {
                Cryptopunks.PunkState.canBuy = true;
            } else {
                Cryptopunks.PunkState.canBuy = false;
            }
            console.log(result);

            Cryptopunks.PunkState.loadingDone.offer = true;
        } else {
            console.log(error);
        }
    });

    Cryptopunks.punkContract.methods.punkBids(index).call(function(error, result) {
        if(!error) {
            Cryptopunks.PunkState.hasBid = result[0];
            Cryptopunks.PunkState.ownsBid = result[2] == address;
            if (Cryptopunks.PunkState.hasBid) {
                Cryptopunks.PunkState.punkData.bidder = result[2];
                Cryptopunks.PunkState.punkData.bidValue = result[3];
            }
            console.log(result);
            Cryptopunks.PunkState.loadingDone.bid = true;
        } else {
            console.log(error);
        }
    });
};

Cryptopunks.refreshPendingWidthdrawals = function() {
    Cryptopunks.punkContract.methods.pendingWithdrawals(Cryptopunks.PunkState.account).call(function(error, result) {
        if (!error) {
            Cryptopunks.PunkState.accountBalanceInWei = result;
            Cryptopunks.PunkState.accountBalanceInEther = parseFloat(web3.utils.fromWei(result, 'ether'));
            if (Cryptopunks.PunkState.accountBalanceInEther > 0) {
                Cryptopunks.PunkState.accountHasBalance = true;
            } else {
                Cryptopunks.PunkState.accountHasBalance = false;
            }
            console.log("Pending balance: " + result);
        } else {
            console.log(error);
        }
    });
};


Cryptopunks.buyPunk = function(index, price, sendingCallback, successCallback, errorCallback) {
    Cryptopunks.punkContract.methods.buyPunk(index).send( {from: Cryptopunks.PunkState.account, gas: 200000, gasPrice: Cryptopunks.gasPrice, value: price})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .once('receipt', function(receipt) {
            console.log(receipt);
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            if (errorCallback) errorCallback(error);
        });
	return true;
};

Cryptopunks.offerPunkForSale = function(index, amount, sendingCallback, successCallback, errorCallback) {
	console.log("Offering to sale to anyone");
	if (!amount || amount == 0) {
	    return false;
    }
    Cryptopunks.punkContract.methods.offerPunkForSale(index, amount).send({from: Cryptopunks.PunkState.account, gas: 200000, gasPrice: Cryptopunks.gasPrice})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .once('receipt', function(receipt) {
            console.log(receipt);
            console.log("Offer successful.");
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log("Offer failed.");
            if (errorCallback) errorCallback(error);
        });

	return true;
};

Cryptopunks.offerPunkForSaleToAddress = function(index, amount, address, sendingCallback, successCallback, errorCallback) {
    if (!amount || amount == 0) {
        return false;
    }
	if (address) {
        console.log("Offering to sale to address '" + address + "'");
        Cryptopunks.punkContract.methods.offerPunkForSaleToAddress(index, amount, address).send({
            from: Cryptopunks.PunkState.account,
            gas: 200000,
            gasPrice: Cryptopunks.gasPrice
        })
            .on('sending', function () {
                if (sendingCallback) sendingCallback();
            })
            .once('receipt', function (receipt) {
                console.log(receipt);
                console.log("Offer successful.");
                if (successCallback) successCallback(receipt);
            })
            .on('error', function (error, receipt) {
                console.log(error);
                console.log("Offer failed.");
                if (errorCallback) errorCallback(error);
            });
    }
    return true;
}

Cryptopunks.punkNoLongerForSale = function(index, sendingCallback, successCallback, errorCallback) {
    Cryptopunks.punkContract.methods.punkNoLongerForSale(index).send({from: Cryptopunks.PunkState.account, gas: 200000, gasPrice: Cryptopunks.gasPrice})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .once('receipt', function(receipt) {
            console.log(receipt);
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            if (errorCallback) errorCallback(error);
        });
	return true;
};

Cryptopunks.transferPunk = function(index, address, sendingCallback, successCallback, errorCallback) {
    if (!address || !address.startsWith("0x")) {
        return false;
    }
    Cryptopunks.punkContract.methods.transferPunk(address, index).send({from: Cryptopunks.PunkState.account, gas: 200000, gasPrice: Cryptopunks.gasPrice})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .on('receipt', function(receipt) {
            console.log(receipt);
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            if (errorCallback) errorCallback(error);
        });
	return true;
};

Cryptopunks.enterBidForPunk = function(index, amount, sendingCallback, successCallback, errorCallback) {
    Cryptopunks.punkContract.methods.enterBidForPunk(index).send({from: Cryptopunks.PunkState.account, gas: 200000, gasPrice: Cryptopunks.gasPrice, value: amount})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .on('receipt', function(receipt) {
            console.log(receipt);
            console.log("Bid successful.");
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log("Bid failed.");
            if (errorCallback) errorCallback(error);
        });
	return true;
}

Cryptopunks.acceptBidForPunk = function(index, amount, sendingCallback, successCallback, errorCallback) {
    if (amount.isZero()) {
        console.log("Error: Amount too low for accept bid.");
        return false;
    }
    console.log("Accepting bid for " + index + " for " + amount);
    Cryptopunks.punkContract.methods.acceptBidForPunk(index, amount.toString()).send( {from: Cryptopunks.PunkState.account, gas: 200000, gasPrice: Cryptopunks.gasPrice})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .on('receipt', function(receipt) {
            console.log(receipt);
            console.log("Bid successful.");
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log("Bid failed.");
            if (errorCallback) errorCallback(error);
        });
    return true;
}

Cryptopunks.withdrawBidForPunk = function(index, sendingCallback, successCallback, errorCallback) {
    Cryptopunks.punkContract.methods.withdrawBidForPunk(index).send( {from: Cryptopunks.PunkState.account, gas: 200000, gasPrice: Cryptopunks.gasPrice})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .on('receipt', function(receipt) {
            console.log(receipt);
            console.log("Bid successful.");
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log("Bid failed.");
            if (errorCallback) errorCallback(error);
        });
    return true;
}

Cryptopunks.withdraw = function() {
    Cryptopunks.punkContract.withdraw({gas: 200000, gasPrice: Cryptopunks.gasPrice}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Withdraw ETH", -1, result);
        } else {
            console.log(error);
            console.log("Failure.");
			Cryptopunks.showFailure("Withdraw ETH", -1);
        }
        Cryptopunks.refreshPendingWidthdrawals();
    });
	return true;
};

Cryptopunks.createTestTransaction = function () {
    Cryptopunks.trackTransaction("Withdraw ETH", -1, "0x62d2e282e26ab1ade314d06a2b835ba227a78d75cf3ca5de77ed15843d05aafa");
}

Cryptopunks.signMessage = function(msg) {
    signMsgPersonal(msg, Cryptopunks.PunkState.account);
    // signMsg(msgParams, Cryptopunks.PunkState.account);
}

function signMsgPersonal(msg, from) {
    web3.currentProvider.sendAsync({
        method: 'personal_sign',
        params: [msg, from],
        from: from,
    }, function (err, result) {
        if (err) return console.error(err)
        if (result.error) {
            return console.error(result.error.message)
        }
        console.log("Signed message: "+result.result);
        window.location.href = "/cryptopunks/verifySignature?signedMessage="+result.result+"&origMessage="+msg;
    })
}

function signMsgTyped(msgParams, from) {
    web3.currentProvider.sendAsync({
        method: 'eth_signTypedData',
        params: [msgParams, from],
        from: from,
    }, function (err, result) {
        if (err) return console.error(err)
        if (result.error) {
            return console.error(result.error.message)
        }
        console.log("Signed message: "+result.result);
        window.location.href = "/cryptopunks/verifySignature?signedMessage="+result.result+"&origMessage="+JSON.stringify(msgParams);
    })
}