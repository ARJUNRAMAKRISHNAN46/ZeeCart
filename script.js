function validateUserName() {
  var usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
  var name = document.getElementById("myInput1").value;
  var msg = document.getElementById("message1");
  if (usernamePattern.test(name)) {
    msg.innerHTML = "";
    console.log("hereeee");
  } else {
    msg.innerHTML = "Username must be 3-20 characters";
  }
}
function validateUserEmail() {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var email = document.getElementById("myInput2").value;
  var isValid = emailPattern.test(email);
  var msg = document.getElementById("message2");
  if (isValid) {
    msg.innerHTML = "";
  } else {
    msg.innerHTML = "Invalid email address";
  }
}
function validatePassword() {
  var passwordPattern = /^.{8,}$/;
  var msg = document.getElementById("message3");
  var password = document.getElementById("myInput3").value;
  var isValid = passwordPattern.test(password);
  if (isValid) {
    msg.innerHTML = "";
  } else {
    msg.innerHTML = "Password must be at least 8 characters";
  }
}
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  console.log("clicked");
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// JavaScript function to check password match
function checkPasswordMatch() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmpass1").value;
  var message = document.getElementById("message");
  var messagep = document.getElementById("messagep");
  var signupButton = document.getElementById("signupButton");

  if (password === confirmPassword) {
    message.innerHTML = ""; // Clear the error message
    signupButton.disabled = false; // Enable the button
  } else {
    message.innerHTML = "Passwords do not match. Please try again.";
    signupButton.disabled = true; // Disable the button
  }
}
