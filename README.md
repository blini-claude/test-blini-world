# test-blini-world

Hello World website built with React + Vite, served at [test.blini.world](http://test.blini.world).

## Stack

- **Frontend**: React + Vite
- **Host**: Proxmox LXC container (Ubuntu 22.04) — CT ID 102, IP `10.1.10.164`
- **Web server**: Nginx (serves the built `dist/`)
- **DNS**: Cloudflare — `test.blini.world` A record → `10.1.10.164`

## Development

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
# Copy dist/ contents to /var/www/html/ on the container
```
