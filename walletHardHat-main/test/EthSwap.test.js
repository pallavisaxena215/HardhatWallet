const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n){
    return new web3.utils.toWei(n,'ether');
}

contract('EthSwap', async (accounts)=>{
    let ethswap
    let token

    beforeEach(async() =>{
        
         token = await Token.deployed();
         ethswap = await EthSwap.deployed(token.address);
    })
    describe('EthSwap Deployment',async ()=>{
        

        it('contract has name',async ()=>{
           
            const name = await ethswap.name();
            assert.equal(name,'EthSwap Instant Exchange')
        })

        it('has tokens',async ()=>{
           
            const balance = await token.balanceOf(ethswap.address)
            assert.equal(balance.toString(),'1000000000000000000000000')
        })

    })

    describe('Token Deployment',async ()=>{
        it('token contract is deployed',async ()=>{
           
            const name = await token.name();
            assert.equal(name,'Procial Token')
        })

    
    })


    describe('Buy Tokens', async()=>{
       let result
        before(async()=>{
            result = await ethswap.buyTokens({from: accounts[1], value: '10000000000000000'})
        })
        it('allows token to be bought',async() =>{
          let investorBalance = await token.balanceOf(accounts[1])
            assert.equal(investorBalance.toString(),'2500000000000000000000')
               
        })


       /* it('deducts tokens from  EthSwap ',async() =>{
            let ethbalance = await token.balanceOf(ethswap.address)
              assert.equal(ethbalance,'997500')
  
          }) */
  

          it('generates event of token transfer',async() =>{
           const event = result.logs[1].args
           console.log(result.logs)
             assert.equal(event.account, accounts[1])
             assert.equal(event.token, token.address)
            
          })
  


          describe('sellTokens()', async () => {
            let result
        
            before(async () => {
              // Investor must approve tokens before the purchase
              await token.approve(ethswap.address, '2500000000000000000000', { from: accounts[1] })
              // Investor sells tokens
              result = await ethswap.sellTokens('2500000000000000000000', { from: accounts[1] })
            })
        
            it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
              // Check investor token balance after purchase
              let investorBalance = await token.balanceOf(accounts[1])
              assert.equal(investorBalance.toString(), '0')
             
    
            })


            it('Check ethSwap balance after purchase', async () => {
            
          
                // Check ethSwap balance after purchase
                let ethSwapBalance
                ethSwapBalance = await token.balanceOf(ethswap.address)
                assert.equal(ethSwapBalance.toString(), '1000000000000000000000000')
                ethSwapBalance = await web3.eth.getBalance(ethswap.address)
                assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))
          
               
      
              })
          })
        

    })
})