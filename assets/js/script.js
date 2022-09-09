// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

// STEP 1 - CHOOSE A FILE

const inputEl = document.querySelector(".uploader__input");
const summaryUl = document.querySelector(".panel__summary");
const totalPrice = document.querySelector(".order__total-price");
const ulEl = document.querySelector(".panel__excursions");
const propotypeBox = document.querySelector(".excursions__item--prototype");
const form = document.querySelector(".panel__order");
const list = document.querySelector(".panel__summary");
const noOfAdults = document.querySelectorAll("input[name='adults']");
const noOfChildren = document.querySelectorAll("input[name='children']");
let totalSum = 0;
const basket = [];
totalPrice.innerHTML = "";
inputEl.addEventListener("change", uploadFile);
ulEl.addEventListener("click", updateOrder);
list.addEventListener("click", removeLiOrder);
form.addEventListener("submit", sendOrder);

function uploadFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (readerEvent) {
      const content = readerEvent.target.result;
      createTripInfo(content);
    };
    reader.readAsText(file, "UTF-8");
  }
}

function createTripInfo(content) {
  const tripsArr = content.split(/[\r\n]+/gm);
  for (let i = 0; i < tripsArr.length; i++) {
    const trip = tripsArr[i].split('","');
    createTripBox(trip[1], trip[2], trip[3], trip[4]);
  }
  ulEl.removeChild(propotypeBox);
}

function fillBasket(title, adultNumber, adultPrice, childNumber, childPrice) {
  this.title = title;
  this.adultNumber = adultNumber;
  this.adultPrice = adultPrice;
  this.childNumber = childNumber;
  this.childPrice = childPrice;
}

function createTripBox(tripTitle, tripDescription, adultPrice, childPrice) {
  const createdTripBox = propotypeBox.cloneNode(true);
  createdTripBox.classList.remove("excursions__item--prototype");
  createdTripBox.querySelector("h2").innerText = tripTitle;
  createdTripBox.querySelector("p").innerText = tripDescription;
  createdTripBox.querySelector(".excursions__price--adult").innerText =
    adultPrice;
  createdTripBox.querySelector(".excursions__price--child").innerText =
    parseInt(childPrice);
  ulEl.appendChild(createdTripBox);
}

function updateOrder(event) {
  event.preventDefault();
  if (
    event.target.className ===
    "excursions__field-input excursions__field-input--submit"
  ) {
    const index = [
      ...document.querySelectorAll(".excursions__field-input--submit"),
    ].indexOf(event.target);

    updateBasket(index);
    addSummary(basket.length - 1);
    for (let i = 0; i < ulEl.children.length; i++) {
      changeTotalSum();
      updateAddedTrips(i, event.target);
    }
  }
}

function updateBasket(index) {
  const ulChild = document.querySelectorAll("li");
  const tripTitle = ulChild[index].querySelector("h2").innerText;
  const noOfAdults = ulChild[index].querySelector("input[name='adults']");
  const adultPrice = ulChild[index].querySelector(
    ".excursions__price--adult"
  ).innerText;
  const noOfChildren = ulChild[index].querySelector("input[name='children']");
  const childPrice = ulChild[index].querySelector(
    ".excursions__price--child"
  ).innerText;

  removeError(noOfAdults.nextElementSibling);
  removeError(noOfChildren.nextElementSibling);

  if (noOfAdults.value < 1 && noOfChildren.value < 1) {
    alert("Sprawdź czy liczba uczestników została wpisana poprawnie!");
  }
  if (isNaN(noOfAdults.value * 1)) {
    showError(noOfAdults.nextElementSibling, "Pole nalezy uzupełnić liczbą");
  }
  if (isNaN(noOfChildren.value * 1)) {
    showError(noOfChildren.nextElementSibling, "Pole nalezy uzupełnić liczbą");
  }
  if (
    !(noOfAdults.value < 1 && noOfChildren.value < 1) &&
    !isNaN(noOfAdults.value * 1) &&
    !isNaN(noOfChildren.value * 1)
  ) {
    const tripData = new fillBasket(
      tripTitle,
      noOfAdults.value * 1,
      adultPrice,
      noOfChildren.value * 1,
      childPrice
    );
    basket.push(tripData);
  }
}

