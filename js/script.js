const global = {
  currentPage: window.location.pathname,
};

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
      console.log('Home');
      break;
  }
}

console.log(global.currentPage);
