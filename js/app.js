//===================================================================
// PetAttribute
//===================================================================
class PetAttribute {
    value = 0;
    displayName = '';

    /**
     * construct a new PetAttribute
     * @param {*} displayName 
     * @param {*} initialValue 
     */
    constructor(displayName = '', initialValue = 0) {
        this.displayName = displayName;
        this.value = initialValue;
    }

    /**
     * increase or decrease value by amount
     * @param {*} amount //default to increment by 1, negative values decrease value
     */
    setValue(amount = 1) {
    this.value += amount;
    if (this.value < 0)
        this.value = 0;
    }

    setDisplayName(displayName) { this.displayName = displayName; }

    getVal() { return this.value; }
    getDisplayName() { return this.displayName; }
}

//===================================================================
// TamagotchiStage - container for data specific to a growth stage
//===================================================================
class TamagotchiStage {
    imageLink = '';
    imageSize = { x: 150, y: 150 };
    ageBeforeGrowth = 10;

    /**
     * construct new TamagotchiStage. image link is required!
     * @param {*} imageLink 
     * @param {*} szX 
     * @param {*} szY 
     * @param {*} ageBeforeGrowth 
     */
    constructor(imageLink, ageBeforeGrowth=10, szX = 150, szY=150) {
        this.imageLink = imageLink;
        this.imageSize.x = szX;
        this.imageSize.y = szY;
        this.ageBeforeGrowth = ageBeforeGrowth;
    }

    //setters - none setup in constructor

    // getters
    getImageLink() { return this.imageLink; }
    getImageSize() { return this.imageSize; }
    getAgeBeforeGrowth() { return this.ageBeforeGrowth; }

}

//===================================================================
// Tamagotchi - class to describe basic features of tamagotchi pets
//===================================================================
class Tamagotchi {
    // attributes
    name = '';
    petAttributes = {};
    updateTime = 60 * 15;   //15 seconds (60fps)
    petStages = [];
    currentStage = 0;

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

        this.petStages.push(new TamagotchiStage("./assets/fish_egg.png", 2));
        this.petStages.push(new TamagotchiStage("./assets/fish_baby.png", 6));
        this.petStages.push(new TamagotchiStage("./assets/fish_teen.png", 12));
        this.petStages.push(new TamagotchiStage("./assets/fish_grown.png", Infinity));

    }

    // setters
    /**
     * reset name
     * @param {*} name 
     */
    setName(name) { this.name = name; }
    incAge() { 
        this.petAttributes.age.setValue(); 
        if (this.getAge() >= this.petStages[this.currentStage].getAgeBeforeGrowth()) {
            this.currentStage++;
            this.setPetStage(this.currentStage);
        }
    }
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

    setPetStage(stage) {
        if (stage < 0 || stage >= this.petStages.length) {
            console.log('ERROR, bad pet stage');
            return;
        }
        const charDiv = document.querySelector('#character');
        let str = `<img src="${this.petStages[stage].getImageLink()}">`
        console.log(str);
        charDiv.innerHTML = str;
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

//initialize globals
const pet = new Tamagotchi('');
let tickCount = 0;
// prompt('Please enter a name for your new friend.');
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