import { createWalletClient, custom, createPublicClient, defineChain, parseEther, formatEther } from "https://esm.sh/viem";
import {contractAddress, abi} from "./constants-js.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");

let walletClient;
let publicClient;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        await walletClient.requestAddresses(); // responsible for connecting to the wallet
        connectButton.innerHTML = "Connected!";
    } else {
        connectButton.innerHTML = "Please install a supported wallet";
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}...`);
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        const [connectedAccount] = await walletClient.requestAddresses(); //responsible for connecting to the wallet
        //connectButton.innerHTML = "Connected!";
        const currentChain = await getCurrentChain(walletClient)
    

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount), //turns 1 => 100000000

        });
        console.log(request);
        const hash = await walletClient.writeContract(request);
        console.log(hash);
        console.log("Success!");
    } else {
        console.error("Please install a supported wallet");
    }
    
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  })
  return currentChain
}
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum)
    });
    publicClient = createPublicClient({
      transport: custom(window.ethereum)
    })
  }
  const balance = await publicClient.getBalance({address: contractAddress});
  console.log(formatEther(balance)); //is the opposite of parseEther. Turns 100000000 => 1
  
}

async function withdraw() {
    console.log("Withdrawing funds...");
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        const [connectedAccount] = await walletClient.requestAddresses(); //responsible for connecting to the wallet
        const currentChain = await getCurrentChain(walletClient)
    
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "withdraw",
            account: connectedAccount,
            chain: currentChain,

        });
        console.log(request);
        const hash = await walletClient.writeContract(request);
        console.log(hash);
        console.log("Withdrawal Success!");
    } else {
        console.error("Please install a supported wallet");
      }
}

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;