import { addAccount, isAccount } from "../data/accounts.js";

document.querySelector('.submit-btn-js').addEventListener('click', () => {
  const email = document.querySelector('.email-input-js').value;
  const password = document.querySelector('.password-input-js').value;

  const res = isAccount({email, password});

  if(res == -1){
    document.querySelector('.error-message-js').innerText = 'Invalid email or password';
    document.querySelectorAll('.form-control').forEach((label) => {
      label.classList.add('error-form-control');
    });
  } else {
    document.querySelector('.error-message-js').innerText = '';
    document.querySelectorAll('.form-control').forEach((label) => {
      label.classList.remove('error-form-control');
    });

    window.location.href = './amazon.html';
  }
});