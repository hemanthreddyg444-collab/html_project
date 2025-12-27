// Dark mode
const darkToggle = document.getElementById('darkToggle');
if (localStorage.getItem('annapoornaDark') === '1') {
  document.body.classList.add('dark');
}
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('annapoornaDark', document.body.classList.contains('dark') ? '1' : '0');
  });
}

// Search shortcuts
const navSearch = document.getElementById('navSearch');
if (navSearch) {
  navSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = navSearch.value.toLowerCase();
      if (q.includes('donate')) window.location.href = 'donation.html';
      else if (q.includes('contact')) window.location.href = 'contact.html';
      else if (q.includes('login')) window.location.href = 'signin.html';
      else if (q.includes('food')) window.location.href = 'food-waste.html';
      else window.location.href = 'index.html';
    }
  });
}

// Floating help
const chatFab = document.getElementById('chatFab');
if (chatFab) {
  chatFab.addEventListener('click', () => {
    alert('For help, please use the Contact page or email info@annapoorna.org.in');
  });
}

// Stats on Home
function updateStats() {
  const mealsEl = document.getElementById('statMeals');
  const donorsEl = document.getElementById('statDonors');
  const msgsEl = document.getElementById('statMsgs');
  if (!mealsEl || !donorsEl || !msgsEl) return;

  const donations = JSON.parse(localStorage.getItem('annapoornaDonations') || '[]');
  const messages = JSON.parse(localStorage.getItem('annapoornaMessages') || '[]');
  mealsEl.textContent = donations.length * 5;
  donorsEl.textContent = new Set(donations.map(d => d.email)).size;
  msgsEl.textContent = messages.length;
}
updateStats();

// Donation page
const donationForm = document.getElementById('donationForm');
if (donationForm) {
  if (donationForm.ddate) donationForm.ddate.valueAsDate = new Date();
  donationForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(donationForm);
    const data = Object.fromEntries(formData);
    const donations = JSON.parse(localStorage.getItem('annapoornaDonations') || '[]');
    data.id = Date.now();
    data.ref = 'ANN-' + data.id.toString().slice(-6);
    donations.push(data);
    localStorage.setItem('annapoornaDonations', JSON.stringify(donations));
    window.location.href = 'donationsu.html?ref=' + encodeURIComponent(data.ref);
  });
}

// Donation success page
if (window.location.pathname.endsWith('donationsu.html')) {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const refSpan = document.getElementById('donationRef');
  if (refSpan && ref) refSpan.textContent = ref;
}

// Contact page
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    const messages = JSON.parse(localStorage.getItem('annapoornaMessages') || '[]');
    data.id = Date.now();
    data.ticket = 'MSG-' + data.id.toString().slice(-6);
    data.status = 'pending';
    messages.push(data);
    localStorage.setItem('annapoornaMessages', JSON.stringify(messages));
    window.location.href = 'message.html?ticket=' + encodeURIComponent(data.ticket);
  });
}

// Message success page
if (window.location.pathname.endsWith('message.html')) {
  const params = new URLSearchParams(window.location.search);
  const ticket = params.get('ticket');
  const ticketSpan = document.getElementById('messageTicket');
  if (ticketSpan && ticket) ticketSpan.textContent = ticket;
}

// Signin page
if (window.location.pathname.endsWith('signin.html')) {
  let isLogin = true;
  const authLeftTitle = document.getElementById('authLeftTitle');
  const authLeftText = document.getElementById('authLeftText');
  const authRightTitle = document.getElementById('authRightTitle');
  const authRightText = document.getElementById('authRightText');
  const authBtn = document.getElementById('authBtn');
  const roleLabel = document.getElementById('roleLabel');
  const arole = document.getElementById('arole');
  const authForm = document.getElementById('authForm');
  const authSuccess = document.getElementById('authSuccess');
  const authUserSpan = document.getElementById('authUser');
  const authRoleSpan = document.getElementById('authRole');

  window.toggleAuthMode = function () {
    isLogin = !isLogin;
    if (isLogin) {
      authLeftTitle.textContent = 'Welcome Back!';
      authLeftText.textContent = 'To keep connected with Annapoorna Seva, please login with your personal info.';
      authRightTitle.textContent = 'Sign In';
      authRightText.textContent = 'Enter your email and password.';
      authBtn.textContent = 'Sign In';
      roleLabel.style.display = 'none';
      arole.style.display = 'none';
    } else {
      authLeftTitle.textContent = 'Hello, Friend!';
      authLeftText.textContent = 'Create an account to join the Annapoorna Seva family.';
      authRightTitle.textContent = 'Sign Up';
      authRightText.textContent = 'Enter your details to create an account.';
      authBtn.textContent = 'Sign Up';
      roleLabel.style.display = 'block';
      arole.style.display = 'block';
    }
    authSuccess.style.display = 'none';
  };

  window.socialLogin = function (provider) {
    alert(provider + ' login clicked (demo only).');
  };

  authForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('aemail').value;
    const pass = document.getElementById('apass').value;
    const role = arole.value;
    const users = JSON.parse(localStorage.getItem('annapoornaUsers') || '[]');

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === pass);
      if (!user) {
        alert('No account found. Please sign up.');
        return;
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      authUserSpan.textContent = user.email;
      authRoleSpan.textContent = user.role.toUpperCase();
      authSuccess.style.display = 'block';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      if (users.find(u => u.email === email)) {
        alert('Email already registered. Please login.');
        return;
      }
      const newUser = { id: Date.now(), email, password: pass, role };
      users.push(newUser);
      localStorage.setItem('annapoornaUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      authUserSpan.textContent = newUser.email;
      authRoleSpan.textContent = newUser.role.toUpperCase();
      authSuccess.style.display = 'block';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  });
}

// Testimonials (aboutus.html)
if (window.location.pathname.endsWith('aboutus.html')) {
  const testimonials = [
    {
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: '“Annapoorna Seva helped me donate surplus food from my restaurant every week.”',
      name: 'Ravi Kumar',
      role: 'Restaurant Owner'
    },
    {
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: '“As a student volunteer, I learnt how small efforts can feed many.”',
      name: 'Priya Sharma',
      role: 'Student Volunteer'
    },
    {
      image: 'https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: '“This platform makes it simple for our company to schedule food donations.”',
      name: 'Anil Verma',
      role: 'CSR Manager'
    }
  ];

  let tIndex = 0;
  const tImg = document.getElementById('tImage');
  const tText = document.getElementById('tText');
  const tName = document.getElementById('tName');
  const tRole = document.getElementById('tRole');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');

  function showTestimonial(i) {
    const t = testimonials[i];
    tImg.src = t.image;
    tText.textContent = t.text;
    tName.textContent = t.name;
    tRole.textContent = t.role;
  }

  tPrev.addEventListener('click', () => {
    tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(tIndex);
  });

  tNext.addEventListener('click', () => {
    tIndex = (tIndex + 1) % testimonials.length;
    showTestimonial(tIndex);
  });

  setInterval(() => {
    tIndex = (tIndex + 1) % testimonials.length;
    showTestimonial(tIndex);
  }, 8000);

  showTestimonial(0);
}
