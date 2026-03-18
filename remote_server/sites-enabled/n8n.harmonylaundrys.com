map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
map $remote_addr $proxy_forwarded_elem {
    # IPv4 addresses can be sent as-is
    ~^[0-9.]+$ "for=$remote_addr";
    # IPv6 addresses need to be bracketed and quoted
    ~^[0-9A-Fa-f:.]+$ "for=\"[$remote_addr]\"";
    # Unix domain socket names cannot be represented in RFC 7239 syntax
    default "for=unknown";
}
map $http_forwarded $proxy_add_forwarded {
    # If the incoming Forwarded header is syntactically valid, append to it
    "~^(,[ \\t]*)*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*([ \\t]*,([ \\t]*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*)?)*$" "$http_forwarded, $proxy_forwarded_elem";
    # Otherwise, replace it
    default "$proxy_forwarded_elem";
}
server {
    listen 80;
    listen [::]:80;
    server_name n8n.harmonylaundrys.com;
    location /.well-known/acme-challenge {
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr:$remote_port;
        proxy_pass http://127.0.0.1:9180;
    }
}
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name n8n.harmonylaundrys.com;
    ssl_certificate /etc/nginx/ssl/n8n.harmonylaundrys.com_2048/fullchain.cer;
    ssl_certificate_key /etc/nginx/ssl/n8n.harmonylaundrys.com_2048/private.key;
    if ($host != $server_name) {
        return 404;
    }
    location /.well-known/acme-challenge {
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr:$remote_port;
        proxy_pass http://127.0.0.1:9180;
    }
    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 900s;
    }
}