const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const proposalScreen = document.getElementById("proposalScreen");
const loveScreen = document.getElementById("loveScreen");
const messageScreen = document.getElementById("messageScreen");

const warningText = document.getElementById("warningText");
const heartsBg = document.getElementById("heartsBg");
const loveSong = document.getElementById("loveSong");

let noAttempts = 0;
let noEscaped = false;


/* =====================================
   FLOATING HEARTS BACKGROUND
===================================== */

function createHeart() {
    const heart = document.createElement("span");

    const hearts = ["❤️", "💕", "💖", "💗", "💓", "🩷"];

    heart.classList.add("floating-heart");

    heart.innerHTML =
        hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + "vw";

    heart.style.fontSize =
        Math.random() * 25 + 15 + "px";

    heart.style.animationDuration =
        Math.random() * 5 + 5 + "s";

    heart.style.animationDelay =
        Math.random() * 2 + "s";

    heartsBg.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 12000);
}

setInterval(createHeart, 700);


/* =====================================
   NO BUTTON RUNS AWAY
===================================== */

function moveNoButton() {
    if (noEscaped) return;

    noAttempts++;

    const buttonArea =
        document.querySelector(".button-area");

    const areaRect =
        buttonArea.getBoundingClientRect();

    const buttonWidth =
        noBtn.offsetWidth;

    const buttonHeight =
        noBtn.offsetHeight;

    /*
      After first escape,
      make the button absolute
      so it can freely move around.
    */
    noBtn.style.position = "fixed";

    // Safe padding from screen edges
    const padding = 20;

    const maxX =
        window.innerWidth -
        buttonWidth -
        padding;

    const maxY =
        window.innerHeight -
        buttonHeight -
        padding;

    let randomX =
        Math.random() * (maxX - padding) +
        padding;

    let randomY =
        Math.random() * (maxY - padding) +
        padding;

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";


    /* Funny messages after each attempt */

    const messages = [
        "Nice try 😭💕",
        "You really thought I'd let you say no? 🥺",
        "Sally... please reconsider 😭❤️",
        "Okay that's enough. The YES button wins 😌💕"
    ];

    warningText.textContent =
        messages[noAttempts - 1];


    /*
      AFTER 4 ATTEMPTS
      Hide NO behind YES
    */

    if (noAttempts >= 4) {

        noEscaped = true;

        setTimeout(() => {

            const yesRect =
                yesBtn.getBoundingClientRect();

            // Move No behind Yes
            noBtn.style.left =
                yesRect.left + "px";

            noBtn.style.top =
                yesRect.top + "px";

            noBtn.style.zIndex = "1";

            noBtn.style.opacity = "0";

            noBtn.style.pointerEvents = "none";

            warningText.textContent =
                "There is only one option now... 😌❤️";

        }, 300);
    }
}


/* Desktop click */
noBtn.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
});


/*
  On desktop, make it escape
  when the cursor gets close.
*/
noBtn.addEventListener("mouseenter", () => {
    moveNoButton();
});


/* =====================================
   YES BUTTON CLICK
===================================== */

yesBtn.addEventListener("click", () => {

    /*
      Stop the No button
    */
    noEscaped = true;

    noBtn.style.display = "none";


    /*
      Fade out proposal screen
    */
    proposalScreen.style.opacity = "0";

    setTimeout(() => {

        proposalScreen.classList.remove("active");

        loveScreen.classList.add("active");

        /*
          Start music

          Browser may block autoplay
          in some situations, but because
          this comes directly after clicking
          YES, it should normally work.
        */

        loveSong.volume = 0;

        loveSong.play()
            .then(() => {

                // Slowly increase volume
                let volume = 0;

                const fadeMusic =
                    setInterval(() => {

                        volume += 0.02;

                        if (volume >= 0.7) {
                            volume = 0.7;
                            clearInterval(fadeMusic);
                        }

                        loveSong.volume = volume;

                    }, 200);

            })
            .catch(() => {
                console.log(
                    "Music could not autoplay."
                );
            });


        /*
          After romantic animation,
          show the love letter.
        */

        setTimeout(() => {

            loveScreen.style.opacity = "0";

            setTimeout(() => {

                loveScreen.classList.remove("active");

                messageScreen.classList.add("active");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }, 1000);

        }, 6500);

    }, 800);

});


/* =====================================
   PREVENT DOUBLE CLICK / TOUCH ISSUES
===================================== */

noBtn.addEventListener(
    "touchstart",
    (event) => {

        event.preventDefault();

        moveNoButton();

    },
    { passive: false }
);


/* =====================================
   WINDOW RESIZE SAFETY
===================================== */

window.addEventListener("resize", () => {

    if (noAttempts > 0 && !noEscaped) {

        noBtn.style.left = "50%";
        noBtn.style.top = "50%";

    }

});