using System;
using Com.Expload;

[Program]
class Pawnshop {
    /* Gametoken balances - imitation of the  */
    Mapping<Bytes, int> balances = new Mapping<Bytes, int>();

    /* Rare items from the game */
    Mapping<Bytes, int> userGameItem = new Mapping<Bytes, int>();

    Mapping<int, int> gameItemPrice = new Mapping<int, int>();
    Mapping<int, String> gameItemName = new Mapping<int, String>();
    Mapping<int, Bytes> gameItemOwner = new Mapping<int, Bytes>();
    Mapping<int, Bytes> gameItemUser = new Mapping<int, Bytes>();

    //////////////////////////////////////////////
    /////////////////////// Constructor
    public bool initHasNotBeenLaunched = true;

    public int GameItemsTotal = 0;
    public int maxPricePawnshopPercent = 70;

    /* Contract admin */
    public Bytes ContractAdmin = Info.Sender();

    public void initContract()
    {
        if (initHasNotBeenLaunched)
        {
            ContractAdmin = Info.Sender();
            /* Mine some tokens to contract Admin for simulation purposes */
            _mintGametoken(150000000);
        }
        initHasNotBeenLaunched = false;
    }

    //////////////////////////////////////////////
    /////////////////////// Pawnshop methods

    public void initiatePawnTransaction(int _tokenId)
    {
        Bytes owner = gameItemOwner.getDefault(_tokenId, new Bytes(Convert.ToByte(0)));
        if (Info.Sender() != owner) return;

        int willReturnMoney = maxPricePawnshopPercent * gameItemPrice.getDefault(_tokenId, 0);
        if (willReturnMoney <= 0) return;

        if (balances.getDefault(ContractAdmin, 0) < willReturnMoney) return;

        balances.put(ContractAdmin, balances.getDefault(ContractAdmin, 0) - willReturnMoney);
        balances.put(owner, balances.getDefault(owner, 0) + willReturnMoney);

        gameItemOwner.put(_tokenId, ContractAdmin);
    }

    public void finishPawnTransaction(int _tokenId)
    {
        Bytes sender = Info.Sender();
        int willReturnMoney = maxPricePawnshopPercent * gameItemPrice.getDefault(_tokenId, 0);
        if (balances.getDefault(sender, 0) < willReturnMoney) return;

        balances.put(ContractAdmin, balances.getDefault(ContractAdmin, 0) + willReturnMoney);
        balances.put(sender, balances.getDefault(sender, 0) - willReturnMoney);
        gameItemOwner.put(_tokenId, sender);
    }

    public void changePawnshopPercent(int _newPercent)
    {
        if (Info.Sender() == ContractAdmin) {
            maxPricePawnshopPercent = _newPercent;
        }
    }

    //////////////////////////////////////////////
    /////////////////////// Getters

    public int gameItemOf(Bytes _itemOwner)
    {
        return userGameItem.getDefault(_itemOwner, 0);
    }

    public int balanceOf(Bytes _tokenOwner)
    {
        return balances.getDefault(_tokenOwner, 0);
    }

    public Bytes getContractAdmin() {
        return ContractAdmin;
    }

    public Bytes getGameItemOwner(int _tokenId) {
        return gameItemOwner.getDefault(_tokenId, new Bytes(Convert.ToByte(0)));
    }

    public Bytes getGameItemUser(int _tokenId) {
        return gameItemUser.getDefault(_tokenId, new Bytes(Convert.ToByte(0)));
    }

    //////////////////////////////////////////////
    /////////////////////// Transfers

    public void transfer(Bytes _to, int _tokens)
    {
        if (_tokens <= 0) return;
        if (balances.getDefault(Info.Sender(), 0) < _tokens) return;

        balances.put(Info.Sender(), balances.getDefault(Info.Sender(), 0) - _tokens);
        balances.put(_to, balances.getDefault(_to, 0) + _tokens);
    }

    public void transferOwnership(int _tokenId, Bytes _to)
    {
        if (Info.Sender() != gameItemOwner.getDefault(_tokenId, new Bytes(Convert.ToByte(0))))
          return;

        if(_tokenId == 0) return;
        if(_to == new Bytes(Convert.ToByte(0))) return;

        gameItemOwner.put(_tokenId, _to);
    }

    //////////////////////////////////////////////
    /////////////////////// Minting for simulation purposes
    public void mintGametoken(int _tokens)
    {
        _mintGametoken(_tokens);
    }

    private void _mintGametoken(int _tokens)
    {
        balances.put(Info.Sender(), _tokens);
    }

    public void mintGameItem()
    {
        GameItemsTotal += 1;
        userGameItem.put(Info.Sender(), GameItemsTotal);
        gameItemName.put(GameItemsTotal, "Very Cool Sword");
        gameItemPrice.put(GameItemsTotal, 1000);
        gameItemOwner.put(GameItemsTotal, Info.Sender());
        gameItemUser.put(GameItemsTotal, Info.Sender());
    }
}

class MainClass { public static void Main() {} }
