var Cryptopunks = {};

Cryptopunks.NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
Cryptopunks.AGREE_TO_TERMS = "_Cryptopunks_Agree_To_Terms";
Cryptopunks.TX_HASHES = "_Cryptopunks_Hashes";
Cryptopunks.TX_DIV_ID = "#pendingTransactions";
Cryptopunks.EVENT_START_BLOCK = 3914490;
Cryptopunks.ETHER_CONVERSION = {USD: 4000};

Cryptopunks.currentPunkIndex = -1;

Cryptopunks.gasPrice = 40 * 1000000001;

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

Vue.component('account-link', {
    props: ['account'],
    template: '<a v-bind:href="\'https://larvalabs.com/cryptopunks/accountInfo?account=\'+account" class="text-blue-600 hover:text-blue-300">{{ account.substring(0,8) }}</a>'
});

Vue.component('transaction-link', {
    props: ['hash'],
    template: '<a v-bind:href="\'https://etherscan.io/tx/\'+hash">{{hash.substring(0,8)}}</a>'
});

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

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

Vue.component('value-display', {
    data: function() {
        return {
            etherConversion: Cryptopunks.ETHER_CONVERSION
        };
    },
    props: ['amount', 'short'],
    computed: {
        valueStr: function() {
            var ether = parseFloat(web3.utils.fromWei(""+this.amount, 'ether'));
            var usdVal = (ether * this.etherConversion.USD);
            var fractionDigits = 2;
            if (this.short) fractionDigits = 0;
            var usdValStr = '$'+abbrNum(usdVal, fractionDigits);


/*
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
            });
            if (formatter) {
                usdValStr = formatter.format(usdVal);
            }
*/

            // The divide by 1 here removes trailing zeros
            if (this.short) {
                return '' + abbrNum(ether, 4) + ' Ξ (' + usdValStr + ')';
            } else {
                return '' + abbrNum(ether, 4) + ' ETH (' + usdValStr + ' USD)';
            }
        }
    },
    template: '<span>{{valueStr}}</span>'
});

var panel1 = new Vue({
    el: '#ethereum_panels',
    data: {
        state: Cryptopunks.PunkState,
        agreeToTerms: "no",
    },
    mounted() {
        if (localStorage.agreeToTerms) {
            this.agreeToTerms = localStorage.agreeToTerms;
        }
    },
    watch: {
        agreeToTerms(newVal) {
            localStorage.agreeToTerms = newVal;
        }
    },
    computed: {
        accountShort: function() {
            if (this.state.accountUnlocked) {
                return this.state.account.substring(0,10);
            } else {
                return "none";
            }
        },
        showFullPanel: function() {
            return this.state.accountUnlocked && this.agreeToTerms === 'yes';
        },
        showUnlockPanel: function() {
            return this.state.accountQueried && this.state.web3ready && !this.state.web3UsingInfura && !this.state.accountUnlocked && this.agreeToTerms === 'yes';
        },
        showTermsPanel: function() {
            return this.state.accountQueried && this.state.web3ready && !this.state.web3UsingInfura && this.agreeToTerms === 'no';
        },
        showNoMetamask: function() {
            return this.state.web3UsingInfura;
        }
    },
    methods: {
        userAgreeToTerms: function (event) {
            this.agreeToTerms = "yes";
            // localStorage.setItem(Cryptopunks.AGREE_TO_TERMS, "yes");
        },
        userRejectTerms: function (event) {
            this.agreeToTerms = "deny";
            // this.state.agreedToTermsStatus = 2;
            // localStorage.setItem(Cryptopunks.AGREE_TO_TERMS, "deny");
        },
    }
});

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

        /*
        var test = Cryptopunks.punkContract.totalSupply(function(error, result){
            if(!error)
                console.log(result);
            else
                console.log(error);
        });
        */

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

        Cryptopunks.restoreTransactions();
        setInterval(Cryptopunks.checkTransactions, 1000);

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

