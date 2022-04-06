//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Store {
    struct Item {
        uint256 price;
        uint256 units;
        uint256 val3;
        uint256 val4;
        uint256 val5;
        uint256 val6;
        uint256 val7;
        uint256 val8;
    }

    Item[] public items;

    address value;

    function newItem(uint256 _price, uint256 _units) public {
        // Type struct SimpleStore.Item memory is not implicitly convertible to expected type struct SimpleStore.Item storage pointer.
        // Item storage item = Item(_price, _units);
        Item memory item = Item(_price, _units, 0, 0, 0, 0, 0, 0);
        items.push(item);
    }

    function getWithStorage(uint256 _itemIdx) public view returns (uint256) {
        Item storage item = items[_itemIdx];
        return item.units;
    }

    function getWithMemory(uint256 _itemIdx) public view returns (uint256) {
        Item memory item = items[_itemIdx];
        return item.units;
    }

    function addUnitsWithStorage(uint256 _itemIdx, uint256 _units) public {
        Item storage item = items[_itemIdx];
        item.units += _units;
    }

    function addUnitsWithMemory(uint256 _itemIdx, uint256 _units) public view {
        Item memory item = items[_itemIdx];
        item.units += _units;
    }
}
