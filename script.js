// Shared state for all tabs
var sharedValues = {
    sipMonthlyInvestment: 25000,
    sipExpectedReturn: 12,
    sipTimePeriod: 10,
    lumpsumInvestment: 500000,
    lumpsumExpectedReturn: 12,
    lumpsumTimePeriod: 10,
    fdDepositAmount: 500000,
    fdInterestRate: 7,
    fdTimePeriod: 5,
    rdMonthlyDeposit: 10000,
    rdInterestRate: 7,
    rdTimePeriod: 5,
};

var currentTab = 'sip';

// Tab switching function
function openTab(tabName) {
    currentTab = tabName;

    // Remove 'active' class from all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(button => button.classList.remove('active'));

    // Add 'active' class to the selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('active');

    // Recalculate values for the selected tab
    calculateValues();
}

// Function to calculate values for the active tab
function calculateValues() {
    if (currentTab === 'sip') {
        calculateSIP();
    } else if (currentTab === 'lumpsum') {
        calculateLumpsum();
    } else if (currentTab === 'fd') {
        calculateFD();
    } else if (currentTab === 'rd') {
        calculateRD();
    }
}

// Function to update donut chart
function updateDonutChart(type, investedPercentage) {
    document.querySelector("#"+type+"  .donut-chart").style.background = `conic-gradient(
        #1C3E3E 0% ${investedPercentage}%,   /* Dark section for Invested Amount */
        #00FF97 ${investedPercentage}% 100%  /* Light section for Estimated Return */
    )`;
}

// Calculation for SIP
function calculateSIP() {
    const monthlyInvestment = parseFloat(sipMonthlyInvestment.value) || sharedValues.sipMonthlyInvestment;
    const annualReturnRate = parseFloat(sipExpectedReturn.value) || sharedValues.sipExpectedReturn;
    const timePeriodYears = parseInt(sipTimePeriod.value) || sharedValues.sipTimePeriod;

    const monthlyRate = annualReturnRate / 12 / 100;
    const months = timePeriodYears * 12;
    const futureValue = monthlyInvestment * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    const investedAmount = monthlyInvestment * months;
    const estimatedReturn = futureValue - investedAmount;

    // Update DOM elements for SIP
    sipInvestedAmount.textContent = `₹${investedAmount.toLocaleString('en-IN')}`;
    sipEstimatedReturn.textContent = `₹${estimatedReturn.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    sipTotalValue.textContent = `₹${futureValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    // Update donut chart with SIP values
    const investedPercentage = (investedAmount / futureValue) * 100;
    updateDonutChart('sip', investedPercentage);
}

// Similar functions for Lumpsum, FD, and RD
function calculateLumpsum() {
    const initialInvestment = parseFloat(lumpsumInvestment.value) || sharedValues.lumpsumInvestment;
    const annualReturnRate = parseFloat(lumpsumExpectedReturn.value) || sharedValues.lumpsumExpectedReturn;
    const timePeriodYears = parseInt(lumpsumTimePeriod.value) || sharedValues.lumpsumTimePeriod;

    const futureValue = initialInvestment * (1 + annualReturnRate / 100) ** timePeriodYears;
    const investedAmount = initialInvestment;
    const estimatedReturn = futureValue - investedAmount;

    lumpsumInvestedAmount.textContent = `₹${investedAmount.toLocaleString('en-IN')}`;
    lumpsumEstimatedReturn.textContent = `₹${estimatedReturn.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    lumpsumTotalValue.textContent = `₹${futureValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const investedPercentage = (investedAmount / futureValue) * 100;
    updateDonutChart('lumpsum', investedPercentage);
}

// Event listeners for inputs (optimized to call calculateValues)
function updateValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const displayValue = document.getElementById(sliderId + 'Value');
    const directInput = document.getElementById(sliderId + 'Direct');

    displayValue.innerText = sliderId.includes('MonthlyInvestment')
        ? '₹' + slider.value.toLocaleString()
        : slider.value + (sliderId.includes('ExpectedReturn') ? '%' : ' Y');

    directInput.value = slider.value;
    updateSharedState(sliderId);

    // Recalculate values for active tab
    calculateValues();
}

function updateSharedState(sliderId) {
    const sliderValue = parseFloat(document.getElementById(sliderId).value);

    if (sliderId.startsWith('sip')) {
        if (sliderId === 'sipMonthlyInvestment') sharedValues.sipMonthlyInvestment = sliderValue;
        if (sliderId === 'sipExpectedReturn') sharedValues.sipExpectedReturn = sliderValue;
        if (sliderId === 'sipTimePeriod') sharedValues.sipTimePeriod = sliderValue;
    } else if (sliderId.startsWith('lumpsum')) {
        if (sliderId === 'lumpsumInvestment') sharedValues.lumpsumInvestment = sliderValue;
        if (sliderId === 'lumpsumExpectedReturn') sharedValues.lumpsumExpectedReturn = sliderValue;
        if (sliderId === 'lumpsumTimePeriod') sharedValues.lumpsumTimePeriod = sliderValue;
    } else if (sliderId.startsWith('fd')) {
        if (sliderId === 'fdDepositAmount') sharedValues.fdDepositAmount = sliderValue;
        if (sliderId === 'fdInterestRate') sharedValues.fdInterestRate = sliderValue;
        if (sliderId === 'fdTimePeriod') sharedValues.fdTimePeriod = sliderValue;
    } else if (sliderId.startsWith('rd')) {
        if (sliderId === 'rdMonthlyDeposit') sharedValues.rdMonthlyDeposit = sliderValue;
        if (sliderId === 'rdInterestRate') sharedValues.rdInterestRate = sliderValue;
        if (sliderId === 'rdTimePeriod') sharedValues.rdTimePeriod = sliderValue;
    }
}

// Event listener setup for sliders
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', (e) => updateValue(e.target.id));
});

