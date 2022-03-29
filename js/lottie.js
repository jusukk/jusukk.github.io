// Lottie animations
const animAstronaut = lottie.loadAnimation({
    container: document.getElementById("lottieAstronaut"),
    renderer:"svg",
    loop: true,
    autoplay: true,
    path: "lottie/lottie_astronaut.json",
});

const lbAnimAstronaut = lottie.loadAnimation({
    container: document.getElementById("lb-lottieAstronaut"),
    renderer:"svg",
    loop: true,
    autoplay: true,
    controls: true,
    path: "lottie/lottie_astronaut.json",
});