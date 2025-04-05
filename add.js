const contractAddress = "0xd7f256fe8Bc1F1B6176D2D0f65a130D2b8d43d02";
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pageId",
				"type": "uint256"
			}
		],
		"name": "buyPage",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_followers",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listPage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "pageId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "followers",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "PageListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "pageId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "PageSold",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pageId",
				"type": "uint256"
			}
		],
		"name": "getPageDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "pages",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "followers",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "password",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "sold",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pagesLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];



let web3;
let contract;

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(abi, contractAddress, { from: accounts[0] });

        const walletAddress = document.getElementById("walletAddress");
        walletAddress.innerText = `Connected Wallet: ${accounts[0]}`;
        
    } else {
        alert("Please install MetaMask!");
    }
    
};

const listPageForm = document.getElementById("listPageForm");
listPageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const followers = document.getElementById("followers").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const price = web3.utils.toWei(document.getElementById("price").value, "ether");

    try {
        await contract.methods.listPage(name, followers, username, password, price).send();
        alert("Page listed successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to list page.");
    }
});

async function loadPages() {
    const pagesDiv = document.getElementById("pages");
    pagesDiv.innerHTML = "";
    try {
        const totalPages = await contract.methods.pagesLength().call();

        for (let i = 0; i < totalPages; i++) {
            const page = await contract.methods.getPageDetails(i).call();
            const div = document.createElement("div");
            div.innerHTML = `
                <p>Name: ${page[0]}</p>
                <p>Followers: ${page[1]}</p>
                <p>Username: ${"Hidden"}</p>
                <p>Password: ${"Hidden"}</p>
                <p>Price: ${web3.utils.fromWei(page[4], "ether")} ETH</p>
                <p>Sold: ${page[5] ? "Yes" : "No"}</p>
                ${!page[5] ? `<button onclick="buyPage(${i})">Buy</button>` : ""}
            `;
            pagesDiv.appendChild(div);
        }
    } catch (error) {
        console.error("Error loading pages:", error);
    }
}




async function buyPage(pageId) {
    try {
        const page = await contract.methods.getPageDetails(pageId).call();
        const price = page[4];

        await contract.methods.buyPage(pageId).send({ value: price });
        alert("Page purchased successfully!");

        // Reload page details after purchase
        const updatedPage = await contract.methods.getPageDetails(pageId).call();

        // Show username and password in an alert
        alert(`Username: ${updatedPage[2]}\nPassword: ${updatedPage[3]}`);

        // Reload the pages list
        loadPages();
    } catch (error) {
        console.error("Error buying page:", error);
        alert("Failed to purchase the page.");
    }
}



