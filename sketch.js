var dog,sadDog,happyDog, database;
var foodS,foodStock;
var feed, lastFed, feedTimeVal;
var addFood, feedTheDog;
var foodObj;
var foodVal, feedVal;

//create feed and lastFed variable here


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed = database.ref("feed");
  feed.on("value",readFeed);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedTheDog = createButton("Feed the dog");
  feedTheDog.position(700,95);
  feedTheDog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database HTMLSourceElement
  feedTimeVal = database.ref("feedTime");
  feedTimeVal.on("value",function(data) {
    lastFed = data.val();
  });
 
  //write code to display text lastFed time here
  fill("white");
  textSize(30);
  if (lastFed >= 12) {
    text("ultima refeição: " + lastFed + "pm",200,100);
  }
  else {
    text("ultima refeição: " + lastFed + "am",200,100);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function readFeed(data) {
  feed = data.val();
  foodObj.updateQtdFeed(feed); 

  console.log(feed);
}

function feedDog(){
  dog.addImage(happyDog);
  foodVal = foodObj.getFoodStock();
  feedVal = foodObj.getQtdFeed();
  if (foodVal > 0) {
    foodObj.updateFoodStock(foodVal-1);
    foodObj.updateQtdFeed(feedVal+1);
  }
  else {
    foodObj.updateFoodStock(foodVal*0);
  }

  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feed: foodObj.getQtdFeed(),
    feedTime: hour()
  })
  //write code here to update food stock and last fed time

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
