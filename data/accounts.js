let accounts = [{
  id: 1,
  name: 'Muthumanikandan',
  email: 'muthumanikandan11mk@gmail.com',
  password: 'Mk11@2004',
  number: 9042321214
}];

function loadAccountsLocal(){
  const acc =  JSON.parse(localStorage.getItem('accounts'));
  if(acc){
    accounts = acc;
  }
}

function storeAccountsLocal(){
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

export let currentAccountId = '';

export function loadCurrentAccountId(){
  const id = JSON.parse(localStorage.getItem('currentAccountId'));
  //console.log('Loading currentAccountId:', id); // Debugging line
  if(id){
    currentAccountId = id;
  }
  //console.log('Loading currentAccountId:', currentAccountId); // Debugging line
}

export function storeCurrentAccountId(){
  //console.log('Storing currentAccountId:', currentAccountId); // Debugging line
  localStorage.setItem('currentAccountId', JSON.stringify(currentAccountId));
}

export function clearCurrentAccountId(){
  currentAccountId = '';
  storeCurrentAccountId();
  loadCurrentAccountId();
}

loadAccountsLocal();
loadCurrentAccountId();

export function isAccount(account){
  let isThere = '';
  accounts.forEach((acc, ind) => {
    if(acc.email === account.email && acc.password === account.password){
      isThere = String(ind);
    }
  });
  currentAccountId = isThere;
  storeCurrentAccountId();
  loadCurrentAccountId();
  //alert(currentAccountId);
  

  return isThere;
}

export function addAccount(account) {
  const errors = {};

  // Validate Name
  if (!account.name || account.name.trim().length === 0) {
    errors.name = "Name is required.";
  } else if (!/^[a-zA-Z\s]+$/.test(account.name)) {
    errors.name = "Name must contain only letters and spaces.";
  }

  // Validate Email
  if (!account.email || account.email.trim().length === 0) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
    errors.email = "Email format is invalid.";
  }

  // Validate Password
  if (!account.password || account.password.length === 0) {
    errors.password = "Password is required.";
  } else if (account.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(account.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(account.password)) {
    errors.password = "Password must contain at least one lowercase letter.";
  } else if (!/[0-9]/.test(account.password)) {
    errors.password = "Password must contain at least one digit.";
  } else if (!/[!@#$%^&*]/.test(account.password)) {
    errors.password = "Password must contain at least one special character (!@#$%^&*).";
  }

  // Validate Phone Number
  if (!account.phone || account.phone.trim().length === 0) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(account.phone)) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }

  // Return Errors
  return errors;
}

const res = addAccount({
  name: 'Arun',
  email: 'arun@',
  password: '1234',
  number: 12345690
})

console.log(res);