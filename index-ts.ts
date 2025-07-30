import { 
    createWalletClient, 
    custom, 
    createPublicClient, 
    defineChain, 
    parseEther, 
    formatEther,
    WalletClient,
    PublicClient,
    Chain,
    Address,
    Hash
} from "viem";
import "viem/window"
import { contractAddress, abi } from "./constants-ts.ts";

// DOM element type assertions
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement;
const getAddressToAmountButton = document.getElementById("getAddressToAmountButton") as HTMLButtonElement;

// Global variables 
let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

async function connect(): Promise<void> {
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

async function fund(): Promise<void> {
    const ethAmount: string = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}...`);
    
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        
        const addresses = await walletClient.requestAddresses();
        const connectedAccount: Address = addresses[0]; // responsible for connecting to the wallet
        const currentChain: Chain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        
        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount), // turns 1 => 100000000
        });
        
        console.log(request);
        const hash: Hash = await walletClient.writeContract(request);
        console.log(hash);
        console.log("Success!");
    } else {
        console.error("Please install a supported wallet");
    }
}

async function getCurrentChain(client: WalletClient): Promise<Chain> {
    const chainId = await client.getChainId();
    const currentChain: Chain = defineChain({
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
    });
    return currentChain;
}

async function getBalance(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
    }
    
    if (publicClient) {
        const balance = await publicClient.getBalance({ address: contractAddress });
        console.log(formatEther(balance)); // is the opposite of parseEther. Turns 100000000 => 1
    }
}

async function withdraw(): Promise<void> {
    console.log("Withdrawing funds...");
    
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        
        const addresses = await walletClient.requestAddresses();
        const connectedAccount: Address = addresses[0]; // responsible for connecting to the wallet
        const currentChain: Chain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        
        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "withdraw",
            account: connectedAccount,
            chain: currentChain,
        });
        
        console.log(request);
        const hash: Hash = await walletClient.writeContract(request);
        console.log(hash);
        console.log("Withdrawal Success!");
    } else {
        console.error("Please install a supported wallet");
    }
}
async function getAddressesToAmount(): Promise<void> {
    if (typeof window.ethereum === "undefined") {
        console.error("Please install a supported wallet");
        return;
    }

    try {
        // Initialize publicClient first
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        // Get all funders with better error handling
        let funderIndex = 0;
        const funders: Address[] = [];
        
        try {
            // First try to get the first funder to check if there are any
            const firstFunder = await publicClient.readContract({
                address: contractAddress,
                abi,
                functionName: 'getFunder',
                args: [BigInt(0)]
            }) as Address;

            funders.push(firstFunder);

            // Then get the rest
            while (true) {
                funderIndex++;
                try {
                    const funder = await publicClient.readContract({
                        address: contractAddress,
                        abi,
                        functionName: 'getFunder',
                        args: [BigInt(funderIndex)]
                    }) as Address;
                    
                    if (funder === '0x0000000000000000000000000000000000000000') {
                        break; // Stop if we hit an empty address
                    }
                    
                    funders.push(funder);
                } catch (error) {
                    // Break the loop when we've gotten all funders
                    break;
                }
            }

            if (funders.length === 0) {
                console.log("No funders found");
                return;
            }

            console.log(`Found ${funders.length} funders`);

            // Get amounts for each funder
            for (const funder of funders) {
                const amount = await publicClient.readContract({
                    address: contractAddress,
                    abi,
                    functionName: 'getAddressToAmountFunded',
                    args: [funder]
                });
                
                console.log(`Address: ${funder} funded: ${formatEther(amount)} ETH`);
            }

        } catch (error) {
            console.error("Error reading funders:", error);
            throw error; // Re-throw to be caught by outer try-catch
        }

    } catch (error) {
        console.error("Failed to get funders and amounts:", error);
    }
}

// Event listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
getAddressToAmountButton.onclick = getAddressesToAmount;