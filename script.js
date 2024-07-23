function numberToWords(number) {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion", "Trillion"];

  function convertChunk(chunk) {
    const hundredsPlace = Math.floor(chunk / 100);
    const tensPlace = Math.floor((chunk % 100) / 10);
    const onesPlace = chunk % 10;

    let words = "";

    if (hundredsPlace > 0) {
      words += units[hundredsPlace] + " Hundred";
    }

    if (tensPlace > 0) {
      if (tensPlace === 1 && onesPlace > 0) {
        words += " " + teens[onesPlace];
      } else {
        words += " " + tens[tensPlace];
        if (onesPlace > 0) {
          words += "-" + units[onesPlace];
        }
      }
    } else if (onesPlace > 0) {
      words += " " + units[onesPlace];
    }

    return words;
  }

  if (number === 0) {
    return "Zero";
  }

  let words = "";
  let chunkIndex = 0;

  while (number > 0) {
    const chunk = number % 1000;
    if (chunk > 0) {
      words = convertChunk(chunk) + " " + thousands[chunkIndex] + " " + words;
    }
    number = Math.floor(number / 1000);
    chunkIndex++;
  }

  return words.trim();
}

document.addEventListener("DOMContentLoaded", function () {
  const salaryInput = document.getElementById("salary");
  const taxYearInput = document.getElementById("taxYear");
  const basicSalaryElement = document.getElementById("basicSalary");
  const utilityAllowanceElement = document.getElementById("utilityAllowance");
  const medicalAllowanceElement = document.getElementById("medicalAllowance");
  const houseRentElement = document.getElementById("houseRent");
  const annualSalaryElement = document.getElementById("annualSalary");
  const annualTaxElement = document.getElementById("annualTax");
  const annualMedicalElement = document.getElementById("annualMedicalExemption");
  const annualReductionElement = document.getElementById("annualReduction");
  const taxSlabElement = document.getElementById("taxSlab");
  const resultElement = document.getElementById("result");
  const result1Element = document.getElementById("result1");
  const result2Element = document.getElementById("result2");
  const breakupButton = document.getElementById("breakupButton");
  const breakupSection = document.querySelector(".breakup");
  const monthlySalaryAfterTaxElement = document.getElementById("monthlySalaryAfterTaxValue");
  const NetSalaryInWordsElement = document.getElementById("NetSalaryInWords");

  const resultsSection = document.getElementById("resultsSection"); // Get the results section
  const noteElement = document.querySelector(".note"); // Get the thank you note element

  // Set default tax year to the maximum available year
  let maxYear = -Infinity;
  let maxYearIndex = 0;

  for (let i = 0; i < taxYearInput.options.length; i++) {
    const year = parseInt(taxYearInput.options[i].value);
    if (!isNaN(year) && year > maxYear) {
      maxYear = year;
      maxYearIndex = i;
    }
  }

  taxYearInput.selectedIndex = maxYearIndex;

  let enteredSalary = 0; // Store the entered salary amount
  
  const calculateTax = () => {
    enteredSalary = parseFloat(salaryInput.value);
  if (isNaN(enteredSalary)) {
    // Clear all values and hide sections if salary input is empty
    annualSalaryElement.textContent = "0.00";
    annualTaxElement.textContent = "0.00";
    resultElement.textContent = "0.00";
    basicSalaryElement.textContent = "0.00";
    utilityAllowanceElement.textContent = "0.00";
    medicalAllowanceElement.textContent = "0.00";
    houseRentElement.textContent = "0.00";
    taxSlabElement.textContent = "";

    // Hide the results section and salary breakup
    resultsSection.style.display = "none";
    breakupSection.style.display = "none";
    breakupButton.style.display = "none";
    noteElement.style.display = "none";
    return; // Exit the function if salary is not a number
    }

    const annualSalary = enteredSalary * 12; //Calculate annual tax result

    const taxYear       = parseInt(taxYearInput.value);
    let annualTax       = 0;
    let exmpt_annualTax = 0;

    // Update the salary breakup table
    const basicSalary                   = (enteredSalary / 160 * 100).toFixed(2);
    basicSalaryElement.textContent      =  basicSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    utilityAllowanceElement.textContent = (basicSalary * 5 / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    medicalAllowanceElement.textContent = (basicSalary * 10 / 100).toFixed(2);
    houseRentElement.textContent        = (basicSalary * 45 / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    annualMedicalElement.textContent    = (medicalAllowanceElement.textContent * 12).toFixed(0);
    medicalAllowanceElement.textContent = medicalAllowanceElement.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const exmpt_annualSalary = ( annualSalary - annualMedicalElement.textContent); //Calculate annual tax result With Medical Exemption
    annualMedicalElement.textContent    = annualMedicalElement.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Update tax slab and calculate tax based on tax year
    if (taxYear === 2020 || taxYear === 2021 || taxYear === 2022) {

      if (annualSalary <= 600000) {
        annualTax = 0;
        taxSlabElement.textContent = "Where the taxable salary income does not exceed Rs. 600,000, the rate of income tax is 0%.";
      } else if (annualSalary <= 1200000) {
        annualTax = (annualSalary - 600000) * 0.05;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 600,000 but does not exceed Rs. 1,200,000, the rate of income tax is 5% of the amount exceeding Rs. 600,000.";
      } else if (annualSalary <= 1800000) {
        annualTax = 30000 + (annualSalary - 1200000)  * 0.1;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 1,200,000 but does not exceed Rs. 1,800,000, the rate of income tax is Rs. 30,000 + 10% of the amount exceeding Rs. 1,200,000.";
      } else if (annualSalary <= 2500000) {
        annualTax = 90000 + (annualSalary - 1800000) * 0.15;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 1,800,000 but does not exceed Rs. 2,500,000, the rate of income tax is Rs. 90,000 + 15% of the amount exceeding Rs. 1,800,000.";
      } else if (annualSalary <= 3500000) {
        annualTax = 195000 + (annualSalary - 2500000) * 0.175;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 2,500,000 but does not exceed Rs. 3,500,000, the rate of income tax is Rs. 195,000 + 17.5% of the amount exceeding Rs. 2,500,000.";
      } else if (annualSalary <= 5000000) {
        annualTax = 370000 + (annualSalary - 3500000) * 0.2;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 3,500,000 but does not exceed Rs. 5,000,000, the rate of income tax is Rs. 370,000 + 20% of the amount exceeding Rs. 3,500,000.";
      } else if (annualSalary <= 8000000) {
        annualTax = 670000 + (annualSalary - 5000000) * 0.225;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 5,000,000 but does not exceed Rs. 8,000,000, the rate of income tax is Rs. 670,000 + 22.5% of the amount exceeding Rs. 5,000,000.";
      } else if (annualSalary <= 12000000) {
        annualTax = 1345000 + (annualSalary - 8000000) * 0.25;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 8,000,000 but does not exceed Rs. 12,000,000, the rate of income tax is Rs. 1,345,000 + 25% of the amount exceeding Rs. 8,000,000.";
      } else if (annualSalary <= 30000000) {
        annualTax = 2345000 + (annualSalary - 12000000) * 0.275;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 12,000,000 but does not exceed Rs. 30,000,000, the rate of income tax is Rs. 2,345,000 + 27.5% of the amount exceeding Rs. 12,000,000.";
      } else if (annualSalary <= 50000000) {
        annualTax = 7295000 + (annualSalary - 30000000) * 0.3;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 30,000,000 but does not exceed Rs. 50,000,000, the rate of income tax is Rs. 7,295,000 + 30% of the amount exceeding Rs. 30,000,000.";
      } else if (annualSalary <= 75000000) {
        annualTax = 13295000 + (annualSalary - 50000000) * 0.325;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 50,000,000 but does not exceed Rs. 75,000,000, the rate of income tax is Rs. 13,295,000 + 32.5% of the amount exceeding Rs. 50,000,000.";
      } else {
        annualTax = 21420000 + (annualSalary - 75000000 ) * 0.35;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 75,000,000, the rate of income tax is Rs. 21,420,000 + 35% of the amount exceeding Rs. 75,000,000.";
      }

      if (exmpt_annualSalary <= 600000) {
        exmpt_annualTax = 0;
      } else if (exmpt_annualSalary <= 1200000) {
        exmpt_annualTax = (exmpt_annualSalary - 600000) * 0.05;
      } else if (exmpt_annualSalary <= 1800000) {
        exmpt_annualTax = 30000 + (exmpt_annualSalary - 1200000)  * 0.1;
      } else if (exmpt_annualSalary <= 2500000) {
        exmpt_annualTax = 90000 + (exmpt_annualSalary - 1800000) * 0.15;
      } else if (exmpt_annualSalary <= 3500000) {
        exmpt_annualTax = 195000 + (exmpt_annualSalary - 2500000) * 0.175;
      } else if (exmpt_annualSalary <= 5000000) {
        exmpt_annualTax = 370000 + (exmpt_annualSalary - 3500000) * 0.2;
      } else if (exmpt_annualSalary <= 8000000) {
        exmpt_annualTax = 670000 + (exmpt_annualSalary - 5000000) * 0.225;
      } else if (exmpt_annualSalary <= 12000000) {
        exmpt_annualTax = 1345000 + (exmpt_annualSalary - 8000000) * 0.25;
      } else if (exmpt_annualSalary <= 30000000) {
        exmpt_annualTax = 2345000 + (exmpt_annualSalary - 12000000) * 0.275;
      } else if (exmpt_annualSalary <= 50000000) {
        exmpt_annualTax = 7295000 + (exmpt_annualSalary - 30000000) * 0.3;
      } else if (exmpt_annualSalary <= 75000000) {
        exmpt_annualTax = 13295000 + (exmpt_annualSalary - 50000000) * 0.325;
      } else {
        exmpt_annualTax = 21420000 + (exmpt_annualSalary - 75000000 ) * 0.35;
      }

    }else if (taxYear === 2023) {
      if (annualSalary <= 600000) {
        annualTax = 0;
        taxSlabElement.textContent = "Where the taxable salary income does not exceed Rs. 600,000, the rate of income tax is 0%.";
      } else if (annualSalary <= 1200000) {
        annualTax = (annualSalary - 600000) * 0.025;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 600,000 but does not exceed Rs. 1,200,000, the rate of income tax is 2.5% of the amount exceeding Rs. 600,000.";
      } else if (annualSalary <= 2400000) {
        annualTax = 15000 + (annualSalary - 1200000)  * 0.125;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 1,200,000 but does not exceed Rs. 2,400,000, the rate of income tax is Rs. 15,000 + 12.5% of the amount exceeding Rs. 1,200,000.";
      } else if (annualSalary <= 3600000) {
        annualTax = 165000 + (annualSalary - 2400000) * 0.2;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 2,400,000 but does not exceed Rs. 3,600,000 the rate of income tax is Rs. 165,000 + 20% of the amount exceeding Rs. 2,400,000.";
      } else if (annualSalary <= 6000000) {
        annualTax = 405000 + (annualSalary - 3600000) * 0.25;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 3,600,000 but does not exceed Rs. 6,000,000 the rate of income tax is Rs. 405,000 + 25% of the amount exceeding Rs. 3,600,000.";
      } else if (annualSalary <= 12000000) {
        annualTax = 1005000 + (annualSalary - 6000000) * 0.325;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 6,000,000 but does not exceed Rs. 12,000,000 the rate of income tax is Rs. 1,005,000 + 32.5% of the amount exceeding Rs. 6,000,000.";
      } else {
        annualTax = 2955000 + (annualSalary - 12000000 ) * 0.35;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 12,000,000 the rate of income tax is Rs. 2,955,000 + 35% of the amount exceeding Rs. 12,000,000.";
      }

      if (exmpt_annualSalary <= 600000) {
        exmpt_annualTax = 0;
      } else if (exmpt_annualSalary <= 1200000) {
        exmpt_annualTax = (exmpt_annualSalary - 600000) * 0.025;
      } else if (exmpt_annualSalary <= 2400000) {
        exmpt_annualTax = 15000 + (exmpt_annualSalary - 1200000)  * 0.125;
      } else if (exmpt_annualSalary <= 3600000) {
        exmpt_annualTax = 165000 + (exmpt_annualSalary - 2400000) * 0.2;
      } else if (exmpt_annualSalary <= 6000000) {
        exmpt_annualTax = 405000 + (exmpt_annualSalary - 3600000) * 0.25;
      } else if (exmpt_annualSalary <= 12000000) {
        exmpt_annualTax = 1005000 + (exmpt_annualSalary - 6000000) * 0.325;
      } else {
        exmpt_annualTax = 2955000 + (exmpt_annualSalary - 12000000 ) * 0.35;
      }
    } 
    
    else if (taxYear === 2024) {
      if (annualSalary <= 600000) {
        annualTax = 0;
        taxSlabElement.textContent = "Where the taxable salary income does not exceed Rs. 600,000, the rate of income tax is 0%.";
      } else if (annualSalary <= 1200000) {
        annualTax = (annualSalary - 600000) * 0.025;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 600,000 but does not exceed Rs. 1,200,000, the rate of income tax is 2.5% of the amount exceeding Rs. 600,000.";
      } else if (annualSalary <= 2400000) {
        annualTax = 15000 + (annualSalary - 1200000)  * 0.125;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 1,200,000 but does not exceed Rs. 2,400,000, the rate of income tax is Rs. 15,000 + 12.5% of the amount exceeding Rs. 1,200,000.";
      } else if (annualSalary <= 3600000) {
        annualTax = 165000 + (annualSalary - 2400000) * 0.225;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 2,400,000 but does not exceed Rs. 3,600,000, the rate of income tax is Rs. 165,000 + 22.5% of the amount exceeding Rs. 2,400,000.";
      } else if (annualSalary <= 6000000) {
        annualTax = 435000 + (annualSalary - 3600000) * 0.275;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 3,600,000 but does not exceed Rs. 6,000,000, the rate of income tax is Rs. 435,000 + 27.5% of the amount exceeding Rs. 3,600,000.";
      } else {
        annualTax = 1095000 + (annualSalary - 6000000) * 0.35;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 6,000,000, the rate of income tax is Rs. 1,095,000 + 35% of the amount exceeding Rs. 6,000,000.";
      }

      if (exmpt_annualSalary <= 600000) {
        exmpt_annualTax = 0;
      } else if (exmpt_annualSalary <= 1200000) {
        exmpt_annualTax = (exmpt_annualSalary - 600000) * 0.025;
      } else if (exmpt_annualSalary <= 2400000) {
        exmpt_annualTax = 15000 + (exmpt_annualSalary - 1200000)  * 0.125;
      } else if (exmpt_annualSalary <= 3600000) {
        exmpt_annualTax = 165000 + (exmpt_annualSalary - 2400000) * 0.225;
      } else if (exmpt_annualSalary <= 6000000) {
        exmpt_annualTax = 435000 + (exmpt_annualSalary - 3600000) * 0.275;
      } else {
        exmpt_annualTax = 1095000 + (exmpt_annualSalary - 6000000) * 0.35;
      }

    }

    else if (taxYear === 2025) {
      if (annualSalary <= 600000) {
        annualTax = 0;
        taxSlabElement.textContent = "Where the taxable salary income does not exceed Rs. 600,000, the rate of income tax is 0%.";
      } else if (annualSalary <= 1200000) {
        annualTax = (annualSalary - 600000) * 0.05;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 600,000 but does not exceed Rs. 1,200,000, the rate of income tax is 5% of the amount exceeding Rs. 600,000.";
      } else if (annualSalary <= 2200000) {
        annualTax = 30000 + (annualSalary - 1200000)  * 0.15;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 1,200,000 but does not exceed Rs. 2,200,000, the rate of income tax is Rs. 30,000 + 15% of the amount exceeding Rs. 1,200,000.";
      } else if (annualSalary <= 3200000) {
        annualTax = 180000 + (annualSalary - 2200000) * 0.25;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 2,200,000 but does not exceed Rs. 3,200,000, the rate of income tax is Rs. 180,000 + 25% of the amount exceeding Rs. 2,200,000.";
      } else if (annualSalary <= 4100000) {
        annualTax = 430000 + (annualSalary - 3200000) * 0.30;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 3,200,000 but does not exceed Rs. 4,100,000, the rate of income tax is Rs. 430,000 + 30% of the amount exceeding Rs. 3,200,000.";
      } else if (annualSalary <= 10000000) {
        annualTax = 700000 + (annualSalary - 4100000) * 0.35;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 4,100,000, the rate of income tax is Rs. 700,000 + 35% of the amount exceeding Rs. 4,100,000.";
      } else {
        annualTax = 770000 + (annualSalary - 4100000) * 0.385;
        taxSlabElement.textContent = "Where the taxable salary income exceeds Rs. 10,000,000 the rate of income tax is Rs. 770,000 + 38.5% of the amount exceeding Rs. 10,000,000";
      }

      if (exmpt_annualSalary <= 600000) {
        exmpt_annualTax = 0;
      } else if (exmpt_annualSalary <= 1200000) {
        exmpt_annualTax = (exmpt_annualSalary - 600000) * 0.05;
      } else if (exmpt_annualSalary <= 2200000) {
        exmpt_annualTax = 30000 + (exmpt_annualSalary - 1200000)  * 0.15;
      } else if (exmpt_annualSalary <= 3200000) {
        exmpt_annualTax = 180000 + (exmpt_annualSalary - 2200000) * 0.25;
      } else if (exmpt_annualSalary <= 4100000) {
        exmpt_annualTax = 430000 + (exmpt_annualSalary - 3200000) * 0.30;
      } else if (exmpt_annualSalary <= 10000000) {
        exmpt_annualTax = 700000 + (exmpt_annualSalary - 4100000) * 0.35;
      } else {
        exmpt_annualTax = 770000 + (exmpt_annualSalary - 4100000) * 0.385;
      }

    }
    const monthlySalaryAfterTax = (annualSalary - annualTax) / 12; // Calculate monthly salary after taxs
    annualReductionElement.textContent = ( annualTax * 25 / 100 ).toFixed(0); // Teacher's Reduction

    // Update the displayed values
    annualSalaryElement.textContent = annualSalary.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    annualTaxElement.textContent = annualTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    monthlySalaryAfterTaxElement.textContent = monthlySalaryAfterTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Update monthly salary after tax
    NetSalaryInWordsElement.textContent = numberToWords(monthlySalaryAfterTax.toFixed(0)); // Net Salary Number in Words

    const monthlyTax = annualTax / 12;
    const exmpt_monthlyTax = exmpt_annualTax / 12;
    const teacher_monthlyTax = ( annualTax - annualReductionElement.textContent) / 12;
    annualReductionElement.textContent = annualReductionElement.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //    resultElement.textContent = `Monthly Tax (Tax Year ${taxYear}): PKR ${monthlyTax.toFixed(2)}`;
    //    result1Element.textContent = `Monthly Tax After Medical Exemption (Tax Year ${taxYear}): PKR ${exmpt_monthlyTax.toFixed(2)}`;

    resultElement.textContent = `Monthly Tax: PKR ${monthlyTax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    result1Element.textContent = `After Exemption: PKR ${exmpt_monthlyTax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    result2Element.textContent = `Teacher's Tax: PKR ${teacher_monthlyTax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    // Show the results section and salary breakup after calculation
    resultsSection.style.display = "block";
    //breakupSection.style.display = "block";

   // Show Breakup button if salary is entered
    if (enteredSalary > 0) {
      breakupButton.style.display = "block";
    }

    noteElement.style.display = "block";
  };

  salaryInput.addEventListener("input", calculateTax);
  taxYearInput.addEventListener("change", calculateTax);

 breakupButton.addEventListener("click", () => {
    if (enteredSalary > 0) {
      breakupSection.style.display = "block";
    }
  });

  // Trigger initial tax calculation when the page loads
  calculateTax();
});