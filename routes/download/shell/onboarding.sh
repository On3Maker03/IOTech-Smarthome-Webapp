#!/bin/bash
# Copyriright IoTech

# Schritt 1: Port abfragen
read -p "Bitte geben Sie den Port ein: " port

# Schritt 2: Nutzer "techbot" mit sudo-Rechten erstellen
username="techbot"
sudo useradd -m $username
sudo usermod -aG sudo $username
echo "$username wurde erfolgreich erstellt und hat sudo-Rechte."

# Schritt 3: Python-Listener-Skript in /home/techbot/script erstellen
sudo -u $username mkdir -p /home/$username/script
echo "import time
import board
import adafruit_dht
import socket
import ssl

HOST = 'dddrey.info'
PORT = $port
dhtDevice = adafruit_dht.DHT22(board.D4, use_pulseio=False)

def connect():
	print("Connecting...")
	global sock, wrappedSocket
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	wrappedSocket = ssl.create_default_context().wrap_socket(sock,server_hostname=HOST)
	wrappedSocket.connect((HOST, PORT))

while True:
	try:
		connect()
		temperature = dhtDevice.temperature
		humidity = dhtDevice.humidity
		print("temp:",temperature,"humid:",humidity)
		sock.sendall(str.encode(",".join([str(temperature), str(humidity)])))

	except RuntimeError as error:
		print(error.args[0])
		time.sleep(2)
		continue
	except Exception as error:
		print("Connection Error")
		wrappedSocket.close()
		time.sleep(5)
		continue
	time.sleep(10)"

# Schritt 4: Firewall am angegebenen Port freischalten
sudo ufw allow $port/tcp
echo "Port $port wurde erfolgreich in der Firewall freigeschaltet."

# Schritt 5: Firewall neu laden
sudo ufw reload
echo "Die Firewall wurde neu geladen."

# Schritt 6: Systemd-Service-Datei erstellen
sudo tee /etc/systemd/system/python_listener.service <<EOF
[Unit]
Description=Python Listener Service
After=network.target

[Service]
User=$username
ExecStart=/usr/bin/python3 /home/$username/script/listener.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Schritt 7: Systemd-Service aktivieren und starten
sudo systemctl enable python_listener.service
sudo systemctl start python_listener.service
echo "Der Python Listener Service wurde erstellt, aktiviert und gestartet."

echo "Das Skript wurde erfolgreich abgeschlossen."
