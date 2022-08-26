function editNav() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}


// DOM Elements
const modalbg = document.querySelector(".bground");
const modalClose = document.querySelectorAll('.close-event');
const modalBody = document.querySelector(".modal-body");
const modalForm = document.querySelector(".modal-body form");
const modalAlert = document.querySelector(".modal-alert");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");

// DOM required Inputs
const firstnameInput = document.querySelector('#first');
const lastnameInput = document.querySelector('#last');
const emailInput = document.querySelector('#email');
const birthdateInput = document.querySelector('#birthdate');
const quantityInput = document.querySelector('#quantity');
const rules = document.querySelector('#checkbox1');
const citiesCheckbox = document.querySelectorAll('#select-city .radio-input');

// Form is send
let formIsSend = false;

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
modalClose.forEach(function (elmnt) {
  elmnt.addEventListener("click", closeModal);
})

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// close modal
function closeModal() {
  modalbg.style.display = "none";

  if (formIsSend) {
    modalForm.classList.remove("form-hidden");
    modalForm.classList.remove("form-fadeout");
    modalAlert.classList.remove("alert-fadein");
    modalForm.reset();
  }
}

// function add data attributes
function addInputError (node) {
  if(node.parentNode.classList.value === 'formData') {
    node.parentNode.dataset.errorVisible = true;
  } else {
    // find formData case check cities 
    node.parentNode.parentNode.querySelector('.formData').dataset.errorVisible = true;
  }
}

// function remove data attributes
function removeInputError (node) {
  if(node.parentNode.classList.value === 'formData') {
    node.parentNode.dataset.errorVisible = false;
  } else {
    // find formData case check cities 
    node.parentNode.parentNode.querySelector('.formData').dataset.errorVisible = false;
  }
}

// function check if 1 radio is selected
function validRadioCity () {  
  let validCity = false;
  
  citiesCheckbox.forEach((elmnt) => {
    // if 1 element is checked return true
    if (elmnt.checked) {
      validCity = true;
    }
  });

  return validCity;
}

// function check characteres min 
function checkInputChar (elmnt, minChar) {
  let validJs = false;
  // check HTML Valid
  const validHtml = elmnt.validity.valid;
  
  // Check JS Valid
  if( elmnt.value.length >= minChar) { 
    validJs = true;
  }

  if(validJs && validHtml) {
    return true;
  } else {
    return false;
  }
}

// function check with regex constraint
function checkInputRegex (elmnt, regex) {
  let validJs = false;
  // check HTML Valid  
  const validHtml = elmnt.validity.valid;

  // Check JS Valid Regex and not empty
  if ( elmnt.value.length >= 0 && regex.test(elmnt.value)) { 
    validJs = true;
  }

  if (validJs && validHtml) {
    return true;
  } else {
    return false;
  }
}

// function check input number 
function checkInputNumber (elmnt) {
  let validJs = false;
  // check HTML Valid  
  const validHtml = elmnt.validity.valid;

  // Check JS Valid Regex and not empty
  if (Number.isInteger(parseInt(elmnt.value))) { 
    validJs = true;
  }

  if (validJs && validHtml) {
    return true;
  } else {
    return false;
  }
}

// function check Date of birth ( not empty && valid format && more than 18 years )
function checkInputAge (elmnt) {
  // check input value is completed with valid format
  const validHtml = elmnt.validity.valid;
  let validJs;

  if (!elmnt.value || !validHtml) {    
    // input is not completed
    elmnt.parentNode.dataset.error = "Vous devez entrer votre date de naissance.";
    validJs = false;
  } else if (!checkInputRegex(elmnt, /^\d{4}[./-]\d{2}[./-]\d{2}$/)){
    // input error format
    elmnt.parentNode.dataset.error = "Veuillez saisir une date valide.";
    validJs = false;
  } else {
    /*** calculate age ***/
    // create date from input value
    const birthDate = new Date(elmnt.value);
    // calculate month difference from current date in time
    const diff = Date.now()- birthDate.getTime();
    // convert the calculated difference in date format
    const ageDt = new Date(diff);
    // extract year from date  
    const ageYear = ageDt.getUTCFullYear();
    // now calculate the age of the user
    const age = Math.abs(ageYear - 1970);

    if(age < 18) {
      // input is completed but uer have less than 18 years
      elmnt.parentNode.dataset.error = "Vous avez moins de 18 ans, vous ne pouvez pas vous inscrire.";
      validJs = false;
    } else {
      // input is completed and uer have more than 18 years
      validJs = true;
    }    
  }

  return validJs;
}

// function check checkbox 
function checkInputCheckbox (elmnt) {
  let validJs = elmnt.checked;
  // check HTML Valid  
  const validHtml = elmnt.validity.valid;

  if (validJs && validHtml) {
    return true
  } else {
    return false
  }
}

// function send data form 
function sendData() {
  const XHR = new XMLHttpRequest();

  // Bind the FormData object and the form element
  const formData = new FormData( modalForm );

  // Set up our request
  XHR.open( "GET", "./index.html" );

  // The data sent is what the user provided in the form
  XHR.send( formData );
}

// validate modal form
function validate(event) {
  event.preventDefault();
  let isValidForm = true;

  // Init objects list with inputs elements and error messages 
  // Double verification : HTML and Javascript
  const listInputsRequired = [
    { node: firstnameInput, valid: checkInputChar(firstnameInput, 2) },
    { node: lastnameInput, valid: checkInputChar(lastnameInput, 2) },
    { node: emailInput, valid: checkInputRegex(emailInput, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/) },
    { node: birthdateInput, valid: checkInputAge(birthdateInput) },
    { node: quantityInput, valid: checkInputNumber(quantityInput) },
    { node: citiesCheckbox[0], valid: validRadioCity(citiesCheckbox) },
    { node: rules, valid: checkInputCheckbox(rules) }
  ];

  // Add or Remove data-error attributes
  listInputsRequired.forEach(function (elmnt) {
    if( elmnt.valid === false ) {
      addInputError(elmnt.node);
      isValidForm = false;
    } else {
      removeInputError(elmnt.node);
    }
  })

  // hide modal form and replace by sucessfull message
  // send formData with XMLHttpRequest
  if(isValidForm) {
    modalForm.classList.add("form-fadeout");
    // Show Success message
    const timer1 = setTimeout(function() {
      modalForm.classList.add("form-hidden");
      modalForm.classList.remove("form-fadeout");
      modalAlert.classList.add("alert-fadein");
      clearTimeout(timer1);
    }, 300)
    formIsSend = true;
    // Send datas with FormData
    sendData();
  }
  
  return false;
}