Cryptopunks.test = function() {
    Cryptopunks.punkContract.totalSupply(function(error, result){
        if(!error)
            console.log(result);
        else
            console.log(error);
    });
	return true;
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
    Cryptopunks.punkContract.pendingWithdrawals(Cryptopunks.PunkState.account, function(error, result) {
        if (!error) {
            Cryptopunks.PunkState.accountBalanceInWei = result;
            Cryptopunks.PunkState.accountBalanceInEther = web3.fromWei(result, 'ether').toNumber();
            if (!result.isZero()) {
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


Cryptopunks.clearTransactions = function() {
	localStorage.setItem(Cryptopunks.TX_HASHES, JSON.stringify([]));
	Cryptopunks.PunkState.transactions = [];
	// $(Cryptopunks.TX_DIV_ID).html('');
};

Cryptopunks.restoreTransactions = function() {
	var storedData = localStorage.getItem(Cryptopunks.TX_HASHES);
	var items = [];
	if (storedData) {
		items = JSON.parse(storedData);
	}
    console.log("Restored transactions from local storage, length: "+items.length);
	Cryptopunks.PunkState.transactions = items;

	// Clear content
/*
	for (i = 0; i < items.length; i++) {
		var item = items[i];
		Cryptopunks.showTransaction(item);
	}
*/
};

Cryptopunks.showTransaction = function(transaction) {
	var div = $(Cryptopunks.TX_DIV_ID);
	if (transaction.failed) {
		div.append('<p id="' + transaction.hash + '">' + transaction.name + ' <i>failed</i>.</p>');
	} else {
		div.append('<p id="' + transaction.hash + '"><a href="https://etherscan.io/tx/' + transaction.hash + '">' + transaction.name + '</a> <i>pending</i>.</p>');
	}

};

Cryptopunks.trackTransaction = function(name, index, hash) {
	var storedData = localStorage.getItem(Cryptopunks.TX_HASHES);
	var hashes = [];
	if (storedData) {
		hashes = JSON.parse(storedData);
	}
	var transaction = {
		'name' : name,
		'hash' : hash,
		'index' : index,
		'pending' : true
	};
	hashes.push(transaction);
	localStorage.setItem(Cryptopunks.TX_HASHES, JSON.stringify(hashes));
	Cryptopunks.PunkState.transactions = hashes;
	// Cryptopunks.showTransaction(transaction);
};

Cryptopunks.showFailure = function(name, index) {
	var transaction = {
		'name' : name,
		'hash' : '0x0',
		'index' : index,
		'pending' : false,
		'failed' : true
	};
    Cryptopunks.PunkState.transactions.push(transaction);
	// Cryptopunks.showTransaction(transaction);
};

Cryptopunks.checkTransactions = function() {
	// console.log("Checking transactions...");
	var storedData = localStorage.getItem(Cryptopunks.TX_HASHES);
	var items = [];
	if (storedData) {
		items = JSON.parse(storedData);
	}
	Cryptopunks.PunkState.transactions = items;
	// Clear content
	for (i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.pending) {
			web3.eth.getTransaction(item.hash, function (error, result) {
				if (!error) {
					if (result) {
						// console.log(result);
						if (result.blockNumber) {
							// Completed.
							// $('#' + item.hash + ' i').text("completed");
							item.pending = false;
							if (item.index >= 0) {
								console.log("Reloading pending withdrawals...");
								Cryptopunks.refreshPendingWidthdrawals();
                                if (Cryptopunks.currentPunkIndex == item.index) {
                                    console.log("Reloading punk data...");
                                    Cryptopunks.loadPunkData(Cryptopunks.currentPunkIndex);
                                }
							}
							localStorage.setItem(Cryptopunks.TX_HASHES, JSON.stringify(items));
						}
					}
				} else {
					console.log(error);
					console.log("Failure.");
				}
			});
		} else {
			// items.splice(i, 1);
			// i--;
		}
	}
	localStorage.setItem(Cryptopunks.TX_HASHES, JSON.stringify(items));
};

Cryptopunks.testAjax = function() {
	console.log("About to reload.");
	$.ajax({

		url : "/cryptopunks/reloadpunk?punkIndex=" + 2000 + "&sinceBlockNum=" + 4009295,
		type : 'GET',
		data : {
		},
		dataType:'text',
		success : function(data) {
			console.log("Reloaded.");
			location.reload(true);
		},
		error : function(request,error)
		{
			console.log("Reload error.");
		}
	});

}

Cryptopunks.buyPunk = function(index, price) {
    Cryptopunks.punkContract.buyPunk(index, {gas: 200000, gasPrice: Cryptopunks.gasPrice, value: price}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Buy " + index, index, result);
        } else {
            console.log(error);
            console.log("Failure.");
        }
    });
	return true;
};

Cryptopunks.offerPunkForSale = function(index, amount) {
	console.log("Offering to sale to anyone");
	if (!amount || amount == 0) {
	    return false;
    }
    Cryptopunks.punkContract.offerPunkForSale(index, amount, {gas: 200000, gasPrice: Cryptopunks.gasPrice}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Offer " + index, index, result);
        } else {
            console.log(error);
            console.log("Failure.");
			Cryptopunks.showFailure("Offer " + index, index);
        }
    });
	return true;
};

