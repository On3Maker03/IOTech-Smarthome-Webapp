const bcrypt = require("bcrypt")
const db = require("smarthomeConnect")

function setText() {

    var password = copyText.innerText || copyText.textContent;

    var conPassword = bcrypt.hash(password, 10)

    // Daten in die Datenbank einfügen
    var setData = db.users.update({
      user: "User584397912",
      password: conPassword
    })

      .then((bugReport) => {
        console.log("Passwort wurde erfolgreich eingefügt:", bugReport);
      })

    if (setData) {

      setButton.textContent = "Festgelegt"
      setButton.className = "btn btn-success"

    }

  }