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
// Tamagotchi - class to describe basic features of tamagotchi pets
//===================================================================
class Tamagotchi {
    // attributes
    name = '';
    petAttributes = {};

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

    //getters
    getName() { return this.name; }
    getAge() { return this.petAttributes.age.getVal() }
    getHunger() { return this.petAttributes.hunger.getVal() }
    getSleepy() { return this.petAttributes.sleepy.getVal() }
    getBored() { return this.petAttributes.bored.getVal() }

}