//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

/**
 * https://eips.ethereum.org/EIPS/eip-20
 */
contract LDToken is EIP712 {
    using Counters for Counters.Counter;

    mapping(address => Counters.Counter) private _nonces;

    mapping(address => uint256) _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 _totalSupply;

    string public name;
    string public symbol;

    // solhint-disable-next-line var-name-mixedcase
    bytes32 private immutable _PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(string memory name_, string memory symbol_) EIP712(name_, "2") {
        name = name_;
        symbol = symbol_;
    }

    function decimals() public pure returns (uint8) {
        return 6;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    /**
     * Transfers _value amount of tokens from address _from to address _to, and MUST fire the Transfer event.
     *
     * The transferFrom method is used for a withdraw workflow,
     * allowing contracts to transfer tokens on your behalf.
     * This can be used for example to allow a contract to transfer tokens on
     * your behalf and/or to charge fees in sub-currencies.
     * The function SHOULD throw unless the _from account has deliberately
     * authorized the sender of the message via some mechanism.
     *
     * Note Transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool success) {
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "LDToken: insufficient allowance");
        _allowances[from][msg.sender] = currentAllowance - amount;

        _transfer(from, to, amount);
        return true;
    }

    /**
     * Allows _spender to withdraw from your account multiple times,
     * up to the _value amount.
     * If this function is called again it overwrites the current allowance with _value.
     *
     * NOTE: To prevent attack vectors like the one described here and discussed here,
     * clients SHOULD make sure to create user interfaces in such a way
     * that they set the allowance first to 0 before setting it to another value for the same spender.
     * THOUGH The contract itself shouldn’t enforce it,
     * to allow backwards compatibility with contracts deployed before.
     */
    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }

    /**
     * Returns the amount which spender is still allowed to withdraw from owner.
     */
    function allowance(address owner, address spender)
        public
        view
        returns (uint256 remaining)
    {
        return _allowances[owner][spender];
    }

    function _mint(address account, uint256 amount) external virtual {
        _balances[account] += amount;
        _totalSupply += amount;

        emit Transfer(address(0), account, amount);
    }

    /**
     *
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) private {
        require(_balances[from] >= amount, "LDToken: amount exceeds balance");
        _balances[from] -= amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    /**
     * @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    /**
     * @dev See {IERC20Permit-nonces}.
     */
    function nonces(address owner) external view returns (uint256) {
        return _nonces[owner].current();
    }

    /**
     * @dev See {IERC20Permit-permit}.
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(block.timestamp <= deadline, "FiatTokenV2: permit is expired");

        bytes32 structHash = keccak256(
            abi.encode(
                _PERMIT_TYPEHASH,
                owner,
                spender,
                value,
                _useNonce(owner),
                deadline
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == owner, "EIP2612: invalid signature");

        _allowances[owner][spender] = value;
    }

    /**
     * @dev "Consume a nonce": return the current value and increment.
     */
    function _useNonce(address owner) internal returns (uint256 current) {
        Counters.Counter storage nonce = _nonces[owner];
        current = nonce.current();
        nonce.increment();
    }
}
