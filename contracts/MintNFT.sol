//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MintNFT is ERC721Enumerable {
    string metadataURI;
    uint maxSupply;

    constructor (string memory _name,string memory _symbol,string memory _metadataURI,uint _maxSupply) ERC721 (_name,_symbol){
        metadataURI=_metadataURI;
        maxSupply=_maxSupply;
    }

    function mintNFT()public {
        require(totalSupply()<500,"no more Mint.");
        uint tokenId=totalSupply()+1;
        _mint(msg.sender,tokenId);
    }
    function tokenURI(uint _tokenId) public view override returns (string memory){
        return string(abi.encodePacked(metadataURI,'/',Strings.toString(_tokenId),'.json'));
    }

}