const listTodo = [];
const events = "events";

const eventsSearch = "eventseacrh";
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    tambahTodo();
  });
  if (checkStorage()) {
    ambilDataStorage();
  }
  const searchbook = document.querySelector(".searchBook");
  searchbook.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });
  const clearSearch = document.querySelector(".clearsubmit");
  clearSearch.addEventListener("click", function (e) {
    e.preventDefault();
    document.dispatchEvent(new Event(events));
  });
});
function searchBook() {
  const caribuku = document.getElementById("search").value;
  const h3 = document.querySelectorAll(".container-list-book h3");

  for (let i = 0; i < listTodo.length; i++) {
    if (caribuku !== listTodo[i].title) {
      h3[i].parentNode.style.display = "none";
    }
  }
}

function tambahTodo() {
  const judulBuku = document.getElementById("judulBuku").value;
  const penulis = document.getElementById("penulis").value;
  const tahun = document.getElementById("tahun").value;
  const id = idAcak();
  const checkbox = document.querySelector(".checkbox").checked;

  const todoObject = generateTodo(judulBuku, penulis, tahun, id, checkbox);
  listTodo.push(todoObject);
  document.dispatchEvent(new Event(events));
  saveData();
}

function idAcak() {
  return +new Date();
}

document.addEventListener(events, function () {
  const belumsSelesaiDibaca = document.querySelector(".belum");
  belumsSelesaiDibaca.innerHTML = "";
  const SelesaiDibaca = document.querySelector(".sudah");
  SelesaiDibaca.innerHTML = "";

  for (item of listTodo) {
    const totoElement = buatTodo(item);
    if (item.isComplete === false) {
      belumsSelesaiDibaca.appendChild(totoElement);
    } else {
      SelesaiDibaca.appendChild(totoElement);
    }
  }
});

function buatTodo(make) {
  const div = document.createElement("div");
  div.setAttribute("class", "container-list-book");
  div.setAttribute("id", `${make.id}`);
  const h3 = document.createElement("h3");
  h3.innerHTML = make.title;

  const p1 = document.createElement("p");
  p1.innerHTML = `Penulis : ${make.author}`;

  const p2 = document.createElement("p");
  p2.innerHTML = `Tahun : ${make.year}`;

  const belumselesai = document.createElement("div");

  const hapus1 = document.createElement("div");
  hapus1.setAttribute("class", "hapus");
  hapus1.innerHTML = "Hapus Buku";
  if (make.isComplete) {
    belumselesai.setAttribute("class", "belumselesai");
    belumselesai.innerHTML = "Belum Selesai Dibaca";
  } else {
    belumselesai.setAttribute("class", "selesai");
    belumselesai.innerHTML = "Selesai Dibaca";
  }

  div.appendChild(h3);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(belumselesai);
  div.appendChild(hapus1);

  pengecekan(item, belumselesai, hapus1);

  return div;
}

function pengecekan(item, belumselesai, hapus1) {
  if (belumselesai.classList.contains("selesai")) {
    belumselesai.addEventListener("click", function () {
      complete(item.id);
    });
  } else if (belumselesai.classList.contains("belumselesai")) {
    belumselesai.addEventListener("click", function () {
      undoComplete(item.id);
    });
  }
  hapus1.addEventListener("click", function () {
    const tanya = confirm("Apakah anda yakin ingin menghapus buku?");
    if (tanya === true) {
      remove(item.id);
    }
  });
}

function remove(remove) {
  const todotarget = findlistindex(remove);
  listTodo.splice(todotarget, 1);
  document.dispatchEvent(new Event(events));

  saveData();
}

function findlistindex(id) {
  for (let index in listTodo) {
    if (listTodo[index].id === id) {
      return index;
    }
  }
}

function complete(sukses) {
  const status = findTodo(sukses);
  status.isComplete = true;
  document.dispatchEvent(new Event(events));
  saveData();
}

function undoComplete(undo) {
  const status = findTodo(undo);
  status.isComplete = false;
  document.dispatchEvent(new Event(events));
  saveData();
}

function findTodo(item) {
  for (let data of listTodo) {
    if (data.id === item) {
      return data;
    }
  }
}

function generateTodo(namaBuku, penulis, tahun, id, status) {
  return {
    id: id,
    title: namaBuku,
    author: penulis,
    year: tahun,
    isComplete: status,
  };
}

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function checkStorage() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (checkStorage()) {
    const ubahKeJSON = JSON.stringify(listTodo);
    localStorage.setItem(STORAGE_KEY, ubahKeJSON);
  }
}

function ambilDataStorage() {
  const ambilData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(ambilData);

  if (data !== null) {
    for (const todo of data) {
      listTodo.push(todo);
    }
  }

  document.dispatchEvent(new Event(events));
}
