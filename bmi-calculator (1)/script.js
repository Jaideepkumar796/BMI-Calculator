// Exact BMI calculation function as provided (global scope)
function bmiCalculator() {
  const weightInput = Number(document.getElementById("weight").value)
  const heightInput = Number(document.getElementById("height").value)

  const result = document.getElementById("result")

  if (weightInput === 0) {
    alert("Input Correct weight")
    return
  }

  if (heightInput === 0) {
    alert("Input Correct height")
    return
  }

  const heightInMeter = heightInput / 100
  const heightSquare = heightInMeter * heightInMeter

  const BMI = weightInput / heightSquare
  result.value = BMI
}
;(() => {
  const heightValue = document.getElementById("heightValue")
  const heightUnit = document.getElementById("heightUnit")
  const weightValue = document.getElementById("weightValue")
  const weightUnit = document.getElementById("weightUnit")
  const calcBtn = document.getElementById("calcBtn")
  const bmiValue = document.getElementById("bmiValue")
  const bmiBadge = document.getElementById("bmiBadge")
  const pointer = document.getElementById("pointer")
  const tipText = document.getElementById("tipText")
  const errorMsg = document.getElementById("errorMsg")
  // Hidden fields used by exact bmiCalculator()
  const hiddenHeight = document.getElementById("height")
  const hiddenWeight = document.getElementById("weight")

  function toMetric(hVal, hUnit, wVal, wUnit) {
    let cm = Number(hVal)
    let kg = Number(wVal)

    if (hUnit === "in") cm = cm * 2.54 // inches -> cm
    if (wUnit === "lb") kg = kg * 0.45359237 // pounds -> kg
    return { cm, kg }
  }

  function categorize(bmi) {
    if (bmi < 18.5) return { key: "under", label: "Underweight" }
    if (bmi < 25) return { key: "normal", label: "Normal" }
    if (bmi < 30) return { key: "over", label: "Overweight" }
    return { key: "obese", label: "Obese" }
  }

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max)
  }

  function updateGauge(bmi) {
    // Gauge spans 10 → 40
    const min = 10,
      max = 40
    const p = ((clamp(bmi, min, max) - min) / (max - min)) * 100
    pointer.style.setProperty("--x", p + "%")
  }

  function setBadge(cat) {
    bmiBadge.className = "badge " + cat.key
    bmiBadge.textContent = cat.label
  }

  function setTip(cat) {
    const tips = {
      under: "Consider nutrient-dense meals and strength training. A dietitian can help you plan healthy weight gain.",
      normal: "Great job! Keep up balanced nutrition, regular activity, sleep, and hydration to maintain your health.",
      over: "Small lifestyle tweaks—like daily walks and mindful portions—can make a big difference over time.",
      obese:
        "Seek personalized guidance from a healthcare provider. Start with gentle activity and a supportive meal plan.",
    }
    tipText.textContent = tips[cat.key]
  }

  function isValidNumber(v) {
    return v !== "" && !isNaN(v) && Number(v) > 0
  }

  function calculate() {
    const hVal = heightValue.value.trim()
    const wVal = weightValue.value.trim()

    if (!isValidNumber(hVal) || !isValidNumber(wVal)) {
      errorMsg.style.display = "inline"
      return
    }
    errorMsg.style.display = "none"

    // Convert to metric, set hidden inputs, then call exact bmiCalculator()
    const { cm, kg } = toMetric(hVal, heightUnit.value, wVal, weightUnit.value)
    hiddenHeight.value = String(cm)
    hiddenWeight.value = String(kg)

    // Call the exact function (alerts on 0)
    bmiCalculator()

    const raw = Number(document.getElementById("result").value)
    if (!isFinite(raw) || isNaN(raw)) {
      bmiValue.textContent = "—"
      bmiBadge.className = "badge"
      bmiBadge.textContent = "Awaiting"
      tipText.textContent = "Enter your details and hit Calculate to see your BMI and health tips."
      updateGauge(10)
      return
    }

    const rounded = Math.round(raw * 10) / 10
    bmiValue.textContent = String(rounded)

    const cat = categorize(rounded)
    setBadge(cat)
    setTip(cat)
    updateGauge(rounded)
  }

  calcBtn.addEventListener("click", calculate)
  // Submit on Enter in either input
  ;[heightValue, weightValue].forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") calculate()
    })
  })

  // Initial gauge position
  updateGauge(10)
})()