function changeTotalSum() {
  priceForOneOptionArr = [];
  for (let i = 0; i < basket.length; i++) {
    let priceForOneOption =
      basket[i].adultNumber * basket[i].adultPrice +
      basket[i].childNumber * basket[i].childPrice;
    if (isNaN(priceForOneOption)) {
      priceForOneOption = 0;
    }
    priceForOneOptionArr.push(priceForOneOption);
    const sum = priceForOneOptionArr.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    totalSum = sum;
  }
  if (totalSum > 0 && basket.length > 0) {
    totalPrice.innerText = "Razem: " + totalSum + "PLN";
  } else {
    totalPrice.innerText = "";
  }
}

function addSummary(i) {
  clearUl(summaryUl, 4);
  const summaryLi = document.querySelector(".summary__item--prototype");
  if (basket[i]) {
    const createdLi = summaryLi.cloneNode(true);
    createdLi.classList.remove("summary__item--prototype");
    createdLi.querySelector("span").innerHTML = basket[i].title;
    createdLi.querySelector("strong").innerHTML =
      basket[i].adultNumber * basket[i].adultPrice +
      basket[i].childNumber * basket[i].childPrice +
      "PLN";
    createdLi.querySelector(
      "p"
    ).innerHTML = `dorośli: ${basket[i].adultNumber} x ${basket[i].adultPrice}PLN, dzieci: ${basket[i].childNumber} x ${basket[i].childPrice}PLN`;
    summaryUl.appendChild(createdLi);
  }
}

function clearUl(ul, nr) {
  while (ul.childNodes.length > nr) {
    ul.removeChild(ul.lastChild);
  }
}

function sendOrder(event) {
  event.preventDefault();
  const nameField = event.target.elements.name;
  const nameFieldText = document.querySelector(".order__error--name");
  const emailField = event.target.elements.email;
  const emailFieldText = document.querySelector(".order__error--email");

  if (nameField.value.length === 0) {
    showError(nameFieldText, "Pole nie zostało uzupełnione");
  } else {
    removeError(nameFieldText);
  }
  if (
    emailField.value.length < 1 ||
    (emailField.value.length > 1 && !emailField.value.includes("@"))
  ) {
    showError(emailFieldText, "Pole nie zostało poprawnie uzupełnione");
  } else {
    removeError(emailFieldText);
  }
  if (
    nameField.value.length > 0 &&
    emailField.value.length > 0 &&
    emailField.value.includes("@")
  ) {
    setTimeout(() => {
      alert(
        `Dziękujemy za złożenie zamówienia o wartości ${totalSum} PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: ${emailField.value}`
      );
      clearAll();
    }, "500");
  }
}

function showError(element, txt) {
  element.style.color = "#b11919";
  element.style.fontSize = "10px";
  element.style.fontWeight = "bold";
  element.innerHTML = txt;
}

function removeError(element) {
  element.removeAttribute("style");
  element.innerHTML = " ";
}

function removeLiOrder(event) {
  event.preventDefault();
  if (event.target && event.target.nodeName == "BUTTON") {
    event.target.parentNode.parentNode.remove();
    for (let i = 0; i < basket.length; i++) {
      if (
        event.target.previousElementSibling.previousElementSibling.innerText ==
        basket[i].title
      ) {
        basket.splice(i, 1);

        updateAddedTrips(
          i,
          document.querySelectorAll(".excursions__field-input--submit")[i]
        );
      }
    }
    changeTotalSum();
  }
}

function updateAddedTrips(i, eventTarget) {
  if (
    basket.find(
      (trip) =>
        trip.title ===
        eventTarget.parentElement.parentElement.previousElementSibling
          .firstElementChild.innerText
    )
  ) {
    eventTarget.disabled = true;
  } else {
    eventTarget.disabled = false;
  }
}

function clearAll() {
  const allInputs = document.querySelectorAll("input");
  for (let i = 0; i < allInputs.length; i++) {
    if (allInputs[i].type !== "submit") {
      allInputs[i].value = "";
    }
  }
  clearUl(ulEl, 1);
  clearUl(summaryUl, 1);
  totalPrice.innerHTML = "";
  updateAddedTrips(
    1,
    document.querySelectorAll(".excursions__field-input--submit")[1]
  );
  updateAddedTrips(
    2,
    document.querySelectorAll(".excursions__field-input--submit")[2]
  );
}
