#!/bin/bash
sudo cp /home/patriot/nginx.conf /etc/nginx/nginx.conf
sudo cp /home/patriot/kasir.harmonylaundry.my.id /etc/nginx/sites-enabled/kasir.harmonylaundry.my.id
sudo cp /home/patriot/harmonylaundrys.com /etc/nginx/sites-enabled/harmonylaundrys.com
sudo nginx -t
sudo systemctl reload nginx
