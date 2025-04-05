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

        
        loadPages();
    } else {
        alert("Please install MetaMask!");
    }
    
};

async function loadPages() {
    const pagesTable = document.getElementById("pages");
    pagesTable.innerHTML = ""; // Clear any existing rows

    // Create table headers dynamically
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>Name</th>
        <th>Followers</th>
        <th>Username</th>
        <th>Password</th>
        <th>Price</th>
        <th>Sold</th>
        <th>Action</th>
    `;
    pagesTable.appendChild(headerRow);

    try {
        const totalPages = await contract.methods.pagesLength().call();

        for (let i = 0; i < totalPages; i++) {
            const page = await contract.methods.getPageDetails(i).call();
            
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${page[0]}</td>
                <td>${page[1]}</td>
                <td>Hidden</td>
                <td>Hidden</td>
                <td>${web3.utils.fromWei(page[4], "ether")} EDU</td>
                <td>${page[5] ? "Yes" : "No"}</td>
                <td>${!page[5] ? `<button onclick="buyPage(${i})">Buy</button>` : ""}</td>
            `;
            pagesTable.appendChild(row);
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
