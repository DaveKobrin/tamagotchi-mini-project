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
    prefix = '';

    /**
     * construct new TamagotchiStage. image link and prefix are required!
     * @param {*} imageLink
     * @param {*} prefix
     * @param {*} szX 
     * @param {*} szY 
     * @param {*} ageBeforeGrowth 
     */
    constructor(imageLink, prefix, ageBeforeGrowth=10, szX = 150, szY=150) {
        this.imageLink = imageLink;
        this.prefix = prefix;
        this.imageSize.x = szX;
        this.imageSize.y = szY;
        this.ageBeforeGrowth = ageBeforeGrowth;
    }

    //setters - none setup in constructor

    // getters
    getImageLink() { return this.imageLink; }
    getPrefix() { return this.prefix; }
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
    updateTime = 60 * 5;   //15 seconds (60fps)
    petStages = [];
    currentStage = 0;
    timeoutID = null;

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

        this.petStages.push(new TamagotchiStage("./assets/fish_egg.png", "egg", 4));
        this.petStages.push(new TamagotchiStage("./assets/fish_baby.png", "fish", 8));
        this.petStages.push(new TamagotchiStage("./assets/fish_teen.png", "fish", 12));
        this.petStages.push(new TamagotchiStage("./assets/fish_grown.png", "fish", Infinity));

    }

    init() {
        for ( let key of Object.keys(this.petAttributes)) {
            this.petAttributes[key].setValue(-10000);
        }
        this.currentStage = 0;
        this.setPetStage(this.currentStage);
        this.displayAttributes();
    }

    // setters
    setName(name) {
        this.name = name;
        this.setPetStage(this.currentStage);
    }

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

    feed() { 
        this.cancelTimeout();
        this.petAttributes.hunger.setValue(-2);
        this.displayAttributes();
        this.setAnimation('feed');
        this.setIdleReturn(3000);
    }

    play() { 
        this.cancelTimeout();
        this.petAttributes.bored.setValue(-2);
        pet.displayAttributes();
        this.setAnimation('play');
        this.setIdleReturn(2000);
    }
    
    sleep() {
        this.cancelTimeout();
        this.petAttributes.sleepy.setValue(-2);
        pet.displayAttributes();
        this.setAnimation('sleep');
        this.toggleLight(false);
        this.setIdleReturn(6000);
    }

    updateAttributes() {
        this.incAge();
        this.incHunger();
        this.incSleepy();
        this.incBored();
        pet.displayAttributes();
        if (this.getBored() >= 10 || this.getHunger() >= 10 || this.getSleepy() >= 10) {
            quitFunc();
            this.setAnimation('dead');
        }
    }

    setPetStage(stage) {
        if (stage < 0 || stage >= this.petStages.length) {
            console.log('ERROR, bad pet stage');
            return;
        }
        const charDiv = document.querySelector('#character');
        let str = `<p class="nametag">${this.getName()}</p><img id="charImg" src="${this.petStages[stage].getImageLink()}">`
        console.log(str);
        charDiv.innerHTML = str;
        this.setAnimation('idle');
    }

    setAnimation(anim) {
        document.querySelector('#charImg').className = `${this.petStages[this.currentStage].getPrefix()}-${anim}`;
    }

    setIdleReturn(delay) {
        this.timeoutID = setTimeout(()=>{ 
                pet.setAnimation('idle');
                pet.toggleLight();
                this.timeoutID = null; 
            }, delay);
    }

    toggleLight(on = true) {
        document.querySelector('#viewport').className = (on ? '' : 'dark');
    }

    cancelTimeout() {
        if (this.timeoutID !== null) {
            clearTimeout(this.timeoutID);
            this.toggleLight();
            this.timeoutID = null;
        }
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
        const hunger = document.querySelector('#hunger');
        const sleepy = document.querySelector('#sleepy');
        const bored = document.querySelector('#bored');

        hunger.innerHTML = `Hunger : ${this.getHunger()}`;
        sleepy.innerHTML = `Tiredness : ${this.getSleepy()}`;
        bored.innerHTML = `Boredom : ${this.getBored()}`;

    }
}
const quitFunc = ()=>{ /* do quit stuff here */
    if(tickID === null) {
        //start game timer
        pet.init();
        tickCount = 1;
        tickID = setInterval(tick,(1000/60));
        quitBtn.innerHTML = 'quit';
    } else {
        clearInterval(tickID)
        quitBtn.innerHTML = 'replay';
        tickID = null;
    }
}


const initCallbacks = ()=> {
    const feedBtn = document.querySelector('#feedBtn');
    const sleepBtn = document.querySelector('#sleepBtn');
    const playBtn = document.querySelector('#playBtn');
    const quitBtn = document.querySelector('#quitBtn');
    const renameBtn = document.querySelector('#renameBtn');
    const instructBtn = document.querySelector('#instructionsBtn');
    const inName = document.querySelector('#nameInput');
  
    feedBtn.addEventListener('click',()=>{ pet.feed() });
    sleepBtn.addEventListener('click',()=>{ pet.sleep() });
    playBtn.addEventListener('click',()=>{ pet.play() });
    renameBtn.addEventListener('click',()=>{ pet.setName(inName.value) });
    instructBtn.addEventListener('click',()=>{ /*do instruct stuff here */ });
    quitBtn.addEventListener('click', quitFunc);
 }

// game loop
const tick = () => {
    if (tickCount++ % pet.getUpdateTime() === 0){
        pet.updateAttributes();
    }
    // console.log("ticking");
    tickCount %= 1e9;   //prevent overflow
}


//initialize globals
const pet = new Tamagotchi('');
let tickCount = 1;
let tickID = null;

//setup callbacks
initCallbacks();