Cryptopunks.offerPunkForSaleToAddress = function(index, amount, address) {
    if (!amount || amount == 0) {
        return false;
    }
	if (address) {
		console.log("Offering to sale to address '" + address + "'");
		Cryptopunks.punkContract.offerPunkForSaleToAddress(index, amount, address, {
			gas: 200000,
			gasPrice: Cryptopunks.gasPrice
		}, function (error, result) {
			if (!error) {
				console.log(result);
				console.log("Success!");
				Cryptopunks.trackTransaction("Offer " + index, index, result);
			} else {
				console.log(error);
				console.log("Failure.");
				Cryptopunks.showFailure("Offer " + index, index);
			}
		});
	} else {
		Cryptopunks.offerPunkForSale(index, amount);
	}
	return true;
};

Cryptopunks.punkNoLongerForSale = function(index) {
    Cryptopunks.punkContract.punkNoLongerForSale(index, {gas: 200000, gasPrice: Cryptopunks.gasPrice}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Remove Offer for " + index, index, result);
        } else {
            console.log(error);
            console.log("Failure.");
			Cryptopunks.showFailure("Remove Offer for " + index, index);
        }
    });
	return true;
};

Cryptopunks.transferPunk = function(index, address) {
    if (!address || !address.startsWith("0x")) {
        return false;
    }
    Cryptopunks.punkContract.transferPunk(address, index, {gas: 200000, gasPrice: Cryptopunks.gasPrice}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Transfer " + index, index, result);
        } else {
            console.log(error);
            console.log("Failure.");
			Cryptopunks.showFailure("Transfer " + index, index);
        }
    });
	return true;
};

Cryptopunks.enterBidForPunk = function(index, amount) {
	// todo - do data validation: do they own the punk, is the bid amount enough to beat an existing bid, etc.
    Cryptopunks.punkContract.enterBidForPunk(index, {gas: 200000, gasPrice: Cryptopunks.gasPrice, value: amount}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Bid on " + index, index, result);
        } else {
            console.log(error);
            console.log("Failure.");
			Cryptopunks.showFailure("Bid on " + index, index);
        }
    });
	return true;
};

Cryptopunks.acceptBidForPunk = function(index, amount) {
    if (amount.isZero()) {
        console.log("Error: Amount too low for accept bid.");
        return false;
    }
    console.log("Accepting bid for " + index + " for " + amount);
    Cryptopunks.punkContract.acceptBidForPunk(index, amount.toString(), {gas: 200000, gasPrice: Cryptopunks.gasPrice}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Accept bid for " + index, index, result);
        } else {
            console.log(error);
            console.log("Failure.");
			Cryptopunks.showFailure("Accept bid for " + index, index);
        }
    });
	return true;
};

Cryptopunks.withdrawBidForPunk = function(index) {
    Cryptopunks.punkContract.withdrawBidForPunk(index, {gas: 200000, gasPrice: Cryptopunks.gasPrice}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
			Cryptopunks.trackTransaction("Withdraw bid on " + index, index, result);
        } else {
            console.log(error);
            console.log("Failure.");
			Cryptopunks.showFailure("Withdraw bid on " + index, index);
        }
    });
	return true;
};

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