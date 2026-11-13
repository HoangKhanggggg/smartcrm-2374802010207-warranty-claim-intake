
# Sử dụng Node.js 22 để tương thích với các công cụ hiện tại
FROM node:22-alpine

WORKDIR /app

# Cài đặt dependencies phục vụ production
COPY package*.json ./
RUN npm ci --omit=dev

# Sao chép mã nguồn Backend
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Kiểm tra Backend có phản hồi HTTP hay không
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
CMD node -e "fetch('http://127.0.0.1:3001/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "start"]
