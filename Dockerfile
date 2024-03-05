FROM node:17-alpine

WORKDIR /usr/src/app 

COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=4000
EXPOSE $PORT
  
ENV MONGO_URI="mongodb+srv://arjunpchr:GjT5tF1fPAvmIdmE@zeecart.p4pvfgd.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
ENV TOKEN_KEY="dkdowi48903idisdsii"
ENV TOKEN_EXPIRY="365d"
ENV MAIL_HOST="smtp.gmail.com"
ENV MAIL_PORT=587
ENV MAIL_USER="zeecart46@gmail.com"  
ENV MAIL_PASSWORD="jiom wnle jvhz lzpq"
ENV MAIL_FROM="zeecart46@gmail.com"
ENV RAZORPAY_ID_KEY="rzp_test_idoVEAKqeG0jwu"   
ENV RAZORPAY_SECRET_KEY="oSM4kVun7kT8tdwxUyLEdV7g"

# required for Docker Desktop port mapping
CMD ["npm", "start"]