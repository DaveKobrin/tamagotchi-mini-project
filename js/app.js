//===================================================================
// PetAttribute
//===================================================================
class PetAttribute {
    value = 0;
    
    /**
     * increase or decrease value by amount
     * @param {*} amount //default to increment by 1, negative values decrease value
     */
    setValue(amount = 1) {
    this.value += amount;
    if (this.value < 0)
        this.value = 0;
    }

    getVal() { return this.value }
}

//===================================================================
// TamagotchiStage - container for data specific to a growth stage
//===================================================================
class TamagotchiStage {
    imageLink = '';
    imageSize = { x: 75, y: 75 };
    ageBeforeGrowth = 10;

}

//===================================================================
// Tamagotchi - class to describe basic features of tamagotchi pets
//===================================================================
class Tamagotchi {
    // attributes
    name = '';
    petAttributes = {};
    updateTime = 60 * 15;   //15 seconds

    DEATH_LEVEL = 10;

    /**
     * constructor
     * @param name String
     */
    constructor(name) {
        this.name = name;
        this.petAttributes.age = new PetAttribute();
        this.petAttributes.hunger = new PetAttribute();
        this.petAttributes.sleepy = new PetAttribute();
        this.petAttributes.bored = new PetAttribute();
    }

    // setters
    /**
     * reset name
     * @param {*} name 
     */
    setName(name) { this.name = name; }
    incAge() { this.petAttributes.age.setValue(); }
    incHunger() { this.petAttributes.hunger.setValue(); }
    incSleepy() {  this.petAttributes.sleepy.setValue(); }
    incBored() {  this.petAttributes.bored.setValue(); }

    feed() { this.petAttributes.hunger.setValue(-2); }
    play() { this.petAttributes.bored.setValue(-2); }
    sleep() { this.petAttributes.sleepy.setValue(-2); }

    updateAttributes() {
        this.incAge();
        this.incHunger();
        this.incSleepy();
        this.incBored();
    }

    //getters
    getName() { return this.name; }
    getAge() { return this.petAttributes.age.getVal() }
    getHunger() { return this.petAttributes.hunger.getVal() }
    getSleepy() { return this.petAttributes.sleepy.getVal() }
    getBored() { return this.petAttributes.bored.getVal() }
    getUpdateTime() { return this.updateTime }


    displayAttributes() {
        for ( let key of Object.keys(this.petAttributes)) {
            console.log(key, this.petAttributes[key].getVal());
        }
    }
}

//initialize
const pet = new Tamagotchi('');
let tickCount = 0;
prompt('Please enter a name for your new friend.');
//setup callbacks

// game loop
const tick = () => {
    if (tickCount++ % pet.getUpdateTime() === 0){
        pet.updateAttributes();
        pet.displayAttributes();
    }
    if (tickCount % 5000 === 0) {
        pet.feed();
        pet.play();
        pet.sleep();
        pet.displayAttributes();
    }
    console.log("ticking");
    tickCount %= 1e9;   //prevent overflow
}
const tickID = setInterval(tick,(1000/60));