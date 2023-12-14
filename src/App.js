import "./App.css";
import { useState } from "react";
import Web3 from "web3";
import abi from "./erc20-abi.json";
import Keyless from "@getsafle/safle-keyless-js";

function App() {
  const [connect, setConnect] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [fromAddr, setfromAddr] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [succMsg, setSuccMsg] = useState("");
  let logged = false;

  let [w3, setW3] = useState(null);
  let [keyless, setKeyless] = useState(false);

  let [userAvailableTokens, setUserAvailableTokens] = useState([]);
  let [selectedChain, setSelectedChain] = useState({ chainId: 0, chain: "" });

  const init = async () => {
    logged = true;
    let keyless2 = new Keyless("mumbaitestnet");

    await keyless2.init(true);

    keyless2.onLogin((z, chainDetails) => {
      setAddress(keyless2, z, chainDetails);
    });

    keyless2.onLogout(() => {
      setSendTo("");
      setSendAmount(0);
      setMessageToSign("");
      setMessageSignature("");
      setConnect(false);
      setShowDropDown(false);
      setfromAddr(false);
      setUserBalance(0);
      setSuccMsg("");
      let logged = false;
      setW3(null);
      setKeyless(false);
      setUserAvailableTokens([]);
      setSelectedChain({ chainId: 0, chain: "" });
      setConnect(false);
    });
  };

  const setAddress = (_keylessNew, add, chainDetails) => {
    console.log(
      "_keylessNew, add, chainDetails ",
      _keylessNew,
      add,
      chainDetails
    );
    if (fromAddr === add) return;
    console.log("INSIDE SETADDRESS");
    console.log("login ", w3);
    setTimeout(async () => {
      const _keyless = await _keylessNew.updateWeb3(chainDetails);
      let _w3 = new Web3(_keyless.provider);
      setW3(_w3);
      setKeyless(_keyless);

      const from = add;
      console.log(from);
      setfromAddr(from);
      setConnect(true);
      const bal = await _w3.eth.getBalance(from);
      setUserBalance(_w3.utils.fromWei(bal, "ether"));
      let tokens = await _keyless.getCurrentNetworkTokens();
      console.log({ tokens });
      setUserAvailableTokens(tokens);
    }, 200);
  };

  const successTrans = (resp) => {
    console.log(resp.receipt);
    // setfromAddr(false);
    setSuccMsg("Transaction succeded.");
  };

  const setTokenDecimal = (value, decimal) => {
    if (!value || !decimal) return 0;
    let val;
    if (value.length > decimal) {
      val = value;
    } else {
      val = "0".repeat(decimal - value.length + 1) + value;
    }
    let res =
      val.substring(0, val.length - decimal) +
      "." +
      val.substring(val.length - decimal);
    return res;
  };

  const [messageToSign, setMessageToSign] = useState("");
  const [messageSignature, setMessageSignature] = useState("");

  const signMessage = async () => {
    const message = messageToSign;
    console.log({ message, messageToSign, message, fromAddr });
    try {
      const resp = await w3.eth.sign(message, fromAddr);

      console.log(resp);
      setMessageToSign("");
      setMessageSignature(resp.signature);
    } catch (e) {
      console.log({ e });
    }
  };
  const onClickConnection = async () => {
    if (connect) {
      keyless.disconnect();
    } else {
      await init();
    }
  };
  const refreshBalance = async () => {
    const bal = await w3.eth.getBalance(fromAddr);
    setUserBalance(w3.utils.fromWei(bal, "ether"));
    // setUserBalance(bal)
  };

  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [tokenSendTo, setTokenSendTo] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [gasLimit, setGasLimit] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [maxFeePerGas, setMaxFeePerGas] = useState("");
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const convertToNumberString = (num) => {
    if (`${num}`.indexOf("e+") !== -1) {
      const arr = `${num}`.split("e+");
      const zeros = Number(arr.pop());
      const base = arr[0];

      if (base.indexOf(".") === -1) {
        return base + "0".repeat(zeros);
      } else {
        const newArr = base.split(".");

        const newBase = newArr[0];

        const decimalNumber = newArr[1];

        if (decimalNumber.length > zeros) {
          return (
            newBase +
            decimalNumber.slice(0, decimalNumber.length - zeros) +
            "." +
            decimalNumber.slice(decimalNumber.length - zeros)
          );
        } else {
          return (
            newBase + decimalNumber + "0".repeat(zeros - decimalNumber.length)
          );
        }
      }
    } else if (`${num}`.indexOf("e-") !== -1) {
      const arr = `${num}`.split("e-");
      const zeros = Number(arr.pop());
      const base = `${arr[0]}`;

      if (base.indexOf(".") === -1) {
        if (`${base}`.length > zeros) {
          return (
            base.slice(0, base.length - zeros) +
            "." +
            base.slice(base.length - zeros)
          );
        } else {
          return "0." + "0".repeat(zeros - `${base}`.length) + base;
        }
      } else {
        const newArr = base.split(".");
        const newBase = `${newArr[0]}`;
        const decimalNumber = `${newArr[1]}`;

        if (newBase.length > zeros) {
          return (
            newBase.slice(0, newBase.length - zeros) +
            "." +
            newBase.slice(newBase.length - zeros) +
            decimalNumber
          );
        } else {
          return (
            "0." +
            "0".repeat(zeros - `${newBase}`.length) +
            newBase +
            decimalNumber
          );
        }
      }
    } else {
      return `${num}`;
    }
  };

  const sendAmountTransaction = async () => {
    try {
      console.log({ sendTo, sendAmount });

      const rBN = `${sendAmount * Math.pow(10, 18)}`;
      console.log({ rBN, tr: typeof rBN });

      const r = convertToNumberString(rBN);

      console.log({ r });

      const sendValue = w3.utils.toBN(r);
      console.log({ sendValue });
      const nonce = await w3.eth.getTransactionCount(fromAddr, "latest"); // nonce starts counting from 0

      console.log("selectedChain.chainId = ", selectedChain);

      let chainId = Number(await w3.eth.getChainId());
      console.log("chainId =", chainId);

      const transaction = {
        from: fromAddr,
        to: sendTo, //to address
        value: sendValue,
        // gasLimit: gasLimit,
        // gasPrice: gasPrice,
        // maxFeePerGas: maxFeePerGas,
        // maxPriorityFeePerGas: maxPriorityFeePerGas,
        nonce: nonce,
        chainId: chainId,
      };

      if (chainId === 1 || chainId === 137) {
        delete transaction.gasPrice;
        transaction["type"] = "0x2";
      } else {
        delete transaction.maxFeePerGas;
        delete transaction.maxPriorityFeePerGas;
      }

      console.log("raw txxxxx 0: ", transaction);

      const resp = await w3.eth.sendTransaction(transaction);
      console.log({ resp });

      const signedTx = await w3.eth.signTransaction(transaction);
      console.log("signedTx : ", signedTx);
    } catch (e) {
      console.log({ e });
    }
  };

  const sendTokenAmountTransaction = async () => {
    console.log("selectedChain.chainId = ", selectedChain);
    const nonce = await w3.eth.getTransactionCount(fromAddr, "latest");

    let chainId = Number(await w3.eth.getChainId());

    const instance = new w3.eth.Contract(abi, contractAddress);
    let decimals = await instance.methods.decimals().call();

    const rBN = `${tokenAmount * Math.pow(10, decimals)}`;
    console.log({ rBN, tr: typeof rBN });

    const r = convertToNumberString(rBN);

    console.log({ r });

    const sendValue = w3.utils.toBN(r);
    const data = await instance.methods
      .transfer(tokenSendTo, sendValue)
      .encodeABI();

    console.log("decimals = ", decimals);

    console.log({ sendValue });

    const transaction = {
      from: fromAddr,
      to: contractAddress, //to address
      data: data,
      value: "0x0",
      // gasLimit: gasLimit,
      // gasPrice: gasPrice,
      // maxFeePerGas: maxFeePerGas,
      // maxPriorityFeePerGas: maxPriorityFeePerGas,
      nonce: nonce,
      chainId: chainId,
    };

    console.log("chainId = ", chainId, typeof chainId);

    if (chainId === 1 || chainId === 137) {
      delete transaction.gasPrice;
      transaction["type"] = "0x2";
    } else {
      delete transaction.maxFeePerGas;
      delete transaction.maxPriorityFeePerGas;
    }

    console.log("raw txxxxx 1: ", transaction);

    const resp = await w3.eth.sendTransaction(transaction);
    console.log(resp);

    const signedTx = await w3.eth.signTransaction(transaction);
    console.log("signedTx : ", signedTx);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header__logo">
          <img src="/Safle_Logo.png" />
        </div>
        <div className="header__title">
          <h1>Safle Keyless Demo</h1>
        </div>
        <div
          className={"header__connect " + (connect ? "disconnect" : "connect")}
          onClick={onClickConnection}
          // () => setConnect(!connect)}
        >
          <button>
            <span className="outer">
              <span className="inner">&nbsp;</span>
            </span>
            {connect ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>
      <div className="main">
        <div className="main__form">
          <div className="top_box box">
            <div className="top_box_left">
              <div className="button_relative">
                <label>Account Address</label>
                <input
                  placeholder="Enter your account address"
                  value={fromAddr}
                />
                <button
                  className="blue_button"
                  onClick={async () => {
                    keyless.selectChain();
                  }}
                >
                  Change Account
                </button>
              </div>
              <div class="button_relative">
                <label>Selected chain</label>
                <input
                  type="text"
                  placeholder="Selected chain"
                  value={selectedChain.chain?.network}
                />
                <button
                  className="blue_button"
                  onClick={async () => {
                    keyless.selectChain();
                  }}
                >
                  Change Chain
                </button>
              </div>
              <div>
                <label>Balance</label>
                <div className="balance">
                  <p>
                    {userBalance} {selectedChain.chain?.symbol}
                  </p>
                  <button className="refresh_button" onClick={refreshBalance}>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <button
              className="blue_button"
              onClick={async () => {
                setAddress(w3, keyless);
                // keyless.selectChain();
              }}
            >
              Get Account
            </button>

            {/* <button
              className="blue_button"
              onClick={async () => {
                keyless.openDashboard();
              }}
            >
              Open dashboard
            </button> */}

            <div className="top_box_right">
              <div>
                <label>Send</label>
                <input
                  type="text"
                  placeholder="To"
                  onChange={(e) => setSendTo(e.target.value)}
                />
              </div>
              <div>
                <label>Amount</label>
                <input
                  type="number"
                  placeholder={`Amount in ${
                    selectedChain.chain?.symbol
                      ? selectedChain.chain?.symbol
                      : "Matic"
                  }`}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Gas Limit"
                  onClick={(e) => setGasLimit(e.target.value)}
                  onBlur={(e) => setGasLimit(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="gas Price"
                  onClick={(e) => setGasPrice(e.target.value)}
                  onBlur={(e) => setGasPrice(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="max Fee Per Gas"
                  onClick={(e) => setMaxFeePerGas(e.target.value)}
                  onBlur={(e) => setMaxFeePerGas(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="max Priority Fee Per Gas"
                  onClick={(e) => setMaxPriorityFeePerGas(e.target.value)}
                  onBlur={(e) => setMaxPriorityFeePerGas(e.target.value)}
                />
              </div>
              <div>
                <label></label>
              </div>
              <div>
                <button
                  className="blue_button button_2"
                  onClick={sendAmountTransaction}
                >
                  Go
                </button>
              </div>
            </div>
          </div>
          <div className="bottom_box">
            <div className="bottom_box_left box">
              <div>
                <label>Sign Message</label>
                <textArea
                  type="text"
                  placeholder="Sign Message"
                  value={messageToSign}
                  onChange={(e) => setMessageToSign(e.target.value)}
                />
              </div>
              <div className="signature">
                <div>
                  <label>Signature</label>
                  <input
                    type="text"
                    placeholder="Signature"
                    value={messageSignature}
                    disabled
                  />
                </div>
                <button
                  className="button_2 blue_button"
                  style={{ marginBottom: "16px" }}
                  onClick={signMessage}
                >
                  Go
                </button>
              </div>
            </div>
            <div className="bottom_box_right box">
              <div>
                <label>Send Token/ Swap Token</label>
                <input
                  type="text"
                  placeholder="To"
                  onChange={(e) => setTokenSendTo(e.target.value)}
                />
              </div>
              <div>
                <div>
                  <input
                    type="text"
                    placeholder="Contract address"
                    onClick={(e) => setContractAddress(e.target.value)}
                    onBlur={(e) => setContractAddress(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Token Amount"
                  onClick={(e) => setTokenAmount(e.target.value)}
                  onBlur={(e) => setTokenAmount(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Gas Limit"
                  onClick={(e) => setGasLimit(e.target.value)}
                  onBlur={(e) => setGasLimit(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="gas Price"
                  onClick={(e) => setGasPrice(e.target.value)}
                  onBlur={(e) => setGasPrice(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="max Fee Per Gas"
                  onClick={(e) => setMaxFeePerGas(e.target.value)}
                  onBlur={(e) => setMaxFeePerGas(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="max Priority Fee Per Gas"
                  onClick={(e) => setMaxPriorityFeePerGas(e.target.value)}
                  onBlur={(e) => setMaxPriorityFeePerGas(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <button
                  className="blue_button"
                  style={{ padding: "14px 0px", width: "55%" }}
                  onClick={async () => {
                    let tokens = await keyless.getCurrentNetworkTokens();
                    console.log({ tokens });
                    setUserAvailableTokens(tokens);
                  }}
                >
                  Go Tokens
                </button>
                <button
                  className="blue_button button_2"
                  onClick={sendTokenAmountTransaction}
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
