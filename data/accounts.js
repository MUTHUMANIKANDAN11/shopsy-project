const accounts = [{
  name: 'Muthumanikandan',
  email: 'muthumanikandan11mk@gmail.com',
  password: 'Mk11@2022',
  number: 9042321214
}];

function isAccount(account){
  let isThere = false;
  accounts.forEach((acc) => {
    if(acc.email === account.email && acc.password === account.password){
      isThere = true;
    }
  });
  return isThere;
}

function addAccount(account) {
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