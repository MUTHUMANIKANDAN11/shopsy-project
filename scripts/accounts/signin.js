import { addAccount, isAccount } from "../../data/accounts.js";

const email = document.querySelector('.email-input-js');
const password = document.querySelector('.password-input-js');
const submit = document.querySelector('.submit-btn-js');

email.addEventListener('keydown', (event) => {
  if(event.key === 'Enter'){
    event.preventDefault();
    password.focus();
  }
});

password.addEventListener('keydown', (event) => {
  if(event.key === 'Enter'){
    event.preventDefault();
    submit.click();
    password.blur();
  }
});

submit.addEventListener('click', () => {
  const email = document.querySelector('.email-input-js').value;
  const password = document.querySelector('.password-input-js').value;

  const res = isAccount({email, password});

  //console.log(res);
  if(! res){
    document.querySelector('.error-message-js').innerText = 'Invalid email or password';
    document.querySelectorAll('.form-control').forEach((label) => {
      label.classList.add('error-form-control');
    });
  } else {
    document.querySelector('.error-message-js').innerText = '';
    document.querySelectorAll('.form-control').forEach((label) => {
      label.classList.remove('error-form-control');
    });

    window.location.href = './shopsy.html';
  }
});