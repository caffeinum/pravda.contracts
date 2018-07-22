pragma solidity ^0.4.23;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

}



/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
/// @author Dieter Shirley <dete@axiomzen.co> (https://github.com/dete)
contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);

    // Optional
    // function name() public view returns (string name);
    // function symbol() public view returns (string symbol);
    // function tokensOfOwner(address _owner) external view returns (uint256[] tokenIds);
    // function tokenMetadata(uint256 _tokenId, string _preferredTransport) public view returns (string infoUrl);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}


contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender)
    public view returns (uint256);

  function transferFrom(address from, address to, uint256 value)
    public returns (bool);

  function approve(address spender, uint256 value) public returns (bool);
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}

contract Pawnshop is Ownable {
    ERC20 _mainToken = ERC20(0x14a52cf6B4F68431bd5D9524E4fcD6F41ce4ADe9);

    uint256 _loanTime = 7 days;

    mapping (address => mapping (uint256 => Loan)) loans;

    struct Loan {
      uint256 loanValue;
      uint256 returnValue;
      uint256 expiresAt;
    }

    /* function _onERC721Received (address _operator, address _from,
                                uint256 _tokenId, bytes _data)
                                public {}


    function _onERC20Received (address _token, address _from, uint256 value)
                                public {} */

    function _calculatePrice(address _gameTokenContract, uint256 _tokenId)
      pure internal returns (uint256 price) {

      return uint256(70);
    }

    function takeLoan(address _gameTokenContract, uint256 _tokenId) {
      ERC721 token = ERC721(_gameTokenContract);
      /* require(token.transferFrom(msg.sender, this, _tokenId)); */

      uint256 price = _calculatePrice(_gameTokenContract, _tokenId);
      loans[_gameTokenContract][_tokenId] = Loan(
        price,
        price * 2,
        now + _loanTime
      );

      _mainToken.transferFrom(this, msg.sender, price);
    }

    function payLoan(address _gameTokenContract, uint256 _tokenId) public payable {
        Loan memory loan = loans[_gameTokenContract][_tokenId];
        require(_mainToken.transferFrom(msg.sender, this, loan.returnValue));

        ERC721 token = ERC721(_gameTokenContract);
        token.transferFrom(this, msg.sender, _tokenId);
    }

    function buyLoan(address _gameTokenContract, uint256 _tokenId) public payable {
        Loan memory loan = loans[_gameTokenContract][_tokenId];
        require(now > loan.expiresAt);
        require(_mainToken.transferFrom(msg.sender, this, loan.returnValue));

        ERC721 token = ERC721(_gameTokenContract);
        token.transferFrom(this, msg.sender, _tokenId);
    }
}
