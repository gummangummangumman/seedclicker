import React, { Component } from 'react';
import ClickerButton from './ClickerButton.js';
import ImageButton from './ImageButton.js';
import Popup from './Popup.js';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);

        this.upgradeBasePrice = [ 10, 22, 1300, 180000, 5000000, 5000000000, 10, 4000];
        this.upgradestrenght = [ 1, 2, 10, 150, 2000, 2000000 ];
        this.priceScaling = 1.2;

        this.clickPercentagePriceScaling = 2;


        this.state = {
            value: 0,
            upgrades: Array(8).fill(0),
            vps : Array(5).fill(0),
            upgradePrice: this.upgradeBasePrice,
            popup : <div></div>
        };


        this.pictureFlipped = false;

        setTimeout(() => this.loadProgress(), 10);


        this.interval = setInterval( () => this.grantseeds(), 1000);
        this.saveInterval = setInterval(() => this.saveProgress(), 1000);
    }



    loadProgress()
    {
        const savedValue = localStorage.getItem("value");
        if(savedValue){
          let valueAsInt = parseInt(savedValue, 10);

          let savedUpgrades = Array(8).fill(0);
          savedUpgrades[0] = parseInt(localStorage.getItem("water-cans"), 10);
          savedUpgrades[1] = parseInt(localStorage.getItem("fertilizer-bags"), 10);
          savedUpgrades[2] = parseInt(localStorage.getItem("sprinklers"), 10);
          savedUpgrades[3] = parseInt(localStorage.getItem("tractors"), 10);
          savedUpgrades[4] = parseInt(localStorage.getItem("plantations"), 10);
          savedUpgrades[5] = parseInt(localStorage.getItem("suns"), 10);

          savedUpgrades[6] = parseInt(localStorage.getItem("click-power"), 10);
          savedUpgrades[7] = parseInt(localStorage.getItem("click-percentage"), 10);

          for(let i = 0; i < savedUpgrades.length; i++){
            if(isNaN(savedUpgrades[i])){
              savedUpgrades[i] = 0;
            }
          }

          this.setState(
            {value : valueAsInt,
              upgrades : savedUpgrades
            },
            () => {
              //Vps
              const upgrades = Object.values(this.state.upgrades);


                let newVps = Object.assign( {} , this.state.vps);

                //prices
                const newPrices = Object.assign( {} , this.state.upgradePrice);
                const basePrices = Object.values(this.upgradeBasePrice);

                for(let i = 0; i < 6; i++){
                    newVps[i] = upgrades[i] * this.upgradestrenght[i];
                    newPrices[i] = Math.floor(basePrices[i] * Math.pow(this.priceScaling, upgrades[i]));
                }

                newPrices[6] = this.calculateNewClickPrice(upgrades[6]);
                newPrices[7] = this.calculateNewClickPrice(upgrades[7], this.clickPercentagePriceScaling, 7);


                this.setState(
                  {
                    vps: newVps,
                    upgradePrice : newPrices
                  }
                )


              }
          );
          return true;
        }else{
          return false;
        }
    }

    saveProgress()
    {
      const upgrades = Object.values(this.state.upgrades);

      localStorage.setItem("value", this.state.value);
      localStorage.setItem("water-cans", upgrades[0]);
      localStorage.setItem("fertilizer-bags", upgrades[1]);
      localStorage.setItem("sprinklers", upgrades[2]);
      localStorage.setItem("tractors", upgrades[3]);
      localStorage.setItem("plantations", upgrades[4]);
      localStorage.setItem("suns", upgrades[5]);


      localStorage.setItem("click-power", upgrades[6]);
      localStorage.setItem("click-percentage", upgrades[7]);
    }

    reset()
    {
      this.setState(
        {
          value: 0,
          upgrades: Array(8).fill(0),
          vps : Array(5).fill(0),
          upgradePrice: this.upgradeBasePrice,
          popup : <div />
        },
        () => this.saveProgress()
      );
    }


    resetPopup()
    {
      let popup = <Popup
          closePopup={() => {this.setState(
            {popup : <div />}
          )} }

          onClick={() => {this.reset()}}

          closeButtonText="No"
          buttonText="Wipe my progress"

          content={
            <div>
            <h1>Are you sure you want to reset your progress?</h1>
            <p>This can not be undone.</p>
            </div>
          }

       />
        this.setState(
          {
            popup : popup
          }
        );
    }

    faqPopup()
    {
      let popup = <Popup


          closePopup={() => {this.setState(
            {popup : <div />}
          )} }

          closeButtonText="Okay, now I know what Seed Clicker is"

          content={
            <div>
              <h2>What is Seed Clicker?</h2>
              <p>Seed Clicker is a clicker/idle game. You play by clicking the friendly sunflower to earn seeds.
              You can use these seeds to buy helpful upgrades to earn even more seeds!</p>
              <p>There is no end to this game, you just try to get as many seeds as possible!</p>
              <p>Your progress is continuously saved locally. If your progress disappears between refreshes,
              check your browser settings for "local storage"</p>
            </div>
          }


       />
        this.setState(
          {
            popup : popup
          }
        );
    }


    grantseeds()
    {
      let seeds = this.totalVps();
      let newTotal = this.state.value + seeds;
      this.setState(
        {value : newTotal}
      );
    }





    buyUpgrade(i)
    {
        if(this.state.value >= this.state.upgradePrice[i]){
            let newUpgrades = Object.assign( {} , this.state.upgrades);
            newUpgrades[i] = (newUpgrades[i]+1);
            this.setState(
                            {upgrades : newUpgrades,
                            value : (this.state.value - this.state.upgradePrice[i])}
                          , () => {this.calculateVps(i); this.calculateNewPrice(i);}
                );
        }
    }

    calculateVps(i)
    {
        const upgrades = Object.values(this.state.upgrades);

        let newVps = Object.assign( {} , this.state.vps);
        newVps[i] = upgrades[i] * this.upgradestrenght[i];

        this.setState(
            { vps: newVps
            }
            );
    }

    totalVps()
    {
        return Object.values(this.state.vps).reduce((a, b) => a + b, 0);
    }

    calculateNewPrice(i)
    {
        const prices = Object.assign( {} , this.state.upgradePrice);
        const basePrices = Object.values(this.upgradeBasePrice);
        const upgrades = Object.values(this.state.upgrades);

        prices[i] = Math.floor(basePrices[i] * Math.pow(this.priceScaling, upgrades[i]));

        this.setState(
            { upgradePrice : prices
            }
            );
    }

    click()
    {
      this.pictureFlipped = (!this.pictureFlipped);
      let addedValue = 1 + this.state.upgrades[6] +  Math.ceil((this.state.upgrades[6]) * this.state.upgrades[7] * (Object.values(this.state.vps).reduce((a, b) => a + b, 0)/100));
      this.setState(
        {
          value : (this.state.value + addedValue)
        }
      )
    }

    buyClickUpgrade()
    {
      if(this.state.value >= this.state.upgradePrice[6]){
        const prices = Object.assign( {} , this.state.upgradePrice);
        const upgrades = Object.values(this.state.upgrades);
        prices[6] = this.calculateNewClickPrice(upgrades[6]+1);
        upgrades[6] = upgrades[6] + 1;
          this.setState(
                          { value: (this.state.value - this.state.upgradePrice[6]),
                            upgradePrice : prices,
                            upgrades : upgrades
                          }
              );
      }
    }

    buyClickPercentage()
    {
      if(this.state.value >= this.state.upgradePrice[7]){

        const prices = Object.assign( {} , this.state.upgradePrice);
        const upgrades = Object.values(this.state.upgrades);

        prices[7] = this.calculateNewClickPrice(upgrades[7]+1, this.clickPercentagePriceScaling, 7);
        upgrades[7] = upgrades[7] + 1;

        this.setState(
          { value: (this.state.value - this.state.upgradePrice[7]),
            upgradePrice : prices,
            upgrades : upgrades
          }
        )
      }
    }

    calculateNewClickPrice(newClickPower, factor=2, which=6)
    {
        return (Math.floor(this.upgradeBasePrice[which] * Math.pow(factor, newClickPower)));
    }

  render() {
    return (
      <div className="App">

      <title>Seeds: {nFormatter(this.state.value, 2)}</title>


      {this.state.popup}


        <p className="Seeds">
            Seeds: <b>{nFormatter(this.state.value)}</b>
        </p>
        <ImageButton
            onClick={() => this.click() }
            text = "gumman"
            picture = "http://gumman.one/pics/gumman.jpg"
            flipped = {this.pictureFlipped}
        />
        <p className="Vpc">
            Seeds per click: <b>{nFormatter(1 + this.state.upgrades[6] +  Math.ceil((this.state.upgrades[6]) * this.state.upgrades[7] * (Object.values(this.state.vps).reduce((a, b) => a + b, 0)/100)))}</b>
        </p>
        <p className="Vps">
            Seeds per second: <b>{nFormatter(Object.values(this.state.vps).reduce((a, b) => a + b, 0))}</b>
        </p>


        <table className="Upgrades">
            <tbody>
                <tr>
                    <td>
                        <ClickerButton
                            onClick = {() => this.buyUpgrade(0) }
                            text = "Buy Water Can"
                            price = {this.state.upgradePrice[0]}
                            value = {this.state.value}
                        />
                        <br />
                            cost: <b>{nFormatter(this.state.upgradePrice[0])}</b> seeds
                        <br />
                            you have <b>{nFormatter(this.state.upgrades[0])}</b> {(this.state.upgrades[0]===1) ? "water can" : "water cans"}
                        <br />
                            generating <b>{nFormatter(this.state.vps[0])}</b> seeds/s
                    </td>
                    <td>
                        <ClickerButton
                            onClick = {() => this.buyUpgrade(1) }
                            text = "Buy Fertilizer Bag"
                            price = {this.state.upgradePrice[1]}
                            value = {this.state.value}
                        />
                        <br />
                            cost: <b>{nFormatter(this.state.upgradePrice[1])}</b> seeds
                        <br />
                            you have <b>{nFormatter(this.state.upgrades[1])}</b> {(this.state.upgrades[1]===1) ? "fertilizer bag" : "fertilizer bags"}
                        <br />
                            generating <b>{nFormatter(this.state.vps[1])}</b> seeds/s
                    </td>
                    <td>
                        <ClickerButton
                            onClick = {() => this.buyUpgrade(2) }
                            text = "Buy Sprinkler"
                            price = {this.state.upgradePrice[2]}
                            value = {this.state.value}
                        />
                        <br />
                            cost: <b>{nFormatter(this.state.upgradePrice[2])}</b> seeds
                        <br />
                            you have <b>{nFormatter(this.state.upgrades[2])}</b> {(this.state.upgrades[2]===1) ? "sprinkler" : "sprinklers"}
                        <br />
                            generating <b>{nFormatter(this.state.vps[2])}</b> seeds/s
                    </td>
                    <td>
                        <ClickerButton
                            onClick = {() => this.buyUpgrade(3) }
                            text = "Buy Tractor"
                            price = {this.state.upgradePrice[3]}
                            value = {this.state.value}
                        />
                        <br />
                            cost: <b>{nFormatter(this.state.upgradePrice[3])}</b> seeds
                        <br />
                            you have <b>{nFormatter(this.state.upgrades[3])}</b> {(this.state.upgrades[3]===1) ? "tractor" : "tractors"}
                        <br />
                            generating <b>{nFormatter(this.state.vps[3])}</b> seeds/s
                    </td>

                </tr>
                <tr>
                <td>
                    <ClickerButton
                        onClick = {() => this.buyUpgrade(4) }
                        text = "Buy Plantation"
                        price = {this.state.upgradePrice[4]}
                        value = {this.state.value}
                    />
                    <br />
                        cost: <b>{nFormatter(this.state.upgradePrice[4])}</b> seeds
                    <br />
                        you have <b>{nFormatter(this.state.upgrades[4])}</b> {(this.state.upgrades[4]===1) ? "plantation" : "plantations"}
                    <br />
                        generating <b>{nFormatter(this.state.vps[4])}</b> seeds/s
                </td>
                <td>
                    <ClickerButton
                        onClick = {() => this.buyUpgrade(5) }
                        text = "Buy Sun"
                        price = {this.state.upgradePrice[5]}
                        value = {this.state.value}
                    />
                    <br />
                        cost: <b>{nFormatter(this.state.upgradePrice[5])}</b> seeds
                    <br />
                        you have <b>{nFormatter(this.state.upgrades[5])}</b> {(this.state.upgrades[5]===1) ? "sun" : "suns"}
                    <br />
                        generating <b>{nFormatter(this.state.vps[5])}</b> seeds/s
                </td>
                    <td>
                      <ClickerButton
                        onClick = {() => this.buyClickUpgrade() }
                        text = "Buy Clickpower"
                        price = {this.state.upgradePrice[6]}
                        value = {this.state.value}
                      />
                      <br />
                          cost: <b>{nFormatter(this.state.upgradePrice[6])}</b> seeds
                      <br />
                          you have <b>{nFormatter(this.state.upgrades[6]+1)}</b> clickpower
                    </td>
                    <td>
                      <ClickerButton
                        onClick = {() => this.buyClickPercentage() }
                        text = "Buy Click Percentage"
                        price = {this.state.upgradePrice[7]}
                        value = {this.state.value}
                      />
                      <br />
                          cost: <b>{nFormatter(this.state.upgradePrice[7])}</b> seeds
                      <br />
                          you get <b>{this.state.upgrades[7] }</b>% of your seeds/s * clickpower
                      <br />
                          each time you click
                    </td>
                </tr>
            </tbody>
        </table>

        <div id="footer">
          <span id="faq">
            <ClickerButton
              onClick = {() => this.faqPopup()}
              text = "What's this?"
            />
          </span>
          <span id="reset">
            <ClickerButton
              onClick = {() => this.resetPopup()}
              text = "Reset progress"
              />
          </span>
        </div>
      </div>
    );
  }
}








//Helper function
function nFormatter(num, digits=3) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: " k" },
    { value: 1E6, symbol: " million" },
    { value: 1E9, symbol: " billion" },
    { value: 1E12, symbol: " trillion" },
    { value: 1E15, symbol: " quadrillion" },
    { value: 1E18, symbol: " quintillion" },
    { value: 1E21, symbol: " sextillion"}
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export default App;
