//selsecting the HTML ITEMS
const btn = document.querySelector(".btn");
const content1 = document.querySelector(".content1");
const content2 = document.querySelector(".content2");
const coll = document.getElementsByClassName("collapsible");

//Collabsible menu
for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

// JArvis' responses
var finalText;

//must run once before the voice actually change
window.onload = function () {
  speak("  ");
};

//speaking function
const speak = (sentance) => {
  const tts = new SpeechSynthesisUtterance(sentance);
  const voices = speechSynthesis.getVoices();
  tts.voice = voices[1]; //changing the voice
  tts.rate = 1;
  tts.pitch = 1; // 0 = deep voice

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
  setTimeout(() => {
    goodTime();
    speak("We haven't met yet, i am Jarvis. What is your name?");
  }, 200);
});

//initilizing speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

//console results
recognition.onstart = () => {
  console.log("Recogniton activated.");
};

recognition.onresult = (event) => {
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  //displaying user's command
  content1.textContent = "You: " + transcript.replace(",", "");
  tts(transcript.toLowerCase());
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

//Jarvis responses (text to speech)
async function tts(message) {
  const speech = new SpeechSynthesisUtterance();
  //greetings
  if (
    message.includes("hey") ||
    message.includes("hi") ||
    message.includes("hello")
  ) {
    if (myName.length === 0) {
      finalText = "Hello stranger.";
    } else {
      finalText = `Hey, ${myName}, how can i help you?.`;
    }
    speech.text = finalText;
  }
  // telling jarvis your name
  else if (message.includes("my name is")) {
    const name = message.replace("my name is", " ");
    myName.push(name);
    finalText = `Nice meeting you, ${myName}.`;
    speech.text = finalText;
  } else if (
    message.includes("what's my name") ||
    message.includes("you don't know my name.") ||
    message.includes("what is my name")
  ) {
    if (myName.length === 0) {
      finalText = "Sorry, you didn't tell me your name.";
    } else {
      finalText = `Your name is ${myName}.`;
    }
    speech.text = finalText;
  } else if (
    message.includes("how you doing") ||
    message.includes("how are you") ||
    message.includes("how are you doing")
  ) {
    finalText = feeling[Math.floor(Math.random() * feeling.length)];

    speech.text = finalText;
  } //day query
  else if (message.includes("what day is today")) {
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

    finalText = `Today is ${day}, ${date}.`;
    speech.text = finalText;
  } //date
  else if (message.includes("date")) {
    const date = new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
    finalText = `Today's date is ${date}.`;
    speech.text = finalText;
  }
  //google search
  else if (
    message.includes("what is") ||
    message.includes("what are") ||
    message.includes("who is") ||
    message.includes("who are")
  ) {
    finalText = `Here's what i found on Google about ${message}.`;
    speech.text = finalText;
    window.open(`https://google.com/search?q=${message}`);
  } //where is
  else if (message.includes("where is")) {
    const place = message.replace("where is", " ");

    finalText = `Here's the location of ${place}`;
    speech.text = finalText;
    setTimeout(
      window.open(`https://www.google.com/maps/place/${place}/`),
      2000
    );
  } //locating on the map
  else if (message.includes("location of")) {
    const place = message.replace("location of", " ");

    finalText = `Opening Google maps. Here's the location of ${place}`;
    speech.text = finalText;
    setTimeout(
      window.open(`https://www.google.com/maps/place/${place}/`),
      2000
    );
  }

  //weather
  else if (message.includes("weather")) {
    const low = await getLow();
    const hi = await getHi();
    const temp = await getTemp();
    const desc = await getDesc();
    const response = `Right now it is ${desc}, with temprature of ${temp} degrees. The forecast shows a high of ${hi} and low of ${low} `;
    finalText = response;
    speech.text = finalText;

    window.open("https://openweathermap.org/city/365137");
  } //time
  else if (message.includes("time")) {
    const time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    finalText = `It's currently ${time}`;
    speech.text = finalText;
  } //adding item to list
  else if (message.includes("add")) {
    const thing = message.replace("add", " ");
    const item = thing.replace(".", ""); // created this to remove the annoying "." at the end
    mylist.push(item); //pushing the item into array
    finalText = `Okay, the item ${item} was added to the list.`;
    speech.text = finalText;
  } //showing list
  else if (
    message.includes("what's on my list") ||
    message.includes("what is on my list") ||
    message.includes("showlist") ||
    message.includes("show list") ||
    message.includes("show my list") ||
    message.includes("show items")
  ) {
    //checking if the list is empty
    if (mylist.length === 0) {
      finalText = "Your list is empty at the moment.";
    } else {
      finalText = "Your list contains  " + mylist.join("  and  ");
    }
    speech.text = finalText;
  } //removing item off the list
  else if (message.includes("remove")) {
    var thing = message.replace("remove ", "");
    var item = thing.replace(".", "");
    var index = mylist.indexOf(item);

    //checking if item exists
    if (item === "shopping") {
      mylist.shift();
      finalText = `The item ${item} was removed from your list.`;
    } else if (item === "dinner") {
      mylist.splice(1, 1);
      finalText = `The item ${item} was removed from your list.`;
    } else if (index === -1) {
      finalText = "There's no such item on your list.";
    } else {
      mylist.pop();
      finalText = `The item ${item} was removed from your list.`;
    }
    speech.text = finalText;
  } //clearing list
  else if (
    message.includes("clear my list") ||
    message.includes("clear items") ||
    message.includes("clear list") ||
    message.includes("clear item list")
  ) {
    mylist = [];
    finalText = "Your list has been cleared.";
    speech.text = finalText;
  }
  //getting latest articles from bbc
  else if (
    message.includes("latest news") ||
    message.includes("read me the news") ||
    message.includes("read the news")
  ) {
    const news = await bbcNews();

    finalText = ` In today's Top stories, ${news}, source: BBC news.`;
    speech.text = finalText;
  }
  //openning twitter
  else if (message.includes("open twitter")) {
    finalText = "opening Twitter";
    speech.text = finalText;
    window.open("https://twitter.com/home");
  } //opnening youtube
  else if (message.includes("open youtube")) {
    finalText = "opening Youtube";
    speech.text = finalText;
    window.open("https://youtube.com");
  } //opening instagram
  else if (message.includes("open instagram")) {
    finalText = "opening Instagram";
    speech.text = finalText;
    window.open("https://instagram.com");
  } else {
    finalText = "Here's what i found about " + message;
    window.open(`https://google.com/search?q=${message}`);
    speech.text = finalText;
  }
  //changing voice
  const voices = speechSynthesis.getVoices();
  speech.voice = voices[1];
  speech.volume = 2;
  speech.rate = 0.9;
  speech.pitch = 0.2;

  window.speechSynthesis.speak(speech);
}
//error messages
const idk = ["I don't think i know that, ", "Sorry i have no clue, "];

//name array
const myName = [];

//list array
var mylist = ["shopping ", "dinner "];

//date function
const date = new Date().toLocaleString(undefined, {
  month: "short",
  day: "numeric",
});

var newsApi = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=36b957073a144351bab058c5f3e1ac0b`;

//fetching latest news from BBC
async function bbcNews() {
  const response = await fetch(newsApi).catch((err) =>
    console.error("Cannot fetch: ", err)
  );

  const data = await response.json();
  console.log(data);
  const article1 = data.articles[0].title;
  const article2 = data.articles[2].title;
  const articles = [article1, article2]; //opted for 2 articles only
  return articles.join(", and also, ");
}

//must run once before the voice actually change
window.onload = function () {
  speak("  ");
};

const feeling = ["i'm feeling great", "Feeling good", "feeling awesome"];

var weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=Omdurman&appid=30a1575e1b07da55883e59393dc1bb94`;

//getting temperature
async function getTemp() {
  const response = await fetch(weatherApi).catch((err) =>
    console.error("cannot fetch: ", err)
  );
  const data = await response.json(); //data in a json object
  const c = data.main.temp;
  const tempC = c - 273;
  const finalTemp = tempC.toFixed(); // for a nice round number
  return finalTemp;
}

//lowest temp
async function getLow() {
  const response = await fetch(weatherApi).catch((err) =>
    console.error("cannot fetch: ", err)
  );
  const data = await response.json();
  const c = data.main.temp_min;
  const tempC = c - 273;
  const minTemp = tempC.toFixed(); // for a nice round number
  return minTemp;
}

//highest temp
async function getHi() {
  const response = await fetch(weatherApi).catch((err) =>
    console.error("cannot fetch: ", err)
  );
  const data = await response.json();
  const c = data.main.temp_max;
  const tempC = c - 273;
  const maxTemp = tempC.toFixed(); // for a nice round number
  return maxTemp;
}

// weather description
async function getDesc() {
  const response = await fetch(weatherApi).catch((err) =>
    console.error("cannot fetch: ", err)
  );

  const data = await response.json();
  const desc = data.weather[0].description; // weather description
  return desc;
}

const helpu = `how can i help you, ${myName}`;
