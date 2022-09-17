const btn = document.querySelector(".btn");
const content1 = document.querySelector(".content1");
const content2 = document.querySelector(".content2");

//speaking function
const speak = (sentance) => {
  const tts = new SpeechSynthesisUtterance(sentance);

  tts.rate = 0.9;
  tts.pitch = 0.5;

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
  // goodTime();
  // speak("Press the start button to begin talking!");
});

//initilizing speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  console.log("Recogniton activated.");
};

recognition.onresult = (event) => {
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  //displaying user's command
  content1.textContent = "You: " + transcript.replace(",", "");
  utter(transcript.toLowerCase());
  //displaying  jarvis' responses
  content2.textContent = "Jarvis: " + finalText.replace(".", " ");
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
  if (message.includes("hey") || message.includes("hello")) {
    finalText = "Hello, how can i help you?";
    speech.text = finalText;
  } else if (message.includes("your name")) {
    finalText = "My name is Jarvis. ";
    speech.text = finalText;
  } else if (
    message.includes("how you doing") ||
    message.includes("how are you doing")
  ) {
    finalText = "I am feeling great, how can i help you?";
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
    window.open(`https://google.com/search?q=${message}`);
    speech.text = finalText;
  }
  //changing voice
  const voices = speechSynthesis.getVoices();
  speech.voice = voices[1];
  speech.volume = 2;
  speech.rate = 0.9;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

var todolist = ["get a haircut ", "eat pizza"];

var loc = [];

var finalText;

const date = new Date().toLocaleString(undefined, {
  month: "short",
  day: "numeric",
});

//must run once before the voice changes so yeah had to be done :3
window.onload = function () {
  speak("  ");
};
