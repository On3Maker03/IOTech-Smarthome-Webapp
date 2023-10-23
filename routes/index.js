const express = require('express');
const router = express.Router();
const db = require('../models/smarthomeConnect');
const bcrypt = require('bcrypt');
const path = require('path');

router.use(express.json());

const apkPath = path.join(__dirname, 'download/apk/IoTech.apk');
const shellPath = path.join(__dirname, 'download/shell/onboarding.sh');

//render index.ejs + hand over devices + redirect to login if not logged in
router.get('/', async (req, res) => {
  if (req.session.loggedIn) {
    try {
      const devices = await db.devices.findAll({
        attributes: ['id', 'deviceName', 'createdAt'],
      });
      res.render('index', { devices });
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
});

//render login 
router.get('/login', (req, res) => {
  res.render('login', {
    layout: false
  });
});

//render datenschutz
router.get('/datenschutz', (req, res) => {
  res.render('data-privacy.ejs');
});

//render app
router.get('/get-apk', (req, res) => {
  res.render('get-apk.ejs');
});

// download .apk File
router.get('/get-apk/download/', (req, res) => {
  res.download(apkPath);
});

//download shell
router.get('/get-onboarding/download', (req, res) => {
  res.download(shellPath);
});

//render Impressum
router.get('/impressum', (req, res) => {
  res.render('imprint.ejs');
});

//render PasswortGenerieren
router.get('/settings', (req, res) => {
  res.render('settings.ejs');
});

//render onboarding
router.get('/settings/onboarding', (req, res) => {
  res.render('addDevice.ejs');
});

//render onboarding
router.get('/settings/onboarding/success', (req, res) => {
  res.render('success.ejs');
});

//render bugBounty
router.get('/bugBounty', (req, res) => {
  res.render('bugBounty.ejs');
});

//render benachrichtigung + hand over devices
router.get('/benachrichtigungen', async (req, res) => {
  if (req.session.loggedIn) {
    try {
      const devices = await db.devices.findAll({
        attributes: ['id', 'deviceName', 'createdAt'],
      });
      res.render('notifications', { devices });
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
});

// Logout-Route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Fehler beim Zerstören der Sitzung:', err);
    }
    res.redirect('/login');
  });
});

// get port
router.post('/onboarding/get-port', async function (req, res) {


  let port = 1024;

  do {
    port = Math.floor(Math.random() * (65000 - 1024 + 1) + 1024);
  } while ( port === 1337 || port === 5555);

  res.json({ port });

});


// login logic
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.users.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden!' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      req.session.loggedIn = true;
      res.redirect('/');
      return;
    } else {
      return res.status(401).json({ message: 'Login-Daten ungültig' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Fehler beim Login' });
  }
});

//create temperature and humidity fetch API
router.get('/temperature', async (req, res) => {
  const { Op } = require('sequelize');
  const deviceId = req.query.deviceId;
  const zeitraum = req.query.zeitraum;

  try {
    const latestTemperature = await db.temperature.findOne({
      where: { deviceId },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['updatedAt'] },
    });

    const latestHumidity = await db.humidity.findOne({
      where: { deviceId },
      order: [['createdAt', 'DESC']],
    });

    let temperatureData;
    let humidityData;

    if (zeitraum && zeitraum !== 'all') {
      const now = new Date();
      const startTime = new Date(now - zeitraum * 60 * 1000);

      temperatureData = await db.temperature.findAll({
        where: {
          deviceId,
          createdAt: {
            [Op.gte]: startTime,
          },
        },
        attributes: ['createdAt', 'temperature'],
      });

      humidityData = await db.humidity.findAll({
        where: {
          deviceId,
          createdAt: {
            [Op.gte]: startTime,
          },
        },
        attributes: ['createdAt', 'humidity'],
      });
    } else {
      const now = new Date();

      temperatureData = await db.temperature.findAll({
        where: {
          deviceId,
        },
        attributes: ['createdAt', 'temperature'],
      });

      humidityData = await db.humidity.findAll({
        where: {
          deviceId,
        },
        attributes: ['createdAt', 'humidity'],
      });
    }

    const responseData = {
      latestData: {
        temperature: latestTemperature ? latestTemperature.temperature : null,
        humidity: latestHumidity ? latestHumidity.humidity : null,
      },
      temperatureData: temperatureData || [],
      humidityData: humidityData || [],
    };

    res.json(responseData);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    res.status(500).json({ error: 'Ein interner Fehler ist aufgetreten' });
  }
});

router.post('/hash-password', async function (req, res) {
  const { password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {

    if (err) {
      return res.status(500).json({ error: 'Fehler beim Hashen des Passworts' });
    }

    res.json({ hash });
  });
});

router.post('/update-password', async function (req, res) {
  const { username, hash } = req.body;

  let setData = await db.users.update(
    { password: hash },
    {
      where: {
        username: username
      }

    });

  if (setData) {
    return res.status(200).json('Das Passwort wurde erfolgreich gesetzt');
  }
});


router.post('/check-deviceName', async function (req, res) {
  const { deviceName } = req.body;

  console.log(deviceName)

  let proof = await db.devices.findOne({
    attributes: ['id', 'deviceName']
    ,
    where: {
      deviceName: deviceName
    }
  })

  console.log(proof)

  if (proof) {
    result = false
    return res.json({ result });
  } else {
    result = true
    return res.json({ result });
  }
});

//render addDevice + logic
router.post('/addDevice', async (req, res) => {
  const requestDeviceName = req.body.deviceName; // Beachten Sie, dass Sie das Feld "deviceName" aus dem Anfragekörper extrahieren müssen

  db.devices.findOne({
    where: {
      deviceName: requestDeviceName
    }
  }).then(async (foundDevice) => {
    if (foundDevice) {
      res.send("Das eingegebene Gerät existiert bereits!"); // Ändern Sie alert zu res.send, um die Meldung an den Client zu senden
    } else {
      const minPort = 1023;
      const maxPort = 65535;

      const randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;

      async function generateUniquePort(randomPort) {
        let isUnique = false;

        while (!isUnique) {
          randomPort = generateRandomPort();
          isUnique = !(await isPortInDatabase(randomPort));
        }

        return randomPort;
      }

      // Aufrufen der Hauptfunktion zur Generierung eines eindeutigen Ports
      generateUniquePort(randomPort)
        .then(async (uniquePort) => {
          try {
            const newDevice = await db.devices.create({
              deviceName: requestDeviceName,
              port: uniquePort
            });
            // Das neue Gerät wurde erfolgreich in die Datenbank eingefügt
            console.log('Neues Gerät wurde erstellt:', newDevice.toJSON());

            const popupWindow = window.open('', 'popupWindow', 'width=300,height=200');

            popupWindow.document.write(`
              <html>
                <head>
                  <title>Zufälliger Port</title>
                </head>
                <body>
                  <h1>Zufälliger Port: ${uniquePort}</h1>
                  <a href='/public/Iotech_DeviceInstaller' download>
                    <button>Download</button>
                  </a>
                </body>
              </html>
            `);
          } catch (error) {
            console.error('Fehler beim Erstellen des neuen Geräts:', error);
            res.status(500).send('Fehler beim Erstellen des neuen Geräts');
          }
        });
    }
  });
});




module.exports = router;

