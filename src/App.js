import './App.css';
import { useState } from 'react';
import Web3 from 'web3';
import abi from './erc20-abi.json';
import { KeylessWeb3, getNetworks } from '@getsafle/safle-keyless-js'

// function AppOld() {
//     //   const [fromAddr, setfromAddr] = useState(false);
//     //   const [succMsg, setSuccMsg] = useState('');
//     //   let logged = false;

//     //   let [w3, setW3] = useState(null);
//     //   let [keyless, setKeyless] = useState(false);

//     //   const init = async () => {

//     //     logged = true;
//     //     let networks = await getNetworks();

//     //     console.log('networkssssssssss : ', networks);

//     //     const rpcUrls = {
//     //       1: 'https://mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
//     //       3: 'https://ropsten.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
//     //       137: 'https://polygon-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
//     //       80001: 'https://polygon-mumbai.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b'
//     //     }

//     //     for (var i in networks) {
//     //       networks[i]['rpcURL'] = rpcUrls[networks[i].chainId];
//     //     }

//     //     console.log(networks);

//     //     let keyless2 = new KeylessWeb3({ blockchain: networks });

//     //     let w32 = new Web3(keyless2.provider);

//     //     console.log({ w32 })

//     //     setW3(w32)

//     //     // w32.currentProvider.on('login successful', setAddress);
//     //     w32.currentProvider.on('login successful', callFn => setAddress(w32));
//     //     w32.currentProvider.on('transactionSuccess', successTrans);

//     //     console.log({ w32 })
//     //     keyless2.login();
//     //     console.log({ keyless2 })
//     //     setKeyless(keyless2)
//     //   }

//     //   const setAddress = (_w3) => {
//     //     // const setAddress = () => {
//     //     console.log('login ', w3);
//     //     setTimeout(() => {
//     //       _w3.eth.personal.getAccounts().then((addreses) => {
//     //         console.log("personal : ", addreses);
//     //         if (Array.isArray(addreses) && addreses.length > 0) {
//     //           const from = addreses.shift();
//     //           console.log(from);
//     //           setfromAddr(from);
//     //         }
//     //       });

//     //       _w3.eth.personal.getAccounts().then((accounts) => {
//     //         console.log('getAcc : ', accounts);
//     //       });
//     //     }, 200);
//     //   }

//     //   const successTrans = (resp) => {
//     //     console.log(resp.receipt);
//     //     // setfromAddr(false);
//     //     setSuccMsg('Transaction succeded.');
//     //   }

//     //   const sendTransaction = async () => {

//     //     const toAddress = '0x2723a2756ecb99b3b50f239782876fb595728ac0'.toLowerCase();
//     //     const contractAddress = '0x101848d5c5bbca18e6b4431eedf6b95e9adf82fa'.toLowerCase();

//     //     const nonce = await w3.eth.getTransactionCount(fromAddr, 'latest'); // nonce starts counting from 0

//     //     const instance = new w3.eth.Contract(abi, contractAddress );

//     //     const sendValue = w3.utils.toBN( 0.01 * Math.pow( 10, 18 ) );

//     //     let data,gas,balance;

//     //     data = await instance.methods.transfer( toAddress, sendValue ).encodeABI();

//     //     try {
//     //       balance = await instance.methods.balanceOf( fromAddr ).call();
//     //       console.log('weenus balance : ', balance);
//     //       gas = await instance.methods.transfer( toAddress, sendValue ).estimateGas({ from: fromAddr });
//     //     } catch( e ){
//     //       console.log('err', e );
//     //     }

//     //     console.log('dataaaaa : ', data);
//     //     console.log('gassssss : ', gas );
//     //     console.log('balanceeeeeee : ', balance );

