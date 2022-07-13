// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract SimpleAuction {
    address payable beneficiary;
    uint256 public auctionEndTime;

    bool ended;

    address public highestBidder;
    uint256 public highestBid;

    struct BidObj {
        uint256 amount;
        address bidder;
        bytes32 name;
    }

    BidObj[] public bids;

    mapping(address => BidObj) public bidders;

    mapping(address => uint256) pendingReturns;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event AuctionTimeSet(uint256 date);

    error AuctionAlreadyEnded();
    error BidNotHighEnough(uint256 amount);

    error AuctionNotYetEnded();
    error AuctionEndAlreadyCalled();

    constructor(address payable beneficiaryAddress) {
        beneficiary = beneficiaryAddress;
    }

    function init(uint256 biddingTime) external {
        auctionEndTime = biddingTime;
        emit AuctionTimeSet(auctionEndTime);
    }

    function getExpiryDate() external view returns (uint256) {
        return auctionEndTime;
    }

    function getOwner() external view returns (address) {
        return beneficiary;
    }

    function getBid(address bidder) external view returns (BidObj memory) {
        return bidders[bidder];
    }

    function getBids() external view returns (BidObj[] memory) {
        return bids;
    }

    function bid(bytes32 name) external payable {
        if (block.timestamp > auctionEndTime) revert AuctionAlreadyEnded();

        if (msg.value <= highestBid) revert BidNotHighEnough(highestBid);

        if (highestBid != 0) pendingReturns[highestBidder] += highestBid;

        highestBid = msg.value;
        highestBidder = msg.sender;
        bids.push(BidObj({bidder: msg.sender, amount: msg.value, name: name}));
        bidders[msg.sender] = BidObj({
            bidder: msg.sender,
            amount: msg.value,
            name: name
        });
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() external returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function auctionEnd() external {
        if (block.timestamp < auctionEndTime) revert AuctionNotYetEnded();
        if (ended) revert AuctionEndAlreadyCalled();
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        beneficiary.transfer(highestBid);
    }
}
