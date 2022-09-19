const btn = document.querySelector(".btn");
const content1 = document.querySelector(".content1");
const content2 = document.querySelector(".content2");
// JArvis' replies
var finalText;

//speaking function
const speak = (sentance) => {
  const tts = new SpeechSynthesisUtterance(sentance);

  tts.rate = 0.9;
  tts.pitch = 0.2; // 0 = deep voice

  window.speechSynthesis.speak(tts);
};

//greeting function
const goodTime = () => {
  const day = new Date();
  const hr = day.getHours();

  if (hr >= 0 && hr < 12) {
    speak("Good morning.");
  } else if (hr >= 12 && hr <= 15) {
    speak("Good afternoon.");
  } else {
    speak("Good evening.");
  }
};

window.addEventListener("load", () => {
  //goodTime();
  //speak("Press the start button to begin talking!");
});

//initilizing speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  console.log("Recogniton activated.");
};

recognition.onresult = async (event) => {
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  //displaying user's command
  content1.textContent = "You: " + transcript.replace(",", "");
  utter(transcript.toLowerCase());
  //displaying  jarvis' responses
  content2.textContent = "Jarvis: " + finalText;
};

recognition.onend = () => {
  console.log("Recognition deactivated");
};

//adding functionality to the btn
btn.addEventListener("click", () => {
  recognition.start();
});

//speech synthesis function
async function utter(message) {
  const speech = new SpeechSynthesisUtterance();
  //greeting
  if (
    message.includes("hey") ||
    message.includes("hi") ||
    message.includes("hello")
  ) {
    finalText = "Hi there, how can i assist you?";
    speech.text = finalText;
  } else if (message.includes("your name")) {
    finalText = "My name is Jarvis. ";
    speech.text = finalText;
  } else if (
    message.includes("how you doing") ||
    message.includes("how are you") ||
    message.includes("how are you doing")
  ) {
    finalText =
      feeling[Math.floor(Math.random() * feeling.length)] +
      "" +
      ". how can i help you";
    speech.text = finalText;
  } else if (message.includes("what day is today")) {
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const d = new Date();
    let day = weekday[d.getDay()];

    finalText = `Today is ${day}, ${date}`;
    speech.text = finalText;
  } else if (message.includes("date")) {
    const date = new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
    finalText = `Today's date is ${date}`;
    speech.text = finalText;
  } //weather
  else if (message.includes("weather")) {
    const low = await getLow();
    const hi = await getHi();
    const temp = await getTemp();
    const desc = await getDesc();

    finalText = `The weather currently seems to have a temperature of around ${temp} degrees, with highest reaching ${hi} and lowest being ${low} and generally ${desc} `;

    speech.text = finalText;

    //weather window
    // window.open("https://openweathermap.org/city/365137");
  } else if (message.includes("time")) {
    const time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    finalText = `It's currently ${time}`;
    speech.text = finalText;
  } else if (
    message.includes("add to the list") ||
    message.includes("add to list") ||
    message.includes("add item") ||
    message.includes("add to do") ||
    message.includes("add to-do") ||
    message.includes("add to my list") ||
    message.includes("new item") ||
    message.includes("add item") ||
    message.includes("new task")
  ) {
    speak("what would you like to add?");
    var todo = prompt("");
    todolist.push(todo);
    finalText = `the item ${todo} was added to the list.`;
    speech.text = finalText;
  } else if (
    message.includes("show to do") ||
    message.includes("showlist") ||
    message.includes("show list") ||
    message.includes("show my list") ||
    message.includes("show items") ||
    message.includes("show the list") ||
    message.includes("show the new list") ||
    message.includes("show me the list")
  ) {
    finalText = "Your list contains " + todolist.join("  and  ");
    speech.text = finalText;
  } else if (
    message.includes("remove from the list") ||
    message.includes("remove item") ||
    message.includes("delete item") ||
    message.includes("remove task")
  ) {
    todolist.pop(todo);
    finalText = "List updated";
    speech.text = finalText;
  } else if (message.includes("tech news")) {
    const news = await techNews();
    const url = await techurl();
    finalText = ` in the latest news about tech, ${news}.`;
    speech.text = finalText;
  } else if (message.includes("latest news")) {
    const news = await bbcNews();
    finalText = ` In today's latest news, ${news}, source: BBC news`;
    speech.text = finalText;
  } else if (message.includes("open twitter")) {
    finalText = "opening Twitter";
    speech.text = finalText;
    window.open("https://twitter.com/home");
  } else if (message.includes("open youtube")) {
    finalText = "opening Youtube";
    speech.text = finalText;
    window.open("https://youtube.com");
  } else if (message.includes("open instagram")) {
    finalText = "opening Instagram";
    speech.text = finalText;
    window.open("https://instagram.com");
  } else {
    finalText =
      "I don't know that, but here's some results about " +
      message +
      " on Google.";
    // window.open(`https://google.com/search?q=${message}`);
    speech.text = finalText;
  }
  //changing voice
  const voices = speechSynthesis.getVoices();
  speech.voice = voices[0];
  speech.volume = 2;
  speech.rate = 0.9;
  speech.pitch = 0.2;

  window.speechSynthesis.speak(speech);
}

var todolist = ["get a haircut ", "eat pizza"];

var loc = [];

const date = new Date().toLocaleString(undefined, {
  month: "short",
  day: "numeric",
});

//get news
async function techNews() {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=technology&apiKey=36b957073a144351bab058c5f3e1ac0b`
  ).catch((err) => console.error("cannot fetch news at the moment: ", err));
  const data = await response.json();
  console.log(data);
  const article1 = data.articles[0].title;
  const article2 = data.articles[1].title;
  const articles = [article2, article1];
  return articles.join(", and in other news, ");
}

//fetching latest news from BBC
async function bbcNews() {
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=36b957073a144351bab058c5f3e1ac0b`
  ).catch((err) => console.error(err));

  const data = await response.json();
  console.log(data);
  const article1 = data.articles[0].title;
  const article2 = data.articles[2].title;
  const articles = [article1, article2];
  return articles.join(", and also, ");
}

//must run once before the voice actually change
window.onload = function () {
  speak("  ");
};

const feeling = ["i'm feeling great", "Feeling good", "feeling awesome"];

//getting temperature
async function getTemp() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Omdurman&appid=30a1575e1b07da55883e59393dc1bb94`
  ).catch((err) => console.error("cannot fetch weather: ", err));
  const data = await response.json(); //data in a json object
  const c = data.main.temp;
  const tempC = c - 273;
  const finalTemp = tempC.toFixed(); // for a nice round number
  return finalTemp;
}

//lowest temp
async function getLow() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Omdurman&appid=30a1575e1b07da55883e59393dc1bb94`
  ).catch((err) => console.error("cannot fetch weather: ", err));
  const data = await response.json();
  const c = data.main.temp_min;
  const tempC = c - 273;
  const minTemp = tempC.toFixed(); // for a nice round number
  return minTemp;
}

//highest temp
async function getHi() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Omdurman&appid=30a1575e1b07da55883e59393dc1bb94`
  ).catch((err) => console.error("cannot fetch weather: ", err));
  const data = await response.json();
  const c = data.main.temp_max;
  const tempC = c - 273;
  const maxTemp = tempC.toFixed(); // for a nice round number
  return maxTemp;
}

// weather description
async function getDesc() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Omdurman&appid=30a1575e1b07da55883e59393dc1bb94`
  ).catch((err) => console.error("cannot fetch weather: ", err));

  const data = await response.json();
  //console.log(data); //weather data json object
  const desc = data.weather[0].description; // weather description
  return desc;
}