//     //     // data = 0xa9059cbb0000000000000000000000002723a2756ecb99b3b50f239782876fb595728ac00000000000000000000000000000000000000000000000000de0b6b3a7640000
//     //     const transaction = {
//     //       'from': fromAddr,
//     //       'to': toAddress, //to address
//     //       'value': 10000,
//     //       'gas': gas,
//     //       'data': data,
//     //       'nonce': nonce,
//     //       'type': '0x2',
//     //       // 'chainId': 137,
//     //     };

//     //     console.log('raw txxxxx : ', transaction);

//     //     const resp = await w3.eth.sendTransaction(transaction);

//     //     const signedTx = await w3.eth.signTransaction(transaction);
//     //     console.log('signedTx : ', signedTx);

//     //     console.log(resp);
//     //   }

//     //   const signMessage = async () => {
//     //     const message = 'Hello world';
//     //     const resp = await w3.eth.sign(message, fromAddr);

//     //     console.log(resp);
//     //   }

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <p>
//                     Welcome to DAPP
//                 </p>
//                 {fromAddr && <button onClick={() => sendTransaction()} >Send transaction </button>}
//                 {succMsg != '' && <h2> {succMsg}</h2>}

//                 <button onClick={() => init()}>CLICK ME TO OPEN WIDGET</button>
//                 <button onClick={() => keyless.openDashboard()}>Open dashboard</button>

//                 <button id="balance-btn" className=" long active_when_logged" onClick={async () => {
//                     const bal = await w3.eth.getBalance(fromAddr);

//                     console.log(bal);
//                 }}>Get balance</button>

//                 <button id="nw-switch" className=" long active_when_logged" onClick={async () => {
//                     keyless.selectChain();
//                 }}>Network switch</button>

//                 <button id="txn-success-btn" className=" long active_when_logged" onClick={async () => {
//                     keyless.txnSuccess();
//                 }}>Txn Success</button>

//                 <button id="txn-failed-btn" className=" long active_when_logged" onClick={async () => {
//                     keyless.txnFailed();
//                 }}>Txn Failed</button>

//                 <button id="pin-btn" className=" long active_when_logged" onClick={async () => {
//                     keyless.enterPin();
//                 }}>Pin</button>

//                 <button id="qr-btn" className=" long active_when_logged" onClick={async () => {
//                     keyless.scanQR();
//                 }}>QR</button>

//                 <button id="sign-btn" className=" long active_when_logged" onClick={async () => { await signMessage() }}>Sign Message</button>

//                 <button id="disconnect_btn" onClick={async () => { keyless.disconnect(); }}>Disconnect</button>

//             </header>
//         </div>
//     );
// }