// Event listener setup for direct input fields
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', (e) => {
        const sliderId = e.target.id.replace('Direct', '');
        const slider = document.getElementById(sliderId);

        // Update the slider based on direct input value
        slider.value = e.target.value;
        updateValue(sliderId);
    });
});

// Calculate FD values
function calculateFD() {
    const depositAmount = parseFloat(fdDepositAmount.value) || sharedValues.fdDepositAmount;
    const annualInterestRate = parseFloat(fdInterestRate.value) || sharedValues.fdInterestRate;
    const timePeriodYears = parseInt(fdTimePeriod.value) || sharedValues.fdTimePeriod;

    const futureValue = depositAmount * (1 + annualInterestRate / 100) ** timePeriodYears;
    const investedAmount = depositAmount;
    const estimatedReturn = futureValue - investedAmount;

    fdInvestedAmount.textContent = `₹${investedAmount.toLocaleString('en-IN')}`;
    fdInterestEarned.textContent = `₹${estimatedReturn.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    fdTotalValue.textContent = `₹${futureValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const investedPercentage = (investedAmount / futureValue) * 100;
    updateDonutChart('fd', investedPercentage);
}

// Calculate RD values
function calculateRD() {
    const monthlyDeposit = parseFloat(rdMonthlyDeposit.value) || sharedValues.rdMonthlyDeposit;
    const annualInterestRate = parseFloat(rdInterestRate.value) || sharedValues.rdInterestRate;
    const timePeriodYears = parseInt(rdTimePeriod.value) || sharedValues.rdTimePeriod;

    const months = timePeriodYears * 12;
    const monthlyRate = annualInterestRate / 12 / 100;
    const futureValue = monthlyDeposit * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    const investedAmount = monthlyDeposit * months;
    const estimatedReturn = futureValue - investedAmount;

    rdInvestedAmount.textContent = `₹${investedAmount.toLocaleString('en-IN')}`;
    rdInterestEarned.textContent = `₹${estimatedReturn.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    rdTotalValue.textContent = `₹${futureValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const investedPercentage = (investedAmount / futureValue) * 100;
    updateDonutChart('rd', investedPercentage);
}

// Initialize values on page load
document.addEventListener('DOMContentLoaded', () => {
    openTab(currentTab); // Open the initial tab
    document.querySelectorAll('.tab-content input').forEach(input => {
        input.dispatchEvent(new Event('change')); // Update values
    });
});
