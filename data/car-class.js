class Car{
    brand;
    model;
    speed;
    isTrunkOpen;

    constructor(brand, model){
        this.brand = brand;
        this.model = model;
        this.speed = 0;
        this.isTrunkOpen = false;
    }

    displayInfo(){
        console.log(`${this.brand} ${this.model}, speed: ${this.speed} km/h, Trunk: ${this.isTrunkOpen ? 'Open' : 'Close'}`);
    }

    go(){
        if(!this.isTrunkOpen && this.speed <= 195){
            this.speed += 5;
        }
    }

    break(){
        if(this.speed >= 5){
            this.speed -= 5;
        }
    }

    openTrunk(){
        if(speed == 0){
            this.isTrunkOpen = true;
        }
    }

    closeTrunk(){
        this.isTrunkOpen = false;
    }
}

const car1 = new Car('Toyota', 'Corolla');
const car2 = new Car('Tesla', 'Model 3');

car1.displayInfo();
car2.displayInfo();

car1.go();
car2.go();

car1.go();
car2.go();

car1.break();

car1.displayInfo();
car2.displayInfo();

class RaceCar extends Car{
    acceleration;

    constructor(brand, model, acceleration){
        super(brand, model);
        this.acceleration = acceleration;
    }

    displayInfo(){
        console.log(`${this.brand} ${this.model}, speed: ${this.speed} km/h`);
    }

    go(){
        this.speed += this.acceleration;
    }

    openTrunk(){}
    closeTrunk(){}
}

const rcar1 = new RaceCar('McLaren', 'F1', 20);

rcar1.go();
rcar1.go();

rcar1.displayInfo();