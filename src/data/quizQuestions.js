import water from "../assets/water.jpg";
import food from "../assets/food.jpg";
import help from "../assets/help.jpg";
import sleep from "../assets/sleep.jpg";
import tv from "../assets/tv.jpg";
import music from "../assets/music.jpg";
import play from "../assets/play.jpg";
import happy from "../assets/happy.jpg";
import toilet from "../assets/toilet.jpg";
import medicine from "../assets/medicine.jpg";

export const quizQuestions = [
  {
    question: { en: "Water", ta: "தண்ணீர்" },
    img: water,
    options: [
      { en: "Water", ta: "தண்ணீர்", img: water },
      { en: "Food", ta: "உணவு", img: food },
      { en: "TV", ta: "டிவி", img: tv },
    ],
  },
  {
    question: { en: "Food", ta: "உணவு" },
    img: food,
    options: [
      { en: "Sleep", ta: "தூக்கம்", img: sleep },
      { en: "Food", ta: "உணவு", img: food },
      { en: "Help", ta: "உதவி", img: help },
    ],
  },
  {
    question: { en: "Help", ta: "உதவி" },
    img: help,
    options: [
      { en: "Yes", ta: "ஆம்", img: help },
      { en: "Help", ta: "உதவி", img: help },
      { en: "No", ta: "இல்லை", img: help },
    ],
  },
  {
    question: { en: "Sleep", ta: "தூக்கம்" },
    img: sleep,
    options: [
      { en: "Play", ta: "விளையாடு", img: play },
      { en: "Sleep", ta: "தூக்கம்", img: sleep },
      { en: "Music", ta: "இசை", img: music },
    ],
  },
  {
    question: { en: "TV", ta: "டிவி" },
    img: tv,
    options: [
      { en: "TV", ta: "டிவி", img: tv },
      { en: "Toilet", ta: "கழிப்பறை", img: toilet },
      { en: "Food", ta: "உணவு", img: food },
    ],
  },
  {
    question: { en: "Music", ta: "இசை" },
    img: music,
    options: [
      { en: "Medicine", ta: "மருந்து", img: medicine },
      { en: "Music", ta: "இசை", img: music },
      { en: "Water", ta: "தண்ணீர்", img: water },
    ],
  },
  {
    question: { en: "Play", ta: "விளையாடு" },
    img: play,
    options: [
      { en: "Sleep", ta: "தூக்கம்", img: sleep },
      { en: "Play", ta: "விளையாடு", img: play },
      { en: "Help", ta: "உதவி", img: help },
    ],
  },
  {
    question: { en: "Happy", ta: "மகிழ்ச்சி" },
    img: happy,
    options: [
      { en: "Sad", ta: "சோகம்", img: happy },
      { en: "Happy", ta: "மகிழ்ச்சி", img: happy },
      { en: "Pain", ta: "வலி", img: happy },
    ],
  },
  {
    question: { en: "Toilet", ta: "கழிப்பறை" },
    img: toilet,
    options: [
      { en: "Toilet", ta: "கழிப்பறை", img: toilet },
      { en: "TV", ta: "டிவி", img: tv },
      { en: "Food", ta: "உணவு", img: food },
    ],
  },
  {
    question: { en: "Medicine", ta: "மருந்து" },
    img: medicine,
    options: [
      { en: "Water", ta: "தண்ணீர்", img: water },
      { en: "Medicine", ta: "மருந்து", img: medicine },
      { en: "Play", ta: "விளையாடு", img: play },
    ],
  },
];

export const totalQuizQuestions = quizQuestions.length;
