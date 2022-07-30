pragma solidity ^0.5.0;
import './Token.sol';
contract EthSwap is Token{
  Token public token;
    string public name="EthSwap Instant Exchange";
    uint public rate;
    address owner;
    uint public start_time; 
    uint deadline;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate

    );


    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate

    );

constructor(Token _token) public {
  token = _token;
  rate=250000;
  owner=msg.sender;
  start_time = block.timestamp;
  deadline = 0;

}

function buyTokens() public payable{
  
    //1 eth = 250000 procialtokens
    uint tokenAmount = msg.value*rate ;
    require(token.balanceOf(address(this))>= tokenAmount, 'Not enough tokens left in the contract');
    token.transfer(msg.sender,tokenAmount);
    emit TokenPurchased(msg.sender,address(token),tokenAmount,rate);
}


function sellTokens(uint _amount) public {
    // User can't sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);
    //User cannot sell tokens before deadline
        uint user_deadline = now - start_time;
        require(user_deadline >= deadline , "The tokens are not available for sales");
       
      
    uint etherAmount = _amount / rate;

    // Require that EthSwap has enough Ether
    require(address(this).balance >= etherAmount);
    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);

    // Emit an event
    emit TokenSold(msg.sender, address(token), _amount, rate);
}


function changeRate(uint _rate) public onlyAdmin{
    rate= _rate;

}

function changeDeadline(uint _deadline) public onlyAdmin{
    deadline = _deadline;

}

modifier onlyAdmin(){
    require(msg.sender == owner,'You do not have the permissions to call this function');
    _;
}




}
