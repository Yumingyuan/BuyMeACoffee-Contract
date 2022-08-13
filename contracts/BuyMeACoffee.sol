// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract BuyMeACoffee {
    // emit Event when a Memo created
    event NewMemo(
        address indexed sender,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct

    struct Memo{
        address sender;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of Memo from friend

    Memo [] memos;

    // address of owner
    address payable owner;

    // mapping of whitelist
    mapping(address=>bool) withdrawal_address;

    //deploy contract logic

    constructor()
    {
        owner = payable(msg.sender);
        withdrawal_address[owner]=true;
    }

    /**
     * @dev buy coffee for the owner
     * @param _name name of the coffee buyer
     * @param _message message send from coffee buyer
     */
    function buyCoffee(string memory _name,string memory _message) payable public{
        require(msg.value > 0,"Can not pay with 0 ether");
        //push to the memos list
        memos.push( Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //Emit a log event when new memo created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
    );

    }

    /**
     * @dev sending all balance to owner
     */
    function withdrawTips() public {
        require(address(this).balance > 0,"The balance reaches zero");
        require(withdrawal_address[msg.sender] == true,"Address must permit to withdraw");
        payable(msg.sender).transfer(address(this).balance);
    }

    /**
     * @dev retrive all memos on blockchain
     * @return memos
     */
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

    /**
     * @dev set withdrawl permission for special address
     * @param _name address infromation for special account
     */
    function set_permission(address _name) public{
        withdrawal_address[_name]=true;
    }

}
