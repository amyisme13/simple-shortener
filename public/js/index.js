/* global findById, store */

const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7);

const { hash: hashWithHash } = window.location;
const hash = hashWithHash.substring(1);
const redirectView = document.getElementById('redirectView');
const inputView = document.getElementById('inputView');
const shortenBtn = document.getElementById('shortenBtn');
const shortenInput = document.getElementById('shortenInput');

const displayRedirectView = (show = true) => {
  const rdrClasses = redirectView.className.split(' ');
  const isHiddenIndex = rdrClasses.indexOf('is-hidden');
  if (show && isHiddenIndex >= 0) {
    rdrClasses.splice(isHiddenIndex, 1);
  } else if (!show) {
    rdrClasses.push('is-hidden');
  }
  redirectView.className = rdrClasses.join(' ');
};

const displayInputView = (show = true) => {
  const inClasses = inputView.className.split(' ');
  const isHiddenIndex = inClasses.indexOf('is-hidden');
  if (show && isHiddenIndex >= 0) {
    inClasses.splice(isHiddenIndex, 1);
  } else if (!show) {
    inClasses.push('is-hidden');
  }
  inputView.className = inClasses.join(' ');
};

if (hash) {
  displayRedirectView();
  displayInputView(false);
  findById(hash)
    .then(url => {
      window.location = url.original;
    })
    .catch(err => console.log(err));
} else {
  shortenBtn.addEventListener('click', async () => {
    if (shortenInput.value) {
      shortenBtn.className += ' is-loading';
      const newUrl = {
        id: randomString(),
        original: shortenInput.value,
      };
      await store(newUrl);
      shortenInput.value = `${window.location.href}#${newUrl.id}`;
      shortenBtn.className = shortenBtn.className.replace(' is-loading', '');
    }
  });
}
