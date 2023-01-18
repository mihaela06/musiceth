// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/** An invalid price was set. A positive price (> 0) is required.
 */
error PriceCannotBeNegative();

/** The function can be called only by the owner of the token.
 */
error CanBeCalledOnlyByOwner();

/** The function cannot be called by the owner of the token.
 */
error CannotBeCalledByOwner();

/** Cannot place on sale an NFT that is already listed on the market.
 * @param tokenId ID of the NFT
 */
error AlreadyOnSale(uint256 tokenId);

/** Cannot but an NFT without paying a value equal to the listing price.
 * @param askingPrice Price of the NFT
 * @param txValue Value of the transaction
 */
error PriceNotMet(uint256 askingPrice, uint256 txValue);

contract AudioNFT is ERC721URIStorage {
    struct NFT {
        uint256 tokenId;
        address artist;
        bool isOnSale;
        uint256 price;
    }

    /**
     * @notice Modifier for verifying the price cannot be 0 or negative
     * @param price Price of the NFT
     */
    modifier notNegativePrice(uint256 price) {
        if (price <= 0) revert PriceCannotBeNegative();

        _;
    }

    /**
     * @notice Modifier for verifying the caller of the function is the owner of the NFT.
     * @param tokenId ID of the NFT
     */
    modifier onlyOwner(uint256 tokenId) {
        if (ERC721.ownerOf(tokenId) != msg.sender)
            revert CanBeCalledOnlyByOwner();

        _;
    }

    /**
     * @notice Modifier for verifying the caller of the function is not the owner of the NFT.
     * @param tokenId ID of the NFT
     */
    modifier isNotOwner(uint256 tokenId) {
        if (ERC721.ownerOf(tokenId) == msg.sender)
            revert CannotBeCalledByOwner();

        _;
    }

    /**
     * @notice Modifier for verifying the transaction value is equal to the price of the NFT.
     * @param askingPrice Price of the NFT
     * @param txValue Value of the transaction
     */
    modifier isPriceMet(uint256 askingPrice, uint256 txValue) {
        if (askingPrice != txValue) revert PriceNotMet(askingPrice, txValue);

        _;
    }

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping(uint256 => NFT) private _idToNFT;
    uint256[] private _idNFTs;

    // Artists will get ARTIST_SHARE% of the NFT buying price at each resale
    uint256 public constant ARTIST_SHARE = 10;

    constructor() ERC721("AudioNFT", "AudioNFT") {}

    /**
     * @notice Method for minting a new AudioNFT that will also be put up for sale.
     * @param tokenURI IPFS URI containing NFT metadata
     * @param price Price of the NFT
     */
    function mintNFT(
        string memory tokenURI,
        uint256 price
    ) external notNegativePrice(price) returns (uint256) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _idNFTs.push(newTokenId);
        _idToNFT[newTokenId] = NFT(newTokenId, msg.sender, false, price);

        sellNFT(newTokenId, price);

        return newTokenId;
    }

    function sellNFT(
        uint256 tokenId,
        uint256 price
    ) public onlyOwner(tokenId) notNegativePrice(price) {
        _idToNFT[tokenId].isOnSale = true;
        _idToNFT[tokenId].price = price;
    }

    function buyNFT(
        uint256 tokenId
    )
        public
        payable
        isPriceMet(_idToNFT[tokenId].price, msg.value)
        isNotOwner(tokenId)
    {
        address artist = _idToNFT[tokenId].artist;
        address seller = ERC721.ownerOf(tokenId);
        address buyer = msg.sender;

        uint256 totalPrice = _idToNFT[tokenId].price;
        uint256 artistShare = (totalPrice / 100) * ARTIST_SHARE;
        uint256 sellerShare = totalPrice - artistShare;

        _idToNFT[tokenId].isOnSale = false;

        _transfer(seller, buyer, tokenId);
        payable(seller).transfer(sellerShare);
        payable(artist).transfer(artistShare);
    }

    function getNFTs() public view returns (NFT[] memory) {
        uint256 count = _idNFTs.length;
        NFT[] memory tokens = new NFT[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = _idNFTs[i];
            tokens[i] = _idToNFT[tokenId];
        }

        return tokens;
    }

    function getOwnNFTs() public view returns (NFT[] memory) {
        uint256 count = _idNFTs.length;
        NFT[] memory tokens = new NFT[](count);
        uint256 tokenIndex = 0;

        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = _idNFTs[i];
            if (ERC721.ownerOf(tokenId) == msg.sender) {
                tokens[tokenIndex] = _idToNFT[tokenId];
                tokenIndex++;
            }
        }

        return tokens;
    }

    function updatePriceOfNFT(
        uint256 tokenId,
        uint256 newPrice
    ) external notNegativePrice(newPrice) {
        NFT memory token = _idToNFT[tokenId];
        token.price = newPrice;
    }

    function getOnSaleNFTs() public view returns (NFT[] memory) {
        uint256 count = _idNFTs.length;
        NFT[] memory tokens = new NFT[](count);
        uint256 tokenIndex = 0;

        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = _idNFTs[i];
            NFT memory token = _idToNFT[tokenId];
            if (token.isOnSale) {
                tokens[tokenIndex] = token;
                tokenIndex++;
            }
        }
        return tokens;
    }
}
