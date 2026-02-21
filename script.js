// Scroll animation
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".hidden").forEach(el => observer.observe(el));

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// Compound calculator
function calculateCompound() {
    const principal = parseFloat(document.getElementById("principal").value);
    const rate = parseFloat(document.getElementById("rate").value) / 100;
    const years = parseFloat(document.getElementById("years").value);

    const result = principal * Math.pow((1 + rate), years);
    document.getElementById("compound-result").textContent =
        "Final Value: $" + result.toFixed(2);
}

// Quiz
function checkAnswer(answer) {
    const result = document.getElementById("quiz-result");

    if (answer === "A") {
        result.textContent = "Correct. Long-term investing is generally more sustainable.";
        result.style.color = "green";
    } else {
        result.textContent = "Not quite. Frequent trading is extremely difficult to sustain.";
        result.style.color = "red";
    }
}

/* ===== DYNAMIC SCALING SIMULATOR ===== */

const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

let priceHistory = [100];
let startingPrice = 100;
let animating = false;
const maxPoints = 35; // max data points displayed

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxPrice = Math.max(...priceHistory) + 10; // add padding
    const minPrice = Math.min(...priceHistory) - 10;
    const range = maxPrice - minPrice || 1;

    ctx.beginPath();

    for (let i = 0; i < priceHistory.length; i++) {
        let x = (canvas.width / maxPoints) * i;
        let y = canvas.height - ((priceHistory[i] - minPrice) / range) * canvas.height;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
}

function changePrice(amount) {
    let newPrice = priceHistory[priceHistory.length - 1] + amount;
    if (newPrice < 1) newPrice = 1;

    priceHistory.push(newPrice);

    if (priceHistory.length > maxPoints) {
        priceHistory.shift();
    }

    updatePriceDisplay(newPrice, amount);
    drawChart();
}

function updatePriceDisplay(current, amount = 0) {
    const change = current - startingPrice;
    const percent = (change / startingPrice) * 100;

    const changeElement = document.getElementById("price-change");
    const priceElement = document.getElementById("current-price");
    const glow = document.getElementById("price-glow");

    priceElement.textContent = current.toFixed(2);
    changeElement.textContent =
        (change >= 0 ? "+" : "") + change.toFixed(2) + " (" + percent.toFixed(2) + "%)";
    changeElement.style.color = change >= 0 ? "#16a34a" : "#dc2626";

    // Glow effect
    glow.style.transition = "0.3s ease";
    glow.style.textShadow = amount > 0 ? "0 0 12px #16a34a" : amount < 0 ? "0 0 12px #dc2626" : "none";
    setTimeout(() => { glow.style.textShadow = "none"; }, 300);
}

function resetChart() {
    priceHistory = [100];
    updatePriceDisplay(100);
    drawChart();
}

// initial draw
drawChart();
updatePriceDisplay(100);

/* ===== QUIZ ===== */

const quizData = [
    { question: "Which approach is generally safer for most beginners?", choices: ["Long-term investing", "Constant short-term trading"], answer: 0 },
    { question: "What is a share?", choices: ["A tiny piece of a company", "A lottery ticket", "Money you borrow from the bank"], answer: 0 },
    { question: "Why do stock prices go up?", choices: ["More people want to buy than sell", "Because the government says so", "Always randomly"], answer: 0 },
    { question: "Why do stock prices go down?", choices: ["More people want to sell than buy", "Stocks get tired", "Because the company shrinks physically"], answer: 0 },
    { question: "What is the main reason trading is hard?", choices: ["Emotional reactions and competition", "The computer slows down", "You need a special license"], answer: 0 },
    { question: "What does compound growth mean?", choices: ["Earnings on your money plus earnings on earnings", "Magic money appears", "Stock market pays interest daily"], answer: 0 },
    { question: "Which is a common beginner mistake?", choices: ["Panic selling", "Researching companies before investing", "Starting small"], answer: 0 },
    { question: "What is moving average in a chart?", choices: ["Average of prices over a period", "The highest price ever", "Random line for decoration"], answer: 0 }
];

const quizContainer = document.getElementById("quiz-container");
quizContainer.innerHTML = ""; // clear before render

quizData.forEach((q,i)=>{
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = "8px";

    const p = document.createElement("p");
    p.textContent = `${i+1}. ${q.question}`;
    p.style.fontWeight = "600";
    div.appendChild(p);

    q.choices.forEach((choice,j)=>{
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.classList.add("event-btn"); // use global styling
        btn.onclick = () => {
            // reset other buttons colors
            const siblings = btn.parentElement.querySelectorAll("button");
            siblings.forEach(sib => sib.style.background = sib.classList.contains("positive") ? "#16a34a" : sib.classList.contains("negative") ? "#dc2626" : "#2563eb");

            if(j === q.answer){
                btn.style.background="#16a34a";
                btn.style.color="white";
                document.getElementById("quiz-result").textContent="Correct!";
                document.getElementById("quiz-result").style.color="#16a34a";
            } else {
                btn.style.background="#dc2626";
                btn.style.color="white";
                document.getElementById("quiz-result").textContent="Incorrect!";
                document.getElementById("quiz-result").style.color="#dc2626";
            }
        };
        div.appendChild(btn);
    });

    quizContainer.appendChild(div);
});
