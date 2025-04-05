// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract InstagramPageSeller {
    struct Page {
        string name;
        uint256 followers;
        string username;
        string password;
        uint256 price;
        address payable seller;
        bool sold;
    }

    Page[] public pages;

    event PageListed(uint256 indexed pageId, string name, uint256 followers, uint256 price, address seller);
    event PageSold(uint256 indexed pageId, address buyer);

    function listPage(
        string memory _name,
        uint256 _followers,
        string memory _username,
        string memory _password,
        uint256 _price
    ) public {
        pages.push(
            Page({
                name: _name,
                followers: _followers,
                username: _username,
                password: _password,
                price: _price,
                seller: payable(msg.sender),
                sold: false
            })
        );
        emit PageListed(pages.length - 1, _name, _followers, _price, msg.sender);
    }

    function buyPage(uint256 _pageId) public payable {
        require(_pageId < pages.length, "Page does not exist.");
        Page storage page = pages[_pageId];
        require(!page.sold, "Page already sold.");
        require(msg.value >= page.price, "Insufficient payment.");

        page.seller.transfer(msg.value);
        page.sold = true;

        emit PageSold(_pageId, msg.sender);
    }

    function getPageDetails(uint256 _pageId) public view returns (string memory, uint256, string memory, string memory, uint256, bool) {
        require(_pageId < pages.length, "Page does not exist.");
        Page storage page = pages[_pageId];

        if (page.sold && msg.sender != page.seller) {
            return (page.name, page.followers, page.username, "******", page.price, page.sold);
        }

        return (page.name, page.followers, page.username, page.password, page.price, page.sold);
    }
    
    function pagesLength() public view returns (uint256) {
        return pages.length;
    }

}