function App() {
    const [connect, setConnect] = useState(false);

    const [fromAddr, setfromAddr] = useState(false);
    const [userBalance, setUserBalance] = useState(0)
    const [succMsg, setSuccMsg] = useState('');
    let logged = false;

    let [w3, setW3] = useState(null);
    let [keyless, setKeyless] = useState(false);

    let [userAvailableTokens, setUserAvailableTokens] = useState([])

    const init = async () => {

        logged = true;
        let networks = await getNetworks();

        console.log('networkssssssssss : ', networks);

        const rpcUrls = {
            1: 'https://mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
            3: 'https://ropsten.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
            137: 'https://polygon-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
            80001: 'https://polygon-mumbai.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b'
        }

        for (var i in networks) {
            networks[i]['rpcURL'] = rpcUrls[networks[i].chainId];
        }

        console.log(networks);

        let keyless2 = new KeylessWeb3({ blockchain: networks });

        let w32 = new Web3(keyless2.provider);

        console.log({ w32 })

        setW3(w32)

        // w32.currentProvider.on('login successful', setAddress);
        w32.currentProvider.on('login successful', callFn => setAddress(w32, keyless2));
        w32.currentProvider.on('transactionSuccess', successTrans);

        console.log({ w32 })
        keyless2.login();
        console.log({ keyless2 })
        setKeyless(keyless2)
    }

    const setAddress = (_w3, _keyless) => {
        // const setAddress = () => {
        console.log('login ', w3);
        setTimeout(() => {
            _w3.eth.personal.getAccounts().then(async (addreses) => {
                console.log("personal : ", addreses);
                if (Array.isArray(addreses) && addreses.length > 0) {
                    const from = addreses.shift();
                    console.log(from);
                    setfromAddr(from);
                    setConnect(true)
                    const bal = await _w3.eth.getBalance(from);
                    setUserBalance(bal)
                    let tokens = await _keyless.getCurrentNetworkTokens()
                    console.log({ tokens })
                    setUserAvailableTokens(tokens)
                }
            });

            _w3.eth.personal.getAccounts().then((accounts) => {
                console.log('getAcc : ', accounts);
            });
        }, 200);
    }

    const successTrans = (resp) => {
        console.log(resp.receipt);
        // setfromAddr(false);
        setSuccMsg('Transaction succeded.');
    }


    const [messageToSign, setMessageToSign] = useState('')
    const signMessage = async () => {
        const message = messageToSign;
        console.log({ message, messageToSign })
        const resp = await w3.eth.sign(message, fromAddr);

        console.log(resp);
        setMessageToSign("")
    }
    const onClickConnection = async () => {
        if (connect) {
            setKeyless(false)
            setfromAddr(false)
            setW3(null)
            setConnect(false)
        } else {
            await init()
        }
    }
    const refreshBalance = async () => {
        const bal = await w3.eth.getBalance(fromAddr);
        setUserBalance(bal)
    }

    const [sendTo, setSendTo] = useState('')
    const [sendAmount, setSendAmount] = useState(0)

    const sendAmountTransaction = async () => {

        console.log({ sendTo, sendAmount })

        const sendValue = w3.utils.toBN(sendAmount * Math.pow(10, 18));
        console.log({ sendValue })
        // data = 0xa9059cbb0000000000000000000000002723a2756ecb99b3b50f239782876fb595728ac00000000000000000000000000000000000000000000000000de0b6b3a7640000
        const transaction = {
            'from': fromAddr,
            'to': sendTo, //to address
            'value': sendValue,
            // 'gas': gas,
            // 'data': data,
            // 'nonce': nonce,
            // 'type': '0x2',
            // 'chainId': 137,
        };

        console.log('raw txxxxx : ', transaction);

        const resp = await w3.eth.sendTransaction(transaction);
        console.log({ resp });

        const signedTx = await w3.eth.signTransaction(transaction);
        console.log('signedTx : ', signedTx);

    }


    const [_tokenTo, setTokenTo] = useState('')
    const [tokenSendTo, setTokenSendTo] = useState('')
    const [tokenAmount, setTokenAmount] = useState(0)

    const sendTokenAmountTransaction = async () => {

        let tokenTo = JSON.parse(_tokenTo)
        console.log({ tokenSendTo, _tokenTo, tokenAmount, tokenTo })

        const sendValue = w3.utils.toBN(tokenAmount * Math.pow(10, tokenTo.decimal));
        console.log({ sendValue })


        const toAddress = tokenSendTo
        const contractAddress = tokenTo.tokenAddress.toLowerCase();

        const nonce = await w3.eth.getTransactionCount(fromAddr, 'latest'); // nonce starts counting from 0

        const instance = new w3.eth.Contract(abi, contractAddress);

        // const sendValue = w3.utils.toBN(0.01 * Math.pow(10, 18));

        let data, gas, balance;

        data = await instance.methods.transfer(toAddress, sendValue).encodeABI();

        try {
            balance = await instance.methods.balanceOf(fromAddr).call();
            console.log('weenus balance : ', balance);
            gas = await instance.methods.transfer(toAddress, sendValue).estimateGas({ from: fromAddr });
        } catch (e) {
            console.log('err', e);
        }

        console.log('dataaaaa : ', data);
        console.log('gassssss : ', gas);
        console.log('balanceeeeeee : ', balance);

        // data = 0xa9059cbb0000000000000000000000002723a2756ecb99b3b50f239782876fb595728ac00000000000000000000000000000000000000000000000000de0b6b3a7640000
        const transaction = {
            'from': fromAddr,
            'to': toAddress, //to address
            'value': 0,
            // 'gas': gas,
            'data': data,
            'nonce': nonce,
            'type': '0x2',
            // 'chainId': 137,
        };

        console.log('raw txxxxx : ', transaction);

        const resp = await w3.eth.sendTransaction(transaction);
        console.log(resp);

        const signedTx = await w3.eth.signTransaction(transaction);
        console.log('signedTx : ', signedTx);

    }


    return (
        <div className="container">
            <div className="header">
                <div className="header__logo">
                    <img src="/SafleLogo.png" />
                </div>
                <div className="header__title">
                    <h1>Safle Keyless Demo</h1>
                </div>
                <div
                    className={
                        'header__connect ' +
                        (connect ? 'disconnect' : 'connect')
                    }
                    onClick={onClickConnection}
                // () => setConnect(!connect)}
                >
                    <button>
                        <span className="outer">
                            <span className="inner">&nbsp;</span>
                        </span>
                        {connect ? 'Disconnect' : 'Connect'}
                    </button>
                </div>
            </div>
            <div className="main">
                <div className="main__form">
                    <div className="left">
                        <div className="inputgroup group_1">
                            <label>Account Address</label>
                            <input
                                type="text"
                                placeholder="Enter your account address"
                                value={fromAddr}
                            />
                        </div>
                        <div className="inputgroup group_2">
                            <label>Chain</label>
                            <select>
                                <option>Chain 1</option>
                                <option>Chain 2</option>
                                <option>Chain 3</option>
                                <option>Chain 4</option>
                            </select>
                        </div>

                        <div className="inputgroup group_3">
                            <label>Balance</label>
                            <p>{userBalance} ETH</p>
                            <button onClick={refreshBalance}>Refresh</button>
                        </div>

                        <div className="inputgroup group_4">
                            <label>Send</label>
                            <div>
                                <input type="text" placeholder="To" onChange={(e) => setSendTo(e.target.value)} />
                                <input type="number" placeholder="Amount in eth" onChange={(e) => setSendAmount(e.target.value)} />

                                <button onClick={sendAmountTransaction}>Go</button>
                            </div>
                        </div>
                        <div className="inputgroup group_5">
                            <label>Send Token</label>
                            <div>
                                <select onChange={(e) => { console.log({ e }, JSON.parse(e.target.value), e.target.value); setTokenTo(e.target.value) }}>
                                    {userAvailableTokens.map(token =>
                                        <option value={JSON.stringify(token)} key={token.addreses}>{token.symbol}</option>
                                    )}
                                </select>
                                <input type="text" placeholder="To" onChange={(e) => setTokenSendTo(e.target.value)} />
                                <input type="number" placeholder="Amount" onClick={(e) => setTokenAmount(e.target.value)} />

                                <button onClick={sendTokenAmountTransaction}>Go</button>
                                <button onClick={async () => {
                                    let tokens = await keyless.getCurrentNetworkTokens()
                                    console.log({ tokens })
                                    setUserAvailableTokens(tokens)
                                }} >Get tokens</button>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="actions">
                            <button onClick={async () => {
                                keyless.selectChain();
                            }}>Change Account</button>
                            <button onClick={async () => {
                                keyless.selectChain();
                            }}>Change Chain</button>
                        </div>
                        <div className="inputgroup group_6">
                            <label>Sign Message</label>
                            <input type="text" placeholder="Sign Message" value={messageToSign} onChange={(e) => setMessageToSign(e.target.value)} />
                            <button onClick={signMessage}>Go</button>
                        </div>
                        <div className="inputgroup group_7">
                            <label>Signed Message</label>
                            <input type="text" placeholder="Signed Message" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
