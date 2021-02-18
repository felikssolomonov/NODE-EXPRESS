const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

document.querySelectorAll(".price").forEach((item) => {
  item.textContent = toCurrency(item.textContent);
});

document.querySelectorAll(".date").forEach((item) => {
  item.textContent = toDate(item.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
  $card.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csurf = event.target.dataset.csurf;
      fetch("/card/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csurf
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.courses.length) {
            const html = data.courses
              .map((item) => {
                return `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.count}</td>
                  <td>
                      <button class="btn btn-small js-remove" data-id="${item.id}">Remove</button>
                  </td>
                </tr>
              `;
              })
              .join("");
            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(data.price);
          } else {
            $card.innerHTML = "<p>Basket is empty<p>";
          }
        })
        .catch((err) => err);
    }
  });
}

M.Tabs.init(document.querySelectorAll(".tabs"));