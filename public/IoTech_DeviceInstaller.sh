
read -p "Bitte geben Sie den Port ein: " port


username="techbot"
sudo useradd -m $username
sudo usermod -aG sudo $username
echo "$username wurde erfolgreich erstellt und hat sudo-Rechte."


sudo -u $username mkdir -p /home/$username/script
echo "import socket

host = '0.0.0.0'
port = $port

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((host, port))
s.listen(5)

print('Listening on {}:{}'.format(host, port))

while True:
    client, addr = s.accept()
    print('Accepted connection from {}:{}'.format(addr[0], addr[1]))
    data = client.recv(1024)
    print('Received: {}'.format(data.decode()))
    client.close()" > /home/$username/script/listener.py


sudo ufw allow $port/tcp
echo "Port $port wurde erfolgreich in der Firewall freigeschaltet."


sudo ufw reload
echo "Die Firewall wurde neu geladen."


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


sudo systemctl enable python_listener.service
sudo systemctl start python_listener.service
echo "Der Python Listener Service wurde erstellt, aktiviert und gestartet."

echo "Das Skript wurde erfolgreich abgeschlossen."
