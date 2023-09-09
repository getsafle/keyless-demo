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
    const resp = await w3.eth.sign(message, fromAddr);

    console.log(resp);
    setMessageToSign("");
    setMessageSignature(resp.signature);
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

  const sendAmountTransaction = async () => {
    console.log({ sendTo, sendAmount });

    const sendValue = w3.utils.toBN(sendAmount * Math.pow(10, 18));
    console.log({ sendValue });
    // data = 0xa9059cbb0000000000000000000000002723a2756ecb99b3b50f239782876fb595728ac00000000000000000000000000000000000000000000000000de0b6b3a7640000
    const transaction = {
      from: fromAddr,
      to: sendTo, //to address
      value: sendValue,
      // 'gas': gas,
      // 'data': data,
      // 'nonce': nonce,
      // 'type': '0x2',
      // 'chainId': 137,
    };

    console.log("raw txxxxx : ", transaction);

    const resp = await w3.eth.sendTransaction(transaction);
    console.log({ resp });

    const signedTx = await w3.eth.signTransaction(transaction);
    console.log("signedTx : ", signedTx);
  };

  const [_tokenTo, setTokenTo] = useState("{}");
  const [tokenSendTo, setTokenSendTo] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);

  const sendTokenAmountTransaction = async () => {
    let tokenTo = JSON.parse(_tokenTo);
    console.log({ tokenSendTo, _tokenTo, tokenAmount, tokenTo });

    const toAddress = tokenSendTo;
    const contractAddress = tokenTo.tokenAddress.toLowerCase();

    const nonce = await w3.eth.getTransactionCount(fromAddr, "latest"); // nonce starts counting from 0

    const instance = new w3.eth.Contract(abi, contractAddress);

    const sendValue = w3.utils.toBN(
      tokenAmount * Math.pow(10, tokenTo.decimal)
    );
    console.log({ sendValue });

    // const sendValue = w3.utils.toBN(0.01 * Math.pow(10, 18));

    let data, gas, balance;

    data = await instance.methods.transfer(toAddress, sendValue).encodeABI();

    try {
      balance = await instance.methods.balanceOf(fromAddr).call();
      console.log("weenus balance : ", balance);
      gas = await instance.methods
        .transfer(toAddress, sendValue)
        .estimateGas({ from: fromAddr });
    } catch (e) {
      console.log("err", e);
    }

    console.log("dataaaaa : ", data);
    console.log("gassssss : ", gas);
    console.log("balanceeeeeee : ", balance);

    // data = 0xa9059cbb0000000000000000000000002723a2756ecb99b3b50f239782876fb595728ac00000000000000000000000000000000000000000000000000de0b6b3a7640000
    const transaction = {
      from: fromAddr,
      to: contractAddress, //to address
      value: 0,
      // 'gas': gas,
      data: data,
      // 'nonce': nonce,
      // 'type': '0x2',
      // 'chainId': 137,
    };

    console.log("raw txxxxx : ", transaction);

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
                <label>Send Token</label>
                <input
                  type="text"
                  placeholder="To"
                  onChange={(e) => setTokenSendTo(e.target.value)}
                />
              </div>
              <div>
                <div className="custom_select_box">
                  <div className="selected_menu_item">
                    <p>{JSON.parse(_tokenTo)?.symbol}</p>
                    <div onClick={() => setShowDropDown(!showDropDown)}>
                      <img src={"/arrow_dropdown_open.png"} />
                    </div>
                  </div>
                  {showDropDown && (
                    <div className="menu">
                      <div className="menu_label">Select Token</div>
                      {userAvailableTokens && userAvailableTokens.map((token) => (
                        <div
                          className="menuItems"
                          value={token}
                          key={token.addreses}
                          onClick={async () => {
                            setShowDropDown(false);
                            setTokenTo(JSON.stringify(token));
                          }}
                          style={{
                            background:
                              token?.symbol === JSON.parse(_tokenTo)?.symbol
                                ? "#E5EEFF"
                                : "#fff",
                            color:
                              token?.symbol === JSON.parse(_tokenTo)?.symbol
                                ? "#007AFF"
                                : "#6E6F7A",
                          }}
                        >
                          {token.symbol}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <label style={{ paddingTop: "10px" }}>
                  Balance:{" "}
                  <span style={{ color: "#000", fontWeight: "medium" }}>
                    {setTokenDecimal(
                      JSON.parse(_tokenTo)?.balance,
                      JSON.parse(_tokenTo)?.decimal
                    )}{" "}
                    {JSON.parse(_tokenTo)?.symbol}
                  </span>
                </label>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Token Amount"
                  onClick={(e) => setTokenAmount(e.target.value)}
                  onBlur={(e) => setTokenAmount(e.target.value)}
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
